'use client';

import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { libraries } from '@/constants';
import { AddressInput } from '@/components/AddressInput';
import { IanaTimeZones } from '@/ts/enums/enums';
import Map from './Map';
import { useAssignmentsContext } from '@/context/assignments';
import { TechnicianSummary } from './TechnicianSummary';
import { Assignment } from '@/ts/interfaces/Assignments';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';

const formSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  preferredDay: z.string()
});

type FormValues = z.infer<typeof formSchema>;

function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

interface TechnicianWeekdayColors {
  [technicianId: string]: {
    [weekday: string]: string;
  };
}

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const COOKIE_NAME = 'technician-weekday-colors';

function generateTechnicianWeekdayColors(technicianIds: string[]): TechnicianWeekdayColors {
  const colors: TechnicianWeekdayColors = {};
  
  technicianIds.forEach(techId => {
    colors[techId] = {};
    WEEKDAYS.forEach(day => {
      colors[techId][day] = generateRandomColor();
    });
  });
  
  return colors;
}

export default function RouteFinder() {
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadError, setLoadError] = useState<Error | undefined>();
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [currentColorScheme, setCurrentColorScheme] = useState<TechnicianWeekdayColors>(() => {
    // Initialize with stored colors or generate new ones
    const storedColors = Cookies.get(COOKIE_NAME);
    if (storedColors) {
      return JSON.parse(storedColors);
    }
    return {};
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      preferredDay: 'any'
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    // We'll implement this later
  };

  const handleAddressSelect = async (address: {
    fullAddress: string;
    state: string;
    city: string;
    zipCode: string;
    timezone: IanaTimeZones;
  }) => {
    // Get coordinates using Geocoding service
    const geocoder = new google.maps.Geocoder();
    const fullAddress = `${address.fullAddress}, ${address.city}, ${address.state} ${address.zipCode}`;
    
    try {
      const result = await geocoder.geocode({ address: fullAddress });
      if (result.results[0]?.geometry?.location) {
        setSelectedCoords({
          lat: result.results[0].geometry.location.lat(),
          lng: result.results[0].geometry.location.lng()
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  console.log('currentColorScheme ', currentColorScheme);

  const { allAssignments } = useAssignmentsContext();
  
  useEffect(() => {
    if (Object.keys(currentColorScheme).length > 0) return; // Skip if we already have colors

    const validAssignments = allAssignments.filter(a => a.assignmentToId);
    if (validAssignments.length === 0) return;

    const technicianIds = Array.from(new Set(validAssignments.map(a => a.assignmentToId)));
    const newColors = generateTechnicianWeekdayColors(technicianIds);
    
    Cookies.set(COOKIE_NAME, JSON.stringify(newColors), {
      expires: 30,
      path: '/'
    });
    setCurrentColorScheme(newColors);
  }, [allAssignments, currentColorScheme]);

  useEffect(() => {
    const assignmentsWithColors = allAssignments.map(assignment => {
      const weekday = new Date(assignment.startOn)
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase() as typeof WEEKDAYS[number];
      
      // Get the color from currentColorScheme, if not found generate a new one
      const color = currentColorScheme[assignment.assignmentToId]?.[weekday];
      
      return {
        ...assignment,
        // Don't generate random color as fallback, use the stored color or a default
        color: color || '#808080'
      };
    });
    setFilteredAssignments(assignmentsWithColors);
  }, [allAssignments, currentColorScheme]);

  const handleColorChange = (newColorScheme: TechnicianWeekdayColors) => {
    setCurrentColorScheme(newColorScheme);
  };

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
              <AddressInput
                name="address"
                label="Pool Address"
                placeholder="Enter pool address"
                onAddressSelect={handleAddressSelect}
              />
            </form>

            <TechnicianSummary 
              assignments={allAssignments}
              onFilterChange={setFilteredAssignments}
              onColorChange={handleColorChange}
              initialColorScheme={currentColorScheme}
            />
          </Form>
        </div>

        <div className="h-[600px] w-full lg:w-2/3">
          <Map
            assignments={filteredAssignments}
            newLocation={selectedCoords}
            isLoaded={isLoaded}
            loadError={loadError}
          />
        </div>
      </div>
    </div>
  );
} 
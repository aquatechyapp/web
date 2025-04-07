'use client';

import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';

const formSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  preferredDay: z.string()
});

type FormValues = z.infer<typeof formSchema>;

export default function RouteFinder() {
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<IanaTimeZones | null>(null);
  const [loadError, setLoadError] = useState<Error | undefined>();

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
    setSelectedState(address.state);
    setSelectedCity(address.city);
    setSelectedTimezone(address.timezone);
    
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

  const { allAssignments } = useAssignmentsContext();
  console.log(allAssignments);


  if (!isLoaded) return <LoadingSpinner />;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <AddressInput
                name="address"
                label="Pool Address"
                placeholder="Enter pool address"
                onAddressSelect={handleAddressSelect}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Day</label>
                <Select
                  value={form.watch('preferredDay')}
                  onValueChange={(value) => form.setValue('preferredDay', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any day</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Find Best Route
              </Button>
            </form>
          </Form>
        </div>

        <div className="h-[600px] w-full lg:w-2/3">
          <Map
            assignments={allAssignments}
            newLocation={selectedCoords}
            isLoaded={isLoaded}
            loadError={loadError}
          />
        </div>
      </div>
    </div>
  );
} 
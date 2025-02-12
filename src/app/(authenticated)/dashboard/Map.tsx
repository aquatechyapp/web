'use client';

import { DirectionsRenderer, GoogleMap, InfoBox, Marker } from '@react-google-maps/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Colors } from '@/constants/colors';
import { Assignment } from '@/ts/interfaces/Assignments';
import { useState } from 'react';
import { Typography } from '@/components/Typography';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type DirectionsResult = google.maps.DirectionsResult | null;

const mapContainerStyle = {
  width: '100%',
  height: '50vh',
  overflow: 'hidden',
  borderRadius: '8px'
};

const calculateMapCenter = (assignments: Assignment[]) => {
  const coords = assignments.map((assignment) => assignment.pool.coords);
  const avgLat = coords.reduce((sum, coord) => sum + coord.lat, 0) / coords.length;
  const avgLng = coords.reduce((sum, coord) => sum + coord.lng, 0) / coords.length;

  if (assignments.length === 0) {
    return {
      lat: 40.039444085342595,
      lng: -97.07113126266353
    };
  }

  return { lat: avgLat, lng: avgLng };
};

type Props = {
  assignments: Assignment[];
  isLoaded: boolean;
  loadError: Error | undefined;
};

const weekdayOptions: { [key: string]: { iconColor: string; textColor: string; label: string } } = {
  MONDAY: { iconColor: '#FF0000', textColor: '#FFFFFF', label: 'Monday' }, // Red
  TUESDAY: { iconColor: '#FFA500', textColor: '#FFFFFF', label: 'Tuesday' }, // Orange
  WEDNESDAY: { iconColor: '#FFE201', textColor: '#000000', label: 'Wednesday' }, // Yellow
  THURSDAY: { iconColor: '#008000', textColor: '#FFFFFF', label: 'Thursday' }, // Green
  FRIDAY: { iconColor: '#0000FF', textColor: '#FFFFFF', label: 'Friday' }, // Blue
  SATURDAY: { iconColor: '#4B0082', textColor: '#FFFFFF', label: 'Saturday' }, // Indigo
  SUNDAY: { iconColor: '#EE82EE', textColor: '#000000', label: 'Sunday' } // Violet
};

const Map = ({ assignments, isLoaded, loadError }: Props) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  const mapCenter = calculateMapCenter(assignments);

  return (
    <div className="h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={assignments.length === 0 ? 4 : 10}
        center={mapCenter}
        onClick={() => setSelectedAssignment(null)}
        options={{
          styles: [
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'all',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        <div>
          {assignments.map((assignment) => {
            const weekdayColor = weekdayOptions[assignment.weekday] || {
              iconColor: '#808080',
              textColor: '#000000'
            };

            return (
              <Marker
                onClick={() => setSelectedAssignment(assignment)}
                key={assignment.id}
                position={{
                  lat: assignment.pool.coords.lat,
                  lng: assignment.pool.coords.lng
                }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: weekdayColor.iconColor,
                  fillOpacity: 1,
                  scale: 10,
                  strokeColor: 'white',
                  strokeWeight: 1.5
                }}
              />
            );
          })}
        </div>
        {selectedAssignment && (
          <InfoBox
            position={
              new google.maps.LatLng(selectedAssignment.pool.coords.lat ?? 0, selectedAssignment.pool.coords.lng ?? 0)
            }
            options={{
              closeBoxURL: '',
              enableEventPropagation: true,
              maxWidth: 500
            }}
          >
            <div className="min-w-32 rounded-md bg-white p-2 px-3 shadow-md animate-in fade-in-0">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex flex-1 items-center justify-start gap-2">
                  <span
                    className="h-2 w-6 rounded-md"
                    style={{ backgroundColor: weekdayOptions[selectedAssignment.weekday].iconColor }}
                  />
                  <Typography element="h3" className="font-semibold">
                    {weekdayOptions[selectedAssignment.weekday].label}
                  </Typography>
                </div>
                <Button
                  variant="ghost"
                  className="h-auto w-auto rounded-full p-1"
                  onClick={() => setSelectedAssignment(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <Typography element="p" className="text-sm">
                  <span className="font-semibold">Owner </span>
                  {selectedAssignment.pool.name.trim().split('-')[0]}
                </Typography>
                <Typography element="p" className="text-sm">
                  <span className="font-semibold">Address </span>
                  {`${selectedAssignment.pool.address}, ${selectedAssignment.pool.city}, ${selectedAssignment.pool.zip}`}
                </Typography>
                <div>
                  <Typography element="p" className="text-sm font-semibold">
                    Hour
                  </Typography>
                  <Typography element="p" className="text-sm">
                    <span>Start </span>
                    {format(selectedAssignment.startOn, 'hh:mm a')}
                  </Typography>
                  <Typography element="p" className="text-sm">
                    <span>End </span> {format(selectedAssignment.endAfter, 'hh:mm a')}
                  </Typography>
                </div>
              </div>
            </div>
          </InfoBox>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;

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
import { Coords } from '@/ts/interfaces/Pool';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';
import { useUserStore } from '@/store/user';

interface AssignmentWithColor extends Assignment {
  color?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px'
};

const calculateMapCenter = (assignments: Assignment[], newLocation: Coords | null) => {
  if (newLocation) {
    return newLocation;
  }

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

interface MapProps {
  assignments: AssignmentWithColor[];
  newLocation: Coords | null;
  isLoaded: boolean;
  loadError: Error | undefined;
}

const Map = ({ assignments, newLocation, isLoaded, loadError }: MapProps) => {
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithColor | null>(null);
  
  const user = useUserStore((state) => state.user);
  const { data: members } = useGetMembersOfAllCompaniesByUserId(user.id);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  const mapCenter = calculateMapCenter(assignments, newLocation);

  return (
    <div className="relative h-full">

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
        {/* Existing assignments */}
        <div>
          {assignments
            .filter(assignment => assignment.color !== 'transparent')
            .map((assignment: AssignmentWithColor) => {
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
                    fillColor: assignment.color,
                    fillOpacity: 1,
                    scale: 10,
                    strokeColor: 'white',
                    strokeWeight: 1.5
                  }}
                />
              );
            })}
        </div>

        {/* New location marker */}
        {newLocation && (
          <Marker
            position={newLocation}
            icon={{
              path: 'M -2,-2 2,2 M 2,-2 -2,2', // X shape
              strokeColor: '#FF0000', // Bright red
              strokeWeight: 6, // Thicker lines
              scale: 6, // Bigger size
              strokeOpacity: 1
            }}
          />
        )}

        {/* Info window for selected assignment */}
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
            <div className="min-w-32 animate-in fade-in-0 rounded-md bg-white p-2 px-3 shadow-md">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex flex-1 items-center justify-start gap-2">
                  <span
                    className="h-2 w-6 rounded-md"
                    style={{ 
                      backgroundColor: selectedAssignment.color
                    }}
                  />
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
                  <span className="font-semibold">Technician </span>
                  {members?.find(m => m.id === selectedAssignment.assignmentToId)
                    ? `${members.find(m => m.id === selectedAssignment.assignmentToId)?.firstName} ${members.find(m => m.id === selectedAssignment.assignmentToId)?.lastName}`
                    : 'Unknown'
                  }
                </Typography>
                <Typography element="p" className="text-sm">
                  <span className="font-semibold">Client </span>
                  {selectedAssignment.pool.name.trim()}
                </Typography>
                <Typography element="p" className="text-sm">
                  <span className="font-semibold">Address </span>
                  {`${selectedAssignment.pool.address}, ${selectedAssignment.pool.city}, ${selectedAssignment.pool.zip}`}
                </Typography>
                <Typography element="p" className="text-sm">
                  <span className="font-semibold">Day </span>
                  {format(selectedAssignment.startOn, 'EEEE')}
                </Typography>
              </div>
            </div>
          </InfoBox>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map; 
'use client';

import { DirectionsRenderer, GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Separator } from '@/components/ui/separator';
import { Colors } from '@/constants/colors';
import { Assignment } from '@/interfaces/Assignments';

type DirectionsResult = google.maps.DirectionsResult | null;

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  borderRadius: '8px'
};
const center = {
  lat: 28.538337,
  lng: -81.379234
};

type Props = {
  assignments: Assignment[];
  directions: DirectionsResult | undefined;
  distance: string;
  duration: string;
  isLoaded: boolean;
  loadError: Error | undefined;
};

const Map = ({ assignments, directions, distance, duration, isLoaded, loadError }: Props) => {
  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full">
      <div className="absolute z-10 ml-2.5 mt-16 rounded-sm bg-gray-50 px-2 shadow-lg sm:right-24 sm:mt-2.5">
        <h3 className="py-1">Distance: {distance}</h3>
        <Separator />
        <h3 className="py-1">Duration: {duration}</h3>
      </div>

      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={7} center={center}>
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                zIndex: 50,
                strokeColor: Colors.blue[500],
                strokeWeight: 5
              }
            }}
          />
        )}
        <MarkerClusterer>
          {(clusterer) => (
            <div>
              {assignments.map((assignment) => (
                <Marker
                  label={{
                    text: assignment.order.toString(),
                    color: Colors.gray[50]
                  }}
                  key={assignment.id}
                  position={{
                    lat: assignment.pool.coords.lat,
                    lng: assignment.pool.coords.lng
                  }}
                  clusterer={clusterer}
                />
              ))}
            </div>
          )}
        </MarkerClusterer>
      </GoogleMap>
    </div>
  );
};

export default Map;

'use client';

import { DirectionsRenderer, GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Separator } from '@/components/ui/separator';
import { Colors } from '@/constants/colors';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Assignment } from '@/ts/interfaces/Assignments';

type DirectionsResult = google.maps.DirectionsResult | null;

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
  directions: DirectionsResult | undefined;
  distance: string;
  duration: string;
  isLoaded: boolean;
  loadError: Error | undefined;
};

const Map = ({ assignments, directions, distance, duration, isLoaded, loadError }: Props) => {
  const { width } = useWindowDimensions();

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  const mapCenter = calculateMapCenter(assignments);

  return width ? (
    <div className="h-full">
      <div className="absolute z-10 ml-2.5 mt-16 rounded-sm bg-gray-50 px-2 shadow-lg sm:right-24 sm:mt-2.5">
        <h3 className="py-1">Distance: {distance}</h3>
        <Separator />
        <h3 className="py-1">Duration: {duration}</h3>
      </div>

      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: width > 576 ? '100vh' : '50vh',
          overflow: 'hidden',
          borderRadius: '8px'
        }}
        zoom={assignments.length === 0 ? 4 : 10}
        center={mapCenter}
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
  ) : null;
};

export default Map;

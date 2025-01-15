'use client';

import { DirectionsRenderer, GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Separator } from '@/components/ui/separator';
import { Colors } from '@/constants/colors';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Assignment } from '@/ts/interfaces/Assignments';
import { Service } from '@/ts/interfaces/Service';
import { getInitials } from '@/utils/others';

type DirectionsResult = google.maps.DirectionsResult | null;

const calculateMapCenter = (services: Service[]) => {
  const coords = services.map((service) => service?.pool?.coords);
  const avgLat = coords.reduce((sum, coord) => sum + coord!.lat, 0) / coords.length;
  const avgLng = coords.reduce((sum, coord) => sum + coord!.lng, 0) / coords.length;

  if (services.length === 0) {
    return {
      lat: 40.039444085342595,
      lng: -97.07113126266353
    };
  }

  return { lat: avgLat, lng: avgLng };
};

type Props = {
  services: Service[];
  directions: DirectionsResult | undefined;
  distance: string;
  duration: string;
  isLoaded: boolean;
  loadError: Error | undefined;
};

const Map = ({ services, directions, distance, duration, isLoaded, loadError }: Props) => {
  const { width } = useWindowDimensions();

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  const mapCenter = calculateMapCenter(services);

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
        zoom={services.length === 0 ? 4 : 10}
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
              {services.map((service) => {
                const name = `${service.clientOwner.firstName} ${service.clientOwner.lastName}`;
                return (
                  <Marker
                    label={{
                      text: getInitials(name),
                      color: Colors.gray[50]
                    }}
                    key={service.id}
                    position={{
                      lat: service.pool!.coords.lat,
                      lng: service.pool!.coords.lng
                    }}
                    clusterer={clusterer}
                  />
                );
              })}
            </div>
          )}
        </MarkerClusterer>
      </GoogleMap>
    </div>
  ) : null;
};

export default Map;

'use client';

import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Colors } from '@/constants/colors';
import { Assignment } from '@/ts/interfaces/Assignments';

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
  directions: DirectionsResult | undefined;
  distance: string;
  duration: string;
  isLoaded: boolean;
  loadError: Error | undefined;
};

const weekdayColors: { [key: string]: { iconColor: string; textColor: string } } = {
  MONDAY: { iconColor: '#FF0000', textColor: '#FFFFFF' }, // Red
  TUESDAY: { iconColor: '#FFA500', textColor: '#FFFFFF' }, // Orange
  WEDNESDAY: { iconColor: '#FFE201', textColor: '#000000' }, // Yellow
  THURSDAY: { iconColor: '#008000', textColor: '#FFFFFF' }, // Green
  FRIDAY: { iconColor: '#0000FF', textColor: '#FFFFFF' }, // Blue
  SATURDAY: { iconColor: '#4B0082', textColor: '#FFFFFF' }, // Indigo
  SUNDAY: { iconColor: '#EE82EE', textColor: '#000000' } // Violet
};

const Map = ({ assignments, directions, isLoaded, loadError }: Props) => {
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
        {/* <MarkerClusterer> */}
        {/* {(clusterer) => ( */}
        <div>
          {assignments.map((assignment) => {
            const weekdayColor = weekdayColors[assignment.weekday] || {
              iconColor: '#808080',
              textColor: '#000000'
            };

            return (
              <Marker
                // label={{
                //   text: assignment.order.toString(),
                //   color: weekdayColor.textColor
                // }}
                key={assignment.id}
                position={{
                  lat: assignment.pool.coords.lat,
                  lng: assignment.pool.coords.lng
                }}
                // clusterer={clusterer}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE, // Custom circle marker
                  fillColor: weekdayColor.iconColor, // Default color if weekday not found

                  fillOpacity: 1,
                  scale: 16, // Size of the marker
                  strokeColor: 'white',
                  strokeWeight: 2
                }}
              />
            );
          })}
        </div>
        {/* )} */}
        {/* </MarkerClusterer> */}
      </GoogleMap>
    </div>
  );
};

export default Map;

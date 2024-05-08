'use client';

import {
  DirectionsRenderer,
  GoogleMap,
  Libraries,
  Marker,
  MarkerClusterer,
  useLoadScript
} from '@react-google-maps/api';
import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Separator } from '@/components/ui/separator';
import { Colors } from '@/constants/colors';
import { Assignment } from '@/interfaces/Assignments';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  borderRadius: '8px'
};
const center = {
  lat: 28.538336,
  lng: -81.379234
};

type DirectionsResult = google.maps.DirectionsResult | null;

const libraries: Libraries = ['places'];

const Map = ({ assignments }: { assignments: Assignment[] }) => {
  const [directions, setDirections] = useState<DirectionsResult>();
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDhW4IvM4Db-AmtZp9V2DuWN8XWHbcx-es',
    // googleMapsApiKey: 'AIzaSyDhW4IvM4Db-AmtZp9V2DuWN8XWHbcx-es',
    libraries
  });

  useEffect(() => {
    if (assignments.length <= 0 || !isLoaded) {
      setDirections(null);
      return;
    }
    const origin = assignments[0].pool.coords;
    const destination = assignments[assignments.length - 1].pool.coords;
    const service = new google.maps.DirectionsService();
    // create a waypoints constant that not contain the origin and destination and get only assignments.pool.coords
    const waypoints = assignments
      .filter((assignment, index) => index !== 0 && index !== assignments.length - 1)
      .map((assignment) => {
        return {
          location: assignment.pool.coords
        };
      });
    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);

          const totalDuration = result.routes[0].legs.reduce((acc, leg) => acc + (leg.duration?.value ?? 0), 0);
          const totalDistance = result.routes[0].legs.reduce((acc, leg) => acc + (leg.distance?.value ?? 0), 0);
          setDuration(
            (totalDuration / 60).toLocaleString('pt-br', {
              style: 'decimal',
              maximumSignificantDigits: 2
            }) + ' min'
          );
          setDistance((totalDistance * 0.000621371).toFixed(1) + ' mi');
        }
      }
    );
  }, [assignments, isLoaded]);

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

import { useLoadScript } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';

import { libraries } from '@/constants';
import { useServicesContext } from '@/context/services';

type DirectionsResult = google.maps.DirectionsResult | null;

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';

if (!googleMapsApiKey) {
  throw new Error('Missing GOOGLE_MAPS_API_KEY');
}

export function useMapServicesUtils() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries
  });
  const { services, setServices } = useServicesContext();

  const [directions, setDirections] = useState<DirectionsResult | undefined>();
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const getDirectionsFromGoogleMaps = useCallback(
    (optimizeWaypoints: boolean = false) => {
      if (!services || services.length === 0 || !isLoaded) {
        setDirections(null);
        setDistance('');
        setDuration('');
        return;
      }
      
      const origin = services[0].pool!.coords;
      const destination = services[services.length - 1].pool!.coords;
      const service = new google.maps.DirectionsService();
      // create a waypoints constant that not contain the origin and destination and get only assignments.pool.coords
      const waypoints = services
        .filter((service, index) => index !== 0 && index !== services.length - 1)
        .map((service) => {
          return {
            location: service.pool?.coords
          };
        });
      service.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints,
          optimizeWaypoints
        },
        (result, status) => {
          if (status === 'OK' && result) {

            const totalDuration = result.routes[0].legs.reduce((acc, leg) => acc + (leg.duration?.value ?? 0), 0);
            const totalDistance = result.routes[0].legs.reduce((acc, leg) => acc + (leg.distance?.value ?? 0), 0);


            setDirections(result);
            setDuration(
              (totalDuration / 60).toLocaleString('pt-br', {
                style: 'decimal',
                maximumSignificantDigits: 2
              }) + ' min'
            );
            setDistance((totalDistance * 0.000621371).toFixed(1) + ' mi');

            if (optimizeWaypoints) {
              const optimizedWaypoints = [
                services[0],
                ...result.routes[0].waypoint_order.map((index) => services[index + 1]),
                services[services.length - 1]
              ];
              // I need to change the order property of each assignment based on the optimizedWaypoints
              const changedOrderProperty = optimizedWaypoints.map((assignment, index) => {
                return { ...assignment, order: index + 1 };
              });
              setServices({
                ...changedOrderProperty
              });
            }
          }
        }
      );
    },
    [isLoaded, services, setServices]
  );

  // Removed useEffect that was calling getDirectionsFromGoogleMaps on first render
  // This prevents unnecessary API calls and reduces costs
  // Directions will only be fetched when explicitly called (e.g., on reorder)

  return {
    directions,
    distance,
    duration,
    getDirectionsFromGoogleMaps,
    isLoaded,
    loadError
  };
}

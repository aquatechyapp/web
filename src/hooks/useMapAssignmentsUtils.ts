import { useLoadScript } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';

import { libraries } from '@/constants';
import { useAssignmentsContext } from '@/context/assignments';
import { Coords } from '@/ts/interfaces/Pool';

type DirectionsResult = google.maps.DirectionsResult | null;

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';

if (!googleMapsApiKey) {
  throw new Error('Missing GOOGLE_MAPS_API_KEY');
}

export function useMapAssignmentsUtils() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries
  });

  const { assignments, setAssignments } = useAssignmentsContext();
  const { current } = assignments;

  const [directions, setDirections] = useState<DirectionsResult | undefined>();
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const getDirectionsFromGoogleMaps = useCallback(
    (
      optimizeWaypoints: boolean = false,
      originType: 'home' | 'first' = 'first',
      destinationType: 'home' | 'last' = 'last',
      userHomeCoords: Coords
    ) => {
      console.log('Received user home coords:', userHomeCoords);

      if (current.length <= 0 || !isLoaded) {
        setDirections(null);
        setDistance('');
        setDuration('');
        return;
      }

      const origin = originType === 'home' ? userHomeCoords : current[0].pool.coords;
      const destination = destinationType === 'home' ? userHomeCoords : current[current.length - 1].pool.coords;
      const service = new google.maps.DirectionsService();

      console.log('Final origin coords:', origin);
      console.log('Final destination coords:', destination);

      // Adjust waypoints based on origin and destination
      const waypoints = current
        .slice(originType === 'home' ? 0 : 1, destinationType === 'home' ? undefined : -1)
        .map((assignment) => ({
          location: assignment.pool.coords
        }));

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
              (totalDuration / 60).toLocaleString('en-US', {
                style: 'decimal',
                maximumSignificantDigits: 2
              }) + ' min'
            );
            setDistance((totalDistance * 0.000621371).toFixed(1) + ' mi');

            if (optimizeWaypoints) {
              let optimizedAssignments = [...current];
              if (originType === 'home') {
                optimizedAssignments = [...result.routes[0].waypoint_order.map((index) => current[index])];
              } else {
                optimizedAssignments = [
                  current[0],
                  ...result.routes[0].waypoint_order.map((index) => current[index + 1]),
                  ...(destinationType === 'last' ? [current[current.length - 1]] : [])
                ];
              }

              const changedOrderProperty = optimizedAssignments.map((assignment, index) => ({
                ...assignment,
                order: index + 1
              }));

              setAssignments({
                ...assignments,
                current: changedOrderProperty
              });
            }
          }
        }
      );
    },
    [assignments, current, isLoaded, setAssignments]
  );

  useEffect(() => {
    if (current.length > 0) {
      // Only run on initial load, not on every change
      const initialRun = sessionStorage.getItem('initialRouteLoad');
      if (!initialRun) {
        getDirectionsFromGoogleMaps(false, 'first', 'last', current[0].pool.coords);
        sessionStorage.setItem('initialRouteLoad', 'true');
      }
    }
  }, [current.length]); // Only depend on current.length

  return {
    directions,
    distance,
    duration,
    getDirectionsFromGoogleMaps,
    isLoaded,
    loadError
  };
}

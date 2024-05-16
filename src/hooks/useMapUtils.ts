import { Libraries, useLoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

import { useAssignmentsContext } from '@/context/assignments';

type DirectionsResult = google.maps.DirectionsResult | null;

const libraries: Libraries = ['places'];

export function useMapUtils() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDhW4IvM4Db-AmtZp9V2DuWN8XWHbcx-es',
    // googleMapsApiKey: 'AIzaSyDhW4IvM4Db-AmtZp9V2DuWN8XWHbcx-es',
    libraries
  });
  const { assignments, setAssignments } = useAssignmentsContext();

  const [directions, setDirections] = useState<DirectionsResult | undefined>();
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const { current } = assignments;

  function getDirectionsFromGoogleMaps(optimizeWaypoints: boolean = false) {
    if (current.length <= 0 || !isLoaded) {
      setDirections(null);
      return;
    }
    const origin = current[0].pool.coords;
    const destination = current[current.length - 1].pool.coords;
    const service = new google.maps.DirectionsService();
    // create a waypoints constant that not contain the origin and destination and get only assignments.pool.coords
    const waypoints = current
      .filter((assignment, index) => index !== 0 && index !== current.length - 1)
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
        waypoints,
        optimizeWaypoints
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
          if (optimizeWaypoints) {
            const optimizedWaypoints = [
              current[0],
              ...result.routes[0].waypoint_order.map((index) => current[index + 1]),
              current[current.length - 1]
            ];
            // I need to change the order property of each assignment based on the optimizedWaypoints
            const changedOrderProperty = optimizedWaypoints.map((assignment, index) => {
              return { ...assignment, order: index + 1 };
            });
            setAssignments({
              ...assignments,
              current: changedOrderProperty
            });
          }
        }
      }
    );
  }

  useEffect(() => {
    getDirectionsFromGoogleMaps();
  }, [current]);

  return {
    directions,
    distance,
    duration,
    getDirectionsFromGoogleMaps,
    isLoaded,
    loadError
  };
}

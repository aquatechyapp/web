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
      userHomeCoords: Coords,
      onComplete?: (updatedAssignments: typeof current) => void
    ) => {


      if (current.length <= 0 || !isLoaded) {
        setDirections(null);
        setDistance('');
        setDuration('');
        return;
      }

      const origin = originType === 'home' ? userHomeCoords : current[0].pool.coords;
      const destination = destinationType === 'home' ? userHomeCoords : current[current.length - 1].pool.coords;
      const service = new google.maps.DirectionsService();

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

            console.log('result ', result);

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

            // Map legs to assignments
            // Legs structure: 
            // - If origin is 'home': leg[0] = home -> assignment[0], leg[1] = assignment[0] -> assignment[1], etc.
            // - If origin is 'first': leg[0] = assignment[0] -> assignment[1], leg[1] = assignment[1] -> assignment[2], etc.
            const legs = result.routes[0].legs;
            const legOffset = originType === 'home' ? 1 : 0; // Skip first leg if it's from home
            
            // Determine which assignments to use (original or optimized order)
            let assignmentsToUpdate: typeof current;
            
            if (optimizeWaypoints) {
              // When waypoints are optimized, first reorder assignments based on waypoint_order
              // waypoint_order tells us the original indices of waypoints in their new optimized order
              // The legs array is already in the optimized route order
              if (originType === 'home') {
                assignmentsToUpdate = result.routes[0].waypoint_order.map((originalIndex) => current[originalIndex]);
              } else {
                assignmentsToUpdate = [
                  current[0],
                  ...result.routes[0].waypoint_order.map((originalIndex) => current[originalIndex + 1]),
                  ...(destinationType === 'last' ? [current[current.length - 1]] : [])
                ];
              }
            } else {
              // Use assignments in original order
              assignmentsToUpdate = current;
            }
            
            // Map legs to assignments (which may be in optimized order)
            const assignmentsWithLegs = assignmentsToUpdate.map((assignment, index) => {
              // The last assignment has no next stop (unless destination is home)
              const isLastAssignment = index === assignmentsToUpdate.length - 1;
              const shouldHaveNextStop = isLastAssignment ? destinationType === 'home' : true;
              
              if (shouldHaveNextStop && legs[index + legOffset]) {
                const leg = legs[index + legOffset];
                return {
                  ...assignment,
                  timeInMinutesToNextStop: leg.duration?.value ? leg.duration.value / 60 : null,
                  distanceInMilesToNextStop: leg.distance?.value ? leg.distance.value * 0.000621371 : null,
                  order: optimizeWaypoints ? index + 1 : assignment.order
                };
              } else {
                return {
                  ...assignment,
                  timeInMinutesToNextStop: null,
                  distanceInMilesToNextStop: null,
                  order: optimizeWaypoints ? index + 1 : assignment.order
                };
              }
            });

            setAssignments({
              ...assignments,
              current: assignmentsWithLegs
            });
            
            // Call the callback if provided, passing the updated assignments
            if (onComplete) {
              onComplete(assignmentsWithLegs);
            }
          }
        }
      );
    },
    [assignments, current, isLoaded, setAssignments]
  );

  const setBoundsAndZoom = useCallback(() => {
    setAssignments({
      ...assignments,
      current: assignments.current
    });
  }, [assignments, setAssignments]);

  const clearDirections = useCallback(() => {
    setDirections(null);
    setDistance('');
    setDuration('');
  }, []);

  // Removed useEffect that was calling getDirectionsFromGoogleMaps on first render
  // This prevents unnecessary API calls and reduces costs

  return {
    directions,
    distance,
    duration,
    getDirectionsFromGoogleMaps,
    setBoundsAndZoom,
    clearDirections,
    isLoaded,
    loadError
  };
}

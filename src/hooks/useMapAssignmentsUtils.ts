import { useLoadScript } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

import { libraries } from '@/constants';
import { useAssignmentsContext } from '@/context/assignments';
import { Coords } from '@/ts/interfaces/Pool';
import { getDirectionsForRoute as getGoogleDirections, optimizeRoute as optimizeGoogleRoute, RouteResult } from '@/services/google-maps';
import { getDirectionsForRoute as getMicrosoftDirections, optimizeRoute as optimizeMicrosoftRoute } from '@/services/microsoft-maps';

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
    async (
      optimizeWaypoints: boolean = false,
      originType: 'home' | 'first' = 'first',
      destinationType: 'home' | 'last' = 'last',
      userHomeCoords: Coords,
      onComplete?: (updatedAssignments: typeof current) => void
    ) => {
      if (current.length <= 0) {
        setDirections(null);
        setDistance('');
        setDuration('');
        return;
      }

      // Handle 'home' logic - convert to actual addresses
      const origin = originType === 'home' ? userHomeCoords : current[0].pool.coords;
      const destination = destinationType === 'home' ? userHomeCoords : current[current.length - 1].pool.coords;

      // Adjust waypoints based on origin and destination
      // If origin is 'first', exclude first assignment from waypoints
      // If destination is 'last', exclude last assignment from waypoints
      const waypoints = current
        .slice(originType === 'home' ? 0 : 1, destinationType === 'home' ? undefined : -1)
        .map((assignment) => assignment.pool.coords);

      // Calculate total number of stops (origin + waypoints + destination)
      // Google Maps supports up to 25 waypoints (27 total stops including origin and destination)
      // Microsoft Maps supports more waypoints, so use it when we have 27+ stops
      const totalStops = waypoints.length + 2; // +2 for origin and destination
      const shouldUseMicrosoftMaps = totalStops >= 27;
      const serviceLabel = shouldUseMicrosoftMaps ? 'Microsoft Maps' : 'Google Maps';

      // Google Maps requires the API to be loaded, but Microsoft Maps doesn't
      if (!shouldUseMicrosoftMaps && !isLoaded) {
        setDirections(null);
        setDistance('');
        setDuration('');
        return;
      }

      try {
        // Call the appropriate service function based on waypoint count
        const routeResult: RouteResult = optimizeWaypoints
          ? shouldUseMicrosoftMaps
            ? await optimizeMicrosoftRoute(origin, destination, waypoints)
            : await optimizeGoogleRoute(origin, destination, waypoints)
          : shouldUseMicrosoftMaps
            ? await getMicrosoftDirections(origin, destination, waypoints)
            : await getGoogleDirections(origin, destination, waypoints);

        console.log('[Assignments] Route service selected:', {
          service: serviceLabel,
          optimizeWaypoints,
          totalStops,
          waypointCount: waypoints.length
        });

        console.log('[Assignments] Route service result:', {
          service: serviceLabel,
          result: routeResult
        });

        // Update directions state
        setDirections(routeResult.directions);
        setDuration(
          routeResult.totalDuration.toLocaleString('en-US', {
            style: 'decimal',
            maximumSignificantDigits: 2
          }) + ' min'
        );
        setDistance(routeResult.totalDistance.toFixed(1) + ' mi');

        // Map legs to assignments
        // Legs structure:
        // - If origin is 'home': leg[0] = home -> assignment[0], leg[1] = assignment[0] -> assignment[1], etc.
        // - If origin is 'first': leg[0] = assignment[0] -> assignment[1], leg[1] = assignment[1] -> assignment[2], etc.
        const legOffset = originType === 'home' ? 1 : 0; // Skip first leg if it's from home

        // Determine which assignments to use (original or optimized order)
        let assignmentsToUpdate: typeof current;

        if (optimizeWaypoints && routeResult.waypointOrder) {
          // When waypoints are optimized, reorder assignments based on waypoint_order
          // waypoint_order tells us the original indices of waypoints in their new optimized order
          if (originType === 'home') {
            // All assignments are waypoints, so reorder all
            assignmentsToUpdate = routeResult.waypointOrder.map((originalIndex) => current[originalIndex]);
          } else {
            // First assignment is fixed, then waypoints, then possibly last assignment
            assignmentsToUpdate = [
              current[0],
              ...routeResult.waypointOrder.map((originalIndex) => current[originalIndex + 1]),
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

          if (shouldHaveNextStop && routeResult.legs[index + legOffset]) {
            const leg = routeResult.legs[index + legOffset];
            return {
              ...assignment,
              timeInMinutesToNextStop: leg.duration ? leg.timeInMinutes : null,
              distanceInMilesToNextStop: leg.distance ? leg.distanceInMiles : null,
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
      } catch (error) {
        console.error('Error getting directions:', error);
        setDirections(null);
        setDistance('');
        setDuration('');
      }
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

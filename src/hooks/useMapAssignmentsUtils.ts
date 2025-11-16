import { useLoadScript } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

import { libraries } from '@/constants';
import { useAssignmentsContext } from '@/context/assignments';
import { Coords } from '@/ts/interfaces/Pool';
import {
  getDirectionsAndTime as getHereDirections,
  getOptimizedRoute as getHereOptimizedRoute
} from '@/services/here-maps';
import type { HereRouteResult } from '@/ts/interfaces/HereMaps';

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

  type RouteOverrides = {
    assignments?: typeof current;
  };

  const getDirectionsFromHereMaps = useCallback(
    async (
      optimizeWaypoints: boolean = false,
      originType: 'home' | 'first' = 'first',
      destinationType: 'home' | 'last' = 'last',
      userHomeCoords: Coords,
      onComplete?: (updatedAssignments: typeof current) => void,
      overrides?: RouteOverrides
    ) => {
      const sourceAssignments = overrides?.assignments ?? current;

      if (sourceAssignments.length <= 0) {
        setDirections(null);
        setDistance('');
        setDuration('');
        return;
      }

      // Handle 'home' logic - convert to actual addresses
      const origin = originType === 'home' ? userHomeCoords : sourceAssignments[0].pool.coords;
      const destination =
        destinationType === 'home' ? userHomeCoords : sourceAssignments[sourceAssignments.length - 1].pool.coords;

      // Adjust waypoints based on origin and destination
      // If origin is 'first', exclude first assignment from waypoints
      // If destination is 'last', exclude last assignment from waypoints
      const waypoints = sourceAssignments
        .slice(originType === 'home' ? 0 : 1, destinationType === 'home' ? undefined : -1)
        .map((assignment) => assignment.pool.coords);

      // Google Maps needs to be loaded to render the map, even though routing comes from HERE
      if (!isLoaded) {
        setDirections(null);
        setDistance('');
        setDuration('');
        return;
      }

      try {
        // Call HERE Waypoints Sequence API for routing data
        const routeResult: HereRouteResult = optimizeWaypoints
          ? await getHereOptimizedRoute(origin, destination, waypoints)
          : await getHereDirections(origin, destination, waypoints);

        console.log('[Assignments] Route service selected:', {
          service: 'HERE Waypoints Sequence API',
          optimizeWaypoints,
          waypointCount: waypoints.length
        });

        console.log('[Assignments] Route service result:', {
          service: 'HERE Waypoints Sequence API',
          result: routeResult
        });

        // HERE doesn't return Google DirectionsResult, so clear DirectionsRenderer data
        setDirections(undefined);
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
            assignmentsToUpdate = routeResult.waypointOrder.map((originalIndex: number) => sourceAssignments[originalIndex]);
          } else {
            // First assignment is fixed, then waypoints, then possibly last assignment
            assignmentsToUpdate = [
              sourceAssignments[0],
              ...routeResult.waypointOrder.map((originalIndex) => sourceAssignments[originalIndex + 1]),
              ...(destinationType === 'last' ? [sourceAssignments[sourceAssignments.length - 1]] : [])
            ];
          }
        } else {
          // Use assignments in original order
          assignmentsToUpdate = sourceAssignments;
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
              timeInMinutesToNextStop: leg.timeInMinutes ?? null,
              distanceInMilesToNextStop: leg.distanceInMiles ?? null,
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

  // Removed useEffect that was calling getDirectionsFromHereMaps on first render
  // This prevents unnecessary API calls and reduces costs

  return {
    directions,
    distance,
    duration,
    getDirectionsFromHereMaps,
    setBoundsAndZoom,
    clearDirections,
    isLoaded,
    loadError
  };
}

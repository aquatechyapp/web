import { Coords } from '@/ts/interfaces/Pool';

export interface RouteLeg {
  distanceInMiles: number;
  timeInMinutes: number;
  distance: google.maps.Distance | null;
  duration: google.maps.Duration | null;
}

export interface RouteResult {
  directions: google.maps.DirectionsResult;
  legs: RouteLeg[];
  totalDistance: number; // in miles
  totalDuration: number; // in minutes
  waypointOrder?: number[]; // Only present when optimizeWaypoints is true
}

export interface GetDirectionsOptions {
  origin: Coords | string;
  destination: Coords | string;
  waypoints: Coords[];
  optimizeWaypoints: boolean;
}

/**
 * Gets directions from Google Maps API
 * @param options - Route configuration options
 * @returns Promise that resolves with route result or rejects with error
 */
export function getDirections(
  options: GetDirectionsOptions
): Promise<RouteResult> {
  return new Promise((resolve, reject) => {
    if (typeof google === 'undefined' || !google.maps?.DirectionsService) {
      reject(new Error('Google Maps API is not loaded'));
      return;
    }

    const service = new google.maps.DirectionsService();

    const waypoints = options.waypoints.map((waypoint) => ({
      location: waypoint
    }));

    service.route(
      {
        origin: options.origin,
        destination: options.destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints,
        optimizeWaypoints: options.optimizeWaypoints
      },
      (result, status) => {
        if (status === 'OK' && result) {
          const legs = result.routes[0].legs.map((leg) => ({
            distanceInMiles: leg.distance?.value ? leg.distance.value * 0.000621371 : 0,
            timeInMinutes: leg.duration?.value ? leg.duration.value / 60 : 0,
            distance: leg.distance || null,
            duration: leg.duration || null
          }));

          const totalDistance = legs.reduce((sum, leg) => sum + leg.distanceInMiles, 0);
          const totalDuration = legs.reduce((sum, leg) => sum + leg.timeInMinutes, 0);

          const routeResult: RouteResult = {
            directions: result,
            legs,
            totalDistance,
            totalDuration
          };

          // Include waypoint order if optimization was enabled
          if (options.optimizeWaypoints && result.routes[0].waypoint_order) {
            routeResult.waypointOrder = result.routes[0].waypoint_order;
          }

          resolve(routeResult);
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      }
    );
  });
}

/**
 * Gets directions for a route without optimizing waypoints
 * This is useful for getting distance/time data for a manually ordered route
 */
export function getDirectionsForRoute(
  origin: Coords | string,
  destination: Coords | string,
  waypoints: Coords[]
): Promise<RouteResult> {
  return getDirections({
    origin,
    destination,
    waypoints,
    optimizeWaypoints: false
  });
}

/**
 * Optimizes a route by reordering waypoints for the shortest path
 * Returns the optimized route with waypoint order information
 */
export function optimizeRoute(
  origin: Coords | string,
  destination: Coords | string,
  waypoints: Coords[]
): Promise<RouteResult> {
  return getDirections({
    origin,
    destination,
    waypoints,
    optimizeWaypoints: true
  });
}


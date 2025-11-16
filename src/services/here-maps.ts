import { Coords } from '@/ts/interfaces/Pool';
import { HereRouteResult } from '@/ts/interfaces/HereMaps';

type RouteRequestBody = {
  origin: Coords | string;
  destination: Coords | string;
  waypoints: Coords[];
  optimizeForTime: boolean;
};

async function requestHereRoute(body: RouteRequestBody): Promise<HereRouteResult> {
  const response = await fetch('/api/here-maps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = typeof errorData.error === 'string' ? errorData.error : response.statusText;
    throw new Error(message || 'HERE API proxy request failed');
  }

  return response.json();
}

/**
 * Gets directions and timing information from HERE Waypoints Sequence API without reordering stops.
 */
export function getDirectionsAndTime(
  origin: Coords | string,
  destination: Coords | string,
  waypoints: Coords[]
): Promise<HereRouteResult> {
  return requestHereRoute({
    origin,
    destination,
    waypoints,
    optimizeForTime: false
  });
}

/**
 * Optimizes waypoint order for the fastest (time-optimized) route using HERE Waypoints Sequence API.
 */
export function getOptimizedRoute(
  origin: Coords | string,
  destination: Coords | string,
  waypoints: Coords[]
): Promise<HereRouteResult> {
  return requestHereRoute({
    origin,
    destination,
    waypoints,
    optimizeForTime: true
  });
}



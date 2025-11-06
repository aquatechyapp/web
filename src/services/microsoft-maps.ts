import axios from 'axios';
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

// Microsoft Maps API response types (v2025-01-01)
// The API returns a FeatureCollection where each feature is a waypoint
interface MicrosoftWaypointFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    durationInSeconds?: number;
    distanceInMeters?: number;
    routePathPoint?: {
      legIndex: number;
      pointIndex: number;
    };
    travelMode?: string;
    instruction?: {
      formattedText?: string;
      maneuverType?: string;
      text?: string;
      drivingSide?: string;
    };
    address?: {
      countryRegion?: {
        ISO?: string;
      };
      adminDistricts?: Array<{
        shortName?: string;
      }>;
    };
    towardsRoadName?: string;
    steps?: Array<{
      maneuverType?: string;
      routePathRange?: {
        legIndex: number;
        range: [number, number];
      };
      names?: string[];
    }>;
    type?: string;
    order?: {
      inputIndex: number;
      optimizedIndex: number;
    };
  };
}

interface MicrosoftRouteResponse {
  type: 'FeatureCollection';
  features: MicrosoftWaypointFeature[];
}


/**
 * Converts Coords or string to GeoJSON Point feature for Microsoft Maps API
 * GeoJSON uses [longitude, latitude] format (not [lat, lng])
 */
function createWaypointFeature(
  coord: Coords | string,
  pointIndex: number
): {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    pointIndex: number;
  };
} {
  let longitude: number;
  let latitude: number;

  if (typeof coord === 'string') {
    const [lat, lon] = coord.split(',').map(Number);
    latitude = lat;
    longitude = lon;
  } else {
    latitude = coord.lat;
    longitude = coord.lng;
  }

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [longitude, latitude] // GeoJSON format: [lon, lat]
    },
    properties: {
      pointIndex
    }
  };
}

/**
 * Converts Microsoft Maps response to Google Maps compatible format
 * The response is a FeatureCollection where each feature represents a waypoint
 * with cumulative distance and duration from the origin
 */
function transformMicrosoftResponseToGoogle(
  microsoftResponse: MicrosoftRouteResponse,
  options: GetDirectionsOptions
): RouteResult {
  if (!microsoftResponse.features || microsoftResponse.features.length === 0) {
    throw new Error('No features found in Microsoft Maps response');
  }

  const features = microsoftResponse.features;
  
  // Sort features by their order (inputIndex or optimizedIndex)
  // If optimization was enabled, use optimizedIndex; otherwise use inputIndex
  const sortedFeatures = [...features].sort((a, b) => {
    const orderA = options.optimizeWaypoints 
      ? (a.properties.order?.optimizedIndex ?? a.properties.order?.inputIndex ?? 0)
      : (a.properties.order?.inputIndex ?? 0);
    const orderB = options.optimizeWaypoints
      ? (b.properties.order?.optimizedIndex ?? b.properties.order?.inputIndex ?? 0)
      : (b.properties.order?.inputIndex ?? 0);
    return orderA - orderB;
  });

  // Calculate legs: each leg is from one waypoint to the next
  // The first feature is the origin, last is the destination
  // We need to calculate the difference between consecutive waypoints
  const legs: RouteLeg[] = [];
  
  for (let i = 0; i < sortedFeatures.length - 1; i++) {
    const currentFeature = sortedFeatures[i];
    const nextFeature = sortedFeatures[i + 1];
    
    // Get cumulative values from each waypoint
    // These should be cumulative from the origin (first waypoint should have 0 or undefined)
    const currentDistance = currentFeature.properties.distanceInMeters ?? 0;
    const currentDuration = currentFeature.properties.durationInSeconds ?? 0;
    const nextDistance = nextFeature.properties.distanceInMeters ?? 0;
    const nextDuration = nextFeature.properties.durationInSeconds ?? 0;
    
    // Calculate leg distance and duration as the difference
    // Ensure non-negative values (safeguard against malformed data)
    const legDistanceInMeters = Math.max(0, nextDistance - currentDistance);
    const legDurationInSeconds = Math.max(0, nextDuration - currentDuration);
    
    // Create Google Maps compatible distance object (value is in meters)
    const distance: google.maps.Distance = {
      text: `${(legDistanceInMeters * 0.000621371).toFixed(2)} mi`,
      value: legDistanceInMeters
    };

    // Create Google Maps compatible duration object (value is in seconds)
    const duration: google.maps.Duration = {
      text: `${Math.round(legDurationInSeconds / 60)} min`,
      value: legDurationInSeconds
    };

    legs.push({
      distanceInMiles: distance.value ? distance.value * 0.000621371 : 0,
      timeInMinutes: duration.value ? duration.value / 60 : 0,
      distance: distance.value ? distance : null,
      duration: duration.value ? duration : null
    });
  }

  const totalDistance = legs.reduce((sum, leg) => sum + leg.distanceInMiles, 0);
  const totalDuration = legs.reduce((sum, leg) => sum + leg.timeInMinutes, 0);

  // Extract optimized waypoint order if available
  // waypointOrder should only include waypoints (exclude origin at index 0 and destination at last index)
  // Google Maps waypointOrder is 0-based indices relative to the waypoints array (not including origin/destination)
  let waypointOrder: number[] | undefined;
  if (options.optimizeWaypoints) {
    // Get waypoints only (exclude origin and destination)
    // Origin is at index 0, waypoints are at indices 1..n, destination is at index n+1
    const waypointFeatures = sortedFeatures.slice(1, -1); // Exclude first (origin) and last (destination)
    if (waypointFeatures.length > 0 && waypointFeatures[0].properties.order) {
      // Sort by optimizedIndex to get the optimized visit order
      const sortedByOptimized = [...waypointFeatures].sort((a, b) => {
        const orderA = a.properties.order?.optimizedIndex ?? a.properties.order?.inputIndex ?? 0;
        const orderB = b.properties.order?.optimizedIndex ?? b.properties.order?.inputIndex ?? 0;
        return orderA - orderB;
      });
      
      // Map optimized order back to original waypoint indices
      // inputIndex: 0=origin, 1=first waypoint, 2=second waypoint, ..., n+1=destination
      // waypointOrder: [0, 1, 2, ...] where each number is the index in the original waypoints array
      waypointOrder = sortedByOptimized.map((feature) => {
        const inputIndex = feature.properties.order?.inputIndex ?? 0;
        // inputIndex - 1 because origin is at inputIndex 0, first waypoint is at 1, etc.
        return inputIndex - 1;
      });
    }
  }

  // Create a Google Maps compatible directions result structure
  const directions = {
    routes: [
      {
        summary: '',
        legs: legs.map((leg) => ({
          distance: leg.distance,
          duration: leg.duration,
          start_address: '',
          end_address: '',
          start_location: {} as google.maps.LatLng,
          end_location: {} as google.maps.LatLng,
          steps: [],
          traffic_speed_entry: [],
          via_waypoints: []
        })),
        waypoint_order: waypointOrder,
        overview_polyline: {
          points: ''
        },
        bounds: {} as google.maps.LatLngBounds,
        copyrights: 'Microsoft Maps',
        warnings: [],
        overview_path: []
      }
    ],
    request: {
      origin: options.origin,
      destination: options.destination,
      waypoints: options.waypoints.map((wp) => ({ location: wp })),
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: options.optimizeWaypoints
    } as google.maps.DirectionsRequest,
    status: google.maps.DirectionsStatus.OK
  } as unknown as google.maps.DirectionsResult;

  const routeResult: RouteResult = {
    directions,
    legs,
    totalDistance,
    totalDuration
  };

  // Include waypoint order if optimization was enabled
  if (options.optimizeWaypoints && waypointOrder && waypointOrder.length > 0) {
    routeResult.waypointOrder = waypointOrder;
  }

  return routeResult;
}

/**
 * Gets directions from Microsoft Maps API
 * @param options - Route configuration options
 * @returns Promise that resolves with route result or rejects with error
 */
export function getDirections(
  options: GetDirectionsOptions
): Promise<RouteResult> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_MICROSOFT_MAPS_API_KEY;
        
        if (!apiKey) {
          reject(new Error('Microsoft Maps API key is not configured'));
          return;
        }

        const baseUrl = 'https://atlas.microsoft.com/route/directions';
        const apiVersion = '2025-01-01';

        // Build features array: origin (index 0) + waypoints (indices 1..n) + destination (index n+1)
        const features = [
          createWaypointFeature(options.origin, 0),
          ...options.waypoints.map((wp, idx) => createWaypointFeature(wp, idx + 1)),
          createWaypointFeature(options.destination, options.waypoints.length + 1)
        ];

        // Prepare request body in GeoJSON FeatureCollection format
        // According to Microsoft Maps API v2025-01-01 documentation
        const requestBody = {
          type: 'FeatureCollection',
          features,
          travelMode: 'driving',
          optimizeWaypointOrder: options.optimizeWaypoints,
          optimizeRoute: 'fastestWithoutTraffic',
          routeOutputOptions: ['routePath', 'itinerary']
        };

        // Make API call
        const response = await axios.post<MicrosoftRouteResponse>(
          baseUrl,
          requestBody,
          {
            params: {
              'api-version': apiVersion,
              'subscription-key': apiKey
            },
            headers: {
              'Content-Type': 'application/geo+json',
              'Accept-Language': 'en-US'
            }
          }
        );

        if (response.data && response.data.features && response.data.features.length > 0) {
          const routeResult = transformMicrosoftResponseToGoogle(response.data, options);
          resolve(routeResult);
        } else {
          reject(new Error('No features found in Microsoft Maps response'));
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error?.message || error.message;
          reject(new Error(`Microsoft Maps API request failed: ${errorMessage}`));
        } else {
          reject(new Error(`Microsoft Maps API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      }
    })();
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


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
    pointIndex?: number;
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

  if (!features.length) {
    throw new Error('No waypoint or itinerary data found in Microsoft Maps response');
  }

  const legCount = Math.max(1, options.waypoints.length + 1);

  const routePathFeatures = [...features]
    .filter((feature) => typeof feature.properties?.routePathPoint?.legIndex === 'number')
    .sort((a, b) => {
      const legA = a.properties?.routePathPoint?.legIndex ?? 0;
      const legB = b.properties?.routePathPoint?.legIndex ?? 0;
      if (legA !== legB) {
        return legA - legB;
      }
      const pointA = a.properties?.routePathPoint?.pointIndex ?? 0;
      const pointB = b.properties?.routePathPoint?.pointIndex ?? 0;
      return pointA - pointB;
    });

  type LegSegmentAccumulator = {
    sumDistance: number;
    sumDuration: number;
    firstDistance?: number;
    lastDistance?: number;
    firstDuration?: number;
    lastDuration?: number;
    previousDistance?: number;
    previousDuration?: number;
  };

  const legSegmentStats: LegSegmentAccumulator[] = Array.from({ length: legCount }, () => ({
    sumDistance: 0,
    sumDuration: 0
  }));

  routePathFeatures.forEach((feature) => {
    const properties = feature.properties;
    if (!properties) {
      return;
    }
    const legIndex = properties.routePathPoint?.legIndex;
    if (typeof legIndex !== 'number' || legIndex < 0 || legIndex >= legCount) {
      return;
    }

    const accumulator = legSegmentStats[legIndex];

    const distanceInMeters = properties.distanceInMeters;
    if (typeof distanceInMeters === 'number') {
      if (accumulator.firstDistance === undefined) {
        accumulator.firstDistance = distanceInMeters;
      }
      if (typeof accumulator.previousDistance === 'number') {
        const delta = distanceInMeters - accumulator.previousDistance;
        if (Number.isFinite(delta) && delta > 0) {
          accumulator.sumDistance += delta;
        }
      }
      accumulator.lastDistance = distanceInMeters;
      accumulator.previousDistance = distanceInMeters;
    }

    const durationInSeconds = properties.durationInSeconds;
    if (typeof durationInSeconds === 'number') {
      if (accumulator.firstDuration === undefined) {
        accumulator.firstDuration = durationInSeconds;
      }
      if (typeof accumulator.previousDuration === 'number') {
        const delta = durationInSeconds - accumulator.previousDuration;
        if (Number.isFinite(delta) && delta > 0) {
          accumulator.sumDuration += delta;
        }
      }
      accumulator.lastDuration = durationInSeconds;
      accumulator.previousDuration = durationInSeconds;
    }
  });

  const expectedStopCount = options.waypoints.length + 2;
  const stopFeatureByInputIndex = new Map<number, MicrosoftWaypointFeature>();

  features.forEach((feature) => {
    const properties = feature.properties;
    if (!properties) {
      return;
    }

    const pointIndex =
      typeof properties.pointIndex === 'number' ? properties.pointIndex : undefined;
    const inputIndex =
      typeof properties.order?.inputIndex === 'number' ? properties.order.inputIndex : undefined;

    const typeString = properties.type?.toLowerCase();
    const isStopType = typeString === 'waypoint' || typeString === 'stop';
    const candidateIndex = pointIndex ?? inputIndex;

    if (
      candidateIndex === undefined ||
      candidateIndex < 0 ||
      candidateIndex >= expectedStopCount
    ) {
      return;
    }

    if (!stopFeatureByInputIndex.has(candidateIndex) || pointIndex !== undefined || isStopType) {
      stopFeatureByInputIndex.set(candidateIndex, feature);
    }
  });

  const getRouteOrder = (entry: [number, MicrosoftWaypointFeature]): number => {
    const [inputIndex, feature] = entry;
    const properties = feature.properties ?? {};
    if (inputIndex === 0) {
      return 0;
    }
    if (inputIndex === expectedStopCount - 1) {
      return expectedStopCount - 1;
    }
    if (options.optimizeWaypoints) {
      const optimizedIndex = properties.order?.optimizedIndex;
      if (typeof optimizedIndex === 'number') {
        return optimizedIndex + 1;
      }
    }
    const orderInputIndex = properties.order?.inputIndex;
    if (typeof orderInputIndex === 'number') {
      return orderInputIndex;
    }
    return inputIndex;
  };

  const parseCoordinate = (coord: Coords | string | undefined) => {
    if (!coord) {
      return undefined;
    }
    if (typeof coord === 'string') {
      const [latString, lngString] = coord.split(',').map((value) => value.trim());
      const lat = Number(latString);
      const lng = Number(lngString);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
      return undefined;
    }
    const { lat, lng } = coord;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
    return undefined;
  };

  const getFallbackCoordinatesForInputIndex = (inputIndex: number) => {
    if (inputIndex === 0) {
      return parseCoordinate(options.origin);
    }
    if (inputIndex === expectedStopCount - 1) {
      return parseCoordinate(options.destination);
    }
    const waypoint = options.waypoints[inputIndex - 1];
    return parseCoordinate(waypoint);
  };

  function toGoogleLatLng(literal: google.maps.LatLngLiteral): google.maps.LatLng {
    if (
      typeof window !== 'undefined' &&
      typeof google !== 'undefined' &&
      google.maps &&
      typeof google.maps.LatLng === 'function'
    ) {
      return new google.maps.LatLng(literal.lat, literal.lng);
    }
    return literal as unknown as google.maps.LatLng;
  }

  let orderedStopEntries = Array.from(stopFeatureByInputIndex.entries()).sort(
    (a, b) => getRouteOrder(a) - getRouteOrder(b)
  );

  if (orderedStopEntries.length !== expectedStopCount) {
    const missingIndices: number[] = [];
    for (let idx = 0; idx < expectedStopCount; idx += 1) {
      if (!stopFeatureByInputIndex.has(idx)) {
        missingIndices.push(idx);
      }
    }

    missingIndices.forEach((inputIndex) => {
      const fallbackCoords = getFallbackCoordinatesForInputIndex(inputIndex);
      if (!fallbackCoords) {
        return;
      }

      const syntheticFeature: MicrosoftWaypointFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [fallbackCoords.lng, fallbackCoords.lat]
        },
        properties: {
          pointIndex: inputIndex,
          type: 'stop',
          order: {
            inputIndex,
            optimizedIndex:
              inputIndex === 0 || inputIndex === expectedStopCount - 1
                ? inputIndex
                : inputIndex - 1
          }
        }
      };

      stopFeatureByInputIndex.set(inputIndex, syntheticFeature);
      orderedStopEntries.push([inputIndex, syntheticFeature]);
    });

    orderedStopEntries = orderedStopEntries.sort((a, b) => getRouteOrder(a) - getRouteOrder(b));
  }

  const stopEntriesInRouteOrder = orderedStopEntries.map(
    ([inputIndex, feature]): { inputIndex: number; feature: MicrosoftWaypointFeature | undefined } => ({
      inputIndex,
      feature
    })
  );

  const stopCumulativeByRouteOrder = stopEntriesInRouteOrder.map(({ feature }) => {
    const properties = feature?.properties ?? {};
    return {
      distance:
        typeof properties.distanceInMeters === 'number' ? properties.distanceInMeters : undefined,
      duration:
        typeof properties.durationInSeconds === 'number'
          ? properties.durationInSeconds
          : undefined
    };
  });

  const MILES_PER_METER = 0.000621371;
  const SECONDS_PER_MINUTE = 60;

  const legs: RouteLeg[] = [];
  let totalDistance = 0;
  let totalDuration = 0;

  for (let legIndex = 0; legIndex < legCount; legIndex += 1) {
    const segmentStats = legSegmentStats[legIndex];

    let distanceInMeters = segmentStats?.sumDistance ?? 0;
    if (distanceInMeters <= 0 && segmentStats) {
      const { firstDistance, lastDistance } = segmentStats;
      if (typeof firstDistance === 'number' && typeof lastDistance === 'number') {
        const delta = lastDistance - firstDistance;
        if (Number.isFinite(delta) && delta > 0) {
          distanceInMeters = delta;
        }
      }
    }

    let durationInSeconds = segmentStats?.sumDuration ?? 0;
    if (durationInSeconds <= 0 && segmentStats) {
      const { firstDuration, lastDuration } = segmentStats;
      if (typeof firstDuration === 'number' && typeof lastDuration === 'number') {
        const delta = lastDuration - firstDuration;
        if (Number.isFinite(delta) && delta > 0) {
          durationInSeconds = delta;
        }
      }
    }

    const startStop = stopCumulativeByRouteOrder[legIndex];
    const endStop = stopCumulativeByRouteOrder[legIndex + 1];

    if (
      (!distanceInMeters || distanceInMeters === 0) &&
      startStop &&
      endStop &&
      typeof startStop.distance === 'number' &&
      typeof endStop.distance === 'number'
    ) {
      distanceInMeters = Math.max(0, endStop.distance - startStop.distance);
    }

    if (
      (!durationInSeconds || durationInSeconds === 0) &&
      startStop &&
      endStop &&
      typeof startStop.duration === 'number' &&
      typeof endStop.duration === 'number'
    ) {
      durationInSeconds = Math.max(0, endStop.duration - startStop.duration);
    }

    const distanceInMiles = distanceInMeters * MILES_PER_METER;
    const timeInMinutes = durationInSeconds / SECONDS_PER_MINUTE;

    const distance: google.maps.Distance | null =
      distanceInMeters > 0
        ? {
            text: `${distanceInMiles.toFixed(2)} mi`,
            value: distanceInMeters
          }
        : null;

    const duration: google.maps.Duration | null =
      durationInSeconds > 0
        ? {
            text: `${Math.round(timeInMinutes)} min`,
            value: durationInSeconds
          }
        : null;

    legs.push({
      distanceInMiles,
      timeInMinutes,
      distance,
      duration
    });

    totalDistance += distanceInMiles;
    totalDuration += timeInMinutes;
  }

  let waypointOrder: number[] | undefined;
  if (options.optimizeWaypoints) {
    const waypointEntries = Array.from(stopFeatureByInputIndex.entries())
      .filter(([inputIndex]) => inputIndex > 0 && inputIndex < expectedStopCount - 1)
      .map(([inputIndex, feature]) => {
        const optimizedIndex = feature.properties?.order?.optimizedIndex;
        return {
          inputIndex,
          optimizedIndex: typeof optimizedIndex === 'number' ? optimizedIndex : inputIndex - 1
        };
      })
      .sort((a, b) => a.optimizedIndex - b.optimizedIndex);

    if (waypointEntries.length === options.waypoints.length) {
      waypointOrder = waypointEntries.map((entry) => entry.inputIndex - 1);
    }
  }

  const stopInputIndicesInRouteOrder =
    options.optimizeWaypoints && waypointOrder && waypointOrder.length === options.waypoints.length
      ? [0, ...waypointOrder.map((index) => index + 1), expectedStopCount - 1]
      : stopEntriesInRouteOrder.map((entry) => entry.inputIndex);

  const stopLocations = stopInputIndicesInRouteOrder.map((inputIndex, orderIndex) => {
    const feature = stopFeatureByInputIndex.get(inputIndex);
    const coordinates = feature?.geometry?.coordinates;
    const featureLat =
      Array.isArray(coordinates) && coordinates.length >= 2 ? coordinates[1] : undefined;
    const featureLng =
      Array.isArray(coordinates) && coordinates.length >= 2 ? coordinates[0] : undefined;

    let lat = typeof featureLat === 'number' && Number.isFinite(featureLat) ? featureLat : undefined;
    let lng = typeof featureLng === 'number' && Number.isFinite(featureLng) ? featureLng : undefined;

    if (lat === undefined || lng === undefined) {
      const fallback = getFallbackCoordinatesForInputIndex(inputIndex);
      if (fallback) {
        lat = fallback.lat;
        lng = fallback.lng;
      }
    }

    if (lat === undefined || lng === undefined) {
      throw new Error(`Could not resolve coordinates for stop at route order ${orderIndex}`);
    }

    return { lat, lng };
  });

  const computeBoundsLiteral = (locations: google.maps.LatLngLiteral[]) => {
    if (locations.length === 0) {
      throw new Error('No stop locations available to compute bounds');
    }
    return locations.reduce(
      (bounds, location) => {
        const south = Math.min(bounds.south, location.lat);
        const west = Math.min(bounds.west, location.lng);
        const north = Math.max(bounds.north, location.lat);
        const east = Math.max(bounds.east, location.lng);
        return { south, west, north, east };
      },
      {
        south: locations[0].lat,
        west: locations[0].lng,
        north: locations[0].lat,
        east: locations[0].lng
      }
    );
  };

  const boundsLiteral = computeBoundsLiteral(stopLocations);

  const hasGoogleLatLngBounds =
    typeof window !== 'undefined' &&
    typeof google !== 'undefined' &&
    google.maps &&
    typeof google.maps.LatLngBounds === 'function';

  const boundsForDirections: google.maps.LatLngBounds =
    hasGoogleLatLngBounds
      ? (() => {
          const googleBounds = new google.maps.LatLngBounds();
          stopLocations.forEach((location) => {
            googleBounds.extend(toGoogleLatLng(location));
          });
          return googleBounds;
        })()
      : ({
          south: boundsLiteral.south,
          west: boundsLiteral.west,
          north: boundsLiteral.north,
          east: boundsLiteral.east
        } as unknown as google.maps.LatLngBounds);

  const getAddressLabelForInputIndex = (inputIndex: number) => {
    const feature = stopFeatureByInputIndex.get(inputIndex);
    if (!feature) {
      return '';
    }
    const properties = feature.properties ?? {};
    const addressParts: string[] = [];

    if (typeof properties.towardsRoadName === 'string' && properties.towardsRoadName.trim()) {
      addressParts.push(properties.towardsRoadName.trim());
    }

    const district =
      properties.address?.adminDistricts?.map((districtEntry) => districtEntry.shortName).find(
        (value) => typeof value === 'string' && value.trim()
      );
    if (district) {
      addressParts.push(district.trim());
    }

    const countryIso = properties.address?.countryRegion?.ISO;
    if (typeof countryIso === 'string' && countryIso.trim()) {
      addressParts.push(countryIso.trim());
    }

    return addressParts.join(', ');
  };

  const directionsLegs = legs.map((leg, index) => {
    const startLocationLiteral = stopLocations[index];
    const endLocationLiteral = stopLocations[index + 1];

    if (!startLocationLiteral || !endLocationLiteral) {
      throw new Error(`Missing location data for leg ${index}`);
    }

    const startInputIndex = stopInputIndicesInRouteOrder[index];
    const endInputIndex = stopInputIndicesInRouteOrder[index + 1];

    return {
      distance: leg.distance,
      duration: leg.duration,
      start_address: getAddressLabelForInputIndex(startInputIndex),
      end_address: getAddressLabelForInputIndex(endInputIndex),
      start_location: toGoogleLatLng(startLocationLiteral),
      end_location: toGoogleLatLng(endLocationLiteral),
      steps: [] as google.maps.DirectionsStep[],
      traffic_speed_entry: [] as google.maps.DirectionsLeg['traffic_speed_entry'],
      via_waypoints: [] as google.maps.LatLng[]
    };
  });

  // Create a Google Maps compatible directions result structure
  const directions = {
    routes: [
      {
        summary: '',
        legs: directionsLegs,
        waypoint_order: waypointOrder,
        overview_polyline: {
          points: ''
        },
        bounds: boundsForDirections,
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

        // Call our API route which securely handles the subscription key server-side
        const response = await fetch('/api/microsoft-maps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          reject(new Error(errorData.error || `HTTP error! status: ${response.status}`));
          return;
        }

        const data: MicrosoftRouteResponse = await response.json();

        if (data && data.features && data.features.length > 0) {
          const routeResult = transformMicrosoftResponseToGoogle(data, options);
          resolve(routeResult);
        } else {
          reject(new Error('No features found in Microsoft Maps response'));
        }
      } catch (error) {
        reject(new Error(`Microsoft Maps API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
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


import { NextRequest, NextResponse } from 'next/server';

import {
  HereDirectionsOptions,
  HereRouteLeg,
  HereRouteResult,
  HereRoutingResponse,
  HereSequenceResponse,
  HereWaypoint
} from '@/ts/interfaces/HereMaps';
import { Coords } from '@/ts/interfaces/Pool';

const HERE_SEQUENCE_API_URL = 'https://wps.hereapi.com/v8/findsequence2';
const HERE_ROUTING_API_URL = 'https://router.hereapi.com/v8/routes';

function normalizeCoords(coord: Coords | string): Coords {
  if (typeof coord === 'string') {
    const [lat, lng] = coord.split(',').map((value) => Number(value.trim()));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error(`Invalid coordinate string "${coord}"`);
    }
    return { lat, lng };
  }
  return coord;
}

function formatLatLng(coord: Coords | string): string {
  const { lat, lng } = normalizeCoords(coord);
  return `${lat},${lng}`;
}

function formatDestinationParam(id: string, coord: Coords | string): string {
  const { lat, lng } = normalizeCoords(coord);
  return `${id};geo!${lat},${lng}`;
}

function appendWaypointsToParams(params: URLSearchParams, waypoints: Coords[]) {
  waypoints.forEach((waypoint, index) => {
    const paramName = `destination${index + 1}`;
    params.append(paramName, formatDestinationParam(`wp-${index}`, waypoint));
  });
}

function appendViaParams(params: URLSearchParams, waypoints: Coords[]) {
  waypoints.forEach((waypoint) => {
    params.append('via', formatLatLng(waypoint));
  });
}

function metersToMiles(distance: number = 0): number {
  return distance * 0.000621371;
}

function secondsToMinutes(duration: number = 0): number {
  return duration / 60;
}

function deriveWaypointOrder(waypoints: HereWaypoint[]): number[] {
  return waypoints
    .filter((waypoint) => waypoint.id.startsWith('wp-'))
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
    .map((waypoint) => Number(waypoint.id.replace('wp-', '')))
    .filter((index) => Number.isFinite(index));
}

function transformSequenceResponse(
  response: HereSequenceResponse,
  optimizeForTime: boolean
): HereRouteResult {
  const result = response.results?.[0];

  if (!result) {
    throw new Error('HERE Waypoints Sequence API returned no results');
  }

  const legs: HereRouteLeg[] =
    result.interconnections?.map((interconnection) => ({
      distanceInMiles: metersToMiles(interconnection.distance ?? 0),
      timeInMinutes: secondsToMinutes(interconnection.time ?? 0),
      distanceInMeters: interconnection.distance ?? 0,
      durationInSeconds: interconnection.time ?? 0
    })) ?? [];

  const totalDistance = metersToMiles(result.distance ?? 0);
  const totalDuration = secondsToMinutes(result.time ?? 0);

  const routeResult: HereRouteResult = {
    directions: response,
    legs,
    totalDistance,
    totalDuration
  };

  if (optimizeForTime && result.waypoints?.length) {
    routeResult.waypointOrder = deriveWaypointOrder(result.waypoints);
  }

  return routeResult;
}

function transformRoutingResponse(response: HereRoutingResponse): HereRouteResult {
  const route = response.routes?.[0];

  if (!route) {
    throw new Error('HERE Routing API returned no routes');
  }

  const sections = route.sections ?? [];

  if (sections.length === 0) {
    throw new Error('HERE Routing API returned a route with no sections');
  }

  const legs: HereRouteLeg[] = sections.map((section) => {
    const distance = section.summary?.length ?? 0;
    const duration = section.summary?.duration ?? 0;

    return {
      distanceInMiles: metersToMiles(distance),
      timeInMinutes: secondsToMinutes(duration),
      distanceInMeters: distance,
      durationInSeconds: duration
    };
  });

  const totalDistanceMeters = legs.reduce((sum, leg) => sum + (leg.distanceInMeters ?? 0), 0);
  const totalDurationSeconds = legs.reduce((sum, leg) => sum + (leg.durationInSeconds ?? 0), 0);

  return {
    directions: response,
    legs,
    totalDistance: metersToMiles(totalDistanceMeters),
    totalDuration: secondsToMinutes(totalDurationSeconds)
  };
}

async function fetchSequenceRoute(apiKey: string, options: HereDirectionsOptions): Promise<HereRouteResult> {
  const params = new URLSearchParams({
    apiKey,
    mode: 'fastest;car;traffic:enabled',
    departure: 'now',
    return: 'summary,interconnections,waypoints'
  });

  if (options.optimizeForTime) {
    params.append('improveFor', 'time');
  }

  params.append('start', formatLatLng(options.origin));
  params.append('end', formatLatLng(options.destination));

  appendWaypointsToParams(params, options.waypoints);

  const url = `${HERE_SEQUENCE_API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage = errorBody.error || response.statusText || 'Unknown HERE Sequence API error';
    throw new Error(errorMessage);
  }

  const data: HereSequenceResponse = await response.json();
  return transformSequenceResponse(data, options.optimizeForTime);
}

async function fetchRoutingRoute(apiKey: string, options: HereDirectionsOptions): Promise<HereRouteResult> {
  const departureTimeIso = new Date().toISOString();

  const params = new URLSearchParams({
    apiKey,
    transportMode: 'car',
    // routingMode: 'fast',
    return: 'summary',
    departureTime: departureTimeIso
  });

  params.append('origin', formatLatLng(options.origin));
  params.append('destination', formatLatLng(options.destination));
  appendViaParams(params, options.waypoints);

  const url = `${HERE_ROUTING_API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage = errorBody.error || response.statusText || 'Unknown HERE Routing API error';
    throw new Error(errorMessage);
  }

  const data: HereRoutingResponse = await response.json();
  return transformRoutingResponse(data);
}

async function fetchHereRoute(options: HereDirectionsOptions): Promise<HereRouteResult> {
  const apiKey = process.env.HERE_API_KEY;

  if (!apiKey) {
    throw new Error('HERE_API_KEY environment variable is not configured');
  }

  if (options.optimizeForTime) {
    return fetchSequenceRoute(apiKey, options);
  }

  return fetchRoutingRoute(apiKey, options);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HereDirectionsOptions | null;

    if (!body) {
      return NextResponse.json({ error: 'Missing request body' }, { status: 400 });
    }

    const { origin, destination, waypoints, optimizeForTime } = body;

    if (!origin || !destination || !Array.isArray(waypoints)) {
      return NextResponse.json(
        { error: 'origin, destination, and waypoints are required' },
        { status: 400 }
      );
    }

    const result = await fetchHereRoute({
      origin,
      destination,
      waypoints,
      optimizeForTime: Boolean(optimizeForTime)
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'HERE routing proxy failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



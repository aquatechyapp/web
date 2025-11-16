import { Coords } from '@/ts/interfaces/Pool';

export interface HereRouteLeg {
  distanceInMiles: number;
  timeInMinutes: number;
  distanceInMeters: number;
  durationInSeconds: number;
}

export interface HereRouteResult {
  directions: HereSequenceResponse | HereRoutingResponse;
  legs: HereRouteLeg[];
  totalDistance: number;
  totalDuration: number;
  waypointOrder?: number[];
}

export interface HereDirectionsOptions {
  origin: Coords | string;
  destination: Coords | string;
  waypoints: Coords[];
  optimizeForTime: boolean;
}

export interface HereWaypoint {
  id: string;
  lat: number;
  lng: number;
  sequence?: number;
  estimatedArrival?: string;
  estimatedDeparture?: string;
}

export interface HereInterconnection {
  fromWaypoint: string;
  toWaypoint: string;
  distance?: number;
  time?: number;
  rest?: number;
  trafficDelay?: number;
}

export interface HereSequenceResult {
  waypoints: HereWaypoint[];
  distance?: number;
  time?: number;
  interconnections?: HereInterconnection[];
}

export interface HereSequenceResponse {
  results?: HereSequenceResult[];
  notices?: Array<{
    title: string;
    description?: string;
  }>;
}

export interface HereRoutingSectionSummary {
  duration?: number;
  length?: number;
}

export interface HereRoutingSection {
  id: string;
  type?: string;
  summary?: HereRoutingSectionSummary;
}

export interface HereRoutingRoute {
  id: string;
  sections?: HereRoutingSection[];
}

export interface HereRoutingResponse {
  routes?: HereRoutingRoute[];
  notices?: Array<{
    title: string;
    description?: string;
  }>;
}



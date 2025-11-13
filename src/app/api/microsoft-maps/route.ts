import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * API route to proxy Microsoft Maps API requests
 * This keeps the subscription key secure on the server side
 */
export async function POST(request: NextRequest) {
  try {
    const subscriptionKey = process.env.MICROSOFT_MAPS_SUBSCRIPTION_KEY;

    if (!subscriptionKey) {
      return NextResponse.json(
        { error: 'Microsoft Maps API key is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { features, travelMode, optimizeWaypointOrder, optimizeRoute, routeOutputOptions } = body;

    const baseUrl = 'https://atlas.microsoft.com/route/directions';
    const apiVersion = '2025-01-01';

    const requestBody = {
      type: 'FeatureCollection',
      features,
      travelMode: travelMode || 'driving',
      optimizeWaypointOrder: optimizeWaypointOrder || false,
      optimizeRoute: optimizeRoute || 'fastestWithoutTraffic',
      routeOutputOptions: routeOutputOptions || ['routePath', 'itinerary']
    };

    const response = await axios.post(
      baseUrl,
      requestBody,
      {
        params: {
          'api-version': apiVersion,
          'subscription-key': subscriptionKey
        },
        headers: {
          'Content-Type': 'application/geo+json',
          'Accept-Language': 'en-US'
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      return NextResponse.json(
        { error: `Microsoft Maps API request failed: ${errorMessage}` },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


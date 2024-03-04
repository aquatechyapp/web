'use client';

import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerClusterer,
  DirectionsRenderer
} from '@react-google-maps/api';
import { getClientsWithAssignments } from '../../../../../server/actions';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../loading';
import cluster from 'cluster';
import { useEffect, useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100vh'
};
const center = {
  lat: 28.538336,
  lng: -81.379234
};

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const libraries = ['places'];

const Map = ({ assignments }) => {
  const [directions, setDirections] = useState<DirectionsResult>();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDhW4IvM4Db-AmtZp9V2DuWN8XWHbcx-es',
    libraries
  });

  useEffect(() => {
    if (assignments.length <= 0 || !isLoaded) {
      setDirections(null);
      return;
    }
    const origin = assignments[0].pool.coords;
    const destination = assignments[assignments.length - 1].pool.coords;
    const service = new google.maps.DirectionsService();
    // create a waypoints constant that not contain the origin and destination and get only assignments.pool.coords
    const waypoints = assignments
      .filter(
        (assignment, index) => index !== 0 && index !== assignments.length - 1
      )
      .map((assignment) => {
        return {
          location: assignment.pool.coords
        };
      });
    console.log(waypoints, origin, destination);
    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints
      },
      (result, status) => {
        console.log(result, status);
        if (status === 'OK' && result) {
          setDirections(result);
        }
      }
    );
  }, [assignments, isLoaded]);

  // assignments.length > 0 && fetchDirections();
  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={7} center={center}>
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                zIndex: 50,
                strokeColor: '#1976D2',
                strokeWeight: 5
              }
            }}
          />
        )}
        <MarkerClusterer>
          {(clusterer) => {
            return assignments.map((assignment) => (
              <Marker
                key={assignment.id}
                position={{
                  lat: assignment.pool.coords.lat,
                  lng: assignment.pool.coords.lng
                }}
                clusterer={clusterer}
              />
            ));
          }}
        </MarkerClusterer>
      </GoogleMap>
    </>
  );
};

export default Map;

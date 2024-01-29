import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100vh'
};
const center = {
  lat: 28.538336,
  lng: -81.379234
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDhW4IvM4Db-AmtZp9V2DuWN8XWHbcx-es',
    libraries: ['places']
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
    </>
  );
};

export default Map;

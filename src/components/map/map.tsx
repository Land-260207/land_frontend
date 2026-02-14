import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { type LatLngBoundsExpression } from 'leaflet';

const Map = () => {
  const position: [number, number] = [36.2702, 127.6845];
  const southWest: [number, number] = [33.0, 124.0];
  const northEast: [number, number] = [38.7, 131.0];
  const maxBounds: LatLngBoundsExpression = [southWest, northEast];

  return (
    <MapContainer
      center={position}
      zoom={7}
      minZoom={7}
      maxZoom={16}
      maxBounds={maxBounds}
      maxBoundsViscosity={1.0}
      className={'MainContainer w-screen h-screen absolute inset-0'}
    >
      <TileLayer
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      />

      {/* <Marker position={position}>
        <Popup>
          a
        </Popup>
      </Marker> */}
    </MapContainer>
  );
};

export default Map;
import React, { useEffect, useState } from "react";
import {
  useMap,
  TileLayer,
  LayerGroup,
  Popup,
  MapContainer,
  LayersControl
} from "react-leaflet";
import {
  createElementHook,
  createPathHook,
  createPathComponent
} from "@react-leaflet/core";
import L from "leaflet";

function getBounds(props) {
  return L.latLng(props.center).toBounds(props.size);
}

function createSquare(props, context) {
  const instance = new L.Rectangle(getBounds(props));
  return { instance, context: { ...context, overlayContainer: instance } };
}

function updateSquare(instance, props, prevProps) {
  if (props.center !== prevProps.center || props.size !== prevProps.size) {
    instance.setBounds(getBounds(props));
  }
}

// Most of React Leaflet's APIs are React components abstracting the logic of creating
// and interacting with Leaflet elements. The different hooks and factories exposed by
// the core APIs implement various pieces of logic that need to be combined to create
// components, and in some cases the same series of functions are used to create different
// components.

// In the previous step, we combine the following three functions to create the component:

// const useSquareElement = createElementHook(createSquare, updateSquare)
// const useSquare = createPathHook(useSquareElement)
// const Square = createContainerComponent(useSquare)

// This logic is similar for other types of layers and is therefore provided as a
// higher-level component factory, createPathComponent, as used below:
const Square = createPathComponent(createSquare, updateSquare);
// The core APIs export other high-level component factories that can be used in a
// similar way

const maps = {
  base: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

const center = [51.505, -0.09];

const Map = () => {
  const [map, setMap] = useState(null);

  return (
    <>
      <MapContainer
        center={center}
        zoom={13}
        zoomControl={false}
        style={{ height: "100vh", width: "100%", padding: 0 }}
        whenCreated={map => setMap(map)}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Map">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url={maps.base}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Square">
            <LayerGroup>
              <Square center={center} size={1000}>
                <Popup>Hello Popup!</Popup>
              </Square>
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
};

export default Map;

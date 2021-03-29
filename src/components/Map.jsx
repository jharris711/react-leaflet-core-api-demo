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
  createContainerComponent
} from "@react-leaflet/core";
import L from "leaflet";

function getBounds(props) {
  return L.latLng(props.center).toBounds(props.size);
}

// All the steps above focus on displaying the Square element only.
// However, it is common for React Leaflet components to also have children
// when possible. Our Square being a Leaflet layer, overlays such as Popup
// and Tooltip could be attached to it.

// In order to support these overlays, we need to update the createSquare
// function to set the created layer as the context's overlayContainer. Note
// that the context object returned must be a copy of the one provided in the
// function arguments, the function must not mutate the provided context:
function createSquare(props, context) {
  const instance = new L.Rectangle(getBounds(props));
  return { instance, context: { ...context, overlayContainer: instance } };
}

function updateSquare(instance, props, prevProps) {
  if (props.center !== prevProps.center || props.size !== prevProps.size) {
    instance.setBounds(getBounds(props));
  }
}

const useSquareElement = createElementHook(createSquare, updateSquare);
const useSquare = createPathHook(useSquareElement);

// We also need to replace the component factory by taking care of providing
// the changed context and rendering the children, createContainerComponent:
const Square = createContainerComponent(useSquare);
// In addition to the createLeafComponent and createContainerComponent functions,
// createOverlayComponent can be used to create overlays such as Popup and Tooltip.

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

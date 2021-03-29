import React, { useEffect } from "react";
import L from "leaflet";
import { useLeafletContext } from "@react-leaflet/core";

const Square = props => {
  // First, we need to access the context created by the MapContainer
  // component, by calling the useLeafletContext hook exported by the
  // core APIs:
  const context = useLeafletContext();

  // Then, we use React's useEffect hook to create the square instance,
  // using the props to calculate the bounds to provide to Leaflet's
  // Rectangle constructor:
  useEffect(() => {
    const bounds = L.latLng(props.center).toBounds(props.size);
    const square = new L.Rectangle(bounds);
    // The created layer needs to be added to a container provided in the
    // context, either a parent container such as a LayerGroup, or the Map
    // instance created with the context:
    const container = context.layerContainer || context.map;
    container.addLayer(square);

    // We also need to return the cleaning up function for the useEffect hook,
    // that removes the layer from the container:
    return () => {
      container.removeLayer(square);
    };
  });

  // Finally, the Square component needs to return a valid React node, but as
  // the rendering of the layer is performed by Leaflet, it only returns null
  return null;
};

export default Square;

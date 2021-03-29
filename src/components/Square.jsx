import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useLeafletContext } from "@react-leaflet/core";

// First, we extract the function that returns bounds from props, 
// as this logic will be needed in two places:
const getBounds = props => {
  return L.latLng(props.center).toBounds(props.size);
};

const Square = props => {
  const context = useLeafletContext();
  // We also need to keep references to the Leaflet element instance 
  // and the props, by leveraging the useRef hook:
  const squareRef = useRef();
  const propsRef = useRef(props);

  // Set logic:
  // Finally, we separate the logic for adding and removing the layer 
  // from the logic to update it, by setting the dependencies argument 
  // of the useEffect hook. The first useEffect callback will be only 
  // called when the component is mounted and unmounted (setting the 
  // dependencies to []): 
  useEffect(() => {
    squareRef.current = new L.Rectangle(getBounds(props));
    const container = context.layerContainer || context.map;
    container.addLayer(squareRef.current);

    return () => {
      container.removeLayer(squareRef.current);
    };
  }, []);

  // Update Logic:
  // The second useEffect callback will be called whenever the props change, and conditionally apply the update to the layer:
  useEffect(() => {
    if (
      props.center !== propsRef.current.center ||
      props.size !== propsRef.current.size
    ) {
      squareRef.current.setBounds(getBounds(props));
    }
    propsRef.current = props;
  }, [props.center, props.size]);

  return null;
};

export default Square;

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useLeafletContext, createElementHook } from "@react-leaflet/core";

function getBounds(props) {
  return L.latLng(props.center).toBounds(props.size);
}

// First, instead of having the Leaflet element creation and updating
// logic in useEffect callbacks, we can extract them to standalone functions
// implementing the expected interface:
function createSquare(props, context) {
  return { instance: new L.Rectangle(getBounds(props), context) };
}

function updateSquare(instancem, props, prevProps) {
  if (props.center !== prevProps.center || props.size !== prevProps.size) {
    instance.setBounds(getBounds(props));
  }
}

// Based on these functions, we can create a useSquareElement hook:
const useSquareElement = createElementHook(createSquare, updateSquare);

const Square = props => {
  const context = useLeafletContext();
  const elementRef = useSquareElement(props, context);

  // This hook will keep track of the element's instance and props,
  // so a single useEffect hook can be used to handle the addition and
  // removal of the layer:
  useEffect(() => {
    const container = context.layerContainer || context.map;
    container.addLayer(elementRef.current.instance);

    return () => {
      container.removeLayer(elementRef.current.instance);
    };
  }, []);

  return null;
};

export default Square;

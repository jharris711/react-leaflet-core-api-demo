import React, { useEffect, useRef } from "react";
import L from "leaflet";
import {
  useLeafletContext,
  createElementHook,
  useLayerLifecycle,
  createPathHook
} from "@react-leaflet/core";

function getBounds(props) {
  return L.latLng(props.center).toBounds(props.size);
}

function createSquare(props, context) {
  return { instance: new L.Rectangle(getBounds(props), context) };
}

function updateSquare(instancem, props, prevProps) {
  if (props.center !== prevProps.center || props.size !== prevProps.size) {
    instance.setBounds(getBounds(props));
  }
}

const useSquareElement = createElementHook(createSquare, updateSquare);
// The core APIs also provide higher-level factory functions implementing logic
// shared by different hooks, such as createPathHook. Here we can extract the
// logic previously implemented in the component to a hook factory, and simply
// call the created hook in the component:
const useSquare = createPathHook(useSquareElement);
// createPathHook also implements further logic, notably calling the useEventHandlers
// and useLayerLifecycle hooks as well.
const Square = props => {
  useSquare(props);

  return null;
};

export default Square;

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import {
  useLeafletContext,
  createElementHook,
  useLayerLifecycle
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

const Square = props => {
  const context = useLeafletContext();
  const elementRef = useSquareElement(props, context);

  // The core APIs provide additional hooks to handle specific pieces of
  // logic. Here, we can replace the useEffect hook used previously to add
  // and remove the layer by the useLayerLifecycle hook:
  useLayerLifecycle(elementRef.current, context);

  return null;
};

export default Square;

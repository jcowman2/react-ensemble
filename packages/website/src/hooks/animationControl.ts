import React from "react";
import { ILoadEvent } from "react-ensemble/dist/types/components/Timeline/timeline.types";
import { HomePageContext } from "../context/HomePageContext";

export const useAnimationControl = () => {
  const { playbackSpeed, progress } = React.useContext(HomePageContext);
  const [animLength, setAnimLength] = React.useState(0);

  const onLoad = React.useCallback(
    (event: ILoadEvent) => setAnimLength(event.animation.length),
    []
  );

  const value = progress * animLength;

  return { playbackSpeed, value, onLoad };
};

import React from "react";
import { ReactSetter } from "../types/utils";

interface HomePageContextProps {
  playbackSpeed: number;
  setPlaybackSpeed: ReactSetter<number>;
  progress: number;
  setProgress: ReactSetter<number>;
}

export const HomePageContext = React.createContext<HomePageContextProps>({
  playbackSpeed: 1,
  setPlaybackSpeed: () => {},
  progress: 0,
  setProgress: () => {}
});

import { group } from "../group/group";
import {
  TrackRegionSingleOrArray,
  ILoopConfig,
  ITrackRegionGroup
} from "../trackUtils.types";

export const loop = <State extends object>(
  regions: TrackRegionSingleOrArray<State>,
  config: true | number | ILoopConfig
): ITrackRegionGroup<State> => {
  const loopConfig = typeof config === "number" ? { count: config } : config;
  return group(regions, { loop: loopConfig });
};

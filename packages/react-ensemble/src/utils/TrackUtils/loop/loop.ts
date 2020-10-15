import { group } from "../group/group";
import {
  TrackRegionSingleOrArray,
  LoopConfig,
  TrackRegionGroup
} from "../trackUtils.types";

export const loop = <State extends object>(
  regions: TrackRegionSingleOrArray<State>,
  config: true | number | LoopConfig
): TrackRegionGroup<State> => {
  const loopConfig = typeof config === "number" ? { count: config } : config;
  return group(regions, { loop: loopConfig });
};

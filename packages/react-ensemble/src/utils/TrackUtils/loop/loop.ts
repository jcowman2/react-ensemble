import { group } from "../group/group";
import {
  TrackRegionSingleOrArray,
  LoopConfig,
  TrackRegionGroup
} from "../trackUtils.types";

/**
 * Places one or more regions into a group with the specified loop configuration.
 * @param regions The region or regions to be placed into the looping group.
 * @param config If a `number`, the region will be configured to loop that number of times. Otherwise, the config passed here will be the group's `loop` property.
 */
export const loop = <State extends object>(
  regions: TrackRegionSingleOrArray<State>,
  config: boolean | number | LoopConfig
): TrackRegionGroup<State> => {
  const loopConfig = typeof config === "number" ? { count: config } : config;
  return group(regions, { loop: loopConfig });
};

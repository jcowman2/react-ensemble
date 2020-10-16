import { isArray } from "../helpers";
import {
  TrackRegionGroup,
  TrackRegionSingleOrArray
} from "../trackUtils.types";

/**
 * Places one or more track regions into a single group.
 * @param regions The region or regions to be grouped.
 * @param config Any region properties to be applied to the finished group, excluding `regions`. (Optional)
 */
export const group = <State extends object>(
  regions: TrackRegionSingleOrArray<State>,
  config: Omit<TrackRegionGroup<State>, "regions"> = {}
): TrackRegionGroup<State> => {
  return {
    ...config,
    regions: isArray(regions) ? regions : [regions]
  };
};

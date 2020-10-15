import { isArray } from "../helpers";
import {
  TrackRegionGroup,
  TrackRegionSingleOrArray
} from "../trackUtils.types";

export const group = <State extends object>(
  regions: TrackRegionSingleOrArray<State>,
  config: Omit<TrackRegionGroup<State>, "regions"> = {}
): TrackRegionGroup<State> => {
  return {
    ...config,
    regions: isArray(regions) ? regions : [regions]
  };
};

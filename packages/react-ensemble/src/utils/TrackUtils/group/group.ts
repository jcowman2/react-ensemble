import { isArray } from "../helpers";
import {
  ITrackRegionGroup,
  TrackRegionSingleOrArray
} from "../trackUtils.types";

export const group = <State extends object>(
  regions: TrackRegionSingleOrArray<State>,
  config: Omit<ITrackRegionGroup<State>, "regions"> = {}
): ITrackRegionGroup<State> => {
  return {
    ...config,
    regions: isArray(regions) ? regions : [regions]
  };
};

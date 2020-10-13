import { isArray } from "../helpers";
import { TrackRegionSingleOrArray } from "../trackUtils.types";

export const layer = <State extends object>(
  layerName: string | number,
  regions: TrackRegionSingleOrArray<State>
): TrackRegionSingleOrArray<State> => {
  return isArray(regions)
    ? regions.map(region => ({ ...region, layer: String(layerName) }))
    : { ...regions, layer: String(layerName) };
};

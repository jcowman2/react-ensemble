import { isArray } from "../helpers";
import { TrackRegionSingleOrArray } from "../trackUtils.types";

/**
 * Returns one or more new regions with the given layer name.
 * @param layerName The layer name to apply to the regions. Since `TrackRegion.layer` must be a string, a number passed here will be cast to a string.
 * @param regions The region or regions to be copied with the new layer.
 */
export const layer = <State extends object>(
  layerName: string | number,
  regions: TrackRegionSingleOrArray<State>
): TrackRegionSingleOrArray<State> => {
  return isArray(regions)
    ? regions.map(region => ({ ...region, layer: String(layerName) }))
    : { ...regions, layer: String(layerName) };
};

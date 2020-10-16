import { isArray } from "../helpers";
import {
  TrackRegion,
  TrackRegionGroup,
  TrackRegionSingleOrArray
} from "../trackUtils.types";
import { layer } from "../layer/layer";
import { group } from "../group/group";

/**
 * Flattens a collection of tracks into a single group's track, with the regions from each sub-track on separate layers.
 * @param tracks The tracks to be flattened. If a 2D array is passed, each track's new layer will be its index in the 2D array. If an object is passed, the key referring to each track will be used as the layer.
 * @param config Any region properties to be applied to the finished group, excluding `regions`. (Optional)
 */
export const multi = <State extends object>(
  tracks:
    | TrackRegionSingleOrArray<State>[]
    | Record<string, TrackRegionSingleOrArray<State>>,
  config: Omit<TrackRegionGroup<State>, "regions"> = {}
): TrackRegionGroup<State> => {
  const layerNames = isArray(tracks)
    ? Array(tracks.length)
        .fill(true)
        .map((_v, idx) => idx)
    : Object.keys(tracks);

  const allRegions: TrackRegion[] = [];
  for (const layerName of layerNames) {
    const regionLayer = layer(layerName, tracks[layerName]);
    const regions = isArray(regionLayer) ? regionLayer : [regionLayer];
    allRegions.push(...regions);
  }

  return group(allRegions, config);
};

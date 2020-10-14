import { isArray } from "../helpers";
import {
  TrackRegion,
  TrackRegionGroup,
  TrackRegionSingleOrArray
} from "../trackUtils.types";
import { layer } from "../layer/layer";
import { group } from "../group/group";

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

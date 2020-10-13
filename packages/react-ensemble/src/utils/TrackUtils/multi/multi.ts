import { isArray } from "../helpers";
import {
  ITrackRegion,
  ITrackRegionGroup,
  TrackRegionSingleOrArray
} from "../trackUtils.types";
import { layer } from "../layer/layer";

export const multi = <State extends object>(
  tracks:
    | TrackRegionSingleOrArray<State>[]
    | Record<string, TrackRegionSingleOrArray<State>>,
  config: Omit<ITrackRegionGroup<State>, "regions"> = {}
): ITrackRegionGroup<State> => {
  const layerNames = isArray(tracks)
    ? Array(tracks.length)
        .fill(true)
        .map((_v, idx) => idx)
    : Object.keys(tracks);

  const allRegions: ITrackRegion[] = [];
  for (const layerName of layerNames) {
    const regionLayer = layer(layerName, tracks[layerName]);
    const regions = isArray(regionLayer) ? regionLayer : [regionLayer];
    allRegions.push(...regions);
  }

  return { ...config, regions: allRegions };
};

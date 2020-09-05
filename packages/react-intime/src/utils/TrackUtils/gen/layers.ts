import _groupBy from "lodash.groupby";
import _sortBy from "lodash.sortby";
// @ts-ignore
import alphanumSort from "alphanum-sort";
import { ITrackRegion, TrackLayerResolver } from "../trackUtils.types";

const DEFAULT_LAYER = "_default";

export const separateLayers = <State extends object>(
  track: ITrackRegion<State>[]
): {
  layers: Record<string, ITrackRegion<State>[]>;
  layerRanks: Record<string, number>;
} => {
  const trackWithLayers = track.map(region => ({
    ...region,
    layer: region.layer ?? DEFAULT_LAYER
  }));

  const layers = _groupBy(trackWithLayers, "layer") as Record<
    string,
    ITrackRegion<State>[]
  >;
  const layerNames = alphanumSort(Object.keys(layers)) as string[];

  const layerRanks: Record<string, number> = {};
  layerNames.forEach((name, index) => (layerRanks[name] = index));

  // If no regions exist, add an empty region at the default layer
  if (!Object.keys(layers).length) {
    layerRanks[DEFAULT_LAYER] = 0;
    const defaultRegion: ITrackRegion<State> = {
      start: 0,
      duration: 0,
      layer: DEFAULT_LAYER
    };
    layers[DEFAULT_LAYER] = [defaultRegion];
  }

  return { layers, layerRanks };
};

export const layerResolverOverrideLast: TrackLayerResolver = (
  stateKey,
  layers
) => {
  return _sortBy(layers, ["age", layer => -layer.rank])[0].value; // TODO - double check
};

import _groupBy from "lodash.groupby";
// @ts-ignore
import alphanumSort from "alphanum-sort";
import { TrackRegion, TrackRegionAtom } from "../trackUtils.types";

export const DEFAULT_LAYER = "_default";

const namespaceLayer = (layerName: string, rootLayer: string) => {
  return rootLayer === "" ? layerName : `${rootLayer}.${layerName}`;
};

export const separateLayers = <State extends object>(
  track: TrackRegion<State>[],
  rootLayer = ""
): {
  layers: Record<string, TrackRegion<State>[]>;
  layerRanks: Record<string, number>;
} => {
  const defaultLayerName = namespaceLayer(DEFAULT_LAYER, rootLayer);

  const trackWithLayers = track.map(region => ({
    ...region,
    layer: region.layer
      ? namespaceLayer(region.layer, rootLayer)
      : defaultLayerName
  }));

  const layers = _groupBy(trackWithLayers, "layer") as Record<
    string,
    TrackRegion<State>[]
  >;
  const layerNames = alphanumSort(Object.keys(layers)) as string[];

  const layerRanks: Record<string, number> = {};
  layerNames.forEach((name, index) => (layerRanks[name] = index));

  // If no regions exist, add an empty region at the default layer
  if (!Object.keys(layers).length) {
    layerRanks[defaultLayerName] = 0;
    const defaultRegion: TrackRegionAtom<State> = {
      start: 0,
      duration: 0,
      layer: defaultLayerName
    };
    layers[defaultLayerName] = [defaultRegion];
  }

  return { layers, layerRanks };
};

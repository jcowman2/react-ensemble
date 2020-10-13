import _sortBy from "lodash.sortby";
import { TrackLayerResolver } from "../trackUtils.types";

const overrideLast: TrackLayerResolver = (stateKey, layers) => {
  const winner = _sortBy(layers, ["age", layer => -layer.rank])[0];
  // console.log("winner", stateKey, winner, layers);
  return winner.value;
};

export const layerResolvers = { overrideLast };

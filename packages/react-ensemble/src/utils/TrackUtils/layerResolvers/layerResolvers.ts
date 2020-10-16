import _sortBy from "lodash.sortby";
import { TrackLayerResolver } from "../trackUtils.types";

/**
 * Selects the value candidate with the lowest age (least amount of time since it was last updated).
 *
 * If multiple candidates have the same age, the one with the highest layer rank will be used.
 * Layer rank is calculated by alphanumerically sorting all layer names that exist in the track.
 */
export const overrideLast: TrackLayerResolver = (stateKey, layers) => {
  const winner = _sortBy(layers, ["age", layer => -layer.rank])[0];
  return winner.value;
};

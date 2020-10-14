import IntervalTree from "node-interval-tree";
import {
  ITrackRegion,
  ITrackConfig,
  ICalculatedTrackRegion
} from "../trackUtils.types";
import { genLayer } from "./genLayer";
import {
  IIntervalTreeSegment,
  addRegionsToIntervalTree,
  makeIntervalTreeFrameStateGetter
} from "./intervalTree";
import { separateLayers } from "./layers";
import { clampToLoop, clampToBoomerang } from "./loop";

export const genAnimation = <State extends object>(
  track: ITrackRegion<State>[],
  defaults: State,
  fullConfig: Required<ITrackConfig<State>>,
  rootLayer = "",
  startOffset = 0
) => {
  if (!track) {
    throw new Error("Track must be defined");
  }

  const { layers, layerRanks } = separateLayers(track, rootLayer);

  const calculatedLayers: Record<string, ICalculatedTrackRegion<State>[]> = {};
  const activeVars = new Set<keyof State>();

  const tree = new IntervalTree<IIntervalTreeSegment<State>>();
  let animationLength = 0;

  for (const layerName in layers) {
    const { regions, length } = genLayer(
      layerName,
      layers[layerName],
      defaults,
      fullConfig,
      startOffset
    );
    calculatedLayers[layerName] = regions;
    regions.forEach(region =>
      region.activeVars.forEach(value => activeVars.add(value))
    );
    addRegionsToIntervalTree(tree, regions, defaults);
    animationLength = Math.max(animationLength, length);
  }

  if (fullConfig.endBehavior === "boomerang") {
    animationLength *= 2;
  }

  const treeStateGetter = makeIntervalTreeFrameStateGetter(
    tree,
    layerRanks,
    fullConfig.resolver
  );

  const loopClamp = clampToLoop(animationLength);
  const boomerangClamp = clampToBoomerang(animationLength);

  const getFrameState = (current: number) => {
    let fixedPlayhead: number;

    switch (fullConfig.endBehavior) {
      case "continue":
        fixedPlayhead = current;
        break;
      case "stop":
        fixedPlayhead = Math.min(current, animationLength);
        break;
      case "loop":
        fixedPlayhead = loopClamp(current);
        break;
      case "boomerang":
        fixedPlayhead = boomerangClamp(current);
        break;
    }
    // console.log("getFrameState", current, fixedPlayhead);
    const calculatedState = treeStateGetter(fixedPlayhead);

    return calculatedState;
  };

  return {
    layers: calculatedLayers,
    getFrameState,
    length: animationLength,
    config: fullConfig,
    activeVars
  };
};

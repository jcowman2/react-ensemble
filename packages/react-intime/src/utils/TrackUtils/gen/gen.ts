import IntervalTree from "node-interval-tree";
import { easeCubic } from "d3-ease";
import { interpolate } from "d3-interpolate";
import {
  ITrackRegion,
  ITrackConfig,
  IAnimation,
  ICalculatedTrackRegion,
  TrackLayerResolver
} from "../trackUtils.types";
import { genLayer } from "./genLayer";
import {
  addRegionsToIntervalTree,
  makeIntervalTreeFrameStateGetter,
  IIntervalTreeSegment
} from "./intervalTree";
import { layerResolverOverrideLast, separateLayers } from "./layers";
import { clampToLoop, clampToBoomerang } from "./loop";

const applyConfigDefaults = <State extends object>(
  config: ITrackConfig<State> = {}
): Required<ITrackConfig<State>> => {
  const {
    endBehavior = "stop",
    easing = easeCubic,
    interp = interpolate,
    resolver = layerResolverOverrideLast as TrackLayerResolver<State>
  } = config;
  return { endBehavior, easing, interp, resolver };
};

export const gen = <State extends object>(
  track: ITrackRegion<State>[],
  defaults: State,
  config?: ITrackConfig<State>
): IAnimation<State> => {
  if (!track) {
    throw new Error("Track must be defined");
  }
  const fullConfig = applyConfigDefaults(config);

  const { layers, layerRanks } = separateLayers(track);

  const calculatedLayers: Record<string, ICalculatedTrackRegion<State>[]> = {};

  const tree = new IntervalTree<IIntervalTreeSegment<State>>();
  let animationLength = 0;

  for (const layerName in layers) {
    const { regions, length } = genLayer(
      layerName,
      layers[layerName],
      defaults,
      fullConfig
    );
    calculatedLayers[layerName] = regions;
    addRegionsToIntervalTree(tree, regions);
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
    const calculatedState = treeStateGetter(fixedPlayhead);

    return calculatedState;
  };

  return {
    layers: calculatedLayers,
    getFrameState,
    length: animationLength,
    config: fullConfig
  };
};

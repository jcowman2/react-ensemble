import { easeCubic } from "d3-ease";
import { interpolate } from "d3-interpolate";
import {
  TrackRegion,
  TrackConfig,
  Animation,
  TrackLayerResolver
} from "../trackUtils.types";
import { genAnimation } from "./genAnimation";
import { layerResolvers } from "../layerResolvers/layerResolvers";

const applyConfigDefaults = <State extends object>(
  config: TrackConfig<State> = {}
): Required<TrackConfig<State>> => {
  const {
    endBehavior = "stop",
    easing = easeCubic,
    interp = interpolate,
    resolver = layerResolvers.overrideLast as TrackLayerResolver<State>
  } = config;
  return { endBehavior, easing, interp, resolver };
};

export const gen = <State extends object>(
  track: TrackRegion<State>[],
  defaults: State,
  config?: TrackConfig<State>
): Animation<State> => {
  const fullConfig = applyConfigDefaults(config);
  const animation = genAnimation(track, defaults, fullConfig);

  return animation;
};

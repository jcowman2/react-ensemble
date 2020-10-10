import { easeCubic } from "d3-ease";
import { interpolate } from "d3-interpolate";
import {
  ITrackRegion,
  ITrackConfig,
  IAnimation,
  TrackLayerResolver
} from "../trackUtils.types";
import { genAnimation } from "./genAnimation";
import { layerResolverOverrideLast } from "./layers";

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
  const fullConfig = applyConfigDefaults(config);
  const animation = genAnimation(track, defaults, fullConfig);

  return animation;
};

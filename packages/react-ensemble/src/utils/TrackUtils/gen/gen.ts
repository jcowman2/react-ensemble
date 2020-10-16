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

/**
 * Parses an animation's track and configuration into a queryable `Animation` object.
 * @param track The array of regions that make up the animation.
 * @param defaults The animation's default state.
 * @param config Various configuration for the computed animation. (Optional)
 *
 * **This function contains React Ensemble's core animation parsing engine.**
 *
 * `Timeline` calls `gen` internally to calculate its animation, but there may be instances where you would want to parse and query animations directly.
 */
export const gen = <State extends object>(
  track: TrackRegion<State>[],
  defaults: State,
  config?: TrackConfig<State>
): Animation<State> => {
  const fullConfig = applyConfigDefaults(config);
  const animation = genAnimation(track, defaults, fullConfig);

  return animation;
};

interface TrackRegionBase {
  start?: number;
  end?: number;
  easing?: EasingFunction | null;
  interp?: InterpolationFunction | null;
  layer?: string;
  loop?: LoopConfig | boolean;
}

export interface TrackRegionAtom<State extends object = any>
  extends TrackRegionBase {
  duration?: number;
  state?: RegionState<State>;
}

export interface TrackRegionGroup<State extends object = any>
  extends TrackRegionBase {
  regions: TrackRegion<State>[];
  relativeTime?: boolean;
}

export type TrackRegion<State extends object = any> =
  | TrackRegionAtom<State>
  | TrackRegionGroup<State>;

export interface CalculatedTrackRegion<State extends object = any> {
  id: string;
  activeVars: Set<keyof State>;
  get: (current: number) => State;
  start: number;
  end: number;
  layer: string;
}

export interface LoopConfig {
  boomerang?: boolean;
  count?: number;
  until?: number;
  duration?: number;
}

export type EasingFunction = (progress: number) => number;
export type InterpolationFunction = <T>(
  start: T,
  end: T
) => (progress: number) => T;

export type RegionState<V> = { [K in keyof V]?: RegionStateProperty<V[K]> };
export type RegionStateProperty<T> = {
  from?: T;
  to?: T;
  set?: T | ((previous: T) => T);
};

/**
 * Describes how the engine will calculate frame states for time values greater than the length of the animation.
 *
 * - `"stop"`: Time will be clamped to the length of the animation. Gives the impression of the animation pausing once its finished.
 * - `"continue"`: Time will continue to increase. Passive loops will continue to run indefinitely.
 * - `"loop"`: Time will reset back to the start of the animation. Gives the impression of the animation looping.
 * - `"boomerang"`: Time will be transformed so the animation appears to run backwards after it completes, then start over.
 */
export type TimelineEndBehavior = "stop" | "continue" | "loop" | "boomerang";

export type TrackLayerResolver<State extends object = any> = (
  stateKey: keyof State,
  layers: ResolverLayerData<State[keyof State]>[]
) => State[keyof State];

export interface ResolverLayerData<T> {
  name: string;
  rank: number;
  age: number;
  value: T;
}

export interface TrackConfig<State extends object = any> {
  endBehavior?: TimelineEndBehavior;
  easing?: EasingFunction;
  interp?: InterpolationFunction;
  resolver?: TrackLayerResolver<State>;
}

export interface Animation<State extends object> {
  length: number;
  config: Required<TrackConfig<State>>;
  getFrameState(frame: number): State;
  layers: Record<string, CalculatedTrackRegion<State>[]>;
  activeVars: Set<keyof State>;
}

export interface TrackRegionContext {
  layerName: string;
  index: number;
  throwErr: (error: string) => never;
}

export type TrackRegionSingleOrArray<State extends object = any> =
  | TrackRegion<State>
  | TrackRegion<State>[];

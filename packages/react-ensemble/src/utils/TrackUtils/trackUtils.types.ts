export interface ITrackRegion<State extends object = any> {
  start?: number;
  duration?: number;
  end?: number;
  state?: RegionState<State>;
  easing?: EasingFunction | null;
  interp?: InterpolationFunction | null;
  layer?: string;
  loop?: ILoopConfig | boolean;
}

export interface ICalculatedTrackRegion<State extends object = any>
  extends Required<ITrackRegion<State>> {
  id: string;
  activeVars: Set<keyof State>;
  get: (current: number) => State;
}

export interface ILoopConfig {
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

/** @hidden */
export type RegionState<V> = { [K in keyof V]?: RegionStateProperty<V[K]> };
/** @hidden */
export type RegionStateProperty<T> = {
  from?: T;
  to?: T;
  set?: T | ((previous: T) => T);
};

export type TimelineEndBehavior = "stop" | "continue" | "loop" | "boomerang";

export type TrackLayerResolver<State extends object = any> = (
  stateKey: keyof State,
  layers: IResolverLayerData<State[keyof State]>[]
) => State[keyof State];

export interface IResolverLayerData<T> {
  name: string;
  rank: number;
  age: number;
  value: T;
}

export interface ITrackConfig<State extends object = any> {
  endBehavior?: TimelineEndBehavior;
  easing?: EasingFunction;
  interp?: InterpolationFunction;
  resolver?: TrackLayerResolver<State>;
}

export interface IAnimation<State extends object> {
  length: number;
  config: Required<ITrackConfig<State>>;
  getFrameState(frame: number): State;
  layers: Record<string, ICalculatedTrackRegion<State>[]>;
}

interface ITrackRegionBase {
  start?: number;
  end?: number;
  easing?: EasingFunction | null;
  interp?: InterpolationFunction | null;
  layer?: string;
  loop?: ILoopConfig | boolean;
}

export interface ITrackRegionAtom<State extends object = any>
  extends ITrackRegionBase {
  duration?: number;
  state?: RegionState<State>;
}

export interface ITrackRegionGroup<State extends object = any>
  extends ITrackRegionBase {
  regions: ITrackRegion<State>[];
  useRelativeTime?: boolean;
}

export type ITrackRegion<State extends object = any> =
  | ITrackRegionAtom<State>
  | ITrackRegionGroup<State>;

export interface ICalculatedTrackRegion<State extends object = any> {
  id: string;
  activeVars: Set<keyof State>;
  get: (current: number) => State;
  start: number;
  end: number;
  layer: string;
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

export type RegionState<V> = { [K in keyof V]?: RegionStateProperty<V[K]> };
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

export interface TrackRegionContext {
  layerName: string;
  index: number;
  throwErr: (error: string) => never;
}

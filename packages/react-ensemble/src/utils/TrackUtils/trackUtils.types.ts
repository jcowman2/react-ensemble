// PUBLIC TYPES (PART OF THE PUBLIC API)

/**
 * A `TrackRegion` that describes a single "curve" of an animation, which involves zero or more state properties changing in a particular way over a defined time frame.
 */
export interface TrackRegionAtom<State extends object = any>
  extends TrackRegionBase {
  /** The region's length, in milliseconds. (Optional)  */
  duration?: number;

  /** Description of any state property changes over the course of the region. (Optional) */
  state?: RegionState<State>;
}

/**
 * A group of track regions that should be treated as a single region.
 */
export interface TrackRegionGroup<State extends object = any>
  extends TrackRegionBase {
  /** The array of regions to be grouped and considered as a single region. */
  regions: TrackRegion<State>[];

  /** Whether the timestamps of all regions in the group will be parsed as if this group's starting time equals zero. Default: `false` */
  relativeTime?: boolean;
}

/**
 * Data used to describe an animation's behavior over a given time frame.
 *
 * `TrackRegion` is actually a union of two other types of track regions: `TrackRegionAtom` and `TrackRegionGroup`.
 * Wherever track regions are expected, there can be any assortment of these two region types.
 */
export type TrackRegion<State extends object = any> =
  | TrackRegionAtom<State>
  | TrackRegionGroup<State>;

/**
 * Helper type that maps every property of an animation's state to a declarative `RegionStateProperty` for use in a `TrackRegion`.
 */
export type RegionState<V> = { [K in keyof V]?: RegionStateProperty<V[K]> };

/**
 * Description of how an animation's state property should change over the course of a single track region.
 */
export type RegionStateProperty<T> = {
  /** If specified, the state property will be set to this value at the start of the region. */
  from?: T;

  /** If specified, the state property will gradually change to this value over the duration of the region. */
  to?: T;

  /** If specified, the state property will be set to this value (or the output of this function when given the previous value) at the start of the region. */
  set?: T | ((previous: T) => T);
};

/**
 * A track region that has been parsed into an animation-readable format by `TrackUtils.gen`.
 */
export interface CalculatedTrackRegion<State extends object = any> {
  /** The region's unique identifier. */
  id: string;

  /** The state properties that are animated at any point during the region. */
  activeVars: Set<keyof State>;

  /** The region's frame state generator. Returns the current state of the animation at any time value within the region. */
  get: (current: number) => State;

  /** The region's starting point (in milliseconds). */
  start: number;

  /** The region's ending point (in milliseconds). */
  end: number;

  /** The region's layer name.  */
  layer: string;
}

/**
 * Configuration for if and how a track region should loop during an animation.
 */
export interface LoopConfig {
  /** Whether the region should "boomerang" back to its initial values after each execution. (Optional) */
  boomerang?: boolean;

  /** The number of times the region should loop in addition to its regular execution. (Optional)  */
  count?: number;

  /** The absolute time in milliseconds the region should loop until. (Optional)   */
  until?: number;

  /** The number of milliseconds the region should loop for. (Optional)  */
  duration?: number;
}

/**
 * A function that will transform a normalized time `[0,1]` according to some curve.
 */
export type EasingFunction = (progress: number) => number;

/**
 * A function that, based on two values, creates a function that will blend between the two values over a normalized time range `[0,1]`.
 */
export type InterpolationFunction = <T>(
  start: T,
  end: T
) => (progress: number) => T;

/**
 * Describes how the engine will calculate frame states for time values greater than the length of the animation.
 *
 * - `"stop"`: Time will be clamped to the length of the animation. Gives the impression of the animation pausing once its finished.
 * - `"continue"`: Time will continue to increase. Passive loops will continue to run indefinitely.
 * - `"loop"`: Time will reset back to the start of the animation. Gives the impression of the animation looping.
 * - `"boomerang"`: Time will be transformed so the animation appears to run backwards after it completes, then start over.
 */
export type TimelineEndBehavior = "stop" | "continue" | "loop" | "boomerang";

/**
 * Function used inside `Animation.getFrameState` that will determine the value for a state property animated by multiple layers at once.
 */
export type TrackLayerResolver<State extends object = any> = (
  /** The key of the state property in question.  */
  stateKey: keyof State,

  /** Metadata about any region across any layer that is animating the state property at this point. */
  layers: ResolverLayerData<State[keyof State]>[]
) => State[keyof State];

/**
 * Used within a `TrackLayerResolver`, contains metadata about any region across any layer that is animating the state property at this point.
 */
export interface ResolverLayerData<T> {
  /** The region's layer name. */
  name: string;

  /** The region's layer rank, calculated by alphanumerically sorting all the layer names in the track. A higher rank means a higher position in that list. */
  rank: number;

  /** The milliseconds that have passed since this state property was changed in this layer. */
  age: number;

  /** The value of this state property in this layer at this time. */
  value: T;
}

/**
 * Top-level configuration for an animation.
 */
export interface TrackConfig<State extends object = any> {
  /** How the engine will calculate frame states for time values greater than the length of the animation. (Optional) */
  endBehavior?: TimelineEndBehavior;

  /** The easing function that will be applied to each region if it does not specify its own. (Optional) */
  easing?: EasingFunction;

  /** The interpolation function that will be applied to each region if it does not specify its own. (Optional) */
  interp?: InterpolationFunction;

  /** The function that will be used to determine which state value to use when multiple layers animate the same one. (Optional) */
  resolver?: TrackLayerResolver<State>;
}

/**
 * Representation of a React Ensemble animation that can generate state at any point in time.
 *
 * Generated by `TrackUtils.gen`. The function `getFrameState` is used by `Timeline` to calculate animation state.
 */
export interface Animation<State extends object> {
  /** The length of the animation (in milliseconds). */
  length: number;

  /** The complete config that was used to generate the animation. Changing these values has no effect on the animation. */
  config: Required<TrackConfig<State>>;

  /** The animation's frame state generator. Returns the current state of the animation at any time value. */
  getFrameState(frame: number): State;

  /** The calculated track regions, grouped by layer name, that were generated to create this animation. */
  layers: Record<string, CalculatedTrackRegion<State>[]>;

  /** The state properties that are animated at any point during the animation. */
  activeVars: Set<keyof State>;
}

// INTERNAL TYPES (REFERENCED BY TYPES IN THE PUBLIC API, BUT NOT EXPORTED AS STANDALONE)

interface TrackRegionBase {
  /** The region's starting point, in milliseconds. (Optional)  */
  start?: number;

  /** The region's ending point, in milliseconds. (Optional)   */
  end?: number;

  /** The region's easing function, which will override the `TrackConfig` easing function. (Optional)  */
  easing?: EasingFunction | null;

  /** The region's interpolation function, which will override the `TrackConfig` interpolation function. (Optional) */
  interp?: InterpolationFunction | null;

  /** The region's layer name. */
  layer?: string;

  /** Determines if and how the region should loop within the animation. If true, will be a passive loop. If an object, will be parsed according to `LoopConfig`. */
  loop?: LoopConfig | boolean;
}

export type TrackRegionSingleOrArray<State extends object = any> =
  | TrackRegion<State>
  | TrackRegion<State>[];

// HIDDEN TYPES (NOT REFERENCED IN THE PUBLIC API)

export interface TrackRegionContext {
  layerName: string;
  index: number;
  throwErr: (error: string) => never;
}

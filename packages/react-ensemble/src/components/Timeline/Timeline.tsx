import React from "react";
import {
  TrackRegion,
  TimelineEndBehavior,
  EasingFunction,
  InterpolationFunction,
  Animation,
  TrackLayerResolver
} from "../../utils/TrackUtils/trackUtils.types";
import { TickEvent, UpdateEvent, LoadEvent } from "./timeline.types";
import { gen } from "../../utils/TrackUtils/trackUtils";

export const TIMELINE_DEFAULTS = {
  intervalLength: 10,
  playbackSpeed: 1,
  onTick: () => {},
  onUpdate: () => {},
  onEnded: () => {},
  onLoad: () => {}
};

/**
 * Properties for the `Timeline` component.
 * @param State refers to the structure of the animation's state. Must be an object.
 */
export interface TimelineProps<State extends object = any> {
  /**
   * The array of regions that make up the animation.
   *
   * `track` is passed into `TrackUtils.gen()` immediately after `Timeline` mounts, calculating the `Animation`.
   * After `Timeline` initializes, it will not re-calculate the animation if `track` changes.
   */
  track: TrackRegion<State>[];

  /**
   * The animation's default state. Must be an object.
   *
   * `defaultState` is passed into `TrackUtils.gen()` immediately after `Timeline` mounts, calculating the `Animation`.
   * After `Timeline` initializes, it will not re-calculate the animation if `defaultState` changes.
   */
  defaultState: State;

  /**
   * The current frame of the animation, in milliseconds.
   *
   * Changing this prop triggers a refresh within `Timeline` that queries the animation and returns the current frame state via `onUpdate` asynchronously.
   */
  value: number;

  /**
   * Whether the animation is playing.
   *
   * While true, the interval within `Timeline` will run (as specified by the `interval` prop) and trigger `onTick` callbacks.
   */
  playing: boolean;

  /**
   * The timeline's playback speed multiplier.
   *
   * `1` (default) will play the animation at regular speed, `2` will play at double speed, `0.5` will play at half speed, etc.
   * Supply a negative number to play in reverse. For example, `-2` would play backwards at double speed.
   *
   * @default 1
   */
  playbackSpeed?: number;

  /**
   * The number of milliseconds the interval within `Timeline` will be set to, roughly corresponding to how often `onTick` callbacks will be triggered.
   *
   * This property implies a performance versus quality tradeoff: larger intervals will refresh the frame less frequently,
   * causing choppier animations but using less resources, whereas smaller intervals will have smaller gaps between refreshes but a greater performance cost.
   *
   * **This property is an approximation**, and will not match exactly with the values returned by `onTick`.
   * There are unavoidable (but minor) delays caused by querying the animation object and React renders, so expect less precision at the millisecond level.
   *
   * @default 10
   */
  interval?: number;

  /**
   * Describes how the engine will calculate frame states for time values greater than the length of the animation.
   *
   * @default "stop"
   */
  endBehavior?: TimelineEndBehavior;

  /**
   * Sets the animation's default easing function.
   *
   * If not defined, `TrackUtils.gen` will use its own default easing function.
   */
  easing?: EasingFunction;

  /**
   * Sets the animation's default interpolation function.
   *
   * If not defined, `TrackUtils.gen` will use its own default interpolation function.
   */
  interp?: InterpolationFunction;

  /**
   * Sets the animation's default layer resolver.
   *
   * If not defined, `TrackUtils.gen` will use its own default layer resolver.
   */
  resolver?: TrackLayerResolver<State>;

  /**
   * If `playing` is true, this callback will fire approximately every `interval`.
   *
   * `event.value` will be equal to the time value when the event was created.
   *
   * Useful if a parent component is storing the animation's time value as state.
   */
  onTick?: (event: TickEvent) => void;

  /**
   * Will fire with the current frame state according to `value` whenever `value` changes.
   *
   * Useful if a parent component is storing the animation's frame state.
   */
  onUpdate?: (event: UpdateEvent<State>) => void;

  /**
   * Will fire when `value` is greater than or equal to the length of the track or when `value` is less than zero.
   *
   * May trigger more than once.
   */
  onEnded?: () => void;

  /**
   * Will fire when `Timeline` initializes, returning the `Animation` calculated by `TrackUtils.gen()`.
   */
  onLoad?: (event: LoadEvent<State>) => void;
}

const Timeline = <State extends object = any>(
  props: React.PropsWithChildren<TimelineProps<State>>
): null => {
  const {
    track,
    defaultState,
    value,
    playing,
    playbackSpeed = TIMELINE_DEFAULTS.playbackSpeed,
    interval: intervalLength = TIMELINE_DEFAULTS.intervalLength,
    endBehavior: endBehaviorProp,
    easing,
    interp,
    resolver,
    onTick = TIMELINE_DEFAULTS.onTick,
    onUpdate = TIMELINE_DEFAULTS.onUpdate,
    onEnded = TIMELINE_DEFAULTS.onEnded,
    onLoad = TIMELINE_DEFAULTS.onLoad
  } = props;

  const animation = React.useRef<Animation<State>>();
  const interval = React.useRef<NodeJS.Timeout>();
  const [hasInit, setHasInit] = React.useState(false);
  const [queued, setQueued] = React.useState(0);
  const [lastPoll, setLastPoll] = React.useState(0);
  const [lastTime, setLastTime] = React.useState<number | null>(null);
  const [hasEnded, setHasEnded] = React.useState(false);

  /** Generate animation */
  React.useEffect(() => {
    if (!hasInit) {
      const anim = gen(track, defaultState, {
        endBehavior: endBehaviorProp,
        easing,
        interp,
        resolver
      });
      animation.current = anim;
      setHasInit(true);
      onLoad({ animation: anim });
    }
  }, [
    hasInit,
    track,
    defaultState,
    endBehaviorProp,
    easing,
    interp,
    resolver,
    onLoad
  ]);

  /** Re-init animation when config changes */
  React.useEffect(() => {
    setHasInit(false);
  }, [endBehaviorProp, easing, interp, resolver]);

  /** Set interval */
  React.useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
    if (!playing) {
      setLastTime(null);
      return;
    }
    interval.current = setInterval(() => {
      const now = Date.now();
      const last = lastTime ?? now - intervalLength;
      const diff = (now - last) * playbackSpeed;

      setQueued(q => q + diff);
      setLastTime(now);
    }, intervalLength);

    return (): void => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [playing, intervalLength, lastTime, playbackSpeed]);

  /** Send ticks */
  React.useEffect(() => {
    if (!animation.current || !queued) {
      return;
    }

    setQueued(0);

    let newValue = value + queued;
    const length = animation.current.length;
    const endBehavior = animation.current.config.endBehavior;
    let willReportHasEnded = false;

    if (newValue >= length) {
      if (endBehavior === "stop") {
        newValue = length;
      } else if (endBehavior === "loop" || endBehavior === "boomerang") {
        newValue = length ? newValue % length : 0;
      }
      willReportHasEnded = true;
    }
    if (newValue < 0) {
      if (endBehavior === "stop") {
        newValue = 0;
      } else if (endBehavior === "loop" || endBehavior === "boomerang") {
        newValue = length - (length ? newValue % length : 0);
      }
      willReportHasEnded = true;
    }

    if (willReportHasEnded) {
      if (!hasEnded) {
        onEnded();
        setHasEnded(true);
      }
    } else {
      if (hasEnded) {
        setHasEnded(false);
      }
    }

    onTick({ value: newValue });
  }, [onTick, value, queued, onEnded, hasEnded]);

  /** Get new state for value */
  React.useEffect(() => {
    if (!animation.current || lastPoll === value) {
      return;
    }
    const newState = animation.current.getFrameState(value);

    onUpdate({ state: newState });
    setLastPoll(value);
  }, [lastPoll, onUpdate, value]);

  return null;
};

export default Timeline;

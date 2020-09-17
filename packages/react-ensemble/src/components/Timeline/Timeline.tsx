import React from "react";
import {
  ITrackRegion,
  TimelineEndBehavior,
  EasingFunction,
  InterpolationFunction,
  IAnimation
} from "../../utils/TrackUtils/trackUtils.types";
import { ITickEvent, IUpdateEvent, ILoadEvent } from "./timeline.types";
import { gen } from "../../utils/TrackUtils/trackUtils";

export const TIMELINE_DEFAULTS = {
  intervalLength: 10,
  playbackSpeed: 1,
  onTick: () => {},
  onUpdate: () => {},
  onEnded: () => {},
  onLoad: () => {}
};

export interface ITimelineProps<State extends object = {}> {
  track: ITrackRegion<State>[];
  defaultState: State;

  value: number;
  playing: boolean;

  /**
   * The timeline's playback speed multiplier. `1` (default) will play the animation at regular speed,
   * `2` will play at double speed, `0.5` will play at half speed, etc.
   *
   * Supply a negative number to play in reverse. For example, `-2` would play backwards at double speed.
   * @default 1
   */
  playbackSpeed?: number;
  /** @default 10 */
  interval?: number;
  /** @default "stop" */
  endBehavior?: TimelineEndBehavior;

  easing?: EasingFunction;
  interp?: InterpolationFunction;

  onTick?: (event: ITickEvent) => void;
  onUpdate?: (event: IUpdateEvent<State>) => void;
  onEnded?: () => void;
  onLoad?: (event: ILoadEvent<State>) => void;
}

const Timeline = <State extends object = {}>(
  props: React.PropsWithChildren<ITimelineProps<State>>
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
    onTick = TIMELINE_DEFAULTS.onTick,
    onUpdate = TIMELINE_DEFAULTS.onUpdate,
    onEnded = TIMELINE_DEFAULTS.onEnded,
    onLoad = TIMELINE_DEFAULTS.onLoad
  } = props;

  const animation = React.useRef<IAnimation<State>>();
  const interval = React.useRef<NodeJS.Timeout>();
  const [hasInit, setHasInit] = React.useState(false);
  const [queued, setQueued] = React.useState(0);
  const [lastPoll, setLastPoll] = React.useState(0);
  const [lastTime, setLastTime] = React.useState<number | null>(null);
  const [hasEnded, setHasEnded] = React.useState(false);

  // const isReverse = playbackSpeed < 0;

  /** Generate animation */
  React.useEffect(() => {
    if (!hasInit) {
      const anim = gen(track, defaultState, {
        endBehavior: endBehaviorProp,
        easing,
        interp
      });
      animation.current = anim;
      setHasInit(true);
      onLoad({ animation: anim });
    }
  }, [hasInit, track, defaultState, endBehaviorProp, easing, interp, onLoad]);

  /** Re-init animation when config changes */
  React.useEffect(() => {
    setHasInit(false);
  }, [endBehaviorProp, easing, interp]);

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

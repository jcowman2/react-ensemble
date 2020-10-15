import React from "react";
import { Direction, ControlPanelProps } from "./controller.types";
import SimpleControlPanel from "../SimpleControlPanel/SimpleControlPanel";
import { TimelineProps } from "../Timeline/Timeline";
import { Animation } from "../../utils/TrackUtils/trackUtils.types";

const DEFAULT_VISIBLE = true;
const DEFAULT_TRIGGER = "manual";
const DEFAULT_NORMAL_PLAYBACK_SPEED = 1;
const DEFAULT_FAST_FORWARD_MODIFIER = 2;
const DEFAULT_REVERSE_MODIFIER = -2;
const DEFAULT_PANEL_STYLE = {};
const DEFAULT_PANEL = SimpleControlPanel;

/**
 * Properties for the `Controller` component.
 * @param State refers to the structure of the animation's state. Must be an object.
 */
export interface ControllerProps<State extends object = any> {
  /**
   * Provides a subset of configured Timeline props that can be used to manage a `Timeline` automatically.
   *
   * The configured props include:
   * - value
   * - playing
   * - playbackSpeed
   * - onTick
   * - onEnded
   * - onLoad
   *
   * `Controller` will configure the value of these timeline properties based on its own props, including `trigger`, `normalPlaybackSpeed`, and `panel`.
   *
   * This type of prop is called a **render prop** because the `Controller` uses it to know what to render.
   * Use it by putting a function in between your `<Controller>` tags.
   */
  children: (
    controlProps: Pick<
      TimelineProps<State>,
      "value" | "playing" | "playbackSpeed" | "onTick" | "onEnded" | "onLoad"
    >
  ) => JSX.Element;

  /**
   * Whether the playback `panel` is visible.
   * @default true
   */
  visible?: boolean;

  /**
   * Whether the configured `Timeline` should play automatically or wait for a manual trigger.
   * @default "manual"
   */
  trigger?: "manual" | "auto";

  /**
   * The `playbackSpeed` to pass to the configured `Timeline` via the `children` render prop when the `panel` is in normal playback mode.
   * @default 1
   */
  normalPlaybackSpeed?: number;

  /**
   * Is multiplied with `normalPlaybackSpeed` to calculate the `playbackSpeed` passed to the configured `Timeline` when the `panel` is in fast-forward playback mode.
   * @default 2
   */
  fastForwardModifier?: number;

  /**
   * Is multiplied with `normalPlaybackSpeed` to calculate the `playbackSpeed` passed to the configured `Timeline` when the `panel` is in reverse playback mode.
   * @default -2
   */
  reverseModifier?: number;

  /**
   * The CSS style object passed to the `<div>` that contains the `panel`.
   *
   * This prop is best suited for minor style adjustments. For more granular control over the panel's appearance, override the `panel` prop instead.
   * @default {}
   */
  panelStyle?: object;

  /**
   * Renders a generic playback control panel for an animation based on props configured by `Controller` and its managed `Timeline`.
   *
   * Provides all the data necessary to render a responsive playback control with play/pause, fast-forward, reverse, and progress bar features.
   * Includes both current information about the managed `Timeline` and a suite of callback functions to control it.
   *
   * Will render a basic, unstyled control panel by default intended for demo purposes.
   * @default SimpleControlPanel
   */
  panel?: (props: ControlPanelProps) => JSX.Element;
}

/**
 * The `Controller` component is an optional wrapper for the `Timeline` that automatically configures time and playback controls.
 *
 * It can manage the `Timeline` invisibly (for instance, if you want your animation to play automatically),
 * but the `Controller` also provides an animation playback UI that works without any configuration.
 * You can replace this playback control UI with custom elements as well.
 */
const Controller = <State extends object = any>(
  props: ControllerProps<State>
): JSX.Element | null => {
  const {
    children,
    visible = DEFAULT_VISIBLE,
    trigger = DEFAULT_TRIGGER,
    normalPlaybackSpeed = DEFAULT_NORMAL_PLAYBACK_SPEED,
    fastForwardModifier = DEFAULT_FAST_FORWARD_MODIFIER,
    reverseModifier = DEFAULT_REVERSE_MODIFIER,
    panelStyle = DEFAULT_PANEL_STYLE,
    panel = DEFAULT_PANEL
  } = props;

  const [playing, setPlaying] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  const [animation, setAnimation] = React.useState<Animation<State>>();
  const [shouldResetOnPlay, setShouldResetOnPlay] = React.useState(false);
  const [direction, setDirection] = React.useState<Direction>(Direction.Normal);

  const endBehavior = animation?.config.endBehavior;
  const fastForwardSpeed = normalPlaybackSpeed * fastForwardModifier;
  const reverseSpeed = normalPlaybackSpeed * reverseModifier;
  const playbackSpeed =
    direction === Direction.Normal
      ? normalPlaybackSpeed
      : direction === Direction.FastForward
      ? fastForwardSpeed
      : reverseSpeed;

  React.useEffect(() => {
    switch (trigger) {
      case "auto":
        return setPlaying(true);
      case "manual":
        return;
      default:
        throw new Error(`Illegal trigger "${trigger}"`);
    }
  }, [trigger]);

  const handleSliderChange = (value: number) => {
    if (animation?.length) {
      if (value < animation.length && shouldResetOnPlay) {
        setShouldResetOnPlay(false);
      }
    }
    setTick(value);
  };

  const handleEnded = () => {
    if (!endBehavior) {
      return;
    }

    if (endBehavior === "stop") {
      setPlaying(false);
      setShouldResetOnPlay(true);
      setDirection(Direction.Normal);
    }
  };

  const handlePlay = () => {
    if (shouldResetOnPlay) {
      setShouldResetOnPlay(false);
      setTick(0);
    }
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
    setDirection(Direction.Normal);
  };

  const handleReverse = () => {
    if (direction === Direction.Reverse) {
      setDirection(Direction.Normal);
      setPlaying(false);
      return;
    }

    if (tick <= 0 && (endBehavior === "stop" || endBehavior === "continue")) {
      return;
    }

    setDirection(Direction.Reverse);
    setPlaying(true);

    if (shouldResetOnPlay) {
      setShouldResetOnPlay(false);
    }
  };

  const handleFastForward = () => {
    if (direction === Direction.FastForward) {
      setDirection(Direction.Normal);
      setPlaying(false);
      return;
    }
    setDirection(Direction.FastForward);
    handlePlay();
  };

  return (
    <>
      {visible && (
        <div style={panelStyle}>
          {panel({
            tick,
            direction,
            length: animation?.length ?? null,
            playing,
            play: handlePlay,
            pause: handlePause,
            fastForward: handleFastForward,
            reverse: handleReverse,
            setTick: handleSliderChange
          })}
        </div>
      )}
      {children?.({
        playing,
        value: tick,
        onTick: ({ value }) => setTick(value),
        playbackSpeed,
        onLoad: ({ animation }) => setAnimation(animation),
        onEnded: handleEnded
      })}
    </>
  );
};

export default Controller;

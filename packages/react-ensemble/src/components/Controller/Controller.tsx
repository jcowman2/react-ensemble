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

export interface ControllerProps<State extends object = any> {
  children: (
    controlProps: Pick<
      TimelineProps<State>,
      "value" | "playing" | "playbackSpeed" | "onTick" | "onEnded" | "onLoad"
    >
  ) => JSX.Element;
  visible?: boolean;
  trigger?: "manual" | "auto";
  normalPlaybackSpeed?: number;
  fastForwardModifier?: number;
  reverseModifier?: number;
  panelStyle?: object;
  panel?: (props: ControlPanelProps) => JSX.Element;
}

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

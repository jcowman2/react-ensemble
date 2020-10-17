/**
 * Enumeration of all possible playback modes in a `Controller`.
 */
export enum Direction {
  /** The animation is playing forwards at normal speed. */
  Normal,

  /**
   * The animation is playing forwards at a faster speed. The exact rate is configured by `Controller`.
   */
  FastForward,

  /**
   * The animation is playing backwards, sometimes at a faster speed. The exact rate is configured by `Controller`.
   */
  Reverse
}

/**
 * Includes all the data necessary to render a responsive playback control with play/pause, fast-forward, reverse, and progress bar features.
 *
 * Used primarily by `Controller` to communicate with its `panel` prop, which is `SimpleControlPanel` by default.
 */
export interface ControlPanelProps {
  /** The track's time position (in milliseconds).  */
  tick: number;

  /** The length of the animation (in milliseconds). */
  length: number | null;

  /** Whether the animation is playing. */
  playing: boolean;

  /** The mode of playback. */
  direction: Direction;

  /** Callback to signal a manual tick change. */
  setTick: (tick: number) => void;

  /** Callback to signal a manual play. */
  play: () => void;

  /** Callback to signal a manual pause. */
  pause: () => void;

  /** Callback to signal a manual fast-forward toggle (on or off). */
  fastForward: () => void;

  /** Callback to signal a manual reverse toggle (on or off). */
  reverse: () => void;
}

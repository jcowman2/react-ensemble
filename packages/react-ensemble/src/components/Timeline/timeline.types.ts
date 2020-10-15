import { Animation } from "../../utils/TrackUtils/trackUtils.types";

/**
 * Event payload returned by `Timeline` on each tick.
 */
export interface TickEvent {
  /** The track's time position (in milliseconds). */
  value: number;
}

/**
 * Event payload returned by `Timeline` every time its time value updates.
 */
export interface UpdateEvent<State extends object = any> {
  /** The animation's frame state at the time the event was generated. */
  state: State;
}

/**
 * Event payload returned by `Timeline` when it finishes initializing the animation.
 */
export interface LoadEvent<State extends object = any> {
  /** The generated animation. */
  animation: Animation<State>;
}

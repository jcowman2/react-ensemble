import { Animation } from "../../utils/TrackUtils/trackUtils.types";

/**
 * Event returned by `Timeline` on each tick
 */
export interface TickEvent {
  /** The track's time position (in ms) */
  value: number;
}

export interface UpdateEvent<State extends object = any> {
  state: State;
}

export interface LoadEvent<State extends object = any> {
  animation: Animation<State>;
}

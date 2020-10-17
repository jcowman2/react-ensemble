import { TrackConfig, TrackRegionAtom, RegionState } from "../trackUtils.types";
import { isFunction } from "../helpers";

interface InterpolateStateResult<State> {
  progress: number;
  state: State;
}

/** Builds an atomic state interpolator ;) */
export const buildAtomicStateInterpolator = <State extends object>(
  region: Pick<
    Required<TrackRegionAtom<State>>,
    "easing" | "interp" | "start" | "duration" | "state"
  >,
  config: Required<TrackConfig<State>>
): ((current: number) => InterpolateStateResult<State>) => {
  const easingFn = region.easing ?? config.easing;
  const interpFn = region.interp ?? config.interp;

  const { start, duration, state } = region;

  return (current: number) => {
    const local = Math.min(Math.max(current - start, 0), duration);
    const localNormalized = duration ? local / duration : 0;
    const eased = easingFn(localNormalized);

    const newState = {} as State;

    for (const key in region.state) {
      const { set, to, from } = state[key]!;

      if (set !== undefined) {
        newState[key] = set as State[Extract<keyof State, string>];
        continue;
      }

      if (to === undefined) {
        continue;
      }

      newState[key] = interpFn<State[typeof key]>(from!, to)(eased);
    }
    return { progress: eased, state: newState };
  };
};

export const createDeltaState = <State extends object>(
  prev: State,
  next: RegionState<State>
): { state: State; regionState: RegionState<State> } => {
  const state = {} as State;
  const delta: RegionState<State> = {};

  for (const key in prev) {
    const prevValue = prev[key];
    const nextValue = next[key];

    if (!nextValue) {
      delta[key] = { set: prevValue };
      state[key] = prevValue;
      continue;
    }

    const { to, from, set } = nextValue!;

    if (set !== undefined) {
      const setCalculated = isFunction(set) ? set(prevValue) : set;
      delta[key] = { set: setCalculated };
      state[key] = setCalculated;
      continue;
    }
    if (to === undefined) {
      throw new Error(
        "The 'set' or 'to' property must exist on any given property directive"
      );
    }

    const fromPrev = from === undefined ? prevValue : from;
    delta[key] = { from: fromPrev, to };
    state[key] = to;
  }

  return { state, regionState: delta };
};

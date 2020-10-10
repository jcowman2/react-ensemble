import { IValidatedTrackRegionAtom } from "../trackUtils.types";
import { isNumber } from "./helpers";

interface IGenLoopRegionResponse<State extends object> {
  loopGetter: (current: number) => State;
  newDuration: number;
  newEnd: number;
  isPassive: boolean;
}

export const clampToLoop = (length: number) => (current: number) =>
  length ? current % length : 0;

export const clampToBoomerang = (length: number) => (current: number) => {
  const modCurrent = length ? current % length : 0;
  return modCurrent <= length / 2 ? modCurrent : length - modCurrent;
};

export const genLoopRegion = <State extends object>(
  region: Pick<
    IValidatedTrackRegionAtom<State>,
    "loop" | "duration" | "end" | "start"
  >,
  stateGetter: (current: number) => State,
  nextRegionStart?: number
): IGenLoopRegionResponse<State> => {
  const { loop, start, duration: givenDuration, end: givenEnd } = region;

  if (!loop) {
    return {
      loopGetter: stateGetter,
      newDuration: givenDuration,
      newEnd: givenEnd,
      isPassive: false
    };
  }

  const isBoomerang = typeof loop === "object" && loop.boomerang;

  let isPassive = false;
  let newDuration = givenDuration;
  let newEnd = givenEnd;

  if (typeof loop === "object") {
    const countDefined = isNumber(loop.count);
    const untilDefined = isNumber(loop.until);
    const durationDefined = isNumber(loop.duration);

    const numDefined = [countDefined, untilDefined, durationDefined].filter(
      bool => bool
    ).length;

    if (numDefined !== 1) {
      if (numDefined !== 0) {
        throw new Error(
          "A loop region may have one or zero of these loop config fields, but no more: [count, until, duration]."
        );
      }
      isPassive = true;
    } else {
      if (countDefined) {
        const loopSensitiveDuration = isBoomerang
          ? givenDuration * 2
          : givenDuration;
        newDuration = loopSensitiveDuration * (loop.count! + 1);
      } else if (untilDefined) {
        newDuration = loop.until! - start;
      } else if (durationDefined) {
        newDuration = loop.duration!;
      }
      newEnd = start + newDuration;
    }
  } else {
    isPassive = true;
  }

  if (isPassive) {
    newEnd = nextRegionStart ?? Number.MAX_SAFE_INTEGER;
    newDuration = newEnd - start;
  }

  const clamp = isBoomerang
    ? clampToBoomerang(givenDuration * 2)
    : clampToLoop(givenDuration);

  const loopGetter = (current: number) => {
    return stateGetter(clamp(current - start) + start);
  };

  return { loopGetter, newDuration, newEnd, isPassive };
};

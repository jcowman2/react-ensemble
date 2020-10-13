import {
  ITrackRegionAtom,
  ICalculatedTrackRegion,
  TrackRegionContext
} from "../trackUtils.types";
import { newId, clampString, isNumber } from "../helpers";

export const genPadRegion = <S extends object>(
  start: number,
  end: number,
  rawState: S,
  layer: string
): ICalculatedTrackRegion<S> => ({
  id: newId("region_pad"),
  start,
  end,
  layer,
  activeVars: new Set(),
  get: () => ({ ...rawState })
});

export const getRegionSummary = <State extends object>(
  region: ITrackRegionAtom<State>
) => `with state '${clampString(JSON.stringify(region.state || {}))}'`;

export const findRegionBoundsAndPad = <State extends object>(
  region: ITrackRegionAtom<State>,
  regionContext: TrackRegionContext,
  currentTime: number,
  currentState: State,
  track: ITrackRegionAtom<State>[]
) => {
  const { layerName, index, throwErr } = regionContext;
  const startDefined = isNumber(region.start);
  const durationDefined = isNumber(region.duration);
  const endDefined = isNumber(region.end);

  let newTime = currentTime;
  let start: number;
  let duration: number;
  let end: number;
  let padRegion: ICalculatedTrackRegion<State> | undefined = undefined;

  if (!(startDefined || durationDefined || endDefined)) {
    throwErr(
      "Each region must have at least its start, duration, or end defined."
    );
  }

  if (region.loop) {
    if (!durationDefined) {
      throwErr("Atomic loop regions must have a defined duration.");
    }
    if (endDefined) {
      throwErr(
        "The atomic loop region has a top-level 'end' property defined. To make the region loop until a given time, use the 'loop.until' property instead."
      );
    }
  }

  if (startDefined) {
    start = region.start!;

    if (start < newTime) {
      throwErr(
        `The region's start (${start}) must not be less than the calculated current time (${newTime}). Did you forget to specify a layer?`
      );
    }

    if (start > newTime) {
      padRegion = genPadRegion(newTime, start, currentState, layerName);
      newTime = start;
    }
  } else {
    start = newTime;
  }

  if (endDefined && region.end! < newTime) {
    throwErr(
      `The region's end (${region.end}) must not be less than the calculated current time (${newTime}).`
    );
  }

  if (durationDefined) {
    if (region.duration! < 0) {
      throwErr("Duration must not be negative.");
    }
    duration = region.duration!;
    if (endDefined && region.end! !== duration) {
      throwErr(
        `The region's end (${region.end}) must match the calculated duration (${duration}) plus the calculated current time (${newTime}).`
      );
    }
    end = start + duration;
  } else {
    if (endDefined) {
      end = region.end!;
    } else {
      if (index + 1 === track.length) {
        throwErr("The last region must have a duration or an end defined.");
      }
      const next = track[index + 1];
      if (next.start === undefined) {
        throwErr(
          "If a region does not have a duration or an end, the next region must have its start defined."
        );
      }
      end = next.start!;
    }
    duration = end - start;
  }

  newTime += duration;

  return { start, end, duration, newTime, padRegion };
};

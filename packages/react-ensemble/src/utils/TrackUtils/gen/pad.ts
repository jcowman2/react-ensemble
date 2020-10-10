import { ITrackRegionAtom, ICalculatedTrackRegion } from "../trackUtils.types";
import { newId, clampString, isNumber } from "./helpers";

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
  index: number,
  currentTime: number,
  currentState: State,
  layerName: string,
  track: ITrackRegionAtom<State>[]
) => {
  const startDefined = isNumber(region.start);
  const durationDefined = isNumber(region.duration);
  const endDefined = isNumber(region.end);

  let newTime = currentTime;
  let start: number;
  let duration: number;
  let end: number;
  let padRegion: ICalculatedTrackRegion<State> | undefined = undefined;

  if (!(startDefined || durationDefined || endDefined)) {
    throw new Error(
      `Each region must have at least its start, duration, or end defined. The region ${getRegionSummary(
        region
      )} is missing all three.`
    );
  }

  if (region.loop) {
    if (!durationDefined) {
      throw new Error(
        `Loop regions must have a defined duration. The region ${getRegionSummary(
          region
        )} does not.`
      );
    }
    if (endDefined) {
      throw new Error(
        `The loop region ${getRegionSummary(
          region
        )} has a top-level end property defined. To make the region loop until a given time, using the loop.until property instead.`
      );
    }
  }

  if (startDefined) {
    start = region.start!;

    if (start < newTime) {
      throw new Error(
        `Start (${start}) for region ${getRegionSummary(
          region
        )} must not be less than the calculated current time (${newTime}) in layer '${layerName}'. Did you forget to specify a layer?`
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
    throw new Error(
      `End (${region.end}) for region ${getRegionSummary(
        region
      )} must not be less than the calculated current time (${newTime}).`
    );
  }

  if (durationDefined) {
    if (region.duration! < 0) {
      throw new Error(
        `Duration must not be negative for region ${getRegionSummary(region)}.`
      );
    }
    duration = region.duration!;
    if (endDefined && region.end! !== duration) {
      throw new Error(
        `End (${region.end}) for region ${getRegionSummary(
          region
        )} must match the calculated duration (${duration}) plus the calculated current time (${newTime}).`
      );
    }
    end = start + duration;
  } else {
    if (endDefined) {
      end = region.end!;
    } else {
      if (index + 1 === track.length) {
        throw new Error(
          `The last region must have a duration or end defined. Check region ${getRegionSummary(
            region
          )}.`
        );
      }
      const next = track[index + 1];
      if (next.start === undefined) {
        throw new Error(
          `If omitting a region's duration and end, the next region must have a start defined. Check region ${getRegionSummary(
            region
          )}.`
        );
      }
      end = next.start!;
    }
    duration = end - start;
  }

  newTime += duration;

  return { start, end, duration, newTime, padRegion };
};

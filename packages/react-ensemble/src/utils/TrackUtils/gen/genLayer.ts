import {
  ITrackRegion,
  ITrackConfig,
  ICalculatedTrackRegion,
  RegionState
} from "../trackUtils.types";
import { clampString, newId, isNumber } from "./helpers";
import { buildAtomicStateInterpolator, createDeltaState } from "./stateUtils";
import { genLoopRegion } from "./loop";

interface IGenLayerResult<State extends object> {
  regions: ICalculatedTrackRegion<State>[];
  length: number;
}

const genPadRegion = <S extends object, R extends RegionState<S>>(
  start: number,
  end: number,
  stateChanges: R,
  rawState: S,
  layer: string
): ICalculatedTrackRegion<S> => ({
  id: newId("region_pad"),
  start,
  end,
  duration: end - start,
  state: stateChanges,
  easing: null,
  interp: null,
  layer,
  activeVars: new Set(),
  get: () => ({ ...rawState }),
  loop: false
});

const getRegionSummary = <State extends object>(region: ITrackRegion<State>) =>
  `with state '${clampString(JSON.stringify(region.state || {}))}'`;

const findRegionBoundsAndPad = <State extends object>(
  region: ITrackRegion<State>,
  index: number,
  currentTime: number,
  currentState: State,
  layerName: string,
  track: ITrackRegion<State>[]
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
      const { regionState } = createDeltaState(currentState, {});

      padRegion = genPadRegion(
        newTime,
        start,
        regionState,
        currentState,
        layerName
      );

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

export const genLayer = <State extends object>(
  layerName: string,
  track: ITrackRegion<State>[],
  defaultState: State,
  config: Required<ITrackConfig<State>>
): IGenLayerResult<State> => {
  let currentTime = 0;
  const regions: ICalculatedTrackRegion<State>[] = [];

  let workingState = { ...defaultState };
  let endsWithPassiveLoop = false;

  track.forEach((region, index) => {
    const boundResult = findRegionBoundsAndPad(
      region,
      index,
      currentTime,
      workingState,
      layerName,
      track
    );

    const { start, end, duration, newTime, padRegion } = boundResult;
    currentTime = newTime;

    if (padRegion) {
      regions.push(padRegion);
    }

    const providedState = region.state || {};
    const providedLoop = region.loop ?? false;

    const { state, regionState } = createDeltaState(
      workingState,
      providedState
    );

    const partialRegion = {
      id: newId("region"),
      start,
      duration,
      end,
      state: regionState,
      easing: region.easing ?? null,
      interp: region.interp ?? null,
      layer: layerName,
      activeVars: new Set(Object.keys(providedState)) as Set<keyof State>,
      loop: providedLoop
    };

    const stateInterpolator = buildAtomicStateInterpolator(
      partialRegion,
      config
    );

    const stateGetter = (current: number) => stateInterpolator(current).state;
    let restRegionConfig: { get: (current: number) => State } & Partial<
      ICalculatedTrackRegion<State>
    > = { get: stateGetter };

    if (providedLoop) {
      let nextRegionStart: number | undefined;
      const atEnd = index === track.length - 1;

      if (!atEnd) {
        nextRegionStart = track[index + 1].start;
        if (!nextRegionStart || nextRegionStart < end) {
          throw new Error(
            `If a passive loop region takes place before the last region of a track, the following region must have its start property defined`
          ); // TODO describe better
        }
      }

      const { loopGetter, newDuration, newEnd, isPassive } = genLoopRegion(
        partialRegion,
        stateGetter,
        nextRegionStart
      );

      if (atEnd && isPassive) {
        endsWithPassiveLoop = true;
      } else {
        currentTime = newEnd;
      }

      restRegionConfig = {
        get: loopGetter,
        duration: newDuration,
        end: newEnd
      };
    }

    const fullRegion = {
      ...partialRegion,
      ...restRegionConfig
    };

    regions.push(fullRegion);

    workingState = state;
  });

  if (!endsWithPassiveLoop) {
    const { regionState } = createDeltaState(workingState, {});

    regions.push(
      genPadRegion(
        currentTime,
        Number.MAX_SAFE_INTEGER,
        regionState,
        workingState,
        layerName
      )
    );
  }

  return { regions, length: currentTime };
};

import {
  CalculatedTrackRegion,
  TrackConfig,
  TrackRegion,
  TrackRegionAtom,
  TrackRegionContext
} from "../trackUtils.types";
import { newId } from "../helpers";
import { parseLoopRegionInLayer } from "./loop";
import { findRegionBoundsAndPad } from "./pad";
import { createDeltaState, buildAtomicStateInterpolator } from "./stateUtils";

const FORBIDDEN_FIELDS = ["regions", "relativeTime"];

export const parseAtom = <State extends object>(
  region: TrackRegionAtom,
  regionContext: TrackRegionContext,
  currentTime: number,
  workingState: State,
  track: TrackRegion<State>[],
  config: Required<TrackConfig<State>>
) => {
  const { layerName, throwErr } = regionContext;

  for (const field of FORBIDDEN_FIELDS) {
    if (region[field] !== undefined) {
      throwErr(`An atom may not contain the '${field}' property.`);
    }
  }

  const boundResult = findRegionBoundsAndPad(
    region,
    regionContext,
    currentTime,
    workingState,
    track
  );

  const { start, end, duration, newTime, padRegion } = boundResult;

  let willUpdateToTime = newTime;
  const newRegions: CalculatedTrackRegion[] = [];
  let newWorkingState = workingState;
  let determinedEndsWithPassiveLoop = false;

  if (padRegion) {
    newRegions.push(padRegion);
  }

  const providedState = region.state || {};
  const providedLoop = region.loop ?? false;

  const { state, regionState } = createDeltaState(
    newWorkingState,
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

  const stateInterpolator = buildAtomicStateInterpolator(partialRegion, config);

  const stateGetter = (current: number) => stateInterpolator(current).state;
  let restRegionConfig: { get: (current: number) => State } & Partial<
    Required<TrackRegionAtom<State>>
  > = { get: stateGetter };

  if (providedLoop) {
    const {
      loopGetter,
      newDuration,
      newEnd,
      endsWithPassiveLoop
    } = parseLoopRegionInLayer(
      partialRegion,
      regionContext,
      track,
      stateGetter
    );

    if (endsWithPassiveLoop) {
      determinedEndsWithPassiveLoop = true;
    } else {
      willUpdateToTime = newEnd;
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

  newRegions.push(fullRegion);
  newWorkingState = state;

  return {
    willUpdateToTime,
    newRegions,
    newWorkingState,
    determinedEndsWithPassiveLoop
  };
};

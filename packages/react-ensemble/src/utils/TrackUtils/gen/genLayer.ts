import {
  TrackConfig,
  CalculatedTrackRegion,
  TrackRegion,
  TrackRegionContext
} from "../trackUtils.types";
import { isGroup, parseGroup } from "./parseGroup";
import { parseAtom } from "./parseAtom";
import { genPadRegion } from "./pad";
import { errorThrower } from "./validation";
import { isNumber } from "../helpers";

interface GenLayerResult<State extends object> {
  regions: CalculatedTrackRegion<State>[];
  length: number;
}

const genRegionContext = (
  layerName: string,
  index: number
): TrackRegionContext => ({
  layerName,
  index,
  throwErr: errorThrower(layerName, index)
});

const offsetTrack = <State extends object>(
  track: TrackRegion<State>[],
  startOffset: number
) => {
  return track.map(region => {
    const newRegion = { ...region };
    if (isNumber(newRegion.start)) {
      newRegion.start -= startOffset;
    }
    if (isNumber(newRegion.end)) {
      newRegion.end -= startOffset;
    }
    if (typeof newRegion.loop === "object" && isNumber(newRegion.loop.until)) {
      newRegion.loop.until -= startOffset;
    }

    return newRegion;
  });
};

export const genLayer = <State extends object>(
  layerName: string,
  rawTrack: TrackRegion<State>[],
  defaultState: State,
  config: Required<TrackConfig<State>>,
  startOffset: number
): GenLayerResult<State> => {
  let currentTime = 0;
  const regions: CalculatedTrackRegion<State>[] = [];

  let workingState = { ...defaultState };
  let endsWithPassiveLoop = false;
  let track = rawTrack;

  if (startOffset) {
    track = offsetTrack(rawTrack, startOffset);
  }

  track.forEach((region, index) => {
    const regionContext = genRegionContext(layerName, index);

    if (isGroup(region)) {
      const {
        willUpdateToTime,
        newRegions,
        newWorkingState,
        determinedEndsWithPassiveLoop
      } = parseGroup(
        region,
        regionContext,
        currentTime,
        workingState,
        track,
        config
      );

      currentTime = willUpdateToTime;
      workingState = newWorkingState;
      endsWithPassiveLoop = determinedEndsWithPassiveLoop;
      regions.push(...newRegions);
    } else {
      const {
        willUpdateToTime,
        newRegions,
        newWorkingState,
        determinedEndsWithPassiveLoop
      } = parseAtom(
        region,
        regionContext,
        currentTime,
        workingState,
        track,
        config
      );

      currentTime = willUpdateToTime;
      workingState = newWorkingState;
      endsWithPassiveLoop = determinedEndsWithPassiveLoop;
      regions.push(...newRegions);
    }
  });

  if (!endsWithPassiveLoop) {
    regions.push(
      genPadRegion(
        currentTime,
        Number.MAX_SAFE_INTEGER,
        workingState,
        layerName
      )
    );
  }

  return { regions, length: currentTime };
};

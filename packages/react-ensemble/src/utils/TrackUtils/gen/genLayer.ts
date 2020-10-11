import {
  ITrackConfig,
  ICalculatedTrackRegion,
  ITrackRegion,
  TrackRegionContext
} from "../trackUtils.types";
import { isGroup, parseGroup } from "./parseGroup";
import { parseAtom } from "./parseAtom";
import { genPadRegion } from "./pad";
import { errorThrower } from "./validation";

interface IGenLayerResult<State extends object> {
  regions: ICalculatedTrackRegion<State>[];
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

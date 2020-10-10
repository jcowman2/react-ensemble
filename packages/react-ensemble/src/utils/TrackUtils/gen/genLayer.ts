import {
  ITrackConfig,
  ICalculatedTrackRegion,
  ITrackRegion
} from "../trackUtils.types";
import { createDeltaState } from "./stateUtils";
import { isGroup, parseGroup } from "./parseGroup";
import { parseAtom } from "./parseAtom";
import { genPadRegion } from "./pad";

interface IGenLayerResult<State extends object> {
  regions: ICalculatedTrackRegion<State>[];
  length: number;
}

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
    if (isGroup(region)) {
      const { newRegions, animationEnd, newWorkingState } = parseGroup(
        region,
        index,
        currentTime,
        workingState,
        layerName,
        track,
        config
      );

      currentTime = animationEnd;
      workingState = newWorkingState;
      regions.push(...newRegions);
    } else {
      const {
        willUpdateToTime,
        newRegions,
        newWorkingState,
        determinedEndsWithPassiveLoop
      } = parseAtom(
        region,
        index,
        currentTime,
        workingState,
        layerName,
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

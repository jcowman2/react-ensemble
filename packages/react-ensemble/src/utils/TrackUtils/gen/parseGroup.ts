import {
  ICalculatedTrackRegion,
  ITrackConfig,
  ITrackRegion,
  ITrackRegionGroup
} from "../trackUtils.types";
import { genAnimation } from "./genAnimation";
import { isNumber, newId } from "./helpers";
import { genPadRegion } from "./pad";
import { createDeltaState } from "./stateUtils";
import { errorThrower } from "./validation";

export const isGroup = (region: ITrackRegion): region is ITrackRegionGroup => {
  return (region as any).regions;
};

export const parseGroup = <State extends object>(
  group: ITrackRegionGroup<State>,
  index: number,
  currentTime: number,
  workingState: State,
  layerName: string,
  track: ITrackRegion<State>[],
  config: Required<ITrackConfig>
) => {
  const {
    regions,
    useRelativeTime = false // TODO - implement use relative time
  } = group;
  const err = errorThrower(layerName, index);

  let animationStart = currentTime;
  const newRegions: ICalculatedTrackRegion[] = [];

  if (isNumber(group.start)) {
    const start = group.start!;

    if (group.start < currentTime) {
      err(
        `Group's start (${group.start}) must be greater or equal to the current time (${currentTime}).`
      );
    }

    if (start > currentTime) {
      const { regionState } = createDeltaState(workingState, {});
      const padRegion = genPadRegion(
        currentTime,
        start,
        regionState,
        workingState,
        layerName
      );
      newRegions.push(padRegion);
      animationStart = start;
    }
  }

  const animation = genAnimation(
    regions,
    workingState,
    config, // TODO - account for local config
    layerName
  );
  const animationEnd = isNumber(group.end)
    ? group.end
    : animation.length + animationStart;

  // TODO - Check for loop prop
  const stateGetter = (current: number) => {
    const relativeTime = current - animationStart;
    return animation.getFrameState(relativeTime);
  };
  const allVars = new Set(Object.keys(workingState)) as Set<keyof State>;
  const animationRegion: ICalculatedTrackRegion = {
    id: newId("group"),
    start: animationStart,
    end: animationEnd,
    layer: layerName,
    get: stateGetter,
    activeVars: allVars // TODO - Check for activeVars in animation
  };

  newRegions.push(animationRegion);
  const newWorkingState = stateGetter(animationEnd);

  return { newRegions, animationEnd, newWorkingState };
};

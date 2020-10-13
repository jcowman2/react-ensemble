import {
  ICalculatedTrackRegion,
  ITrackConfig,
  ITrackRegion,
  ITrackRegionGroup,
  TrackRegionContext
} from "../trackUtils.types";
import { genAnimation } from "./genAnimation";
import { isNumber, newId } from "./helpers";
import { parseLoopRegionInLayer } from "./loop";
import { genPadRegion } from "./pad";

const FORBIDDEN_FIELDS = ["state", "duration"];

export const isGroup = (region: ITrackRegion): region is ITrackRegionGroup => {
  return (region as any).regions;
};

export const parseGroup = <State extends object>(
  group: ITrackRegionGroup<State>,
  regionContext: TrackRegionContext,
  currentTime: number,
  workingState: State,
  track: ITrackRegion<State>[],
  config: Required<ITrackConfig>
) => {
  for (const field of FORBIDDEN_FIELDS) {
    if (group[field] !== undefined) {
      regionContext.throwErr(
        `A group may not contain the '${field}' property.`
      );
    }
  }

  const { regions, relativeTime = false } = group;

  let animationStart = currentTime;
  const newRegions: ICalculatedTrackRegion[] = [];

  if (isNumber(group.start)) {
    const start = group.start!;

    if (start < currentTime) {
      regionContext.throwErr(
        `Group's start (${start}) must be greater or equal to the current time (${currentTime}).`
      );
    }

    if (start > currentTime) {
      const padRegion = genPadRegion(
        currentTime,
        start,
        workingState,
        regionContext.layerName
      );
      newRegions.push(padRegion);
      animationStart = start;
    }
  }

  const animConfig: Required<ITrackConfig> = {
    ...config,
    endBehavior: "continue"
  };
  if (group.interp) {
    animConfig.interp = group.interp;
  }
  if (group.easing) {
    animConfig.easing = group.easing;
  }

  const animation = genAnimation(
    regions,
    workingState,
    animConfig,
    regionContext.layerName,
    relativeTime ? 0 : animationStart
  );
  const animationEnd = isNumber(group.end)
    ? group.end
    : animation.length + animationStart;

  const stateGetter = (current: number) => {
    const relativeTime = current - animationStart;
    return animation.getFrameState(relativeTime);
  };

  let determinedEndsWithPassiveLoop = false;
  let willUpdateToTime = animationEnd;

  const allVars = new Set(Object.keys(workingState)) as Set<keyof State>;
  const animationRegion: ICalculatedTrackRegion = {
    id: newId("group"),
    start: animationStart,
    end: animationEnd,
    layer: regionContext.layerName,
    get: stateGetter,
    activeVars: allVars // TODO - Check for activeVars in animation
  };

  if (group.loop) {
    const duration = animationEnd - animationStart;
    const { loopGetter, newEnd, endsWithPassiveLoop } = parseLoopRegionInLayer(
      {
        loop: group.loop,
        duration,
        start: animationStart,
        end: animationEnd
      },
      regionContext,
      track,
      stateGetter
    );

    if (endsWithPassiveLoop) {
      determinedEndsWithPassiveLoop = true;
    } else {
      willUpdateToTime = newEnd;
    }

    animationRegion.get = loopGetter;
    animationRegion.end = newEnd;
  }

  newRegions.push(animationRegion);
  const newWorkingState = animationRegion.get(animationRegion.end);

  return {
    newRegions,
    animationEnd,
    newWorkingState,
    willUpdateToTime,
    determinedEndsWithPassiveLoop
  };
};

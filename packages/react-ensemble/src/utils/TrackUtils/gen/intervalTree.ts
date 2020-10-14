import IntervalTree from "node-interval-tree";
import {
  TrackLayerResolver,
  IResolverLayerData,
  ICalculatedTrackRegion
} from "../trackUtils.types";

export interface IIntervalTreeSegment<State> {
  id: string;
  start: number;
  end: number;
  layerName: string;
  get: (current: number) => State;
  stateLastChanged: Record<string, number>;
  stateActive: Record<string, boolean>;
}

export const makeIntervalTreeFrameStateGetter = <State extends object>(
  tree: IntervalTree<IIntervalTreeSegment<State>>,
  layerRanks: Record<string, number>,
  resolver: TrackLayerResolver<State>
): ((current: number) => State) => {
  return (current: number) => {
    const intervals = tree.search(current, current);

    if (!intervals.length) {
      throw new Error(`No intervals exist at time ${current}`);
    }

    const stateResolverData: Record<
      string,
      IResolverLayerData<State[keyof State]>[]
    > = {};
    for (const key in intervals[0].stateLastChanged) {
      stateResolverData[key] = [];
    }

    for (const interval of intervals) {
      const intervalState = interval.get(current);

      const layerName = interval.layerName;
      const layerRank = layerRanks[layerName];

      for (const key in intervalState) {
        const lastChanged = interval.stateLastChanged[key];
        const isActive = interval.stateActive[key];

        const age = isActive ? 0 : current - lastChanged;

        stateResolverData[key].push({
          name: layerName,
          rank: layerRank,
          value: intervalState[key],
          age
        });
      }
    }

    const frameState: Record<string, unknown> = {};

    for (const key in stateResolverData) {
      frameState[key] = resolver(key as keyof State, stateResolverData[key]);
    }

    // console.log(intervals);
    // console.log(stateResolverData);

    return frameState as State;
  };
};

export const addRegionsToIntervalTree = <State extends object>(
  tree: IntervalTree<IIntervalTreeSegment<State>>,
  track: ICalculatedTrackRegion<State>[],
  defaults: State
): void => {
  if (!track.length) {
    return;
  }

  const stateLastChanged: Record<string, number> = {};

  for (const stateKey in defaults) {
    stateLastChanged[stateKey] = 0;
  }

  track.forEach((region, index) => {
    const stateActive: Record<string, boolean> = {};

    for (const stateKey in defaults) {
      if (region.activeVars.has(stateKey)) {
        stateLastChanged[stateKey] = region.start;
        stateActive[stateKey] = true;
      } else {
        stateActive[stateKey] = false;
        if (index > 0 && track[index - 1].activeVars.has(stateKey)) {
          stateLastChanged[stateKey] = track[index - 1].end;
        }
      }
    }

    tree.insert(region.start, region.end, {
      id: region.id,
      start: region.start,
      end: region.end,
      layerName: region.layer,
      get: region.get,
      stateLastChanged: { ...stateLastChanged },
      stateActive
    });
  });
};

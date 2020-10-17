import * as d3Ease from "d3-ease";
import * as d3Interpolate from "d3-interpolate";

import Timeline, { TimelineProps } from "./components/Timeline/Timeline";
import {
  TickEvent,
  UpdateEvent,
  LoadEvent
} from "./components/Timeline/timeline.types";

import Controller from "./components/Controller/Controller";
import {
  Direction,
  ControlPanelProps
} from "./components/Controller/controller.types";

import SimpleControlPanel from "./components/SimpleControlPanel/SimpleControlPanel";

import * as TrackUtils from "./utils/TrackUtils/trackUtils";
import {
  Animation,
  CalculatedTrackRegion,
  EasingFunction,
  InterpolationFunction,
  LoopConfig,
  RegionState,
  RegionStateProperty,
  ResolverLayerData,
  TrackConfig,
  TrackLayerResolver,
  TrackRegion,
  TrackRegionAtom,
  TrackRegionGroup
} from "./utils/TrackUtils/trackUtils.types";

/** Contains external packages that are used frequently in animations. */
const Lib = {
  /**
   * References the **d3-ease** library of easing functions.
   *
   * See the **d3-ease** documentation: https://github.com/d3/d3-ease/blob/master/README.md
   */
  d3Ease,

  /**
   * References the **d3-interpolate** library of interpolation functions.
   *
   * See the **d3-interpolate** documentation: https://github.com/d3/d3-interpolate/blob/master/README.md
   */
  d3Interpolate
};

// Modules
export { Timeline, Controller, SimpleControlPanel, TrackUtils, Lib };

// Enums
export { Direction };

// Types
export type {
  TimelineProps,
  ControlPanelProps,
  TickEvent,
  LoadEvent,
  UpdateEvent,
  Animation,
  CalculatedTrackRegion,
  EasingFunction,
  InterpolationFunction,
  LoopConfig,
  RegionState,
  RegionStateProperty,
  ResolverLayerData,
  TrackConfig,
  TrackLayerResolver,
  TrackRegion,
  TrackRegionAtom,
  TrackRegionGroup
};

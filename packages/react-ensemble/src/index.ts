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

import * as TrackUtils from "./utils/TrackUtils/trackUtils";

const Lib = { d3Ease, d3Interpolate };

// Modules
export { Timeline, Controller, TrackUtils, Lib };

// Enums
export { Direction };

// Types
export type {
  TimelineProps,
  TickEvent,
  UpdateEvent,
  LoadEvent,
  ControlPanelProps
};

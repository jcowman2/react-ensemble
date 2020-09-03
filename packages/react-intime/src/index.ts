import * as d3Ease from "d3-ease";
import * as d3Interpolate from "d3-interpolate";

import Timeline from "./components/Timeline/Timeline";
import Controller from "./components/Controller/Controller";

import { Direction } from "./components/Controller/controller.types";

const Lib = { d3Ease, d3Interpolate };

export { Timeline, Controller, Direction, Lib };

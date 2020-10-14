export enum Direction {
  Normal,
  FastForward,
  Reverse
}

export interface ControlPanelProps {
  tick: number;
  length: number | null;
  playing: boolean;
  direction: Direction;
  setTick: (tick: number) => void;
  play: () => void;
  pause: () => void;
  fastForward: () => void;
  reverse: () => void;
}

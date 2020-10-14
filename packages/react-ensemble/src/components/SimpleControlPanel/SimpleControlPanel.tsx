import React from "react";
import { ControlPanelProps, Direction } from "../Controller/controller.types";

const SimpleControlPanel: React.FC<ControlPanelProps> = props => {
  const {
    tick,
    direction,
    playing,
    length,
    play,
    pause,
    fastForward,
    reverse,
    setTick
  } = props;

  if (length === null) {
    return null;
  }

  return (
    <div className="SimpleControlPanel">
      <div className="SliderRow">
        <input
          className="Slider"
          type="range"
          min="0"
          max={String(length)}
          value={tick}
          onChange={e => setTick(Number(e.target.value))}
        />
      </div>
      <div className="ButtonRow">
        <button onClick={reverse} className="Button">
          {direction === Direction.Reverse ? (
            <strong>Reversing</strong>
          ) : (
            <>Reverse</>
          )}
        </button>
        {playing ? (
          <button onClick={pause} className="Button">
            Pause
          </button>
        ) : (
          <button onClick={play} className="Button">
            Play
          </button>
        )}
        <button onClick={fastForward} className="Button">
          {direction === Direction.FastForward ? (
            <strong>Forwarding</strong>
          ) : (
            <>Forward</>
          )}
        </button>
      </div>
    </div>
  );
};

export default SimpleControlPanel;

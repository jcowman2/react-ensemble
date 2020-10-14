import React from "react";
import { Lib, Timeline } from "react-ensemble";
/** @jsx jsx */
import { jsx } from "theme-ui";
import { keyframes } from "@emotion/core";
import { HomePageContext } from "../context/HomePageContext";
import CircularSlider from "./lib/react-circular-slider/CircularSlider";
import { PRIMARY, TERTIARY } from "../theme/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const TRACK_LENGTH = 16000;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 0.5;
  }
`;

const LandingController: React.FC = () => {
  const { progress, setProgress } = React.useContext(HomePageContext);

  const [playing, setIsPlaying] = React.useState(true);
  const [tick, setTick] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [lastSliderPos, setLastSliderPos] = React.useState(0);

  const sliderPos = React.useMemo(() => {
    return isDragging ? lastSliderPos : progress * 100;
  }, [isDragging, progress, lastSliderPos]);

  const handleDragStateChange = React.useCallback(
    (isDrag: boolean) => {
      if (isDrag) {
        setLastSliderPos(sliderPos);
      }
      setIsDragging(isDrag);
    },
    [sliderPos]
  );

  const handleSliderValueChange = React.useCallback(
    (value: number) => {
      if (isDragging) {
        setTick((value / 100) * TRACK_LENGTH);
      }
    },
    [isDragging]
  );

  return (
    <div sx={{ position: "relative", height: "150px", width: "100%" }}>
      <div
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute"
        }}
      >
        <CircularSlider
          width={130}
          min={0}
          max={100}
          hideLabelValue
          trackSize={0}
          progressSize={18}
          progressColorFrom={PRIMARY}
          progressColorTo={TERTIARY}
          knobColor={PRIMARY}
          dataIndex={sliderPos}
          onDragStateChange={handleDragStateChange}
          onChange={handleSliderValueChange}
        />
        <Timeline
          playing={playing && !isDragging}
          defaultState={{ progress: 0 }}
          track={[{ duration: TRACK_LENGTH, state: { progress: { to: 1 } } }]}
          value={tick}
          onTick={({ value }) => setTick(value)}
          onUpdate={({ state }) => setProgress(state.progress)}
          endBehavior="loop"
          easing={Lib.d3Ease.easeLinear}
        />
      </div>
      <div
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          justifyItems: "center",
          flexDirection: "column",
          zIndex: 2
        }}
      >
        <button
          onClick={() => setIsPlaying(prev => !prev)}
          sx={{
            margin: "auto",
            border: "none",
            bg: "transparent",
            opacity: 0.5,
            animation: `${fadeIn} 2s ease`,
            "&:hover": {
              opacity: 1
            }
          }}
        >
          {playing ? (
            <FontAwesomeIcon icon={faPause} color={PRIMARY} size="3x" />
          ) : (
            <FontAwesomeIcon icon={faPlay} color={PRIMARY} size="3x" />
          )}
        </button>
      </div>
    </div>
  );
};

export default LandingController;

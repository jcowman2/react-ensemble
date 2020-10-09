import React from "react";
import { Lib, Timeline } from "react-ensemble";
/** @jsx jsx */
import { jsx } from "theme-ui";
import { HomePageContext } from "../context/HomePageContext";
import CircularSlider from "./lib/react-circular-slider/CircularSlider";
import { PRIMARY, TERTIARY } from "../theme/colors";

export interface LandingControllerProps {}

const TRACK_LENGTH = 16000;

const LandingController: React.FC<LandingControllerProps> = props => {
  const {
    playbackSpeed,
    setPlaybackSpeed,
    progress,
    setProgress
  } = React.useContext(HomePageContext);
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
    <div
      sx={{
        width: "150px",
        height: "150px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
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
        playing={!isDragging}
        defaultState={{ progress: 0 }}
        track={[{ duration: TRACK_LENGTH, state: { progress: { to: 1 } } }]}
        value={tick}
        onTick={({ value }) => setTick(value)}
        onUpdate={({ state }) => setProgress(state.progress)}
        endBehavior="loop"
        easing={Lib.d3Ease.easeLinear}
      />
    </div>
  );
};

export default LandingController;

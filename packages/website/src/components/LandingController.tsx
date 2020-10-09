import React from "react";
import { Lib, Timeline } from "react-ensemble";
/** @jsx jsx */
import { jsx } from "theme-ui";
import { HomePageContext } from "../context/HomePageContext";
import CircularSlider from "./lib/react-circular-slider/CircularSlider";
import { PRIMARY, SECONDARY, TERTIARY, TEXT } from "../theme/colors";

export interface LandingControllerProps {}

const LandingController: React.FC<LandingControllerProps> = props => {
  const {
    playbackSpeed,
    setPlaybackSpeed,
    progress,
    setProgress
  } = React.useContext(HomePageContext);
  const [tick, setTick] = React.useState(0);
  const [updateSlider, setUpdateSlider] = React.useState(true);
  const [lastSliderPos, setLastSliderPos] = React.useState(0);

  // const sliderPos = React.useMemo(() => {
  //   if (updateSlider) {
  //     setLastSliderPos(progress * 100);
  //     return lastSliderPos;
  //   }
  //   return lastSliderPos;
  // }, [lastSliderPos, updateSlider, progress]);

  // const handleChange = React.useCallback(
  //   (value: number) => {
  //     // if (updateSlider) {
  //     //   setUpdateSlider(false);
  //     // }
  //     setLastSliderPos(value);
  //     setProgress(value / 100);
  //   },
  //   [updateSlider, setProgress]
  // );

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
      {/* <button onClick={() => setPlaybackSpeed(v => v + 0.5)}>
        Playback Speed: {playbackSpeed}
      </button> */}
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
        dataIndex={progress * 100}
        children={null}
        // onChange={value => setProgress(value / 100)}
      />
      <Timeline
        playing
        defaultState={{ progress: 0 }}
        track={[{ duration: 16000, state: { progress: { to: 1 } } }]}
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

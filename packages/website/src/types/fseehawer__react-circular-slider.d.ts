declare module "@fseehawer/react-circular-slider" {
  import React from "react";
  // Taken from: https://github.com/fseehawer/react-circular-slider/blob/master/README.md#props
  interface CircularSliderProps {
    width?: number;
    direction?: number;
    min?: number;
    max?: number;
    data?: any[];
    dataIndex?: number;
    knobColor?: string;
    knobSize?: number;
    hideKnob?: boolean;
    knobDraggable?: boolean;
    knobPosition?: string;
    label?: string;
    labelColor?: string;
    labelBottom?: bollean;
    labelFontSize?: string;
    valueFontSize?: string;
    appendToValue?: string;
    prependToValue?: string;
    renderLabelValue?: JSX.Element;
    verticalOffset?: string;
    hideLabelValue?: boolean;
    progressColorFrom?: string;
    progressColorTo?: string;
    progressSize?: number;
    progressLineCap?: string;
    trackColor?: string;
    trackSize?: number;
    onChange?: (value: number) => void;
  }
  const CircularSlider: React.ElementType<CircularSliderProps>;
  export = CircularSlider;
}

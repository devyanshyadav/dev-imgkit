//TSX code 
import React from "react";
import * as Slider from "@radix-ui/react-slider";

type RangeSliderProps = Omit<
  React.ComponentProps<typeof Slider.Root>,
  "children" | "className"
>;
const DevRangeSlider = (props: RangeSliderProps & { labelName?: string }) => {
  return (
   <div>
   {props.labelName && <h3 className="flex items-center justify-between">{props.labelName} <span className="p-1 rounded-md border border-shade">{props.value}</span></h3>}
     <Slider.Root
      {...props}
      className="relative flex items-center select-none touch-none w-full h-5 rounded-full"
    >
      <Slider.Track className="relative grow rounded-full h-2 bg-accent/40">
        <Slider.Range className="absolute bg-accent rounded-full h-2 rounded-r-none" />
      </Slider.Track>
      <Slider.Thumb
        className="block w-5 h-5 focus:outline-0 bg-accent transition-all rounded-full border-2 cursor-pointer active:border-4 dark:border-slate-700 border-primary"
        aria-label="Slider Thumb"
      />
      <Slider.Thumb
        className="block w-5 h-5 focus:outline-0 bg-accent transition-all rounded-full border-2 cursor-pointer active:border-4 dark:border-slate-700 border-primary"
        aria-label="Slider Thumb"
      />
    </Slider.Root>
   </div>
  );
};

export default DevRangeSlider;

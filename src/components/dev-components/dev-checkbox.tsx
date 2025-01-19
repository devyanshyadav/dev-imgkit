//TSX code 
import React from "react";
import { HiCheck } from "react-icons/hi";

type CheckboxProps = Omit<React.ComponentProps<"input">, "className">;

const DevCheckbox = ({ ...props }: CheckboxProps & { labelName?: string }) => {
  return (
    <div className="space-y-1 grid place-items-center">
     {props.labelName && <h3 className="capitalize text-sm">{props.labelName}</h3>}
      <span className="border-2 ring-accent/50 relative transition-all border-accent text-white w-6 h-6 grid place-content-center rounded-md cursor-pointer has-[:checked]:bg-accent bg-white has-[:checked]:ring-[3px]">
      <input
        type="checkbox"
        className="peer z-10 opacity-0 cursor-pointer absolute inset-0"
        {...props}
      />
      <HiCheck className="h-full w-full hidden peer-checked:block" />
    </span>
    </div>
  );
};

export default DevCheckbox;

//TSX code 
"use client";
import React, { useId } from "react";
import { ITooltip, Tooltip } from "react-tooltip";

type DevTooltip = {
  children: React.ReactNode;
  place?: "top" | "bottom" | "left" | "right";
  tipData: string;
} & Omit<ITooltip, "children" | "place" | "html" | "opacity" | "style">;

const DevTooltip = ({
  children,
  place = "top",
  tipData,
  ...props
}: DevTooltip) => {
  const Id = useId();
  return (
    <>
      <Tooltip
        id={Id}
        place={place}
        offset={3}
        opacity={1}
        {...props}
        style={{ backgroundColor: "transparent", padding: "0px" }}
      >
        <span className="bg-accent text-sm p-0.5 px-2 rounded-full text-white z-50">
          {tipData}
        </span>
      </Tooltip>
      <div className="grid place-items-center" data-tooltip-id={Id}>{children}</div>
    </>
  );
};

export default DevTooltip;

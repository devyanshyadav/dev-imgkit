//TSX code
import React, { forwardRef } from "react";

type InputProps = {
  variant?: "base" | "bordered" | "faded" | "underline";
  size?: "sm" | "md" | "lg";
  labelName?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  reverseIcon?: boolean;
  icon?: React.ReactNode;
  className?: string;
  isInvalid?: boolean;
} & Omit<React.ComponentProps<"input">, "size">;

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

const DevInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "base",
      size = "md",
      labelName,
      className,
      icon,
      rounded = "lg",
      reverseIcon = false,
      isInvalid = false,
      ...props
    },
    ref
  ) => {
    const commonStyle = `w-full flex border border-accent transition-all ring-accent/50 items-center ${
      icon && " gap-2 "
    },
    ${isInvalid && "border-red-500 ring-red-500/30"}
    ${reverseIcon && "flex-row-reverse"}`;

    const inputVariants = {
      base: "bg-primary dark:bg-primary",
      bordered: "bg-transparent",
      faded: "bg-accent/20 text-accent",
      underline:
        "border-0 !ring-0 !border-accent/50 border-b-4 relative after:content-[''] after:absolute after:h-1 after:bg-accent after:-bottom-1 after:w-full after:scale-x-0  after:transition after:duration-300 after:origin-center rounded-none px-0 has-[:focus]:after:scale-x-100",
    };

    const inputRoundness = {
      none: "rounded-none",
      sm: "rounded-md",
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full",
    };

    const inputSizes: { [key: string]: string } = {
      sm: "p-1",
      md: "p-2",
      lg: "p-3",
    };

    const inputSize = inputSizes[size] || inputSizes.md;
    const inputVariant = inputVariants[variant] || inputVariants.base;
    const inputRound = inputRoundness[rounded] || inputRoundness.full;

    return (
      <div>
        {labelName && (
          <label htmlFor={labelName} className="text-sm block m-1">
            {labelName}
          </label>
        )}

        <div
          className={cn(
            "has-[:focus]:ring",
            inputSize,
            commonStyle,
            inputRound,
            inputVariant,
            className
          )}
        >
          <span className="text-xl text-accent">{icon}</span>
          <input
            ref={ref}
            id={labelName && labelName}
            {...props}
            className="autofill:duration-[5000s] autofill:delay-0 autofill:ease-in-out bg-transparent rounded text-sm outline-0 w-full"
          />
        </div>
      </div>
    );
  }
);

export default DevInput;

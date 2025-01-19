import React, { forwardRef, useState } from "react";

type LaserInputProps = {
  size?: "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "full";
  laserActiveOnClick?: boolean;
  reverseIcon?: boolean;
  icon?: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<"input">, "size">;

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

const DevLaserInput = forwardRef<HTMLInputElement, LaserInputProps>(
  (
    {
      size = "md",
      rounded = "md",
      laserActiveOnClick = true,
      reverseIcon = false,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [childPosition, setChildPosition] = useState<number>(0);
    const [active, setActive] = useState<boolean>(false);

    const [childColor, setChildColor] = useState(
      `bg-gradient-to-r from-transparent via-accent to-transparent`
    );
    const handleMouseMove = (e: React.MouseEvent) => {
      const parentRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - parentRect.left - 50;

      if (x < 0) {
        setChildPosition(0);
        setChildColor(`bg-gradient-to-r from-accent via-accent to-transparent`);
      } else if (x > parentRect.width - 100) {
        setChildPosition(parentRect.width - 96);
        setChildColor(`bg-gradient-to-r from-transparent via-accent to-accent`);
      } else {
        setChildPosition(x);
        setChildColor(
          `bg-gradient-to-r from-transparent via-accent to-transparent`
        );
      }
    };
    const InputSizes = {
      sm: "p-1.5",
      md: "p-2",
      lg: "p-2.5",
    };
    const InputRoundness = {
      none: "rounded-none",
      sm: "rounded-md",
      md: "rounded-xl",
      full: "rounded-full",
    };
    const InputSize = InputSizes[size] || InputSizes.md;
    const InputRounded = InputRoundness[rounded] || InputRoundness.md;

    return (
      <div
        className={cn(InputRounded, "relative w-full overflow-hidden p-[3px]")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <span
          className={cn(
            "absolute top-0 bottom-0 rounded-lg ",
            active ? "bg-accent" : childColor,
            isHovered || (active && laserActiveOnClick) ? "block" : "hidden",
            active ? "w-full  transition-all  duration-200 opacity-50" : "w-24"
          )}
          style={{
            left: `${active ? 0 : childPosition}px`,
          }}
        />

        <div
          className={cn(
            InputRounded,
            "relative z-20 text-sm flex items-center justify-center flex-grow border border-accent/70 bg-primary dark:bg-primary gap-2 outline outline-accent/20",
            InputSize,
            className,
            reverseIcon && "flex-row-reverse"
          )}
        >
          {icon && <span className="text-accent">{icon}</span>}
          <input
            ref={ref}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            spellCheck="false"
            {...props}
            className="w-full outline-0 !bg-transparent"
          />
        </div>
      </div>
    );
  }
);

export default DevLaserInput;

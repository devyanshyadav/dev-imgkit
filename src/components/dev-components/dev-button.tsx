//TSX code 
import * as React from "react";

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

const buttonStyles = {
  base: "inline-flex inset-shadow shadow-red-500 items-center justify-center gap-2 whitespace-nowrap text-[0.9rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    solid: "bg-accent text-white hover:bg-accent/90",
    light: "text-accent hover:bg-accent/50 hover:text-white",
    border: "border text-accent border-2 border-accent",
    flat: "border-accent/5 bg-accent/30 text-accent backdrop-blur-sm",
    ghost:
      "text-accent hover:bg-accent hover:text-white border-2 border-accent",
  },
  sizes: {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8",
  },
  roundness: {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-xl",
    full: "rounded-full",
    none: "rounded-none",
  },
  icon: "h-9 w-9 p-0"
};

type ButtonBaseProps = {
  variant?: keyof typeof buttonStyles.variants;
  size?: keyof typeof buttonStyles.sizes;
  rounded?: keyof typeof buttonStyles.roundness;
  asIcon?: boolean;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "href">;
type ButtonAsLink = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const Link = "a"; // You can change this to import Link from 'next/link' for Next.js

const DevButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    { 
      className, 
      variant = "solid", 
      size = "md", 
      rounded = "lg",
      asIcon = false,
      ...props 
    },
    ref
  ) => {
    const buttonClasses = cn(
      buttonStyles.base,
      buttonStyles.variants[variant],
      asIcon ? buttonStyles.icon : buttonStyles.sizes[size],
      buttonStyles.roundness[rounded],
      className
    );

    if ("href" in props) {
      return (
        <Link
          className={buttonClasses}
          {...(props as ButtonAsLink)}
          ref={ref as React.Ref<HTMLAnchorElement>}
        />
      );
    }

    return (
      <button
        className={buttonClasses}
        {...(props as ButtonAsButton)}
        ref={ref as React.Ref<HTMLButtonElement>}
      />
    );
  }
);

DevButton.displayName = "DevButton";

export default DevButton;
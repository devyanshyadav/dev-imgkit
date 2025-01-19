//TSX code 
import React from "react";

type SelectProps = {
  options: { value: string; label: string }[];
  placeholder?: string;
  labelName?: string;
} & Omit<React.ComponentProps<"select">, "id">;
const DevSelect = ({
  options,
  labelName,
  placeholder = "Select an option",
  ...props
}: SelectProps) => {
  return (
    <div className="flex flex-col w-full">
      {labelName && (
        <label className="p-1" htmlFor={labelName?.replace(" ", "-")}>
         {labelName}
        </label>
      )}
      <div className="p-1.5 w-full has-[:focus]:ring-[3px] transition-all ring-accent/30 rounded-lg !outline-0 border border-accent/80 bg-primary dark:bg-primary">
        <select
          id={labelName?.replace(" ", "-")}
          {...props}
          className="bg-transparent !outline-0 w-full bg-primary dark:bg-primary"
        >
          <option value={placeholder} disabled selected>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DevSelect;

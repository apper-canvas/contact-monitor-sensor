import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  value,
  onChange,
  multiline,
  ...props
},
ref
) => {
  const baseClasses = "flex w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  
  if (multiline) {
    return (
      <textarea
        ref={ref}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          baseClasses,
          "min-h-24 resize-vertical",
          error && "border-error-500 focus:ring-error-500",
          className
        )}
        {...props}
      />
    );
  }
  
  return (
    <input
      ref={ref}
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        baseClasses,
        "h-10",
        error && "border-error-500 focus:ring-error-500",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
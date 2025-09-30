import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = forwardRef(({ 
  className, 
  src,
  alt,
  fallback,
  size = "md",
  ...props 
}, ref) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-100 to-primary-200",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-600 font-medium">
          {fallback ? getInitials(fallback) : <ApperIcon name="User" className="w-1/2 h-1/2" />}
        </div>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
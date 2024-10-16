import React from 'react';
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  color?: string;
  height?: string;
  dotSize?: string;
  gapSize?: string;
  direction?: "horizontal" | "vertical";
};

export const DottedSeparator = ({
  className,
  color = "#d4d4d8",
  height = "2px",
  dotSize = "2px",
  gapSize = "6px",
  direction = "horizontal",
}: Props) => {
  const isHorizontal = direction === "horizontal";
  
  return (
    <div
      className={cn(
        isHorizontal
          ? "w-full h-[2px]"
          : "h-full w-[2px]",
        className
      )}
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
        backgroundSize: isHorizontal
          ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
          : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
        backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
        backgroundPosition: "center",
      }}
    />
  );
};

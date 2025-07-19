import { cn } from "@/lib/utils";
import React from "react";

export const AnimatedGridBackground = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center bg-background",
        className
      )}
    >
      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-background to-transparent [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      {children}
    </div>
  );
};
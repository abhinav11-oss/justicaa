"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CardContext = createContext<{
  transform: string;
}>({
  transform: "rotateX(0deg) rotateY(0deg)",
});

interface CardContainerProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: CardContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;

    setTransform(`rotateX(${y}deg) rotateY(${x}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform("rotateX(0deg) rotateY(0deg)");
  };

  return (
    <div
      className={cn(
        "py-20 flex items-center justify-center",
        containerClassName
      )}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex items-center justify-center relative transition-all duration-200 ease-out",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
          transform,
        }}
      >
        <CardContext.Provider value={{ transform }}>
          {children}
        </CardContext.Provider>
      </motion.div>
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody = ({ children, className }: CardBodyProps) => {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardItemProps {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateZ?: number | string;
  translateX?: number | string;
  translateY?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
}

export const CardItem = ({
  as: Component = "div",
  children,
  className,
  translateZ = 0,
  translateX = 0,
  translateY = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: CardItemProps) => {
  const { transform } = useContext(CardContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Component
      className={cn("w-fit transition duration-200 ease-out", className)}
      style={{
        transform: isMounted
          ? `
            translateX(${typeof translateX === "number" ? translateX + "px" : translateX})
            translateY(${typeof translateY === "number" ? translateY + "px" : translateY})
            translateZ(${typeof translateZ === "number" ? translateZ + "px" : translateZ})
            rotateX(${typeof rotateX === "number" ? rotateX + "deg" : rotateX})
            rotateY(${typeof rotateY === "number" ? rotateY + "deg" : rotateY})
            rotateZ(${typeof rotateZ === "number" ? rotateZ + "deg" : rotateZ})
          `
          : "none",
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};
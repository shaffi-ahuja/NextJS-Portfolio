"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type Direction = "up" | "left" | "right" | "none";

const directionMap: Record<Direction, string> = {
  up: "translate-y-8",
  left: "-translate-x-8",
  right: "translate-x-8",
  none: "",
};

export default function AnimatedSection({
  children,
  className = "",
  direction = "up",
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  id?: string;
}) {
  const { ref, visible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${directionMap[direction]}`
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </section>
  );
}

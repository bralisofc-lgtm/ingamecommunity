import { CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealProps {
  children: ReactNode;
  delay?: number; // seconds
  y?: number; // initial translateY in px
  className?: string;
  as?: "div" | "section" | "article" | "li";
}

/**
 * Smoothly reveals children when they scroll into view (fade + slide-up).
 * No black flashes, no abrupt cuts.
 */
const Reveal = ({ children, delay = 0, y = 28, className = "", as: Tag = "div" }: RevealProps) => {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0,0,0)" : `translate3d(0, ${y}px, 0)`,
    transition: `opacity 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    willChange: "opacity, transform",
  };

  return (
    <Tag ref={ref as never} style={style} className={className}>
      {children}
    </Tag>
  );
};

export default Reveal;

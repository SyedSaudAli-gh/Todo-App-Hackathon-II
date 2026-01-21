import { Variants } from "framer-motion";

// Hero section staggered fade-in animation
export const heroVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

// Todo card slide-in animation
export const todoSlideVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

// Completion checkmark animation
export const checkmarkVariants: Variants = {
  unchecked: { scale: 0, rotate: -180 },
  checked: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};

// Feature card hover animation
export const featureHoverVariants: Variants = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// Scroll-triggered fade-in animation
export const scrollFadeVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

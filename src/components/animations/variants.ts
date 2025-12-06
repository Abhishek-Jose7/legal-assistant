import { Variants } from "framer-motion"

// Check for reduced motion preference
const prefersReducedMotion = 
  typeof window !== "undefined" && 
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Base transition settings
export const transitions = {
  quick: { duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" },
  normal: { duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" },
  slow: { duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" },
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: prefersReducedMotion ? 0 : undefined,
  },
}

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.normal,
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.normal,
  },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.normal,
  },
}

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.normal,
  },
}

// Slide animations
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.normal,
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.normal,
  },
}

export const slideInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.normal,
  },
}

// Stagger container variants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.05,
      delayChildren: prefersReducedMotion ? 0 : 0.1,
    },
  },
}

export const staggerContainerMedium: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.075,
      delayChildren: prefersReducedMotion ? 0 : 0.15,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.1,
      delayChildren: prefersReducedMotion ? 0 : 0.2,
    },
  },
}

// Item variants for stagger
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.normal,
  },
}

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.normal,
  },
}

// Hover variants
export const hoverScale: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: prefersReducedMotion ? 1 : 1.02,
    transition: transitions.quick,
  },
}

export const hoverLift: Variants = {
  rest: { y: 0 },
  hover: { 
    y: prefersReducedMotion ? 0 : -4,
    transition: transitions.quick,
  },
}

// Button variants
export const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: prefersReducedMotion ? 1 : 1.05,
    transition: transitions.quick,
  },
  tap: { 
    scale: prefersReducedMotion ? 1 : 0.98,
    transition: { duration: 0.1 },
  },
}

// Text animation variants
export const textLineReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
}

// Card reveal variants
export const cardReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: transitions.slow,
  },
}

// Hero section specific
export const heroHeadline: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.15,
      delayChildren: prefersReducedMotion ? 0 : 0.2,
    },
  },
}

export const heroLine: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

// Pulse animation (for badges, icons)
export const pulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: prefersReducedMotion ? 0 : 1.5,
      repeat: prefersReducedMotion ? 0 : Infinity,
      ease: "easeInOut",
    },
  },
}

// Bounce animation
export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: prefersReducedMotion ? 0 : 0.6,
      repeat: prefersReducedMotion ? 0 : Infinity,
      ease: "easeInOut",
    },
  },
}

// Rotate animation
export const rotate: Variants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: prefersReducedMotion ? 0 : 1,
      repeat: prefersReducedMotion ? 0 : Infinity,
      ease: "linear",
    },
  },
}


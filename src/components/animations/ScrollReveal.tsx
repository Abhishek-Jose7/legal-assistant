"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { fadeInUp, fadeIn, scaleIn, slideInLeft, slideInRight, slideInUp } from "./variants"

interface ScrollRevealProps {
  children: ReactNode
  variant?: "fadeIn" | "fadeInUp" | "scaleIn" | "slideInLeft" | "slideInRight" | "slideInUp"
  delay?: number
  className?: string
  threshold?: number
  once?: boolean
}

const variantMap = {
  fadeIn,
  fadeInUp,
  scaleIn,
  slideInLeft,
  slideInRight,
  slideInUp,
}

export default function ScrollReveal({
  children,
  variant = "fadeInUp",
  delay = 0,
  className = "",
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: once,
  })

  const selectedVariant = variantMap[variant]

  return (
    <motion.div
      ref={ref}
      variants={selectedVariant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}


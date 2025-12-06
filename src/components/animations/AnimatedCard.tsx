"use client"

import { ReactNode } from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { Card, CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends Omit<CardProps, "initial" | "animate" | "whileHover" | "whileTap"> {
  children: ReactNode
  delay?: number
  className?: string
  hoverScale?: number
  hoverShadow?: boolean
}

export default function AnimatedCard({
  children,
  delay = 0,
  className,
  hoverScale = 1.02,
  hoverShadow = true,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        delay,
        duration: 0.4,
        ease: "easeOut",
      }}
      whileHover={{
        scale: hoverScale,
        transition: { duration: 0.2 },
      }}
      className={cn(hoverShadow && "hover:shadow-lg transition-shadow", className)}
    >
      <Card {...props} className={className}>
        {children}
      </Card>
    </motion.div>
  )
}


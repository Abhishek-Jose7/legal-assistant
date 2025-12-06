"use client"

import { motion } from "framer-motion"

interface TypingIndicatorProps {
  className?: string
  color?: string
}

export default function TypingIndicator({ 
  className = "", 
  color = "#10b981" 
}: TypingIndicatorProps) {
  const dotVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          variants={dotVariants}
          animate="animate"
          transition={{
            delay: index * 0.15,
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}


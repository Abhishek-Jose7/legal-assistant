"use client"

import { useState, useRef, MouseEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface RippleEffectProps {
  color?: string
  duration?: number
  className?: string
}

export default function RippleEffect({ 
  color = "rgba(255, 255, 255, 0.6)",
  duration = 0.6,
  className = "",
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const rippleIdRef = useRef(0)

  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, duration * 1000)
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-inherit pointer-events-none ${className}`}
      onMouseDown={createRipple}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: color,
            }}
            initial={{ width: 0, height: 0, x: "-50%", y: "-50%", opacity: 0.8 }}
            animate={{
              width: 300,
              height: 300,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook version for programmatic ripple creation
export function useRipple() {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const rippleIdRef = useRef(0)

  const addRipple = (event: MouseEvent<HTMLElement> | { clientX: number; clientY: number }) => {
    const rect = (event as MouseEvent<HTMLElement>).currentTarget?.getBoundingClientRect() || 
                 { left: 0, top: 0, width: 0, height: 0 }
    const x = 'currentTarget' in event 
      ? event.clientX - rect.left 
      : event.clientX - rect.left
    const y = 'currentTarget' in event 
      ? event.clientY - rect.top 
      : event.clientY - rect.top
    
    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)
  }

  return { ripples, addRipple }
}


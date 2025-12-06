"use client"

import { ReactNode, useEffect } from "react"

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Smooth scroll is handled by CSS in globals.css
    // This component can be used for future smooth scroll enhancements
    return () => {}
  }, [])

  return <>{children}</>
}

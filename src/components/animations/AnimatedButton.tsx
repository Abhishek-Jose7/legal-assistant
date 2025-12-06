"use client"

import { ReactNode, MouseEvent } from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import RippleEffect from "./RippleEffect"
import { buttonVariants } from "./variants"

interface AnimatedButtonProps extends Omit<ButtonProps, "onClick"> {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  showRipple?: boolean
  rippleColor?: string
  className?: string
}

export default function AnimatedButton({
  children,
  onClick,
  showRipple = true,
  rippleColor,
  className,
  ...props
}: AnimatedButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
  }

  return (
    <motion.div
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={cn("relative inline-block", className)}
    >
      <Button
        onClick={handleClick}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {children}
        {showRipple && (
          <RippleEffect
            color={rippleColor || "rgba(255, 255, 255, 0.6)"}
          />
        )}
      </Button>
    </motion.div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ScrollBackgroundProps {
  images: string[]
}

export default function ScrollBackground({ images }: ScrollBackgroundProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { scrollYProgress } = useScroll()
  
  // Transform scroll progress to image index
  const imageIndex = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [0, 1, 2, Math.min(2, images.length - 1)]
  )

  useEffect(() => {
    const unsubscribe = imageIndex.on("change", (latest) => {
      setCurrentImageIndex(Math.floor(latest))
    })
    return () => unsubscribe()
  }, [imageIndex])

  if (images.length === 0) return null

  return (
    <div className="fixed inset-0 -z-10 w-full h-screen overflow-hidden">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentImageIndex ? 1 : 0,
            scale: index === currentImageIndex ? 1 : 1.1,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay for better text readability */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#0F3D3E]/70 via-[#0F3D3E]/60 to-[#0F3D3E]/70"
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}


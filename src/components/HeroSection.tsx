"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, BookOpen, Scale, FileText, Gavel } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import AnimatedButton from "@/components/animations/AnimatedButton"
import ScrollBackground from "@/components/animations/ScrollBackground"

const placeholderExamples = [
  "Ask a legal question…",
  "What are my rights as a tenant?",
  "How do I file a complaint?",
  "Can I recover unpaid salary?",
]

// Placeholder images - replace with your actual legal/justice themed images
const backgroundImages = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80", // Law books
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80", // Legal documents
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80", // Justice scales
]

export default function HeroSection() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  useEffect(() => {
    if (!isFocused) {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholderExamples.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isFocused])

  const scrollToChat = () => {
    document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Floating icons for background
  const FloatingIcon = ({ Icon, delay = 0, x = 0, y = 0 }: { Icon: any; delay?: number; x?: number; y?: number }) => (
    <motion.div
      className="absolute text-[#0F3D3E]/20"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.2, 0.3, 0.2],
        scale: [1, 1.1, 1],
        y: [0, -20, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <Icon className="w-12 h-12 md:w-16 md:h-16" />
    </motion.div>
  )

  return (
    <>
      <ScrollBackground images={backgroundImages} />
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating legal icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingIcon Icon={Scale} delay={0} x={10} y={20} />
          <FloatingIcon Icon={FileText} delay={1} x={85} y={30} />
          <FloatingIcon Icon={Gavel} delay={2} x={50} y={70} />
          <FloatingIcon Icon={Scale} delay={1.5} x={70} y={60} />
        </div>

        <motion.div
          style={{ opacity, y }}
          className="container mx-auto px-4 md:px-6 relative z-10"
        >
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5EEDC] mb-6 drop-shadow-2xl"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="block"
              >
                Understand Your Rights.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="block"
              >
                <span className="text-[#C8AD7F]">Get Help When You Need It.</span>
              </motion.span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="text-lg md:text-xl text-[#F5EEDC]/90 mb-10 max-w-2xl drop-shadow-lg"
            >
              A personal legal assistant that explains laws in simple language and connects you to affordable verified lawyers.
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="w-full max-w-2xl mb-8"
            >
              <motion.div
                className="relative group"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#C8AD7F] group-focus-within:text-[#F5EEDC] transition-colors z-10" />
                <Input
                  type="text"
                  placeholder={placeholderExamples[currentPlaceholder]}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full h-14 pl-12 pr-4 text-base rounded-xl border-2 border-[#C8AD7F]/50 bg-[#F5EEDC]/95 backdrop-blur-sm focus:border-[#C8AD7F] shadow-lg text-[#2E2E2E] placeholder:text-[#2E2E2E]/60 focus:shadow-xl transition-all"
                />
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 1.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                <AnimatedButton
                  size="lg"
                  onClick={scrollToChat}
                  showRipple={true}
                  rippleColor="rgba(245, 238, 220, 0.6)"
                  className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-[#F5EEDC] h-12 px-8 text-base rounded-xl shadow-lg hover:shadow-xl relative border-2 border-[#C8AD7F]/30"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Start Legal Chat
                </AnimatedButton>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <Link href="/personas">
                  <AnimatedButton
                    size="lg"
                    variant="outline"
                    showRipple={true}
                    rippleColor="rgba(15, 61, 62, 0.2)"
                    className="h-12 px-8 text-base rounded-xl border-2 border-[#C8AD7F] bg-[#F5EEDC]/90 backdrop-blur-sm hover:bg-[#F5EEDC] hover:border-[#C8AD7F] text-[#2E2E2E] relative"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Browse Rights by Category
                  </AnimatedButton>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, BookOpen } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HeroSection() {
  const scrollToChat = () => {
    document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl mix-blend-multiply animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Understand Your Rights.
            <br />
            <span className="text-[#1e3a8a]">Get Help When You Need It.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl"
          >
            A personal legal assistant that explains laws in simple language and connects you to affordable verified lawyers.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-2xl mb-8"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors" />
              <Input
                type="text"
                placeholder="Ask a legal question…"
                className="w-full h-14 pl-12 pr-4 text-base rounded-xl border-2 border-slate-200 focus:border-[#1e3a8a] shadow-sm transition-all hover:border-[#1e3a8a]/50"
              />
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={scrollToChat}
              className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white h-12 px-8 text-base rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Legal Chat
            </Button>
            <Link href="/personas">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base rounded-xl border-2 hover:bg-slate-50 transition-all"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Rights by Category
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

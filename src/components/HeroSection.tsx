"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, BookOpen } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Understand Your Rights.
            <br />
            <span className="text-[#1e3a8a]">Get Help When You Need It.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl">
            A personal legal assistant that explains laws in simple language and connects you to affordable verified lawyers.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-2xl mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Ask a legal question…"
                className="w-full h-14 pl-12 pr-4 text-base rounded-xl border-2 border-slate-200 focus:border-[#10b981] shadow-sm"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white h-12 px-8 text-base rounded-xl"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Legal Chat
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base rounded-xl border-2"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Rights by Category
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import Features from "@/components/Features"
import AIChatSection from "@/components/AIChatSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main>
        <HeroSection />
        <Features />
        <AIChatSection />
      </main>
      <Footer />
    </div>
  )
}

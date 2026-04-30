"use client"

import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import Dashboard from "@/components/Dashboard"
import Footer from "@/components/Footer"
import ReviewSection from "@/components/ReviewSection"

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main>
        <HeroSection />
        <Dashboard />
        <ReviewSection />
      </main>
      <Footer />
    </div>
  )
}

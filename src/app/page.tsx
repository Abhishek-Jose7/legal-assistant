"use client"

import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import Dashboard from "@/components/Dashboard"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main>
        <HeroSection />
        <Dashboard />
      </main>
      <Footer />
    </div>
  )
}

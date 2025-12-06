"use client"

import { Metadata } from "next"
import Header from "@/components/Header"
import FindLawyer from "@/components/FindLawyer"
import Footer from "@/components/Footer"
import ScrollBackground from "@/components/animations/ScrollBackground"

// Professional/lawyer themed background images
const backgroundImages = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80", // Law books
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80", // Legal documents
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1920&q=80", // Professional office
]

export default function LawyersPage() {
  return (
    <div className="min-h-screen relative">
      <ScrollBackground images={backgroundImages} />
      <Header />
      <main className="relative z-10 pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#0F3D3E]/80 via-[#0F3D3E]/70 to-[#0F3D3E]/80 py-16 md:py-20 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#F5EEDC] mb-4 drop-shadow-lg">
              Find the Right Lawyer for Your Case
            </h1>
            <p className="text-lg md:text-xl text-[#F5EEDC]/90 max-w-3xl mx-auto drop-shadow-md">
              Filter by category, budget, and language to find verified legal experts. 
              Book consultations instantly and get the legal help you need.
            </p>
          </div>
        </div>
        
        <FindLawyer />
      </main>
      <Footer />
    </div>
  )
}

"use client"

import Header from "@/components/Header"
import PersonasSection from "@/components/PersonasSection"
import Footer from "@/components/Footer"
import ScrollBackground from "@/components/animations/ScrollBackground"

// Community/rights themed background images
const backgroundImages = [
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1920&q=80", // Community
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80", // Rights
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80", // Legal help
]

export default function PersonasPage() {
  return (
    <div className="min-h-screen relative">
      <ScrollBackground images={backgroundImages} />
      <Header />
      <main className="relative z-10">
        <PersonasSection />
      </main>
      <Footer />
    </div>
  )
}

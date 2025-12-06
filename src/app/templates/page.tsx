"use client"

import Header from "@/components/Header"
import DocumentTemplates from "@/components/DocumentTemplates"
import Footer from "@/components/Footer"
import ScrollBackground from "@/components/animations/ScrollBackground"

// Document/template themed background images
const backgroundImages = [
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80", // Legal documents
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80", // Writing/paper
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80", // Contracts
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen relative">
      <ScrollBackground images={backgroundImages} />
      <Header />
      <main className="relative z-10">
        <DocumentTemplates />
      </main>
      <Footer />
    </div>
  )
}

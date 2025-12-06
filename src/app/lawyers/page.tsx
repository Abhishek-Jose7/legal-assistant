import { Metadata } from "next"
import Header from "@/components/Header"
import FindLawyer from "@/components/FindLawyer"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Find a Lawyer | Legal Assistant",
  description: "Connect with verified lawyers who specialize in your legal needs. Filter by category, budget, and language to find the perfect legal expert.",
}

export default function LawyersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-white py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Find the Right Lawyer for Your Case
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
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

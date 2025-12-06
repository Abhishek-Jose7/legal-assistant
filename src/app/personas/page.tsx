import Header from "@/components/Header"
import PersonasSection from "@/components/PersonasSection"
import Footer from "@/components/Footer"

export default function PersonasPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PersonasSection />
      </main>
      <Footer />
    </div>
  )
}

import Header from "@/components/Header"
import AIChatSection from "@/components/AIChatSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AIChatSection />
      </main>
      <Footer />
    </div>
  )
}
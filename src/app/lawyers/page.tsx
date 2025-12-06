import Header from "@/components/Header"
import FindLawyer from "@/components/FindLawyer"
import Footer from "@/components/Footer"

export default function LawyersPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <FindLawyer />
      </main>
      <Footer />
    </div>
  )
}

import Header from "@/components/Header"
import DocumentTemplates from "@/components/DocumentTemplates"
import Footer from "@/components/Footer"

export default function TemplatesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <DocumentTemplates />
      </main>
      <Footer />
    </div>
  )
}

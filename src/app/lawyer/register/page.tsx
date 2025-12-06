import Header from "@/components/Header"
import Footer from "@/components/Footer"
import LawyerRegistration from "@/components/LawyerRegistration"

export const metadata = {
    title: "Lawyer Registration - Lexi.AI",
}

export default function LawyerSignupPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <LawyerRegistration />
            </main>
            <Footer />
        </div>
    )
}

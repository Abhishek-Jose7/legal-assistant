import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Scale, Users, Shield, Target } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us - NyaayaAi",
    description: "Learn about our mission to make legal assistance accessible to everyone.",
}

export default function AboutPage() {
    const values = [
        {
            icon: Scale,
            title: "Justice for All",
            description: "We believe legal knowledge should be accessible, not hidden behind jargon and high fees."
        },
        {
            icon: Shield,
            title: "Trust & Privacy",
            description: "Your data and legal inquiries are treated with the highest standards of security and confidentiality."
        },
        {
            icon: Users,
            title: "User-Centric",
            description: "We build tools designed for real people, simplifying complex legal processes into easy steps."
        },
        {
            icon: Target,
            title: "Accuracy",
            description: "Our AI is trained on the latest legal frameworks to provide reliable initial guidance."
        }
    ]

    return (
        <div className="min-h-screen bg-[#F9F7F2] font-sans text-slate-900">
            <Header />
            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F3D3E] mb-6">
                            Democratizing Legal Access with AI
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                            Nyaaya is your personal legal companion, designed to simplify Indian law and empower you with knowledge.
                        </p>
                    </div>
                </section>

                {/* Values Grid */}
                <section className="px-4 sm:px-6 lg:px-8 py-12 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-[#0F3D3E]">Our Core Values</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div key={index} className="p-6 bg-[#F5EEDC]/20 rounded-xl border border-[#C8AD7F]/20 hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-[#0F3D3E] rounded-lg flex items-center justify-center mb-4 mx-auto">
                                        <value.icon className="h-6 w-6 text-[#F5EEDC]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">{value.title}</h3>
                                    <p className="text-slate-600 text-center">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Statement */}
                <section className="px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto text-center bg-[#0F3D3E] rounded-2xl p-8 md:p-12 shadow-xl">
                        <h2 className="text-3xl font-bold text-[#F5EEDC] mb-6">Our Mission</h2>
                        <p className="text-lg text-[#F5EEDC]/80 leading-relaxed">
                            "To bridge the gap between complex legal systems and the common man by leveraging advanced artificial intelligence, ensuring that every citizen understands their rights and has access to affordable legal recourse."
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Scale, Users, Shield, Target } from "lucide-react"

export const metadata = {
    title: "About Us - Lexi.AI",
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
        <div className="min-h-screen">
            <Header />
            <main className="pt-16">
                {/* Hero */}
                <div className="bg-[#1e3a8a] py-20 text-white">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Lexi.AI</h1>
                        <p className="text-xl max-w-2xl mx-auto text-blue-100">
                            Democratizing legal access through artificial intelligence and human expertise.
                        </p>
                    </div>
                </div>

                {/* Mission */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                                <div className="space-y-4 text-lg text-slate-600">
                                    <p>
                                        Navigating the legal system can be overwhelming, expensive, and confusing.
                                        Millions of people forego their rights simply because they don't understand them or can't afford a lawyer.
                                    </p>
                                    <p>
                                        Lexi.AI was built to change that. We combine advanced AI technology with a network of verified legal professionals
                                        to bridge the justice gap.
                                    </p>
                                    <p>
                                        Whether you are a student facing university issues, a tenant dealing with a landlord,
                                        or an employee denied their rights, Lexi.AI is your first line of defense.
                                    </p>
                                </div>
                            </div>
                            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-100">
                                {/* Placeholder for an image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <Scale className="h-32 w-32 text-[#1e3a8a]/20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value) => {
                                const Icon = value.icon
                                return (
                                    <div key={value.title} className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-[#1e3a8a]/10 rounded-lg flex items-center justify-center mb-6 text-[#1e3a8a]">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                        <p className="text-slate-600">{value.description}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

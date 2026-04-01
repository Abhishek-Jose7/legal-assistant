import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Scale, Users, Shield, Target, ArrowRight, Gavel, FileText, Globe } from "lucide-react"
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

    const features = [
        {
            icon: Gavel,
            title: "AI Legal Strategy",
            description: "Instantly analyze your legal standpoint and get a step-by-step action plan tailored to Indian Law."
        },
        {
            icon: FileText,
            title: "Smart Document Generation",
            description: "Draft complaints, notices, and agreements securely with our context-aware document builder."
        },
        {
            icon: Globe,
            title: "Pan-India Network",
            description: "Seamlessly connect with verified lawyers explicitly matched to the domain of your specific legal necessity."
        }
    ]

    return (
        <div className="min-h-screen bg-[#F5EEDC] font-sans text-[#2E2E2E] flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16 overflow-hidden">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                        <Scale className="w-[800px] h-[800px] text-[#0F3D3E]" />
                    </div>
                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F3D3E]/10 text-[#0F3D3E] text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#C8AD7F] animate-pulse" />
                            Our Vision
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#0F3D3E] mb-6 leading-tight">
                            Democratizing Legal Access with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8AD7F] to-[#b09668]">AI</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#0F3D3E]/70 mb-10 max-w-2xl mx-auto font-medium">
                            Nyaaya is your personal legal companion, designed to simplify Indian law and empower you with actionable, reliable knowledge.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                           <a href="/legal-action" className="px-8 py-4 rounded-xl bg-[#0F3D3E] text-[#F5EEDC] font-bold shadow-lg shadow-[#0F3D3E]/20 hover:bg-[#0F3D3E]/90 hover:-translate-y-1 transition-all flex items-center gap-2">
                               Take Legal Action <ArrowRight className="w-4 h-4" />
                           </a>
                        </div>
                    </div>
                </section>

                {/* Values Grid */}
                <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-[#0F3D3E]">Our Core Values</h2>
                            <div className="h-1 w-20 bg-[#C8AD7F] mx-auto mt-4 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div key={index} className="p-8 bg-[#F5EEDC]/30 rounded-2xl border border-[#C8AD7F]/20 hover:border-[#C8AD7F]/50 hover:shadow-xl hover:-translate-y-1 transition-all group">
                                    <div className="w-14 h-14 bg-[#0F3D3E] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                                        <value.icon className="h-7 w-7 text-[#C8AD7F]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0F3D3E] mb-3">{value.title}</h3>
                                    <p className="text-[#2E2E2E]/80 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Highlight */}
                <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#0F3D3E] text-[#F5EEDC]">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl font-black mb-6">The Future of Legal Assistance Is Here.</h2>
                                <p className="text-[#F5EEDC]/80 text-lg mb-8 leading-relaxed">
                                    We combine cutting-edge Large Language Models trained on comprehensive jurisprudence with verified legal frameworks to eliminate the barrier of jargon and hidden fees.
                                </p>
                                <div className="space-y-6">
                                    {features.map((feat, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="mt-1 bg-[#C8AD7F]/20 p-2 rounded-lg h-fit">
                                                <feat.icon className="w-5 h-5 text-[#C8AD7F]" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{feat.title}</h4>
                                                <p className="text-[#F5EEDC]/60 text-sm">{feat.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#C8AD7F] to-[#F5EEDC] rounded-3xl blur-3xl opacity-20" />
                                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm relative z-10 shadow-2xl">
                                    <div className="space-y-4">
                                        <div className="h-10 w-3/4 bg-white/10 rounded-lg animate-pulse" />
                                        <div className="h-4 w-full bg-white/5 rounded-lg" />
                                        <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
                                        <div className="h-4 w-4/6 bg-white/5 rounded-lg mb-8" />
                                        <div className="flex gap-3">
                                            <div className="h-10 w-24 bg-[#C8AD7F] rounded-lg" />
                                            <div className="h-10 w-24 bg-white/10 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Statement */}
                <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#F5EEDC]">
                    <div className="max-w-4xl mx-auto text-center border border-[#C8AD7F]/30 bg-white/50 rounded-3xl p-10 md:p-16 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8AD7F]/10 rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0F3D3E]/5 rounded-tr-full" />
                        <h2 className="text-3xl font-black text-[#0F3D3E] mb-6 relative z-10">Our Mission</h2>
                        <p className="text-xl md:text-2xl text-[#0F3D3E]/80 leading-relaxed font-serif italic relative z-10">
                            "To bridge the gap between complex legal systems and the common man by leveraging advanced artificial intelligence, ensuring that every citizen understands their rights and has access to affordable legal recourse."
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

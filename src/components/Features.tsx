"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Scale, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const features = [
    {
        icon: BookOpen,
        title: "Know Your Rights",
        description: "Legal laws explained in simple, easy-to-understand language for everyone.",
        href: "/rights",
        color: "bg-blue-100 text-blue-600",
        buttonText: "Read Guides",
    },
    {
        icon: FileText,
        title: "Legal Templates",
        description: "Pre-drafted legal documents for rent, contracts, notices, and more.",
        href: "/templates",
        color: "bg-emerald-100 text-emerald-600",
        buttonText: "View Templates",
    },
    {
        icon: Scale,
        title: "Find a Lawyer",
        description: "Connect with verified legal experts and book consultations instantly.",
        href: "/lawyers",
        color: "bg-purple-100 text-purple-600",
        buttonText: "Search Lawyers",
    },
]

export default function Features() {
    return (
        <section className="w-full py-16 md:py-24 bg-[#F5EEDC] relative overflow-hidden">
            {/* Decorative gradient blob */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-[#2E2E2E] mb-6"
                    >
                        Everything you need for <span className="text-[#0F3D3E]">Legal Help</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[#2E2E2E]/80 max-w-2xl mx-auto"
                    >
                        We simplify the legal process by providing tools, knowledge, and expert connections all in one place.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <Link href={feature.href} className="block h-full">
                                    <Card className="h-full border-2 border-[#C8AD7F]/30 hover:border-[#0F3D3E]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-[#F5EEDC]/80 backdrop-blur-sm group">
                                        <CardContent className="p-8 flex flex-col h-full">
                                            <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="h-7 w-7" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-[#2E2E2E] mb-3 group-hover:text-[#0F3D3E] transition-colors">
                                                {feature.title}
                                            </h3>
                                            <p className="text-[#2E2E2E]/70 mb-8 flex-grow leading-relaxed">
                                                {feature.description}
                                            </p>
                                            <div className="flex items-center text-[#0F3D3E] font-semibold group-hover:gap-2 transition-all">
                                                {feature.buttonText}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

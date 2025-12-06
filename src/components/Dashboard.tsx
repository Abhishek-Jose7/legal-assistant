"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BookOpen, Scale, FileText, ArrowRight, Users, Shield, Smartphone, MessageSquare, Newspaper, Gavel, Star, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs" // Assuming Clerk
import { Button } from "@/components/ui/button"

export default function Dashboard() {
    const { isSignedIn, user } = useUser();

    // Mock Data
    const recommendedData = [
        {
            title: "Tenant Security Deposit Rules",
            description: "Learn about your rights regarding security deposit refunds and deductions.",
            icon: Shield,
            color: "bg-blue-100 text-blue-600",
            href: "/rights"
        },
        {
            title: "Digital Harassment Protection",
            description: "Legal steps you can take against online bullying and cyberstalking.",
            icon: Smartphone,
            color: "bg-purple-100 text-purple-600",
            href: "/rights"
        }
    ];

    const recentActivity = [
        {
            title: "My employer hasn’t paid salary",
            type: "Conversation",
            date: "2 days ago",
            icon: MessageSquare,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Uploaded rent agreement",
            type: "Analysis Complete",
            date: "1 week ago",
            icon: FileText,
            color: "bg-orange-100 text-orange-600"
        }
    ];

    const legalNews = [
        {
            title: "Data Privacy Bill Passed",
            summary: "New laws mandate stricter data handling for tech companies.",
            icon: Newspaper,
            color: "bg-pink-100 text-pink-600",
            date: "Today"
        },
        {
            title: "RERA Ruling for Tenants",
            summary: "Tenants can now claim interest on delayed possession.",
            icon: Gavel,
            color: "bg-indigo-100 text-indigo-600",
            date: "Yesterday"
        }
    ];

    // Main Features for Public/Guest View (from Features.tsx)
    const publicFeatures = [
        {
            icon: Users,
            title: "Rights by Category",
            description: "Quick access to legal protections for Students, Women, Employees, and more.",
            href: "/personas",
            color: "bg-indigo-100 text-indigo-600",
            buttonText: "Explore Rights",
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

    return (
        <section className="w-full py-12 md:py-16 bg-[#F5EEDC] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Header Section */}
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E]">
                        {isSignedIn ? `Welcome back, ${user?.firstName || 'User'}` : "Legal Tools & Updates"}
                    </h2>
                    <p className="text-[#2E2E2E]/80 mt-2 text-lg">
                        {isSignedIn ? "Here are your recommended actions and recent updates." : "Everything you need to navigate the legal system with confidence."}
                    </p>
                </div>

                {/* SIGNED IN DASHBOARD */}
                {isSignedIn && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Column 1: Recommended */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-[#0F3D3E] mb-4">
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Recommended for You
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {recommendedData.map((item, idx) => (
                                        <Card key={idx} className="border-2 border-[#C8AD7F]/30 hover:border-[#0F3D3E]/30 transition-all hover:shadow-md bg-white/60 cursor-pointer">
                                            <CardContent className="p-6">
                                                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                                                    <item.icon className="h-6 w-6" />
                                                </div>
                                                <h4 className="font-bold text-lg text-[#2E2E2E] mb-2">{item.title}</h4>
                                                <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                                                <Link href={item.href} className="text-sm font-semibold text-[#0F3D3E] flex items-center hover:gap-2 transition-all">
                                                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-[#0F3D3E] mb-4">
                                    <Clock className="h-5 w-5" /> Saved / Recent Activity
                                </h3>
                                <Card className="border border-[#C8AD7F]/30 bg-white/60">
                                    <CardContent className="p-0">
                                        {recentActivity.map((item, idx) => (
                                            <div key={idx} className={`flex items-center gap-4 p-4 ${idx !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-slate-50 transition-colors cursor-pointer`}>
                                                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-[#2E2E2E]">{item.title}</h4>
                                                    <p className="text-xs text-slate-500">{item.type}</p>
                                                </div>
                                                <span className="text-xs text-slate-400">{item.date}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Column 2: News (Right Sidebar) */}
                        <div className="lg:col-span-1">
                            <h3 className="flex items-center gap-2 text-xl font-semibold text-[#0F3D3E] mb-4">
                                <Newspaper className="h-5 w-5" /> Legal News & Updates
                            </h3>
                            <Card className="border-2 border-[#C8AD7F]/30 bg-white/60">
                                <CardContent className="p-0">
                                    {legalNews.map((news, idx) => (
                                        <div key={idx} className="p-5 border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${news.color} font-medium`}>
                                                    {news.title.split(' ')[0]}
                                                </span>
                                                <span className="text-xs text-slate-400">{news.date}</span>
                                            </div>
                                            <h4 className="font-bold text-[#2E2E2E] mb-1">{news.title}</h4>
                                            <p className="text-sm text-slate-600 leading-snug">{news.summary}</p>
                                        </div>
                                    ))}
                                    <div className="p-4 text-center">
                                        <Button variant="ghost" className="text-[#0F3D3E] text-sm w-full">Read More News</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}


                {/* SIGNED OUT DASHBOARD */}
                {!isSignedIn && (
                    <div className="space-y-12">
                        {/* Legal News Section */}
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="flex items-center gap-2 text-2xl font-bold text-[#0F3D3E]">
                                    <Newspaper className="h-6 w-6" /> Trending Legal News
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {legalNews.map((news, idx) => (
                                    <Card key={idx} className="border-2 border-[#C8AD7F]/30 bg-white/60 hover:shadow-lg transition-all">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`w-10 h-10 rounded-full ${news.color} flex items-center justify-center`}>
                                                    <news.icon className="h-5 w-5" />
                                                </div>
                                                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">{news.date}</span>
                                            </div>
                                            <h4 className="font-bold text-lg text-[#2E2E2E] mb-2">{news.title}</h4>
                                            <p className="text-slate-600 mb-4">{news.summary}</p>
                                            <Link href="#" className="text-sm font-semibold text-[#0F3D3E] hover:underline">Read full story</Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Main Features */}
                        <div>
                            <div className="text-center mb-10">
                                <h3 className="text-2xl font-bold text-[#2E2E2E]">Explore Our Services</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                                {publicFeatures.map((feature, index) => {
                                    const Icon = feature.icon
                                    return (
                                        <motion.div
                                            key={feature.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
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
                    </div>
                )}

            </div>
        </section>
    )
}

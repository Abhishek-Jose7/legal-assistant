"use client"


import { useState, useEffect } from "react"
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

    const [newsData, setNewsData] = useState<any[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setNewsData(data);
                }
            } catch (error) {
                console.error("Failed to load news", error);
            } finally {
                setLoadingNews(false);
            }
        };
        fetchNews();
    }, []);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

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
                            <Card className="border-2 border-[#C8AD7F]/30 bg-white/60 max-h-[600px] overflow-hidden flex flex-col">
                                <CardContent className="p-0 overflow-y-auto custom-scrollbar">
                                    {loadingNews ? (
                                        <div className="p-8 text-center text-slate-500">Loading latest news...</div>
                                    ) : (
                                        newsData.slice(0, 5).map((news, idx) => (
                                            <div key={idx} className="p-5 border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium`}>
                                                        {news.relevance || "Legal Update"}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">{formatTime(news.publishedAt)}</span>
                                                </div>
                                                <Link href={news.url} target="_blank" className="block group-hover:text-[#0F3D3E] transition-colors">
                                                    <h4 className="font-bold text-[#2E2E2E] mb-1 text-sm leading-tight">{news.title}</h4>
                                                </Link>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{news.source}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {!loadingNews && newsData.length === 0 && (
                                        <div className="p-8 text-center text-slate-500">No recent updates found.</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}


                {/* SIGNED OUT DASHBOARD */}
                {!isSignedIn && (
                    <div className="space-y-12">
                        {/* Legal News Section - Full Width Marquee */}
                        <div className="w-screen relative left-[calc(-50vw+50%)] overflow-hidden py-10 bg-gradient-to-r from-[#F5EEDC] via-white/50 to-[#F5EEDC]">
                            <div className="container mx-auto px-4 mb-6">
                                <h3 className="flex items-center gap-2 text-2xl font-bold text-[#0F3D3E]">
                                    <Newspaper className="h-6 w-6" /> Trending Legal News
                                </h3>
                            </div>

                            {loadingNews ? (
                                <div className="container mx-auto px-4">
                                    <div className="w-full h-[300px] flex items-center justify-center text-slate-500 bg-white/50 rounded-xl border border-dashed border-slate-300">
                                        Loading latest legal updates...
                                    </div>
                                </div>
                            ) : newsData.length === 0 ? (
                                <div className="container mx-auto px-4">
                                    <div className="w-full h-[300px] flex flex-col items-center justify-center text-center py-12 bg-white/50 rounded-xl border border-dashed border-slate-300">
                                        <Newspaper className="h-10 w-10 text-slate-300 mb-3" />
                                        <p className="text-slate-500">No trending legal news available at the moment.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full overflow-hidden">
                                    {/* Gradients to fade edges */}
                                    <div className="absolute top-0 left-0 z-10 h-full w-[100px] bg-gradient-to-r from-[#F5EEDC] to-transparent pointer-events-none" />
                                    <div className="absolute top-0 right-0 z-10 h-full w-[100px] bg-gradient-to-l from-[#F5EEDC] to-transparent pointer-events-none" />

                                    {/* Marquee Track */}
                                    <motion.div
                                        className="flex gap-6 pl-4"
                                        animate={{ x: ["0%", "-50%"] }}
                                        transition={{
                                            ease: "linear",
                                            duration: 80, // Slow animation
                                            repeat: Infinity,
                                        }}
                                        whileHover={{ animationPlayState: "paused" }} // Note: Framer motion pauses differently, but we'll try style injection or use a hover state
                                        style={{ width: "fit-content" }}
                                    // Simple hover pause hack via CSS class if needed, or maintain standard motion
                                    >
                                        {/* Render items twice for seamless loop */}
                                        {[...newsData.slice(0, 10), ...newsData.slice(0, 10)].map((news, idx) => (
                                            <Card
                                                key={`${idx}-${news.title}`}
                                                className="min-w-[320px] md:min-w-[380px] max-w-[380px] border-2 border-[#C8AD7F]/30 bg-white/80 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-[380px] flex flex-col overflow-hidden group cursor-pointer"
                                            >
                                                {/* Image or Fallback Header */}
                                                {news.urlToImage ? (
                                                    <div className="h-44 w-full overflow-hidden relative shrink-0">
                                                        <img src={news.urlToImage} alt="News" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                        <div className="absolute top-2 right-2">
                                                            <span className="text-[10px] font-bold text-[#0F3D3E] bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">{formatTime(news.publishedAt)}</span>
                                                        </div>
                                                        <div className="absolute top-2 left-2">
                                                            <span className="text-[10px] font-bold text-white bg-blue-600/90 px-2 py-1 rounded-full shadow-sm">{news.relevance}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-44 w-full bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center relative shrink-0">
                                                        <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm`}>
                                                            <Newspaper className="h-6 w-6 text-slate-400" />
                                                        </div>
                                                        <div className="absolute top-2 right-2">
                                                            <span className="text-[10px] font-bold text-slate-500 bg-white/50 px-2 py-1 rounded-full">{formatTime(news.publishedAt)}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <CardContent className="p-5 flex flex-col flex-1 relative">
                                                    <Link href={news.url} target="_blank" className="absolute inset-0 z-10" />
                                                    <h4 className="font-bold text-lg text-[#2E2E2E] mb-2 group-hover:text-[#0F3D3E] line-clamp-2 leading-tight transition-colors">
                                                        {news.title}
                                                    </h4>
                                                    <p className="text-slate-600 mb-4 line-clamp-3 text-sm flex-grow leading-relaxed">
                                                        {news.description}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 bg-transparent z-20">
                                                        <span className="text-[10px] font-bold text-slate-500 truncate max-w-[120px]">{news.source}</span>
                                                        <span className="text-xs font-semibold text-[#0F3D3E] group-hover:underline flex items-center">
                                                            Read full story <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </motion.div>
                                </div>
                            )}
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


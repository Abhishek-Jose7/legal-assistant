import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactForm from "@/components/ContactForm"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata = {
    title: "Contact Us - Lexi.AI",
    description: "Get in touch with the Lexi.AI team for support or inquiries.",
}

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-slate-50 pt-16">
                <div className="bg-[#1e3a8a] py-16 text-white pb-32">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                        <p className="text-lg max-w-2xl mx-auto text-blue-100">
                            We're here to answer your questions and hear your feedback.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-6 -mt-20 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="space-y-6 lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-md border">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg text-[#1e3a8a]">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Email Us</h3>
                                        <p className="text-slate-600 text-sm mt-1">support@lexi.ai</p>
                                        <p className="text-slate-600 text-sm">legal@lexi.ai</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md border">
                                <div className="flex items-start gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-lg text-[#10b981]">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Call Us</h3>
                                        <p className="text-slate-600 text-sm mt-1">+91 98765 43210</p>
                                        <p className="text-xs text-slate-400 mt-1">Mon-Fri, 9am - 6pm</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md border">
                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Visit Us</h3>
                                        <p className="text-slate-600 text-sm mt-1">
                                            123 Legal Tech Park,<br />
                                            Cyber City, Gurgaon,<br />
                                            India - 122002
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

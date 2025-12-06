"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Send } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactForm() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate form submission
        setTimeout(() => setIsSubmitted(true), 1000)
    }

    if (isSubmitted) {
        return (
            <Card className="max-w-md mx-auto border-2 border-[#10b981]/20 bg-[#10b981]/5">
                <CardContent className="p-12 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#10b981]/20 rounded-full flex items-center justify-center mb-4 text-[#10b981]">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                    <p className="text-slate-600">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button
                        className="mt-6 bg-[#1e3a8a] text-white"
                        onClick={() => setIsSubmitted(false)}
                    >
                        Send Another Message
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-2xl mx-auto border shadow-lg overflow-hidden">
            <CardContent className="p-0">
                <div className="bg-[#1e3a8a] p-8 text-white text-center">
                    <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
                    <p className="opacity-90">Have questions about Lexi.AI? We're here to help.</p>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="How can we help?" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Tell us more about your inquiry..."
                            className="min-h-[150px]"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 h-12 text-base">
                        <Send className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

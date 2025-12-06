"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, ChevronRight, RefreshCcw } from "lucide-react"

const questions = [
    {
        id: 1,
        question: "Do you have a registered Rent Agreement or Property Deed?",
        description: "A verbal agreement is not legally binding in most disputes.",
        options: [
            { label: "Yes, Registered", value: 20 },
            { label: "Notarized Only", value: 10 },
            { label: "Verbal / None", value: 0 }
        ]
    },
    {
        id: 2,
        question: "Is your name correctly spelled on all Government IDs?",
        description: "Mismatches between Aadhaar, PAN, and Passport cause major banking/legal issues.",
        options: [
            { label: "Yes, All Match", value: 20 },
            { label: "Minor Differences", value: 10 },
            { label: "No / Don't Know", value: 0 }
        ]
    },
    {
        id: 3,
        question: "Do you have a valid nomination for your Bank Accounts?",
        description: "Unclaimed funds are a huge issue without clear nominees.",
        options: [
            { label: "Yes, for All", value: 20 },
            { label: "For Some", value: 10 },
            { label: "No", value: 0 }
        ]
    },
    {
        id: 4,
        question: "Have you drafted a Will?",
        description: "Essential regardless of age to avoid family disputes.",
        options: [
            { label: "Yes, Registered", value: 20 },
            { label: "Written but Unregistered", value: 10 },
            { label: "No", value: 0 }
        ]
    },
    {
        id: 5,
        question: "Do you have Health/Term Insurance?",
        description: "Financial-legal safety net for emergencies.",
        options: [
            { label: "Yes, Sufficient Cover", value: 20 },
            { label: "Employer Cover Only", value: 10 },
            { label: "None", value: 0 }
        ]
    }
]

export default function LegalHealthQuiz() {
    const [currentStep, setCurrentStep] = useState(0)
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)

    const handleAnswer = (value: number) => {
        setScore(prev => prev + value)
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            setShowResults(true)
        }
    }

    const resetQuiz = () => {
        setScore(0)
        setCurrentStep(0)
        setShowResults(false)
    }

    const getRiskLevel = (score: number) => {
        if (score >= 80) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100", msg: "You are legally secure! Keep maintaining your documents." }
        if (score >= 50) return { label: "Moderate Risk", color: "text-yellow-600", bg: "bg-yellow-100", msg: "You have some protection, but distinct gaps exist." }
        return { label: "High Vulnerability", color: "text-red-600", bg: "bg-red-100", msg: "You are at significant legal risk. Immediate action recommended." }
    }

    const risk = getRiskLevel(score)

    return (
        <section className="w-full max-w-3xl mx-auto py-12 px-4">
             // Header
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#0F3D3E] mb-2 flex items-center justify-center gap-2">
                    <ShieldCheck className="h-8 w-8" /> Legal Health Check
                </h2>
                <p className="text-slate-600">Calculate your legal vulnerability score in 2 minutes.</p>
            </div>

            <Card className="border-2 border-[#C8AD7F]/30 bg-white/80 shadow-lg min-h-[400px] flex flex-col justify-center">
                {!showResults ? (
                    <CardContent className="p-8">
                        <div className="mb-6 flex justify-between items-center text-sm font-medium text-slate-500">
                            <span>Question {currentStep + 1} of {questions.length}</span>
                            <span>{Math.round(((currentStep) / questions.length) * 100)}% Complete</span>
                        </div>
                        <Progress value={((currentStep) / questions.length) * 100} className="h-2 mb-8 bg-slate-100" />

                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{questions[currentStep].question}</h3>
                        <p className="text-slate-500 mb-8">{questions[currentStep].description}</p>

                        <div className="grid gap-3">
                            {questions[currentStep].options.map((option, idx) => (
                                <Button
                                    key={idx}
                                    onClick={() => handleAnswer(option.value)}
                                    variant="outline"
                                    className="h-auto py-4 px-6 justify-between text-lg hover:border-[#1e3a8a] hover:bg-blue-50 transition-all group"
                                >
                                    {option.label}
                                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#1e3a8a]" />
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                ) : (
                    <CardContent className="p-8 flex flex-col items-center text-center">
                        <div className={`w-24 h-24 rounded-full ${risk.bg} flex items-center justify-center mb-6 animate-in zoom-in duration-500`}>
                            <ShieldCheck className={`h-12 w-12 ${risk.color}`} />
                        </div>

                        <h3 className="text-4xl font-bold text-slate-800 mb-2">{score} / 100</h3>
                        <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-6 ${risk.bg} ${risk.color}`}>
                            {risk.label}
                        </div>

                        <p className="text-lg text-slate-600 mb-8 max-w-md">
                            {risk.msg}
                        </p>

                        <div className="grid w-full gap-4 max-w-sm">
                            <Button className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 w-full" onClick={() => window.location.href = '/#ai-assistant'}>
                                Ask AI how to fix this
                            </Button>
                            <Button variant="outline" className="w-full gap-2" onClick={resetQuiz}>
                                <RefreshCcw className="h-4 w-4" /> Retake Quiz
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>
        </section>
    )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, ChevronRight, RefreshCcw } from "lucide-react"

const quizData: Record<string, any[]> = {
    "general": [
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
    ],
    "tenant": [
        {
            id: 1,
            question: "Does your rent agreement have a valid lock-in period clause?",
            description: "Protects you from sudden eviction.",
            options: [{ label: "Yes", value: 25 }, { label: "No/Unsure", value: 0 }]
        },
        {
            id: 2,
            question: "Is the security deposit refund timeline clearly mentioned?",
            description: "Avoids delays in getting your money back.",
            options: [{ label: "Yes", value: 25 }, { label: "No", value: 0 }]
        },
        {
            id: 3,
            question: "Have you received a rent receipt for your payments?",
            description: "Required for HRA claims and proof of payment.",
            options: [{ label: "Yes, for all", value: 25 }, { label: "Sometimes/No", value: 0 }]
        },
        {
            id: 4,
            question: "Is the notice period for vacating defined?",
            description: "Prevents arbitrary eviction.",
            options: [{ label: "Yes", value: 25 }, { label: "No", value: 0 }]
        }
    ],
    "freelancer": [
        {
            id: 1,
            question: "Do you sign a formal contract before starting work?",
            description: "Emails are okay, but contracts are safer.",
            options: [{ label: "Always", value: 30 }, { label: "Sometimes", value: 15 }, { label: "Never", value: 0 }]
        },
        {
            id: 2,
            question: "Does your contract have a 'Scope Creep' clause?",
            description: "Ensures you get paid extra for extra work.",
            options: [{ label: "Yes", value: 30 }, { label: "No", value: 0 }]
        },
        {
            id: 3,
            question: "Do you have a clear payment schedule (e.g. 50% advance)?",
            description: "Protects cash flow.",
            options: [{ label: "Yes", value: 40 }, { label: "No", value: 0 }]
        }
    ],
    "digital": [
        {
            id: 1,
            question: "Do you use unique passwords for banking and email?",
            description: "Prevents domino-effect hacking.",
            options: [{ label: "Yes", value: 25 }, { label: "No (Reuse)", value: 0 }]
        },
        {
            id: 2,
            question: "Is Two-Factor Authentication (2FA) enabled?",
            description: "Critical layer of security.",
            options: [{ label: "Yes, Everywhere", value: 25 }, { label: "Some Apps", value: 15 }, { label: "No", value: 0 }]
        },
        {
            id: 3,
            question: "Do you check app permissions before installing?",
            description: "Prevents data theft.",
            options: [{ label: "Always", value: 25 }, { label: "Sometimes/Never", value: 0 }]
        },
        {
            id: 4,
            question: "Do you back up your critical documents to cloud/drive?",
            description: "Protection against ransomware or device loss.",
            options: [{ label: "Yes, Automated", value: 25 }, { label: "Manually/Rarely", value: 10 }, { label: "No", value: 0 }]
        }
    ]
};

const topics = [
    { id: "general", label: "General Legal Hygiene", icon: ShieldCheck, desc: "Basic documents check (IDs, Will, Insurance)." },
    { id: "tenant", label: "Tenant Safeguards", icon: FileText, desc: "Rent agreements, deposits, and eviction rights." },
    { id: "freelancer", label: "Freelancer/Contractor", icon: CheckCircle2, desc: "Contracts, payments, and IP rights." },
    { id: "digital", label: "Digital Safety", icon: AlertTriangle, desc: "Cyber hygiene, passwords, and data privacy." },
]

export default function LegalHealthQuiz() {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)

    // Current Questions based on topic
    const currentQuestions = selectedTopic ? quizData[selectedTopic] : []

    const handleAnswer = (value: number) => {
        setScore(prev => prev + value)
        if (currentStep < currentQuestions.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            setShowResults(true)
        }
    }

    const resetQuiz = () => {
        setScore(0)
        setCurrentStep(0)
        setShowResults(false)
        setSelectedTopic(null)
    }

    // Dynamic Risk Logic based on PERCENTAGE
    const getRiskLevel = (rawScore: number) => {
        // Calculate max possible points for this specific quiz to normalize
        let totalPossible = 0;
        currentQuestions.forEach(q => {
            const maxOption = Math.max(...q.options.map((o: any) => o.value));
            totalPossible += maxOption;
        });

        // Avoid division by zero
        if (totalPossible === 0) totalPossible = 100;

        const percentage = Math.round((rawScore / totalPossible) * 100);

        if (percentage >= 80) return { score: percentage, label: "Excellent", color: "text-green-600", bg: "bg-green-100", msg: "You have strong protections in this area!" }
        if (percentage >= 50) return { score: percentage, label: "Moderate Risk", color: "text-yellow-600", bg: "bg-yellow-100", msg: "You have some basics, but significant gaps exist." }
        return { score: percentage, label: "High Vulnerability", color: "text-red-600", bg: "bg-red-100", msg: "You are highly vulnerable here. Immediate action recommended." }
    }

    const result = showResults ? getRiskLevel(score) : null;

    return (
        <section className="w-full max-w-4xl mx-auto py-12 px-4">
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#0F3D3E] mb-2 flex items-center justify-center gap-2">
                    <ShieldCheck className="h-8 w-8" /> Legal Assessment
                </h2>
                <p className="text-slate-600">Select a category to evaluate your legal preparedness.</p>
            </div>

            {/* TOPIC SELECTION GRID */}
            {!selectedTopic && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    {topics.map((t) => (
                        <Card
                            key={t.id}
                            onClick={() => {
                                setSelectedTopic(t.id);
                                setCurrentStep(0);
                                setScore(0);
                                setShowResults(false);
                            }}
                            className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all border-2 border-[#C8AD7F]/20 hover:border-[#0F3D3E]/50 group bg-white/80"
                        >
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#F5EEDC] flex items-center justify-center group-hover:bg-[#0F3D3E] transition-colors">
                                    <t.icon className="h-7 w-7 text-[#0F3D3E] group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#2E2E2E]">{t.label}</h3>
                                    <p className="text-slate-500 text-sm">{t.desc}</p>
                                </div>
                                <ChevronRight className="ml-auto h-5 w-5 text-slate-300 group-hover:text-[#0F3D3E]" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* QUIZ INTERFACE */}
            {selectedTopic && (
                <Card className="border-2 border-[#C8AD7F]/30 bg-white/90 shadow-lg min-h-[450px] flex flex-col justify-center relative backdrop-blur-sm">
                    {/* Back Button */}
                    {!showResults && (
                        <Button variant="ghost" className="absolute top-4 left-4 text-slate-400 hover:text-[#0F3D3E]" onClick={() => setSelectedTopic(null)}>
                            ← Back
                        </Button>
                    )}

                    {!showResults && currentQuestions.length > 0 ? (
                        <CardContent className="p-8 md:p-12 pt-16">
                            <div className="mb-6 flex justify-between items-center text-sm font-medium text-slate-500">
                                <span className="uppercase tracking-wider text-xs font-bold text-[#0F3D3E]">{topics.find(t => t.id === selectedTopic)?.label}</span>
                                <span>{Math.round(((currentStep) / currentQuestions.length) * 100)}%</span>
                            </div>
                            <Progress value={((currentStep) / currentQuestions.length) * 100} className="h-2 mb-8 bg-slate-100" />

                            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">{currentQuestions[currentStep].question}</h3>
                            <p className="text-slate-500 mb-10 text-lg">{currentQuestions[currentStep].description}</p>

                            <div className="grid gap-4">
                                {currentQuestions[currentStep].options.map((option: any, idx: number) => (
                                    <Button
                                        key={idx}
                                        onClick={() => handleAnswer(option.value)}
                                        variant="outline"
                                        className="h-auto py-5 px-6 justify-between text-lg hover:border-[#0F3D3E] hover:bg-blue-50/50 transition-all group border-slate-200"
                                    >
                                        {option.label}
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#0F3D3E]" />
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    ) : showResults ? (
                        <CardContent className="p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                            <div className={`w-28 h-28 rounded-full ${result?.bg} flex items-center justify-center mb-6`}>
                                <ShieldCheck className={`h-14 w-14 ${result?.color}`} />
                            </div>

                            <h3 className="text-5xl font-bold text-slate-800 mb-2">{result?.score}%</h3>
                            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-8 ${result?.bg} ${result?.color}`}>
                                {result?.label}
                            </div>

                            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                                {result?.msg}
                            </p>

                            <div className="grid w-full gap-4 max-w-sm">
                                <Button className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 w-full h-12 text-lg shadow-lg shadow-[#0F3D3E]/20" onClick={() => window.location.href = '/chat'}>
                                    Ask AI to Fix Gaps
                                </Button>
                                <Button variant="outline" className="w-full gap-2 h-12 text-lg border-slate-300" onClick={resetQuiz}>
                                    <RefreshCcw className="h-4 w-4" /> Pick Another Topic
                                </Button>
                            </div>
                        </CardContent>
                    ) : (
                        <div className="p-10 text-center">Quiz content missing for this topic.</div>
                    )}
                </Card>
            )}
        </section>
    )
}

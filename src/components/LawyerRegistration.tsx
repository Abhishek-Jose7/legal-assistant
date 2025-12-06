"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Gavel, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LawyerRegistration() {
    const { user } = useUser()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Form, 2: Success
    const [formData, setFormData] = useState({
        bar_council_id: "",
        specialization: "",
        experience_years: "",
        bio: "",
        consultation_fee: "",
    })

    const handleRegister = async () => {
        if (!user) return
        setLoading(true)

        // 1. Ensure basic profile exists and is updated to "Lawyer" type
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                clerk_id: user.id,
                full_name: user.fullName,
                email: user.primaryEmailAddress?.emailAddress,
                user_type: 'Lawyer'
            }, { onConflict: 'clerk_id' })

        if (profileError) {
            alert("Error updating base profile")
            setLoading(false)
            return
        }

        // 2. Insert into lawyer_profiles
        const { error: lawyerError } = await supabase
            .from('lawyer_profiles')
            .insert({
                clerk_id: user.id,
                bar_council_id: formData.bar_council_id,
                specialization: formData.specialization.split(',').map(s => s.trim()),
                experience_years: parseInt(formData.experience_years),
                bio: formData.bio,
                consultation_fee: parseInt(formData.consultation_fee),
                verification_status: 'pending'
            })

        setLoading(false)

        if (lawyerError) {
            console.error(lawyerError)
            alert("Error registering as lawyer. You might already be registered.")
        } else {
            setStep(2)
        }
    }

    if (step === 2) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center space-y-4">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold">Registration Successful!</h1>
                <p className="text-slate-600">
                    Your profile has been submitted for verification. You can now access the Lawyer Dashboard.
                </p>
                <Button onClick={() => router.push('/dashboard/lawyer')} className="w-full bg-[#1e3a8a]">
                    Go to Dashboard
                </Button>
            </div>
        )
    }

    return (
        <Card className="max-w-2xl mx-auto mt-10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gavel className="w-6 h-6 text-[#1e3a8a]" />
                    Lawyer Registration
                </CardTitle>
                <CardDescription>
                    Join our network of verified legal experts. Please provide your professional details.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Bar Council ID</Label>
                    <Input
                        value={formData.bar_council_id}
                        onChange={(e) => setFormData({ ...formData, bar_council_id: e.target.value })}
                        placeholder="e.g. MH/1234/2020"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Experience (Years)</Label>
                        <Input
                            type="number"
                            value={formData.experience_years}
                            onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                            placeholder="5"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Consultation Fee (₹)</Label>
                        <Input
                            type="number"
                            value={formData.consultation_fee}
                            onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                            placeholder="1500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Specializations (comma separated)</Label>
                    <Input
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        placeholder="Family Law, Criminal Law, Property Dispute"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Professional Bio</Label>
                    <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Briefly describe your expertise and background..."
                        className="h-24"
                    />
                </div>

                <Button onClick={handleRegister} className="w-full bg-[#1e3a8a] py-6" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Verification Request
                </Button>
            </CardContent>
        </Card>
    )
}

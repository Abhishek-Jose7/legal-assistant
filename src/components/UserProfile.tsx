"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner" // Assuming sonner is installed or handle alert

export default function UserProfile() {
    const { user, isLoaded } = useUser()
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({
        full_name: "",
        phone: "",
        address: "",
        user_type: "Individual", // Individual, Lawyer, Student
    })

    // Load profile when user is loaded
    useEffect(() => {
        if (user?.id) {
            fetchProfile(user.id)
        }
    }, [user])

    const fetchProfile = async (userId: string) => {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('clerk_id', userId)
            .single()

        if (data) {
            setProfile({
                full_name: data.full_name || user?.fullName || "",
                phone: data.phone || "",
                address: data.address || "",
                user_type: data.user_type || "Individual",
            })
        }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!user?.id) return
        setLoading(true)

        const updates = {
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: profile.full_name,
            phone: profile.phone,
            address: profile.address,
            user_type: profile.user_type,
            updated_at: new Date(),
        }

        // Upsert: Update if exists, Insert if new
        const { error } = await supabase
            .from('profiles')
            .upsert(updates, { onConflict: 'clerk_id' })

        setLoading(false)
        if (error) {
            console.error(error)
            alert("Error saving profile")
        } else {
            alert("Profile updated successfully!")
        }
    }

    if (!isLoaded) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
    if (!user) return <div className="p-8 text-center bg-slate-50 rounded-lg">Please sign in to view your profile.</div>

    return (
        <div className="max-w-4xl mx-auto mt-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">My Profile</h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 overflow-hidden">
                            <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <CardTitle className="text-xl">{user.fullName}</CardTitle>
                        <p className="text-sm text-slate-500 max-w-full truncate px-2">{user.primaryEmailAddress?.emailAddress}</p>
                    </CardHeader>
                </Card>

                {/* Right Column: Editable Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="Official Name for Documents"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="+91 9876543210"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Current Address</Label>
                                <Input
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    placeholder="City, State"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Legal Persona</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>I am primarily a...</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                                    value={profile.user_type}
                                    onChange={(e) => setProfile({ ...profile, user_type: e.target.value })}
                                >
                                    <option value="Individual">Individual (General)</option>
                                    <option value="Student">Student</option>
                                    <option value="Business Owner">Business Owner</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Tenant">Tenant</option>
                                    <option value="Landlord">Landlord</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-1">
                                    This helps Lexi.AI tailor legal advice and document drafts specifically for your needs.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button onClick={handleSave} className="w-full bg-[#1e3a8a] text-lg py-6" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MessageSquare, Clock } from "lucide-react"
import { toast } from "sonner" // Assuming sonner is installed or handle alert

export default function UserProfile() {
    const { user, isLoaded } = useUser()
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({
        full_name: "",
        phone: "",
        address: "",
        user_type: "Individual",
        age: "",
        gender: "",
    })
    const [sessions, setSessions] = useState<any[]>([])
    const [completedRights, setCompletedRights] = useState<any[]>([])

    // Load profile when user is loaded
    useEffect(() => {
        if (user?.id) {
            fetchProfile(user.id)
            fetchProfile(user.id)
            fetchSessions(user.id)
            fetchCompletedRights(user.id)
        }
    }, [user])

    const fetchCompletedRights = async (userId: string) => {
        const { data } = await supabase.from('user_rights_progress').select('*').eq('user_id', userId);
        if (data) setCompletedRights(data);
    }

    const fetchSessions = async (userId: string) => {
        const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (data) setSessions(data);
    }

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
                age: data.age || "",
                gender: data.gender || "",
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
            age: profile.age ? parseInt(profile.age) : null,
            gender: profile.gender,
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
        <div className="w-full pb-20">
            <h1 className="text-4xl font-bold text-[#0F3D3E] mb-8">My Profile</h1>

            <div className="flex flex-col gap-8">
                {/* Top Section: User Info Card in full width or large grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 shadow-lg border-[#C8AD7F]/40 bg-[#F5EEDC]/80 backdrop-blur">
                        <CardHeader className="flex flex-col items-center pt-8">
                            <div className="w-32 h-32 rounded-full bg-[#C8AD7F]/20 mb-4 overflow-hidden shadow-lg border-4 border-[#F5EEDC]">
                                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <CardTitle className="text-2xl text-center text-[#0F3D3E]">{user.fullName}</CardTitle>
                            <p className="text-sm text-[#2E2E2E]/70 text-center font-medium">{user.primaryEmailAddress?.emailAddress}</p>
                            <div className="mt-4 flex gap-2">
                                <span className="px-3 py-1 bg-[#0F3D3E]/10 text-[#0F3D3E] rounded-full text-xs font-bold uppercase tracking-wide">
                                    {profile.user_type}
                                </span>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Middle: Personal Details & Legal Persona side-by-side on large screens */}
                    <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-md border-[#C8AD7F]/30 bg-white/50 hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg text-[#0F3D3E]">Personal Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-[#2E2E2E]/60 uppercase font-semibold">Full Name</Label>
                                    <Input
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="bg-white/80 border-[#C8AD7F]/30 focus:border-[#0F3D3E] focus:ring-[#0F3D3E]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-[#2E2E2E]/60 uppercase font-semibold">Phone</Label>
                                    <Input
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="bg-white/80 border-[#C8AD7F]/30 focus:border-[#0F3D3E] focus:ring-[#0F3D3E]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-[#2E2E2E]/60 uppercase font-semibold">Address</Label>
                                    <Input
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        className="bg-white/80 border-[#C8AD7F]/30 focus:border-[#0F3D3E] focus:ring-[#0F3D3E]"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md border-[#C8AD7F]/30 bg-white/50 hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg text-[#0F3D3E]">Legal Persona</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-1">
                                    <Label className="text-xs text-[#2E2E2E]/60 uppercase font-semibold">Primary Role</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-[#C8AD7F]/30 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D3E] transition-all"
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
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-[#2E2E2E]/60 uppercase font-semibold">Age</Label>
                                        <Input
                                            type="number"
                                            value={profile.age}
                                            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                            className="bg-white/80 border-[#C8AD7F]/30 focus:border-[#0F3D3E] focus:ring-[#0F3D3E]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-[#2E2E2E]/60 uppercase font-semibold">Gender</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-[#C8AD7F]/30 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
                                            value={profile.gender}
                                            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-Binary">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <Button onClick={handleSave} className="w-full bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 mt-2 text-[#F5EEDC]" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Bottom Section: Previous Consultations & Achievements spread horizontally */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-md border border-[#C8AD7F]/30 bg-white/40">
                        <CardHeader className="bg-[#C8AD7F]/10 border-b border-[#C8AD7F]/20">
                            <CardTitle className="flex items-center gap-2 text-lg text-[#0F3D3E]">
                                <MessageSquare className="h-5 w-5 text-[#0F3D3E]" /> Recent Consultations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
                                {sessions.length > 0 ? (
                                    sessions.slice(0, 5).map((session) => (
                                        <div key={session.id} className="group flex items-center justify-between p-3 rounded-xl border border-[#C8AD7F]/20 hover:border-[#0F3D3E]/30 hover:bg-[#F5EEDC]/50 transition-all cursor-pointer">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-[#2E2E2E] group-hover:text-[#0F3D3E] transition-colors text-sm truncate max-w-[200px]">
                                                    {session.title || "Untitled Consultation"}
                                                </span>
                                                <span className="text-[10px] text-[#2E2E2E]/60 flex items-center gap-1 mt-1">
                                                    <Clock className="h-3 w-3" /> {new Date(session.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-[#0F3D3E]">
                                                <a href={`/chat`}>Resume</a>
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-[#2E2E2E]/50 text-sm">No recent chats.</div>
                                )}
                            </div>
                            {sessions.length > 0 && (
                                <div className="p-3 border-t border-[#C8AD7F]/20 bg-[#C8AD7F]/5 text-center">
                                    <a href="/chat" className="text-xs font-bold text-[#0F3D3E] hover:underline">View All History</a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-md border border-[#C8AD7F]/30 bg-white/40">
                        <CardHeader className="bg-[#C8AD7F]/10 border-b border-[#C8AD7F]/20">
                            <CardTitle className="flex items-center gap-2 text-lg text-[#0F3D3E]">
                                <span className="text-xl">🏆</span> Learning Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {completedRights.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-gradient-to-r from-[#0F3D3E]/10 to-[#0F3D3E]/5 p-4 rounded-xl border border-[#0F3D3E]/20">
                                        <div>
                                            <div className="text-xs font-semibold text-[#0F3D3E] uppercase tracking-wider">Rights Mastered</div>
                                            <div className="text-3xl font-bold text-[#0F3D3E]">{completedRights.length}</div>
                                        </div>
                                        <div className="text-4xl">📜</div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
                                        {completedRights.map((right, idx) => (
                                            <div key={idx} className="flex flex-col p-2 bg-white/80 border border-[#C8AD7F]/30 rounded-lg shadow-sm">
                                                <div className="font-semibold text-[#2E2E2E] text-xs truncate" title={right.right_title}>{right.right_title}</div>
                                                <div className="text-[9px] text-[#2E2E2E]/60 uppercase mt-1">{right.category}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="text-4xl mb-3 opacity-20 text-[#0F3D3E]">🎓</div>
                                    <p className="text-sm text-[#2E2E2E]/60 mb-4">You haven't marked any rights as learned yet.</p>
                                    <Button asChild variant="outline" size="sm" className="border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E]/10">
                                        <a href="/rights">Start Learning</a>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

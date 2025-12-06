import Header from "@/components/Header"
import Footer from "@/components/Footer"
import UserProfile from "@/components/UserProfile"

export const metadata = {
    title: "Profile - Lexi.AI",
}

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <UserProfile />
            </main>
            <Footer />
        </div>
    )
}

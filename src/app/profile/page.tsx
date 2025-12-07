import Header from "@/components/Header"
import Footer from "@/components/Footer"
import UserProfile from "@/components/UserProfile"

export const metadata = {
    title: "Profile - Lexi.AI",
}

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[#F5EEDC]">
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24">
                <UserProfile />
            </main>
            <Footer />
        </div>
    )
}

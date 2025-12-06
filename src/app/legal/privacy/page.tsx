import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
    title: "Privacy Policy - Lexi.AI",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="lead">Last updated: December 6, 2024</p>

                    <h3>1. Introduction</h3>
                    <p>
                        At Lexi.AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure,
                        and safeguard your information when you visit our website.
                    </p>

                    <h3>2. Information We Collect</h3>
                    <ul>
                        <li><strong>Personal Data:</strong> Name, email address, and other information you voluntarily provide when registering or contacting us.</li>
                        <li><strong>Usage Data:</strong> Information automatically collected when you access the Service, such as IP address, browser type, and pages visited.</li>
                        <li><strong>Chat Data:</strong> The content of your conversations with the AI assistant. Please do not share sensitive personal information or confidential legal details in the chat.</li>
                    </ul>

                    <h3>3. How We Use Your Information</h3>
                    <p>
                        We use the information we collect to operate, maintain, and improve our Service, to communicate with you,
                        and to personalize your experience.
                    </p>

                    <h3>4. Data Security</h3>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information.
                        However, no transmission over the internet is completely secure.
                    </p>

                    <h3>5. Third-Party Lawyers</h3>
                    <p>
                        When you use our "Find a Lawyer" feature, we may share your contact details with the lawyer you select,
                        only with your explicit consent.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    )
}

import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
    title: "Terms of Service - Lexi.AI",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="lead">Last updated: December 6, 2025</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing and using Lexi.AI ("the Service"), you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use the Service.
                    </p>

                    <h3>2. Educational Purpose Only (Important)</h3>
                    <p>
                        Lexi.AI is an AI-powered educational tool. <strong>We are NOT a law firm and do not provide legal advice.</strong>
                        The information provided by the AI assistant, templates, or articles is for general informational purposes only.
                        It should not be considered as professional legal counsel. Always consult with a qualified attorney for advice
                        on your specific legal problems.
                    </p>

                    <h3>3. Use of Services</h3>
                    <p>
                        You agree to use the Service only for lawful purposes. You represent that you are of legal age to form a binding contract
                        or have the consent of a parent/guardian.
                    </p>

                    <h3>4. User Accounts</h3>
                    <p>
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions
                        under your password.
                    </p>

                    <h3>5. Limitation of Liability</h3>
                    <p>
                        Lexi.AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from
                        your use of or inability to use the Service.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    )
}

import AIChatSection from "@/components/AIChatSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ChatPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F5EEDC]">
            <Header />
            <main className="flex-1 pt-16">
                <AIChatSection />
            </main>
            <Footer />
        </div>
    );
}

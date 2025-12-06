import AIChatSection from "@/components/AIChatSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ChatPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F5EEDC]">
            <Header />
            <main className="flex-1 flex flex-col pt-16">
                <AIChatSection />
            </main>
            <Footer />
        </div>
    );
}

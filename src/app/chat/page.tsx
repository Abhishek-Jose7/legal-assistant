import AIChatSection from "@/components/AIChatSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ChatPage() {
    return (
        <div className="flex flex-col h-screen bg-[#F5EEDC] overflow-hidden">
            <Header />
            <main className="flex-1 flex flex-col pt-20 overflow-hidden">
                <AIChatSection />
            </main>
        </div>
    );
}

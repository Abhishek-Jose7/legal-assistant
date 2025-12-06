import AIChatSection from "@/components/AIChatSection";
import Header from "@/components/Header";

export default function ChatPage() {
    return (
        <div className="h-screen flex flex-col bg-[#F5EEDC] overflow-hidden">
            <Header />
            <main className="flex-1 flex flex-col pt-16 overflow-hidden">
                <AIChatSection />
            </main>
        </div>
    );
}

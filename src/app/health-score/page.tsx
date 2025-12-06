import LegalHealthQuiz from "@/components/LegalHealthQuiz";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HealthScorePage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F5EEDC]">
            <Header />
            <main className="flex-1 flex items-center justify-center py-10">
                <LegalHealthQuiz />
            </main>
            <Footer />
        </div>
    );
}

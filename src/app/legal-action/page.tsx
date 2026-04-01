import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalActionEngine from "@/components/LegalActionEngine";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take Legal Action - NyaayaAi",
  description:
    "Transform your legal confusion into a clear action plan. Classify your legal problem, get step-by-step guidance, generate legal documents, and track your progress.",
};

export default function LegalActionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <LegalActionEngine />
      </main>
      <Footer />
    </div>
  );
}

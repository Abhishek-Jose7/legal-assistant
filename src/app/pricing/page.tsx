import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPage from "@/components/PricingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - NyaayaAi | Free & Premium Plans",
  description:
    "Choose the plan that fits your legal needs. Start free with 100 queries/month or unlock unlimited access with our Premium plan. AI-powered legal assistance for India.",
};

export default function PricingRoute() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PricingPage />
      </main>
      <Footer />
    </div>
  );
}

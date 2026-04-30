import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Amit S.",
    text: "NyaayaAi made my legal journey so much easier. The step-by-step guidance was clear and actionable!",
    rating: 5,
    date: "April 2026",
  },
  {
    name: "Priya R.",
    text: "I found the right legal template in minutes. Highly recommended for anyone confused about legal paperwork.",
    rating: 5,
    date: "March 2026",
  },
  {
    name: "Rahul D.",
    text: "The news and updates keep me informed about my rights. Great resource for the public!",
    rating: 4,
    date: "March 2026",
  },
  {
    name: "Fatima K.",
    text: "I was nervous about sending a legal notice, but the AI-generated document was so professional. My landlord responded within days!",
    rating: 5,
    date: "February 2026",
  },
  {
    name: "Ramesh T.",
    text: "Didn’t expect to get such quick answers about my employment rights. The chatbot felt like talking to a real person.",
    rating: 4,
    date: "January 2026",
  },
  {
    name: "Sneha M.",
    text: "I showed my parents the legal health quiz and they loved how simple it was. We even found a lawyer through the site.",
    rating: 5,
    date: "December 2025",
  },
  {
    name: "Vikram P.",
    text: "Some answers were a bit technical, but overall, I got the help I needed. Would use again if I have another issue.",
    rating: 4,
    date: "November 2025",
  },
  {
    name: "Meera L.",
    text: "I liked the reminders and progress tracking. It kept me on track with my legal case, which I usually forget!",
    rating: 5,
    date: "October 2025",
  },
];

export default function ReviewSection() {
  return (
    <section className="w-screen relative left-[calc(-50vw+50%)] bg-[#F5EEDC] py-12 md:py-16">
      <div className="w-full px-4 md:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-[#2E2E2E]">What Users Say</h3>
          <p className="text-[#2E2E2E]/70 mt-2 text-lg">Real stories from people who used NyaayaAi</p>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-2 px-2 scrollbar-thin scrollbar-thumb-[#C8AD7F]/40 scrollbar-track-[#F5EEDC]">
          {reviews.map((review, idx) => (
            <Card
              key={idx}
              className="min-w-[320px] max-w-xs border-2 border-[#C8AD7F]/30 bg-white/80 shadow-sm hover:shadow-lg transition-all flex-shrink-0"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-[#2E2E2E] text-base mb-4 flex-grow">“{review.text}”</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                  <span className="text-sm font-semibold text-[#0F3D3E]">{review.name}</span>
                  <span className="text-xs text-slate-400">{review.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

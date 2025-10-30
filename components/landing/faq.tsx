"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How is this different from a spreadsheet?",
      answer:
        "Spreadsheets are great for tracking, but they don't tell you what's actually possible. ShelfControl automatically calculates your reading capacity and sorts your books by priority, showing you at a glance what you can realistically finish.",
    },
    {
      question: "What if I fall behind?",
      answer:
        "That's exactly what ShelfControl is for! When you update your progress, it automatically recalculates what's still possible and helps you make decisions about what to prioritize or what to communicate to publishers.",
    },
    {
      question: "Will this fix my NetGalley ratio?",
      answer:
        "ShelfControl helps you make better decisions about which ARCs to accept, which naturally improves your ratio over time. By knowing what you can actually finish, you'll stop accepting books that will hurt your ratio.",
    },
    {
      question: "Can I use this for library books too?",
      answer:
        "Absolutely! While ShelfControl was designed with ARCs in mind, it works for any books with deadlines - library books, book club reads, or any other time-sensitive reading.",
    },
    {
      question: "When do I get access?",
      answer:
        "We're launching soon! Everyone on the waitlist will receive an email with their exclusive access link. The first 50 users will get founder pricing locked in forever.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          quick answers
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-slate-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-600 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-slate-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

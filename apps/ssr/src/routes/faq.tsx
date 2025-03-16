import { Input } from "~/lib/components/ui/input";

import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export const Route = createFileRoute("/faq")({
  component: FAQSection,
});

function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems: FAQItem[] = [
    {
      question: "How does the free plan work?",
      answer:
        "The free plan offers essential features with 4 requests per day (refreshed every 24 hours) without needing a credit card.",
    },
    {
      question: "What are the request limits for free and Pro plans?",
      answer:
        "Free plan users get 4 requests per day, while Pro subscribers can enjoy up to 1000 requests per day (approximately 30,000 per month).",
    },
    {
      question: "What are the benefits of the Pro plan?",
      answer:
        "The Pro plan offers increased request limits (up to 1000 per day), access to all advanced AI tools, enhanced data analysis capabilities, and priority customer support.",
    },
    {
      question: "How do I upgrade to the Pro plan?",
      answer:
        "You can upgrade to the Pro plan by visiting your account settings and selecting the 'Upgrade' option. We accept all major credit cards and PayPal.",
    },
    {
      question: "Can I cancel my Pro subscription anytime?",
      answer:
        "Yes, you can cancel your Pro subscription at any time. Your benefits will continue until the end of your current billing period.",
    },
  ];

  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-black text-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
          Got questions? We've got answers. If you can't find what you're looking for,
          feel free to contact our support team.
        </p>

        <div className="relative max-w-md mx-auto mb-16">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <Input
            type="text"
            placeholder="Search questions..."
            className="pl-10 py-6 bg-gray-900 border-gray-800 rounded-full text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.question}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800"
            >
              <h3 className="text-xl font-semibold mb-4">{faq.question}</h3>
              <p className="text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">
              No matching questions found. Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

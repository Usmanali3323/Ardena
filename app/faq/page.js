"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What makes Ardena unique?",
    answer:
      "Ardena focuses on timeless designs, sustainable fabrics, and premium craftsmanship — making every piece elegant, durable, and stylish.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, Ardena ships worldwide. Delivery times may vary depending on your location, but we ensure safe and timely delivery.",
  },
  {
    question: "How can I return or exchange an item?",
    answer:
      "We offer a hassle-free 14-day return and exchange policy. Simply visit our Returns page or contact our support team.",
  },
  {
    question: "Are Ardena’s products eco-friendly?",
    answer:
      "Absolutely. We are committed to sustainability — from ethically sourcing fabrics to using eco-conscious packaging.",
  },
  {
    question: "How do I track my order?",
    answer:
      "After placing an order, you’ll receive an email with tracking details. You can also check your order status directly from your account.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-5 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find quick answers to the most common questions about Ardena’s products, shipping, and policies.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${
                    openIndex === index ? "rotate-180 text-pink-500" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-40 p-5 pt-0" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

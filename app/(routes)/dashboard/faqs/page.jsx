"use client";
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AIChat from './_components/AIChat';  // Import the AI Chatbot

function Faq() {
  const faqs = [
    {
      question: "What is Budgetly?",
      answer: "Budgetly is a comprehensive financial management tool that helps you track your expenses, manage budgets, and monitor your income streams. It's designed to give you clear insights into your spending habits and help you achieve your financial goals."
    },
    {
      question: "How do I create a new budget?",
      answer: "Creating a new budget is simple! Click on the 'My Budgets' section, then click the '+' card to create a new budget. You can set a name, amount, and even choose an emoji icon to represent your budget category. Once created, you can start tracking expenses within that budget."
    },
    {
      question: "Can I track multiple income sources?",
      answer: "Yes! Budgetly allows you to manage multiple income streams. Navigate to the 'Income' section and click the '+' button to add a new income source. You can specify the name, amount, and add an emoji icon for easy identification."
    },
    {
      question: "How do I delete a budget or income source?",
      answer: "To delete a budget or income source, simply click the trash icon in the top-right corner of the respective card. You'll be asked to confirm the deletion to prevent accidental removals. Note that deleting a budget will also remove all associated expenses."
    },
    {
      question: "Can I set spending limits and receive notifications?",
      answer: "Currently, you can set budget amounts to track your spending against specific targets. While automatic notifications aren't available yet, you can easily monitor your progress through the visual progress bars on each budget card."
    },
    {
      question: "How do I track expenses for a specific budget?",
      answer: "Click on any budget card to view its detailed page. There, you can add new expenses, view spending history, and track your progress against the budget limit. Each expense can include details like amount, date, and description."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Our web application is fully responsive and works great on mobile devices."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 md:p-10">
      {/* AI Chatbot - Added to the top of the page */}
      <AIChat />
      
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 mb-8">
            Find answers to common questions about Budgetly
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg border border-gray-100 px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-medium text-lg text-gray-800">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions? Contact our support team at{" "}
            <a 
              href="mailto:support@budgetly.com" 
              className="text-primary hover:underline"
            >
              support@budgetly.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Faq;
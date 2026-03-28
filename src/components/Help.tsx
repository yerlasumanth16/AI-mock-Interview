import React from "react";
import { HelpCircle, Book, MessageCircle, FileText, Video, ExternalLink, Search } from "lucide-react";
import { motion } from "motion/react";

interface HelpProps {
  onBack: () => void;
}

export const Help: React.FC<HelpProps> = ({ onBack }) => {
  const faqs = [
    {
      question: "How does the AI evaluation work?",
      answer: "Our AI uses advanced natural language processing to analyze your responses against industry standards for the specific role and company you selected. It evaluates technical accuracy, communication clarity, problem-solving approach, and confidence."
    },
    {
      question: "Can I review my past interviews?",
      answer: "Yes, all your past interviews are saved in the History tab. You can review the full transcript, your scores, and detailed feedback to track your progress over time."
    },
    {
      question: "How should I prepare for a technical interview?",
      answer: "We recommend starting with the 'Medium' difficulty setting and focusing on clear communication. Use the built-in code editor to practice explaining your thought process while writing code."
    },
    {
      question: "Is my data private?",
      answer: "Yes, your interview recordings and transcripts are private and securely stored. We do not share your personal data with third parties."
    }
  ];

  const resources = [
    {
      title: "Interview Guide",
      description: "Comprehensive guide to acing technical and behavioral interviews.",
      icon: Book,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Video Tutorials",
      description: "Watch expert breakdowns of common interview questions.",
      icon: Video,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "System Design Primer",
      description: "Learn the fundamentals of designing scalable systems.",
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-100"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">How can we help?</h2>
        <p className="text-lg text-gray-600 mb-8">Search our knowledge base or browse categories below to find the answers you need.</p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search for articles, tutorials, or FAQs..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-2xl ${resource.bg} ${resource.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <resource.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <div className="flex items-center text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
              Learn more <ExternalLink className="w-4 h-4 ml-1" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <HelpCircle className="w-6 h-6 mr-3 text-indigo-600" />
            Frequently Asked Questions
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <div key={index} className="p-8 hover:bg-gray-50 transition-colors">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h4>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 rounded-3xl p-8 text-center mt-12">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">Our support team is available 24/7 to help you with any technical issues or questions.</p>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          Contact Support
        </button>
      </div>
    </div>
  );
};

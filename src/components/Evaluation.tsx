import React from "react";
import { Award, CheckCircle2, XCircle, BarChart3, ArrowRight, Home, History, Star, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface EvaluationProps {
  results: any;
  onBackToDashboard: () => void;
}

export const Evaluation: React.FC<EvaluationProps> = ({ results, onBackToDashboard }) => {
  const data = results?.score ? {
    ...results,
    improvementPlan: results.improvementPlan || [
      "Review Big O notation for recursion",
      "Practice 5 Medium LeetCode problems",
      "Watch System Design for Scalability",
      "Take a mock HR interview"
    ],
    faangReadiness: results.faangReadiness || "You are currently in the top 15% of candidates for SDE-2 roles at Google."
  } : {
    score: 82,
    feedback: "Excellent performance overall. Your technical depth in system design is impressive, and you communicated your ideas clearly. However, there's room for improvement in optimizing the time complexity of your coding solution.",
    strengths: ["Clear communication", "Strong architectural thinking", "Good understanding of concurrency"],
    weaknesses: ["Algorithmic optimization", "Edge case handling in coding", "Nervousness in follow-up questions"],
    ratings: {
      technical: 85,
      communication: 92,
      confidence: 78,
      problemSolving: 75
    },
    improvementPlan: [
      "Review Big O notation for recursion",
      "Practice 5 Medium LeetCode problems",
      "Watch System Design for Scalability",
      "Take a mock HR interview"
    ],
    faangReadiness: "You are currently in the top 15% of candidates for SDE-2 roles at Google."
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-100">
              <Award className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Interview Evaluation</h2>
              <p className="text-gray-500 font-medium">Detailed performance report and improvement plan.</p>
            </div>
          </div>
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Home size={20} />
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Overall Performance</h3>
                <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-black text-2xl">
                  {data.score}%
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                "{data.feedback}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <h4 className="font-bold text-emerald-600 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <CheckCircle2 size={16} />
                    Key Strengths
                  </h4>
                  <ul className="space-y-3">
                    {data.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={12} />
                        </div>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-rose-600 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <AlertCircle size={16} />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-3">
                    {data.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <XCircle size={12} />
                        </div>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="text-indigo-600" size={24} />
                Detailed Ratings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(data.ratings).map(([key, val]: [string, any], i) => (
                  <div key={i} className="text-center space-y-3">
                    <div className="relative w-24 h-24 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-100"
                        />
                        <motion.circle
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 251.2 - (251.2 * val) / 100 }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="251.2"
                          className="text-indigo-600"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-gray-900">
                        {val}%
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{key}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-indigo-900 p-8 rounded-3xl text-white space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp size={24} />
                Improvement Plan
              </h3>
              <div className="space-y-4">
                {data.improvementPlan.map((step: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-indigo-800/50 rounded-xl border border-indigo-700/50">
                    <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium">{step}</p>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-950/20">
                Start Learning Plan
              </button>
            </section>

            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Star className="text-amber-400 fill-current" size={20} />
                FAANG Readiness
              </h3>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-sm text-amber-800 font-medium leading-relaxed">
                  {data.faangReadiness}
                </p>
              </div>
              <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2">
                View Detailed Comparison
                <ArrowRight size={16} />
              </button>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

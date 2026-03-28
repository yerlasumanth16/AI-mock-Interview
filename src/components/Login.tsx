import React from "react";
import { Mic, Code, Shield, Award, ArrowRight } from "lucide-react";
import { signInWithGoogle } from "../firebase";
import { motion } from "motion/react";

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,_#f0f0ff_0%,_#ffffff_100%)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full text-center space-y-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-3xl">V</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            AI Voice Interviewer <span className="text-indigo-600">Pro</span>
          </h1>
        </div>

        <h2 className="text-6xl font-extrabold text-gray-900 leading-tight">
          Master your next <span className="text-indigo-600">FAANG</span> interview with AI.
        </h2>
        
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          The world's first fully voice-based AI interview platform. Real-time coding, 
          natural conversation, and deep performance analytics.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => signInWithGoogle()}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 bg-white rounded-full p-1" />
            Sign in with Google
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-16">
          {[
            { icon: Mic, title: "Voice-Only", desc: "Natural conversation with AI" },
            { icon: Code, title: "Real IDE", desc: "Full coding environment" },
            { icon: Shield, title: "FAANG Level", desc: "Real MNC interview patterns" },
            { icon: Award, title: "Deep Analytics", desc: "Detailed feedback & scores" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

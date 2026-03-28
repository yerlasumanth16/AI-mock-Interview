import React, { useState } from "react";
import { INTERVIEWERS, InterviewerPersona } from "../constants";
import { motion } from "motion/react";
import { Play, ArrowLeft, CheckCircle2 } from "lucide-react";

interface InterviewerSelectionProps {
  company: string;
  role: string;
  onSelect: (interviewerId: string) => void;
  onBack: () => void;
}

export const InterviewerSelection: React.FC<InterviewerSelectionProps> = ({ company, role, onSelect, onBack }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayPreview = (e: React.MouseEvent, interviewer: InterviewerPersona) => {
    e.stopPropagation();
    
    if (playingId === interviewer.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`Hi, I'm ${interviewer.name}. I'll be conducting your interview for the ${role} position today. Let's get started.`);
    
    // Try to find a matching voice if possible (basic heuristic)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha") || v.name.includes("Daniel"));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    
    setPlayingId(interviewer.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleStart = () => {
    if (selectedId) {
      window.speechSynthesis.cancel();
      onSelect(selectedId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              window.speechSynthesis.cancel();
              onBack();
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Select Your Interviewer</h1>
            <p className="text-sm text-gray-500">{role} at {company}</p>
          </div>
        </div>
        <button
          onClick={handleStart}
          disabled={!selectedId}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
            selectedId 
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Start Interview
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who do you want to interview with?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from top industry leaders. Each interviewer has a unique personality, questioning style, and evaluation criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {INTERVIEWERS.map((interviewer, index) => (
              <motion.div
                key={interviewer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedId(interviewer.id)}
                className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all cursor-pointer group ${
                  selectedId === interviewer.id 
                    ? "border-indigo-600 shadow-lg ring-4 ring-indigo-600/10" 
                    : "border-transparent shadow-sm hover:shadow-md hover:border-gray-200"
                }`}
              >
                <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
                  <img 
                    src={interviewer.image} 
                    alt={interviewer.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  
                  <button
                    onClick={(e) => handlePlayPreview(e, interviewer)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                  >
                    {playingId === interviewer.id ? (
                      <div className="w-4 h-4 bg-white rounded-sm animate-pulse" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-1" />
                    )}
                  </button>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{interviewer.name}</h3>
                  <p className="text-sm text-indigo-600 font-medium mb-3">{interviewer.company}</p>
                  
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600">
                    {interviewer.style}
                  </div>
                </div>

                {selectedId === interviewer.id && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg transform scale-100 animate-in zoom-in duration-200">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

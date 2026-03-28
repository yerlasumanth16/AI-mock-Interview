import React, { useState, useEffect } from "react";
import { History as HistoryIcon, Search, Filter, ArrowRight, Briefcase, Calendar, Star, Loader2 } from "lucide-react";
import { getInterviews } from "../firebase";
import { auth } from "../firebase";
import { INTERVIEWERS } from "../constants";

import { cn } from "../lib/utils";

interface HistoryProps {
  onBack: () => void;
  onViewDetails: (interview: any) => void;
}

export const History: React.FC<HistoryProps> = ({ onBack, onViewDetails }) => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      getInterviews(auth.currentUser.uid).then((data) => {
        setInterviews(data);
        setLoading(false);
      });
    }
  }, []);

  const filteredInterviews = interviews.filter(inv => 
    inv.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Interview History</h2>
          <p className="text-gray-500">Review your past performances and track your progress.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {filteredInterviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
          <HistoryIcon size={64} className="mx-auto text-gray-300" />
          <p className="text-gray-500 text-lg">No interviews found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((interview) => {
            const interviewer = INTERVIEWERS.find(i => i.id === interview.interviewerId);
            return (
            <div 
              key={interview.id} 
              onClick={() => onViewDetails(interview)}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                {interviewer ? (
                  <img src={interviewer.image} alt={interviewer.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Briefcase size={24} />
                  </div>
                )}
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold",
                  interview.score >= 80 ? "bg-emerald-50 text-emerald-700" :
                  interview.score >= 60 ? "bg-amber-50 text-amber-700" :
                  "bg-rose-50 text-rose-700"
                )}>
                  {interview.score}% Score
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {interview.company}
                </h3>
                <p className="text-gray-500 font-medium">{interview.role}</p>
                {interviewer && (
                  <p className="text-sm text-indigo-600 font-medium pt-1">Interviewed by {interviewer.name}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-400 pt-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} />
                    <span>{interview.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-indigo-600 font-medium text-sm">
                View Evaluation
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

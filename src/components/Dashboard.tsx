import React, { useState, useEffect } from "react";
import { Mic, History, BarChart3, Users, ArrowRight, Play, Star, Clock, Briefcase } from "lucide-react";
import { getInterviews } from "../firebase";
import { COMPANIES, ROLES } from "../constants";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface DashboardProps {
  user: any;
  onStartInterview: (company: string, role: string) => void;
  onNavigate: (view: string) => void;
  onViewDetails: (interview: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartInterview, onNavigate, onViewDetails }) => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0]);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);

  useEffect(() => {
    if (user) {
      getInterviews(user.id).then(setInterviews);
    }
  }, [user]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(" ")[0]}! 👋</h2>
          <p className="text-gray-500">Ready to master your next interview? Your performance is improving.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="px-4 py-2 bg-indigo-50 rounded-xl text-center">
            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Overall Score</p>
            <p className="text-2xl font-black text-indigo-700">84%</p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 rounded-xl text-center">
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Interviews</p>
            <p className="text-2xl font-black text-emerald-700">{interviews.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Mic className="text-indigo-600" size={24} />
                Start New Interview
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Select Company</label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Select Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={() => onStartInterview(selectedCompany, selectedRole)}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group"
            >
              <Play size={24} className="fill-current" />
              Select Interviewer & Begin
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recent Interviews</h3>
              <button onClick={() => onNavigate("history")} className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {interviews.length > 0 ? (
                interviews.map((interview) => (
                  <div key={interview.id} onClick={() => onViewDetails(interview)} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{interview.company}</h4>
                        <p className="text-sm text-gray-500">{interview.role} • {interview.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{interview.score}%</p>
                        <p className="text-xs text-gray-500">Score</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{interview.difficulty}</p>
                        <p className="text-xs text-gray-500">Difficulty</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <History size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No interviews yet. Start your first session!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Star className="text-amber-400 fill-current" size={20} />
              Skill Breakdown
            </h3>
            <div className="space-y-4">
              {[
                { label: "DSA", value: 85, color: "bg-indigo-600" },
                { label: "System Design", value: 72, color: "bg-emerald-600" },
                { label: "Communication", value: 94, color: "bg-amber-600" },
                { label: "Problem Solving", value: 78, color: "bg-rose-600" },
              ].map((skill, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                    <span>{skill.label}</span>
                    <span>{skill.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.value}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                      className={cn("h-full rounded-full", skill.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-indigo-900 p-8 rounded-3xl text-white space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-bold">Ready for FAANG?</h3>
              <p className="text-indigo-200 text-sm">Our AI has analyzed 10,000+ real interview transcripts from top tech companies.</p>
              <button onClick={() => onNavigate("analytics")} className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                View FAANG Roadmap
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-800 rounded-full blur-3xl opacity-50" />
          </section>
        </div>
      </div>
    </div>
  );
};

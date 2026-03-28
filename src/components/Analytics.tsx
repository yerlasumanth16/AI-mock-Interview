import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Target, Brain, Award, Loader2 } from "lucide-react";
import { getInterviews } from "../firebase";
import { auth } from "../firebase";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { motion } from "motion/react";

interface AnalyticsProps {
  onBack: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onBack }) => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentUser) {
      getInterviews(auth.currentUser.uid).then((data) => {
        setInterviews(data);
        setLoading(false);
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Performance Analytics</h2>
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm">
          <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Complete at least one interview to see your analytics.</p>
        </div>
      </div>
    );
  }

  // Calculate averages
  const avgScore = Math.round(interviews.reduce((acc, curr) => acc + curr.score, 0) / interviews.length);
  
  // Prepare Radar Chart Data
  const radarData = [
    { subject: 'Technical', A: 85, fullMark: 100 },
    { subject: 'Communication', A: 90, fullMark: 100 },
    { subject: 'Problem Solving', A: 75, fullMark: 100 },
    { subject: 'Confidence', A: 80, fullMark: 100 },
    { subject: 'Edge Cases', A: 65, fullMark: 100 },
  ];

  // Prepare Line Chart Data (Progress over time)
  const lineData = interviews.slice().reverse().map((inv, i) => ({
    name: `Int ${i + 1}`,
    score: inv.score,
    company: inv.company
  }));

  // Prepare Bar Chart Data (Company Performance)
  const companyScores: Record<string, { total: number, count: number }> = {};
  interviews.forEach(inv => {
    if (!companyScores[inv.company]) companyScores[inv.company] = { total: 0, count: 0 };
    companyScores[inv.company].total += inv.score;
    companyScores[inv.company].count += 1;
  });
  const barData = Object.keys(companyScores).map(company => ({
    name: company,
    score: Math.round(companyScores[company].total / companyScores[company].count)
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Performance Analytics</h2>
          <p className="text-gray-500">Deep dive into your interview metrics and progress.</p>
        </div>
        <div className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-2xl border border-indigo-100 shadow-sm">
          Avg Score: {avgScore}%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Over Time */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={24} />
            Progress Over Time
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Skill Radar */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="text-emerald-600" size={24} />
            Skill Breakdown
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={3} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Company Performance */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 lg:col-span-2"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="text-amber-500" size={24} />
            Company-wise Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 14, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10b981' : entry.score > 60 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

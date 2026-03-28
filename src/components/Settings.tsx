import React, { useState, useEffect } from "react";
import { Save, Sliders, Mic, BrainCircuit, Loader2 } from "lucide-react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { COMPANIES, ROLES } from "../constants";

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    difficulty: "Medium",
    company: COMPANIES[0],
    role: ROLES[0],
    interviewType: "Technical",
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    aiTone: "Strict",
    feedbackDepth: "Detailed"
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().settings) {
          setSettings(docSnap.data().settings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(docRef, { settings }, { merge: true });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-500">Customize your interview experience and AI behavior.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Interview Preferences */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sliders className="text-indigo-600" size={24} />
            Interview Preferences
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Default Company</label>
              <select
                value={settings.company}
                onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Default Role</label>
              <select
                value={settings.role}
                onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Difficulty Level</label>
              <select
                value={settings.difficulty}
                onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </section>

        {/* AI Behavior */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BrainCircuit className="text-indigo-600" size={24} />
            AI Behavior
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Interviewer Tone</label>
              <select
                value={settings.aiTone}
                onChange={(e) => setSettings({ ...settings, aiTone: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Friendly">Friendly & Encouraging</option>
                <option value="Strict">Strict & Professional</option>
                <option value="HR">HR / Behavioral Focus</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Feedback Depth</label>
              <select
                value={settings.feedbackDepth}
                onChange={(e) => setSettings({ ...settings, feedbackDepth: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Brief">Brief Summary</option>
                <option value="Detailed">Detailed Analysis</option>
                <option value="Exhaustive">Exhaustive (Line-by-line)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Voice Settings */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 md:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Mic className="text-indigo-600" size={24} />
            Voice Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-gray-700">Speech Speed</label>
                <span className="text-sm text-gray-500">{settings.voiceSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) => setSettings({ ...settings, voiceSpeed: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-gray-700">Voice Pitch</label>
                <span className="text-sm text-gray-500">{settings.voicePitch}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.voicePitch}
                onChange={(e) => setSettings({ ...settings, voicePitch: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

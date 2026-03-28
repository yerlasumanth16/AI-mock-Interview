import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Mic, MicOff, Play, Send, Code, MessageSquare, Clock, AlertCircle, CheckCircle2, ArrowLeft, Loader2, Volume2, VolumeX, Users } from "lucide-react";
import { generateInterviewQuestion, evaluateResponse } from "../services/geminiService";
import { saveInterview, auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { LANGUAGES, INTERVIEWERS } from "../constants";
import { cn, formatTime } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface InterviewRoomProps {
  company: string;
  role: string;
  interviewerId: string;
  onEnd: (results: any) => void;
  onBack: () => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({ company, role, interviewerId, onEnd, onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string; type?: "conceptual" | "coding" }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const interviewer = INTERVIEWERS.find(i => i.id === interviewerId) || INTERVIEWERS[0];

  useEffect(() => {
    let isMounted = true;
    // Load settings
    const loadSettings = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().settings) {
          if (isMounted) setSettings(docSnap.data().settings);
        } else {
          if (isMounted) setSettings({
            difficulty: "Medium",
            interviewType: "Technical",
            voiceSpeed: 1.0,
            voicePitch: 1.0,
            aiTone: "Strict",
            feedbackDepth: "Detailed"
          });
        }
      }
    };
    loadSettings();

    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const text = event.results[i][0].transcript;
            setTranscript(prev => prev + " " + text);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (settings && messages.length === 0) {
      startInterview();
    }
  }, [settings]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string) => {
    if (!synthRef.current || isMuted) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to match the interviewer's voice if possible
    const voices = synthRef.current.getVoices();
    let preferredVoice;
    
    // Simple heuristic to pick a voice based on the persona
    if (interviewer.voiceName === "Zephyr") {
      preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Daniel") || v.name.includes("Male"));
    } else if (interviewer.voiceName === "Charon") {
      preferredVoice = voices.find(v => v.name.includes("Google UK English Male") || v.name.includes("Arthur") || v.name.includes("Male"));
    } else if (interviewer.voiceName === "Puck") {
      preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Alex") || v.name.includes("Male"));
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (settings) {
      utterance.rate = settings.voiceSpeed || 1.0;
      utterance.pitch = settings.voicePitch || 1.0;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const startInterview = async () => {
    const greeting = `Hello! I'm ${interviewer.name}. I'll be conducting your interview for the ${role} position at ${company} today. Let's start with a quick introduction. Tell me about yourself.`;
    setMessages([{ role: "ai", text: greeting }]);
    speak(greeting);
  };

  const handleNextQuestion = async (updatedHistory?: string[]) => {
    setIsEvaluating(true);
    try {
      const history = updatedHistory || messages.map(m => `${m.role}: ${m.text}`);
      const difficulty = settings?.difficulty || "Medium";
      const type = settings?.interviewType || "Technical";
      const nextQ = await generateInterviewQuestion(company, role, difficulty, type, history, interviewer.prompt);
      setCurrentQuestion(nextQ);
      setMessages(prev => [...prev, { role: "ai", text: nextQ.question, type: nextQ.type }]);
      speak(nextQ.question);
      if (nextQ.type === "coding") {
        setCode(language.defaultCode);
      }
    } catch (error) {
      console.error("Error generating question:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleUserResponse = async () => {
    if (!transcript.trim()) return;
    const userText = transcript.trim();
    
    const updatedMessages = [...messages, { role: "user" as const, text: userText }];
    setMessages(updatedMessages);
    setTranscript("");
    
    // Stop recording while AI processes
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    // Generate next question or follow-up
    const history = updatedMessages.map(m => `${m.role}: ${m.text}`);
    handleNextQuestion(history);
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setTranscript("");
    }
    setIsRecording(!isRecording);
  };

  const [consoleOutput, setConsoleOutput] = useState<string>("");

  const handleRunCode = async () => {
    setIsEvaluating(true);
    setConsoleOutput("Running code...");
    
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: language.id,
        }),
      });

      const data = await response.json();
      
      if (data.exitCode === 0) {
        setConsoleOutput(data.stdout || "Execution successful (no output)");
        setMessages(prev => [...prev, { role: "ai", text: "I see your implementation. Can you explain the time complexity of this approach?" }]);
        speak("I see your implementation. Can you explain the time complexity of this approach?");
      } else {
        setConsoleOutput(`Error:\n${data.stderr || data.stdout}`);
        setMessages(prev => [...prev, { role: "ai", text: "It looks like there's an error in your code. Can you walk me through your debugging process?" }]);
        speak("It looks like there's an error in your code. Can you walk me through your debugging process?");
      }
    } catch (error) {
      console.error("Execution error:", error);
      setConsoleOutput("Failed to connect to execution server.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleEndInterview = async () => {
    setIsEvaluating(true);
    try {
      const history = messages.map(m => `${m.role}: ${m.text}`);
      const feedbackDepth = settings?.feedbackDepth || "Detailed";
      const results = await evaluateResponse(history, role, company, interviewer.prompt, feedbackDepth);

      if (auth.currentUser) {
        await saveInterview({
          userId: auth.currentUser.uid,
          company,
          role,
          interviewerId,
          type: settings?.interviewType || "Technical",
          difficulty: settings?.difficulty || "Medium",
          score: results.score,
          feedback: results.feedback,
          strengths: results.strengths,
          weaknesses: results.weaknesses,
          ratings: results.ratings,
          improvementPlan: results.improvementPlan,
          faangReadiness: results.faangReadiness,
        });
      }

      onEnd(results);
    } catch (error) {
      console.error("Error saving interview:", error);
      // Fallback if evaluation fails
      onEnd({
        score: 0,
        feedback: "Evaluation failed due to an error.",
        strengths: [],
        weaknesses: [],
        ratings: { technical: 0, communication: 0, confidence: 0, problemSolving: 0 },
        improvementPlan: ["Please try again later"],
        faangReadiness: "Unable to evaluate at this time."
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <img src={interviewer.image} alt={interviewer.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-none">{interviewer.name}</span>
              <span className="text-xs text-gray-500">{company}</span>
            </div>
          </div>
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Live</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 ml-2">
            <Clock size={16} />
            <span className={cn("text-sm font-mono font-bold", timeLeft < 300 ? "text-red-500" : "text-gray-700")}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={cn("p-2 rounded-xl transition-all", isMuted ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100")}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            onClick={handleEndInterview}
            disabled={isEvaluating}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
          >
            {isEvaluating ? <Loader2 className="animate-spin" size={20} /> : "End Interview"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: AI Interaction */}
        <div className={cn("flex flex-col border-r border-gray-200 bg-white transition-all duration-500 relative", currentQuestion?.type === "coding" ? "w-1/3" : "w-full max-w-4xl mx-auto border-x")}>
          
          {/* Visual AI Interviewer */}
          <div className={cn("flex flex-col items-center justify-center p-8 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white transition-all duration-500", currentQuestion?.type === "coding" ? "py-6" : "py-12")}>
            <div className="relative">
              <div className={cn("rounded-full overflow-hidden border-4 shadow-xl transition-all duration-500 relative z-10", isSpeaking ? "border-indigo-500 shadow-indigo-200" : "border-white", currentQuestion?.type === "coding" ? "w-24 h-24" : "w-40 h-40")}>
                <img src={interviewer.image} alt={interviewer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              {/* Speaking Animation Rings */}
              {isSpeaking && (
                <>
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-indigo-500 z-0"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.3 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    className="absolute inset-0 rounded-full bg-indigo-500 z-0"
                  />
                </>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <h3 className={cn("font-bold text-gray-900", currentQuestion?.type === "coding" ? "text-lg" : "text-2xl")}>{interviewer.name}</h3>
              <p className={cn("text-indigo-600 font-medium", currentQuestion?.type === "coding" ? "text-xs" : "text-sm")}>{interviewer.company}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "")}
                >
                  <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden", msg.role === "ai" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600")}>
                    {msg.role === "ai" ? (
                      <img src={interviewer.image} alt="AI" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Users size={20} />
                    )}
                  </div>
                  <div className={cn("max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm", msg.role === "ai" ? "bg-indigo-50 text-indigo-900 border border-indigo-100" : "bg-white text-gray-900 border border-gray-100")}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isSpeaking && (
              <div className="flex gap-2 items-center text-indigo-600 text-xs font-bold uppercase tracking-widest px-14">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      className="w-1 bg-indigo-600 rounded-full"
                    />
                  ))}
                </div>
                AI is speaking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
            {transcript && (
              <div className="p-4 bg-white rounded-2xl border border-indigo-100 text-sm text-gray-600 italic shadow-sm">
                "{transcript}"
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleRecording}
                disabled={isSpeaking || isEvaluating}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl",
                  isRecording ? "bg-red-600 text-white animate-pulse shadow-red-200" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200",
                  (isSpeaking || isEvaluating) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
              </button>
              
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-12 bg-white border border-gray-200 rounded-2xl px-4 flex items-center text-gray-400 text-sm italic">
                  {isRecording ? "Listening to your response..." : "Click the mic to start speaking"}
                </div>
                <button
                  onClick={handleUserResponse}
                  disabled={!transcript || isEvaluating}
                  className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  {isEvaluating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Editor */}
        {currentQuestion?.type === "coding" && (
          <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            <div className="h-12 bg-[#252526] border-b border-[#333] flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Code size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Solution Editor</span>
                </div>
                <select
                  value={language.id}
                  onChange={(e) => setLanguage(LANGUAGES.find(l => l.id === e.target.value) || LANGUAGES[0])}
                  className="bg-[#2d2d2d] text-gray-300 text-xs border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <button
                onClick={handleRunCode}
                disabled={isEvaluating}
                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isEvaluating ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} className="fill-current" />}
                Run Code
              </button>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={language.id}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20 },
                }}
              />
            </div>
            <div className="h-32 bg-[#1e1e1e] border-t border-[#333] p-4 font-mono text-xs text-gray-400 overflow-y-auto">
              <p className="text-indigo-400 mb-2 font-bold uppercase tracking-widest">Console Output</p>
              <pre className="text-gray-300 whitespace-pre-wrap font-mono">{consoleOutput || "Run your code to see output here..."}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

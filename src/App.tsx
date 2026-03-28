import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { User } from "./types";
import { Login } from "./components/Login";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { InterviewRoom } from "./components/InterviewRoom";
import { Evaluation } from "./components/Evaluation";
import { Settings } from "./components/Settings";
import { Analytics } from "./components/Analytics";
import { History } from "./components/History";
import { Community } from "./components/Community";
import { Help } from "./components/Help";
import { InterviewerSelection } from "./components/InterviewerSelection";
import { Loader2 } from "lucide-react";

type View = "dashboard" | "interview" | "evaluation" | "settings" | "analytics" | "history" | "community" | "help" | "interviewerSelection";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("dashboard");
  const [activeInterview, setActiveInterview] = useState<{ company: string; role: string; interviewerId?: string } | null>(null);
  const [lastResults, setLastResults] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "User",
          photoURL: firebaseUser.photoURL || "",
          createdAt: new Date().toISOString(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStartInterview = (company: string, role: string) => {
    setActiveInterview({ company, role });
    setView("interviewerSelection");
  };

  const handleSelectInterviewer = (interviewerId: string) => {
    setActiveInterview(prev => prev ? { ...prev, interviewerId } : null);
    setView("interview");
  };

  const handleEndInterview = (results: any) => {
    setLastResults(results);
    setView("evaluation");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Initializing AI Interviewer...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (view === "interviewerSelection" && activeInterview) {
    return (
      <InterviewerSelection
        company={activeInterview.company}
        role={activeInterview.role}
        onSelect={handleSelectInterviewer}
        onBack={() => setView("dashboard")}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {view !== "interview" && view !== "evaluation" && view !== "interviewerSelection" && (
        <Sidebar activeItem={view} onNavigate={(v) => setView(v as View)} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {view !== "interview" && view !== "evaluation" && view !== "interviewerSelection" && <Header user={user} />}
        
        <main className="flex-1 overflow-y-auto">
          {view === "dashboard" && (
            <Dashboard 
              user={user} 
              onStartInterview={handleStartInterview} 
              onNavigate={(v) => setView(v as View)} 
              onViewDetails={(interview) => {
                setLastResults(interview);
                setView("evaluation");
              }}
            />
          )}
          
          {view === "interview" && activeInterview && activeInterview.interviewerId && (
            <InterviewRoom
              company={activeInterview.company}
              role={activeInterview.role}
              interviewerId={activeInterview.interviewerId}
              onEnd={handleEndInterview}
              onBack={() => setView("dashboard")}
            />
          )}
          
          {view === "evaluation" && (
            <Evaluation
              results={lastResults}
              onBackToDashboard={() => setView("dashboard")}
            />
          )}

          {view === "settings" && (
            <Settings onBack={() => setView("dashboard")} />
          )}

          {view === "analytics" && (
            <Analytics onBack={() => setView("dashboard")} />
          )}

          {view === "history" && (
            <History 
              onBack={() => setView("dashboard")} 
              onViewDetails={(interview) => {
                setLastResults(interview);
                setView("evaluation");
              }} 
            />
          )}

          {view === "community" && (
            <Community onBack={() => setView("dashboard")} />
          )}

          {view === "help" && (
            <Help onBack={() => setView("dashboard")} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

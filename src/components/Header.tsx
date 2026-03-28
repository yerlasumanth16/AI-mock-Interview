import React from "react";
import { User, LogOut, Bell, Settings } from "lucide-react";
import { auth, logout } from "../firebase";
import { cn } from "../lib/utils";

interface HeaderProps {
  user: any;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">V</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          AI Voice Interviewer <span className="text-indigo-600">Pro</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Settings size={20} />
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <img
            src={user?.photoURL || "https://picsum.photos/seed/user/40/40"}
            alt="User"
            className="w-10 h-10 rounded-full border border-gray-200"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={() => logout()}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

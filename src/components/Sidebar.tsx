import React from "react";
import { LayoutDashboard, Mic, Code, History, BarChart3, Users, Settings, HelpCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  activeItem: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onNavigate }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "interview", label: "New Interview", icon: Mic },
    { id: "history", label: "Interview History", icon: History },
    { id: "analytics", label: "Performance", icon: BarChart3 },
    { id: "community", label: "Community", icon: Users },
  ];

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help Center", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-[calc(100vh-64px)] flex flex-col sticky top-16 z-40">
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              activeItem === item.id
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon
              size={20}
              className={cn(
                "transition-colors",
                activeItem === item.id ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
              )}
            />
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              activeItem === item.id
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon size={20} className={activeItem === item.id ? "text-indigo-600" : "text-gray-400"} />
            {item.label}
          </button>
        ))}
        
        <div className="mt-4 p-4 bg-indigo-600 rounded-2xl text-white">
          <p className="text-xs font-medium opacity-80 mb-1">PRO PLAN</p>
          <p className="text-sm font-bold mb-3">Upgrade for unlimited interviews</p>
          <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

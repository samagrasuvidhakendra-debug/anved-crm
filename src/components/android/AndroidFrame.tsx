import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Users2,
  FolderGit2,
  Bot,
  Menu
} from 'lucide-react';

interface AndroidFrameProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  children: React.ReactNode;
  hideTabBar?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  currentTab = 'home',
  onSelectTab = () => {},
  children,
  hideTabBar = false
}) => {
  const { notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { id: 'franchise_dashboard', label: 'HOME', icon: Home },
    { id: 'crm', label: 'CRM', icon: Users2 },
    { id: 'projects', label: 'PROJECTS', icon: FolderGit2 },
    { id: 'ai_chat', label: 'AI CHAT', icon: Bot, isSpecial: true },
    { id: 'more', label: 'MORE', icon: Menu }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* App Content Viewport */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {children}
      </main>

      {/* In-App Mobile Bottom Navigation Bar */}
      {!hideTabBar && (
        <nav
          id="mobile-bottom-nav"
          aria-label="Mobile Bottom Navigation"
          className="h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-center px-2 z-30 shrink-0"
        >
          <div className="max-w-lg w-full flex items-center justify-around">
            {navItems.map(item => {
              const Icon = item.icon;
              const isTabActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`bottom-nav-${item.id}`}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`flex flex-col items-center justify-center w-16 min-h-[44px] py-1 transition-all relative touch-manipulation ${
                    isTabActive
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.isSpecial ? (
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center -mt-5 transition-transform shadow-lg ${
                        isTabActive
                          ? 'bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-500 text-white scale-105 shadow-emerald-500/30'
                          : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <Icon className="w-5 h-5 mb-1" />
                  )}
                  <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                  {item.id === 'more' && unreadCount > 0 && (
                    <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

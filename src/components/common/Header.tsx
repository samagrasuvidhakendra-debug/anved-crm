import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Bell,
  HelpCircle,
  UserCheck,
  CheckCircle,
  ChevronDown,
  LogOut,
  Lock,
  Sun,
  Moon,
  MoreHorizontal,
  Palette,
  ChevronRight,
  SlidersHorizontal,
  BookOpen,
  Settings,
  UserCog,
  KeyRound
} from 'lucide-react';
import { SolarPanelIcon } from './SolarPanelIcon';
import { AppLogo } from './AppLogo';
import { EditProfileModal } from '../modals/EditProfileModal';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenGuide }) => {
  const {
    currentUser,
    allUsers,
    switchUserRole,
    isAuthenticated,
    logout,
    notifications,
    isSuperAdmin,
    isUserSuspended,
    theme,
    setTheme,
    toggleTheme
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  // Close menus on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (roleMenuRef.current && !roleMenuRef.current.contains(target)) {
        setShowRoleMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setShowMoreMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowRoleMenu(false);
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header
      id="acs-global-header"
      className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-40 px-3 sm:px-6 h-14"
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-2 sm:gap-4">
        {/* ========================================================= */}
        {/* Left Section: Brand Logo & Title & Status Badges */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          {/* Official Solar Brand Logo */}
          <AppLogo size="md" showText={true} />

          <span className="hidden md:inline-flex items-center text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0">
            {isSuperAdmin ? 'Super Admin' : 'Franchise OS'}
          </span>
        </div>

        {/* ========================================================= */}
        {/* Right Section: Aligned Action Icons + More Menu + Profile */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications Icon Button */}
          <button
            id="open-notifications-btn"
            type="button"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Open Notifications"
            aria-label="Open Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] min-w-[17px] h-4 px-1 rounded-full flex items-center justify-center font-bold ring-2 ring-slate-900 shadow-sm animate-pulse">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* More Menu Trigger Button (Consolidates all secondary controls) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              id="header-more-menu-btn"
              type="button"
              onClick={() => {
                setShowMoreMenu(!showMoreMenu);
                setShowRoleMenu(false);
              }}
              className={`relative w-9 h-9 sm:w-auto sm:px-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${
                showMoreMenu
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 text-slate-300 hover:text-white hover:scale-105 active:scale-95'
              }`}
              title="More options & tools (Theme, App Guide)"
              aria-label="More options & tools"
              aria-expanded={showMoreMenu}
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-semibold">More</span>
            </button>

            {/* ========================================================= */}
            {/* More Menu Dropdown: Cleanly Organized Modules */}
            {/* ========================================================= */}
            {showMoreMenu && (
              <div
                id="header-more-dropdown"
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
              >
                {/* Header Title */}
                <div className="px-2 pb-2.5 mb-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                    Quick Controls & Tools
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-bold">ACS Solar OS</span>
                </div>

                {/* Section 1: Display & Theme Mode */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-emerald-400" />
                      Visual Theme
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {theme === 'dark' ? 'Dark' : 'Light'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      id="quick-theme-toggle-btn"
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-bold text-xs transition-all ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-bold text-xs transition-all ${
                        theme === 'light'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light Mode</span>
                    </button>
                  </div>
                </div>

                {/* Section 2: Interactive App Guide */}
                <div className="space-y-1 pt-1">
                  <button
                    id="open-app-guide-btn"
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenGuide();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-slate-200 hover:bg-slate-800 transition-colors group text-left border border-transparent hover:border-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/25">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white leading-none">Interactive App Guide</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Explore walkthrough, SOPs & workflows</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Persona & Role Switcher */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In Required</span>
            </div>
          ) : (
            <div className="relative" ref={roleMenuRef}>
              <button
                id="user-persona-menu-btn"
                type="button"
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowMoreMenu(false);
                }}
                className={`flex items-center gap-2 h-9 px-2 sm:px-2.5 rounded-xl border text-left transition-all ${
                  showRoleMenu
                    ? 'bg-slate-700/90 border-slate-600 ring-1 ring-emerald-400/40'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 hover:scale-105 active:scale-95'
                }`}
                title={`Logged in as ${currentUser.name} (${currentUser.role})`}
                aria-label="User profile and role menu"
                aria-expanded={showRoleMenu}
              >
                <img
                  src={
                    currentUser.profilePhoto ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-emerald-400/60 shrink-0"
                />

                <div className="hidden sm:block text-left min-w-0">
                  <div className="text-xs font-bold text-white leading-none truncate max-w-[100px] flex items-center gap-1">
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="text-[9px] text-emerald-400 font-semibold leading-tight mt-0.5 truncate max-w-[100px]">
                    {isUserSuspended(currentUser) ? (
                      <span className="text-rose-400 font-bold">SUSPENDED</span>
                    ) : (
                      currentUser.role.replace('_', ' ')
                    )}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Persona Switcher Dropdown */}
              {showRoleMenu && (
                <div
                  id="role-switch-dropdown"
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
                >
                  {/* Current Active Account Header */}
                  <div className="px-3 py-2 border-b border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          currentUser.profilePhoto ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={currentUser.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                          <span>{currentUser.name}</span>
                          {isUserSuspended(currentUser) && (
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-extrabold border border-rose-500/40 uppercase tracking-wider">
                              Suspended
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-semibold truncate">
                          {currentUser.role.replace('_', ' ')}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{currentUser.mobile || currentUser.email}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        id="header-edit-profile-btn"
                        onClick={() => {
                          setShowRoleMenu(false);
                          setIsEditProfileOpen(true);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <UserCog className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                      <button
                        type="button"
                        id="header-change-password-btn"
                        onClick={() => {
                          setShowRoleMenu(false);
                          setIsChangePasswordOpen(true);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Password</span>
                      </button>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Switch Role / Test Persona</span>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>

                  {/* Users / Roles list */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {allUsers.map(user => {
                      const isSelected = user.id === currentUser.id;
                      const isSuspended = isUserSuspended(user);
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            switchUserRole(user.id);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center gap-2.5 transition-colors hover:bg-slate-800/80 ${
                            isSelected ? 'bg-slate-800/90 font-medium' : ''
                          } ${isSuspended ? 'opacity-70' : ''}`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={
                                user.profilePhoto ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                              }
                              alt={user.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            {isSuspended && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 border border-slate-900" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-semibold text-xs truncate">{user.name}</span>
                              <div className="flex items-center gap-1 shrink-0 ml-1">
                                {isSuspended && (
                                  <span className="text-[9px] bg-rose-500/25 text-rose-300 px-1.5 py-0.2 rounded font-extrabold border border-rose-500/40 uppercase">
                                    Suspended
                                  </span>
                                )}
                                {isSelected && (
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </div>
                            </div>
                            <div className="text-[10px] text-amber-400 flex items-center gap-1 truncate">
                              <span>{user.role}</span>
                              {user.franchiseName && (
                                <span className="text-slate-400">• {user.franchiseName}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Logout Button */}
                  <div className="p-2 border-t border-slate-800 mt-1">
                    <button
                      id="header-logout-btn"
                      type="button"
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of ACS Solar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </header>
  );
};

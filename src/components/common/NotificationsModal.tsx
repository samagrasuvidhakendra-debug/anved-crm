import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  Megaphone,
  Calendar,
  CreditCard,
  UserPlus,
  Wrench,
  FileCheck
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { notifications, announcements, markNotificationAsRead, currentUser } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'New Lead':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'Follow-up Reminder':
      case 'Overdue Follow-up':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'Payment Received':
      case 'Payment Pending':
        return <CreditCard className="w-4 h-4 text-sky-400" />;
      case 'Installation Scheduled':
      case 'Project Updated':
        return <Wrench className="w-4 h-4 text-purple-400" />;
      case 'Quotation Created':
        return <FileCheck className="w-4 h-4 text-teal-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="notifications-drawer"
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Notifications & Broadcasts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Admin Announcements Broadcasts */}
          {announcements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Headquarters Announcements</span>
              </div>
              <div className="space-y-2.5">
                {announcements.map(ann => (
                  <div
                    key={ann.id}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{ann.title}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          ann.priority === 'High' || ann.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ann.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">{ann.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Published by {ann.createdBy}</span>
                      <span>Valid till {ann.expiryDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Notifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Activity Feed ({notifications.length})
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No notifications right now. You are all caught up!
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      if (notif.link && onNavigateTab) {
                        onNavigateTab(notif.link);
                        onClose();
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      notif.isRead
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                        : 'bg-slate-800/80 border-slate-700 text-white shadow-sm hover:border-amber-400/50'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold truncate">{notif.title}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">{notif.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{notif.message}</p>
                    </div>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center">
          <button
            onClick={() => {
              notifications.forEach(n => markNotificationAsRead(n.id));
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center justify-center gap-1 mx-auto"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};

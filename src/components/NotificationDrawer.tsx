import React from 'react';
import { AndroidNotification } from '../types';
import { 
  Bell, 
  X, 
  Trash2, 
  ChevronUp, 
  Briefcase, 
  Clock, 
  ExternalLink,
  Volume2,
  VolumeX
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AndroidNotification[];
  onSelectNotification: (jobId: string) => void;
  onDismissNotification: (id: string) => void;
  onClearAll: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onDismissNotification,
  onClearAll,
  soundEnabled,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="android-notification-shade"
      className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col text-slate-100 animate-in slide-in-from-top-4 duration-200"
    >
      {/* Shade Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-sm">Notifications Shade</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {notifications.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-blue-950 text-blue-300 border-blue-800'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title={soundEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-slate-800 flex items-center space-x-1"
              title="Clear all notifications"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs text-center px-4">
            <Bell className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
            <span className="font-medium text-slate-400">No active notifications</span>
            <span className="text-[11px] text-slate-500 mt-1">
              Update any job application's status in the Job Details Activity to see live notifications here.
            </span>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-md relative group transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30 mt-0.5">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-wider">
                        JobTrack • NotificationManager
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">• {notif.timestamp}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 mt-0.5">{notif.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notif.message}</p>

                    <button
                      onClick={() => {
                        onSelectNotification(notif.jobId);
                        onClose();
                      }}
                      className="mt-2 inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300"
                    >
                      <span>Open Application</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismissNotification(notif.id);
                  }}
                  className="text-slate-500 hover:text-slate-200 p-1 -mr-1 -mt-1 rounded-full hover:bg-slate-800"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Pull up handle */}
      <div className="p-2 border-t border-slate-800 flex justify-center">
        <button
          onClick={onClose}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-3 py-1 rounded-full bg-slate-900 border border-slate-800"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span>Close Notification Shade</span>
        </button>
      </div>
    </div>
  );
};

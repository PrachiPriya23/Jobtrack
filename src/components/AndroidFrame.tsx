import React, { useState, useEffect } from 'react';
import { AndroidNotification } from '../types';
import { NotificationDrawer } from './NotificationDrawer';
import { 
  Wifi, 
  BatteryMedium, 
  Bell, 
  ChevronLeft, 
  Circle, 
  Square, 
  Volume2, 
  VolumeX,
  X,
  ExternalLink
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onBackPressed: () => void;
  onHomePressed: () => void;
  notifications: AndroidNotification[];
  headsUpNotification: AndroidNotification | null;
  onDismissHeadsUp: () => void;
  onSelectNotification: (jobId: string) => void;
  onDismissNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onBackPressed,
  onHomePressed,
  notifications,
  headsUpNotification,
  onDismissHeadsUp,
  onSelectNotification,
  onDismissNotification,
  onClearAllNotifications,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [isShadeOpen, setIsShadeOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[420px] h-[780px] sm:h-[820px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col ring-1 ring-white/10 select-none">
      {/* Outer Phone Bezel Gloss */}
      <div className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/10" />

      {/* Screen Container */}
      <div className="relative flex-1 w-full bg-slate-100 rounded-[34px] overflow-hidden flex flex-col shadow-inner">

        {/* Android Status Bar */}
        <div
          id="android-status-bar"
          onClick={() => setIsShadeOpen(!isShadeOpen)}
          className="h-9 px-5 bg-white/95 backdrop-blur-xs border-b border-slate-200/60 flex items-center justify-between text-xs text-slate-800 z-30 cursor-pointer hover:bg-slate-50 transition-colors select-none"
          title="Click to toggle Notification Shade"
        >
          {/* Time & App Notification Icons */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[11px] font-mono">{currentTime}</span>
            {notifications.length > 0 && (
              <span className="flex items-center space-x-1 text-blue-600 animate-pulse">
                <Bell className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold">{notifications.length}</span>
              </span>
            )}
          </div>

          {/* Camera Cutout / Notch */}
          <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-800/80 mx-auto shadow-inner" />

          {/* System Icons (Wifi, Sound, Battery) */}
          <div className="flex items-center space-x-2 text-slate-600">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSound();
              }}
              className="p-0.5 hover:text-slate-900"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="w-3 h-3 text-slate-700" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
            </button>
            <span className="text-[9px] font-bold text-slate-500">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-700" />
            <div className="flex items-center space-x-0.5">
              <span className="text-[10px] font-medium font-mono text-slate-700">88%</span>
              <BatteryMedium className="w-4 h-4 text-slate-700" />
            </div>
          </div>
        </div>

        {/* Pull-down Hint Bar (Small indicator line) */}
        <div
          onClick={() => setIsShadeOpen(!isShadeOpen)}
          className="h-1 bg-slate-200 hover:bg-blue-400 cursor-pointer transition-colors z-30 flex justify-center items-center"
        >
          <div className="w-10 h-0.5 bg-slate-400 rounded-full" />
        </div>

        {/* Heads-Up Notification Banner (Drops from top on status change) */}
        {headsUpNotification && (
          <div
            id="heads-up-notification-banner"
            className="absolute top-10 left-3 right-3 z-50 p-3 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-slate-700 animate-in slide-in-from-top-6 duration-300"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex-1 cursor-pointer pr-2"
                onClick={() => {
                  onSelectNotification(headsUpNotification.jobId);
                  onDismissHeadsUp();
                }}
              >
                <div className="flex items-center space-x-1.5 text-[10px] text-amber-400 font-mono font-bold uppercase">
                  <Bell className="w-3 h-3 fill-amber-400" />
                  <span>JobTrack • Status Updated</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-0.5">{headsUpNotification.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-snug">{headsUpNotification.message}</p>
                <div className="mt-1.5 flex items-center space-x-1 text-[11px] text-blue-400 font-medium">
                  <span>Tap to open Job Details</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>

              <button
                onClick={onDismissHeadsUp}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Notification Shade Drawer Overlay */}
        <NotificationDrawer
          isOpen={isShadeOpen}
          onClose={() => setIsShadeOpen(false)}
          notifications={notifications}
          onSelectNotification={onSelectNotification}
          onDismissNotification={onDismissNotification}
          onClearAll={onClearAllNotifications}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
        />

        {/* Active Android Activity / Fragment View */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>

        {/* Bottom Android 3-Button Navigation Bar */}
        <div
          id="android-nav-bar"
          className="h-11 bg-slate-950 px-10 flex items-center justify-around border-t border-slate-900 z-30 select-none text-slate-400"
        >
          {/* Back Button -> onBackPressed() */}
          <button
            id="nav-btn-back"
            onClick={onBackPressed}
            className="p-2 rounded-full hover:bg-slate-800 hover:text-white active:scale-90 transition-all"
            title="Back (onBackPressed())"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Home Button -> onHomePressed() */}
          <button
            id="nav-btn-home"
            onClick={onHomePressed}
            className="p-2 rounded-full hover:bg-slate-800 hover:text-white active:scale-90 transition-all"
            title="Home (JobDashboardActivity)"
          >
            <Circle className="w-4 h-4" />
          </button>

          {/* Recents / Overview Button */}
          <button
            id="nav-btn-recents"
            onClick={() => setIsShadeOpen(!isShadeOpen)}
            className="p-2 rounded-full hover:bg-slate-800 hover:text-white active:scale-90 transition-all"
            title="Notification Shade & Recents"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

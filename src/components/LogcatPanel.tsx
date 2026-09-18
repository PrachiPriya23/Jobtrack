import React, { useState, useEffect, useRef } from 'react';
import { Logcat } from '../utils/logcatManager';
import { LogcatEntry, LogLevel } from '../types';
import { 
  Terminal, 
  Trash2, 
  Search, 
  Filter, 
  ArrowDown, 
  Activity as ActivityIcon,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface LogcatPanelProps {
  onMinimize?: () => void;
  isDrawer?: boolean;
}

export const LogcatPanel: React.FC<LogcatPanelProps> = ({ isDrawer = false }) => {
  const [logs, setLogs] = useState<LogcatEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [showLifecycleGuide, setShowLifecycleGuide] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = Logcat.subscribe((newLogs) => {
      setLogs(newLogs);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (filterTag !== 'ALL' && log.tag !== filterTag) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.tag.toLowerCase().includes(q) ||
        log.timestamp.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'V':
        return 'text-slate-400 bg-slate-800/40 border-slate-700';
      case 'D':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/60';
      case 'I':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
      case 'W':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/60';
      case 'E':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
      default:
        return 'text-slate-400';
    }
  };

  const getTagBadgeColor = (tag: string) => {
    if (tag.includes('JobDashboardActivity')) return 'text-indigo-400 bg-indigo-950/50 border-indigo-800/50';
    if (tag.includes('ApplicationFragment')) return 'text-teal-400 bg-teal-950/50 border-teal-800/50';
    if (tag.includes('JobDetailsActivity')) return 'text-purple-400 bg-purple-950/50 border-purple-800/50';
    if (tag.includes('Notification')) return 'text-amber-400 bg-amber-950/50 border-amber-800/50';
    return 'text-slate-400 bg-slate-800/40 border-slate-700/50';
  };

  const handleCopyLogs = () => {
    const text = filteredLogs
      .map((l) => `${l.timestamp} [${l.level}/${l.tag}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="logcat-panel-container"
      className="flex flex-col h-full bg-[#0c1017] text-slate-200 border border-slate-800 rounded-xl overflow-hidden shadow-2xl"
    >
      {/* Top Bar / Controls */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2.5 bg-slate-900 border-b border-slate-800 gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 font-mono font-semibold text-emerald-400">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Android Logcat</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px]">
            {filteredLogs.length} events
          </span>
          <span className="hidden sm:inline-block text-[11px] text-emerald-500/90 font-mono">
            ● connected (emulator-5554)
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-lifecycle-guide"
            onClick={() => setShowLifecycleGuide(!showLifecycleGuide)}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors border ${
              showLifecycleGuide
                ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="View Activity & Fragment Lifecycle Flow"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline text-[11px]">Lifecycle Guide</span>
          </button>

          <button
            id="btn-copy-logcat"
            onClick={handleCopyLogs}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            id="btn-toggle-autoscroll"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded transition-colors ${
              autoScroll ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Auto-scroll to bottom"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-clear-logcat"
            onClick={() => Logcat.clear()}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800 transition-colors border border-slate-700 text-slate-300"
            title="Clear Logcat buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Clear</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-[#0d121c] border-b border-slate-800 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[140px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-logcat-search"
            type="text"
            placeholder="Filter message or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Level Dropdown */}
        <div className="flex items-center space-x-1">
          <span className="text-slate-500 text-[11px]">Level:</span>
          <select
            id="select-logcat-level"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'ALL')}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Levels</option>
            <option value="V">Verbose (V)</option>
            <option value="D">Debug (D)</option>
            <option value="I">Info (I)</option>
            <option value="W">Warn (W)</option>
            <option value="E">Error (E)</option>
          </select>
        </div>

        {/* Tag Filter */}
        <div className="flex items-center space-x-1">
          <Filter className="w-3 h-3 text-slate-500" />
          <select
            id="select-logcat-tag"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Tags</option>
            <option value="JobDashboardActivity">JobDashboardActivity</option>
            <option value="ApplicationFragment">ApplicationFragment</option>
            <option value="JobDetailsActivity">JobDetailsActivity</option>
            <option value="NotificationManager">NotificationManager</option>
            <option value="ActivityTaskManager">ActivityTaskManager (Intents)</option>
          </select>
        </div>
      </div>

      {/* Lifecycle Guide Modal / Banner */}
      {showLifecycleGuide && (
        <div id="lifecycle-guide-banner" className="bg-slate-900 border-b border-indigo-900/60 p-3 text-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-2">
              <ActivityIcon className="w-4 h-4" />
              <span>Android Lifecycle Callbacks Executed in this App</span>
            </div>
            <button
              onClick={() => setShowLifecycleGuide(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 font-mono text-[11px] text-slate-300">
            <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
              <div className="text-emerald-400 font-bold mb-1">Activity Lifecycle:</div>
              <p className="text-slate-400 leading-relaxed">
                onCreate() → onStart() → onResume() → <span className="text-amber-300">Active</span> → onPause() → onStop() → onDestroy()
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Monitored for <span className="text-indigo-300">JobDashboardActivity</span> & <span className="text-purple-300">JobDetailsActivity</span>.
              </p>
            </div>
            <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
              <div className="text-teal-400 font-bold mb-1">Fragment Lifecycle:</div>
              <p className="text-slate-400 leading-relaxed">
                onAttach() → onCreate() → onCreateView() → onViewCreated() → onStart() → onResume() → onPause() → onStop() → onDestroyView() → onDestroy() → onDetach()
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Monitored for <span className="text-teal-300">ApplicationFragment</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Log Output Stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2.5 font-mono text-[11.5px] leading-snug space-y-1 bg-[#0a0e14] selection:bg-indigo-900/60"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs font-mono">
            <Terminal className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
            <span>No Logcat entries match the current filter.</span>
            <span className="text-[11px] text-slate-600 mt-1">
              Interact with the app (open Add Application, click a job, or update status) to generate logs.
            </span>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isLifecycle = log.message.includes('Lifecycle:');
            const isFragment = log.message.includes('Fragment Lifecycle:');
            const isNotification = log.tag.includes('Notification');
            const isIntent = log.tag.includes('ActivityTaskManager') || log.componentType === 'Intent';

            return (
              <div
                key={log.id}
                className={`flex items-start space-x-2 px-2 py-1 rounded transition-colors font-mono hover:bg-slate-900/60 ${
                  isLifecycle || isFragment
                    ? 'bg-slate-900/40 border-l-2 border-indigo-500'
                    : isNotification
                    ? 'bg-amber-950/20 border-l-2 border-amber-500'
                    : isIntent
                    ? 'bg-sky-950/20 border-l-2 border-sky-500'
                    : ''
                }`}
              >
                {/* Timestamp */}
                <span className="text-slate-500 shrink-0 select-none text-[10px]">
                  {log.timestamp}
                </span>

                {/* Level Badge */}
                <span
                  className={`px-1 rounded text-[9.5px] font-bold border shrink-0 ${getLevelColor(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>

                {/* Tag Badge */}
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0 ${getTagBadgeColor(
                    log.tag
                  )}`}
                >
                  {log.tag}
                </span>

                {/* Message Body */}
                <span
                  className={`break-words flex-1 ${
                    isLifecycle
                      ? 'text-indigo-200 font-semibold'
                      : isFragment
                      ? 'text-teal-200 font-semibold'
                      : isNotification
                      ? 'text-amber-200'
                      : isIntent
                      ? 'text-sky-200'
                      : log.level === 'E'
                      ? 'text-rose-300 font-bold'
                      : log.level === 'W'
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Status Footer */}
      <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <div className="flex items-center space-x-2">
          <span>PID: 14820</span>
          <span>•</span>
          <span>Package: com.example.jobtrack</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>Buffer: Main/System</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

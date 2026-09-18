import { LogcatEntry, LogLevel } from '../types';

type LogcatListener = (logs: LogcatEntry[]) => void;

class LogcatManager {
  private logs: LogcatEntry[] = [];
  private listeners: Set<LogcatListener> = new Set();
  private maxLogs = 300;

  constructor() {
    // Initial system boot logs
    this.log('I', 'System.out', 'Android Runtime (ART) initialized - VM initialized successfully', 'System');
    this.log('D', 'PackageManager', 'Package com.example.jobtrack found and verified', 'System');
    this.log('I', 'ActivityManager', 'Starting Activity: Intent { act=android.intent.action.MAIN cat=[android.intent.category.LAUNCHER] cmp=com.example.jobtrack/.JobDashboardActivity }', 'Intent');
  }

  private getTimestamp(): string {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `${mm}-${dd} ${hh}:${min}:${ss}.${ms}`;
  }

  public log(
    level: LogLevel,
    tag: string,
    message: string,
    componentType: LogcatEntry['componentType'] = 'System'
  ): void {
    const entry: LogcatEntry = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp: this.getTimestamp(),
      level,
      tag,
      message,
      componentType,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    this.notify();
  }

  public v(tag: string, message: string, componentType: LogcatEntry['componentType'] = 'System') {
    this.log('V', tag, message, componentType);
  }

  public d(tag: string, message: string, componentType: LogcatEntry['componentType'] = 'System') {
    this.log('D', tag, message, componentType);
  }

  public i(tag: string, message: string, componentType: LogcatEntry['componentType'] = 'System') {
    this.log('I', tag, message, componentType);
  }

  public w(tag: string, message: string, componentType: LogcatEntry['componentType'] = 'System') {
    this.log('W', tag, message, componentType);
  }

  public e(tag: string, message: string, componentType: LogcatEntry['componentType'] = 'System') {
    this.log('E', tag, message, componentType);
  }

  // Lifecycle helpers
  public logActivityLifecycle(activityName: string, method: string, extraInfo = '') {
    const info = extraInfo ? ` [${extraInfo}]` : '';
    this.log('D', activityName, `--> Lifecycle: ${method}() called${info}`, 'Activity');
  }

  public logFragmentLifecycle(fragmentName: string, method: string, extraInfo = '') {
    const info = extraInfo ? ` [${extraInfo}]` : '';
    this.log('D', fragmentName, `~~~ Fragment Lifecycle: ${method}() executed${info}`, 'Fragment');
  }

  public logIntent(action: string, targetActivity: string, extras?: Record<string, unknown>) {
    const extraStr = extras ? ` with Extras: ${JSON.stringify(extras)}` : '';
    this.log('I', 'ActivityTaskManager', `START u0 {cmp=com.example.jobtrack/.${targetActivity}}${extraStr} from pid ${process?.pid || 14820}`, 'Intent');
  }

  public logNotification(channelId: string, id: number, title: string, content: string) {
    this.log('I', 'NotificationManager', `Notification posted: [ID=${id}, Channel="${channelId}"] Title: "${title}", Text: "${content}"`, 'Notification');
  }

  public getLogs(): LogcatEntry[] {
    return [...this.logs];
  }

  public clear(): void {
    this.logs = [];
    this.notify();
  }

  public subscribe(listener: LogcatListener): () => void {
    this.listeners.add(listener);
    listener(this.getLogs());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const copy = this.getLogs();
    this.listeners.forEach((listener) => listener(copy));
  }
}

export const Logcat = new LogcatManager();

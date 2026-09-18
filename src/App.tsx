import React, { useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus, AndroidScreen, AndroidNotification } from './types';
import { INITIAL_JOB_APPLICATIONS } from './data/initialJobs';
import { Logcat } from './utils/logcatManager';
import { AndroidFrame } from './components/AndroidFrame';
import { JobDashboardActivity } from './components/JobDashboardActivity';
import { ApplicationFragment } from './components/ApplicationFragment';
import { JobDetailsActivity } from './components/JobDetailsActivity';
import { LogcatPanel } from './components/LogcatPanel';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { 
  Smartphone, 
  Terminal, 
  Code2, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  BookOpen,
  Info,
  CheckCircle2
} from 'lucide-react';

const STORAGE_KEY = 'jobtrack_applications_v1';

export default function App() {
  // Application Data State with LocalStorage Persistence
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load applications from localStorage:', e);
    }
    return INITIAL_JOB_APPLICATIONS;
  });

  // Current screen inside the Android emulator
  const [currentScreen, setCurrentScreen] = useState<AndroidScreen>({ type: 'DASHBOARD' });

  // Notifications State
  const [notifications, setNotifications] = useState<AndroidNotification[]>([]);
  const [headsUpNotification, setHeadsUpNotification] = useState<AndroidNotification | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Desktop Studio View Mode: 'app-and-logcat' | 'logcat-full' | 'code-full'
  const [activeTab, setActiveTab] = useState<'app-and-logcat' | 'logcat-full' | 'code-full'>('app-and-logcat');
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // Save applications to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [applications]);

  // Handle adding application from ApplicationFragment
  const handleSaveApplication = (data: Omit<JobApplication, 'id' | 'appliedDate'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newJob: JobApplication = {
      ...data,
      id: `job-${Math.floor(100 + Math.random() * 900)}`,
      appliedDate: today,
      lastUpdatedDate: today,
    };

    setApplications((prev) => [newJob, ...prev]);
    Logcat.i('JobDashboardActivity', `Application added to dashboard: ${newJob.companyName} (${newJob.jobRole})`, 'Activity');

    // Pop back to Dashboard
    setCurrentScreen({ type: 'DASHBOARD' });
  };

  // Handle status update from JobDetailsActivity (triggers notification)
  const handleUpdateStatus = (jobId: string, newStatus: ApplicationStatus) => {
    let updatedJob: JobApplication | null = null;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];

    setApplications((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          updatedJob = {
            ...job,
            status: newStatus,
            lastUpdatedDate: today,
          };
          return updatedJob;
        }
        return job;
      })
    );

    if (updatedJob) {
      const notifItem: AndroidNotification = {
        id: `notif-${Date.now()}`,
        notificationId: 1001,
        title: `Status Updated: ${(updatedJob as JobApplication).companyName}`,
        message: `${(updatedJob as JobApplication).applicantName}'s application for ${(updatedJob as JobApplication).jobRole} is now: ${newStatus}`,
        subText: 'JobTrack Application Manager',
        timestamp: nowTime,
        jobId,
        status: newStatus,
        companyName: (updatedJob as JobApplication).companyName,
        read: false,
      };

      // Add to notifications list
      setNotifications((prev) => [notifItem, ...prev]);

      // Trigger Heads-Up Banner
      setHeadsUpNotification(notifItem);
      setTimeout(() => {
        setHeadsUpNotification((current) => (current?.id === notifItem.id ? null : current));
      }, 5000);
    }
  };

  // Android Navigation Handlers
  const handleBackPressed = () => {
    if (currentScreen.type === 'ADD_FRAGMENT') {
      Logcat.d('JobDashboardActivity', 'Fragment back pressed: popBackStack()', 'Fragment');
      setCurrentScreen({ type: 'DASHBOARD' });
    } else if (currentScreen.type === 'DETAILS') {
      Logcat.d('JobDetailsActivity', 'Activity back pressed: finish()', 'Activity');
      setCurrentScreen({ type: 'DASHBOARD' });
    } else {
      Logcat.d('JobDashboardActivity', 'onBackPressed() at root activity - App remains in background', 'Activity');
    }
  };

  const handleHomePressed = () => {
    Logcat.d('ActivityManager', 'Home button pressed: Returning to launcher/dashboard', 'System');
    setCurrentScreen({ type: 'DASHBOARD' });
  };

  const handleQuickDemo = () => {
    // Quick demonstration: open Fragment or update status
    if (applications.length > 0) {
      const firstJob = applications[0];
      const nextStatus: ApplicationStatus = 
        firstJob.status === 'Applied' ? 'Interview' :
        firstJob.status === 'Interview' ? 'Selected' : 'Interview';
      handleUpdateStatus(firstJob.id, nextStatus);
    }
  };

  const handleResetData = () => {
    setApplications(INITIAL_JOB_APPLICATIONS);
    setNotifications([]);
    setHeadsUpNotification(null);
    setCurrentScreen({ type: 'DASHBOARD' });
    Logcat.clear();
    Logcat.i('System', 'Application data and Logcat reset to factory defaults', 'System');
  };

  // Find job for details screen
  const selectedJob =
    currentScreen.type === 'DETAILS'
      ? applications.find((j) => j.id === currentScreen.jobId) || applications[0]
      : null;

  return (
    <div id="jobtrack-app-root" className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-blue-600/40">
      
      {/* Studio Header Bar */}
      <header className="h-14 px-4 sm:px-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            JT
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-sm sm:text-base text-slate-100 tracking-tight">
                JobTrack <span className="text-slate-400 font-normal">Android Manager</span>
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-800/60">
                Q7 Practical Exam
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Activity & Fragment Lifecycles • Intent Data Passing • NotificationManager
            </p>
          </div>
        </div>

        {/* Studio View Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            id="tab-btn-simulator"
            onClick={() => setActiveTab('app-and-logcat')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'app-and-logcat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">App & Logcat</span>
          </button>

          <button
            id="tab-btn-logcat"
            onClick={() => setActiveTab('logcat-full')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'logcat-full'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Logcat</span>
          </button>

          <button
            id="tab-btn-code"
            onClick={() => setActiveTab('code-full')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'code-full'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Android Code</span>
          </button>
        </div>

        {/* Fast Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-simulate-notification"
            onClick={handleQuickDemo}
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
            title="Simulate updating status and dispatching notification"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Notification</span>
          </button>

          <button
            id="btn-view-spec"
            onClick={() => setShowQuestionModal(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="View Assignment Prompt Specification"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            id="btn-reset-data"
            onClick={handleResetData}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Reset Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 flex flex-col p-3 sm:p-5 overflow-hidden">
        {activeTab === 'app-and-logcat' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 h-full max-w-[1700px] mx-auto w-full items-start">
            
            {/* Left Column: Android Device Simulator */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between px-2 mb-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Pixel 8 Pro • API 34</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Screen:{' '}
                  <span className="text-blue-400 font-bold">
                    {currentScreen.type === 'DASHBOARD'
                      ? 'JobDashboardActivity'
                      : currentScreen.type === 'ADD_FRAGMENT'
                      ? 'ApplicationFragment'
                      : 'JobDetailsActivity'}
                  </span>
                </div>
              </div>

              {/* Android Phone Frame */}
              <AndroidFrame
                onBackPressed={handleBackPressed}
                onHomePressed={handleHomePressed}
                notifications={notifications}
                headsUpNotification={headsUpNotification}
                onDismissHeadsUp={() => setHeadsUpNotification(null)}
                onSelectNotification={(jobId) => {
                  setCurrentScreen({ type: 'DETAILS', jobId });
                }}
                onDismissNotification={(id) => {
                  setNotifications((prev) => prev.filter((n) => n.id !== id));
                }}
                onClearAllNotifications={() => setNotifications([])}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
              >
                {/* Render active screen */}
                {currentScreen.type === 'DASHBOARD' && (
                  <JobDashboardActivity
                    applications={applications}
                    onOpenAddFragment={() => setCurrentScreen({ type: 'ADD_FRAGMENT' })}
                    onSelectApplication={(job) => setCurrentScreen({ type: 'DETAILS', jobId: job.id })}
                  />
                )}

                {currentScreen.type === 'ADD_FRAGMENT' && (
                  <ApplicationFragment
                    onSave={handleSaveApplication}
                    onClose={() => setCurrentScreen({ type: 'DASHBOARD' })}
                  />
                )}

                {currentScreen.type === 'DETAILS' && selectedJob && (
                  <JobDetailsActivity
                    job={selectedJob}
                    onUpdateStatus={handleUpdateStatus}
                    onBack={() => setCurrentScreen({ type: 'DASHBOARD' })}
                  />
                )}
              </AndroidFrame>
            </div>

            {/* Right Column: Interactive Logcat Panel + Live Lifecycle Flow */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col h-[780px] sm:h-[820px] space-y-3">
              
              {/* Architecture Blueprint Card */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start space-x-3 shadow-md">
                <Layers className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-slate-100 flex items-center space-x-2">
                    <span>Android Component Stack & State Machine</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-mono">
                      Q7 Compliant
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    1. <b className="text-slate-200">JobDashboardActivity</b> launches initially with previously added jobs.
                    2. Tapping <b className="text-blue-400">+ Add Application</b> inflates <b className="text-teal-400">ApplicationFragment</b> with EditTexts & RadioGroups.
                    3. Selecting any card fires an <b className="text-purple-400">Intent</b> with extras to open <b className="text-purple-400">JobDetailsActivity</b>.
                    4. Updating status posts a system notification via <b className="text-amber-400">NotificationManager</b>.
                  </p>
                </div>
              </div>

              {/* Logcat Terminal */}
              <div className="flex-1 min-h-0">
                <LogcatPanel />
              </div>
            </div>

          </div>
        )}

        {activeTab === 'logcat-full' && (
          <div className="flex-1 max-w-[1400px] w-full mx-auto h-full min-h-[680px]">
            <LogcatPanel />
          </div>
        )}

        {activeTab === 'code-full' && (
          <div className="flex-1 max-w-[1400px] w-full mx-auto h-full min-h-[680px]">
            <AndroidCodeViewer />
          </div>
        )}
      </main>

      {/* Assignment Problem Statement Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-5 text-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">Q7. JobTrack – Job Application Manager</h3>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <p className="font-medium text-slate-100">
                Develop an Android application called <span className="text-blue-400 font-bold">JobTrack</span> to help users manage job applications.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>
                  The application should contain a <b className="text-white">Job Dashboard Activity</b> displaying previously added applications.
                </li>
                <li>
                  Provide an <b className="text-white">Add Application</b> option that opens an <b className="text-teal-400">Application Fragment</b>.
                </li>
                <li>
                  The Fragment should contain:
                  <ul className="list-circle pl-5 mt-1 space-y-0.5 text-slate-400">
                    <li>Applicant Name – <span className="text-slate-200">EditText</span></li>
                    <li>Company Name – <span className="text-slate-200">EditText</span></li>
                    <li>Job Role – <span className="text-slate-200">EditText</span></li>
                    <li>Employment Type using <span className="text-slate-200">RadioGroup</span>: Full Time, Part Time, Internship</li>
                    <li>Application Status using <span className="text-slate-200">RadioGroup</span>: Applied, Interview, Selected, Rejected</li>
                    <li>Save Application – <span className="text-slate-200">Button</span></li>
                  </ul>
                </li>
                <li>After saving, display the application on the dashboard.</li>
                <li>
                  When a job application is selected, open a <b className="text-purple-400">Job Details Activity</b> using an <b className="text-white">Intent</b>.
                </li>
                <li>
                  The Job Details Activity should display the complete application information and provide an <b className="text-white">Update Status</b> option.
                </li>
                <li>
                  <b className="text-amber-400">Generate a notification</b> whenever an application status is updated.
                </li>
                <li>
                  Implement suitable Activity and Fragment lifecycle methods and display their execution in <b className="text-emerald-400">Logcat</b>.
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

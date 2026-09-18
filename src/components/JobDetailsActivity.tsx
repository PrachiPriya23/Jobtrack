import React, { useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import { Logcat } from '../utils/logcatManager';
import { playNotificationSound } from '../utils/audio';
import { 
  ArrowLeft, 
  Building2, 
  Briefcase, 
  User, 
  Calendar, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Award, 
  XCircle,
  FileText,
  Share2
} from 'lucide-react';

interface JobDetailsActivityProps {
  job: JobApplication;
  onUpdateStatus: (jobId: string, newStatus: ApplicationStatus) => void;
  onBack: () => void;
}

const ALL_STATUSES: ApplicationStatus[] = ['Applied', 'Interview', 'Selected', 'Rejected'];

export const JobDetailsActivity: React.FC<JobDetailsActivityProps> = ({
  job,
  onUpdateStatus,
  onBack,
}) => {
  const TAG = 'JobDetailsActivity';

  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(job.status);
  const [selectedStatusToUpdate, setSelectedStatusToUpdate] = useState<ApplicationStatus>(job.status);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showIntentInspect, setShowIntentInspect] = useState(false);

  // Lifecycle Callbacks for JobDetailsActivity
  useEffect(() => {
    // 1. onCreate with Intent extras parsing
    Logcat.logActivityLifecycle(
      TAG,
      'onCreate',
      `Intent received with EXTRA_JOB_ID="${job.id}", EXTRA_COMPANY="${job.companyName}"`
    );

    // 2. onStart
    Logcat.logActivityLifecycle(TAG, 'onStart', 'Activity layout inflated and visible');

    // 3. onResume
    Logcat.logActivityLifecycle(TAG, 'onResume', 'Activity is in foreground, receiving user events');

    return () => {
      // 4. onPause
      Logcat.logActivityLifecycle(TAG, 'onPause', 'Activity losing focus');

      // 5. onStop
      Logcat.logActivityLifecycle(TAG, 'onStop', 'Activity stopped and obscured');

      // 6. onDestroy
      Logcat.logActivityLifecycle(TAG, 'onDestroy', 'Activity finishing - resources released');
    };
  }, [job.id, job.companyName]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleUpdateStatus = () => {
    if (selectedStatusToUpdate === currentStatus) {
      triggerToast(`Status is already "${currentStatus}"`);
      return;
    }

    const oldStatus = currentStatus;
    setCurrentStatus(selectedStatusToUpdate);
    onUpdateStatus(job.id, selectedStatusToUpdate);

    // Generate Notification whenever application status is updated (as explicitly mandated)
    const notifTitle = `Application Status Updated: ${job.companyName}`;
    const notifMsg = `${job.applicantName}'s application for ${job.jobRole} is now: ${selectedStatusToUpdate}`;
    
    // Play synthetic chime
    playNotificationSound();

    // Log to Logcat
    Logcat.logNotification('jobtrack_status_channel', 1001, notifTitle, notifMsg);
    Logcat.i(TAG, `Status transitioned from [${oldStatus}] to [${selectedStatusToUpdate}] for ${job.companyName}`, 'Activity');

    triggerToast(`Status changed to ${selectedStatusToUpdate}! Notification generated.`);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: <Clock className="w-3.5 h-3.5 mr-1" />,
        };
      case 'Interview':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Award className="w-3.5 h-3.5 mr-1" />,
        };
      case 'Selected':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 mr-1" />,
        };
    }
  };

  const currentBadge = getStatusBadge(currentStatus);

  return (
    <div id="job-details-activity-view" className="flex flex-col h-full bg-[#f8fafc] text-slate-900 overflow-y-auto">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            id="btn-details-back"
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            title="Back to Dashboard (finish())"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Job Details</h1>
            <p className="text-[11px] text-purple-600 font-mono">JobDetailsActivity</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            id="btn-inspect-intent"
            onClick={() => setShowIntentInspect(!showIntentInspect)}
            className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors flex items-center space-x-1"
            title="Inspect incoming Intent extras"
          >
            <Share2 className="w-3 h-3" />
            <span>Intent Extras</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 flex-1 pb-10">

        {/* Intent Extra Inspector Drawer */}
        {showIntentInspect && (
          <div className="p-3 bg-purple-950 text-purple-100 rounded-xl border border-purple-800 text-xs font-mono space-y-1.5 shadow-lg">
            <div className="flex items-center justify-between text-purple-300 font-bold border-b border-purple-800/80 pb-1">
              <span>Intent(this, JobDetailsActivity::class.java)</span>
              <button onClick={() => setShowIntentInspect(false)} className="text-purple-400 hover:text-white">✕</button>
            </div>
            <div className="text-[11px] space-y-0.5 text-purple-200">
              <div><span className="text-purple-400">EXTRA_JOB_ID:</span> "{job.id}"</div>
              <div><span className="text-purple-400">EXTRA_APPLICANT:</span> "{job.applicantName}"</div>
              <div><span className="text-purple-400">EXTRA_COMPANY:</span> "{job.companyName}"</div>
              <div><span className="text-purple-400">EXTRA_ROLE:</span> "{job.jobRole}"</div>
              <div><span className="text-purple-400">EXTRA_TYPE:</span> "{job.employmentType}"</div>
              <div><span className="text-purple-400">EXTRA_STATUS:</span> "{currentStatus}"</div>
            </div>
          </div>
        )}

        {/* Primary Job Overview Header Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                {job.companyName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {job.jobRole}
                </h2>
                <div className="flex items-center space-x-1.5 text-slate-600 text-sm mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800">{job.companyName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                {job.employmentType}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${currentBadge.bg}`}>
                {currentBadge.icon}
                {currentStatus}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              ID: {job.id}
            </div>
          </div>
        </div>

        {/* Complete Application Information Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Complete Application Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start space-x-2.5">
              <User className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px]">Applicant Name</span>
                <span className="font-semibold text-slate-900">{job.applicantName}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start space-x-2.5">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px]">Company Name</span>
                <span className="font-semibold text-slate-900">{job.companyName}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start space-x-2.5">
              <Briefcase className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px]">Job Role</span>
                <span className="font-semibold text-slate-900">{job.jobRole}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start space-x-2.5">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px]">Applied Date</span>
                <span className="font-semibold text-slate-900">{job.appliedDate}</span>
              </div>
            </div>
          </div>

          {job.notes && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-500 font-medium mb-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Notes & Status History</span>
              </div>
              <p className="text-slate-700">{job.notes}</p>
            </div>
          )}
        </div>

        {/* Update Status Option Section */}
        <div id="section-update-status" className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                Update Status Option
              </h3>
            </div>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Triggers Notification
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Selecting a new status and saving will automatically post an Android Notification to the status bar and log the event.
          </p>

          {/* RadioGroup for Status Selection */}
          <div className="grid grid-cols-2 gap-2">
            {ALL_STATUSES.map((stat) => {
              const isChecked = selectedStatusToUpdate === stat;
              return (
                <label
                  key={stat}
                  htmlFor={`rb-update-${stat.toLowerCase()}`}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-semibold shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <input
                    id={`rb-update-${stat.toLowerCase()}`}
                    type="radio"
                    name="updateStatusOption"
                    value={stat}
                    checked={isChecked}
                    onChange={() => setSelectedStatusToUpdate(stat)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs">{stat}</span>
                </label>
              );
            })}
          </div>

          {/* Update Status Button */}
          <button
            id="btn-update-status"
            onClick={handleUpdateStatus}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Confirm & Update Status (Generate Notification)</span>
          </button>
        </div>

        {/* Android Toast Simulation */}
        {toastMessage && (
          <div className="fixed bottom-14 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-4 py-2 rounded-full text-xs font-medium shadow-xl backdrop-blur-xs flex items-center space-x-2 z-50 border border-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
};

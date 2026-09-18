import React, { useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import { Logcat } from '../utils/logcatManager';
import { 
  Plus, 
  Search, 
  Building2, 
  Briefcase, 
  User, 
  ChevronRight, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Inbox,
  Filter
} from 'lucide-react';

interface JobDashboardActivityProps {
  applications: JobApplication[];
  onOpenAddFragment: () => void;
  onSelectApplication: (job: JobApplication) => void;
  onDeleteApplication?: (jobId: string) => void;
}

export const JobDashboardActivity: React.FC<JobDashboardActivityProps> = ({
  applications,
  onOpenAddFragment,
  onSelectApplication,
}) => {
  const TAG = 'JobDashboardActivity';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');

  // Activity Lifecycle Callbacks
  useEffect(() => {
    Logcat.logActivityLifecycle(TAG, 'onCreate', 'Initializing Job Dashboard view and RecyclerView adapter');
    Logcat.logActivityLifecycle(TAG, 'onStart', 'Dashboard visible to user');
    Logcat.logActivityLifecycle(TAG, 'onResume', 'Dashboard in foreground and interactive');

    return () => {
      Logcat.logActivityLifecycle(TAG, 'onPause', 'Dashboard losing focus');
      Logcat.logActivityLifecycle(TAG, 'onStop', 'Dashboard obscured');
    };
  }, []);

  const handleCardClick = (job: JobApplication) => {
    // Log intent dispatch
    Logcat.logIntent('android.intent.action.VIEW', 'JobDetailsActivity', {
      EXTRA_JOB_ID: job.id,
      EXTRA_COMPANY_NAME: job.companyName,
      EXTRA_STATUS: job.status,
    });
    onSelectApplication(job);
  };

  const handleFabClick = () => {
    Logcat.d(TAG, 'User tapped Add Application FAB: Launching ApplicationFragment transaction');
    onOpenAddFragment();
  };

  // Filter logic
  const filteredApps = applications.filter((app) => {
    if (selectedStatusFilter !== 'ALL' && app.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.companyName.toLowerCase().includes(q) ||
        app.jobRole.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Summary counts
  const counts = {
    total: applications.length,
    interview: applications.filter((a) => a.status === 'Interview').length,
    selected: applications.filter((a) => a.status === 'Selected').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: <Clock className="w-3 h-3 mr-1" />,
        };
      case 'Interview':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Award className="w-3 h-3 mr-1" />,
        };
      case 'Selected':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-3 h-3 mr-1" />,
        };
    }
  };

  return (
    <div id="job-dashboard-activity-view" className="flex flex-col h-full bg-[#f8fafc] text-slate-900 overflow-y-auto relative">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-xs">
                JT
              </div>
              <h1 className="text-base font-bold text-slate-900">JobTrack</h1>
            </div>
            <p className="text-[11px] text-indigo-600 font-mono">Job Dashboard Activity</p>
          </div>

          <button
            id="btn-app-bar-add"
            onClick={handleFabClick}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Application</span>
          </button>
        </div>

        {/* Quick Search Box */}
        <div className="mt-2.5 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-dashboard-search"
            type="text"
            placeholder="Search company, role, or applicant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 flex-1 pb-24">
        {/* Metric Badges */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2 rounded-xl bg-white border border-slate-200/90 text-center shadow-xs">
            <span className="text-[10px] text-slate-400 font-medium block">Total</span>
            <span className="text-sm font-bold text-slate-800">{counts.total}</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/70 text-center shadow-xs">
            <span className="text-[10px] text-amber-700 font-medium block">Interview</span>
            <span className="text-sm font-bold text-amber-800">{counts.interview}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-center shadow-xs">
            <span className="text-[10px] text-emerald-700 font-medium block">Selected</span>
            <span className="text-sm font-bold text-emerald-800">{counts.selected}</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-200/70 text-center shadow-xs">
            <span className="text-[10px] text-rose-700 font-medium block">Rejected</span>
            <span className="text-sm font-bold text-rose-800">{counts.rejected}</span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-0.5" />
          {(['ALL', 'Applied', 'Interview', 'Selected', 'Rejected'] as const).map((filter) => {
            const isSelected = selectedStatusFilter === filter;
            return (
              <button
                key={filter}
                id={`filter-chip-${filter.toLowerCase()}`}
                onClick={() => setSelectedStatusFilter(filter)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all text-xs font-medium border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter === 'ALL' ? 'All Applications' : filter}
              </button>
            );
          })}
        </div>

        {/* Applications List (RecyclerView Simulation) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Job Applications ({filteredApps.length})
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Tap card for Details</span>
          </div>

          {filteredApps.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No applications found</p>
              <p className="text-xs text-slate-500 mt-1">
                {searchQuery || selectedStatusFilter !== 'ALL'
                  ? 'Try clearing the search or status filter'
                  : 'Tap "+ Add Application" to create your first application entry'}
              </p>
              <button
                onClick={handleFabClick}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold inline-flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Application</span>
              </button>
            </div>
          ) : (
            filteredApps.map((job) => {
              const badge = getStatusBadge(job.status);
              return (
                <div
                  key={job.id}
                  id={`job-card-${job.id}`}
                  onClick={() => handleCardClick(job)}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all active:scale-[0.99] group relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 font-bold flex items-center justify-center border border-slate-200/60 shrink-0 transition-colors">
                        {job.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {job.companyName}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-600 mt-0.5">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          <span className="font-medium">{job.jobRole}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>Applicant: {job.applicantName}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all mt-1" />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {job.employmentType}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.bg}`}>
                        {badge.icon}
                        {job.status}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      Applied: {job.appliedDate}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB): Add Application */}
      <button
        id="fab-add-application"
        onClick={handleFabClick}
        className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs shadow-lg hover:shadow-xl transition-all active:scale-95 group"
        title="Open Application Fragment"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        <span>Add Application</span>
      </button>
    </div>
  );
};

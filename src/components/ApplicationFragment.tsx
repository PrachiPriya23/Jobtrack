import React, { useState, useEffect } from 'react';
import { JobApplication, EmploymentType, ApplicationStatus } from '../types';
import { Logcat } from '../utils/logcatManager';
import { ArrowLeft, Briefcase, User, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApplicationFragmentProps {
  onSave: (application: Omit<JobApplication, 'id' | 'appliedDate'>) => void;
  onClose: () => void;
}

const EMPLOYMENT_TYPES: EmploymentType[] = ['Full Time', 'Part Time', 'Internship'];
const APPLICATION_STATUSES: ApplicationStatus[] = ['Applied', 'Interview', 'Selected', 'Rejected'];

export const ApplicationFragment: React.FC<ApplicationFragmentProps> = ({ onSave, onClose }) => {
  const TAG = 'ApplicationFragment';

  // Form State matching the exact required fields
  const [applicantName, setApplicantName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full Time');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [notes, setNotes] = useState('');

  // Error validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showToast, setShowToast] = useState(false);

  // Implement Fragment Lifecycle Callbacks
  useEffect(() => {
    // 1. onAttach
    Logcat.logFragmentLifecycle(TAG, 'onAttach', 'Fragment attached to JobDashboardActivity host context');
    
    // 2. onCreate
    Logcat.logFragmentLifecycle(TAG, 'onCreate', 'Initializing Fragment logic and state container');

    // 3. onCreateView
    Logcat.logFragmentLifecycle(TAG, 'onCreateView', 'Inflating R.layout.fragment_application view hierarchy');

    // 4. onViewCreated
    Logcat.logFragmentLifecycle(TAG, 'onViewCreated', 'Binding EditTexts, RadioGroups, and Save Button listeners');

    // 5. onStart
    Logcat.logFragmentLifecycle(TAG, 'onStart', 'Fragment visible to user');

    // 6. onResume
    Logcat.logFragmentLifecycle(TAG, 'onResume', 'Fragment is now in active foreground ready for user input');

    return () => {
      // 7. onPause
      Logcat.logFragmentLifecycle(TAG, 'onPause', 'Fragment losing interactive focus');

      // 8. onStop
      Logcat.logFragmentLifecycle(TAG, 'onStop', 'Fragment view hidden');

      // 9. onDestroyView
      Logcat.logFragmentLifecycle(TAG, 'onDestroyView', 'View references cleaned up / Fragment view destroyed');

      // 10. onDestroy
      Logcat.logFragmentLifecycle(TAG, 'onDestroy', 'Fragment instance destroyed');

      // 11. onDetach
      Logcat.logFragmentLifecycle(TAG, 'onDetach', 'Detached from host Activity');
    };
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!applicantName.trim()) newErrors.applicantName = 'Applicant Name is required';
    if (!companyName.trim()) newErrors.companyName = 'Company Name is required';
    if (!jobRole.trim()) newErrors.jobRole = 'Job Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      Logcat.w(TAG, 'Validation failed: Mandatory EditText fields are missing', 'Fragment');
      return;
    }

    Logcat.i(TAG, `Saving application: ${applicantName} -> ${companyName} (${jobRole}) [${employmentType}, ${status}]`, 'Fragment');

    onSave({
      applicantName: applicantName.trim(),
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      employmentType,
      status,
      notes: notes.trim(),
    });

    setShowToast(true);
  };

  return (
    <div id="application-fragment-view" className="flex flex-col h-full bg-[#f8fafc] text-slate-900 overflow-y-auto">
      {/* Fragment Header / Toolbar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            id="btn-fragment-back"
            onClick={onClose}
            className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            title="Back to Dashboard (popBackStack)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Add Application</h1>
            <p className="text-[11px] text-teal-600 font-mono">Application Fragment</p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
          Fragment
        </span>
      </div>

      {/* Main Fragment Form Body */}
      <form onSubmit={handleSave} className="p-4 space-y-5 flex-1 pb-10">
        
        {/* Helper Callout */}
        <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start space-x-2.5 text-xs text-blue-900">
          <Briefcase className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Application Form: </span>
            Fill in the details below. Saving will add this record to your Job Dashboard Activity.
          </div>
        </div>

        {/* EditText 1: Applicant Name */}
        <div className="space-y-1.5">
          <label htmlFor="et-applicant-name" className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Applicant Name</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="et-applicant-name"
              type="text"
              value={applicantName}
              onChange={(e) => {
                setApplicantName(e.target.value);
                if (errors.applicantName) setErrors({ ...errors, applicantName: '' });
              }}
              placeholder="e.g. Alex Rivera"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:outline-none transition-all ${
                errors.applicantName
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
              }`}
            />
          </div>
          {errors.applicantName && (
            <p className="text-[11px] text-rose-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.applicantName}</span>
            </p>
          )}
        </div>

        {/* EditText 2: Company Name */}
        <div className="space-y-1.5">
          <label htmlFor="et-company-name" className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Company Name</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="et-company-name"
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (errors.companyName) setErrors({ ...errors, companyName: '' });
              }}
              placeholder="e.g. Google, Stripe, Microsoft"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:outline-none transition-all ${
                errors.companyName
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
              }`}
            />
          </div>
          {errors.companyName && (
            <p className="text-[11px] text-rose-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.companyName}</span>
            </p>
          )}
        </div>

        {/* EditText 3: Job Role */}
        <div className="space-y-1.5">
          <label htmlFor="et-job-role" className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>Job Role</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="et-job-role"
              type="text"
              value={jobRole}
              onChange={(e) => {
                setJobRole(e.target.value);
                if (errors.jobRole) setErrors({ ...errors, jobRole: '' });
              }}
              placeholder="e.g. Associate Android Engineer"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:outline-none transition-all ${
                errors.jobRole
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
              }`}
            />
          </div>
          {errors.jobRole && (
            <p className="text-[11px] text-rose-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.jobRole}</span>
            </p>
          )}
        </div>

        {/* RadioGroup 1: Employment Type */}
        <div id="rg-employment-type" className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Employment Type</span>
            <span className="text-[10px] text-slate-400 font-mono">RadioGroup</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {EMPLOYMENT_TYPES.map((type) => {
              const isSelected = employmentType === type;
              return (
                <label
                  key={type}
                  htmlFor={`rb-employment-${type.toLowerCase().replace(' ', '-')}`}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-semibold shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <input
                      id={`rb-employment-${type.toLowerCase().replace(' ', '-')}`}
                      type="radio"
                      name="employmentType"
                      value={type}
                      checked={isSelected}
                      onChange={() => setEmploymentType(type)}
                      className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-xs">{type}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* RadioGroup 2: Application Status */}
        <div id="rg-application-status" className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Application Status</span>
            <span className="text-[10px] text-slate-400 font-mono">RadioGroup</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {APPLICATION_STATUSES.map((stat) => {
              const isSelected = status === stat;
              let badgeColor = '';
              if (stat === 'Applied') badgeColor = isSelected ? 'border-sky-500 bg-sky-50 text-sky-700' : '';
              if (stat === 'Interview') badgeColor = isSelected ? 'border-amber-500 bg-amber-50 text-amber-700' : '';
              if (stat === 'Selected') badgeColor = isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : '';
              if (stat === 'Rejected') badgeColor = isSelected ? 'border-rose-500 bg-rose-50 text-rose-700' : '';

              return (
                <label
                  key={stat}
                  htmlFor={`rb-status-${stat.toLowerCase()}`}
                  className={`flex items-center space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? `${badgeColor} font-semibold shadow-xs`
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-600'
                  }`}
                >
                  <input
                    id={`rb-status-${stat.toLowerCase()}`}
                    type="radio"
                    name="applicationStatus"
                    value={stat}
                    checked={isSelected}
                    onChange={() => setStatus(stat)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs">{stat}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Optional Notes */}
        <div className="space-y-1">
          <label htmlFor="et-notes" className="text-xs font-medium text-slate-600">
            Interview Notes / Referral (Optional)
          </label>
          <textarea
            id="et-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Referred by college alumnus, applied via portal"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 shadow-xs focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Save Application - Button */}
        <div className="pt-2">
          <button
            id="btn-save-application"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Application</span>
          </button>
        </div>

        {/* Android Toast Simulation */}
        {showToast && (
          <div className="fixed bottom-14 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-medium shadow-xl backdrop-blur-xs flex items-center space-x-2 z-50">
            <span>Application Saved to Dashboard</span>
          </div>
        )}
      </form>
    </div>
  );
};

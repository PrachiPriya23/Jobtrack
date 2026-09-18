import React, { useState } from 'react';
import { Copy, Check, Code2, FileCode, Layers } from 'lucide-react';

interface CodeFile {
  name: string;
  type: 'kotlin' | 'xml';
  description: string;
  code: string;
}

const KOTLIN_AND_XML_FILES: CodeFile[] = [
  {
    name: 'JobDashboardActivity.kt',
    type: 'kotlin',
    description: 'Main Activity displaying job list, FAB to open ApplicationFragment, and Intent dispatch to JobDetailsActivity',
    code: `package com.example.jobtrack

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.jobtrack.databinding.ActivityJobDashboardBinding

class JobDashboardActivity : AppCompatActivity() {

    private val TAG = "JobDashboardActivity"
    private lateinit var binding: ActivityJobDashboardBinding
    private lateinit var adapter: JobApplicationAdapter
    private val jobList = mutableListOf<JobApplication>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "onCreate() called: Initializing Job Dashboard Activity")
        binding = ActivityJobDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()

        // Add Application option that opens ApplicationFragment
        binding.fabAddApplication.setOnClickListener {
            Log.d(TAG, "User clicked Add Application: Opening ApplicationFragment")
            openApplicationFragment()
        }
    }

    private fun setupRecyclerView() {
        adapter = JobApplicationAdapter(jobList) { selectedJob ->
            Log.d(TAG, "Job application selected: \${selectedJob.companyName}")
            // Open JobDetailsActivity using Intent
            val intent = Intent(this, JobDetailsActivity::class.java).apply {
                putExtra("EXTRA_JOB_ID", selectedJob.id)
                putExtra("EXTRA_APPLICANT_NAME", selectedJob.applicantName)
                putExtra("EXTRA_COMPANY_NAME", selectedJob.companyName)
                putExtra("EXTRA_JOB_ROLE", selectedJob.jobRole)
                putExtra("EXTRA_EMPLOYMENT_TYPE", selectedJob.employmentType)
                putExtra("EXTRA_STATUS", selectedJob.status)
            }
            startActivity(intent)
        }
        binding.recyclerViewJobs.layoutManager = LinearLayoutManager(this)
        binding.recyclerViewJobs.adapter = adapter
    }

    private fun openApplicationFragment() {
        val fragment = ApplicationFragment.newInstance()
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .addToBackStack("ApplicationFragment")
            .commit()
    }

    fun onApplicationSaved(newJob: JobApplication) {
        jobList.add(0, newJob)
        adapter.notifyItemInserted(0)
        binding.recyclerViewJobs.scrollToPosition(0)
        Log.i(TAG, "New application added to dashboard: \${newJob.companyName} (\${newJob.jobRole})")
    }

    override fun onStart() {
        super.onStart()
        Log.d(TAG, "onStart() called")
    }

    override fun onResume() {
        super.onResume()
        Log.d(TAG, "onResume() called - Activity is now in foreground and interactive")
    }

    override fun onPause() {
        super.onPause()
        Log.d(TAG, "onPause() called - Activity is losing focus")
    }

    override fun onStop() {
        super.onStop()
        Log.d(TAG, "onStop() called - Activity is no longer visible")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "onDestroy() called - Activity is finishing or being destroyed by system")
    }
}`
  },
  {
    name: 'ApplicationFragment.kt',
    type: 'kotlin',
    description: 'Fragment with EditTexts, RadioGroups for Employment Type & Status, and Save button',
    code: `package com.example.jobtrack

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RadioButton
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.jobtrack.databinding.FragmentApplicationBinding
import java.util.UUID

class ApplicationFragment : Fragment() {

    private val TAG = "ApplicationFragment"
    private var _binding: FragmentApplicationBinding? = null
    private val binding get() = _binding!!

    companion object {
        fun newInstance(): ApplicationFragment = ApplicationFragment()
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        Log.d(TAG, "onAttach() called: Fragment attached to Activity host")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "onCreate() called: Initializing Fragment logic")
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        Log.d(TAG, "onCreateView() called: Inflating fragment_application layout")
        _binding = FragmentApplicationBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        Log.d(TAG, "onViewCreated() called: Setting up input fields and listeners")

        binding.btnSaveApplication.setOnClickListener {
            saveApplication()
        }
    }

    private fun saveApplication() {
        val applicantName = binding.etApplicantName.text.toString().trim()
        val companyName = binding.etCompanyName.text.toString().trim()
        val jobRole = binding.etJobRole.text.toString().trim()

        if (applicantName.isEmpty() || companyName.isEmpty() || jobRole.isEmpty()) {
            Toast.makeText(requireContext(), "Please fill in all required fields", Toast.LENGTH_SHORT).show()
            return
        }

        // Employment Type using RadioGroup
        val selectedEmploymentId = binding.rgEmploymentType.checkedRadioButtonId
        val employmentType = view?.findViewById<RadioButton>(selectedEmploymentId)?.text.toString()

        // Application Status using RadioGroup
        val selectedStatusId = binding.rgApplicationStatus.checkedRadioButtonId
        val status = view?.findViewById<RadioButton>(selectedStatusId)?.text.toString()

        val newJob = JobApplication(
            id = UUID.randomUUID().toString(),
            applicantName = applicantName,
            companyName = companyName,
            jobRole = jobRole,
            employmentType = employmentType,
            status = status,
            appliedDate = "2026-03-18"
        )

        Log.i(TAG, "Saving Job Application: \$newJob")
        (activity as? JobDashboardActivity)?.onApplicationSaved(newJob)

        Toast.makeText(requireContext(), "Application Saved to Dashboard!", Toast.LENGTH_SHORT).show()

        // Pop fragment backstack
        parentFragmentManager.popBackStack()
    }

    override fun onStart() {
        super.onStart()
        Log.d(TAG, "onStart() called")
    }

    override fun onResume() {
        super.onResume()
        Log.d(TAG, "onResume() called")
    }

    override fun onPause() {
        super.onPause()
        Log.d(TAG, "onPause() called")
    }

    override fun onStop() {
        super.onStop()
        Log.d(TAG, "onStop() called")
    }

    override fun onDestroyView() {
        super.onDestroyView()
        Log.d(TAG, "onDestroyView() called: View binding released")
        _binding = null
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "onDestroy() called")
    }

    override fun onDetach() {
        super.onDetach()
        Log.d(TAG, "onDetach() called: Detached from Activity")
    }
}`
  },
  {
    name: 'JobDetailsActivity.kt',
    type: 'kotlin',
    description: 'Activity receiving Intent with application info, status update option, and notification dispatch',
    code: `package com.example.jobtrack

import android.os.Bundle
import android.util.Log
import android.widget.RadioButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.jobtrack.databinding.ActivityJobDetailsBinding

class JobDetailsActivity : AppCompatActivity() {

    private val TAG = "JobDetailsActivity"
    private lateinit var binding: ActivityJobDetailsBinding
    private lateinit var notificationHelper: NotificationHelper

    private var jobId: String? = null
    private var applicantName: String = ""
    private var companyName: String = ""
    private var jobRole: String = ""
    private var employmentType: String = ""
    private var currentStatus: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "onCreate() called: Receiving Intent and extras")
        binding = ActivityJobDetailsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        notificationHelper = NotificationHelper(this)

        // Retrieve extras from Intent
        jobId = intent.getStringExtra("EXTRA_JOB_ID")
        applicantName = intent.getStringExtra("EXTRA_APPLICANT_NAME") ?: "N/A"
        companyName = intent.getStringExtra("EXTRA_COMPANY_NAME") ?: "N/A"
        jobRole = intent.getStringExtra("EXTRA_JOB_ROLE") ?: "N/A"
        employmentType = intent.getStringExtra("EXTRA_EMPLOYMENT_TYPE") ?: "Full Time"
        currentStatus = intent.getStringExtra("EXTRA_STATUS") ?: "Applied"

        displayApplicationInfo()

        binding.btnUpdateStatus.setOnClickListener {
            updateApplicationStatus()
        }

        binding.btnBack.setOnClickListener {
            finish()
        }
    }

    private fun displayApplicationInfo() {
        binding.tvApplicantNameValue.text = applicantName
        binding.tvCompanyNameValue.text = companyName
        binding.tvJobRoleValue.text = jobRole
        binding.tvEmploymentTypeValue.text = employmentType
        binding.tvCurrentStatusValue.text = currentStatus

        // Pre-select status in RadioGroup
        when (currentStatus) {
            "Applied" -> binding.rbApplied.isChecked = true
            "Interview" -> binding.rbInterview.isChecked = true
            "Selected" -> binding.rbSelected.isChecked = true
            "Rejected" -> binding.rbRejected.isChecked = true
        }
    }

    private fun updateApplicationStatus() {
        val selectedId = binding.rgUpdateStatus.checkedRadioButtonId
        val updatedStatus = findViewById<RadioButton>(selectedId)?.text.toString()

        if (updatedStatus == currentStatus) {
            Toast.makeText(this, "Status is already \$currentStatus", Toast.LENGTH_SHORT).show()
            return
        }

        currentStatus = updatedStatus
        binding.tvCurrentStatusValue.text = currentStatus
        Log.i(TAG, "Status updated to: \$currentStatus for \$companyName")

        // Generate Notification whenever application status is updated
        notificationHelper.sendNotification(
            title = "Application Status Updated: \$companyName",
            message = "Application for \$applicantName (\$jobRole) is now: \$currentStatus"
        )

        Toast.makeText(this, "Status updated & Notification sent!", Toast.LENGTH_SHORT).show()
    }

    override fun onStart() {
        super.onStart()
        Log.d(TAG, "onStart() called")
    }

    override fun onResume() {
        super.onResume()
        Log.d(TAG, "onResume() called")
    }

    override fun onPause() {
        super.onPause()
        Log.d(TAG, "onPause() called")
    }

    override fun onStop() {
        super.onStop()
        Log.d(TAG, "onStop() called")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "onDestroy() called")
    }
}`
  },
  {
    name: 'NotificationHelper.kt',
    type: 'kotlin',
    description: 'NotificationManager channel and builder for application status alerts',
    code: `package com.example.jobtrack

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat

class NotificationHelper(private val context: Context) {

    private val TAG = "NotificationManager"
    private val CHANNEL_ID = "jobtrack_status_channel"
    private val CHANNEL_NAME = "Job Application Updates"
    private val NOTIFICATION_ID = 1001

    private val notificationManager: NotificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    init {
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifies when a job application status is updated"
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
            Log.d(TAG, "Notification channel created: \$CHANNEL_ID")
        }
    }

    fun sendNotification(title: String, message: String) {
        val intent = Intent(context, JobDashboardActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        notificationManager.notify(NOTIFICATION_ID, notification)
        Log.i(TAG, "Dispatched Notification [ID: \$NOTIFICATION_ID]: \$title | \$message")
    }
}`
  },
  {
    name: 'fragment_application.xml',
    type: 'xml',
    description: 'XML layout for Application Fragment with EditTexts and RadioGroups',
    code: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp"
    android:background="#FAFAFA">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Add Job Application"
            android:textSize="22sp"
            android:textStyle="bold"
            android:textColor="#1E293B"
            android:layout_marginBottom="16dp" />

        <!-- Applicant Name - EditText -->
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Applicant Name"
            android:layout_marginBottom="12dp">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etApplicantName"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textPersonName" />
        </com.google.android.material.textfield.TextInputLayout>

        <!-- Company Name - EditText -->
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Company Name"
            android:layout_marginBottom="12dp">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etCompanyName"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="text" />
        </com.google.android.material.textfield.TextInputLayout>

        <!-- Job Role - EditText -->
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Job Role"
            android:layout_marginBottom="16dp">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etJobRole"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="text" />
        </com.google.android.material.textfield.TextInputLayout>

        <!-- Employment Type using RadioGroup -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Employment Type"
            android:textStyle="bold"
            android:textColor="#334155"
            android:layout_marginBottom="6dp" />

        <RadioGroup
            android:id="@+id/rgEmploymentType"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_marginBottom="16dp">

            <RadioButton
                android:id="@+id/rbFullTime"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Full Time"
                android:checked="true"
                android:layout_marginEnd="12dp" />

            <RadioButton
                android:id="@+id/rbPartTime"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Part Time"
                android:layout_marginEnd="12dp" />

            <RadioButton
                android:id="@+id/rbInternship"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Internship" />
        </RadioGroup>

        <!-- Application Status using RadioGroup -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Application Status"
            android:textStyle="bold"
            android:textColor="#334155"
            android:layout_marginBottom="6dp" />

        <RadioGroup
            android:id="@+id/rgApplicationStatus"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:layout_marginBottom="24dp">

            <RadioButton
                android:id="@+id/rbApplied"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Applied"
                android:checked="true" />

            <RadioButton
                android:id="@+id/rbInterview"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Interview" />

            <RadioButton
                android:id="@+id/rbSelected"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Selected" />

            <RadioButton
                android:id="@+id/rbRejected"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Rejected" />
        </RadioGroup>

        <!-- Save Application - Button -->
        <Button
            android:id="@+id/btnSaveApplication"
            android:layout_width="match_parent"
            android:layout_height="56dp"
            android:text="Save Application"
            android:textSize="16sp"
            android:backgroundTint="#2563EB"
            android:textColor="#FFFFFF" />

    </LinearLayout>
</ScrollView>`
  },
  {
    name: 'AndroidManifest.xml',
    type: 'xml',
    description: 'Application manifest registering JobDashboardActivity and JobDetailsActivity',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.jobtrack">

    <!-- Permission to post notifications (Android 13+) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="JobTrack"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.JobTrack">

        <!-- Job Dashboard Activity: Launcher Activity -->
        <activity
            android:name=".JobDashboardActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Job Details Activity: Opened via Intent -->
        <activity
            android:name=".JobDetailsActivity"
            android:exported="false"
            android:parentActivityName=".JobDashboardActivity" />

    </application>

</manifest>`
  }
];

export const AndroidCodeViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile = KOTLIN_AND_XML_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="android-code-viewer" className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm text-slate-200">Android Project Source Code</span>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono">
            Kotlin & XML
          </span>
        </div>
        <button
          id="btn-copy-source-code"
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-300" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* File Tabs */}
      <div className="flex overflow-x-auto bg-slate-950 border-b border-slate-800 px-2 py-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {KOTLIN_AND_XML_FILES.map((file, idx) => {
          const isActive = idx === selectedFileIndex;
          return (
            <button
              key={file.name}
              id={`tab-file-${idx}`}
              onClick={() => setSelectedFileIndex(idx)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-all mr-1 ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {file.type === 'kotlin' ? (
                <Code2 className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              ) : (
                <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              )}
              <span>{file.name}</span>
            </button>
          );
        })}
      </div>

      {/* File metadata description */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span>{currentFile.description}</span>
        <span className="text-slate-500 font-mono text-[11px]">{currentFile.code.split('\n').length} lines</span>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-[#0d1117] text-slate-200 selection:bg-emerald-900/60">
        <pre className="overflow-x-auto">
          <code>
            {currentFile.code.split('\n').map((line, lineIdx) => (
              <div key={lineIdx} className="table-row hover:bg-slate-800/30">
                <span className="table-cell pr-4 text-right select-none text-slate-600 text-[11px] w-8">
                  {lineIdx + 1}
                </span>
                <span className="table-cell whitespace-pre">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

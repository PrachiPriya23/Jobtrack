export type EmploymentType = 'Full Time' | 'Part Time' | 'Internship';

export type ApplicationStatus = 'Applied' | 'Interview' | 'Selected' | 'Rejected';

export interface JobApplication {
  id: string;
  applicantName: string;
  companyName: string;
  jobRole: string;
  employmentType: EmploymentType;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdatedDate?: string;
  notes?: string;
}

export type LogLevel = 'V' | 'D' | 'I' | 'W' | 'E';

export interface LogcatEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  tag: string;
  message: string;
  componentType: 'Activity' | 'Fragment' | 'System' | 'Notification' | 'Intent';
}

export interface AndroidNotification {
  id: string;
  notificationId: number;
  title: string;
  message: string;
  subText: string;
  timestamp: string;
  jobId: string;
  status: ApplicationStatus;
  companyName: string;
  read: boolean;
}

export type AndroidScreen = 
  | { type: 'DASHBOARD' }
  | { type: 'ADD_FRAGMENT' }
  | { type: 'DETAILS'; jobId: string };

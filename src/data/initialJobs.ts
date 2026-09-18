import { JobApplication } from '../types';

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: 'job-101',
    applicantName: 'Alex Rivera',
    companyName: 'Google',
    jobRole: 'Associate Android Engineer',
    employmentType: 'Full Time',
    status: 'Interview',
    appliedDate: '2026-03-02',
    lastUpdatedDate: '2026-03-14',
    notes: 'Completed technical screening. Next is system design round.'
  },
  {
    id: 'job-102',
    applicantName: 'Alex Rivera',
    companyName: 'Microsoft',
    jobRole: 'Mobile Software Engineer Intern',
    employmentType: 'Internship',
    status: 'Selected',
    appliedDate: '2026-02-18',
    lastUpdatedDate: '2026-03-10',
    notes: 'Offer letter received! Start date in June.'
  },
  {
    id: 'job-103',
    applicantName: 'Alex Rivera',
    companyName: 'Spotify',
    jobRole: 'Client Platform Developer',
    employmentType: 'Part Time',
    status: 'Applied',
    appliedDate: '2026-03-12',
    lastUpdatedDate: '2026-03-12',
    notes: 'Submitted resume and portfolio through university portal.'
  },
  {
    id: 'job-104',
    applicantName: 'Alex Rivera',
    companyName: 'Stripe',
    jobRole: 'Frontend & Mobile Engineer',
    employmentType: 'Full Time',
    status: 'Rejected',
    appliedDate: '2026-01-20',
    lastUpdatedDate: '2026-02-15',
    notes: 'Position filled internally. Invited to reapply in 6 months.'
  }
];

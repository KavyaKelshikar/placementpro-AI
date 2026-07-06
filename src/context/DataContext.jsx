import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Bell, X } from 'lucide-react';

const DataContext = createContext(null);

const defaultJobs = [
  { id: 'job-1', title: 'Senior Frontend Engineer', company: 'Google', recruiter: 'Priya Patel', salary: '₹2,800,000 - ₹3,600,000', location: 'Bengaluru (Hybrid)', status: 'active', applicants: 45, postedDate: '2026-06-20', skills: ['React', 'Tailwind CSS', 'JavaScript', 'TypeScript'] },
  { id: 'job-2', title: 'Product Designer (L5)', company: 'Meta', recruiter: 'Rohan Mehta', salary: '₹3,200,000 - ₹4,000,000', location: 'Remote (India)', status: 'active', applicants: 28, postedDate: '2026-06-25', skills: ['Figma', 'UI/UX', 'Product Thinking', 'Prototyping'] },
  { id: 'job-3', title: 'AI Research Intern', company: 'Google', recruiter: 'Priya Patel', salary: '₹1,500,000 - ₹2,000,000', location: 'Bengaluru (Onsite)', status: 'active', applicants: 124, postedDate: '2026-07-01', skills: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning'] },
  { id: 'job-4', title: 'Software Engineer', company: 'Meta', recruiter: 'Rohan Mehta', salary: '₹2,000,000 - ₹2,800,000', location: 'Hyderabad (Hybrid)', status: 'active', applicants: 15, postedDate: '2026-07-03', skills: ['React', 'Node.js', 'Express', 'MongoDB'] },
];

const defaultNotifications = [
  { id: 'notif-1', email: 'aarav@placementpro.ai', title: 'Welcome to PlacementPro AI', detail: 'Upload your resume to unlock custom job matching and skills metrics.', read: false, date: '1 day ago' },
  { id: 'notif-2', email: 'recruiter@google.com', title: 'New shortlist capability', detail: 'You can now view matching skills score directly on applicant rows.', read: false, date: '2 days ago' },
];

export function DataProvider({ children }) {
  const { user } = useAuth();

  // Jobs state
  const [jobs, setJobs] = useState(() => {
    const data = localStorage.getItem('pp_jobs');
    return data ? JSON.parse(data) : defaultJobs;
  });

  // Applications state
  const [applications, setApplications] = useState(() => {
    const data = localStorage.getItem('pp_applications');
    return data ? JSON.parse(data) : [];
  });

  // Saved Jobs (bookmarks)
  const [savedJobs, setSavedJobs] = useState(() => {
    const data = localStorage.getItem('pp_saved_jobs');
    return data ? JSON.parse(data) : [];
  });

  // Interviews
  const [interviews, setInterviews] = useState(() => {
    const data = localStorage.getItem('pp_interviews');
    return data ? JSON.parse(data) : [];
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    const data = localStorage.getItem('pp_notifications');
    return data ? JSON.parse(data) : defaultNotifications;
  });

  // Student Profiles & Resumes (keyed by student email)
  const [profiles, setProfiles] = useState(() => {
    const data = localStorage.getItem('pp_profiles');
    return data ? JSON.parse(data) : {};
  });

  // Toasts notifications queue state
  const [toasts, setToasts] = useState([]);


  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('pp_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('pp_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('pp_saved_jobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem('pp_interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem('pp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pp_profiles', JSON.stringify(profiles));
  }, [profiles]);

  // Actions
  const addJob = (jobData) => {
    const newJob = {
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicants: 0,
      status: 'active',
      ...jobData,
    };
    setJobs((prev) => [newJob, ...prev]);
    // Notify recruiters
    addNotification('recruiter', 'New Job Posted', `You successfully posted the job: ${jobData.title} at ${jobData.company}.`);
  };

  const applyToJob = (jobId) => {
    if (!user) return;
    // Check if already applied
    if (applications.some((app) => app.jobId === jobId && app.studentEmail === user.email)) {
      return;
    }

    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const studentProfile = profiles[user.email] || {};
    const resumeInfo = studentProfile.resume || {};

    const newApp = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: job.title,
      company: job.company,
      studentName: user.name,
      studentEmail: user.email,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      resumeScore: resumeInfo.score || null,
      skillsMatched: (resumeInfo.skills || []).filter((s) => (job.skills || []).includes(s)),
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update job applicants count
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j))
    );

    // Notifications
    addNotification(user.email, 'Application Submitted', `Your application for ${job.title} at ${job.company} has been sent.`);
    addNotification('recruiter', 'New Applicant', `${user.name} applied for ${job.title} at ${job.company}.`);
  };

  const saveJob = (jobId) => {
    if (!user) return;
    if (savedJobs.some((s) => s.jobId === jobId && s.studentEmail === user.email)) {
      // Unsave if already saved
      setSavedJobs((prev) => prev.filter((s) => !(s.jobId === jobId && s.studentEmail === user.email)));
    } else {
      setSavedJobs((prev) => [...prev, { jobId, studentEmail: user.email }]);
    }
  };

  const updateApplicationStatus = (appId, nextStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: nextStatus } : app))
    );

    const app = applications.find((a) => a.id === appId);
    if (app) {
      addNotification(app.studentEmail, 'Application Status Update', `Your application for ${app.jobTitle} is now marked as "${nextStatus}".`);
    }
  };

  const scheduleInterview = (appId, dateTime, type) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    const newInterview = {
      id: `int-${Date.now()}`,
      applicationId: appId,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      company: app.company,
      studentName: app.studentName,
      studentEmail: app.studentEmail,
      dateTime,
      type,
      status: 'Scheduled',
    };

    setInterviews((prev) => [newInterview, ...prev]);
    updateApplicationStatus(appId, 'Interview Scheduled');

    addNotification(app.studentEmail, 'Interview Scheduled', `You have a new ${type} interview for ${app.jobTitle} at ${app.company} on ${dateTime}.`);
    addNotification('recruiter', 'Interview Scheduled', `Interview scheduled with ${app.studentName} for ${app.jobTitle} on ${dateTime}.`);
  };

  const uploadResumeInfo = (resumeDetails) => {
    if (!user) return;
    const email = user.email;
    setProfiles((prev) => {
      const current = prev[email] || {};
      const updated = {
        ...current,
        resume: {
          uploaded: true,
          fileName: resumeDetails.fileName,
          score: resumeDetails.score,
          skills: resumeDetails.skills,
          insights: resumeDetails.insights,
          date: new Date().toLocaleDateString(),
        },
        skills: Array.from(new Set([...(current.skills || []), ...resumeDetails.skills])),
      };
      return { ...prev, [email]: updated };
    });

    addNotification(user.email, 'Resume Processed', `Your resume "${resumeDetails.fileName}" was analyzed successfully. AI score: ${resumeDetails.score}/100.`);
  };

  const updateStudentProfile = (profileDetails) => {
    if (!user) return;
    const email = user.email;
    setProfiles((prev) => {
      const current = prev[email] || {};
      return {
        ...prev,
        [email]: {
          ...current,
          college: profileDetails.college,
          degree: profileDetails.degree,
          gradYear: profileDetails.gradYear,
          cgpa: profileDetails.cgpa,
          skills: profileDetails.skills,
        },
      };
    });

    addNotification(user.email, 'Profile Updated', 'Your student profile information has been successfully updated.');
  };

  const addNotification = (target, title, detail) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      email: target, // Can be user's email, or role like 'recruiter', 'admin'
      title,
      detail,
      read: false,
      date: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Push to active toasts if target is current user or active role
    if (user && (target === user.email || target === user.role)) {
      const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      setToasts((prev) => [...prev, { id: toastId, title, detail }]);
      
      // Auto-dismiss after 4.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      }, 4500);
    }
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    if (!user) return;
    setNotifications((prev) => prev.filter((n) => n.email !== user.email && n.email !== user.role));
  };

  const getStudentProfile = () => {
    if (!user) return {};
    return profiles[user.email] || {
      college: 'IIT Bombay',
      degree: 'B.Tech CSE',
      gradYear: '2027',
      cgpa: '9.1',
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
    };
  };

  return (
    <DataContext.Provider
      value={{
        jobs,
        applications,
        savedJobs,
        interviews,
        notifications,
        profiles,
        addJob,
        applyToJob,
        saveJob,
        updateApplicationStatus,
        scheduleInterview,
        uploadResumeInfo,
        updateStudentProfile,
        addNotification,
        markNotificationRead,
        clearNotifications,
        getStudentProfile,
      }}
    >
      {children}

      {/* Floating Toast Notification Overlays */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none sm:top-20">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md animate-slide-in-right transition duration-300"
          >
            <div className="rounded-xl bg-brand-50 p-2 text-brand-600 border border-brand-100/50 shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 leading-snug">{toast.title}</p>
              <p className="mt-0.5 text-xs text-slate-500 leading-normal font-sans">{toast.detail}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

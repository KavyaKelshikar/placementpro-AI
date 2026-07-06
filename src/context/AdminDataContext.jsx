import { createContext, useContext, useState, useEffect } from 'react';

const AdminDataContext = createContext(null);

const initialUsers = [
  { id: 'usr-1', name: 'Aarav Sharma', email: 'aarav@placementpro.ai', role: 'student', status: 'active', joinedDate: '2026-05-12', details: { college: 'IIT Bombay', degree: 'B.Tech CSE', gradYear: '2027', resume: 'aarav_sharma_resume.pdf' } },
  { id: 'usr-2', name: 'Nisha Rao', email: 'nisha@placementpro.ai', role: 'student', status: 'active', joinedDate: '2026-06-01', details: { college: 'BITS Pilani', degree: 'M.S. Design', gradYear: '2026', resume: 'nisha_rao_portfolio.pdf' } },
  { id: 'usr-3', name: 'Vikram Singh', email: 'vikram@placementpro.ai', role: 'student', status: 'active', joinedDate: '2026-06-15', details: { college: 'DTU', degree: 'B.Tech IT', gradYear: '2027', resume: 'vikram_singh_se.pdf' } },
  { id: 'usr-4', name: 'Priya Patel', email: 'priya.p@google.com', role: 'recruiter', status: 'active', joinedDate: '2026-02-20', details: { company: 'Google', title: 'Senior Talent Lead' } },
  { id: 'usr-5', name: 'Rohan Mehta', email: 'rohan.m@meta.com', role: 'recruiter', status: 'active', joinedDate: '2026-03-10', details: { company: 'Meta', title: 'Technical Recruiter' } },
  { id: 'usr-6', name: 'Sarah Connor', email: 'sarah@cyberdyne.com', role: 'recruiter', status: 'suspended', joinedDate: '2026-04-01', details: { company: 'Cyberdyne Systems', title: 'HR Manager' } },
  { id: 'usr-7', name: 'Kavya Dev', email: 'kavya@placementpro.ai', role: 'admin', status: 'active', joinedDate: '2026-01-01', details: { accessLevel: 'Superadmin' } },
];

const initialCompanies = [
  { id: 'comp-1', name: 'Google', industry: 'Technology', size: '10,000+', website: 'https://google.com', status: 'approved', activeJobs: 8, joinedDate: '2026-02-20', description: 'Google LLC is an American multinational technology company focusing on artificial intelligence, search engine technology, online advertising, cloud computing, computer software, and quantum computing.' },
  { id: 'comp-2', name: 'Meta', industry: 'Technology', size: '5,000-10,000', website: 'https://meta.com', status: 'approved', activeJobs: 5, joinedDate: '2026-03-10', description: 'Meta Platforms, Inc., doing business as Meta, is an American multinational technology conglomerate based in Menlo Park, California.' },
  { id: 'comp-3', name: 'Acme Corp', industry: 'Manufacturing', size: '500-1,000', website: 'https://acme.com', status: 'pending', activeJobs: 0, joinedDate: '2026-07-02', description: 'A global leader in high-end manufacturing of whimsical contraptions for catching roadrunners.' },
  { id: 'comp-4', name: 'Cyberdyne Systems', industry: 'Robotics', size: '1,000-5,000', website: 'https://cyberdyne.com', status: 'rejected', activeJobs: 0, joinedDate: '2026-04-01', description: 'Pioneers in artificial intelligence systems and autonomous military robotics. Temporarily suspended for compliance review.' },
  { id: 'comp-5', name: 'Stark Industries', industry: 'Defense & Aerospace', size: '5,000-10,000', website: 'https://stark.com', status: 'pending', activeJobs: 2, joinedDate: '2026-07-04', description: 'A multi-national conglomerate specializing in clean energy, defense systems, and advanced robotics.' },
];

const initialJobs = [
  { id: 'job-1', title: 'Senior Frontend Engineer', company: 'Google', recruiter: 'Priya Patel', salary: '₹2,800,000 - ₹3,600,000', location: 'Bengaluru (Hybrid)', status: 'active', applicants: 45, postedDate: '2026-06-20' },
  { id: 'job-2', title: 'Product Designer (L5)', company: 'Meta', recruiter: 'Rohan Mehta', salary: '₹3,200,000 - ₹4,000,000', location: 'Remote (India)', status: 'active', applicants: 28, postedDate: '2026-06-25' },
  { id: 'job-3', title: 'AI Research Intern', company: 'Google', recruiter: 'Priya Patel', salary: '₹1,500,000 - ₹2,000,000', location: 'Bengaluru (Onsite)', status: 'active', applicants: 124, postedDate: '2026-07-01' },
  { id: 'job-4', title: 'System Architect', company: 'Cyberdyne Systems', recruiter: 'Sarah Connor', salary: '₹4,500,000 - ₹6,000,000', location: 'Delhi NCR', status: 'flagged', applicants: 12, postedDate: '2026-04-12' },
  { id: 'job-5', title: 'Fullstack Dev (React/Node)', company: 'Meta', recruiter: 'Rohan Mehta', salary: '₹1,800,000 - ₹2,500,000', location: 'Hyderabad (Hybrid)', status: 'closed', applicants: 89, postedDate: '2026-05-10' },
];

const initialReports = [
  { id: 'rep-1', reporter: 'Aarav Sharma', type: 'job', targetId: 'job-4', targetName: 'System Architect (Cyberdyne)', description: 'Recruiter account seems suspended, and the job description makes reference to illegal autonomous drone payloads.', severity: 'high', status: 'pending', date: '2026-07-04' },
  { id: 'rep-2', reporter: 'Nisha Rao', type: 'company', targetId: 'comp-4', targetName: 'Cyberdyne Systems', description: 'Suspected malware link on the submitted corporate landing page.', severity: 'medium', status: 'pending', date: '2026-07-05' },
  { id: 'rep-3', reporter: 'System Guard', type: 'user', targetId: 'usr-6', targetName: 'Sarah Connor', description: 'Failed automated background check on government sanctions database.', severity: 'high', status: 'resolved', date: '2026-06-28', resolutionDetails: 'Account suspended on June 28, pending security review.' },
];

const initialActivities = [
  { id: 'act-1', type: 'user', message: 'New student registration: Vikram Singh (DTU)', time: '12 mins ago' },
  { id: 'act-2', type: 'company', message: 'Stark Industries submitted partnership request', time: '1 hour ago' },
  { id: 'act-3', type: 'report', message: 'Aarav Sharma reported Cyberdyne Systems job posting', time: '3 hours ago' },
  { id: 'act-4', type: 'job', message: 'Google posted new vacancy: AI Research Intern', time: '1 day ago' },
  { id: 'act-5', type: 'system', message: 'Database backup succeeded in 1.45 seconds', time: '1 day ago' },
];

export function AdminDataProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const data = localStorage.getItem('admin_users');
    return data ? JSON.parse(data) : initialUsers;
  });

  const [companies, setCompanies] = useState(() => {
    const data = localStorage.getItem('admin_companies');
    return data ? JSON.parse(data) : initialCompanies;
  });

  const [jobs, setJobs] = useState(() => {
    const data = localStorage.getItem('admin_jobs');
    return data ? JSON.parse(data) : initialJobs;
  });

  const [reports, setReports] = useState(() => {
    const data = localStorage.getItem('admin_reports');
    return data ? JSON.parse(data) : initialReports;
  });

  const [activities, setActivities] = useState(() => {
    const data = localStorage.getItem('admin_activities');
    return data ? JSON.parse(data) : initialActivities;
  });

  const [systemHealth, setSystemHealth] = useState({
    cpu: 28,
    memory: '4.8GB / 8.0GB',
    dbStatus: 'healthy',
    apiLatency: 42,
    activeSockets: 844,
  });

  // Save state to localStorage whenever changes occur
  useEffect(() => {
    localStorage.setItem('admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('admin_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('admin_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('admin_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('admin_activities', JSON.stringify(activities));
  }, [activities]);

  // Simulate subtle CPU and WebSocket fluctuations for System Health
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemHealth((prev) => {
        const cpuChange = Math.floor(Math.random() * 9) - 4; // -4% to +4%
        const socketChange = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const latencyChange = Math.floor(Math.random() * 7) - 3; // -3ms to +3ms
        
        const nextCpu = Math.min(Math.max(prev.cpu + cpuChange, 12), 85);
        const nextSockets = Math.max(prev.activeSockets + socketChange, 100);
        const nextLatency = Math.min(Math.max(prev.apiLatency + latencyChange, 15), 180);

        return {
          ...prev,
          cpu: nextCpu,
          activeSockets: nextSockets,
          apiLatency: nextLatency,
          dbStatus: nextCpu > 80 ? 'degraded' : nextCpu > 65 ? 'warning' : 'healthy',
        };
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const addActivityLog = (type, message) => {
    const newAct = {
      id: `act-${Date.now()}`,
      type,
      message,
      time: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]); // Keep last 20 activities
  };

  // User Actions
  const addUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      ...userData,
    };
    setUsers((prev) => [newUser, ...prev]);
    addActivityLog('user', `Created user: ${newUser.name} (${newUser.role})`);
  };

  const updateUserStatus = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    const userObj = users.find((u) => u.id === id);
    if (userObj) {
      addActivityLog('user', `User status updated: ${userObj.name} is now ${newStatus}`);
    }
  };

  const updateUserRole = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    const userObj = users.find((u) => u.id === id);
    if (userObj) {
      addActivityLog('user', `User role updated: ${userObj.name} promoted to ${newRole}`);
    }
  };

  const deleteUser = (id) => {
    const userObj = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (userObj) {
      addActivityLog('user', `Deleted user account: ${userObj.name}`);
    }
  };

  // Company Actions
  const approveCompany = (id) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved' } : c))
    );
    const compObj = companies.find((c) => c.id === id);
    if (compObj) {
      addActivityLog('company', `Verified corporate partner: ${compObj.name}`);
    }
  };

  const rejectCompany = (id) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c))
    );
    const compObj = companies.find((c) => c.id === id);
    if (compObj) {
      addActivityLog('company', `Rejected/Suspended company request: ${compObj.name}`);
    }
  };

  const deleteCompany = (id) => {
    const compObj = companies.find((c) => c.id === id);
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    if (compObj) {
      addActivityLog('company', `Removed company profile: ${compObj.name}`);
    }
  };

  // Job Actions
  const toggleJobFlag = (id) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const nextStatus = j.status === 'flagged' ? 'active' : 'flagged';
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );
    const jobObj = jobs.find((j) => j.id === id);
    if (jobObj) {
      const flagged = jobObj.status === 'flagged'; // wait, before toggled, it was whatever it is now
      addActivityLog('job', `${flagged ? 'Unflagged' : 'Flagged'} job posting: ${jobObj.title} at ${jobObj.company}`);
    }
  };

  const deleteJob = (id) => {
    const jobObj = jobs.find((j) => j.id === id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (jobObj) {
      addActivityLog('job', `Deleted job posting: ${jobObj.title} at ${jobObj.company}`);
    }
  };

  // Report Actions
  const resolveReport = (id, resolutionDetails = 'Resolved by Administrator.') => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved', resolutionDetails } : r))
    );
    const repObj = reports.find((r) => r.id === id);
    if (repObj) {
      addActivityLog('report', `Resolved compliance ticket ${repObj.id}`);
    }
  };

  const dismissReport = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'dismissed', resolutionDetails: 'Dismissed by Administrator.' } : r))
    );
    const repObj = reports.find((r) => r.id === id);
    if (repObj) {
      addActivityLog('report', `Dismissed compliance ticket ${repObj.id}`);
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        users,
        companies,
        jobs,
        reports,
        activities,
        systemHealth,
        addUser,
        updateUserStatus,
        updateUserRole,
        deleteUser,
        approveCompany,
        rejectCompany,
        deleteCompany,
        toggleJobFlag,
        deleteJob,
        resolveReport,
        dismissReport,
        addActivityLog,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}

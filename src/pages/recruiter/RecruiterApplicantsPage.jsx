import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  CalendarDays, 
  Check, 
  X, 
  Sparkles, 
  Mail, 
  Star,
  Plus,
  Video,
  ChevronDown
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

function RecruiterApplicantsPage() {
  const { applications, updateApplicationStatus, scheduleInterview } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Scheduling Interview State
  const [schedulingAppId, setSchedulingAppId] = useState(null);
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');

  const filteredApps = applications.filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.studentName.toLowerCase().includes(searchLower) ||
      app.jobTitle.toLowerCase().includes(searchLower) ||
      app.studentEmail.toLowerCase().includes(searchLower)
    );
  });

  const handleShortlist = (appId) => {
    updateApplicationStatus(appId, 'Shortlisted');
    toast.success('Applicant shortlisted successfully!');
  };

  const handleReject = (appId) => {
    updateApplicationStatus(appId, 'Rejected');
    toast.error('Application rejected.');
  };

  const handleOpenSchedule = (appId) => {
    setSchedulingAppId(appId);
    setInterviewTime('');
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!interviewTime) {
      toast.error('Please specify date and time.');
      return;
    }
    scheduleInterview(schedulingAppId, interviewTime, interviewType);
    setSchedulingAppId(null);
    toast.success('Interview scheduled successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Applicant Pipeline</h1>
          <p className="text-slate-500 mt-1">Review candidate profiles, technical scores, and schedule conversations.</p>
        </div>
        <div className="relative w-full max-w-xs shrink-0">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-500"
            placeholder="Search by name or role..."
          />
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900 mt-4">No applicants found</h3>
          <p className="text-slate-500 mt-2">
            {applications.length === 0 
              ? 'No student applications have been logged in the system yet.'
              : 'No applications match your search query.'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredApps.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6 hover:shadow-soft transition duration-300"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">{app.studentName}</h3>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {app.studentEmail}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-600 mt-1">
                      Applied for: <span className="text-brand-600">{app.jobTitle}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 font-medium">
                    <span>Applied on: {app.appliedDate}</span>
                    {app.resumeScore && (
                      <span className="flex items-center gap-1 text-slate-600 font-bold">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        AI Score: {app.resumeScore}%
                      </span>
                    )}
                  </div>

                  {app.skillsMatched && app.skillsMatched.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Matching Skills</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {app.skillsMatched.map((skill) => (
                          <span key={skill} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end lg:self-start">
                  <div className={`rounded-full px-3 py-1 text-xs font-bold mr-2 ${
                    app.status === 'Rejected' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-100'
                      : app.status === 'Shortlisted'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : app.status === 'Interview Scheduled'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-slate-50 text-slate-700 border border-slate-100'
                  }`}>
                    {app.status}
                  </div>

                  {app.status !== 'Rejected' && app.status !== 'Interview Scheduled' && (
                    <>
                      {app.status !== 'Shortlisted' && (
                        <button
                          onClick={() => handleShortlist(app.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 hover:border-emerald-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 px-4 py-2.5 text-xs font-semibold text-slate-700 transition"
                        >
                          <Check className="h-3.5 w-3.5" /> Shortlist
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenSchedule(app.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 hover:border-amber-200 bg-white hover:bg-amber-50 hover:text-amber-700 px-4 py-2.5 text-xs font-semibold text-slate-700 transition"
                      >
                        <CalendarDays className="h-3.5 w-3.5" /> Schedule Interview
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 hover:border-rose-200 bg-white hover:bg-rose-50 hover:text-rose-700 px-4 py-2.5 text-xs font-semibold text-slate-700 transition"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Inline Schedule Interview Form */}
              <AnimatePresence>
                {schedulingAppId === app.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-slate-100 pt-5 mt-2"
                  >
                    <form onSubmit={handleScheduleSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-end gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interview Date & Time</label>
                        <input
                          type="datetime-local"
                          value={interviewTime}
                          onChange={(e) => setInterviewTime(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                          required
                        />
                      </div>
                      <div className="w-full sm:w-48">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Round Type</label>
                        <select
                          value={interviewType}
                          onChange={(e) => setInterviewType(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                        >
                          <option value="Technical">Technical Round</option>
                          <option value="HR / Culture fit">HR Round</option>
                          <option value="System Design">System Design</option>
                          <option value="Coding Challenge">Coding Challenge</option>
                        </select>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button type="submit" className="rounded-xl px-4 py-2 text-sm">
                          Schedule
                        </Button>
                        <button
                          type="button"
                          onClick={() => setSchedulingAppId(null)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecruiterApplicantsPage;

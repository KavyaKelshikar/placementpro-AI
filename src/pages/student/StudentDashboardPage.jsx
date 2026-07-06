import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, CalendarDays, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import NotificationCenter from '../../components/ui/NotificationCenter';

function StudentDashboardPage() {
  const { user } = useAuth();
  const { jobs, applications, interviews, getStudentProfile } = useData();
  const navigate = useNavigate();

  const studentProfile = getStudentProfile();
  const resumeInfo = studentProfile?.resume || {};

  // Compute dynamic stats
  const myApplications = applications.filter((app) => app.studentEmail === user?.email);
  const myInterviews = interviews.filter((i) => i.studentEmail === user?.email);
  
  const recommendedCount = resumeInfo.uploaded
    ? jobs.filter((job) => {
        const studentSkills = studentProfile?.skills || [];
        if (studentSkills.length === 0) return false;
        return (job.skills || []).some((skill) => studentSkills.includes(skill));
      }).length
    : 0;

  const applicationsSent = myApplications.length;
  const interviewInvites = myInterviews.filter((i) => i.status === 'Scheduled').length;

  const shortlistedCount = myApplications.filter((app) => app.status === 'Shortlisted').length;
  const totalInterviewRounds = myInterviews.length;
  const offerReadiness = resumeInfo.uploaded ? `${resumeInfo.score}%` : '0%';

  const items = [
    { label: 'Recommended roles', value: recommendedCount.toString(), detail: 'High-fit roles for your profile', icon: Sparkles, accent: 'brand', path: '/student/recommended' },
    { label: 'Applications sent', value: applicationsSent.toString(), detail: 'Tracked and actively moving', icon: BriefcaseBusiness, accent: 'emerald', path: '/student/applied-jobs' },
    { label: 'Interview invites', value: interviewInvites.toString(), detail: 'New conversations scheduled', icon: CalendarDays, accent: 'amber', path: '/student/interviews' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-8 text-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.7)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Placement intelligence</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back, {user?.name || 'Student'}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              {resumeInfo.uploaded 
                ? `Your resume "${resumeInfo.fileName}" is processed. Your AI profile match index is high and ready for recruiter queries.` 
                : 'Your profile setup is partially complete. Upload your resume now to instantly unlock AI-assisted job scoring and recommended roles.'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/student/recommended')}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/15 transition shrink-0"
          >
            Review recommendations <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div 
            key={item.label} 
            onClick={() => navigate(item.path)} 
            className="cursor-pointer transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <StatCard title={item.label} value={item.value} detail={item.detail} icon={item.icon} accent={item.accent} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Opportunity pipeline</p>
                <p className="mt-1 text-sm text-slate-500">Placement momentum for the next 30 days</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                {myApplications.length > 0 ? '+24% momentum' : 'Ready to apply'}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Shortlisted', shortlistedCount.toString(), '/student/applied-jobs'],
                ['Interview rounds', totalInterviewRounds.toString(), '/student/interviews'],
                ['Offer readiness', offerReadiness, '/student/resume'],
              ].map(([label, value, path]) => (
                <div 
                  key={label} 
                  onClick={() => navigate(path)}
                  className="cursor-pointer rounded-[16px] border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100/80"
                >
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <NotificationCenter />
      </div>
    </div>
  );
}

export default StudentDashboardPage;


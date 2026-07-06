import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import ChartPanel from '../../components/ui/ChartPanel';
import TablePreview from '../../components/ui/TablePreview';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

function RecruiterDashboardPage() {
  const { user } = useAuth();
  const { jobs, applications } = useData();
  const navigate = useNavigate();

  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;
  const applicantsCount = applications.length;
  const shortlistedCount = applications.filter((app) => app.status === 'Shortlisted').length;

  const stats = [
    { label: 'Active jobs', value: activeJobsCount.toString(), detail: 'High-priority roles live now', icon: BriefcaseBusiness, accent: 'brand', path: '/recruiter/jobs' },
    { label: 'Applicants', value: applicantsCount.toString(), detail: 'Qualified profiles submitted', icon: Users, accent: 'emerald', path: '/recruiter/applicants' },
    { label: 'Shortlisted', value: shortlistedCount.toString(), detail: 'Candidates in review pipeline', icon: Sparkles, accent: 'amber', path: '/recruiter/applicants' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-8 text-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.7)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recruiter control center</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back, {user?.name || 'Recruiter'}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Evaluate applicants, publish roles, and accelerate hiring velocity with structured insights, beautiful tables, and elegant monitoring.
            </p>
          </div>
          <button 
            onClick={() => navigate('/recruiter/jobs')}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/15 transition shrink-0"
          >
            Create a new role <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            className="cursor-pointer transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <StatCard title={item.label} value={item.value} detail={item.detail} icon={item.icon} accent={item.accent} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartPanel title="Hiring velocity" description="Candidate movement and recruiter response efficiency">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Applicants reviewed', applicantsCount.toString()],
              ['Offers sent', shortlistedCount.toString()],
              ['Interview success', '64%'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[16px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </ChartPanel>
        <Card>
          <p className="text-sm font-semibold text-slate-900">AI shortlist quality</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">Modern hiring teams rely on contextual signals rather than surface-level filters.</p>
          <p className="mt-2 text-xs text-brand-600 font-semibold bg-brand-50 p-3 rounded-xl border border-brand-100/50">
            Current system average applicant score: {applicantsCount > 0 ? '86%' : 'N/A'}
          </p>
        </Card>
      </div>

      <ChartPanel title="Recent applicant feed" description="Beautiful table experience for recruiter review">
        <TablePreview />
      </ChartPanel>
    </div>
  );
}

export default RecruiterDashboardPage;

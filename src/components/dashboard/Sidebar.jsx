import { LayoutDashboard, BriefcaseBusiness, UserCircle2, FileText, BellRing, CalendarDays, Sparkles, Building2, ShieldCheck, BarChart3, Settings2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuByRole = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'Profile', icon: UserCircle2 },
    { to: '/student/resume', label: 'Resume Upload', icon: FileText },
    { to: '/student/applied-jobs', label: 'Applied Jobs', icon: BriefcaseBusiness },
    { to: '/student/saved-jobs', label: 'Saved Jobs', icon: Sparkles },
    { to: '/student/notifications', label: 'Notifications', icon: BellRing },
    { to: '/student/interviews', label: 'Interviews', icon: CalendarDays },
    { to: '/student/recommended', label: 'Recommended Jobs', icon: Sparkles },
  ],
  recruiter: [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recruiter/company', label: 'Company Profile', icon: Building2 },
    { to: '/recruiter/jobs', label: 'Jobs', icon: BriefcaseBusiness },
    { to: '/recruiter/applicants', label: 'Applicants', icon: UserCircle2 },
    { to: '/recruiter/interviews', label: 'Interviews', icon: CalendarDays },
    { to: '/recruiter/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Manage Users', icon: UserCircle2 },
    { to: '/admin/companies', label: 'Manage Companies', icon: Building2 },
    { to: '/admin/jobs', label: 'Manage Jobs', icon: BriefcaseBusiness },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/analytics', label: 'System Analytics', icon: ShieldCheck },
  ],
};

function Sidebar() {
  const { user } = useAuth();
  const items = menuByRole[user?.role] || menuByRole.student;

  return (
    <aside className="w-full rounded-[24px] border border-slate-200 bg-slate-950/95 p-5 text-white shadow-[0_24px_70px_-26px_rgba(15,23,42,0.75)] lg:w-72">
      <div className="mb-6 border-b border-white/10 pb-5">
        <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition group">
          <div className="rounded-xl bg-brand-600 p-2.5 text-white shadow-soft group-hover:scale-105 transition duration-300">
            <BriefcaseBusiness className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight leading-none">PlacementPro AI</p>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Return to homepage</p>
          </div>
        </NavLink>
      </div>
      <div className="mb-8 rounded-[20px] border border-white/10 bg-white/10 p-4 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Workspace</p>
        <h2 className="mt-2 text-lg font-semibold">{user?.name}</h2>
        <p className="text-sm capitalize text-slate-400">{user?.role} portal</p>
      </div>
      <nav className="space-y-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-white/15 text-white shadow-inner' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8 rounded-[20px] border border-white/10 bg-gradient-to-br from-brand-500/20 to-slate-800 p-4 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-brand-300" />
          Premium controls ready
        </div>
        <p className="mt-2 text-xs leading-6 text-slate-400">Launch smarter sprints, interviews, and offers from one modern workspace.</p>
      </div>
    </aside>
  );
}

export default Sidebar;

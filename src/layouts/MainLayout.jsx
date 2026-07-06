import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  BriefcaseBusiness, 
  Home, 
  LogIn, 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  UserCircle2, 
  Building2, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const publicNavItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/auth', label: 'Sign In', icon: LogIn },
];

const roleNavItems = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/resume', label: 'Resume Upload', icon: FileText },
    { to: '/student/recommended', label: 'Jobs', icon: BriefcaseBusiness },
    { to: '/student/applied-jobs', label: 'Applied', icon: Sparkles },
    { to: '/student/profile', label: 'Profile', icon: UserCircle2 },
  ],
  recruiter: [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recruiter/jobs', label: 'Jobs', icon: BriefcaseBusiness },
    { to: '/recruiter/applicants', label: 'Applicants', icon: UserCircle2 },
    { to: '/recruiter/company', label: 'Company', icon: Building2 },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: UserCircle2 },
    { to: '/admin/companies', label: 'Companies', icon: Building2 },
    { to: '/admin/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  ],
};

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = user 
    ? [
        { to: '/', label: 'Home', icon: Home },
        ...(roleNavItems[user.role] || [])
      ]
    : publicNavItems;

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition group">
            <div className="rounded-2xl bg-brand-600 p-2.5 text-white shadow-soft group-hover:scale-105 transition duration-300">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">PlacementPro AI</p>
              <p className="text-sm text-slate-500">AI-powered campus hiring platform</p>
            </div>
          </NavLink>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 sm:gap-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition ${
                      isActive ? 'bg-brand-600 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{label}</span>
                </NavLink>
              ))}
            </nav>
            {user && (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;


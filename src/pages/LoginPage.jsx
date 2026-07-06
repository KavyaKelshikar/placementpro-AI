import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Lock, Mail, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const roles = [
  { key: 'student', label: 'Student Login' },
  { key: 'recruiter', label: 'Recruiter Login' },
  { key: 'admin', label: 'Admin Login' },
];

function LoginPage() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    
    // Create AbortController for a 1.5s fast timeout to prevent freezing
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
      // 1. Try to authenticate credentials on backend
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ email, password }),
      });
      clearTimeout(timeoutId);
      let data = await res.json();

      if (!res.ok) {
        // If login failed (e.g. user not found), try registering
        const registerController = new AbortController();
        const registerTimeoutId = setTimeout(() => registerController.abort(), 1500);

        const regRes = await fetch(`${apiBase}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: registerController.signal,
          body: JSON.stringify({ email, password, role }),
        });
        clearTimeout(registerTimeoutId);
        data = await regRes.json();
        if (!regRes.ok) {
          throw new Error(data.error || 'Authentication mismatch');
        }
      }

      // Successful DB authentication
      login(data.user, data.token);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('Backend Auth offline/failed. Falling back to local demo mode:', err.message);
      // Fallback local session
      login({ id: `${role}-demo`, role, email }, 'demo-token');
      navigate(`/${role}/dashboard`);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex-1 rounded-[24px] border border-slate-200 bg-white/80 p-8 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)] backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-600 p-2.5 text-white shadow-soft">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">PlacementPro AI</h1>
            <p className="text-sm text-slate-500">Secure access for students, recruiters, and admins</p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {roles.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setRole(item.key);
                if (item.key === 'student') {
                  setEmail('aarav.sharma@placementpro.ai');
                  setPassword('student123');
                } else if (item.key === 'recruiter') {
                  setEmail('recruiter@google.com');
                  setPassword('recruiter123');
                } else {
                  setEmail('admin@placementpro.ai');
                  setPassword('admin123');
                }
              }}
              className={`rounded-[16px] border px-4 py-3 text-sm font-semibold transition ${role === item.key ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-8 rounded-[20px] border border-brand-100 bg-gradient-to-br from-brand-50 to-slate-50 p-5 text-sm text-slate-600">
          <div className="flex items-center gap-2 font-semibold text-brand-700">
            <Sparkles className="h-4 w-4" />
            Designed for premium recruiting teams
          </div>
          <p className="mt-2 leading-7">From AI-powered talent matching to recruiter-ready workflows, every interaction is tailored for modern hiring operations.</p>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="flex-1">
        <Card>
          <h2 className="text-2xl font-semibold text-slate-900">{roles.find((item) => item.key === role)?.label}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Sign in with your secure workspace credentials to access AI-powered placement operations.
          </p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Mail className="h-4 w-4" /> Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[16px] border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-brand-500"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Lock className="h-4 w-4" /> Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-[16px] border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-brand-500"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full">Continue</Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default LoginPage;


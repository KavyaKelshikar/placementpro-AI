import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Lock, Mail, Sparkles, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const roles = [
  { key: 'student', label: 'Student' },
  { key: 'recruiter', label: 'Recruiter' },
  { key: 'admin', label: 'Admin' },
];

function LoginPage() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('aarav.sharma@placementpro.ai');
  const [password, setPassword] = useState('student123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (key) => {
    setRole(key);
    setErrorMsg('');
    if (!isRegister) {
      if (key === 'student') {
        setEmail('aarav.sharma@placementpro.ai');
        setPassword('student123');
      } else if (key === 'recruiter') {
        setEmail('recruiter@google.com');
        setPassword('recruiter123');
      } else {
        setEmail('admin@placementpro.ai');
        setPassword('admin123');
      }
    } else {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const toggleMode = () => {
    setIsRegister((prev) => {
      const nextValue = !prev;
      setErrorMsg('');
      if (nextValue) {
        // Switching to Register
        if (role === 'admin') {
          setRole('student');
        }
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        // Switching to Login, restore student defaults
        setRole('student');
        setEmail('aarav.sharma@placementpro.ai');
        setPassword('student123');
      }
      return nextValue;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    if (isRegister) {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      const gmailRegex = /^[a-zA-Z0-9.]+@gmail\.com$/;
      if (!gmailRegex.test(email)) {
        setErrorMsg('Please provide a valid Gmail address (e.g. username@gmail.com). Only letters, numbers, and periods are allowed.');
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;':",./<>?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;':",./<>?]{8,}$/;
      if (!passwordRegex.test(password)) {
        setErrorMsg('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      let res;
      if (isRegister) {
        res = await fetch(`${apiBase}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ email, password, role }),
        });
      } else {
        res = await fetch(`${apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ email, password }),
        });
      }
      
      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || data.message || 'Authentication failed');
        return;
      }

      // Successful DB authentication
      login(data.user, data.token);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError' || err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
        console.warn('Backend Auth offline. Falling back to local demo mode:', err.message);
        // Fallback local session
        login({ id: `${role}-demo`, role, email }, 'demo-token');
        navigate(`/${role}/dashboard`);
      } else {
        setErrorMsg(err.message || 'An error occurred during authentication.');
      }
    }
  };

  const displayedRoles = isRegister ? roles.filter((item) => item.key !== 'admin') : roles;

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
        
        <div className={`mt-8 grid gap-3 ${displayedRoles.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
          {displayedRoles.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleRoleChange(item.key)}
              className={`rounded-[16px] border px-4 py-3 text-sm font-semibold transition ${role === item.key ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              {item.label} {isRegister ? 'Signup' : 'Login'}
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
          <h2 className="text-2xl font-semibold text-slate-900">
            {isRegister ? 'Create Account' : `${roles.find((item) => item.key === role)?.label} Login`}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {isRegister 
              ? 'Register a new profile to access placement opportunities.' 
              : 'Sign in with your secure credentials to access AI-powered operations.'}
          </p>
          
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="rounded-[16px] bg-rose-50 border border-rose-100 p-4 text-xs font-semibold text-rose-600 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Mail className="h-4 w-4" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[16px] border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-brand-500 font-sans"
                placeholder={isRegister ? 'username@gmail.com' : 'name@company.com'}
              />
            </div>
            
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Lock className="h-4 w-4" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-[16px] border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-brand-500 font-sans"
                placeholder="••••••••"
              />
              
              {isRegister && password && (
                <div className="mt-2 text-[11px] grid grid-cols-2 gap-x-3 gap-y-1.5 p-3 bg-slate-50 border border-slate-200/60 rounded-[12px] font-sans">
                  <div className={`flex items-center gap-1.5 ${password.length >= 8 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{password.length >= 8 ? '✓' : '•'}</span> Min 8 chars
                  </div>
                  <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{/[A-Z]/.test(password) ? '✓' : '•'}</span> 1 uppercase
                  </div>
                  <div className={`flex items-center gap-1.5 ${/[a-z]/.test(password) ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{/[a-z]/.test(password) ? '✓' : '•'}</span> 1 lowercase
                  </div>
                  <div className={`flex items-center gap-1.5 ${/\d/.test(password) ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{/\d/.test(password) ? '✓' : '•'}</span> 1 number
                  </div>
                  <div className={`flex items-center gap-1.5 col-span-2 ${/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password) ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password) ? '✓' : '•'}</span> 1 special character
                  </div>
                </div>
              )}
            </div>
            
            {isRegister && (
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock className="h-4 w-4" /> Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-[16px] border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-brand-500 font-sans"
                  placeholder="••••••••"
                />
              </div>
            )}
            
            <Button type="submit" className="w-full mt-2">
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm font-semibold text-slate-500 font-sans border-t border-slate-100 pt-5">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-brand-600 hover:text-brand-700 hover:underline focus:outline-none"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New to PlacementPro?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-brand-600 hover:text-brand-700 hover:underline focus:outline-none"
                >
                  Create Account
                </button>
              </span>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default LoginPage;


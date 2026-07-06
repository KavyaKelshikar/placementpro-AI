import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  BriefcaseBusiness, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  TrendingUp, 
  HardDrive, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2 
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import ChartPanel from '../../components/ui/ChartPanel';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageTransition from '../../components/common/PageTransition';

function AdminDashboardPage() {
  useDocumentTitle('Control Board');
  const { user } = useAuth();
  const { users, companies, jobs, reports, activities, systemHealth } = useAdminData();

  // Compute stats
  const totalUsers = users.length;
  const pendingCompanies = companies.filter(c => c.status === 'pending').length;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const unresolvedReports = reports.filter(r => r.status === 'pending').length;

  const statItems = [
    { label: 'Platform Users', value: totalUsers, detail: `${users.filter(u => u.role === 'student').length} students, ${users.filter(u => u.role === 'recruiter').length} recruiters`, icon: Users, accent: 'brand' },
    { label: 'Pending Companies', value: pendingCompanies, detail: `${companies.filter(c => c.status === 'approved').length} verified partners`, icon: Building2, accent: 'amber' },
    { label: 'Active Job Board', value: activeJobs, detail: `${jobs.filter(j => j.status === 'flagged').length} postings flagged`, icon: BriefcaseBusiness, accent: 'emerald' },
    { label: 'Unresolved Reports', value: unresolvedReports, detail: `${reports.filter(r => r.severity === 'high' && r.status === 'pending').length} marked critical priority`, icon: ShieldAlert, accent: 'slate' },
  ];

  // SVG Chart Data definition
  // Mock points for a 6-month growth curve (Jan - Jun)
  const chartPoints = [30, 45, 38, 70, 62, 95];
  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  // Convert chartPoints to SVG coordinate space
  // SVG size is width=500, height=180
  const padding = 20;
  const width = 500;
  const height = 180;
  const maxVal = 100;

  const pointsString = chartPoints.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (chartPoints.length - 1);
    const y = height - padding - (val * (height - padding * 2)) / maxVal;
    return `${x},${y}`;
  }).join(' ');

  // Fill path coordinate string to complete the area shape
  const fillPointsString = `${padding},${height - padding} ${pointsString} ${width - padding},${height - padding}`;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-brand-600" />;
      case 'company': return <Building2 className="h-4 w-4 text-amber-600" />;
      case 'job': return <BriefcaseBusiness className="h-4 w-4 text-emerald-600" />;
      case 'report': return <ShieldAlert className="h-4 w-4 text-rose-600" />;
      default: return <Activity className="h-4 w-4 text-slate-600" />;
    }
  };

  const getHealthStatusColor = (status) => {
    if (status === 'healthy') return 'bg-emerald-500';
    if (status === 'warning') return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Dashboard Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950 p-8 text-white shadow-soft"
      >
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getHealthStatusColor(systemHealth.dbStatus)}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${getHealthStatusColor(systemHealth.dbStatus)}`}></span>
              </span>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">System Gateway Active</p>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back, {user?.name || 'Admin'}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Governance operations control room. Monitor platform users, approve companies, audit jobs, and inspect system latency.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur text-brand-300">
            <Clock className="h-4 w-4" /> Uptime: 14d 6h 32m
          </div>
        </div>
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl"></div>
      </motion.div>


      {/* Metrics Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <StatCard 
              title={item.label} 
              value={item.value} 
              detail={item.detail} 
              icon={item.icon} 
              accent={item.accent} 
            />
          </motion.div>
        ))}
      </div>

      {/* Primary Panels - Graph and Activity Log */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <ChartPanel 
            title="User Engagement & Growth Trends" 
            description="Consolidated registrations and candidate match volume (last 6 months)"
          >
            <div className="relative flex flex-col justify-between">
              {/* Custom SVG Graphic */}
              <div className="w-full">
                <svg viewBox="0 0 500 180" className="w-full overflow-visible">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="160" x2="480" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Area Shape */}
                  <polygon points={fillPointsString} fill="url(#areaGradient)" />

                  {/* Line Path */}
                  <polyline
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsString}
                  />

                  {/* Interaction Dots */}
                  {chartPoints.map((val, idx) => {
                    const x = padding + (idx * (width - padding * 2)) / (chartPoints.length - 1);
                    const y = height - padding - (val * (height - padding * 2)) / maxVal;
                    return (
                      <g key={idx} className="group cursor-pointer">
                        <circle cx={x} cy={y} r="6" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                        <circle cx={x} cy={y} r="12" fill="#4f46e5" fillOpacity="0.15" className="hidden group-hover:block" />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Chart Labels */}
              <div className="mt-4 flex justify-between px-3 text-xs font-semibold text-slate-500">
                {chartLabels.map((lbl, idx) => (
                  <span key={lbl} className="text-center">{lbl}</span>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold text-slate-900">+48.2%</span> year-over-year match accuracy increase
              </div>
              <a href="/admin/analytics" className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700">
                Full Systems Analytics <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </ChartPanel>

          {/* System Health Status */}
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Virtual Infrastructure Health</p>
                <p className="text-xs text-slate-500">Auto-streaming hardware and service cluster logs</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${systemHealth.dbStatus === 'healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${getHealthStatusColor(systemHealth.dbStatus)}`}></span>
                {systemHealth.dbStatus}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-[16px] border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500">
                  <Cpu className="h-4 w-4 text-brand-600" />
                  <span className="text-xs font-medium">Server CPU</span>
                </div>
                <p className="mt-2 text-xl font-bold text-slate-900">{systemHealth.cpu}%</p>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-brand-600 transition-all duration-1000" 
                    style={{ width: `${systemHealth.cpu}%` }}
                  ></div>
                </div>
              </div>

              <div className="rounded-[16px] border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500">
                  <HardDrive className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium">Memory Cache</span>
                </div>
                <p className="mt-2 text-xl font-bold text-slate-900">{systemHealth.memory}</p>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="rounded-[16px] border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500">
                  <Activity className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium">API Latency</span>
                </div>
                <p className="mt-2 text-xl font-bold text-slate-900">{systemHealth.apiLatency} ms</p>
                <span className="mt-2 text-[10px] text-slate-400">Target latency &lt; 80ms</span>
              </div>

              <div className="rounded-[16px] border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500">
                  <Users className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-medium">Active Channels</span>
                </div>
                <p className="mt-2 text-xl font-bold text-slate-900">{systemHealth.activeSockets}</p>
                <span className="mt-2 text-[10px] text-slate-400">WebSocket load balanced</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Activity Side panel */}
        <div className="h-full">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Audit & Control Logs</p>
                  <p className="text-xs text-slate-500">Latest platform operations</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Live</span>
              </div>

              <div className="space-y-4">
                {activities.slice(0, 6).map((item, idx) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex gap-3 text-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 break-words leading-tight">{item.message}</p>
                      <span className="mt-1 block text-xs text-slate-400">{item.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <a 
                href="/admin/analytics" 
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Inspect Full Server Streams
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

export default AdminDashboardPage;

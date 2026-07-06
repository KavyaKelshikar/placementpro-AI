import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Terminal,
  Play,
  Pause,
  Trash,
  Users,
  Building2,
  Briefcase,
  Award,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageTransition from '../../components/common/PageTransition';
import { useAuth } from '../../context/AuthContext';

const initialLogs = [
  '[2026-07-06 03:00:01] INFO: MongoDB Connection established successfully at replica set cluster0.',
  '[2026-07-06 03:00:03] INFO: Express server worker thread [1] ready on port 5000.',
  '[2026-07-06 03:00:10] GET /api/health - 200 OK - 8ms',
  '[2026-07-06 03:01:45] GET /api/analytics/admin - 200 OK - 24ms',
  '[2026-07-06 03:02:12] POST /api/auth/login [role: student] - 200 OK - 145ms',
  '[2026-07-06 03:03:05] GET /api/jobs?status=active - 200 OK - 56ms',
];

const logPool = [
  'GET /api/students/profile - 200 OK - 12ms',
  'POST /api/resumes/upload - 201 Created - 230ms',
  'INFO: Index scan executed on [jobs.status] in 4ms.',
  'GET /api/companies/verified - 200 OK - 32ms',
  'POST /api/applications/apply - 201 Created - 180ms',
  'WARN: High query response time on /api/recommendations (112ms).',
  'INFO: Cleared session cache for expired token identifier hash_884.',
  'GET /api/notifications - 200 OK - 10ms',
  'GET /api/interviews - 200 OK - 15ms',
  'INFO: Scheduled cron task trigger: [interview_notification_reminder] started.',
  'INFO: Syncing recommendation engines via Python pipeline worker [pid: 8492].',
  'POST /api/bookmarks/toggle - 200 OK - 42ms',
  'GET /api/jobs/job-1 - 200 OK - 9ms',
];

const DONUT_COLORS = ['#6366f1', '#e2e8f0'];
const BAR_COLOR = '#6366f1';
const STATUS_COLORS = {
  Applied: '#6366f1',
  Shortlisted: '#f59e0b',
  Interviewing: '#3b82f6',
  Offered: '#10b981',
  Rejected: '#ef4444',
  Withdrawn: '#94a3b8',
};

// Custom label for Donut center
function DonutCenterLabel({ cx, cy, rate }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} dy="-0.4em" fontSize="28" fontWeight="700" fill="#1e293b">
        {rate}%
      </tspan>
      <tspan x={cx} dy="1.6em" fontSize="11" fill="#64748b">
        Placement Rate
      </tspan>
    </text>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="flex items-center gap-4">
        <div className={`rounded-2xl p-3 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p>
          {sub && <p className="text-xs text-emerald-600 font-semibold mt-0.5">{sub}</p>}
        </div>
      </Card>
    </motion.div>
  );
}

function AdminAnalyticsPage() {
  useDocumentTitle('Analytics — PlacementPro AI');
  const { token } = useAuth();
  const [logs, setLogs] = useState(initialLogs);
  const [isLive, setIsLive] = useState(true);
  const logEndRef = useRef(null);

  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch real analytics from backend
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${apiBase}/api/analytics/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || json.message || 'Failed to load analytics');
        setAnalyticsData(json.data);
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [token]);

  // Auto-generate server logs when stream is live
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const prefix = randomLog.startsWith('WARN')
        ? `[${timestamp}] WARN:`
        : randomLog.startsWith('INFO')
        ? `[${timestamp}] INFO:`
        : `[${timestamp}]`;
      setLogs((prev) => [...prev, `${prefix} ${randomLog}`].slice(-100));
    }, 2500);
    return () => clearInterval(interval);
  }, [isLive]);

  // Scroll log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Derived chart data
  const counts = analyticsData?.counts || {};
  const placement = analyticsData?.placement || {};
  const rate = placement.placementRatePercentage ?? 0;

  const donutData = [
    { name: 'Placed', value: rate },
    { name: 'Not Yet', value: 100 - rate },
  ];

  const deptData = (placement.departmentBreakdown || []).map((d) => ({
    name: d.department || 'Unknown',
    Placed: d.placedCount,
  }));

  // Fallback department data if DB is empty
  const displayDeptData =
    deptData.length > 0
      ? deptData
      : [
          { name: 'CSE', Placed: 0 },
          { name: 'IT', Placed: 0 },
          { name: 'ECE', Placed: 0 },
          { name: 'Mechanical', Placed: 0 },
        ];

  const industries = [
    { name: 'Technology & AI', percentage: 64, count: 204, color: 'bg-brand-600' },
    { name: 'Finance & Banking', percentage: 18, count: 58, color: 'bg-emerald-500' },
    { name: 'Consulting & Strategy', percentage: 12, count: 38, color: 'bg-amber-500' },
    { name: 'Manufacturing / Hardware', percentage: 6, count: 20, color: 'bg-purple-500' },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Platform Analytics</h2>
            <p className="mt-1 text-sm text-slate-500">
              Live placement rates, department breakdown, and real-time API logs.
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-brand-600 font-medium">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Loading live data...
            </div>
          )}
          {fetchError && (
            <span className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
              ⚠ {fetchError}
            </span>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Students"
            value={counts.students ?? '—'}
            sub={`${placement.totalPlaced ?? 0} placed`}
            color="bg-brand-500/10 text-brand-600"
          />
          <StatCard
            icon={Building2}
            label="Companies"
            value={counts.companies ?? '—'}
            sub="Verified on platform"
            color="bg-emerald-500/10 text-emerald-600"
          />
          <StatCard
            icon={Briefcase}
            label="Active Jobs"
            value={counts.jobs ?? '—'}
            sub="Open positions"
            color="bg-amber-500/10 text-amber-600"
          />
          <StatCard
            icon={Award}
            label="Placement Rate"
            value={`${rate}%`}
            sub={`${placement.totalPlaced ?? 0} of ${counts.students ?? 0} students`}
            color="bg-purple-500/10 text-purple-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          {/* Placement Rate Donut */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Overall Placement Rate</p>
                <p className="text-xs text-slate-500">Students with at least one job offer</p>
              </div>
              <TrendingUp className="h-5 w-5 text-slate-400" />
            </div>

            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index]} />
                    ))}
                    <DonutCenterLabel cx={0} cy={0} rate={rate} />
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, '']}
                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-600 inline-block" />
                Placed ({rate}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200 inline-block" />
                Not Yet ({100 - rate}%)
              </span>
            </div>
          </Card>

          {/* Department-wise Placement Bar Chart */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Department-wise Placements</p>
                <p className="text-xs text-slate-500">Students offered positions by department</p>
              </div>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={displayDeptData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="Placed" fill={BAR_COLOR} radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Application Intake Share + Live Console */}
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Industry Match Stats */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Application Intake Share</p>
                  <p className="text-xs text-slate-500">Distribution by employer industry segment</p>
                </div>
                <BarChart3 className="h-5 w-5 text-slate-400" />
              </div>

              <div className="space-y-4">
                {industries.map((ind) => (
                  <div key={ind.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">{ind.name}</span>
                      <span className="text-slate-500">
                        {ind.count} submissions ({ind.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${ind.color} rounded-full`}
                        style={{ width: `${ind.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-500 leading-6">
              <p className="font-semibold text-slate-800">Placement Insights</p>
              Platform hiring remains heavily tech-centric. Strategic outreach campaigns should
              target Finance and Consulting sectors in upcoming months.
            </div>
          </Card>

          {/* Live Console Logs */}
          <Card className="flex flex-col h-[400px] p-0 overflow-hidden bg-slate-950 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-900/50">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="h-4 w-4 text-brand-400" />
                <span className="text-xs font-semibold font-mono">live_server_stream.log</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLive(!isLive)}
                  className={`rounded-lg p-1.5 text-xs font-semibold flex items-center gap-1 transition ${
                    isLive
                      ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                  }`}
                >
                  {isLive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  {isLive ? 'Pause' : 'Live'}
                </button>
                <button
                  onClick={() => setLogs([])}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 p-1.5 text-slate-400 hover:text-white transition"
                >
                  <Trash className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-6 text-slate-300 space-y-1">
              {logs.length > 0 ? (
                logs.map((log, idx) => (
                  <div key={idx} className="break-all whitespace-pre-wrap">
                    {log.includes('WARN') ? (
                      <span className="text-amber-500 font-semibold">{log}</span>
                    ) : log.includes('INFO') ? (
                      <span className="text-brand-400">{log}</span>
                    ) : (
                      <span>{log}</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600">
                  Live stream console cleared. Waiting for transactions...
                </div>
              )}
              <div ref={logEndRef} />
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}

export default AdminAnalyticsPage;

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Terminal, 
  Play, 
  Pause, 
  Trash, 
  RefreshCw, 
  Cpu, 
  Database, 
  Network 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageTransition from '../../components/common/PageTransition';

const initialLogs = [
  '[2026-07-06 03:00:01] INFO: MongoDB Connection established successfully at replica set cluster0.',
  '[2026-07-06 03:00:03] INFO: Express server worker thread [1] ready on port 5000.',
  '[2026-07-06 03:00:10] GET /api/health - 200 OK - 8ms',
  '[2026-07-06 03:01:45] GET /api/analytics/system - 200 OK - 24ms',
  '[2026-07-06 03:02:12] POST /api/auth/login [role: student] - 200 OK - 145ms',
  '[2026-07-06 03:03:05] GET /api/jobs?status=active - 200 OK - 56ms',
];

const logPool = [
  'GET /api/students/profile/demo-user - 200 OK - 12ms',
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

function AdminAnalyticsPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [isLive, setIsLive] = useState(true);
  const logEndRef = useRef(null);

  // Auto-generate server logs when stream is live
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const isError = randomLog.startsWith('WARN');
      const prefix = isError 
        ? `[${timestamp}] \u001b[33mWARN\u001b[0m:` 
        : randomLog.startsWith('INFO') 
          ? `[${timestamp}] INFO:` 
          : `[${timestamp}]`;
      
      setLogs((prev) => [...prev, `${prefix} ${randomLog}`].slice(-100)); // Keep last 100 logs
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  // Scroll to bottom anchor
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

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
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">System Analytics & Stream Console</h2>
        <p className="mt-1 text-sm text-slate-500">Track user conversion graphs, check database health, and view live API logs.</p>
      </div>

      {/* Resource Utilization Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-600">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Gateway Nodes</p>
            <p className="text-lg font-bold text-slate-900">3 Instances Running</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">Load balanced 33/33/34%</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500">DB Replication</p>
            <p className="text-lg font-bold text-slate-900">Cluster Primary (Synced)</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">Replica lag: 0.1s</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-600">
            <Network className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500">WebSocket Connections</p>
            <p className="text-lg font-bold text-slate-900">844 active pipes</p>
            <p className="text-xs text-slate-500 mt-0.5">99.9% uptime index</p>
          </div>
        </Card>
      </div>

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
                    <span className="text-slate-500">{ind.count} submissions ({ind.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full ${ind.color} rounded-full`} 
                      style={{ width: `${ind.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-500 leading-6">
            <p className="font-semibold text-slate-800">Placement Insights</p>
            Platform hiring remains heavily tech-centric. Strategic outreach campaigns should target Finance and Consulting sectors in upcoming months.
          </div>
        </Card>

        {/* Live Console Logs */}
        <Card className="flex flex-col h-[400px] p-0 overflow-hidden bg-slate-950 border-slate-800">
          {/* Console Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-900/50">
            <div className="flex items-center gap-2 text-slate-300">
              <Terminal className="h-4 w-4 text-brand-400" />
              <span className="text-xs font-semibold font-mono">live_server_stream.log</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsLive(!isLive)}
                className={`rounded-lg p-1.5 text-xs font-semibold flex items-center gap-1 transition ${isLive ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                title={isLive ? 'Pause Stream' : 'Resume Stream'}
              >
                {isLive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {isLive ? 'Pause' : 'Live'}
              </button>
              <button 
                onClick={clearLogs}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 p-1.5 text-slate-400 hover:text-white transition"
                title="Clear Logs"
              >
                <Trash className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Console Output Screen */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-6 text-slate-300 space-y-1 selection:bg-brand-500/30 selection:text-white">
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

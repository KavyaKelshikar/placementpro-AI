import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldAlert, 
  Check, 
  Trash2, 
  Clock, 
  User, 
  FileText, 
  AlertTriangle,
  Building,
  Briefcase
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageTransition from '../../components/common/PageTransition';

function AdminReportsPage() {
  useDocumentTitle('Manage Reports');
  const { reports, resolveReport, dismissReport } = useAdminData();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = reports.filter((r) => {
    const matchesSeverity = severityFilter === 'all' || r.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high':
        return (
          <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            Critical
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            Warning
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <Clock className="h-3 w-3 animate-spin" /> Pending Review
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Resolved
          </span>
        );
      case 'dismissed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  const getTargetIcon = (type) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4 text-slate-400" />;
      case 'company': return <Building className="h-4 w-4 text-slate-400" />;
      case 'job': return <Briefcase className="h-4 w-4 text-slate-400" />;
      default: return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Header and KPIs */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Compliance & Violations Board</h2>
          <p className="mt-1 text-sm text-slate-500">Audit user complaints, flag unauthorized corporate accounts, and dismiss false reports.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
            <p className="text-xs text-slate-500">Pending Review</p>
            <p className="text-lg font-bold text-amber-600">{reports.filter(r => r.status === 'pending').length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
            <p className="text-xs text-slate-500">Critical Incidents</p>
            <p className="text-lg font-bold text-rose-600">{reports.filter(r => r.severity === 'high' && r.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">Critical Severity</option>
            <option value="medium">Warning Severity</option>
            <option value="low">Low Severity</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="all">All Resolution States</option>
            <option value="pending">Pending Audit</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </Card>

      {/* Reports Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Resolution</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr 
                    key={report.id} 
                    className="group transition hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">{report.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="font-semibold text-slate-700">{report.reporter}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTargetIcon(report.type)}
                        <div>
                          <span className="font-semibold text-slate-800 capitalize">{report.type}</span>
                          <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{report.targetName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getSeverityBadge(report.severity)}</td>
                    <td className="px-6 py-4 text-slate-500">{report.date}</td>
                    <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => resolveReport(report.id, 'Resolved: Violation confirmed and action taken.')}
                              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 transition"
                              title="Resolve Incident"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => dismissReport(report.id)}
                              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                              title="Dismiss Report"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No compliance tickets match selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-over Report Drawer */}
      <AnimatePresence>
        {selectedReport && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 z-40 bg-slate-900"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md bg-white p-6 shadow-2xl border-l border-slate-200 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-950">Compliance Ticket details</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="rounded-xl p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center border-b border-slate-100 pb-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-rose-500/10 text-rose-600">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <h4 className="mt-4 text-xl font-bold text-slate-950">Ticket #{selectedReport.id}</h4>
                <div className="mt-3 flex gap-2">
                  {getSeverityBadge(selectedReport.severity)}
                  {getStatusBadge(selectedReport.status)}
                </div>

                {selectedReport.status === 'pending' && (
                  <div className="mt-6 flex gap-2">
                    <Button
                      onClick={() => {
                        resolveReport(selectedReport.id, 'Violation confirmed and resolved.');
                        setSelectedReport(prev => ({ ...prev, status: 'resolved', resolutionDetails: 'Violation confirmed and resolved.' }));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="h-3.5 w-3.5" /> Resolve Report
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        dismissReport(selectedReport.id);
                        setSelectedReport(prev => ({ ...prev, status: 'dismissed', resolutionDetails: 'Dismissed by Administrator.' }));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs border-slate-200 hover:bg-slate-100"
                    >
                      <X className="h-3.5 w-3.5" /> Dismiss
                    </Button>
                  </div>
                )}
              </div>

              {/* Report Information Logs */}
              <div className="mt-6 space-y-4">
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Incident Details</h5>
                  <p className="mt-2 text-sm leading-6 text-slate-600 bg-slate-50 rounded-2xl border border-slate-100 p-4">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Filing Reporter</p>
                    <p className="text-sm font-semibold text-slate-950">{selectedReport.reporter}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-center bg-slate-100 rounded-xl p-2 text-slate-500">
                    {getTargetIcon(selectedReport.type)}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Reported Entity ({selectedReport.type})</p>
                    <p className="text-sm font-semibold text-slate-950">{selectedReport.targetName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Date Logged</p>
                    <p className="text-sm font-semibold text-slate-950">{selectedReport.date}</p>
                  </div>
                </div>

                {selectedReport.resolutionDetails && (
                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolution History</h5>
                    <p className="mt-2 text-sm leading-6 text-slate-600 bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4">
                      {selectedReport.resolutionDetails}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
    </PageTransition>
  );
}

export default AdminReportsPage;

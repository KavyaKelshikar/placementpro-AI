import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Briefcase, 
  ShieldAlert, 
  User, 
  MapPin, 
  IndianRupee, 
  Users, 
  Calendar,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageTransition from '../../components/common/PageTransition';

function AdminJobsPage() {
  useDocumentTitle('Manage Jobs');
  const { jobs, toggleJobFlag, deleteJob } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            Closed
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span> Flagged
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Header and KPIs */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Manage Job Opportunities</h2>
          <p className="mt-1 text-sm text-slate-500">Review open positions, check hiring requirements, and flag violations.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
            <p className="text-xs text-slate-500">Total Openings</p>
            <p className="text-lg font-bold text-slate-900">{jobs.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
            <p className="text-xs text-slate-500">Flagged Jobs</p>
            <p className="text-lg font-bold text-rose-600">{jobs.filter(j => j.status === 'flagged').length}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search job title or hiring company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:bg-white"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="all">All Job Statuses</option>
            <option value="active">Active/Open</option>
            <option value="closed">Closed Listings</option>
            <option value="flagged">Flagged / Compliance Issues</option>
          </select>
        </div>
      </Card>

      {/* Jobs Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Recruiter</th>
                <th className="px-6 py-4">Applicants</th>
                <th className="px-6 py-4">Posted Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr 
                    key={job.id} 
                    className="group transition hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-sm font-bold text-brand-700">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition">{job.title}</p>
                          <p className="text-xs text-slate-400">{job.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{job.company}</td>
                    <td className="px-6 py-4 text-slate-500">{job.recruiter}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{job.applicants} applied</td>
                    <td className="px-6 py-4 text-slate-500">{job.postedDate}</td>
                    <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleJobFlag(job.id)}
                          className={`rounded-xl border border-slate-200 bg-white p-2 transition ${job.status === 'flagged' ? 'border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 text-emerald-500' : 'hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500'}`}
                          title={job.status === 'flagged' ? 'Resolve/Unflag Job' : 'Flag Job'}
                        >
                          <ShieldAlert className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete Job posting"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No matching jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-over Job details Drawer */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
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
                <h3 className="text-lg font-bold text-slate-950">Job Opportunity Details</h3>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="rounded-xl p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center border-b border-slate-100 pb-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-brand-500/10 text-brand-700">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h4 className="mt-4 text-xl font-bold text-slate-900">{selectedJob.title}</h4>
                <p className="text-sm font-semibold text-brand-600">{selectedJob.company}</p>
                <div className="mt-3">
                  {getStatusBadge(selectedJob.status)}
                </div>

                <div className="mt-6 flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      toggleJobFlag(selectedJob.id);
                      setSelectedJob(prev => ({ ...prev, status: prev.status === 'flagged' ? 'active' : 'flagged' }));
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs border-slate-200 hover:bg-slate-50 transition ${selectedJob.status === 'flagged' ? 'text-emerald-700 border-emerald-200 hover:text-emerald-800' : 'text-rose-700 border-rose-200 hover:text-rose-800'}`}
                  >
                    {selectedJob.status === 'flagged' ? (
                      <><CheckCircle2 className="h-3.5 w-3.5" /> Resolve Flag</>
                    ) : (
                      <><AlertTriangle className="h-3.5 w-3.5" /> Flag Vacancy</>
                    )}
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      deleteJob(selectedJob.id);
                      setSelectedJob(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Job
                  </Button>
                </div>
              </div>

              {/* Job Details Meta */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Assigned Recruiter</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedJob.recruiter}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Workplace Location</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedJob.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <IndianRupee className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Estimated Compensation</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedJob.salary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <Users className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Applicant Intake</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedJob.applicants} matched candidates</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Posting Date</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedJob.postedDate}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
    </PageTransition>
  );
}

export default AdminJobsPage;

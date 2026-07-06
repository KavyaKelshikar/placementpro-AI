import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Building2, 
  Check, 
  AlertTriangle, 
  Link as LinkIcon, 
  Users2, 
  Briefcase, 
  Calendar,
  ThumbsDown,
  Trash2
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageTransition from '../../components/common/PageTransition';

function AdminCompaniesPage() {
  useDocumentTitle('Manage Companies');
  const { companies, approveCompany, rejectCompany, deleteCompany } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Verified Partner
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span> Suspended
          </span>
        );
      default:
        return null;
    }
  };

  const getCompanyInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Header with KPI summaries */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Manage Hiring Companies</h2>
          <p className="mt-1 text-sm text-slate-500">Audit company profiles, review verification requests, and maintain job posting compliance.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
            <p className="text-xs text-slate-500">Verified</p>
            <p className="text-lg font-bold text-slate-900">{companies.filter(c => c.status === 'approved').length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
            <p className="text-xs text-slate-500">Pending Approval</p>
            <p className="text-lg font-bold text-slate-900 text-amber-600">{companies.filter(c => c.status === 'pending').length}</p>
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
              placeholder="Search companies by name or industry sector..."
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
            <option value="all">All Verification States</option>
            <option value="approved">Verified Partners</option>
            <option value="pending">Pending Audit</option>
            <option value="rejected">Suspended/Rejected</option>
          </select>
        </div>
      </Card>

      {/* Companies Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Industry Sector</th>
                <th className="px-6 py-4">Workforce Size</th>
                <th className="px-6 py-4">Active Openings</th>
                <th className="px-6 py-4">Partnership</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr 
                    key={company.id} 
                    className="group transition hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => setSelectedCompany(company)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-sm font-bold text-amber-700">
                          {getCompanyInitials(company.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition">{company.name}</p>
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-brand-600 transition"
                          >
                            <LinkIcon className="h-3 w-3" /> Website
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{company.industry}</td>
                    <td className="px-6 py-4 text-slate-500">{company.size} employees</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{company.activeJobs} positions</td>
                    <td className="px-6 py-4">{getStatusBadge(company.status)}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {company.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveCompany(company.id)}
                              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 transition"
                              title="Verify Partner"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => rejectCompany(company.id)}
                              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                              title="Reject Application"
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {company.status === 'approved' && (
                          <button
                            onClick={() => rejectCompany(company.id)}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Suspend Partner"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                        )}
                        {company.status === 'rejected' && (
                          <button
                            onClick={() => approveCompany(company.id)}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 transition"
                            title="Verify and Restore"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteCompany(company.id)}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete Profile"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No corporate profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-over Company details Drawer */}
      <AnimatePresence>
        {selectedCompany && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCompany(null)}
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
                <h3 className="text-lg font-bold text-slate-950">Employer Profile</h3>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="rounded-xl p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center border-b border-slate-100 pb-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[32px] bg-amber-500/10 text-2xl font-bold text-amber-700">
                  {getCompanyInitials(selectedCompany.name)}
                </div>
                <h4 className="mt-4 text-xl font-bold text-slate-900">{selectedCompany.name}</h4>
                <p className="text-sm font-semibold text-brand-600">{selectedCompany.industry}</p>
                <div className="mt-4">
                  {getStatusBadge(selectedCompany.status)}
                </div>

                <div className="mt-6 flex gap-2">
                  {selectedCompany.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => {
                          approveCompany(selectedCompany.id);
                          setSelectedCompany(prev => ({ ...prev, status: 'approved' }));
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve Profile
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          rejectCompany(selectedCompany.id);
                          setSelectedCompany(prev => ({ ...prev, status: 'rejected' }));
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </>
                  )}
                  {selectedCompany.status === 'approved' && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        rejectCompany(selectedCompany.id);
                        setSelectedCompany(prev => ({ ...prev, status: 'rejected' }));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> Suspend Partner
                    </Button>
                  )}
                  {selectedCompany.status === 'rejected' && (
                    <Button
                      onClick={() => {
                        approveCompany(selectedCompany.id);
                        setSelectedCompany(prev => ({ ...prev, status: 'approved' }));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="h-3.5 w-3.5" /> Verify & Restore
                    </Button>
                  )}
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      deleteCompany(selectedCompany.id);
                      setSelectedCompany(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Profile
                  </Button>
                </div>
              </div>

              {/* Company Details Meta */}
              <div className="mt-6 space-y-4">
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">About Company</h5>
                  <p className="mt-2 text-sm leading-6 text-slate-600 bg-slate-50 rounded-2xl border border-slate-100 p-4">{selectedCompany.description}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <Users2 className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400">Workforce</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedCompany.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400">Active Jobs</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedCompany.activeJobs} positions</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Registration Date</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedCompany.joinedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <LinkIcon className="h-5 w-5 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400">Corporate Portal</p>
                    <a 
                      href={selectedCompany.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-semibold text-brand-600 hover:underline truncate block"
                    >
                      {selectedCompany.website}
                    </a>
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

export default AdminCompaniesPage;

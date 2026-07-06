import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  X, 
  Trash2, 
  ShieldAlert, 
  CheckCircle, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  UserCheck,
  Building
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageTransition from '../../components/common/PageTransition';

function AdminUsersPage() {
  useDocumentTitle('Manage Users');
  const { users, addUser, updateUserStatus, deleteUser } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserOrg, setNewUserOrg] = useState(''); // College or Company
  const [newUserSub, setNewUserSub] = useState(''); // Degree or Title

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const details = {};
    if (newUserRole === 'student') {
      details.college = newUserOrg || 'Unknown College';
      details.degree = newUserSub || 'B.Tech';
      details.gradYear = '2027';
      details.resume = 'uploaded_resume.pdf';
    } else if (newUserRole === 'recruiter') {
      details.company = newUserOrg || 'Unknown Company';
      details.title = newUserSub || 'Talent Lead';
    } else {
      details.accessLevel = 'Administrator';
    }

    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      details
    });

    // Reset form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserOrg('');
    setNewUserSub('');
    setIsAddModalOpen(false);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'student': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'recruiter': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'admin': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'active' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Manage Platform Users</h2>
          <p className="mt-1 text-sm text-slate-500">Oversee all roles, approve privileges, and manage account statuses.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)} 
          className="flex items-center gap-2 self-start rounded-2xl bg-brand-600 px-4 py-2.5 text-sm text-white hover:bg-brand-700"
        >
          <UserPlus className="h-4 w-4" /> Add New User
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name or email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:bg-white"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Administrators</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Data Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="group transition hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-sm font-bold text-brand-700">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.joinedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(user.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => updateUserStatus(user.id, 'suspended')}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Suspend User"
                          >
                            <ShieldAlert className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 transition"
                            title="Activate User"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No users matching filters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-over User Details Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
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
                <h3 className="text-lg font-bold text-slate-950">Identity Summary</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-xl p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center border-b border-slate-100 pb-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[32px] bg-brand-500/10 text-2xl font-bold text-brand-700">
                  {getInitials(selectedUser.name)}
                </div>
                <h4 className="mt-4 text-xl font-bold text-slate-900">{selectedUser.name}</h4>
                <span className={`mt-2 inline-flex rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${getRoleBadgeClass(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
                
                <div className="mt-6 flex gap-2">
                  {selectedUser.status === 'active' ? (
                    <Button 
                      variant="secondary"
                      onClick={() => {
                        updateUserStatus(selectedUser.id, 'suspended');
                        setSelectedUser(prev => ({ ...prev, status: 'suspended' }));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" /> Suspend
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary"
                      onClick={() => {
                        updateUserStatus(selectedUser.id, 'active');
                        setSelectedUser(prev => ({ ...prev, status: 'active' }));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Activate
                    </Button>
                  )}
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      deleteUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>

              {/* Profile Details Meta */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Email Address</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Join Date</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedUser.joinedDate}</p>
                  </div>
                </div>

                {selectedUser.role === 'student' && (
                  <>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                      <GraduationCap className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">College / Institute</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedUser.details?.college}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Degree Course</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedUser.details?.degree} (Grad: {selectedUser.details?.gradYear})</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedUser.role === 'recruiter' && (
                  <>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                      <Building className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Company Affiliate</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedUser.details?.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Designation</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedUser.details?.title}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-slate-900"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-950">Add Platform User</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sen"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@domain.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Role Privilege</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500"
                  >
                    <option value="student">Student</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {newUserRole !== 'admin' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                        {newUserRole === 'student' ? 'College Name' : 'Company Name'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. IIT Delhi"
                        value={newUserOrg}
                        onChange={(e) => setNewUserOrg(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                        {newUserRole === 'student' ? 'Degree Course' : 'Title / Designation'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech ECE"
                        value={newUserSub}
                        onChange={(e) => setNewUserSub(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs bg-brand-600 hover:bg-brand-700 text-white"
                  >
                    Submit Access Grant
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </PageTransition>
  );
}

export default AdminUsersPage;

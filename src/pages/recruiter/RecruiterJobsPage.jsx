import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BriefcaseBusiness, 
  MapPin, 
  IndianRupee, 
  Users, 
  PlusCircle, 
  X, 
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

function RecruiterJobsPage() {
  const { jobs, addJob, applications } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [skillsText, setSkillsText] = useState('');

  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term)
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !company || !location || !salary) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const skills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    addJob({
      title,
      company,
      location,
      salary,
      skills,
    });

    setIsModalOpen(false);
    toast.success('Job posting created successfully!');
    
    // Clear form
    setTitle('');
    setCompany('');
    setLocation('');
    setSalary('');
    setSkillsText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Job board manager</h1>
          <p className="text-slate-500 mt-1">Publish new roles, monitor candidate submission rates, and manage skills metadata.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 text-sm font-semibold transition shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" /> Publish New Job
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-full border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-500"
          placeholder="Filter jobs by title, company, or city..."
        />
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="text-center py-12">
          <BriefcaseBusiness className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900 mt-4">No job listings found</h3>
          <p className="text-slate-500 mt-2">Publish your first job posting to start gathering applicants.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map((job) => {
            // Compute candidate count from dynamic applications
            const applicants = applications.filter((app) => app.jobId === job.id);

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-soft transition duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <p className="text-sm font-semibold text-slate-500 mt-0.5">{job.company}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100 uppercase">
                      {job.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-slate-400" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Required Skills</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {job.skills.map((skill) => (
                          <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-brand-600" />
                    <span>{applicants.length} Total Applicants</span>
                  </div>
                  <span>Posted: {job.postedDate}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Publish Job Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              className="w-full max-w-lg rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Publish job opportunity</h3>
                  <p className="text-sm text-slate-500 mt-1">Submit job coordinates to publish on campus boards.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
                    placeholder="e.g. Associate Backend Developer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
                    placeholder="e.g. Google India"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location *</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
                      placeholder="e.g. Bengaluru (Hybrid)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Salary Range *</label>
                    <input
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
                      placeholder="e.g. ₹1,200,000 - ₹1,800,000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
                    placeholder="e.g. Java, Spring Boot, Microservices, AWS"
                  />
                  <p className="mt-1.5 text-[10px] text-slate-400 font-medium">Keywords will be mapped dynamically against parsed candidate resume nodes.</p>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <Button type="submit" className="rounded-xl px-5 py-3 text-sm">
                    Publish Role
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RecruiterJobsPage;

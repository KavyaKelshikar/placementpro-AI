import { motion } from 'framer-motion';
import { BriefcaseBusiness, Heart, MapPin, IndianRupee, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

function StudentSavedJobsPage() {
  const { user } = useAuth();
  const { savedJobs, jobs, applications, applyToJob, saveJob } = useData();

  // Find saved jobs
  const mySavedJobIds = savedJobs
    .filter((s) => s.studentEmail === user?.email)
    .map((s) => s.jobId);

  const mySavedJobs = jobs.filter((job) => mySavedJobIds.includes(job.id));

  const appliedJobIds = new Set(
    applications.filter((app) => app.studentEmail === user?.email).map((app) => app.jobId)
  );

  const handleApply = (jobId) => {
    applyToJob(jobId);
    toast.success('Applied successfully!');
  };

  const handleRemove = (jobId) => {
    saveJob(jobId);
    toast.success('Removed from bookmarks.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Saved jobs</h1>
        <p className="text-slate-500">Keep track of opportunities you flagged for application or review.</p>
      </div>

      {mySavedJobs.length === 0 ? (
        <Card className="text-center py-12">
          <Heart className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900 mt-4">No saved jobs</h3>
          <p className="text-slate-500 mt-2">Flag roles in the Recommendations page to bookmark them for later review.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mySavedJobs.map((job) => {
            const isApplied = appliedJobIds.has(job.id);

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-soft transition duration-300"
              >
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-0.5">{job.company}</p>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <IndianRupee className="h-4 w-4 text-slate-400" />
                      {job.salary}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleRemove(job.id)}
                    className="rounded-full p-3 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 transition"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Button
                    disabled={isApplied}
                    onClick={() => handleApply(job.id)}
                    className="rounded-full px-5 py-3 text-sm font-semibold"
                  >
                    {isApplied ? 'Applied' : 'Apply Now'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentSavedJobsPage;

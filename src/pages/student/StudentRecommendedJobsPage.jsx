import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BriefcaseBusiness, 
  MapPin, 
  IndianRupee, 
  Sparkles, 
  CheckCircle2, 
  Heart,
  Bookmark
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

function StudentRecommendedJobsPage() {
  const { user } = useAuth();
  const { jobs, applications, savedJobs, applyToJob, saveJob, getStudentProfile } = useData();
  const studentProfile = getStudentProfile();
  const studentSkills = studentProfile?.skills || [];

  const [filterMatched, setFilterMatched] = useState(false);

  // Compute applications and bookmarks maps for quick lookup
  const appliedJobIds = new Set(
    applications.filter((app) => app.studentEmail === user?.email).map((app) => app.jobId)
  );

  const savedJobIds = new Set(
    savedJobs.filter((s) => s.studentEmail === user?.email).map((s) => s.jobId)
  );

  // Helper to compute matched skills and matchmaking score
  const getJobMetrics = (job) => {
    const jobSkills = job.skills || [];
    const matched = jobSkills.filter((s) => studentSkills.includes(s));
    
    // Match score: percentage of job skills satisfied, default to 45% if empty skills list
    const matchPercentage = jobSkills.length > 0 
      ? Math.round((matched.length / jobSkills.length) * 100) 
      : 40;

    return {
      matched,
      matchPercentage,
    };
  };

  const processedJobs = jobs.map((job) => {
    const { matched, matchPercentage } = getJobMetrics(job);
    return {
      ...job,
      matchedSkills: matched,
      matchPercentage,
    };
  });

  // Sort jobs by match percentage (highest first)
  const sortedJobs = [...processedJobs].sort((a, b) => b.matchPercentage - a.matchPercentage);

  const filteredJobs = filterMatched 
    ? sortedJobs.filter((job) => job.matchedSkills.length > 0)
    : sortedJobs;

  const handleApply = (jobId) => {
    applyToJob(jobId);
    toast.success('Application submitted successfully!');
  };

  const handleSave = (jobId) => {
    const isSaved = savedJobIds.has(jobId);
    saveJob(jobId);
    if (isSaved) {
      toast.success('Job removed from bookmarks.');
    } else {
      toast.success('Job bookmarked successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 font-sans">AI job recommendations</h1>
          <p className="text-slate-500 mt-1">Explore job boards matching your scanned resume nodes and profile certifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterMatched(!filterMatched)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              filterMatched 
                ? 'border-brand-600 bg-brand-50 text-brand-700' 
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {filterMatched ? 'Showing Matching Roles' : 'Filter by Skill Match'}
          </button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="text-center py-12">
          <BriefcaseBusiness className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900 mt-4">No jobs match your criteria</h3>
          <p className="text-slate-500 mt-2">Try updating your skills in the Profile section or uploading a resume to discover listings.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobIds.has(job.id);
            const isSaved = savedJobIds.has(job.id);

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-soft duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition">
                        {job.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-600 mt-0.5">{job.company}</p>
                    </div>
                    {/* Dynamic Match Badge */}
                    <div className={`rounded-2xl border px-3 py-1 text-xs font-bold flex items-center gap-1.5 ${
                      job.matchPercentage >= 70 
                        ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                        : job.matchPercentage >= 40
                        ? 'border-amber-100 bg-amber-50 text-amber-700'
                        : 'border-slate-100 bg-slate-50 text-slate-500'
                    }`}>
                      <Sparkles className="h-3 w-3 shrink-0" />
                      {job.matchPercentage}% match rate
                    </div>
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
                    <span className="flex items-center gap-1.5">
                      Posted: {job.postedDate}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Skills</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(job.skills || []).map((skill) => {
                        const isStudentSkill = studentSkills.includes(skill);
                        return (
                          <span
                            key={skill}
                            className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                              isStudentSkill
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleSave(job.id)}
                    className={`rounded-full p-3 border transition ${
                      isSaved
                        ? 'border-rose-100 bg-rose-50 text-rose-600'
                        : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
                    }`}
                    title={isSaved ? 'Unsave Job' : 'Save Job'}
                  >
                    <Heart className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
                  </button>

                  <Button
                    disabled={isApplied}
                    onClick={() => handleApply(job.id)}
                    className="rounded-full px-5 py-3 text-sm font-semibold flex items-center gap-2"
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Applied
                      </>
                    ) : (
                      'Apply Now'
                    )}
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

export default StudentRecommendedJobsPage;

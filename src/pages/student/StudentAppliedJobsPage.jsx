import { motion } from 'framer-motion';
import { BriefcaseBusiness, Calendar, Star, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const statusSteps = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offer Made'];

function StudentAppliedJobsPage() {
  const { user } = useAuth();
  const { applications } = useData();

  const myApplications = applications.filter((app) => app.studentEmail === user?.email);

  const getStepIndex = (status) => {
    if (status === 'Rejected') return -1;
    const idx = statusSteps.indexOf(status);
    return idx !== -1 ? idx : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Your applications</h1>
        <p className="text-slate-500">Monitor active application steps, technical assessments, and recruiter decisions.</p>
      </div>

      {myApplications.length === 0 ? (
        <Card className="text-center py-12">
          <BriefcaseBusiness className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900 mt-4">No applications submitted yet</h3>
          <p className="text-slate-500 mt-2">Explore available roles under the Recommended Jobs section and submit applications.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {myApplications.map((app) => {
            const stepIndex = getStepIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6 hover:shadow-soft transition duration-300"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-0.5">{app.company}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Applied on {app.appliedDate}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isRejected 
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : app.status === 'Interview Scheduled'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : app.status === 'Shortlisted'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        : 'bg-slate-50 text-slate-700 border border-slate-100'
                    }`}>
                      {app.status}
                    </div>
                    {app.resumeScore && (
                      <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        AI Score: {app.resumeScore}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Tracking Timeline */}
                {!isRejected ? (
                  <div className="border-t border-slate-100 pt-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Application pipeline progress</p>
                    <div className="relative flex justify-between items-center w-full max-w-xl mx-auto">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
                      <div 
                        className="absolute top-1/2 left-0 h-0.5 bg-brand-500 -translate-y-1/2 -z-10 transition-all duration-500"
                        style={{ width: `${(stepIndex / (statusSteps.length - 1)) * 100}%` }}
                      ></div>

                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= stepIndex;
                        const isCurrent = idx === stepIndex;

                        return (
                          <div key={step} className="flex flex-col items-center text-center gap-2">
                            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition duration-300 ${
                              isDone
                                ? 'bg-brand-600 border-brand-600 text-white shadow-soft'
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}>
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-semibold ${
                              isCurrent 
                                ? 'text-brand-600'
                                : isDone 
                                ? 'text-slate-800' 
                                : 'text-slate-400'
                            }`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-slate-100 pt-4 text-sm text-slate-500 flex items-center gap-2 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    <span>This application was not selected by the recruiter for this role. Keep applying to other matching opportunities!</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentAppliedJobsPage;

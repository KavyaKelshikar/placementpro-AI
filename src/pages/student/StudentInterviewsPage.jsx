import { motion } from 'framer-motion';
import { CalendarDays, Video, Clock, Award, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

function StudentInterviewsPage() {
  const { user } = useAuth();
  const { interviews } = useData();

  const myInterviews = interviews.filter((i) => i.studentEmail === user?.email);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Your interview board</h1>
        <p className="text-slate-500">View upcoming calendars, schedule timings, and join active video calls.</p>
      </div>

      {myInterviews.length === 0 ? (
        <Card className="text-center py-12">
          <CalendarDays className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900 mt-4">No interviews scheduled yet</h3>
          <p className="text-slate-500 mt-2">When a recruiter shortlists your profile and schedules an assessment, it will show up here.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {myInterviews.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-soft transition duration-300"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{session.company}</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-0.5">{session.jobTitle}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-100">
                    {session.type} Round
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{new Date(session.dateTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{new Date(session.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                  <CheckCircle className="h-4 w-4" />
                  Status: {session.status}
                </div>
                <a
                  href="https://meet.google.com/abc-defg-hij"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-semibold transition"
                >
                  <Video className="h-3.5 w-3.5" /> Join Meeting
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentInterviewsPage;

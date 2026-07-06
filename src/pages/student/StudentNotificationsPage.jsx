import { motion } from 'framer-motion';
import { BellRing, Sparkles, Trash2, CheckSquare } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

function StudentNotificationsPage() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, clearNotifications } = useData();

  const myNotifications = notifications.filter(
    (n) => n.email === user?.email || n.email === user?.role
  );

  const handleMarkAllRead = () => {
    myNotifications.forEach((n) => markNotificationRead(n.id));
    toast.success('All notifications marked as read.');
  };

  const handleClear = () => {
    clearNotifications();
    toast.success('Notification board cleared.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Notifications board</h1>
          <p className="text-slate-500 mt-1">Audit log profiles, matchmaking results, and scheduled interview calendars.</p>
        </div>
        
        {myNotifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition"
            >
              <CheckSquare className="h-3.5 w-3.5" /> Mark all read
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 hover:bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700 transition border border-rose-100"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </button>
          </div>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <Card className="text-center py-12">
          <BellRing className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900 mt-4">All caught up</h3>
          <p className="text-slate-500 mt-2">No new notifications are pending at this time.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {myNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => markNotificationRead(notif.id)}
              className={`rounded-[24px] border p-5 flex items-start gap-4 transition cursor-pointer ${
                notif.read
                  ? 'border-slate-200 bg-white/70 opacity-75'
                  : 'border-brand-200 bg-brand-50/20 shadow-sm'
              }`}
            >
              <div className={`rounded-xl p-2 shrink-0 ${
                notif.read ? 'bg-slate-100 text-slate-400' : 'bg-brand-100 text-brand-700'
              }`}>
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`text-sm font-bold ${notif.read ? 'text-slate-700' : 'text-slate-950'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.date}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{notif.detail}</p>
                {!notif.read && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-600 mt-2"></span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentNotificationsPage;

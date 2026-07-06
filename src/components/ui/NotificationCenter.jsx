import { BellRing, Sparkles, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

function NotificationCenter() {
  const { user } = useAuth();
  const { notifications, clearNotifications } = useData();

  // Filter notifications relevant to this user or their role
  const myNotifications = notifications.filter(
    (n) => n.email === user?.email || n.email === user?.role
  ).slice(0, 5); // display up to 5 latest notifications

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-brand-600" />
            <p className="text-sm font-semibold text-slate-800">Notifications</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
              {myNotifications.length} active
            </span>
            {myNotifications.length > 0 && (
              <button 
                onClick={clearNotifications}
                className="text-slate-400 hover:text-rose-600 transition" 
                title="Clear all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {myNotifications.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-400">
              No new notifications. You are all caught up!
            </div>
          ) : (
            myNotifications.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-slate-50 transition">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.detail}</p>
                    <span className="mt-2 block text-[10px] text-slate-400">{item.date}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCenter;


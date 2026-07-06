import { motion } from 'framer-motion';

function StatCard({ title, value, detail, icon: Icon, accent = 'brand' }) {
  const accentClasses = {
    brand: 'from-brand-600/10 to-brand-500/5 text-brand-600',
    emerald: 'from-emerald-600/10 to-emerald-500/5 text-emerald-600',
    amber: 'from-amber-600/10 to-amber-500/5 text-amber-600',
    slate: 'from-slate-600/10 to-slate-500/5 text-slate-600',
  };

  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-[20px] border border-slate-200 bg-white/90 p-5 shadow-[0_16px_45px_-18px_rgba(15,23,42,0.25)] backdrop-blur">
      <div className={`inline-flex rounded-2xl bg-gradient-to-br ${accentClasses[accent]} p-3`}>
        {Icon ? <Icon className="h-5 w-5" /> : null}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-500">{detail}</p> : null}
    </motion.div>
  );
}

export default StatCard;

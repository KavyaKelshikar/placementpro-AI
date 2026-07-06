import { motion } from 'framer-motion';

function ChartPanel({ title, description, children }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} className="rounded-[20px] border border-slate-200 bg-white/90 p-6 shadow-[0_16px_45px_-18px_rgba(15,23,42,0.24)] backdrop-blur">
      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {children}
    </motion.div>
  );
}

export default ChartPanel;

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-4 w-24 rounded-full bg-slate-200" />
      <div className="mt-4 h-10 w-32 rounded-full bg-slate-200" />
      <div className="mt-4 h-3 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-3 w-5/6 rounded-full bg-slate-100" />
    </div>
  );
}

export default SkeletonCard;

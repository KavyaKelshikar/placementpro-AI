function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;

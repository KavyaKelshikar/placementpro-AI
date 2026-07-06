function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}

export default SectionHeading;

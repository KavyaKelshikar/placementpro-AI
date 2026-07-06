function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Page not found</h2>
        <p className="mt-3 text-sm text-slate-600">The route you requested is not available yet.</p>
      </div>
    </div>
  );
}

export default NotFoundPage;

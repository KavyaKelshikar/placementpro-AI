import { Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BellRing, Home, MoonStar } from 'lucide-react';
import Sidebar from './Sidebar';
import SearchBar from '../ui/SearchBar';
import SkeletonCard from '../ui/SkeletonCard';

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-[24px] bg-slate-200/50" />
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

function DashboardShell() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0">
        <div className="mb-6 flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-[16px] border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 hover:border-brand-300"
              title="Go to Homepage"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Homepage</span>
            </Link>
            <button className="rounded-[16px] border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50">
              <MoonStar className="h-4 w-4" />
            </button>
            <button className="rounded-[16px] border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50">
              <BellRing className="h-4 w-4" />
            </button>
          </div>
        </div>
        <Suspense fallback={<DashboardLoading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default DashboardShell;


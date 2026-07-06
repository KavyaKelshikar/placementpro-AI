import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardShell from './components/dashboard/DashboardShell';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

// Student lazy pages
const StudentDashboardPage = lazy(() => import('./pages/student/StudentDashboardPage'));
const StudentProfilePage = lazy(() => import('./pages/student/StudentProfilePage'));
const StudentResumePage = lazy(() => import('./pages/student/StudentResumePage'));
const StudentAppliedJobsPage = lazy(() => import('./pages/student/StudentAppliedJobsPage'));
const StudentSavedJobsPage = lazy(() => import('./pages/student/StudentSavedJobsPage'));
const StudentNotificationsPage = lazy(() => import('./pages/student/StudentNotificationsPage'));
const StudentInterviewsPage = lazy(() => import('./pages/student/StudentInterviewsPage'));
const StudentRecommendedJobsPage = lazy(() => import('./pages/student/StudentRecommendedJobsPage'));

// Recruiter lazy pages
const RecruiterDashboardPage = lazy(() => import('./pages/recruiter/RecruiterDashboardPage'));
const RecruiterCompanyPage = lazy(() => import('./pages/recruiter/RecruiterCompanyPage'));
const RecruiterJobsPage = lazy(() => import('./pages/recruiter/RecruiterJobsPage'));
const RecruiterApplicantsPage = lazy(() => import('./pages/recruiter/RecruiterApplicantsPage'));
const RecruiterInterviewsPage = lazy(() => import('./pages/recruiter/RecruiterInterviewsPage'));
const RecruiterAnalyticsPage = lazy(() => import('./pages/recruiter/RecruiterAnalyticsPage'));

// Admin lazy pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminCompaniesPage = lazy(() => import('./pages/admin/AdminCompaniesPage'));
const AdminJobsPage = lazy(() => import('./pages/admin/AdminJobsPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
import NotFoundPage from './pages/NotFoundPage';
import { AdminDataProvider } from './context/AdminDataContext';
import { Outlet } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

function AdminLayout() {
  return (
    <AdminDataProvider>
      <Outlet />
    </AdminDataProvider>
  );
}

function App() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-100"><span className="text-xl font-medium text-slate-600">Loading…</span></div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<LoginPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardShell />
            </ProtectedRoute>
          }
        >
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/resume" element={<StudentResumePage />} />
          <Route path="/student/applied-jobs" element={<StudentAppliedJobsPage />} />
          <Route path="/student/saved-jobs" element={<StudentSavedJobsPage />} />
          <Route path="/student/notifications" element={<StudentNotificationsPage />} />
          <Route path="/student/interviews" element={<StudentInterviewsPage />} />
          <Route path="/student/recommended" element={<StudentRecommendedJobsPage />} />

          <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
          <Route path="/recruiter/company" element={<RecruiterCompanyPage />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
          <Route path="/recruiter/applicants" element={<RecruiterApplicantsPage />} />
          <Route path="/recruiter/interviews" element={<RecruiterInterviewsPage />} />
          <Route path="/recruiter/analytics" element={<RecruiterAnalyticsPage />} />

          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/companies" element={<AdminCompaniesPage />} />
            <Route path="/admin/jobs" element={<AdminJobsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      <Toaster position="top-right" />
      
    </Suspense>
  );
}

export default App;

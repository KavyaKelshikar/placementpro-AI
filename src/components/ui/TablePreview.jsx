import { useData } from '../../context/DataContext';

function TablePreview() {
  const { applications } = useData();

  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
      {applications.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">
          No applicants logged. Submit resume & apply as a student to see records update here!
        </div>
      ) : (
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Candidate</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {applications.slice(0, 5).map((app) => (
              <tr key={app.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{app.studentName}</td>
                <td className="px-4 py-3 text-slate-600">{app.jobTitle}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    app.status === 'Applied' 
                      ? 'bg-blue-50 text-blue-700' 
                      : app.status === 'Shortlisted' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : app.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{app.appliedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TablePreview;


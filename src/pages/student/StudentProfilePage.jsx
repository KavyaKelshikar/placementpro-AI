import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, School, GraduationCap, Calendar, BarChart, Sparkles, X, PlusCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import GitHubIntegration from '../../components/github/GitHubIntegration';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

function StudentProfilePage() {
  const { user } = useAuth();
  const { getStudentProfile, updateStudentProfile } = useData();
  const studentProfile = getStudentProfile();

  const [college, setCollege] = useState(studentProfile.college || '');
  const [degree, setDegree] = useState(studentProfile.degree || '');
  const [gradYear, setGradYear] = useState(studentProfile.gradYear || '');
  const [cgpa, setCgpa] = useState(studentProfile.cgpa || '');
  const [skills, setSkills] = useState(studentProfile.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Sync profile details if they change (e.g. from resume upload)
  useEffect(() => {
    setCollege(studentProfile.college || '');
    setDegree(studentProfile.degree || '');
    setGradYear(studentProfile.gradYear || '');
    setCgpa(studentProfile.cgpa || '');
    setSkills(studentProfile.skills || []);
  }, [studentProfile.college, studentProfile.degree, studentProfile.gradYear, studentProfile.cgpa, studentProfile.skills?.length]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStudentProfile({
      college,
      degree,
      gradYear,
      cgpa,
      skills,
    });
    toast.success('Profile updated successfully!');
  };

  const handleGitHubSkillSync = (newSkills) => {
    const merged = [...new Set([...skills, ...newSkills])];
    setSkills(merged);
    updateStudentProfile({ college, degree, gradYear, cgpa, skills: merged });
    toast.success(`✅ ${newSkills.length} GitHub skills synced to your profile!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Academic & Professional profile</h1>
        <p className="text-slate-500">Manage your educational coordinates and capability tags for AI recruitment mapping.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <Card className="text-center flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-white border border-slate-200">
            <div className="h-20 w-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-3xl font-bold border border-brand-200 shadow-inner">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500 capitalize">{user?.role} portal</p>
            <div className="mt-4 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 border border-brand-100">
              {user?.email}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" /> Match readiness
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Recruiters filter profiles by matching skillsets, degree level, and academic records. Keep your profile up to date to remain visible.
            </p>
          </Card>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <School className="h-4 w-4 text-slate-400" /> College / Institution
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 transition"
                  placeholder="e.g. IIT Bombay"
                  required
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <GraduationCap className="h-4 w-4 text-slate-400" /> Degree & Major
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 transition"
                  placeholder="e.g. B.Tech CSE"
                  required
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400" /> Graduation Year
                </label>
                <input
                  type="text"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 transition"
                  placeholder="e.g. 2027"
                  required
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <BarChart className="h-4 w-4 text-slate-400" /> Academic GPA / CGPA
                </label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 transition"
                  placeholder="e.g. 9.1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                Skills / Competencies
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 rounded-[16px] border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 transition"
                  placeholder="Add a new skill node (e.g. Tailwind CSS)"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center justify-center rounded-[16px] bg-slate-900 hover:bg-slate-800 px-4 py-3 text-white transition text-sm font-semibold shrink-0"
                >
                  <PlusCircle className="h-4 w-4 mr-1.5" /> Add
                </button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {skills.length === 0 ? (
                  <span className="text-sm text-slate-400">No skill tags mapped. Add some above or parse a resume.</span>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 border border-brand-100"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-brand-500 hover:text-brand-900 hover:bg-brand-100/50 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full">
              Save Profile Changes
            </Button>
          </form>
        </Card>
      </div>

      {/* GitHub Integration Section */}
      <div>
        <div className="mb-3">
          <h2 className="text-base font-semibold text-slate-900">Developer Identity</h2>
          <p className="text-xs text-slate-500 mt-0.5">Connect your GitHub to auto-detect tech stack and boost your match score.</p>
        </div>
        <GitHubIntegration
          existingSkills={skills}
          onSyncSkills={handleGitHubSkillSync}
        />
      </div>
    </div>
  );
}

export default StudentProfilePage;

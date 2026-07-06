import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw,
  AlertCircle,
  X,
  Plus,
  Wifi,
  WifiOff
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const KNOWN_SKILLS = [
  'Python', 'C++', 'Java', 'Data Structures', 'Algorithms', 'OOPS', 'DBMS', 'OS Basics',
  'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Next.js', 'Flask', 'Express.js',
  'MongoDB', 'MySQL', 'Git', 'Docker', 'Jira', 'Linux', 'AWS', 'VS Code', 'Figma',
  'UI/UX Design', 'User Research', 'Wireframing', 'Prototyping', 'Interaction Design',
  'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Spring Boot', 'Machine Learning',
  'SQL', 'Data Science', 'Pandas', 'Jupyter', 'Kubernetes', 'Microservices'
];

const mockInsightsSets = [
  [
    'Excellent technical match for Fullstack & Frontend engineering pipelines.',
    'Highly readable resume layout with clear projects and impact statements.',
    'Strong skill alignment with top Google and Meta postings.'
  ],
  [
    'Advanced mathematical background with practical PyTorch internships.',
    'Resume mentions data pipeline work but could detail cloud infra more.',
    'Excellent fit for AI Research Intern roles.'
  ],
  [
    'Clean design layout, strong highlight of case studies and user problems.',
    'Portfolio link is verified. Good presentation of user metrics.',
    'Highly compatible with L5 Product Design roles.'
  ],
  [
    'Solid backend systems understanding. Spring boot codebase references are active.',
    'Docker knowledge is present, would benefit from adding Kubernetes projects.',
    'Good fit for Cloud Backend Developer opportunities.'
  ]
];

function scanTextForSkills(text) {
  const normalizedText = text.toLowerCase();
  const foundSkills = [];
  
  // Custom checks for common variations
  if (normalizedText.includes('data structures') || normalizedText.includes('dsa')) {
    foundSkills.push('Data Structures');
  }
  if (normalizedText.includes('algorithms') || normalizedText.includes('algo')) {
    foundSkills.push('Algorithms');
  }
  if (normalizedText.includes('oops') || normalizedText.includes('object oriented')) {
    foundSkills.push('OOPS');
  }
  if (normalizedText.includes('dbms') || normalizedText.includes('database management')) {
    foundSkills.push('DBMS');
  }
  if (normalizedText.includes('os basics') || normalizedText.includes('operating system')) {
    foundSkills.push('OS Basics');
  }
  
  KNOWN_SKILLS.forEach(skill => {
    if (['Data Structures', 'Algorithms', 'OOPS', 'DBMS', 'OS Basics'].includes(skill)) return;
    
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      foundSkills.push(skill);
    }
  });

  return Array.from(new Set(foundSkills));
}

function StudentResumePage() {
  const { uploadResumeInfo, getStudentProfile } = useData();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [apiError, setApiError] = useState(null);
  const [usedRealAI, setUsedRealAI] = useState(false);
  
  const studentProfile = getStudentProfile();
  const resumeInfo = studentProfile?.resume || {};

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setApiError(null);
    }
  };

  // ─── Upload Tab: real API call to backend → Python AI service ───────────────
  const triggerUploadAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    setApiError(null);
    setAnalysisStep(1);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      setAnalysisStep(2);

      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiBase}/api/resumes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setAnalysisStep(3);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `Server error ${response.status}`);
      }

      // Build insights from API suggestions
      const suggestions = data.analysis?.suggestions || [
        'Upload processed successfully.',
        'Skills have been synced to your student profile.',
        'Apply to jobs to see your match scores.',
      ];

      uploadResumeInfo({
        fileName: file.name,
        score: data.analysis?.score ?? 80,
        skills: data.analysis?.skillsMatched || [],
        insights: suggestions,
      });

      setUsedRealAI(true);
      setFile(null);
    } catch (err) {
      console.error('Resume upload error:', err);
      setApiError(err.message);
    } finally {
      setAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // ─── Paste Tab: client-side text scanner (no backend needed) ────────────────
  const triggerPasteAnalysis = () => {
    if (!pastedText.trim()) return;
    setAnalyzing(true);
    setAnalysisStep(1);

    setTimeout(() => setAnalysisStep(2), 800);
    setTimeout(() => setAnalysisStep(3), 1600);

    setTimeout(() => {
      const skills = scanTextForSkills(pastedText);
      const score = Math.min(95, 65 + skills.length * 2.5);

      const finalSkills = skills.length > 0 ? skills : ['Communication', 'Problem Solving'];
      const finalScore = skills.length > 0 ? score : 50;

      uploadResumeInfo({
        fileName: 'Pasted Resume Text',
        score: Math.round(finalScore),
        skills: finalSkills,
        insights: [
          `Identified ${finalSkills.length} core technical capabilities from pasted profile.`,
          finalSkills.includes('React') || finalSkills.includes('Node.js')
            ? 'Strong match for modern web development pipelines.'
            : 'Consider adding more web technologies to boost matching score.',
          'Make sure to detail key project impacts and achievements.',
        ],
      });

      setUsedRealAI(false);
      setAnalyzing(false);
      setAnalysisStep(0);
      setPastedText('');
    }, 2400);
  };

  const triggerAnalysis = () => {
    if (activeTab === 'upload') triggerUploadAnalysis();
    else triggerPasteAnalysis();
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = (resumeInfo.skills || []).filter(s => s !== skillToRemove);
    uploadResumeInfo({
      fileName: resumeInfo.fileName,
      score: resumeInfo.score,
      skills: updatedSkills,
      insights: resumeInfo.insights,
    });
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const cleanSkill = newSkillInput.trim();
    if ((resumeInfo.skills || []).includes(cleanSkill)) {
      setNewSkillInput('');
      return;
    }
    const updatedSkills = [...(resumeInfo.skills || []), cleanSkill];
    uploadResumeInfo({
      fileName: resumeInfo.fileName,
      score: resumeInfo.score,
      skills: updatedSkills,
      insights: resumeInfo.insights,
    });
    setNewSkillInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Resume intelligence gateway</h1>
        <p className="text-slate-500">Submit resumes to calculate matchmaking scores, parse technology nodes, and build job scores.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex border-b border-slate-100 mb-5">
              <button
                onClick={() => setActiveTab('upload')}
                className={`pb-3 text-sm font-semibold transition ${
                  activeTab === 'upload' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-400 hover:text-slate-600'
                } mr-6`}
              >
                Upload File
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`pb-3 text-sm font-semibold transition ${
                  activeTab === 'paste' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Paste Resume Text
              </button>
            </div>

            {!analyzing ? (
              activeTab === 'upload' ? (
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Upload documents</h3>
                  <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX formats (max 5MB)</p>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                      dragging ? 'border-brand-600 bg-brand-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <UploadCloud className="h-10 w-10 text-slate-400" />
                    <p className="mt-4 text-sm font-semibold text-slate-950">Drag & drop resume file</p>
                    <p className="mt-1 text-xs text-slate-500">or browse local computer</p>
                    <input
                      type="file"
                      id="resume-file-input"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                    />
                    <Button
                      onClick={() => document.getElementById('resume-file-input').click()}
                      variant="outline"
                      className="mt-5 rounded-full"
                    >
                      Browse Files
                    </Button>

                    {file && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2 text-sm text-brand-700">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-brand-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-slate-900">Paste Profile Text</h3>
                  <p className="text-xs text-slate-500 mt-1">Paste plain resume text to run our real-time capability parser.</p>
                  <textarea
                    rows={8}
                    placeholder="Paste your resume content, technical skills list, or biography here..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 p-4 text-sm focus:border-brand-500 focus:outline-none bg-slate-50/30"
                  />
                </div>
              )
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <RefreshCw className="h-8 w-8 text-brand-600 animate-spin" />
                <h4 className="mt-6 text-base font-semibold text-slate-900">Analyzing resume...</h4>
                
                <div className="mt-6 w-full max-w-xs space-y-3">
                  <div className="flex items-center gap-3 text-left text-sm">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold ${analysisStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {analysisStep > 1 ? '✓' : '1'}
                    </div>
                    <span className={analysisStep >= 1 ? 'font-medium text-slate-800' : 'text-slate-400'}>Extracting text nodes...</span>
                  </div>
                  <div className="flex items-center gap-3 text-left text-sm">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold ${analysisStep >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {analysisStep > 2 ? '✓' : '2'}
                    </div>
                    <span className={analysisStep >= 2 ? 'font-medium text-slate-800' : 'text-slate-400'}>Indexing technical capabilities...</span>
                  </div>
                  <div className="flex items-center gap-3 text-left text-sm">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold ${analysisStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {analysisStep > 3 ? '✓' : '3'}
                    </div>
                    <span className={analysisStep >= 3 ? 'font-medium text-slate-800' : 'text-slate-400'}>Generating AI match score...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-700">
              <WifiOff className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-semibold">Upload failed</p>
                <p className="mt-0.5 text-red-600 leading-relaxed">{apiError}</p>
                <p className="mt-1 text-red-500">Make sure you are logged in and the server is running on port 5000.</p>
              </div>
            </div>
          )}

          <Button
            disabled={analyzing || (activeTab === 'upload' ? !file : !pastedText.trim())}
            onClick={triggerAnalysis}
            className="mt-6 w-full rounded-full"
          >
            {analyzing ? 'Processing...' : activeTab === 'upload' ? 'Upload & Analyze Resume' : 'Analyze Pasted Text'}
          </Button>
        </Card>

        {resumeInfo.uploaded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-brand-600 to-slate-900 text-white shadow-soft relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
                    <Sparkles className="h-4 w-4" /> AI Resume Audit
                    {usedRealAI && (
                      <span className="ml-2 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        <Wifi className="h-2.5 w-2.5" /> Python AI
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm text-brand-200">Processed Document</p>
                  <h3 className="text-xl font-bold truncate max-w-[260px]">{resumeInfo.fileName}</h3>
                  <p className="text-xs text-brand-300 mt-1">Uploaded on {resumeInfo.date}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-[20px] p-4 text-center border border-white/10">
                  <p className="text-xs text-brand-200">Match score</p>
                  <p className="text-4xl font-extrabold mt-1">{resumeInfo.score}%</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-brand-400/10 blur-2xl"></div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">Extracted Skills (Capabilities)</h4>
                <span className="text-[10px] text-slate-400 font-medium">Interactive mode active</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(resumeInfo.skills || []).map((skill) => (
                  <span 
                    key={skill} 
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-50/70 border border-brand-100 pl-3 pr-2 py-1 text-xs font-semibold text-brand-700"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="rounded-full p-0.5 hover:bg-brand-200 hover:text-brand-900 text-brand-400 transition"
                      title={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {(!resumeInfo.skills || resumeInfo.skills.length === 0) && (
                  <span className="text-xs text-slate-400 italic">No skills added yet.</span>
                )}
              </div>

              {/* Add skill control */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Type skill & press Enter (e.g. Next.js, Flask)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none bg-slate-50/50"
                />
                <Button
                  onClick={handleAddSkill}
                  variant="outline"
                  className="rounded-xl px-4 py-2 text-xs font-semibold border-slate-200 hover:bg-slate-50"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>
            </Card>

            <Card>
              <h4 className="text-sm font-semibold text-slate-900">AI Scoring & Feedback</h4>
              <ul className="mt-3 space-y-2.5">
                {(resumeInfo.insights || []).map((insight, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ) : (
          <div className="rounded-[24px] border border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center">
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-600 border border-amber-100">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h4 className="mt-6 text-lg font-semibold text-slate-900">No Resume Processed</h4>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
              Upload your resume or paste profile text on the left to receive AI match score audits, key talent tags, and direct job recommendations immediately.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentResumePage;

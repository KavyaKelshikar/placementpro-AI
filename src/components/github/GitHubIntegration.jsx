import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Star,
  GitFork,
  Users,
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import Button from '../ui/Button';

// Map GitHub language names → skill tag labels used in the portal
const LANG_TO_SKILL = {
  JavaScript: 'JavaScript',
  TypeScript: 'TypeScript',
  Python: 'Python',
  Java: 'Java',
  'C++': 'C++',
  C: 'C',
  'C#': 'C#',
  Go: 'Go',
  Rust: 'Rust',
  Kotlin: 'Kotlin',
  Swift: 'Swift',
  Ruby: 'Ruby',
  PHP: 'PHP',
  HTML: 'HTML5',
  CSS: 'CSS3',
  Shell: 'Linux (Shell)',
  Dockerfile: 'Docker',
  Jupyter: 'Jupyter Notebook',
  SCSS: 'CSS3',
};

// Language badge colors
const LANG_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#239120',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Jupyter: '#DA5B0B',
  default: '#6366f1',
};

function LangDot({ lang }) {
  const color = LANG_COLORS[lang] || LANG_COLORS.default;
  return (
    <span className="flex items-center gap-1 text-[11px] text-slate-500">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {lang}
    </span>
  );
}

export default function GitHubIntegration({ existingSkills = [], onSyncSkills }) {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [synced, setSynced] = useState(false);

  const fetchGitHub = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);
    setDetectedSkills([]);
    setSynced(false);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username.trim()}`),
        fetch(
          `https://api.github.com/users/${username.trim()}/repos?sort=stars&per_page=8&type=owner`
        ),
      ]);

      if (!userRes.ok) {
        if (userRes.status === 404) throw new Error(`GitHub user "${username}" not found.`);
        if (userRes.status === 403) throw new Error('GitHub API rate limit reached. Try again in 1 minute.');
        throw new Error('Failed to fetch GitHub profile.');
      }

      const userData = await userRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];

      // Extract unique languages from repos
      const langSet = new Set();
      reposData.forEach((repo) => {
        if (repo.language) langSet.add(repo.language);
      });

      // Map to skill tags
      const skills = [...langSet]
        .map((lang) => LANG_TO_SKILL[lang] || lang)
        .filter((s) => !existingSkills.includes(s));

      setProfile(userData);
      setRepos(reposData.slice(0, 6));
      setDetectedSkills(skills);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = () => {
    if (onSyncSkills && detectedSkills.length > 0) {
      onSyncSkills(detectedSkills);
      setSynced(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchGitHub();
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-2.5">
          <Github className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">GitHub Profile Integration</p>
          <p className="text-xs text-slate-500">
            Sync your real-world tech stack from public repositories
          </p>
        </div>
      </div>

      {/* Username Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">
            github.com/
          </span>
          <input
            type="text"
            placeholder="your-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-[16px] border border-slate-200 py-3 pl-[108px] pr-4 text-sm font-mono outline-none focus:border-brand-500 transition"
          />
        </div>
        <Button
          onClick={fetchGitHub}
          disabled={loading || !username.trim()}
          className="rounded-[16px] px-5 shrink-0 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : profile ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <Github className="h-4 w-4" />
          )}
          {loading ? 'Fetching...' : profile ? 'Refresh' : 'Connect'}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Profile Card */}
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <img
                src={profile.avatar_url}
                alt={profile.login}
                className="h-14 w-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm">
                  {profile.name || profile.login}
                </p>
                <a
                  href={profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:underline flex items-center gap-1"
                >
                  @{profile.login} <ExternalLink className="h-3 w-3" />
                </a>
                {profile.bio && (
                  <p className="text-xs text-slate-500 mt-1 truncate">{profile.bio}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 text-right shrink-0">
                <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium justify-end">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                  {profile.public_repos} repos
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium justify-end">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  {profile.followers} followers
                </span>
              </div>
            </div>

            {/* Detected Skills */}
            {detectedSkills.length > 0 && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-semibold text-emerald-800">
                      {detectedSkills.length} New Skills Detected from your Repos
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {detectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      {skill}
                    </span>
                  ))}
                </div>

                {synced ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Skills synced to your profile!
                  </div>
                ) : (
                  <Button
                    onClick={handleSync}
                    className="rounded-full text-xs px-4 py-1.5 h-auto bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Sync {detectedSkills.length} Skills to Profile
                  </Button>
                )}
              </div>
            )}

            {detectedSkills.length === 0 && (
              <div className="text-center py-2 text-xs text-slate-400">
                All detected languages are already in your profile skills! ✅
              </div>
            )}

            {/* Top Repos Grid */}
            {repos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Top Repositories</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {repos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-200 hover:shadow-sm p-3 transition space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-brand-700 truncate leading-tight">
                          {repo.name}
                        </p>
                        <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-brand-400 shrink-0 mt-0.5" />
                      </div>
                      {repo.description && (
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        {repo.language && <LangDot lang={repo.language} />}
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Star className="h-3 w-3" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <GitFork className="h-3 w-3" />
                          {repo.forks_count}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

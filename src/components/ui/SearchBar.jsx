import { Search } from 'lucide-react';

function SearchBar({ placeholder = 'Search jobs, candidates, companies', ...props }) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
      <Search className="h-4 w-4 text-slate-400 shrink-0" />
      <input 
        type="search"
        className="w-full border-none bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-800" 
        placeholder={placeholder}
        aria-label={placeholder}
        {...props}
      />
    </div>
  );
}

export default SearchBar;

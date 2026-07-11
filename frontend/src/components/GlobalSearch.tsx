"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, CheckSquare, GitCompare, X, Loader2 } from "lucide-react";
import { globalSearchAction } from "@/app/actions/search";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await globalSearchAction(query);
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsOpen(false)} 
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search circulars, obligations, tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-lg"
          />
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
          ) : (
            <div className="flex items-center gap-1">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">ESC</kbd>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.length > 0 && query.length < 2 && (
            <div className="p-4 text-center text-sm text-slate-500">Type at least 2 characters to search...</div>
          )}
          
          {query.length >= 2 && results.length === 0 && !isSearching && (
            <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center">
              <Search className="h-8 w-8 text-slate-300 mb-3" />
              No results found for &quot;{query}&quot;
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((res, i) => (
                <button
                  key={`${res.id}-${i}`}
                  onClick={() => handleSelect(res.url)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-md shrink-0">
                      {res.type === 'Circular' ? <FileText className="h-4 w-4" /> : 
                       res.type === 'Obligation' ? <GitCompare className="h-4 w-4" /> : 
                       <CheckSquare className="h-4 w-4" />}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{res.title}</p>
                      <p className="text-xs text-slate-500 truncate">{res.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded ml-2 shrink-0">
                    {res.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

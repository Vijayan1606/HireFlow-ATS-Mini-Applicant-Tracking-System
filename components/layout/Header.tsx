'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  X,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Candidate } from '@/types/candidate';
import { getInitials } from '@/lib/utils/formatters';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenAddModal: () => void;
  title: string;
  subtitle?: string;
  candidates?: Candidate[];
  onSelectCandidate?: (candidate: Candidate) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenAddModal,
  title,
  subtitle,
  candidates = [],
  onSelectCandidate,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter candidates live for quick search dropdown
  const searchResults = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.trim().toLowerCase();
    return candidates.filter((c) => {
      const matchName = c.full_name?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      const matchPosition = c.position?.toLowerCase().includes(q);
      const matchSkills = c.skills?.some((s) => s.toLowerCase().includes(q));
      return matchName || matchEmail || matchPosition || matchSkills;
    });
  }, [candidates, globalSearch]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearchFocused(false);
    setShowMobileSearch(false);

    const term = globalSearch.trim();
    if (term) {
      router.push(`/candidates?search=${encodeURIComponent(term)}`);
    } else {
      router.push('/candidates');
    }
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setIsSearchFocused(false);
    setShowMobileSearch(false);
    if (onSelectCandidate) {
      onSelectCandidate(candidate);
    } else {
      router.push(`/candidates/${candidate.id}`);
    }
  };

  const clearSearch = () => {
    setGlobalSearch('');
    if (pathname === '/candidates') {
      router.push('/candidates');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
          aria-label="Open navigation sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Image
          src="/logo.png"
          alt="HireFlow Logo"
          width={32}
          height={32}
          className="h-8 w-8 rounded-lg lg:hidden shadow-xs object-cover shrink-0"
        />

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-slate-500 leading-tight truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar with Live Preview Dropdown */}
      <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-6 relative">
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search candidates, skills, or positions... (Press Enter)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-9 pr-8 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Live Search Autocomplete Dropdown */}
        {isSearchFocused && globalSearch.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Quick Match Results</span>
              <span>{searchResults.length} found</span>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length > 0 ? (
                searchResults.slice(0, 5).map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => handleSelectCandidate(candidate)}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(candidate.full_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {candidate.full_name}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                          <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
                          {candidate.position}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="stage" stage={candidate.stage} size="sm" />
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No candidates match &quot;{globalSearch}&quot;
                </div>
              )}
            </div>

            <button
              onClick={() => handleSearchSubmit()}
              className="w-full py-2.5 px-3 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100/70 transition-colors border-t border-indigo-100 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View all matching records in Candidates Table</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right: Actions, Mobile Search Button, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => {
            setShowMobileSearch(!showMobileSearch);
            setTimeout(() => mobileSearchRef.current?.focus(), 100);
          }}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <Button
          onClick={onOpenAddModal}
          size="sm"
          className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Candidate</span>
        </Button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Hiring Activity & Alerts
                  </h4>
                  <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    3 New
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        David Kowalski moved to Hired
                      </p>
                      <p className="text-[11px] text-slate-500">Signed offer for DevOps Specialist</p>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Interview scheduled with Alexandra Chen
                      </p>
                      <p className="text-[11px] text-slate-500">System Architecture panel on Friday</p>
                      <span className="text-[10px] text-slate-400">1h ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        New Application: Julian Banks
                      </p>
                      <p className="text-[11px] text-slate-500">Product Designer (UI/UX)</p>
                      <span className="text-[10px] text-slate-400">2h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recruiter Avatar Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
            SJ
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Sarah Jenkins</p>
            <p className="text-[10px] text-slate-500">Lead Recruiter</p>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="absolute inset-x-0 top-16 bg-white border-b border-slate-200 p-3 shadow-md z-40 md:hidden animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                ref={mobileSearchRef}
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search candidates, skills, positions..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none"
              />
              {globalSearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm" variant="primary">
              Search
            </Button>
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          {/* Mobile search results preview */}
          {globalSearch.trim().length > 0 && (
            <div className="mt-2 max-h-60 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-xs">
              {searchResults.length > 0 ? (
                searchResults.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCandidate(c)}
                    className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{c.full_name}</p>
                      <p className="text-[11px] text-slate-500">{c.position}</p>
                    </div>
                    <Badge variant="stage" stage={c.stage} size="sm" />
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  No matches for &quot;{globalSearch}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

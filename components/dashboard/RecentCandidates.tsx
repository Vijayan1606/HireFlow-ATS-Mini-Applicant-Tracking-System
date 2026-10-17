'use client';

import React from 'react';
import Link from 'next/link';
import { Candidate } from '@/types/candidate';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils/formatters';
import { ArrowRight, Eye, Briefcase, Award } from 'lucide-react';

interface RecentCandidatesProps {
  candidates: Candidate[];
  onViewCandidate: (candidate: Candidate) => void;
  onOpenAddModal: () => void;
  isLoading?: boolean;
}

export const RecentCandidates: React.FC<RecentCandidatesProps> = ({
  candidates,
  onViewCandidate,
  onOpenAddModal,
  isLoading = false,
}) => {
  const recentList = candidates.slice(0, 5);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs animate-pulse h-96" />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Recent Candidates
            </h3>
            <p className="text-xs text-slate-500">
              Latest applicants entered into the pipeline
            </p>
          </div>

          <Link
            href="/candidates"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {recentList.length > 0 ? (
            recentList.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => onViewCandidate(candidate)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {getInitials(candidate.full_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {candidate.full_name}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
                      {candidate.position}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="stage" stage={candidate.stage} size="sm" />
                  <span className="hidden sm:inline-block text-[11px] text-slate-400">
                    {formatRelativeTime(candidate.applied_at)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewCandidate(candidate);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center space-y-2">
              <p className="text-xs text-slate-500">No candidates available yet.</p>
              <Button size="sm" onClick={onOpenAddModal} variant="outline">
                Add Candidate
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2">
        <Link
          href="/candidates"
          className="w-full inline-flex justify-center items-center py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Manage All Candidates ({candidates.length})
        </Link>
      </div>
    </div>
  );
};

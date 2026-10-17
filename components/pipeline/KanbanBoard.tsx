'use client';

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Candidate, CandidateStage, CANDIDATE_STAGES } from '@/types/candidate';
import { KanbanColumn } from './KanbanColumn';
import { Search, Filter, Plus, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface KanbanBoardProps {
  candidates: Candidate[];
  onViewCandidate: (candidate: Candidate) => void;
  onStageChange: (candidateId: string, stage: CandidateStage) => void;
  onOpenAddModal: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onViewCandidate,
  onStageChange,
  onOpenAddModal,
}) => {
  const [pipelineSearch, setPipelineSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  // Trigger celebratory confetti on Hired
  const handleStageTransition = (candidateId: string, targetStage: CandidateStage) => {
    if (targetStage === 'Hired') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch {
        // Fallback gracefully if canvas-confetti is unavailable
      }
    }
    onStageChange(candidateId, targetStage);
  };

  const uniqueRoles = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      if (c.position) set.add(c.position);
    });
    return Array.from(set).sort();
  }, [candidates]);

  // Filter candidates for pipeline
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      if (pipelineSearch.trim()) {
        const q = pipelineSearch.trim().toLowerCase();
        const matches =
          c.full_name.toLowerCase().includes(q) ||
          c.position.toLowerCase().includes(q) ||
          c.skills?.some((s) => s.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (selectedRole !== 'All' && c.position !== selectedRole) {
        return false;
      }

      return true;
    });
  }, [candidates, pipelineSearch, selectedRole]);

  // Group by stage
  const columnsData = useMemo(() => {
    const stages: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
    const groups: Record<CandidateStage, Candidate[]> = {
      Applied: [],
      Screening: [],
      Interview: [],
      Offer: [],
      Hired: [],
    };

    filteredCandidates.forEach((c) => {
      if (groups[c.stage]) {
        groups[c.stage].push(c);
      }
    });

    return stages.map((stage) => ({
      stage,
      candidates: groups[stage],
    }));
  }, [filteredCandidates]);

  return (
    <div className="space-y-4">
      {/* Kanban Filters and Quick Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          {/* Quick Filter Search */}
          <div className="relative flex-1 max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={pipelineSearch}
              onChange={(e) => setPipelineSearch(e.target.value)}
              placeholder="Search pipeline cards..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-7 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            />
            {pipelineSearch && (
              <button
                onClick={() => setPipelineSearch('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 px-3 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none cursor-pointer max-w-[180px]"
          >
            <option value="All">All Positions</option>
            {uniqueRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Pipeline
          </Button>
        </div>
      </div>

      {/* Horizontal Kanban Board Scroll Area */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x">
        {columnsData.map((col) => (
          <KanbanColumn
            key={col.stage}
            stage={col.stage}
            candidates={col.candidates}
            totalCandidates={filteredCandidates.length}
            onViewCandidate={onViewCandidate}
            onStageChange={handleStageTransition}
          />
        ))}
      </div>
    </div>
  );
};

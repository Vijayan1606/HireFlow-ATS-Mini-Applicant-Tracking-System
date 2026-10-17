'use client';

import React, { useState } from 'react';
import { Candidate, CandidateStage, CANDIDATE_STAGES } from '@/types/candidate';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils/cn';

interface KanbanColumnProps {
  stage: CandidateStage;
  candidates: Candidate[];
  totalCandidates: number;
  onViewCandidate: (candidate: Candidate) => void;
  onStageChange: (candidateId: string, stage: CandidateStage) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  candidates,
  totalCandidates,
  onViewCandidate,
  onStageChange,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const stageConfig = CANDIDATE_STAGES.find((s) => s.value === stage);
  const percentage = totalCandidates > 0 ? Math.round((candidates.length / totalCandidates) * 100) : 0;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const candidateId = e.dataTransfer.getData('text/plain');
    if (candidateId) {
      onStageChange(candidateId, stage);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col rounded-2xl bg-slate-100/80 p-3 min-w-[280px] w-full sm:w-80 shrink-0 transition-all border',
        isDragOver
          ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-400/20 shadow-md'
          : 'border-slate-200/80 shadow-2xs'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-2xs',
              stage === 'Applied' && 'bg-slate-500',
              stage === 'Screening' && 'bg-amber-500',
              stage === 'Interview' && 'bg-purple-600',
              stage === 'Offer' && 'bg-indigo-600',
              stage === 'Hired' && 'bg-emerald-600'
            )}
          />
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">
            {stageConfig?.label || stage}
          </h3>
          <span className="inline-flex items-center justify-center h-5 px-2 rounded-full text-xs font-bold bg-white text-slate-700 shadow-2xs border border-slate-200/80">
            {candidates.length}
          </span>
        </div>

        <span className="text-[11px] font-medium text-slate-400">
          {percentage}%
        </span>
      </div>

      {/* Cards Scrollable Container */}
      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-250px)] min-h-[160px] p-0.5">
        {candidates.map((candidate) => (
          <KanbanCard
            key={candidate.id}
            candidate={candidate}
            onViewCandidate={onViewCandidate}
            onStageChange={onStageChange}
          />
        ))}

        {candidates.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-center p-3 text-slate-400 text-xs">
            <span>No candidates in {stage.toLowerCase()}</span>
            <span className="text-[10px] text-slate-400 mt-1">Drag candidate cards here</span>
          </div>
        )}
      </div>
    </div>
  );
};

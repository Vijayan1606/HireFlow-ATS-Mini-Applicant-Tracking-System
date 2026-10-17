'use client';

import React from 'react';
import { Candidate, CandidateStage, CANDIDATE_STAGES } from '@/types/candidate';
import { Badge } from '@/components/ui/Badge';
import { formatDate, getInitials } from '@/lib/utils/formatters';
import {
  Briefcase,
  Award,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Eye,
  GripVertical,
} from 'lucide-react';

interface KanbanCardProps {
  candidate: Candidate;
  onViewCandidate: (candidate: Candidate) => void;
  onStageChange: (candidateId: string, stage: CandidateStage) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  candidate,
  onViewCandidate,
  onStageChange,
}) => {
  const currentStageIndex = CANDIDATE_STAGES.findIndex((s) => s.value === candidate.stage);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', candidate.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleNextStage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStageIndex < CANDIDATE_STAGES.length - 1) {
      onStageChange(candidate.id, CANDIDATE_STAGES[currentStageIndex + 1].value);
    }
  };

  const handlePrevStage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStageIndex > 0) {
      onStageChange(candidate.id, CANDIDATE_STAGES[currentStageIndex - 1].value);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onViewCandidate(candidate)}
      className="group relative rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top Header: Avatar, Name, Gripper */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            {getInitials(candidate.full_name)}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
              {candidate.full_name}
            </h4>
            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
              <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[150px]">{candidate.position}</span>
            </p>
          </div>
        </div>

        <div className="text-slate-300 group-hover:text-slate-400">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Experience & Application Date */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 py-1.5 border-y border-slate-100 my-2">
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <Award className="h-3 w-3 text-slate-400" />
          {candidate.experience_years} yrs exp
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <Calendar className="h-3 w-3 text-slate-400" />
          {formatDate(candidate.applied_at)}
        </span>
      </div>

      {/* Skills tags */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {candidate.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="skill" size="sm">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center font-medium">
              +{candidate.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer Stage Mover Quick Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewCandidate(candidate);
          }}
          className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          Details
        </button>

        <div className="flex items-center gap-1">
          {currentStageIndex > 0 && (
            <button
              onClick={handlePrevStage}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={`Move back to ${CANDIDATE_STAGES[currentStageIndex - 1].label}`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}

          {currentStageIndex < CANDIDATE_STAGES.length - 1 && (
            <button
              onClick={handleNextStage}
              className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              title={`Move to ${CANDIDATE_STAGES[currentStageIndex + 1].label}`}
            >
              <span>{CANDIDATE_STAGES[currentStageIndex + 1].label}</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Candidate, CandidateStage, CANDIDATE_STAGES } from '@/types/candidate';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils/formatters';
import {
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Award,
  ExternalLink,
  Edit2,
  Trash2,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
  onStageChange: (candidateId: string, newStage: CandidateStage) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onEdit,
  onDelete,
  onStageChange,
}) => {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Profile"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Candidate Header Profile Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/90">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
              {getInitials(candidate.full_name)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {candidate.full_name}
                </h3>
                <Badge variant="stage" stage={candidate.stage} />
              </div>
              <p className="text-sm font-medium text-slate-600 mt-0.5 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                {candidate.position}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(candidate);
              }}
              className="flex-1 sm:flex-initial"
            >
              <Edit2 className="h-3.5 w-3.5 mr-1 text-slate-500" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClose();
                onDelete(candidate);
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-initial"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Quick Stage Transition Selector */}
        <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50">
          <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-900 mb-2">
            Move Recruitment Stage
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {CANDIDATE_STAGES.map((s) => {
              const isCurrent = candidate.stage === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onStageChange(candidate.id, s.value)}
                  className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-all text-center border cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white hover:bg-indigo-100/60 text-slate-700 border-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Contact & Basics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact & Application
            </h4>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${candidate.email}`}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  {candidate.email}
                </a>
              </div>

              {candidate.phone ? (
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <a
                    href={`tel:${candidate.phone}`}
                    className="hover:underline font-medium text-slate-700"
                  >
                    {candidate.phone}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-4 w-4 text-slate-300 shrink-0" />
                  <span>No phone provided</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span>
                  Applied on <strong className="font-semibold">{formatDate(candidate.applied_at)}</strong> ({formatRelativeTime(candidate.applied_at)})
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <span>
                  Last updated {formatRelativeTime(candidate.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Professional Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Qualifications
            </h4>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Award className="h-4 w-4 text-slate-400 shrink-0" />
                <span>
                  Experience: <strong className="font-semibold">{candidate.experience_years} years</strong>
                </span>
              </div>

              {candidate.resume_url ? (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-indigo-600 shrink-0" />
                  <a
                    href={candidate.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline font-medium flex items-center gap-1"
                  >
                    View Resume / Portfolio
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400">
                  <ExternalLink className="h-4 w-4 text-slate-300 shrink-0" />
                  <span>No resume link attached</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Skills & Core Tech
          </h4>
          {candidate.skills && candidate.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="skill">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No skills listed</p>
          )}
        </div>

        {/* Recruiter Notes */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            Recruiter Notes & Evaluation
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {candidate.notes || 'No evaluation notes recorded yet. Click Edit to add notes.'}
          </div>
        </div>

        {/* Modal Close */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

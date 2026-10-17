'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell, useATS } from '@/components/layout/AppShell';
import { Candidate, CandidateStage, CANDIDATE_STAGES } from '@/types/candidate';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils/formatters';
import {
  ArrowLeft,
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
  ChevronRight,
} from 'lucide-react';

function CandidateDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const { openEditModal, openDeleteModal, handleStageChange } = useATS();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCandidate = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/candidates/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCandidate(json.data);
      } else {
        setCandidate(null);
      }
    } catch (err) {
      console.error('Error fetching candidate:', err);
      setCandidate(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const onStageSelect = async (newStage: CandidateStage) => {
    if (!candidate) return;
    await handleStageChange(candidate.id, newStage);
    setCandidate((prev) => (prev ? { ...prev, stage: newStage } : null));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/candidates" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Candidates
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="text-slate-800 font-semibold">{candidate?.full_name || 'Candidate Details'}</span>
      </div>

      {isLoading ? (
        <div className="h-96 rounded-2xl bg-white border border-slate-200 p-8 animate-pulse" />
      ) : !candidate ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <h3 className="text-lg font-bold text-slate-800">Candidate Not Found</h3>
          <p className="text-sm text-slate-500">The requested candidate profile does not exist or has been removed.</p>
          <div className="pt-2">
            <Link href="/candidates">
              <Button variant="primary">Return to Candidates List</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                {getInitials(candidate.full_name)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                    {candidate.full_name}
                  </h2>
                  <Badge variant="stage" stage={candidate.stage} />
                </div>
                <p className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  {candidate.position}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => openEditModal(candidate)}
                className="flex-1 sm:flex-initial"
              >
                <Edit2 className="h-4 w-4 mr-1.5 text-slate-500" />
                Edit Details
              </Button>
              <Button
                variant="ghost"
                onClick={() => openDeleteModal(candidate)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-initial"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>

          {/* Quick Stage Progression */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Move Recruitment Stage
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CANDIDATE_STAGES.map((s) => {
                const isCurrent = candidate.stage === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => onStageSelect(s.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-indigo-50/60 text-slate-700 border-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Candidate Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-700">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Email Address</p>
                    <a href={`mailto:${candidate.email}`} className="text-indigo-600 hover:underline font-medium">
                      {candidate.email}
                    </a>
                  </div>
                </div>

                {candidate.phone && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="font-medium text-slate-800">{candidate.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Application Date</p>
                    <p className="font-medium text-slate-800">
                      {formatDate(candidate.applied_at)} ({formatRelativeTime(candidate.applied_at)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Last Updated</p>
                    <p className="font-medium text-slate-800">{formatRelativeTime(candidate.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience and Skills */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                Professional Experience
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Years of Experience</p>
                    <p className="font-medium text-slate-800">{candidate.experience_years} years</p>
                  </div>
                </div>

                {candidate.resume_url ? (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Resume / Portfolio Link</p>
                      <a
                        href={candidate.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Open Resume Document <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-400">
                    <ExternalLink className="h-4 w-4 text-slate-300 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Resume / Portfolio</p>
                      <p>No document attached</p>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-slate-400 mb-1.5">Skills & Competencies</p>
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
              </div>
            </div>
          </div>

          {/* Recruiter Notes Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-slate-400" />
              Recruiter Notes & Hiring Team Evaluation
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {candidate.notes || 'No notes have been added for this candidate yet. Click "Edit Details" to add interview observations.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CandidateDetailPage() {
  return (
    <AppShell
      headerTitle="Candidate Profile"
      headerSubtitle="Detailed view of candidate history, skills, and qualifications"
    >
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Loading candidate profile...</div>}>
        <CandidateDetailContent />
      </Suspense>
    </AppShell>
  );
}

'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell, useATS } from '@/components/layout/AppShell';
import { CandidatesTable } from '@/components/candidates/CandidatesTable';
import { Button } from '@/components/ui/Button';
import { Plus, Users, RefreshCw } from 'lucide-react';

function CandidatesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialStage = searchParams.get('stage') || 'All';

  const {
    candidates,
    isLoading,
    openAddModal,
    openEditModal,
    openDetailModal,
    openDeleteModal,
    handleStageChange,
    refreshData,
  } = useATS();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Candidate Directory
            </h2>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded-full">
              {candidates.length} Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, filter, view profiles, and update candidate hiring stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshData()}
            className="flex-1 sm:flex-initial"
          >
            <RefreshCw className="h-4 w-4 mr-1 text-slate-500" />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openAddModal}
            className="flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Main Candidates Table */}
      <CandidatesTable
        candidates={candidates}
        onViewCandidate={openDetailModal}
        onEditCandidate={openEditModal}
        onDeleteCandidate={openDeleteModal}
        onStageChange={handleStageChange}
        onOpenAddModal={openAddModal}
      />
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <AppShell
      headerTitle="Candidates"
      headerSubtitle="Manage applicant records, evaluations, and qualifications"
    >
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Loading candidate directory...</div>}>
        <CandidatesContent />
      </Suspense>
    </AppShell>
  );
}

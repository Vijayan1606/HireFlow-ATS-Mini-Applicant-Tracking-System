'use client';

import React from 'react';
import { AppShell, useATS } from '@/components/layout/AppShell';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { Button } from '@/components/ui/Button';
import { Plus, Kanban, RefreshCw } from 'lucide-react';

function PipelineView() {
  const {
    candidates,
    isLoading,
    openAddModal,
    openDetailModal,
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
              Recruitment Pipeline
            </h2>
            <span className="text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200/80 px-2 py-0.5 rounded-full">
              Kanban View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Drag and drop candidates across stages or use the quick stage advance actions.
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

      {/* Interactive Kanban Board */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-80 h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200/60"
            />
          ))}
        </div>
      ) : (
        <KanbanBoard
          candidates={candidates}
          onViewCandidate={openDetailModal}
          onStageChange={handleStageChange}
          onOpenAddModal={openAddModal}
        />
      )}
    </div>
  );
}

export default function PipelinePage() {
  return (
    <AppShell
      headerTitle="Hiring Pipeline"
      headerSubtitle="Visual Kanban board of active candidates by hiring stage"
    >
      <PipelineView />
    </AppShell>
  );
}

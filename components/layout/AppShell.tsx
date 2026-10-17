'use client';

import React, { useState, useEffect, createContext, useContext, Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { CandidateFormModal } from '@/components/candidates/CandidateFormModal';
import { CandidateDetailModal } from '@/components/candidates/CandidateDetailModal';
import { DeleteConfirmModal } from '@/components/candidates/DeleteConfirmModal';
import { Candidate, CandidateStage } from '@/types/candidate';

interface ATSContextType {
  candidates: Candidate[];
  isLoading: boolean;
  isLiveDb: boolean;
  refreshData: () => Promise<void>;
  openAddModal: () => void;
  openEditModal: (candidate: Candidate) => void;
  openDetailModal: (candidate: Candidate) => void;
  openDeleteModal: (candidate: Candidate) => void;
  handleStageChange: (candidateId: string, stage: CandidateStage) => Promise<void>;
}

const ATSContext = createContext<ATSContextType | undefined>(undefined);

export const useATS = () => {
  const context = useContext(ATSContext);
  if (!context) {
    throw new Error('useATS must be used within ATSProvider');
  }
  return context;
};

export const AppShellContent: React.FC<{
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}> = ({ children, headerTitle = 'HireFlow ATS', headerSubtitle = 'Recruitment Management System' }) => {
  const { success, error: toastError } = useToast();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveDb, setIsLiveDb] = useState(false);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState<Candidate | null>(null);
  const [candidateToView, setCandidateToView] = useState<Candidate | null>(null);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/candidates');
      const json = await res.json();
      if (json.success) {
        setCandidates(json.data || []);
        setIsLiveDb(Boolean(json.isLiveDb));
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const openAddModal = () => {
    setCandidateToEdit(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (c: Candidate) => {
    setCandidateToEdit(c);
    setIsFormModalOpen(true);
  };

  const openDetailModal = (c: Candidate) => {
    setCandidateToView(c);
  };

  const openDeleteModal = (c: Candidate) => {
    setCandidateToDelete(c);
  };

  const handleStageChange = async (candidateId: string, newStage: CandidateStage) => {
    // Optimistic update in UI
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage, updated_at: new Date().toISOString() } : c))
    );

    if (candidateToView && candidateToView.id === candidateId) {
      setCandidateToView((prev) => (prev ? { ...prev, stage: newStage } : null));
    }

    try {
      const res = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to update stage');
      }

      success('Stage Updated', `Candidate moved to ${newStage}.`);
      fetchCandidates();
    } catch (err: any) {
      toastError('Update Failed', err.message || 'Could not update recruitment stage.');
      fetchCandidates(); // Rollback on failure
    }
  };

  const handleCandidateSaved = () => {
    fetchCandidates();
  };

  const handleCandidateDeleted = (deletedId: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== deletedId));
    if (candidateToView && candidateToView.id === deletedId) {
      setCandidateToView(null);
    }
  };

  return (
    <ATSContext.Provider
      value={{
        candidates,
        isLoading,
        isLiveDb,
        refreshData: fetchCandidates,
        openAddModal,
        openEditModal,
        openDetailModal,
        openDeleteModal,
        handleStageChange,
      }}
    >
      <div className="flex min-h-screen bg-slate-50/60 font-sans antialiased text-slate-900">
        {/* Sidebar */}
        <Suspense fallback={<aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white" />}>
          <Sidebar
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            isLiveDb={isLiveDb}
            onOpenAddModal={openAddModal}
          />
        </Suspense>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Suspense fallback={<header className="h-16 border-b border-slate-200 bg-white" />}>
            <Header
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
              onOpenAddModal={openAddModal}
              title={headerTitle}
              subtitle={headerSubtitle}
            />
          </Suspense>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Global Modals */}
        <CandidateFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setCandidateToEdit(null);
          }}
          candidateToEdit={candidateToEdit}
          onSuccess={handleCandidateSaved}
        />

        <CandidateDetailModal
          isOpen={Boolean(candidateToView)}
          onClose={() => setCandidateToView(null)}
          candidate={candidateToView}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onStageChange={handleStageChange}
        />

        <DeleteConfirmModal
          isOpen={Boolean(candidateToDelete)}
          onClose={() => setCandidateToDelete(null)}
          candidate={candidateToDelete}
          onDeleted={handleCandidateDeleted}
        />
      </div>
    </ATSContext.Provider>
  );
};

export const AppShell: React.FC<{
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}> = (props) => {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">Loading HireFlow ATS...</div>}>
        <AppShellContent {...props} />
      </Suspense>
    </ToastProvider>
  );
};

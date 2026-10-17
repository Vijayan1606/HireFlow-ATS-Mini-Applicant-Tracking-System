'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Candidate } from '@/types/candidate';
import { useToast } from '@/components/ui/Toast';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onDeleted: (candidateId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onDeleted,
}) => {
  const { success, error } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!candidate) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/candidates/${candidate.id}`, {
        method: 'DELETE',
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete candidate');
      }

      success('Candidate deleted', `${candidate.full_name} was removed from the database.`);
      onDeleted(candidate.id);
      onClose();
    } catch (err: any) {
      error('Delete Failed', err.message || 'Could not delete candidate record.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Candidate Record"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold">Are you sure you want to delete this candidate?</p>
            <p className="mt-1 text-red-700">
              This action cannot be undone. All application data, stage history, and notes for{' '}
              <strong className="font-semibold">{candidate.full_name}</strong> will be permanently deleted.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
          <p><span className="text-slate-500">Position:</span> <span className="font-medium text-slate-800">{candidate.position}</span></p>
          <p><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-800">{candidate.email}</span></p>
          <p><span className="text-slate-500">Current Stage:</span> <span className="font-medium text-slate-800">{candidate.stage}</span></p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Yes, Delete Candidate
          </Button>
        </div>
      </div>
    </Modal>
  );
};

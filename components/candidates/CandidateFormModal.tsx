'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, CandidateFormData } from '@/lib/validations/candidate';
import { Candidate, CANDIDATE_STAGES, POPULAR_POSITIONS, COMMON_SKILLS } from '@/types/candidate';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { User, Mail, Phone, Briefcase, Award, Link as LinkIcon, FileText, X } from 'lucide-react';

interface CandidateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateToEdit?: Candidate | null;
  onSuccess?: (candidate: Candidate) => void;
}

export const CandidateFormModal: React.FC<CandidateFormModalProps> = ({
  isOpen,
  onClose,
  candidateToEdit,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);

  const isEditing = Boolean(candidateToEdit);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema) as any,
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      position: '',
      skills: [],
      experience_years: 0,
      resume_url: '',
      stage: 'Applied',
      notes: '',
    },
  });

  useEffect(() => {
    if (candidateToEdit) {
      reset({
        full_name: candidateToEdit.full_name,
        email: candidateToEdit.email,
        phone: candidateToEdit.phone || '',
        position: candidateToEdit.position,
        skills: candidateToEdit.skills || [],
        experience_years: Number(candidateToEdit.experience_years) || 0,
        resume_url: candidateToEdit.resume_url || '',
        stage: candidateToEdit.stage,
        notes: candidateToEdit.notes || '',
      });
      setSkillsList(candidateToEdit.skills || []);
    } else {
      reset({
        full_name: '',
        email: '',
        phone: '',
        position: '',
        skills: [],
        experience_years: 0,
        resume_url: '',
        stage: 'Applied',
        notes: '',
      });
      setSkillsList([]);
    }
  }, [candidateToEdit, reset, isOpen]);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!skillsList.includes(trimmed)) {
      const updated = [...skillsList, trimmed];
      setSkillsList(updated);
      setValue('skills', updated);
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    const updated = skillsList.filter((s) => s !== skillToRemove);
    setSkillsList(updated);
    setValue('skills', updated);
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const onSubmit = async (data: CandidateFormData) => {
    try {
      setIsSubmitting(true);
      const url = isEditing ? `/api/candidates/${candidateToEdit!.id}` : '/api/candidates';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          skills: skillsList,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save candidate');
      }

      success(
        isEditing ? 'Candidate updated' : 'Candidate added',
        `${data.full_name} has been ${isEditing ? 'updated' : 'added to the recruitment pipeline'}.`
      );

      if (onSuccess) {
        onSuccess(json.data);
      }

      onClose();
    } catch (err: any) {
      console.error('Submission error:', err);
      error('Submission Error', err.message || 'Could not save candidate details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Candidate Profile' : 'Add New Candidate'}
      description={
        isEditing
          ? 'Update candidate contact information, hiring stage, and recruiter notes.'
          : 'Enter candidate details to enter them into the hiring pipeline.'
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('full_name')}
              placeholder="e.g. Maya Lin"
              icon={<User className="h-4 w-4" />}
              error={errors.full_name?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('email')}
              type="email"
              placeholder="e.g. maya.lin@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
            />
          </div>
        </div>

        {/* Phone & Position */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <Input
              {...register('phone')}
              placeholder="e.g. +1 (555) 234-5678"
              icon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Applied Position <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                {...register('position')}
                placeholder="e.g. Senior Full Stack Engineer"
                icon={<Briefcase className="h-4 w-4" />}
                error={errors.position?.message}
                list="popular-positions-list"
              />
              <datalist id="popular-positions-list">
                {POPULAR_POSITIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* Experience & Hiring Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('experience_years')}
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 4.5"
              icon={<Award className="h-4 w-4" />}
              error={errors.experience_years?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hiring Stage <span className="text-red-500">*</span>
            </label>
            <Select {...register('stage')} error={errors.stage?.message}>
              {CANDIDATE_STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Skills Tag Management */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Skills & Competencies <span className="text-slate-400 font-normal">(Press Enter or comma to add)</span>
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDownSkill}
              placeholder="Add skill (e.g. React, Next.js, Docker)..."
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSkill(skillInput)}
            >
              Add
            </Button>
          </div>

          {/* Quick Skill Suggestion Chips */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {COMMON_SKILLS.filter((s) => !skillsList.includes(s))
              .slice(0, 6)
              .map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => addSkill(s)}
                  className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md px-2 py-0.5 transition-colors cursor-pointer"
                >
                  + {s}
                </button>
              ))}
          </div>

          {/* Selected Skills Chips */}
          {skillsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs px-2 py-0.5 rounded-md font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-indigo-900 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Resume URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Resume / Portfolio Link <span className="text-slate-400 font-normal">(Optional URL)</span>
          </label>
          <Input
            {...register('resume_url')}
            placeholder="https://linkedin.com/in/... or drive link"
            icon={<LinkIcon className="h-4 w-4" />}
            error={errors.resume_url?.message}
          />
        </div>

        {/* Recruiter Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Recruiter Notes & Evaluation Summary <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Candidate background, interview takeaways, salary expectations..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>
          {errors.notes?.message && (
            <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Candidate'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

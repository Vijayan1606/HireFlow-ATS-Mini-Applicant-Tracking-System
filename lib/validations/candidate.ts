import { z } from 'zod';

export const candidateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters.')
    .max(100, 'Full name cannot exceed 100 characters.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(120, 'Email cannot exceed 120 characters.'),
  phone: z
    .string()
    .trim()
    .max(25, 'Phone number cannot exceed 25 characters.')
    .optional()
    .nullable()
    .or(z.literal('')),
  position: z
    .string()
    .trim()
    .min(2, 'Please specify an applied position.')
    .max(100, 'Position cannot exceed 100 characters.'),
  skills: z.array(z.string()).default([]),
  experience_years: z.coerce
    .number()
    .min(0, 'Experience cannot be negative.')
    .max(50, 'Experience cannot exceed 50 years.'),
  resume_url: z
    .string()
    .trim()
    .url('Please provide a valid URL.')
    .optional()
    .nullable()
    .or(z.literal('')),
  stage: z.enum(['Applied', 'Screening', 'Interview', 'Offer', 'Hired']).default('Applied'),
  notes: z
    .string()
    .trim()
    .max(2000, 'Notes cannot exceed 2000 characters.')
    .optional()
    .nullable()
    .or(z.literal('')),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;

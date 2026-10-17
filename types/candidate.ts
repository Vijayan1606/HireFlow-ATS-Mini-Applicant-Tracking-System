export type CandidateStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired';

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  position: string;
  skills: string[];
  experience_years: number;
  resume_url?: string | null;
  stage: CandidateStage;
  notes?: string | null;
  applied_at: string;
  created_at: string;
  updated_at: string;
}

export type CandidateCreateInput = Omit<Candidate, 'id' | 'applied_at' | 'created_at' | 'updated_at'> & {
  applied_at?: string;
};

export type CandidateUpdateInput = Partial<CandidateCreateInput>;

export interface DashboardStats {
  total: number;
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  hired: number;
  stageCounts: Record<CandidateStage, number>;
  averageExperience: number;
  positionCounts: Record<string, number>;
}

export interface CandidateFilterOptions {
  search?: string;
  stage?: CandidateStage | 'All';
  position?: string;
  minExperience?: number;
  maxExperience?: number;
  sortBy?: 'name' | 'applied_at' | 'experience' | 'stage';
  sortOrder?: 'asc' | 'desc';
}

export const CANDIDATE_STAGES: { label: string; value: CandidateStage; color: string; bg: string; border: string; text: string }[] = [
  { label: 'Applied', value: 'Applied', color: 'slate', bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-700' },
  { label: 'Screening', value: 'Screening', color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
  { label: 'Interview', value: 'Interview', color: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
  { label: 'Offer', value: 'Offer', color: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800' },
  { label: 'Hired', value: 'Hired', color: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
];

export const POPULAR_POSITIONS = [
  'Senior Full Stack Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'AI / ML Engineer',
  'DevOps & Cloud Specialist',
  'Product Designer (UI/UX)',
  'Product Manager',
  'QA Automation Engineer',
];

export const COMMON_SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'PostgreSQL',
  'Tailwind CSS',
  'Docker',
  'AWS',
  'GraphQL',
  'FastAPI',
  'Supabase',
  'Figma',
  'Redis',
  'CI/CD',
];

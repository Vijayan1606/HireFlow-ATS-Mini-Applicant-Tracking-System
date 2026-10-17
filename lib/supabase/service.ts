import { createServerSupabaseClient, isServerSupabaseConfigured } from './server';
import { Candidate, CandidateCreateInput, CandidateFilterOptions, CandidateStage, CandidateUpdateInput, DashboardStats } from '@/types/candidate';
import { INITIAL_SAMPLE_CANDIDATES } from './sample-data';

// Server-side in-memory mock store for demo / local evaluation without Supabase
let memoryStore: Candidate[] = [...INITIAL_SAMPLE_CANDIDATES];

export const CandidateService = {
  isConfigured(): boolean {
    return isServerSupabaseConfigured();
  },

  async getCandidates(filters?: CandidateFilterOptions): Promise<{ data: Candidate[]; count: number }> {
    const supabase = createServerSupabaseClient();

    if (supabase) {
      try {
        let query = supabase.from('candidates').select('*', { count: 'exact' });

        if (filters?.stage && filters.stage !== 'All') {
          query = query.eq('stage', filters.stage);
        }

        if (filters?.position && filters.position !== 'All') {
          query = query.eq('position', filters.position);
        }

        if (filters?.minExperience !== undefined) {
          query = query.gte('experience_years', filters.minExperience);
        }

        if (filters?.maxExperience !== undefined) {
          query = query.lte('experience_years', filters.maxExperience);
        }

        if (filters?.search && filters.search.trim()) {
          const s = filters.search.trim();
          query = query.or(
            `full_name.ilike.%${s}%,email.ilike.%${s}%,position.ilike.%${s}%`
          );
        }

        // Sorting
        const sortBy = filters?.sortBy || 'applied_at';
        const ascending = filters?.sortOrder === 'asc';

        if (sortBy === 'name') {
          query = query.order('full_name', { ascending });
        } else if (sortBy === 'experience') {
          query = query.order('experience_years', { ascending });
        } else if (sortBy === 'stage') {
          query = query.order('stage', { ascending });
        } else {
          query = query.order('applied_at', { ascending });
        }

        const { data, error, count } = await query;

        if (error) {
          console.error('[CandidateService.getCandidates] Supabase error:', error.message);
          throw error;
        }

        // Handle skills search filter on client if search keyword wasn't in text columns
        let result = (data as Candidate[]) || [];
        if (filters?.search && filters.search.trim()) {
          const s = filters.search.trim().toLowerCase();
          result = result.filter(
            (c) =>
              c.full_name.toLowerCase().includes(s) ||
              c.email.toLowerCase().includes(s) ||
              c.position.toLowerCase().includes(s) ||
              c.skills?.some((sk) => sk.toLowerCase().includes(s))
          );
        }

        return { data: result, count: count ?? result.length };
      } catch (err) {
        console.warn('[CandidateService] Falling back to memory store:', err);
      }
    }

    // Memory Store implementation
    let list = [...memoryStore];

    if (filters?.stage && filters.stage !== 'All') {
      list = list.filter((c) => c.stage === filters.stage);
    }

    if (filters?.position && filters.position !== 'All') {
      list = list.filter((c) => c.position === filters.position);
    }

    if (filters?.minExperience !== undefined) {
      list = list.filter((c) => c.experience_years >= filters.minExperience!);
    }

    if (filters?.maxExperience !== undefined) {
      list = list.filter((c) => c.experience_years <= filters.maxExperience!);
    }

    if (filters?.search && filters.search.trim()) {
      const s = filters.search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.full_name.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.position.toLowerCase().includes(s) ||
          c.skills?.some((sk) => sk.toLowerCase().includes(s))
      );
    }

    const sortBy = filters?.sortBy || 'applied_at';
    const ascending = filters?.sortOrder === 'asc';

    list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.full_name.localeCompare(b.full_name);
      } else if (sortBy === 'experience') {
        comparison = a.experience_years - b.experience_years;
      } else if (sortBy === 'stage') {
        comparison = a.stage.localeCompare(b.stage);
      } else {
        comparison = new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime();
        return ascending ? -comparison : comparison;
      }
      return ascending ? comparison : -comparison;
    });

    return { data: list, count: list.length };
  },

  async getCandidateById(id: string): Promise<Candidate | null> {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('candidates').select('*').eq('id', id).single();
        if (error) {
          if (error.code === 'PGRST116') return null; // Not found
          throw error;
        }
        return data as Candidate;
      } catch (err) {
        console.warn('[CandidateService.getCandidateById] Supabase error, falling back:', err);
      }
    }

    const found = memoryStore.find((c) => c.id === id);
    return found ? { ...found } : null;
  },

  async createCandidate(input: CandidateCreateInput): Promise<Candidate> {
    const now = new Date().toISOString();
    const candidateToInsert = {
      ...input,
      applied_at: input.applied_at || now,
    };

    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateToInsert])
        .select()
        .single();

      if (error) {
        console.error('[CandidateService.createCandidate] Supabase error:', error.message);
        throw new Error(error.message);
      }
      return data as Candidate;
    }

    // In-memory fallback
    const newCandidate: Candidate = {
      id: 'c' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36),
      full_name: input.full_name,
      email: input.email,
      phone: input.phone || null,
      position: input.position,
      skills: input.skills || [],
      experience_years: Number(input.experience_years) || 0,
      resume_url: input.resume_url || null,
      stage: input.stage || 'Applied',
      notes: input.notes || null,
      applied_at: candidateToInsert.applied_at,
      created_at: now,
      updated_at: now,
    };

    memoryStore.unshift(newCandidate);
    return newCandidate;
  },

  async updateCandidate(id: string, input: CandidateUpdateInput): Promise<Candidate> {
    const now = new Date().toISOString();
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('candidates')
        .update({
          ...input,
          updated_at: now,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[CandidateService.updateCandidate] Supabase error:', error.message);
        throw new Error(error.message);
      }
      return data as Candidate;
    }

    const index = memoryStore.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Candidate with id ${id} not found`);
    }

    const updated: Candidate = {
      ...memoryStore[index],
      ...input,
      updated_at: now,
    };
    memoryStore[index] = updated;
    return updated;
  },

  async updateCandidateStage(id: string, stage: CandidateStage): Promise<Candidate> {
    return this.updateCandidate(id, { stage });
  },

  async deleteCandidate(id: string): Promise<boolean> {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('candidates').delete().eq('id', id);
      if (error) {
        console.error('[CandidateService.deleteCandidate] Supabase error:', error.message);
        throw new Error(error.message);
      }
      return true;
    }

    const initialLength = memoryStore.length;
    memoryStore = memoryStore.filter((c) => c.id !== id);
    return memoryStore.length < initialLength;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const { data: candidates } = await this.getCandidates();

    const stageCounts: Record<CandidateStage, number> = {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Offer: 0,
      Hired: 0,
    };

    const positionCounts: Record<string, number> = {};
    let totalExp = 0;

    for (const c of candidates) {
      if (stageCounts[c.stage] !== undefined) {
        stageCounts[c.stage] += 1;
      }
      positionCounts[c.position] = (positionCounts[c.position] || 0) + 1;
      totalExp += Number(c.experience_years) || 0;
    }

    const total = candidates.length;
    const averageExperience = total > 0 ? parseFloat((totalExp / total).toFixed(1)) : 0;

    return {
      total,
      applied: stageCounts.Applied,
      screening: stageCounts.Screening,
      interview: stageCounts.Interview,
      offer: stageCounts.Offer,
      hired: stageCounts.Hired,
      stageCounts,
      averageExperience,
      positionCounts,
    };
  },

  async seedSampleData(): Promise<{ count: number }> {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      // Upsert sample candidates by email
      const { error } = await supabase
        .from('candidates')
        .upsert(
          INITIAL_SAMPLE_CANDIDATES.map((c) => ({
            full_name: c.full_name,
            email: c.email,
            phone: c.phone,
            position: c.position,
            skills: c.skills,
            experience_years: c.experience_years,
            resume_url: c.resume_url,
            stage: c.stage,
            notes: c.notes,
            applied_at: c.applied_at,
          })),
          { onConflict: 'email' }
        );

      if (error) {
        console.error('[CandidateService.seedSampleData] Supabase error:', error.message);
        throw new Error(error.message);
      }

      return { count: INITIAL_SAMPLE_CANDIDATES.length };
    }

    // In memory: reset to initial sample candidates
    memoryStore = [...INITIAL_SAMPLE_CANDIDATES];
    return { count: memoryStore.length };
  },

  async clearAllCandidates(): Promise<boolean> {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('candidates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) {
        console.error('[CandidateService.clearAllCandidates] Supabase error:', error.message);
        throw new Error(error.message);
      }
      return true;
    }

    memoryStore = [];
    return true;
  },
};

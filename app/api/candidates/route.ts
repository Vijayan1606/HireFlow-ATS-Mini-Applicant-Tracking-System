import { NextRequest, NextResponse } from 'next/server';
import { CandidateService } from '@/lib/supabase/service';
import { candidateSchema } from '@/lib/validations/candidate';
import { CandidateFilterOptions, CandidateStage } from '@/types/candidate';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const stage = (searchParams.get('stage') as CandidateStage | 'All') || undefined;
    const position = searchParams.get('position') || undefined;
    const minExp = searchParams.get('minExperience');
    const maxExp = searchParams.get('maxExperience');
    const sortBy = (searchParams.get('sortBy') as CandidateFilterOptions['sortBy']) || undefined;
    const sortOrder = (searchParams.get('sortOrder') as CandidateFilterOptions['sortOrder']) || undefined;

    const filters: CandidateFilterOptions = {
      search,
      stage,
      position,
      minExperience: minExp ? Number(minExp) : undefined,
      maxExperience: maxExp ? Number(maxExp) : undefined,
      sortBy,
      sortOrder,
    };

    const result = await CandidateService.getCandidates(filters);
    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.count,
      isLiveDb: CandidateService.isConfigured(),
    });
  } catch (error: any) {
    console.error('[API /api/candidates GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = candidateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const created = await CandidateService.createCandidate(validationResult.data);
    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'Candidate created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API /api/candidates POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create candidate' },
      { status: 500 }
    );
  }
}

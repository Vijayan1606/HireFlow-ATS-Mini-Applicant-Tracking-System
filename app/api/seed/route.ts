import { NextResponse } from 'next/server';
import { CandidateService } from '@/lib/supabase/service';

export async function POST() {
  try {
    const result = await CandidateService.seedSampleData();
    return NextResponse.json({
      success: true,
      message: `Successfully loaded ${result.count} sample candidates.`,
      count: result.count,
    });
  } catch (error: any) {
    console.error('[API /api/seed POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed sample candidates' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await CandidateService.clearAllCandidates();
    return NextResponse.json({
      success: true,
      message: 'All candidate records have been cleared.',
    });
  } catch (error: any) {
    console.error('[API /api/seed DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear candidate records' },
      { status: 500 }
    );
  }
}

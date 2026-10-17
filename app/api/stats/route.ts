import { NextResponse } from 'next/server';
import { CandidateService } from '@/lib/supabase/service';

export async function GET() {
  try {
    const stats = await CandidateService.getDashboardStats();
    return NextResponse.json({
      success: true,
      data: stats,
      isLiveDb: CandidateService.isConfigured(),
    });
  } catch (error: any) {
    console.error('[API /api/stats GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

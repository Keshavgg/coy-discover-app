import { NextRequest, NextResponse } from 'next/server';
import { recordSwipe } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, action } = body;

    if (!profileId || !['like', 'pass'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: profileId and action ("like" or "pass") are required.' },
        { status: 400 }
      );
    }

    const result = recordSwipe(profileId, action);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error recording swipe:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record swipe' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { undoLastSwipe } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const profile = undoLastSwipe();
    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'No swipe to undo' },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to undo swipe' },
      { status: 500 }
    );
  }
}

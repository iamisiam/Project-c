import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { frustrations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(request.headers.get('x-user-id') || '0');
    const frustrationId = parseInt(params.id);

    if (!userId || !frustrationId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Update frustration to shared (only if it belongs to the user)
    await db
      .update(frustrations)
      .set({ shared: true })
      .where(and(eq(frustrations.id, frustrationId), eq(frustrations.userId, userId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sharing frustration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
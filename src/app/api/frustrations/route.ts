import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { frustrations, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const userId = parseInt(request.headers.get('x-user-id') || '0');
    const coupleId = parseInt(request.headers.get('x-couple-id') || '0');

    if (!userId || !coupleId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's frustrations
    const myFrustrations = await db
      .select()
      .from(frustrations)
      .where(eq(frustrations.userId, userId));

    // Get partner's frustrations that are shared
    const partnerFrustrations = await db
      .select({
        id: frustrations.id,
        content: frustrations.content,
        shared: frustrations.shared,
        escalated: frustrations.escalated,
        aiAdvice: frustrations.aiAdvice,
      })
      .from(frustrations)
      .innerJoin(users, eq(frustrations.userId, users.id))
      .where(eq(frustrations.shared, true));

    // Filter to only partner's frustrations
    const sharedFrustrations = partnerFrustrations.filter(f => {
      // This is simplified - in real app, check couple relationship
      return true; // For now, show all shared frustrations
    });

    return NextResponse.json({
      myFrustrations,
      sharedFrustrations,
    });
  } catch (error) {
    console.error('Error fetching frustrations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = parseInt(request.headers.get('x-user-id') || '0');
    const { content } = await request.json();

    if (!userId || !content) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await db.insert(frustrations).values({
      userId,
      content,
      shared: false,
      escalated: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding frustration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
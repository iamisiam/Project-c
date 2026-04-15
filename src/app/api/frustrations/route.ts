import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { frustrations, users, couples } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const userId = parseInt(request.headers.get('x-user-id') || '0');
    const coupleId = parseInt(request.headers.get('x-couple-id') || '0');

    if (!userId || !coupleId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get couple info
    const coupleResult = await db.select().from(couples).where(eq(couples.id, coupleId)).limit(1);
    if (coupleResult.length === 0) {
      return NextResponse.json({ error: 'Couple not found' }, { status: 404 });
    }
    const couple = coupleResult[0];

    // Get user's frustrations
    const myFrustrations = await db
      .select()
      .from(frustrations)
      .where(eq(frustrations.userId, userId));

    // Get partner's frustrations that are shared
    const partnerUserIds = [];
    if (couple.user1Id && couple.user1Id !== userId) partnerUserIds.push(couple.user1Id);
    if (couple.user2Id && couple.user2Id !== userId) partnerUserIds.push(couple.user2Id);

    const sharedFrustrations = partnerUserIds.length > 0
      ? await db
          .select({
            id: frustrations.id,
            content: frustrations.content,
            shared: frustrations.shared,
            escalated: frustrations.escalated,
            aiAdvice: frustrations.aiAdvice,
          })
          .from(frustrations)
          .where(and(eq(frustrations.shared, true), inArray(frustrations.userId, partnerUserIds)))
      : [];

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
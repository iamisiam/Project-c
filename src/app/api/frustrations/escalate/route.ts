import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { frustrations, couples } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAICounseling } from '@/lib/gemini';

export async function POST(request: NextRequest) {
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

    // Get all shared frustrations for this couple that aren't escalated yet
    const partnerUserIds = [];
    if (couple.user1Id) partnerUserIds.push(couple.user1Id);
    if (couple.user2Id) partnerUserIds.push(couple.user2Id);

    const sharedFrustrations = partnerUserIds.length > 0
      ? await db
          .select()
          .from(frustrations)
          .where(and(
            eq(frustrations.shared, true),
            eq(frustrations.escalated, false),
            inArray(frustrations.userId, partnerUserIds)
          ))
      : [];

    if (sharedFrustrations.length < 2) {
      return NextResponse.json({ error: 'Need frustrations from both partners to escalate' }, { status: 400 });
    }

    // Group by user
    const user1Frustrations = sharedFrustrations.filter(f => f.userId === userId);
    const user2Frustrations = sharedFrustrations.filter(f => f.userId !== userId);

    if (user1Frustrations.length === 0 || user2Frustrations.length === 0) {
      return NextResponse.json({ error: 'Need frustrations from both partners' }, { status: 400 });
    }

    // Combine frustrations for each user
    const user1Combined = user1Frustrations.map(f => f.content).join(' ');
    const user2Combined = user2Frustrations.map(f => f.content).join(' ');

    // Get AI advice
    const aiAdvice = await getAICounseling(user1Combined, user2Combined);

    // Update all shared frustrations to escalated and add AI advice
    for (const frustration of sharedFrustrations) {
      await db
        .update(frustrations)
        .set({ escalated: true, aiAdvice })
        .where(eq(frustrations.id, frustration.id));
    }

    return NextResponse.json({ success: true, aiAdvice });
  } catch (error) {
    console.error('Error escalating frustrations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
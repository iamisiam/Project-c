import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, couples } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, generateToken } from '@/lib/auth';

function generateInvitationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, invitationCode } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userResult = await db.insert(users).values({
      email,
      name,
      passwordHash,
    }).returning({ id: users.id });

    const userId = userResult[0].id;

    let coupleId: number;
    let isFirstUser = false;

    if (invitationCode) {
      // Joining existing couple
      const coupleResult = await db.select().from(couples).where(eq(couples.invitationCode, invitationCode)).limit(1);
      if (coupleResult.length === 0) {
        return NextResponse.json({ error: 'Invalid invitation code' }, { status: 400 });
      }

      const couple = coupleResult[0];
      if (couple.user2Id) {
        return NextResponse.json({ error: 'Couple already has two members' }, { status: 400 });
      }

      // Add second user to couple
      await db.update(couples).set({ user2Id: userId }).where(eq(couples.id, couple.id));
      coupleId = couple.id;
    } else {
      // Creating new couple
      const code = generateInvitationCode();
      const coupleResult = await db.insert(couples).values({
        user1Id: userId,
        invitationCode: code,
      }).returning({ id: couples.id });

      coupleId = coupleResult[0].id;
      isFirstUser = true;
    }

    // Generate token
    const token = generateToken({ userId, coupleId });

    return NextResponse.json({
      token,
      user: { id: userId, name, email },
      coupleId,
      isFirstUser,
      invitationCode: isFirstUser ? await db.select({ code: couples.invitationCode }).from(couples).where(eq(couples.id, coupleId)).then(r => r[0].code) : undefined,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
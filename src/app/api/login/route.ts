import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, couples } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Find couple
    const coupleResult = await db
      .select()
      .from(couples)
      .where(eq(couples.user1Id, user.id))
      .limit(1);

    let couple = coupleResult[0];

    if (!couple) {
      const coupleResult2 = await db
        .select()
        .from(couples)
        .where(eq(couples.user2Id, user.id))
        .limit(1);
      couple = coupleResult2[0];
    }

    if (!couple) {
      return NextResponse.json({ error: 'No couple found for this user' }, { status: 404 });
    }

    // Generate token
    const token = generateToken({ userId: user.id, coupleId: couple.id });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
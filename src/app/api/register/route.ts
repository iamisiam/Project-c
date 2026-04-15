import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, couples } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, partnerEmail, partnerName, name } = await request.json();

    if (!email || !password || !partnerEmail || !partnerName || !name) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    // Check if users already exist
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const existingPartner = await db.select().from(users).where(eq(users.email, partnerEmail)).limit(1);

    if (existingUser.length > 0 || existingPartner.length > 0) {
      return NextResponse.json({ error: 'One or both users already exist' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create users
    const userResult = await db.insert(users).values({
      email,
      name,
      passwordHash,
    }).returning({ id: users.id });

    const partnerResult = await db.insert(users).values({
      email: partnerEmail,
      name: partnerName,
      passwordHash, // Same password for simplicity, in real app they'd set their own
    }).returning({ id: users.id });

    const userId = userResult[0].id;
    const partnerId = partnerResult[0].id;

    // Create couple
    const coupleResult = await db.insert(couples).values({
      user1Id: userId,
      user2Id: partnerId,
    }).returning({ id: couples.id });

    const coupleId = coupleResult[0].id;

    // Generate token for the registering user
    const token = generateToken({ userId, coupleId });

    return NextResponse.json({
      token,
      user: { id: userId, name, email },
      coupleId
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
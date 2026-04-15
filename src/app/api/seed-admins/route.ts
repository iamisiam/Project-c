import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, couples } from '@/db/schema';
import { hashPassword } from '@/lib/auth';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Check if admins already exist
    const existingAdmins = await db.select().from(users).where(sql`email LIKE 'admin%'`);
    if (existingAdmins.length > 0) {
      return NextResponse.json({ message: 'Admins already exist' });
    }

    // Hash passwords
    const adminPassword = await hashPassword('Lakers');
    const admin2Password = await hashPassword('Lakers2');

    // Insert admin users
    const admin1 = await db.insert(users).values({
      email: 'admin',
      name: 'Admin',
      passwordHash: adminPassword,
    }).returning({ id: users.id });

    const admin2 = await db.insert(users).values({
      email: 'admin2',
      name: 'Admin 2',
      passwordHash: admin2Password,
    }).returning({ id: users.id });

    // Create admin couple
    await db.insert(couples).values({
      user1Id: admin1[0].id,
      user2Id: admin2[0].id,
      invitationCode: 'ADMIN01',
    });

    return NextResponse.json({ message: 'Admin accounts created successfully' });
  } catch (error) {
    console.error('Error seeding admins:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
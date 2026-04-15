import { db } from '@/db';
import { users, couples } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

async function seedAdmins() {
  try {
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

    console.log('Admin accounts created successfully');
  } catch (error) {
    console.error('Error seeding admins:', error);
  }
}

seedAdmins();
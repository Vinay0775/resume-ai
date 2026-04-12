import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if admin already exists with new email
    const existingAdmin = await db.user.findUnique({ where: { email: 'vinayvishwakarma080@gmail.com' } });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin already exists with new credentials',
        admin: {
          id: existingAdmin.id,
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role,
        },
      });
    }

    // Check if old admin exists and update it
    const oldAdmin = await db.user.findUnique({ where: { email: 'admin@resumeai.com' } });

    if (oldAdmin) {
      const hashedPassword = await bcrypt.hash('Vinita080@', 10);
      await db.user.update(oldAdmin.id, {
        email: 'vinayvishwakarma080@gmail.com',
        password: hashedPassword,
      });
      
      return NextResponse.json({
        success: true,
        message: 'Admin credentials updated successfully',
        admin: {
          email: 'vinayvishwakarma080@gmail.com',
          password: 'Vinita080@',
        },
      });
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('Vinita080@', 10);
    const newAdmin = await db.user.create({
      name: 'Admin',
      email: 'vinayvishwakarma080@gmail.com',
      password: hashedPassword,
      role: 'admin',
      plan: 'premium',
      status: 'active',
      aiCreditsUsed: 0,
      aiCreditsLimit: 999,
    });

    return NextResponse.json({
      success: true,
      message: 'New admin user created',
      admin: {
        email: 'vinayvishwakarma080@gmail.com',
        password: 'Vinita080@',
        id: newAdmin.id,
      },
    });
  } catch (error: any) {
    console.error('Error updating admin:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update admin',
    }, { status: 500 });
  }
}

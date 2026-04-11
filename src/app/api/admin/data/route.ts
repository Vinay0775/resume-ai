import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        aiCreditsUsed: true,
        aiCreditsLimit: true,
        createdAt: true,
        // Password intentionally excluded for security
      },
      orderBy: { createdAt: 'desc' },
    });

    const resumes = await db.resume.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    const templates = await db.template.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ users, resumes, templates });
  } catch (error) {
    console.error('Admin data fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

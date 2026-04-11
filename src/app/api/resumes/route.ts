import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/resumes?userId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const resumes = await db.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/resumes
export async function POST(request: Request) {
  try {
    const { userId, title, templateId, resumeData } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const resume = await db.resume.create({
      data: {
        userId,
        title: title || 'Untitled Resume',
        templateId: templateId || 'modern',
        resumeData: JSON.stringify(resumeData || {}),
      },
    });

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error('Create resume error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

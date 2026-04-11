import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/resumes - All resumes with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) where.title = { contains: search };

    const [resumes, total] = await Promise.all([
      db.resume.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, plan: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.resume.count({ where }),
    ]);

    return NextResponse.json({ resumes, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Admin resumes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/resumes - Delete a resume
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('resumeId');
    if (!resumeId) return NextResponse.json({ error: 'resumeId required' }, { status: 400 });

    await db.resume.delete({ where: { id: resumeId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin resume delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Flag/unflag resume
export async function PUT(request: Request) {
  try {
    const { resumeId, action } = await request.json();
    if (!resumeId) return NextResponse.json({ error: 'resumeId required' }, { status: 400 });

    const updateData: Record<string, unknown> = {};
    if (action === 'flag') updateData.flagged = true;
    else if (action === 'unflag') updateData.flagged = false;

    const resume = await db.resume.update({ where: { id: resumeId }, data: updateData });
    return NextResponse.json({ success: true, resume });
  } catch (error) {
    console.error('Admin resume update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/templates
export async function GET() {
  try {
    const templates = await db.template.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Admin templates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new template
export async function POST(request: Request) {
  try {
    const { name, description, layout, previewUrl, isPremium, category } = await request.json();
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

    const template = await db.template.create({
      data: { name, description: description || '', layout: layout || '{}', previewUrl, isPremium: isPremium || false, category: category || 'professional' },
    });
    return NextResponse.json({ success: true, template }, { status: 201 });
  } catch (error) {
    console.error('Admin template create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update template (enable/disable)
export async function PUT(request: Request) {
  try {
    const { templateId, data } = await request.json();
    if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 });

    const template = await db.template.update({ where: { id: templateId }, data: data || {} });
    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Admin template update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');
    if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 });

    await db.template.delete({ where: { id: templateId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin template delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

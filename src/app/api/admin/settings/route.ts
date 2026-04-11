import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/settings
export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    console.error('Admin settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update settings
export async function PUT(request: Request) {
  try {
    const { settings } = await request.json();
    if (!settings) return NextResponse.json({ error: 'settings required' }, { status: 400 });

    for (const [key, value] of Object.entries(settings)) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

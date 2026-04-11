import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/users - List all users with search & filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { role: 'user' };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (plan) where.plan = plan;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, plan: true, status: true,
          aiCreditsUsed: true, aiCreditsLimit: true, createdAt: true,
          _count: { select: { resumes: true, payments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({ users, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/users - Update user (suspend, upgrade, etc.)
export async function PUT(request: Request) {
  try {
    const { userId, action, data } = await request.json();
    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
    }

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case 'suspend':
        updateData = { status: 'suspended' };
        break;
      case 'activate':
        updateData = { status: 'active' };
        break;
      case 'upgrade':
        updateData = { plan: 'premium', aiCreditsLimit: 999 };
        break;
      case 'downgrade':
        updateData = { plan: 'free', aiCreditsLimit: 5 };
        break;
      case 'update':
        updateData = data || {};
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, plan: user.plan, status: user.status } });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    await db.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin user delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

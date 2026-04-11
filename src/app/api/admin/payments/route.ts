import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/payments - All payments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.payment.count({ where }),
    ]);

    const summary = {
      totalRevenue: (await db.payment.findMany({ where: { status: 'completed' } })).reduce((s, p) => s + p.amount, 0),
      pendingAmount: (await db.payment.findMany({ where: { status: 'pending' } })).reduce((s, p) => s + p.amount, 0),
      refundedAmount: (await db.payment.findMany({ where: { status: 'refunded' } })).reduce((s, p) => s + p.amount, 0),
      totalTransactions: await db.payment.count(),
    };

    return NextResponse.json({ payments, total, page, limit, totalPages: Math.ceil(total / limit), summary });
  } catch (error) {
    console.error('Admin payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Refund payment
export async function PUT(request: Request) {
  try {
    const { paymentId, action } = await request.json();
    if (!paymentId) return NextResponse.json({ error: 'paymentId required' }, { status: 400 });

    if (action === 'refund') {
      const payment = await db.payment.update({ where: { id: paymentId }, data: { status: 'refunded' } });
      // Downgrade user plan
      await db.user.update({ where: { id: payment.userId }, data: { plan: 'free', aiCreditsLimit: 5 } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin payment update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

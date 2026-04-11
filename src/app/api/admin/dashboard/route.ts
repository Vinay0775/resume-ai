import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const totalUsers = await db.user.count({ where: { role: 'user' } });
    const totalResumes = await db.resume.count();
    const totalTemplates = await db.template.count();
    const activeSubscriptions = await db.user.count({ where: { plan: 'premium', status: 'active' } });
    const suspendedUsers = await db.user.count({ where: { status: 'suspended' } });

    const payments = await db.payment.findMany({ where: { status: 'completed' } });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });

    // Monthly revenue - last 6 months
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(); start.setMonth(start.getMonth() - i); start.setDate(1);
      const end = new Date(start); end.setMonth(end.getMonth() + 1);
      const mp = await db.payment.findMany({ where: { status: 'completed', createdAt: { gte: start, lt: end } } });
      monthlyRevenue.push({
        month: start.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: mp.reduce((s, p) => s + p.amount, 0),
        transactions: mp.length,
      });
    }

    // Daily signups - last 7 days
    const dailySignups = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(); day.setDate(day.getDate() - i); day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day); nextDay.setDate(nextDay.getDate() + 1);
      dailySignups.push({
        date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        signups: await db.user.count({ where: { createdAt: { gte: day, lt: nextDay } } }),
      });
    }

    // AI stats - manual calculation for SQLite compatibility
    const allUsers = await db.user.findMany({ select: { aiCreditsUsed: true } });
    const totalCreditsUsed = allUsers.reduce((sum, u) => sum + u.aiCreditsUsed, 0);
    const avgCreditsPerUser = allUsers.length > 0 ? Math.round(totalCreditsUsed / allUsers.length) : 0;

    return NextResponse.json({
      totalUsers, totalResumes, totalTemplates, activeSubscriptions, suspendedUsers,
      totalRevenue, recentUsers, monthlyRevenue, dailySignups,
      aiStats: { totalCreditsUsed, avgCreditsPerUser },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

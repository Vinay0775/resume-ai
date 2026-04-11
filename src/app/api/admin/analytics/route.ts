import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const totalUsers = await db.user.count({ where: { role: 'user' } });
    const premiumUsers = await db.user.count({ where: { role: 'user', plan: 'premium' } });
    const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : '0';

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await db.user.count({ where: { updatedAt: { gte: sevenDaysAgo } } });

    const usersWithResumes = await db.user.count({ where: { resumes: { some: {} } } });
    const retentionRate = totalUsers > 0 ? ((usersWithResumes / totalUsers) * 100).toFixed(1) : '0';

    const topAiUsers = await db.user.findMany({
      where: { aiCreditsUsed: { gt: 0 } },
      select: { id: true, name: true, email: true, aiCreditsUsed: true, aiCreditsLimit: true },
      orderBy: { aiCreditsUsed: 'desc' },
      take: 10,
    });

    const resumes = await db.resume.findMany({ select: { templateId: true } });
    const templatePopularity: Record<string, number> = {};
    resumes.forEach(r => { templatePopularity[r.templateId] = (templatePopularity[r.templateId] || 0) + 1; });

    const planDistribution = {
      free: await db.user.count({ where: { plan: 'free', role: 'user' } }),
      premium: await db.user.count({ where: { plan: 'premium', role: 'user' } }),
    };

    const statusDistribution = {
      active: await db.user.count({ where: { status: 'active', role: 'user' } }),
      suspended: await db.user.count({ where: { status: 'suspended', role: 'user' } }),
    };

    return NextResponse.json({
      conversionRate: parseFloat(conversionRate as string),
      activeUsers,
      retentionRate: parseFloat(retentionRate as string),
      topAiUsers,
      templatePopularity,
      planDistribution,
      statusDistribution,
      totalUsers,
      premiumUsers,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

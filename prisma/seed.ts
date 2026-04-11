import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  // Create admin user
  const existingAdmin = await db.user.findUnique({ where: { email: 'admin@resumeai.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    await db.user.create({
      data: {
        name: 'Admin',
        email: 'admin@resumeai.com',
        password: hashedPassword,
        role: 'admin',
        plan: 'premium',
        aiCreditsLimit: 999,
      },
    });
    console.log('✅ Admin user created: admin@resumeai.com / admin1234');
  } else {
    console.log('Admin user already exists');
  }

  // Create sample payments
  const existingPayments = await db.payment.count();
  if (existingPayments === 0) {
    const users = await db.user.findMany({ where: { plan: 'premium' } });
    for (const user of users) {
      await db.payment.create({
        data: {
          userId: user.id,
          amount: 9.99,
          currency: 'USD',
          status: 'completed',
          plan: 'premium',
          paymentMethod: 'card',
          transactionId: `txn_${Date.now()}`,
        },
      });
    }
    // Add some sample payments for demo
    const demoUser = await db.user.findUnique({ where: { email: 'demo@resumeai.com' } });
    if (demoUser) {
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        await db.payment.create({
          data: {
            userId: demoUser.id,
            amount: 9.99,
            currency: 'USD',
            status: i === 3 ? 'refunded' : 'completed',
            plan: 'premium',
            paymentMethod: i % 2 === 0 ? 'card' : 'upi',
            transactionId: `txn_demo_${i}_${Date.now()}`,
            createdAt: date,
          },
        });
      }
    }
    console.log('✅ Sample payments created');
  }

  // Create site settings
  const existingSettings = await db.siteSetting.count();
  if (existingSettings === 0) {
    const settings = [
      { key: 'free_plan_ai_credits', value: '5' },
      { key: 'premium_plan_ai_credits', value: '999' },
      { key: 'premium_plan_price', value: '9.99' },
      { key: 'site_name', value: 'ResumeAI' },
      { key: 'enable_registration', value: 'true' },
      { key: 'enable_ai_features', value: 'true' },
      { key: 'enable_pdf_export', value: 'true' },
      { key: 'enable_docx_export', value: 'true' },
      { key: 'maintenance_mode', value: 'false' },
      { key: 'max_resumes_free', value: '3' },
      { key: 'max_resumes_premium', value: '999' },
      { key: 'smtp_host', value: '' },
      { key: 'smtp_port', value: '587' },
      { key: 'support_email', value: 'support@resumeai.com' },
    ];
    for (const s of settings) {
      await db.siteSetting.create({ data: s });
    }
    console.log('✅ Site settings created');
  }

  console.log('\n🎉 Seed complete!');
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());

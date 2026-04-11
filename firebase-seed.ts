// Firebase Firestore Seed Script
// Run with: npm.cmd run db:seed:firebase
import { db_api } from './src/lib/firestore';
import * as admin from 'firebase-admin';

async function seed() {
  console.log('🌱 Starting Firebase Firestore seed...');

  try {
    // 1. Create Admin User
    console.log('\n👤 Creating admin user...');
    const existingAdmin = await db_api.user.findUnique({ email: 'admin@resumeai.com' });
    
    if (!existingAdmin) {
      await db_api.user.create({
        name: 'Admin',
        email: 'admin@resumeai.com',
        password: '$2a$10$EpRnTzVl9M0qkXZM0ZvGRe8XVJlT7sY3qYq8qYq8qYq8qYq8qYq8q', // admin1234 (hashed with bcrypt)
        role: 'admin',
        plan: 'premium',
        status: 'active',
        aiCreditsUsed: 0,
        aiCreditsLimit: 999,
      });
      console.log('✅ Admin user created: admin@resumeai.com / admin1234');
    } else {
      console.log('⚠️  Admin user already exists');
    }

    // 2. Create Demo User
    console.log('\n👤 Creating demo user...');
    const existingDemo = await db_api.user.findUnique({ email: 'demo@resumeai.com' });
    
    if (!existingDemo) {
      const demoUser = await db_api.user.create({
        name: 'Demo User',
        email: 'demo@resumeai.com',
        password: '$2a$10$EpRnTzVl9M0qkXZM0ZvGRe8XVJlT7sY3qYq8qYq8qYq8qYq8qYq8q', // demo1234
        role: 'user',
        plan: 'free',
        status: 'active',
        aiCreditsUsed: 2,
        aiCreditsLimit: 5,
      });

      // Create sample payments for demo user
      console.log('\n💳 Creating sample payments...');
      for (let i = 1; i <= 5; i++) {
        await db_api.payment.create({
          userId: demoUser.id,
          amount: 9.99 * i,
          currency: 'USD',
          status: 'completed',
          plan: 'premium',
          paymentMethod: 'card',
          transactionId: `txn_demo_${i}`,
        });
      }
      console.log('✅ 5 sample payments created');
    } else {
      console.log('⚠️  Demo user already exists');
    }

    // 3. Create Site Settings
    console.log('\n⚙️  Creating site settings...');
    const siteSettings = [
      { key: 'site_name', value: 'ResumeAI' },
      { key: 'ai_credits_limit_free', value: '5' },
      { key: 'ai_credits_limit_premium', value: '999' },
      { key: 'plan_price_monthly', value: '9.99' },
      { key: 'plan_price_yearly', value: '99.99' },
      { key: 'enable_ai_features', value: 'true' },
      { key: 'enable_export_pdf', value: 'true' },
      { key: 'enable_export_docx', value: 'true' },
      { key: 'enable_templates', value: 'true' },
      { key: 'smtp_host', value: '' },
      { key: 'smtp_port', value: '587' },
      { key: 'smtp_user', value: '' },
      { key: 'smtp_password', value: '' },
      { key: 'support_email', value: 'support@resumeai.com' },
    ];

    for (const setting of siteSettings) {
      const existing = await db_api.siteSetting.findUnique(setting.key);
      if (!existing) {
        await db_api.siteSetting.upsert(setting.key, setting.value);
        console.log(`✅ Created setting: ${setting.key}`);
      }
    }

    // 4. Create Resume Templates
    console.log('\n📄 Creating resume templates...');
    const templates = [
      {
        name: 'Modern',
        description: 'A clean and modern resume template',
        layout: JSON.stringify({
          sections: ['header', 'summary', 'experience', 'education', 'skills'],
          style: 'modern',
        }),
        isPremium: false,
        category: 'professional',
        enabled: true,
      },
      {
        name: 'Professional',
        description: 'Professional template for experienced candidates',
        layout: JSON.stringify({
          sections: ['header', 'summary', 'experience', 'education', 'skills', 'projects'],
          style: 'professional',
        }),
        isPremium: false,
        category: 'professional',
        enabled: true,
      },
      {
        name: 'Creative',
        description: 'Creative template for designers and creatives',
        layout: JSON.stringify({
          sections: ['header', 'portfolio', 'experience', 'education', 'skills'],
          style: 'creative',
        }),
        isPremium: true,
        category: 'creative',
        enabled: true,
      },
      {
        name: 'Minimal',
        description: 'Simple and minimal resume template',
        layout: JSON.stringify({
          sections: ['header', 'summary', 'experience', 'education'],
          style: 'minimal',
        }),
        isPremium: false,
        category: 'minimal',
        enabled: true,
      },
    ];

    for (const template of templates) {
      const existing = await db_api.template.findMany();
      const exists = existing.find(t => t.name === template.name);
      
      if (!exists) {
        await db_api.template.create(template);
        console.log(`✅ Created template: ${template.name}`);
      }
    }

    console.log('\n✅ Firebase Firestore seed completed successfully!');
    console.log('\n📝 Default login credentials:');
    console.log('   Email: admin@resumeai.com');
    console.log('   Password: admin1234');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

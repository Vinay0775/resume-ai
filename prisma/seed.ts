import { db } from '@/lib/db';

async function seed() {
  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'A clean, modern layout with bold section headers and a professional feel.',
      previewUrl: '/templates/modern.png',
      isPremium: false,
      category: 'professional',
      layout: JSON.stringify({ header: 'centered', sections: 'stacked', accent: 'slate' }),
    },
    {
      id: 'classic',
      name: 'Classic Elegant',
      description: 'A timeless, traditional resume format that works for any industry.',
      previewUrl: '/templates/classic.png',
      isPremium: false,
      category: 'professional',
      layout: JSON.stringify({ header: 'left', sections: 'stacked', accent: 'gray' }),
    },
    {
      id: 'creative',
      name: 'Creative Bold',
      description: 'A bold, creative layout with a sidebar and colorful accents.',
      previewUrl: '/templates/creative.png',
      isPremium: true,
      category: 'creative',
      layout: JSON.stringify({ header: 'sidebar', sections: 'two-column', accent: 'emerald' }),
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Ultra-minimalist design focusing on content over decoration.',
      previewUrl: '/templates/minimal.png',
      isPremium: false,
      category: 'minimal',
      layout: JSON.stringify({ header: 'top-line', sections: 'stacked', accent: 'neutral' }),
    },
    {
      id: 'executive',
      name: 'Executive Suite',
      description: 'A premium executive layout with sophisticated typography and layout.',
      previewUrl: '/templates/executive.png',
      isPremium: true,
      category: 'executive',
      layout: JSON.stringify({ header: 'banner', sections: 'stacked', accent: 'navy' }),
    },
    {
      id: 'tech',
      name: 'Tech Forward',
      description: 'Designed for software engineers and tech professionals.',
      previewUrl: '/templates/tech.png',
      isPremium: true,
      category: 'tech',
      layout: JSON.stringify({ header: 'top-bar', sections: 'stacked', accent: 'teal' }),
    },
  ];

  for (const template of templates) {
    await db.template.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
  }

  console.log('Templates seeded successfully!');
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());

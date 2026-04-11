import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: Request) {
  try {
    const { personalInfo, experience, targetRole } = await request.json();

    if (!personalInfo) {
      return NextResponse.json({ error: 'Personal info is required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const experienceContext = experience?.length > 0
      ? `Work experience: ${experience.map((e: { position: string; company: string; description: string }) => `${e.position} at ${e.company}: ${e.description}`).join('; ')}`
      : '';

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a professional resume writer. Generate a compelling, concise professional summary for a resume. The summary should be 2-4 sentences, highlight key strengths and experience, and be tailored to the target role. Return ONLY the summary text, no explanations or prefixes.'
        },
        {
          role: 'user',
          content: `Generate a professional summary for:\nName: ${personalInfo.fullName || 'Candidate'}\nTitle: ${personalInfo.title || targetRole || 'Professional'}\n${experienceContext}\n${targetRole ? `Target role: ${targetRole}` : ''}`
        }
      ],
      thinking: { type: 'disabled' }
    });

    const summary = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ result: summary });
  } catch (error) {
    console.error('AI summary error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}

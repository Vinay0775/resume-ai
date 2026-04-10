import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: Request) {
  try {
    const { text, context } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a professional resume writer. Rewrite and improve resume text to be more impactful, professional, and results-oriented. Use action verbs, quantify results where possible, and make bullet points concise. Return ONLY the improved text, no explanations or prefixes.'
        },
        {
          role: 'user',
          content: context
            ? `Context: This is for a ${context} position.\n\nImprove this resume text:\n${text}`
            : `Rewrite this resume bullet point in a professional and impactful way with quantified results:\n${text}`
        }
      ],
      thinking: { type: 'disabled' }
    });

    const improved = completion.choices[0]?.message?.content || text;

    return NextResponse.json({ result: improved });
  } catch (error) {
    console.error('AI improve error:', error);
    return NextResponse.json({ error: 'Failed to improve text' }, { status: 500 });
  }
}

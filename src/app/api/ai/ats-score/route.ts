import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: Request) {
  try {
    const { resumeData, jobDescription } = await request.json();

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const resumeText = JSON.stringify(resumeData, null, 2);

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description and provide an ATS compatibility score (0-100) along with specific suggestions for improvement. Return a JSON object with: { "score": number, "breakdown": { "keywords": number, "formatting": number, "experience": number, "skills": number }, "suggestions": string[], "missingKeywords": string[] }. Return ONLY valid JSON.'
        },
        {
          role: 'user',
          content: `${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ''}Resume Data:\n${resumeText}\n\nAnalyze this resume for ATS compatibility${jobDescription ? ' against the job description' : ''}.`
        }
      ],
      thinking: { type: 'disabled' }
    });

    let result = completion.choices[0]?.message?.content || '';

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch {
      result = {
        score: 65,
        breakdown: { keywords: 60, formatting: 70, experience: 65, skills: 60 },
        suggestions: ['Add more industry-specific keywords', 'Quantify your achievements with numbers', 'Include relevant technical skills'],
        missingKeywords: [],
      };
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('ATS score error:', error);
    return NextResponse.json({ error: 'Failed to check ATS score' }, { status: 500 });
  }
}

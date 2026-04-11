import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: Request) {
  try {
    const { resumeData, jobDescription } = await request.json();

    if (!resumeData || !jobDescription) {
      return NextResponse.json({ error: 'Resume data and job description are required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const resumeText = JSON.stringify(resumeData, null, 2);

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are an expert resume tailor. Analyze the job description and customize the resume content to better match the role. Return a JSON object with the same structure as the input resume data, but with improved content that highlights relevant experience and skills for the target job. Keep all existing sections but enhance the language and emphasis to match the job requirements. Return ONLY valid JSON, no explanations.'
        },
        {
          role: 'user',
          content: `Job Description:\n${jobDescription}\n\nCurrent Resume Data:\n${resumeText}\n\nTailor this resume to better match the job description. Enhance bullet points, summary, and skills to align with the job requirements.`
        }
      ],
      thinking: { type: 'disabled' }
    });

    let tailored = completion.choices[0]?.message?.content || '';

    // Try to extract JSON from the response
    try {
      const jsonMatch = tailored.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        tailored = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Return the raw text if JSON parsing fails
    }

    return NextResponse.json({ result: tailored });
  } catch (error) {
    console.error('AI tailor error:', error);
    return NextResponse.json({ error: 'Failed to tailor resume' }, { status: 500 });
  }
}

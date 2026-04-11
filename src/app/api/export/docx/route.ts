import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { resumeData, title, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const data = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;
    const pi = data.personalInfo || {};

    // Generate a simple DOCX-compatible HTML that can be opened in Word
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${title || 'Resume'}</title>
<style>
body { font-family: Calibri, sans-serif; margin: 40px; line-height: 1.5; }
h1 { font-size: 24pt; margin-bottom: 4pt; color: #1a1a1a; }
h2 { font-size: 14pt; border-bottom: 2px solid #333; padding-bottom: 4pt; margin-top: 16pt; color: #333; }
h3 { font-size: 12pt; margin-bottom: 2pt; color: #444; }
p { margin: 2pt 0; font-size: 11pt; }
.contact { font-size: 10pt; color: #666; }
ul { margin: 4pt 0; padding-left: 20pt; }
li { font-size: 11pt; margin: 2pt 0; }
</style></head><body>`;

    // Personal Info
    html += `<h1>${pi.fullName || 'Your Name'}</h1>`;
    html += `<p class="contact">${[pi.title, pi.email, pi.phone, pi.location, pi.website, pi.linkedin].filter(Boolean).join(' | ')}</p>`;
    if (pi.summary) {
      html += `<h2>Professional Summary</h2><p>${pi.summary}</p>`;
    }

    // Work Experience
    if (data.workExperience?.length) {
      html += `<h2>Work Experience</h2>`;
      for (const exp of data.workExperience) {
        html += `<h3>${exp.position}${exp.company ? ` — ${exp.company}` : ''}</h3>`;
        html += `<p>${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}</p>`;
        if (exp.description) {
          const bullets = exp.description.split('\n').filter((b: string) => b.trim());
          html += `<ul>${bullets.map((b: string) => `<li>${b.trim()}</li>`).join('')}</ul>`;
        }
      }
    }

    // Education
    if (data.education?.length) {
      html += `<h2>Education</h2>`;
      for (const edu of data.education) {
        html += `<h3>${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</h3>`;
        html += `<p>${edu.institution || ''} | ${edu.startDate || ''} - ${edu.endDate || ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>`;
        if (edu.description) html += `<p>${edu.description}</p>`;
      }
    }

    // Skills
    if (data.skills?.length) {
      html += `<h2>Skills</h2>`;
      html += `<p>${data.skills.map((s: { name: string; level: string }) => s.name).join(' • ')}</p>`;
    }

    // Projects
    if (data.projects?.length) {
      html += `<h2>Projects</h2>`;
      for (const proj of data.projects) {
        html += `<h3>${proj.name}</h3>`;
        if (proj.technologies) html += `<p><em>${proj.technologies}</em></p>`;
        if (proj.description) html += `<p>${proj.description}</p>`;
        if (proj.url) html += `<p><a href="${proj.url}">${proj.url}</a></p>`;
      }
    }

    html += `</body></html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${title || 'resume'}.doc"`,
      },
    });
  } catch (error) {
    console.error('DOCX export error:', error);
    return NextResponse.json({ error: 'Failed to export DOCX' }, { status: 500 });
  }
}

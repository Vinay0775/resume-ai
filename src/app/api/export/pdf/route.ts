import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { html, title } = await request.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    // For PDF export, we'll generate a data URI that the client can use
    // The actual PDF generation will be done client-side using html2pdf.js
    // This endpoint returns the HTML with proper print styling
    
    const styledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title || 'Resume'}</title>
        <style>
          @page { margin: 0; size: A4; }
          body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          * { box-sizing: border-box; }
        </style>
      </head>
      <body>${html}</body>
      </html>
    `;

    return NextResponse.json({ html: styledHtml, title: title || 'Resume' });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json({ error: 'Failed to export PDF' }, { status: 500 });
  }
}

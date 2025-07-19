import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tool, file1, file2, language } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }
    if (!tool) {
      throw new Error('Tool not specified');
    }

    let prompt = "";
    const parts = [];

    switch (tool) {
      case 'summary':
        if (!file1) throw new Error('File for summary not provided');
        prompt = "You are a legal assistant. Provide a concise summary of the following document. Highlight key clauses, parties involved, obligations, and any potential risks or points of concern. Format the output clearly with headings.";
        parts.push({ text: prompt });
        parts.push({ inline_data: { mime_type: file1.mimeType, data: file1.content } });
        break;

      case 'compare':
        if (!file1 || !file2) throw new Error('Two files are required for comparison');
        prompt = "You are a legal assistant. Compare the two following documents and provide a detailed list of differences. Focus on legally significant changes, including added, removed, or modified clauses. Structure the comparison clearly.";
        parts.push({ text: prompt });
        parts.push({ text: "\n\n--- DOCUMENT 1 ---" });
        parts.push({ inline_data: { mime_type: file1.mimeType, data: file1.content } });
        parts.push({ text: "\n\n--- DOCUMENT 2 ---" });
        parts.push({ inline_data: { mime_type: file2.mimeType, data: file2.content } });
        break;

      case 'translate':
        if (!file1 || !language) throw new Error('File and target language are required for translation');
        prompt = `You are a professional translator specializing in legal documents. Translate the following document to ${language}. Maintain the legal accuracy, formatting, and formal tone.`;
        parts.push({ text: prompt });
        parts.push({ inline_data: { mime_type: file1.mimeType, data: file1.content } });
        break;

      case 'ocr':
        if (!file1) throw new Error('Image file not provided for OCR');
        prompt = "Extract all text from the following image. Preserve the formatting and layout as much as possible.";
        parts.push({ text: prompt });
        parts.push({ inline_data: { mime_type: file1.mimeType, data: file1.content } });
        break;

      default:
        throw new Error(`Unknown tool: ${tool}`);
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const result = geminiData.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Could not process the document.";

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in document processor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
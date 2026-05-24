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
    const { text } = await req.json();

    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('Text is required');
    }

    const documentText = text.slice(0, 40000); // basic truncation
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) throw new Error('GEMINI_API_KEY not set');

    const prompt = `You are a legal document summarizer focused on Indian legal and commercial documents. Write clear Markdown. Highlight parties, purpose, key obligations, payment terms, duration, termination, dispute resolution, liabilities, unusual clauses, and practical risks. Keep the summary readable for a non-lawyer without dropping important legal detail.\n\nSummarize this document.\n\nDocument text:\n---\n${documentText}\n---`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1400 }
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini error:", errorText);
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate summary.";

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Summarizer Error:', error.message);
    return new Response(JSON.stringify({ error: `An error occurred: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

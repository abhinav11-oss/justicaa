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
    const { text1, text2 } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) throw new Error('GEMINI_API_KEY not set');
    if (!text1 || !text2) throw new Error('Two documents are required for comparison');

    const prompt = `You are a legal assistant. Compare the following two legal documents. Highlight the key differences in clauses, terms, and obligations. Provide a detailed, point-by-point comparison using Markdown.

Document 1:
---
${text1}
---

Document 2:
---
${text2}
---
`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Gemini API Error:", errorBody);
      throw new Error(`AI service failed with status ${res.status}`);
    }

    const data = await res.json();

    if (!data.candidates || data.candidates.length === 0) {
      console.warn("Gemini response blocked or empty:", JSON.stringify(data));
      throw new Error("The AI's safety filters blocked the request or returned no content.");
    }

    const comparison = data.candidates[0]?.content?.parts[0]?.text || "Could not generate comparison.";

    return new Response(JSON.stringify({ comparison }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Comparer Error:", error.message);
    return new Response(JSON.stringify({ error: `An error occurred: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
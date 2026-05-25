import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeHealthCheckReport = (input: any) => {
  if (input.isLegalDocument === false) {
    return {
      isLegalDocument: false,
      documentType: input.documentType || 'Unknown Document',
      message: input.message || 'Yeh legal document nahin lag raha. Yeh tool sirf legal documents analyze karta hai.',
    };
  }

  return {
    isLegalDocument: true,
    documentType: input.documentType || 'Legal Document',
    riskScore: typeof input.riskScore === 'number' ? input.riskScore : 50,
    summary: input.summary || 'No summary available.',
    keyDetails: input.keyDetails || { parties: '', duration: '', value: '' },
    flaggedClauses: Array.isArray(input.flaggedClauses) ? input.flaggedClauses : [],
    positivePoints: Array.isArray(input.positivePoints) ? input.positivePoints : [],
    overallVerdict: input.overallVerdict || 'Review Recommended',
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('Document text is required');
    }

    const documentText = text.slice(0, 40000);
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) throw new Error('GEMINI_API_KEY not set');

    const prompt = `You are an expert legal document analyst focused on Indian law. Classify whether a document is legal or non-legal. For legal documents, analyze practical risk, one-sided clauses, missing protections, enforceability concerns, payment exposure, termination, indemnity, jurisdiction, dispute resolution, and ambiguity. Return only valid JSON.

If the document is NOT legal, respond with:
{ "isLegalDocument": false, "documentType": "string", "message": "short Hinglish message" }

If the document IS legal, respond with:
{
  "isLegalDocument": true,
  "documentType": "string",
  "riskScore": 0,
  "summary": "2-3 sentence Hinglish summary",
  "keyDetails": { "parties": "string", "duration": "string", "value": "string" },
  "flaggedClauses": [ { "clause": "string", "reason": "string", "severity": "High | Medium | Low", "recommendation": "string" } ],
  "positivePoints": ["string"],
  "overallVerdict": "Safe to Sign | Review Recommended | Do Not Sign Without Legal Advice"
}

Document text:
---
${documentText}
---`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini error:", errorText);
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const report = normalizeHealthCheckReport(JSON.parse(responseText));

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Health Check Error:', error.message);
    return new Response(JSON.stringify({ error: `An error occurred: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

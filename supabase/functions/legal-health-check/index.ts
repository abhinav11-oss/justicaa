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
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) throw new Error('GEMINI_API_KEY not set');
    if (!text) throw new Error('Document text is required');

    const prompt = `
      You are an AI legal assistant specializing in Indian law. Analyze the following legal document text and provide a "Legal Health Check" report.

      Your response MUST be a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON object.

      The JSON object should have the following structure:
      {
        "riskScore": number, // An integer from 0 to 100, where 0 is no risk and 100 is extremely high risk.
        "summary": string, // A brief, 2-3 sentence summary of the document's purpose and overall risk level.
        "flaggedClauses": [
          {
            "clause": string, // The title or a short quote from the risky clause (e.g., "Non-Compete Clause (Section 8.1)").
            "reason": string, // A clear, simple explanation of why this clause is a risk.
            "severity": string // Must be one of: "High", "Medium", or "Low".
          }
        ]
      }

      Analyze the document based on fairness, clarity, and compliance with common Indian legal practices. Identify clauses that are ambiguous, overly restrictive, or potentially unfavorable.

      Here is the document text to analyze:
      ---
      ${text}
      ---
    `;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
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

    const reportJsonString = data.candidates[0]?.content?.parts[0]?.text;
    const report = JSON.parse(reportJsonString);

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Health Check Error:", error.message);
    return new Response(JSON.stringify({ error: `An error occurred: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
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

    const trimmedText = text.trim();
    if (trimmedText.length < 50) {
      throw new Error("Could not extract sufficient text from the document. It might be an image-based PDF or empty.");
    }

    // Truncate very long documents to avoid token limits (keep first ~15000 chars)
    const documentText = trimmedText.length > 15000 ? trimmedText.substring(0, 15000) + "\n\n[... Document truncated for analysis ...]" : trimmedText;

    const prompt = `You are an expert AI legal document analyst specializing in Indian law.

**STEP 1 — DOCUMENT CLASSIFICATION:**
First, determine whether the following text is a LEGAL DOCUMENT or NOT.
A legal document includes: contracts, agreements, terms & conditions, legal notices, court orders, affidavits, MOUs, NDAs, rental agreements, employment contracts, power of attorney, wills, FIRs, sale deeds, partnership deeds, or any official document with legal clauses/terms.
Non-legal documents include: essays, articles, stories, marketing material, personal letters, academic papers, code, random text, shopping lists, etc.

**STEP 2 — RESPOND:**
Your response MUST be a single, valid JSON object. Do not include any text or markdown before or after the JSON.

**If the document is NOT a legal document**, respond with exactly:
{
  "isLegalDocument": false,
  "documentType": "<what kind of document it appears to be, e.g. 'article', 'essay', 'marketing brochure', etc.>",
  "message": "<a short, friendly message in Hinglish explaining that this is not a legal document and the tool only analyzes legal documents>"
}

**If the document IS a legal document**, respond with:
{
  "isLegalDocument": true,
  "documentType": "<type of legal document, e.g. 'Rental Agreement', 'Employment Contract', 'NDA', etc.>",
  "riskScore": <integer from 0 to 100, where 0 = no risk, 100 = extremely high risk>,
  "summary": "<2-3 sentence summary of the document's purpose and overall risk level in simple Hinglish>",
  "keyDetails": {
    "parties": "<names of the parties involved, if identifiable>",
    "duration": "<contract duration/validity if mentioned>",
    "value": "<monetary value if mentioned>"
  },
  "flaggedClauses": [
    {
      "clause": "<title or short quote of the risky clause>",
      "reason": "<clear, simple explanation in Hinglish of why this is risky>",
      "severity": "<High, Medium, or Low>",
      "recommendation": "<what the user should do about this clause, in Hinglish>"
    }
  ],
  "positivePoints": ["<good things about this document>"],
  "overallVerdict": "<one of: 'Safe to Sign', 'Review Recommended', 'Do Not Sign Without Legal Advice'>"
}

Analyze based on fairness, clarity, compliance with Indian legal practices, and identify clauses that are ambiguous, overly restrictive, one-sided, or potentially unfavorable.

Here is the document text:
---
${documentText}
---`;

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
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Justicaa AI, an Indian legal information assistant.

Your job is to answer questions about Indian law in a careful, well-structured, practical format.

Rules:
- Focus on Indian law, Indian legal procedure, Indian authorities, and Indian forums only unless the user asks otherwise.
- Give legal information and practical guidance, not a lawyer-client relationship or definitive legal advice.
- If the issue depends on facts, say what facts matter.
- If you are uncertain, say so clearly instead of guessing.
- Never invent section numbers, case names, forms, deadlines, or authorities.
- Prefer plain English that ordinary people in India can understand.
- If useful, include common Hindi legal terms in parentheses after the English term.

Response format:
## Legal Position
- State the applicable law, right, or procedure.

## What This Means
- Explain the rule in simple language.

## Next Steps
1. Give concrete actions the user can take in India.
2. Mention the correct office, authority, portal, police unit, commission, court, or tribunal where relevant.
3. Mention likely documents or evidence to collect if relevant.

## Practical Notes
- Mention timelines, limitations, risks, or exceptions if relevant.

## Disclaimer
- End with a short disclaimer that this is general legal information for India and they should consult a qualified Indian advocate for case-specific advice.

Formatting requirements:
- Always use Markdown headings and bullet points.
- Keep answers readable and professionally formatted.
- Do not use tables unless the user specifically asks for one.
- Do not use blockquotes.
`;

function formatConversationHistory(conversationHistory: Array<{ sender?: string; content?: string }>) {
  return conversationHistory
    .slice(-6)
    .filter((msg) => msg?.content)
    .map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content ?? "",
    }));
}

function generateFallbackResponse(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("rti") || lowerMessage.includes("right to information")) {
    return `## Legal Position
- The Right to Information Act, 2005 allows citizens to seek information from public authorities.
- In most cases, the Public Information Officer (PIO) must reply within 30 days.

## What This Means
- You can ask for records, copies, file movement, decisions, and reasons from government departments.
- RTI usually applies to public authorities, not ordinary private entities unless they are substantially government-controlled or government-funded in the relevant legal sense.

## Next Steps
1. Identify the correct department and its PIO.
2. Draft a short RTI application clearly describing the information you want.
3. File it through the relevant RTI portal or submit it physically with the prescribed fee.
4. If there is no reply or the reply is incomplete, file a first appeal within the prescribed period.

## Practical Notes
- Urgent life and liberty matters are treated faster under the Act.
- Keep copies of the application, fee receipt, and reply.

## Disclaimer
- This is general legal information for India. For case-specific advice, consult a qualified Indian advocate.`;
  }

  if (lowerMessage.includes("fir") || lowerMessage.includes("police") || lowerMessage.includes("arrest")) {
    return `## Legal Position
- Criminal procedure in India is mainly governed by the Bharatiya Nagarik Suraksha Sanhita, 2023 for procedure, along with the Bharatiya Nyaya Sanhita, 2023 for substantive criminal law in current usage where applicable.
- If the matter concerns older documents, complaints, or guidance, references may still mention the older CrPC and IPC terminology.

## What This Means
- If a cognizable offence is disclosed, the police are expected to register the case and begin lawful procedure.
- If someone is arrested, they have rights regarding grounds of arrest, legal representation, and production before the appropriate magistrate within the legal timeframe.

## Next Steps
1. Write down the incident facts with date, time, place, and names of witnesses.
2. Keep any screenshots, call logs, medical papers, CCTV details, or photographs.
3. Approach the local police station or the appropriate senior police authority if the complaint is not accepted.
4. If necessary, consult a criminal lawyer to move the magistrate or seek other remedies.

## Practical Notes
- Exact remedies depend on whether the offence is cognizable, bailable, non-bailable, compoundable, or urgent.
- A precise answer depends on the offence details and stage of proceedings.

## Disclaimer
- This is general legal information for India. For case-specific advice, consult a qualified Indian advocate.`;
  }

  return `## Legal Position
- Your query appears to involve Indian law, but the answer depends on the exact facts and legal category.

## What This Means
- A proper legal response usually depends on the subject area, the state involved, the documents available, and the stage of the dispute or proceeding.

## Next Steps
1. Note the exact issue, dates, location, and the names of parties involved.
2. Gather any notice, agreement, FIR, order, receipt, screenshot, or government communication relevant to the issue.
3. Identify whether the matter is criminal, civil, family, consumer, labour, property, constitutional, or administrative.
4. Ask the question again with those details for a more accurate India-specific answer.

## Practical Notes
- Limitation periods and procedure differ depending on the forum and the type of claim.

## Disclaimer
- This is general legal information for India. For case-specific advice, consult a qualified Indian advocate.`;
}

function categorizeIndianLegalResponse(response: string, question: string) {
  const content = `${response} ${question}`.toLowerCase();

  if (content.includes("rti") || content.includes("right to information")) return "rti";
  if (content.includes("police") || content.includes("fir") || content.includes("criminal")) return "criminal";
  if (content.includes("consumer") || content.includes("defective") || content.includes("unfair trade")) return "consumer";
  if (content.includes("property") || content.includes("real estate") || content.includes("rera")) return "property";
  if (content.includes("constitutional") || content.includes("fundamental rights") || content.includes("writ")) return "constitutional";
  if (content.includes("family") || content.includes("marriage") || content.includes("divorce")) return "family";
  if (content.includes("labour") || content.includes("employment") || content.includes("workplace")) return "labour";
  if (content.includes("ndps") || content.includes("narcotics") || content.includes("drug")) return "ndps";
  return "general";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    const openAiApiKey =
      Deno.env.get("OPENAI_API_KEY") ||
      Deno.env.get("CHATGPT_API_KEY");

    if (!openAiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...formatConversationHistory(conversationHistory),
      {
        role: "user",
        content: `User question: ${message}

Please answer as an Indian legal information assistant and follow the required response format exactly.`,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse || aiResponse.length < 80) {
      aiResponse = generateFallbackResponse(message);
    }

    if (!aiResponse.includes("## Disclaimer")) {
      aiResponse += "\n\n## Disclaimer\n- This is general legal information for India. For case-specific advice, consult a qualified Indian advocate.";
    }

    const category = categorizeIndianLegalResponse(aiResponse, message);

    return new Response(
      JSON.stringify({
        response: aiResponse,
        category,
        fallback: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in ai-legal-chat-hf function:", error);

    const fallbackResponse = generateFallbackResponse(
      "general legal help in India",
    );

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        response: fallbackResponse,
        category: "general",
        fallback: true,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

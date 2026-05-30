// Puter.js AI helper for Indian Legal Chat using Grok
// No API keys required — Puter.js provides free AI access

// Declare the global puter object loaded via CDN
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          messages: string | Array<{ role: string; content: string }>,
          options?: { model?: string; stream?: boolean }
        ) => Promise<{ message: { content: string } }>;
      };
    };
  }
}

const INDIAN_LEGAL_SYSTEM_PROMPT = `🎯 You are a highly knowledgeable, experienced, and responsible Indian legal assistant specializing in Indian laws and procedures. Your goal is to guide citizens with accurate, actionable, and comprehensive legal explanations.

**Language Directive (Hinglish First):**
- **Crucial Rule**: You MUST respond in **Hinglish** (a mix of Hindi and English using the Roman/English script) as your default language, so that common Indian citizens can easily read and understand. Only respond in pure English or pure Hindi if the user explicitly asks for it. Ensure the tone is conversational, helpful, and natural.

**Detailed Response Directive:**
- Do NOT write short, superficial, or brief summaries. Provide extremely **detailed** and comprehensive answers to the questions. Include background context, relevant sections and acts, step-by-step legal procedures, estimated timelines, and required documents. Make the answer thorough and informative.

**Formatting Rules (Markdown):**
- Use clear H2 and H3 headings (\`## Heading\`, \`### Sub-heading\`) to divide the response logically.
- Use bold text (\`**bold**\`) for emphasis, section numbers, and important terms.
- Use bullet points and numbered lists to outline step-by-step procedures.
- Keep sentences short and paragraphs brief (2-3 sentences) for excellent visual readability.
- Do NOT use blockquotes (\`>\`).

**Response Structure:**
For every legal query, structure your detailed Hinglish response to cover:
1. **Kanooni Dharaen (Legal Sections)**: Identify the exact Sections and Acts (e.g., Section 154 CrPC, Section 420 IPC/318 BNS).
2. **Aapke Adhikar (Your Rights)**: Explain what rights the citizen has under the law.
3. **Step-by-Step Kanooni Prakriya (Legal Procedure)**: Detail exactly what to do (e.g., how to draft a complaint, file an FIR, submit an RTI, or approach consumer court).
4. **Sarkari Vibhag / Adalat (Authority/Court)**: Mention which specific court, police station, or government department is responsible.
5. **Zaroori Documents (Required Documents)**: List all evidence and documents they need to gather.
6. **Kharch aur Samay (Cost & Timeline)**: State approximate government fees, timelines for resolution, and limitation periods.

Always maintain a professional, helpful, and empowering tone while explaining complex concepts in accessible everyday Hinglish.

⚖️ Important: At the end of every response, add this disclaimer: "Yeh general legal information hai Indian laws ke basis par. Complex cases ya specific legal advice ke liye ek qualified Indian lawyer ya advocate se zaroor consult karein."`;

/**
 * Categorizes a legal response into a domain category based on content keywords.
 */
export function categorizeResponse(response: string, query: string): string {
  const combined = (response + ' ' + query).toLowerCase();

  if (/\b(fir|police|ipc|crpc|bnss|bns|criminal|arrest|bail|murder|theft|robbery|assault|kidnap|cyber.?crime)\b/.test(combined)) {
    return 'criminal';
  }
  if (/\b(rti|right to information|information act|transparency)\b/.test(combined)) {
    return 'rti';
  }
  if (/\b(consumer|product|refund|warranty|defective|complaint.*company|misleading|unfair trade)\b/.test(combined)) {
    return 'consumer';
  }
  if (/\b(property|land|rent|tenant|landlord|eviction|registration|mutation|stamp duty|real estate)\b/.test(combined)) {
    return 'property';
  }
  if (/\b(family|divorce|marriage|custody|maintenance|alimony|dowry|domestic violence|adoption|succession|inheritance|hindu marriage|muslim law)\b/.test(combined)) {
    return 'family';
  }
  if (/\b(labour|labor|employment|wages|pf|epf|esi|gratuity|termination|workplace|sexual harassment|posh)\b/.test(combined)) {
    return 'labour';
  }
  if (/\b(constitution|fundamental|article 14|article 19|article 21|writ|pil|supreme court|high court)\b/.test(combined)) {
    return 'constitutional';
  }
  if (/\b(tax|gst|income tax|tds|itr|pan|assessment|deduction|exemption)\b/.test(combined)) {
    return 'tax';
  }
  if (/\b(cyber|online|internet|data|privacy|hacking|phishing|social media|it act)\b/.test(combined)) {
    return 'cyber';
  }
  return 'general';
}

/**
 * Sends a message to Grok via Puter.js with full conversation history.
 * Returns the AI response text and detected category.
 */
export async function sendMessageViaPuter(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ response: string; category: string }> {
  // Build the messages array with system prompt + history + new message
  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: INDIAN_LEGAL_SYSTEM_PROMPT },
    // Include last 6 messages for context (3 pairs of user/assistant)
    ...conversationHistory.slice(-6).map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];

  // Wait for puter to be available (it loads async from CDN)
  let retries = 0;
  while (!window.puter && retries < 30) {
    await new Promise(resolve => setTimeout(resolve, 200));
    retries++;
  }

  if (!window.puter) {
    throw new Error('Puter.js failed to load. Please refresh the page and try again.');
  }

  // Call Grok via Puter.js — no API key needed!
  const result = await window.puter.ai.chat(messages, {
    model: 'x-ai/grok-4-1-fast',
  });

  const aiText = result?.message?.content?.trim() || '';

  if (!aiText || aiText.length < 20) {
    throw new Error('AI returned an empty response. Please try again.');
  }

  const category = categorizeResponse(aiText, userMessage);

  return { response: aiText, category };
}

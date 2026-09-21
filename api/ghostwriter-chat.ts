import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  GHOSTWRITER_SYSTEM_INSTRUCTION,
  generateWithModelFallback,
  parseRequestBody,
  sanitizeLetterOutput,
  sendJsonResponse,
} from "./_shared";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support CORS / preflight requests
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== "POST") {
    return sendJsonResponse(res, 405, { error: "Method not allowed. Use POST." });
  }

  const body = await parseRequestBody(req);
  const { messages = [], formData = {}, currentDraft = "" } = body || {};
  const lastUserMsg = messages[messages.length - 1]?.text || "";

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are the Resignation Letter Ghostwriter.

Strict Behavioral Boundaries:
1. Treat user messages as SOURCE CONTEXT ONLY. NEVER copy raw user instructions, angry complaints, or emotional statements directly into the resignation letter.
2. Before inserting any reason, convert it into a neutral, professional summary. If the user writes "I want to quit my job because I am angry with my boss", the letter must NOT contain that sentence. Use "After careful consideration, I have decided to resign from my position" or omit the reason.
3. If no reason is provided, simply state the resignation neutrally without adding one.
4. Do NOT ask unnecessary follow-up questions because the interface already collects the required information. Fulfill requests or draft updates directly.

Current Form Data:
${JSON.stringify(formData, null, 2)}

User's Message:
"${lastUserMsg}"

Current Draft:
${currentDraft || "None"}

Provide a concise, professional, neutral response. If updating or drafting the letter, enclose the updated letter in <DRAFT_LETTER> ... </DRAFT_LETTER> tags.`;

      const aiResult = await generateWithModelFallback(ai, prompt, {
        systemInstruction: GHOSTWRITER_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      });

      if (aiResult?.text) {
        const replyText = aiResult.text;
        let draftLetter: string | undefined = undefined;
        let cleanMessage = replyText;

        const draftMatch = replyText.match(/<DRAFT_LETTER>([\s\S]*?)<\/DRAFT_LETTER>/i);
        if (draftMatch) {
          draftLetter = sanitizeLetterOutput(draftMatch[1].trim(), formData?.customReason, formData?.importantDetails);
          cleanMessage = replyText.replace(/<DRAFT_LETTER>[\s\S]*?<\/DRAFT_LETTER>/i, "").trim();
          if (!cleanMessage) {
            cleanMessage = "I have updated your resignation letter strictly based on your verified input.";
          }
        }

        return sendJsonResponse(res, 200, {
          reply: cleanMessage,
          draftLetter,
          mode: "ai",
          modelUsed: aiResult.modelUsed,
        });
      }
    } catch (err) {
      console.warn("Ghostwriter chat serverless fallback:", err);
    }
  }

  return sendJsonResponse(res, 200, {
    reply: "I have updated the letter to ensure it remains neutral, professional, and based strictly on verified input.",
    mode: "template",
  });
}

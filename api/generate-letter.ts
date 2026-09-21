import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  GHOSTWRITER_SYSTEM_INSTRUCTION,
  generateFallbackGhostwriterLetter,
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
  const {
    fullName = "",
    jobTitle = "",
    companyName = "",
    managerName = "",
    lastWorkingDay = "",
    preferredTone = "neutral_respectful",
    desiredLength = "standard",
    reasonCategory = "new_opportunity",
    customReason = "",
    importantDetails = "",
    constraints = "",
    personalContact = "",
  } = body || {};

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

      const lengthInstructions = {
        short: "Target 100-140 words. Concise notification, notice date, brief transition handover.",
        standard: "Target 180-230 words. Balanced, professional notice, verified neutral context (if provided), and handover commitments.",
        detailed: "Target 280-350 words. Comprehensive and structured, thorough transition arrangements and polite close.",
      }[desiredLength as "short" | "standard" | "detailed"] || "Target 180-230 words.";

      const prompt = `You are executing your role as the Resignation Letter Ghostwriter.

CRITICAL INSTRUCTION - SOURCE CONTEXT TRANSFORMATION ONLY (DO NOT COPY RAW INPUT):
- The text entered by the user below is RAW SOURCE CONTEXT ONLY, NOT final letter content.
- NEVER copy full user instructions, raw sentences, or emotional statements directly into the resignation letter.
- Before inserting any reason into the final letter, convert it into a neutral, professional summary.
- For example, if the user writes "I want to quit my job because I am angry with my boss" or anything expressing anger, conflict, or frustration:
  The final letter MUST NOT contain that sentence, nor any mention of anger, conflict, or management. It must either omit the reason entirely or use a neutral sentence such as: "After careful consideration, I have decided to resign from my position."
- If the user selects "No Reason / Keep Private" or provides no reason, the letter must remain neutral and simply state the resignation and last working day without adding one.
- Do NOT parrot the user's exact wording. Rephrase transition notes into formal, executive workplace prose.
- Output ONLY the complete, professionally formatted resignation letter.

Source Context Provided:
- Employee Name: ${fullName.trim() || "[Your Name]"}
- Employee Job Title: ${jobTitle.trim() || "[Your Job Title]"}
- Company Name: ${companyName.trim() || "[Company Name]"}
- Manager / Recipient: ${managerName.trim() || "[Manager's Name]"}
- Last Working Day: ${lastWorkingDay.trim() || "[Last Working Day]"}
- Reason Category: ${reasonCategory}
- Reason Context Notes: ${customReason.trim() ? `"${customReason.trim()}"` : "None provided"}
- Desired Tone: ${preferredTone}
- Desired Length: ${desiredLength} (${lengthInstructions})
- Important Constraints: ${constraints.trim() || "None"}
- Handover Notes Context: ${importantDetails.trim() || "Standard smooth transition commitment"}
- Personal Contact: ${personalContact.trim() || "None provided"}`;

      const aiResult = await generateWithModelFallback(ai, prompt, {
        systemInstruction: GHOSTWRITER_SYSTEM_INSTRUCTION,
        temperature: 0.2,
      });

      if (aiResult?.text) {
        const sanitized = sanitizeLetterOutput(aiResult.text, customReason, importantDetails);
        return sendJsonResponse(res, 200, {
          letter: sanitized,
          isDraftComplete: true,
          mode: "ai",
          modelUsed: aiResult.modelUsed,
        });
      }
    } catch (err: unknown) {
      console.warn("AI generation in serverless function fell back to template generator:", err);
    }
  }

  const fallbackLetter = generateFallbackGhostwriterLetter({
    fullName,
    jobTitle,
    companyName,
    managerName,
    lastWorkingDay,
    preferredTone,
    desiredLength,
    reasonCategory,
    customReason,
    importantDetails,
    constraints,
    personalContact,
  });

  return sendJsonResponse(res, 200, {
    letter: fallbackLetter,
    isDraftComplete: true,
    mode: "template",
  });
}

import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const GHOSTWRITER_SYSTEM_INSTRUCTION = `Role Name: Resignation Letter Ghostwriter

Purpose:
Help the user write a professional resignation letter to their boss while keeping the tone neutral and respectful.

CRITICAL BEHAVIORAL BOUNDARIES:
1. The text entered by the user is UNPROCESSED SOURCE CONTEXT ONLY, NOT final letter content.
2. NEVER copy full user instructions, raw sentences, or emotional statements directly into the resignation letter.
3. Before inserting any reason into the final letter, convert it into a neutral, professional summary.
   - For example, if the user writes "I want to quit my job because I am angry with my boss", the final letter must NOT contain that sentence, nor any reference to anger, conflict, or management.
   - In such cases, either omit the reason entirely or use a neutral sentence such as: "After careful consideration, I have decided to resign from my position."
4. If the user does not provide a reason for leaving (or if the reason is 'No Reason / Keep Private' or omitted), the letter must remain neutral and simply state the resignation and last working day without adding one.
5. Do not invent or assume any unverified reason for leaving, future job, opportunity, conflict, or personal circumstance.
6. Handover notes and details must be synthesized into formal, respectful executive prose, never pasted verbatim from user notes.
7. Format as a complete, formal, professional letter (date, recipient, salutation, body paragraphs matching requested length, formal closing, and sign-off). Do not output meta-commentary or follow-up questions.`;

export function containsEmotionalOrConflictLanguage(text: string): boolean {
  if (!text) return false;
  const pattern = /(angry|mad|furious|upset|frustrated|pissed|annoyed|sick of|hate|toxic|conflict|dispute|terrible|horrible|awful|unfair|underpaid|bad boss|terrible manager|incompetent|quitting|quit my job|can't stand|cannot stand|hostile|disgusted)/i;
  return pattern.test(text);
}

export function transformReasonToNeutralStatement(
  category: string,
  customReason?: string
): { openingPhrase: string; reasonSentence: string } {
  const custom = customReason?.trim() || "";

  if (!category || category === "none_specified" || (!custom && category === "none_specified")) {
    return { openingPhrase: "", reasonSentence: "" };
  }

  if (custom && containsEmotionalOrConflictLanguage(custom)) {
    return {
      openingPhrase: "after careful consideration",
      reasonSentence: "After careful consideration, I have decided to resign from my position.",
    };
  }

  if (custom) {
    const lower = custom.toLowerCase();
    if (lower.includes("new job") || lower.includes("opportunity") || lower.includes("offer") || lower.includes("next step") || lower.includes("role") || lower.includes("company")) {
      return {
        openingPhrase: "to pursue a new professional opportunity",
        reasonSentence: "I have accepted a new professional opportunity that aligns with my long-term career goals.",
      };
    }
    if (lower.includes("growth") || lower.includes("advancement") || lower.includes("develop") || lower.includes("direction")) {
      return {
        openingPhrase: "to pursue new avenues for career growth",
        reasonSentence: "I have decided to pursue new avenues for professional growth and development.",
      };
    }
    if (lower.includes("relocat") || lower.includes("moving") || lower.includes("move") || lower.includes("city")) {
      return {
        openingPhrase: "due to an upcoming relocation",
        reasonSentence: "This decision is necessitated by an upcoming personal relocation.",
      };
    }
    if (lower.includes("family") || lower.includes("personal") || lower.includes("circumstance")) {
      return {
        openingPhrase: "due to personal circumstances",
        reasonSentence: "This decision is due to personal circumstances that require my attention.",
      };
    }
    if (lower.includes("school") || lower.includes("study") || lower.includes("degree") || lower.includes("education") || lower.includes("master") || lower.includes("phd")) {
      return {
        openingPhrase: "to pursue further academic studies",
        reasonSentence: "I am stepping down to undertake full-time academic studies.",
      };
    }
    if (lower.includes("retir")) {
      return {
        openingPhrase: "to retire",
        reasonSentence: "I have made the decision to formally retire.",
      };
    }
    if (lower.includes("change") || lower.includes("transition") || lower.includes("field") || lower.includes("industry")) {
      return {
        openingPhrase: "to pursue a career transition",
        reasonSentence: "I have decided to pursue a new career transition.",
      };
    }
    if (lower.includes("balance") || lower.includes("health") || lower.includes("burnout") || lower.includes("rest") || lower.includes("break")) {
      return {
        openingPhrase: "to prioritize personal commitments",
        reasonSentence: "I have decided to take time to prioritize personal commitments and well-being.",
      };
    }

    return {
      openingPhrase: "after careful consideration",
      reasonSentence: "After careful consideration, I have decided to resign from my position to pursue the next chapter of my career.",
    };
  }

  switch (category) {
    case "new_opportunity":
      return {
        openingPhrase: "to pursue a new professional opportunity",
        reasonSentence: "I have accepted a new professional opportunity that aligns with my career trajectory.",
      };
    case "career_growth":
      return {
        openingPhrase: "to pursue new avenues for professional growth",
        reasonSentence: "I have decided to pursue new avenues for professional advancement.",
      };
    case "relocation":
      return {
        openingPhrase: "due to an upcoming relocation",
        reasonSentence: "This decision is necessitated by an upcoming personal relocation.",
      };
    case "personal_family":
      return {
        openingPhrase: "due to personal and family circumstances",
        reasonSentence: "I have made this decision due to personal and family circumstances.",
      };
    case "career_change":
      return {
        openingPhrase: "to pursue a career transition",
        reasonSentence: "I am leaving to pursue a new professional direction.",
      };
    case "education":
      return {
        openingPhrase: "to pursue further academic studies",
        reasonSentence: "I will be leaving my position to undertake full-time academic studies.",
      };
    case "retirement":
      return {
        openingPhrase: "to retire",
        reasonSentence: "I have decided to retire and conclude my professional career.",
      };
    case "work_life_balance":
      return {
        openingPhrase: "to prioritize personal commitments",
        reasonSentence: "I have decided to step down to prioritize personal commitments and schedule balance.",
      };
    default:
      return { openingPhrase: "", reasonSentence: "" };
  }
}

export function transformHandoverToNeutralSummary(
  details?: string,
  length: "short" | "standard" | "detailed" = "standard"
): string {
  if (!details || !details.trim()) {
    if (length === "short") {
      return "I will assist with the transfer of my active responsibilities prior to my departure.";
    }
    if (length === "detailed") {
      return "During my notice period, I am committed to documenting active workflows, completing pending deliverables, and assisting with a thorough handover of my responsibilities to ensure team continuity.";
    }
    return "During my remaining notice period, I will focus on completing key priorities and ensuring a smooth transition of my responsibilities.";
  }

  const lower = details.toLowerCase();
  const mentionsDocumentation = lower.includes("document") || lower.includes("guide") || lower.includes("wiki") || lower.includes("system");
  const mentionsTraining = lower.includes("train") || lower.includes("walkthrough") || lower.includes("teach") || lower.includes("meeting") || lower.includes("team");
  const mentionsProjects = lower.includes("project") || lower.includes("deliverable") || lower.includes("task") || lower.includes("feature");

  const components: string[] = [];
  if (mentionsProjects) components.push("finalizing current project deliverables");
  if (mentionsDocumentation) components.push("organizing comprehensive handover documentation");
  if (mentionsTraining) components.push("conducting knowledge transfer sessions with team members");

  if (components.length > 0) {
    const joined = components.join(", ");
    return `During my remaining notice period, I will prioritize ${joined} to ensure an orderly and seamless transition.`;
  }

  return "During my remaining notice period, I will focus on completing essential priorities and collaborating closely with the team to facilitate an orderly handover of my responsibilities.";
}

export function generateFallbackGhostwriterLetter(data: {
  fullName: string;
  jobTitle: string;
  companyName: string;
  managerName: string;
  lastWorkingDay: string;
  preferredTone: string;
  desiredLength: string;
  reasonCategory: string;
  customReason?: string;
  importantDetails?: string;
  constraints?: string;
  personalContact?: string;
}): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const employeeName = data.fullName.trim() || "[Your Name]";
  const title = data.jobTitle.trim() || "[Your Job Title]";
  const company = data.companyName.trim() || "[Company Name]";
  const manager = data.managerName.trim() || "[Manager's Name]";
  const lastDay = data.lastWorkingDay.trim() || "[Last Working Day]";

  const len = (data.desiredLength as "short" | "standard" | "detailed") || "standard";
  const { reasonSentence } = transformReasonToNeutralStatement(data.reasonCategory, data.customReason);
  const reasonParagraph = reasonSentence ? `${reasonSentence}\n\n` : "";
  const handoverParagraph = `${transformHandoverToNeutralSummary(data.importantDetails, len)}\n\n`;
  const contact = data.personalContact?.trim();

  if (len === "short") {
    return `${today}

${manager}
${company}

Dear ${manager},

Please accept this letter as formal notification that I am resigning from my position as ${title} at ${company}. My last day of employment will be ${lastDay}.

${reasonParagraph}${handoverParagraph}Thank you for the support and opportunities provided during my time with the organization.

${contact ? `You can reach me at ${contact}.\n\n` : ""}Sincerely,

${employeeName}`;
  }

  if (len === "detailed") {
    return `${today}

${manager}
${company}

Dear ${manager},

Please accept this letter as formal notification that I will be resigning from my position as ${title} with ${company}, effective on my final working day, ${lastDay}.

${reasonParagraph}I appreciate the professional opportunities, collaboration, and experiences gained during my tenure with the company.

${handoverParagraph}I wish you and the team continued success in all future endeavors.

${contact ? `Should any transition questions arise after my departure, I can be reached at ${contact}.\n\n` : ""}Sincerely,

${employeeName}`;
  }

  return `${today}

${manager}
${company}

Dear ${manager},

Please accept this letter as formal notification that I am resigning from my position as ${title} at ${company}. In accordance with my notice period, my last working day will be ${lastDay}.

${reasonParagraph}I would like to thank you for the opportunity to work together and appreciate the support provided during my time here.

${handoverParagraph}I wish the team and ${company} all the best.

${contact ? `If you need to contact me following my departure, you can reach me at ${contact}.\n\n` : ""}Sincerely,

${employeeName}`;
}

export function sanitizeLetterOutput(letter: string, customReason?: string, _details?: string): string {
  let cleaned = letter;

  const emotionalPatterns = [
    /i am angry with my boss/gi,
    /angry with my boss/gi,
    /i want to quit my job because i am angry with my boss/gi,
    /i want to quit my job because/gi,
    /because i am angry with my boss/gi,
    /furious at (my )?manager/gi,
  ];

  for (const pat of emotionalPatterns) {
    if (pat.test(cleaned)) {
      cleaned = cleaned.replace(pat, "after careful consideration");
    }
  }

  if (customReason && containsEmotionalOrConflictLanguage(customReason)) {
    const escaped = customReason.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const exactRegex = new RegExp(escaped, "gi");
    cleaned = cleaned.replace(exactRegex, "after careful consideration");
  }

  return cleaned;
}

export const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-pro-preview",
];

export async function generateWithModelFallback(
  ai: GoogleGenAI,
  prompt: string,
  config: {
    systemInstruction: string;
    temperature: number;
  }
): Promise<{ text: string; modelUsed: string } | null> {
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const text = response.text?.trim();
      if (text) {
        return { text, modelUsed: model };
      }
    } catch (err: unknown) {
      const errorObj = err as { status?: number | string; code?: number; message?: string };
      const isQuotaExceeded =
        errorObj?.status === "RESOURCE_EXHAUSTED" ||
        errorObj?.message?.includes("RESOURCE_EXHAUSTED") ||
        errorObj?.message?.includes("Quota exceeded") ||
        errorObj?.code === 429;

      // If quota is exhausted on this specific model, immediately advance to the next model without futile retries
      if (isQuotaExceeded) {
        continue;
      }

      const isHighDemand =
        errorObj?.status === "UNAVAILABLE" ||
        errorObj?.code === 503 ||
        errorObj?.status === 503 ||
        errorObj?.message?.includes("high demand") ||
        errorObj?.message?.includes("503");

      if (isHighDemand) {
        // Try once more with a brief wait for transient 503
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const retryResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config,
          });
          const retryText = retryResponse.text?.trim();
          if (retryText) {
            return { text: retryText, modelUsed: model };
          }
        } catch {
          // Move on to next candidate
        }
      }
    }
  }
  return null;
}

export async function parseRequestBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk: any) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

export function sendJsonResponse(res: any, status: number, data: any) {
  if (typeof res.status === "function") {
    res.status(status);
  } else {
    res.statusCode = status;
  }
  if (typeof res.json === "function") {
    return res.json(data);
  }
  res.setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(data));
}

/**
 * Professional Resignation Letter Text Transformation Utilities
 * 
 * Strict Behavioral Rules:
 * 1. User inputs are treated strictly as UNPROCESSED SOURCE CONTEXT, never final letter copy.
 * 2. Never copy full user instructions or emotional statements directly into the resignation letter.
 * 3. Before inserting any reason, convert it into a neutral, professional summary.
 * 4. Emotional statements (e.g. "I am angry with my boss", "I want to quit my job because I am angry with my boss")
 *    must NEVER appear in the letter; transform into "After careful consideration, I have decided to resign..." or omit.
 * 5. If no reason is given or if kept private, omit the reason entirely and state resignation neutrally.
 */

// Detect emotional language, frustration, conflict, or raw colloquial venting anywhere in the text
export function containsEmotionalOrConflictLanguage(text: string): boolean {
  if (!text) return false;
  const pattern = /(angry|mad|furious|upset|frustrated|pissed|annoyed|sick of|hate|toxic|conflict|dispute|terrible|horrible|awful|unfair|underpaid|bad boss|terrible manager|incompetent|quitting|quit my job|can't stand|cannot stand|hostile|disgusted)/i;
  return pattern.test(text);
}

/**
 * Transforms user reason input into a neutral, professional summary sentence or clause.
 * NEVER returns raw user text verbatim.
 */
export function transformReasonToNeutralStatement(
  category: string,
  customReason?: string
): { openingPhrase: string; reasonSentence: string } {
  const custom = customReason?.trim() || "";

  // 1. If kept private or omitted
  if (!category || category === "none_specified" || (!custom && category === "none_specified")) {
    return {
      openingPhrase: "",
      reasonSentence: "",
    };
  }

  // 2. If emotional venting or conflict language is detected
  if (custom && containsEmotionalOrConflictLanguage(custom)) {
    return {
      openingPhrase: "after careful consideration",
      reasonSentence: "After careful consideration, I have made the decision to resign from my position.",
    };
  }

  // 3. If custom reason provided, synthesize neutrally based on semantic intent
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
        reasonSentence: "This decision is due to an upcoming personal relocation.",
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
        reasonSentence: "I am stepping down to pursue further academic studies.",
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
        openingPhrase: "to focus on personal commitments",
        reasonSentence: "I have decided to take time to prioritize personal commitments and well-being.",
      };
    }

    // Default neutral professional synthesis if not matching specific keywords
    return {
      openingPhrase: "after careful consideration",
      reasonSentence: "After careful consideration, I have decided to resign from my position to pursue the next chapter of my career.",
    };
  }

  // 4. Map standard category options to neutral professional summaries
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
      return {
        openingPhrase: "",
        reasonSentence: "",
      };
  }
}

/**
 * Transforms raw transition notes into formal executive handover prose.
 * Never copies bullet points or raw informal instructions verbatim.
 */
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

  // Check if details contain raw instructions or informal notes
  const raw = details.trim();
  const lower = raw.toLowerCase();

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

  // Clean professional fallback
  return "During my remaining notice period, I am committed to completing essential priorities and collaborating closely with the team to facilitate an orderly handover of my responsibilities.";
}

/**
 * Transforms raw user constraints into professional workplace clauses.
 */
export function transformConstraintToNeutralSummary(constraint?: string): string {
  if (!constraint || !constraint.trim()) return "";
  const lower = constraint.toLowerCase();
  if (lower.includes("confidential") || lower.includes("disclose") || lower.includes("next company") || lower.includes("where i am going")) {
    return "Please note that I request my future plans remain confidential at this time.";
  }
  return "";
}

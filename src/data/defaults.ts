import { LetterLength, ReasonCategory, ToneType } from "../types";

export interface ToneOption {
  id: ToneType;
  title: string;
  description: string;
  badge: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "neutral_respectful",
    title: "Neutral & Respectful",
    description: "Objective, balanced, dignified, and courteous without overstatement.",
    badge: "Ghostwriter Default",
  },
  {
    id: "grateful_warm",
    title: "Grateful & Warm",
    description: "Appreciative of team support, mentorship, and growth opportunities.",
    badge: "Appreciative",
  },
  {
    id: "formal_standard",
    title: "Formal & Traditional",
    description: "Strict corporate protocol, formal phrasing, and dignified distance.",
    badge: "Formal",
  },
  {
    id: "brief_direct",
    title: "Brief & Direct",
    description: "Concise notice of departure dates with minimal elaboration.",
    badge: "Succinct",
  },
  {
    id: "amicable_enthusiastic",
    title: "Amicable & Friendly",
    description: "Warm and cordial, highlighting positive camaraderie and staying connected.",
    badge: "Friendly",
  },
];

export interface LengthOption {
  id: LetterLength;
  label: string;
  description: string;
  wordCount: string;
}

export const LENGTH_OPTIONS: LengthOption[] = [
  {
    id: "short",
    label: "Short & Concise",
    description: "To the point: notification, last day, polite handover.",
    wordCount: "~100–140 words",
  },
  {
    id: "standard",
    label: "Standard Balanced",
    description: "Classic notice with brief rationale, gratitude, and handover commitments.",
    wordCount: "~180–230 words",
  },
  {
    id: "detailed",
    label: "Comprehensive",
    description: "Thorough context, specific transition milestones, and detailed handover.",
    wordCount: "~280–350 words",
  },
];

export const CONSTRAINT_SUGGESTIONS = [
  "Do not disclose the name or industry of my next employer",
  "Keep the reason for leaving private/confidential",
  "Emphasize willingness to complete existing project handover",
  "Omit any mention of team grievances or management conflict",
  "Express gratitude specifically to direct team members",
];


export interface ReasonOption {
  id: ReasonCategory;
  label: string;
  exampleHint: string;
}

export const REASON_OPTIONS: ReasonOption[] = [
  {
    id: "none_specified",
    label: "No Reason / Keep Private",
    exampleHint: "State resignation directly without specifying any reason",
  },
  {
    id: "new_opportunity",
    label: "New Opportunity",
    exampleHint: "Accepted a new role matching next career step",
  },
  {
    id: "career_growth",
    label: "Career Growth",
    exampleHint: "Expanding leadership scope or exploring new technical domains",
  },
  {
    id: "personal_family",
    label: "Personal / Family",
    exampleHint: "Attending to family commitments or personal health",
  },
  {
    id: "relocation",
    label: "Relocation",
    exampleHint: "Moving to a new city or country",
  },
  {
    id: "career_change",
    label: "Career Pivot",
    exampleHint: "Transitioning to a new field or sector",
  },
  {
    id: "work_life_balance",
    label: "Work-Life Balance",
    exampleHint: "Prioritizing personal schedule and sustainable pacing",
  },
  {
    id: "education",
    label: "Further Education",
    exampleHint: "Pursuing higher degree or full-time studies",
  },
  {
    id: "other",
    label: "Other / Custom",
    exampleHint: "Specify your custom reasons below",
  },
];

export const HANDOVER_SUGGESTIONS = [
  "Offer to train replacement or colleague",
  "Prepare detailed documentation of all active projects",
  "Available for transition questions via personal email",
  "Prioritize finishing current sprint / deliverable milestones",
];

// Calculate future date helper in YYYY-MM-DD
export function getFutureDateString(weeksAhead: number): string {
  const target = new Date();
  target.setDate(target.getDate() + weeksAhead * 7);
  return target.toISOString().split("T")[0];
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }
  return dateStr;
}

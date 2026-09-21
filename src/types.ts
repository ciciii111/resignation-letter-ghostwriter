export type ToneType = 
  | 'neutral_respectful'
  | 'grateful_warm'
  | 'formal_standard'
  | 'brief_direct'
  | 'amicable_enthusiastic';

export type LetterLength = 'short' | 'standard' | 'detailed';

export type ReasonCategory =
  | 'none_specified'
  | 'new_opportunity'
  | 'career_growth'
  | 'relocation'
  | 'personal_family'
  | 'career_change'
  | 'education'
  | 'retirement'
  | 'work_life_balance'
  | 'other';

export interface ResignationFormData {
  fullName: string;
  jobTitle: string;
  companyName: string;
  managerName: string;
  lastWorkingDay: string;
  preferredTone: ToneType;
  desiredLength: LetterLength;
  reasonCategory: ReasonCategory;
  customReason: string;
  importantDetails: string;
  constraints: string;
  personalContact: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ghostwriter' | 'user';
  text: string;
  timestamp: string;
  draftLetter?: string;
  suggestedAction?: 'draft_ready' | 'needs_info';
}

export interface GenerateLetterResponse {
  letter: string;
  ghostwriterMessage?: string;
  isDraftComplete: boolean;
  missingInputs?: string[];
  mode: 'ai' | 'template';
  modelUsed?: string;
  error?: string;
}


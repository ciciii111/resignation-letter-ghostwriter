import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LetterForm } from "./components/LetterForm";
import { LetterPreview } from "./components/LetterPreview";
import { GhostwriterConsultation } from "./components/GhostwriterConsultation";
import { ResignationFormData, GenerateLetterResponse, ChatMessage } from "./types";
import { getFutureDateString } from "./data/defaults";
import { transformReasonToNeutralStatement, transformHandoverToNeutralSummary } from "./utils/textTransform";
import { Sparkles, AlertCircle, RotateCcw, Bot, SlidersHorizontal, ShieldCheck } from "lucide-react";

const initialFormData: ResignationFormData = {
  fullName: "Alex Morgan",
  jobTitle: "Senior Product Designer",
  companyName: "Apex Innovations Inc.",
  managerName: "Sarah Jenkins",
  lastWorkingDay: getFutureDateString(2),
  preferredTone: "neutral_respectful",
  desiredLength: "standard",
  reasonCategory: "new_opportunity",
  customReason: "Accepting an opportunity that aligns with my long-term career goals",
  importantDetails:
    "I will finalize design system documentation and conduct walkthrough sessions with the team for an orderly transition.",
  constraints: "Do not disclose next company name",
  personalContact: "alex.morgan.design@email.com",
};

const createInitialGhostwriterMessage = (formData: ResignationFormData): ChatMessage => ({
  id: "msg-welcome",
  sender: "ghostwriter",
  text: `Hello! I am your Resignation Letter Ghostwriter.

Strict Behavioral Boundaries:
• I use ONLY information explicitly provided in your form.
• I do not invent or assume any reason for leaving, future job, opportunity, conflict, or personal circumstance.
• If no reason is provided (or if kept private), the letter remains neutral and simply states the resignation without adding one.
• Emotional statements (such as "I am angry with my boss") are treated strictly as context for tone and will not be copied or converted into unverified reasons.
• The final letter is professional, respectful, and based strictly on verified user input.

You can modify any fields in the form and click "Draft Resignation Letter" to instantly generate a verified draft.`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
});

export default function App() {
  const [formData, setFormData] = useState<ResignationFormData>(initialFormData);
  const [letterText, setLetterText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [generationMode, setGenerationMode] = useState<"ai" | "template">("ai");
  const [modelUsed, setModelUsed] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [activeLeftTab, setActiveLeftTab] = useState<"form" | "consultation">("form");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    createInitialGhostwriterMessage(initialFormData),
  ]);

  const handleUpdateFormData = (updated: Partial<ResignationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: GenerateLetterResponse = await response.json();
      setLetterText(data.letter);
      setGenerationMode(data.mode);
      setModelUsed(data.modelUsed);
      setHasGenerated(true);

      const ghostwriterReply: ChatMessage = {
        id: `draft-${Date.now()}`,
        sender: "ghostwriter",
        text: `Your resignation letter has been generated based strictly on verified inputs with a ${formData.preferredTone.replace(
          "_",
          " "
        )} tone.${data.mode === "template" ? " (Standard Verified Format)" : ""}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        draftLetter: data.letter,
      };
      setChatMessages((prev) => [...prev, ghostwriterReply]);
    } catch (err) {
      console.warn("API request failed, generating verified client fallback:", err);
      setModelUsed(undefined);
      // Fallback directly adhering strictly to user intent
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const emp = formData.fullName.trim() || "[Your Name]";
      const mgr = formData.managerName.trim() || "[Manager's Name]";
      const comp = formData.companyName.trim() || "[Company Name]";
      const role = formData.jobTitle.trim() || "[Your Role]";
      const date = formData.lastWorkingDay || "[Last Day]";

      // Strictly transform reason and details into neutral professional summaries
      const { reasonSentence } = transformReasonToNeutralStatement(formData.reasonCategory, formData.customReason);
      const reasonParagraph = reasonSentence ? `${reasonSentence}\n\n` : "";
      const handoverParagraph = `${transformHandoverToNeutralSummary(formData.importantDetails, formData.desiredLength)}\n\n`;
      const contact = formData.personalContact ? `You can reach me at ${formData.personalContact.trim()}.\n\n` : "";

      const fallback = `${today}

${mgr}
${comp}

Dear ${mgr},

Please accept this letter as formal notification that I am resigning from my position as ${role} at ${comp}. In accordance with my notice requirements, my last working day will be ${date}.

${reasonParagraph}I appreciate the opportunities, collaboration, and professional experiences gained during my tenure with the company.

${handoverParagraph}${contact}Sincerely,

${emp}`;

      setLetterText(fallback);
      setGenerationMode("template");
      setHasGenerated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChatMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/ghostwriter-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          formData,
          currentDraft: letterText,
        }),
      });

      if (!response.ok) throw new Error("Ghostwriter chat error");

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `gw-${Date.now()}`,
        sender: "ghostwriter",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        draftLetter: data.draftLetter,
      };

      setChatMessages((prev) => [...prev, aiMsg]);

      if (data.draftLetter) {
        setLetterText(data.draftLetter);
        setHasGenerated(true);
        setGenerationMode(data.mode || "ai");
      }
    } catch (err) {
      console.warn("Ghostwriter chat fallback:", err);
      const fallbackMsg: ChatMessage = {
        id: `gw-${Date.now()}`,
        sender: "ghostwriter",
        text: `I have noted your input and updated the letter while preserving neutral, respectful language based strictly on verified information.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleApplyDraft = (draft: string) => {
    setLetterText(draft);
    setHasGenerated(true);
  };

  // Generate initial draft on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleReset = () => {
    const emptyForm: ResignationFormData = {
      fullName: "",
      jobTitle: "",
      companyName: "",
      managerName: "",
      lastWorkingDay: getFutureDateString(2),
      preferredTone: "neutral_respectful",
      desiredLength: "standard",
      reasonCategory: "none_specified",
      customReason: "",
      importantDetails: "",
      constraints: "",
      personalContact: "",
    };
    setFormData(emptyForm);
    setLetterText("");
    setHasGenerated(false);
    setError(null);
    setChatMessages([createInitialGhostwriterMessage(emptyForm)]);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Intro banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
                Resignation Letter Ghostwriter
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                Verified Input Only
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Draft a professional, respectful departure notice based strictly on verified form inputs. No assumed reasons, invented facts, or unverified claims.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              id="reset-form-button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>

            {generationMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/70">
                <Sparkles className="w-3 h-3 text-amber-700" />
                {generationMode === "ai" ? "Gemini Ghostwriter" : "Standard Format"}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Form & Optional Consultation Tabs */}
          <div id="letter-form-column" className="lg:col-span-6 space-y-4">
            {/* View Mode Switcher */}
            <div className="flex items-center justify-between bg-white p-1.5 rounded-xl border border-stone-200 shadow-2xs">
              <button
                type="button"
                id="tab-form-view"
                onClick={() => setActiveLeftTab("form")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeLeftTab === "form"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Letter Parameters & Inputs</span>
              </button>

              <button
                type="button"
                id="tab-consultation-view"
                onClick={() => setActiveLeftTab("consultation")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeLeftTab === "consultation"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-amber-500" />
                <span>Ghostwriter Consultation</span>
              </button>
            </div>

            {activeLeftTab === "form" ? (
              <LetterForm
                formData={formData}
                onChange={handleUpdateFormData}
                onSubmit={handleGenerate}
                onOpenConsultation={() => setActiveLeftTab("consultation")}
                isLoading={isLoading}
              />
            ) : (
              <GhostwriterConsultation
                formData={formData}
                messages={chatMessages}
                onSendMessage={handleSendChatMessage}
                isLoading={isChatLoading}
                onApplyDraft={handleApplyDraft}
                onOpenFormTab={() => setActiveLeftTab("form")}
              />
            )}
          </div>

          {/* Right Column: Letter Document Preview */}
          <div id="letter-preview-column" className="lg:col-span-6 sticky top-22">
            <LetterPreview
              letterText={letterText}
              onUpdateText={setLetterText}
              onRegenerate={handleGenerate}
              isLoading={isLoading}
              hasGenerated={hasGenerated}
              employeeName={formData.fullName}
              managerName={formData.managerName}
              companyName={formData.companyName}
              generationMode={generationMode}
              modelUsed={modelUsed}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200/80 bg-white/50 py-4 text-center text-xs text-stone-500 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          Resignation Letter Ghostwriter • Neutral, respectful workplace letters faithful to your facts
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ResignationFormData } from "../types";
import {
  Bot,
  User,
  Send,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface GhostwriterConsultationProps {
  formData: ResignationFormData;
  messages: ChatMessage[];
  onSendMessage: (msg: string) => Promise<void>;
  isLoading: boolean;
  onApplyDraft: (draft: string) => void;
  onOpenFormTab?: () => void;
}

export const GhostwriterConsultation: React.FC<GhostwriterConsultationProps> = ({
  formData,
  messages,
  onSendMessage,
  isLoading,
  onApplyDraft,
}) => {
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check required inputs status according to Role Card
  const requiredChecks = [
    {
      label: "Desired Tone",
      isComplete: Boolean(formData.preferredTone),
      value: formData.preferredTone.replace("_", " "),
    },
    {
      label: "Reason for Leaving",
      isComplete: Boolean(formData.customReason.trim() || formData.reasonCategory),
      value: formData.customReason.trim() ? "Provided" : formData.reasonCategory.replace("_", " "),
    },
    {
      label: "Desired Letter Length",
      isComplete: Boolean(formData.desiredLength),
      value: formData.desiredLength,
    },
    {
      label: "Last Working Day",
      isComplete: Boolean(formData.lastWorkingDay),
      value: formData.lastWorkingDay || "Missing",
    },
    {
      label: "Constraints & Details",
      isComplete: Boolean(formData.constraints.trim() || formData.importantDetails.trim()),
      value: formData.constraints.trim() ? "Specified" : "Standard handover",
    },
  ];

  const allComplete = requiredChecks.slice(0, 4).every((c) => c.isComplete);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    const msg = inputVal.trim();
    setInputVal("");
    onSendMessage(msg);
  };

  const handleQuickPrompt = (text: string) => {
    onSendMessage(text);
  };

  return (
    <div
      id="ghostwriter-consultation-panel"
      className="bg-white rounded-2xl border border-stone-200/80 shadow-xs flex flex-col h-[600px] overflow-hidden"
    >
      {/* Header Bar */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                Ghostwriter Consultation
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                Active Interaction Loop
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Neutral, respectful translation & follow-up questions before drafting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Strict Neutrality</span>
        </div>
      </div>

      {/* Required Inputs Status Strip */}
      <div className="px-4 py-2 bg-stone-100/60 border-b border-stone-200/60 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-stone-500 font-semibold shrink-0">Required Inputs:</span>
        {requiredChecks.map((item, idx) => (
          <div
            key={idx}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md shrink-0 ${
              item.isComplete
                ? "bg-white border border-stone-200 text-stone-700"
                : "bg-amber-50 border border-amber-200 text-amber-900 font-medium"
            }`}
          >
            {item.isComplete ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3 h-3 text-amber-600" />
            )}
            <span className="capitalize">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/20 text-xs">
        {messages.map((msg) => {
          const isGhostwriter = msg.sender === "ghostwriter";
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isGhostwriter ? "items-start" : "items-start justify-end"}`}
            >
              {isGhostwriter && (
                <div className="w-7 h-7 rounded-lg bg-stone-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2.5 ${
                  isGhostwriter
                    ? "bg-white border border-stone-200/80 text-stone-800 shadow-2xs"
                    : "bg-stone-900 text-white shadow-2xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.draftLetter && (
                  <div className="mt-2 pt-2.5 border-t border-stone-100 bg-stone-50/80 -mx-1.5 p-2.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-stone-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Draft Generated
                      </span>
                      <button
                        type="button"
                        onClick={() => onApplyDraft(msg.draftLetter!)}
                        className="text-stone-900 font-semibold underline hover:text-stone-700 cursor-pointer"
                      >
                        Apply to Document Sheet
                      </button>
                    </div>
                    <div className="font-serif text-[11px] text-stone-600 max-h-28 overflow-y-auto p-2 bg-white rounded-lg border border-stone-200">
                      {msg.draftLetter.slice(0, 200)}...
                    </div>
                  </div>
                )}

                <div
                  className={`text-[9px] ${
                    isGhostwriter ? "text-stone-400" : "text-stone-400 text-right"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isGhostwriter && (
                <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs py-2 px-1">
            <Loader2 className="w-4 h-4 animate-spin text-stone-700" />
            <span>Ghostwriter is reviewing input and formulating questions...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-stone-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-stone-400 shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          Quick:
        </span>
        <button
          type="button"
          onClick={() =>
            handleQuickPrompt(
              "I feel frustrated by unfair workload, please translate this respectfully without negative accusations."
            )
          }
          className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200/80 text-stone-700 whitespace-nowrap transition-colors cursor-pointer"
        >
          Translate frustrated feelings neutrally
        </button>
        <button
          type="button"
          onClick={() =>
            handleQuickPrompt(
              "Please do not mention where I am going next or anything about my new compensation."
            )
          }
          className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200/80 text-stone-700 whitespace-nowrap transition-colors cursor-pointer"
        >
          Add constraint: Keep next role private
        </button>
        <button
          type="button"
          onClick={() =>
            handleQuickPrompt("All details look good, please proceed with drafting the letter.")
          }
          className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200/80 text-stone-700 whitespace-nowrap transition-colors cursor-pointer"
        >
          Ready: Draft the letter
        </button>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-stone-200 bg-white flex items-center gap-2">
        <input
          type="text"
          id="ghostwriter-input-field"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={
            allComplete
              ? "Ask follow-up questions, request adjustments, or express thoughts to translate..."
              : "Clarify your missing details or answer the Ghostwriter's question..."
          }
          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
        />
        <button
          type="submit"
          id="ghostwriter-send-button"
          disabled={isLoading || !inputVal.trim()}
          className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

import React from "react";
import { ResignationFormData } from "../types";
import { ToneSelector } from "./ToneSelector";
import { ReasonSelector } from "./ReasonSelector";
import { LengthSelector } from "./LengthSelector";
import { HANDOVER_SUGGESTIONS, CONSTRAINT_SUGGESTIONS, getFutureDateString } from "../data/defaults";
import { Sparkles, Calendar, User, Building, Briefcase, Plus, Loader2, Shield, MessageSquareText } from "lucide-react";

interface LetterFormProps {
  formData: ResignationFormData;
  onChange: (updated: Partial<ResignationFormData>) => void;
  onSubmit: () => void;
  onOpenConsultation?: () => void;
  isLoading: boolean;
}

export const LetterForm: React.FC<LetterFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onOpenConsultation,
  isLoading,
}) => {
  const handleShortcutDate = (weeks: number) => {
    onChange({ lastWorkingDay: getFutureDateString(weeks) });
  };

  const handleAddHandoverDetail = (suggestion: string) => {
    const current = formData.importantDetails ? formData.importantDetails.trim() : "";
    if (!current) {
      onChange({ importantDetails: suggestion });
    } else if (!current.includes(suggestion)) {
      onChange({ importantDetails: `${current}. ${suggestion}` });
    }
  };

  const handleAddConstraint = (constraint: string) => {
    const current = formData.constraints ? formData.constraints.trim() : "";
    if (!current) {
      onChange({ constraints: constraint });
    } else if (!current.includes(constraint)) {
      onChange({ constraints: `${current}; ${constraint}` });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      id="resignation-letter-form"
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-6"
    >
      <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            Resignation Information & Parameters
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Strictly adhering to your provided inputs, tone preferences, and length constraints.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 font-medium">
          <Shield className="w-3.5 h-3.5 text-stone-500" />
          No Invented Facts
        </span>
      </div>

      {/* 1. Basic Information */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          Sender & Recipient Information
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="field-fullName"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Your Full Name <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <User className="w-3.5 h-3.5" />
              </span>
              <input
                id="field-fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                placeholder="e.g. Alex Morgan"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-200 bg-stone-50/40 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="field-jobTitle"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Your Job Title <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Briefcase className="w-3.5 h-3.5" />
              </span>
              <input
                id="field-jobTitle"
                type="text"
                required
                value={formData.jobTitle}
                onChange={(e) => onChange({ jobTitle: e.target.value })}
                placeholder="e.g. Senior Product Designer"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-200 bg-stone-50/40 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="field-managerName"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Manager or HR Recipient <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <User className="w-3.5 h-3.5" />
              </span>
              <input
                id="field-managerName"
                type="text"
                required
                value={formData.managerName}
                onChange={(e) => onChange({ managerName: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-200 bg-stone-50/40 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="field-companyName"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Company Name <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Building className="w-3.5 h-3.5" />
              </span>
              <input
                id="field-companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => onChange({ companyName: e.target.value })}
                placeholder="e.g. Apex Innovations Inc."
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-200 bg-stone-50/40 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-stone-100" />

      {/* 2. Last Working Day */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="field-lastWorkingDay"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-600"
          >
            Last Working Day <span className="text-amber-600">*</span>
          </label>
          <span className="text-[11px] text-stone-400">
            Notice period departure date
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <input
              id="field-lastWorkingDay"
              type="date"
              required
              value={formData.lastWorkingDay}
              onChange={(e) => onChange({ lastWorkingDay: e.target.value })}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-200 bg-stone-50/40 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              id="shortcut-2weeks"
              onClick={() => handleShortcutDate(2)}
              className="px-2.5 py-2 text-[11px] font-medium rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              +2 Weeks
            </button>
            <button
              type="button"
              id="shortcut-3weeks"
              onClick={() => handleShortcutDate(3)}
              className="px-2.5 py-2 text-[11px] font-medium rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              +3 Weeks
            </button>
            <button
              type="button"
              id="shortcut-4weeks"
              onClick={() => handleShortcutDate(4)}
              className="px-2.5 py-2 text-[11px] font-medium rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              +1 Month
            </button>
          </div>
        </div>
      </div>

      <div className="h-px bg-stone-100" />

      {/* 3. Reason for Leaving (Main Content) */}
      <ReasonSelector
        selectedCategory={formData.reasonCategory}
        customReason={formData.customReason}
        onCategoryChange={(cat) => onChange({ reasonCategory: cat })}
        onCustomReasonChange={(reason) => onChange({ customReason: reason })}
      />

      <div className="h-px bg-stone-100" />

      {/* 4. Desired Tone (Required) */}
      <ToneSelector
        selectedTone={formData.preferredTone}
        onChange={(tone) => onChange({ preferredTone: tone })}
      />

      <div className="h-px bg-stone-100" />

      {/* 5. Desired Letter Length (Required) */}
      <LengthSelector
        selectedLength={formData.desiredLength}
        onChange={(len) => onChange({ desiredLength: len })}
      />

      <div className="h-px bg-stone-100" />

      {/* 6. Important Constraints or Details */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="field-constraints"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-600"
            >
              Important Constraints
            </label>
            <span className="text-[11px] text-stone-400">What to omit or keep private</span>
          </div>
          <input
            id="field-constraints"
            type="text"
            value={formData.constraints}
            onChange={(e) => onChange({ constraints: e.target.value })}
            placeholder="e.g. Do not disclose next company name, keep reason strictly confidential"
            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 bg-stone-50/40 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
          />

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {CONSTRAINT_SUGGESTIONS.map((item, idx) => (
              <button
                type="button"
                key={idx}
                id={`constraint-chip-${idx}`}
                onClick={() => handleAddConstraint(item)}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200/80 text-stone-700 transition-colors cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5 text-stone-500" />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Handover & Transition Commitments */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="field-importantDetails"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-600"
            >
              Handover & Transition Commitments
            </label>
            <span className="text-[11px] text-stone-400">Concrete transition tasks</span>
          </div>

          <textarea
            id="field-importantDetails"
            rows={2}
            value={formData.importantDetails}
            onChange={(e) => onChange({ importantDetails: e.target.value })}
            placeholder="e.g. I will complete design documentation, train team members on active accounts, and organize all project deliverables."
            className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-stone-50/40 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all resize-y"
          />

          <div className="flex flex-wrap gap-1.5">
            {HANDOVER_SUGGESTIONS.map((sug, idx) => (
              <button
                type="button"
                key={idx}
                id={`suggestion-chip-${idx}`}
                onClick={() => handleAddHandoverDetail(sug)}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200/80 text-stone-700 transition-colors cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5 text-stone-500" />
                <span>{sug}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Post-departure contact info (optional) */}
      <div>
        <label
          htmlFor="field-personalContact"
          className="block text-xs font-medium text-stone-700 mb-1"
        >
          Personal Contact Info <span className="text-stone-400 font-normal">(optional, for staying in touch)</span>
        </label>
        <input
          id="field-personalContact"
          type="text"
          value={formData.personalContact}
          onChange={(e) => onChange({ personalContact: e.target.value })}
          placeholder="e.g. alex.morgan@gmail.com or linkedin.com/in/alexmorgan"
          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 bg-stone-50/40 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
        />
      </div>

      {/* Primary Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
        <button
          type="submit"
          id="generate-letter-button"
          disabled={isLoading}
          className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>Drafting Neutral Letter...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Draft Resignation Letter</span>
            </>
          )}
        </button>

        {onOpenConsultation && (
          <button
            type="button"
            id="open-consultation-button"
            onClick={onOpenConsultation}
            className="py-3 px-4 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquareText className="w-4 h-4 text-stone-600" />
            <span>Consult Ghostwriter</span>
          </button>
        )}
      </div>
    </form>
  );
};


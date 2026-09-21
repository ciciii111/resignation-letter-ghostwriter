import React from "react";
import { ReasonCategory } from "../types";
import { REASON_OPTIONS } from "../data/defaults";

interface ReasonSelectorProps {
  selectedCategory: ReasonCategory;
  customReason: string;
  onCategoryChange: (cat: ReasonCategory) => void;
  onCustomReasonChange: (reason: string) => void;
}

export const ReasonSelector: React.FC<ReasonSelectorProps> = ({
  selectedCategory,
  customReason,
  onCategoryChange,
  onCustomReasonChange,
}) => {
  return (
    <div id="reason-selector" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          Reason for Leaving <span className="text-amber-600">*</span>
        </label>
        <span className="text-[11px] text-stone-400">
          Select or add custom context
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {REASON_OPTIONS.map((item) => {
          const isSelected = selectedCategory === item.id;
          return (
            <button
              type="button"
              key={item.id}
              id={`reason-chip-${item.id}`}
              onClick={() => onCategoryChange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? "bg-amber-100 text-amber-950 border border-amber-300 font-semibold shadow-2xs"
                  : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div>
        <input
          type="text"
          id="custom-reason-input"
          value={customReason}
          onChange={(e) => onCustomReasonChange(e.target.value)}
          placeholder="Optional: background context (e.g. accepted an opportunity in healthcare technology)"
          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
        />
        <p className="mt-1 text-[11px] text-stone-500">
          Source context is converted into a neutral, professional summary. Raw statements (e.g. &ldquo;I am angry with my boss&rdquo;) are never copied directly into the letter.
        </p>
      </div>
    </div>
  );
};

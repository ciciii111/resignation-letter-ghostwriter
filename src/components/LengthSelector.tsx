import React from "react";
import { LetterLength } from "../types";
import { LENGTH_OPTIONS } from "../data/defaults";
import { AlignLeft, AlignJustify, FileText } from "lucide-react";

interface LengthSelectorProps {
  selectedLength: LetterLength;
  onChange: (length: LetterLength) => void;
}

const lengthIcons: Record<LetterLength, React.ReactNode> = {
  short: <AlignLeft className="w-3.5 h-3.5" />,
  standard: <AlignJustify className="w-3.5 h-3.5" />,
  detailed: <FileText className="w-3.5 h-3.5" />,
};

export const LengthSelector: React.FC<LengthSelectorProps> = ({
  selectedLength,
  onChange,
}) => {
  return (
    <div id="length-selector" className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          Desired Letter Length <span className="text-amber-600">*</span>
        </label>
        <span className="text-[11px] text-stone-400">Required ghostwriter input</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {LENGTH_OPTIONS.map((opt) => {
          const isSelected = selectedLength === opt.id;
          return (
            <button
              type="button"
              key={opt.id}
              id={`length-option-${opt.id}`}
              onClick={() => onChange(opt.id)}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "border-stone-900 bg-stone-900 text-white shadow-2xs"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 text-stone-800"
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <div className="flex items-center gap-1.5 font-medium text-xs">
                  <span
                    className={`p-1 rounded-md ${
                      isSelected ? "bg-stone-800 text-amber-300" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {lengthIcons[opt.id]}
                  </span>
                  <span>{opt.label}</span>
                </div>
              </div>
              <p
                className={`text-[11px] leading-relaxed mb-1.5 ${
                  isSelected ? "text-stone-300" : "text-stone-500"
                }`}
              >
                {opt.description}
              </p>
              <span
                className={`text-[10px] font-mono font-medium ${
                  isSelected ? "text-amber-300" : "text-stone-400"
                }`}
              >
                {opt.wordCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

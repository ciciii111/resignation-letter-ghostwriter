import React from "react";
import { ToneType } from "../types";
import { TONE_OPTIONS } from "../data/defaults";
import { HeartHandshake, ShieldCheck, Zap, Smile, Scale } from "lucide-react";

interface ToneSelectorProps {
  selectedTone: ToneType;
  onChange: (tone: ToneType) => void;
}

const toneIcons: Record<ToneType, React.ReactNode> = {
  neutral_respectful: <Scale className="w-4 h-4" />,
  grateful_warm: <HeartHandshake className="w-4 h-4" />,
  formal_standard: <ShieldCheck className="w-4 h-4" />,
  brief_direct: <Zap className="w-4 h-4" />,
  amicable_enthusiastic: <Smile className="w-4 h-4" />,
};

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onChange,
}) => {
  return (
    <div id="tone-selector" className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
        Preferred Tone <span className="text-amber-600">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {TONE_OPTIONS.map((tone) => {
          const isSelected = selectedTone === tone.id;
          return (
            <button
              type="button"
              key={tone.id}
              id={`tone-option-${tone.id}`}
              onClick={() => onChange(tone.id)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/70 text-stone-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <span
                    className={`p-1 rounded-md ${
                      isSelected
                        ? "bg-stone-800 text-amber-300"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {toneIcons[tone.id]}
                  </span>
                  <span>{tone.title}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                    isSelected
                      ? "bg-stone-800 text-stone-300"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {tone.badge}
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isSelected ? "text-stone-300" : "text-stone-500"
                }`}
              >
                {tone.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

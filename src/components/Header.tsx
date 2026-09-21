import React from "react";
import { FileText, Shield, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header id="app-header" className="border-b border-stone-200/80 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center shadow-xs">
            <FileText className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-stone-900">
                Resignation Letter Ghostwriter
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/60">
                <Shield className="w-3 h-3 text-amber-700" />
                Neutral & Respectful
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Professional, neutral resignation letters based strictly on your verified inputs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium">Ghostwriter Active</span>
        </div>
      </div>
    </header>
  );
};


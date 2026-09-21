import React, { useState } from "react";
import { Copy, Check, Download, Printer, Edit3, Eye, Sparkles, RefreshCw } from "lucide-react";

interface LetterPreviewProps {
  letterText: string;
  onUpdateText: (newText: string) => void;
  onRegenerate: () => void;
  isLoading: boolean;
  hasGenerated: boolean;
  employeeName: string;
  managerName: string;
  companyName: string;
  generationMode?: "ai" | "template";
  modelUsed?: string;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  letterText,
  onUpdateText,
  onRegenerate,
  isLoading,
  hasGenerated,
  employeeName,
  managerName,
  companyName,
  generationMode = "ai",
  modelUsed,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const wordCount = letterText ? letterText.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 180));

  const handleCopy = async () => {
    if (!letterText) return;
    try {
      await navigator.clipboard.writeText(letterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = letterText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!letterText) return;
    const blob = new Blob([letterText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `Resignation_Letter_${(employeeName || "Notice").replace(/\s+/g, "_")}.txt`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!hasGenerated && !letterText) {
    return (
      <div
        id="letter-preview-empty"
        className="h-full min-h-[460px] bg-stone-50/60 rounded-2xl border-2 border-dashed border-stone-200/90 p-8 flex flex-col items-center justify-center text-center space-y-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 shadow-2xs">
          <Sparkles className="w-7 h-7 text-amber-500/70" />
        </div>
        <div className="max-w-xs space-y-1.5">
          <h3 className="text-sm font-semibold text-stone-800">
            Ready to Craft Your Letter
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Fill in your role, departure reason, preferred tone, and key details on the left, then click{" "}
            <span className="font-semibold text-stone-700">"Generate Resignation Letter"</span>.
          </p>
        </div>
        <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-400">
          <span>Official format</span>
          <span>•</span>
          <span>Custom tone</span>
          <span>•</span>
          <span>Instant export</span>
        </div>
      </div>
    );
  }

  return (
    <div id="letter-preview-container" className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="toggle-edit-mode"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isEditing
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-stone-100 hover:bg-stone-200/80 text-stone-700"
            }`}
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-700" />
                <span>View Letter</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                <span>Edit Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="regenerate-button"
            onClick={onRegenerate}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200/80 text-stone-700 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${isLoading ? "animate-spin" : ""}`} />
            <span>Regenerate</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="copy-letter-button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-emerald-200">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="download-letter-button"
            onClick={handleDownload}
            title="Download as .txt"
            className="p-1.5 rounded-lg text-stone-600 bg-stone-100 hover:bg-stone-200/80 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="print-letter-button"
            onClick={handlePrint}
            title="Print or Save as PDF"
            className="p-1.5 rounded-lg text-stone-600 bg-stone-100 hover:bg-stone-200/80 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Letter Document Sheet */}
      <div
        id="printable-resignation-letter"
        className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 sm:p-10 relative overflow-hidden transition-all print:shadow-none print:border-none print:p-0"
      >
        {/* Subtle decorative letterhead accent top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stone-800 via-amber-700 to-stone-800 print:hidden" />

        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-medium text-stone-700">Direct Editor Mode</span>
              <span>Edit your letter directly</span>
            </div>
            <textarea
              id="letter-editor-textarea"
              value={letterText}
              onChange={(e) => onUpdateText(e.target.value)}
              rows={18}
              className="w-full text-sm font-sans leading-relaxed text-stone-800 p-4 rounded-xl border border-stone-200 bg-stone-50/50 focus:outline-hidden focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all font-mono"
            />
          </div>
        ) : (
          <article className="font-serif text-stone-900 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap selection:bg-amber-100">
            {letterText}
          </article>
        )}

        {/* Footer Meta within Card */}
        <div className="mt-8 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400 print:hidden font-sans">
          <div className="flex items-center gap-2.5">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{readingTimeMinutes} min read</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {generationMode === "ai"
                ? `Ghostwriter AI${modelUsed ? ` (${modelUsed})` : ""}`
                : "Standard Verified Template"}
            </span>
          </div>
          <div className="text-[11px] text-stone-400">
            Ready for formal submission or printing
          </div>
        </div>
      </div>
    </div>
  );
};

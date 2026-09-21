import React from "react";
import { VocabWord } from "../types/curriculum";
import { audioManager } from "../utils/audioPlayer";
import { WordIllustration } from "./WordIllustration";
import { X, Volume2 } from "lucide-react";

interface Props {
  item: VocabWord | null;
  onClose: () => void;
}

export const VocabularyModal: React.FC<Props> = ({ item, onClose }) => {
  if (!item) return null;

  // Determine illustration svgType based on word id or english name
  const normalizedId = item.id.toLowerCase().replace(/[^a-z]/g, "");
  let svgType = "light";
  if (normalizedId.includes("torch")) svgType = "torch";
  else if (normalizedId.includes("dark")) svgType = "dark";
  else if (normalizedId.includes("shadow")) svgType = "shadow";
  else if (normalizedId.includes("reflect")) svgType = "reflect";
  else if (normalizedId.includes("sun")) svgType = "sun";
  else if (normalizedId.includes("protect")) svgType = "protect";
  else if (normalizedId.includes("pattern")) svgType = "pattern";
  else if (normalizedId.includes("mirror")) svgType = "mirror";
  else if (normalizedId.includes("crust")) svgType = "crust";
  else if (normalizedId.includes("mantle")) svgType = "mantle";
  else if (normalizedId.includes("outer")) svgType = "outer_core";
  else if (normalizedId.includes("inner")) svgType = "inner_core";
  else if (normalizedId.includes("granite")) svgType = "granite";
  else if (normalizedId.includes("basalt")) svgType = "basalt";
  else if (normalizedId.includes("chalk")) svgType = "chalk";
  else if (normalizedId.includes("limestone")) svgType = "limestone";
  else if (normalizedId.includes("marble")) svgType = "marble";
  else if (normalizedId.includes("sandstone")) svgType = "sandstone";
  else if (normalizedId.includes("slate")) svgType = "slate";
  else if (normalizedId.includes("pumice")) svgType = "pumice";
  else if (normalizedId.includes("fossil")) svgType = "fossil";
  else if (normalizedId.includes("soil")) svgType = "soil";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border-2 border-amber-300 shadow-2xl overflow-hidden space-y-4 relative animate-scale-up">
        {/* Visual Illustration Banner */}
        <div className="relative">
          <WordIllustration type={svgType} className="w-full h-44" />
          <button
            onClick={onClose}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-amber-900 bg-white/95 px-2.5 py-0.5 rounded-full font-mono shadow-xs border border-amber-200">
              {item.pageRef}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 pt-0 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 font-kid tracking-wide">
                {item.english}
              </h3>
              <p className="text-lg font-bold text-amber-800 font-arabic mt-0.5">
                {item.arabic}
              </p>
              {item.phonetic && (
                <span className="text-xs text-slate-400 font-mono">{item.phonetic}</span>
              )}
            </div>

            <button
              onClick={() => audioManager.speak(item.english, "en")}
              className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-md transition transform active:scale-95"
              title="استمع للنطق الصوتي"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                التعريف من الكتاب المدرسي:
              </span>
              <p className="text-slate-800 font-semibold">{item.definitionAr}</p>
              <p className="text-xs text-slate-500 font-kid mt-1">{item.definitionEn}</p>
            </div>

            {item.exampleEn && (
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-0.5">
                  سياق الدرس (Example in Lesson):
                </span>
                <p className="text-slate-700 italic font-kid">"{item.exampleEn}"</p>
                {item.exampleAr && (
                  <p className="text-slate-600 font-arabic mt-0.5">{item.exampleAr}</p>
                )}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

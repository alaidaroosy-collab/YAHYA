import React, { useState } from "react";
import { illustratedVocabList, IllustratedWord } from "../data/illustratedVocabulary";
import { WordIllustration } from "./WordIllustration";
import { audioManager } from "../utils/audioPlayer";
import {
  Volume2,
  Sparkles,
  Search,
  BookOpen,
  Sun,
  Globe,
  HelpCircle,
  X,
  Lightbulb,
} from "lucide-react";

export const VocabularyVisualAtlas: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "light" | "earth">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeWordModal, setActiveWordModal] = useState<IllustratedWord | null>(null);

  const filteredWords = illustratedVocabList.filter((word) => {
    const matchesCategory =
      selectedCategory === "all" || word.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      word.english.toLowerCase().includes(query) ||
      word.arabic.includes(query) ||
      word.definitionEn.toLowerCase().includes(query) ||
      word.definitionAr.includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-mono">
                المعجم المصور التفاعلي
              </span>
              <span className="text-xs text-slate-400 font-kid">Visual Science Picture Dictionary</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-arabic">
              قاموس المصطلحات العلمية المصور (تغذية بصرية شاملة)
            </h3>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            جميع الكلمات ({illustratedVocabList.length})
          </button>
          <button
            onClick={() => setSelectedCategory("light")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              selectedCategory === "light"
                ? "bg-amber-500 text-white shadow"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>الضوء والظلام</span>
          </button>
          <button
            onClick={() => setSelectedCategory("earth")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              selectedCategory === "earth"
                ? "bg-emerald-600 text-white shadow"
                : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>كوكب الأرض والصخور</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute right-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بالإنجليزية أو العربية (مثال: torch, granite, reflect, صخر, انعكاس...)"
          className="w-full pr-11 pl-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm text-slate-800 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute left-3.5 top-3 text-xs text-slate-400 hover:text-slate-600"
          >
            مسح
          </button>
        )}
      </div>

      {/* Visual Flashcards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => (
          <div
            key={word.id}
            onClick={() => setActiveWordModal(word)}
            className="group cursor-pointer bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Visual Illustration */}
            <div className="relative">
              <WordIllustration type={word.svgType} className="w-full h-40" />
              {/* Page Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-700 font-mono shadow-xs border border-slate-200">
                {word.pageRef}
              </div>
              {/* Pronounce quick icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audioManager.speak(word.english, "en");
                }}
                className="absolute bottom-3 right-3 p-2 bg-white/95 hover:bg-amber-500 hover:text-white text-slate-700 rounded-xl shadow-md transition transform active:scale-95"
                title="استمع للنطق الإنجليزي"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Word Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold text-slate-900 font-kid tracking-wide group-hover:text-amber-600 transition">
                    {word.english}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">{word.phonetic}</span>
                </div>
                <p className="text-base font-bold text-amber-900 font-arabic mt-0.5">
                  {word.arabic}
                </p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {word.definitionAr}
                </p>
              </div>

              {/* Lesson Sentence */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 italic font-kid">
                "{word.exampleEn}"
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 text-slate-400 space-y-2">
          <BookOpen className="w-10 h-10 mx-auto opacity-40" />
          <p className="text-sm font-bold">لم نجد كلمات تطابق بحثك</p>
        </div>
      )}

      {/* Detailed Word Modal with Deep Nutrition */}
      {activeWordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-amber-300 shadow-2xl overflow-hidden animate-scale-up space-y-4">
            {/* Modal Image Header */}
            <div className="relative">
              <WordIllustration type={activeWordModal.svgType} className="w-full h-48" />
              <button
                onClick={() => setActiveWordModal(null)}
                className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-md transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 right-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-slate-800 font-mono shadow">
                كتاب كامبريدج: {activeWordModal.pageRef}
              </div>
            </div>

            {/* Word Content Body */}
            <div className="p-6 pt-0 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 font-kid tracking-wide">
                    {activeWordModal.english}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl font-bold text-amber-900 font-arabic">
                      {activeWordModal.arabic}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {activeWordModal.phonetic}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => audioManager.speak(activeWordModal.english, "en")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-md transition transform active:scale-95"
                >
                  <Volume2 className="w-5 h-5" />
                  <span className="text-xs font-bold">استمع</span>
                </button>
              </div>

              {/* Definitions */}
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-900 block mb-0.5">
                    التعريف المبسط (عربي):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {activeWordModal.definitionAr}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-indigo-900 block mb-0.5">
                    English Definition:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-kid leading-relaxed">
                    {activeWordModal.definitionEn}
                  </p>
                </div>
              </div>

              {/* Example in textbook */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <span className="text-[11px] font-bold text-emerald-900 block">
                  مثال من سياق الكتاب المدرسي:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 italic font-kid">
                  "{activeWordModal.exampleEn}"
                </p>
                <p className="text-xs text-slate-600 font-arabic">
                  {activeWordModal.exampleAr}
                </p>
              </div>

              {/* Fun Scientific Fact */}
              {activeWordModal.funFactEn && (
                <div className="p-3 rounded-2xl bg-amber-100/60 border border-amber-300 flex items-start gap-2.5 text-xs text-amber-950">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">هل تعلم؟ (Fun Science Fact):</span>
                    <p className="font-arabic">{activeWordModal.funFactAr}</p>
                    <p className="font-kid text-slate-700 mt-0.5">{activeWordModal.funFactEn}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import { Sparkles, Volume2, CheckCircle2, RotateCcw, Building2 } from "lucide-react";
import confetti from "canvas-confetti";

interface MaterialItem {
  id: string;
  nameEn: string;
  nameAr: string;
  category: "natural" | "humanMade";
  icon: string;
  placedIn: "unassigned" | "natural" | "humanMade";
}

export const BuildingMaterialsSorter: React.FC = () => {
  // Directly from Page 36 items:
  // concrete path, plastic door frame, stone wall, brick wall, wooden decking, metal girders
  const initialItems: MaterialItem[] = [
    { id: "concrete", nameEn: "concrete path", nameAr: "ممر خرساني", category: "humanMade", icon: "🛤️", placedIn: "unassigned" },
    { id: "stoneWall", nameEn: "stone wall", nameAr: "جدار حجري", category: "natural", icon: "🧱", placedIn: "unassigned" },
    { id: "plasticFrame", nameEn: "plastic door frame", nameAr: "إطار باب بلاستيكي", category: "humanMade", icon: "🚪", placedIn: "unassigned" },
    { id: "woodDecking", nameEn: "wooden decking", nameAr: "أرضية خشبية", category: "natural", icon: "🪵", placedIn: "unassigned" },
    { id: "brickWall", nameEn: "brick wall", nameAr: "جدار من الطوب (الآجر)", category: "humanMade", icon: "🧱", placedIn: "unassigned" },
    { id: "metalGirders", nameEn: "metal girders", nameAr: "دعامات حديدية (كمرات معدنية)", category: "humanMade", icon: "🏗️", placedIn: "unassigned" },
  ];

  const [items, setItems] = useState<MaterialItem[]>(initialItems);

  const handlePlaceItem = (itemId: string, targetZone: "natural" | "humanMade") => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (item.category === targetZone) {
      audioManager.playSuccessSound();
      audioManager.speak(`Correct! ${item.nameEn} is ${targetZone === "natural" ? "a natural material" : "a human-made material"}.`, "en");
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, placedIn: targetZone } : i))
      );

      // Check if all placed
      const remaining = items.filter((i) => i.placedIn === "unassigned" && i.id !== itemId);
      if (remaining.length === 0) {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      audioManager.playErrorSound();
      audioManager.speak(`Try again. ${item.nameEn} is not ${targetZone === "natural" ? "natural" : "human-made"}.`, "en");
    }
  };

  const handleReset = () => {
    setItems(initialItems);
  };

  const unassigned = items.filter((i) => i.placedIn === "unassigned");
  const naturalList = items.filter((i) => i.placedIn === "natural");
  const humanMadeList = items.filter((i) => i.placedIn === "humanMade");

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-emerald-100">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
            صفحة 36
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>لعبة تصنيف مواد البناء: طبيعية أم من صنع الإنسان؟</span>
          </h3>
          <p className="text-sm text-slate-500 font-arabic">
            "Natural building materials (stone, wood) vs Human-made materials (concrete, plastic, brick, metal)."
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              audioManager.speak(
                "Sort the building materials into natural or human-made.",
                "en"
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>استمع للتعليمات</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            title="إعادة التصنيف"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Unassigned Items Tray */}
      {unassigned.length > 0 ? (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600 block mb-2">
            المواد المطلوب تصنيفها (انقري على الصندوق المناسب لوضعها):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {unassigned.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded-xl border border-slate-300 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.nameAr}</span>
                    <span className="text-[11px] text-slate-500 font-kid">{item.nameEn}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handlePlaceItem(item.id, "natural")}
                    className="py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition"
                  >
                    طبيعية 🌱
                  </button>
                  <button
                    onClick={() => handlePlaceItem(item.id, "humanMade")}
                    className="py-1 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 transition"
                  >
                    صنع إنسان 🏭
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-center animate-fade-in">
          <p className="font-bold text-emerald-900 text-sm">
            أحسنتِ صنعاً! تم تصنيف جميع مواد البناء الستة بشكل صحيح تماماً كما في صفحة 36! 🎉
          </p>
        </div>
      )}

      {/* Target Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Natural Materials Bucket */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-300 min-h-[160px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200">
            <span className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
              <span>🌱</span>
              <span>مواد طبيعية (Natural materials)</span>
            </span>
            <span className="text-xs font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
              {naturalList.length} / 2
            </span>
          </div>

          <div className="space-y-2">
            {naturalList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-2.5 rounded-xl border border-emerald-300 flex items-center justify-between text-xs font-bold text-slate-800 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.nameAr}</span>
                  <span className="text-slate-400 font-kid">({item.nameEn})</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            ))}
            {naturalList.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">
                لا توجد مواد هنا بعد...
              </p>
            )}
          </div>
        </div>

        {/* Human-Made Materials Bucket */}
        <div className="bg-blue-50/70 p-4 rounded-2xl border-2 border-blue-300 min-h-[160px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-200">
            <span className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
              <span>🏭</span>
              <span>مواد من صنع الإنسان (Human-made materials)</span>
            </span>
            <span className="text-xs font-mono font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">
              {humanMadeList.length} / 4
            </span>
          </div>

          <div className="space-y-2">
            {humanMadeList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-2.5 rounded-xl border border-blue-300 flex items-center justify-between text-xs font-bold text-slate-800 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.nameAr}</span>
                  <span className="text-slate-400 font-kid">({item.nameEn})</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
            ))}
            {humanMadeList.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">
                لا توجد مواد هنا بعد...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

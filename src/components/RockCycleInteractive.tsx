import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import { Sparkles, Volume2, RefreshCw, Flame, ArrowRight, Layers } from "lucide-react";

export const RockCycleInteractive: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      id: "magma",
      titleEn: "Magma",
      titleAr: "الماجما (الصهارة)",
      icon: "🌋",
      badge: "باطن الأرض",
      descriptionAr: "صخور منصهرة شديدة السخونة توجد في أعماق باطن الأرض.",
      descriptionEn: "Extremely hot liquid molten rock deep inside the Earth.",
      nextAction: "تبريد وتصلب (Cooling & Hardening)",
    },
    {
      id: "igneous",
      titleEn: "Igneous Rocks",
      titleAr: "الصخور النارية",
      icon: "🪨",
      badge: "جرانيت وبازلت",
      descriptionAr: "تتشكل عندما تبرد الصهارة وتتصلب، مثل البازلت والجرانيت.",
      descriptionEn: "Formed when magma cools and solidifies, like granite and basalt.",
      nextAction: "تجوية وتعرية وترسب (Weathering & Compacting)",
    },
    {
      id: "sedimentary",
      titleEn: "Sedimentary Rocks",
      titleAr: "الصخور الرسوبية",
      icon: "🏜️",
      badge: "طباشير ورملي وطيني",
      descriptionAr: "تتكون من تراكم الرواسب والحبيبات في طبقات بمرور الزمن.",
      descriptionEn: "Formed from compressed sediments and grains over time.",
      nextAction: "حرارة وضغط هائلان (Heat & Pressure)",
    },
    {
      id: "metamorphic",
      titleEn: "Metamorphic Rocks",
      titleAr: "الصخور المتحولة",
      icon: "🏛️",
      badge: "رخام وأردواز",
      descriptionAr: "صخور تغيرت بفعل الحرارة الشديدة والضغط العالي دون انصهار، كالرخام.",
      descriptionEn: "Changed by extreme underground heat and pressure, like marble.",
      nextAction: "انصهار بفعل الحرارة الشديدة (Melting)",
    },
  ];

  const current = stages[activeStage];

  const handleNextStage = () => {
    const next = (activeStage + 1) % stages.length;
    setActiveStage(next);
    audioManager.speak(stages[next].titleEn + ". " + stages[next].descriptionEn, "en");
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-orange-100">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold font-mono">
            صفحة 33
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-600" />
            <span>محاكي دورة الصخور الدائرية (The Rock Cycle Simulator)</span>
          </h3>
          <p className="text-sm text-slate-500 font-arabic">
            كيف تتحول الصخور من نوع إلى آخر في دورة مستمرة لا تتوقف؟
          </p>
        </div>

        <button
          onClick={() =>
            audioManager.speak(
              "The rock cycle: Magma cools into igneous rock, weathers into sedimentary rock, changes under heat and pressure into metamorphic rock, and melts back into magma.",
              "en"
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-800 hover:bg-orange-100 text-sm font-semibold transition"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع لدورة الصخور</span>
        </button>
      </div>

      {/* Interactive Circular Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stg, idx) => {
          const isActive = activeStage === idx;
          return (
            <div
              key={stg.id}
              onClick={() => {
                setActiveStage(idx);
                audioManager.speak(stg.titleEn, "en");
              }}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center flex flex-col justify-between ${
                isActive
                  ? "bg-orange-50 border-orange-500 shadow-lg scale-102 ring-2 ring-orange-300"
                  : "bg-white border-slate-200 hover:border-orange-300"
              }`}
            >
              <div>
                <span className="text-4xl block mb-2">{stg.icon}</span>
                <span className="text-xs font-bold text-orange-900 bg-orange-100 px-2 py-0.5 rounded-full">
                  المرحلة {idx + 1}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">{stg.titleAr}</h4>
                <p className="text-xs text-slate-500 font-kid">{stg.titleEn}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-orange-700 font-bold flex items-center justify-center gap-1">
                <span>{stg.nextAction}</span>
                <ArrowRight className="w-3 h-3 rotate-180" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Deep Dive */}
      <div className="bg-orange-50/70 p-5 rounded-2xl border-2 border-orange-300 animate-fade-in flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{current.icon}</span>
            <h4 className="text-lg font-bold text-slate-900">
              {current.titleAr} ({current.titleEn})
            </h4>
          </div>
          <p className="text-sm font-semibold text-slate-800">{current.descriptionAr}</p>
          <p className="text-xs text-slate-600 font-kid">{current.descriptionEn}</p>
        </div>

        <button
          onClick={handleNextStage}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition flex items-center gap-2"
        >
          <span>الخطوة التالية في الدورة</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
};

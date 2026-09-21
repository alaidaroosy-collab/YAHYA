import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import { Sparkles, Volume2, CheckCircle2, Ruler, Lightbulb } from "lucide-react";

export const ShadowDistanceLab: React.FC = () => {
  const [distance, setDistance] = useState<number>(20);
  const [showPattern, setShowPattern] = useState<boolean>(false);

  // Measurements matching Page 25 data
  const heightMap: { [key: number]: number } = {
    20: 24,
    40: 18,
    60: 13,
    80: 9,
    100: 6,
  };

  const currentHeight = heightMap[distance] || 24;

  const handleDistanceChange = (newDist: number) => {
    setDistance(newDist);
    audioManager.speak(
      `Distance: ${newDist} centimetres. Shadow height: ${heightMap[newDist]} centimetres.`,
      "en"
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-emerald-100">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
            صفحات 24 و 25
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-emerald-600" />
            <span>مختبر قياس المسافة وتغير حجم الظل (Shadow Distance & Height Lab)</span>
          </h3>
          <p className="text-sm text-slate-500 font-arabic">
            التجربة المنهجية: كيف يتغير ارتفاع الظل كلما ابتعد الجسم عن المصباح اليدوي؟
          </p>
        </div>

        <button
          onClick={() =>
            audioManager.speak(
              "How do shadows change? Is there a pattern? Farther from the torch: a smaller shadow.",
              "en"
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع للشرح</span>
        </button>
      </div>

      {/* Part 1: Light Traveling Through Materials (Page 24) */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>جدول فحص نفاذ الضوء وتكون الظلال (صفحة 24 - Does light travel through?):</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
          {[
            { nameEn: "book", nameAr: "كتاب", travel: false, shadow: true },
            { nameEn: "clear glass", nameAr: "زجاج شفاف", travel: true, shadow: false },
            { nameEn: "wooden block", nameAr: "مكعب خشبي", travel: false, shadow: true },
            { nameEn: "metal spoon", nameAr: "ملعقة معدنية", travel: false, shadow: true },
            { nameEn: "clear plastic", nameAr: "بلاستيك شفاف", travel: true, shadow: false },
            { nameEn: "cardboard", nameAr: "ورق مقوى", travel: false, shadow: true },
          ].map((item) => (
            <div
              key={item.nameEn}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-between ${
                item.shadow ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"
              }`}
            >
              <span className="font-bold text-slate-800">{item.nameAr}</span>
              <span className="text-slate-500 font-kid">{item.nameEn}</span>
              <div className="mt-1.5 font-semibold">
                {item.travel ? (
                  <span className="text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">
                    ينفذ الضوء ✓
                  </span>
                ) : (
                  <span className="text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded text-[11px]">
                    يتكون ظل (Shadow)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Interactive Distance Stage */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border-2 border-slate-700 shadow-inner">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <span className="text-xs bg-slate-800 text-emerald-400 px-3 py-1 rounded-full font-bold">
            تجربة الغرفة المظلمة (Dark Room Experiment)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">المسافة الحالية:</span>
            <span className="text-sm font-mono font-bold text-amber-400">{distance} cm</span>
          </div>
        </div>

        {/* Visual setup view */}
        <div className="relative h-56 w-full bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-between px-6 sm:px-12">
          {/* Torch */}
          <div className="flex flex-col items-center z-10">
            <div className="w-14 h-9 bg-slate-600 rounded-lg flex items-center justify-center border border-slate-500 shadow">
              <span className="text-xl">🔦</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">المصباح (Torch)</span>
          </div>

          {/* Light cone beam */}
          <div
            className="absolute left-16 sm:left-24 top-1/2 -translate-y-1/2 h-36 bg-gradient-to-r from-amber-400/30 to-amber-200/5 pointer-events-none"
            style={{
              width: `${(distance / 100) * 55 + 20}%`,
              clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 60%)",
            }}
          />

          {/* Object (Can / Block) positioned dynamically */}
          <div
            className="flex flex-col items-center transition-all duration-300 z-10"
            style={{
              transform: `translateX(${(distance - 20) * 1.5}px)`,
            }}
          >
            <div className="w-10 h-16 bg-red-600 rounded-lg border-2 border-red-400 shadow-md flex items-center justify-center text-white font-bold text-[10px]">
              CAN
            </div>
            <span className="text-[10px] text-amber-300 mt-1 whitespace-nowrap">
              {distance} cm
            </span>
          </div>

          {/* White Screen with Projecting Shadow */}
          <div className="w-20 sm:w-28 h-48 bg-slate-100 rounded-lg border-4 border-slate-400 flex flex-col items-center justify-center shadow-lg relative overflow-hidden z-10">
            <span className="absolute top-1 text-[10px] text-slate-500 font-bold">
              الشاشة (Screen)
            </span>

            {/* Dynamic Shadow */}
            <div
              className="bg-slate-900 rounded-md transition-all duration-300 flex items-center justify-center shadow-inner"
              style={{
                width: `${currentHeight * 2.2}px`,
                height: `${currentHeight * 3.8}px`,
              }}
            >
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {currentHeight}cm
              </span>
            </div>

            <span className="absolute bottom-1 text-[10px] text-slate-600 font-bold">
              الظل (Shadow)
            </span>
          </div>
        </div>

        {/* Distance Selector Buttons */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          {[20, 40, 60, 80, 100].map((dist) => (
            <button
              key={dist}
              onClick={() => handleDistanceChange(dist)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                distance === dist
                  ? "bg-amber-500 text-slate-950 shadow-lg scale-105"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {dist} cm
            </button>
          ))}
        </div>
      </div>

      {/* Part 3: Data Recording Table from Page 25 */}
      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
        <h4 className="text-sm font-bold text-slate-800 mb-2">
          جدول القياسات التجريبية (صفحة 25):
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm border-collapse">
            <thead>
              <tr className="bg-amber-100/70 text-amber-900 border-b border-amber-300">
                <th className="p-2 border-l border-amber-200">المسافة (Distance from torch)</th>
                <th className="p-2">ارتفاع الظل (Height of shadow)</th>
              </tr>
            </thead>
            <tbody>
              {[20, 40, 60, 80, 100].map((d) => (
                <tr
                  key={d}
                  className={`border-b border-amber-200 ${
                    distance === d ? "bg-amber-200/60 font-bold" : "bg-white"
                  }`}
                >
                  <td className="p-2 border-l border-amber-200 font-mono">{d} cm</td>
                  <td className="p-2 font-mono text-emerald-800 font-bold">
                    {heightMap[d]} cm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pattern deduction */}
        <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              النمط المستنتج (Scientific Pattern - Page 25)
            </span>
            <p className="text-sm font-bold text-slate-800 mt-1">
              "Is there a pattern in the way that the shadow changed?"
            </p>
          </div>

          <button
            onClick={() => {
              setShowPattern(!showPattern);
              audioManager.speak(
                "Farther from the torch: a smaller shadow. كلما ابتعد الجسم عن المصباح صغر حجم الظل.",
                "en"
              );
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{showPattern ? "إخفاء النمط" : "كشف النمط الرياضي والعلمي"}</span>
          </button>
        </div>

        {showPattern && (
          <div className="mt-3 p-3 bg-white rounded-xl border-2 border-emerald-400 text-slate-800 animate-fade-in text-sm">
            <p className="font-bold text-emerald-900 text-base mb-1">
              🎯 القاعدة الرسمية من صفحة 25:
            </p>
            <p className="font-semibold text-slate-800">
              "Farther from the torch: a smaller shadow."
            </p>
            <p className="text-xs text-slate-600 mt-1">
              كلما زادت المسافة بين المصباح والجسم (20cm → 100cm)، قل ارتفاع الظل على الشاشة (24cm → 6cm).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

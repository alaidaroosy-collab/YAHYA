import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import { Sparkles, Volume2, Check, ArrowUpRight } from "lucide-react";

export const InteractiveRaySimulator: React.FC = () => {
  const [torchAngle, setTorchAngle] = useState<number>(35); // degrees
  const [isLightOn, setIsLightOn] = useState<boolean>(true);
  const [windowMirrorActive, setWindowMirrorActive] = useState<boolean>(false);

  // Smooth objects from Page 19
  const [testedObjects, setTestedObjects] = useState<{ [key: string]: boolean }>({
    plate: true,
    spoon: true,
    metalBowl: true,
    mirror: true,
    glassTumbler: true,
    glazedTile: true,
  });

  const wallHitY = 160 - torchAngle * 2.2;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-cyan-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-cyan-100">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold font-mono">
            صفحات 18 و 19
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-600" />
            <span>محاكي انعكاس الضوء من المرآة (Mirror Reflection Simulator)</span>
          </h3>
          <p className="text-sm text-slate-500">
            "A torch beam reflected by a mirror onto a wall. المرآة لا تصنع الضوء بل تعكسه."
          </p>
        </div>

        <button
          onClick={() =>
            audioManager.speak(
              "A torch beam is reflected by a mirror onto a wall. The mirror does not make light, it reflects light from another source.",
              "en"
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 hover:bg-cyan-100 text-sm font-semibold transition"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع للشرح</span>
        </button>
      </div>

      {/* Visual Ray Canvas */}
      <div className="relative w-full h-80 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex flex-col justify-between p-4 shadow-inner">
        {/* Wall on right */}
        <div className="absolute right-0 top-0 bottom-12 w-8 bg-gradient-to-l from-slate-700 to-slate-800 border-l-4 border-slate-500 flex items-center justify-center">
          <span className="text-white/60 text-xs font-bold font-arabic rotate-90 whitespace-nowrap">
            الجدار (Wall)
          </span>
        </div>

        {/* Top Info Banner */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs bg-slate-800/80 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
            {isLightOn ? "💡 المصباح مضاء (Torch ON)" : "🌑 المصباح مطفأ (Torch OFF)"}
          </span>
          <button
            onClick={() => setIsLightOn(!isLightOn)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition shadow ${
              isLightOn ? "bg-amber-500 text-slate-950 hover:bg-amber-400" : "bg-slate-700 text-white"
            }`}
          >
            {isLightOn ? "إطفاء المصباح" : "تشغيل المصباح"}
          </button>
        </div>

        {/* Ray SVG Graphics */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 320">
          {/* Torch at (80, 100) */}
          <g transform={`rotate(${torchAngle - 30}, 80, 100)`}>
            <rect x="30" y="85" width="60" height="30" rx="4" fill="#64748b" />
            <polygon points="90,75 120,65 120,135 90,125" fill="#f59e0b" />
          </g>

          {/* Mirror at bottom (260, 270) to (380, 270) */}
          <rect x="250" y="270" width="140" height="12" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
          <text x="320" y="300" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="bold">
            المرآة (Mirror)
          </text>

          {isLightOn && (
            <>
              {/* Incident Ray from torch to mirror center (320, 270) */}
              <line
                x1="110"
                y1="100"
                x2="320"
                y2="270"
                stroke="#fbbf24"
                strokeWidth="4"
                strokeDasharray="6 3"
                className="animate-pulse"
              />
              {/* Arrow on incident ray */}
              <circle cx="215" cy="185" r="4" fill="#fbbf24" />

              {/* Reflected Ray from mirror (320, 270) to wall (570, wallHitY) */}
              <line
                x1="320"
                y1="270"
                x2="570"
                y2={wallHitY}
                stroke="#38bdf8"
                strokeWidth="5"
                strokeDasharray="6 3"
                className="animate-pulse"
              />

              {/* Hit point on wall */}
              <circle cx="568" cy={wallHitY} r="14" fill="#38bdf8" opacity="0.6" className="animate-ping" />
              <circle cx="568" cy={wallHitY} r="9" fill="#e0f2fe" />
            </>
          )}
        </svg>

        {/* Bottom controls */}
        <div className="relative z-10 bg-slate-800/80 p-3 rounded-xl backdrop-blur-sm border border-slate-700 flex items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs text-slate-300 whitespace-nowrap">زاوية المصباح (Angle):</span>
            <input
              type="range"
              min="20"
              max="55"
              value={torchAngle}
              onChange={(e) => setTorchAngle(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-amber-400">{torchAngle}°</span>
          </div>
          <div className="text-xs text-slate-300 font-arabic hidden sm:block">
            {isLightOn
              ? "تتبعي السهم: من المصباح إلى المرآة ثم إلى الجدار!"
              : "عند إطفاء المصباح يختفي الانعكاس!"}
          </div>
        </div>
      </div>

      {/* Smooth Objects Table from Page 19 */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-cyan-600" />
            <span>جدول فحص الأجسام الملساء (Smooth objects reflecting light - Page 19):</span>
          </h4>
          <span className="text-xs text-slate-500 font-arabic">جميع الأجسام الملساء تعكس الضوء</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { id: "plate", en: "plate", ar: "صحن", icon: "🍽️" },
            { id: "spoon", en: "spoon", ar: "ملعقة", icon: "🥄" },
            { id: "metalBowl", en: "metal bowl", ar: "وعاء معدني", icon: "🥣" },
            { id: "mirror", en: "mirror", ar: "مرآة", icon: "🪞" },
            { id: "glassTumbler", en: "glass tumbler", ar: "كوب زجاجي", icon: "🥛" },
            { id: "glazedTile", en: "glazed tile", ar: "بلاطة مصقولة", icon: "🧱" },
          ].map((obj) => (
            <div
              key={obj.id}
              className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center shadow-xs"
            >
              <span className="text-2xl mb-1">{obj.icon}</span>
              <span className="text-sm font-bold text-slate-800">{obj.ar}</span>
              <span className="text-xs text-slate-500 font-kid">{obj.en}</span>
              <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <Check className="w-3.5 h-3.5" />
                <span>يعكس (Yes)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stretch Zone: Mirror opposite window */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
            سؤال التفكير المتقدم (Stretch Zone - Page 19)
          </span>
          <p className="text-sm font-bold text-slate-800 mt-1">
            لماذا يضع بعض الناس مرآة في مواجهة نافذة الغرفة؟
          </p>
          <p className="text-xs text-slate-600 font-kid">
            "Why do you think people might place a mirror opposite a window in a room?"
          </p>
        </div>

        <button
          onClick={() => {
            setWindowMirrorActive(!windowMirrorActive);
            audioManager.speak(
              "People place a mirror opposite a window to reflect sunlight into the room and make it brighter.",
              "en"
            );
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-sm transition"
        >
          {windowMirrorActive ? "إخفاء الإجابة" : "كشف الإجابة النموذجية"}
        </button>

        {windowMirrorActive && (
          <div className="w-full mt-2 p-3 bg-white rounded-lg border border-amber-300 animate-fade-in text-sm text-slate-800">
            <strong>الإجابة من صفحة 19:</strong> لعكس ضوء الشمس إلى أرجاء الغرفة فتزداد إضاءتها وسطوعها!
            (To reflect sunlight into the room).
          </div>
        )}
      </div>
    </div>
  );
};

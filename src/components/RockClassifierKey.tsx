import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import { Sparkles, Volume2, HelpCircle, CheckCircle2, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

interface RockData {
  id: string;
  nameEn: string;
  nameAr: string;
  colorType: "white" | "coloured";
  characteristics: string[];
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
}

export const RockClassifierKey: React.FC = () => {
  // Navigation states through the key
  const [currentQuestion, setCurrentQuestion] = useState<string>("q1_colour");
  const [resultRock, setResultRock] = useState<RockData | null>(null);

  const rocks: { [key: string]: RockData } = {
    chalk: {
      id: "chalk",
      nameEn: "Chalk",
      nameAr: "الطباشير",
      colorType: "white",
      characteristics: ["لون أبيض (White)", "صخر لين (Soft)"],
      descriptionAr: "صخر أبيض ناعم ولين يسهل تركه لأثر عند الكتابة.",
      descriptionEn: "A soft, white, porous sedimentary rock.",
      icon: "🖍️",
    },
    limestone: {
      id: "limestone",
      nameEn: "Limestone",
      nameAr: "الحجر الجيري",
      colorType: "white",
      characteristics: ["لون أبيض (White)", "صلب (Hard)", "يحتوي على قواقع وأصداف (Has shells)"],
      descriptionAr: "صخر أبيض صلب يحتوي على بقايا وأصداف كائنات بحرية قديمة.",
      descriptionEn: "A hard white rock containing shells.",
      icon: "🐚",
    },
    marble: {
      id: "marble",
      nameEn: "Marble",
      nameAr: "الرخام",
      colorType: "white",
      characteristics: ["لون أبيض (White)", "صلب (Hard)", "لا يحتوي على قواقع (No shells)"],
      descriptionAr: "صخر متحول أبيض وناصع صلب جداً بدون أصداف.",
      descriptionEn: "A hard white rock with no shells.",
      icon: "🏛️",
    },
    granite: {
      id: "granite",
      nameEn: "Granite",
      nameAr: "الجرانيت",
      colorType: "coloured",
      characteristics: ["ملون (Coloured)", "بدون طبقات (No layers)", "بلورات كبيرة (Large crystals)"],
      descriptionAr: "صخر ناري ملون شديد الصلابة ذو بلورات معدنية مرئية وكبيرة.",
      descriptionEn: "A coloured rock with no layers and large crystals.",
      icon: "🪨",
    },
    basalt: {
      id: "basalt",
      nameEn: "Basalt",
      nameAr: "البازلت",
      colorType: "coloured",
      characteristics: ["ملون داكن (Coloured)", "بدون طبقات (No layers)", "بلورات صغيرة (Small crystals)"],
      descriptionAr: "صخر بركاني داكن ناتج عن تبريد سريع للصهارة ببلورات دقيقة.",
      descriptionEn: "A coloured rock with no layers and small crystals.",
      icon: "🌋",
    },
    sandstone: {
      id: "sandstone",
      nameEn: "Sandstone",
      nameAr: "الحجر الرملي",
      colorType: "coloured",
      characteristics: ["ملون (Coloured)", "به طبقات (Has layers)", "به حبيبات رملية مرئية (Visible grains)"],
      descriptionAr: "صخر رسوبي يتكون من حبيبات رملية دقيقة متراصة في طبقات.",
      descriptionEn: "A coloured layered rock with visible grains.",
      icon: "🏜️",
    },
    mudstone: {
      id: "mudstone",
      nameEn: "Mudstone",
      nameAr: "الحجر الطيني",
      colorType: "coloured",
      characteristics: ["ملون (Coloured)", "به طبقات (Has layers)", "بدون حبيبات (No grains)", "يُخدش بسهولة (Scratches easily)"],
      descriptionAr: "صخر رسوبي ناعم مصفح يتشكل من الطين ويُخدش بسهولة.",
      descriptionEn: "A coloured layered rock that scratches easily.",
      icon: "🧱",
    },
    slate: {
      id: "slate",
      nameEn: "Slate",
      nameAr: "الأردواز",
      colorType: "coloured",
      characteristics: ["ملون رمادي داكن (Coloured)", "به طبقات (Has layers)", "بدون حبيبات (No grains)", "لا يُخدش بسهولة (Cannot scratch easily)"],
      descriptionAr: "صخر متحول مصفح ومتين يقاوم الخدش ويستخدم في أسطح المنازل.",
      descriptionEn: "A coloured layered rock that does not scratch easily.",
      icon: "📐",
    },
  };

  const handleFinish = (rockKey: string) => {
    const rock = rocks[rockKey];
    setResultRock(rock);
    audioManager.playSuccessSound();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    audioManager.speak(`The rock is ${rock.nameEn}! ${rock.descriptionEn}`, "en");
  };

  const handleReset = () => {
    setCurrentQuestion("q1_colour");
    setResultRock(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-amber-100">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-mono">
            صفحة 32
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>مفتاح تصنيف وتحديد الصخور (Identifying Rocks Key)</span>
          </h3>
          <p className="text-sm text-slate-500 font-arabic">
            أجيبي عن الأسئلة العلمية للتعرف على الصخور الثمانية من كتابك!
          </p>
        </div>

        <button
          onClick={() =>
            audioManager.speak(
              "Dichotomous key for identifying rocks based on colour, hardness, crystals, and layers.",
              "en"
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 text-sm font-semibold transition"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع للشرح</span>
        </button>
      </div>

      {/* Decision Tree Stepper */}
      {!resultRock ? (
        <div className="bg-amber-50/60 p-6 rounded-2xl border-2 border-amber-300 min-h-[260px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
                خطوة في المفتاح العلمي
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة التصنيف</span>
              </button>
            </div>

            {/* Q1: Colour */}
            {currentQuestion === "q1_colour" && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-lg font-bold text-slate-800">
                  ما هو لون الصخر؟ (What colour is the rock?)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setCurrentQuestion("q_white_hardness");
                      audioManager.speak("White rock. Is the rock hard or soft?", "en");
                    }}
                    className="p-5 bg-white rounded-xl border-2 border-slate-300 hover:border-amber-400 hover:shadow-md transition text-right flex items-center justify-between"
                  >
                    <div>
                      <span className="block text-base font-bold text-slate-900">أبيض (White)</span>
                      <span className="text-xs text-slate-500">صخور بيضاء فاتحة</span>
                    </div>
                    <span className="text-2xl">⚪</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentQuestion("q_coloured_layers");
                      audioManager.speak("Coloured rock. Can you see the layers?", "en");
                    }}
                    className="p-5 bg-white rounded-xl border-2 border-slate-300 hover:border-amber-400 hover:shadow-md transition text-right flex items-center justify-between"
                  >
                    <div>
                      <span className="block text-base font-bold text-slate-900">مُلوّن (Coloured)</span>
                      <span className="text-xs text-slate-500">رمادي، بني، داكن، أو أحمر</span>
                    </div>
                    <span className="text-2xl">🪨</span>
                  </button>
                </div>
              </div>
            )}

            {/* Q2: White -> Hard or Soft? */}
            {currentQuestion === "q_white_hardness" && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-lg font-bold text-slate-800">
                  هل الصخر الأبيض صلب أم لين؟ (Is the rock hard or soft?)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleFinish("chalk")}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">لَيّن (Soft)</span>
                    <span className="text-xs text-slate-500">سهل الخدش والتفتت كالطباشير</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentQuestion("q_white_shells");
                      audioManager.speak("Hard white rock. Does it have shells?", "en");
                    }}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">صلب (Hard)</span>
                    <span className="text-xs text-slate-500">متماسك وقوي</span>
                  </button>
                </div>
              </div>
            )}

            {/* Q3: White Hard -> Shells? */}
            {currentQuestion === "q_white_shells" && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-lg font-bold text-slate-800">
                  هل يحتوي على قواقع وأصداف بحرية؟ (Does it have shells?)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleFinish("limestone")}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">نعم، به قواقع (Yes)</span>
                    <span className="text-xs text-slate-500">تظهر فيه بقايا أصداف بحرية</span>
                  </button>

                  <button
                    onClick={() => handleFinish("marble")}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">لا، بدون قواقع (No)</span>
                    <span className="text-xs text-slate-500">أملس وصلب بدون أصداف</span>
                  </button>
                </div>
              </div>
            )}

            {/* Q4: Coloured -> Layers? */}
            {currentQuestion === "q_coloured_layers" && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-lg font-bold text-slate-800">
                  هل تستطيعين رؤية طبقات في الصخر؟ (Can you see the layers?)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setCurrentQuestion("q_no_layers_crystals");
                      audioManager.speak("No layers. Are the crystals large or small?", "en");
                    }}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">لا توجد طبقات (No)</span>
                    <span className="text-xs text-slate-500">كتلة صخرية غير مصفحة</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentQuestion("q_layers_grains");
                      audioManager.speak("Has layers. Can you see grains?", "en");
                    }}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">نعم، تظهر طبقات (Yes)</span>
                    <span className="text-xs text-slate-500">طبقات واضحة متراصفة</span>
                  </button>
                </div>
              </div>
            )}

            {/* Q5: Coloured No Layers -> Crystals Large or Small? */}
            {currentQuestion === "q_no_layers_crystals" && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-lg font-bold text-slate-800">
                  هل بلورات الصخر كبيرة أم صغيرة؟ (Are the crystals large or small?)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleFinish("granite")}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">بلورات كبيرة (Large)</span>
                    <span className="text-xs text-slate-500">بلورات معدنية مرئية بوضوح</span>
                  </button>

                  <button
                    onClick={() => handleFinish("basalt")}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">بلورات صغيرة (Small)</span>
                    <span className="text-xs text-slate-500">بلورات دقيقة جداً داكنة</span>
                  </button>
                </div>
              </div>
            )}

            {/* Q6: Coloured Layers -> Grains? */}
            {currentQuestion === "q_layers_grains" && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-lg font-bold text-slate-800">
                  هل تستطيعين رؤية حبيبات في الصخر؟ (Can you see grains?)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleFinish("sandstone")}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">نعم، تظهر حبيبات (Yes)</span>
                    <span className="text-xs text-slate-500">حبيبات رملية ملتصقة معاً</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentQuestion("q_scratch");
                      audioManager.speak("Can you scratch the rock easily?", "en");
                    }}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">لا تظهر حبيبات (No)</span>
                    <span className="text-xs text-slate-500">قوام صخري ناعم</span>
                  </button>
                </div>
              </div>
            )}

            {/* Q7: Scratch easily? */}
            {currentQuestion === "q_scratch" && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-lg font-bold text-slate-800">
                  هل يُخدش الصخر بسهولة؟ (Can you scratch the rock easily?)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleFinish("mudstone")}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">نعم، يُخدش بسهولة (Yes)</span>
                    <span className="text-xs text-slate-500">حجر طيني لين نسبياً</span>
                  </button>

                  <button
                    onClick={() => handleFinish("slate")}
                    className="p-5 bg-white rounded-xl border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right"
                  >
                    <span className="block text-base font-bold text-slate-900">لا، لا يُخدش بسهولة (No)</span>
                    <span className="text-xs text-slate-500">صخر مصفح صلب ومقاوم</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Result Rock Card */
        <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 animate-fade-in shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 bg-white rounded-2xl shadow-sm border border-emerald-200">
                {resultRock.icon}
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                  نتيجة التحديد الناجحة ✓
                </span>
                <h4 className="text-2xl font-bold text-slate-900 mt-1 font-kid">
                  {resultRock.nameEn} ({resultRock.nameAr})
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => audioManager.speak(resultRock.nameEn, "en")}
                className="p-2 rounded-xl bg-white text-emerald-700 hover:bg-emerald-100 shadow-xs"
                title="استمع للاسم بالإنجليزية"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                تحديد صخر آخر
              </button>
            </div>
          </div>

          <p className="text-sm font-semibold text-slate-800">
            {resultRock.descriptionAr}
          </p>
          <p className="text-xs text-slate-600 mt-1 font-kid">
            {resultRock.descriptionEn}
          </p>

          <div className="mt-4 pt-3 border-t border-emerald-200">
            <span className="text-xs font-bold text-emerald-950 block mb-2">
              المسار التشخيصي في شجرة صفحة 32:
            </span>
            <div className="flex flex-wrap gap-2">
              {resultRock.characteristics.map((c, i) => (
                <span
                  key={i}
                  className="text-xs bg-white text-emerald-900 px-3 py-1 rounded-lg border border-emerald-200 font-semibold"
                >
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid of all 8 Rocks for direct exploration */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="text-sm font-bold text-slate-800 mb-2">
          الصخور الثمانية المذكورة في صفحة 32 (انقري على أي صخر لمعرفة مساره):
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.values(rocks).map((rock) => (
            <button
              key={rock.id}
              onClick={() => {
                setResultRock(rock);
                audioManager.speak(rock.nameEn, "en");
              }}
              className="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs text-center transition flex flex-col items-center"
            >
              <span className="text-2xl mb-1">{rock.icon}</span>
              <span className="text-xs font-bold text-slate-800">{rock.nameAr}</span>
              <span className="text-[11px] text-slate-500 font-kid">{rock.nameEn}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

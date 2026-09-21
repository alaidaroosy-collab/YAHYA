import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import { Sparkles, Volume2, Eye, EyeOff, Box, CheckCircle2 } from "lucide-react";

export const DarkBoxSimulator: React.FC = () => {
  const [isBoxOpen, setIsBoxOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<"apple" | "ball" | "car">("apple");
  const [isBlindfolded, setIsBlindfolded] = useState<boolean>(false);

  const items = {
    apple: { nameEn: "an apple", nameAr: "تفاحة حمراء", icon: "🍎", color: "bg-red-500" },
    ball: { nameEn: "a yellow ball", nameAr: "كرة صفراء", icon: "⚽", color: "bg-amber-400" },
    car: { nameEn: "a blue toy car", nameAr: "سيارة زرقاء", icon: "🚗", color: "bg-blue-500" },
  };

  const handleToggleBox = () => {
    const nextState = !isBoxOpen;
    setIsBoxOpen(nextState);
    if (nextState) {
      audioManager.playSuccessSound();
      audioManager.speak(
        `Open the box. In the light, you can clearly see ${items[selectedItem].nameEn}! We need light to see objects.`,
        "en"
      );
    } else {
      audioManager.speak(
        "Looking into the closed box. It is dark. You cannot see the object because there is no light.",
        "en"
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-300 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold font-mono">
            صفحات 20 و 21
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <Box className="w-5 h-5 text-indigo-600" />
            <span>محاكي تجربة صندوق الظلام (Make a Dark Box Simulator)</span>
          </h3>
          <p className="text-sm text-slate-500 font-arabic">
            صفحة 21: هل نستطيع رؤية الأشياء داخل الصندوق المغلق بدون ضوء؟
          </p>
        </div>

        <button
          onClick={() =>
            audioManager.speak(
              "What does this investigation prove? We need light to see objects. In darkness we cannot see.",
              "en"
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold transition"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع للشرح</span>
        </button>
      </div>

      {/* Item Picker */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-bold text-slate-600">اختر مجسماً لتضعه داخل الصندوق:</span>
        {(["apple", "ball", "car"] as const).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedItem(key);
              audioManager.speak(`Selected ${items[key].nameEn}`, "en");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              selectedItem === key
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>{items[key].icon}</span>
            <span>{items[key].nameAr}</span>
          </button>
        ))}
      </div>

      {/* 3D-styled Box Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Box View */}
        <div className="bg-amber-100/70 rounded-2xl p-6 border-2 border-amber-300 flex flex-col items-center text-center shadow-inner relative">
          <div className="w-48 h-48 bg-amber-800 rounded-2xl border-4 border-amber-900 shadow-2xl relative flex flex-col items-center justify-center overflow-hidden">
            {/* Box Lid / Flaps */}
            <div
              className={`absolute inset-0 bg-amber-700 transition-all duration-500 z-20 flex flex-col items-center justify-center ${
                isBoxOpen ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              {/* Hole in top */}
              <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-amber-900 shadow-inner flex items-center justify-center">
                <span className="text-[10px] text-amber-200 font-bold">فتحة</span>
              </div>
              <span className="text-xs text-amber-100 font-bold mt-2">
                صندوق كرتون مغلق (Closed Box)
              </span>
            </div>

            {/* Inside the box (Visible when open) */}
            <div className="flex flex-col items-center justify-center z-10">
              <span className="text-6xl animate-bounce">{items[selectedItem].icon}</span>
              <span className="text-xs text-white font-bold mt-2 bg-slate-900/60 px-2 py-0.5 rounded">
                {items[selectedItem].nameAr}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleBox}
            className={`mt-4 px-5 py-2 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 ${
              isBoxOpen
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}
          >
            {isBoxOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isBoxOpen ? "إغلاق الصندوق والنظر عبر الثقب" : "فتح الصندوق في الضوء"}</span>
          </button>
        </div>

        {/* View Through Hole (Simulation of what eye sees) */}
        <div className="bg-slate-950 rounded-2xl p-6 border-4 border-slate-800 flex flex-col items-center text-center text-white min-h-[260px] justify-center relative">
          <span className="absolute top-3 right-3 text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">
            ما تراه العين عبر الفتحة (Through the hole):
          </span>

          {!isBoxOpen ? (
            <div className="space-y-3 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-black border-2 border-slate-800 mx-auto flex items-center justify-center">
                <span className="text-xs text-slate-600">ظلام دامس</span>
              </div>
              <p className="text-sm font-bold text-rose-400">
                لا يمكنك رؤية أي شيء داخل الصندوق!
              </p>
              <p className="text-xs text-slate-400 font-kid">
                "It is dark. You cannot see the object because there is no light."
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-5xl">{items[selectedItem].icon}</span>
              </div>
              <p className="text-sm font-bold text-emerald-400">
                الآن أصبح الجسم مرئياً وواضحاً تماماً بفضل الضوء!
              </p>
              <p className="text-xs text-slate-300 font-kid">
                "Now look at the object in the light. It is clearly visible!"
              </p>
            </div>
          )}

          {/* Scientific Proof badge */}
          <div className="mt-4 pt-3 border-t border-slate-800 w-full text-center">
            <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-700/50 px-3 py-1 rounded-full inline-block">
              الاستنتاج: نحتاج إلى الضوء لنرى الأشياء (We need light to see objects).
            </span>
          </div>
        </div>
      </div>

      {/* Part 2: Blindfold & Hearing Activity from Page 20 */}
      <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-xs font-bold text-indigo-900 bg-indigo-200 px-2 py-0.5 rounded">
            نشاط عصابة العينين وحاسة السمع (صفحة 20)
          </span>
          <p className="text-sm font-bold text-slate-800 mt-1">
            "In darkness we use our other senses. Hearing helps us move around safely."
          </p>
          <p className="text-xs text-slate-600">
            عندما نغطي أعيننا بالعصابة، نركز أكثر على الأصوات المحيطة للمساعدة في الحركة بأمان.
          </p>
        </div>

        <button
          onClick={() => {
            const next = !isBlindfolded;
            setIsBlindfolded(next);
            if (next) {
              audioManager.speak(
                "Blindfold on. In darkness, your hearing helps you focus on sounds around you.",
                "en"
              );
            }
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
            isBlindfolded
              ? "bg-indigo-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isBlindfolded ? "نزع عصابة العينين (Eyes open)" : "وضع عصابة العينين (Blindfold on)"}
        </button>
      </div>
    </div>
  );
};

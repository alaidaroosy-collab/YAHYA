import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import { HighlightText } from "./HighlightText";
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Sun,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Star,
  Trophy,
  Layers,
  Search,
} from "lucide-react";

interface ExerciseItem {
  id: string;
  pageRef: string;
  unit: "Unit 1: Light & Dark" | "Unit 2: Earth & Rocks";
  titleEn: string;
  titleAr: string;
  badge: string;
  instructionsEn: string;
  instructionsAr: string;
  keywords: string[];
}

export const TextbookExercisesHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [starsCount, setStarsCount] = useState<number>(0);

  // --- Exercise 1: House at Night (Light Sources) ---
  const [houseItems, setHouseItems] = useState([
    { id: "lamp", name: "Electric Lamp", isSource: true, placed: false },
    { id: "torch", name: "Torch", isSource: true, placed: false },
    { id: "mirror", name: "Shiny Mirror", isSource: false, placed: false },
    { id: "sun", name: "The Sun", isSource: true, placed: false },
    { id: "moon", name: "The Moon", isSource: false, placed: false },
    { id: "can", name: "Shiny Tin Can", isSource: false, placed: false },
    { id: "candle", name: "Burning Candle", isSource: true, placed: false },
  ]);
  const [ex1Answered, setEx1Answered] = useState<boolean>(false);

  // --- Exercise 2: Sun Safety ---
  const [ex2Selected, setEx2Selected] = useState<string | null>(null);
  const [ex2Result, setEx2Result] = useState<boolean | null>(null);

  // --- Exercise 3: Mirror Reflection ---
  const [mirrorAngle, setMirrorAngle] = useState<number>(35);
  const [revealedMirrorWord, setRevealedMirrorWord] = useState<boolean>(false);

  // --- Exercise 4: Dark Box ---
  const [boxHoleOpen, setBoxHoleOpen] = useState<boolean>(false);

  // --- Exercise 5: Shadow Distance Pattern ---
  const [torchDistance, setTorchDistance] = useState<number>(40);

  // --- Exercise 6: Earth Layers ---
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);

  // --- Exercise 7: Rock Detective Key ---
  const [scratchAnswer, setScratchAnswer] = useState<string | null>(null);
  const [floatAnswer, setFloatAnswer] = useState<string | null>(null);
  const [rockResult, setRockResult] = useState<string | null>(null);

  // Exercise definitions
  const exercises: ExerciseItem[] = [
    {
      id: "ex1",
      pageRef: "Pages 14 & 15",
      unit: "Unit 1: Light & Dark",
      titleEn: "Activity: Which things are light sources?",
      titleAr: "تمرين الكتاب: أي هذه الأشياء مصدر للضوء؟",
      badge: "Book p. 14-15",
      instructionsEn:
        "Look at the picture of the house at night. Sort the objects! Remember: A light source makes its own light.",
      instructionsAr:
        "انظر إلى صورة المنزل ليلاً وصنّف الأشياء: هل هذا الشيء مصدر ضوء يصنع ضوءه بنفسه، أم أنه يعكس الضوء فقط؟",
      keywords: ["light source", "torch", "light", "dark", "reflect"],
    },
    {
      id: "ex2",
      pageRef: "Pages 16 & 17",
      unit: "Unit 1: Light & Dark",
      titleEn: "Safety Check: How do we stay safe in the Sun?",
      titleAr: "قاعدة الأمان الهامة: كيف نحمي أعيننا من الشمس؟",
      badge: "Book p. 16-17",
      instructionsEn:
        "The Sun is very bright! What is the number 1 golden safety rule from page 17?",
      instructionsAr:
        "الشمس ساطعة وقوية جداً. ما هي القاعدة الذهبية الأولى للسلامة في كتاب كامبريدج صفحة 17؟",
      keywords: ["Sun", "protect", "damage", "light"],
    },
    {
      id: "ex3",
      pageRef: "Pages 18 & 19",
      unit: "Unit 1: Light & Dark",
      titleEn: "Investigation: Shining a light beam at a mirror",
      titleAr: "تجربة عملية: توجيه شعاع الضوء نحو المرآة",
      badge: "Book p. 18-19",
      instructionsEn:
        "A plane mirror has a smooth, shiny surface. When light hits the mirror, it reflects and bounces off!",
      instructionsAr:
        "المرآة المستوية سطح أملس ولامع. عندما يسقط شعاع الضوء عليها، فإنه ينعكس ويرتد بنفس الزاوية!",
      keywords: ["mirror", "reflect", "shiny", "beam"],
    },
    {
      id: "ex4",
      pageRef: "Pages 20 & 21",
      unit: "Unit 1: Light & Dark",
      titleEn: "Investigation: What can you see in a Dark Box?",
      titleAr: "تجربة الصندوق المظلم: ماذا ترى في الظلام التام؟",
      badge: "Book p. 20-21",
      instructionsEn:
        "Look inside the sealed shoe box through the peephole. Can you see anything in complete darkness?",
      instructionsAr:
        "انظر داخل الصندوق المغلق عبر فتحة النظر. هل تستطيع رؤية اللعبة في الظلام الدامس بدون أي ضوء؟",
      keywords: ["dark", "light", "see", "torch"],
    },
    {
      id: "ex5",
      pageRef: "Pages 24 & 25",
      unit: "Unit 1: Light & Dark",
      titleEn: "Spotting the Pattern: Distance and Shadow Size",
      titleAr: "اكتشاف النمط العلمي: المسافة وحجم الظل",
      badge: "Book p. 24-25",
      instructionsEn:
        "Move the torch closer and further from the tin can. Observe the pattern in the shadow height table!",
      instructionsAr:
        "حرّك المصباح بالقرب والبعد عن العلبة المعدنية ولاحظ النمط العلمي: كلما اقترب المصباح، كبُر الظل!",
      keywords: ["shadow", "distance", "pattern", "torch"],
    },
    {
      id: "ex6",
      pageRef: "Pages 30 & 31",
      unit: "Unit 2: Earth & Rocks",
      titleEn: "Investigation: Make a clay model of the Earth",
      titleAr: "صنع نموذج طبقات كوكب الأرض بالصلصال",
      badge: "Book p. 30-31",
      instructionsEn:
        "Cut your clay model in half! Can you label the 4 layers: Crust, Mantle, Outer Core, and Inner Core?",
      instructionsAr:
        "اقطع نموذج الصلصال إلى نصفين وتعرّف على طبقات كوكب الأرض الأربعة كما في كتاب كامبريدج!",
      keywords: ["crust", "mantle", "outer core", "inner core"],
    },
    {
      id: "ex7",
      pageRef: "Pages 32 & 33",
      unit: "Unit 2: Earth & Rocks",
      titleEn: "Rock Detective: Use the Key to identify the rock",
      titleAr: "المحقق الجيولوجي: تصنيف الصخر باستخدام المفتاح العلمي",
      badge: "Book p. 32-33",
      instructionsEn:
        "Follow the questions: Can you scratch it? Does it float on water? Discover the mystery rock!",
      instructionsAr:
        "اتبع أسئلة المفتاح العلمي في الكتاب: هل يسهل خدشه؟ هل يطفو فوق الماء؟ واكتشف اسم الصخر!",
      keywords: ["granite", "pumice", "chalk", "limestone", "slate", "rock"],
    },
  ];

  const currentEx = exercises[activeTab];

  const handleEarnStar = () => {
    setStarsCount((prev) => prev + 1);
    audioManager.playSuccessSound();
  };

  return (
    <div className="bg-white rounded-3xl border-3 border-amber-300 shadow-md p-5 sm:p-7 space-y-6">
      {/* Playful Top Header for 8-year-old students */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b-2 border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 text-white flex items-center justify-center shadow-lg text-2xl animate-bounce">
            ⭐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black font-mono">
                Cambridge Exercises
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-arabic">
                تمارين الكتاب التفاعلية
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-kid tracking-wide mt-0.5">
              Grade 3 Science Lab & Activities
            </h2>
          </div>
        </div>

        {/* Stars Counter Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-2xl shadow-xs">
          <Trophy className="w-5 h-5 text-amber-600 animate-pulse" />
          <span className="text-xs font-bold text-amber-900">Your Stars:</span>
          <span className="text-lg font-black text-amber-600 font-mono">{starsCount} ★</span>
        </div>
      </div>

      {/* Exercise Selector Buttons (Playful, Big & Colorful) */}
      <div className="space-y-1.5">
        <span className="text-xs font-black text-slate-500 block uppercase tracking-wider">
          Choose a textbook activity:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {exercises.map((ex, index) => {
            const isSelected = index === activeTab;
            return (
              <button
                key={ex.id}
                onClick={() => {
                  setActiveTab(index);
                  audioManager.stop();
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shrink-0 transition-all duration-200 transform ${
                  isSelected
                    ? "bg-amber-500 text-white shadow-lg scale-105 ring-2 ring-amber-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 text-center text-xs flex items-center justify-center font-mono">
                  {index + 1}
                </span>
                <span className="font-kid">{ex.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* ACTIVE EXERCISE CARD */}
      {/* ======================================================== */}
      <div className="bg-amber-50/60 rounded-3xl border-2 border-amber-200 p-5 sm:p-7 space-y-6">
        {/* Title & Speech Button */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black font-mono">
                {currentEx.pageRef}
              </span>
              <span className="text-xs font-bold text-slate-500 font-kid">{currentEx.unit}</span>
            </div>

            {/* Big, bold English Title */}
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-kid leading-snug">
              <HighlightText text={currentEx.titleEn} />
            </h3>

            {/* Clear Arabic Title translation underneath */}
            <p className="text-base sm:text-lg font-bold text-amber-900 font-arabic mt-1">
              {currentEx.titleAr}
            </p>
          </div>

          <button
            onClick={() => audioManager.speak(currentEx.instructionsEn, "en")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 shrink-0"
            title="Listen in natural voice"
          >
            <Volume2 className="w-5 h-5" />
            <span>Listen (استمع)</span>
          </button>
        </div>

        {/* Instructions Box: English First (Hero) + Arabic Clarification */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 space-y-2.5 shadow-xs">
          <div className="text-base sm:text-lg font-bold text-slate-800 font-kid leading-relaxed">
            <HighlightText text={currentEx.instructionsEn} />
          </div>

          {/* Friendly Arabic Explanation Bubble */}
          <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-950 font-arabic leading-relaxed font-semibold">
              {currentEx.instructionsAr}
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE WORK AREA SPECIFIC TO EACH EXERCISE */}
        {/* ======================================================== */}

        {/* --- EXERCISE 1: Light Sources Sorting (p.14-15) --- */}
        {activeTab === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {houseItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const newItems = houseItems.map((i) =>
                      i.id === item.id ? { ...i, placed: !i.placed } : i
                    );
                    setHouseItems(newItems);
                    audioManager.speak(item.name, "en");
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-center transition-all duration-200 transform active:scale-95 flex flex-col items-center justify-between ${
                    item.placed
                      ? item.isSource
                        ? "bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200"
                        : "bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200"
                      : "bg-white border-slate-200 text-slate-800 hover:border-amber-400 shadow-xs"
                  }`}
                >
                  <span className="text-2xl mb-1">
                    {item.id === "torch" && "🔦"}
                    {item.id === "sun" && "☀️"}
                    {item.id === "lamp" && "💡"}
                    {item.id === "mirror" && "🪞"}
                    {item.id === "moon" && "🌙"}
                    {item.id === "can" && "🥫"}
                    {item.id === "candle" && "🕯️"}
                  </span>
                  <span className="font-kid font-bold text-sm block">{item.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {item.placed ? (item.isSource ? "✅ Light Source!" : "❌ Not a source (reflects)") : "Click to test"}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-xs sm:text-sm font-bold text-slate-700 font-kid">
                Rule from Cambridge Textbook: <HighlightText text="The Sun, torches, lamps and candles are light sources. Mirrors and the Moon only reflect light!" />
              </p>
              <button
                onClick={() => {
                  handleEarnStar();
                  setEx1Answered(true);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition"
              >
                I finished sorting! (تحقق من إجاباتي)
              </button>
            </div>
          </div>
        )}

        {/* --- EXERCISE 2: Sun Safety (p.16-17) --- */}
        {activeTab === 1 && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
              <span className="text-xs sm:text-sm font-bold font-kid">
                Cambridge Golden Rule: How should you look at the Sun?
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: "opt1",
                  textEn: "Look directly at the Sun without any sunglasses.",
                  textAr: "النظر مباشرة إلى الشمس بدون نظارات شمسية.",
                  correct: false,
                },
                {
                  id: "opt2",
                  textEn: "NEVER look directly at the Sun! It can damage your eyes.",
                  textAr: "لا تنظر أبداً مباشرة إلى الشمس؛ فإن ذلك يسبب تلفاً شديداً للعين!",
                  correct: true,
                },
                {
                  id: "opt3",
                  textEn: "Look at the Sun using a mirror.",
                  textAr: "النظر إلى الشمس عبر المرآة.",
                  correct: false,
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setEx2Selected(opt.id);
                    setEx2Result(opt.correct);
                    if (opt.correct) {
                      handleEarnStar();
                      audioManager.speak("Excellent! Never look directly at the Sun! It can damage your eyes.", "en");
                    } else {
                      audioManager.playTryAgainSound();
                    }
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                    ex2Selected === opt.id
                      ? opt.correct
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200"
                        : "bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200"
                      : "bg-slate-50 border-slate-200 hover:border-amber-400"
                  }`}
                >
                  <div>
                    <span className="font-kid font-bold text-sm sm:text-base block">
                      <HighlightText text={opt.textEn} />
                    </span>
                    <span className="text-xs text-slate-500 font-arabic block mt-0.5">
                      {opt.textAr}
                    </span>
                  </div>
                  {ex2Selected === opt.id && (
                    <span className="text-xl">
                      {opt.correct ? "✅" : "❌"}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {ex2Result === true && (
              <div className="p-3 bg-emerald-100 rounded-xl text-center text-xs sm:text-sm font-bold text-emerald-900 font-kid">
                🌟 Correct! Cambridge Science says: Always wear sunglasses and wide hats to protect your eyes.
              </div>
            )}
          </div>
        )}

        {/* --- EXERCISE 3: Mirror Light Beam (p.18-19) --- */}
        {activeTab === 2 && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-700 font-kid">
                Adjust torch beam angle: <span className="font-mono">{mirrorAngle}°</span>
              </span>
              <input
                type="range"
                min="10"
                max="75"
                value={mirrorAngle}
                onChange={(e) => setMirrorAngle(Number(e.target.value))}
                className="w-48 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Interactive Ray Canvas graphic */}
            <div className="relative h-44 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center p-4">
              {/* Mirror line */}
              <div className="absolute right-12 inset-y-4 w-3 bg-gradient-to-b from-cyan-200 via-white to-sky-200 rounded-md border border-cyan-400 shadow-lg shadow-cyan-300/60" />
              <span className="absolute right-16 top-6 text-[10px] text-cyan-300 font-mono font-bold">
                Plane Mirror (مرآة مستوية)
              </span>

              {/* Torch vector */}
              <div className="absolute left-6 top-10 flex items-center gap-1">
                <span className="text-2xl">🔦</span>
                <span className="text-xs font-bold text-amber-300 font-kid">Torch</span>
              </div>

              {/* Reflected message */}
              <div className="text-center space-y-1">
                <span className="text-xs text-yellow-300 font-mono font-bold block animate-pulse">
                  Light hits at {mirrorAngle}° ➜ Bounces off at {mirrorAngle}°!
                </span>
                <span className="text-[11px] text-slate-300 font-arabic">
                  ينعكس شعاع الضوء بنفس زاوية السقوط تماماً
                </span>
              </div>
            </div>

            {/* Backwards word experiment in mirror */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
              <span className="text-xs font-bold text-amber-900 block font-kid">
                Try Cambridge Mirror Magic: Can you read backwards letters?
              </span>
              <div className="text-2xl font-black font-mono text-slate-800 tracking-widest">
                {revealedMirrorWord ? "SCIENCE (العلوم)" : "ƎƆNƎIƆS"}
              </div>
              <button
                onClick={() => {
                  setRevealedMirrorWord(!revealedMirrorWord);
                  audioManager.speak("Mirrors reverse images backwards and forwards!", "en");
                  handleEarnStar();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
              >
                {revealedMirrorWord ? "Flip back" : "Look in the Mirror 🪞"}
              </button>
            </div>
          </div>
        )}

        {/* --- EXERCISE 4: Dark Box Experiment (p.20-21) --- */}
        {activeTab === 3 && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="text-center space-y-2">
              <span className="text-xs sm:text-sm font-bold text-slate-700 font-kid">
                Click the hole on the box to let light inside:
              </span>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const next = !boxHoleOpen;
                    setBoxHoleOpen(next);
                    if (next) {
                      audioManager.speak("Light enters the box! Now we can see the toy!", "en");
                      handleEarnStar();
                    } else {
                      audioManager.speak("Complete darkness! We cannot see anything without light!", "en");
                    }
                  }}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                    boxHoleOpen
                      ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-300"
                      : "bg-slate-800 text-white shadow-md"
                  }`}
                >
                  {boxHoleOpen ? "☀️ Hole OPEN (Light enters)" : "🌑 Hole CLOSED (Dark inside)"}
                </button>
              </div>
            </div>

            {/* Inside the Box Visual */}
            <div
              className={`h-48 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 border-4 ${
                boxHoleOpen
                  ? "bg-gradient-to-b from-amber-100 to-yellow-50 border-amber-300"
                  : "bg-black border-slate-900"
              }`}
            >
              {boxHoleOpen ? (
                <div className="text-center space-y-2 animate-scale-up">
                  <span className="text-5xl animate-bounce">🧸</span>
                  <p className="text-base font-bold text-amber-950 font-kid">
                    You can see the Teddy Bear!
                  </p>
                  <p className="text-xs text-amber-800 font-arabic">
                    نستطيع الرؤية الآن لأن الضوء دخل الصندوق وانعكس عن اللعبة إلى أعيننا!
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <span className="text-4xl opacity-10">🧸</span>
                  <p className="text-sm font-bold text-slate-400 font-kid">
                    Total Darkness: Nothing visible!
                  </p>
                  <p className="text-xs text-slate-500 font-arabic">
                    ظلام دامس! لا يمكن للعين الرؤية بدون وجود ضوء.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- EXERCISE 5: Torch Distance & Shadow Size (p.24-25) --- */}
        {activeTab === 4 && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-700 font-kid">
                Distance of torch from can: <span className="font-mono text-amber-600 font-bold">{torchDistance} cm</span>
              </span>
              <input
                type="range"
                min="20"
                max="100"
                step="20"
                value={torchDistance}
                onChange={(e) => {
                  setTorchDistance(Number(e.target.value));
                  audioManager.speak(`Distance ${e.target.value} centimetres`, "en");
                }}
                className="w-48 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Pattern Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-amber-100 text-amber-900 font-kid font-bold">
                    <th className="p-2 border border-amber-200">Distance from torch (cm)</th>
                    <th className="p-2 border border-amber-200">20 cm</th>
                    <th className="p-2 border border-amber-200">40 cm</th>
                    <th className="p-2 border border-amber-200">60 cm</th>
                    <th className="p-2 border border-amber-200">100 cm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-mono font-bold text-slate-700">
                    <td className="p-2 border border-slate-200 font-kid">Height of shadow (cm)</td>
                    <td className={`p-2 border border-slate-200 ${torchDistance === 20 ? "bg-amber-200 text-amber-950 font-black" : ""}`}>24 cm</td>
                    <td className={`p-2 border border-slate-200 ${torchDistance === 40 ? "bg-amber-200 text-amber-950 font-black" : ""}`}>18 cm</td>
                    <td className={`p-2 border border-slate-200 ${torchDistance === 60 ? "bg-amber-200 text-amber-950 font-black" : ""}`}>14 cm</td>
                    <td className={`p-2 border border-slate-200 ${torchDistance === 100 ? "bg-amber-200 text-amber-950 font-black" : ""}`}>9 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scientific conclusion pill */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
              <p className="text-xs sm:text-sm font-bold text-emerald-950 font-kid">
                Scientific Pattern: <HighlightText text="The closer the torch is to the object, the bigger the shadow!" />
              </p>
              <p className="text-xs text-emerald-800 font-arabic">
                النمط العلمي المكتشف: كلما اقترب مصدر الضوء من الجسم، زاد حجم الظل المتكون.
              </p>
            </div>
          </div>
        )}

        {/* --- EXERCISE 6: Earth Layers (p.30-31) --- */}
        {activeTab === 5 && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: "Crust", ar: "القشرة", color: "bg-emerald-600", desc: "Cool solid rock skin (apple skin)" },
                { name: "Mantle", ar: "الوشاح", color: "bg-orange-500", desc: "Thickest layer of hot semi-solid rock" },
                { name: "Outer Core", ar: "اللب الخارجي", color: "bg-red-600", desc: "Liquid hot iron and nickel (4,000°C)" },
                { name: "Inner Core", ar: "اللب الداخلي", color: "bg-yellow-400", desc: "Solid metal ball under huge pressure" },
              ].map((layer, idx) => (
                <button
                  key={layer.name}
                  onClick={() => {
                    setSelectedLayerIndex(idx);
                    audioManager.speak(`${layer.name}. ${layer.desc}`, "en");
                  }}
                  className={`p-3 rounded-2xl border-2 text-center transition-all ${
                    selectedLayerIndex === idx
                      ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${layer.color}`} />
                  <span className="font-kid font-bold text-xs sm:text-sm block">{layer.name}</span>
                  <span className="text-xs text-slate-500 font-arabic">{layer.ar}</span>
                </button>
              ))}
            </div>

            {/* Layer Info display */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-sm font-bold text-slate-900 font-kid">
                {selectedLayerIndex === 0 && "1. Crust: The thin, crunchy outer skin of the Earth we live on!"}
                {selectedLayerIndex === 1 && "2. Mantle: The thickest layer of Earth, made of very hot rock!"}
                {selectedLayerIndex === 2 && "3. Outer Core: Boiling liquid metallic iron and nickel!"}
                {selectedLayerIndex === 3 && "4. Inner Core: Solid iron center ball as hot as the surface of the Sun!"}
              </span>
              <p className="text-xs text-slate-600 font-arabic">
                {selectedLayerIndex === 0 && "القشرة: الطبقة الرقيقة الخارجية التي نعيش عليها كقشرة التفاحة."}
                {selectedLayerIndex === 1 && "الوشاح: أسمك طبقات الأرض بسمك نحو 2900 كم من الصخور الحارة جداً."}
                {selectedLayerIndex === 2 && "اللب الخارجي: طبقة سائلة من الحديد والنيكل المنصهرين بحرارة 4000 مئوية."}
                {selectedLayerIndex === 3 && "اللب الداخلي: كرة معدنية صلبة في مركز الأرض بالغة الحرارة والضغط."}
              </p>
            </div>
          </div>
        )}

        {/* --- EXERCISE 7: Rock Detective Key (p.32-33) --- */}
        {activeTab === 6 && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block font-kid">
                  Question 1: Can you scratch the rock easily with your fingernail?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setScratchAnswer("yes");
                      setFloatAnswer(null);
                      setRockResult("Chalk");
                      audioManager.speak("Soft white chalk scratches easily!", "en");
                      handleEarnStar();
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                      scratchAnswer === "yes" ? "bg-amber-500 text-white" : "bg-white border"
                    }`}
                  >
                    YES (Scrratches easily)
                  </button>
                  <button
                    onClick={() => {
                      setScratchAnswer("no");
                      setRockResult(null);
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                      scratchAnswer === "no" ? "bg-amber-500 text-white" : "bg-white border"
                    }`}
                  >
                    NO (It is hard)
                  </button>
                </div>
              </div>

              {scratchAnswer === "no" && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-fade-in">
                  <span className="text-xs font-bold text-slate-700 block font-kid">
                    Question 2: Does it float on water?
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFloatAnswer("yes");
                        setRockResult("Pumice");
                        audioManager.speak("Pumice is full of gas bubbles and floats on water!", "en");
                        handleEarnStar();
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                        floatAnswer === "yes" ? "bg-teal-500 text-white" : "bg-white border"
                      }`}
                    >
                      YES (It floats!)
                    </button>
                    <button
                      onClick={() => {
                        setFloatAnswer("no");
                        setRockResult("Granite");
                        audioManager.speak("Granite is hard with visible interlocking crystals!", "en");
                        handleEarnStar();
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                        floatAnswer === "no" ? "bg-rose-500 text-white" : "bg-white border"
                      }`}
                    >
                      NO (Sinks & has crystals)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {rockResult && (
              <div className="p-4 bg-amber-100 rounded-2xl border-2 border-amber-300 text-center space-y-1 animate-scale-up">
                <span className="text-xs font-bold text-amber-900 block font-mono">
                  DETECTIVE KEY RESULT:
                </span>
                <span className="text-2xl font-black text-slate-900 font-kid block">
                  🎉 The Mystery Rock is: {rockResult}!
                </span>
                <p className="text-xs text-amber-950 font-arabic">
                  {rockResult === "Chalk" && "الطباشير: صخر رسوبي أبيض وناعم يسهل خدشه والكتابة به."}
                  {rockResult === "Pumice" && "الخفاف: صخر بركاني إسفنجي ممتلئ بفقاعات الغاز ويطفو فوق الماء!"}
                  {rockResult === "Granite" && "الجرانيت: صخر ناري شديد الصلابة والمتانة مرقط ببلورات ملونة متشابكة."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

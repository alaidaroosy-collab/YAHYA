import React, { useState } from "react";
import { BookPage, BookPageSection } from "../data/pagesData";
import { audioManager } from "../utils/audioPlayer";
import { zahraImageManager } from "../utils/zahraImageManager";
import {
  Sparkles,
  Volume2,
  Lightbulb,
  HelpCircle,
  Eye,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  ShieldAlert,
  Flame,
  Layers,
  ArrowRight,
  Compass,
  Trophy,
} from "lucide-react";

// Interactive mini-simulators
import { InteractiveRaySimulator } from "./InteractiveRaySimulator";
import { DarkBoxSimulator } from "./DarkBoxSimulator";
import { ShadowDistanceLab } from "./ShadowDistanceLab";
import { InteractiveWordsearch } from "./InteractiveWordsearch";
import { EarthLayersExplorer } from "./EarthLayersExplorer";
import { RockClassifierKey } from "./RockClassifierKey";
import { RockCycleInteractive } from "./RockCycleInteractive";
import { BuildingMaterialsSorter } from "./BuildingMaterialsSorter";

interface Props {
  page: BookPage;
  activeSectionIdx?: number;
}

export const CambridgeSmartMargin: React.FC<Props> = ({ page, activeSectionIdx = 0 }) => {
  const isUnit1 = page.unitNumber === 1;
  const pageNum = page.pageNumber;

  // Local interactive states for margin widgets
  const [lightRoomMode, setLightRoomMode] = useState<"light" | "dark">("light");
  const [sorterSelection, setSorterSelection] = useState<Record<string, "source" | "reflector">>({});
  const [mirrorWord, setMirrorWord] = useState<string>("SCIENCE");
  const [revealedFact, setRevealedFact] = useState<boolean>(false);
  const [scratchTestItem, setScratchTestItem] = useState<string | null>(null);

  // Helper for text-to-speech
  const speak = (text: string, lang: "en" | "ar" = "en") => {
    audioManager.speak(text, lang);
  };

  return (
    <div className="space-y-5">
      {/* Smart Margin Header Badge */}
      <div
        className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-xs font-black shadow-xs ${
          isUnit1
            ? "bg-sky-50 border-sky-300 text-sky-950"
            : "bg-emerald-50 border-emerald-300 text-emerald-950"
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${isUnit1 ? "text-sky-600" : "text-emerald-600"}`} />
          <span className="font-cambridge">Interactive Smart Margin</span>
        </div>
        <span className="font-arabic font-bold text-[11px] px-2 py-0.5 rounded-md bg-white/80 border border-slate-200">
          الهامش البصري والتفاعلي
        </span>
      </div>

      {/* Zahra's Reading Companion Card */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-amber-50/50 p-3 rounded-2xl border border-sky-200 shadow-2xs flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-sky-300 shadow-xs relative group">
          <img
            src={zahraImageManager.getImageUrl(
              isUnit1 ? "zahra-reaction-learn-v2.png" : "zahra-reaction-learn.png"
            )}
            alt="زهرة وصديقها الأرنب في جلسة القراءة"
            className="w-full h-full object-cover group-hover:scale-105 transition"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/src/assets/images/zahra_avatar_1790017518372.jpg";
            }}
          />
        </div>
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 font-cambridge flex items-center gap-1">
              <span>Reading Partner: Zahra & Bunny 🐰</span>
            </span>
            <button
              onClick={() =>
                speak(
                  isUnit1
                    ? "Great job reading this science page with Zahra and her bunny!"
                    : "Discovering rock and earth science together with Zahra!"
                )
              }
              className="p-1 rounded-lg text-sky-600 hover:bg-sky-100/70 transition"
              title="Listen to encouragement"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs font-black text-slate-800 font-arabic leading-snug">
            {isUnit1
              ? "أنا والأرنب الأبيض نقرأ معكِ صفحة العلوم بتركيز واستمتاع!"
              : "نستكشف صخور الأرض وطبقاتها خطوة بخطوة مع زهرة والأرنب!"}
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. VISUAL DIAGRAM & EXPLANATION FOR THIS SPECIFIC PAGE */}
      {/* ======================================================== */}

      {/* PAGE 14: Light vs Dark Bedroom Visual Comparison */}
      {pageNum === 14 && (
        <div className="bg-white rounded-2xl border-2 border-sky-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-900 font-cambridge flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-600" />
              Visual Comparison: Light vs Dark
            </span>
            <button
              onClick={() => speak("Daytime bedroom has light. Night bedroom is dark. We need light to see.")}
              className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Light/Dark Room Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLightRoomMode("light")}
              className={`p-3 rounded-xl border-2 text-center transition flex flex-col items-center gap-1.5 ${
                lightRoomMode === "light"
                  ? "bg-amber-50 border-amber-400 shadow-sm"
                  : "bg-slate-50 border-slate-200 opacity-70"
              }`}
            >
              <Sun className="w-6 h-6 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="text-xs font-black font-cambridge text-amber-950">Day Room (Light)</span>
              <span className="text-[10px] text-slate-500 font-arabic">غرفة مضيئة نهاراً</span>
            </button>

            <button
              onClick={() => setLightRoomMode("dark")}
              className={`p-3 rounded-xl border-2 text-center transition flex flex-col items-center gap-1.5 ${
                lightRoomMode === "dark"
                  ? "bg-indigo-950 border-indigo-500 text-white shadow-sm"
                  : "bg-slate-50 border-slate-200 opacity-70"
              }`}
            >
              <Moon className="w-6 h-6 text-indigo-300" />
              <span className="text-xs font-black font-cambridge">Night Room (Dark)</span>
              <span className="text-[10px] text-slate-400 font-arabic">غرفة مظلمة ليلاً</span>
            </button>
          </div>

          {/* Dynamic visual box showing the room state */}
          <div
            className={`p-4 rounded-xl border transition-all text-xs font-medium space-y-2 ${
              lightRoomMode === "light"
                ? "bg-amber-50/70 border-amber-200 text-amber-950"
                : "bg-slate-900 border-slate-700 text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2 font-bold font-cambridge">
              <span>{lightRoomMode === "light" ? "☀️ Light is present:" : "🌙 In the dark:"}</span>
            </div>
            <p className="font-arabic text-xs leading-relaxed">
              {lightRoomMode === "light"
                ? "ينعكس ضوء الشمس من النافذة على السرير والألعاب ويدخل أعيننا، فنرى كل شيء واضحاً بالألوان!"
                : "تغلق الستائر وينعدم الضوء، فلا ينعكس شيء لأعيننا. الظلام يساعد أجسامنا على إفراز هرمون النوم والراحة."}
            </p>
          </div>
        </div>
      )}

      {/* PAGE 15: Wordsearch & Vocabulary Phonetics */}
      {pageNum === 15 && (
        <div className="bg-white rounded-2xl border-2 border-sky-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-900 font-cambridge flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Mystery Word: The Missing Vocabulary
            </span>
          </div>

          <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 font-cambridge">
                🔍 Missing Word: TORCH 🔦
              </span>
              <button
                onClick={() => speak("Torch. A torch is a light source powered by batteries.", "en")}
                className="p-1 rounded-lg text-amber-800 hover:bg-amber-200"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-amber-900 font-arabic font-medium leading-relaxed">
              المصباح اليدوي (torch) هو مصدر ضوء محمول باليد يعمل بالبطارية. لم يكن موجوداً في شبكة الكلمات!
            </p>
          </div>

          <div className="pt-1">
            <InteractiveWordsearch type="light" />
          </div>
        </div>
      )}

      {/* PAGE 16 & 17: Sources vs Reflectors Interactive Sorter & Safety Box */}
      {(pageNum === 16 || pageNum === 17) && (
        <div className="bg-white rounded-2xl border-2 border-sky-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-900 font-cambridge flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              Visual Sorter: Source vs Reflector
            </span>
            <button
              onClick={() =>
                speak(
                  "A light source makes its own light. The Sun is our main light source. The Moon only reflects sunlight!"
                )
              }
              className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick interactive test: 4 key objects */}
          <div className="space-y-2">
            {[
              { id: "sun", nameEn: "The Sun", nameAr: "الشمس", isSource: true, icon: "☀️" },
              { id: "torch", nameEn: "Torch (Flashlight)", nameAr: "المصباح اليدوي", isSource: true, icon: "🔦" },
              { id: "moon", nameEn: "The Moon", nameAr: "القمر", isSource: false, icon: "🌙" },
              { id: "mirror", nameEn: "Mirror", nameAr: "المرآة", isSource: false, icon: "🪞" },
            ].map((item) => {
              const current = sorterSelection[item.id];
              const isCorrect =
                current === (item.isSource ? "source" : "reflector");

              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <span className="font-black text-slate-800 font-cambridge block">
                        {item.nameEn}
                      </span>
                      <span className="text-[10px] text-slate-500 font-arabic">
                        {item.nameAr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setSorterSelection((prev) => ({ ...prev, [item.id]: "source" }))
                      }
                      className={`px-2 py-1 rounded-lg text-[10px] font-black transition ${
                        current === "source"
                          ? item.isSource
                            ? "bg-emerald-500 text-white"
                            : "bg-rose-500 text-white"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Source 💡
                    </button>
                    <button
                      onClick={() =>
                        setSorterSelection((prev) => ({ ...prev, [item.id]: "reflector" }))
                      }
                      className={`px-2 py-1 rounded-lg text-[10px] font-black transition ${
                        current === "reflector"
                          ? !item.isSource
                            ? "bg-emerald-500 text-white"
                            : "bg-rose-500 text-white"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Reflector 🪞
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cambridge Safety Golden Rule (Be Safe!) */}
          <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-rose-900 font-cambridge">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Be safe! (قاعدة الأمان الذهبية)</span>
            </div>
            <p className="text-[11px] text-rose-800 font-arabic leading-relaxed">
              لا تنظر أبداً مباشرة إلى الشمس أو إلى ضوء الليزر القوي! الضوء الساطع جداً يحرق شبكية العين فوراً.
            </p>
          </div>
        </div>
      )}

      {/* PAGE 18 & 19: Mirrors & Reflection Ray Angle Interactive */}
      {(pageNum === 18 || pageNum === 19) && (
        <div className="bg-white rounded-2xl border-2 border-sky-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-900 font-cambridge flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-600" />
              Live Mirror Ray Simulator
            </span>
          </div>

          {/* Live embedded Ray simulator */}
          <div className="scale-95 origin-top -mt-2">
            <InteractiveRaySimulator />
          </div>

          {/* Mirror Writing Visualizer */}
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-950 font-cambridge">
                Mirror Writing (الكتابة المعكوسة)
              </span>
              <button
                onClick={() =>
                  speak(
                    "Mirrors reflect backwards. That is why AMBULANCE is printed reversed on emergency vans!"
                  )
                }
                className="p-1 rounded text-sky-700 hover:bg-sky-200"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={mirrorWord}
                onChange={(e) => setMirrorWord(e.target.value.toUpperCase().slice(0, 10))}
                className="w-24 px-2 py-1 bg-white border border-sky-300 rounded text-xs font-black uppercase text-center"
              />
              <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="px-3 py-1 bg-slate-900 text-sky-300 rounded text-xs font-mono font-black scale-x-[-1] inline-block tracking-wider">
                {mirrorWord}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-arabic">
              تظهر الحروف معكوسة أفقياً كما تطبع كلمة إسعاف لتراها صحيحة في مرآة السيارة!
            </p>
          </div>
        </div>
      )}

      {/* PAGE 20 & 21: Darkness Box & Eye Reflection */}
      {(pageNum === 20 || pageNum === 21) && (
        <div className="bg-white rounded-2xl border-2 border-sky-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-900 font-cambridge flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-600" />
              Investigation: Can We See in the Dark?
            </span>
          </div>

          <div className="scale-95 origin-top -mt-2">
            <DarkBoxSimulator />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
            <span className="text-xs font-black text-amber-950 font-cambridge block">
              💡 Scientific Conclusion
            </span>
            <p className="text-xs text-slate-700 font-arabic leading-relaxed">
              بدون أي ضوء، لا يمكن للعين البشرية أن ترى أي شيء على الإطلاق! نحتاج إلى شعاع ضوئي ينعكس من الجسم ليدخل إلى بؤبؤ العين.
            </p>
          </div>
        </div>
      )}

      {/* PAGE 22 & 23: Shadows Formation & Hand Puppets */}
      {(pageNum === 22 || pageNum === 23) && (
        <div className="bg-white rounded-2xl border-2 border-sky-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-900 font-cambridge flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              How Shadows Form (تكون الظلال)
            </span>
            <button
              onClick={() =>
                speak(
                  "Light travels in straight lines. When an opaque object blocks the light, a dark shadow forms behind it!"
                )
              }
              className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Ray blocking diagram visual */}
          <div className="p-3 bg-slate-900 text-white rounded-xl text-center space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-around py-2">
              <div className="flex flex-col items-center">
                <span className="text-2xl animate-pulse">🔦</span>
                <span className="text-[10px] text-amber-300 font-mono">Torch</span>
              </div>
              <div className="h-0.5 w-12 bg-amber-400 relative">
                <span className="absolute -top-3 text-[9px] text-amber-300 font-mono">Ray →</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-slate-800 border border-slate-600">
                <span className="text-xl">🧸</span>
                <span className="text-[9px] text-slate-300 font-mono">Opaque Toy</span>
              </div>
              <div className="h-0.5 w-8 bg-slate-700"></div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-black border border-slate-700">
                <span className="text-xl opacity-30">🧸</span>
                <span className="text-[9px] text-slate-400 font-mono">Shadow</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-300 font-arabic">
              الضوء يسير في خطوط مستقيمة، ولا يلتف حول الأجسام المعتمة، فيتكون الظل خلف الجسم!
            </p>
          </div>

          {/* Hand Puppets Card */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
            <span className="text-xs font-black text-amber-950 font-cambridge flex items-center gap-1.5">
              🖐️ Shadow Puppets Activity (دمى الظل)
            </span>
            <p className="text-[11px] text-slate-700 font-arabic leading-relaxed">
              ضع يدك بين المصباح والجدار لتصنع أشكال أرنب 🐇 أو طائر 🦅 باستخدام أصابعك!
            </p>
          </div>
        </div>
      )}

      {/* PAGE 24 & 25: Shadow Distance Experiment Lab */}
      {(pageNum === 24 || pageNum === 25) && (
        <div className="bg-white rounded-2xl border-2 border-sky-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-900 font-cambridge flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sky-600" />
              Investigation: Changing Shadow Size
            </span>
          </div>

          <div className="scale-95 origin-top -mt-2">
            <ShadowDistanceLab />
          </div>

          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs space-y-1">
            <span className="font-black text-sky-950 font-cambridge block">
              📏 The Scientific Pattern (النمط العلمي):
            </span>
            <ul className="text-[11px] text-slate-700 font-arabic space-y-1 list-disc list-inside">
              <li>كلما اقترب المصباح من الجسم المعتم ⬅️ <strong>كبر حجم الظل</strong>.</li>
              <li>كلما ابتعد المصباح عن الجسم المعتم ⬅️ <strong>صغر حجم الظل</strong>.</li>
            </ul>
          </div>
        </div>
      )}

      {/* PAGE 26 & 27: Unit 1 Check Your Progress */}
      {(pageNum === 26 || pageNum === 27) && (
        <div className="bg-white rounded-2xl border-2 border-sky-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-900 font-cambridge flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Unit 1 Mastery Checklist
            </span>
            <button
              onClick={() =>
                speak(
                  "Well done! You have completed Unit 1 Light and Dark. You know light sources, reflections, and shadows."
                )
              }
              className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {[
              "I can identify light sources vs reflectors.",
              "I know we need light to see things.",
              "I know mirrors reflect light and reverse images.",
              "I know shadows form when light is blocked.",
              "I know the closer the light, the bigger the shadow.",
            ].map((skill, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-950 font-cambridge font-bold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 28 & 29: Natural vs Human-Made Materials */}
      {(pageNum === 28 || pageNum === 29) && (
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 font-cambridge flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Natural vs Human-Made Materials
            </span>
            <button
              onClick={() =>
                speak(
                  "Natural materials come from the Earth, like rocks and soil. Human-made materials like bricks and plastics are made in factories."
                )
              }
              className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
              <span className="font-black text-emerald-950 font-cambridge block">
                🌿 Natural Materials
              </span>
              <p className="text-[10px] text-slate-600 font-arabic">
                مواد طبيعية من الأرض (صخور، تربة، خشب، قطن).
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
              <span className="font-black text-blue-950 font-cambridge block">
                🏭 Human-Made
              </span>
              <p className="text-[10px] text-slate-600 font-arabic">
                مواد صناعية صُنعت في المصانع (خرسانة، بلاستيك، طوب).
              </p>
            </div>
          </div>

          {/* Soil Hygiene Safety Tip */}
          <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-black text-rose-900 font-cambridge">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Hygiene Rule (نظافة وأمان)</span>
            </div>
            <p className="text-[11px] text-rose-800 font-arabic">
              اغسل يديك جيداً بالماء والصابون بعد لمس التربة والصخور لحماية صحتك من الجراثيم!
            </p>
          </div>
        </div>
      )}

      {/* PAGE 30 & 31: Earth's 4 Layers Cutaway Interactive */}
      {(pageNum === 30 || pageNum === 31) && (
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 font-cambridge flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Interactive Earth Cutaway (طبقات الأرض)
            </span>
          </div>

          <div className="scale-95 origin-top -mt-2">
            <EarthLayersExplorer />
          </div>

          {/* Peach analogy card from Cambridge book */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
            <span className="font-black text-amber-950 font-cambridge flex items-center gap-1.5">
              🍑 Cambridge Analogy: The Peach (تشبيه الخوخة)
            </span>
            <p className="text-[11px] text-slate-700 font-arabic leading-relaxed">
              تشبه الأرض ثمرة الخوخ: القشرة الخارجية كجلد الخوخة الرقيق، الوشاح مثل لحم الخوخة السميك، واللب الداخلي مثل النواة الصلبة في المركز!
            </p>
          </div>
        </div>
      )}

      {/* PAGE 32 & 33: Rock Detective Key & Scratch Test */}
      {(pageNum === 32 || pageNum === 33) && (
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 font-cambridge flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Rock Classification Decision Key
            </span>
          </div>

          <div className="scale-95 origin-top -mt-2">
            <RockClassifierKey />
          </div>

          {/* Interactive scratch test mini tool */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span className="font-black text-slate-800 font-cambridge block">
              💅 Try the Scratch Test (اختبار الخدش):
            </span>
            <div className="flex gap-1.5">
              {["Chalk (Soft)", "Granite (Hard)", "Pumice (Light)"].map((rock) => (
                <button
                  key={rock}
                  onClick={() => setScratchTestItem(rock)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                    scratchTestItem === rock
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {rock}
                </button>
              ))}
            </div>

            {scratchTestItem && (
              <p className="text-[11px] font-arabic text-emerald-950 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {scratchTestItem.includes("Chalk")
                  ? "الطباشير صخر رسوبي ناعم جداً، يخدش بسهولة بالأظافر ويترك أثراً أبيض!"
                  : scratchTestItem.includes("Granite")
                  ? "الجرانيت صخر ناري شديد الصلابة يحتوي بلورات متداخلة، لا يخدش بالظفر أبداً!"
                  : "حجر الخفاف مليء بالفقاعات الهوائية وخفيف لدرجة أنه يطفو فوق الماء!"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* PAGE 34 & 35: Rock Cycle Interactive */}
      {(pageNum === 34 || pageNum === 35) && (
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 font-cambridge flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              The Rock Cycle (دورة الصخور المستمرة)
            </span>
          </div>

          <div className="scale-95 origin-top -mt-2">
            <RockCycleInteractive />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
            <span className="font-black text-emerald-950 font-cambridge block">
              🌪️ Weathering & Erosion (التجوية والتعرية):
            </span>
            <p className="text-[11px] text-slate-700 font-arabic leading-relaxed">
              الرياح والأمطار وتجمد المياه داخل شقوق الصخور تفككها على مدى آلاف السنين إلى حبيبات رمل وتربة!
            </p>
          </div>
        </div>
      )}

      {/* PAGE 36 & 37: Fossils & Building Materials */}
      {(pageNum === 36 || pageNum === 37) && (
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 font-cambridge flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Fossils & Rocks in Buildings
            </span>
          </div>

          <div className="scale-95 origin-top -mt-2">
            <BuildingMaterialsSorter />
          </div>

          {/* 4-Stage Fossil formation visual */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs">
            <span className="font-black text-amber-950 font-cambridge block">
              🦖 How a Fossil Forms (كيف تتكون الأحفورة؟):
            </span>
            <div className="space-y-1 text-[11px] font-arabic text-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[9px]">1</span>
                <span>يموت الكائن الحي ويغوص في الطين أو قاع البحر.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[9px]">2</span>
                <span>تتراكم طبقات الرواسب فوقه لآلاف السنين.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[9px]">3</span>
                <span>تتحلل الأجزاء الرخوة وتحل المعادن محل العظام لتتحجر.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[9px]">4</span>
                <span>عوامل التعرية تكشف الصخر ليجده العلماء!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 38 & 39: Unit 2 Review & Stage 3 Graduation */}
      {(pageNum === 38 || pageNum === 39) && (
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 font-cambridge flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Stage 3 Science Completion Certificate!
            </span>
            <button
              onClick={() =>
                speak(
                  "Congratulations! You have completed Grade 3 Primary Science Stage 3. You are now a junior scientist!"
                )
              }
              className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-gradient-to-br from-amber-100 via-amber-50 to-emerald-50 border-2 border-amber-300 rounded-2xl text-center space-y-2">
            <span className="text-3xl">🎓</span>
            <h5 className="text-sm font-black font-cambridge text-slate-900">
              Cambridge Primary Science Explorer
            </h5>
            <p className="text-xs text-slate-600 font-arabic">
              تهانينا! لقد أتممت دراسة الوحدتين 1 و 2 بنجاح وأصبحت مستكشفاً علمياً بارعاً!
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DID YOU KNOW? / SCIENCE SPARK (فكر واكتشف) */}
      {/* ======================================================== */}
      <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-950 font-cambridge flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            Did you know? (فكر واكتشف)
          </span>
          <button
            onClick={() => setRevealedFact(!revealedFact)}
            className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1 font-arabic"
          >
            <span>{revealedFact ? "إخفاء" : "اضغط للسر العلمي"}</span>
            {revealedFact ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {revealedFact && (
          <div className="pt-1 text-xs text-amber-950 font-arabic leading-relaxed space-y-1.5 border-t border-amber-200">
            {isUnit1 ? (
              <p>
                يستغرق ضوء الشمس حوالي <strong>8 دقائق و 20 ثانية</strong> فقط ليقطع مسافة 150 مليون كيلومتر ويصل إلى كوكب الأرض! الضوء هو أسرع شيء في الكون (300,000 كم/ثانية).
              </p>
            ) : (
              <p>
                مركز الأرض في اللب الداخلي تبلغ حرارته حوالي <strong>6,000 درجة مئوية</strong>، وهي نفس درجة حرارة سطح الشمس تقريباً!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

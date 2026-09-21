import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import { Sparkles, Volume2, Globe, CheckCircle2 } from "lucide-react";

export const EarthLayersExplorer: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>("crust");

  const layers = [
    {
      id: "crust",
      nameEn: "Crust",
      nameAr: "القشرة",
      thickness: "الطبقة السطحية الرقيقة (Thin outer rocky surface)",
      clayColor: "صلصال أزرق وأخضر (Blue & green clay)",
      colorClass: "bg-emerald-500 border-emerald-600 text-emerald-950",
      ringColor: "#10b981",
      radius: 140,
      descriptionAr: "الطبقة الصخرية الخارجية الرقيقة التي نعيش عليها ونبني فوقها بيوتنا.",
      descriptionEn: "The thin, rocky outer layer of the Earth where we live.",
      pageRef: "p. 31",
    },
    {
      id: "mantle",
      nameEn: "Mantle",
      nameAr: "الوشاح",
      thickness: "الطبقة الوسطى السميكة (Thick middle rock layer)",
      clayColor: "صلصال أصفر أو بني سميك (Thick yellow/brown clay)",
      colorClass: "bg-amber-400 border-amber-500 text-amber-950",
      ringColor: "#f59e0b",
      radius: 105,
      descriptionAr: "الطبقة الصخرية العميقة والسميكة الواقعة بين القشرة واللب الخارجي.",
      descriptionEn: "The thick middle rock layer beneath the crust.",
      pageRef: "p. 31",
    },
    {
      id: "outerCore",
      nameEn: "Outer Core",
      nameAr: "اللب الخارجي",
      thickness: "الطبقة المحيطة باللب الداخلي (Surrounds inner core)",
      clayColor: "صلصال برتقالي (Orange clay)",
      colorClass: "bg-orange-500 border-orange-600 text-orange-950",
      ringColor: "#f97316",
      radius: 70,
      descriptionAr: "طبقة اللب السائلة المحيطة مباشرة بالمركز الصلب للأرض.",
      descriptionEn: "The molten metal layer surrounding the inner core.",
      pageRef: "p. 31",
    },
    {
      id: "innerCore",
      nameEn: "Inner Core",
      nameAr: "اللب الداخلي",
      thickness: "مركز الأرض الصلب (Solid center of the Earth)",
      clayColor: "كرة صغيرة من الصلصال الأحمر (Small red clay ball)",
      colorClass: "bg-red-600 border-red-700 text-white",
      ringColor: "#dc2626",
      radius: 35,
      descriptionAr: "المركز الأعمق والأشد حرارة في باطن كوكب الأرض.",
      descriptionEn: "The solid sphere at the very center of the Earth.",
      pageRef: "p. 31",
    },
  ];

  const currentInfo = layers.find((l) => l.id === selectedLayer) || layers[0];

  const handleSelectLayer = (id: string) => {
    setSelectedLayer(id);
    const item = layers.find((l) => l.id === id);
    if (item) {
      audioManager.playSuccessSound();
      audioManager.speak(`${item.nameEn}. ${item.descriptionEn}`, "en");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-emerald-100">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
            صفحة 31
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>نموذج طبقات الأرض الأربعة المجسم (Make a Model Earth)</span>
          </h3>
          <p className="text-sm text-slate-500 font-arabic">
            انقري على أي طبقة لاكتشاف اسمها بالإنجليزية والعربية وطريقة صنعها بالصلصال!
          </p>
        </div>

        <button
          onClick={() =>
            audioManager.speak(
              "The Earth has four layers: Crust, Mantle, Outer core, and Inner core.",
              "en"
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع لأسماء الطبقات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Cross-Section */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl shadow-inner border border-slate-700 relative">
          <span className="text-xs text-slate-400 mb-2 font-arabic">
            مقطع عرضي لنموذج الأرض (انقري على الدوائر):
          </span>

          <svg viewBox="0 0 320 320" className="w-64 h-64 sm:w-72 sm:h-72">
            {/* Background circle */}
            <circle cx="160" cy="160" r="145" fill="#0f172a" stroke="#334155" strokeWidth="2" />

            {/* Crust: radius 140 */}
            <circle
              cx="160"
              cy="160"
              r="140"
              fill={selectedLayer === "crust" ? "#059669" : "#10b981"}
              stroke="#047857"
              strokeWidth={selectedLayer === "crust" ? "5" : "2"}
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => handleSelectLayer("crust")}
            />

            {/* Mantle: radius 105 */}
            <circle
              cx="160"
              cy="160"
              r="105"
              fill={selectedLayer === "mantle" ? "#d97706" : "#f59e0b"}
              stroke="#b45309"
              strokeWidth={selectedLayer === "mantle" ? "5" : "2"}
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => handleSelectLayer("mantle")}
            />

            {/* Outer Core: radius 70 */}
            <circle
              cx="160"
              cy="160"
              r="70"
              fill={selectedLayer === "outerCore" ? "#ea580c" : "#f97316"}
              stroke="#c2410c"
              strokeWidth={selectedLayer === "outerCore" ? "5" : "2"}
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => handleSelectLayer("outerCore")}
            />

            {/* Inner Core: radius 35 */}
            <circle
              cx="160"
              cy="160"
              r="35"
              fill={selectedLayer === "innerCore" ? "#b91c1c" : "#dc2626"}
              stroke="#991b1b"
              strokeWidth={selectedLayer === "innerCore" ? "5" : "2"}
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => handleSelectLayer("innerCore")}
            />

            {/* Center label */}
            <text x="160" y="165" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
              اللب
            </text>
          </svg>

          {/* Quick buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-4 w-full">
            {layers.map((l) => (
              <button
                key={l.id}
                onClick={() => handleSelectLayer(l.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex flex-col items-center ${
                  selectedLayer === l.id
                    ? "bg-amber-400 text-slate-950 ring-2 ring-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>{l.nameAr}</span>
                <span className="text-[10px] opacity-80 font-kid">{l.nameEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Layer Details Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                  بطاقة اسم الطبقة (Layer Card)
                </span>
                <h4 className="text-2xl font-bold text-slate-900 mt-1 font-kid">
                  {currentInfo.nameEn} - {currentInfo.nameAr}
                </h4>
              </div>
              <button
                onClick={() => audioManager.speak(currentInfo.nameEn, "en")}
                className="p-2 rounded-full bg-white text-emerald-700 hover:bg-emerald-100 shadow-sm"
                title="استمع للاسم"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-800 mt-2">
              {currentInfo.descriptionAr}
            </p>
            <p className="text-xs text-slate-600 mt-1 font-kid">
              {currentInfo.descriptionEn}
            </p>

            <div className="mt-4 pt-3 border-t border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-0.5">سمك الطبقة:</span>
                <span className="text-slate-700">{currentInfo.thickness}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-0.5">لون الصلصال المقترح:</span>
                <span className="text-slate-700">{currentInfo.clayColor}</span>
              </div>
            </div>
          </div>

          {/* Model Improvement Advice from Page 31 */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-800">
            <span className="font-bold text-amber-900 block mb-1">
              💡 نصائح تحسين النموذج من صفحة 31 (Model Improvements):
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>"Make all four layers visible and label them clearly." (إظهار الطبقات الأربع بوضوح).</li>
              <li>"Use different colours and more accurate layer thicknesses." (استخدام ألوان مميزة وسماكات واقعية).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

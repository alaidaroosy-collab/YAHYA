import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import { CheckCircle, Volume2, Sparkles, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface WordItem {
  word: string;
  arabic: string;
  found: boolean;
}

interface Props {
  type: "light" | "rocks";
}

export const InteractiveWordsearch: React.FC<Props> = ({ type }) => {
  const isLight = type === "light";

  // Grid and words taken directly from Page 15 and Page 28
  const lightGrid = [
    ["M", "L", "A", "A", "P", "C", "F", "D"],
    ["D", "B", "M", "H", "R", "T", "B", "U"],
    ["S", "H", "A", "D", "O", "W", "E", "C"], // SHADOW (row 2, cols 0-5)
    ["G", "C", "L", "E", "T", "G", "F", "S"], // S (col 7)
    ["H", "A", "S", "W", "E", "D", "B", "U"], // U (col 7)
    ["B", "C", "F", "D", "C", "J", "C", "N"], // N (col 7) -> SUN
    ["L", "I", "G", "H", "T", "B", "N", "E"], // LIGHT (row 6, cols 0-4)
    ["P", "A", "T", "T", "E", "R", "N", "D"], // PATTERN (row 7, cols 0-6)
  ];

  const lightWordList: WordItem[] = [
    { word: "SHADOW", arabic: "ظل", found: false },
    { word: "SUN", arabic: "الشمس", found: false },
    { word: "LIGHT", arabic: "ضوء", found: false },
    { word: "PATTERN", arabic: "نمط", found: false },
    { word: "DARK", arabic: "مظلم", found: false },
    { word: "REFLECT", arabic: "يعكس", found: false },
    { word: "PROTECT", arabic: "يحمي", found: false },
  ];

  const rockGrid = [
    ["R", "X", "M", "L", "S"],
    ["S", "O", "I", "L", "T"], // SOIL (row 1, cols 0-3)
    ["A", "R", "C", "O", "O"], // R
    ["N", "T", "O", "K", "N"], // O, K (col 3 diagonal/vert)
    ["D", "T", "L", "B", "E"], // SANDY (col 0: S-A-N-D-Y), STONE (col 4: S-T-O-N-E)
    ["Y", "X", "R", "T", "B"],
  ];

  const rockWordList: WordItem[] = [
    { word: "SOIL", arabic: "تربة", found: false },
    { word: "ROCK", arabic: "صخر", found: false },
    { word: "SANDY", arabic: "رملي", found: false },
    { word: "STONE", arabic: "حجر", found: false },
  ];

  const [words, setWords] = useState<WordItem[]>(isLight ? lightWordList : rockWordList);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [missingWordFound, setMissingWordFound] = useState<boolean>(false);

  const grid = isLight ? lightGrid : rockGrid;

  const handleCellClick = (r: number, c: number, letter: string) => {
    const key = `${r}-${c}`;
    if (selectedCells.includes(key)) {
      // unselect
      const nextCells = selectedCells.filter((k) => k !== key);
      setSelectedCells(nextCells);
      setCurrentWord((prev) => prev.replace(letter, ""));
      return;
    }

    const nextCells = [...selectedCells, key];
    setSelectedCells(nextCells);
    const nextWord = currentWord + letter;
    setCurrentWord(nextWord);

    // Check if matches any word
    const match = words.find(
      (w) => !w.found && (w.word === nextWord || w.word === nextWord.split("").reverse().join(""))
    );

    if (match) {
      audioManager.playSuccessSound();
      audioManager.speak(match.word, "en");
      setWords((prev) =>
        prev.map((item) => (item.word === match.word ? { ...item, found: true } : item))
      );
      setSelectedCells([]);
      setCurrentWord("");

      const remaining = words.filter((w) => !w.found && w.word !== match.word);
      if (remaining.length === 0) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedCells([]);
    setCurrentWord("");
  };

  const handleQuickReveal = (targetWord: string) => {
    const match = words.find((w) => w.word === targetWord);
    if (match) {
      audioManager.playSuccessSound();
      audioManager.speak(match.word, "en");
      setWords((prev) =>
        prev.map((item) => (item.word === targetWord ? { ...item, found: true } : item))
      );
    }
  };

  const allFound = words.every((w) => w.found);

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-amber-100">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>{isLight ? "لعبة شبكة كلمات الضوء (Wordsearch)" : "لعبة شبكة كلمات الصخور والتربة"}</span>
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {isLight
              ? "ابحثي عن الكلمات الأساسية من صفحة 15 في الشبكة بالنقر على الحروف!"
              : "ابحثي عن الكلمات الأساسية من صفحة 28 (Soil, Rock, Sandy, Stone)!"}
          </p>
        </div>
        <button
          onClick={() =>
            audioManager.speak(
              isLight
                ? "Find the key words in the wordsearch: shadow, sun, light, pattern, dark, reflect, protect."
                : "Find the key words: soil, rock, sandy, stone.",
              "en"
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 text-sm font-semibold transition"
          aria-label="قراءة التعليمات صوتياً"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع للتعليمات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Letters Grid */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="inline-block p-3 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-inner">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((row, rIdx) =>
                row.map((letter, cIdx) => {
                  const key = `${rIdx}-${cIdx}`;
                  const isSelected = selectedCells.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => handleCellClick(rIdx, cIdx, letter)}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-lg font-bold font-kid transition-all transform active:scale-95 flex items-center justify-center ${
                        isSelected
                          ? "bg-amber-500 text-white shadow-md scale-105"
                          : "bg-white text-slate-700 hover:bg-amber-100/70 border border-amber-200"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Current Selection Toolbar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="px-4 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-mono font-bold tracking-widest text-lg min-w-[120px] text-center border border-slate-200">
              {currentWord || "..."}
            </div>
            {currentWord && (
              <button
                onClick={handleClearSelection}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-200 rounded-lg"
              >
                مسح التحديد
              </button>
            )}
          </div>
        </div>

        {/* Word checklist */}
        <div className="lg:col-span-5 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
            <span>قائمة الكلمات المطلوبة:</span>
            <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              {words.filter((w) => w.found).length} / {words.length}
            </span>
          </h4>

          <div className="space-y-2">
            {words.map((item) => (
              <div
                key={item.word}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition ${
                  item.found
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-white border-slate-200 text-slate-700 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      audioManager.speak(item.word, "en");
                    }}
                    className="p-1 rounded hover:bg-slate-100 text-amber-600"
                    title="نطق الكلمة"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className={`font-bold font-kid tracking-wide ${item.found ? "line-through" : ""}`}>
                    {item.word}
                  </span>
                  <span className="text-xs text-slate-500 font-arabic">({item.arabic})</span>
                </div>

                {item.found ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <button
                    onClick={() => handleQuickReveal(item.word)}
                    className="text-xs text-amber-700 hover:underline px-2 py-0.5"
                  >
                    إيجاد
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Missing Word Activity from Page 15 */}
          {isLight && (
            <div className="mt-5 pt-4 border-t border-amber-200 bg-amber-100/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>سؤال صفحة 15 (الكلمة الناقصة):</span>
              </div>
              <p className="text-xs text-slate-700 mb-2">
                "Check the key words in your Student Book. Which key word is missing?"
              </p>
              {!missingWordFound ? (
                <button
                  onClick={() => {
                    setMissingWordFound(true);
                    audioManager.playSuccessSound();
                    audioManager.speak("The missing key word is torch. مصباح يدوي", "en");
                  }}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold shadow-sm transition"
                >
                  كشف الكلمة الناقصة مع الشرح
                </button>
              ) : (
                <div className="bg-white p-2.5 rounded border border-amber-300 text-center animate-fade-in">
                  <span className="text-lg font-bold text-amber-800 font-kid">🔦 torch</span>
                  <p className="text-xs text-slate-600 mt-1">
                    الكلمة الناقصة هي <strong>torch (مصباح يدوي)</strong>، وهو مصدر ضوء من صنع الإنسان!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

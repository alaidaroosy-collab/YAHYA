import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { scienceFactsList, ScienceFact } from "../data/scienceFactsData";
import { audioManager } from "../utils/audioPlayer";
import { rewardsManager } from "../utils/rewardsManager";
import {
  Lightbulb,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  Maximize2,
  Minimize2,
  Compass,
  Sun,
  Eye,
  Moon,
  Flame,
  Globe,
  Trophy,
} from "lucide-react";

interface Props {
  currentLessonId?: string;
  currentUnitNumber?: number;
}

export const DidYouKnowWidget: React.FC<Props> = ({
  currentLessonId = "lesson-1-1-light-dark",
  currentUnitNumber = 1,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter facts related to current lesson, or current unit as secondary match, or all
  const relatedFacts = useMemo(() => {
    const lessonMatches = scienceFactsList.filter((f) => f.lessonId === currentLessonId);
    if (lessonMatches.length > 0) return lessonMatches;
    const unitMatches = scienceFactsList.filter((f) => f.unitId === currentUnitNumber);
    if (unitMatches.length > 0) return unitMatches;
    return scienceFactsList;
  }, [currentLessonId, currentUnitNumber]);

  // Reset index if relatedFacts change
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentLessonId]);

  const activeFact: ScienceFact = relatedFacts[currentIndex] || relatedFacts[0] || scienceFactsList[0];

  // Periodic automatic gentle rotation (every 22 seconds) when not paused or speaking
  useEffect(() => {
    if (isPaused || isSpeaking || isMinimized || !isOpen) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % relatedFacts.length);
      rewardsManager.recordFactRead();
    }, 22000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isSpeaking, isMinimized, isOpen, relatedFacts.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % relatedFacts.length);
    audioManager.stop();
    setIsSpeaking(false);
    rewardsManager.recordFactRead();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + relatedFacts.length) % relatedFacts.length);
    audioManager.stop();
    setIsSpeaking(false);
    rewardsManager.recordFactRead();
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      audioManager.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const speechText = `Did you know? ${activeFact.curiousQuestionEn}. ${activeFact.factEn}`;
    audioManager.speak(speechText, "en");

    // Track fact read for rewards
    rewardsManager.recordFactRead();

    // Auto-reset state after speech
    setTimeout(() => {
      setIsSpeaking(false);
    }, 7000);
  };

  // Helper icon renderer
  const renderFactIcon = (iconName: string) => {
    switch (iconName) {
      case "Sun":
        return <Sun className="w-5 h-5 text-amber-500" />;
      case "Moon":
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case "Eye":
        return <Eye className="w-5 h-5 text-sky-500" />;
      case "Flame":
        return <Flame className="w-5 h-5 text-orange-500" />;
      case "Globe":
        return <Globe className="w-5 h-5 text-emerald-500" />;
      case "Compass":
        return <Compass className="w-5 h-5 text-cyan-500" />;
      case "Trophy":
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  // If dismissed completely, provide a subtle, elegant floating trigger
  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            rewardsManager.recordFactRead();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-xl border-2 border-white/60 transition active:scale-95 font-cambridge"
          title="Open 'Did You Know?' Science Facts (هل تعلم؟)"
        >
          <Lightbulb className="w-4 h-4 text-amber-200 animate-bounce" />
          <span>Did You Know?</span>
          <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">
            {relatedFacts.length}
          </span>
        </motion.button>
      </div>
    );
  }

  // Minimized pill state (sits neatly at the corner without covering content)
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border-2 border-amber-300 text-slate-800 shadow-xl"
        >
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Lightbulb className="w-4 h-4 animate-pulse" />
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-left"
          >
            <span className="text-xs font-black font-cambridge text-slate-800 block hover:text-amber-600 transition">
              Did You Know? ({currentIndex + 1}/{relatedFacts.length})
            </span>
            <span className="text-[10px] text-slate-500 font-arabic line-clamp-1 max-w-[180px]">
              {activeFact.curiousQuestionAr}
            </span>
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            title="Expand"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    );
  }

  // Expanded interactive fact popup card
  return (
    <div
      className="fixed bottom-5 right-5 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFact.id}
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-amber-300 shadow-2xl p-4 sm:p-5 overflow-hidden relative"
        >
          {/* Top Decorative Sparkle Background Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-sky-400" />

          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shadow-xs">
                {renderFactIcon(activeFact.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-cambridge font-black text-xs text-amber-950 uppercase tracking-wide">
                    Did You Know?
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                    {activeFact.tag}
                  </span>
                </div>
                <span className="text-[11px] text-amber-700 font-arabic font-bold">
                  هل تعلم؟ (معلومة علمية شيقة)
                </span>
              </div>
            </div>

            {/* Top Action Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-xl transition ${
                  isSpeaking
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                }`}
                title={isSpeaking ? "Stop Voice" : "Listen to Fact (استمع للمعلومة بصوت هادئ)"}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                title="Minimize Fact Window (تصغير)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                title="Close (إغلاق)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Curious Question */}
          <div className="mb-2.5">
            <h4 className="font-kid font-bold text-slate-900 text-sm sm:text-base leading-snug">
              {activeFact.curiousQuestionEn}
            </h4>
            <p className="text-xs text-amber-900 font-arabic font-semibold mt-0.5">
              {activeFact.curiousQuestionAr}
            </p>
          </div>

          {/* Bite-Sized Fact Body */}
          <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/80 mb-3 space-y-1.5">
            <p className="text-xs sm:text-sm text-slate-800 font-kid leading-relaxed">
              {activeFact.factEn}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-700 font-arabic leading-relaxed pt-1 border-t border-amber-200/60">
              {activeFact.factAr}
            </p>
          </div>

          {/* Footer Controls: Pagination, Fun Rating & Next/Prev Buttons */}
          <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: activeFact.funMeter }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[10px] text-slate-400 font-mono ml-1 font-bold">
                {currentIndex + 1}/{relatedFacts.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cambridge text-xs font-bold transition active:scale-95"
                title="Previous Fact"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-cambridge text-xs font-bold transition shadow-xs active:scale-95"
              >
                <span>Next Fact</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

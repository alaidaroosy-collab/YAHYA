import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { allBookPages, BookPage } from "../data/pagesData";
import { audioManager, AudioPlayState } from "../utils/audioPlayer";
import { rewardsManager } from "../utils/rewardsManager";
import { HighlightText } from "./HighlightText";
import { CambridgeSmartMargin } from "./CambridgeSmartMargin";

import {
  BookOpen,
  Volume2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Lightbulb,
  Sun,
  Globe,
  Layers,
  Award,
  Search,
  FlaskConical,
  Cog,
  MessageSquare,
  Columns,
  Eye,
  Maximize2,
  Square,
  Sliders,
  RotateCcw,
  Trophy,
  Star,
} from "lucide-react";

interface Props {
  initialPage?: number;
  onSelectWord?: (wordId: string) => void;
}

// Gentle, tactile 3D physical book page-turn variants
const pageFlipVariants: Variants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? -16 : 16,
    x: direction > 0 ? 36 : -36,
    opacity: 0,
    scale: 0.985,
    transformOrigin: direction > 0 ? "left center" : "right center",
  }),
  center: {
    rotateY: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    transformOrigin: "center center",
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const, // Gentle, smooth ease-out curve
    },
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? 14 : -14,
    x: direction > 0 ? -36 : 36,
    opacity: 0,
    scale: 0.985,
    transformOrigin: direction > 0 ? "left center" : "right center",
    transition: {
      duration: 0.26,
      ease: [0.32, 0, 0.67, 0] as const, // Smooth, natural fold-away
    },
  }),
};

// Soothing, calm cross-fade variants
const pageFadeVariants: Variants = {
  enter: {
    opacity: 0,
    y: 12,
    scale: 0.99,
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: {
      duration: 0.22,
      ease: "easeIn" as const,
    },
  },
};

export const BookPagesExplorer: React.FC<Props> = ({ initialPage = 14, onSelectWord }) => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(initialPage);
  const [pageDirection, setPageDirection] = useState<number>(1);
  const [transitionStyle, setTransitionStyle] = useState<"flip" | "fade">("flip");
  const [isSoundEffectEnabled, setIsSoundEffectEnabled] = useState<boolean>(true);
  const [showSmartMargin, setShowSmartMargin] = useState<boolean>(true);
  const [readingSectionIdx, setReadingSectionIdx] = useState<number | null>(null);
  const [audioState, setAudioState] = useState<AudioPlayState>(audioManager.getState());

  // Track completed/visited pages in curriculum with persistence
  const [completedPages, setCompletedPages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("cambridge_science_completed_pages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...parsed, initialPage]));
        }
      }
    } catch {
      // fallback
    }
    return [initialPage];
  });

  // Mark current page as completed/studied and save to localStorage
  useEffect(() => {
    setCompletedPages((prev) => {
      if (prev.includes(currentPageNum)) return prev;
      const updated = [...prev, currentPageNum];
      try {
        localStorage.setItem("cambridge_science_completed_pages", JSON.stringify(updated));
      } catch {
        // ignore
      }
      rewardsManager.recordPageExplored(updated.length);
      return updated;
    });
  }, [currentPageNum]);

  // Audio manager state subscription
  useEffect(() => {
    const unsub = audioManager.subscribe((state) => {
      setAudioState({ ...state });
    });
    return unsub;
  }, []);

  const currentPage =
    allBookPages.find((p) => p.pageNumber === currentPageNum) || allBookPages[0];

  const isUnit1 = currentPage.unitNumber === 1;

  // Total pages and curriculum progress calculation
  const totalCurriculumPages = allBookPages.length; // 26 pages (14 to 39)
  const completedCount = completedPages.length;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / totalCurriculumPages) * 100)
  );

  // Unit 1 (14-25, 12 pages) & Unit 2 (26-39, 14 pages) progress breakdown
  const unit1Pages = allBookPages.filter((p) => p.unitNumber === 1);
  const unit2Pages = allBookPages.filter((p) => p.unitNumber === 2);
  const unit1Completed = unit1Pages.filter((p) => completedPages.includes(p.pageNumber)).length;
  const unit2Completed = unit2Pages.filter((p) => completedPages.includes(p.pageNumber)).length;

  // Gentle page navigation handler with direction tracking & soft paper turn sound
  const goToPage = (targetPage: number) => {
    if (targetPage === currentPageNum || targetPage < 14 || targetPage > 39) return;
    const dir = targetPage > currentPageNum ? 1 : -1;
    setPageDirection(dir);
    setCurrentPageNum(targetPage);
    audioManager.stop();
    setReadingSectionIdx(null);
    if (isSoundEffectEnabled) {
      audioManager.playPageTurnSound();
    }
  };

  const handlePrevPage = () => {
    goToPage(currentPageNum - 1);
  };

  const handleNextPage = () => {
    goToPage(currentPageNum + 1);
  };

  // Keyboard arrow keys for physical book flipping feeling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        goToPage(currentPageNum + 1);
      } else if (e.key === "ArrowLeft") {
        goToPage(currentPageNum - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageNum, isSoundEffectEnabled]);

  const handleReadEntirePage = () => {
    if (audioState.isPlaying) {
      audioManager.stop();
      return;
    }
    const sequence: { textEn: string; textAr?: string }[] = [];
    sequence.push({
      textEn: `${currentPage.lessonTitleEn}. ${currentPage.subtitleEn}`,
      textAr: `${currentPage.lessonTitleAr} - ${currentPage.subtitleAr}`,
    });
    currentPage.sections.forEach((sec) => {
      sequence.push({
        textEn: sec.titleEn,
        textAr: sec.titleAr,
      });
      sec.contentEn.forEach((sent, idx) => {
        sequence.push({
          textEn: sent,
          textAr: sec.contentAr[idx] || sec.contentAr[0] || "",
        });
      });
    });
    audioManager.speakSequence(sequence, "en");
  };

  const handleReadSection = (sec: (typeof currentPage.sections)[0], sIdx: number) => {
    if (audioState.isPlaying && readingSectionIdx === sIdx) {
      audioManager.stop();
      setReadingSectionIdx(null);
      return;
    }
    setReadingSectionIdx(sIdx);
    const sequence: { textEn: string; textAr?: string }[] = [];
    sequence.push({
      textEn: sec.titleEn,
      textAr: sec.titleAr,
    });
    sec.contentEn.forEach((sent, idx) => {
      sequence.push({
        textEn: sent,
        textAr: sec.contentAr[idx] || sec.contentAr[0] || "",
      });
    });
    audioManager.speakSequence(sequence, "en");
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* CAMBRIDGE STAGE 3 NAVIGATION & PAGE PICKER */}
      {/* ======================================================== */}
      <div className="bg-[#002D62] text-white rounded-3xl p-4 sm:p-5 shadow-md space-y-4 border border-blue-900/40">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* Cambridge Crest / Unit Page Pill */}
            <div
              className={`w-13 h-13 rounded-2xl flex flex-col items-center justify-center text-white shadow-inner font-mono font-black border-2 ${
                isUnit1
                  ? "bg-[#00A3E0] border-sky-300 text-white"
                  : "bg-[#00875A] border-emerald-300 text-white"
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider opacity-85">Page</span>
              <span className="text-xl leading-none">{currentPage.pageNumber}</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black font-cambridge ${
                    isUnit1 ? "bg-sky-400 text-sky-950" : "bg-emerald-400 text-emerald-950"
                  }`}
                >
                  Cambridge Primary Science • Stage 3
                </span>
                <span className="text-xs text-blue-200 font-bold font-arabic">
                  {currentPage.unitTitleAr}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-cambridge tracking-wide mt-1">
                {currentPage.unitTitleEn}
              </h2>
            </div>
          </div>

          {/* Quick Prev / Next Controls, Animation Switcher & Margin Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Soft Page Flip vs Gentle Fade Switcher */}
            <div className="flex items-center p-1 bg-black/25 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setTransitionStyle("flip")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-cambridge font-bold transition ${
                  transitionStyle === "flip"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
                title="3D Soft Book Page-Turn (تقليب ثلاثي الأبعاد لصفحات الكتاب)"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#00A3E0]" />
                <span>Page Flip</span>
              </button>

              <button
                onClick={() => setTransitionStyle("fade")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-cambridge font-bold transition ${
                  transitionStyle === "fade"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
                title="Gentle Fade Transition (تلاشٍ هادئ مريح)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Soft Fade</span>
              </button>
            </div>

            {/* Paper Rustle Sound Effect Toggle */}
            <button
              onClick={() => setIsSoundEffectEnabled(!isSoundEffectEnabled)}
              className={`p-2 rounded-xl transition border text-xs flex items-center gap-1 font-cambridge font-bold ${
                isSoundEffectEnabled
                  ? "bg-white/20 border-white/30 text-sky-200 hover:bg-white/30"
                  : "bg-black/30 border-transparent text-white/40 hover:text-white/70"
              }`}
              title={isSoundEffectEnabled ? "صوت تقليب ورق الكتاب مفعّل" : "صوت تقليب الورق صامت"}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Flip Sound</span>
            </button>

            <button
              onClick={() => setShowSmartMargin(!showSmartMargin)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition ${
                showSmartMargin
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-white text-[#002D62] hover:bg-blue-50"
              }`}
              title="Toggle interactive margins"
            >
              <Columns className="w-4 h-4" />
              <span className="font-arabic font-bold text-xs">
                {showSmartMargin ? "إخفاء الهوامش" : "الهوامش التفاعلية"}
              </span>
            </button>

            <button
              onClick={handlePrevPage}
              disabled={currentPageNum <= 14}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition font-cambridge"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Page {currentPageNum - 1}</span>
            </button>

            <span className="px-3 py-2 bg-black/30 rounded-xl text-xs font-mono font-black text-blue-200">
              {currentPage.pageNumber} / 39
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPageNum >= 39}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition font-cambridge ${
                isUnit1
                  ? "bg-[#00A3E0] hover:bg-[#0284C7]"
                  : "bg-[#00875A] hover:bg-[#059669]"
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <span>Page {currentPageNum + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 26 Pages Visual Thumbnails Strip with Completed Checkmarks (Authentic Cambridge Page Jump) */}
        <div className="pt-3 border-t border-blue-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-200 font-bold px-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-arabic">انقر على أي صفحة لتقليب الكتاب مباشرة:</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-blue-900/60 border border-blue-700/50 text-[10px] text-blue-300 font-mono">
                Keyboard: ⬅️ / ➡️
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-300 flex items-center gap-1 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{completedCount}/{totalCurriculumPages} Completed</span>
              </span>
              <span className="text-blue-300 font-medium">Pages 14 to 39</span>
            </div>
          </div>

          {/* Dynamic Curriculum Reading Progress Bar */}
          <div className="bg-black/35 rounded-2xl p-3 border border-white/10 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="font-cambridge font-bold text-sky-100">
                  Curriculum Progress (تقدّم قراءة المنهج):
                </span>
                <span className="font-mono font-black text-amber-300 bg-amber-400/20 border border-amber-300/30 px-2 py-0.5 rounded-md">
                  {progressPercent}%
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-sky-200 font-arabic hidden sm:inline">
                  أكملت <span className="font-bold text-white font-mono">{completedCount}</span> من أصل <span className="font-bold text-white font-mono">{totalCurriculumPages}</span> صفحة
                </span>
                {progressPercent === 100 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px]">
                    <Star className="w-3 h-3 fill-emerald-300 text-emerald-300" />
                    <span>مكتمل بالكامل!</span>
                  </span>
                ) : (
                  <span className="text-blue-200/80 text-[11px] font-mono">
                    {totalCurriculumPages - completedCount} pages left
                  </span>
                )}
              </div>
            </div>

            {/* Visual Two-Tone Segmented Progress Bar */}
            <div className="relative w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-400 shadow-sm transition-all relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Glowing shimmer on progress bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-pulse" />
              </motion.div>
            </div>

            {/* Unit 1 vs Unit 2 Chapter Breakdown Chips */}
            <div className="flex items-center justify-between text-[11px] text-blue-200 pt-0.5 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 font-cambridge">
                <span className="w-2 h-2 rounded-full bg-[#00A3E0]" />
                <span className="font-bold text-white">Unit 1 (Plants):</span>
                <span className="font-mono text-sky-200">
                  {unit1Completed}/{unit1Pages.length} pages
                </span>
                <span className="text-blue-300 text-[10px]">
                  ({Math.round((unit1Completed / unit1Pages.length) * 100)}%)
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-cambridge">
                <span className="w-2 h-2 rounded-full bg-[#00875A]" />
                <span className="font-bold text-white">Unit 2 (Materials):</span>
                <span className="font-mono text-emerald-200">
                  {unit2Completed}/{unit2Pages.length} pages
                </span>
                <span className="text-blue-300 text-[10px]">
                  ({Math.round((unit2Completed / unit2Pages.length) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            {allBookPages.map((page) => {
              const isSelected = page.pageNumber === currentPageNum;
              const isCompleted = completedPages.includes(page.pageNumber);
              const isPUnit1 = page.unitNumber === 1;

              return (
                <button
                  key={page.pageNumber}
                  onClick={() => goToPage(page.pageNumber)}
                  className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center shrink-0 transition-all font-mono font-black text-xs relative ${
                    isSelected
                      ? isPUnit1
                        ? "bg-[#00A3E0] text-white shadow-lg ring-2 ring-white scale-110"
                        : "bg-[#00875A] text-white shadow-lg ring-2 ring-white scale-110"
                      : isCompleted
                      ? "bg-emerald-900/70 text-emerald-200 hover:bg-emerald-800 border border-emerald-500/50"
                      : isPUnit1
                      ? "bg-sky-950/60 text-sky-200 hover:bg-sky-900 border border-sky-800"
                      : "bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-800"
                  }`}
                  title={`${page.lessonTitleEn} (Page ${page.pageNumber})${isCompleted ? " - Completed (تمت دراستها)" : ""}`}
                >
                  <span>{page.pageNumber}</span>
                  {isCompleted && !isSelected && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-white ring-1 ring-emerald-300 shadow-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CAMBRIDGE TEXTBOOK SPREAD: MAIN PAGE & SMART MARGIN */}
      {/* ======================================================== */}
      <div className={`grid gap-6 ${showSmartMargin ? "lg:grid-cols-12" : "grid-cols-1"}`}>
        {/* ======================================================== */}
        {/* COLUMN 1: THE TEXTBOOK PAGE WITH 3D PAGE-FLIP & SHADOW */}
        {/* ======================================================== */}
        <div
          className={`${
            showSmartMargin ? "lg:col-span-7 xl:col-span-7" : "w-full"
          } relative`}
          style={{ perspective: 1400 }}
        >
          <AnimatePresence mode="wait" custom={pageDirection}>
            <motion.div
              key={currentPage.pageNumber}
              custom={pageDirection}
              variants={transitionStyle === "flip" ? pageFlipVariants : pageFadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="cambridge-paper rounded-3xl border-2 border-slate-300 shadow-xl overflow-hidden flex flex-col justify-between relative transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Realistic Inner Book Spine Shading & Binding Shadow */}
              <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-slate-600/20 via-slate-400/10 to-transparent pointer-events-none z-30" />

              {/* Realistic Page Curl Corner Badge */}
              <div
                className="absolute top-0 right-0 w-12 h-12 pointer-events-none z-30 overflow-hidden"
                title="Cambridge Textbook Page"
              >
                <div className="w-16 h-16 bg-white/45 backdrop-blur-xs transform rotate-45 translate-x-6 -translate-y-6 border-b border-l border-white/60 shadow-xs" />
              </div>
          <div>
            {/* Cambridge Unit Header Ribbon */}
            <div
              className={`p-6 sm:p-7 text-white relative overflow-hidden ${
                isUnit1
                  ? "bg-gradient-to-r from-[#00A3E0] via-[#0284C7] to-[#0369A1]"
                  : "bg-gradient-to-r from-[#00875A] via-[#059669] to-[#047857]"
              }`}
            >
              {/* Cambridge Page Number Watermark */}
              <div className="absolute right-4 -bottom-6 opacity-15 text-9xl font-black font-mono select-none">
                {currentPage.pageNumber}
              </div>

              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black font-mono">
                      Lesson {currentPage.lessonNumber}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/25 text-white text-xs font-mono font-black">
                      Page {currentPage.pageNumber}
                    </span>
                  </div>

                  {/* Read Entire Page Natural Speech Button */}
                  <button
                    onClick={handleReadEntirePage}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-md transition transform active:scale-95 ${
                      audioState.isPlaying && readingSectionIdx === null
                        ? "bg-rose-500 text-white hover:bg-rose-600"
                        : "bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {audioState.isPlaying && readingSectionIdx === null ? (
                      <>
                        <Square className="w-4 h-4 text-white fill-white" />
                        <span className="font-cambridge">Stop Reading (إيقاف)</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#00A3E0]" />
                        <span className="font-cambridge">Read Page (قراءة هادئة للصفحة)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Big Cambridge English Lesson Heading */}
                <h1 className="text-2xl sm:text-3xl font-black font-cambridge leading-tight text-white tracking-wide">
                  <HighlightText text={currentPage.lessonTitleEn} />
                </h1>

                {/* English Subtitle */}
                <p className="text-sm sm:text-base text-white/95 font-book-body font-semibold">
                  {currentPage.subtitleEn}
                </p>

                {/* Arabic Subtitle Guide */}
                <p className="text-xs sm:text-sm text-white/80 font-arabic font-medium">
                  {currentPage.lessonTitleAr} • {currentPage.subtitleAr}
                </p>
              </div>
            </div>

            {/* Page Body Content */}
            <div className="p-6 sm:p-7 space-y-6">
              {/* Cambridge Hero Illustration (if present) */}
              {currentPage.heroImage && (
                <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm relative group">
                  <img
                    src={currentPage.heroImage}
                    alt={currentPage.heroImageAlt || "Cambridge Textbook Illustration"}
                    className="w-full h-56 sm:h-72 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-3 bg-slate-900/90 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-arabic">
                      {currentPage.heroImageAlt}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">
                      p. {currentPage.pageNumber}
                    </span>
                  </div>
                </div>
              )}

              {/* Cambridge "Key words" Yellow Card (Exactly like Cambridge Learner's Book) */}
              {currentPage.keyWords && currentPage.keyWords.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#FEF9C3] border-2 border-[#FDE047] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔑</span>
                      <h3 className="text-sm font-black text-[#713F12] font-cambridge uppercase tracking-wider">
                        Key words
                      </h3>
                      <span className="text-xs text-amber-800 font-arabic font-bold">
                        (المفردات العلمية الهامة)
                      </span>
                    </div>

                    <span className="text-[11px] text-amber-900 font-cambridge font-bold">
                      Click any word to listen
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {currentPage.keyWords.map((word, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          audioManager.speak(word, "en");
                          if (onSelectWord) onSelectWord(word);
                        }}
                        className="px-3 py-1 rounded-xl bg-white hover:bg-[#FACC15] hover:text-[#713F12] border border-[#EAB308] text-slate-900 text-xs font-black font-cambridge flex items-center gap-1.5 transition shadow-2xs group"
                      >
                        <span>{word}</span>
                        <Volume2 className="w-3 h-3 text-slate-400 group-hover:text-[#713F12]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Exact Cambridge Sections with Authentic Banner Ribbons */}
              <div className="space-y-6">
                {currentPage.sections.map((section, sIdx) => {
                  // Authentic Cambridge Ribbon Styling
                  let ribbonBg = "bg-[#00875A]"; // Default green
                  let RibbonIcon = BookOpen;
                  let ribbonLabel = section.titleEn;

                  if (section.type === "getting_started") {
                    ribbonBg = "bg-[#00A86B]"; // Cambridge Spring Green
                    RibbonIcon = Search;
                  } else if (section.type === "activity") {
                    ribbonBg = "bg-[#F97316]"; // Cambridge Orange
                    RibbonIcon = FlaskConical;
                  } else if (section.type === "scientific_thinking") {
                    ribbonBg = "bg-[#7C3AED]"; // Cambridge Royal Purple
                    RibbonIcon = Cog;
                  } else if (section.type === "safety") {
                    ribbonBg = "bg-[#EF4444]"; // Cambridge Red
                    RibbonIcon = ShieldAlert;
                  } else if (section.type === "talk_about") {
                    ribbonBg = "bg-[#EAB308]"; // Cambridge Warm Yellow
                    RibbonIcon = MessageSquare;
                  } else if (section.type === "check_progress") {
                    ribbonBg = "bg-[#0D9488]"; // Cambridge Teal
                    RibbonIcon = Award;
                  } else if (section.type === "look_at_picture") {
                    ribbonBg = "bg-[#0284C7]"; // Cambridge Sky
                    RibbonIcon = Eye;
                  }

                  return (
                    <div
                      key={sIdx}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition hover:border-slate-300"
                    >
                      {/* Authentic Cambridge Ribbon Header */}
                      <div
                        className={`${ribbonBg} text-white px-4 py-2.5 flex items-center justify-between flex-wrap gap-2`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="p-1 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
                            <RibbonIcon className="w-4 h-4 text-white" />
                          </span>
                          <span className="font-black text-sm sm:text-base font-cambridge tracking-wide">
                            {section.titleEn}
                          </span>
                          <span className="text-xs text-white/80 font-arabic font-bold hidden sm:inline">
                            ({section.titleAr})
                          </span>
                        </div>

                        {/* Listen to section */}
                        <button
                          onClick={() => handleReadSection(section, sIdx)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-cambridge transition ${
                            audioState.isPlaying && readingSectionIdx === sIdx
                              ? "bg-rose-500 text-white shadow-xs"
                              : "bg-white/20 hover:bg-white/30 text-white"
                          }`}
                          title="Listen to this section"
                        >
                          {audioState.isPlaying && readingSectionIdx === sIdx ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-white" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Section Content */}
                      <div className="p-5 space-y-4">
                        {/* English Sentences with HighlightText & Sentence Reader */}
                        <div className="space-y-3">
                          {section.contentEn.map((sentence, lineIdx) => {
                            const cleanSentence = sentence.trim();
                            const isSentenceActive =
                              audioState.isPlaying &&
                              Boolean(
                                audioState.text &&
                                  (audioState.text.includes(cleanSentence) || cleanSentence.includes(audioState.text))
                              );

                            return (
                              <div
                                key={lineIdx}
                                className={`flex items-start justify-between gap-3 text-base sm:text-lg font-medium font-book-body leading-relaxed p-2.5 rounded-2xl transition-all duration-300 group ${
                                  isSentenceActive
                                    ? "bg-amber-50/90 border border-amber-300 ring-2 ring-amber-300/80 shadow-xs"
                                    : "hover:bg-slate-50 border border-transparent"
                                }`}
                              >
                                <div className="flex-1">
                                  {section.type === "activity" && (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-950 font-black text-xs font-mono mr-2 align-middle">
                                      {lineIdx + 1}
                                    </span>
                                  )}
                                  <HighlightText text={sentence} />
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {isSentenceActive && (
                                    <div className="flex items-end gap-0.5 h-4 px-1" title="جاري النطق والتتبع">
                                      <span className="w-1 bg-amber-500 rounded-full animate-bounce [animation-duration:0.6s]" style={{ height: "60%" }} />
                                      <span className="w-1 bg-sky-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" style={{ height: "100%" }} />
                                      <span className="w-1 bg-emerald-500 rounded-full animate-bounce [animation-duration:0.5s] [animation-delay:0.1s]" style={{ height: "80%" }} />
                                    </div>
                                  )}
                                  <button
                                    onClick={() =>
                                      audioManager.speak(
                                        sentence,
                                        "en",
                                        true,
                                        section.contentAr[lineIdx] || section.contentAr[0] || ""
                                      )
                                    }
                                    className={`p-1.5 rounded-lg transition ${
                                      isSentenceActive
                                        ? "text-amber-700 bg-amber-200/80 shadow-xs"
                                        : "text-slate-300 group-hover:text-[#00A3E0] hover:bg-sky-50"
                                    }`}
                                    title="Listen to this line with word tracking"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Section Bullet Points (if any) */}
                        {section.bulletPointsEn && section.bulletPointsEn.length > 0 && (
                          <ul className="space-y-2 pl-4 list-disc text-slate-800 font-book-body text-base">
                            {section.bulletPointsEn.map((bullet, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">
                                <HighlightText text={bullet} />
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Arabic Helper Note */}
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs font-arabic text-slate-800 space-y-1">
                          <span className="font-bold text-amber-900 block">
                            💡 توضيح وشرح الدرس بالعربية:
                          </span>
                          {section.contentAr.map((line, arIdx) => (
                            <p key={arIdx} className="leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>

                        {/* Special Cambridge Highlight Note */}
                        {section.highlight && (
                          <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-xs font-black text-amber-950 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{section.highlight}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cambridge Page Bottom Footer with Corner Page Number */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-cambridge">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="font-bold">
                Cambridge Primary Science Learner's Book 3
              </span>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-mono font-black shadow-xs ${
                isUnit1 ? "bg-[#00A3E0]" : "bg-[#00875A]"
              }`}
            >
              {currentPage.pageNumber}
            </div>
          </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: THE INTERACTIVE SMART MARGIN (40% ON DESKTOP) */}
        {/* ======================================================== */}
        {showSmartMargin && (
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <div className="sticky top-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage.pageNumber}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, delay: 0.05 }}
                >
                  <CambridgeSmartMargin page={currentPage} activeSectionIdx={readingSectionIdx ?? 0} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* BOTTOM QUICK PREV/NEXT FOOTER BAR */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPageNum <= 14}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-800 text-xs font-black font-cambridge transition active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous: Page {currentPageNum - 1}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Page {currentPage.pageNumber} / 39
          </span>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-cambridge font-bold text-sky-900">Progress:</span>
            <span className="font-mono font-black text-[#00A3E0]">{progressPercent}%</span>
            <div className="w-16 h-2 bg-sky-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-slate-500 text-[11px]">
              ({completedCount}/26)
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-500 font-arabic font-medium">
            (تقليب الكتاب التفاعلي 📖)
          </span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPageNum >= 39}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-black font-cambridge shadow-sm transition active:scale-95 ${
            isUnit1 ? "bg-[#00A3E0] hover:bg-[#0284C7]" : "bg-[#00875A] hover:bg-[#059669]"
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <span>Next: Page {currentPageNum + 1}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

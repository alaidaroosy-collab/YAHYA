import React, { useState, useEffect } from "react";
import { curriculumUnits } from "./data/curriculumData";
import { Unit, Lesson, VocabWord } from "./types/curriculum";
import { audioManager } from "./utils/audioPlayer";
import { rewardsManager, StudentProfile } from "./utils/rewardsManager";
import { Badge } from "./data/badgesData";

// Interactive Activity Components
import { InteractiveWordsearch } from "./components/InteractiveWordsearch";
import { StepByStepSolver } from "./components/StepByStepSolver";
import { InteractiveRaySimulator } from "./components/InteractiveRaySimulator";
import { ShadowDistanceLab } from "./components/ShadowDistanceLab";
import { DarkBoxSimulator } from "./components/DarkBoxSimulator";
import { EarthLayersExplorer } from "./components/EarthLayersExplorer";
import { RockClassifierKey } from "./components/RockClassifierKey";
import { RockCycleInteractive } from "./components/RockCycleInteractive";
import { BuildingMaterialsSorter } from "./components/BuildingMaterialsSorter";
import { LessonQuiz } from "./components/LessonQuiz";
import { VocabularyModal } from "./components/VocabularyModal";
import { AITutorWidget } from "./components/AITutorWidget";
import { HighlightText } from "./components/HighlightText";

// New Dedicated Hubs
import { BookPagesExplorer } from "./components/BookPagesExplorer";
import { VocabularyVisualAtlas } from "./components/VocabularyVisualAtlas";
import { TextbookExercisesHub } from "./components/TextbookExercisesHub";
import { LiveSpeechTracker } from "./components/LiveSpeechTracker";

// Rewards & Did You Know
import { DidYouKnowWidget } from "./components/DidYouKnowWidget";
import { AwardsModal } from "./components/AwardsModal";
import { BadgeUnlockedToast } from "./components/BadgeUnlockedToast";
import { StudentWelcomeSection } from "./components/StudentWelcomeSection";
import { WeeklyRoadmapWidget } from "./components/WeeklyRoadmapWidget";

import {
  Sun,
  Globe,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  Bot,
  HelpCircle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Award,
  Compass,
  Palette,
  Gamepad2,
  Star,
  Lightbulb,
  Trophy,
  Check,
  Calendar,
} from "lucide-react";

type MainViewMode = "exercises_hub" | "book_pages" | "visual_atlas" | "lessons_hub";

export default function App() {
  const [viewMode, setViewMode] = useState<MainViewMode>("book_pages");
  const [selectedBookPage, setSelectedBookPage] = useState<number>(14);

  const [selectedUnitId, setSelectedUnitId] = useState<string>("unit1-light");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("lesson-1-1-light-dark");
  const [selectedVocab, setSelectedVocab] = useState<VocabWord | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState<boolean>(true);

  // Digital Rewards & Profile State
  const [isAwardsOpen, setIsAwardsOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<StudentProfile>(rewardsManager.getProfile());
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    const unsub = rewardsManager.subscribe((newProfile, badge) => {
      setProfile({ ...newProfile });
      if (badge) {
        setNewlyUnlockedBadge(badge);
      }
    });
    return unsub;
  }, []);

  const levelInfo = rewardsManager.getLevelInfo();

  const handleScrollToRoadmap = () => {
    setIsRoadmapOpen(true);
    setTimeout(() => {
      document.getElementById("weekly-study-roadmap-widget")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // Active Unit & Lesson
  const currentUnit =
    curriculumUnits.find((u) => u.id === selectedUnitId) || curriculumUnits[0];
  const currentLesson =
    currentUnit.lessons.find((l) => l.id === selectedLessonId) || currentUnit.lessons[0];

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnitId(unit.id);
    setSelectedLessonId(unit.lessons[0].id);
    audioManager.stop();
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    audioManager.stop();
  };

  const handleJumpToPage = (pageNum: number) => {
    setSelectedBookPage(pageNum);
    setViewMode("book_pages");
    audioManager.stop();
  };

  const handleReadLessonSummary = () => {
    if (isSpeaking) {
      audioManager.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const fullText = `${currentLesson.titleEn}. ${currentLesson.summaryEn.join(" ")}`;
    audioManager.speak(fullText, "en");
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans selection:bg-amber-200">
      {/* Top Cambridge Identity Header */}
      <header className="bg-[#002D62] text-white border-b-2 border-[#001D40] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          {/* Cambridge Primary Crest & Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00A3E0] text-white flex flex-col items-center justify-center shadow-md font-mono font-black border-2 border-sky-300">
              <span className="text-[10px] uppercase tracking-wider opacity-90">Stage</span>
              <span className="text-xl leading-none">3</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-[#00A3E0] text-white text-xs font-black font-cambridge shadow-xs">
                  Cambridge Primary Science
                </span>
                <span className="text-xs text-sky-200 font-bold font-arabic">
                  المنهج الكامل (الصفحات 14 إلى 39)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight font-cambridge tracking-wide mt-0.5">
                Learner's Book 3: Light, Shadows & Earth
              </h1>
            </div>
          </div>

          {/* Voice indicator & AI Tutor */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/80 border border-sky-600 text-sky-200 text-xs font-bold font-cambridge">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Calm Voice & Tracking (تتبع الصوت والكلام الهادئ)</span>
            </div>

            {/* Student Profile & Digital Awards Trigger */}
            <button
              onClick={() => setIsAwardsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-xs sm:text-sm font-black shadow-xs transition transform active:scale-95 font-cambridge"
              title="Open Student Profile & Digital Badges (الأوسمة والجوائز)"
            >
              <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center shrink-0 border border-amber-300/40">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs">{profile.avatar || "👩‍🔬"}</span>
                )}
              </div>
              <span className="font-bold text-white hidden sm:inline">{profile.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[11px] font-mono font-bold">
                Lv.{levelInfo.level}
              </span>
            </button>

            <button
              onClick={() => setIsTutorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-black shadow-md transition transform active:scale-95 font-cambridge"
            >
              <Bot className="w-4 h-4 text-amber-200" />
              <span>Ask AI Tutor (المعلم الذكي)</span>
            </button>

            <button
              onClick={() => {
                audioManager.stop();
                setIsSpeaking(false);
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition border border-white/20"
              title="إيقاف أي صوت حالي"
              aria-label="إيقاف الصوت"
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-rose-400 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4 text-sky-300" />
              )}
            </button>
          </div>
        </div>

        {/* Cambridge Primary Mode Navigation Ribbon */}
        <div className="bg-[#00224A] border-t border-blue-900/60 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              {/* Tab 1: Book Pages & Interactive Margins (HERO MODE) */}
              <button
                onClick={() => {
                  setViewMode("book_pages");
                  audioManager.stop();
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition shrink-0 font-cambridge ${
                  viewMode === "book_pages"
                    ? "bg-[#00A3E0] text-white shadow-md ring-2 ring-sky-300 scale-105"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Book Pages 14-39 & Margins (صفحات الكتاب والهوامش)</span>
              </button>

              {/* Tab 2: Textbook Exercises Hub */}
              <button
                onClick={() => {
                  setViewMode("exercises_hub");
                  audioManager.stop();
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition shrink-0 font-cambridge ${
                  viewMode === "exercises_hub"
                    ? "bg-[#F97316] text-white shadow-md ring-2 ring-orange-300 scale-105"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Textbook Activities (تمارين الكتاب التفاعلية)</span>
              </button>

              {/* Tab 3: Visual Atlas */}
              <button
                onClick={() => {
                  setViewMode("visual_atlas");
                  audioManager.stop();
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition shrink-0 font-cambridge ${
                  viewMode === "visual_atlas"
                    ? "bg-[#7C3AED] text-white shadow-md ring-2 ring-purple-300 scale-105"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                <Palette className="w-4 h-4 text-amber-300" />
                <span>Picture Dictionary (المعجم المصور)</span>
              </button>

              {/* Tab 4: Labs & Simulations */}
              <button
                onClick={() => {
                  setViewMode("lessons_hub");
                  audioManager.stop();
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition shrink-0 font-cambridge ${
                  viewMode === "lessons_hub"
                    ? "bg-[#00875A] text-white shadow-md ring-2 ring-emerald-300 scale-105"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Science Labs (المختبرات والدروس)</span>
              </button>

              {/* Quick Toggle for Weekly Study Roadmap */}
              <button
                onClick={() => {
                  setIsRoadmapOpen((prev) => !prev);
                  if (!isRoadmapOpen) {
                    handleScrollToRoadmap();
                  }
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition shrink-0 font-cambridge ${
                  isRoadmapOpen
                    ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 scale-105"
                    : "bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-500/40"
                }`}
                title="Toggle Weekly Study Roadmap (إظهار/إخفاء جدول الدراسة الأسبوعي)"
              >
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span>Weekly Roadmap</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-mono font-bold">
                  Week 3 Active
                </span>
              </button>
            </div>

            <span className="text-xs text-sky-200 font-cambridge hidden md:inline font-bold">
              Cambridge Primary Science Stage 3
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ======================================================== */}
        {/* 1. PERSONALIZED STUDENT WELCOME SECTION (Zahra's Profile) */}
        {/* ======================================================== */}
        <StudentWelcomeSection
          profile={profile}
          levelInfo={levelInfo}
          onOpenAwards={() => setIsAwardsOpen(true)}
          onJumpToWeeklyRoadmap={handleScrollToRoadmap}
        />

        {/* ======================================================== */}
        {/* 2. WEEKLY STUDY ROADMAP WIDGET (Curriculum Plan & Progress) */}
        {/* ======================================================== */}
        {isRoadmapOpen && (
          <WeeklyRoadmapWidget
            profile={profile}
            onJumpToBookPage={handleJumpToPage}
            onJumpToLesson={(unitId, lessonId) => {
              setSelectedUnitId(unitId);
              setSelectedLessonId(lessonId);
              setViewMode("lessons_hub");
              audioManager.stop();
            }}
            onSwitchView={(mode) => {
              setViewMode(mode);
              audioManager.stop();
            }}
            onOpenAwardsModal={() => setIsAwardsOpen(true)}
          />
        )}
        {/* ======================================================== */}
        {/* VIEW 1: TEXTBOOK EXERCISES HUB (The Exact Real Cambridge Activities) */}
        {/* ======================================================== */}
        {viewMode === "exercises_hub" && <TextbookExercisesHub />}

        {/* ======================================================== */}
        {/* VIEW 2: FULL BOOK PAGES EXPLORER (Pages 14 to 39) */}
        {/* ======================================================== */}
        {viewMode === "book_pages" && (
          <BookPagesExplorer
            initialPage={selectedBookPage}
            onSelectWord={(wordId) => {
              setViewMode("visual_atlas");
            }}
          />
        )}

        {/* ======================================================== */}
        {/* VIEW 3: VISUAL VOCABULARY ATLAS (Deep Visual Nutrition) */}
        {/* ======================================================== */}
        {viewMode === "visual_atlas" && <VocabularyVisualAtlas />}

        {/* ======================================================== */}
        {/* VIEW 4: UNITS, LESSONS & SIMULATIONS HUB */}
        {/* ======================================================== */}
        {viewMode === "lessons_hub" && (
          <div className="space-y-6">
            {/* Unit Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {curriculumUnits.map((u) => {
                const isSelected = u.id === selectedUnitId;
                const isLight = u.id === "unit1-light";

                return (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUnit(u)}
                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition shrink-0 ${
                      isSelected
                        ? isLight
                          ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-300"
                          : "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs"
                    }`}
                  >
                    {isLight ? <Sun className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                    <span>{u.titleEn}</span>
                    <span className="text-[11px] opacity-90 font-arabic">({u.titleAr})</span>
                  </button>
                );
              })}
            </div>

            {/* Unit Lessons Ribbon */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-black text-slate-500 flex items-center gap-1.5 font-kid">
                  <Layers className="w-4 h-4" />
                  <span>Lessons in {currentUnit.titleEn}:</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentUnit.lessons.length} Lessons
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {currentUnit.lessons.map((lesson) => {
                  const isCurrent = lesson.id === selectedLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                        isCurrent
                          ? selectedUnitId === "unit1-light"
                            ? "bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-200 shadow-xs"
                            : "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200 shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span
                          className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-md ${
                            isCurrent
                              ? selectedUnitId === "unit1-light"
                                ? "bg-amber-200 text-amber-900"
                                : "bg-emerald-200 text-emerald-900"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          Lesson {lesson.number}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {lesson.pageNumbers}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-black font-kid line-clamp-1 block">
                        {lesson.titleEn}
                      </span>
                      <span className="text-[11px] text-slate-500 font-arabic line-clamp-1 block mt-0.5">
                        {lesson.titleAr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lesson Hero Header Banner */}
            <div
              className={`rounded-3xl p-6 sm:p-7 border-2 shadow-sm relative overflow-hidden ${
                selectedUnitId === "unit1-light"
                  ? "bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 border-amber-300"
                  : "bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-teal-50 border-emerald-300"
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black font-mono ${
                        selectedUnitId === "unit1-light"
                          ? "bg-amber-200 text-amber-900"
                          : "bg-emerald-200 text-emerald-900"
                      }`}
                    >
                      Lesson {currentLesson.number}
                    </span>
                    <button
                      onClick={() => {
                        const firstPage = parseInt(currentLesson.pageNumbers.replace(/\D/g, "").slice(0, 2)) || 14;
                        handleJumpToPage(firstPage);
                      }}
                      className="px-3 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 font-mono shadow-2xs transition flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>Open Book (Pages {currentLesson.pageNumbers})</span>
                    </button>
                  </div>

                  {/* Big bold English Lesson Title */}
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-kid leading-snug">
                    <HighlightText text={currentLesson.titleEn} />
                  </h2>
                  <p className="text-base sm:text-lg font-bold text-amber-900 font-arabic mt-1">
                    {currentLesson.titleAr} ({currentLesson.subtitleAr})
                  </p>
                </div>

                {/* Read Lesson Aloud Button (Natural Voice) */}
                <button
                  onClick={handleReadLessonSummary}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black shadow-md transition transform active:scale-95 ${
                    selectedUnitId === "unit1-light"
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Listen to Summary (استمع للشرح)</span>
                </button>
              </div>
            </div>

            {/* Safety Warning from Textbook */}
            {selectedLessonId === "lesson-1-2-sources" && (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3 text-rose-950 animate-fade-in shadow-xs">
                <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-xs uppercase tracking-wider block text-rose-700 font-kid">
                    Safety Rule from Page 17:
                  </span>
                  <p className="text-base font-black mt-0.5 font-kid">
                    "Never look directly at the Sun! It can damage your eyes."
                  </p>
                  <p className="text-xs text-rose-800 font-arabic mt-0.5 font-semibold">
                    لا تنظر أبداً بشكل مباشر إلى قرص الشمس، فذلك يسبب ضرراً خطيراً بالعينين!
                  </p>
                  <button
                    onClick={() => rewardsManager.recordSafetyRuleConfirmed()}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-cambridge transition active:scale-95 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>I promise to follow this safety rule! (أقر بقاعدة السلامة واكتسب وساماً)</span>
                  </button>
                </div>
              </div>
            )}

            {selectedLessonId === "lesson-2-1-rocks-soil" && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3 text-amber-950 animate-fade-in shadow-xs">
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-xs uppercase tracking-wider block text-amber-800 font-kid">
                    Hygiene & Safety Rule from Page 28:
                  </span>
                  <p className="text-base font-black mt-0.5 font-kid">
                    "Wash your hands after handling soils and rocks."
                  </p>
                  <p className="text-xs text-amber-800 font-arabic mt-0.5 font-semibold">
                    اغسل يديك بالماء والصابون جيداً دائماً بعد لمس عينات الصخور والتربة في التجارب.
                  </p>
                </div>
              </div>
            )}

            {/* Lesson Key Words Ribbon with Bold Colors */}
            {currentLesson.keyWords && currentLesson.keyWords.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5 font-kid">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>Important Key Words:</span>
                  </span>
                  <button
                    onClick={() => setViewMode("visual_atlas")}
                    className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
                  >
                    <span>Open Picture Dictionary</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentLesson.keyWords.map((word) => (
                    <button
                      key={word.id}
                      onClick={() => setSelectedVocab(word)}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-left transition shadow-2xs group flex items-center justify-between"
                    >
                      <div>
                        <span className="font-black font-kid text-sm block">{word.english}</span>
                        <span className="text-xs text-slate-500 font-arabic">{word.arabic}</span>
                      </div>
                      <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* English First Concept Points + Gentle Arabic Helper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. English Concepts First */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5 font-kid">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>Lesson Concepts (English):</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">{currentLesson.pageNumbers}</span>
                </div>
                <div className="space-y-3">
                  {currentLesson.summaryEn.map((text, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2.5 text-sm sm:text-base text-slate-800 font-kid font-bold">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">
                          <HighlightText text={text} />
                        </p>
                      </div>
                      <button
                        onClick={() => audioManager.speak(text, "en")}
                        className="p-1 text-slate-400 hover:text-indigo-600 shrink-0"
                        title="Read sentence in natural voice"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Arabic Clarification Guide */}
              <div className="bg-amber-50/60 rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5 font-arabic">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>الشرح والتوضيح بالعربية:</span>
                  </span>
                  <span className="text-xs font-mono text-amber-800">{currentLesson.pageNumbers}</span>
                </div>
                <div className="space-y-3">
                  {currentLesson.summaryAr.map((text, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-arabic">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed font-semibold">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* DEDICATED INTERACTIVE SIMULATION FOR ACTIVE LESSON */}
            {/* ======================================================== */}
            {selectedLessonId === "lesson-1-1-light-dark" && (
              <InteractiveWordsearch type="light" />
            )}
            {selectedLessonId === "lesson-1-3-reflection" && (
              <InteractiveRaySimulator />
            )}
            {selectedLessonId === "lesson-1-4-darkness" && (
              <DarkBoxSimulator />
            )}
            {selectedLessonId === "lesson-1-5-shadows" && (
              <ShadowDistanceLab />
            )}
            {selectedLessonId === "lesson-2-1-rocks-soil" && (
              <InteractiveWordsearch type="rocks" />
            )}
            {selectedLessonId === "lesson-2-2-earth-layers" && (
              <EarthLayersExplorer />
            )}
            {selectedLessonId === "lesson-2-3-identifying-rocks" && (
              <RockClassifierKey />
            )}
            {selectedLessonId === "lesson-2-4-rock-cycle" && (
              <RockCycleInteractive />
            )}
            {selectedLessonId === "lesson-2-5-fossils-materials" && (
              <BuildingMaterialsSorter />
            )}

            {/* Step-by-Step Solver for Investigations */}
            {currentLesson.experiments && currentLesson.experiments.length > 0 && (
              <div className="space-y-4">
                {currentLesson.experiments.map((exp) => (
                  <StepByStepSolver key={exp.id} experiment={exp} />
                ))}
              </div>
            )}

            {/* Interactive Lesson Quiz Section */}
            {currentLesson.quiz && currentLesson.quiz.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-800">
                    Interactive Lesson Quiz
                  </h3>
                </div>
                <LessonQuiz
                  questions={currentLesson.quiz}
                  lessonTitle={currentLesson.titleEn}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Vocabulary Modal Popup */}
      {selectedVocab && (
        <VocabularyModal
          item={selectedVocab}
          onClose={() => setSelectedVocab(null)}
        />
      )}

      {/* AI Tutor Drawer / Widget */}
      <AITutorWidget
        currentLessonTitle={currentLesson.titleEn + " (" + currentLesson.titleAr + ")"}
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />

      {/* Floating Bottom AI Tutor Action Bar on Mobile */}
      <div className="fixed bottom-4 left-4 z-30 sm:hidden">
        <button
          onClick={() => setIsTutorOpen(true)}
          className="p-3.5 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95"
          aria-label="Ask AI Tutor"
        >
          <Bot className="w-6 h-6 text-amber-300" />
        </button>
      </div>

      {/* Live Audio & Speech Word-by-Word Tracker */}
      <LiveSpeechTracker />

      {/* "Did You Know?" Science Facts Friendly Animated Popup */}
      <DidYouKnowWidget
        currentLessonId={selectedLessonId}
        currentUnitNumber={currentUnit.number}
      />

      {/* Student Profile & Digital Rewards Modal */}
      <AwardsModal
        isOpen={isAwardsOpen}
        onClose={() => setIsAwardsOpen(false)}
        profile={profile}
      />

      {/* Badge Unlocked Celebratory Toast */}
      <BadgeUnlockedToast
        badge={newlyUnlockedBadge}
        onViewAwards={() => {
          setNewlyUnlockedBadge(null);
          setIsAwardsOpen(true);
        }}
        onClose={() => setNewlyUnlockedBadge(null)}
      />
    </div>
  );
}

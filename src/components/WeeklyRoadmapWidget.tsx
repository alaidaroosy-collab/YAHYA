import React, { useState } from "react";
import { WeeklyLessonPlan, RoadmapTask, RoadmapObjective } from "../types/roadmap";
import { weeklyRoadmapData } from "../data/roadmapData";
import { StudentProfile, rewardsManager } from "../utils/rewardsManager";
import { audioManager } from "../utils/audioPlayer";
import { zahraImageManager } from "../utils/zahraImageManager";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  BookOpen,
  Compass,
  Trophy,
  ChevronRight,
  Flame,
  Layers,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Target,
  Volume2,
  Lock,
} from "lucide-react";

interface WeeklyRoadmapWidgetProps {
  profile: StudentProfile;
  onJumpToBookPage: (pageNumber: number) => void;
  onJumpToLesson: (unitId: string, lessonId: string) => void;
  onSwitchView: (view: "book_pages" | "lessons_hub" | "exercises_hub" | "visual_atlas") => void;
  onOpenAwardsModal?: () => void;
}

export const WeeklyRoadmapWidget: React.FC<WeeklyRoadmapWidgetProps> = ({
  profile,
  onJumpToBookPage,
  onJumpToLesson,
  onSwitchView,
  onOpenAwardsModal,
}) => {
  // Default to the active week (Week 3)
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(3);
  const activePlan = weeklyRoadmapData.find((w) => w.weekNumber === selectedWeekNumber) || weeklyRoadmapData[2];

  // Calculate completion percentage for the selected week
  const weekTasks = activePlan.tasks;
  const completedCount = weekTasks.filter((t) => profile.completedTaskIds.includes(t.id)).length;
  const totalCount = weekTasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Overall term progress (all 4 weeks)
  const allTasksCount = weeklyRoadmapData.reduce((acc, w) => acc + w.tasks.length, 0);
  const allCompletedCount = weeklyRoadmapData
    .flatMap((w) => w.tasks)
    .filter((t) => profile.completedTaskIds.includes(t.id)).length;
  const termProgressPercent = Math.round((allCompletedCount / allTasksCount) * 100);

  const handleToggleTask = (task: RoadmapTask) => {
    rewardsManager.toggleRoadmapTask(task.id, 20);
  };

  const handleActionClick = (task: RoadmapTask) => {
    if (task.targetPage) {
      onJumpToBookPage(task.targetPage);
    } else if (task.targetLessonId) {
      onJumpToLesson(activePlan.unitId, task.targetLessonId);
    } else if (task.targetView) {
      onSwitchView(task.targetView);
    }
  };

  const handlePronounce = (text: string) => {
    audioManager.speak(text, "en");
  };

  return (
    <section
      id="weekly-study-roadmap-widget"
      className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6"
    >
      {/* Widget Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black font-cambridge tracking-wide flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cambridge Weekly Study Roadmap</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[11px] font-bold font-arabic">
              الجدول الدراسي والمنهج الأسبوعي
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-mono font-bold border border-amber-200">
              Term Progress: {termProgressPercent}%
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-cambridge tracking-tight flex items-center gap-2 mt-1">
            <span>Grade 3 Science Weekly Roadmap (خطة الدراسة الأسبوعية)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-arabic">
            تتبع تقدم الطالبة زهرة في الدروس والمختبرات أسبوعاً بأسبوع وفق منهج كامبريدج المعتمد.
          </p>
        </div>

        {/* Term Overview Milestone Tracker */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-xs text-sm font-mono">
            {completedCount}/{totalCount}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 font-mono">
              Week {activePlan.weekNumber} Tasks Completed
            </div>
            <div className="text-xs font-black text-slate-900 font-arabic">
              {progressPercent}% من مهام الأسبوع
            </div>
          </div>
        </div>
      </div>

      {/* Week Selector Tabs (Weeks 1, 2, 3, 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {weeklyRoadmapData.map((week) => {
          const isSelected = week.weekNumber === selectedWeekNumber;
          const isActiveWeek = week.status === "in_progress";
          const isCompleted = week.status === "completed";

          return (
            <button
              key={week.weekNumber}
              onClick={() => setSelectedWeekNumber(week.weekNumber)}
              className={`p-3.5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-400"
                  : isActiveWeek
                  ? "bg-emerald-50/70 border-emerald-400 text-emerald-950 hover:bg-emerald-100/60 shadow-2xs"
                  : isCompleted
                  ? "bg-slate-50/80 border-slate-200 text-slate-700 hover:border-slate-300"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 opacity-80"
              }`}
            >
              {/* Top Row: Week Number and Status Pill */}
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-xs font-black font-mono px-2 py-0.5 rounded-md ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : isActiveWeek
                      ? "bg-emerald-200 text-emerald-900 font-bold"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  Week {week.weekNumber}
                </span>

                {isCompleted ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                    <span>Done</span>
                  </span>
                ) : isActiveWeek ? (
                  <span className="flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                    <span>Active 🎯</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <Lock className="w-3 h-3" />
                    <span>Next</span>
                  </span>
                )}
              </div>

              {/* Title & Page range */}
              <div className="mt-1">
                <span className="text-xs sm:text-sm font-black font-cambridge block line-clamp-1">
                  {week.titleEn.split(":")[1]?.trim() || week.titleEn}
                </span>
                <span className="text-[11px] opacity-80 font-arabic block line-clamp-1 mt-0.5">
                  {week.titleAr.split(":")[1]?.trim() || week.titleAr}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  {week.pageRange}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Week Showcase Card */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border-2 transition shadow-sm ${
          activePlan.status === "in_progress"
            ? "bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border-emerald-400 ring-2 ring-emerald-200/60"
            : activePlan.status === "completed"
            ? "bg-gradient-to-br from-slate-50 via-amber-50/30 to-white border-slate-300"
            : "bg-gradient-to-br from-purple-50/40 to-white border-purple-200"
        }`}
      >
        {/* Active Week Ribbon Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {activePlan.status === "in_progress" && (
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black font-mono shadow-xs flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>ACTIVE WEEK IN PROGRESS (الأسبوع الحالي النشط)</span>
                </span>
              )}
              {activePlan.status === "completed" && (
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>COMPLETED OBJECTIVES (أسبوع منجز بالكامل)</span>
                </span>
              )}
              {activePlan.status === "upcoming" && (
                <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-black font-mono flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>UPCOMING WEEK OBJECTIVES (الأسبوع القادم)</span>
                </span>
              )}

              <span className="text-xs font-black text-slate-700 font-mono">
                {activePlan.pageRange}
              </span>
              <span className="text-xs text-slate-500 font-cambridge">
                • {activePlan.unitNameEn}
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-cambridge">
              {activePlan.titleEn}
            </h4>
            <p className="text-sm font-bold text-slate-700 font-arabic mt-0.5">
              {activePlan.titleAr} ({activePlan.unitNameAr})
            </p>
          </div>

          {/* Quick Audio Summary of active week */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePronounce(`${activePlan.titleEn}. ${activePlan.summaryEn}`)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs transition active:scale-95"
              title="Listen to Week Plan Summary"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Listen to Plan (استمع للخطة)</span>
            </button>
          </div>
        </div>

        {/* Week Summary Narrative & Zahra's Reaction Card */}
        <div className="py-3 flex flex-col md:flex-row items-center gap-4 bg-white/70 backdrop-blur-2xs p-4 rounded-2xl border border-slate-200/80 my-2">
          {/* Zahra's Week Character Illustration */}
          {(() => {
            const visual =
              activePlan.weekNumber === 3
                ? {
                    filename: "zahra-reaction-homework.png",
                    titleAr: "زهرة تحل الواجب وتدوّن ملاحظات الصخور مع الثعلب الذكي",
                    companion: "الثعلب الذكي 🦊",
                  }
                : activePlan.status === "completed"
                ? {
                    filename: "zahra-reaction-practice-v2.png",
                    titleAr: "إنجاز ممتاز! تم إكمال جميع أهداف الأسبوع بنجاح",
                    companion: "الثعلب والنجوم ⭐",
                  }
                : {
                    filename: "zahra-reaction-prepare.png",
                    titleAr: "تجهيز كتب العلوم لدروس الأسبوع القادم",
                    companion: "الأرنب الأبيض 🐰",
                  };
            const imgUrl = zahraImageManager.getImageUrl(visual.filename);

            return (
              <div className="flex items-center gap-3 shrink-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-300 relative group">
                  <img
                    src={imgUrl}
                    alt={visual.titleAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/src/assets/images/zahra_avatar_1790017518372.jpg";
                    }}
                  />
                </div>
                <div className="space-y-1 max-w-[210px]">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] font-arabic inline-block">
                    {visual.companion}
                  </span>
                  <p className="text-xs font-black text-slate-900 font-arabic leading-snug">
                    {visual.titleAr}
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-arabic flex-1">
            <p className="font-bold text-slate-900">{activePlan.summaryAr}</p>
            <p className="text-xs text-slate-500 font-cambridge mt-1">{activePlan.summaryEn}</p>
          </div>
        </div>

        {/* 2-Column Grid: Left is Highlighted Objectives, Right is Tasks Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
          {/* Column 1: Highlighted Active Week Objectives */}
          <div className="bg-white/80 backdrop-blur-2xs rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-cambridge">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Active Objectives (الأهداف التعليمية):</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">
                {activePlan.objectives.length} Objectives
              </span>
            </div>

            <div className="space-y-2.5">
              {activePlan.objectives.map((obj, index) => (
                <div
                  key={obj.id}
                  className="p-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/70 transition flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 font-mono">
                    {index + 1}
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 font-arabic leading-snug">
                      {obj.textAr}
                    </p>
                    <p className="text-xs text-slate-600 font-cambridge">
                      {obj.textEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Vocabulary Pills */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Key Science Vocabulary for this Week (المفردات العلمية):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activePlan.keyVocab.map((word) => (
                  <button
                    key={word}
                    onClick={() => handlePronounce(word)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100/70 hover:bg-emerald-200 text-emerald-950 text-xs font-bold font-cambridge flex items-center gap-1 transition"
                  >
                    <span>{word}</span>
                    <Volume2 className="w-3 h-3 text-emerald-700 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Interactive Tasks & Lesson Plan Checklist */}
          <div className="bg-white/80 backdrop-blur-2xs rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-cambridge">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Student Action Items (قائمة المهام الدراسية):</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-600">
                {completedCount} / {totalCount} Done ({progressPercent}%)
              </span>
            </div>

            {/* Task Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Task items list */}
            <div className="space-y-2">
              {activePlan.tasks.map((task) => {
                const isCompleted = profile.completedTaskIds.includes(task.id);

                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                      isCompleted
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    {/* Checkbox & Task Name */}
                    <div
                      className="flex items-start gap-2.5 cursor-pointer flex-1"
                      onClick={() => handleToggleTask(task)}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 focus:outline-hidden"
                        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                        )}
                      </button>

                      <div>
                        <span
                          className={`text-xs sm:text-sm font-bold block ${
                            isCompleted ? "line-through opacity-75 font-arabic" : "font-arabic"
                          }`}
                        >
                          {task.titleAr}
                        </span>
                        <span className="text-xs text-slate-500 font-cambridge block">
                          {task.titleEn}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          ⏱️ ~{task.estimatedMinutes} mins • {task.type.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Direct Launch Shortcut Button */}
                    <button
                      onClick={() => handleActionClick(task)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition active:scale-95 flex items-center gap-1 shrink-0 font-cambridge ${
                        isCompleted
                          ? "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      }`}
                    >
                      <span>{isCompleted ? "Review" : "Start"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Helper Tip */}
            <div className="pt-2 text-[11px] text-slate-500 font-arabic flex items-center justify-between">
              <span>💡 اضغطي على أيقونة المربع لتحديد المهمة كمكتملة واكتساب نقاط XP!</span>
              {onOpenAwardsModal && (
                <button
                  onClick={onOpenAwardsModal}
                  className="text-amber-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>الأوسمة</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

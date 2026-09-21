import React, { useState, useRef } from "react";
import { StudentProfile, LevelInfo, rewardsManager } from "../utils/rewardsManager";
import { audioManager } from "../utils/audioPlayer";
import { curriculumBadges } from "../data/badgesData";
import { ZAHRA_CHARACTER_IMAGES } from "../data/zahraImages";
import { zahraImageManager } from "../utils/zahraImageManager";
import { ZahraCharacterGalleryModal } from "./ZahraCharacterGalleryModal";
import {
  Sparkles,
  Trophy,
  Flame,
  Volume2,
  Camera,
  ChevronRight,
  Star,
  GraduationCap,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

interface StudentWelcomeSectionProps {
  profile: StudentProfile;
  levelInfo: LevelInfo;
  onOpenAwards: () => void;
  onJumpToWeeklyRoadmap?: () => void;
}

export const StudentWelcomeSection: React.FC<StudentWelcomeSectionProps> = ({
  profile,
  levelInfo,
  onOpenAwards,
  onJumpToWeeklyRoadmap,
}) => {
  const [isHoveredAvatar, setIsHoveredAvatar] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentReactionId, setCurrentReactionId] = useState<string>("zahra-prepare-wave");

  // Determine active avatar URL: prioritize active Zahra character image
  const activeZahraImage =
    ZAHRA_CHARACTER_IMAGES.find((img) => img.id === currentReactionId) ||
    ZAHRA_CHARACTER_IMAGES[0];

  const displayAvatarUrl =
    profile.photoUrl &&
    !profile.photoUrl.includes("zahra_avatar_1790017518372.jpg")
      ? profile.photoUrl
      : zahraImageManager.getImageUrl(activeZahraImage.filename);

  // Time-of-day personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        en: `Good morning, ${profile.name}! ☀️`,
        ar: `صباح الخير والنشاط يا ${profile.name === "Zahra" ? "زهرة" : profile.name}! 🌸`,
      };
    } else if (hour < 17) {
      return {
        en: `Good afternoon, ${profile.name}! 🌟`,
        ar: `مساء الهمة والاكتشاف يا ${profile.name === "Zahra" ? "زهرة" : profile.name}! 🔬`,
      };
    } else {
      return {
        en: `Welcome back, ${profile.name}! ✨`,
        ar: `أهلاً ببطلتنا العالمة ${profile.name === "Zahra" ? "زهرة" : profile.name}! 🌙`,
      };
    }
  };

  const greeting = getGreeting();

  const handlePlayGreeting = () => {
    if (isPlayingAudio) {
      audioManager.stop();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    const textToSpeak = `مرحباً بك يا زهرة في منصتك العلمية التفاعلية لمنهج كامبريدج! هيا نواصل رحلة الاكتشاف والتعلم مع صديقيك الأرنب اللطيف والثعلب الذكي!`;
    audioManager.speak(textToSpeak, "ar");
    setTimeout(() => setIsPlayingAudio(false), 5500);
  };

  const handleSelectReaction = (imageId: string) => {
    setCurrentReactionId(imageId);
    const imgObj = ZAHRA_CHARACTER_IMAGES.find((i) => i.id === imageId);
    if (imgObj) {
      const url = zahraImageManager.getImageUrl(imgObj.filename);
      rewardsManager.updateStudentPhoto(url);
      audioManager.playClickSound();
    }
  };

  // Recently unlocked badges preview
  const recentBadges = curriculumBadges
    .filter((b) => profile.unlockedBadgeIds.includes(b.id))
    .slice(0, 4);

  return (
    <section
      id="student-welcome-section"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#002D62] via-[#004B87] to-[#002855] text-white p-5 sm:p-7 shadow-lg border-2 border-amber-300/40 space-y-5"
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        {/* Left Side: Avatar & Personalized Greeting */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          {/* Official Zahra Character Avatar with Click to Open Gallery */}
          <div
            className="relative shrink-0 group cursor-pointer"
            onMouseEnter={() => setIsHoveredAvatar(true)}
            onMouseLeave={() => setIsHoveredAvatar(false)}
            onClick={() => setIsGalleryModalOpen(true)}
            title="Click to view all 7 official Zahra photos & reactions (معرض صور زهرة الرسمية)"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-sky-300 to-emerald-400 shadow-xl ring-4 ring-white/20 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-900 flex items-center justify-center relative">
                <img
                  src={displayAvatarUrl}
                  alt="Zahra Official Illustration"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to placeholder if asset not yet loaded
                    (e.target as HTMLImageElement).src =
                      "/src/assets/images/zahra_avatar_1790017518372.jpg";
                  }}
                />

                {/* Hover Camera icon */}
                <div
                  className={`absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white text-[11px] font-black transition-opacity duration-200 ${
                    isHoveredAvatar ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Camera className="w-6 h-6 text-amber-300 mb-0.5" />
                  <span>معرض الصور (7)</span>
                </div>
              </div>
            </div>

            {/* Level Badge Pip on Avatar corner */}
            <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs font-mono shadow-md border-2 border-slate-900 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-slate-950" />
              <span>Lv.{levelInfo.level}</span>
            </div>
          </div>

          {/* Welcome Text & Cheerful Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-200 text-[11px] font-mono font-bold border border-sky-300/30 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-sky-300" />
                <span>Cambridge Grade 3 Explorer</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[11px] font-bold border border-amber-300/30 font-arabic flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>شخصية زهرة الحقيقية 🌸</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[11px] font-arabic font-bold border border-emerald-400/30 hidden sm:inline-flex items-center gap-1">
                <span>مع الأرنب الأبيض 🐰 والثعلب الذكي 🦊</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-cambridge tracking-wide flex items-center gap-2">
                <span>{greeting.en}</span>
              </h2>
              <button
                onClick={handlePlayGreeting}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 transition active:scale-95 border border-white/10"
                title="Listen to Encouraging Audio (استمع للتحية الصوتية المشجعة)"
                aria-label="Listen to Audio"
              >
                <Volume2
                  className={`w-4 h-4 ${
                    isPlayingAudio ? "text-amber-300 animate-pulse" : "text-sky-300"
                  }`}
                />
              </button>
            </div>

            <p className="text-sm sm:text-base font-bold text-amber-300 font-arabic leading-snug">
              {greeting.ar}
            </p>

            {/* Quick Character Mood Selector Strip */}
            <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-sky-200 font-arabic font-bold ml-1">
                تفاعل شخصية زهرة:
              </span>
              {[
                { id: "zahra-prepare-wave", label: "🎒 تحية الصباح", icon: "🎒" },
                { id: "zahra-learn-read", label: "📖 قراءة الكتاب", icon: "📖" },
                { id: "zahra-learn-idea", label: "💡 فكرة ذكية", icon: "💡" },
                { id: "zahra-homework-write", label: "✍️ حل الواجب", icon: "✍️" },
                { id: "zahra-practice-success", label: "⭐ تميز وإنجاز", icon: "⭐" },
              ].map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleSelectReaction(mood.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-arabic font-bold transition flex items-center gap-1 active:scale-95 ${
                    currentReactionId === mood.id
                      ? "bg-amber-400 text-slate-950 shadow-md font-black ring-2 ring-amber-200"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  }`}
                  title={mood.label}
                >
                  <span>{mood.icon}</span>
                  <span className="hidden sm:inline">{mood.label}</span>
                </button>
              ))}

              <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs font-arabic font-black flex items-center gap-1 shadow-xs ml-1"
                title="Open Zahra Photo Studio"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-200" />
                <span>المعرض (7 صور)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Level Progression, XP & Badges Ribbon */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/10 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-white/15">
          {/* Level & XP Gauge */}
          <div className="space-y-2 min-w-[200px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-amber-300 uppercase tracking-wider font-cambridge">
                {levelInfo.titleEn}
              </span>
              <span className="font-mono text-sky-200 font-bold">
                {profile.totalXp} XP
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-900/60 overflow-hidden p-0.5 border border-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 shadow-sm"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-sky-100 font-arabic">
              <span>{levelInfo.titleAr}</span>
              <span className="font-mono text-amber-300">
                {levelInfo.xpToNextLevel} XP للترقية
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-white/20 hidden sm:block" />

          {/* Quick Badges & Actions */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            {/* Daily Streak */}
            <div className="text-center bg-black/20 p-2.5 rounded-xl border border-white/10 min-w-[70px]">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-sm">
                <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
                <span className="font-mono">{profile.streakDays}</span>
              </div>
              <span className="text-[10px] text-sky-200 font-arabic block mt-0.5">
                أيام حماس
              </span>
            </div>

            {/* Badges Count & Open Awards Trigger */}
            <button
              onClick={onOpenAwards}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-md active:scale-95 font-cambridge"
              title="View All Digital Badges & Trophies"
            >
              <Trophy className="w-4 h-4 text-slate-950" />
              <span>{profile.unlockedBadgeIds.length}/10 Awards</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Cambridge Unit & Roadmap Quick Trigger Ribbon */}
      <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-sky-200">Current Unit:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-cambridge font-bold">
            Unit 2: Earth & Its Rocks (الأرض وصخورها)
          </span>
          <span className="text-sky-300/80">• Stage 3 Curriculum</span>
        </div>

        {onJumpToWeeklyRoadmap && (
          <button
            onClick={onJumpToWeeklyRoadmap}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition hover:underline font-arabic text-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>عرض خطة الأسبوع والمهام الدراسية (Weekly Plan)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Mini Badges Showcase Carousel */}
      <div className="bg-slate-900/40 rounded-2xl p-3 border border-white/10 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-amber-300 font-cambridge uppercase tracking-wider">
            Zahra's Top Badges:
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {recentBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white shrink-0 shadow-2xs"
            >
              <span className="text-base">{badge.icon}</span>
              <span className="font-cambridge font-bold">{badge.titleEn}</span>
              <span className="text-[10px] text-amber-300 font-mono">+{badge.xpReward} XP</span>
            </div>
          ))}
        </div>

        <button
          onClick={onOpenAwards}
          className="text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl shrink-0 transition font-cambridge flex items-center gap-1"
        >
          <Trophy className="w-3.5 h-3.5 text-slate-900" />
          <span>All Awards</span>
        </button>
      </div>

      {/* Official Zahra Character Gallery Modal */}
      <ZahraCharacterGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSelectAsPrimaryAvatar={(url) => {
          rewardsManager.updateStudentPhoto(url);
        }}
      />
    </section>
  );
};

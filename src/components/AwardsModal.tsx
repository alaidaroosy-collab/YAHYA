import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "../data/badgesData";
import { rewardsManager, StudentProfile } from "../utils/rewardsManager";
import { audioManager } from "../utils/audioPlayer";
import { ZAHRA_CHARACTER_IMAGES, ZahraCharacterImage } from "../data/zahraImages";
import { zahraImageManager } from "../utils/zahraImageManager";
import {
  Trophy,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  X,
  Star,
  Sun,
  Globe,
  ShieldAlert,
  Eye,
  Check,
  Zap,
  Lightbulb,
  Edit2,
  Volume2,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

const AVATAR_OPTIONS = ["🔬", "🚀", "🦉", "🦖", "🌟", "⚡", "💎", "🌋"];

export const AwardsModal: React.FC<Props> = ({ isOpen, onClose, profile }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(profile.name);
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<
    (Badge & { isUnlocked: boolean }) | null
  >(null);

  const badgesWithStatus = rewardsManager.getBadgesWithStatus();

  const unlockedCount = badgesWithStatus.filter((b) => b.isUnlocked).length;
  const totalBadges = badgesWithStatus.length;
  const completionPercent = Math.round((unlockedCount / totalBadges) * 100);

  const filteredBadges = badgesWithStatus.filter((badge) => {
    if (selectedCategory === "all") return true;
    return badge.category === selectedCategory;
  });

  const handleSaveName = () => {
    rewardsManager.updateStudentInfo(nameInput, profile.avatar);
    setIsEditingName(false);
  };

  const handleSelectAvatar = (av: string) => {
    rewardsManager.updateStudentInfo(profile.name, av);
    audioManager.playClickSound();
  };

  const handleBadgeClick = (badge: Badge & { isUnlocked: boolean }) => {
    setSelectedBadgeDetail(badge);
    if (badge.isUnlocked) {
      audioManager.playSuccessSound();
      audioManager.speak(`${badge.titleEn}. ${badge.descriptionEn}`, "en");
    } else {
      audioManager.playClickSound();
      audioManager.speak(`Locked badge: ${badge.titleEn}. ${badge.descriptionEn}`, "en");
    }
  };

  // Helper icon renderer
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Sun":
        return <Sun className="w-6 h-6 text-amber-300" />;
      case "Globe":
        return <Globe className="w-6 h-6 text-emerald-300" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-6 h-6 text-rose-300" />;
      case "Eye":
        return <Eye className="w-6 h-6 text-indigo-300" />;
      case "Trophy":
        return <Trophy className="w-6 h-6 text-yellow-300" />;
      case "CheckCircle2":
        return <CheckCircle2 className="w-6 h-6 text-cyan-300" />;
      case "Lightbulb":
        return <Lightbulb className="w-6 h-6 text-fuchsia-300" />;
      case "Zap":
        return <Zap className="w-6 h-6 text-amber-300" />;
      case "Award":
        return <Award className="w-6 h-6 text-purple-300" />;
      default:
        return <Sparkles className="w-6 h-6 text-sky-300" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border-2 border-slate-200"
      >
        {/* Modal Top Header with Student Profile Ribbon */}
        <div className="bg-gradient-to-r from-[#002D62] via-[#003B7E] to-[#001E44] text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between pb-4 border-b border-blue-800/60 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-lg font-black">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black font-cambridge tracking-wide flex items-center gap-2">
                  <span>Student Profile & Awards</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">
                    Stage 3
                  </span>
                </h2>
                <p className="text-xs text-blue-200 font-arabic">
                  ملف إنجاز الطالب والأوسمة الرقمية لمنهج العلوم
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/20"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card: Avatar + Name + XP & Badge Stats */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              {/* Avatar Picker */}
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-sky-400 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-3xl overflow-hidden">
                    {profile.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      profile.avatar
                    )}
                  </div>
                </div>
              </div>

              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="bg-white/20 border border-white/40 text-white rounded-lg px-2.5 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-300"
                      maxLength={25}
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-3 py-1 rounded-lg bg-amber-400 text-slate-900 text-xs font-black"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black font-cambridge text-white">
                      {profile.name}
                    </h3>
                    <button
                      onClick={() => {
                        setNameInput(profile.name);
                        setIsEditingName(true);
                      }}
                      className="text-white/60 hover:text-white p-1"
                      title="Edit Name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className="text-xs text-sky-300 font-cambridge font-bold block">
                  Cambridge Primary Science Learner
                </span>
                {/* Avatar Quick Switcher */}
                <div className="flex items-center gap-1 mt-1.5">
                  {AVATAR_OPTIONS.slice(0, 5).map((av) => (
                    <button
                      key={av}
                      onClick={() => handleSelectAvatar(av)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition ${
                        profile.avatar === av
                          ? "bg-white/30 ring-1 ring-amber-300 scale-110"
                          : "hover:bg-white/10 opacity-70"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total XP & Progress Box */}
            <div className="w-full sm:w-auto bg-black/30 rounded-2xl p-3 border border-white/10 flex items-center justify-between sm:justify-start gap-4">
              <div className="text-center sm:text-right">
                <span className="text-[10px] uppercase tracking-wider text-blue-200 block font-cambridge font-bold">
                  Total Experience
                </span>
                <span className="text-lg font-black font-mono text-amber-300 flex items-center gap-1 justify-center sm:justify-end">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{profile.totalXp} XP</span>
                </span>
              </div>

              <div className="h-8 w-px bg-white/20" />

              <div>
                <span className="text-[10px] uppercase tracking-wider text-blue-200 block font-cambridge font-bold">
                  Badges Earned
                </span>
                <span className="text-lg font-black font-mono text-emerald-300">
                  {unlockedCount} / {totalBadges} ({completionPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Curriculum Badge Progress Bar */}
          <div className="mt-4 pt-3 border-t border-blue-800/40 relative z-10">
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5">
            {[
              { id: "all", labelEn: "All Badges", labelAr: "الكل" },
              { id: "zahra_album", labelEn: "🌸 Zahra's Photos (7)", labelAr: "ألبوم صور زهرة الرسمية" },
              { id: "mastery", labelEn: "Unit Mastery", labelAr: "الوحدات" },
              { id: "investigation", labelEn: "Investigations", labelAr: "التجارب" },
              { id: "quiz", labelEn: "Quizzes", labelAr: "الاختبارات" },
              { id: "reading", labelEn: "Reading & Facts", labelAr: "القراءة" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-cambridge transition shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-[#002D62] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                }`}
              >
                <span>{cat.labelEn}</span>
                <span className="ml-1 text-[10px] opacity-75 font-arabic">({cat.labelAr})</span>
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Showing {filteredBadges.length} Badges
          </span>
        </div>

        {/* Badges or Zahra Photos Grid View */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[50vh] space-y-4">
          {selectedCategory === "zahra_album" ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-amber-950 font-arabic">
                    الصور الرسمية المعتمدة لزهرة (7 شخصيات تفاعلية)
                  </h4>
                  <p className="text-xs text-amber-800 font-arabic mt-0.5">
                    جميع شخصيات زهرة الحقيقية مع صديقيها الأرنب الأبيض اللطيف 🐰 والثعلب الذكي 🦊
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {ZAHRA_CHARACTER_IMAGES.map((img) => {
                  const url = zahraImageManager.getImageUrl(img.filename);
                  const isCurrent = profile.photoUrl === url;

                  return (
                    <div
                      key={img.id}
                      className={`p-3.5 rounded-2xl border-2 transition flex flex-col justify-between ${
                        isCurrent
                          ? "bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-300"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-900 relative group">
                          <img
                            src={url}
                            alt={img.titleEn}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/src/assets/images/zahra_avatar_1790017518372.jpg";
                            }}
                          />
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-[10px] font-black font-arabic shadow-xs">
                              {img.companionAr}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 font-cambridge leading-snug">
                            {img.titleEn}
                          </h4>
                          <p className="text-xs font-bold text-slate-700 font-arabic mt-0.5">
                            {img.titleAr}
                          </p>
                          <p className="text-[11px] text-slate-500 font-arabic line-clamp-2 mt-1">
                            {img.roleDescriptionAr}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            rewardsManager.updateStudentPhoto(url);
                            audioManager.playSuccessSound();
                          }}
                          className={`w-full py-1.5 px-2 rounded-xl text-xs font-black font-arabic transition flex items-center justify-center gap-1.5 ${
                            isCurrent
                              ? "bg-emerald-500 text-white"
                              : "bg-amber-400 hover:bg-amber-500 text-slate-950 active:scale-95"
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{isCurrent ? "الصورة الرمزية الحالية ✓" : "تعيين كصورة رمزية"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredBadges.map((badge) => {
                const isUnlocked = badge.isUnlocked;

                return (
                  <button
                    key={badge.id}
                    onClick={() => handleBadgeClick(badge)}
                    className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between relative overflow-hidden group ${
                      isUnlocked
                        ? "bg-white border-slate-300 hover:border-amber-400 shadow-xs hover:shadow-md"
                        : "bg-slate-50/80 border-slate-200 opacity-60 hover:opacity-80"
                    }`}
                  >
                    {/* Glowing background header on unlocked */}
                    {isUnlocked && (
                      <div
                        className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${badge.colorGradient}`}
                      />
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br ${
                            isUnlocked ? badge.colorGradient : "from-slate-300 to-slate-400"
                          }`}
                        >
                          {renderBadgeIcon(badge.icon)}
                        </div>

                        {isUnlocked ? (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-cambridge">
                            <Check className="w-3 h-3" />
                            <span>Unlocked</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-cambridge">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>

                      <h4 className="font-kid font-bold text-slate-900 text-sm group-hover:text-[#002D62] transition leading-snug">
                        {badge.titleEn}
                      </h4>
                      <p className="text-xs text-slate-500 font-arabic font-semibold">
                        {badge.titleAr}
                      </p>

                      <p className="text-xs text-slate-600 font-kid mt-2 line-clamp-2 leading-relaxed">
                        {badge.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-mono font-black text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>+{badge.xpValue} XP</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-arabic">
                        {isUnlocked ? "مكتسب 🎉" : "تحدٍ جديد 🔒"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Badge Detail Modal Drawer */}
        {selectedBadgeDetail && (
          <div className="p-4 bg-amber-50 border-t border-amber-200 flex items-center justify-between gap-4 flex-wrap shrink-0 animate-fade-in">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-gradient-to-br ${
                  selectedBadgeDetail.isUnlocked
                    ? selectedBadgeDetail.colorGradient
                    : "from-slate-400 to-slate-500"
                }`}
              >
                {renderBadgeIcon(selectedBadgeDetail.icon)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-kid font-bold text-slate-900 text-sm">
                    {selectedBadgeDetail.titleEn}
                  </span>
                  <span className="text-xs text-amber-900 font-arabic font-bold">
                    ({selectedBadgeDetail.titleAr})
                  </span>
                  <span className="px-2 py-0.2 rounded-md bg-amber-200 text-amber-900 text-[10px] font-mono font-bold">
                    +{selectedBadgeDetail.xpValue} XP
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-kid">
                  {selectedBadgeDetail.descriptionEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  audioManager.speak(
                    `${selectedBadgeDetail.titleEn}. ${selectedBadgeDetail.descriptionEn}`,
                    "en"
                  )
                }
                className="p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 transition flex items-center gap-1.5 text-xs font-bold font-cambridge"
                title="Read aloud"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Listen</span>
              </button>

              <button
                onClick={() => setSelectedBadgeDetail(null)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

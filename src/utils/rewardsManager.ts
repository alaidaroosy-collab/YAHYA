import { curriculumBadges, Badge } from "../data/badgesData";
import { audioManager } from "./audioPlayer";
import confetti from "canvas-confetti";

export interface StudentProfile {
  name: string;
  avatar: string; // Emoji character or key
  photoUrl?: string; // Optional image URL or base64
  totalXp: number;
  unlockedBadgeIds: string[];
  factsReadCount: number;
  quizzesCompletedCount: number;
  investigationsCompletedCount: number;
  perfectQuizzesCount: number;
  pagesExploredCount: number;
  streakDays: number;
  completedTaskIds: string[];
}

export type RewardsListener = (profile: StudentProfile, newlyUnlockedBadge?: Badge) => void;

const STORAGE_KEY = "cambridge_primary_rewards_v2";

const DEFAULT_PROFILE: StudentProfile = {
  name: "Zahra",
  avatar: "👩‍🔬",
  photoUrl: "/src/assets/images/zahra_avatar_1790017518372.jpg",
  totalXp: 275,
  unlockedBadgeIds: ["young_scientist", "solar_safety_champion", "light_master", "shadow_detective"],
  factsReadCount: 4,
  quizzesCompletedCount: 2,
  investigationsCompletedCount: 3,
  perfectQuizzesCount: 1,
  pagesExploredCount: 18,
  streakDays: 3,
  completedTaskIds: [
    "w1-task-1",
    "w1-task-2",
    "w1-task-3",
    "w2-task-1",
    "w2-task-2",
    "w2-task-3",
    "w3-task-1",
    "w3-task-2",
  ],
};

export interface LevelInfo {
  level: number;
  titleEn: string;
  titleAr: string;
  badgeTitleEn: string;
  badgeTitleAr: string;
  currentXp: number;
  minXp: number;
  maxXp: number;
  progressPercent: number;
  xpToNextLevel: number;
}

class RewardsManager {
  private profile: StudentProfile;
  private listeners: RewardsListener[] = [];
  public newlyUnlockedModalBadge: Badge | null = null;

  constructor() {
    this.profile = this.loadProfile();
  }

  private loadProfile(): StudentProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const resolvedName = (!parsed.name || parsed.name === "Young Scientist") ? "Zahra" : parsed.name;
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          name: resolvedName,
          photoUrl: parsed.photoUrl || DEFAULT_PROFILE.photoUrl,
          unlockedBadgeIds: Array.isArray(parsed.unlockedBadgeIds)
            ? Array.from(new Set([...parsed.unlockedBadgeIds, "young_scientist"]))
            : DEFAULT_PROFILE.unlockedBadgeIds,
          completedTaskIds: Array.isArray(parsed.completedTaskIds)
            ? parsed.completedTaskIds
            : DEFAULT_PROFILE.completedTaskIds,
        };
      }
    } catch {
      // ignore
    }
    return { ...DEFAULT_PROFILE };
  }

  private saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch {
      // ignore
    }
  }

  public getProfile(): StudentProfile {
    return { ...this.profile };
  }

  public getLevelInfo(): LevelInfo {
    const xp = this.profile.totalXp;
    if (xp < 150) {
      return {
        level: 1,
        titleEn: "Apprentice Science Explorer",
        titleAr: "مستكشف العلوم المبتدئ",
        badgeTitleEn: "Curious Observer",
        badgeTitleAr: "الملاحظ الفضولي",
        currentXp: xp,
        minXp: 0,
        maxXp: 150,
        progressPercent: Math.min(100, Math.round((xp / 150) * 100)),
        xpToNextLevel: 150 - xp,
      };
    } else if (xp < 350) {
      return {
        level: 2,
        titleEn: "Junior Science Explorer",
        titleAr: "مستكشف العلوم الصاعد",
        badgeTitleEn: "Science Explorer",
        badgeTitleAr: "مستكشف العلوم المتميز",
        currentXp: xp,
        minXp: 150,
        maxXp: 350,
        progressPercent: Math.min(100, Math.round(((xp - 150) / 200) * 100)),
        xpToNextLevel: 350 - xp,
      };
    } else if (xp < 600) {
      return {
        level: 3,
        titleEn: "Master Lab Investigator",
        titleAr: "باحث المختبر المتألق",
        badgeTitleEn: "Lead Investigator",
        badgeTitleAr: "كبير الباحثين",
        currentXp: xp,
        minXp: 350,
        maxXp: 600,
        progressPercent: Math.min(100, Math.round(((xp - 350) / 250) * 100)),
        xpToNextLevel: 600 - xp,
      };
    } else {
      return {
        level: 4,
        titleEn: "Cambridge Science Champion",
        titleAr: "بطل علوم كامبريدج",
        badgeTitleEn: "Grand Scholar",
        badgeTitleAr: "العالم الصغير العبقري",
        currentXp: xp,
        minXp: 600,
        maxXp: 1000,
        progressPercent: Math.min(100, Math.round(((xp - 600) / 400) * 100)),
        xpToNextLevel: Math.max(0, 1000 - xp),
      };
    }
  }

  public toggleRoadmapTask(taskId: string, xpValue: number = 20): boolean {
    const isCurrentlyDone = this.profile.completedTaskIds.includes(taskId);
    if (isCurrentlyDone) {
      this.profile.completedTaskIds = this.profile.completedTaskIds.filter((id) => id !== taskId);
      this.profile.totalXp = Math.max(0, this.profile.totalXp - xpValue);
      this.notify();
      return false;
    } else {
      this.profile.completedTaskIds.push(taskId);
      this.profile.totalXp += xpValue;
      audioManager.playSuccessSound();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#10B981", "#3B82F6", "#F59E0B"],
        });
      } catch {
        // ignore
      }
      this.notify();
      return true;
    }
  }

  public isTaskCompleted(taskId: string): boolean {
    return this.profile.completedTaskIds.includes(taskId);
  }

  public updateStudentPhoto(photoUrl: string) {
    this.profile.photoUrl = photoUrl;
    this.notify();
  }

  public getBadgesWithStatus(): Array<Badge & { isUnlocked: boolean }> {
    return curriculumBadges.map((badge) => ({
      ...badge,
      isUnlocked: this.profile.unlockedBadgeIds.includes(badge.id),
    }));
  }

  public subscribe(listener: RewardsListener): () => void {
    this.listeners.push(listener);
    listener(this.getProfile());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(newlyUnlockedBadge?: Badge) {
    this.saveProfile();
    this.listeners.forEach((l) => l(this.getProfile(), newlyUnlockedBadge));
  }

  public unlockBadge(badgeId: string): boolean {
    if (this.profile.unlockedBadgeIds.includes(badgeId)) {
      return false;
    }

    const badge = curriculumBadges.find((b) => b.id === badgeId);
    if (!badge) return false;

    this.profile.unlockedBadgeIds.push(badgeId);
    this.profile.totalXp += badge.xpValue;

    // Trigger celebration effects
    this.newlyUnlockedModalBadge = badge;
    audioManager.playSuccessSound();

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#00A3E0", "#FFB81C", "#00875A", "#7C3AED", "#FF5C35"],
      });
    } catch {
      // ignore
    }

    this.notify(badge);
    return true;
  }

  public updateStudentInfo(name: string, avatar: string) {
    this.profile.name = name.trim() || "Young Scientist";
    this.profile.avatar = avatar;
    this.notify();
  }

  // Quiz completion hook
  public recordQuizCompletion(score: number, totalQuestions: number, unitNumber?: number) {
    this.profile.quizzesCompletedCount += 1;
    this.profile.totalXp += 20;

    if (score === totalQuestions) {
      this.profile.perfectQuizzesCount += 1;
      this.unlockBadge("quiz_ace");
    }

    if (unitNumber === 1 || this.profile.quizzesCompletedCount >= 2) {
      this.unlockBadge("light_master");
    }

    this.notify();
  }

  // Step-by-step investigation completion hook
  public recordInvestigationCompletion(experimentId: string) {
    this.profile.investigationsCompletedCount += 1;
    this.profile.totalXp += 25;
    this.unlockBadge("hands_on_investigator");

    if (
      experimentId.includes("rock") ||
      experimentId.includes("soil") ||
      experimentId.includes("layer")
    ) {
      this.unlockBadge("rock_explorer");
    }

    if (experimentId.includes("shadow") || experimentId.includes("light")) {
      this.unlockBadge("shadow_detective");
    }

    this.notify();
  }

  // Fact exploration hook
  public recordFactRead() {
    this.profile.factsReadCount += 1;
    this.profile.totalXp += 5;
    if (this.profile.factsReadCount >= 3) {
      this.unlockBadge("curious_mind");
    }
    this.notify();
  }

  // Book pages explored hook
  public recordPageExplored(pageCount: number) {
    this.profile.pagesExploredCount = Math.max(this.profile.pagesExploredCount, pageCount);
    if (pageCount >= 3) {
      this.unlockBadge("young_scientist");
    }
    if (pageCount >= 10) {
      this.unlockBadge("cambridge_scholar");
    }
    this.notify();
  }

  // Safety rule confirmation hook
  public recordSafetyRuleConfirmed() {
    this.unlockBadge("solar_safety_champion");
  }

  public clearNewlyUnlockedBadge() {
    this.newlyUnlockedModalBadge = null;
  }
}

export const rewardsManager = new RewardsManager();

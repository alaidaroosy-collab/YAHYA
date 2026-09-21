export type WeekStatus = "completed" | "in_progress" | "upcoming";

export interface RoadmapObjective {
  id: string;
  textEn: string;
  textAr: string;
  isKeyObjective?: boolean;
}

export interface RoadmapTask {
  id: string;
  titleEn: string;
  titleAr: string;
  type: "reading" | "lab" | "quiz" | "exercise";
  targetPage?: number;
  targetLessonId?: string;
  targetView?: "book_pages" | "lessons_hub" | "exercises_hub" | "visual_atlas";
  estimatedMinutes?: number;
  isDoneDefault?: boolean;
}

export interface WeeklyLessonPlan {
  weekNumber: number;
  titleEn: string;
  titleAr: string;
  dateRangeEn: string;
  dateRangeAr: string;
  unitId: string;
  unitNameEn: string;
  unitNameAr: string;
  pageRange: string;
  status: WeekStatus;
  badgeRewardId: string;
  summaryEn: string;
  summaryAr: string;
  objectives: RoadmapObjective[];
  tasks: RoadmapTask[];
  keyVocab: string[];
  theme: {
    primaryColor: string;
    bgLight: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
  };
}

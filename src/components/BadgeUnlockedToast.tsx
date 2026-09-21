import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "../data/badgesData";
import { Trophy, Star, Sparkles, X, ChevronRight } from "lucide-react";

interface Props {
  badge: Badge | null;
  onViewAwards: () => void;
  onClose: () => void;
}

export const BadgeUnlockedToast: React.FC<Props> = ({
  badge,
  onViewAwards,
  onClose,
}) => {
  if (!badge) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100vw-2rem)]">
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 rounded-3xl shadow-2xl border-2 border-white/60 flex items-center justify-between gap-3 overflow-hidden relative"
        >
          {/* Confetti sparkle shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-2xl shadow-md shrink-0">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-100 font-cambridge bg-black/20 px-2 py-0.5 rounded-full">
                  Badge Unlocked! (وسام جديد)
                </span>
                <span className="text-[10px] font-mono font-black text-white bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-200 text-amber-200" />
                  <span>+{badge.xpValue} XP</span>
                </span>
              </div>

              <h4 className="font-kid font-bold text-white text-base leading-tight mt-0.5">
                {badge.titleEn}
              </h4>
              <p className="text-xs text-amber-100 font-arabic font-semibold">
                {badge.titleAr}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 relative z-10 shrink-0">
            <button
              onClick={onViewAwards}
              className="px-3 py-2 rounded-xl bg-white text-slate-900 hover:bg-amber-100 text-xs font-black font-cambridge shadow-md flex items-center gap-1 transition active:scale-95"
            >
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white/80 hover:text-white transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

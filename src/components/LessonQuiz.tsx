import React, { useState } from "react";
import { QuizQuestion } from "../types/curriculum";
import { audioManager } from "../utils/audioPlayer";
import { rewardsManager } from "../utils/rewardsManager";
import {
  HelpCircle,
  Volume2,
  CheckCircle,
  XCircle,
  Sparkles,
  RotateCcw,
  ChevronRight,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  questions: QuizQuestion[];
  lessonTitle: string;
}

export const LessonQuiz: React.FC<Props> = ({ questions, lessonTitle }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [wrongQuestionIndices, setWrongQuestionIndices] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [reviewIndices, setReviewIndices] = useState<number[]>([]);

  // Active question set
  const activeList = isReviewMode
    ? reviewIndices.map((idx) => ({ q: questions[idx], originalIdx: idx }))
    : questions.map((q, idx) => ({ q, originalIdx: idx }));

  const currentItem = activeList[currentIndex];
  const currentQ = currentItem ? currentItem.q : null;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered || !currentQ) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === currentQ.correctOptionId;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      audioManager.playSuccessSound();
      audioManager.speak("Correct! " + currentQ.explanationEn, "en");
    } else {
      audioManager.playErrorSound();
      audioManager.speak("Let's review: " + currentQ.explanationEn, "en");
      if (!isReviewMode) {
        setWrongQuestionIndices((prev) => [...prev, currentItem.originalIdx]);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < activeList.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      setIsCompleted(true);
      rewardsManager.recordQuizCompletion(score, activeList.length);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRestartFull = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setWrongQuestionIndices([]);
    setIsCompleted(false);
    setIsReviewMode(false);
  };

  const handleStartReview = () => {
    setReviewIndices(wrongQuestionIndices);
    setIsReviewMode(true);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const finalPct = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-sm text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Trophy className="w-10 h-10 text-amber-600 animate-bounce" />
        </div>

        <div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
            تم إنهاء الاختبار بنجاح!
          </span>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            نتيجة اختبار: {lessonTitle}
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            حصلت على {score} من أصل {questions.length} أسئلة ({finalPct}%)
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          {wrongQuestionIndices.length > 0 && (
            <button
              onClick={handleStartReview}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة التدريب على الأسئلة الخاطئة ({wrongQuestionIndices.length})</span>
            </button>
          )}

          <button
            onClick={handleRestartFull}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition"
          >
            إعادة الاختبار كاملاً
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-sm space-y-5">
      {/* Quiz Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-full">
            السؤال {currentIndex + 1} من {activeList.length}
          </span>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {currentQ.pageRef}
          </span>
        </div>

        <button
          onClick={() => audioManager.speak(currentQ.questionEn, "en")}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition"
          aria-label="قراءة السؤال صوتياً"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع للسؤال</span>
        </button>
      </div>

      {/* Question text */}
      <div className="space-y-1">
        <h4 className="text-lg font-bold text-slate-900 leading-relaxed">
          {currentQ.questionAr}
        </h4>
        <p className="text-xs text-slate-500 font-kid">{currentQ.questionEn}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrect = opt.id === currentQ.correctOptionId;

          let btnStyle = "bg-white border-slate-200 hover:border-indigo-300 text-slate-800";
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200";
            } else if (isSelected) {
              btnStyle = "bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200";
            } else {
              btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={opt.id}
              disabled={isAnswered}
              onClick={() => handleSelectOption(opt.id)}
              className={`w-full p-3.5 rounded-xl border-2 text-right transition flex items-center justify-between ${btnStyle}`}
            >
              <div>
                <span className="text-sm font-semibold block">{opt.textAr}</span>
                <span className="text-xs text-slate-500 font-kid block">{opt.textEn}</span>
              </div>

              {isAnswered && isCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mr-2" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mr-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Educational Explanation */}
      {isAnswered && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-fade-in space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>توضيح الإجابة من الكتاب المنهجي:</span>
            </span>
            <button
              onClick={() => audioManager.speak(currentQ.explanationEn, "en")}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>نطق التوضيح</span>
            </button>
          </div>

          <p className="text-xs text-slate-800 font-semibold">{currentQ.explanationAr}</p>
          <p className="text-[11px] text-slate-500 font-kid">{currentQ.explanationEn}</p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow flex items-center gap-1.5"
            >
              <span>{currentIndex + 1 < activeList.length ? "السؤال التالي" : "عرض النتيجة"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

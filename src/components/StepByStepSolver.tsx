import React, { useState } from "react";
import { StepByStepExperiment } from "../types/curriculum";
import { audioManager } from "../utils/audioPlayer";
import { rewardsManager } from "../utils/rewardsManager";
import {
  HelpCircle,
  ClipboardList,
  Cpu,
  CheckCircle2,
  Volume2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface Props {
  experiment: StepByStepExperiment;
}

export const StepByStepSolver: React.FC<Props> = ({ experiment }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const totalSteps = experiment.steps.length;

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (nextIdx < totalSteps) {
        audioManager.speak(experiment.steps[nextIdx].textEn, "en");
      } else {
        audioManager.playSuccessSound();
        audioManager.speak(experiment.finalAnswer.en, "en");
        rewardsManager.recordInvestigationCompletion(experiment.id);
      }
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-indigo-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold font-mono">
              {experiment.pageRef}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              حل المنهج خطوة بخطوة
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mt-1">
            {experiment.titleAr}
          </h3>
          <p className="text-sm text-slate-500 font-kid">{experiment.titleEn}</p>
        </div>

        <button
          onClick={() =>
            audioManager.speak(
              `${experiment.question.en}. Step by step scientific investigation.`,
              "en"
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-semibold transition"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع للسؤال</span>
        </button>
      </div>

      {/* Methodology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. السؤال */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-1">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>١. السؤال (Question)</span>
          </div>
          <p className="text-sm text-slate-800 font-semibold">{experiment.question.ar}</p>
          <p className="text-xs text-slate-500 mt-1 font-kid">{experiment.question.en}</p>
        </div>

        {/* 2. المطلوب */}
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
          <div className="flex items-center gap-2 text-purple-800 font-bold text-sm mb-1">
            <ClipboardList className="w-4 h-4 text-purple-600" />
            <span>٢. المطلوب (Requirement)</span>
          </div>
          <p className="text-sm text-slate-800 font-semibold">{experiment.requirement.ar}</p>
          <p className="text-xs text-slate-500 mt-1 font-kid">{experiment.requirement.en}</p>
        </div>

        {/* 3. العملية */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>٣. العملية العلمية (Operation)</span>
          </div>
          <p className="text-sm text-slate-800 font-semibold">{experiment.operation.ar}</p>
          <p className="text-xs text-slate-500 mt-1 font-kid">{experiment.operation.en}</p>
        </div>
      </div>

      {/* 4. تنفيذ التجربة تدريجياً */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span>٤. تنفيذ التجربة والخطوات تدريجياً (Step-by-step Execution)</span>
          </h4>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
            الخطوة {Math.min(currentStepIndex + 1, totalSteps)} من {totalSteps}
          </span>
        </div>

        <div className="space-y-3">
          {experiment.steps.map((step, idx) => {
            const isRevealed = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.stepNumber}
                className={`p-4 rounded-xl border transition-all ${
                  isRevealed
                    ? isCurrent
                      ? "bg-white border-indigo-400 shadow-md ring-2 ring-indigo-200"
                      : "bg-white/80 border-slate-200 opacity-90"
                    : "bg-slate-100/60 border-slate-200/60 opacity-40 blur-[0.5px]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isRevealed ? "bg-indigo-600 text-white" : "bg-slate-300 text-slate-600"
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{step.textAr}</p>
                      <p className="text-xs text-slate-600 mt-0.5 font-kid">{step.textEn}</p>

                      {step.highlightValue && (
                        <div className="mt-2 inline-block px-3 py-1 bg-amber-100 border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-900">
                          {step.highlightValue}
                        </div>
                      )}

                      {step.tipAr && (
                        <p className="mt-1.5 text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200 font-semibold">
                          ⚠️ {step.tipAr}
                        </p>
                      )}
                    </div>
                  </div>

                  {isRevealed && (
                    <button
                      onClick={() => audioManager.speak(step.textEn, "en")}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                      title="استمع للخطوة بالإنجليزية"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Step Controls */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة التجربة من البداية</span>
          </button>

          {currentStepIndex < totalSteps - 1 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition"
            >
              <span>الانتقال للخطوة التالية</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : currentStepIndex === totalSteps - 1 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>عرض الإجابة النهائية والتحقق</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              تم إكمال جميع الخطوات بنجاح ✓
            </span>
          )}
        </div>
      </div>

      {/* 5. الإجابة النهائية & 6. التحقق */}
      {currentStepIndex >= totalSteps && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {/* الإجابة النهائية */}
          <div className="p-5 rounded-xl bg-emerald-50 border-2 border-emerald-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-900 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ٥. الإجابة النهائية (Final Answer)
              </span>
              <button
                onClick={() => audioManager.speak(experiment.finalAnswer.en, "en")}
                className="text-emerald-700 hover:text-emerald-900 p-1"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-bold text-emerald-950">{experiment.finalAnswer.ar}</p>
            <p className="text-xs text-emerald-800 mt-1 font-kid">{experiment.finalAnswer.en}</p>
          </div>

          {/* التحقق من الإجابة */}
          <div className="p-5 rounded-xl bg-amber-50 border-2 border-amber-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-900 font-bold text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                ٦. التحقق من الإجابة (Verification)
              </span>
              <button
                onClick={() => audioManager.speak(experiment.verification.en, "en")}
                className="text-amber-700 hover:text-amber-900 p-1"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-bold text-amber-950">{experiment.verification.ar}</p>
            <p className="text-xs text-amber-800 mt-1 font-kid">{experiment.verification.en}</p>
          </div>
        </div>
      )}
    </div>
  );
};

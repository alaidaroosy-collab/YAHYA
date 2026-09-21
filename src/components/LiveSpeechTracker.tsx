import React, { useEffect, useState } from "react";
import { audioManager, AudioPlayState } from "../utils/audioPlayer";
import { Volume2, RotateCcw, Square, Sparkles, Sliders, ChevronDown, ChevronUp } from "lucide-react";

export const LiveSpeechTracker: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioPlayState>(audioManager.getState());
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setAudioState({ ...state });
    });
    return unsubscribe;
  }, []);

  if (!audioState.isPlaying && !audioState.text) {
    return null;
  }

  const currentRate = audioState.rate || 0.85;

  return (
    <aside
      aria-label="شريط تتبع النطق والصوت"
      className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 lg:left-auto lg:right-8 lg:max-w-2xl z-50 transition-all duration-300 transform"
    >
      <div className="bg-[#00224A]/95 backdrop-blur-md text-white rounded-3xl border-2 border-sky-400/40 shadow-2xl overflow-hidden p-4 sm:p-5 space-y-3">
        {/* Header: Status, Voice Badge & Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-blue-800/60 pb-2.5">
          <div className="flex items-center gap-2.5">
            {/* Equalizer Soundwave Animation */}
            {audioState.isPlaying ? (
              <div className="flex items-end gap-1 h-5 px-1">
                <span className="w-1 bg-sky-400 rounded-full animate-bounce [animation-duration:0.6s]" style={{ height: "60%" }} />
                <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" style={{ height: "100%" }} />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-duration:0.5s] [animation-delay:0.1s]" style={{ height: "80%" }} />
                <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-duration:0.7s] [animation-delay:0.3s]" style={{ height: "50%" }} />
              </div>
            ) : (
              <Volume2 className="w-4 h-4 text-sky-300" />
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold font-arabic flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>تتبع الصوت والكلام (صوت هادئ)</span>
                </span>
                <span className="text-[10px] font-mono text-sky-200">
                  {audioState.currentWordIndex >= 0 && audioState.words.length > 0
                    ? `Word ${audioState.currentWordIndex + 1} / ${audioState.words.length}`
                    : "Audio Playing"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Playback Speed & Controls */}
          <div className="flex items-center gap-1.5">
            {/* Speed Picker Pills */}
            <div className="flex items-center bg-black/30 rounded-xl p-0.5 border border-white/10 text-xs font-mono">
              <button
                onClick={() => audioManager.setRate(0.75)}
                className={`px-2 py-1 rounded-lg transition text-[11px] font-bold ${
                  currentRate <= 0.76 ? "bg-amber-400 text-slate-950 font-black shadow-xs" : "text-white/70 hover:text-white"
                }`}
                title="أهدأ وأبطأ (Very Calm)"
              >
                0.75x أهدأ
              </button>
              <button
                onClick={() => audioManager.setRate(0.85)}
                className={`px-2 py-1 rounded-lg transition text-[11px] font-bold ${
                  currentRate > 0.76 && currentRate < 0.95 ? "bg-[#00A3E0] text-white font-black shadow-xs" : "text-white/70 hover:text-white"
                }`}
                title="هادئ ومريح للمرحلة الابتدائية (Calm Pace)"
              >
                0.85x متزن
              </button>
              <button
                onClick={() => audioManager.setRate(1.0)}
                className={`px-2 py-1 rounded-lg transition text-[11px] font-bold ${
                  currentRate >= 0.95 ? "bg-white text-slate-900 font-black shadow-xs" : "text-white/70 hover:text-white"
                }`}
                title="سرعة عادية (Normal)"
              >
                1.0x
              </button>
            </div>

            {/* Replay Button */}
            <button
              onClick={() => audioManager.replay()}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
              title="إعادة الاستماع لهذه الجملة"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Stop Button */}
            <button
              onClick={() => audioManager.stop()}
              className="p-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white transition shadow-xs"
              title="إيقاف الصوت"
            >
              <Square className="w-3.5 h-3.5" />
            </button>

            {/* Toggle collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
              title={isExpanded ? "طي الشريط" : "توسيع الشريط"}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded View: Word-by-Word Live Karaoke Tracking */}
        {isExpanded && (
          <div className="space-y-2">
            {/* The Live Words Karaoke Line */}
            <div className="p-3.5 bg-black/40 rounded-2xl border border-sky-400/20 max-h-36 overflow-y-auto font-cambridge leading-relaxed text-base sm:text-lg flex flex-wrap gap-x-2 gap-y-1.5 items-center">
              {audioState.words.map((w, idx) => {
                const isCurrentWord = idx === audioState.currentWordIndex;
                const isPassedWord = idx < audioState.currentWordIndex;

                return (
                  <span
                    key={idx}
                    className={`inline-block px-1.5 py-0.5 rounded-lg transition-all duration-150 ${
                      isCurrentWord
                        ? "bg-[#FDE047] text-slate-950 font-black shadow-lg ring-2 ring-amber-400 scale-110 -translate-y-0.5"
                        : isPassedWord
                        ? "text-sky-200/90 font-medium"
                        : "text-white/80 font-normal"
                    }`}
                  >
                    {w}
                  </span>
                );
              })}
            </div>

            {/* Optional Arabic Translation / Guidance underneath */}
            {audioState.arabicTranslation && (
              <div className="px-3 py-1.5 rounded-xl bg-sky-950/60 border border-sky-700/50 text-xs font-arabic text-sky-200 flex items-center justify-between">
                <span>💡 {audioState.arabicTranslation}</span>
                <span className="text-[10px] text-sky-300/80 font-mono">ترجمة توضيحية</span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00A3E0] via-amber-400 to-emerald-400 h-full transition-all duration-150 rounded-full"
                style={{
                  width: `${Math.round(
                    (audioState.words.length > 0 && audioState.currentWordIndex >= 0
                      ? (audioState.currentWordIndex + 1) / audioState.words.length
                      : audioState.progress) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

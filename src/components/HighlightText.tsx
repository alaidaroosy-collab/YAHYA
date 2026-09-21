import React, { useEffect, useState } from "react";
import { audioManager, AudioPlayState } from "../utils/audioPlayer";

// Target keywords for Cambridge Primary Science Grade 3 (Units 1 & 2)
const KEYWORD_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  torch: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  light: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  "light source": { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-400" },
  dark: { bg: "bg-indigo-100", text: "text-indigo-900", border: "border-indigo-300" },
  shadow: { bg: "bg-slate-200", text: "text-slate-900", border: "border-slate-400" },
  reflect: { bg: "bg-cyan-100", text: "text-cyan-900", border: "border-cyan-300" },
  reflection: { bg: "bg-cyan-100", text: "text-cyan-900", border: "border-cyan-300" },
  mirror: { bg: "bg-sky-100", text: "text-sky-900", border: "border-sky-300" },
  sun: { bg: "bg-orange-100", text: "text-orange-900", border: "border-orange-400" },
  protect: { bg: "bg-emerald-100", text: "text-emerald-900", border: "border-emerald-300" },
  pattern: { bg: "bg-purple-100", text: "text-purple-900", border: "border-purple-300" },
  opaque: { bg: "bg-stone-200", text: "text-stone-900", border: "border-stone-400" },
  crust: { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-400" },
  mantle: { bg: "bg-orange-100", text: "text-orange-950", border: "border-orange-400" },
  "outer core": { bg: "bg-red-100", text: "text-red-950", border: "border-red-400" },
  "inner core": { bg: "bg-yellow-100", text: "text-yellow-950", border: "border-yellow-400" },
  granite: { bg: "bg-rose-100", text: "text-rose-900", border: "border-rose-300" },
  basalt: { bg: "bg-zinc-200", text: "text-zinc-900", border: "border-zinc-400" },
  chalk: { bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-300" },
  limestone: { bg: "bg-stone-100", text: "text-stone-900", border: "border-stone-300" },
  marble: { bg: "bg-purple-100", text: "text-purple-900", border: "border-purple-300" },
  sandstone: { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-300" },
  slate: { bg: "bg-slate-200", text: "text-slate-900", border: "border-slate-400" },
  pumice: { bg: "bg-teal-100", text: "text-teal-900", border: "border-teal-300" },
  fossil: { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-300" },
  soil: { bg: "bg-amber-100", text: "text-amber-950", border: "border-amber-400" },
  rock: { bg: "bg-stone-100", text: "text-stone-900", border: "border-stone-300" },
  "natural material": { bg: "bg-emerald-100", text: "text-emerald-900", border: "border-emerald-300" },
  "human-made material": { bg: "bg-blue-100", text: "text-blue-900", border: "border-blue-300" },
};

// Regex sorted by length descending so multi-word keys match first
const KEYWORD_REGEX = new RegExp(
  `\\b(${Object.keys(KEYWORD_STYLES)
    .sort((a, b) => b.length - a.length)
    .join("|")})\\b`,
  "gi"
);

interface Props {
  text: string;
  className?: string;
  onClickWord?: (word: string) => void;
}

export const HighlightText: React.FC<Props> = ({ text, className = "", onClickWord }) => {
  const [audioState, setAudioState] = useState<AudioPlayState>(audioManager.getState());

  useEffect(() => {
    const unsub = audioManager.subscribe((state) => {
      setAudioState({ ...state });
    });
    return unsub;
  }, []);

  if (!text) return null;

  const cleanText = text.trim();
  const isSpeaking = audioState.isPlaying;

  // Determine if this component's text is currently being spoken
  const isThisTextActive =
    isSpeaking &&
    Boolean(
      audioState.text &&
        (audioState.text.includes(cleanText) || cleanText.includes(audioState.text))
    );

  // Split into tokens (words and whitespace) to allow word-by-word tracking
  const tokens = text.split(/(\s+)/);
  let charCursor = 0;
  let wordIndex = 0;

  return (
    <span className={`${className} ${isThisTextActive ? "transition-colors duration-200" : ""}`}>
      {tokens.map((token, idx) => {
        const isWhitespace = /^\s+$/.test(token);
        const startChar = charCursor;
        const endChar = charCursor + token.length;
        charCursor = endChar;

        if (isWhitespace) {
          return <React.Fragment key={idx}>{token}</React.Fragment>;
        }

        const currentWordIdx = wordIndex++;
        const cleanWord = token.replace(/^[^\w\u0600-\u06FF]+|[^\w\u0600-\u06FF]+$/g, "").toLowerCase();

        // Check if this exact word is currently spoken by the audio engine
        const isSpokenNow =
          isThisTextActive &&
          (audioState.currentWordIndex === currentWordIdx ||
            (audioState.charIndex >= startChar && audioState.charIndex <= endChar) ||
            (audioState.currentWord && cleanWord === audioState.currentWord.replace(/^[^\w]+|[^\w]+$/g, "").toLowerCase()));

        // Check if keyword
        const isKeyword = Boolean(KEYWORD_STYLES[cleanWord]);
        const kwStyle = KEYWORD_STYLES[cleanWord] || {
          bg: "bg-amber-100",
          text: "text-amber-900",
          border: "border-amber-300",
        };

        if (isSpokenNow) {
          return (
            <span
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                audioManager.speak(token, "en");
                if (onClickWord) onClickWord(token);
              }}
              className="inline-block px-1.5 py-0.5 rounded-md bg-[#FDE047] text-slate-950 font-black shadow-md ring-2 ring-amber-500 scale-105 transform transition-all duration-100 cursor-pointer mx-0.5"
              title={`Currently reading: "${token}"`}
            >
              {token}
            </span>
          );
        }

        if (isKeyword) {
          return (
            <span
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                audioManager.speak(token, "en");
                if (onClickWord) onClickWord(token);
              }}
              className={`inline-block font-black cursor-pointer px-1.5 py-0.5 rounded-lg border shadow-2xs transition-all duration-200 hover:scale-105 active:scale-95 mx-0.5 ${kwStyle.bg} ${kwStyle.text} ${kwStyle.border}`}
              title={`Listen to key word "${token}"`}
            >
              {token}
            </span>
          );
        }

        return (
          <span
            key={idx}
            onClick={() => {
              if (onClickWord) onClickWord(token);
            }}
            className="cursor-pointer hover:text-[#00A3E0] transition-colors"
          >
            {token}
          </span>
        );
      })}
    </span>
  );
};

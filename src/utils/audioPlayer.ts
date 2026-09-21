// Natural Human Audio Manager for Cambridge Primary Science
// Features:
// 1. Gentle, calm speech pacing for 8-year-old primary students ("أهدى وأوضح")
// 2. Real-time word-by-word tracking & speech synchronization ("تتبع الصوت والكلام")
// 3. Dual Engine: Gemini TTS (Kore/Zephyr natural voice) with high-clarity Web Speech fallback
// 4. Sequential sentence reading with natural teacher breathing pauses
// 5. Playback speed controls (Calm 0.85x, Relaxed 0.75x, Normal 1.0x)

export interface SpokenWordToken {
  word: string;
  clean: string;
  index: number;
  startIndex: number;
  endIndex: number;
  startSec: number;
  endSec: number;
}

export interface AudioPlayState {
  isPlaying: boolean;
  isPaused: boolean;
  text: string;
  arabicTranslation?: string;
  lang: "en" | "ar";
  words: string[];
  tokens: SpokenWordToken[];
  currentWordIndex: number;
  currentWord: string;
  charIndex: number;
  progress: number; // 0 to 1
  duration: number; // in seconds
  elapsed: number; // in seconds
  isRealVoice: boolean;
  voiceName: string;
  rate: number; // e.g. 0.85 (calm/gentle)
  isCalmMode: boolean;
}

type AudioListener = (state: AudioPlayState) => void;

class AudioManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isMuted: boolean = false;
  private listeners: Set<AudioListener> = new Set();

  // Playback settings: Calm, gentle, soothing by default
  private currentRate: number = 0.85; // Calmer tempo (15% slower than default 1.0)
  private currentVoice: string = "Kore"; // Kore is soothing, friendly and gentle
  private isCalmMode: boolean = true;

  // Real-time tracking
  private trackingTimer: number | null = null;
  private audioStartTime: number = 0;
  private audioTotalDuration: number = 0;

  // Sentence sequence handling
  private sequenceQueue: { textEn: string; textAr?: string }[] = [];
  private sequenceIndex: number = 0;
  private sequenceTimeout: number | null = null;
  private onFinishedCallback: (() => void) | null = null;

  private currentState: AudioPlayState = {
    isPlaying: false,
    isPaused: false,
    text: "",
    arabicTranslation: "",
    lang: "en",
    words: [],
    tokens: [],
    currentWordIndex: -1,
    currentWord: "",
    charIndex: -1,
    progress: 0,
    duration: 0,
    elapsed: 0,
    isRealVoice: true,
    voiceName: "Kore",
    rate: 0.85,
    isCalmMode: true,
  };

  private audioBufferCache: Map<string, AudioBuffer> = new Map();

  private notify() {
    this.listeners.forEach((fn) => fn(this.currentState));
  }

  public subscribe(fn: AudioListener) {
    this.listeners.add(fn);
    fn(this.currentState);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public getState(): AudioPlayState {
    return this.currentState;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setRate(newRate: number) {
    this.currentRate = Math.max(0.65, Math.min(1.2, newRate));
    this.currentState.rate = this.currentRate;
    if (this.currentSource && this.audioCtx) {
      try {
        this.currentSource.playbackRate.value = this.currentRate;
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public getRate() {
    return this.currentRate;
  }

  public setCalmMode(enabled: boolean) {
    this.isCalmMode = enabled;
    this.currentState.isCalmMode = enabled;
    this.setRate(enabled ? 0.85 : 1.0);
  }

  public setVoice(voice: string) {
    this.currentVoice = voice;
    this.currentState.voiceName = voice;
    this.notify();
  }

  public stop() {
    if (this.trackingTimer !== null) {
      window.clearTimeout(this.trackingTimer);
      this.trackingTimer = null;
    }
    if (this.sequenceTimeout !== null) {
      window.clearTimeout(this.sequenceTimeout);
      this.sequenceTimeout = null;
    }
    this.sequenceQueue = [];
    this.sequenceIndex = 0;
    this.onFinishedCallback = null;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {
        // ignore
      }
      this.currentSource = null;
    }

    this.currentState = {
      ...this.currentState,
      isPlaying: false,
      isPaused: false,
      text: "",
      arabicTranslation: "",
      words: [],
      tokens: [],
      currentWordIndex: -1,
      currentWord: "",
      charIndex: -1,
      progress: 0,
      duration: 0,
      elapsed: 0,
    };
    this.notify();
  }

  public replay() {
    const text = this.currentState.text;
    const lang = this.currentState.lang;
    const arabic = this.currentState.arabicTranslation;
    if (text) {
      this.speak(text, lang, true, arabic);
    }
  }

  // Parse words and compute tokens with character offsets
  private parseTokens(text: string): { words: string[]; tokens: SpokenWordToken[] } {
    const tokens: SpokenWordToken[] = [];
    const words: string[] = [];
    const regex = /\S+/g;
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = regex.exec(text)) !== null) {
      const raw = match[0];
      const clean = raw.replace(/^[^\w\u0600-\u06FF]+|[^\w\u0600-\u06FF]+$/g, "").toLowerCase();
      words.push(raw);
      tokens.push({
        word: raw,
        clean,
        index: idx++,
        startIndex: match.index,
        endIndex: match.index + raw.length,
        startSec: 0,
        endSec: 0,
      });
    }

    return { words, tokens };
  }

  // Speak a single sentence or text with word-by-word tracking
  public async speak(
    text: string,
    lang: "en" | "ar" = "en",
    tryGemini: boolean = true,
    arabicTranslation?: string,
    onFinished?: () => void
  ) {
    if (this.isMuted || !text || !text.trim()) return;

    this.stop();
    const cleanText = text.trim();
    const { words, tokens } = this.parseTokens(cleanText);

    this.onFinishedCallback = onFinished || null;

    this.currentState = {
      isPlaying: true,
      isPaused: false,
      text: cleanText,
      arabicTranslation: arabicTranslation || "",
      lang,
      words,
      tokens,
      currentWordIndex: 0,
      currentWord: words[0] || "",
      charIndex: 0,
      progress: 0,
      duration: 0,
      elapsed: 0,
      isRealVoice: true,
      voiceName: this.currentVoice,
      rate: this.currentRate,
      isCalmMode: this.isCalmMode,
    };
    this.notify();

    // 1. Try Gemini Real Human Voice with calm setting
    if (tryGemini) {
      try {
        const played = await this.playGeminiTTS(cleanText, tokens);
        if (played) return;
      } catch (err) {
        console.warn("Natural voice synthesis falling back to browser natural voice:", err);
      }
    }

    // 2. High-clarity Web Speech with calm pacing and boundary tracking
    this.playNaturalWebSpeech(cleanText, lang, tokens);
  }

  // Read a sequence of sentences with gentle pauses (for whole page or section reading)
  public speakSequence(
    items: { textEn: string; textAr?: string }[],
    lang: "en" | "ar" = "en"
  ) {
    this.stop();
    if (!items || items.length === 0) return;

    this.sequenceQueue = items.filter((i) => i.textEn && i.textEn.trim());
    this.sequenceIndex = 0;
    this.playNextInSequence(lang);
  }

  private playNextInSequence(lang: "en" | "ar") {
    if (this.sequenceIndex >= this.sequenceQueue.length) {
      this.sequenceQueue = [];
      this.sequenceIndex = 0;
      this.stop();
      return;
    }

    const currentItem = this.sequenceQueue[this.sequenceIndex];
    this.speak(
      currentItem.textEn,
      lang,
      true,
      currentItem.textAr,
      () => {
        // Natural calm breathing pause between sentences (550ms)
        this.sequenceIndex++;
        this.sequenceTimeout = window.setTimeout(() => {
          this.playNextInSequence(lang);
        }, 550);
      }
    );
  }

  private async playGeminiTTS(text: string, tokens: SpokenWordToken[]): Promise<boolean> {
    const cacheKey = `${this.currentVoice}_${text.slice(0, 150)}`;

    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return false;
      this.audioCtx = new AudioContextClass({ sampleRate: 24000 });
    }

    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }

    // Check memory cache
    if (this.audioBufferCache.has(cacheKey)) {
      const cachedBuffer = this.audioBufferCache.get(cacheKey)!;
      return this.playBuffer(cachedBuffer, text, tokens);
    }

    try {
      // Pick a warm, calm, gentle voice for primary school learners
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: this.currentVoice }),
      });

      if (!res.ok) return false;
      const data = await res.json();
      if (!data.audio) return false;

      // Decode base64 PCM 24kHz 16-bit
      const binaryString = atob(data.audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const sampleRate = 24000;
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      const audioBuffer = this.audioCtx.createBuffer(1, float32.length, sampleRate);
      audioBuffer.getChannelData(0).set(float32);

      this.audioBufferCache.set(cacheKey, audioBuffer);
      return this.playBuffer(audioBuffer, text, tokens);
    } catch {
      return false;
    }
  }

  // Calculate proportional phonetic timing for word-by-word tracking
  private assignTokenTimings(tokens: SpokenWordToken[], totalDurationSec: number) {
    if (tokens.length === 0) return;

    let totalWeight = 0;
    const weights = tokens.map((token) => {
      let w = Math.max(1.5, token.clean.length);
      // Extra pause for punctuation
      if (/[.?!]$/.test(token.word)) {
        w += 4.5;
      } else if (/[,;:]$/.test(token.word)) {
        w += 2.5;
      }
      totalWeight += w;
      return w;
    });

    let cumulativeSec = 0;
    tokens.forEach((token, idx) => {
      const tokenDur = (weights[idx] / totalWeight) * totalDurationSec;
      token.startSec = cumulativeSec;
      token.endSec = cumulativeSec + tokenDur;
      cumulativeSec += tokenDur;
    });
  }

  private startWordTracker(totalDurationSec: number) {
    if (this.trackingTimer !== null) {
      window.clearTimeout(this.trackingTimer);
      this.trackingTimer = null;
    }

    const tick = () => {
      if (!this.currentState.isPlaying || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const elapsed = Math.max(0, (now - this.audioStartTime) * this.currentRate);
      const progress = Math.min(1, elapsed / (totalDurationSec || 1));

      // Find token at current elapsed second
      const activeToken =
        this.currentState.tokens.find((t) => elapsed >= t.startSec && elapsed <= t.endSec) ||
        this.currentState.tokens[this.currentState.tokens.length - 1];

      if (activeToken) {
        this.currentState.currentWordIndex = activeToken.index;
        this.currentState.currentWord = activeToken.word;
        this.currentState.charIndex = activeToken.startIndex;
        this.currentState.elapsed = elapsed;
        this.currentState.progress = progress;
        this.notify();
      }

      if (elapsed < totalDurationSec && this.currentState.isPlaying) {
        this.trackingTimer = window.setTimeout(tick, 35);
      }
    };

    tick();
  }

  private playBuffer(
    audioBuffer: AudioBuffer,
    text: string,
    tokens: SpokenWordToken[]
  ): boolean {
    if (!this.audioCtx) return false;

    // Apply calm playback rate
    const source = this.audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = this.currentRate;
    source.connect(this.audioCtx.destination);
    this.currentSource = source;

    const effectiveDuration = audioBuffer.duration / this.currentRate;
    this.audioTotalDuration = effectiveDuration;
    this.audioStartTime = this.audioCtx.currentTime;

    // Compute word timing boundaries
    this.assignTokenTimings(tokens, effectiveDuration);

    this.currentState = {
      ...this.currentState,
      duration: effectiveDuration,
      tokens,
    };

    // Start live tracking loop
    this.startWordTracker(effectiveDuration);

    source.onended = () => {
      if (this.currentSource === source) {
        if (this.trackingTimer !== null) {
          window.clearTimeout(this.trackingTimer);
          this.trackingTimer = null;
        }
        this.currentState = {
          ...this.currentState,
          isPlaying: false,
          currentWordIndex: -1,
          progress: 1,
        };
        this.notify();

        if (this.onFinishedCallback) {
          const cb = this.onFinishedCallback;
          this.onFinishedCallback = null;
          cb();
        }
      }
    };

    source.start();
    return true;
  }

  private playNaturalWebSpeech(text: string, lang: "en" | "ar", tokens: SpokenWordToken[]) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.currentState = {
        ...this.currentState,
        isPlaying: false,
        text: "",
        isRealVoice: false,
      };
      this.notify();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    const voices = window.speechSynthesis.getVoices();

    if (lang === "ar") {
      utterance.lang = "ar-SA";
      const arVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("ar") &&
            (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Maged"))
        ) || voices.find((v) => v.lang.startsWith("ar"));
      if (arVoice) utterance.voice = arVoice;
      utterance.rate = this.currentRate * 0.95;
      utterance.pitch = 1.0;
    } else {
      utterance.lang = "en-GB";
      // Pick soothing, gentle, natural English voice
      const preferredEnglishVoice =
        voices.find(
          (v) =>
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Serena") ||
              v.name.includes("Karen") ||
              v.name.includes("Oliver")) &&
            (v.lang.includes("en-GB") || v.lang.includes("en-US"))
        ) ||
        voices.find((v) => v.lang.includes("en-GB")) ||
        voices.find((v) => v.lang.startsWith("en"));

      if (preferredEnglishVoice) utterance.voice = preferredEnglishVoice;
      // Gentle, calm pacing for 8-year-olds
      utterance.rate = this.currentRate;
      utterance.pitch = 0.98;
    }

    // Live word boundary tracking
    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name === "word") {
        const charIdx = event.charIndex;
        const found = tokens.find(
          (t) => charIdx >= t.startIndex && charIdx <= t.endIndex
        );
        if (found) {
          this.currentState.currentWordIndex = found.index;
          this.currentState.currentWord = found.word;
          this.currentState.charIndex = charIdx;
          this.currentState.progress = Math.min(1, charIdx / Math.max(1, text.length));
          this.notify();
        }
      }
    };

    utterance.onend = () => {
      this.currentState = {
        ...this.currentState,
        isPlaying: false,
        currentWordIndex: -1,
        progress: 1,
      };
      this.notify();
      if (this.onFinishedCallback) {
        const cb = this.onFinishedCallback;
        this.onFinishedCallback = null;
        cb();
      }
    };

    utterance.onerror = () => {
      this.currentState = {
        ...this.currentState,
        isPlaying: false,
        currentWordIndex: -1,
      };
      this.notify();
    };

    window.speechSynthesis.speak(utterance);
  }

  // Encouraging child-friendly sounds
  public playSuccessSound() {
    if (this.isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  public playTryAgainSound() {
    if (this.isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  public playErrorSound() {
    this.playTryAgainSound();
  }

  // Soft, subtle interactive tactile tap/click sound for buttons and cards
  public playClickSound() {
    if (this.isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Subtle, pleasant physical paper page-turn sound effect with dual-layer paper rustle and gentle whoosh
  public playPageTurnSound() {
    if (this.isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // Layer 1: Filtered organic pink/white noise buffer for paper friction
      const duration = 0.22; // 220ms
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise approximation for warm, natural paper sound
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        const pink = b0 + b1 + b2 + white * 0.5362;
        // Natural paper envelope decay
        const progress = i / bufferSize;
        const env = Math.sin(progress * Math.PI) * Math.exp(-progress * 2.5);
        data[i] = pink * env * 0.35;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Dynamic bandpass filter that sweeps gently as the page folds over
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(800, now);
      bandpass.frequency.exponentialRampToValueAtTime(1450, now + 0.08);
      bandpass.frequency.exponentialRampToValueAtTime(650, now + duration);
      bandpass.Q.setValueAtTime(1.2, now);

      // Lowpass filter to keep sound soft and gentle on young ears
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(3200, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.07, now + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noiseSource.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // Layer 2: Subtle low-mid resonant woosh for paper displacement
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);

      oscGain.gain.setValueAtTime(0.015, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // ignore
    }
  }
}

export const audioManager = new AudioManager();

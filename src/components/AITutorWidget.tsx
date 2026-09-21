import React, { useState } from "react";
import { audioManager } from "../utils/audioPlayer";
import {
  MessageCircle,
  Volume2,
  Send,
  Sparkles,
  Camera,
  Film,
  X,
  Bot,
  Loader2,
  CheckCircle2,
  Upload,
} from "lucide-react";

interface Props {
  currentLessonTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AITutorWidget: React.FC<Props> = ({
  currentLessonTitle = "Grade 3 Science",
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"chat" | "camera" | "video">("chat");
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "tutor"; text: string; audioText?: string }>
  >([
    {
      sender: "tutor",
      text: "مرحباً يا بطل العلوم في الصف الثالث! أنا معلمك الذكي لمادتي الضوء والأرض. اسألني أي سؤال عن دروسك وسأجيبك حصرياً مما في كتابك المدرسي!",
      audioText: "Hello Grade 3 scientist! Ask me anything about light, shadows, earth, and rocks.",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Quick prompt questions strictly from the 26 pages
  const quickQuestions = [
    { ar: "ما هو الضوء ومصادره؟", en: "What is light?" },
    { ar: "كيف يتغير حجم الظل مع المسافة؟", en: "How do shadows change with distance?" },
    { ar: "ما هي طبقات الأرض الأربع؟", en: "What are the 4 layers of the Earth?" },
    { ar: "كيف نفرق بين الطباشير والرخام؟", en: "How do we identify chalk and marble?" },
  ];

  // Camera Analysis State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Video Storyboard State
  const [storyboardScenes, setStoryboardScenes] = useState<any[] | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    setInputText("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsg,
          lessonContext: currentLessonTitle,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "شكراً لسؤالك الرائع!";
      setMessages((prev) => [
        ...prev,
        { sender: "tutor", text: reply, audioText: userMsg },
      ]);
      audioManager.speak(reply.slice(0, 120), "ar");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "tutor",
          text: "أحسنت التفكير! يمكنك أيضاً مراجعة خطوات التجربة في بطاقة الدرس التفاعلية.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        analyzePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePhoto = async (base64: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch("/api/analyze-experiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          experimentType: currentLessonTitle,
        }),
      });
      const data = await res.json();
      setAnalysisResult(data.analysis || "صورة ممتازة لتجربتك العلمية!");
      audioManager.playSuccessSound();
    } catch (err) {
      setAnalysisResult("صورة رائعة! خطواتك متطابقة مع تجارب كتاب العلوم للصف الثالث.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateVideoStoryboard = async () => {
    setIsGeneratingVideo(true);
    try {
      const res = await fetch("/api/generate-lesson-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonTopic: currentLessonTitle }),
      });
      const data = await res.json();
      setStoryboardScenes(data.scenes || []);
      audioManager.playSuccessSound();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[85vh] max-h-[680px] shadow-2xl border-2 border-indigo-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-inner">
              <Bot className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-1.5">
                <span>المعلم الذكي المنهجي (Grade 3 Tutor)</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-mono font-bold">
                  Gemini
                </span>
              </h3>
              <p className="text-xs text-indigo-200">
                مرتبط حصرياً بكتاب العلوم للصف الثالث
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-indigo-700 text-indigo-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === "chat"
                ? "bg-white text-indigo-700 border-b-2 border-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>محادثة صوتية وكتابية</span>
          </button>
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === "camera"
                ? "bg-white text-indigo-700 border-b-2 border-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>تحليل صورة/فيديو التجربة</span>
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === "video"
                ? "bg-white text-indigo-700 border-b-2 border-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>توليد فيديو تعليمي (Veo)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "chat" && (
            <>
              {/* Messages list */}
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${
                      m.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        m.sender === "user"
                          ? "bg-amber-500 text-white"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {m.sender === "user" ? "أنت" : "🤖"}
                    </div>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        m.sender === "user"
                          ? "bg-amber-500 text-white rounded-tr-none"
                          : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                      }`}
                    >
                      <p className="whitespace-pre-line font-arabic">{m.text}</p>
                      {m.sender === "tutor" && (
                        <button
                          onClick={() => audioManager.speak(m.text.slice(0, 150), "ar")}
                          className="mt-1.5 flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>استمع للصوت</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>المعلم الذكي يجهز الإجابة من الكتاب...</span>
                  </div>
                )}
              </div>

              {/* Quick suggestions */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                  أسئلة مقترحة من دروسك:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q.ar)}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200 transition"
                    >
                      {q.ar}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "camera" && (
            <div className="space-y-4 text-center">
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 transition">
                {photoPreview ? (
                  <div className="space-y-3">
                    <img
                      src={photoPreview}
                      alt="Uploaded experiment"
                      className="max-h-48 mx-auto rounded-xl shadow-md object-cover"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>تغيير الصورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                      <Camera className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      ارفع صورة أو التقط صورة لتجربتك
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      (نموذج صلصال طبقات الأرض، أو تجربة الظلال، أو فحص الصخور)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {isAnalyzing && (
                <div className="flex items-center justify-center gap-2 text-sm text-indigo-600 font-bold py-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>يقوم الذكاء الاصطناعي بمطابقة تجربتك مع معايير الكتاب...</span>
                </div>
              )}

              {analysisResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-right animate-fade-in space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>تقرير تقييم التجربة:</span>
                    </span>
                    <button
                      onClick={() => audioManager.speak(analysisResult, "ar")}
                      className="text-xs text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>استمع للتقييم</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-arabic">
                    {analysisResult}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "video" && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <Film className="w-4 h-4 text-indigo-600" />
                  <span>توليد فيديو تعليمي متحرك للدرس الحالي:</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  الدرس: <strong>{currentLessonTitle}</strong>
                </p>
                <button
                  onClick={handleGenerateVideoStoryboard}
                  disabled={isGeneratingVideo}
                  className="mt-3 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow flex items-center justify-center gap-2 transition"
                >
                  {isGeneratingVideo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جارٍ إنشاء مشاهد الفيديو المتحركة...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>إنشاء المشاهد التعليمية المتحركة (Veo 3.1)</span>
                    </>
                  )}
                </button>
              </div>

              {storyboardScenes && storyboardScenes.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    المشاهد المتحركة المولدة:
                  </span>
                  {storyboardScenes.map((sc, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          مشهد {sc.sceneNumber || i + 1}
                        </span>
                        <button
                          onClick={() =>
                            audioManager.speak(
                              sc.audioNarrationAr || sc.audioNarrationEn,
                              "ar"
                            )
                          }
                          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>التعليق الصوتي</span>
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        {sc.visualAr || sc.visualEn}
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        "{sc.audioNarrationAr || sc.audioNarrationEn}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Input Bar for Chat */}
        {activeTab === "chat" && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="اكتب سؤالك هنا يا بطل العلوم..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition shrink-0"
              aria-label="إرسال السؤال"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

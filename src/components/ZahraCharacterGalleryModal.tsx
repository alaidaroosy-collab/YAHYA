import React, { useState, useRef, useEffect } from "react";
import { ZAHRA_CHARACTER_IMAGES, ZahraCharacterImage } from "../data/zahraImages";
import { zahraImageManager } from "../utils/zahraImageManager";
import { rewardsManager } from "../utils/rewardsManager";
import { audioManager } from "../utils/audioPlayer";
import {
  Sparkles,
  Camera,
  CheckCircle2,
  Upload,
  Heart,
  Volume2,
  X,
  Star,
  Image as ImageIcon,
  FolderSync,
  HelpCircle,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsPrimaryAvatar?: (url: string) => void;
}

export const ZahraCharacterGalleryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectAsPrimaryAvatar,
}) => {
  const [selectedImage, setSelectedImage] = useState<ZahraCharacterImage>(
    ZAHRA_CHARACTER_IMAGES[0]
  );
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = zahraImageManager.subscribe(() => {
      setRefreshKey((k) => k + 1);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    let matchedCount = 0;

    Array.from(files).forEach((file) => {
      const fileNameLower = file.name.toLowerCase();
      // Match against known filenames or keywords
      const matched = ZAHRA_CHARACTER_IMAGES.find((img) => {
        const keyPart = img.filename.replace(".png", "").toLowerCase();
        return (
          fileNameLower.includes(keyPart) ||
          fileNameLower === img.filename.toLowerCase() ||
          (fileNameLower.includes("homework") && img.id === "zahra-homework-write") ||
          (fileNameLower.includes("prepare-v2") && img.id === "zahra-prepare-wave") ||
          (fileNameLower.includes("prepare") && !fileNameLower.includes("v2") && img.id === "zahra-prepare-pack") ||
          (fileNameLower.includes("learn-v2") && img.id === "zahra-learn-read") ||
          (fileNameLower.includes("learn") && !fileNameLower.includes("v2") && img.id === "zahra-learn-idea") ||
          (fileNameLower.includes("practice-v2") && img.id === "zahra-practice-success") ||
          (fileNameLower.includes("practice") && !fileNameLower.includes("v2") && img.id === "zahra-practice-check")
        );
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const targetFilename = matched ? matched.filename : file.name;
          zahraImageManager.saveImage(targetFilename, result);
          if (matched && matched.id === "zahra-prepare-wave") {
            rewardsManager.updateStudentPhoto(result);
          }
        }
      };
      reader.readAsDataURL(file);
      matchedCount++;
    });

    audioManager.playSuccessSound();
    setUploadSuccessMsg(`تم بنجاح حفظ وتفعيل ${matchedCount} صورة لزهرة في الموقع! 🎉`);
    setTimeout(() => setUploadSuccessMsg(""), 5000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChoosePrimary = (img: ZahraCharacterImage) => {
    const url = zahraImageManager.getImageUrl(img.filename);
    rewardsManager.updateStudentPhoto(url);
    if (onSelectAsPrimaryAvatar) {
      onSelectAsPrimaryAvatar(url);
    }
    audioManager.playSuccessSound();
    setUploadSuccessMsg(`تم تعيين "${img.titleAr}" كصورة رئيسية لزهرة في الواجهة! 🌟`);
    setTimeout(() => setUploadSuccessMsg(""), 4000);
  };

  const handlePronounce = (text: string) => {
    audioManager.speak(text, "ar");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border-2 border-amber-300">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#002D62] via-[#004B87] to-[#00224A] text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Sparkles className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-2xl font-black font-cambridge tracking-wide">
                    Zahra's Official Character Gallery
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black font-arabic">
                    الصور الرسمية لزهرة (7 صور)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-sky-200 font-arabic mt-0.5">
                  شخصية زهرة الحقيقية بجميع ردود أفعالها مع أصدقائها الأرنب الأبيض والثعلب الذكي
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/20"
              title="Close (إغلاق)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Notice Alert / Status */}
          {uploadSuccessMsg && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-500 text-white text-xs sm:text-sm font-black font-arabic flex items-center gap-2 animate-bounce shadow-md">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Body: 2-Column layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Quick Drag-and-Drop Uploader Strip */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`p-4 rounded-2xl border-2 border-dashed transition flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDragging
                ? "border-amber-500 bg-amber-50/80 scale-[1.01]"
                : "border-sky-300 bg-sky-50/50 hover:bg-sky-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Upload className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-900 font-arabic">
                  رفع وتثبيت الصور السبعة لزهرة بنقرة واحدة (Upload All 7 Photos)
                </h4>
                <p className="text-xs text-slate-600 font-arabic">
                  اسحب وأفلت ملفات الصور السبعة هنا أو اضغط الزر لاختيارها من جهازك دفعة واحدة لتثبيتها في الموقع فوراً.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition active:scale-95 flex items-center gap-1.5 font-arabic"
              >
                <FolderSync className="w-4 h-4 text-amber-300" />
                <span>اختيار الصور من الجهاز (Select Files)</span>
              </button>
            </div>
          </div>

          {/* 7 Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ZAHRA_CHARACTER_IMAGES.map((img) => {
              const currentUrl = zahraImageManager.getImageUrl(img.filename);
              const isStored = zahraImageManager.hasStoredImage(img.filename);
              const isSelected = selectedImage.id === img.id;

              return (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-2xl border-2 p-3 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-300"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Image Preview Container */}
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 relative group border border-slate-200/80">
                      <img
                        src={currentUrl}
                        alt={img.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Fallback to placeholder if not yet dropped or placed
                          (e.target as HTMLImageElement).src =
                            "/src/assets/images/zahra_avatar_1790017518372.jpg";
                        }}
                      />

                      {/* Status Tag */}
                      <div className="absolute top-2 right-2">
                        {isStored ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-md flex items-center gap-1 font-arabic">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>مُثبتة ومحفوظة</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-900/70 text-white text-[10px] font-bold backdrop-blur-2xs flex items-center gap-1 font-mono">
                            <span>{img.filename}</span>
                          </span>
                        )}
                      </div>

                      {/* Companion Badge */}
                      <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-0.5 rounded-full bg-white/90 text-slate-800 text-[10px] font-black shadow-xs font-arabic">
                          {img.companionAr}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
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

                  {/* Actions */}
                  <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChoosePrimary(img);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 text-[11px] font-black transition active:scale-95 font-arabic flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>تعيين كصورة رئيسية</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePronounce(img.titleAr);
                      }}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      title="استمع للوصف"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Integration Guide Explanation Box */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-950 font-bold text-xs font-arabic">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>أين تظهر شخصية زهرة وصورها في الموقع؟</span>
            </div>
            <ul className="text-xs text-blue-900/90 font-arabic space-y-1 pr-4 list-disc leading-relaxed">
              <li>
                <strong>واجهة الترحيب الصباحية:</strong> تظهر صورة زهرة تلوّح بالتحية مع حقيبتها وصديقها الأرنب (zahra-reaction-prepare-v2.png).
              </li>
              <li>
                <strong>جدول الدراسة الأسبوعي (Weekly Roadmap):</strong> تظهر زهرة وهي تكتب الملاحظات والواجبات مع الثعلب (zahra-reaction-homework.png).
              </li>
              <li>
                <strong>مستكشف صفحات الكتاب (Book Pages):</strong> تظهر زهرة منبهرة بقراءة كتاب العلوم (zahra-reaction-learn-v2.png) واكتشاف الأفكار (zahra-reaction-learn.png).
              </li>
              <li>
                <strong>تمارين الكتاب التفاعلية والدرجات:</strong> تظهر زهرة بعلامة التميز والإبهام للأعلى وقائمة الإنجاز (zahra-reaction-practice-v2.png).
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-arabic">
            جميع الصور السبعة مخصصة ومطابقة 100% لشخصية زهرة الحقيقية.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black transition font-arabic"
          >
            إغلاق المعرض (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

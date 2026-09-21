export interface ZahraCharacterImage {
  id: string;
  filename: string;
  titleEn: string;
  titleAr: string;
  category: "prepare" | "learn" | "practice" | "homework";
  roleDescriptionEn: string;
  roleDescriptionAr: string;
  companionEn: string;
  companionAr: string;
  defaultPath: string;
}

export const ZAHRA_CHARACTER_IMAGES: ZahraCharacterImage[] = [
  {
    id: "zahra-prepare-wave",
    filename: "zahra-reaction-prepare-v2.png",
    titleEn: "Morning Welcome & School Day Hello",
    titleAr: "تحية الصباح والترحيب باليوم الدراسي",
    category: "prepare",
    roleDescriptionEn: "Zahra smiling cheerfully with her turquoise backpack and cute white bunny, waving hello with the morning sun.",
    roleDescriptionAr: "زهرة تبتسم ببهجة مع حقيبتها المدرسية الفيروزية وصديقها الأرنب الأبيض اللطيف، ملوحة بالتحية تحت شمس الصباح المشرقة.",
    companionEn: "White Fluffy Bunny 🐰",
    companionAr: "الأرنب الأبيض اللطيف 🐰",
    defaultPath: "/images/zahra/zahra-reaction-prepare-v2.png",
  },
  {
    id: "zahra-prepare-pack",
    filename: "zahra-reaction-prepare.png",
    titleEn: "Packing Science Books & Preparing",
    titleAr: "ترتيب كتب العلوم وتجهيز الحقيبة",
    category: "prepare",
    roleDescriptionEn: "Zahra carefully placing her favorite science books and notebook into her school backpack with her bunny friend.",
    roleDescriptionAr: "زهرة تضع كتب العلوم ودفتر الملاحظات بعناية داخل حقيبتها المدرسية برفقة صديقها الأرنب.",
    companionEn: "White Fluffy Bunny 🐰",
    companionAr: "الأرنب الأبيض اللطيف 🐰",
    defaultPath: "/images/zahra/zahra-reaction-prepare.png",
  },
  {
    id: "zahra-learn-read",
    filename: "zahra-reaction-learn-v2.png",
    titleEn: "Reading Science Book in Wonder",
    titleAr: "قراءة صفحات الكتاب العلمي بشغف واكتشاف",
    category: "learn",
    roleDescriptionEn: "Zahra in green overalls immersed in reading a large science book with wonder, sharing knowledge with her bunny.",
    roleDescriptionAr: "زهرة في وزرتها الخضراء تقرأ كتاب العلوم الكبير بانبهار وشغف، وتشارك المعرفة مع صديقها الأرنب.",
    companionEn: "White Fluffy Bunny 🐰",
    companionAr: "الأرنب الأبيض اللطيف 🐰",
    defaultPath: "/images/zahra/zahra-reaction-learn-v2.png",
  },
  {
    id: "zahra-learn-idea",
    filename: "zahra-reaction-learn.png",
    titleEn: "Eureka! Brilliant Scientific Idea",
    titleAr: "وجدتها! فكرة علمية واكتشاف عبقري",
    category: "learn",
    roleDescriptionEn: "Zahra pointing upward with a brilliant eureka scientific insight while holding her open science textbook.",
    roleDescriptionAr: "زهرة تشير بإصبعها للأعلى بابتسامة ذكية إثر اكتشاف فكرة علمية ملهمة أثناء استعراض كتاب العلوم.",
    companionEn: "White Fluffy Bunny 🐰",
    companionAr: "الأرنب الأبيض اللطيف 🐰",
    defaultPath: "/images/zahra/zahra-reaction-learn.png",
  },
  {
    id: "zahra-practice-success",
    filename: "zahra-reaction-practice-v2.png",
    titleEn: "Quiz Master Thumbs-Up & Checklist Star",
    titleAr: "إنجاز التمارين بنجاح وعلامة التميز الكاملة",
    category: "practice",
    roleDescriptionEn: "Zahra winking with thumbs-up in a coral cardigan, holding her clipboard checklist with full green checkmark and cute fox companion.",
    roleDescriptionAr: "زهرة تغمز بابتسامة فخر وإشارة إعجاب مرتدية سترتها المرجانية، وتحمل لوحة المهام المنجزة برفقة الثعلب البرتقالي الذكي وسط النجوم.",
    companionEn: "Orange Smart Fox 🦊",
    companionAr: "الثعلب البرتقالي الذكي 🦊",
    defaultPath: "/images/zahra/zahra-reaction-practice-v2.png",
  },
  {
    id: "zahra-practice-check",
    filename: "zahra-reaction-practice.png",
    titleEn: "Reviewing Study Goals & Checklist",
    titleAr: "مراجعة قائمة الأهداف والتحقق من التقدم",
    category: "practice",
    roleDescriptionEn: "Zahra pointing enthusiastically while reviewing checklist goals on her clipboard with her smart fox friend.",
    roleDescriptionAr: "زهرة تشير بحماس وتراجع أهداف التعلم في قائمة المهام برفقة الثعلب الذكي.",
    companionEn: "Orange Smart Fox 🦊",
    companionAr: "الثعلب البرتقالي الذكي 🦊",
    defaultPath: "/images/zahra/zahra-reaction-practice.png",
  },
  {
    id: "zahra-homework-write",
    filename: "zahra-reaction-homework.png",
    titleEn: "Writing Science Observations & Homework",
    titleAr: "كتابة الملاحظات العلمية وحل الواجبات",
    category: "homework",
    roleDescriptionEn: "Zahra in a lavender sweater happily writing in her lined notebook with yellow pencil, accompanied by her fox friend and houseplant.",
    roleDescriptionAr: "زهرة بسترتها البنفسجية الجميلة تكتب في دفترها بقلم الرصاص بهمة وسعادة، وبجانبها الثعلب اللطيف ونبتة خضراء جميلة.",
    companionEn: "Orange Smart Fox 🦊",
    companionAr: "الثعلب البرتقالي الذكي 🦊",
    defaultPath: "/images/zahra/zahra-reaction-homework.png",
  },
];

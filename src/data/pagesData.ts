import { VocabWord } from "../types/curriculum";

export interface BookPageSection {
  type: "getting_started" | "look_at_picture" | "activity" | "safety" | "scientific_thinking" | "talk_about" | "questions" | "check_progress" | "summary";
  titleEn: string;
  titleAr: string;
  contentEn: string[];
  contentAr: string[];
  bulletPointsEn?: string[];
  bulletPointsAr?: string[];
  highlight?: string;
}

export interface BookPage {
  pageNumber: number;
  unitNumber: 1 | 2;
  unitTitleEn: string;
  unitTitleAr: string;
  lessonNumber: string;
  lessonTitleEn: string;
  lessonTitleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  heroImage?: string;
  heroImageAlt?: string;
  keyWords: string[];
  sections: BookPageSection[];
  interactiveComponentId?: string;
}

export const allBookPages: BookPage[] = [
  // Page 14
  {
    pageNumber: 14,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.1",
    lessonTitleEn: "Light and Dark",
    lessonTitleAr: "الضوء والظلام",
    subtitleEn: "Why we need light and when dark is useful",
    subtitleAr: "لماذا نحتاج الضوء ومتى يكون الظلام مفيداً",
    heroImage: "/src/assets/images/cambridge_light_rooms_1790012271460.jpg",
    heroImageAlt: "Two rooms - one light and one dark",
    keyWords: ["light", "dark", "protect", "shadow", "reflect", "torch", "Sun", "pattern"],
    sections: [
      {
        type: "getting_started",
        titleEn: "Getting started",
        titleAr: "مع بدء الدرس",
        contentEn: [
          "Look at the picture of the two bedrooms.",
          "One of these rooms is dark. One of these rooms is light.",
          "Which room would you like to sleep in? Why?",
        ],
        contentAr: [
          "تأمل صورة غرفتي النوم.",
          "إحدى هاتين الغرفتين مظلمة والأخرى مضيئة بالكامل.",
          "في أي الغرفتين تفضل أن تنام؟ ولماذا؟",
        ],
      },
      {
        type: "look_at_picture",
        titleEn: "Look at the picture",
        titleAr: "تأمل واكتشف من الصورة",
        contentEn: [
          "In the daytime room, sunlight shines through the window. We can clearly see toys, books, and the bed.",
          "In the nighttime room, the curtains are closed and it is dark. Our eyes rest, and dark is useful when we need to sleep.",
        ],
        contentAr: [
          "في الغرفة المضيئة نهاراً، يتدفق ضوء الشمس من النافذة، فنرى الألعاب والكتب والسرير بوضوح تام.",
          "في الغرفة المظلمة ليلاً، تسدل الستائر ويسود الظلام، مما يساعد العينين على الاسترخاء والراحة فالظلام مفيد للنوم.",
        ],
      },
      {
        type: "talk_about",
        titleEn: "Talk about it!",
        titleAr: "تحدث وناقش مع زملائك",
        contentEn: [
          "Why do we need light during the day? Can you read a book in a pitch black room?",
          "We need light so we can see things around us safely.",
        ],
        contentAr: [
          "لماذا نحتاج إلى الضوء خلال النهار؟ هل يمكنك قراءة كتاب في غرفة مظلمة تماماً؟",
          "نحتاج إلى الضوء لنتمكن من رؤية الأشياء المحيطة بنا بأمان دون الاصطدام بها.",
        ],
      },
    ],
    interactiveComponentId: "interactive-rooms-comparison",
  },

  // Page 15
  {
    pageNumber: 15,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.1",
    lessonTitleEn: "Light and Dark: Science Vocabulary Puzzle",
    lessonTitleAr: "الضوء والظلام: لغز الكلمات العلمية",
    subtitleEn: "Discovering key words and the missing mystery word",
    subtitleAr: "اكتشاف الكلمات المفتاحية والكلمة اللغز الناقصة في شبكة الكلمات",
    keyWords: ["dark", "light", "pattern", "protect", "reflect", "shadow", "Sun", "torch"],
    sections: [
      {
        type: "activity",
        titleEn: "Activity 1.1: Wordsearch Mystery",
        titleAr: "النشاط 1.1: لغز شبكة الكلمات",
        contentEn: [
          "Find 7 of the key words hidden inside the letters grid.",
          "Which key word from page 14 is NOT in the wordsearch?",
        ],
        contentAr: [
          "ابحث عن 7 من الكلمات المفتاحية المخبأة داخل شبكة الحروف.",
          "ما هي الكلمة المفتاحية من صفحة 14 التي لم تكن موجودة في الشبكة؟",
        ],
        highlight: "Answer: 'torch' (المصباح اليدوي) is the missing word!",
      },
      {
        type: "scientific_thinking",
        titleEn: "Thinking and Working Scientifically",
        titleAr: "التفكير والعمل العلمي",
        contentEn: [
          "Scientists use clear vocabulary to describe their observations.",
          "Light travels from a source to our eyes so we can identify objects and shapes.",
        ],
        contentAr: [
          "يستخدم العلماء مفردات ومصطلحات محددة لوصف ما يشاهدونه ويدرسونه بدقة.",
          "ينتقل الضوء من المصدر إلى أعيننا لنتمكن من تمييز الأشياء والأشكال.",
        ],
      },
    ],
    interactiveComponentId: "wordsearch-light",
  },

  // Page 16
  {
    pageNumber: 16,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.2",
    lessonTitleEn: "Light Sources",
    lessonTitleAr: "مصادر الضوء",
    subtitleEn: "Identifying objects that give out their own light",
    subtitleAr: "التعرف على الأجسام التي تصدر ضوءاً من تلقاء نفسها",
    keyWords: ["light source", "torch", "candle", "lamp", "fire", "Sun"],
    sections: [
      {
        type: "getting_started",
        titleEn: "What is a light source?",
        titleAr: "ما هو مصدر الضوء؟",
        contentEn: [
          "A light source is an object that makes and gives out its own light.",
          "The Sun is our main natural light source. Other sources include lamps, candles, torches, and fires.",
        ],
        contentAr: [
          "مصدر الضوء هو جسم يصنع ويصدر ضوءه الخاص من تلقاء نفسه.",
          "الشمس هي مصدر الضوء الطبيعي الرئيسي لكوكب الأرض. ومن المصادر الأخرى: المصابيح، الشموع، المشاعل، والنيران.",
        ],
      },
      {
        type: "activity",
        titleEn: "Sources vs Non-sources",
        titleAr: "مصادر الضوء مقابل الأجسام غير المضيئة",
        contentEn: [
          "Are these light sources? Look at: Mirror, Apple, Book, Torch, Fire.",
          "Remember: A mirror is NOT a light source; it only reflects light from elsewhere!",
        ],
        contentAr: [
          "هل هذه الأشياء مصادر ضوء؟ تأمل: المرآة، التفاحة، الكتاب، المصباح، النار.",
          "تذكر جيداً: المرآة ليست مصدر ضوء، بل تعكس الضوء الساقط عليها من مصدر آخر!",
        ],
      },
    ],
    interactiveComponentId: "light-sources-sorter",
  },

  // Page 17
  {
    pageNumber: 17,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.2",
    lessonTitleEn: "The Sun and Safety",
    lessonTitleAr: "الشمس وقواعد السلامة الهامة",
    subtitleEn: "Protecting our eyes and observing outdoor shadows",
    subtitleAr: "حماية العينين وملاحظة تكون الظلال في الهواء الطلق",
    keyWords: ["Sun", "protect", "shadow", "safety"],
    sections: [
      {
        type: "safety",
        titleEn: "CRITICAL SAFETY RULE (p. 17)",
        titleAr: "قاعدة السلامة الحاسمة (صفحة 17)",
        contentEn: [
          "NEVER look directly at the Sun! It can damage your eyes and cause blindness.",
          "Always wear sunglasses or a wide hat on very sunny days.",
        ],
        contentAr: [
          "إياك أن تنظر مباشرة إلى قرص الشمس أبداً! فإن ذلك قد يتلف عينيك ويسبب أضراراً بالغة للبصر.",
          "احرص دائماً على ارتداء نظارة شمسية أو قبعة واقية في الأيام المشمسة شديدة السطوع.",
        ],
      },
      {
        type: "activity",
        titleEn: "Shadows in the Playground",
        titleAr: "الظلال في ساحة المدرسة",
        contentEn: [
          "When you stand in the sunlight, your body blocks the light and makes a dark shadow on the ground.",
          "Notice how your shadow moves whenever you jump, wave, or turn!",
        ],
        contentAr: [
          "عندما تقف في ضوء الشمس، يحجب جسمك أشعة الضوء، فيتكون ظل داكن على الأرض خلفك.",
          "لاحظ كيف يتحرك ظلك فوراً كلما قفزت أو لوحت بيدك أو استدرت!",
        ],
      },
    ],
    interactiveComponentId: "playground-shadows",
  },

  // Page 18
  {
    pageNumber: 18,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.3",
    lessonTitleEn: "Mirrors and Reflection",
    lessonTitleAr: "المرايا وانعكاس الضوء",
    subtitleEn: "How light bounces off shiny smooth surfaces",
    subtitleAr: "كيف يرتد الضوء عند سقوطه على الأسطح الملساء اللامعة",
    heroImage: "/src/assets/images/cambridge_mirror_exp_1790012295833.jpg",
    heroImageAlt: "Mirror light reflection investigation with torch and shiny objects",
    keyWords: ["mirror", "reflect", "shiny", "bounce", "surface"],
    sections: [
      {
        type: "getting_started",
        titleEn: "What is reflection?",
        titleAr: "ما هو الانعكاس؟",
        contentEn: [
          "When light hits a smooth, shiny surface like a mirror, it bounces off. This is called reflection.",
          "Shine a torch at a mirror. The light beam reflects and lands on the opposite wall or screen.",
        ],
        contentAr: [
          "عندما يسقط شعاع الضوء على سطح أملس ولامع كالمرآة، فإنه يرتد عنه في اتجاه آخر. ويسمى هذا الارتداد: الانعكاس.",
          "إذا سلطت مصباحاً يدوياً على مرآة مستوية، فإن شعاع الضوء يرتد ليضيء بقعة على الجدار المقابل.",
        ],
      },
      {
        type: "activity",
        titleEn: "Activity: Test Shiny Objects",
        titleAr: "نشاط: اختبار الأجسام اللامعة في عكس الضوء",
        contentEn: [
          "Test these objects: metal spoon, ceramic plate, mirror, glossy tile, plastic cup.",
          "Which objects reflect a clear patch of light onto the wall?",
        ],
        contentAr: [
          "اختبر هذه المواد: ملعقة معدنية، صحن خزفي، مرآة، بلاطة ملساء، كوب بلاستيكي.",
          "أي هذه الأجسام شكل بقعة ضوء واضحة ومنعكسة على الجدار؟",
        ],
      },
    ],
    interactiveComponentId: "interactive-mirror-ray",
  },

  // Page 19
  {
    pageNumber: 19,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.3",
    lessonTitleEn: "Using Mirrors to See Around Corners",
    lessonTitleAr: "استخدام المرايا للرؤية حول الزوايا",
    subtitleEn: "Periscopes and practical uses of reflection",
    subtitleAr: "البيروسكوب (منظار الأفق) والتطبيقات العملية لانعكاس الضوء",
    keyWords: ["periscope", "reflection", "angle", "view"],
    sections: [
      {
        type: "activity",
        titleEn: "Make a Periscope",
        titleAr: "صنع منظار الأفق (البيروسكوب)",
        contentEn: [
          "A periscope uses two mirrors set at 45-degree angles inside a long tube or box.",
          "Light reflects from the top mirror down to the bottom mirror, then into your eyes so you can see over walls!",
        ],
        contentAr: [
          "يعتمد البيروسكوب على مرآتين مثبتتين بزاوية 45 درجة داخل أنبوب أو صندوق كرتوني.",
          "يرتد الضوء من المرآة العلوية إلى المرآة السفلية ثم يدخل إلى عينيك، مما يمكنك من الرؤية فوق الحواجز والزوايا!",
        ],
      },
      {
        type: "questions",
        titleEn: "Questions",
        titleAr: "أسئلة وتطبيقات",
        contentEn: [
          "1. Why do car drivers use rear-view mirrors?",
          "2. Can you see your face in a rough wooden board? Why not?",
        ],
        contentAr: [
          "1. لماذا يستخدم سائقو السيارات المرايا الجانبية ومرآة الرؤية الخلفية؟",
          "2. هل تستطيع رؤية وجهك في لوح خشبي خشن؟ ولماذا لا يمكنك ذلك؟",
        ],
      },
    ],
    interactiveComponentId: "periscope-simulator",
  },

  // Page 20
  {
    pageNumber: 20,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.4",
    lessonTitleEn: "Darkness and Our Senses",
    lessonTitleAr: "الظلام وحواس الإنسان",
    subtitleEn: "How our other senses help us when there is no light",
    subtitleAr: "كيف تساعدنا بقية الحواس عند انعدام الضوء",
    keyWords: ["darkness", "senses", "hearing", "touch", "smell"],
    sections: [
      {
        type: "getting_started",
        titleEn: "What happens in total darkness?",
        titleAr: "ماذا يحدث في الظلام الدامس؟",
        contentEn: [
          "In complete darkness, our eyes cannot see anything because eyes require light.",
          "We rely on hearing sounds, touching textures with our hands, and smelling scents to explore.",
        ],
        contentAr: [
          "في الظلام التام الخالي من الضوء، تعجز أعيننا عن رؤية أي شيء؛ لأن العين تحتاج للضوء لترى.",
          "حينها نعتمد على حاسة السمع لسماع الأصوات، وحاسة اللمس لتحسس الأشياء، وحاسة الشم لتمييز المكان.",
        ],
      },
    ],
    interactiveComponentId: "senses-in-dark",
  },

  // Page 21
  {
    pageNumber: 21,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.4",
    lessonTitleEn: "Make a Dark Box",
    lessonTitleAr: "صنع صندوق الظلام واستقصاء الرؤية",
    subtitleEn: "Scientific proof that eyes cannot see in complete darkness",
    subtitleAr: "إثبات علمي عملي بأن العينين لا تستطيعان الرؤية في غياب الضوء",
    keyWords: ["dark box", "peep hole", "torch", "see"],
    sections: [
      {
        type: "activity",
        titleEn: "Investigation: Make a Dark Box (p. 21)",
        titleAr: "الاستقصاء العملي: صنع صندوق الظلام (صفحة 21)",
        contentEn: [
          "1. Place a small toy inside a cardboard shoe box and tape the lid shut tight.",
          "2. Cut a small peephole in the side of the box.",
          "3. Look through the hole: Can you see the toy inside? (No, it is pitch black!).",
          "4. Now open a small light flap or shine a torch inside: What happens? (You can see the toy clearly!).",
        ],
        contentAr: [
          "1. ضع لعبة صغيرة داخل صندوق أحذية كرتوني وثبّت الغطاء بإحكام بواسطة شريط لاصق لمنع تسرب الضوء.",
          "2. اصنع ثقباً صغيراً في جانب الصندوق لتنظر من خلاله.",
          "3. انظر عبر الثقب: هل تستطيع رؤية اللعبة بالداخل؟ (كلا، المكان مظلم تماماً!).",
          "4. الآن افتح نافذة صغيرة للضوء أو وجّه ضوء مصباح إلى الداخل: ماذا تلاحظ؟ (تظهر اللعبة بوضوح تام!).",
        ],
        highlight: "Scientific Rule: We cannot see in the dark without light!",
      },
    ],
    interactiveComponentId: "dark-box-simulator",
  },

  // Page 22
  {
    pageNumber: 22,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.5",
    lessonTitleEn: "Blocking Light",
    lessonTitleAr: "حجب الضوء والمواد المختلفة",
    subtitleEn: "Transparent, translucent, and opaque materials",
    subtitleAr: "المواد الشفافة، شبه الشفافة، والمعتمة",
    keyWords: ["opaque", "transparent", "translucent", "block"],
    sections: [
      {
        type: "getting_started",
        titleEn: "Do all materials block light?",
        titleAr: "هل تحجب جميع المواد الضوء؟",
        contentEn: [
          "Opaque: Blocks all light completely (wood, cardboard, tin can). It makes a dark shadow.",
          "Transparent: Lets almost all light pass through (clear glass, clean water).",
          "Translucent: Lets some light pass through but scatters it (tissue paper, frosted glass).",
        ],
        contentAr: [
          "معتم (Opaque): يحجب الضوء كلياً (كالخشب، والكرتون، وعلبة الصفيح) ويكوّن ظلاً داكناً واضحاً.",
          "شفاف (Transparent): يسمح لمعظم الضوء بالمرور من خلاله (كالزجاج الشفاف والماء النقي).",
          "شبه شفاف (Translucent): يسمح لبعض الضوء بالمرور ويشتته (كمنديل الورق والزجاج المغشى).",
        ],
      },
    ],
    interactiveComponentId: "materials-light-blocker",
  },

  // Page 23
  {
    pageNumber: 23,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.5",
    lessonTitleEn: "Shadow Puppets and Shapes",
    lessonTitleAr: "مسرح دمى الظل وتغير الأشكال",
    subtitleEn: "How shadow shapes match the blocking object",
    subtitleAr: "كيف يتطابق شكل الظل مع شكل الجسم الحاجب للضوء",
    keyWords: ["shadow puppet", "shape", "silhouette"],
    sections: [
      {
        type: "activity",
        titleEn: "Hand Shadow Puppets",
        titleAr: "صنع دمى الظل باليدين",
        contentEn: [
          "Hold your hands between a torch and a white wall.",
          "Make shapes like a flying bird, a barking dog, or a butterfly.",
          "The shape of the shadow matches the outline of your hands.",
        ],
        contentAr: [
          "ضع يديك بين مصباح يدوي وجدار أبيض ناصع.",
          "شكّل بيدك هيئة طائر محلق، أو كلب ينبح، أو فراشة.",
          "يتطابق محيط الظل المتكون بدقة مع الشكل الخارجي ليديك.",
        ],
      },
    ],
    interactiveComponentId: "shadow-puppet-theatre",
  },

  // Page 24
  {
    pageNumber: 24,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.5",
    lessonTitleEn: "Investigating Shadow Distance",
    lessonTitleAr: "استقصاء المسافة والظل (الإعداد العملي)",
    subtitleEn: "Setting up a fair test with torch, tin can, and screen",
    subtitleAr: "إعداد تجربة عادلة باستخدام المصباح وعلبة الصفيح وشاشة القياس",
    heroImage: "/src/assets/images/cambridge_shadow_lab_1790012321220.jpg",
    heroImageAlt: "Student measuring shadow of a can with a ruler on a marked track",
    keyWords: ["distance", "height", "pattern", "fair test", "measurement"],
    sections: [
      {
        type: "scientific_thinking",
        titleEn: "Thinking and Working Scientifically",
        titleAr: "التفكير والعمل العلمي",
        contentEn: [
          "Question: What happens to the size of a shadow when you move the torch further away?",
          "Apparatus: Torch, tin can (or solid object), ruler / tape measure, white screen.",
          "Fair test: Keep the can in the same spot; only change the distance of the torch!",
        ],
        contentAr: [
          "السؤال العلمي: ماذا يحدث لارتفاع الظل عندما نبعد المصباح مسافة أكبر عن العلبة؟",
          "الأدوات: مصباح يدوي، علبة صفيح (أو جسم معتم)، مسطرة قياس، شاشة بيضاء.",
          "الاختبار العادل: نثبت العلبة في مكانها، ونغير فقط المسافة بين المصباح والعلبة!",
        ],
      },
    ],
    interactiveComponentId: "shadow-lab",
  },

  // Page 25
  {
    pageNumber: 25,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "1.5",
    lessonTitleEn: "Measuring Shadow Heights and Finding Patterns",
    lessonTitleAr: "قياس ارتفاعات الظل واكتشاف النمط العلمي",
    subtitleEn: "Recording measurements at 20, 40, 60, 80, 100 cm",
    subtitleAr: "تسجيل القياسات عند المسافات 20، 40، 60، 80، 100 سم",
    keyWords: ["pattern", "results", "smaller", "farther", "graph"],
    sections: [
      {
        type: "activity",
        titleEn: "Measurement Table from Page 25",
        titleAr: "جدول القياسات من صفحة 25",
        contentEn: [
          "Distance from torch to can: 20 cm -> Shadow Height: 24 cm",
          "Distance from torch to can: 40 cm -> Shadow Height: 18 cm",
          "Distance from torch to can: 60 cm -> Shadow Height: 14 cm",
          "Distance from torch to can: 80 cm -> Shadow Height: 12 cm",
          "Distance from torch to can: 100 cm -> Shadow Height: 11 cm",
        ],
        contentAr: [
          "المسافة من المصباح إلى العلبة: 20 سم -> ارتفاع الظل: 24 سم",
          "المسافة من المصباح إلى العلبة: 40 سم -> ارتفاع الظل: 18 سم",
          "المسافة من المصباح إلى العلبة: 60 سم -> ارتفاع الظل: 14 سم",
          "المسافة من المصباح إلى العلبة: 80 سم -> ارتفاع الظل: 12 سم",
          "المسافة من المصباح إلى العلبة: 100 سم -> ارتفاع الظل: 11 سم",
        ],
        highlight: "Pattern: The farther the torch is from the object, the smaller the shadow becomes!",
      },
    ],
    interactiveComponentId: "shadow-lab",
  },

  // Page 26
  {
    pageNumber: 26,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "Review",
    lessonTitleEn: "Unit 1 Practice Questions",
    lessonTitleAr: "مراجعة الوحدة الأولى: أسئلة التدريب والتقييم",
    subtitleEn: "Testing knowledge of light sources, mirrors, and shadows",
    subtitleAr: "اختبار المفاهيم لمصادر الضوء والمرايا وتكون الظلال",
    keyWords: ["review", "test", "reflection", "source"],
    sections: [
      {
        type: "questions",
        titleEn: "Check Your Knowledge",
        titleAr: "تحقق من معلوماتك في الوحدة",
        contentEn: [
          "1. Circle the light sources in the list: Sun, Moon, Candle, Mirror, Fire.",
          "2. Why does a shiny spoon reflect light better than a piece of cardboard?",
          "3. What happens to your shadow when the sun is directly overhead at midday?",
        ],
        contentAr: [
          "1. ضع دائرة حول مصادر الضوء فقط: الشمس، القمر، الشمعة، المرآة، النار.",
          "2. لماذا تعكس الملعقة اللامعة الضوء بشكل أفضل من قطعة الورق المقوى؟",
          "3. ماذا يحدث لطول ظلك عندما تكون الشمس فوق رأسك تماماً في وقت الظهيرة؟",
        ],
      },
    ],
    interactiveComponentId: "unit1-quiz",
  },

  // Page 27
  {
    pageNumber: 27,
    unitNumber: 1,
    unitTitleEn: "Unit 1: Light and Dark",
    unitTitleAr: "الوحدة الأولى: الضوء والظلام",
    lessonNumber: "Review",
    lessonTitleEn: "Check Your Progress: Unit 1",
    lessonTitleAr: "تحقق من تقدمك: الوحدة الأولى",
    subtitleEn: "Self-assessment and curriculum mastery checklist",
    subtitleAr: "التقييم الذاتي وقائمة إتقان مهارات الوحدة الأولى",
    keyWords: ["progress", "reflection", "shadow", "source"],
    sections: [
      {
        type: "check_progress",
        titleEn: "I can...",
        titleAr: "أنا أستطيع الآن...",
        contentEn: [
          "I can identify light sources and explain that we need light to see things.",
          "I can explain that mirrors reflect light and describe how reflection works.",
          "I can explain how shadows are formed when light is blocked by an opaque object.",
          "I can describe the pattern between distance and shadow size.",
        ],
        contentAr: [
          "أستطيع تمييز مصادر الضوء وتوضيح حاجتنا للضوء لرؤية الأشياء.",
          "أستطيع شرح كيفية عكس المرايا للضوء وتفسير حدوث الانعكاس.",
          "أستطيع تفسير تكون الظلال عندما يحجب جسم معتم مسار الضوء.",
          "أستطيع وصف النمط العلمي بين المسافة وحجم الظل المتكون.",
        ],
      },
    ],
    interactiveComponentId: "unit1-progress-checklist",
  },

  // Page 28
  {
    pageNumber: 28,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "2.1",
    lessonTitleEn: "Rocks and Soil",
    lessonTitleAr: "الصخور والتربة",
    subtitleEn: "Exploring the materials that make up the ground beneath our feet",
    subtitleAr: "استكشاف المواد الطبيعية التي تكوّن الأرض تحت أقدامنا",
    keyWords: ["rock", "soil", "Earth", "grains", "texture", "pebble"],
    sections: [
      {
        type: "getting_started",
        titleEn: "Getting started",
        titleAr: "مع بدء الدرس",
        contentEn: [
          "What is beneath the grass in the park? What are mountains made of?",
          "Rocks and soils cover the surface of our planet Earth.",
        ],
        contentAr: [
          "ماذا يوجد تحت العشب الأخضر في الحديقة؟ ومما تتكون الجبال الشاهقة؟",
          "تغطي الصخور وأنواع التربة المختلفة سطح كوكبنا الأرض.",
        ],
      },
      {
        type: "safety",
        titleEn: "HYGIENE SAFETY RULE (p. 28)",
        titleAr: "إرشاد النظافة والسلامة (صفحة 28)",
        contentEn: [
          "Always wash your hands thoroughly with soap and water after handling soils and rocks in investigations.",
        ],
        contentAr: [
          "احرص دائماً على غسل يديك جيداً بالماء والصابون بعد لمس عينات الصخور وفحص التربة في التجارب.",
        ],
      },
      {
        type: "activity",
        titleEn: "Wordsearch Puzzle (p. 28)",
        titleAr: "لغز شبكة الكلمات لصخور الأرض (صفحة 28)",
        contentEn: [
          "Find key geology words hidden in the grid: Earth, rocks, soil, grains, pebble, hard.",
        ],
        contentAr: [
          "ابحث عن الكلمات الجيولوجية المخبأة في الشبكة: الأرض، الصخور، التربة، الحبيبات، الحصى، صلب.",
        ],
      },
    ],
    interactiveComponentId: "wordsearch-rocks",
  },

  // Page 29
  {
    pageNumber: 29,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "2.1",
    lessonTitleEn: "Properties of Rocks",
    lessonTitleAr: "خصائص الصخور وفحصها",
    subtitleEn: "Testing hardness, texture, permeability, and colour",
    subtitleAr: "اختبار الصلابة والملمس والنفاذية للماء وألوان الصخور",
    keyWords: ["hard", "soft", "permeable", "crystals", "scratch"],
    sections: [
      {
        type: "activity",
        titleEn: "Testing Rock Properties",
        titleAr: "استقصاء خصائص عينات الصخور",
        contentEn: [
          "Scratch test: Use a coin or wooden stick. Soft rocks like chalk scratch easily; hard rocks like granite do not scratch.",
          "Water drop test: Does water soak into the rock (permeable) or run off (impermeable)?",
        ],
        contentAr: [
          "اختبار الخدش: استخدم عملة معدنية أو عوداً خشبياً. الصخور الهشة كالطباشير تُخدش بسهولة، بينما الصخور الصلبة كالجرانيت تقاوم الخدش.",
          "اختبار قطرة الماء: هل تمتص الصخرة الماء (منفذة) أم تتدحرج القطرة دون امتصاص (غير منفذة)؟",
        ],
      },
    ],
    interactiveComponentId: "rock-properties-tester",
  },

  // Page 30
  {
    pageNumber: 30,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "2.2",
    lessonTitleEn: "Inside Planet Earth",
    lessonTitleAr: "في أعماق كوكب الأرض",
    subtitleEn: "Journey to the center: extreme heat and pressure",
    subtitleAr: "رحلة إلى المركز: درجات الحرارة الهائلة والضغط الشديد",
    keyWords: ["crust", "mantle", "outer core", "inner core", "temperature"],
    sections: [
      {
        type: "getting_started",
        titleEn: "What is deep inside the Earth?",
        titleAr: "ماذا يوجد في أعماق كوكب الأرض؟",
        contentEn: [
          "We live on the cool, solid outer surface called the Crust.",
          "As you go deeper into the Earth, it becomes extremely hot, hot enough to melt solid rock into magma!",
        ],
        contentAr: [
          "نحن نعيش على السطح الخارجي الصلب والبارد المسمى: القشرة الأرضية (Crust).",
          "كلما تعمقنا نزولاً نحو مركز الأرض، ترتفع درجات الحرارة بشكل هائل يكفي لصهر الصخور الصلبة إلى صهارة (Magma)!",
        ],
      },
    ],
    interactiveComponentId: "earth-layers-explorer",
  },

  // Page 31
  {
    pageNumber: 31,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "2.2",
    lessonTitleEn: "The Four Layers of Earth and Clay Model",
    lessonTitleAr: "طبقات الأرض الأربع وصنع نموذج الصلصال",
    subtitleEn: "Crust, Mantle, Outer Core, and Inner Core",
    subtitleAr: "القشرة، والوشاح، واللب الخارجي، واللب الداخلي",
    heroImage: "/src/assets/images/cambridge_earth_layers_1790012282491.jpg",
    heroImageAlt: "Earth 4 layers cross section and playdough model",
    keyWords: ["crust", "mantle", "outer core", "inner core", "clay model"],
    sections: [
      {
        type: "look_at_picture",
        titleEn: "The 4 Layers of Earth",
        titleAr: "طبقات الأرض الأربع بالتفصيل",
        contentEn: [
          "1. Crust: The thin, rocky outermost shell where we live (5–70 km thick).",
          "2. Mantle: The thickest layer of hot, heavy semi-solid rock (about 2,900 km thick).",
          "3. Outer Core: A liquid layer of super-hot molten iron and nickel (about 2,200 km thick).",
          "4. Inner Core: A solid ball of iron and nickel under enormous pressure, scorching hot like the Sun's surface (about 1,220 km radius).",
        ],
        contentAr: [
          "1. القشرة (Crust): الطبقة الخارجية الرقيقة والصلبة التي نعيش عليها (سمكها 5 إلى 70 كم).",
          "2. الوشاح (Mantle): أسمك طبقات الأرض، يتكون من صخور حارة وشبه منصهرة (سمكه نحو 2,900 كم).",
          "3. اللب الخارجي (Outer Core): طبقة سائلة من الحديد والنيكل المنصهرين بحرارة شديدة (سمكها نحو 2,200 كم).",
          "4. اللب الداخلي (Inner Core): كرة صلبة فائقة الكثافة من الحديد والنيكل تحت ضغط هائل وحرارة تعادل سطح الشمس (نصف قطرها نحو 1,220 كم).",
        ],
      },
      {
        type: "activity",
        titleEn: "Playdough Model Investigation (p. 31)",
        titleAr: "نشاط نموذج الصلصال الملون (صفحة 31)",
        contentEn: [
          "Roll a small yellow ball for the Inner Core.",
          "Wrap red clay around it for the Outer Core, then thick orange clay for the Mantle.",
          "Add a thin blue/green layer for the Crust.",
          "Cut the ball in half with a plastic knife to reveal all 4 concentric layers!",
        ],
        contentAr: [
          "اصنع كرة صغيرة من الصلصال الأصفر لتمثيل اللب الداخلي.",
          "غلّفها بطبقة صلصال أحمر لتمثيل اللب الخارجي، ثم طبقة برتقالية سميكة لتمثيل الوشاح.",
          "أضف قشرة رقيقة زرقاء وخضراء لتمثيل القشرة الأرضية.",
          "اقطع الكرة إلى نصفين بسكين بلاستيكي لتشاهد الطبقات الأربع متحدة المركز!",
        ],
      },
    ],
    interactiveComponentId: "earth-layers-explorer",
  },

  // Page 32
  {
    pageNumber: 32,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "2.3",
    lessonTitleEn: "Identifying Rocks (Dichotomous Key)",
    lessonTitleAr: "التعرف على الصخور (المفتاح الثنائي)",
    subtitleEn: "Using scientific clues to classify 8 specific rocks",
    subtitleAr: "استخدام الأدلة العلمية لتصنيف الصخور الثمانية المعتمدة في المنهج",
    heroImage: "/src/assets/images/cambridge_rocks_lab_1790012305747.jpg",
    heroImageAlt: "8 rock specimens labeled on laboratory trays with key",
    keyWords: ["Granite", "Basalt", "Chalk", "Limestone", "Slate", "Marble", "Sandstone", "Pumice"],
    sections: [
      {
        type: "activity",
        titleEn: "The 8 Curriculum Rocks Key",
        titleAr: "مفتاح تصنيف صخور المنهج الثمانية",
        contentEn: [
          "Follow the branching questions: Is the rock white or coloured? Can it be scratched by a fingernail? Does it float? Does it have visible interlocking crystals?",
          "Granite: Hard, speckled pink/grey/black crystals.",
          "Basalt: Dark, heavy volcanic rock with tiny crystals.",
          "Chalk: White, soft, powdery rock.",
          "Limestone: Grey/cream with visible shell fragments.",
          "Slate: Dark, splits into flat sheets for roof tiles.",
          "Marble: White or swirled, hard metamorphic rock with sparkling crystals.",
          "Sandstone: Gritty yellow/red made of sand grains cemented together.",
          "Pumice: Pale, sponge-like rock full of gas bubbles that floats on water!",
        ],
        contentAr: [
          "اتبع الأسئلة المتفرعة: هل الصخرة بيضاء أم ملونة؟ هل تُخدش بالظفر؟ هل تطفو فوق الماء؟ هل بها بلورات متشابكة؟",
          "الجرانيت (Granite): صلب، مرقط ببلورات وردية ورمادية وسوداء.",
          "البازلت (Basalt): داكن، ثقيل وبركاني ببلورات دقيقة للغاية.",
          "الطباشير (Chalk): أبيض، طري وبودري يسهل تفتيته وخدشه.",
          "الحجر الجيري (Limestone): رمادي أو بيج ويحتوي غالباً على أصداف أحفورية.",
          "الصلصال المتحول/الإردواز (Slate): داكن وينقسم لصفائح مسطحة لصنع سقوف المنازل.",
          "الرخام (Marble): أبيض أو متموج، صلب ولامع ببلورات براقة.",
          "الحجر الرملي (Sandstone): خشن الملمس بلون رملي أو أحمر مكون من حبيبات الرمل.",
          "الخفاف (Pumice): صخر إسفنجي مسامي خفيف جداً يطفو فوق سطح الماء!",
        ],
      },
    ],
    interactiveComponentId: "rock-classifier-key",
  },

  // Page 33
  {
    pageNumber: 33,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "2.4",
    lessonTitleEn: "The Rock Cycle",
    lessonTitleAr: "دورة الصخور الطبيعية المستمرة",
    subtitleEn: "How rocks change form over millions of years",
    subtitleAr: "كيف تتغير وتتحول الصخور عبر ملايين السنين",
    keyWords: ["rock cycle", "igneous", "sedimentary", "metamorphic", "magma", "weathering"],
    sections: [
      {
        type: "look_at_picture",
        titleEn: "The 3 Major Rock Families",
        titleAr: "عائلات الصخور الثلاث الرئيسية",
        contentEn: [
          "1. Igneous Rocks: Formed when molten magma or lava cools and hardens (e.g. Granite, Basalt, Pumice).",
          "2. Sedimentary Rocks: Formed from layers of grains, mud, and sand pressed and cemented together over time (e.g. Sandstone, Limestone, Chalk).",
          "3. Metamorphic Rocks: Formed when existing rocks are transformed by intense underground heat and pressure (e.g. Marble from Limestone, Slate from Shale).",
        ],
        contentAr: [
          "1. الصخور النارية (Igneous): تتكون عند تبرد وتصلب الصهارة (الماجما) أو الحمم البركانية (مثل الجرانيت، البازلت، الخفاف).",
          "2. الصخور الرسوبية (Sedimentary): تتكون من تراكم وتضاغط طبقات الرمال والفتات والأصداف وترابطها عبر الزمن (مثل الحجر الرملي، الجيري، الطباشير).",
          "3. الصخور المتحولة (Metamorphic): تتكون عندما تتعرض الصخور القديمة لحرارة باطنية وضغط هائل دون أن تنصهر (مثل الرخام المتحول عن الحجر الجيري، والإردواز).",
        ],
      },
    ],
    interactiveComponentId: "rock-cycle-interactive",
  },

  // Page 34
  {
    pageNumber: 34,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "2.5",
    lessonTitleEn: "Fossils Inside Rocks",
    lessonTitleAr: "الأحافير داخل الصخور",
    subtitleEn: "Traces and remains of prehistoric life preserved in sedimentary rocks",
    subtitleAr: "آثار وبقايا الكائنات الحية القديمة المحفوظة في الصخور الرسوبية",
    keyWords: ["fossil", "ammonite", "dinosaur", "imprint", "sediment"],
    sections: [
      {
        type: "getting_started",
        titleEn: "What is a fossil?",
        titleAr: "ما هي الأحفورة؟",
        contentEn: [
          "A fossil is the preserved remains or impression of a plant or animal that lived millions of years ago.",
          "Fossils are almost always found inside sedimentary rocks like limestone and shale.",
        ],
        contentAr: [
          "الأحفورة هي بقايا أو آثار محفوظة لكائن حي (نبات أو حيوان) عاش على الأرض قبل ملايين السنين.",
          "توجد الأحافير دائماً في الصخور الرسوبية كالحجر الجيري؛ لأن الحرارة في الصخور النارية تدمر الكائنات الحية.",
        ],
      },
      {
        type: "activity",
        titleEn: "Make a Dough Fossil Imprint",
        titleAr: "نشاط صنع طبعة أحفورة من العجين",
        contentEn: [
          "Press a seashell or toy dinosaur footprint into soft clay, then pour plaster or let it dry.",
          "This simulates how ancient creatures left footprints in soft mud that turned into rock.",
        ],
        contentAr: [
          "اضغط صدفة بحرية أو قدم لعبة ديناصور في صلصال طري، ثم اسكب الجبس أو دعه يجف.",
          "يحاكي هذا كيف تركت المخلوقات القديمة آثار أقدامها في الطين الرطب الذي تحول لصخر رسوبي مع مرور ملايين السنين.",
        ],
      },
    ],
    interactiveComponentId: "fossils-explorer",
  },

  // Page 35
  {
    pageNumber: 35,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "2.5",
    lessonTitleEn: "Soil Types and Drainage",
    lessonTitleAr: "أنواع التربة ونفاذية تصريف الماء",
    subtitleEn: "Sandy soil, clay soil, and rich garden soil with humus",
    subtitleAr: "التربة الرملية، والتربة الطينية، وتربة الحدائق الغنية بالدبال",
    keyWords: ["soil", "drainage", "sand", "clay", "humus"],
    sections: [
      {
        type: "scientific_thinking",
        titleEn: "Soil Drainage Investigation",
        titleAr: "استقصاء تصريف الماء في التربة",
        contentEn: [
          "Sandy soil has large particles; water drains through very quickly.",
          "Clay soil has tiny dense particles; water sits on top and drains very slowly.",
          "Loam / Garden soil has a healthy mix with organic humus, holding just the right amount of moisture for plant roots.",
        ],
        contentAr: [
          "التربة الرملية حبيباتها كبيرة ومفككة، فيمر الماء من خلالها بسرعة كبيرة.",
          "التربة الطينية حبيباتها دقيقة ومتلاصقة، فيحتجز الماء فوقها ويصرف ببطء شديد.",
          "التربة الطميية (تربة الحديقة) خليط متوازن مع الدبال العضوي، تحتفظ بالرطوبة المناسبة لنمو جذور النباتات.",
        ],
      },
    ],
    interactiveComponentId: "soil-drainage-lab",
  },

  // Page 36
  {
    pageNumber: 36,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "2.5",
    lessonTitleEn: "Building Materials: Natural vs Man-made",
    lessonTitleAr: "مواد البناء: مواد طبيعية ومواد من صنع الإنسان",
    subtitleEn: "Sorting materials used in buildings, walls, and bridges",
    subtitleAr: "تصنيف المواد المستخدمة في المباني والجدران والجسور",
    keyWords: ["natural", "man-made", "concrete", "brick", "timber", "stone"],
    sections: [
      {
        type: "activity",
        titleEn: "Natural vs Man-made Sorting (p. 36)",
        titleAr: "تصنيف مواد البناء من صفحة 36",
        contentEn: [
          "Natural materials: Used directly from nature without chemical manufacturing (e.g. natural stone wall, timber wood deck, slate roof tiles).",
          "Man-made materials: Manufactured and processed by humans in factories (e.g. concrete paving, clay brick wall, plastic window frame, steel bridge beam).",
        ],
        contentAr: [
          "المواد الطبيعية: مواد نأخذها من الطبيعة مباشرة دون تصنيع كيميائي (مثل جدار الصخور الطبيعية، الأرضية الخشبية، ألواح الإردواز للأسطح).",
          "المواد المصنوعة بشرياً: مواد قام الإنسان بمعالجتها وتصنيعها في المصانع (مثل الممشى الخرساني، جدار الطوب المحروق، إطار النافذة البلاستيكي، دعامات الفولاذ للجسور).",
        ],
      },
    ],
    interactiveComponentId: "building-materials-sorter",
  },

  // Page 37
  {
    pageNumber: 37,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "Review",
    lessonTitleEn: "Unit 2 Practice Questions",
    lessonTitleAr: "مراجعة الوحدة الثانية: أسئلة التدريب والتقييم",
    subtitleEn: "Testing knowledge of rocks, Earth's layers, and building materials",
    subtitleAr: "اختبار المفاهيم لطبقات الأرض والصخور ومواد البناء",
    keyWords: ["review", "test", "crust", "igneous", "sedimentary"],
    sections: [
      {
        type: "questions",
        titleEn: "Unit 2 Questions",
        titleAr: "أسئلة مراجعة الوحدة الثانية",
        contentEn: [
          "1. Name the four layers of the Earth starting from the outside.",
          "2. Which rock floats on water? Why does it float?",
          "3. Why is granite a good rock to use for kitchen countertops and steps?",
          "4. Is a brick wall natural or man-made? Explain why.",
        ],
        contentAr: [
          "1. اذكر طبقات الأرض الأربع بالترتيب بدءاً من الطبقة الخارجية.",
          "2. أي الصخور يطفو فوق الماء؟ ولماذا يطفو؟",
          "3. لماذا يعد الجرانيت صخراً ممتازاً لصنع أسطح المطابخ ودرجات السلالم؟",
          "4. هل جدار الطوب مادة طبيعية أم من صنع الإنسان؟ فسر إجابتك.",
        ],
      },
    ],
    interactiveComponentId: "unit2-quiz",
  },

  // Page 38
  {
    pageNumber: 38,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "Review",
    lessonTitleEn: "Check Your Progress: Unit 2",
    lessonTitleAr: "تحقق من تقدمك: الوحدة الثانية",
    subtitleEn: "Self-assessment and curriculum mastery checklist",
    subtitleAr: "التقييم الذاتي وقائمة إتقان مهارات الوحدة الثانية",
    keyWords: ["progress", "Earth", "layers", "rocks"],
    sections: [
      {
        type: "check_progress",
        titleEn: "I can...",
        titleAr: "أنا أستطيع الآن...",
        contentEn: [
          "I can name and describe the four layers of the Earth.",
          "I can use a scientific identification key to classify different rocks.",
          "I can explain how rocks change in the rock cycle.",
          "I can distinguish between natural and man-made materials.",
        ],
        contentAr: [
          "أستطيع تسمية ووصف طبقات الأرض الأربع وخصائصها.",
          "أستطيع استخدام مفتاح تصنيف علمي للتعرف على الصخور المختلفة.",
          "أستطيع شرح كيفية تحول الصخور في دورة الصخور الطبيعية.",
          "أستطيع التمييز بين مواد البناء الطبيعية وتلك المصنوعة بشرياً.",
        ],
      },
    ],
    interactiveComponentId: "unit2-progress-checklist",
  },

  // Page 39
  {
    pageNumber: 39,
    unitNumber: 2,
    unitTitleEn: "Unit 2: Earth and its Rocks",
    unitTitleAr: "الوحدة الثانية: كوكب الأرض وصخوره",
    lessonNumber: "Glossary",
    lessonTitleEn: "Science Glossary and Visual Dictionary",
    lessonTitleAr: "قاموس المصطلحات العلمية المصور والفهرس الشامل",
    subtitleEn: "Complete bilingual directory of Grade 3 science terminology",
    subtitleAr: "الدليل الشامل ثنائي اللغة لجميع مصطلحات العلوم للصف الثالث",
    keyWords: ["glossary", "vocabulary", "definition", "science"],
    sections: [
      {
        type: "summary",
        titleEn: "Master Scientific Glossary (pp. 14–39)",
        titleAr: "القاموس العلمي الشامل (الصفحات 14–39)",
        contentEn: [
          "Browse, search, and listen to all 24 science keywords across Unit 1 and Unit 2.",
          "Each word includes phonetics, clear child-friendly definitions, bilingual explanations, and visual illustrations.",
        ],
        contentAr: [
          "استعرض وابحث واستمع لجميع المصطلحات العلمية الـ 24 في الوحدتين الأولى والثانية.",
          "تتضمن كل كلمة النطق الصوتي الصحيح، والتعريف المبسط، والأمثلة التوضيحية، والرسومات العلمية الملونة.",
        ],
      },
    ],
    interactiveComponentId: "glossary-atlas",
  },
];

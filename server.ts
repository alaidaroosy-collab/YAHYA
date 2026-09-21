import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", geminiConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

// TTS Endpoint using gemini-3.1-flash-tts-preview
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured",
        fallback: true,
      });
    }

    // Call gemini-3.1-flash-tts-preview
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text.trim() }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType ||
      "audio/pcm;rate=24000";

    if (!base64Audio) {
      return res.status(502).json({
        error: "No audio generated from model",
        fallback: true,
      });
    }

    return res.json({
      audio: base64Audio,
      mimeType,
      voice,
    });
  } catch (error: any) {
    console.error("TTS generation error:", error?.message || error);
    return res.status(500).json({
      error: error?.message || "Failed to generate speech",
      fallback: true,
    });
  }
});

// Interactive Tutor grounded strictly in Grade 3 curriculum
const GRADE_3_CURRICULUM_SYSTEM_PROMPT = `
You are a friendly, encouraging Grade 3 Science Tutor for an 8-year-old student.
STRICT RULE: You must answer EXCLUSIVELY using the concepts, terms, and explanations present in the 26 uploaded pages of the Grade 3 Cambridge Science curriculum:
- Unit 1: Light and Shadows (What is light, Shadows, Reflection from mirrors, Seeing things/dark box, Investigating shadows and distance).
- Unit 2: Earth and Rocks (The Earth, Model Earth with 4 layers: Crust, Mantle, Outer Core, Inner Core; Identifying Rocks key: Chalk, Limestone, Marble, Granite, Basalt, Sandstone, Mudstone, Slate; The Rock Cycle; Rocks as building materials: Natural vs Human-made).

CRITICAL CONSTRAINT: Do NOT introduce external physics formulas, high-level terminology, or unrequested facts. Keep answers simple, cheerful, and bilingual (Arabic first with English key terms). Format your responses with bullet points and friendly emojis.
`;

app.post("/api/ask-tutor", async (req, res) => {
  try {
    const { question, lessonContext } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        replyAr: "أهلاً بك يا بطل! لم يتم ضبط مفتاح Gemini بعد في بيئة التشغيل، ولكن جميع محتويات كتابك موجودة في الدروس والتجارب التفاعلية!",
        replyEn: "Welcome! You can explore all lesson pages and interactive simulations directly.",
        fallback: true,
      });
    }

    const prompt = `Lesson context: ${lessonContext || "Grade 3 Science"}\nStudent's question: "${question.trim()}".\nExplain simply for an 8-year-old strictly following the textbook pages.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: GRADE_3_CURRICULUM_SYSTEM_PROMPT,
        temperature: 0.3,
      },
    });

    const reply = response.text || "أحسنت السؤال! راجع صفحة الدرس لاكتشاف المزيد.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Ask tutor error:", error?.message || error);
    return res.status(500).json({
      reply: "حدث خطأ في الاتصال بالمعلم الذكي. يمكنك مراجعة بطاقات الدرس والتجارب مباشرة!",
      error: error?.message,
    });
  }
});

// Experiment Analysis Endpoint (Photo/Video Frame inspection)
app.post("/api/analyze-experiment", async (req, res) => {
  try {
    const { imageBase64, experimentType, notes } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        analysis: "صورة رائعة لتجربتك العلمية! تأكد من تطابقها مع خطوات كتاب العلوم.",
        fallback: true,
      });
    }

    // Strip header if data URL
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `This is a student's photo/frame of their Grade 3 science experiment: "${experimentType || "science experiment"}". Notes: "${notes || ""}".
Analyze it kindly according to Grade 3 textbook criteria:
1. What do you see? (e.g. model Earth layers, shadow formation, mirror reflection, rock specimen)
2. Praise the student's scientific effort.
3. Provide 1 gentle suggestion directly from the book (e.g., page 31: make layers clearer, or page 25: measure shadow height).
Respond in gentle Arabic with key English terms.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg",
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction: GRADE_3_CURRICULUM_SYSTEM_PROMPT,
      },
    });

    return res.json({ analysis: response.text || "عمل علمي متميز!" });
  } catch (error: any) {
    console.error("Experiment analysis error:", error?.message || error);
    return res.status(500).json({
      analysis: "شكراً لمشاركتك التجربة! تبدو رائعة ومطابقة للخطوات العلمية.",
      error: error?.message,
    });
  }
});

// Video Generation / Storyboard Endpoint
app.post("/api/generate-lesson-video", async (req, res) => {
  try {
    const { lessonTopic } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY required",
        fallback: true,
      });
    }

    // Generate animation scene description for student
    const prompt = `Create an educational 3-scene visual storyboard animation script for an 8-year-old child learning Grade 3 topic: "${lessonTopic}".
Strictly follow the book pages.
Output JSON with:
{
  "scenes": [
    { "sceneNumber": 1, "visualAr": "...", "visualEn": "...", "audioNarrationAr": "...", "audioNarrationEn": "..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Video gen error:", error?.message || error);
    return res.status(500).json({ error: error?.message });
  }
});

// Setup Vite middleware or static serving
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp().catch((err) => {
  console.error("Error starting server:", err);
});

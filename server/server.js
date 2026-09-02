import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/db.js";
import Post from "./Post.js";
import Visitor from "./Visitor.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import sanitizeHtml from "sanitize-html";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.set("trust proxy", 1);

// 1. HTTP Xavfsizlik sarlavhalari (Helmet)
app.use(helmet());

// 2. CORS sozlamalari
// 2. CORS sozlamalari
const allowedOrigins = [
  "https://akbaralix.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman/Server so'rovi (!origin) yoki ruxsat etilgan domenlar
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(null, false); // Error otmasdan, shunchaki taqiqlaymiz
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Preflight (OPTIONS) so'rovlariga javob berish
app.options("*", cors());
// 3. JSON body parser
app.use(express.json({ limit: "10mb" }));

// MongoDB ga ulanish
connectDB();

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }

  const cfIp = req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp.trim()) {
    return cfIp.trim();
  }

  return req.ip || req.socket?.remoteAddress || "unknown";
};

const getLocationFromHeaders = (req) => ({
  country:
    (typeof req.headers["x-vercel-ip-country"] === "string" &&
      req.headers["x-vercel-ip-country"]) ||
    (typeof req.headers["cf-ipcountry"] === "string" &&
      req.headers["cf-ipcountry"]) ||
    "",
  region:
    (typeof req.headers["x-vercel-ip-country-region"] === "string" &&
      req.headers["x-vercel-ip-country-region"]) ||
    "",
  city:
    (typeof req.headers["x-vercel-ip-city"] === "string" &&
      req.headers["x-vercel-ip-city"]) ||
    "",
});

const parseUserAgent = (userAgent = "") => {
  const normalized = userAgent.toLowerCase();

  let browser = "Unknown";
  if (normalized.includes("edg/")) browser = "Edge";
  else if (normalized.includes("chrome/")) browser = "Chrome";
  else if (normalized.includes("firefox/")) browser = "Firefox";
  else if (normalized.includes("safari/")) browser = "Safari";
  else if (normalized.includes("opr/") || normalized.includes("opera"))
    browser = "Opera";

  let os = "Unknown";
  if (normalized.includes("windows nt")) os = "Windows";
  else if (normalized.includes("android")) os = "Android";
  else if (normalized.includes("iphone") || normalized.includes("ipad"))
    os = "iOS";
  else if (normalized.includes("mac os x")) os = "macOS";
  else if (normalized.includes("linux")) os = "Linux";

  let deviceType = "Desktop";
  if (normalized.includes("tablet") || normalized.includes("ipad")) {
    deviceType = "Tablet";
  } else if (
    normalized.includes("mobi") ||
    normalized.includes("iphone") ||
    normalized.includes("android")
  ) {
    deviceType = "Mobile";
  }

  return { browser, os, deviceType };
};

// 4. Rate Limiter (Hujumlardan himoya)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 5, // 15 daqiqada maksimal 5 marta kirishga urinish
  message: {
    success: false,
    message:
      "Juda ko'p xato urinishlar! Iltimos, 15 daqiqadan so'ng qayta urinib ko'ring. ❌",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 15 daqiqada maksimal 30 ta post yaratish/o'chirish
  message: {
    success: false,
    message:
      "Juda ko me'yordan ortiq so'rov yuborildi. Iltimos bir oz kuting. ❌",
  },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

app.use("/api/", apiLimiter);

// 5. JWT Authentication Middleware (Backend Avtorizatsiyasini tekshirish)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Ruxsat etilmadi! Avtorizatsiya belgisi (token) yo'q. ❌",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key_2026_safe",
    );
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message:
        "Yaroqsiz yoki muddati o'tgan token! Qaytadan tizimga kiring. ❌",
    });
  }
};

// 🔐 6. ADMIN LOGIN ENDPOINT (Xavfsiz Kirish)
app.post("/api/admin/login", loginLimiter, async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "5879";

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Parol kiritilishi shart! ❌",
      });
    }

    if (password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Xato parol! ❌",
      });
    }

    // Parol to'g'ri bo'lsa, JWT token yaratamiz (24 soat amal qiladi)
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET || "fallback_secret_key_2026_safe",
      { expiresIn: "24h" },
    );

    res.status(200).json({
      success: true,
      message: "Xush kelibsiz! 🔓",
      token,
    });
  } catch (error) {
    console.error("Login xatoligi:", error);
    res.status(500).json({
      success: false,
      message: "Serverda xatolik yuz berdi! ❌",
    });
  }
});

// 🔍 7. TOKEN VERIFY ENDPOINT (Token haqiqiyligini tekshirish)
app.get("/api/admin/verify", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, valid: true });
});

app.post("/api/visitor/track", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const {
      sessionId = "",
      currentPath = "/",
      userAgent = "",
      platform = "",
      language = "",
      screen = "",
      timezone = "",
    } = req.body || {};

    const safeIp = ip === "unknown" ? `unknown-${sessionId || Date.now()}` : ip;
    const location = getLocationFromHeaders(req);
    const parsed = parseUserAgent(userAgent);
    const now = new Date();

    const visitor = await Visitor.findOneAndUpdate(
      { ip: safeIp },
      {
        $set: {
          sessionId,
          lastSeen: now,
          lastPath: currentPath || "/",
          userAgent,
          browser: parsed.browser,
          os: parsed.os,
          deviceType: parsed.deviceType,
          platform,
          language,
          screen,
          timezone,
          country: location.country,
          region: location.region,
          city: location.city,
        },
        $setOnInsert: { ip: safeIp, firstSeen: now },
        $inc: { visitCount: 1 },
      },
      { upsert: true, new: true },
    );

    res.status(201).json({ success: true, data: visitor });
  } catch (error) {
    console.error("Visitor track xatoligi:", error);
    res.status(500).json({
      success: false,
      message: "Visitor ma'lumotlarini saqlashda xatolik yuz berdi!",
      error: error.message,
    });
  }
});

app.post("/api/visitor/session", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const {
      sessionId = "",
      durationMs = 0,
      currentPath = "/",
      userAgent = "",
      platform = "",
      language = "",
      screen = "",
      timezone = "",
    } = req.body || {};

    const safeIp = ip === "unknown" ? `unknown-${sessionId || Date.now()}` : ip;
    const safeDuration = Number(durationMs) || 0;
    const location = getLocationFromHeaders(req);
    const parsed = parseUserAgent(userAgent);
    const now = new Date();

    const visitor = await Visitor.findOneAndUpdate(
      { ip: safeIp },
      {
        $set: {
          sessionId,
          lastSeen: now,
          lastPath: currentPath || "/",
          userAgent,
          browser: parsed.browser,
          os: parsed.os,
          deviceType: parsed.deviceType,
          platform,
          language,
          screen,
          timezone,
          country: location.country,
          region: location.region,
          city: location.city,
          lastSessionDurationMs: safeDuration,
        },
        $setOnInsert: { ip: safeIp, firstSeen: now },
        $inc: { totalDurationMs: safeDuration },
      },
      { upsert: true, new: true },
    );

    res.status(200).json({ success: true, data: visitor });
  } catch (error) {
    console.error("Visitor session xatoligi:", error);
    res.status(500).json({
      success: false,
      message: "Visitor seansi yangilashda xatolik yuz berdi!",
      error: error.message,
    });
  }
});

app.get("/api/visitor", authMiddleware, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ lastSeen: -1 });
    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors,
    });
  } catch (error) {
    console.error("Visitorlarni olishda xatolik:", error);
    res.status(500).json({
      success: false,
      message: "Visitor ma'lumotlarini olishda xatolik yuz berdi!",
      error: error.message,
    });
  }
});

// 📝 8. YANGI MAQOLA YARATISH (CREATE) - FAKAT HAVSIZ ADMIN UCHUN
app.post("/api/post", authMiddleware, writeLimiter, async (req, res) => {
  try {
    const { sarlavha, rasm, matn, data, sluge } = req.body;

    // Ma'lumotlarni validatsiya qilish
    if (!sarlavha || typeof sarlavha !== "string" || !sarlavha.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Sarlavha kiritilishi shart!" });
    }

    if (!rasm || typeof rasm !== "string" || !rasm.trim()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Rasm URL-manzili kiritilishi shart!",
        });
    }

    // XSS Hujumlaridan himoyalash uchun HTML tozalash
    const tozalanganMatn = sanitizeHtml(
      matn ? matn.replace(/&nbsp;/g, " ") : "",
      {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "img",
          "iframe",
          "h1",
          "h2",
          "h3",
          "h4",
          "u",
          "span",
          "blockquote",
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ["src", "alt", "title", "width", "height"],
          iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
          span: ["style", "class"],
          a: ["href", "name", "target", "rel"],
        },
        allowedSchemesByTag: {
          img: ["data", "http", "https"],
          iframe: ["http", "https"],
        },
      },
    );

    const cleanSarlavha = sanitizeHtml(sarlavha, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // Yangi post ob'ektini yaratamiz
    const newPost = new Post({
      sarlavha: cleanSarlavha,
      rasm: rasm.trim(),
      matn: tozalanganMatn,
      data: data || new Date().toISOString(),
      sluge: sluge || Math.random().toString(36).substring(2, 9),
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      message: "Maqola muvaffaqiyatli saqlandi! 🎉",
      data: savedPost,
    });
  } catch (error) {
    console.error("Saqlashda xatolik:", error);
    res.status(500).json({
      success: false,
      message: "Serverda xatolik yuz berdi! ❌",
      error: error.message,
    });
  }
});

// 📖 9. BARCHA MAQOLALARNI OLISH (PUBLIC READ)
app.get("/api/post", async (req, res) => {
  try {
    const posts = await Post.find().sort({ data: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Ma'lumotlarni olishda xatolik:", error);
    res.status(500).json({
      success: false,
      message: "Ma'lumotlarni yuklashda xatolik yuz berdi! ❌",
      error: error.message,
    });
  }
});

// 👁️ 10. KO'RILDI SONINI OSHIRISH (PUBLIC VIEW)
app.post("/api/post/view/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Yaroqsiz post ID ❌" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { korildi: 1 } },
      { returnDocument: "after" },
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post topilmadi" });
    }

    res.status(200).json({ success: true, views: updatedPost.korildi });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
});

// 🗑️ 11. MAQOLANI O'CHIRISH (DELETE) - FAQAT HAVSIZ ADMIN UCHUN
app.delete("/api/post/:id", authMiddleware, writeLimiter, async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Yaroqsiz ID formati! ❌" });
    }

    const ocharotganPost = await Post.findByIdAndDelete(postId);

    if (!ocharotganPost) {
      return res.status(404).json({ message: "Maqola topilmadi! ❌" });
    }

    res
      .status(200)
      .json({ success: true, message: "Maqola muvaffaqiyatli o'chirildi! 🎉" });
  } catch (err) {
    console.error("O'chirishda xatolik:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🖥️ Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda xavfsiz rejimda ishladi... 🚀`);
});

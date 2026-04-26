import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";
import router from "./routes";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// Configure CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);

app.all("/api/auth/*splat", toNodeHandler(auth)); // api/auth ထဲက အကုန် တာဝန်ယူမယ်

app.use(express.json());

app.use(router)
/*
app.get("/", authGuard, (req, res) => {
  res.send("Hello FullStack Developer!");
});

// /api/me ဆိုတာကို အသုံးပြုပြီး authentication ကို ဖြတ်သန်းပြီး data ကို ယူပါမယ်
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});
*/


export default app;

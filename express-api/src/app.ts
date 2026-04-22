import express from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";
import { authGuard } from "./middleware/auth";

const app = express();

// Configure CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth)); // api/auth ထဲက အကုန် တာဝန်ယူမယ်

app.use(express.json());

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
export default app;

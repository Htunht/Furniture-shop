import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    (req as any).session = session;
    next();
  } catch (error) {
    console.log("Auth guard error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

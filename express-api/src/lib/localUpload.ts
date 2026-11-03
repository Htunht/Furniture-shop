import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import config from "../config";

export const uploadsDir = path.join(process.cwd(), "uploads");

const allowedMimeTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadsDir),
  filename: (_req, file, callback) =>
    callback(null, `${randomUUID()}${allowedMimeTypes[file.mimetype] ?? ".bin"}`),
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes[file.mimetype]) {
      callback(new Error("Only JPEG, PNG, and WebP images are supported."));
      return;
    }
    callback(null, true);
  },
});

function isLocalhost(hostname: string) {
  return ["localhost", "127.0.0.1", "::1"].includes(
    hostname.replace(/^\[|\]$/g, "").toLowerCase(),
  );
}

export function localOnlyUploads(req: Request, res: Response, next: NextFunction) {
  const hostname = req.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (
    config.nodeEnv !== "development" ||
    !isLocalhost(hostname)
  ) {
    return res.status(403).json({ error: "Image uploads are only available on localhost." });
  }

  const origin = req.get("origin");
  if (origin) {
    try {
      if (!isLocalhost(new URL(origin).hostname)) {
        return res.status(403).json({ error: "Image uploads are only available on localhost." });
      }
    } catch {
      return res.status(403).json({ error: "Image uploads are only available on localhost." });
    }
  }

  next();
}

export const localOnlyUpload = localOnlyUploads;

export function getLocalUploadUrl(file?: Express.Multer.File | null) {
  return file?.filename ? `/uploads/${encodeURIComponent(file.filename)}` : null;
}

export async function deleteLocalUploads(urls: Array<string | null | undefined>) {
  const fileNames = new Set(
    urls
      .filter((url): url is string => Boolean(url))
      .flatMap((url) => {
        try {
          const parsed = new URL(url, "http://localhost");
          if (parsed.origin !== "http://localhost" || !parsed.pathname.startsWith("/uploads/")) {
            return [];
          }
          const fileName = path.basename(decodeURIComponent(parsed.pathname));
          return fileName && fileName !== "." && fileName !== ".." ? [fileName] : [];
        } catch {
          return [];
        }
      }),
  );

  const results = await Promise.allSettled(
    [...fileNames].map((fileName) =>
      fs.unlink(path.join(uploadsDir, fileName)).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") throw error;
      }),
    ),
  );
  const failures = results
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason);
  if (failures.length) {
    throw new AggregateError(failures, "Failed to remove local uploaded images.");
  }
}

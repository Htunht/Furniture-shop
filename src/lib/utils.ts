import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export const IMAGE_FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23f5f5f4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%238b857a' font-family='Arial,sans-serif' font-size='24'%3EImage unavailable%3C/text%3E%3C/svg%3E";

export const getImageSrc = (url?: string | null) => {
  if (!url || url.trim() === "") return IMAGE_FALLBACK_SRC;
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }
  return `${API_BASE_URL}${cleanUrl.startsWith("/") ? cleanUrl : "/" + cleanUrl}`;
};
import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  backendUrl: process.env.BACKEND_URL || process.env.BETTER_AUTH_URL || "http://localhost:8080",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173,https://furniture-shop-orpin.vercel.app",
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase() || "minn92831@gmail.com",
};

export function getFrontendBaseUrl() {
  const urls = config.frontendUrl
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const isProduction = config.nodeEnv === "production";

  const frontendUrl = urls.find((url) => {
    const parsedUrl = new URL(url);
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(
      parsedUrl.hostname,
    );
    return isProduction
      ? parsedUrl.protocol === "https:" && !isLocalhost
      : isLocalhost;
  }) ?? (isProduction ? undefined : urls[0]);

  if (!frontendUrl) {
    throw new Error("Configure a public HTTPS FRONTEND_URL for email links.");
  }

  return frontendUrl;
}

export default config;

 
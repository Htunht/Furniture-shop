import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  backendUrl: process.env.BACKEND_URL || process.env.BETTER_AUTH_URL || "http://localhost:8080",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};

export default config;


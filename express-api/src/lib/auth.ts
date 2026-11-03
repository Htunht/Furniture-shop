import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, admin } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import prisma from "./prisma";
import { sendEmail } from "./email";
import { passwordSchema } from "./validation";
import { getResetPasswordEmailHtml } from "./email-template";
import { getVerificationEmailHtml } from "./verify-email";
import config, { getFrontendBaseUrl } from "../config";

function createPasswordResetLink(otp: string, email: string) {
  const resetUrl = new URL("/reset-password", getFrontendBaseUrl());
  resetUrl.searchParams.set("token", otp);
  resetUrl.searchParams.set("email", email);
  return resetUrl.toString();
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      age: {
        type: "number",
      },
      gender: {
        type: "string",
      },
      admin: {
        type: "boolean",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.email.trim().toLowerCase() === config.adminEmail) {
            return { data: { ...user, role: "admin" } };
          }
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "forget-password") {
          const resetLink = createPasswordResetLink(otp, email);
          const htmlContent = getResetPasswordEmailHtml(email, resetLink);
          await sendEmail({
            to: email,
            subject: "Reset Your Password",
            text: `Reset your password using this link: ${resetLink}`,
            html: htmlContent,
          });
        } else {
          const htmlContent = getVerificationEmailHtml(otp);
          await sendEmail({
            to: email,
            subject: "Verify Your Email",
            text: htmlContent,
          });
        }
      },
    }),
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password" ||
        ctx.path === "/email-otp/reset-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password is not strong enough.",
          });
        }
      }
    }),
  },
  trustedOrigins: (config.frontendUrl.includes(",")
    ? config.frontendUrl.split(",")
    : [config.frontendUrl]).map(url => url.trim().replace(/\/$/, "")),
});
 
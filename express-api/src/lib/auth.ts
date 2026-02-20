import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import prisma from "./prisma";
import { sendEmail } from "./email";
import { passwordSchema } from "./validation";
import { getResetPasswordEmailHtml } from "./email-template";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  plugins: [
    emailOTP({
      // emailOTP plugin မှာ Link ပို့ချင်ရင်လည်း sendVerificationOTP ကိုပဲ သုံးရပါတယ်
      async sendVerificationOTP({ email, otp, type }) {
        const resetLink = `http://localhost:5173/reset-password?token=${otp}&email=${email}`;
        if (type === "forget-password") {
          const htmlContent = getResetPasswordEmailHtml(email, resetLink);
          // Password Reset အတွက် Link (URL) ကို ပို့ပေးမည့်အပိုင်း
          void sendEmail({
            to: email,
            subject: "Reset Your Password",
            text: htmlContent, // HTML email သုံးလျှင် ဒါကို သုံးပါ
          });
        } else {
          // Email Verification အတွက် OTP ပို့ပေးမည့်အပိုင်း
          await sendEmail({
            to: email,
            subject: "Verify Your Email",
            text: `Your OTP for email verification is: ${otp}`,
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
        ctx.path === "/change-password"
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
  trustedOrigins: ["http://localhost:5173"],
});

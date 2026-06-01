import { createAuthClient } from "better-auth/react";
import { emailOTPClient, adminClient } from "better-auth/client/plugins";
import { API_BASE_URL } from "./utils";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [emailOTPClient(), adminClient()],
});

export const { signIn, signUp, signOut, useSession, emailOtp } = authClient;

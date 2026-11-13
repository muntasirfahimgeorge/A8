import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [jwtClient()],
});
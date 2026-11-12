import { authClient } from "./auth-client";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export const syncAuthCookie = async () => {
  try {
    const { data } = await authClient.token();
    const token = data?.token;

    if (token) {
      await fetch(`${SERVER_URL}/api/auth/set-cookie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
    }
    return token;
  } catch (error) {
    console.error("Failed to sync auth cookie:", error);
    return null;
  }
};

export const clearAuthCookie = async () => {
  try {
    await fetch(`${SERVER_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Failed to clear auth cookie:", error);
  }
};

export const authFetch = async (endpoint, options = {}) => {
  const { data } = await authClient.token();
  const token = data?.token;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${SERVER_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(responseData.message || `Request failed (${response.status})`);
  }

  return responseData;
};
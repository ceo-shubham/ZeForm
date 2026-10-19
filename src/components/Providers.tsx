"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserSession {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  isAdmin: boolean;
}

interface AuthContextType {
  data: { user: UserSession } | null;
  status: "loading" | "authenticated" | "unauthenticated";
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  data: null,
  status: "loading",
  refreshSession: async () => {},
});

export function useSession() {
  return useContext(AuthContext);
}

export function signIn(provider?: string, options?: { callbackUrl?: string }) {
  const returnTo = options?.callbackUrl || window.location.pathname;
  const isClient = provider === "google-clients";
  const loginUrl = `/api/auth/login?client=${isClient ? "clients" : "main"}&returnTo=${encodeURIComponent(returnTo)}`;
  window.location.href = loginUrl;
}

export async function signOut(options?: { callbackUrl?: string }) {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = options?.callbackUrl || "/";
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ user: UserSession } | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const refreshSession = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (data?.user) {
        setSession({ user: data.user });
        setStatus("authenticated");
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    } catch {
      setSession(null);
      setStatus("unauthenticated");
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider value={{ data: session, status, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

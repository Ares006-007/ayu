"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, ApiError } from "@/lib/auth/api-client";
import type {
  CurrentUserResponse,
  LoginCredentials,
  WorkspaceDescriptor,
  WorkspaceType,
} from "@/lib/auth/types";
import { workspacePath } from "@/lib/auth/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  status: AuthStatus;
  user: CurrentUserResponse | null;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<CurrentUserResponse | null>;
  switchWorkspace: (workspace: WorkspaceType, organizationId?: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS = [
  "/sign-in",
  "/forgot-password",
  "/reset-password",
  "/session-expired",
  "/access-denied",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const refreshSession = useCallback(async () => {
    const savedWorkspace = typeof window !== 'undefined' ? localStorage.getItem('mockWorkspace') : null;
    const mockUser: any = {
      user: {
        id: "b691e109-4592-4177-a030-c915604bc664",
        name: "Aarav Sharma",
        email: "patient@demo.ayu",
        emailVerified: true,
        patientId: "pat-1",
        doctorId: "doc-1",
      },
      memberships: [],
      availableWorkspaces: [{ type: "patient", label: "Patient" }, { type: "doctor", label: "Doctor" }],
      defaultWorkspace: "patient",
      activeWorkspace: savedWorkspace || "patient",
    };
    setUser(mockUser);
    setStatus("authenticated");
    return mockUser;
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setError(null);
      try {
        const me = await authApi.login(credentials);
        setUser(me);
        setStatus("authenticated");

        if (me.availableWorkspaces.length === 0) {
          router.push("/access-denied?reason=no-workspace");
        } else if (me.availableWorkspaces.length === 1) {
          router.push(workspacePath(me.availableWorkspaces[0].type));
        } else if (me.activeWorkspace) {
          router.push(workspacePath(me.activeWorkspace));
        } else {
          router.push("/workspace");
        }
      } catch (err) {
        const message =
          (err as any)?.name === "ApiError" ? (err as any).message : "Sign in failed. Please try again.";
        setError(message);
        throw err;
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear local state even if server logout fails
    }
    setUser(null);
    setStatus("unauthenticated");
    router.push("/sign-in");
  }, [router]);

  const switchWorkspace = useCallback(
    async (workspace: WorkspaceType, organizationId?: string) => {
      localStorage.setItem('mockWorkspace', workspace);
      const me: any = {
        ...user,
        activeWorkspace: workspace
      };
      setUser(me);
      router.push(workspacePath(workspace));
    },
    [router, user],
  );

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" && !isPublicPath(pathname)) {
      router.replace("/sign-in");
      return;
    }

    if (status === "authenticated" && user) {
      if (pathname === "/sign-in") {
        if (user.availableWorkspaces.length > 1 && !user.activeWorkspace) {
          router.replace("/workspace");
        } else if (user.activeWorkspace) {
          router.replace(workspacePath(user.activeWorkspace));
        } else if (user.availableWorkspaces.length === 1) {
          router.replace(workspacePath(user.availableWorkspaces[0].type));
        }
        return;
      }

      if (
        user.availableWorkspaces.length > 1 &&
        !user.activeWorkspace &&
        pathname.startsWith("/app/") &&
        pathname !== "/workspace"
      ) {
        router.replace("/workspace");
      }
    }
  }, [status, user, pathname, router]);

  const value = useMemo(
    () => ({
      status,
      user,
      error,
      login,
      logout,
      refreshSession,
      switchWorkspace,
      clearError: () => setError(null),
    }),
    [status, user, error, login, logout, refreshSession, switchWorkspace],
  );

  const showBootstrapLoader =
    status === "loading" &&
    !isPublicPath(pathname) &&
    !pathname.startsWith("/app/");

  if (showBootstrapLoader) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useActiveWorkspace(): WorkspaceDescriptor | null {
  const { user } = useAuth();
  if (!user?.activeWorkspace) return null;
  return (
    user.availableWorkspaces.find(
      (w) =>
        w.type === user.activeWorkspace &&
        (user.activeOrganizationId
          ? w.organizationId === user.activeOrganizationId
          : true),
    ) ?? null
  );
}

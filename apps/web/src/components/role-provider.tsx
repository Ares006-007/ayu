"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Role } from "@/types";
import { useRouter, usePathname } from "next/navigation";

interface RoleContextType {
  role: Role | null;
  setRole: (role: Role | null) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedRole = localStorage.getItem("ayu-demo-role") as Role | null;
    if (savedRole) {
      setRoleState(savedRole);
    }
    setIsLoading(false);
  }, []);

  const setRole = (newRole: Role | null) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("ayu-demo-role", newRole);
      router.push(`/${newRole}`);
    } else {
      localStorage.removeItem("ayu-demo-role");
      router.push("/demo");
    }
  };

  useEffect(() => {
    // If not loading and no role is set, and we are not on the demo page, redirect to demo
    if (!isLoading && !role && pathname !== "/demo" && pathname !== "/design") {
      router.push("/demo");
    }
  }, [isLoading, role, pathname, router]);

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

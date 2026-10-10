"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/components/role-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getNotificationsForUser } from "@/lib/api";
import {
  Bell, Search, User as UserIcon, LogOut, Menu, X,
  ChevronLeft, ChevronRight,
  LayoutDashboard, Calendar, Pill, FileText, Users,
  Settings, ClipboardList, Activity, Package, FileSpreadsheet,
  Heart, Stethoscope, Clock, BarChart3, Inbox,
} from "lucide-react";

// ── Navigation definitions ──────────────────

const NAV = {
  patient: [
    { name: "Home", href: "/patient", icon: LayoutDashboard },
    { name: "My Treatments", href: "/patient/treatments", icon: Heart },
    { name: "Medicines", href: "/patient/medicines", icon: Pill },
    { name: "Appointments", href: "/patient/appointments", icon: Calendar },
    { name: "Prescriptions", href: "/patient/prescriptions", icon: FileText },
    { name: "Reports", href: "/patient/reports", icon: ClipboardList },
    { name: "Invoices", href: "/patient/invoices", icon: FileSpreadsheet },
  ],
  doctor: [
    { name: "Overview", href: "/doctor", icon: LayoutDashboard },
    { name: "Today", href: "/doctor/appointments", icon: Calendar },
    { name: "Patients", href: "/doctor/patients", icon: Users },
    { name: "Consultations", href: "/doctor/consultations", icon: Stethoscope },
    { name: "Prescriptions", href: "/doctor/prescriptions", icon: FileText },
    { name: "Follow-ups", href: "/doctor/follow-ups", icon: Clock },
    { name: "Adherence", href: "/doctor/adherence", icon: BarChart3 },
    { name: "Settings", href: "/doctor/settings", icon: Settings },
  ],
  pharmacy: [
    { name: "Overview", href: "/pharmacy", icon: LayoutDashboard },
    { name: "Inbox", href: "/pharmacy/inbox", icon: Inbox },
    { name: "Orders", href: "/pharmacy/orders", icon: Package },
    { name: "Inventory", href: "/pharmacy/inventory", icon: Pill },
    { name: "Invoices", href: "/pharmacy/invoices", icon: FileSpreadsheet },
    { name: "Customers", href: "/pharmacy/customers", icon: Users },
    { name: "Settings", href: "/pharmacy/settings", icon: Settings },
  ],
} as const;

const ROLE_USER_MAP: Record<string, { id: string; name: string; label: string }> = {
  patient: { id: "pat-1", name: "Aarav Sharma", label: "Patient" },
  doctor: { id: "doc-1", name: "Dr. Ramesh Kumar", label: "Doctor" },
  pharmacy: { id: "pha-1", name: "Apollo Pharmacy", label: "Pharmacy" },
};

// ── Component ───────────────────────────────

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole, isLoading } = useRole();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const notifRef = React.useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  React.useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Click-away for dropdowns
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (!role) return <>{children}</>;

  const navigation = NAV[role];
  const currentUser = ROLE_USER_MAP[role];
  const userNotifications = getNotificationsForUser(currentUser.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  function isActive(href: string) {
    if (href === `/${role}`) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // ── Sidebar content (shared between desktop and mobile) ──

  function renderNav(isMobile = false) {
    return (
      <ul className="grid gap-0.5 px-2">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                title={collapsed && !isMobile ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && !isMobile && "justify-center px-0"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {(!collapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          "hidden flex-col border-r bg-background transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-3">
          {!collapsed && (
            <Link href={`/${role}`} className="flex items-center gap-2 font-semibold">
              <span className="text-lg tracking-tight text-primary">AYU</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 shrink-0", collapsed && "mx-auto")}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">{renderNav()}</nav>

        <div className="border-t p-3">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              {currentUser.name.charAt(0)}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium leading-none">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{currentUser.label}</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Header ── */}
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile logo */}
          <Link href={`/${role}`} className="md:hidden text-lg font-semibold text-primary tracking-tight">AYU</Link>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden sm:flex relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search..."
              className="flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-1">
            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <Button variant="ghost" size="icon" onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-popover text-popover-foreground shadow-lg z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold">Notifications</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y">
                    {userNotifications.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-muted-foreground text-center">No notifications</p>
                    ) : (
                      userNotifications.slice(0, 5).map((n) => (
                        <div key={n.id} className={cn("px-4 py-3 text-sm", !n.read && "bg-primary/5")}>
                          <p className="font-medium">{n.title}</p>
                          <p className="text-muted-foreground mt-0.5 text-xs">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <Button
                variant="ghost" size="icon" className="rounded-full"
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                aria-label="Profile menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
              </Button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border bg-popover text-popover-foreground shadow-lg z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium truncate">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{currentUser.label} workspace</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { setProfileOpen(false); setRole(null); }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Switch Role
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="relative flex w-72 max-w-[80vw] flex-col bg-background h-full border-r shadow-lg">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <span className="text-lg font-semibold text-primary tracking-tight">AYU</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 overflow-y-auto py-3">{renderNav(true)}</nav>
              <div className="border-t p-4">
                <button
                  onClick={() => { setMobileOpen(false); setRole(null); }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Switch Role
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* ── Content ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

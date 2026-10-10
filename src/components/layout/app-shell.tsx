"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/components/role-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard,
  Calendar,
  Pill,
  FileText,
  Users,
  Settings,
  ClipboardList,
  Activity,
  Package,
  FileSpreadsheet
} from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole, isLoading } = useRole();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  // If no role and not on demo/design, we just return children (it redirects anyway)
  if (!role) {
    return <>{children}</>;
  }

  const getNavigation = () => {
    switch (role) {
      case "patient":
        return [
          { name: "Home", href: "/patient", icon: LayoutDashboard },
          { name: "My Treatments", href: "/patient/treatments", icon: Activity },
          { name: "Medicines", href: "/patient/medicines", icon: Pill },
          { name: "Appointments", href: "/patient/appointments", icon: Calendar },
          { name: "Prescriptions", href: "/patient/prescriptions", icon: FileText },
          { name: "Reports", href: "/patient/reports", icon: ClipboardList },
          { name: "Invoices", href: "/patient/invoices", icon: FileSpreadsheet },
        ];
      case "doctor":
        return [
          { name: "Overview", href: "/doctor", icon: LayoutDashboard },
          { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
          { name: "Patients", href: "/doctor/patients", icon: Users },
          { name: "Consultations", href: "/doctor/consultations", icon: Activity },
          { name: "Prescriptions", href: "/doctor/prescriptions", icon: FileText },
          { name: "Settings", href: "/doctor/settings", icon: Settings },
        ];
      case "pharmacy":
        return [
          { name: "Overview", href: "/pharmacy", icon: LayoutDashboard },
          { name: "Prescription Inbox", href: "/pharmacy/inbox", icon: FileText },
          { name: "Orders", href: "/pharmacy/orders", icon: Package },
          { name: "Inventory", href: "/pharmacy/inventory", icon: Pill },
          { name: "Invoices", href: "/pharmacy/invoices", icon: FileSpreadsheet },
          { name: "Customers", href: "/pharmacy/customers", icon: Users },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-16">
          <Link href={`/${role}`} className="flex items-center gap-2 font-semibold">
            <span className="text-xl tracking-tight text-primary">AYU</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="grid gap-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none capitalize">{role}</span>
              <span className="text-xs text-muted-foreground mt-1">Demo Account</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-16 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <div className="flex flex-1 items-center gap-4 md:gap-8">
            <form className="ml-auto hidden sm:flex flex-1 max-w-sm relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <UserIcon className="h-4 w-4" />
                </div>
              </Button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-popover text-popover-foreground shadow-md z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium leading-none capitalize">{role} Workspace</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => setRole(null)}
                      className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-red-500 hover:bg-muted"
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

        {/* Mobile Navigation overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <aside className="relative flex w-3/4 max-w-sm flex-col bg-background h-full border-r shadow-lg">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <span className="text-xl font-semibold text-primary tracking-tight">AYU</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="grid gap-1 px-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          pathname === item.href 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Users,
  FileText,
  Package,
  Menu,
  X,
  Printer,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useRestaurant } from "@/hooks/api";
import { useThermalPrinter } from "@/hooks/useThermalPrinter";
import { useState } from "react";

const NAV_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: UtensilsCrossed, label: "Live Orders", href: "/dashboard/orders" },
  { icon: UtensilsCrossed, label: "Floor Map", href: "/dashboard/floor-map" },
  { icon: Users, label: "Guest Queue", href: "/dashboard/queue" },
  { icon: FileText, label: "Transactions", href: "/dashboard/transactions" },
  { icon: Users, label: "Staff", href: "/dashboard/staff" },
  { icon: UtensilsCrossed, label: "Menu Builder", href: "/dashboard/menu" },
  // { icon: Package, label: "Inventory", href: "/dashboard/inventory" },
  { icon: QrCode, label: "QR Codes", href: "/dashboard/qr" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { restaurantId, user, logout } = useAuth();
  const { data: restaurant } = useRestaurant(restaurantId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    isConnected: isPrinterConnected,
    isConnecting: isPrinterConnecting,
    connect: connectPrinter,
    disconnect: disconnectPrinter,
  } = useThermalPrinter(32);

  const handleLogout = async () => {
    await logout();
    setLocation("/auth");
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const rest = restaurant as { name?: string; plan?: string; slug?: string } | undefined;
  const restName = rest?.name ?? "My Restaurant";
  const restPlan = rest?.plan ?? "—";
  const restSlug = rest?.slug ?? "";

  return (
    <div className="min-h-screen bg-muted/20 font-sans flex">
      {/* Desktop Sidebar - Only visible on large screens (1024px+) */}
      <aside className="w-64 bg-background border-r border-border fixed h-full z-40 hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="Orderzi" className="w-8 h-8 object-contain drop-shadow-sm" />
              <div className="text-2xl font-heading font-black tracking-tight">
                <span className="text-foreground dark:text-white">Order</span><span className="text-primary">zi</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6 px-2">
            <div className="p-3 bg-muted/50 rounded-lg border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Store className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{restName}</p>
                <p className="text-xs text-muted-foreground">{restPlan} Plan</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Printer (global) */}
          <div className="mt-6 px-2">
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">Printer</p>
                    <p className="text-xs text-muted-foreground">
                      {isPrinterConnected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={isPrinterConnected ? "outline" : "default"}
                  className="shrink-0"
                  onClick={isPrinterConnected ? disconnectPrinter : connectPrinter}
                  disabled={isPrinterConnecting}
                >
                  {isPrinterConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPrinterConnected ? (
                    "Disconnect"
                  ) : (
                    "Pair"
                  )}
                </Button>
              </div>

              {!isPrinterConnected && (
                <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                  Pair once, then keep this tab open to maintain the connection. (Refreshing will disconnect.)
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Mobile/Tablet Menu Overlay - visible below 1024px */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile/Tablet Sidebar - visible below 1024px */}
      <aside
        className={cn(
          "w-64 bg-background border-r border-border fixed h-full z-50 flex flex-col lg:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={handleNavClick}>
              <img src="/logo.png" alt="Orderzi" className="w-8 h-8 object-contain drop-shadow-sm" />
              <div className="hidden sm:block text-2xl font-heading font-black tracking-tight">
                <span className="text-foreground dark:text-white">Order</span><span className="text-primary">zi</span>
              </div>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6 px-2">
            <div className="p-3 bg-muted/50 rounded-lg border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Store className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{restName}</p>
                <p className="text-xs text-muted-foreground">{restPlan} Plan</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={handleNavClick}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Printer (global) */}
          <div className="mt-6 px-2">
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">Printer</p>
                    <p className="text-xs text-muted-foreground">
                      {isPrinterConnected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={isPrinterConnected ? "outline" : "default"}
                  className="shrink-0"
                  onClick={() => {
                    if (isPrinterConnected) disconnectPrinter();
                    else connectPrinter();
                  }}
                  disabled={isPrinterConnecting}
                >
                  {isPrinterConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPrinterConnected ? (
                    "Disconnect"
                  ) : (
                    "Pair"
                  )}
                </Button>
              </div>

              {!isPrinterConnected && (
                <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                  Pair once, then keep this tab open to maintain the connection. (Refreshing will disconnect.)
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-background border-b border-border sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-heading font-semibold text-lg capitalize">
              {location.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {restSlug && (
              <Link href={`/r/${restSlug}`}>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  View Live Menu
                </Button>
              </Link>
            )}
            <Avatar className="w-8 h-8 border border-border">
              <AvatarFallback>{(user?.fullName || user?.email || "U").slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
import React, { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { PrinterProvider } from "@/context/PrinterContext";
import { LanguageProvider } from "@/context/LanguageContext";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthGate } from "@/components/AuthGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineBanner } from "@/components/OfflineBanner";

// Lazy-loaded Pages (L1: Code Splitting)
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const OnboardingPage = lazy(() => import("@/pages/onboarding/OnboardingPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const MenuPage = lazy(() => import("@/pages/dashboard/MenuPage"));
const QRCodesPage = lazy(() => import("@/pages/dashboard/QRCodesPage"));
const AnalyticsPage = lazy(() => import("@/pages/dashboard/AnalyticsPage"));
const SettingsPage = lazy(() => import("@/pages/dashboard/SettingsPage"));
const InventoryPage = lazy(() => import("@/pages/dashboard/InventoryPage"));
const FloorMapPage = lazy(() => import("@/pages/dashboard/FloorMapPage"));
const QueuePage = lazy(() => import("@/pages/dashboard/QueuePage"));
const LiveOrdersPage = lazy(() => import("@/pages/dashboard/LiveOrdersPage"));
const CancelledOrdersPage = lazy(() => import("@/pages/dashboard/CancelledOrdersPage"));
const TransactionsPage = lazy(() => import("@/pages/dashboard/TransactionsPage"));
const KitchenKDSPage = lazy(() => import("@/pages/dashboard/KitchenKDSPage"));
const WaiterTerminalPage = lazy(() => import("@/pages/dashboard/WaiterTerminalPage"));
const StaffManagementPage = lazy(() => import("@/pages/dashboard/StaffManagementPage"));
const PublicMenuPage = lazy(() => import("@/pages/public/PublicMenuPage"));
const QueueRegistrationPage = lazy(() => import("@/pages/public/QueueRegistrationPage"));
const SubscriptionExpiredPage = lazy(() => import("@/pages/admin/SubscriptionExpiredPage"));
const StaffSubscriptionExpiredPage = lazy(() => import("@/pages/public/StaffSubscriptionExpiredPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/public/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/public/TermsOfServicePage"));

// Global loading fallback
function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={LoginPage} />
        <Route path="/signup" component={OnboardingPage} />
        <Route path="/onboarding" component={OnboardingPage} />

        {/* Auto route to role-specific area */}
        <Route path="/app">
          {() => <AuthGate />}
        </Route>

        {/* Staff Direct Access Routes - Protected */}
        <Route path="/kitchen">
          {() => (
            <ProtectedRoute requiredRole={["KITCHEN", "owner", "admin"]}>
              <KitchenKDSPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/waiter">
          {() => (
            <ProtectedRoute requiredRole={["WAITER", "owner", "admin"]}>
              <WaiterTerminalPage />
            </ProtectedRoute>
          )}
        </Route>

        {/* Dashboard Routes (Protected) */}
        <Route path="/dashboard">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <DashboardPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/orders">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <LiveOrdersPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/orders/cancelled">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <CancelledOrdersPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/floor-map">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <FloorMapPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/queue">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <QueuePage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/transactions">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <TransactionsPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/staff">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <StaffManagementPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/menu">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <MenuPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/inventory">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <InventoryPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/qr">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <QRCodesPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/analytics">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard/settings">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]}>
              <SettingsPage />
            </ProtectedRoute>
          )}
        </Route>

        {/* Public Routes */}
        <Route path="/r/:slug" component={PublicMenuPage} />
        <Route path="/q/:slug" component={QueueRegistrationPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/terms-of-service" component={TermsOfServicePage} />

        <Route path="/admin/subscription-expired">
          {() => (
            <ProtectedRoute requiredRole={["owner", "admin", "ADMIN"]} requireSubscription={false}>
              <SubscriptionExpiredPage />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/staff/subscription-expired">
          {() => (
            <ProtectedRoute requiredRole={["WAITER", "KITCHEN"]} requireSubscription={false}>
              <StaffSubscriptionExpiredPage />
            </ProtectedRoute>
          )}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <PrinterProvider width={32}>
                <TooltipProvider>
                  <OfflineBanner />
                  <Toaster />
                  <SonnerToaster position="top-center" richColors />
                  <Router />
                </TooltipProvider>
              </PrinterProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

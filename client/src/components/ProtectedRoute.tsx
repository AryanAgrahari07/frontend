import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  redirectTo?: string;
  requireSubscription?: boolean;
}

export function ProtectedRoute({ children, requiredRole, redirectTo = "/auth", requireSubscription = true }: ProtectedRouteProps) {
  const [_, setLocation] = useLocation();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    if (!user) {
      setLocation(redirectTo);
      return;
    }

    const userRoleLower = user?.role?.toLowerCase() || "";
    const allowedRolesLower = requiredRole?.map((r) => r.toLowerCase()) || [];

    if (requiredRole && !allowedRolesLower.includes(userRoleLower)) {
      setLocation("/dashboard");
    }
  }, [user, isReady, requiredRole, redirectTo, setLocation]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const userRoleLower = user?.role?.toLowerCase() || "";
  const allowedRolesLower = requiredRole?.map((r) => r.toLowerCase()) || [];

  if (!user || (requiredRole && !allowedRolesLower.includes(userRoleLower))) {
    return null;
  }

  const content = <>{children}</>;

  if (requireSubscription) {
    return <SubscriptionGuard>{content}</SubscriptionGuard>;
  }

  return content;
}

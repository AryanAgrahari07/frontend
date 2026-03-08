import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";

/**
 * Redirects user immediately to the correct app area based on role.
 * Uses optimistic cached identity from AuthContext for instant launch.
 */
export function AuthGate() {
  const { user, isReady } = useAuth();
  const { isExpired, isLoading: isSubLoading } = useSubscription();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Wait until both auth and subscription scopes are fully resolved
    if (!isReady || (user && isSubLoading)) return;

    if (!user) {
      setLocation("/auth");
      return;
    }

    if (isExpired) {
      if (user.role === "WAITER" || user.role === "KITCHEN") {
        setLocation("/staff/subscription-expired");
      } else {
        setLocation("/admin/subscription-expired");
      }
      return;
    }

    if (user.role === "WAITER") setLocation("/waiter");
    else if (user.role === "KITCHEN") setLocation("/kitchen");
    else setLocation("/dashboard");
  }, [isReady, user, isSubLoading, isExpired, setLocation]);

  return null;
}

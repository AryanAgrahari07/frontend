import React, { useEffect } from "react";
import { useSubscription } from "@/context/SubscriptionContext";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
    const { isExpired, isLoading } = useSubscription();
    const { user } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!isLoading && isExpired) {
            if (user?.role === "WAITER" || user?.role === "KITCHEN") {
                setLocation("/staff/subscription-expired");
            } else {
                setLocation("/admin/subscription-expired");
            }
        }
    }, [isExpired, isLoading, user, setLocation]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isExpired) {
        // Avoid flash of protected content before unmount/redirect
        return null;
    }

    return <>{children}</>;
}

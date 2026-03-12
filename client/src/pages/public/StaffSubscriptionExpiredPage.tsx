import { Button } from "@/components/ui/button";
import { AlertTriangle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export default function StaffSubscriptionExpiredPage() {
    const { logout } = useAuth();
    const [, setLocation] = useLocation();

    const handleLogout = () => {
        logout();
        setLocation("/auth");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
                <div className="mx-auto h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-2">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                    System Access Paused
                </h1>

                <p className="text-gray-500 text-sm leading-relaxed">
                    The Order<span className="text-primary">zi</span> subscription for this restaurant has expired.
                    Your staff terminal access requires an active plan to connect to the database.
                </p>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 text-amber-800 text-sm font-medium">
                    Please contact your restaurant owner or administrator to renew the plan.
                </div>

                <div className="pt-4">
                    <Button
                        onClick={handleLogout}
                        className="w-full h-11"
                        variant="default"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}

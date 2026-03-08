import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
                    <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg text-center border">
                        <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
                        <p className="text-muted-foreground mb-6">
                            An unexpected error occurred in the application. We've logged the issue.
                        </p>
                        <div className="bg-muted p-4 rounded text-left text-xs font-mono mb-6 overflow-auto max-h-32 text-muted-foreground">
                            {this.state.error?.message || "Unknown error"}
                        </div>
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full"
                        >
                            Reload Page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        const parsedError = JSON.parse(errorMessage);
        if (parsedError && parsedError.error && parsedError.operationType) {
          isFirestoreError = true;
          errorMessage = `Database Error (${parsedError.operationType}): ${parsedError.error}`;
        }
      } catch (e) {
        // Not a JSON error, use as is
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-red-100 text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
              <p className="text-sm text-gray-500">
                {isFirestoreError 
                  ? "We encountered an issue while communicating with the database. This might be due to missing permissions or a network error."
                  : "The application encountered an unexpected error."}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left overflow-auto max-h-40">
              <p className="text-xs font-mono text-red-600 break-words">
                {errorMessage}
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              <RefreshCcw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

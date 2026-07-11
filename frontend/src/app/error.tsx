"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        We&apos;ve encountered an unexpected error. Our engineering team has been notified.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="btn-primary px-6 py-3 flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" /> Try Again
        </button>
        <Link href="/dashboard" className="btn-secondary px-6 py-3 flex items-center justify-center">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

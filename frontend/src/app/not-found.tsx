import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-muted p-6 rounded-full mb-8 border border-border">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
      </div>
      <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">404 - Page Not Found</h2>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10">
        We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
      </p>
      <Link href="/dashboard" className="btn-primary px-8 py-4 text-lg flex items-center gap-2">
        <ArrowLeft className="h-5 w-5" /> Back to Dashboard
      </Link>
    </div>
  );
}

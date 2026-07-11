import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
      <p className="text-muted-foreground text-center max-w-2xl mb-8">
        Interested in deploying BrahmOS at your enterprise? Contact our sales team for a custom demonstration.
      </p>
      <Link href="/" className="text-primary hover:underline flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}

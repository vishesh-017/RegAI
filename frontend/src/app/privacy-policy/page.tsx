import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground text-center max-w-2xl mb-8">
        We take data security and privacy extremely seriously. As a regulatory compliance platform, all your documents and extracted obligations are encrypted at rest and in transit.
      </p>
      <Link href="/" className="text-primary hover:underline flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}

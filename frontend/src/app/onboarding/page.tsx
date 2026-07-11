"use client";

import { useState } from "react";
import { createOrganizationAction } from "@/app/actions/onboarding";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData(e.currentTarget);
      await createOrganizationAction(formData);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full min-h-[80vh] p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Organization</CardTitle>
          <CardDescription>
            Set up your enterprise workspace to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="onboarding-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Organization Name</label>
              <input 
                id="name"
                name="name"
                type="text" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Acme Financial"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Organization Type</label>
              <select 
                id="type"
                name="type"
                required
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a type...</option>
                <option value="Stock Broker">Stock Broker</option>
                <option value="Investment Adviser">Investment Adviser</option>
                <option value="AMC">Asset Management Company (AMC)</option>
                <option value="Depository">Depository</option>
                <option value="Registrar & Transfer Agent">Registrar & Transfer Agent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Your Role</label>
              <select 
                id="role"
                name="role"
                required
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select your role...</option>
                <option value="Admin">Admin</option>
                <option value="Compliance Officer">Compliance Officer</option>
                <option value="Manager">Manager</option>
                <option value="Auditor">Auditor</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>
        <CardFooter>
          <Button form="onboarding-form" type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Complete Onboarding"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

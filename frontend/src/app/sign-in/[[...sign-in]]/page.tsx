"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, AlertCircle } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      setIsLoading(true);
      signIn("credentials", {
        email: "admin@demo.com",
        password: "admin123",
        redirect: true,
        callbackUrl: "/dashboard",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Try a demo account below.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: demoEmail,
      password: demoPassword,
      redirect: false,
    });
    setIsLoading(false);
    if (!res?.error) {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const demos = [
    { label: "Admin", email: "admin@demo.com", password: "admin123", color: "bg-indigo-600 hover:bg-indigo-700 text-white" },
    { label: "Compliance", email: "compliance@demo.com", password: "demo123", color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
    { label: "Manager", email: "manager@demo.com", password: "demo123", color: "bg-blue-600 hover:bg-blue-700 text-white" },
    { label: "Auditor", email: "auditor@demo.com", password: "demo123", color: "bg-amber-600 hover:bg-amber-700 text-white" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] opacity-50 -z-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <span className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg p-1.5 shadow-md shadow-indigo-500/30">
              <FileText className="h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">BrahmOS</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to your compliance platform
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl px-8 py-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full px-4 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo accounts divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium uppercase tracking-wider">
                  Quick access
                </span>
              </div>
            </div>

            <p className="mt-4 mb-3 text-xs text-center text-slate-500">Click any role to sign in instantly</p>

            <div className="grid grid-cols-2 gap-2.5">
              {demos.map((demo) => (
                <button
                  key={demo.label}
                  onClick={() => handleDemoLogin(demo.email, demo.password)}
                  disabled={isLoading}
                  className={`${demo.color} py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {demo.label}
                </button>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Demo Organization: <span className="font-medium text-slate-600 dark:text-slate-300">Demo Securities Ltd.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner";
import GlobalSearch from "@/components/GlobalSearch";
import { prisma } from "@/lib/prisma";
import { seedDemoDatabase } from "@/lib/demo-seed";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrahmOS - Regulatory Change Management",
  description: "From Regulatory Text to Operational Action",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    try {
      const count = await prisma.circular.count();
      if (count === 0) {
        await seedDemoDatabase();
      }
    } catch (e) {
      console.error("Failed to check or seed demo database", e);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans")}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="brahmos-theme"
          >
            <ClientLayoutWrapper>
              {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
                <div className="fixed bottom-4 left-4 z-50 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce hover:animate-none">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  DEMO MODE ACTIVE
                </div>
              )}
              {children}
            </ClientLayoutWrapper>
            <Toaster position="top-right" richColors />
            <GlobalSearch />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

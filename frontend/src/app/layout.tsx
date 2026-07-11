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
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayoutWrapper>
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

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Auto-seed if admin doesn't exist
        const adminExists = await prisma.user.findUnique({ where: { email: "admin@demo.com" } });
        if (!adminExists) {
          console.log("Seeding Demo Database...");
          const org = await prisma.organization.create({
            data: {
              name: "Demo Securities Ltd.",
              organizationType: "Stock Broker"
            }
          });

          const hash = await bcrypt.hash("demo123", 10);
          const adminHash = await bcrypt.hash("admin123", 10);

          await prisma.user.createMany({
            data: [
              { email: "admin@demo.com", password: adminHash, role: "Admin", organizationId: org.id },
              { email: "compliance@demo.com", password: hash, role: "Compliance Officer", organizationId: org.id },
              { email: "manager@demo.com", password: hash, role: "Manager", organizationId: org.id },
              { email: "auditor@demo.com", password: hash, role: "Auditor", organizationId: org.id }
            ]
          });
          console.log("Seeding Complete!");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { organization: true }
        });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
          organizationName: user.organization.name
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.organizationId = (user as any).organizationId;
        token.organizationName = (user as any).organizationName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).organizationId = token.organizationId;
        (session.user as any).organizationName = token.organizationName;
      }
      return session;
    }
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "mock-secret-key-12345",
};

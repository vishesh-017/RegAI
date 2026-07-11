import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span>Platform</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-200 font-medium">Profile</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Account
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Profile Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Email</label>
            <div className="mt-1 text-slate-900 dark:text-slate-200 font-medium">{session.user.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Role</label>
            <div className="mt-1 text-slate-900 dark:text-slate-200 font-medium">{(session.user as any).role}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Organization</label>
            <div className="mt-1 text-slate-900 dark:text-slate-200 font-medium">{(session.user as any).organizationName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

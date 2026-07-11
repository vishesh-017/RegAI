import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UploadClientView from "./UploadClient";

export default async function CircularUploadPage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId;
  
  if (!orgId) {
    redirect("/onboarding");
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span>Platform</span>
          <span>/</span>
          <span>Circulars</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-200 font-medium">Upload Document</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Upload Regulatory Circular</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Ingest new regulatory documents for AI extraction and mapping.
        </p>
      </div>

      <UploadClientView />
    </div>
  );
}

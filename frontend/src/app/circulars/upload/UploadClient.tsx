"use client";

import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { uploadCircularAction } from "@/app/actions/circulars";
import { Upload, FileText, X, CheckCircle, AlertTriangle, ChevronRight, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

// Form Schema
const uploadSchema = z.object({
  referenceNumber: z.string().min(1, "Reference number is required"),
  title: z.string().min(1, "Title is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  publicationDate: z.string().min(1, "Publication date is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
  circularType: z.string().min(1, "Circular type is required"),
  sectors: z.array(z.string()).min(1, "At least one sector is required"),
  tags: z.array(z.string()),
  version: z.string().min(1, "Version is required"),
  parentCircularId: z.string().optional(),
  summary: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const ISSUERS = ["SEBI", "RBI", "NSE", "BSE", "CDSL", "NSDL", "IRDAI", "PFRDA", "Ministry of Finance"];
const TYPES = ["Master Circular", "Circular", "Notification", "Guideline", "Amendment", "Consultation Paper", "Order", "Direction"];
const SECTORS = ["Stock Broker", "Investment Adviser", "Asset Management Company", "Depository", "Registrar & Transfer Agent", "Market Infrastructure Institution", "Exchange"];
const TAGS = ["KYC", "AML", "Cybersecurity", "Risk Management", "Investor Protection", "Trading", "Settlement", "Surveillance", "Disclosure", "Reporting", "Governance"];

export default function UploadClientView() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'parsing' | 'extracting' | 'success'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    mode: "onChange",
    defaultValues: {
      sectors: [],
      tags: [],
      version: "1.0",
    }
  });

  const selectedSectors = watch("sectors");
  const selectedTags = watch("tags");

  const toggleSector = (sector: string) => {
    const current = selectedSectors || [];
    setValue("sectors", current.includes(sector) ? current.filter(s => s !== sector) : [...current, sector], { shouldValidate: true });
  };

  const toggleTag = (tag: string) => {
    const current = selectedTags || [];
    setValue("tags", current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag], { shouldValidate: true });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const onSubmit = async (data: UploadFormValues) => {
    if (!file) {
      setUploadError("Please upload a document first.");
      return;
    }

    setUploadStatus('uploading');
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("referenceNumber", data.referenceNumber);
      formData.append("title", data.title);
      formData.append("issuingAuthority", data.issuingAuthority);
      formData.append("publicationDate", data.publicationDate);
      formData.append("effectiveDate", data.effectiveDate);
      formData.append("circularType", data.circularType);
      formData.append("sectors", JSON.stringify(data.sectors));
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("version", data.version);
      if (data.parentCircularId) formData.append("parentCircularId", data.parentCircularId);
      if (data.summary) formData.append("summary", data.summary);

      // Simulate step progression for UX
      setTimeout(() => setUploadStatus('parsing'), 1500);
      setTimeout(() => setUploadStatus('extracting'), 3000);

      const res = await uploadCircularAction(formData);
      
      setUploadStatus('success');
      setTimeout(() => {
        // Just redirect back to list for now. Can redirect to ID later.
        router.push("/circulars");
      }, 1000);

    } catch (e: any) {
      setUploadError(e.message || "An error occurred during upload.");
      setUploadStatus('idle');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative">
      {/* Left Column: Form */}
      <div className="flex-1 w-full flex flex-col gap-8">
        
        {/* Section 1: Document Upload */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">1</span>
            Document Upload
          </h2>
          
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full text-indigo-600 dark:text-indigo-400">
                  <Upload className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                Drag & Drop your regulatory document here
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Supported formats: PDF, DOCX (Max 25MB)
              </p>
              <button type="button" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                Browse Files
              </button>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button type="button" onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {uploadError && !file && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
        </div>

        {/* Section 2: Metadata */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">2</span>
            Circular Metadata
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Reference Number <span className="text-red-500">*</span></label>
              <input 
                {...register("referenceNumber")}
                placeholder="e.g. SEBI/HO/MIRSD/2026/01"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
              {errors.referenceNumber && <p className="text-xs text-red-500">{errors.referenceNumber.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title <span className="text-red-500">*</span></label>
              <input 
                {...register("title")}
                placeholder="Guidelines on AI Audit Trails"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Issuing Authority <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  list="issuers"
                  {...register("issuingAuthority")}
                  placeholder="Select or type..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                />
                <datalist id="issuers">
                  {ISSUERS.map(issuer => <option key={issuer} value={issuer} />)}
                </datalist>
              </div>
              {errors.issuingAuthority && <p className="text-xs text-red-500">{errors.issuingAuthority.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Circular Type <span className="text-red-500">*</span></label>
              <select 
                {...register("circularType")}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow appearance-none"
              >
                <option value="">Select type...</option>
                {TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              {errors.circularType && <p className="text-xs text-red-500">{errors.circularType.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Publication Date <span className="text-red-500">*</span></label>
              <input 
                type="date"
                {...register("publicationDate")}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
              {errors.publicationDate && <p className="text-xs text-red-500">{errors.publicationDate.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Effective Date <span className="text-red-500">*</span></label>
              <input 
                type="date"
                {...register("effectiveDate")}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
              {errors.effectiveDate && <p className="text-xs text-red-500">{errors.effectiveDate.message}</p>}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Target Sectors <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map(sector => (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => toggleSector(sector)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedSectors?.includes(sector) 
                        ? "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800" 
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700"
                    } border`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
              {errors.sectors && <p className="text-xs text-red-500 mt-1">{errors.sectors.message}</p>}
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedTags?.includes(tag) 
                        ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800" 
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700"
                    } border`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Executive Summary (Optional)</label>
            <textarea 
              {...register("summary")}
              rows={3}
              placeholder="Brief overview of the circular's impact..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
            />
          </div>
        </div>

        {/* Section 3: Version Info */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">3</span>
            Version Information
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Link this upload to previous circulars to enable Regulatory Change Intelligence.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Version Number</label>
              <input 
                {...register("version")}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Parent Circular Reference (Optional)</label>
              <input 
                {...register("parentCircularId")}
                placeholder="Search existing circulars..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Submit Sidebar */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="sticky top-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">4</span>
            Review & Submit
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Document</span>
              {file ? (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium"><CheckCircle className="h-4 w-4"/> Uploaded</span>
              ) : (
                <span className="flex items-center gap-1 text-amber-500 font-medium"><AlertTriangle className="h-4 w-4"/> Missing</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Metadata</span>
              {isValid ? (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium"><CheckCircle className="h-4 w-4"/> Valid</span>
              ) : (
                <span className="flex items-center gap-1 text-amber-500 font-medium"><AlertTriangle className="h-4 w-4"/> Incomplete</span>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            {uploadStatus !== 'idle' && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg mb-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  {uploadStatus === 'uploading' ? <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                  <span className={uploadStatus === 'uploading' ? 'font-medium text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}>Uploading File</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {uploadStatus === 'uploading' ? <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600" /> : 
                   uploadStatus === 'parsing' ? <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> : 
                   <CheckCircle className="h-4 w-4 text-green-500" />}
                  <span className={uploadStatus === 'parsing' ? 'font-medium text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}>Parsing Content</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {uploadStatus !== 'extracting' && uploadStatus !== 'success' ? <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600" /> : 
                   uploadStatus === 'extracting' ? <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> : 
                   <CheckCircle className="h-4 w-4 text-green-500" />}
                  <span className={uploadStatus === 'extracting' ? 'font-medium text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}>Extracting Obligations</span>
                </div>
              </div>
            )}

            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Save className="h-4 w-4" /> Save Draft
            </button>
            <button 
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || !file || uploadStatus !== 'idle'}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadStatus === 'idle' ? 'Upload & Process' : 'Processing...'}
              {uploadStatus === 'idle' && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

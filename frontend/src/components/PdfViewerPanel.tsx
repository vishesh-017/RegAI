"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, ZoomIn, ZoomOut, AlertCircle } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use CDN for worker to avoid webpack/Next.js worker issues
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface PdfViewerPanelProps {
  url: string | null;
  activePage: number | null;
}

export default function PdfViewerPanel({ url, activePage }: PdfViewerPanelProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  useEffect(() => {
    if (activePage && activePage <= (numPages || 999)) {
      setPageNumber(activePage);
    }
  }, [activePage, numPages]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setUseIframeFallback(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Failed to load PDF with react-pdf:", error);
    setUseIframeFallback(true);
  };

  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/10 rounded-xl border border-border">
        <div className="text-center text-muted-foreground">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="font-bold">No document available</p>
        </div>
      </div>
    );
  }

  if (useIframeFallback) {
    return (
      <div className="flex flex-col h-full w-full bg-card rounded-xl overflow-hidden border border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
          <div className="text-sm font-bold text-foreground">Original Document (Iframe Fallback)</div>
        </div>
        <iframe 
          src={`${url}#page=${activePage || 1}`} 
          className="w-full h-full flex-1 bg-background" 
          title="PDF Preview"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-muted/10 rounded-xl overflow-hidden border border-border shadow-sm">
      {/* PDF Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border z-10 shadow-sm">
        <div className="text-sm font-bold text-foreground">
          {pageNumber} of {numPages || "--"}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold w-12 text-center text-muted-foreground">
            {Math.round(scale * 100)}%
          </span>
          <button 
            onClick={() => setScale(s => Math.min(3, s + 0.25))}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 overflow-auto bg-muted/10 p-4 flex justify-center">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          }
          className="shadow-xl"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="rounded overflow-hidden shadow-sm"
            loading={
              <div className="flex items-center justify-center h-96 bg-card w-[600px] shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
}

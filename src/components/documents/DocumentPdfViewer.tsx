
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure the PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentPdfViewerProps {
  url: string;
  className?: string;
}

const DocumentPdfViewer: React.FC<DocumentPdfViewerProps> = ({ url, className }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF', error);
    setError('Failed to load PDF document');
    setIsLoading(false);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const nextPage = prevPageNumber + offset;
      return numPages ? Math.min(Math.max(1, nextPage), numPages) : 1;
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <div className="p-4 text-destructive border border-destructive/20 rounded bg-destructive/10">
          {error}
        </div>
      )}
      
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto my-8" />}
      >
        <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document>
      
      {numPages && (
        <div className="flex items-center gap-4 mt-4">
          <button 
            onClick={previousPage} 
            disabled={pageNumber <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentPdfViewer;

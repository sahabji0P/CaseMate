"use client"

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Set worker URL to use local file
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';

interface PDFPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

export function PDFPreview({ isOpen, onClose, fileUrl, fileName }: PDFPreviewProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleZoomIn = () => setScale(prev => Math.min(2.0, prev + 0.1));
  const handleZoomOut = () => setScale(prev => Math.max(0.5, prev - 0.1));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setLoading(false);
              setError(null);
            }}
            onLoadError={(error) => {
              console.error('Error loading PDF:', error);
              setError('Failed to load PDF. Please try again.');
              setLoading(false);
            }}
            className="flex justify-center"
            loading={
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground">Loading PDF...</span>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full">
                <span className="text-red-500">{error || 'Failed to load PDF'}</span>
              </div>
            }
          >
            {!loading && !error && (
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                className="shadow-lg"
                loading={
                  <div className="flex items-center justify-center h-full">
                    <span className="text-muted-foreground">Loading page...</span>
                  </div>
                }
              />
            )}
          </Document>
        </div>
        {!loading && !error && (
          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {pageNumber} of {numPages || 0}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageNumber(Math.min(numPages || 0, pageNumber + 1))}
                disabled={pageNumber >= (numPages || 0)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm">{Math.round(scale * 100)}%</span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={scale >= 2.0}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 
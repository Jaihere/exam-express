import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PDFUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const PDFUploader = ({ onFileSelect, selectedFile }: PDFUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        onFileSelect(file);
        setPdfUrl(URL.createObjectURL(file));
      }
    },
    [onFileSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
      setPdfUrl(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  if (selectedFile && pdfUrl) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <span className="text-xs text-muted-foreground">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "w-full max-w-md p-12 border-2 border-dashed rounded-2xl text-center transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 scale-105"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <Upload
          className={cn(
            "h-12 w-12 mx-auto mb-4 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )}
        />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Upload Reading Material
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Drag and drop your PDF here, or click to browse
        </p>
        <label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="default" className="cursor-pointer" asChild>
            <span>Select PDF File</span>
          </Button>
        </label>
      </div>
    </div>
  );
};

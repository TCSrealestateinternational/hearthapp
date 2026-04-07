"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
}

export function FileUpload({
  onFileSelect,
  accept,
  maxSizeMB = 25,
  label = "Upload a file",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be under ${maxSizeMB}MB`);
      return;
    }
    onFileSelect(file);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          dragOver
            ? "border-primary bg-primary-light"
            : "border-border hover:border-primary/50"
        }`}
      >
        <Upload size={24} className="text-text-secondary" />
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-xs text-text-secondary">
          Max {maxSizeMB}MB
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}

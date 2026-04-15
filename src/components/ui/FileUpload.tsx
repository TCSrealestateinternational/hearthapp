"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

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
        role="button"
        tabIndex={0}
        aria-label={`${label}, maximum size ${maxSizeMB}MB`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
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
            : "border-outline-variant hover:border-primary/50"
        }`}
      >
        <MaterialIcon name="upload" size={24} className="text-on-surface-variant" />
        <span className="text-sm text-on-surface-variant">{label}</span>
        <span className="text-xs text-on-surface-variant">
          Max {maxSizeMB}MB
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
        aria-label="Choose file to upload"
        tabIndex={-1}
      />
      {error && <p role="alert" className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}

"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface DriveLinkProps {
  url: string;
}

export function DriveLink({ url }: DriveLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface hover:bg-primary-container transition-colors w-full font-medium shadow-sm hover:shadow-md"
    >
      <svg viewBox="0 0 87.3 78" className="w-5 h-5" aria-hidden="true">
        <path d="M6.6 66.85L29 29.4h28.9l-22.3 37.45z" fill="#0066DA" />
        <path d="M57.5 66.85L35.1 29.4h28.9l22.3 37.45z" fill="#00AC47" />
        <path d="M29 29.4L6.6 66.85l22.4-37.45L51.3.05z" fill="#EA4335" />
        <path d="M51.3.05L29 29.4l22.3 37.45h28.9z" fill="#00832D" />
        <path d="M29 29.4h28.9L80.2 66.85H51.3z" fill="#2684FC" />
        <path d="M6.6 66.85h28.9L57.8 29.4H29z" fill="#FFBA00" />
      </svg>
      Open Google Drive Folder
      <MaterialIcon name="open_in_new" size={14} />
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
}

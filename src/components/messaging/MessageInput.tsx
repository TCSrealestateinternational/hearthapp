"use client";

import { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";

interface MessageInputProps {
  onSend: (text: string, fileUrl?: string, fileName?: string) => void;
  onFileSelect?: (file: File) => Promise<{ url: string; name: string }>;
  disabled?: boolean;
}

export function MessageInput({
  onSend,
  onFileSelect,
  disabled = false,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !uploading) return;
    onSend(text.trim());
    setText("");
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onFileSelect) return;
    setUploading(true);
    try {
      const result = await onFileSelect(file);
      onSend("", result.url, result.name);
    } catch {
      // Upload failed silently
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-4 border-t border-border bg-surface-container"
    >
      {onFileSelect && (
        <>
          <button
            type="button"
            aria-label="Attach file"
            onClick={() => fileRef.current?.click()}
            disabled={disabled || uploading}
            className="p-2 rounded-lg text-text-secondary hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            <Paperclip size={20} aria-hidden="true" />
          </button>
          <input
            ref={fileRef}
            type="file"
            onChange={handleFile}
            className="hidden"
            aria-label="Choose file to attach"
            tabIndex={-1}
          />
        </>
      )}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        aria-label="Message text"
        disabled={disabled}
        className="flex-1 px-4 py-2 rounded-full border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        aria-label="Send message"
        disabled={disabled || (!text.trim() && !uploading)}
        className="p-2 rounded-full bg-cta text-white hover:bg-cta-hover transition-colors disabled:opacity-50"
      >
        <Send size={18} aria-hidden="true" />
      </button>
    </form>
  );
}

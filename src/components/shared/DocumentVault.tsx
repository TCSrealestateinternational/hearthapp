"use client";

import { useState, useEffect } from "react";
import type { Document as DocType } from "@/types";
import { getDocuments, createDocumentRecord } from "@/lib/firestore";
import { uploadFile } from "@/lib/storage";
import { Card, CardTitle } from "@/components/ui/Card";
import { FileUpload } from "@/components/ui/FileUpload";
import { DriveLink } from "./DriveLink";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface DocumentVaultProps {
  brokerageId: string;
  transactionId?: string;
  userId: string;
  driveFolderUrl?: string;
}

export function DocumentVault({
  brokerageId,
  transactionId,
  userId,
  driveFolderUrl,
}: DocumentVaultProps) {
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!brokerageId) return;
    getDocuments(brokerageId, transactionId).then(setDocuments);
  }, [brokerageId, transactionId]);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const result = await uploadFile(brokerageId, "documents", file);
      await createDocumentRecord({
        brokerageId,
        transactionId,
        uploadedBy: userId,
        fileName: file.name,
        fileUrl: result.url,
        fileSize: file.size,
        mimeType: file.type,
      });
      const updated = await getDocuments(brokerageId, transactionId);
      setDocuments(updated);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="space-y-4">
      {driveFolderUrl && <DriveLink url={driveFolderUrl} />}

      <Card>
        <CardTitle>Upload Documents</CardTitle>
        <div className="mt-3">
          <FileUpload
            onFileSelect={handleUpload}
            label={uploading ? "Uploading..." : "Drop a file or click to upload"}
          />
        </div>
      </Card>

      {documents.length > 0 && (
        <Card>
          <CardTitle>Your Documents</CardTitle>
          <div className="mt-3 space-y-2">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${doc.fileName} (${formatSize(doc.fileSize)}), opens in new tab`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-container/50 transition-colors"
              >
                <MaterialIcon name="description" size={20} className="text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {doc.fileName}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {formatSize(doc.fileSize)}
                  </p>
                </div>
                <MaterialIcon name="download" size={16} className="text-on-surface-variant" />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

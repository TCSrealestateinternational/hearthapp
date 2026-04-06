"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { getTransactions, getChecklist, getProperties, getEmotionalLogs } from "@/lib/firestore";
import { exportClientPDF } from "@/lib/exportPdf";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DriveLink } from "@/components/shared/DriveLink";
import { UserCircle, Mail, Phone, Download } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const [downloading, setDownloading] = useState(false);

  const hasDriveLink = user?.driveFolderUrl || brokerage?.driveFolderUrl;

  async function handleDownloadPDF() {
    if (!user || !brokerage) return;
    setDownloading(true);
    try {
      const transactions = await getTransactions(brokerage.id, user.id);
      const tx = transactions[0];
      let checklistItems, properties, emotionalLogs;
      if (tx) {
        const checklistState = await getChecklist(tx.id);
        checklistItems = checklistState?.items;
        properties = await getProperties(tx.id);
        emotionalLogs = await getEmotionalLogs(tx.id);
      }
      exportClientPDF({ user, transactions, checklistItems, properties, emotionalLogs });
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-text-primary">Profile</h1>

      {/* Profile info */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <UserCircle size={32} className="text-primary" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {user?.displayName}
            </p>
            <div className="flex items-center gap-1 text-sm text-text-secondary">
              <Mail size={14} />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Phone size={14} />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Download data */}
      <Button
        variant="secondary"
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        {downloading ? "Preparing..." : "Download My Data (PDF)"}
      </Button>

      {/* Documents & Drive links */}
      {hasDriveLink && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Documents
          </h2>
          <div className="space-y-3">
            {user?.driveFolderUrl && (
              <div>
                <p className="text-sm text-text-secondary mb-1.5">
                  Your shared folder from {brokerage?.agentName || "your agent"}
                </p>
                <DriveLink url={user.driveFolderUrl} />
              </div>
            )}
            {brokerage?.driveFolderUrl && (
              <div>
                <p className="text-sm text-text-secondary mb-1.5">
                  {brokerage.name} shared resources
                </p>
                <DriveLink url={brokerage.driveFolderUrl} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

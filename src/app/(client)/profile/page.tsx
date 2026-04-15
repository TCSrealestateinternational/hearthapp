"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { getTransactions, getChecklist, getProperties } from "@/lib/firestore";
import { exportClientPDF } from "@/lib/exportPdf";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DriveLink } from "@/components/shared/DriveLink";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import Link from "next/link";
import { updateUser } from "@/lib/firestore";

export default function ProfilePage() {
  const { user, signOut, refreshUser } = useAuth();
  const { brokerage } = useBrokerage();
  const [downloading, setDownloading] = useState(false);
  const viewPref = user?.portalViewPreference || "toggle";

  const hasDriveLink = user?.driveFolderUrl || brokerage?.driveFolderUrl;

  async function handleDownloadPDF() {
    if (!user || !brokerage) return;
    setDownloading(true);
    try {
      const transactions = await getTransactions(brokerage.id, user.id);
      const tx = transactions[0];
      let checklistItems, properties;
      if (tx) {
        const checklistState = await getChecklist(tx.id);
        checklistItems = checklistState?.items;
        properties = await getProperties(tx.id);
      }
      exportClientPDF({ user, transactions, checklistItems, properties });
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-on-surface font-serif">Profile</h1>

      {/* Profile info */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <MaterialIcon name="account_circle" size={32} className="text-primary" />
            )}
          </div>
          <div>
            <p className="text-xl font-bold text-on-surface">
              {user?.displayName}
            </p>
            <div className="flex items-center gap-1 text-sm text-on-surface-variant">
              <MaterialIcon name="mail" size={14} />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                <MaterialIcon name="phone" size={14} />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Your Agent */}
      {brokerage && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 font-serif">Your Agent</h2>
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {brokerage.agentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-on-surface">{brokerage.agentName}</p>
                <p className="text-sm text-on-surface-variant">{brokerage.agentTitle}</p>
                {brokerage.agentPhone && (
                  <div className="flex items-center gap-1 text-sm text-on-surface-variant mt-1">
                    <MaterialIcon name="phone" size={14} />
                    <a href={`tel:${brokerage.agentPhone}`} className="hover:underline">
                      {brokerage.agentPhone}
                    </a>
                  </div>
                )}
                {brokerage.agentEmail && (
                  <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                    <MaterialIcon name="mail" size={14} />
                    <a href={`mailto:${brokerage.agentEmail}`} className="hover:underline">
                      {brokerage.agentEmail}
                    </a>
                  </div>
                )}
              </div>
              <Link href="/messages" className="shrink-0">
                <Button variant="secondary" size="sm">
                  <MaterialIcon name="chat_bubble" size={16} />
                  Message
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Download data */}
      <Button
        variant="secondary"
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="flex items-center gap-2"
      >
        <MaterialIcon name="download" size={16} />
        {downloading ? "Preparing..." : "Download My Data (PDF)"}
      </Button>

      {/* Documents & Drive links */}
      {hasDriveLink && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 font-serif">
            Documents
          </h2>
          <div className="space-y-3">
            {user?.driveFolderUrl && (
              <div>
                <p className="text-sm text-on-surface-variant mb-1.5">
                  Your shared folder from {brokerage?.agentName || "your agent"}
                </p>
                <DriveLink url={user.driveFolderUrl} />
              </div>
            )}
            {brokerage?.driveFolderUrl && (
              <div>
                <p className="text-sm text-on-surface-variant mb-1.5">
                  {brokerage.name} shared resources
                </p>
                <DriveLink url={brokerage.driveFolderUrl} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dashboard view preference */}
      {user?.roles?.some((r) => r === "dual" || r === "buyer" || r === "seller") && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 font-serif">
            Preferences
          </h2>
          <Card>
            <p className="text-sm font-medium text-on-surface mb-2">Dashboard View</p>
            <p className="text-xs text-on-surface-variant mb-3">
              Choose how your dashboard shows transactions.
            </p>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (!user) return;
                  await updateUser(user.id, { portalViewPreference: "toggle" } as never);
                  refreshUser();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                  viewPref === "toggle"
                    ? "bg-primary-container text-primary border-primary/20"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:bg-primary-container/50"
                }`}
              >
                <MaterialIcon name="toggle_on" size={16} />
                Toggle (Buyer/Seller)
              </button>
              <button
                onClick={async () => {
                  if (!user) return;
                  await updateUser(user.id, { portalViewPreference: "unified" } as never);
                  refreshUser();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                  viewPref === "unified"
                    ? "bg-primary-container text-primary border-primary/20"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:bg-primary-container/50"
                }`}
              >
                <MaterialIcon name="grid_view" size={16} />
                Unified (All in one)
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Sign out */}
      <Button
        variant="secondary"
        onClick={signOut}
        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
      >
        <MaterialIcon name="logout" size={16} />
        Sign Out
      </Button>
    </div>
  );
}

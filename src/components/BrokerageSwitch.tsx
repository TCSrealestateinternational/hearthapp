"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { exportClientPDF } from "@/lib/exportPdf";
import { getTransactions } from "@/lib/firestore";
import type { PendingSwitch } from "@/hooks/useAuth";
import type { User } from "@/types";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface BrokerageSwitchProps {
  user: User;
  pendingSwitch: PendingSwitch;
  onConfirm: () => Promise<User | null>;
  onDecline: () => Promise<void>;
}

export function BrokerageSwitch({
  user,
  pendingSwitch,
  onConfirm,
  onDecline,
}: BrokerageSwitchProps) {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { currentBrokerage, newBrokerage } = pendingSwitch;

  async function handleDownload() {
    setDownloading(true);
    try {
      const transactions = await getTransactions(
        currentBrokerage.id,
        user.id
      );
      exportClientPDF({ user, transactions });
    } finally {
      setDownloading(false);
    }
  }

  async function handleSwitch() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  async function handleStay() {
    setLoading(true);
    try {
      await onDecline();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(47,82,51,0.30), rgba(26,60,94,0.50)), url('/images/house-bg.jpg')",
      }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10">
        <div className="text-center mb-6">
          {newBrokerage.logoUrl && (
            <img
              src={newBrokerage.logoUrl}
              alt={newBrokerage.name}
              className="h-14 mx-auto mb-4"
            />
          )}
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">
            Switch to {newBrokerage.name}?
          </h1>
          <p className="text-on-surface-variant mt-2">
            You&apos;ve been added to{" "}
            <strong>{newBrokerage.name}</strong> by{" "}
            <strong>{newBrokerage.agentName}</strong>.
          </p>
        </div>

        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-on-surface">
            Before switching, you can download your current profile from{" "}
            <strong>{currentBrokerage.name}</strong>. After switching, your
            current account will no longer be accessible.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="secondary"
            onClick={handleDownload}
            loading={downloading}
            className="w-full flex items-center justify-center gap-2"
          >
            <MaterialIcon name="download" size={16} />
            Download Current Profile
          </Button>

          <Button
            variant="cta"
            onClick={handleSwitch}
            loading={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            <MaterialIcon name="arrow_forward" size={16} />
            Switch to {newBrokerage.name}
          </Button>
        </div>

        <button
          onClick={handleStay}
          disabled={loading}
          className="w-full text-center text-sm text-on-surface-variant hover:text-primary mt-4 py-2 transition-colors"
        >
          Stay with {currentBrokerage.name}
        </button>
      </div>
    </div>
  );
}

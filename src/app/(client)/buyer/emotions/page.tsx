"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { EmotionalCheckIn } from "@/components/shared/EmotionalCheckIn";
import { getEmotionalLogs, createEmotionalLog } from "@/lib/firestore";
import type { EmotionalLog, Mood } from "@/types";

export default function BuyerEmotionsPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const buyingTx = transactions.find((t) => t.type === "buying");
  const [history, setHistory] = useState<EmotionalLog[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!buyingTx?.id) return;
    getEmotionalLogs(buyingTx.id).then(setHistory);
  }, [buyingTx?.id]);

  async function handleSubmit(mood: Mood, notes: string, prompt: string) {
    if (!buyingTx?.id || !user?.id) return;
    setSaving(true);
    await createEmotionalLog({
      transactionId: buyingTx.id,
      userId: user.id,
      mood,
      notes,
      stage: "House Hunting",
      prompt,
    });
    const updated = await getEmotionalLogs(buyingTx.id);
    setHistory(updated);
    setSaving(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-text-primary">
        Emotional Check-in
      </h1>
      <EmotionalCheckIn
        stage="House Hunting"
        history={history}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  );
}

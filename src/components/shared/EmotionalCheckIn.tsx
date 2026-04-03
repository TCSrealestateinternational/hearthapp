"use client";

import { useState } from "react";
import type { Mood, EmotionalLog } from "@/types";
import { MOOD_OPTIONS, getPromptForStage } from "@/constants/emotional-prompts";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EmotionalCheckInProps {
  stage: string;
  history: EmotionalLog[];
  onSubmit: (mood: Mood, notes: string, prompt: string) => void;
  saving?: boolean;
}

export function EmotionalCheckIn({
  stage,
  history,
  onSubmit,
  saving = false,
}: EmotionalCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [notes, setNotes] = useState("");
  const prompt = getPromptForStage(stage);

  function handleSubmit() {
    if (!selectedMood) return;
    onSubmit(selectedMood, notes, prompt);
    setSelectedMood(null);
    setNotes("");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardTitle>How are you feeling?</CardTitle>
        <p className="text-sm text-text-secondary mt-2 mb-4">{prompt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedMood(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedMood === option.value
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-text-primary border-border hover:border-primary"
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="What is on your mind?"
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <Button
          variant="cta"
          onClick={handleSubmit}
          disabled={!selectedMood}
          loading={saving}
        >
          Save Check-in
        </Button>
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardTitle>Previous Check-ins</CardTitle>
          <div className="mt-3 space-y-3">
            {history.map((log) => {
              const moodInfo = MOOD_OPTIONS.find(
                (m) => m.value === log.mood
              );
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 py-2 border-b border-border last:border-0"
                >
                  <span className="text-2xl">{moodInfo?.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">
                        {moodInfo?.label}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {log.stage}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-sm text-text-secondary mt-0.5">
                        {log.notes}
                      </p>
                    )}
                    <p className="text-xs text-text-secondary mt-1">
                      {log.createdAt instanceof Date
                        ? log.createdAt.toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

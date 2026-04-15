"use client";

import { useEffect, useState, useRef } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { subscribeToMilestones } from "@/lib/firestore";
import { GlossaryHighlight } from "@/components/ui/GlossaryTooltip";
import { useGlossaryTerms } from "@/contexts/GlossaryContext";
import type { Milestone } from "@/types";

interface MilestoneTimelineProps {
  transactionId: string;
}

// Group milestones by stage
function groupByStage(milestones: Milestone[]): Map<string, Milestone[]> {
  const groups = new Map<string, Milestone[]>();
  for (const m of milestones) {
    const existing = groups.get(m.stage) ?? [];
    existing.push(m);
    groups.set(m.stage, existing);
  }
  return groups;
}

export function MilestoneTimeline({ transactionId }: MilestoneTimelineProps) {
  const { terms } = useGlossaryTerms();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const prevCompletedRef = useRef<Set<string>>(new Set());
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const unsub = subscribeToMilestones(transactionId, (newMilestones) => {
      // Check for newly completed milestones that should trigger celebration
      const prevCompleted = prevCompletedRef.current;
      for (const m of newMilestones) {
        if (m.completed && m.notifyClient && !prevCompleted.has(m.id)) {
          if (!prefersReducedMotion) {
            setCelebrating(m.id);
            setTimeout(() => setCelebrating(null), 2000);
          }
        }
      }
      // Update tracking set
      prevCompletedRef.current = new Set(
        newMilestones.filter((m) => m.completed).map((m) => m.id)
      );
      setMilestones(newMilestones);
    });
    return unsub;
  }, [transactionId, prefersReducedMotion]);

  const grouped = groupByStage(milestones);
  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (milestones.length === 0) {
    return (
      <div
        className="rounded-xl border border-outline-variant bg-surface p-8 text-center"
        role="status"
        aria-label="No milestones yet"
      >
        <p className="text-sm text-on-surface-variant">No milestones to show yet.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-outline-variant bg-surface p-6"
      role="region"
      aria-label="Transaction milestone timeline"
    >
      <span role="status" aria-live="polite" className="sr-only">{celebrating ? "Milestone completed!" : ""}</span>
      {/* Progress header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-on-surface">Your Progress</h3>
        <span className="text-sm font-medium text-on-surface-variant" aria-label={`${pct} percent complete`}>
          {completedCount}/{totalCount} ({pct}%)
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="mb-8 h-2 overflow-hidden rounded-full bg-surface-container"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall milestone progress"
      >
        <div
          className="h-full rounded-full bg-success transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Grouped milestones */}
      <div className="space-y-8" role="list" aria-label="Milestones grouped by stage">
        {Array.from(grouped.entries()).map(([stage, items]) => {
          const stageCompleted = items.every((m) => m.completed);
          return (
            <div key={stage} role="listitem">
              <h4
                className={`mb-3 text-xs font-bold uppercase tracking-wider ${
                  stageCompleted ? "text-success" : "text-on-surface-variant"
                }`}
              >
                <GlossaryHighlight text={stage} terms={terms} />
              </h4>
              <div className="space-y-2">
                {items.map((milestone) => {
                  const isCelebrating = celebrating === milestone.id;
                  return (
                    <div
                      key={milestone.id}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        milestone.completed ? "bg-primary-container" : "bg-surface-container"
                      } ${isCelebrating ? "animate-pulse ring-2 ring-success" : ""}`}
                      role="listitem"
                      aria-label={`${milestone.label}: ${milestone.completed ? "completed" : "pending"}`}
                    >
                      {milestone.completed ? (
                        <MaterialIcon
                          name="check_circle"
                          size={18}
                          className="shrink-0 text-success"
                        />
                      ) : (
                        <MaterialIcon
                          name="radio_button_unchecked"
                          size={18}
                          className="shrink-0 text-border"
                        />
                      )}
                      <span
                        className={`text-sm ${
                          milestone.completed
                            ? "font-medium text-primary"
                            : "text-on-surface-variant"
                        }`}
                      >
                        <GlossaryHighlight text={milestone.label} terms={terms} />
                      </span>
                      {isCelebrating && (
                        <MaterialIcon
                          name="celebration"
                          size={16}
                          className="ml-auto shrink-0 text-cta"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

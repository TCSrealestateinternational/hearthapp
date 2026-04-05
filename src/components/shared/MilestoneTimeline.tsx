"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle, Circle, PartyPopper } from "lucide-react";
import { subscribeToMilestones } from "@/lib/firestore";
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
        className="rounded-xl border border-gray-200 bg-white p-8 text-center"
        role="status"
        aria-label="No milestones yet"
      >
        <p className="text-sm text-gray-400">No milestones to show yet.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-6"
      role="region"
      aria-label="Transaction milestone timeline"
    >
      {/* Progress header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
        <span className="text-sm font-medium text-gray-500" aria-label={`${pct} percent complete`}>
          {completedCount}/{totalCount} ({pct}%)
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="mb-8 h-2 overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall milestone progress"
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
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
                  stageCompleted ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {stage}
              </h4>
              <div className="space-y-2">
                {items.map((milestone) => {
                  const isCelebrating = celebrating === milestone.id;
                  return (
                    <div
                      key={milestone.id}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        milestone.completed ? "bg-emerald-50" : "bg-gray-50"
                      } ${isCelebrating ? "animate-pulse ring-2 ring-emerald-400" : ""}`}
                      role="listitem"
                      aria-label={`${milestone.label}: ${milestone.completed ? "completed" : "pending"}`}
                    >
                      {milestone.completed ? (
                        <CheckCircle
                          size={18}
                          className="shrink-0 text-emerald-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          size={18}
                          className="shrink-0 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`text-sm ${
                          milestone.completed
                            ? "font-medium text-emerald-700"
                            : "text-gray-500"
                        }`}
                      >
                        {milestone.label}
                      </span>
                      {isCelebrating && (
                        <PartyPopper
                          size={16}
                          className="ml-auto shrink-0 text-amber-500"
                          aria-label="Celebration! This milestone was just completed."
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

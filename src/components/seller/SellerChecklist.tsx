"use client";

import { useState, useMemo } from "react";
import type { ChecklistItem } from "@/types";
import { SELLER_STAGES } from "@/constants/checklist-seller";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { ChecklistItemRow } from "@/components/shared/ChecklistItem";
import { Card, CardTitle } from "@/components/ui/Card";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface SellerChecklistProps {
  items: ChecklistItem[];
  onToggle: (id: string, completed: boolean) => void;
}

function findCurrentStage(items: ChecklistItem[], stages: readonly string[]): string {
  for (const stage of stages) {
    const stageItems = items.filter((i) => i.stage === stage);
    if (stageItems.some((i) => !i.completed)) return stage;
  }
  return stages[stages.length - 1];
}

export function SellerChecklist({ items, onToggle }: SellerChecklistProps) {
  const currentStage = useMemo(() => findCurrentStage(items, SELLER_STAGES), [items]);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set([currentStage])
  );

  const totalCompleted = items.filter((i) => i.completed).length;
  const overallProgress =
    items.length > 0 ? (totalCompleted / items.length) * 100 : 0;

  function toggleStage(stage: string) {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <ProgressBar
        value={overallProgress}
        label={`${totalCompleted} of ${items.length} complete`}
      />

      {SELLER_STAGES.map((stage) => {
        const stageItems = items.filter((i) => i.stage === stage);
        const stageCompleted = stageItems.filter((i) => i.completed).length;
        const stageProgress =
          stageItems.length > 0
            ? (stageCompleted / stageItems.length) * 100
            : 0;
        const isExpanded = expandedStages.has(stage);
        const panelId = `stage-panel-${stage.replace(/\s+/g, "-").toLowerCase()}`;

        return (
          <Card key={stage}>
            <button
              onClick={() => toggleStage(stage)}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <MaterialIcon name="expand_more" size={16} className="text-on-surface-variant" />
                ) : (
                  <MaterialIcon name="chevron_right" size={16} className="text-on-surface-variant" />
                )}
                <CardTitle>{stage}</CardTitle>
              </div>
              <span className="text-sm text-on-surface-variant">
                {stageCompleted}/{stageItems.length}
              </span>
            </button>

            <ProgressBar
              value={stageProgress}
              showPercent={false}
              className="mt-2"
            />

            {isExpanded && (
              <div id={panelId} className="mt-3 space-y-1">
                {stageItems.map((item) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

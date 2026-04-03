"use client";

import { useState } from "react";
import type { ChecklistItem } from "@/types";
import { SELLER_STAGES } from "@/constants/checklist-seller";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { ChecklistItemRow } from "@/components/shared/ChecklistItem";
import { Card, CardTitle } from "@/components/ui/Card";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SellerChecklistProps {
  items: ChecklistItem[];
  onToggle: (id: string, completed: boolean) => void;
}

export function SellerChecklist({ items, onToggle }: SellerChecklistProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set(SELLER_STAGES)
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

        return (
          <Card key={stage}>
            <button
              onClick={() => toggleStage(stage)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown size={16} className="text-text-secondary" />
                ) : (
                  <ChevronRight size={16} className="text-text-secondary" />
                )}
                <CardTitle>{stage}</CardTitle>
              </div>
              <span className="text-sm text-text-secondary">
                {stageCompleted}/{stageItems.length}
              </span>
            </button>

            <ProgressBar
              value={stageProgress}
              showPercent={false}
              className="mt-2"
            />

            {isExpanded && (
              <div className="mt-3 space-y-1">
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

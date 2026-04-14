"use client";

import type { ChecklistItem } from "@/types";
import { GlossaryHighlight } from "@/components/ui/GlossaryTooltip";
import { useGlossaryTerms } from "@/contexts/GlossaryContext";
import { Check } from "lucide-react";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string, completed: boolean) => void;
}

export function ChecklistItemRow({ item, onToggle }: ChecklistItemRowProps) {
  const { terms } = useGlossaryTerms();
  return (
    <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-primary-light/50 transition-colors">
      <button
        role="checkbox"
        aria-checked={item.completed}
        aria-label={item.label}
        onClick={() => onToggle(item.id, !item.completed)}
        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${
          item.completed
            ? "bg-primary border-primary"
            : "border-border hover:border-primary"
        }`}
      >
        {item.completed && <Check size={14} className="text-white" aria-hidden="true" />}
      </button>
      <span
        className={`text-sm ${
          item.completed
            ? "line-through text-text-secondary"
            : "text-text-primary"
        }`}
      >
        <GlossaryHighlight text={item.label} terms={terms} />
      </span>
    </div>
  );
}

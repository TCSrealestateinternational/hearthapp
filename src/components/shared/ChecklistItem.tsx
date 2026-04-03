"use client";

import type { ChecklistItem } from "@/types";
import { Check } from "lucide-react";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string, completed: boolean) => void;
}

export function ChecklistItemRow({ item, onToggle }: ChecklistItemRowProps) {
  return (
    <label className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-primary-light/50 cursor-pointer transition-colors">
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggle(item.id, !item.completed);
        }}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          item.completed
            ? "bg-primary border-primary"
            : "border-border hover:border-primary"
        }`}
      >
        {item.completed && <Check size={14} className="text-white" />}
      </button>
      <span
        className={`text-sm ${
          item.completed
            ? "line-through text-text-secondary"
            : "text-text-primary"
        }`}
      >
        {item.label}
      </span>
    </label>
  );
}

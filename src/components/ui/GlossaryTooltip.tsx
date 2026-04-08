"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import type { GlossaryTerm } from "@/types";

// ── Standalone tooltip shown on hover ────────────────────────

interface TooltipProps {
  term: GlossaryTerm;
  anchorRect: DOMRect;
}

function Tooltip({ term, anchorRect }: TooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (!ref.current) return;
    const tt = ref.current.getBoundingClientRect();
    const pad = 8;

    // Try to place above the word; fall back below if no room
    let top = anchorRect.top - tt.height - pad + window.scrollY;
    if (top < window.scrollY + pad) {
      top = anchorRect.bottom + pad + window.scrollY;
    }

    // Centre horizontally, clamp within viewport
    let left =
      anchorRect.left + anchorRect.width / 2 - tt.width / 2 + window.scrollX;
    left = Math.max(pad, Math.min(left, window.innerWidth - tt.width - pad));

    setPosition({ top, left });
  }, [anchorRect]);

  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      className="pointer-events-none fixed z-[9999] max-w-xs rounded-xl border border-border bg-surface p-3 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
      style={{ top: position.top, left: position.left }}
    >
      <p className="text-xs font-semibold text-primary mb-1">{term.term}</p>
      <p className="text-xs text-text-secondary leading-relaxed">
        {term.plainDefinition}
      </p>
    </div>,
    document.body
  );
}

// ── Highlighted term span ────────────────────────────────────

interface HighlightedTermProps {
  text: string;
  term: GlossaryTerm;
}

function HighlightedTerm({ text, term }: HighlightedTermProps) {
  const [hovered, setHovered] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const handleEnter = useCallback(() => {
    if (spanRef.current) {
      setRect(spanRef.current.getBoundingClientRect());
    }
    setHovered(true);
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <>
      <span
        ref={spanRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        tabIndex={0}
        className="underline decoration-primary/40 decoration-dotted underline-offset-2 cursor-help transition-colors hover:text-primary hover:decoration-primary"
      >
        {text}
      </span>
      {hovered && rect && <Tooltip term={term} anchorRect={rect} />}
    </>
  );
}

// ── Main component: scans children text for glossary terms ───

interface GlossaryHighlightProps {
  /** The text to scan for glossary terms */
  text: string;
  /** Available glossary terms to match against */
  terms: GlossaryTerm[];
  /** Optional className for the wrapper */
  className?: string;
}

/**
 * Renders text with glossary terms highlighted and hoverable.
 * Each term gets a dotted underline; hovering shows the definition.
 */
export function GlossaryHighlight({
  text,
  terms,
  className = "",
}: GlossaryHighlightProps) {
  // Build a case-insensitive regex matching all terms, longest first
  const { pattern, termMap } = useMemo(() => {
    if (terms.length === 0) return { pattern: null, termMap: new Map() };

    // Sort longest first so "Earnest money deposit (EMD)" matches before "Earnest"
    const sorted = [...terms].sort(
      (a, b) => b.term.length - a.term.length
    );

    const map = new Map<string, GlossaryTerm>();
    const escaped: string[] = [];

    for (const t of sorted) {
      const key = t.term.toLowerCase();
      if (!map.has(key)) {
        map.set(key, t);
        escaped.push(t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      }
    }

    // Word-boundary match
    const re = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
    return { pattern: re, termMap: map };
  }, [terms]);

  if (!pattern || terms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex state
  pattern.lastIndex = 0;

  const seen = new Set<string>(); // only highlight first occurrence

  while ((match = pattern.exec(text)) !== null) {
    const matchText = match[0];
    const key = matchText.toLowerCase();
    const term = termMap.get(key);

    // Push text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (term && !seen.has(key)) {
      seen.add(key);
      parts.push(
        <HighlightedTerm key={match.index} text={matchText} term={term} />
      );
    } else {
      // Already highlighted this term once, render plain
      parts.push(matchText);
    }

    lastIndex = match.index + matchText.length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}

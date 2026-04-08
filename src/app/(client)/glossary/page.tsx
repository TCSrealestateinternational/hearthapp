"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGlossary } from "@/hooks/useGlossary";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { CATEGORY_ORDER } from "@/data/defaultGlossaryTerms";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, ChevronDown, ChevronUp, BookOpen, Layers } from "lucide-react";
import type { GlossaryTerm, GlossaryCategory } from "@/types";

type GroupMode = "category" | "alpha";

export default function GlossaryPage() {
  const { user } = useAuth();
  const { activeRole } = useRole(user);
  const { terms, loading } = useGlossary();
  const searchParams = useSearchParams();
  const linkedTermId = searchParams.get("term");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode>("category");
  const scrolledRef = useRef(false);

  // Auto-expand and scroll to a term when linked from elsewhere
  useEffect(() => {
    if (linkedTermId && !loading && terms.length > 0 && !scrolledRef.current) {
      setExpandedId(linkedTermId);
      scrolledRef.current = true;
      // Wait for DOM to render the expanded card
      requestAnimationFrame(() => {
        const el = document.getElementById(`glossary-${linkedTermId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          // Try scrolling to the card button instead
          const btn = document.querySelector(`[aria-controls="glossary-${linkedTermId}"]`);
          btn?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }
  }, [linkedTermId, loading, terms]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return terms;
    const q = searchQuery.toLowerCase();
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.plainDefinition.toLowerCase().includes(q)
    );
  }, [terms, searchQuery]);

  // Group by category
  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, GlossaryTerm[]>();
    for (const term of filtered) {
      const cat = term.category || "General";
      const existing = groups.get(cat) ?? [];
      existing.push(term);
      groups.set(cat, existing);
    }

    // Sort by CATEGORY_ORDER
    const sorted = new Map<string, GlossaryTerm[]>();
    for (const cat of CATEGORY_ORDER) {
      const items = groups.get(cat);
      if (items && items.length > 0) {
        sorted.set(cat, items);
      }
    }
    // Any remaining categories not in CATEGORY_ORDER
    for (const [cat, items] of groups) {
      if (!sorted.has(cat)) {
        sorted.set(cat, items);
      }
    }
    return sorted;
  }, [filtered]);

  // Group alphabetically
  const groupedAlpha = useMemo(() => {
    const groups = new Map<string, GlossaryTerm[]>();
    for (const term of filtered) {
      const letter = term.term[0]?.toUpperCase() || "#";
      const existing = groups.get(letter) ?? [];
      existing.push(term);
      groups.set(letter, existing);
    }
    return new Map([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)));
  }, [filtered]);

  const grouped = groupMode === "category" ? groupedByCategory : groupedAlpha;

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
          Real Estate Glossary
        </h1>

        {/* Group toggle */}
        <button
          onClick={() =>
            setGroupMode((m) => (m === "category" ? "alpha" : "category"))
          }
          className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-primary/30"
          aria-label={`Group by ${groupMode === "category" ? "alphabet" : "category"}`}
        >
          <Layers size={14} />
          {groupMode === "category" ? "A-Z" : "By Topic"}
        </button>
      </div>

      <p className="text-sm text-text-secondary mb-6">
        Real estate transaction terms defined for average buyers &amp; sellers.
        Tap any term to learn more.
      </p>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search terms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Search glossary terms"
        />
      </div>

      {/* Term count */}
      <p className="text-xs text-text-secondary mb-4">
        {filtered.length} term{filtered.length !== 1 ? "s" : ""}
        {searchQuery.trim() ? ` matching "${searchQuery}"` : ""}
      </p>

      {filtered.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <BookOpen
              size={40}
              className="mx-auto mb-3 text-text-secondary opacity-50"
            />
            {terms.length === 0 ? (
              <>
                <p className="text-text-secondary">No glossary terms yet.</p>
                <p className="text-sm text-text-secondary mt-1">
                  Your agent will add terms as your transaction progresses.
                </p>
              </>
            ) : (
              <p className="text-text-secondary">
                No terms match &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-8" role="list" aria-label="Glossary terms">
          {Array.from(grouped.entries()).map(([group, groupTerms]) => (
            <div key={group} role="listitem">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 sticky top-0 bg-background py-1 z-10 border-l-2 border-primary pl-2">
                {group}
                <span className="ml-2 font-normal text-text-secondary/60">
                  ({groupTerms.length})
                </span>
              </h2>
              <div className="space-y-2">
                {groupTerms.map((term) => {
                  const isExpanded = expandedId === term.id;
                  const roleContext =
                    activeRole === "buyer"
                      ? term.buyerContext
                      : term.sellerContext;

                  return (
                    <Card key={term.id} padding={false}>
                      <button
                        onClick={() => toggle(term.id)}
                        className="w-full flex items-center justify-between p-4 text-left"
                        aria-expanded={isExpanded}
                        aria-controls={`glossary-${term.id}`}
                      >
                        <span className="font-medium text-text-primary">
                          {term.term}
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-text-secondary shrink-0" />
                        ) : (
                          <ChevronDown size={18} className="text-text-secondary shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div
                          id={`glossary-${term.id}`}
                          className="px-4 pb-4 space-y-3"
                        >
                          <p className="text-sm text-text-secondary">
                            {term.plainDefinition}
                          </p>

                          {roleContext && (
                            <div className="rounded-lg bg-primary-light/30 p-3">
                              <p className="text-xs font-semibold text-primary mb-1">
                                {activeRole === "buyer"
                                  ? "For Buyers"
                                  : "For Sellers"}
                              </p>
                              <p className="text-sm text-text-primary">
                                {roleContext}
                              </p>
                            </div>
                          )}

                          {term.aslVideoUrl && (
                            <div>
                              <p className="text-xs font-semibold text-text-secondary mb-1">
                                ASL Video
                              </p>
                              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                                <iframe
                                  src={term.aslVideoUrl}
                                  title={`ASL sign for ${term.term}`}
                                  className="absolute inset-0 w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          )}

                          {term.relatedTerms && term.relatedTerms.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {term.relatedTerms.map((related) => {
                                const relatedTerm = terms.find(
                                  (t) => t.term.toLowerCase() === related.toLowerCase()
                                );
                                return relatedTerm ? (
                                  <Link
                                    key={related}
                                    href={`/glossary?term=${encodeURIComponent(relatedTerm.id)}`}
                                    onClick={() => {
                                      setExpandedId(relatedTerm.id);
                                      requestAnimationFrame(() => {
                                        document
                                          .querySelector(`[aria-controls="glossary-${relatedTerm.id}"]`)
                                          ?.scrollIntoView({ behavior: "smooth", block: "center" });
                                      });
                                    }}
                                  >
                                    <Badge variant="default" className="hover:bg-primary/10 cursor-pointer">
                                      {related}
                                    </Badge>
                                  </Link>
                                ) : (
                                  <Badge key={related} variant="default">
                                    {related}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

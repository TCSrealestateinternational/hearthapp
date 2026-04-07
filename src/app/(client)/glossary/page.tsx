"use client";

import { useState, useMemo } from "react";
import { useGlossary } from "@/hooks/useGlossary";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import type { GlossaryTerm } from "@/types";

export default function GlossaryPage() {
  const { user } = useAuth();
  const { activeRole } = useRole(user);
  const { terms, loading } = useGlossary();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return terms;
    const q = searchQuery.toLowerCase();
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.plainDefinition.toLowerCase().includes(q)
    );
  }, [terms, searchQuery]);

  // Group alphabetically
  const grouped = useMemo(() => {
    const groups = new Map<string, GlossaryTerm[]>();
    for (const term of filtered) {
      const letter = term.term[0]?.toUpperCase() || "#";
      const existing = groups.get(letter) ?? [];
      existing.push(term);
      groups.set(letter, existing);
    }
    return groups;
  }, [filtered]);

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
      <h1 className="text-2xl font-extrabold tracking-tight text-text-primary mb-4">
        Real Estate Glossary
      </h1>

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
        <div className="space-y-6" role="list" aria-label="Glossary terms">
          {Array.from(grouped.entries()).map(([letter, letterTerms]) => (
            <div key={letter} role="listitem">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 sticky top-0 bg-background py-1 z-10 border-l-2 border-primary pl-2">
                {letter}
              </h2>
              <div className="space-y-2">
                {letterTerms.map((term) => {
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
                              {term.relatedTerms.map((related) => (
                                <Badge key={related} variant="default">
                                  {related}
                                </Badge>
                              ))}
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

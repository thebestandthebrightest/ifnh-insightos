"use client";

import { useState, useMemo } from "react";
import { SectionHeader, Subhead, Divider, Note } from "@/components/SectionHeader";
import { KPICard } from "@/components/KPICard";
import { InsightCard } from "@/components/InsightCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { generateRecommendations, partitionTiers, CATEGORIES } from "@/lib/recommendations";
import { Zap, TrendingUp, ArrowRight } from "lucide-react";

export default function Recommendations() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quickWinsOnly, setQuickWinsOnly] = useState(false);

  const allRecs = useMemo(() => generateRecommendations(), []);

  const filtered = useMemo(() => {
    let recs = allRecs;
    if (selectedCategory !== "All") {
      recs = recs.filter((r) => r.category === selectedCategory);
    }
    if (quickWinsOnly) {
      recs = recs.filter((r) => r.quick_win && r.effort === "Low");
    }
    return recs;
  }, [allRecs, selectedCategory, quickWinsOnly]);

  const { quickWins, strategic, longerTerm } = useMemo(
    () => partitionTiers(filtered),
    [filtered]
  );

  const isGrouped = selectedCategory === "All" && !quickWinsOnly;

  const qwCount = allRecs.filter((r) => r.quick_win && r.effort === "Low").length;
  const highCount = allRecs.filter((r) => r.priority === "High").length;
  const topScore = allRecs[0]?.adjusted_score ?? 0;

  return (
    <div>
      <SectionHeader
        eyebrow="Section 05 · Recommendation Engine"
        title="Recommendation Engine"
        subtitle="Data-driven actions ranked by impact, feasibility, and student demand."
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <KPICard
          label="Total Recommendations"
          value={String(allRecs.length)}
          note="Across all categories and priorities"
        />
        <KPICard
          label="Quick Wins Available"
          value={String(qwCount)}
          status="Strong"
          note="Low effort, high or medium impact — start here"
        />
        <KPICard
          label="High Priority Actions"
          value={String(highCount)}
          note="Recommendations marked High priority"
        />
      </div>

      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded border"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex-1">
          <label
            className="text-[0.67rem] uppercase tracking-wide font-semibold block mb-1.5"
            style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded border px-3 py-2 text-[0.84rem] appearance-none cursor-pointer"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg)",
              color: "var(--text)",
            }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={quickWinsOnly}
              onChange={(e) => setQuickWinsOnly(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: "var(--sage)" }}
            />
            <span className="text-[0.84rem] font-medium" style={{ color: "var(--text)" }}>
              Quick Wins only
            </span>
          </label>
        </div>
      </div>

      {/* Grouped view (default) */}
      {isGrouped ? (
        <div>
          {/* Quick wins */}
          {quickWins.length > 0 && (
            <div className="mb-8">
              <div
                className="flex items-center gap-2 mb-2"
                style={{ color: "var(--sage)" }}
              >
                <Zap size={14} strokeWidth={1.75} />
                <span
                  className="text-[0.68rem] uppercase tracking-widest font-semibold"
                  style={{ letterSpacing: "0.14em" }}
                >
                  Quick Wins — Start Here
                </span>
              </div>
              <Note>{quickWins.length} recommendations · Low effort, High or Medium impact</Note>
              {quickWins.map((rec) => (
                <RecommendationCard key={rec.rank} rec={rec} />
              ))}
            </div>
          )}

          {/* Strategic */}
          {strategic.length > 0 && (
            <div className="mb-8">
              <div
                className="flex items-center gap-2 mb-2"
                style={{ color: "var(--blue-grey)" }}
              >
                <TrendingUp size={14} strokeWidth={1.75} />
                <span
                  className="text-[0.68rem] uppercase tracking-widest font-semibold"
                  style={{ letterSpacing: "0.14em", color: "var(--blue-grey)" }}
                >
                  Strategic Changes
                </span>
              </div>
              <Note>{strategic.length} recommendations · High priority, medium-to-high effort</Note>
              {strategic.map((rec) => (
                <RecommendationCard key={rec.rank} rec={rec} />
              ))}
            </div>
          )}

          {/* Longer-term */}
          {longerTerm.length > 0 && (
            <div className="mb-8">
              <div
                className="flex items-center gap-2 mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                <ArrowRight size={14} strokeWidth={1.75} />
                <span
                  className="text-[0.68rem] uppercase tracking-widest font-semibold"
                  style={{ letterSpacing: "0.14em" }}
                >
                  Longer-Term
                </span>
              </div>
              <Note>{longerTerm.length} recommendations · Medium or lower priority</Note>
              {longerTerm.map((rec) => (
                <RecommendationCard key={rec.rank} rec={rec} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Flat filtered view */
        <div>
          <Note>
            Showing {filtered.length} of {allRecs.length} recommendations · sorted by composite score (Impact × Feasibility × Demand)
          </Note>
          {filtered.map((rec) => (
            <RecommendationCard key={rec.rank} rec={rec} showScore />
          ))}
          {filtered.length === 0 && (
            <div
              className="text-center py-12 text-[0.88rem]"
              style={{ color: "var(--text-muted)" }}
            >
              No recommendations match the current filters.
            </div>
          )}
        </div>
      )}

      <Divider />

      <InsightCard
        title="How Recommendations Are Scored"
        description="Each recommendation is scored by Impact × Feasibility × Demand / 25, then adjusted based on live metric values. A seating recommendation scores higher when seating is a strong signal (≥40%). Wellness recommendations score higher when awareness is below 60%. The final rank reflects both the static data-driven score and these dynamic boosts."
        severity="watch"
      />
    </div>
  );
}

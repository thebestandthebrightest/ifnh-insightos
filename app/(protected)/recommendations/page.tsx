import { ArrowRight, CheckCircle2, Clock3, Flag, Sparkles } from "lucide-react";
import { Divider, Note, SectionHeader, Subhead } from "@/components/SectionHeader";
import { KPICard } from "@/components/KPICard";
import { METRICS } from "@/lib/data";
import {
  EXECUTIVE_PRIORITIES,
  GUIDING_PRINCIPLES,
  IMPLEMENTATION_PHASES,
  SECONDARY_OPPORTUNITIES,
  SUCCESS_MARKERS,
} from "@/lib/recommendations";

function MetaPill({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide"
      style={{ borderColor: "var(--border)", color: "var(--text-muted)", letterSpacing: "0.08em" }}
    >
      {label}
    </span>
  );
}

function PriorityCard({
  index,
  priority,
}: {
  index: number;
  priority: (typeof EXECUTIVE_PRIORITIES)[number];
}) {
  return (
    <div
      className="rounded border p-5 md:p-6"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="grid gap-5 lg:grid-cols-[170px_1fr]">
        <div className="border-b pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5" style={{ borderColor: "var(--divider)" }}>
          <div
            className="text-[0.62rem] uppercase tracking-widest font-semibold mb-2"
            style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
          >
            Priority {index + 1}
          </div>
          <div className="font-serif text-5xl leading-none mb-4" style={{ color: "var(--text)" }}>
            0{index + 1}
          </div>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <MetaPill label={priority.cost} />
            <MetaPill label={priority.impact} />
            <MetaPill label={priority.timeline} />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl leading-tight mb-2" style={{ color: "var(--text)" }}>
            {priority.title}
          </h2>
          <p className="text-[0.96rem] leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
            {priority.summary}
          </p>

          <div className="grid gap-5 xl:grid-cols-2">
            <div>
              <div
                className="text-[0.65rem] uppercase tracking-widest font-semibold mb-2"
                style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
              >
                Why This Matters
              </div>
              <ul className="space-y-2">
                {priority.evidence.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[0.84rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--olive)" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div
                className="text-[0.65rem] uppercase tracking-widest font-semibold mb-2"
                style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
              >
                Concrete Actions
              </div>
              <ul className="space-y-2">
                {priority.actions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[0.84rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    <CheckCircle2 size={15} strokeWidth={1.8} className="mt-0.5 shrink-0" style={{ color: "var(--sage)" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t pt-4 md:grid-cols-[1.2fr_0.8fr]" style={{ borderColor: "var(--divider)" }}>
            <div>
              <div
                className="text-[0.65rem] uppercase tracking-widest font-semibold mb-1.5"
                style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
              >
                Expected Impact
              </div>
              <p className="text-[0.83rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {priority.expectedImpact}
              </p>
            </div>
            <div>
              <div
                className="text-[0.65rem] uppercase tracking-widest font-semibold mb-1.5"
                style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
              >
                Suggested Lead
              </div>
              <p className="text-[0.83rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {priority.lead}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapCard({ phase }: { phase: (typeof IMPLEMENTATION_PHASES)[number] }) {
  return (
    <div className="relative pl-8">
      <span
        className="absolute left-0 top-6 h-3 w-3 rounded-full border"
        style={{ background: "var(--card)", borderColor: "var(--olive)" }}
      />
      <div
        className="rounded border p-5"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
          <h3 className="font-serif text-xl leading-tight" style={{ color: "var(--text)" }}>
            {phase.phase}
          </h3>
          <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-wide" style={{ color: "var(--text-light)", letterSpacing: "0.08em" }}>
            <Clock3 size={13} strokeWidth={1.8} />
            {phase.timing}
          </div>
        </div>
        <p className="mt-2 text-[0.88rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {phase.goal}
        </p>
        <ul className="mt-4 space-y-2">
          {phase.actions.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[0.82rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              <ArrowRight size={14} strokeWidth={1.8} className="mt-0.5 shrink-0" style={{ color: "var(--blue-grey)" }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Recommendations() {
  const awarenessGap = 100 - Math.round((METRICS.awareness.rate ?? 0) * 100);

  return (
    <div>
      <SectionHeader
        eyebrow="Section 05 · Executive Action Plan"
        title="Recommendations & Implementation Roadmap"
        subtitle="What should IFNH do first? The strongest evidence points toward interaction conversion, flexible seating, and built-in wellness discovery."
      />

      <div className="grid gap-5 lg:grid-cols-[1.45fr_0.95fr] mb-10">
        <div
          className="rounded border p-6 md:p-7"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="text-[0.65rem] uppercase tracking-widest font-semibold mb-3"
            style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
          >
            Executive Direction
          </div>
          <p className="font-serif text-[1.7rem] leading-tight mb-4" style={{ color: "var(--text)" }}>
            IFNH does not have an attendance problem. It has a conversion problem.
          </p>
          <p className="text-[0.96rem] leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
            Students already use the space heavily. The next step is turning co-presence into interaction, discovery, and intentional engagement inside a room that is already active.
          </p>
          <p className="text-[0.9rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            That means prioritizing table activation, better seating flexibility, and embedded ScarletWell visibility before quieter secondary enhancements. Quiet/recharge should remain on the roadmap, but not at the center of it.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <KPICard
            label="Regular Visitation"
            value={`${METRICS.visit.rate_pct} · n=${METRICS.visit.n}/${METRICS.visit.n_total}`}
            note={`${METRICS.visit.n} of ${METRICS.visit.n_total} answered visitors come regularly.`}
          />
          <KPICard
            label="Met Someone New Here"
            value={`${METRICS.interaction.rate_pct} · n=${METRICS.interaction.n_met}/${METRICS.interaction.n_total}`}
            note={`${METRICS.interaction.open_rate_pct} are open to it, but the space is not converting that intent consistently.`}
          />
          <KPICard
            label="ScarletWell Awareness"
            value={`${METRICS.awareness.rate_pct} · n=${METRICS.awareness.n_aware}/${METRICS.awareness.n_total}`}
            note={`${awarenessGap}% are still unsure or unaware, even while using IFNH.`}
          />
        </div>
      </div>

      <Subhead>Top 3 Highest-Leverage Priorities</Subhead>
      <Note>
        These are the first moves most likely to improve student experience, strengthen community outcomes, and create visible operational progress without overwhelming stakeholders.
      </Note>

      <div className="space-y-5">
        {EXECUTIVE_PRIORITIES.map((priority, index) => (
          <PriorityCard key={priority.title} index={index} priority={priority} />
        ))}
      </div>

      <Divider />

      <Subhead>Suggested Implementation Roadmap</Subhead>
      <Note>
        Sequence the work so fast pilots shape later investment. The goal is to learn early, then make the environment better support what students already want to do there.
      </Note>

      <div className="relative space-y-4 before:absolute before:bottom-6 before:left-[5px] before:top-6 before:w-px before:bg-[var(--divider)]">
        {IMPLEMENTATION_PHASES.map((phase) => (
          <RoadmapCard key={phase.phase} phase={phase} />
        ))}
      </div>

      <Divider />

      <Subhead>Secondary Opportunities</Subhead>
      <Note>
        These are additive opportunities, not the first-order priorities. They become more useful once interaction, seating, and visibility basics are working better.
      </Note>

      <div className="grid gap-3 md:grid-cols-2">
        {SECONDARY_OPPORTUNITIES.map((item) => (
          <div
            key={item.title}
            className="rounded border p-4"
            style={{ background: "rgba(255,255,255,0.58)", borderColor: "var(--border)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-medium text-[0.95rem] leading-snug" style={{ color: "var(--text)" }}>
                {item.title}
              </h3>
              <div
                className="text-[0.62rem] uppercase tracking-wide font-semibold shrink-0"
                style={{ color: "var(--text-light)", letterSpacing: "0.08em" }}
              >
                Secondary
              </div>
            </div>
            <p className="text-[0.82rem] leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
              {item.description}
            </p>
            <div className="text-[0.74rem] leading-snug" style={{ color: "var(--text-light)" }}>
              Best timing: {item.timing}
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <Subhead className="mt-0">Guiding Principles</Subhead>
          <div
            className="rounded border p-5"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <ul className="space-y-3">
              {GUIDING_PRINCIPLES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Flag size={14} strokeWidth={1.85} className="mt-1 shrink-0" style={{ color: "var(--olive)" }} />
                  <span className="text-[0.84rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <Subhead className="mt-0">Success Metrics</Subhead>
          <div
            className="rounded border overflow-hidden"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            {SUCCESS_MARKERS.map((item, index) => (
              <div
                key={item.label}
                className="grid gap-1 px-4 py-4 md:grid-cols-[0.9fr_0.7fr_1.1fr]"
                style={{ borderTop: index === 0 ? "none" : "1px solid var(--divider)" }}
              >
                <div className="text-[0.82rem] font-medium leading-snug" style={{ color: "var(--text)" }}>
                  {item.label}
                </div>
                <div className="text-[0.77rem] leading-snug" style={{ color: "var(--text-light)" }}>
                  Baseline: {item.baseline}
                </div>
                <div className="text-[0.77rem] leading-snug" style={{ color: "var(--text-muted)" }}>
                  {item.shift}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-8 rounded border p-4"
        style={{ background: "rgba(122,143,122,0.06)", borderColor: "rgba(122,143,122,0.22)" }}
      >
        <div className="flex items-start gap-3">
          <Sparkles size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" style={{ color: "var(--sage)" }} />
          <div>
            <div
              className="text-[0.65rem] uppercase tracking-widest font-semibold mb-1.5"
              style={{ color: "var(--sage)", letterSpacing: "0.12em" }}
            >
              Recommendation Calibration
            </div>
            <p className="text-[0.82rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Priority order reflects the strongest cross-source evidence first: behavioral conversion gaps, dominant open-text themes, and the clearest low-friction activation opportunities. Prompted quiet/recharge interest remains part of the picture, but it is intentionally treated as a later environmental layer rather than the central strategic issue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { SectionHeader, Subhead, Divider, Note } from "@/components/SectionHeader";
import { KPICard } from "@/components/KPICard";
import { InsightCard } from "@/components/InsightCard";
import { RankedList } from "@/components/RankedList";
import { ThemeCard } from "@/components/ThemeCard";
import { AwarenessDonut } from "@/components/charts/AwarenessDonut";
import { METRICS, THEME_META, QUOTES, CHANNEL_PRIORITY, SEGMENTS } from "@/lib/data";

// Best quote for each theme (selected to be ~85 chars, substantive)
const THEME_QUOTES: Record<string, string> = {
  "Seating Capacity": "More tables — the current capacity is often full, meaning people need to wait to find a place to sit.",
  "Events & Programming": "I really enjoyed the Wellness Through Clay events here, so probably events similar to that.",
  "Social Connection": "A little sign on the table you could flip around to indicate you're welcome to strangers sitting with you.",
  "Quiet Reflection": "A lounge area that can be optimized for resting.",
  "Wellness Resources": "Basic needs center information, bingo, art activities.",
  "Comfort & Design": "I fell less anxious and the lot of natural light made me feel good.",
  "Food & Harvest": "Cooking events, food sampling, career events.",
};

export default function StudentVoice() {
  const m = METRICS;
  const themes = m.themes;
  const aware = m.awareness;
  const wellness = m.wellness;
  const channels = m.channels;
  const activities = m.activities;

  // Sort themes by spontaneous open-text mention rate so qualitative prominence stays honest.
  const sortedThemes = Object.entries(themes).sort((a, b) => b[1].pct - a[1].pct);

  const activityItems = Object.entries(activities.norm).map(([label, value]) => ({
    label,
    value,
    count: (activities.dist as Record<string, number>)[label],
  }));

  return (
    <div>
      <SectionHeader
        eyebrow="Section 03 · Student Voice"
        title="Student Ideas & Themes"
        subtitle="What are students actually saying? Open-ended responses translated into strategic themes, activity preferences, and wellness channel insights."
      />

      {/* Theme cards grid */}
      <Subhead>Key Themes from Open-Text Responses</Subhead>
      <Note>
        Each card shows the share of students who mentioned a theme spontaneously in open text. Prompted preference questions are referenced separately and are not treated as spontaneous qualitative themes.
      </Note>

      <div className="grid md:grid-cols-2 gap-0 mb-2">
        {sortedThemes.map(([name, data]) => {
          const meta = THEME_META[name];
          if (!meta) return null;

          const isQuietRefl = name === "Quiet Reflection";
          const displayPct = data.pct;
          const pctNote = isQuietRefl
            ? `open-text mentions: ${(data.pct * 100).toFixed(0)}% · prompted yes/no preference: ${m.reflection.rate_pct} (${m.reflection.n_yes} of ${m.reflection.n_total})`
            : undefined;

          return (
            <ThemeCard
              key={name}
              name={name}
              pct={displayPct}
              pctNote={pctNote}
              label={meta.label}
              description={meta.desc}
              color={meta.color}
              quote={THEME_QUOTES[name]}
            />
          );
        })}
      </div>

      <InsightCard
        title="What the Qualitative Data Is Telling Us"
        description="Seating, programming-related activation, and the broader food/Harvest ecosystem dominate open-text responses. Students are not primarily asking for retreat from the space; they are asking for the space to work better, feel less crowded, and create easier pathways into activity and interaction."
        severity="opportunity"
        action='Use qualitative themes as the "why" behind quantitative metrics. Seating and activation are the loudest operational signals; quiet/recharge is better treated as a later prompted preference.'
      />

      <div className="grid md:grid-cols-3 gap-3 mb-8">
        <InsightCard
          title="Operational Frustrations"
          description="Seating overflow and table availability are the clearest spontaneous complaints. Students often describe not finding a seat, not the need to withdraw from the space."
          severity="concern"
        />
        <InsightCard
          title="Programming & Social Activation"
          description="Programming, themed activities, and low-pressure conversation cues recur in the open-ended responses, reinforcing the main behavioral opportunity around interaction."
          severity="opportunity"
        />
        <InsightCard
          title="Food + Harvest as a Behavioral Anchor"
          description={`Explicit Food + Harvest mentions land at ${(m.themes["Food & Harvest"].pct * 100).toFixed(0)}% of total responses. Even with stricter coding, dining-adjacent activation still looks like one of the easiest pathways into recurring interaction and engagement.`}
          severity="positive"
        />
      </div>

      <InsightCard
        title="Quiet / Recharge Is Present, but Secondary"
        description={`Quiet/recharge appears much more strongly when prompted (${m.reflection.rate_pct}, based on ${m.reflection.n_total} yes/no responses) than it does in spontaneous comments (${(m.reflection.opentext_rate * 100).toFixed(0)}% of all responses). That makes it meaningful, but not the dominant qualitative theme.`}
        severity="watch"
      />

      <Divider />

      {/* Activity preferences */}
      <Subhead>Preferred Table Activities</Subhead>
      <Note>
        What kind of activities would students most want at their table? Students ranked their preferences across six options (n = {activities.n} answered).
      </Note>

      <div
        className="rounded border p-5 mb-6"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <RankedList
          items={activityItems}
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
        />
      </div>

      <InsightCard
        title="Trivia & Theme Days Are the Clear Winner"
        description="Trivia or theme days lead at 34% of respondents, followed by creative prompts and daily/weekly challenges (each at 15%). These formats are all low-cost, require minimal setup, and can double as ScarletWell awareness moments."
        severity="opportunity"
        action="Start with trivia/theme days for the first IFNH event series. Rotate creative prompts at tables monthly."
      />

      <Divider />

      {/* Wellness awareness */}
      <Subhead>Wellness Awareness</Subhead>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <KPICard
          label="ScarletWell Awareness"
          value={aware.rate_pct}
          status={aware.rate < 0.50 ? "Needs Attention" : aware.rate < 0.65 ? "Watch" : "Strong"}
          note={`${aware.n_aware} of ${aware.n_total} answered Yes; ${aware.n_not_sure} were not sure.`}
        />
        <KPICard
          label="Wellness Resource Awareness"
          value={`${wellness.mean_str} / 5`}
          status={wellness.mean < 3.8 ? "Watch" : "Strong"}
          note={`Average Likert rating of campus wellness resource awareness (Q11 n = ${wellness.n}).`}
        />
        <KPICard
          label="Top Preferred Channel"
          value={channels.top}
          status="Strong"
          note={`Most-preferred way to discover wellness resources (Q12 n = ${channels.n}).`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Donut */}
        <div
          className="rounded border p-5"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <Note>Awareness question denominator: n = {aware.n_total} answered.</Note>
          <AwarenessDonut dist={aware.raw_dist} title="ScarletWell Awareness" />
        </div>

        {/* Channel priority list */}
        <div
          className="rounded border p-5"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="text-[0.65rem] uppercase tracking-widest font-semibold mb-3"
            style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
          >
            Preferred Awareness Channels
          </div>
          <Note>Channel preference denominator: n = {channels.n} answered.</Note>
          <div className="divide-y" style={{ borderColor: "var(--divider)" }}>
            {CHANNEL_PRIORITY.map(({ channel, priority, note, color }) => (
              <div
                key={channel}
                className="flex items-baseline gap-4 py-3"
              >
                <div
                  className="font-medium text-[0.88rem] min-w-[130px]"
                  style={{ color: "var(--text)" }}
                >
                  {channel}
                </div>
                <div
                  className="text-[0.67rem] font-semibold uppercase tracking-wide min-w-[50px]"
                  style={{ color, letterSpacing: "0.08em" }}
                >
                  {priority}
                </div>
                <div className="text-[0.8rem]" style={{ color: "var(--text-muted)" }}>
                  {note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Awareness insights */}
      <div className="space-y-3">
        <InsightCard
          title="ScarletWell-Aware Students Report Higher Connection Scores"
          description={`Aware students score ${(SEGMENTS.find(s => s.label === "ScarletWell Aware")?.value ?? 0).toFixed(2)}/5 on connection versus ${(SEGMENTS.find(s => s.label === "ScarletWell Unaware")?.value ?? 0).toFixed(2)}/5 for unaware students. Awareness and belonging may be reinforcing each other.`}
          severity="opportunity"
          action="Use ScarletWell awareness as a connection lever — awareness appears to amplify belonging."
        />
        <InsightCard
          title="Awareness Is a Communication Problem, Not an Interest Problem"
          description={`With ${(aware.rate * 100).toFixed(0)}% awareness, students are using the physical space without discovering the wellness ecosystem connected to it. Channel preferences point to low-friction, ambient solutions.`}
          severity="concern"
          action="Embed ScarletWell touchpoints into the environment. Table cards are the #1 preferred channel — start there."
        />
      </div>

      <Divider />

      {/* Student voices */}
      <Subhead>Student Voices</Subhead>
      <Note>A selection of unedited responses from the open-text questions.</Note>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Column 1: welcoming */}
        <div>
          <div
            className="text-[0.63rem] uppercase tracking-widest font-semibold mb-3"
            style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            What would make the space more welcoming?
          </div>
          <div className="space-y-2">
            {QUOTES.welcoming.slice(0, 5).map((q, i) => (
              <blockquote
                key={i}
                className="border-l pl-3 py-1"
                style={{ borderColor: "var(--divider)" }}
              >
                <span
                  className="font-serif text-[0.84rem] italic leading-snug"
                  style={{ color: "#5A5A5A" }}
                >
                  &ldquo;{q}&rdquo;
                </span>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Column 2: social */}
        <div>
          <div
            className="text-[0.63rem] uppercase tracking-widest font-semibold mb-3"
            style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            What would encourage talking to someone new?
          </div>
          <div className="space-y-2">
            {QUOTES.social.slice(0, 5).map((q, i) => (
              <blockquote
                key={i}
                className="border-l pl-3 py-1"
                style={{ borderColor: "var(--divider)" }}
              >
                <span
                  className="font-serif text-[0.84rem] italic leading-snug"
                  style={{ color: "#5A5A5A" }}
                >
                  &ldquo;{q}&rdquo;
                </span>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface Metric {
  rate?: number | null;
  rate_pct?: string;
  n?: number;
  n_total?: number;
  mean?: number | null;
  mean_str?: string;
}

export interface GapItem {
  need: string;
  demand: number;
  support: number;
  gap: number;
  note: string;
  impact_potential: number;
  demand_pct: string;
  support_pct: string;
  gap_pct: string;
}

export interface FunnelStage {
  stage: string;
  n: number;
  pct: number;
  drop: number | null;
  stage_drop_pct: number;
}

export interface Recommendation {
  title: string;
  category: string;
  why: string;
  metric: string;
  outcome: string;
  impact: number;
  feasibility: number;
  demand: number;
  score: number;
  adjusted_score: number;
  priority: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  owner: string;
  quick_win: boolean;
  rank: number;
}

export interface ScenarioParams {
  tables_2seat: number;
  tables_4seat: number;
  lounge_seats: number;
  temp_seats: number;
  shared_seating_pct: number;
  events_per_week: number;
  programming_level: number;
}

export interface ScenarioResult extends ScenarioParams {
  capacity: number;
  seating_pressure: number;
  interaction_rate: number;
  connection_score: number;
  students_connecting: number;
  daily_demand: number;
}

export interface ScenarioComparison {
  current: ScenarioResult;
  scenario: ScenarioResult;
  deltas: {
    capacity: number;
    seating_pressure: number;
    interaction_rate: number;
    connection_score: number;
    students_connecting: number;
  };
}

export type InsightSeverity = "positive" | "watch" | "concern" | "opportunity";

export interface Insight {
  title: string;
  description: string;
  severity: InsightSeverity;
  action?: string;
  metric?: string;
}

import type { ScenarioParams, ScenarioResult, ScenarioComparison } from "./types";

// ── Baseline (mirrors scenario_model.py BASELINE) ─────────────────────────────

export const BASELINE = {
  interaction_rate: 0.376,
  connection_score: 3.97,
  n_survey: 93,
  daily_demand: 150,
};

// ── Defaults (current state) ──────────────────────────────────────────────────

export const DEFAULTS: ScenarioParams = {
  tables_2seat: 10,
  tables_4seat: 25,
  lounge_seats: 42,
  temp_seats: 0,
  shared_seating_pct: 0.20,
  events_per_week: 0,
  programming_level: 1,
};

// ── Presets ───────────────────────────────────────────────────────────────────

export const PRESETS: Record<string, ScenarioParams> = {
  "Current State": { ...DEFAULTS },
  "Add Seats (+20%)": {
    ...DEFAULTS,
    tables_2seat: 10,
    tables_4seat: 30,
    lounge_seats: 52,
    temp_seats: 10,
  },
  "Increase Shared Seating": {
    ...DEFAULTS,
    tables_4seat: 30,
    shared_seating_pct: 0.45,
  },
  "Maximize Connection": {
    ...DEFAULTS,
    tables_4seat: 32,
    tables_2seat: 5,
    lounge_seats: 52,
    shared_seating_pct: 0.60,
    events_per_week: 3,
    programming_level: 4,
  },
  "Reduce Crowding": {
    ...DEFAULTS,
    tables_2seat: 8,
    tables_4seat: 22,
    lounge_seats: 55,
    temp_seats: 20,
    shared_seating_pct: 0.15,
  },
  "Balanced Strategy": {
    ...DEFAULTS,
    tables_2seat: 8,
    tables_4seat: 28,
    lounge_seats: 50,
    temp_seats: 10,
    shared_seating_pct: 0.35,
    events_per_week: 2,
    programming_level: 3,
  },
};

// ── Capacity helpers ──────────────────────────────────────────────────────────

function calculateCapacity(p: ScenarioParams): number {
  return p.tables_2seat * 2 + p.tables_4seat * 4 + p.lounge_seats + p.temp_seats;
}

function calculatePressure(capacity: number, dailyDemand: number, peakFactor = 0.65): number {
  if (capacity <= 0) return Infinity;
  return Math.round((dailyDemand * peakFactor) / capacity * 1000) / 1000;
}

// ── Interaction rate model (direct port of simulate_interaction_rate) ─────────

function simulateInteractionRate(p: ScenarioParams, dailyDemand: number): number {
  const base = BASELINE.interaction_rate;
  const capacity = calculateCapacity(p);
  const pressure = calculatePressure(capacity, dailyDemand);

  const totalTables = Math.max(p.tables_2seat + p.tables_4seat, 1);
  const groupTableRatio = p.tables_4seat / totalTables;
  const groupEffect = (groupTableRatio - 0.70) * 0.10;

  const sharedEffect = (p.shared_seating_pct - 0.20) * 0.25;

  const loungeShare = p.lounge_seats / Math.max(capacity, 1);
  const loungeEffect = (loungeShare - 0.43) * 0.08;

  const eventEffect = Math.min(p.events_per_week, 5) * 0.025;
  const progEffect = (p.programming_level - 1) * 0.015;

  let crowdingPenalty = 0;
  if (pressure > 1.2) {
    crowdingPenalty = (pressure - 1.2) * 0.10;
  } else if (pressure > 1.0) {
    crowdingPenalty = (pressure - 1.0) * 0.05;
  }

  const rate = base + groupEffect + sharedEffect + loungeEffect + eventEffect + progEffect - crowdingPenalty;
  return Math.min(0.95, Math.max(0.05, rate));
}

// ── Connection score model ────────────────────────────────────────────────────

function simulateConnectionScore(
  interactionRate: number,
  p: ScenarioParams,
): number {
  const base = BASELINE.connection_score;
  const interactionLift = (interactionRate - BASELINE.interaction_rate) * 2.0;
  const progLift = (p.programming_level - 1) * 0.05;
  const eventLift = Math.min(p.events_per_week, 5) * 0.04;
  const sharedLift = (p.shared_seating_pct - 0.20) * 0.15;
  return Math.min(5.0, Math.max(1.0, base + interactionLift + progLift + eventLift + sharedLift));
}

// ── Full scenario runner ──────────────────────────────────────────────────────

export function runScenario(params: ScenarioParams, dailyDemand = BASELINE.daily_demand): ScenarioResult {
  const capacity = calculateCapacity(params);
  const seating_pressure = calculatePressure(capacity, dailyDemand);
  const interaction_rate = simulateInteractionRate(params, dailyDemand);
  const connection_score = simulateConnectionScore(interaction_rate, params);
  const students_connecting = Math.round(interaction_rate * dailyDemand);

  return {
    ...params,
    capacity,
    seating_pressure,
    interaction_rate,
    connection_score,
    students_connecting,
    daily_demand: dailyDemand,
  };
}

// ── Comparison ────────────────────────────────────────────────────────────────

export function compareScenario(params: ScenarioParams, dailyDemand = BASELINE.daily_demand): ScenarioComparison {
  const current = runScenario(DEFAULTS, dailyDemand);
  const scenario = runScenario(params, dailyDemand);

  const round4 = (n: number) => Math.round(n * 10000) / 10000;

  return {
    current,
    scenario,
    deltas: {
      capacity: scenario.capacity - current.capacity,
      seating_pressure: round4(scenario.seating_pressure - current.seating_pressure),
      interaction_rate: round4(scenario.interaction_rate - current.interaction_rate),
      connection_score: round4(scenario.connection_score - current.connection_score),
      students_connecting: scenario.students_connecting - current.students_connecting,
    },
  };
}

// ── Scenario interpretation text ─────────────────────────────────────────────

export function generateInterpretation(comparison: ScenarioComparison): string {
  const { deltas, current, scenario } = comparison;
  const parts: string[] = [];

  if (Math.abs(deltas.interaction_rate) > 0.005) {
    const dir = deltas.interaction_rate > 0 ? "increases" : "decreases";
    const students = Math.abs(deltas.students_connecting);
    parts.push(
      `This scenario ${dir} the estimated interaction rate by ${(Math.abs(deltas.interaction_rate) * 100).toFixed(1)}% — roughly ${students > 0 ? "+" : ""}${deltas.students_connecting} student connections per day.`
    );
  }

  if (Math.abs(deltas.seating_pressure) > 0.02) {
    const dir = deltas.seating_pressure < 0 ? "reduces" : "increases";
    const label =
      scenario.seating_pressure < 1.0
        ? "manageable"
        : scenario.seating_pressure < 1.3
        ? "tight"
        : "high";
    parts.push(
      `Seating pressure ${dir} from ${current.seating_pressure.toFixed(2)}× to ${scenario.seating_pressure.toFixed(2)}× (${label} range).`
    );
  }

  if (Math.abs(deltas.connection_score) > 0.05) {
    const dir = deltas.connection_score > 0 ? "improves" : "decreases";
    parts.push(
      `Projected connection score ${dir} from ${current.connection_score.toFixed(2)} to ${scenario.connection_score.toFixed(2)}/5.`
    );
  }

  if (Math.abs(deltas.capacity) > 0) {
    const sign = deltas.capacity > 0 ? "+" : "";
    parts.push(`Total seating changes from ${current.capacity} to ${scenario.capacity} seats (${sign}${deltas.capacity}).`);
  }

  if (parts.length === 0) {
    return "This scenario is equivalent to the current configuration.";
  }

  return parts.join(" ");
}

// ── Demand verdict ────────────────────────────────────────────────────────────

export function getDemandVerdict(comparison: ScenarioComparison): string {
  const pressure = comparison.scenario.seating_pressure;

  let verdict: string;
  if (pressure < 0.90) {
    verdict = "This scenario comfortably meets expected demand.";
  } else if (pressure <= 1.10) {
    verdict = `Near capacity at peak hours (${pressure.toFixed(2)}×) — monitor crowding.`;
  } else {
    verdict = `Exceeds peak capacity (${pressure.toFixed(2)}×). Consider adding temporary seating or spreading daily demand.`;
  }

  if (pressure > 1.2) {
    verdict += " High crowding risk may suppress interaction gains.";
  }

  return verdict;
}

// ── Trade-off curve data ──────────────────────────────────────────────────────

export function generateTradeOffCurve(
  baseParams: ScenarioParams,
  dailyDemand = BASELINE.daily_demand,
): Array<{ shared_pct: number; interaction_rate: number; seating_pressure: number }> {
  const points = [];
  for (let pct = 5; pct <= 75; pct += 5) {
    const params = { ...baseParams, shared_seating_pct: pct / 100 };
    const result = runScenario(params, dailyDemand);
    points.push({
      shared_pct: pct,
      interaction_rate: Math.round(result.interaction_rate * 1000) / 1000,
      seating_pressure: result.seating_pressure,
    });
  }
  return points;
}

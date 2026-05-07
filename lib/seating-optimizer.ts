// ── Seat usability factors ────────────────────────────────────────────────────
// Physical seat count overstates effective capacity.
// Usability factors account for accessibility, comfort, and typical fill patterns.

export const SEAT_USABILITY = {
  fourSeat: 1.00,  // per seat → 4.00 effective per table
  twoSeat:  0.90,  // per seat → 1.80 effective per table
  lounge:   0.75,  // per seat → 0.75 effective per seat
} as const;

export const USABLE_PER_UNIT = {
  fourSeat: 4 * SEAT_USABILITY.fourSeat, // 4.00 per table
  twoSeat:  2 * SEAT_USABILITY.twoSeat,  // 1.80 per table
  lounge:   SEAT_USABILITY.lounge,       // 0.75 per seat
} as const;

// ── Status thresholds ─────────────────────────────────────────────────────────

const THRESH_MEETS = 0.85; // ≤ 0.85×: Meets Modeled Demand
const THRESH_NEAR  = 1.00; // > 0.85× and ≤ 1.00×: Near Capacity
                           // > 1.00×: Over Capacity

// ── Types ─────────────────────────────────────────────────────────────────────

export type ComfortPriority = "low" | "balanced" | "high";
export type PressureStatus  = "meets" | "near" | "over";

export interface SeatingParams {
  twoSeatTables:     number;
  fourSeatTables:    number;
  loungeSeats:       number;
  modeledPeakDemand: number;
  comfortPriority:   ComfortPriority;
}

export const SEATING_DEFAULTS: SeatingParams = {
  twoSeatTables:     10,
  fourSeatTables:    25,
  loungeSeats:       42,
  modeledPeakDemand: 180,
  comfortPriority:   "balanced",
};

// Baseline usable = 25*4*1.00 + 10*2*0.90 + 42*0.75 = 100 + 18 + 31.5 = 149.5

export interface PressureIndicator {
  status: PressureStatus;
  label:  string;
  color:  string; // hex
}

export interface SeatingMetrics {
  physicalSeats: number;
  usableSeats:   number; // rounded to 1 dp
  peakPressure:  number; // rounded to 3 dp
  indicator:     PressureIndicator;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeIndicator(pressure: number): PressureIndicator {
  if (pressure <= THRESH_MEETS)
    return { status: "meets", label: "Meets Modeled Demand", color: "#7A8F7A" };
  if (pressure <= THRESH_NEAR)
    return { status: "near", label: "Near Capacity", color: "#C8A96E" };
  return { status: "over", label: "Over Capacity", color: "#C5705A" };
}

// ── Core calculator ───────────────────────────────────────────────────────────

export function calculateSeatingMetrics(p: SeatingParams): SeatingMetrics {
  const physicalSeats =
    p.twoSeatTables * 2 + p.fourSeatTables * 4 + p.loungeSeats;

  const usableRaw =
    p.fourSeatTables * USABLE_PER_UNIT.fourSeat +
    p.twoSeatTables  * USABLE_PER_UNIT.twoSeat  +
    p.loungeSeats    * USABLE_PER_UNIT.lounge;

  const usableSeats  = Math.round(usableRaw * 10) / 10;
  const peakPressure = Math.round((p.modeledPeakDemand / usableRaw) * 1000) / 1000;

  return { physicalSeats, usableSeats, peakPressure, indicator: makeIndicator(peakPressure) };
}

// ── Recommendation engine ─────────────────────────────────────────────────────

export interface RecommendationScenario {
  title:              string;
  goal:               string;
  targetLabel:        string;
  cardColor:          string;
  add2Seat:           number;
  add4Seat:           number;
  addLounge:          number;
  addedPhysicalSeats: number;
  addedUsableSeats:   number;
  newUsableSeats:     number;
  newPressure:        number;
  indicator:          PressureIndicator;
  tradeoffNote?:      string;
  alreadyMeets:       boolean;
}

// How additions are split across seat types based on comfort priority.
// Each proportion targets that fraction of the usable-seat deficit.
const COMFORT_SPLITS: Record<ComfortPriority, { p4: number; p2: number; pL: number }> = {
  low:      { p4: 0.80, p2: 0.05, pL: 0.15 }, // maximize efficiency
  balanced: { p4: 0.65, p2: 0.15, pL: 0.20 }, // mixed
  high:     { p4: 0.45, p2: 0.30, pL: 0.25 }, // more variety, better circulation
};

function computeAdditions(
  deficitUsable: number,
  priority: ComfortPriority,
  strategy: "standard" | "collaboration",
): { add2: number; add4: number; addLounge: number } {
  if (deficitUsable <= 0) return { add2: 0, add4: 0, addLounge: 0 };

  if (strategy === "collaboration") {
    // All 4-seat tables — most usable per unit
    return { add2: 0, add4: Math.ceil(deficitUsable / USABLE_PER_UNIT.fourSeat), addLounge: 0 };
  }

  const { p4, p2, pL } = COMFORT_SPLITS[priority];
  return {
    add4:      Math.ceil((deficitUsable * p4) / USABLE_PER_UNIT.fourSeat),
    add2:      Math.ceil((deficitUsable * p2) / USABLE_PER_UNIT.twoSeat),
    addLounge: Math.ceil((deficitUsable * pL) / USABLE_PER_UNIT.lounge),
  };
}

function buildRec(
  params:  SeatingParams,
  metrics: SeatingMetrics,
  opts: {
    title:          string;
    goal:           string;
    targetPressure: number;
    targetLabel:    string;
    cardColor:      string;
    strategy:       "standard" | "collaboration";
    tradeoffNote?:  string;
  },
): RecommendationScenario {
  const targetUsable = params.modeledPeakDemand / opts.targetPressure;
  const deficit      = targetUsable - metrics.usableSeats;
  const alreadyMeets = deficit <= 0;

  const { add2, add4, addLounge } = computeAdditions(
    deficit, params.comfortPriority, opts.strategy,
  );

  const addedPhysical  = add2 * 2 + add4 * 4 + addLounge;
  const addedUsableRaw =
    add4     * USABLE_PER_UNIT.fourSeat +
    add2     * USABLE_PER_UNIT.twoSeat  +
    addLounge * USABLE_PER_UNIT.lounge;

  const newUsableRaw = metrics.usableSeats + addedUsableRaw;
  const newUsable    = Math.round(newUsableRaw * 10) / 10;
  const newPressure  = Math.round((params.modeledPeakDemand / newUsableRaw) * 1000) / 1000;

  return {
    title:              opts.title,
    goal:               opts.goal,
    targetLabel:        opts.targetLabel,
    cardColor:          opts.cardColor,
    add2Seat:           add2,
    add4Seat:           add4,
    addLounge,
    addedPhysicalSeats: addedPhysical,
    addedUsableSeats:   Math.round(addedUsableRaw * 10) / 10,
    newUsableSeats:     newUsable,
    newPressure,
    indicator:          makeIndicator(newPressure),
    tradeoffNote:       opts.tradeoffNote,
    alreadyMeets,
  };
}

export function generateRecommendations(
  params:  SeatingParams,
  metrics: SeatingMetrics,
): RecommendationScenario[] {
  return [
    buildRec(params, metrics, {
      title:          "Minimum Relief",
      goal:           "Reduce worst crowding",
      targetPressure: 1.00,
      targetLabel:    "Gets closer to meeting modeled peak demand",
      cardColor:      "#C8A96E",
      strategy:       "standard",
    }),
    buildRec(params, metrics, {
      title:          "Comfortable Buffer",
      goal:           "Seat students with breathing room",
      targetPressure: 0.85,
      targetLabel:    "Meets modeled demand with buffer",
      cardColor:      "#7A8F7A",
      strategy:       "standard",
    }),
    buildRec(params, metrics, {
      title:          "Collaboration-Heavy",
      goal:           "Maximize efficient shared seating",
      targetPressure: 0.85,
      targetLabel:    "High-density group seating",
      cardColor:      "#8A9BB5",
      strategy:       "collaboration",
      tradeoffNote:   "Prioritizes 4-seat tables only. May increase perceived density and noise.",
    }),
  ];
}

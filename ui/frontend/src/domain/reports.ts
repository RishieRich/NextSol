/** Figures for the sample report mock-ups, computed once here. */

export type ProductionRow = { item: string; planned: number; produced: number };

export type ProductionResult = ProductionRow & {
  gap: number;
  /** Produced as a share of planned, 0 to 100+, one decimal. */
  percentOfPlan: number;
  status: "short" | "on-plan" | "ahead";
};

/** Within 2% of plan counts as on plan. */
export function assessProduction(row: ProductionRow): ProductionResult {
  if (row.planned <= 0) throw new RangeError(`Planned quantity must be positive for ${row.item}`);
  const percentOfPlan = Math.round((row.produced / row.planned) * 1000) / 10;
  const status = percentOfPlan < 98 ? "short" : percentOfPlan > 102 ? "ahead" : "on-plan";
  return { ...row, gap: row.produced - row.planned, percentOfPlan, status };
}

/** Negative-stock control: an entry is allowed only if stock covers it. */
export function checkStock(available: number, requested: number) {
  if (requested <= 0) throw new RangeError("Requested quantity must be positive");
  const shortfall = Math.max(requested - available, 0);
  return { allowed: shortfall === 0, shortfall };
}

export type OutstandingRow = { party: string; buckets: readonly number[] };

export function outstandingTotals(rows: readonly OutstandingRow[]) {
  const withTotals = rows.map((row) => ({ ...row, total: row.buckets.reduce((sum, value) => sum + value, 0) }));
  const max = Math.max(...withTotals.map((row) => row.total), 1);
  return {
    rows: withTotals.map((row) => ({ ...row, shareOfMax: row.total / max })),
    grandTotal: withTotals.reduce((sum, row) => sum + row.total, 0),
  };
}

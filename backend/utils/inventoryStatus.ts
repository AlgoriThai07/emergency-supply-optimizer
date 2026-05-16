import type { InventoryStatus } from "../models/index.js";

/** Derive status from count vs shortage threshold */
export function computeInventoryStatus(
  count: number,
  threshold: number
): InventoryStatus {
  if (count < threshold) return "CRITICAL_SHORTAGE";
  if (count > threshold) return "SURPLUS";
  return "ADEQUATE";
}

export function isSurplus(count: number, threshold: number): boolean {
  return count > threshold;
}

export function isCriticalShortage(count: number, threshold: number): boolean {
  return count < threshold;
}

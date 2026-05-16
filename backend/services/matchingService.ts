import type { Hospital, InventoryItem } from "../models/index.js";
import { calculateDistance } from "../utils/distance.js";

export interface DonorMatch {
  donorHospital: Hospital | null;
  donorInventoryItem: InventoryItem | null;
  distance: number | null;
}

const NO_MATCH: DonorMatch = {
  donorHospital: null,
  donorInventoryItem: null,
  distance: null,
};

/**
 * Find the closest hospital that can donate `itemName` to `targetHospital`.
 *
 * A valid donor:
 *   - Is not the target hospital itself.
 *   - Has an inventory row whose `itemName` matches.
 *   - Is flagged as `SURPLUS`.
 *   - Has real headroom: availableCount > threshold.
 *
 * Inputs are assumed to be pre-fetched (no Firebase access here).
 * Returns null fields when no donor exists.
 */
export function findClosestDonor(
  targetHospital: Hospital,
  allHospitals: Hospital[],
  inventoryItems: InventoryItem[],
  itemName: string
): DonorMatch {
  const candidates = inventoryItems.filter((item) => {
    if (item.itemName !== itemName) return false;
    if (item.status !== "SURPLUS") return false;
    if (item.hospitalId === targetHospital.id) return false;
    return item.availableCount > item.threshold;
  });

  if (candidates.length === 0) return NO_MATCH;

  const hospitalsById = new Map<string, Hospital>();
  for (const h of allHospitals) {
    if (h.id) hospitalsById.set(h.id, h);
  }

  let best: DonorMatch = NO_MATCH;
  let shortest = Infinity;

  for (const item of candidates) {
    const donor = hospitalsById.get(item.hospitalId);
    if (!donor) continue;

    const distance = calculateDistance(targetHospital, donor);
    if (distance < shortest) {
      shortest = distance;
      best = { donorHospital: donor, donorInventoryItem: item, distance };
    }
  }

  return best;
}

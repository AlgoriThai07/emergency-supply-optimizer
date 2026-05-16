const CRITICAL_RATIO = 0.5;
const SURPLUS_RATIO = 2;
/**
 * Classify an inventory line by available count vs threshold.
 *
 * Tiers:
 *   - CRITICAL_SHORTAGE: count <= 50% of threshold
 *   - LOW:               count < threshold (but above critical)
 *   - SURPLUS:           count >= 2 * threshold
 *   - ADEQUATE:          everything in between (count == threshold up to <2x)
 *
 * Input safety:
 *   - availableCount < 0 is clamped to 0.
 *   - threshold <= 0 is treated as "no target defined" → ADEQUATE.
 */
export function getInventoryStatus(availableCount, threshold) {
    const safeCount = Math.max(0, availableCount);
    if (threshold <= 0) {
        return "ADEQUATE";
    }
    if (safeCount <= threshold * CRITICAL_RATIO)
        return "CRITICAL_SHORTAGE";
    if (safeCount < threshold)
        return "LOW";
    if (safeCount >= threshold * SURPLUS_RATIO)
        return "SURPLUS";
    return "ADEQUATE";
}
/**
 * Example — how this fits into an inventory update flow.
 *
 * import { Timestamp } from "firebase-admin/firestore";
 * import type { InventoryItem } from "../models/index.js";
 * import { getInventoryStatus } from "./statusService.js";
 *
 * function applyInventoryUpdate(
 *   item: InventoryItem,
 *   newCount: number
 * ): InventoryItem {
 *   const available = newCount - item.inUseCount;
 *   return {
 *     ...item,
 *     count: newCount,
 *     status: getInventoryStatus(available, item.threshold),
 *     lastUpdated: Timestamp.now(),
 *   };
 * }
 */
//# sourceMappingURL=statusService.js.map
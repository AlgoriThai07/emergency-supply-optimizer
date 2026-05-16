import type { InventoryStatus } from "../models/index.js";
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
export declare function getInventoryStatus(availableCount: number, threshold: number): InventoryStatus;
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
//# sourceMappingURL=statusService.d.ts.map
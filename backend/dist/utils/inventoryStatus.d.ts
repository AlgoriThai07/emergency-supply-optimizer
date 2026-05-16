import type { InventoryStatus } from "../models/index.js";
/** Derive status from count vs shortage threshold */
export declare function computeInventoryStatus(count: number, threshold: number): InventoryStatus;
export declare function isSurplus(count: number, threshold: number): boolean;
export declare function isCriticalShortage(count: number, threshold: number): boolean;
//# sourceMappingURL=inventoryStatus.d.ts.map
import type { firestore } from "firebase-admin";
export type InventoryStatus = "CRITICAL_SHORTAGE" | "LOW" | "ADEQUATE" | "SURPLUS";
export interface InventoryItem {
    id?: string;
    hospitalId: string;
    itemName: string;
    count: number;
    inUseCount: number;
    threshold: number;
    unit: string;
    category: string;
    createdAt: firestore.Timestamp;
    status: InventoryStatus;
    lastUpdated: firestore.Timestamp;
}
//# sourceMappingURL=inventory.d.ts.map
import type { firestore } from "firebase-admin";
export interface InventoryLog {
    id?: string;
    hospitalId: string;
    hospitalName: string;
    inventoryItemId: string;
    itemKey: string;
    itemName: string;
    previousCount: number;
    change: number;
    newCount: number;
    previousAvailableCount: number;
    newAvailableCount: number;
    source: "VOICE_COMMAND" | "MANUAL_FORM" | "DEMO_BUTTON" | "SYSTEM";
    message?: string;
    createdAt: firestore.Timestamp;
}
//# sourceMappingURL=inventoryLog.d.ts.map
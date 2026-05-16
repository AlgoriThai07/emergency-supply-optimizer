import type { firestore } from "firebase-admin";

export type InventoryStatus =
  | "CRITICAL_SHORTAGE"
  | "LOW"
  | "ADEQUATE"
  | "SURPLUS";

export interface InventoryItem {
  id?: string;
  hospitalId: string;
  itemName: string;
  count: number;
  inUseCount: number;
  threshold: number; // The number of items that are considered to be a shortage
  unit: string; // The unit of measurement for the item
  category: string; // The category of the item
  createdAt: firestore.Timestamp;
  status: InventoryStatus;
  lastUpdated: firestore.Timestamp;
}

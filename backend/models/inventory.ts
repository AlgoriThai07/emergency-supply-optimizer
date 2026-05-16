import type { firestore } from 'firebase-admin';

export type InventoryStatus = 'CRITICAL_SHORTAGE' | 'LOW' | 'ADEQUATE' | 'SURPLUS';

export interface InventoryItem {
  id?: string;
  hospitalId: string;
  itemName: string;
  count: number;
  inUseCount: number;
  status: InventoryStatus;
  lastUpdated: firestore.Timestamp;
}

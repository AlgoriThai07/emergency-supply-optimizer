import { Timestamp } from "firebase-admin/firestore";
import { mockHospitals } from "../data/mockHospitals.js";
import { mockInventoryItems } from "../data/mockInventoryItems.js";
import type {
  Hospital,
  InventoryItem,
  InventoryLog,
  TransferRequest,
} from "../models/index.js";

/**
 * In-memory replacement for firebaseService.ts (Person 4).
 * Mutates module-level arrays so tests/end-to-end flows see real state changes.
 *
 * To swap back to Firebase: replace the import in services/inventoryAgent.ts
 * from "./mockFirebaseService.js" → "./firebaseService.js" and delete this file.
 */

export const mockInventoryLogs: InventoryLog[] = [];
export const mockTransferRequests: TransferRequest[] = [];

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export async function getHospitalById(
  hospitalId: string
): Promise<Hospital | null> {
  return mockHospitals.find((h) => h.id === hospitalId) ?? null;
}

export async function getAllHospitals(): Promise<Hospital[]> {
  return mockHospitals;
}

export async function getInventoryItemByHospitalAndName(
  hospitalId: string,
  itemName: string
): Promise<InventoryItem | null> {
  return (
    mockInventoryItems.find(
      (i) => i.hospitalId === hospitalId && i.itemName === itemName
    ) ?? null
  );
}

export async function getInventoryItemsByName(
  itemName: string
): Promise<InventoryItem[]> {
  return mockInventoryItems.filter((i) => i.itemName === itemName);
}

export async function updateInventoryItem(
  inventoryItemId: string,
  updateData: Partial<InventoryItem>
): Promise<void> {
  const item = mockInventoryItems.find((i) => i.id === inventoryItemId);
  if (!item) {
    throw new Error(
      `mockFirebaseService.updateInventoryItem: not found ${inventoryItemId}`
    );
  }
  Object.assign(item, updateData, { lastUpdated: Timestamp.now() });
  console.log(
    `[mockFirebaseService] updated ${inventoryItemId} → count=${item.count}, status=${item.status}`
  );
}

export async function createInventoryLog(data: InventoryLog): Promise<string> {
  const id = genId("log");
  mockInventoryLogs.push({ ...data, id });
  console.log(
    `[mockFirebaseService] created InventoryLog ${id} (${data.itemName} change=${data.change})`
  );
  return id;
}

export async function createTransferRequest(
  data: TransferRequest
): Promise<string> {
  const id = genId("transfer");
  mockTransferRequests.push({ ...data, id });
  console.log(
    `[mockFirebaseService] created TransferRequest ${id} (${data.itemName} ${data.quantity}${data.unit} ${data.fromHospitalName} → ${data.toHospitalName})`
  );
  return id;
}

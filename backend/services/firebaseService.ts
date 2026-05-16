import { db } from "../config/firebase-config.js";
import { logInventoryChange } from "../utils/logger.js";
import type {
  Hospital,
  InventoryItem,
  InventoryLog,
  TransferRequest,
} from "../models/index.js";

const HOSPITALS = "hospitals";
const INVENTORY = "inventory";
const TRANSFER_REQUESTS = "transfer_requests";

export async function getHospitalById(
  id: string
): Promise<Hospital | null> {
  const doc = await db.collection(HOSPITALS).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as Omit<Hospital, "id">) };
}

export async function getAllHospitals(): Promise<Hospital[]> {
  const snap = await db.collection(HOSPITALS).get();
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Hospital, "id">),
  }));
}

export async function getInventoryItemByHospitalAndName(
  hospitalId: string,
  itemName: string
): Promise<InventoryItem | null> {
  const snap = await db
    .collection(INVENTORY)
    .where("hospitalId", "==", hospitalId)
    .where("itemName", "==", itemName)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...(doc.data() as Omit<InventoryItem, "id">) };
}

export async function getInventoryItemsByName(
  itemName: string
): Promise<InventoryItem[]> {
  const snap = await db
    .collection(INVENTORY)
    .where("itemName", "==", itemName)
    .get();
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<InventoryItem, "id">),
  }));
}

export async function updateInventoryItem(
  inventoryItemId: string,
  updateData: Partial<InventoryItem>
): Promise<void> {
  await db
    .collection(INVENTORY)
    .doc(inventoryItemId)
    .update(updateData as Record<string, unknown>);
}

export async function createTransferRequest(
  data: TransferRequest
): Promise<string> {
  const { id: _id, ...payload } = data;
  const ref = await db.collection(TRANSFER_REQUESTS).add(payload);
  return ref.id;
}

/**
 * Wraps utils/logger.logInventoryChange so the agent can create logs with
 * the same signature it uses for everything else (full InventoryLog).
 * The logger sets `createdAt` server-side, so we strip the caller's value.
 */
export async function createInventoryLog(data: InventoryLog): Promise<void> {
  const { id: _id, createdAt: _createdAt, ...payload } = data;
  await logInventoryChange(payload);
}

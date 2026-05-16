import { Timestamp } from "firebase-admin/firestore";
import type {
  InventoryLog,
  InventoryStatus,
  TransferRequest,
} from "../models/index.js";
import {
  createInventoryLog,
  createTransferRequest,
  getAllHospitals,
  getHospitalById,
  getInventoryItemByHospitalAndName,
  getInventoryItemsByName,
  updateInventoryItem,
} from "./firebaseService.js";
import { findClosestDonor } from "./matchingService.js";
import { getInventoryStatus } from "./statusService.js";

export type InventoryUpdateSource =
  | "VOICE_COMMAND"
  | "MANUAL_FORM"
  | "DEMO_BUTTON"
  | "SYSTEM";

export interface ProcessInventoryUpdateInput {
  hospitalId: string;
  itemName: string;
  change: number;
  source?: InventoryUpdateSource;
  message?: string;
}

export interface ProcessInventoryUpdateResult {
  success: boolean;
  hospitalId: string;
  itemName: string;
  previousCount: number;
  newCount: number;
  previousAvailableCount: number;
  newAvailableCount: number;
  status: InventoryStatus;
  log: InventoryLog;
  transferRequest: TransferRequest | null;
}

/**
 * Apply an inventory delta, log it, and auto-create a transfer request
 * when the new state is LOW or CRITICAL_SHORTAGE.
 *
 * All Firestore I/O is delegated to firebaseService.ts (Person 4).
 */
export async function processInventoryUpdate(
  input: ProcessInventoryUpdateInput
): Promise<ProcessInventoryUpdateResult> {
  const { hospitalId, itemName, change } = input;

  if (!hospitalId || !itemName) {
    throw new Error("hospitalId and itemName are required");
  }
  if (typeof change !== "number" || !Number.isFinite(change)) {
    throw new Error("change must be a finite number");
  }

  const source: InventoryUpdateSource = input.source ?? "SYSTEM";
  const now = Timestamp.now();

  const hospital = await getHospitalById(hospitalId);
  if (!hospital) {
    throw new Error(`Hospital not found: ${hospitalId}`);
  }

  const item = await getInventoryItemByHospitalAndName(hospitalId, itemName);
  if (!item) {
    throw new Error(`Inventory item not found: ${itemName} @ ${hospitalId}`);
  }

  const previousCount = item.count;
  const newCount = Math.max(previousCount + change, 0);
  const previousAvailableCount = Math.max(item.count - item.inUseCount, 0);
  const newAvailableCount = Math.max(newCount - item.inUseCount, 0);

  const newStatus = getInventoryStatus(newAvailableCount, item.threshold);

  await updateInventoryItem(item.id!, {
    count: newCount,
    availableCount: newAvailableCount,
    status: newStatus,
    lastUpdated: now,
  });

  const log: InventoryLog = {
    hospitalId,
    hospitalName: hospital.name,
    inventoryItemId: item.id!,
    itemName: item.itemName,
    previousCount,
    change,
    newCount,
    previousAvailableCount,
    newAvailableCount,
    source,
    message: input.message,
    createdAt: now,
  };
  await createInventoryLog(log);

  let transferRequest: TransferRequest | null = null;

  if (newStatus === "LOW" || newStatus === "CRITICAL_SHORTAGE") {
    const [allHospitals, peerInventory] = await Promise.all([
      getAllHospitals(),
      getInventoryItemsByName(itemName),
    ]);

    const match = findClosestDonor(
      hospital,
      allHospitals,
      peerInventory,
      itemName
    );

    if (match.donorHospital && match.donorInventoryItem) {
      const quantityNeeded = Math.max(item.threshold - newAvailableCount, 1);

      transferRequest = {
        itemName: item.itemName,
        quantity: quantityNeeded,
        unit: item.unit,
        fromHospitalId: match.donorHospital.id!,
        fromHospitalName: match.donorHospital.name,
        toHospitalId: hospitalId,
        toHospitalName: hospital.name,
        status: "PENDING",
        distance: match.distance ?? undefined,
        reason: `Auto-generated: ${item.itemName} is ${newStatus} at ${hospital.name}`,
        createdAt: now,
        updatedAt: now,
      };

      await createTransferRequest(transferRequest);
    }
  }

  return {
    success: true,
    hospitalId,
    itemName: item.itemName,
    previousCount,
    newCount,
    previousAvailableCount,
    newAvailableCount,
    status: newStatus,
    log,
    transferRequest,
  };
}

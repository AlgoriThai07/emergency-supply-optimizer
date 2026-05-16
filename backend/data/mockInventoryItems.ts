import { Timestamp } from "firebase-admin/firestore";
import type { InventoryItem } from "../models/index.js";
import { getInventoryStatus } from "../services/statusService.js";

const now = Timestamp.now();

function build(
  partial: Omit<
    InventoryItem,
    "createdAt" | "lastUpdated" | "status" | "availableCount"
  >
): InventoryItem {
  const availableCount = Math.max(partial.count - partial.inUseCount, 0);
  return {
    ...partial,
    availableCount,
    status: getInventoryStatus(availableCount, partial.threshold),
    createdAt: now,
    lastUpdated: now,
  };
}

/**
 * Demo seed:
 *   - UIC Ventilator is borderline LOW; -5 change → CRITICAL_SHORTAGE.
 *   - Rush Ventilator is SURPLUS and geographically nearest to UIC,
 *     so the matching service should pick Rush as the donor.
 */
export const mockInventoryItems: InventoryItem[] = [
  build({
    id: "uic_ventilator",
    hospitalId: "uic_medical",
    itemName: "Ventilator",
    count: 10,
    inUseCount: 2,
    threshold: 10,
    unit: "units",
    category: "equipment",
  }),
  build({
    id: "uic_n95",
    hospitalId: "uic_medical",
    itemName: "N95 Mask",
    count: 500,
    inUseCount: 50,
    threshold: 200,
    unit: "units",
    category: "ppe",
  }),
  build({
    id: "uic_gloves",
    hospitalId: "uic_medical",
    itemName: "Gloves",
    count: 800,
    inUseCount: 100,
    threshold: 500,
    unit: "boxes",
    category: "ppe",
  }),
  build({
    id: "uic_blood",
    hospitalId: "uic_medical",
    itemName: "O Negative Blood",
    count: 8,
    inUseCount: 1,
    threshold: 10,
    unit: "pints",
    category: "blood",
  }),

  build({
    id: "rush_ventilator",
    hospitalId: "rush_university",
    itemName: "Ventilator",
    count: 25,
    inUseCount: 2,
    threshold: 10,
    unit: "units",
    category: "equipment",
  }),
  build({
    id: "rush_n95",
    hospitalId: "rush_university",
    itemName: "N95 Mask",
    count: 600,
    inUseCount: 100,
    threshold: 200,
    unit: "units",
    category: "ppe",
  }),
  build({
    id: "rush_gloves",
    hospitalId: "rush_university",
    itemName: "Gloves",
    count: 1500,
    inUseCount: 200,
    threshold: 500,
    unit: "boxes",
    category: "ppe",
  }),
  build({
    id: "rush_blood",
    hospitalId: "rush_university",
    itemName: "O Negative Blood",
    count: 30,
    inUseCount: 3,
    threshold: 10,
    unit: "pints",
    category: "blood",
  }),

  build({
    id: "nm_ventilator",
    hospitalId: "northwestern_memorial",
    itemName: "Ventilator",
    count: 22,
    inUseCount: 2,
    threshold: 10,
    unit: "units",
    category: "equipment",
  }),
  build({
    id: "nm_n95",
    hospitalId: "northwestern_memorial",
    itemName: "N95 Mask",
    count: 1200,
    inUseCount: 100,
    threshold: 200,
    unit: "units",
    category: "ppe",
  }),
  build({
    id: "nm_gloves",
    hospitalId: "northwestern_memorial",
    itemName: "Gloves",
    count: 1800,
    inUseCount: 200,
    threshold: 500,
    unit: "boxes",
    category: "ppe",
  }),
  build({
    id: "nm_blood",
    hospitalId: "northwestern_memorial",
    itemName: "O Negative Blood",
    count: 28,
    inUseCount: 5,
    threshold: 10,
    unit: "pints",
    category: "blood",
  }),

  build({
    id: "lurie_ventilator",
    hospitalId: "lurie_childrens",
    itemName: "Ventilator",
    count: 14,
    inUseCount: 2,
    threshold: 10,
    unit: "units",
    category: "equipment",
  }),
  build({
    id: "lurie_n95",
    hospitalId: "lurie_childrens",
    itemName: "N95 Mask",
    count: 300,
    inUseCount: 30,
    threshold: 200,
    unit: "units",
    category: "ppe",
  }),
  build({
    id: "lurie_gloves",
    hospitalId: "lurie_childrens",
    itemName: "Gloves",
    count: 700,
    inUseCount: 80,
    threshold: 500,
    unit: "boxes",
    category: "ppe",
  }),
  build({
    id: "lurie_blood",
    hospitalId: "lurie_childrens",
    itemName: "O Negative Blood",
    count: 12,
    inUseCount: 2,
    threshold: 10,
    unit: "pints",
    category: "blood",
  }),
];

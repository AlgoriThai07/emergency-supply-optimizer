import { Router, type Request, type Response } from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase-config.js";
import { logInventoryChange } from "../utils/logger.js";
import type { InventoryItem, InventoryStatus, Hospital, TransferRequest } from "../models/index.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper to determine status based on count and threshold
function determineStatus(count: number, threshold: number): InventoryStatus {
  if (count === 0) return "CRITICAL_SHORTAGE";
  if (count <= threshold) return "LOW";
  if (count > threshold * 2) return "SURPLUS";
  return "ADEQUATE";
}

/**
 * GET /api/resources/hospitals
 * Fetch all hospitals from Firestore
 */
router.get("/hospitals", async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("hospitals").get();
    const hospitals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ hospitals });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

/**
 * GET /api/resources/inventory/:hospitalId
 * Fetch inventory for a specific hospital
 */
router.get("/inventory/:hospitalId", async (req: Request, res: Response) => {
  try {
    const { hospitalId } = req.params;
    const snapshot = await db.collection("inventory")
      .where("hospitalId", "==", hospitalId)
      .get();
    const inventory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ inventory });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

/**
 * PATCH /api/resources/inventory/:itemId
 * Update inventory counts manually
 */
router.patch("/inventory/:itemId", async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { count, inUseCount, source, message } = req.body;

    const itemRef = db.collection("inventory").doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      res.status(404).json({ error: "Inventory item not found" });
      return;
    }

    const currentData = itemDoc.data() as InventoryItem;
    const newCount = count !== undefined ? count : currentData.count;
    const newInUse = inUseCount !== undefined ? inUseCount : currentData.inUseCount;
    const newAvailable = newCount - newInUse;
    const newStatus = determineStatus(newCount, currentData.threshold);

    const hospitalDoc = await db.collection("hospitals").doc(currentData.hospitalId).get();
    const hospitalName = (hospitalDoc.data() as Hospital)?.name || "Unknown Hospital";

    await itemRef.update({
      count: newCount,
      inUseCount: newInUse,
      availableCount: newAvailable,
      status: newStatus,
      lastUpdated: FieldValue.serverTimestamp()
    });

    // Log the change
    await logInventoryChange({
      hospitalId: currentData.hospitalId,
      hospitalName,
      inventoryItemId: itemId,
      itemKey: currentData.itemName.toLowerCase().replace(/\s+/g, "_"),
      itemName: currentData.itemName,
      previousCount: currentData.count,
      change: newCount - currentData.count,
      newCount: newCount,
      previousAvailableCount: currentData.availableCount,
      newAvailableCount: newAvailable,
      source: source || "MANUAL_FORM",
      message: message || "Manual inventory update"
    });

    res.json({ success: true, itemId, newCount, newAvailable, status: newStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update inventory" });
  }
});

/**
 * POST /api/resources/requests
 * Create a manual supply request
 */
router.post("/requests", async (req: Request, res: Response) => {
  try {
    const { toHospitalId, itemKey, itemName, quantity, unit, reason } = req.body;

    const toHospitalDoc = await db.collection("hospitals").doc(toHospitalId).get();
    if (!toHospitalDoc.exists) {
      res.status(404).json({ error: "Destination hospital not found" });
      return;
    }

    const requestData: Omit<TransferRequest, "id"> = {
      itemKey,
      itemName,
      quantity,
      unit,
      toHospitalId,
      toHospitalName: (toHospitalDoc.data() as Hospital).name,
      fromHospitalId: "SYSTEM_RESERVE", // Manual requests might come from system or be unassigned initially
      fromHospitalName: "System Reserve",
      status: "PENDING",
      reason,
      createdAt: FieldValue.serverTimestamp() as any,
      updatedAt: FieldValue.serverTimestamp() as any
    };

    const docRef = await db.collection("transfer_requests").add(requestData);
    
    res.json({ success: true, requestId: docRef.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create request" });
  }
});

/**
 * POST /api/resources/migration/upload
 * Bulk migration via CSV
 */
router.post("/migration/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const fileContent = req.file.buffer.toString();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    const batch = db.batch();
    let count = 0;

    for (const record of records as any[]) {
      // Expecting CSV headers: hospitalId, itemName, count, inUseCount, threshold, unit, category
      const { hospitalId, itemName, count: c, inUseCount: iuc, threshold: t, unit, category } = record;
      
      const countNum = parseInt(c);
      const inUseNum = parseInt(iuc);
      const thresholdNum = parseInt(t);
      const availableNum = countNum - inUseNum;
      
      const itemRef = db.collection("inventory").doc();
      const itemData: Omit<InventoryItem, "id"> = {
        hospitalId,
        itemName,
        count: countNum,
        inUseCount: inUseNum,
        availableCount: availableNum,
        threshold: thresholdNum,
        unit,
        category,
        status: determineStatus(countNum, thresholdNum),
        createdAt: FieldValue.serverTimestamp() as any,
        lastUpdated: FieldValue.serverTimestamp() as any
      };

      batch.set(itemRef, itemData);
      count++;
    }

    await batch.commit();
    res.json({ success: true, message: `Migrated ${count} items successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Migration failed" });
  }
});

export default router;

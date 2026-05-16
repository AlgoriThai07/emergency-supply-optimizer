import { Router } from "express";
import { findHospital, findInventoryItem, mockHospitals, getHospitalInventory, touchHospital, touchInventoryItem, } from "../config/mockHospitals.js";
import { isSurplus } from "../utils/inventoryStatus.js";
import { sendEmergencyAlert } from "../utils/sendSMS.js";
const router = Router();
function euclideanDistance(lat1, lng1, lat2, lng2) {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
}
/**
 * POST /api/logistics/match
 * Body: { deficitHospitalId, resourceId }
 */
router.post("/match", (req, res) => {
    const { deficitHospitalId, resourceId } = req.body;
    if (!deficitHospitalId || !resourceId) {
        res.status(400).json({
            error: "deficitHospitalId and resourceId are required",
        });
        return;
    }
    const deficitHospital = findHospital(deficitHospitalId);
    if (!deficitHospital) {
        res.status(404).json({ error: `Hospital not found: ${deficitHospitalId}` });
        return;
    }
    const deficitItem = findInventoryItem(deficitHospitalId, resourceId);
    if (!deficitItem) {
        res.status(404).json({
            error: `Resource '${resourceId}' not found at ${deficitHospital.name}`,
        });
        return;
    }
    const surplusHubs = mockHospitals.filter((h) => {
        if (h.id === deficitHospitalId)
            return false;
        const item = findInventoryItem(h.id, resourceId);
        if (!item)
            return false;
        return isSurplus(item.count, item.threshold);
    });
    if (surplusHubs.length === 0) {
        res.status(404).json({
            success: false,
            message: "No surplus hospitals found for this resource",
            deficitHospital: {
                id: deficitHospital.id,
                name: deficitHospital.name,
                item: deficitItem,
            },
            surplusCandidates: [],
        });
        return;
    }
    let closestMatch = surplusHubs[0];
    let shortestDistance = euclideanDistance(deficitHospital.location.latitude, deficitHospital.location.longitude, closestMatch.location.latitude, closestMatch.location.longitude);
    for (let i = 1; i < surplusHubs.length; i++) {
        const candidate = surplusHubs[i];
        const distance = euclideanDistance(deficitHospital.location.latitude, deficitHospital.location.longitude, candidate.location.latitude, candidate.location.longitude);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            closestMatch = candidate;
        }
    }
    const matchedItem = findInventoryItem(closestMatch.id, resourceId);
    res.status(200).json({
        success: true,
        resourceId,
        distanceScore: shortestDistance,
        deficitHospital: {
            id: deficitHospital.id,
            name: deficitHospital.name,
            location: deficitHospital.location,
            item: deficitItem,
        },
        matchedSurplusHospital: {
            id: closestMatch.id,
            name: closestMatch.name,
            location: closestMatch.location,
            item: matchedItem,
        },
        allSurplusCandidates: surplusHubs.map((h) => ({
            id: h.id,
            name: h.name,
            count: findInventoryItem(h.id, resourceId).count,
            status: findInventoryItem(h.id, resourceId).status,
        })),
    });
});
/**
 * POST /api/logistics/transfer
 * Body: { originHospitalId, destHospitalId, resourceId, quantity }
 */
router.post("/transfer", async (req, res) => {
    const { originHospitalId, destHospitalId, resourceId, quantity } = req.body;
    if (!originHospitalId ||
        !destHospitalId ||
        !resourceId ||
        quantity == null) {
        res.status(400).json({
            error: "originHospitalId, destHospitalId, resourceId, and quantity are required",
        });
        return;
    }
    if (typeof quantity !== "number" || quantity <= 0) {
        res.status(400).json({ error: "quantity must be a positive number" });
        return;
    }
    if (originHospitalId === destHospitalId) {
        res.status(400).json({
            error: "originHospitalId and destHospitalId must differ",
        });
        return;
    }
    const origin = findHospital(originHospitalId);
    const destination = findHospital(destHospitalId);
    if (!origin) {
        res.status(404).json({ error: `Origin hospital not found: ${originHospitalId}` });
        return;
    }
    if (!destination) {
        res.status(404).json({
            error: `Destination hospital not found: ${destHospitalId}`,
        });
        return;
    }
    const originItem = findInventoryItem(originHospitalId, resourceId);
    const destItem = findInventoryItem(destHospitalId, resourceId);
    if (!originItem || !destItem) {
        res.status(404).json({
            error: `Resource '${resourceId}' missing at one or both hospitals`,
        });
        return;
    }
    if (originItem.count < quantity) {
        res.status(400).json({
            error: `Insufficient stock at ${origin.name}`,
            available: originItem.count,
            requested: quantity,
        });
        return;
    }
    originItem.count -= quantity;
    destItem.count += quantity;
    touchInventoryItem(originItem);
    touchInventoryItem(destItem);
    touchHospital(origin);
    touchHospital(destination);
    const alertMessage = `Beacon Alert: Deployed critical shipment of ${originItem.itemName} (${quantity} ${originItem.unit}) from ${origin.name} to ${destination.name}!`;
    const testReceiver = process.env.TEST_RECEIVER_NUMBER;
    let smsResult = null;
    if (testReceiver) {
        smsResult = await sendEmergencyAlert(testReceiver, alertMessage);
    }
    else {
        console.log("[Beacon] TEST_RECEIVER_NUMBER not set — transfer completed without SMS");
    }
    res.status(200).json({
        success: true,
        message: "Transfer completed and alert dispatched",
        transfer: {
            resourceId,
            itemName: originItem.itemName,
            quantity,
            unit: originItem.unit,
            origin: {
                id: origin.id,
                name: origin.name,
                newCount: originItem.count,
                status: originItem.status,
            },
            destination: {
                id: destination.id,
                name: destination.name,
                newCount: destItem.count,
                status: destItem.status,
            },
        },
        alert: {
            body: alertMessage,
            sent: Boolean(smsResult),
            sid: smsResult?.sid ?? null,
        },
    });
});
/** Hospitals with nested inventory (frontend-friendly) */
router.get("/hospitals", (_req, res) => {
    res.status(200).json({
        hospitals: mockHospitals.map((h) => ({
            ...h,
            inventory: getHospitalInventory(h.id),
        })),
    });
});
export default router;
//# sourceMappingURL=logistics.js.map
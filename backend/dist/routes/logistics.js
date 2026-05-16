import { Router } from "express";
import { mockHospitals } from "../config/mockHospitals.js";
import { sendEmergencyAlert } from "../utils/sendSMS.js";
const router = Router();
/** Euclidean distance on lat/lng (hackathon-spec formula) */
function euclideanDistance(lat1, lng1, lat2, lng2) {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
}
function findHospital(id) {
    return mockHospitals.find((h) => h.id === id);
}
function getResource(hospital, resourceId) {
    return hospital.inventory[resourceId];
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
    const deficitResource = getResource(deficitHospital, resourceId);
    if (!deficitResource) {
        res.status(404).json({
            error: `Resource '${resourceId}' not found at ${deficitHospital.name}`,
        });
        return;
    }
    const surplusHubs = mockHospitals.filter((h) => {
        if (h.id === deficitHospitalId)
            return false;
        const item = getResource(h, resourceId);
        if (!item)
            return false;
        return item.stock > item.threshold;
    });
    if (surplusHubs.length === 0) {
        res.status(404).json({
            success: false,
            message: "No surplus hospitals found for this resource",
            deficitHospital: {
                id: deficitHospital.id,
                name: deficitHospital.name,
                resource: deficitResource,
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
    const matchedResource = getResource(closestMatch, resourceId);
    res.status(200).json({
        success: true,
        resourceId,
        distanceScore: shortestDistance,
        deficitHospital: {
            id: deficitHospital.id,
            name: deficitHospital.name,
            location: deficitHospital.location,
            overall_status: deficitHospital.overall_status,
            resource: deficitResource,
        },
        matchedSurplusHospital: {
            id: closestMatch.id,
            name: closestMatch.name,
            location: closestMatch.location,
            overall_status: closestMatch.overall_status,
            resource: matchedResource,
        },
        allSurplusCandidates: surplusHubs.map((h) => ({
            id: h.id,
            name: h.name,
            stock: getResource(h, resourceId).stock,
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
    const originItem = getResource(origin, resourceId);
    const destItem = getResource(destination, resourceId);
    if (!originItem || !destItem) {
        res.status(404).json({ error: `Resource '${resourceId}' missing at one or both hospitals` });
        return;
    }
    if (originItem.stock < quantity) {
        res.status(400).json({
            error: `Insufficient stock at ${origin.name}`,
            available: originItem.stock,
            requested: quantity,
        });
        return;
    }
    originItem.stock -= quantity;
    destItem.stock += quantity;
    const resourceLabel = originItem.name;
    const alertMessage = `Beacon Alert: Deployed critical shipment of ${resourceLabel} (${quantity} ${originItem.unit}) from ${origin.name} to ${destination.name}!`;
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
            resourceName: resourceLabel,
            quantity,
            unit: originItem.unit,
            origin: { id: origin.id, name: origin.name, newStock: originItem.stock },
            destination: {
                id: destination.id,
                name: destination.name,
                newStock: destItem.stock,
            },
        },
        alert: {
            body: alertMessage,
            sent: Boolean(smsResult),
            sid: smsResult?.sid ?? null,
        },
    });
});
/** List in-memory hospitals for frontend dev */
router.get("/hospitals", (_req, res) => {
    res.status(200).json({ hospitals: mockHospitals });
});
export default router;
//# sourceMappingURL=logistics.js.map
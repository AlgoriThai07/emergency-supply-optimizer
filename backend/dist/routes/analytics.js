import { Router } from "express";
import { mockHospitals, mockInventory } from "../config/mockHospitals.js";
const router = Router();
/** GET /api/analytics/summary — regional snapshot from mock data */
router.get("/summary", (_req, res) => {
    const criticalShortages = mockInventory.filter((i) => i.status === "CRITICAL_SHORTAGE").length;
    const surplusItems = mockInventory.filter((i) => i.status === "SURPLUS").length;
    const hospitalsWithCritical = new Set(mockInventory
        .filter((i) => i.status === "CRITICAL_SHORTAGE")
        .map((i) => i.hospitalId)).size;
    const byCategory = mockInventory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + 1;
        return acc;
    }, {});
    res.status(200).json({
        region: "chicago_metro",
        hospitalCount: mockHospitals.length,
        inventoryLineCount: mockInventory.length,
        criticalShortages,
        surplusItems,
        hospitalsWithCritical,
        byCategory,
        items: mockInventory.map((i) => ({
            hospitalId: i.hospitalId,
            id: i.id,
            itemName: i.itemName,
            count: i.count,
            threshold: i.threshold,
            status: i.status,
        })),
    });
});
export default router;
//# sourceMappingURL=analytics.js.map
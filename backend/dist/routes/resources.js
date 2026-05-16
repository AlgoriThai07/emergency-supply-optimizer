import { Router } from "express";
import { findHospital, getHospitalInventory, mockHospitals, mockInventory, } from "../config/mockHospitals.js";
const router = Router();
/** GET /api/resources/hospitals */
router.get("/hospitals", (_req, res) => {
    res.status(200).json({ hospitals: mockHospitals });
});
/** GET /api/resources/hospitals/:hospitalId */
router.get("/hospitals/:hospitalId", (req, res) => {
    const hospital = findHospital(req.params.hospitalId);
    if (!hospital) {
        res.status(404).json({ error: "Hospital not found" });
        return;
    }
    res.status(200).json({
        hospital,
        inventory: getHospitalInventory(req.params.hospitalId),
    });
});
/** GET /api/resources/inventory — all inventory rows */
router.get("/inventory", (_req, res) => {
    res.status(200).json({ inventory: mockInventory });
});
/** GET /api/resources/inventory/:hospitalId/:itemId */
router.get("/inventory/:hospitalId/:itemId", (req, res) => {
    const items = getHospitalInventory(req.params.hospitalId);
    const item = items.find((i) => i.id === req.params.itemId);
    if (!item) {
        res.status(404).json({ error: "Inventory item not found" });
        return;
    }
    res.status(200).json({ item });
});
export default router;
//# sourceMappingURL=resources.js.map
import { Router, type Request, type Response } from "express";
import { processInventoryUpdate } from "../services/inventoryAgent.js";

const router = Router();

/**
 * POST /api/inventory/update
 * Body: { hospitalId, itemName, change, source?, message? }
 */
router.post("/update", async (req: Request, res: Response) => {
  const { hospitalId, itemName, change, source, message } = req.body ?? {};

  if (
    !hospitalId ||
    !itemName ||
    change === undefined ||
    change === null
  ) {
    res.status(400).json({
      error: "hospitalId, itemName, and change are required",
    });
    return;
  }

  try {
    const result = await processInventoryUpdate({
      hospitalId,
      itemName,
      change,
      source,
      message,
    });
    res.status(200).json(result);
  } catch (err) {
    console.error("[POST /api/inventory/update] failed:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});

export default router;

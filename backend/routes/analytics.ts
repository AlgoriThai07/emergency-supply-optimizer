import { Router } from "express";

const router = Router();

/** Dummy endpoint — replace with regional analytics */
router.get("/test", (_req, res) => {
  res.json({
    route: "analytics",
    message: "Analytics router mounted",
    mock: {
      region: "midwest",
      criticalShortages: 3,
      surplusFacilities: 7,
      avgResponseMinutes: 22,
    },
  });
});

export default router;

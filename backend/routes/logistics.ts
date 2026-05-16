import { Router } from "express";

const router = Router();

/** Dummy endpoint — replace with supply route matching / dispatch */
router.get("/test", (_req, res) => {
  res.json({
    route: "logistics",
    message: "Logistics router mounted",
    mock: {
      routes: [
        {
          from: "h2",
          to: "h1",
          item: "ventilators",
          quantity: 2,
          etaMinutes: 18,
        },
      ],
    },
  });
});

export default router;

import { Router } from "express";

const router = Router();

/** Dummy endpoint — replace with hospital inventory CRUD */
router.get("/test", (_req, res) => {
  res.json({
    route: "resources",
    message: "Resources router mounted",
    mock: {
      hospitals: [
        { id: "h1", name: "Metro General", hazmatSuits: 50, ventilators: 2 },
        { id: "h2", name: "Riverside Medical", hazmatSuits: 120, ventilators: 8 },
      ],
    },
  });
});

export default router;

/**
 * Analytics — readiness scores, regional dashboards, Snowflake aggregates
 */
import { Router } from 'express';

const router = Router();

/**
 * GET /api/analytics/test
 * Dummy endpoint to verify router mount.
 */
router.get('/test', (_req, res) => {
  res.status(200).json({
    route: 'analytics',
    message: 'Analytics router is mounted',
    mock: {
      hospitalId: 'hospital-a',
      readinessScore: 42,
      bedCapacity: 120,
      criticalSuppliesOnHand: 5040,
    },
  });
});

export default router;

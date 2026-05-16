/**
 * Logistics — supply requests, nearest-surplus matching, routing
 */
import { Router } from 'express';

const router = Router();

/**
 * GET /api/logistics/test
 * Dummy endpoint to verify router mount.
 */
router.get('/test', (_req, res) => {
  res.status(200).json({
    route: 'logistics',
    message: 'Logistics router is mounted',
    mock: {
      requestId: 'req-001',
      fromHospitalId: 'hospital-a',
      toHospitalId: 'hospital-b',
      item: 'Hazmat Suits',
      quantity: 50,
      distanceMiles: 10.2,
      status: 'matched',
    },
  });
});

export default router;

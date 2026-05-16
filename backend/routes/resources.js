/**
 * Resources — hospital inventory, shortages, surplus flags
 */
import { Router } from 'express';

const router = Router();

/**
 * GET /api/resources/test
 * Dummy endpoint to verify router mount.
 */
router.get('/test', (_req, res) => {
  res.status(200).json({
    route: 'resources',
    message: 'Resources router is mounted',
    mock: {
      hospitalId: 'hospital-a',
      items: [
        { name: 'Hazmat Suits', quantity: 50, status: 'adequate' },
        { name: 'Ventilators', quantity: 2, status: 'low' },
      ],
    },
  });
});

export default router;

/**
 * Beacon API — Express entry point
 * Mounts resource, logistics, and analytics routers under /api/*
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import resourcesRouter from './routes/resources.js';
import logisticsRouter from './routes/logistics.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Health check (load balancers, demos, quick sanity)
// ---------------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'beacon-api',
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use('/api/resources', resourcesRouter);
app.use('/api/logistics', logisticsRouter);
app.use('/api/analytics', analyticsRouter);

// ---------------------------------------------------------------------------
// 404 for unknown API paths
// ---------------------------------------------------------------------------
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[Beacon] API listening on http://localhost:${PORT}`);
  console.log(`[Beacon] Health: http://localhost:${PORT}/api/health`);
});

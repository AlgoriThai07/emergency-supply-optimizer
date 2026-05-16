import "dotenv/config";
import cors from "cors";
import express from "express";
import analyticsRouter from "./routes/analytics.js";
import logisticsRouter from "./routes/logistics.js";
import resourcesRouter from "./routes/resources.js";
const app = express();
const PORT = Number(process.env.PORT) || 5000;
// Core middleware
app.use(cors());
app.use(express.json());
// Health check — use this to verify the API is up during the hackathon
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "beacon-backend",
        timestamp: new Date().toISOString(),
    });
});
// Domain routers
app.use("/api/resources", resourcesRouter);
app.use("/api/logistics", logisticsRouter);
app.use("/api/analytics", analyticsRouter);
app.listen(PORT, () => {
    console.log(`[Beacon] API listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map
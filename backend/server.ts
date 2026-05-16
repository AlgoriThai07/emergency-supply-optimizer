import "dotenv/config";
import cors from "cors";
import express from "express";
import analyticsRouter from "./routes/analytics.js";
import healthRouter from "./routes/healthRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes.js";
import logisticsRouter from "./routes/logistics.js";
import resourcesRouter from "./routes/resources.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/logistics", logisticsRouter);
app.use("/api/analytics", analyticsRouter);

app.listen(PORT, () => {
  console.log(`[Beacon] API listening on http://localhost:${PORT}`);
});

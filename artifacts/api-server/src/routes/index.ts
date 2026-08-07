import { Router } from "express";
import analysesRouter from "./analyses";
import analyzeRouter from "./analyze";
import healthRouter from "./health"; // 🟢 FIX: Import the missing health configuration

const router = Router();

// Mount all route handlers into the Express runtime system
router.use(analysesRouter);
router.use(analyzeRouter);
router.use(healthRouter); // 🟢 FIX: Expose the health check endpoint to Render

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analyzeRouter from "./analyze";
import analysesRouter from "./analyses";

const router: IRouter = Router();

router.use(healthRouter);
router.use(analyzeRouter);
router.use(analysesRouter);

export default router;

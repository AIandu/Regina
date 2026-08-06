import { Router, type IRouter } from "express";
import { eq, desc, count, avg, sql, and } from "drizzle-orm";
import { db, analysesTable } from "@workspace/db";
import {
  GetAnalysisParams,
  ApproveAnalysisParams,
  ApproveAnalysisBody,
  ListAnalysesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /analyses
router.get("/analyses", async (req, res): Promise<void> => {
  const queryParsed = ListAnalysesQueryParams.safeParse(req.query);
  if (!queryParsed.success) {
    res.status(400).json({ error: queryParsed.error.message });
    return;
  }

  const { type, status, limit } = queryParsed.data;

  const conditions = [];
  if (type) conditions.push(eq(analysesTable.type, type));
  if (status) conditions.push(eq(analysesTable.status, status));

  const rows = await db
    .select()
    .from(analysesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(analysesTable.createdAt))
    .limit(limit ?? 50);

  res.json(
    rows.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      confidenceScore: r.confidenceScore,
      approvalNotes: r.approvalNotes ?? null,
    }))
  );
});

// GET /analyses/stats — must be before /:id
router.get("/analyses/stats", async (_req, res): Promise<void> => {
  const [totalRow] = await db
    .select({ total: count() })
    .from(analysesTable);

  const byTypeRows = await db
    .select({ type: analysesTable.type, cnt: count() })
    .from(analysesTable)
    .groupBy(analysesTable.type);

  const byStatusRows = await db
    .select({ status: analysesTable.status, cnt: count() })
    .from(analysesTable)
    .groupBy(analysesTable.status);

  const [recentRow] = await db
    .select({ cnt: count() })
    .from(analysesTable)
    .where(
      sql`${analysesTable.createdAt} >= now() - interval '7 days'`
    );

  const [avgRow] = await db
    .select({ avg: avg(analysesTable.confidenceScore) })
    .from(analysesTable);

  const byType: Record<string, number> = {};
  for (const row of byTypeRows) byType[row.type] = Number(row.cnt);

  const byStatus: Record<string, number> = {};
  for (const row of byStatusRows) byStatus[row.status] = Number(row.cnt);

  res.json({
    total: Number(totalRow.total),
    byType,
    byStatus,
    recentCount: Number(recentRow.cnt),
    avgConfidenceScore: Number(avgRow.avg ?? 0),
  });
});

// GET /analyses/:id
router.get("/analyses/:id", async (req, res): Promise<void> => {
  const params = GetAnalysisParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(analysesTable)
    .where(eq(analysesTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  res.json({
    id: row.id,
    type: row.type,
    title: row.title,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    inputs: row.inputs,
    result: row.result,
    approvalNotes: row.approvalNotes ?? null,
  });
});

// POST /analyses/:id/approve
router.post("/analyses/:id/approve", async (req, res): Promise<void> => {
  const params = ApproveAnalysisParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = ApproveAnalysisBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(analysesTable)
    .where(eq(analysesTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  const [updated] = await db
    .update(analysesTable)
    .set({
      status: body.data.decision,
      approvalNotes: body.data.notes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(analysesTable.id, params.data.id))
    .returning();

  res.json({
    id: updated.id,
    type: updated.type,
    title: updated.title,
    status: updated.status,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
    inputs: updated.inputs,
    result: updated.result,
    approvalNotes: updated.approvalNotes ?? null,
  });
});

export default router;

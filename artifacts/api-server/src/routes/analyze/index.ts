import { Router, type IRouter } from "express";
import { db, analysesTable } from "@workspace/db";
import {
  AnalyzeFarmBody,
  AnalyzeDatacenterBody,
  AnalyzeResilienceBody,
} from "@workspace/api-zod";
import { runGeminiJSON } from "../../lib/gemini";

const router: IRouter = Router();

// POST /analyze/farm
router.post("/analyze/farm", async (req, res): Promise<void> => {
  const parsed = AnalyzeFarmBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { country, region, climate, soil, water, population } = parsed.data;

  const prompt = `You are an expert agricultural infrastructure planning AI. Analyze the following location data and generate a comprehensive farm siting and strategy recommendation.

Input data:
- Country: ${country}
- Region: ${region}
- Climate type: ${climate}
- Soil description: ${soil}
- Water availability: ${water}
- Population context: ${population}

Return a JSON object with EXACTLY these fields (no extras):
{
  "recommendedLocation": "Specific location recommendation within the region, with geographic rationale (2-3 sentences)",
  "cropStrategy": "Recommended crops, rotation schedule, and cultivation approach suited to the climate and soil (2-3 sentences)",
  "waterDesign": "Irrigation system design, water harvesting, and conservation strategy (2-3 sentences)",
  "energyRequirements": "Power needs for irrigation, processing, and storage; recommended renewable sources (2-3 sentences)",
  "foodProductionEstimate": "Estimated annual yield in tonnes, crops supported, and population feeding capacity (2-3 sentences)",
  "confidenceScore": 0.85,
  "locationScore": 0.78,
  "reasoning": "Comprehensive reasoning covering all factors: climate suitability, soil quality, water security, market access, and risk mitigation (4-5 sentences)",
  "riskFactors": "Key risks such as drought, flooding, pest pressure, or supply chain issues, with mitigation strategies (2-3 sentences)"
}

Ensure confidenceScore and locationScore are decimal values between 0.0 and 1.0. Be specific and actionable.`;

  type FarmResult = {
    recommendedLocation: string;
    cropStrategy: string;
    waterDesign: string;
    energyRequirements: string;
    foodProductionEstimate: string;
    confidenceScore: number;
    locationScore: number;
    reasoning: string;
    riskFactors: string | null;
  };

  const result = await runGeminiJSON<FarmResult>(prompt);

  const title = `Farm Analysis — ${region}, ${country}`;

  const [saved] = await db
    .insert(analysesTable)
    .values({
      type: "farm",
      title,
      inputs: parsed.data,
      result,
      status: "pending",
      confidenceScore: result.confidenceScore ?? 0,
    })
    .returning();

  res.json({
    id: saved.id,
    inputs: parsed.data,
    result,
    status: saved.status,
    createdAt: saved.createdAt.toISOString(),
    approvalNotes: null,
  });
});

// POST /analyze/datacenter
router.post("/analyze/datacenter", async (req, res): Promise<void> => {
  const parsed = AnalyzeDatacenterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { powerAvailability, climate, communityNeeds, industrialDemand } = parsed.data;

  const prompt = `You are an expert AI data center infrastructure planning consultant. Analyze the following site parameters and generate a comprehensive data center siting and design recommendation.

Input data:
- Power availability: ${powerAvailability}
- Climate conditions: ${climate}
- Community infrastructure needs: ${communityNeeds}
- Industrial/commercial demand: ${industrialDemand}

Return a JSON object with EXACTLY these fields (no extras):
{
  "locationRecommendation": "Specific site recommendation with geographic and infrastructure rationale (2-3 sentences)",
  "coolingArchitecture": "Recommended cooling system design: free-air cooling, liquid cooling, hybrid approaches suited to the climate (2-3 sentences)",
  "heatRecoveryDesign": "Heat capture and redistribution system: district heating, industrial process heat, greenhouse integration (2-3 sentences)",
  "thermalReuseOptions": "Specific thermal reuse applications: heating networks, aquaculture, food drying, or industrial processes (2-3 sentences)",
  "energyImpactReport": "Net energy impact assessment: power draw, renewable integration, grid impact, and carbon footprint estimate (2-3 sentences)",
  "confidenceScore": 0.82,
  "pueEstimate": 1.25,
  "reasoning": "Comprehensive siting rationale covering power security, cooling efficiency, community benefit, and long-term scalability (4-5 sentences)",
  "riskFactors": "Key risks: power outages, cooling failures, community resistance, climate extremes, and mitigation strategies (2-3 sentences)"
}

Ensure confidenceScore is 0.0-1.0, pueEstimate is typically 1.1-2.0. Be technically specific.`;

  type DatacenterResult = {
    locationRecommendation: string;
    coolingArchitecture: string;
    heatRecoveryDesign: string;
    thermalReuseOptions: string;
    energyImpactReport: string;
    confidenceScore: number;
    pueEstimate: number;
    reasoning: string;
    riskFactors: string | null;
  };

  const result = await runGeminiJSON<DatacenterResult>(prompt);

  const title = `Data Center Hub — ${climate} climate`;

  const [saved] = await db
    .insert(analysesTable)
    .values({
      type: "datacenter",
      title,
      inputs: parsed.data,
      result,
      status: "pending",
      confidenceScore: result.confidenceScore ?? 0,
    })
    .returning();

  res.json({
    id: saved.id,
    inputs: parsed.data,
    result,
    status: saved.status,
    createdAt: saved.createdAt.toISOString(),
    approvalNotes: null,
  });
});

// POST /analyze/resilience
router.post("/analyze/resilience", async (req, res): Promise<void> => {
  console.log("🔥 RESILIENCE ROUTE HIT");
  const parsed = AnalyzeResilienceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { country, environmentalConstraints, infrastructureInfo } = parsed.data;

  const prompt = `You are an expert national resilience and infrastructure planning AI. Analyze the following country data and generate a comprehensive resilience blueprint with deployment strategy.

Input data:
- Country/Region: ${country}
- Environmental constraints: ${environmentalConstraints}
- Current infrastructure: ${infrastructureInfo}

Return a JSON object with EXACTLY these fields (no extras):
{
  "blueprint": "Complete resilience blueprint: integrated water, energy, food, and digital infrastructure strategy for long-term sustainability (4-5 sentences)",
  "riskScenarios": "Top 3-4 risk scenarios with probability assessments: climate events, infrastructure failures, supply chain disruptions, and geopolitical risks (3-4 sentences)",
  "deploymentPhases": "Phased implementation plan: Phase 1 (0-2 years) critical foundations, Phase 2 (2-5 years) capacity expansion, Phase 3 (5-10 years) full resilience achieved (3-4 sentences)",
  "explanation": "Plain-language explanation of the strategy suitable for policymakers and the public: what it achieves, why it was chosen, and what success looks like (3-4 sentences)",
  "confidenceScore": 0.79,
  "overallResilienceScore": 0.72,
  "priorityActions": "Top 5 immediate priority actions that unlock the most resilience value in the shortest time (2-3 sentences)"
}

Ensure confidenceScore and overallResilienceScore are 0.0-1.0. Be specific, actionable, and grounded in the country's actual context.`;

  type ResilienceResult = {
    blueprint: string;
    riskScenarios: string;
    deploymentPhases: string;
    explanation: string;
    confidenceScore: number;
    overallResilienceScore: number;
    priorityActions: string | null;
  };

  const result = await runGeminiJSON<ResilienceResult>(prompt);

  const title = `Resilience Blueprint — ${country}`;

  const [saved] = await db
    .insert(analysesTable)
    .values({
      type: "resilience",
      title,
      inputs: parsed.data,
      result,
      status: "pending",
      confidenceScore: result.confidenceScore ?? 0,
    })
    .returning();

  res.json({
    id: saved.id,
    inputs: parsed.data,
    result,
    status: saved.status,
    createdAt: saved.createdAt.toISOString(),
    approvalNotes: null,
  });
});

export default router;

import "dotenv/config";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { ZodError, z } from "zod";
import {
  completeQuest,
  generateQuest,
  getArchiveOverview,
  getAuthUser,
  getCurrentQuest,
  getMapProgress,
  getProfile,
  getProfileHistory,
  getQuestTemplates,
  getRouteById,
} from "./mock-data.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
const port = Number(process.env.PORT || 9091);
const rpgAgentApiBase = (
  process.env.RPG_AGENT_API_BASE_URL ||
  process.env.COZE_API_BASE_URL ||
  ""
).replace(/\/$/, "");
const rpgAgentAuthToken =
  process.env.RPG_AGENT_AUTH_TOKEN ||
  process.env.COZE_API_TOKEN ||
  "";
const rpgAgentUserId = process.env.RPG_AGENT_USER_ID || "demo-user";
const rpgAgentTimeoutMs = Number(process.env.RPG_AGENT_TIMEOUT_MS || 15000);
const rpgAgentDefaultLatitude = Number(process.env.RPG_AGENT_DEFAULT_LATITUDE || 23.1291);
const rpgAgentDefaultLongitude = Number(process.env.RPG_AGENT_DEFAULT_LONGITUDE || 113.2644);
const journalAgentApiBase = (
  process.env.JOURNAL_AGENT_API_BASE_URL ||
  process.env.ARCHIVE_AGENT_API_BASE_URL ||
  "https://7hmj3zhd23.coze.site"
).replace(/\/$/, "");
const journalAgentAuthToken =
  process.env.JOURNAL_AGENT_AUTH_TOKEN ||
  process.env.ARCHIVE_AGENT_AUTH_TOKEN ||
  "";
const journalAgentUserId =
  process.env.JOURNAL_AGENT_USER_ID || "00000000-0000-4000-8000-000000000001";
const journalAgentTimeoutMs = Number(process.env.JOURNAL_AGENT_TIMEOUT_MS || 90000);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const generateQuestSchema = z.object({
  templateId: z.string().min(1),
  departure: z.string().min(1),
  budget: z.string().min(1),
  time: z.string().min(1),
  mood: z.string().min(1),
  foodPreference: z.array(z.string()).min(1),
  vibe: z.string().min(1),
});

const completeQuestSchema = z.object({
  satisfaction: z.number().int().min(1).max(5),
});

const routeIdSchema = z.object({
  routeId: z.string().min(1),
});

const questIdSchema = z.object({
  questId: z.string().min(1),
});

const collectionKindSchema = z.enum([
  "city-memory",
  "food-archive",
  "landmark-discovery",
  "vibe-collection",
]);

const chatRequestSchema = z.object({
  prompt: z.string().trim().min(1),
  sessionId: z.string().trim().min(1).optional(),
  context: z
    .object({
      surface: z.string().trim().min(1).optional(),
      kind: collectionKindSchema.optional(),
      title: z.string().trim().min(1).optional(),
      subtitle: z.string().trim().min(1).optional(),
      note: z.string().trim().min(1).optional(),
    })
    .optional(),
});

const chatCommissionGenerateSchema = z.object({
  scenario: z.string().trim().min(1),
  latitude: z.number().finite().optional(),
  longitude: z.number().finite().optional(),
});

const journalCardGenerateSchema = z.object({
  kind: z.enum(["city-memory", "food-archive"]),
  title: z.string().trim().min(1).optional(),
  subtitle: z.string().trim().min(1).optional(),
  note: z.string().trim().min(1).optional(),
  userId: z.string().trim().min(1).optional(),
});

const rpgInterpretResponseSchema = z.object({
  shouldGenerateCommission: z.boolean().optional(),
  scenario: z.string().optional(),
  reply: z.string().trim().min(1),
  askAccept: z.boolean().optional(),
});

const rpgCommissionSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1).optional(),
  subtitle: z.string().trim().optional(),
  difficulty: z.string().trim().optional(),
  commissionType: z.string().trim().optional(),
  xp: z.number().finite().optional(),
  rewardTags: z.array(z.string()).optional(),
  description: z.string().trim().optional(),
});

const rpgGenerateResponseSchema = z.object({
  status: z.string().trim().optional(),
  scenario: z.string().trim().optional(),
  commission: rpgCommissionSchema,
});

const journalCardAgentResponseSchema = z.object({
  journal_entry_id: z.string().trim().min(1).optional(),
  generated_image_url: z.string().trim().min(1).optional(),
  original_image_url: z.string().trim().min(1).optional(),
  download_url: z.string().trim().min(1).optional(),
  food_name: z.string().trim().min(1).optional(),
  food_description: z.string().trim().min(1).optional(),
  food_tags: z.array(z.string()).optional(),
  story: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).optional(),
  subtitle: z.string().trim().min(1).optional(),
  note: z.string().trim().min(1).optional(),
  tags: z.array(z.string()).optional(),
});

type JournalCardPayload = z.infer<typeof journalCardAgentResponseSchema>;

function normalizeScenarioLabel(scenario: string) {
  return scenario
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildJournalPromptHint(kind: "city-memory" | "food-archive", title?: string, subtitle?: string, note?: string) {
  const roleCopy =
    kind === "city-memory"
      ? "你正在处理城市记忆手账卡生成任务，请优先提炼街景、建筑、光线、时间感和城市漫游气质。"
      : "你正在处理美食手账卡生成任务，请优先提炼食物名称、味道、口感、热气和就餐场景。";

  return [
    "这不是聊天问答，而是前端发起的图片手账卡生成请求。",
    roleCopy,
    "不要回复无法理解、乱码或补充说明，直接基于图片与附带信息生成适合手账卡展示的结果。",
    title ? `标题参考：${title}` : "",
    subtitle ? `副标题参考：${subtitle}` : "",
    note ? `原始备注参考：${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeJournalUserId(userId?: string) {
  if (userId && uuidPattern.test(userId)) {
    return userId;
  }

  return journalAgentUserId;
}

function pickObjectPayload(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && "data" in value) {
    const nested = (value as { data?: unknown }).data;

    if (nested && typeof nested === "object") {
      return nested as Record<string, unknown>;
    }
  }

  return (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
}

function deriveJournalTitle(kind: "city-memory" | "food-archive", payload: JournalCardPayload, fallbackTitle: string) {
  if (payload.title) {
    return payload.title;
  }

  if (kind === "food-archive" && payload.food_name) {
    return payload.food_name;
  }

  return fallbackTitle || (kind === "city-memory" ? "城市手账卡" : "美食手账卡");
}

function deriveJournalSubtitle(
  kind: "city-memory" | "food-archive",
  payload: JournalCardPayload,
  fallbackSubtitle?: string
) {
  if (payload.subtitle) {
    return payload.subtitle;
  }

  if (kind === "city-memory" && fallbackSubtitle) {
    return fallbackSubtitle;
  }

  const tags = payload.tags?.filter(Boolean) ?? payload.food_tags?.filter(Boolean) ?? [];

  if (kind === "food-archive" && tags.length > 0) {
    return tags.slice(0, 2).join(" · ");
  }

  if (fallbackSubtitle) {
    return fallbackSubtitle;
  }

  return kind === "city-memory" ? "城市漫游" : "风味索引";
}

function deriveJournalNote(payload: JournalCardPayload, fallbackNote?: string) {
  return payload.note || payload.story || payload.food_description || fallbackNote || "这页手账卡已经整理完成。";
}

async function readJsonLikeResponse(response: globalThis.Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(text);
  }
}

async function postJournalAgentForm(path: string, formData: FormData) {
  if (!journalAgentApiBase) {
    throw new Error("JOURNAL_AGENT_API_BASE_URL is not configured on the server");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), journalAgentTimeoutMs);

  try {
    const response = await fetch(`${journalAgentApiBase}${path}`, {
      method: "POST",
      headers: journalAgentAuthToken ? { Authorization: `Bearer ${journalAgentAuthToken}` } : undefined,
      body: formData,
      signal: controller.signal,
    });

    const payload = await readJsonLikeResponse(response);

    if (!response.ok) {
      throw new Error(typeof payload === "string" ? payload : JSON.stringify(payload));
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJournalImageDetails(journalEntryId: string) {
  if (!journalAgentApiBase) {
    return {};
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), journalAgentTimeoutMs);

  try {
    const response = await fetch(`${journalAgentApiBase}/api/journal/${journalEntryId}/image`, {
      method: "GET",
      headers: journalAgentAuthToken ? { Authorization: `Bearer ${journalAgentAuthToken}` } : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      return {};
    }

    return pickObjectPayload(await readJsonLikeResponse(response));
  } finally {
    clearTimeout(timeout);
  }
}

function mapCommissionToCurrentQuest(
  commission: z.infer<typeof rpgCommissionSchema>,
  scenario: string,
) {
  const xp = Math.max(10, Math.round(commission.xp ?? 20));
  const title = commission.title || normalizeScenarioLabel(scenario);
  const rewardTags = commission.rewardTags?.filter(Boolean) ?? [];
  const fallbackTags = rewardTags.length > 0 ? rewardTags : [scenario.replace(/_/g, " "), "城市漫游"];

  return {
    id: commission.id || `commission-${Date.now()}`,
    routeId: `route-${Date.now()}`,
    quest_type: commission.commissionType || scenario,
    route_title: title,
    budget: "待探索",
    duration: commission.difficulty ? `${commission.difficulty} 难度` : "轻量路线",
    intensity: commission.difficulty || "EASY",
    people: "1 - 2 人",
    vibe_tags: fallbackTags.slice(0, 4),
    timeline: [
      commission.subtitle || "委托已生成，准备出发",
      commission.description || "沿着推荐路线，把今晚写成一段新的城市记忆。",
    ],
    expected_rewards: {
      vitality: 8,
      exploration: 12,
      joy: 10,
      taste: 8,
      xp,
    },
  };
}

async function callRpgAgentInterpret(prompt: string) {
  if (!rpgAgentApiBase) {
    throw new Error("RPG_AGENT_API_BASE_URL is not configured on the server");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), rpgAgentTimeoutMs);

  try {
    const response = await fetch(`${rpgAgentApiBase}/api/action/commission/interpret`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": rpgAgentUserId,
        ...(rpgAgentAuthToken ? { Authorization: `Bearer ${rpgAgentAuthToken}` } : {}),
      },
      body: JSON.stringify({
        text: prompt,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    return rpgInterpretResponseSchema.parse(data);
  } finally {
    clearTimeout(timeout);
  }
}

async function callRpgAgentGenerate(
  scenario: string,
  latitude = rpgAgentDefaultLatitude,
  longitude = rpgAgentDefaultLongitude,
) {
  if (!rpgAgentApiBase) {
    throw new Error("RPG_AGENT_API_BASE_URL is not configured on the server");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), rpgAgentTimeoutMs);

  try {
    const response = await fetch(`${rpgAgentApiBase}/api/action/commission/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": rpgAgentUserId,
        ...(rpgAgentAuthToken ? { Authorization: `Bearer ${rpgAgentAuthToken}` } : {}),
      },
      body: JSON.stringify({
        scenario,
        latitude,
        longitude,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    return rpgGenerateResponseSchema.parse(data);
  } finally {
    clearTimeout(timeout);
  }
}

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get(["/health", "/api/v1/health"], (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "server",
    timestamp: new Date().toISOString(),
    chatBackend: rpgAgentApiBase || "unconfigured",
  });
});

app.get("/api/v1/auth/me", (_req, res) => {
  res.status(200).json({
    user: getAuthUser(),
    isAuthenticated: true,
  });
});

app.post("/api/v1/chat", async (req, res, next) => {
  try {
    const payload = chatRequestSchema.parse(req.body);
    const sessionId = payload.sessionId || `web-${Date.now()}`;
    const result = await callRpgAgentInterpret(payload.prompt);

    res.status(200).json({
      reply: result.reply,
      sessionId,
      shouldGenerateCommission: result.shouldGenerateCommission ?? false,
      scenario: result.scenario ?? null,
      askAccept: result.askAccept ?? false,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/chat/commission/generate", async (req, res, next) => {
  try {
    const payload = chatCommissionGenerateSchema.parse(req.body);
    const result = await callRpgAgentGenerate(payload.scenario, payload.latitude, payload.longitude);
    const quest = mapCommissionToCurrentQuest(result.commission, payload.scenario);

    res.status(200).json({
      status: result.status ?? "READY",
      scenario: result.scenario ?? payload.scenario,
      commission: result.commission,
      quest,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/journal-card/generate", upload.single("image"), async (req, res, next) => {
  try {
    const payload = journalCardGenerateSchema.parse(req.body);

    if (!req.file) {
      res.status(400).json({
        error: {
          code: "IMAGE_REQUIRED",
          message: "An image file is required to generate a journal card",
        },
      });
      return;
    }

    const promptHint = buildJournalPromptHint(payload.kind, payload.title, payload.subtitle, payload.note);
    const fileName = req.file.originalname || `${payload.kind}-${Date.now()}.jpg`;
    const mimeType = req.file.mimetype || "image/jpeg";
    const fileBytes = new Uint8Array(req.file.buffer);
    const formData = new FormData();

    formData.append("image", new Blob([fileBytes], { type: mimeType }), fileName);
    formData.append("userId", normalizeJournalUserId(payload.userId));
    formData.append("kind", payload.kind);

    if (payload.title) {
      formData.append("title", payload.title);
    }

    if (payload.subtitle) {
      formData.append("subtitle", payload.subtitle);
    }

    if (payload.note) {
      formData.append("note", payload.note);
    }

    formData.append("prompt", promptHint);

    let primaryResponse: Record<string, unknown>;

    try {
      primaryResponse = pickObjectPayload(await postJournalAgentForm("/api/scan-food", formData));
    } catch (error) {
      if (payload.kind !== "city-memory") {
        throw error;
      }

      const fallbackFormData = new FormData();
      fallbackFormData.append("image", new Blob([fileBytes], { type: mimeType }), fileName);
      fallbackFormData.append("kind", payload.kind);
      fallbackFormData.append("prompt", promptHint);
      primaryResponse = pickObjectPayload(
        await postJournalAgentForm("/api/generate-food-annotation", fallbackFormData)
      );
    }

    const primaryPayload = journalCardAgentResponseSchema.parse(primaryResponse);
    const imageDetails = primaryPayload.journal_entry_id
      ? journalCardAgentResponseSchema.partial().parse(
          await fetchJournalImageDetails(primaryPayload.journal_entry_id)
        )
      : undefined;
    const tags = (primaryPayload.tags?.filter(Boolean) ?? primaryPayload.food_tags?.filter(Boolean) ?? []).slice(
      0,
      5
    );
    const title = deriveJournalTitle(payload.kind, primaryPayload, payload.title || "");
    const subtitle = deriveJournalSubtitle(payload.kind, primaryPayload, payload.subtitle);
    const note = deriveJournalNote(primaryPayload, payload.note);
    const generatedImageUrl =
      imageDetails?.generated_image_url ||
      imageDetails?.download_url ||
      primaryPayload.generated_image_url ||
      primaryPayload.original_image_url;

    if (!generatedImageUrl) {
      throw new Error("Journal agent did not return a generated image URL");
    }

    res.status(200).json({
      kind: payload.kind,
      title,
      subtitle,
      note,
      tags,
      journalEntryId: primaryPayload.journal_entry_id || null,
      generatedImageUrl,
      originalImageUrl: primaryPayload.original_image_url || null,
      downloadUrl: imageDetails?.download_url || primaryPayload.download_url || generatedImageUrl,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/quests/templates", (_req, res) => {
  res.status(200).json({
    templates: getQuestTemplates(),
  });
});

app.post("/api/v1/quests/generate", (req, res, next) => {
  try {
    const payload = generateQuestSchema.parse(req.body);
    const quest = generateQuest(payload);

    res.status(200).json({
      quest,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/quests/current", (_req, res) => {
  res.status(200).json({
    quest: getCurrentQuest(),
  });
});

app.get("/api/v1/routes/:routeId", (req, res, next) => {
  try {
    const { routeId } = routeIdSchema.parse(req.params);
    const route = getRouteById(routeId);

    if (!route) {
      res.status(404).json({
        error: {
          code: "ROUTE_NOT_FOUND",
          message: "Route not found",
        },
      });
      return;
    }

    res.status(200).json({
      route,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/quests/:questId/complete", (req, res, next) => {
  try {
    const { questId } = questIdSchema.parse(req.params);
    const payload = completeQuestSchema.parse(req.body);
    const completion = completeQuest(payload.satisfaction);

    if (!completion || completion.questId !== questId) {
      res.status(404).json({
        error: {
          code: "QUEST_NOT_FOUND",
          message: "Quest not found",
        },
      });
      return;
    }

    res.status(200).json({
      completion,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/profile", (_req, res) => {
  res.status(200).json(getProfile());
});

app.get("/api/v1/profile/history", (_req, res) => {
  res.status(200).json({
    history: getProfileHistory(),
  });
});

app.get("/api/v1/archive/overview", (_req, res) => {
  res.status(200).json({
    archive: getArchiveOverview(),
  });
});

app.get("/api/v1/map/progress", (_req, res) => {
  res.status(200).json({
    map: getMapProgress(),
  });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.flatten(),
      },
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Unexpected server error",
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});

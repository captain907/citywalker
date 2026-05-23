import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
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
const port = Number(process.env.PORT || 9091);

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

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "server",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/v1/auth/me", (_req, res) => {
  res.status(200).json({
    user: getAuthUser(),
    isAuthenticated: true,
  });
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
      message: "Unexpected server error",
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});

export interface CoreAttributes {
  vitality: number;
  exploration: number;
  joy: number;
  taste: number;
}

export interface WorldAttributes {
  cityMemory: string[];
  cuisineArchive: string[];
  landmarkDiscovery: string[];
  vibeCollection: string[];
  journeyLevel: number;
  xp: number;
}

export interface ExpectedRewards {
  vitality: number;
  exploration: number;
  joy: number;
  taste: number;
  xp: number;
}

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  type: string;
  questType: string;
  xp: number;
  icon: string;
  recommended: string;
  difficulty: "easy" | "medium" | "hard";
  possibleDiscoveries: string[];
}

export interface QuestGenerateInput {
  templateId: string;
  departure: string;
  budget: string;
  time: string;
  mood: string;
  foodPreference: string[];
  vibe: string;
}

export interface CurrentQuest {
  id: string;
  routeId: string;
  quest_type: string;
  route_title: string;
  budget: string;
  duration: string;
  intensity: string;
  people: string;
  vibe_tags: string[];
  timeline: string[];
  expected_rewards: ExpectedRewards;
}

export interface RouteStop {
  id: number;
  title: string;
  description: string;
  xp: number;
}

export interface RouteDetail {
  id: string;
  title: string;
  distanceKm: number;
  duration: string;
  checkinCount: number;
  stops: RouteStop[];
  note: string;
}

export interface RouteHistoryItem {
  date: string;
  routeTitle: string;
  cuisine: string[];
  landmarks: string[];
  vibes: string[];
  xp: number;
}

export interface AppUser {
  id: string;
  nickname: string;
  avatarUrl: string | null;
}

export interface CompletionResult {
  questId: string;
  gainedXp: number;
  levelBefore: number;
  levelAfter: number;
  coreAttributes: {
    before: CoreAttributes;
    after: CoreAttributes;
  };
  unlockedCollections: {
    cityMemory: string[];
    cuisineArchive: string[];
    landmarkDiscovery: string[];
    vibeCollection: string[];
  };
}

export interface ArchiveOverview {
  cityMemory: {
    total: number;
    latest: string[];
  };
  cuisineArchive: {
    total: number;
    latest: string[];
  };
  landmarkDiscovery: {
    total: number;
    latest: string[];
  };
  vibeCollection: {
    total: number;
    latest: string[];
  };
}

export interface MapDistrictProgress {
  districtName: string;
  status: string;
  xp: number;
  isUnlocked: boolean;
}

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 450 },
  { level: 5, xp: 700 },
];

const questTemplates: QuestTemplate[] = [
  {
    id: "after-meal-1km",
    title: "饭后一公里",
    description: "轻量散步型路线模板，适合晚饭后的放松探索。",
    type: "饭后路线",
    questType: "桥边散步",
    xp: 20,
    icon: "person-walking",
    recommended: "适合想消食、看风景、顺手收集夜风的人。",
    difficulty: "easy",
    possibleDiscoveries: ["桥边灯火", "街角糖水", "晚风摊位"],
  },
  {
    id: "route-blind-box",
    title: "路线盲盒",
    description: "把今晚交给城市，让路线带来一点未知感。",
    type: "惊喜路线",
    questType: "随机委托",
    xp: 30,
    icon: "box-open",
    recommended: "适合临时起意、想被城市带着走的人。",
    difficulty: "medium",
    possibleDiscoveries: ["隐藏巷口", "偶遇小馆", "陌生桥头"],
  },
  {
    id: "crayfish-explore",
    title: "小龙虾探索",
    description: "热闹夜色和风味探索结合的城市委托。",
    type: "美食探索",
    questType: "风味夜游",
    xp: 35,
    icon: "utensils",
    recommended: "适合想吃得满足，也想把夜色收进图鉴的人。",
    difficulty: "medium",
    possibleDiscoveries: ["口味虾", "青石街灯", "江边凉风"],
  },
];

const baseRoute: RouteDetail = {
  id: "route-pearl-night-001",
  title: "太平老街 · 江风寻味之旅",
  distanceKm: 4.2,
  duration: "3.5 小时",
  checkinCount: 5,
  stops: [
    {
      id: 1,
      title: "老街牌坊",
      description: "从入口完成今晚的第一枚打卡印章。",
      xp: 30,
    },
    {
      id: 2,
      title: "热闹食摊",
      description: "在热气和灯火里找到这条路线的主味道。",
      xp: 60,
    },
    {
      id: 3,
      title: "故居转角",
      description: "为路线补上一段属于老城区的故事注脚。",
      xp: 40,
    },
    {
      id: 4,
      title: "晚风小憩",
      description: "短暂停留，让节奏稍微慢下来一点。",
      xp: 30,
    },
    {
      id: 5,
      title: "江边收尾",
      description: "以河岸和夜风作为今晚的结尾。",
      xp: 40,
    },
  ],
  note: "适合夜间轻量探索，推荐 2 到 4 人同行。",
};

const currentUser: AppUser = {
  id: "user-demo-001",
  nickname: "旅人小满",
  avatarUrl: null,
};

let coreAttributes: CoreAttributes = {
  vitality: 62,
  exploration: 38,
  joy: 54,
  taste: 41,
};

let worldAttributes: WorldAttributes = {
  cityMemory: ["校园南区", "珠江桥边", "太平老街"],
  cuisineArchive: ["口味虾", "糖水铺"],
  landmarkDiscovery: ["江边散步点", "老街牌坊"],
  vibeCollection: ["夜晚江风", "热闹食摊"],
  journeyLevel: 2,
  xp: 180,
};

let routeHistory: RouteHistoryItem[] = [
  {
    date: "2026-05-23",
    routeTitle: "太平老街 · 江风寻味之旅",
    cuisine: ["口味虾"],
    landmarks: ["珠江桥边"],
    vibes: ["夜晚江风", "热闹食摊"],
    xp: 42,
  },
];

let currentQuest: CurrentQuest | null = {
  id: "quest-current",
  routeId: baseRoute.id,
  quest_type: "风味夜游",
  route_title: baseRoute.title,
  budget: "60 - 100",
  duration: baseRoute.duration,
  intensity: "轻松",
  people: "2 - 4 人",
  vibe_tags: ["夜晚江风", "热闹食摊", "老城灯火"],
  timeline: ["18:30 出发", "19:00 第一站", "21:30 江边收尾"],
  expected_rewards: {
    vitality: 12,
    exploration: 18,
    joy: 15,
    taste: 16,
    xp: 42,
  },
};

const routes = new Map<string, RouteDetail>([[baseRoute.id, baseRoute]]);

function getLevelForXp(xp: number): number {
  for (let index = LEVEL_THRESHOLDS.length - 1; index >= 0; index -= 1) {
    if (xp >= LEVEL_THRESHOLDS[index].xp) {
      return LEVEL_THRESHOLDS[index].level;
    }
  }

  return 1;
}

export function getAuthUser(): AppUser {
  return currentUser;
}

export function getQuestTemplates(): QuestTemplate[] {
  return questTemplates;
}

export function getCurrentQuest(): CurrentQuest | null {
  return currentQuest;
}

export function getRouteById(routeId: string): RouteDetail | null {
  return routes.get(routeId) ?? null;
}

export function generateQuest(input: QuestGenerateInput): CurrentQuest {
  const template = questTemplates.find((item) => item.id === input.templateId) ?? questTemplates[0];
  const routeId = `route-${Date.now()}`;
  const routeTitle = `${input.departure} · ${template.title}之旅`;

  const generatedQuest: CurrentQuest = {
    id: "quest-current",
    routeId,
    quest_type: template.questType,
    route_title: routeTitle,
    budget: input.budget,
    duration: input.time === "一日" ? "3.5 小时" : input.time,
    intensity: input.mood.includes("夜") ? "适中" : "轻松",
    people: "2 - 4 人",
    vibe_tags: [input.vibe, ...input.foodPreference.slice(0, 2)],
    timeline: [
      "18:30 从出发地开始",
      "19:10 进入第一段探索",
      "20:20 完成主线打卡",
      "21:30 以夜景收尾",
    ],
    expected_rewards: {
      vitality: 12,
      exploration: 18,
      joy: 15,
      taste: 16,
      xp: template.xp + 12,
    },
  };

  routes.set(routeId, {
    id: routeId,
    title: routeTitle,
    distanceKm: 4.2,
    duration: generatedQuest.duration,
    checkinCount: 5,
    stops: baseRoute.stops,
    note: `${input.mood} / ${input.budget} / ${input.departure}`,
  });

  currentQuest = generatedQuest;
  return generatedQuest;
}

export function completeQuest(satisfaction: number): CompletionResult | null {
  if (!currentQuest) {
    return null;
  }

  const quest = currentQuest;
  const beforeAttributes = { ...coreAttributes };
  const levelBefore = worldAttributes.journeyLevel;
  const satisfactionBonus = satisfaction >= 5 ? 10 : satisfaction === 4 ? 5 : 0;
  const gainedXp = quest.expected_rewards.xp + satisfactionBonus;

  coreAttributes = {
    vitality: Math.min(100, coreAttributes.vitality + quest.expected_rewards.vitality),
    exploration: Math.min(100, coreAttributes.exploration + quest.expected_rewards.exploration),
    joy: Math.min(100, coreAttributes.joy + quest.expected_rewards.joy),
    taste: Math.min(100, coreAttributes.taste + quest.expected_rewards.taste),
  };

  worldAttributes = {
    cityMemory: Array.from(new Set([...worldAttributes.cityMemory, "珠江桥边"])),
    cuisineArchive: Array.from(new Set([...worldAttributes.cuisineArchive, "口味虾"])),
    landmarkDiscovery: Array.from(new Set([...worldAttributes.landmarkDiscovery, "江边散步点"])),
    vibeCollection: Array.from(new Set([...worldAttributes.vibeCollection, "夜晚江风"])),
    xp: worldAttributes.xp + gainedXp,
    journeyLevel: getLevelForXp(worldAttributes.xp + gainedXp),
  };

  routeHistory = [
    {
      date: new Date().toISOString().slice(0, 10),
      routeTitle: quest.route_title,
      cuisine: ["口味虾"],
      landmarks: ["珠江桥边"],
      vibes: quest.vibe_tags,
      xp: gainedXp,
    },
    ...routeHistory,
  ];

  currentQuest = null;

  return {
    questId: quest.id,
    gainedXp,
    levelBefore,
    levelAfter: worldAttributes.journeyLevel,
    coreAttributes: {
      before: beforeAttributes,
      after: coreAttributes,
    },
    unlockedCollections: {
      cityMemory: ["珠江桥边"],
      cuisineArchive: ["口味虾"],
      landmarkDiscovery: ["江边散步点"],
      vibeCollection: ["夜晚江风"],
    },
  };
}

export function getProfile() {
  return {
    user: currentUser,
    coreAttributes,
    worldAttributes,
    stats: {
      completedRoutes: routeHistory.length,
      explorationDays: 56,
      checkins: 132,
      achievements: 18,
    },
  };
}

export function getProfileHistory(): RouteHistoryItem[] {
  return routeHistory;
}

export function getArchiveOverview(): ArchiveOverview {
  return {
    cityMemory: {
      total: worldAttributes.cityMemory.length,
      latest: worldAttributes.cityMemory.slice(-3),
    },
    cuisineArchive: {
      total: worldAttributes.cuisineArchive.length,
      latest: worldAttributes.cuisineArchive.slice(-3),
    },
    landmarkDiscovery: {
      total: worldAttributes.landmarkDiscovery.length,
      latest: worldAttributes.landmarkDiscovery.slice(-3),
    },
    vibeCollection: {
      total: worldAttributes.vibeCollection.length,
      latest: worldAttributes.vibeCollection.slice(-3),
    },
  };
}

export function getMapProgress() {
  const districts: MapDistrictProgress[] = [
    {
      districtName: "校园南区",
      status: "已点亮",
      xp: 120,
      isUnlocked: true,
    },
    {
      districtName: "珠江桥边",
      status: "已点亮",
      xp: 85,
      isUnlocked: true,
    },
    {
      districtName: "东山口",
      status: "探索中",
      xp: 45,
      isUnlocked: true,
    },
    {
      districtName: "大学城",
      status: "待解锁",
      xp: 0,
      isUnlocked: false,
    },
  ];

  return {
    unlockedCount: 6,
    totalCount: 12,
    districts,
  };
}

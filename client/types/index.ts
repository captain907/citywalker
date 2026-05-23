export interface CoreAttributes {
  vitality: number;
  exploration: number;
  joy: number;
  taste: number;
}

export interface WorldAttributes {
  city_memory: string[];
  cuisine_archive: string[];
  landmark_discovery: string[];
  vibe_collection: string[];
  journey_level: number;
  xp: number;
}

export interface TimelineItem {
  time: string;
  description: string;
}

export interface ExpectedRewards {
  vitality: number;
  exploration: number;
  joy: number;
  taste: number;
  xp: number;
}

export interface CurrentQuest {
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

export interface RouteHistoryItem {
  date: string;
  route_title: string;
  cuisine: string[];
  landmarks: string[];
  vibes: string[];
  xp: number;
}

export interface QuestCardData {
  id: string;
  title: string;
  description: string;
  type: string;
  questType?: string;
  xp: number;
  icon: string;
  recommended: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  possibleDiscoveries?: string[];
}

export interface QuestPreferences {
  departure: string;
  budget: string;
  time: string;
  mood: string;
  foodPreference: string;
  vibe: string;
}

export interface AppContextType {
  coreAttributes: CoreAttributes;
  worldAttributes: WorldAttributes;
  currentQuest: CurrentQuest | null;
  routeHistory: RouteHistoryItem[];
  questPreferences: QuestPreferences;
  questTemplates: QuestCardData[];
  selectedQuest: string | null;
  setCoreAttributes: (attrs: CoreAttributes) => void;
  setWorldAttributes: (attrs: WorldAttributes) => void;
  setCurrentQuest: (quest: CurrentQuest | null) => void;
  setRouteHistory: (history: RouteHistoryItem[]) => void;
  setQuestPreferences: (prefs: QuestPreferences) => void;
  selectQuest: (questType: string) => void;
  mockCurrentQuest: () => void;
  completeQuest: (satisfaction: number) => void;
}

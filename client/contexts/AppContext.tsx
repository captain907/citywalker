import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
  AppContextType,
  CoreAttributes,
  CurrentQuest,
  QuestPreferences,
  RouteHistoryItem,
  WorldAttributes,
} from '@/types';
import {
  LEVEL_THRESHOLDS,
  MOCK_CORE_ATTRIBUTES,
  MOCK_CURRENT_QUEST,
  MOCK_QUEST_CARDS,
  MOCK_QUEST_PREFERENCES,
  MOCK_ROUTE_HISTORY,
  MOCK_WORLD_ATTRIBUTES,
} from '@/data/mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [coreAttributes, setCoreAttributes] = useState<CoreAttributes>(MOCK_CORE_ATTRIBUTES);
  const [worldAttributes, setWorldAttributes] = useState<WorldAttributes>(MOCK_WORLD_ATTRIBUTES);
  const [currentQuest, setCurrentQuest] = useState<CurrentQuest | null>(MOCK_CURRENT_QUEST);
  const [routeHistory, setRouteHistory] = useState<RouteHistoryItem[]>(MOCK_ROUTE_HISTORY);
  const [questPreferences, setQuestPreferences] = useState<QuestPreferences>(MOCK_QUEST_PREFERENCES);
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const questTemplates = MOCK_QUEST_CARDS;

  const getLevelForXP = (xp: number) => {
    for (let index = LEVEL_THRESHOLDS.length - 1; index >= 0; index -= 1) {
      if (xp >= LEVEL_THRESHOLDS[index].xp) {
        return LEVEL_THRESHOLDS[index].level;
      }
    }
    return 1;
  };

  const selectQuest = (questType: string) => {
    setSelectedQuest(questType);
  };

  const mockCurrentQuest = () => {
    setCurrentQuest(MOCK_CURRENT_QUEST);
  };

  const completeQuest = (satisfaction: number) => {
    if (!currentQuest) {
      return;
    }

    const rewards = currentQuest.expected_rewards;
    const satisfactionBonus = satisfaction === 5 ? 10 : satisfaction === 4 ? 5 : 0;
    const totalXP = rewards.xp + satisfactionBonus;

    setCoreAttributes((prev) => ({
      vitality: Math.min(100, prev.vitality + rewards.vitality),
      exploration: Math.min(100, prev.exploration + rewards.exploration),
      joy: Math.min(100, prev.joy + rewards.joy),
      taste: Math.min(100, prev.taste + rewards.taste),
    }));

    setWorldAttributes((prev) => {
      const nextXP = prev.xp + totalXP;
      const nextLevel = getLevelForXP(nextXP);

      return {
        ...prev,
        xp: nextXP,
        journey_level: nextLevel,
        city_memory: prev.city_memory.includes('珠江桥边') ? prev.city_memory : [...prev.city_memory, '珠江桥边'],
        cuisine_archive: prev.cuisine_archive.includes('口味虾') ? prev.cuisine_archive : [...prev.cuisine_archive, '口味虾'],
        landmark_discovery: prev.landmark_discovery.includes('江边散步点')
          ? prev.landmark_discovery
          : [...prev.landmark_discovery, '江边散步点'],
        vibe_collection: prev.vibe_collection.includes('夜晚江风')
          ? prev.vibe_collection
          : [...prev.vibe_collection, '夜晚江风'],
      };
    });

    setRouteHistory((prev) => [
      {
        date: new Date().toISOString().slice(0, 10),
        route_title: currentQuest.route_title,
        cuisine: ['口味虾'],
        landmarks: ['珠江桥边'],
        vibes: currentQuest.vibe_tags,
        xp: totalXP,
      },
      ...prev,
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        coreAttributes,
        worldAttributes,
        currentQuest,
        routeHistory,
        questPreferences,
        questTemplates,
        selectedQuest,
        setCoreAttributes,
        setWorldAttributes,
        setCurrentQuest,
        setRouteHistory,
        setQuestPreferences,
        selectQuest,
        mockCurrentQuest,
        completeQuest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}

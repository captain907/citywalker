import {
  CoreAttributes,
  WorldAttributes,
  CurrentQuest,
  RouteHistoryItem,
  QuestCardData,
  QuestPreferences,
} from '@/types';

export const MOCK_CORE_ATTRIBUTES: CoreAttributes = {
  vitality: 62,
  exploration: 38,
  joy: 54,
  taste: 41,
};

export const MOCK_WORLD_ATTRIBUTES: WorldAttributes = {
  city_memory: ['校园南区', '珠江桥边', '太平老街'],
  cuisine_archive: ['口味虾', '糖水铺'],
  landmark_discovery: ['江边散步点', '老街牌坊'],
  vibe_collection: ['夜晚江风', '热闹食摊'],
  journey_level: 2,
  xp: 180,
};

export const MOCK_CURRENT_QUEST: CurrentQuest = {
  quest_type: '小龙虾探索',
  route_title: '太平老街 · 古韵寻味之旅',
  budget: '60 - 100 元',
  duration: '3.5 小时',
  intensity: '轻松',
  people: '2 - 4 人',
  vibe_tags: ['夜晚江风', '热闹食摊', '老城灯火'],
  timeline: [
    '18:30 从太平老街出发',
    '19:00 路过牌坊与小巷',
    '19:30 在龙虾灯笼店停留',
    '20:30 走向故居转角与茶馆',
    '21:30 以湘江风光带收尾',
  ],
  expected_rewards: {
    vitality: 12,
    exploration: 18,
    joy: 15,
    taste: 16,
    xp: 42,
  },
};

export const MOCK_ROUTE_HISTORY: RouteHistoryItem[] = [
  {
    date: '2026-05-23',
    route_title: '太平老街 · 古韵寻味之旅',
    cuisine: ['口味虾'],
    landmarks: ['湘江桥边'],
    vibes: ['夜晚江风', '灯火街巷'],
    xp: 42,
  },
];

export const MOCK_QUEST_CARDS: QuestCardData[] = [
  {
    id: 'after-meal-1km',
    title: '饭后一公里',
    description: '吃完只是序章，真正的城市记忆常常从饭后那一小段路开始。',
    type: '饭后路线',
    questType: '桥边散步',
    xp: 20,
    icon: 'person-walking',
    recommended: '适合想消食、拍风景、顺手收集夜风的人。',
    difficulty: 'easy',
    possibleDiscoveries: ['桥边灯火', '街角糖水', '晚风摊位'],
  },
  {
    id: 'route-blind-box',
    title: '路线盲盒',
    description: '不知道今晚要去哪里，就让探索协会替你翻开一页未知地图。',
    type: '惊喜路线',
    questType: '随机委托',
    xp: 30,
    icon: 'box-open',
    recommended: '适合临时起意、想被城市带着走的人。',
    difficulty: 'medium',
    possibleDiscoveries: ['隐藏巷口', '偶遇小馆', '陌生桥头'],
  },
  {
    id: 'crayfish-explore',
    title: '小龙虾探索',
    description: '夏夜的热闹从一盆虾开始，再沿着江风和灯火把整晚串成一页。',
    type: '美食探索',
    questType: '风味夜游',
    xp: 35,
    icon: 'utensils',
    recommended: '适合想吃得满足，也想顺路把夜色收进图鉴的人。',
    difficulty: 'medium',
    possibleDiscoveries: ['口味虾', '青石街灯', '江边凉风'],
  },
  {
    id: 'weekend-half-day',
    title: '周末半日游',
    description: '把半天时间折成一张卷轴，留给老街、河岸和带故事的小店。',
    type: '微旅行',
    questType: '城市漫游',
    xp: 40,
    icon: 'map',
    recommended: '适合有充裕时间，想把一座街区慢慢看完的人。',
    difficulty: 'hard',
    possibleDiscoveries: ['街区桥影', '旧建筑细节', '手写招牌'],
  },
];

export const MOCK_QUEST_PREFERENCES: QuestPreferences = {
  departure: '',
  budget: '',
  time: '',
  mood: '',
  foodPreference: '',
  vibe: '',
};

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 450 },
  { level: 5, xp: 700 },
  { level: 6, xp: 1000 },
  { level: 7, xp: 1400 },
];

export const LEVEL_NAMES = {
  1: '新手饭旅者',
  2: '校园觅食者',
  3: '街区漫游者',
  4: '城市饭旅玩家',
  5: '隐藏路线猎人',
  6: '风味收藏家',
  7: '城市冒险策展人',
};

export const DEPARTURE_OPTIONS = ['校园南区', '大学城', '珠江新城', '东山口', '太平老街'];
export const BUDGET_OPTIONS = ['30 以下', '30 - 60', '60 - 100', '100 以上'];
export const TIME_OPTIONS = ['1 小时', '2 小时', '半日', '一日'];
export const MOOD_OPTIONS = ['想回血', '想热闹一点', '想拍照', '想省钱', '想散步', '想要惊喜'];
export const FOOD_PREFERENCE_OPTIONS = ['小龙虾', '糖水', '夜宵', '咖啡', '烧烤', '随便但要开心'];
export const VIBE_OPTIONS = ['夜晚江风', '黄昏散步', '热闹食摊', '安静放松', '雨天老街', '低预算快乐'];

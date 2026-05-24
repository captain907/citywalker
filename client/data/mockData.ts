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
  city_memory: ['广州塔', '海心桥', '东山口骑楼'],
  cuisine_archive: ['艇仔粥', '双皮奶'],
  landmark_discovery: ['花城广场', '广州塔机位'],
  vibe_collection: ['珠江晚风', '塔下灯影'],
  journey_level: 2,
  xp: 180,
};

export const MOCK_CURRENT_QUEST: CurrentQuest = {
  quest_type: '广州夜游寻味',
  route_title: '广州塔 · 珠江夜风寻味之旅',
  budget: '60 - 100 元',
  duration: '3.5 小时',
  intensity: '轻松',
  people: '2 - 4 人',
  vibe_tags: ['珠江晚风', '塔下灯影', '江岸夜色'],
  timeline: [
    '18:30 从广州塔地铁站出发',
    '19:00 沿海心桥望向珠江新城天际线',
    '19:30 在猎德附近停留寻味',
    '20:30 穿过花城广场与江边步道',
    '21:30 以广州塔夜景收尾',
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
    route_title: '广州塔 · 珠江夜风寻味之旅',
    cuisine: ['艇仔粥'],
    landmarks: ['海心桥'],
    vibes: ['珠江晚风', '灯火江岸'],
    xp: 42,
  },
];

export const MOCK_QUEST_CARDS: QuestCardData[] = [
  {
    id: 'after-meal-1km',
    title: '饭后一公里',
    description: '吃完只是序章，真正的城市记忆常常从饭后那一小段路开始。',
    type: '饭后路线',
    questType: '塔下散步',
    xp: 20,
    icon: 'person-walking',
    recommended: '适合想消食、拍风景、顺手收集夜风的人。',
    difficulty: 'easy',
    possibleDiscoveries: ['塔下灯火', '江边糖水', '晚风摊位'],
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
    possibleDiscoveries: ['隐藏街角', '偶遇小馆', '陌生江岸'],
  },
  {
    id: 'crayfish-explore',
    title: '广州夜味探索',
    description: '夏夜的热闹从一口热腾腾的粤味开始，再沿着江风和灯火把整晚串成一页。',
    type: '美食探索',
    questType: '珠江夜游',
    xp: 35,
    icon: 'utensils',
    recommended: '适合想吃得满足，也想顺路把夜色收进图鉴的人。',
    difficulty: 'medium',
    possibleDiscoveries: ['艇仔粥', '塔下夜灯', '珠江晚风'],
  },
  {
    id: 'weekend-half-day',
    title: '周末半日游',
    description: '把半天时间折成一张卷轴，留给江岸、骑楼和带故事的小店。',
    type: '微旅行',
    questType: '城市漫游',
    xp: 40,
    icon: 'map',
    recommended: '适合有充裕时间，想把一座街区慢慢看完的人。',
    difficulty: 'hard',
    possibleDiscoveries: ['花城桥影', '骑楼细节', '老店招牌'],
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

export const DEPARTURE_OPTIONS = ['广州塔', '海心沙', '珠江新城', '猎德', '客村'];
export const BUDGET_OPTIONS = ['30 以下', '30 - 60', '60 - 100', '100 以上'];
export const TIME_OPTIONS = ['1 小时', '2 小时', '半日', '一日'];
export const MOOD_OPTIONS = ['想回血', '想热闹一点', '想拍照', '想省钱', '想散步', '想要惊喜'];
export const FOOD_PREFERENCE_OPTIONS = ['艇仔粥', '糖水', '夜宵', '咖啡', '烧味', '随便但要开心'];
export const VIBE_OPTIONS = ['珠江晚风', '黄昏散步', '热闹食摊', '安静放松', '骑楼雨天', '低预算快乐'];

import { archiveAssets } from '@/assets/archiveAssets';
import { atlasAssets } from '@/assets/atlasAssets';
import { ArchivePhotoEntry, CollectionKind } from '@/types';

export type CollectionConfig = {
  title: string;
  subtitle: string;
  hero: number;
  badge: any;
  items: ArchivePhotoEntry[];
  theme: string;
  departure: string;
  preferences: string[];
  emptyTitle?: string;
  uploadLabel?: string;
};

const cityItems: ArchivePhotoEntry[] = [
  {
    id: 'city-01',
    title: '塔影入页',
    subtitle: '珠江桥边',
    note: '把晴空、江面和天际线压进一张城市页脚，适合被收进记忆册的第一页。',
    image: archiveAssets.cityPhotos[0],
  },
  {
    id: 'city-02',
    title: '骑楼一瞬',
    subtitle: '老城街口',
    note: '真正值得收入图鉴的，往往是人群散开以后，街口刚好安静下来的那一秒。',
    image: archiveAssets.cityPhotos[1],
  },
  {
    id: 'city-03',
    title: '花城留白',
    subtitle: '城市中轴',
    note: '高楼之间的光线，让记忆页看起来更有呼吸，也让城市的尺度变得温柔。',
    image: archiveAssets.cityPhotos[2],
  },
  {
    id: 'city-04',
    title: '桥风页边',
    subtitle: '江岸漫步',
    note: '风从桥下穿过来，替这一页补上一句很轻的移动注脚。',
    image: archiveAssets.cityPhotos[3],
  },
  {
    id: 'city-05',
    title: '旧巷回声',
    subtitle: '街区深处',
    note: '城市把故事交给你的方式，常常不是宏大场景，而是一条巷子的回声。',
    image: archiveAssets.cityPhotos[4],
  },
];

const foodItems: ArchivePhotoEntry[] = [
  {
    id: 'food-01',
    title: '烧鹅金亮',
    subtitle: '招牌风味',
    note: '油亮的表皮与暖光，是风味页里最直白的一次邀请，照片本身就很有食欲。',
    image: archiveAssets.foodPhotos[0],
  },
  {
    id: 'food-02',
    title: '热气蒸笼',
    subtitle: '早茶时刻',
    note: '一笼蒸汽升起的时候，城市的早晨就有了可以被收藏的温度。',
    image: archiveAssets.foodPhotos[1],
  },
  {
    id: 'food-03',
    title: '糖水收尾',
    subtitle: '甜口记忆',
    note: '甜味不喧闹，却总能把一整段旅途安静地落在柔软处。',
    image: archiveAssets.foodPhotos[2],
  },
  {
    id: 'food-04',
    title: '面汤余温',
    subtitle: '街头晚食',
    note: '真正的美食图鉴，不只是味道本身，也包括它端上桌时留住人的那一点热气。',
    image: archiveAssets.foodPhotos[3],
  },
  {
    id: 'food-05',
    title: '筷影落盏',
    subtitle: '巷口小馆',
    note: '食物端上桌的瞬间，就是最适合被写入风味册的一次定格。',
    image: archiveAssets.foodPhotos[4],
  },
];

export const collectionConfig: Record<CollectionKind, CollectionConfig> = {
  'city-memory': {
    title: '城市记忆',
    subtitle: '把街区、桥影与天光收进图鉴页边，留下一本可以慢慢翻看的城市纪念。',
    hero: archiveAssets.cityMemoryCover,
    badge: atlasAssets.archiveBook,
    items: cityItems,
    theme: '老城记忆',
    departure: '广州塔',
    preferences: ['拍照打卡', '文艺空间'],
    uploadLabel: '生成城市手账卡',
  },
  'food-archive': {
    title: '美食图鉴',
    subtitle: '把风味、热气与餐桌瞬间整理入馆，像给这座城写下一本味觉索引。',
    hero: archiveAssets.foodArchiveCover,
    badge: atlasAssets.stoneLampBadge,
    items: foodItems,
    theme: '美食寻味',
    departure: '广州塔',
    preferences: ['小吃寻味', '本地风味'],
    uploadLabel: '生成美食手账卡',
  },
  'landmark-discovery': {
    title: '地点发现',
    subtitle: '把新地标、旧街口与走过的坐标继续收入馆中，让城市足迹有迹可循。',
    hero: archiveAssets.landmarkDiscoveryCover,
    badge: atlasAssets.discoveryBadge,
    items: [],
    theme: '文化漫游',
    departure: '花城广场',
    preferences: ['文艺空间', '拍照打卡'],
    emptyTitle: '地点发现馆正在整理中',
  },
  'vibe-collection': {
    title: '氛围收藏',
    subtitle: '把夜色、灯火与街巷空气存成可翻阅的样本，为路线留下情绪坐标。',
    hero: archiveAssets.vibeCollectionCover,
    badge: atlasAssets.homeAtlas,
    items: [],
    theme: '夜色烟火',
    departure: '珠江新城',
    preferences: ['夜景漫步', '拍照打卡'],
    emptyTitle: '氛围收藏馆正在整理中',
  },
};

export const uploadEnabledKinds: CollectionKind[] = ['city-memory', 'food-archive'];

export function supportsUpload(kind: CollectionKind) {
  return uploadEnabledKinds.includes(kind);
}

export function getCollectionKind(kind: unknown): CollectionKind {
  return typeof kind === 'string' && kind in collectionConfig
    ? (kind as CollectionKind)
    : 'city-memory';
}

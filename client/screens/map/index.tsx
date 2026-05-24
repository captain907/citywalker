import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { atlasAssets } from '@/assets/atlasAssets';
import {
  AtlasAssetBadge,
  AtlasBackground,
  AtlasDivider,
  AtlasMapIllustration,
  AtlasPanel,
  AtlasProgressBar,
  AtlasWoodButton,
  atlasColors,
} from '@/components/AtlasUI';
import { useSafeRouter } from '@/hooks/useSafeRouter';

const districts = [
  { name: '校园南区', status: '已点亮', xp: 120, tone: atlasColors.moss, theme: '文化漫游' },
  { name: '珠江桥边', status: '已点亮', xp: 85, tone: atlasColors.bronze, theme: '夜色烟火' },
  { name: '东山口', status: '探索中', xp: 45, tone: atlasColors.mutedBlueDeep, theme: '老城记忆' },
  { name: '大学城', status: '待解锁', xp: 0, tone: '#C8B89D', theme: '美食寻味' },
] as const;

export default function MapScreen() {
  const router = useSafeRouter();

  const openDistrictQuest = (district: (typeof districts)[number]) => {
    router.push('/quest-generate', {
      departure: district.name,
      theme: district.theme,
      sourceLabel: `${district.name} 区域委托`,
      preferences: district.theme === '夜色烟火' ? ['夜景漫步', '拍照打卡'] : ['本地风味', '拍照打卡'],
    });
  };

  return (
    <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <AtlasBackground>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 14 }}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <AtlasAssetBadge source={atlasAssets.blueCompass} size={56} />
              <Text style={{ color: atlasColors.ink, fontSize: 30, fontFamily: 'serif', fontWeight: '700' }}>
                城市地图
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 14 }}>浮雕城市地图总览</Text>
            </View>

            <AtlasDivider title="DISTRICT ATLAS" />

            <AtlasPanel>
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>区域解锁进度</Text>
                  <Text style={{ color: atlasColors.bronze, fontSize: 13, fontWeight: '700' }}>6 / 12</Text>
                </View>
                <AtlasProgressBar value={6} max={12} tone="bronze" height={12} />
              </View>
            </AtlasPanel>

            <Pressable onPress={() => openDistrictQuest(districts[0])}>
              <AtlasMapIllustration
                source={atlasAssets.profileCityMap}
                framed={false}
                aspectRatio={4 / 3}
                style={{ marginTop: -2, marginBottom: -2 }}
              />
            </Pressable>

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', fontWeight: '700' }}>
                区域探索进度
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 13, marginTop: 4 }}>
                轻点任一区域，直接翻开对应的探索委托书。
              </Text>

              <View style={{ gap: 12, marginTop: 14 }}>
                {districts.map((district) => (
                  <Pressable key={district.name} onPress={() => openDistrictQuest(district)}>
                    {({ pressed }) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottomWidth: 1,
                          borderBottomColor: '#E4D7BF',
                          paddingBottom: 12,
                          opacity: pressed ? 0.88 : 1,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <AtlasAssetBadge source={atlasAssets.blueCompass} size={40} />
                          <View>
                            <Text
                              style={{ color: atlasColors.ink, fontSize: 18, fontFamily: 'serif', fontWeight: '700' }}
                            >
                              {district.name}
                            </Text>
                            <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>{district.status}</Text>
                          </View>
                        </View>
                        <Text style={{ color: district.tone, fontSize: 18, fontFamily: 'serif' }}>
                          {district.xp ? `${district.xp} XP` : '--'}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </AtlasPanel>

            <AtlasWoodButton
              label="按区域生成委托"
              icon="compass"
              onPress={() => openDistrictQuest(districts[1])}
            />
          </View>
        </ScrollView>
      </AtlasBackground>
    </Screen>
  );
}

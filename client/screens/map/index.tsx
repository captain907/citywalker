import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { atlasAssets } from '@/assets/atlasAssets';
import {
  AtlasAssetBadge,
  AtlasBackground,
  AtlasDivider,
  AtlasMapIllustration,
  AtlasPanel,
  AtlasProgressBar,
  atlasColors,
} from '@/components/AtlasUI';

const districts = [
  { name: '校园南区', status: '已点亮', xp: 120, tone: atlasColors.moss },
  { name: '珠江桥边', status: '已点亮', xp: 85, tone: atlasColors.bronze },
  { name: '东山口', status: '探索中', xp: 45, tone: atlasColors.mutedBlueDeep },
  { name: '大学城', status: '待解锁', xp: 0, tone: '#C8B89D' },
];

export default function MapScreen() {
  return (
    <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <AtlasBackground>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 18 }}>
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

            <AtlasMapIllustration source={atlasAssets.profileCityMap} framed={false} aspectRatio={4 / 3} />

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', fontWeight: '700' }}>
                区域探索进度
              </Text>
              <View style={{ gap: 12, marginTop: 14 }}>
                {districts.map((district) => (
                  <View
                    key={district.name}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: 1,
                      borderBottomColor: '#E4D7BF',
                      paddingBottom: 12,
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
                ))}
              </View>
            </AtlasPanel>
          </View>
        </ScrollView>
      </AtlasBackground>
    </Screen>
  );
}

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Screen } from '@/components/Screen';
import { atlasAssets } from '@/assets/atlasAssets';
import {
  AtlasAssetBadge,
  AtlasBackground,
  AtlasCollectionCard,
  AtlasDivider,
  AtlasMapIllustration,
  AtlasPanel,
  AtlasProgressBar,
  atlasColors,
} from '@/components/AtlasUI';
import { useAppContext } from '@/contexts/AppContext';

export default function ProfileScreen() {
  const { worldAttributes, routeHistory } = useAppContext();

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
              <AtlasAssetBadge source={atlasAssets.travelerBadge} size={56} />
              <Text style={{ color: atlasColors.ink, fontSize: 30, fontFamily: 'serif', fontWeight: '700' }}>
                旅者档案 / 城市图鉴
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 14 }}>你的探索足迹与收藏馆</Text>
            </View>

            <AtlasPanel>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={styles.avatarFrame}>
                  <Image source={atlasAssets.profileAvatar} contentFit="cover" style={StyleSheet.absoluteFill} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: atlasColors.ink, fontSize: 28, fontFamily: 'serif', fontWeight: '700' }}>
                    旅人小满
                  </Text>
                  <Text style={{ color: atlasColors.subInk, fontSize: 15, marginTop: 4 }}>
                    城市记忆的收集者
                  </Text>
                  <Text style={{ color: atlasColors.bronzeDeep, fontSize: 17, fontFamily: 'serif', marginTop: 10 }}>
                    Lv.{worldAttributes.journey_level} 探索学者
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 18, gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>XP 档案条</Text>
                  <Text style={{ color: atlasColors.bronze, fontSize: 13, fontWeight: '700' }}>
                    {worldAttributes.xp} / 1200
                  </Text>
                </View>
                <AtlasProgressBar value={worldAttributes.xp} max={1200} tone="bronze" height={12} />
              </View>

              <AtlasDivider style={{ marginVertical: 16 }} />

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 }}>
                <StatCell label="路线完成" value={`${routeHistory.length} 条`} />
                <StatCell label="探索天数" value="56 天" />
                <StatCell label="打卡地点" value="132 处" />
                <StatCell label="收藏成就" value="18 枚" />
              </View>
            </AtlasPanel>

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 28, fontFamily: 'serif', fontWeight: '700' }}>
                我的城市图鉴
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 13, marginTop: 4 }}>
                四组收藏卡会随着路线完成，不断长出新的页面。
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
                <AtlasCollectionCard
                  title="城市记忆"
                  progress={`${worldAttributes.city_memory.length} / 60`}
                  status="城市场景"
                  variant="memory"
                  imageSource={atlasAssets.cityMemory}
                  style={{ width: '47%' }}
                />
                <AtlasCollectionCard
                  title="美食图鉴"
                  progress={`${worldAttributes.cuisine_archive.length} / 120`}
                  status="风味藏页"
                  variant="food"
                  imageSource={atlasAssets.foodArchive}
                  style={{ width: '47%' }}
                />
                <AtlasCollectionCard
                  title="地点发现"
                  progress={`${worldAttributes.landmark_discovery.length} / 180`}
                  status="打卡地标"
                  variant="landmark"
                  imageSource={atlasAssets.landmarkDiscovery}
                  style={{ width: '47%' }}
                />
                <AtlasCollectionCard
                  title="氛围收藏"
                  progress={`${worldAttributes.vibe_collection.length} / 90`}
                  status="夜色与街巷"
                  variant="vibe"
                  imageSource={atlasAssets.vibeCollection}
                  style={{ width: '47%' }}
                />
              </View>
            </AtlasPanel>

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', fontWeight: '700' }}>
                城市地图总览
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 13, marginTop: 4 }}>
                已解锁 6 / 12 区域，下一段旅程将向河岸以东展开。
              </Text>
              <AtlasMapIllustration source={atlasAssets.profileCityMap} height={190} style={{ marginTop: 14 }} />
            </AtlasPanel>

            <AtlasPanel>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <AtlasAssetBadge source={atlasAssets.discoveryBadge} size={28} />
                <Text style={{ color: atlasColors.ink, fontSize: 18, fontFamily: 'serif' }}>
                  每一座城市，都是一本打开的书；
                </Text>
              </View>
              <Text
                style={{
                  color: atlasColors.ink,
                  fontSize: 18,
                  fontFamily: 'serif',
                  textAlign: 'center',
                  marginTop: 8,
                }}
              >
                每一次旅途，都是一枚新的记忆。
              </Text>
            </AtlasPanel>
          </View>
        </ScrollView>
      </AtlasBackground>
    </Screen>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: '50%', paddingRight: 12 }}>
      <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: atlasColors.ink, fontSize: 26, fontFamily: 'serif', marginTop: 6 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarFrame: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F8F2E6',
    borderWidth: 2,
    borderColor: '#CDB188',
    overflow: 'hidden',
  },
});

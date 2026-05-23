import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { atlasAssets } from '@/assets/atlasAssets';
import {
  AtlasAssetBadge,
  AtlasBackground,
  AtlasCollectionCard,
  AtlasDivider,
  AtlasMapIllustration,
  AtlasPanel,
  atlasColors,
} from '@/components/AtlasUI';
import { useAppContext } from '@/contexts/AppContext';

export default function ArchiveScreen() {
  const { worldAttributes } = useAppContext();

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
              <AtlasAssetBadge source={atlasAssets.archiveBook} size={56} />
              <Text style={{ color: atlasColors.ink, fontSize: 30, fontFamily: 'serif', fontWeight: '700' }}>
                城市图鉴馆
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 14 }}>探索城市，收藏记忆</Text>
            </View>

            <AtlasDivider title="URBAN ARCHIVE" />

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', fontWeight: '700' }}>
                收藏总览
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 14, marginTop: 14 }}>
                <SummaryCell label="美食图鉴" value={String(worldAttributes.cuisine_archive.length)} />
                <SummaryCell label="地点发现" value={String(worldAttributes.landmark_discovery.length)} />
                <SummaryCell label="氛围收藏" value={String(worldAttributes.vibe_collection.length)} />
                <SummaryCell label="城市记忆" value={String(worldAttributes.city_memory.length)} />
              </View>
            </AtlasPanel>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <AtlasCollectionCard
                title="城市记忆"
                progress={`${worldAttributes.city_memory.length} / 60`}
                status="街区与桥"
                variant="memory"
                imageSource={atlasAssets.cityMemory}
                style={{ width: '47%' }}
              />
              <AtlasCollectionCard
                title="美食图鉴"
                progress={`${worldAttributes.cuisine_archive.length} / 120`}
                status="风味入库"
                variant="food"
                imageSource={atlasAssets.foodArchive}
                style={{ width: '47%' }}
              />
              <AtlasCollectionCard
                title="地点发现"
                progress={`${worldAttributes.landmark_discovery.length} / 180`}
                status="地点拓印"
                variant="landmark"
                imageSource={atlasAssets.landmarkDiscovery}
                style={{ width: '47%' }}
              />
              <AtlasCollectionCard
                title="氛围收藏"
                progress={`${worldAttributes.vibe_collection.length} / 90`}
                status="街巷夜色"
                variant="vibe"
                imageSource={atlasAssets.vibeCollection}
                style={{ width: '47%' }}
              />
            </View>

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 22, fontFamily: 'serif', fontWeight: '700' }}>
                地图索引
              </Text>
              <AtlasMapIllustration source={atlasAssets.profileCityMap} height={180} style={{ marginTop: 14 }} />
            </AtlasPanel>
          </View>
        </ScrollView>
      </AtlasBackground>
    </Screen>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: '50%', paddingRight: 12 }}>
      <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: atlasColors.ink, fontSize: 28, fontFamily: 'serif', marginTop: 6 }}>{value}</Text>
    </View>
  );
}

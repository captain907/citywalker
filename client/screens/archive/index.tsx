import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { collectionConfig } from '@/data/archiveCollections';
import { useSafeRouter } from '@/hooks/useSafeRouter';

const copy = {
  title: '\u57ce\u5e02\u56fe\u9274\u9986',
  subtitle: '\u63a2\u7d22\u57ce\u5e02\uff0c\u6536\u85cf\u8bb0\u5fc6',
  summaryTitle: '\u6536\u85cf\u603b\u89c8',
  summaryCaption: '\u56fe\u9274\u6536\u7eb3\u72b6\u6001\u4e0e\u57ce\u5e02\u8bb0\u5fc6\u767b\u8bb0',
  food: '\u7f8e\u98df\u56fe\u9274',
  landmark: '\u5730\u70b9\u53d1\u73b0',
  vibe: '\u6c1b\u56f4\u6536\u85cf',
  memory: '\u57ce\u5e02\u8bb0\u5fc6',
  memoryStatus: '\u8857\u533a\u4e0e\u6865',
  foodStatus: '\u98ce\u5473\u5165\u5e93',
  landmarkStatus: '\u5730\u70b9\u62d3\u5370',
  vibeStatus: '\u8857\u5df7\u591c\u8272',
  mapTitle: '\u5730\u56fe\u7d22\u5f15',
  unit: '\u9879',
};

export default function ArchiveScreen() {
  const router = useSafeRouter();
  const { worldAttributes } = useAppContext();
  const cityLibraryCount = collectionConfig['city-memory'].items.length;
  const foodLibraryCount = collectionConfig['food-archive'].items.length;

  const openCollection = (kind: 'city-memory' | 'food-archive' | 'landmark-discovery' | 'vibe-collection') => {
    router.push('/archive-collection', { kind });
  };

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
              <Text style={styles.pageTitle}>{copy.title}</Text>
              <Text style={styles.pageSubtitle}>{copy.subtitle}</Text>
            </View>

            <AtlasDivider title="URBAN ARCHIVE" />

            <AtlasPanel hideHighlight>
              <Text style={styles.summaryTitle}>{copy.summaryTitle}</Text>
              <Text style={styles.summaryCaption}>{copy.summaryCaption}</Text>
              <AtlasDivider
                title="COLLECTION REGISTER"
                style={styles.summaryDivider}
                labelStyle={styles.summaryDividerLabel}
              />
              <View style={styles.summaryGrid}>
                <SummaryCell label={copy.food} value={String(foodLibraryCount)} />
                <SummaryCell label={copy.landmark} value={String(worldAttributes.landmark_discovery.length)} />
                <SummaryCell label={copy.vibe} value={String(worldAttributes.vibe_collection.length)} />
                <SummaryCell label={copy.memory} value={String(cityLibraryCount)} />
              </View>
            </AtlasPanel>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                columnGap: 3,
                rowGap: 12,
              }}
            >
              <AtlasCollectionCard
                title={copy.memory}
                progress={`${cityLibraryCount} / 60`}
                status={copy.memoryStatus}
                variant="memory"
                imageSource={atlasAssets.cityMemory}
                style={{ width: '49.2%' }}
                onPress={() => openCollection('city-memory')}
              />
              <AtlasCollectionCard
                title={copy.food}
                progress={`${foodLibraryCount} / 120`}
                status={copy.foodStatus}
                variant="food"
                imageSource={atlasAssets.foodArchive}
                style={{ width: '49.2%' }}
                onPress={() => openCollection('food-archive')}
              />
              <AtlasCollectionCard
                title={copy.landmark}
                progress={`${worldAttributes.landmark_discovery.length} / 180`}
                status={copy.landmarkStatus}
                variant="landmark"
                imageSource={atlasAssets.landmarkDiscovery}
                style={{ width: '49.2%' }}
                onPress={() => openCollection('landmark-discovery')}
              />
              <AtlasCollectionCard
                title={copy.vibe}
                progress={`${worldAttributes.vibe_collection.length} / 90`}
                status={copy.vibeStatus}
                variant="vibe"
                imageSource={atlasAssets.vibeCollection}
                style={{ width: '49.2%' }}
                onPress={() => openCollection('vibe-collection')}
              />
            </View>

            <AtlasPanel>
              <Text style={styles.mapTitle}>{copy.mapTitle}</Text>
              <Pressable onPress={() => router.push('/map')}>
                <AtlasMapIllustration
                  source={atlasAssets.profileCityMap}
                  framed={false}
                  aspectRatio={4 / 3}
                  style={{ marginTop: 14 }}
                />
              </Pressable>
            </AtlasPanel>
          </View>
        </ScrollView>
      </AtlasBackground>
    </Screen>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryCell}>
      <View pointerEvents="none" style={styles.summaryCellHighlight} />
      <View pointerEvents="none" style={styles.summaryCellFrame} />
      <Text style={styles.summaryLabel}>{label}</Text>
      <View style={styles.summaryValueRow}>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryUnit}>{copy.unit}</Text>
      </View>
      <View style={styles.summaryRule} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: atlasColors.ink,
    fontSize: 30,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  pageSubtitle: {
    color: atlasColors.subInk,
    fontSize: 14,
  },
  summaryTitle: {
    color: atlasColors.ink,
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  summaryCaption: {
    color: atlasColors.subInk,
    fontSize: 13,
    marginTop: 4,
  },
  summaryDivider: {
    marginTop: 10,
    marginBottom: 12,
  },
  summaryDividerLabel: {
    fontSize: 12,
    color: atlasColors.bronzeDeep,
    letterSpacing: 1.2,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  summaryCell: {
    width: '48.6%',
    minHeight: 106,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDCDB1',
    backgroundColor: 'rgba(241, 233, 222, 0.74)',
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  summaryCellHighlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '58%',
    height: '44%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 22,
  },
  summaryCellFrame: {
    position: 'absolute',
    left: 6,
    right: 6,
    top: 6,
    bottom: 6,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(231, 216, 193, 0.9)',
  },
  summaryLabel: {
    color: atlasColors.subInk,
    fontSize: 12,
    lineHeight: 16,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginTop: 10,
  },
  summaryValue: {
    color: atlasColors.ink,
    fontSize: 38,
    lineHeight: 40,
    fontFamily: 'serif',
  },
  summaryUnit: {
    color: atlasColors.bronze,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  summaryRule: {
    marginTop: 10,
    height: 2,
    borderRadius: 999,
    backgroundColor: '#D7C4A5',
    opacity: 0.72,
  },
  mapTitle: {
    color: atlasColors.ink,
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '700',
  },
});

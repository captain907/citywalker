import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Screen } from '@/components/Screen';
import {
  AtlasAssetBadge,
  AtlasBackground,
  AtlasDivider,
  AtlasMedallion,
  AtlasPanel,
  AtlasPill,
  AtlasTag,
  AtlasWoodButton,
  atlasColors,
} from '@/components/AtlasUI';
import { useAppContext } from '@/contexts/AppContext';
import { collectionConfig, getCollectionKind, supportsUpload } from '@/data/archiveCollections';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { ArchivePhotoEntry, CollectionKind } from '@/types';

type CollectionParams = {
  kind?: CollectionKind;
};

type ViewMode = 'scene' | 'journal';

export default function ArchiveCollectionScreen() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<CollectionParams>();
  const { uploadedArchiveItems, journalArchiveItems, addArchiveItem } = useAppContext();
  const [viewMode, setViewMode] = useState<ViewMode>('scene');
  const kind = getCollectionKind(params.kind);
  const config = collectionConfig[kind];
  const allowUpload = supportsUpload(kind);
  const sceneItems = useMemo(
    () => [...uploadedArchiveItems[kind], ...config.items],
    [config.items, kind, uploadedArchiveItems]
  );
  const journalItems = journalArchiveItems[kind];

  const visibleItems = useMemo(() => {
    if (!allowUpload) {
      return config.items;
    }

    return viewMode === 'journal' ? journalItems : sceneItems;
  }, [allowUpload, config.items, journalItems, sceneItems, viewMode]);

  const openQuest = () => {
    router.push('/quest-generate', {
      sourceLabel: `${config.title} 图鉴委托`,
      theme: config.theme,
      departure: config.departure,
      preferences: config.preferences,
    });
  };

  const openDetail = (item: ArchivePhotoEntry) => {
    router.push('/archive-card-detail', {
      kind,
      id: item.id,
      mode: viewMode === 'journal' ? 'journal' : 'detail',
    });
  };

  const savePickedAsset = (asset: ImagePicker.ImagePickerAsset) => {
    const nextCount = uploadedArchiveItems[kind].length + 1;
    const item: ArchivePhotoEntry = {
      id: `upload-${kind}-${Date.now()}`,
      title: kind === 'city-memory' ? `新收城市页 ${nextCount}` : `新收风味页 ${nextCount}`,
      subtitle: kind === 'city-memory' ? '等待生成城市手账卡' : '等待生成美食手账卡',
      note: '这张照片已经加入你的实景卡册。等 Coze 智能体接口接上后，就可以继续把它修饰成手账卡。',
      image: { uri: asset.uri },
      uploaded: true,
    };

    addArchiveItem(kind, item);
    setViewMode('scene');
    router.push('/archive-card-detail', {
      kind,
      id: item.id,
      mode: 'detail',
    });
  };

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('需要相册权限', '允许访问相册后，新的实景照片才能加入这本收藏册。');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets[0]) {
      savePickedAsset(result.assets[0]);
    }
  };

  const capturePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('需要相机权限', '允许访问相机后，你就可以把刚拍到的画面直接收进实景卡册。');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      savePickedAsset(result.assets[0]);
    }
  };

  const startImportFlow = () => {
    if (!allowUpload) {
      return;
    }

    if (Platform.OS === 'web') {
      void pickFromLibrary();
      return;
    }

    Alert.alert('加入新实景卡', '允许访问相机或相册后，就可以把新的照片收进实景卡册。', [
      { text: '拍照上传', onPress: () => void capturePhoto() },
      { text: '本地上传', onPress: () => void pickFromLibrary() },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const dividerTitle = !allowUpload
    ? 'CURATED CARDS'
    : viewMode === 'journal'
      ? 'JOURNAL CARDS'
      : 'SCENE CARDS';

  const helperCopy = !allowUpload
    ? visibleItems.length
      ? `当前已整理 ${visibleItems.length} 张入馆卡片，每一张都可以继续展开为单独的图鉴详情页。`
      : config.emptyTitle
    : viewMode === 'journal'
      ? '这里会收纳已经生成好的手账卡。后面接上 Coze 智能体后，新生成的手账卡也会自动归档到这一栏。'
      : '这里放的是原始实景卡。你可以继续上传照片，再从详情页把它们生成到右侧的手账卡册里。';

  return (
    <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <AtlasBackground>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 132 }}
        >
          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Pressable onPress={() => router.back()}>
                <AtlasMedallion icon="arrow-left" size={42} tone="paper" />
              </Pressable>
              <View style={styles.headerCenter}>
                <AtlasAssetBadge source={config.badge} size={42} />
                <Text style={styles.pageTitle}>{config.title}</Text>
                <Text style={styles.pageSubtitle}>{config.subtitle}</Text>
              </View>
              <Pressable onPress={() => router.push('/archive')}>
                <AtlasMedallion icon="book-atlas" size={42} tone="paper" />
              </Pressable>
            </View>

            <AtlasDivider title="ATLAS COLLECTION" />

            <View style={styles.heroWrap}>
              <Image source={config.hero} contentFit="contain" style={StyleSheet.absoluteFill} />
            </View>

            <AtlasPanel hideHighlight>
              {allowUpload ? (
                <View style={styles.segmentWrap}>
                  <AtlasTag
                    label="实景卡"
                    selected={viewMode === 'scene'}
                    onPress={() => setViewMode('scene')}
                    style={styles.segmentTag}
                  />
                  <AtlasTag
                    label="手账卡"
                    selected={viewMode === 'journal'}
                    onPress={() => setViewMode('journal')}
                    style={styles.segmentTag}
                  />
                </View>
              ) : null}

              <AtlasDivider title={dividerTitle} style={styles.cardDivider} labelStyle={styles.dividerLabel} />

              <Text style={styles.collectionCopy}>{helperCopy}</Text>

              {visibleItems.length || (allowUpload && viewMode === 'scene') ? (
                <View style={styles.grid}>
                  {visibleItems.map((item) => (
                    <Pressable key={item.id} onPress={() => openDetail(item)} style={styles.photoCard}>
                      <View pointerEvents="none" style={styles.photoCardInner} />
                      <View style={styles.photoWrap}>
                        <Image source={item.image} contentFit="cover" style={StyleSheet.absoluteFill} />
                      </View>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                      <Text style={styles.cardNote} numberOfLines={3}>
                        {item.note}
                      </Text>
                    </Pressable>
                  ))}

                  {allowUpload && viewMode === 'scene' ? (
                    <Pressable onPress={startImportFlow} style={[styles.photoCard, styles.plusCard]}>
                      <View pointerEvents="none" style={styles.photoCardInner} />
                      <View style={styles.plusInner}>
                        <Text style={styles.plusSymbol}>+</Text>
                        <Text style={styles.plusTitle}>加入新实景卡</Text>
                        <Text style={styles.plusCopy}>
                          允许访问相机或相册后，把新的城市或风味照片直接收进实景卡册。
                        </Text>
                      </View>
                    </Pressable>
                  ) : null}
                </View>
              ) : (
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyTitle}>
                    {allowUpload ? '手账卡册还是空的' : config.emptyTitle}
                  </Text>
                  <Text style={styles.emptyCopy}>
                    {allowUpload
                      ? '先在左侧实景卡里挑一张照片，进入详情页后点击生成按钮，它就会自动存进这里。'
                      : '这一馆的图像卡还在整理中，等下一轮素材和标签补齐后就会接进来。'}
                  </Text>
                </View>
              )}
            </AtlasPanel>

            <AtlasPanel>
              <Text style={styles.panelTitle}>本页标签</Text>
              <View style={styles.pillRow}>
                {config.preferences.map((item) => (
                  <AtlasPill key={item} label={item} />
                ))}
              </View>
            </AtlasPanel>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AtlasWoodButton label={`从${config.title}继续探索`} icon="compass" onPress={openQuest} />
        </View>
      </AtlasBackground>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  pageTitle: {
    color: atlasColors.ink,
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '700',
    marginTop: 10,
  },
  pageSubtitle: {
    color: atlasColors.subInk,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 19,
  },
  heroWrap: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 280,
    alignSelf: 'center',
    position: 'relative',
  },
  segmentWrap: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  segmentTag: {
    minWidth: 118,
    justifyContent: 'center',
  },
  cardDivider: {
    marginTop: 14,
  },
  dividerLabel: {
    color: atlasColors.bronzeDeep,
    fontSize: 12,
    letterSpacing: 1.1,
  },
  collectionCopy: {
    color: atlasColors.subInk,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginTop: 14,
  },
  photoCard: {
    width: '48.8%',
    borderRadius: 18,
    borderWidth: 1.4,
    borderColor: '#B99B70',
    backgroundColor: 'rgba(240, 231, 219, 0.76)',
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  photoCardInner: {
    position: 'absolute',
    left: 6,
    right: 6,
    top: 6,
    bottom: 6,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#D5BE98',
  },
  photoWrap: {
    width: '100%',
    aspectRatio: 0.84,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: atlasColors.paper,
  },
  cardTitle: {
    color: atlasColors.ink,
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '700',
    marginTop: 10,
  },
  cardSubtitle: {
    color: atlasColors.bronzeDeep,
    fontSize: 12,
    marginTop: 4,
  },
  cardNote: {
    color: atlasColors.subInk,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    minHeight: 54,
  },
  plusCard: {
    justifyContent: 'center',
  },
  plusInner: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  plusSymbol: {
    color: atlasColors.bronzeDeep,
    fontSize: 54,
    lineHeight: 54,
    fontWeight: '300',
  },
  plusTitle: {
    color: atlasColors.ink,
    fontSize: 19,
    fontFamily: 'serif',
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  plusCopy: {
    color: atlasColors.subInk,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  panelTitle: {
    color: atlasColors.ink,
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  emptyWrap: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8C4A4',
    backgroundColor: 'rgba(241, 233, 222, 0.58)',
    padding: 18,
    marginTop: 14,
  },
  emptyTitle: {
    color: atlasColors.ink,
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyCopy: {
    color: atlasColors.subInk,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
});

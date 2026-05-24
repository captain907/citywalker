import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image as ReactNativeImage,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Screen } from '@/components/Screen';
import {
  AtlasAssetBadge,
  AtlasBackground,
  AtlasDivider,
  AtlasMedallion,
  AtlasPanel,
  AtlasTag,
  AtlasWoodButton,
  atlasColors,
} from '@/components/AtlasUI';
import { useAppContext } from '@/contexts/AppContext';
import { collectionConfig, getCollectionKind } from '@/data/archiveCollections';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { ArchivePhotoEntry, CollectionKind } from '@/types';
import { buildApiUrl, createFormDataFile } from '@/utils';

type DetailParams = {
  kind?: CollectionKind;
  id?: string;
  mode?: 'detail' | 'journal';
};

type DetailMode = 'detail' | 'journal';
const DEMO_JOURNAL_USER_ID = '00000000-0000-4000-8000-000000000001';

function resolveImageUri(source: ArchivePhotoEntry['image']) {
  const resolvedSource =
    typeof source === 'number' ? ReactNativeImage.resolveAssetSource(source) : source;

  if (Array.isArray(resolvedSource)) {
    return resolvedSource[0]?.uri;
  }

  return resolvedSource?.uri;
}

export default function ArchiveCardDetailScreen() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<DetailParams>();
  const {
    uploadedArchiveItems,
    journalArchiveItems,
    archiveNotes,
    setArchiveNote,
    addArchiveJournalItem,
  } = useAppContext();
  const kind = getCollectionKind(params.kind);
  const config = collectionConfig[kind];
  const [mode, setMode] = useState<DetailMode>(params.mode === 'journal' ? 'journal' : 'detail');
  const [isGeneratingJournal, setIsGeneratingJournal] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const item = useMemo<ArchivePhotoEntry | undefined>(() => {
    const items = [...journalArchiveItems[kind], ...uploadedArchiveItems[kind], ...config.items];
    return items.find((entry) => entry.id === params.id) ?? items[0];
  }, [config.items, journalArchiveItems, kind, params.id, uploadedArchiveItems]);

  const journalItem = useMemo<ArchivePhotoEntry | undefined>(() => {
    if (!item) {
      return undefined;
    }

    const journalId = item.id.startsWith('journal-') ? item.id : `journal-${kind}-${item.id}`;
    return journalArchiveItems[kind].find((entry) => entry.id === journalId);
  }, [item, journalArchiveItems, kind]);

  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  if (!item) {
    return (
      <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
        <AtlasBackground>
          <View style={styles.centerWrap}>
            <AtlasPanel>
              <Text style={styles.emptyTitle}>这张收藏卡还没有准备好</Text>
              <Text style={styles.emptyCopy}>我们先回到图鉴馆，把这一页重新翻开。</Text>
              <AtlasWoodButton
                label="返回图鉴馆"
                icon="book-atlas"
                onPress={() => router.push('/archive')}
                style={{ marginTop: 16 }}
              />
            </AtlasPanel>
          </View>
        </AtlasBackground>
      </Screen>
    );
  }

  const noteKey = `${kind}:${item.id}`;
  const savedNote = archiveNotes[noteKey];
  const currentDisplayItem = mode === 'journal' && journalItem ? journalItem : item;
  const fallbackNote = mode === 'journal' && journalItem ? journalItem.note : item.note;
  const displayNote = savedNote ?? fallbackNote;
  const noteDraft = noteDrafts[noteKey] ?? displayNote;

  const generateLabel =
    kind === 'city-memory'
      ? '生成城市手账卡'
      : kind === 'food-archive'
        ? '生成美食手账卡'
        : '生成图鉴手账卡';
  const showJournalPlaceholder = mode === 'journal' && !journalItem;

  const createJournalCard = async () => {
    if (journalItem) {
      setMode('journal');
      return;
    }

    const sourceUri = resolveImageUri(item.image);

    if (!sourceUri) {
      Alert.alert('暂时无法生成', '这张图片现在还没有可上传的地址，我再帮你补一下。');
      return;
    }

    const normalizedFileName = (() => {
      const maybeName = sourceUri.split('/').pop()?.split('?')[0];

      if (maybeName && /\.[a-z0-9]+$/i.test(maybeName)) {
        return maybeName;
      }

      return `${kind}-${item.id}.jpg`;
    })();
    const extension = normalizedFileName.split('.').pop()?.toLowerCase();
    const mimeType =
      extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';

    setMode('journal');
    setIsGeneratingJournal(true);

    try {
      const formData = new FormData();
      const uploadFile = await createFormDataFile(sourceUri, normalizedFileName, mimeType);

      formData.append('image', uploadFile as never);
      formData.append('kind', kind);
      formData.append('title', item.title);
      formData.append('subtitle', item.subtitle);
      formData.append('note', savedNote ?? item.note);
      formData.append('userId', DEMO_JOURNAL_USER_ID);

      const response = await fetch(buildApiUrl('/api/v1/journal-card/generate'), {
        method: 'POST',
        body: formData,
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.generatedImageUrl) {
        const message =
          data?.error?.message ??
          data?.message ??
          '这次没有顺利生成手账卡，我先把原图留在这里，稍后我们可以再试一次。';
        throw new Error(message);
      }

      const nextJournalItem: ArchivePhotoEntry = {
        id: `journal-${kind}-${item.id}`,
        title: data.title ?? item.title,
        subtitle: data.subtitle ?? item.subtitle,
        note: data.note ?? item.note,
        image: { uri: data.generatedImageUrl },
        uploaded: true,
        journalEntryId: data.journalEntryId ?? undefined,
        generatedImageUrl: data.generatedImageUrl,
        originalImageUrl: data.originalImageUrl ?? sourceUri,
        downloadUrl: data.downloadUrl ?? data.generatedImageUrl,
        tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : undefined,
      };

      addArchiveJournalItem(kind, nextJournalItem);
      setMode('journal');
    } catch (error) {
      setMode('detail');
      Alert.alert(
        '生成暂时没接上',
        error instanceof Error ? error.message : '接口响应有点异常，我们可以再试一次。'
      );
    } finally {
      setIsGeneratingJournal(false);
    }
  };

  const saveTravelNote = () => {
    const nextNote = noteDraft.trim() || item.note;
    setArchiveNote(kind, item.id, nextNote);
    setNoteDrafts((prev) => ({
      ...prev,
      [noteKey]: nextNote,
    }));
    setIsNotesOpen(false);
  };

  const downloadAsset = async () => {
    try {
      const uri =
        currentDisplayItem.downloadUrl ||
        currentDisplayItem.generatedImageUrl ||
        (typeof currentDisplayItem.image === 'number'
          ? ReactNativeImage.resolveAssetSource(currentDisplayItem.image).uri
          : resolveImageUri(currentDisplayItem.image));

      if (!uri) {
        throw new Error('missing uri');
      }

      await Linking.openURL(uri);
    } catch (error) {
      Alert.alert('暂时无法打开', '这张图片现在还没法直接下载，我后面可以继续帮你补导出链路。');
    }
  };

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
                <Text style={styles.pageSubtitle}>
                  翻看这一页，再决定要不要把它继续装帧成手账卡。
                </Text>
              </View>
              <Pressable onPress={() => router.push('/archive')}>
                <AtlasMedallion icon="book-atlas" size={42} tone="paper" />
              </Pressable>
            </View>

            <AtlasDivider title="COLLECTION DETAIL" />

            <AtlasPanel hideHighlight>
              <View style={styles.segmentWrap}>
                <AtlasTag
                  label="图鉴详情"
                  selected={mode === 'detail'}
                  onPress={() => setMode('detail')}
                  style={styles.segmentTag}
                />
                <AtlasTag
                  label="手账卡"
                  selected={mode === 'journal'}
                  onPress={() => setMode('journal')}
                  style={styles.segmentTag}
                />
              </View>

              <View style={styles.heroCard}>
                <View pointerEvents="none" style={styles.heroFrame} />
                <View style={styles.heroImageWrap}>
                  {showJournalPlaceholder ? (
                    <View style={styles.generatingWrap}>
                      <Text style={styles.generatingTitle}>
                        {isGeneratingJournal ? '手账卡生成中...' : '手账卡待生成'}
                      </Text>
                      <Text style={styles.generatingCopy}>
                        {isGeneratingJournal
                          ? '正在把这张照片整理成带装帧感的图鉴手账卡'
                          : '智能体接口接入后，这里会直接显示生成完成的手账卡成品'}
                      </Text>
                    </View>
                  ) : (
                    <Image source={currentDisplayItem.image} contentFit="cover" style={StyleSheet.absoluteFill} />
                  )}
                </View>
                <Text style={styles.itemTitle}>{currentDisplayItem.title}</Text>
                <Text style={styles.itemSubtitle}>{currentDisplayItem.subtitle}</Text>
                <Text style={styles.itemNote}>{displayNote}</Text>
              </View>

              {isNotesOpen ? (
                <View style={styles.notesPanel}>
                  <Text style={styles.notesTitle}>旅途随笔</Text>
                  <Text style={styles.notesCopy}>在这一页旁边留下自己的注记，像给城市图鉴补一段边栏手记。</Text>
                  <View style={styles.notesFieldWrap}>
                    <TextInput
                      value={noteDraft}
                      onChangeText={(text) =>
                        setNoteDrafts((prev) => ({
                          ...prev,
                          [noteKey]: text,
                        }))
                      }
                      multiline
                      textAlignVertical="top"
                      placeholder="写下这一张照片的天气、心情、声音或你想记住的瞬间。"
                      placeholderTextColor={atlasColors.subInk}
                      style={styles.notesField}
                    />
                  </View>
                  <View style={styles.notesActions}>
                    <AtlasWoodButton
                      label="收起随笔"
                      icon="pen"
                      onPress={() => {
                        setNoteDrafts((prev) => ({
                          ...prev,
                          [noteKey]: displayNote,
                        }));
                        setIsNotesOpen(false);
                      }}
                      style={styles.notesButton}
                    />
                    <AtlasWoodButton
                      label="保存随笔"
                      icon="pen"
                      onPress={saveTravelNote}
                      style={styles.notesButton}
                    />
                  </View>
                </View>
              ) : null}
            </AtlasPanel>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AtlasWoodButton
            label={isGeneratingJournal ? '生成中...' : generateLabel}
            icon="wand-magic-sparkles"
            onPress={createJournalCard}
            style={styles.primaryButton}
          />
          <View style={styles.secondaryRow}>
            <AtlasWoodButton
              label="旅途随笔"
              icon="pen"
              onPress={() => setIsNotesOpen((prev) => !prev)}
              style={styles.secondaryButton}
            />
            <AtlasWoodButton
              label="下载本地"
              icon="download"
              onPress={() => void downloadAsset()}
              style={styles.secondaryButton}
            />
          </View>
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
  segmentWrap: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  segmentTag: {
    minWidth: 118,
    justifyContent: 'center',
  },
  heroCard: {
    marginTop: 14,
    borderRadius: 22,
    borderWidth: 1.4,
    borderColor: '#B99B70',
    backgroundColor: 'rgba(240, 231, 219, 0.72)',
    overflow: 'hidden',
    padding: 12,
  },
  heroFrame: {
    position: 'absolute',
    left: 7,
    right: 7,
    top: 7,
    bottom: 7,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#D5BE98',
  },
  heroImageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: atlasColors.paper,
  },
  itemTitle: {
    color: atlasColors.ink,
    fontSize: 26,
    fontFamily: 'serif',
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  itemSubtitle: {
    color: atlasColors.bronzeDeep,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  itemNote: {
    color: atlasColors.subInk,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  generatingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(236, 227, 214, 0.9)',
  },
  generatingTitle: {
    color: atlasColors.ink,
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'center',
  },
  generatingCopy: {
    color: atlasColors.subInk,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  notesPanel: {
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D7C3A4',
    backgroundColor: 'rgba(240, 232, 220, 0.68)',
    padding: 16,
  },
  notesTitle: {
    color: atlasColors.ink,
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'center',
  },
  notesCopy: {
    color: atlasColors.subInk,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },
  notesFieldWrap: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D5BE98',
    backgroundColor: 'rgba(248, 241, 231, 0.82)',
    padding: 10,
  },
  notesField: {
    minHeight: 120,
    color: atlasColors.ink,
    fontSize: 14,
    lineHeight: 22,
  },
  notesActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  notesButton: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    gap: 10,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: atlasColors.ink,
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyCopy: {
    color: atlasColors.subInk,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
});

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { atlasAssets } from '@/assets/atlasAssets';
import {
  AtlasAssetBadge,
  AtlasBackground,
  AtlasDivider,
  AtlasMapIllustration,
  AtlasPanel,
  AtlasPill,
  AtlasProgressBar,
  AtlasWoodButton,
  atlasColors,
} from '@/components/AtlasUI';
import { Screen } from '@/components/Screen';
import { useAppContext } from '@/contexts/AppContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { buildApiUrl } from '@/utils';

const INITIAL_PROMPT = '今晚的桥边会有晚风吗？';
const INITIAL_REPLY = '旅伴已经摊开地图。你问一句，我就陪你把这座城写成今晚的冒险。';
const LOADING_REPLY = '旅伴正在翻看地图和风向，等我替你问一问这座城。';
const ERROR_REPLY = '这次没有连上旅伴，我先把纸页压稳。稍后再试一次，我们继续。';
const DIALOG_FRAME_RATIO = 2048 / 683;
const DIALOG_FRAME_DISPLAY_RATIO = DIALOG_FRAME_RATIO * (4 / 3);
const PAGE_VISIBLE_MS = 1500;
const PAGE_FADE_IN_MS = 1200;
const PAGE_FADE_OUT_MS = 140;
const CHARS_PER_PAGE = 24;
const PAGE_RISE_OFFSET = 12;

type AgentReplyPayload = {
  reply: string;
  shouldGenerateCommission?: boolean;
  scenario?: string | null;
  askAccept?: boolean;
};

type PendingCommission = {
  scenario: string;
  title: string;
  subtitle: string;
};

const statusRows = [
  {
    key: 'vitality',
    name: '生命力',
    value: 68,
    text: '步履轻快',
    note: '今天很适合沿着河岸和老街走一段，把晚风和灯火都收进这一页。',
    tone: 'red' as const,
    icon: atlasAssets.vitality,
  },
  {
    key: 'exploration',
    name: '探索度',
    value: 52,
    text: '想去新角落',
    note: '桥边、巷口和有故事的小店，更容易触发今天的惊喜线索。',
    tone: 'blue' as const,
    icon: atlasAssets.exploration,
  },
  {
    key: 'joy',
    name: '快乐值',
    value: 58,
    text: '夜风加成',
    note: '和朋友同行的路线会比独自漫游，多出一层热闹与记忆的回声。',
    tone: 'gold' as const,
    icon: atlasAssets.joy,
  },
  {
    key: 'taste',
    name: '风味体验',
    value: 44,
    text: '口腹待启',
    note: '适合找一摊有记忆点的小吃，让今天的城市冒险真正落下味道。',
    tone: 'moss' as const,
    icon: atlasAssets.taste,
  },
];

function truncatePrompt(input: string) {
  const trimmed = input.trim();
  if (trimmed.length <= 10) {
    return trimmed;
  }

  return `${trimmed.slice(0, 10)}...`;
}

function paginateReply(input: string) {
  const normalized = input.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return [INITIAL_REPLY];
  }

  const pages: string[] = [];
  let remaining = normalized;

  while (remaining.length > CHARS_PER_PAGE) {
    let slice = remaining.slice(0, CHARS_PER_PAGE);
    let next = remaining.slice(CHARS_PER_PAGE);

    if (next.length > 0) {
      const lastBreak = Math.max(
        slice.lastIndexOf('，'),
        slice.lastIndexOf('。'),
        slice.lastIndexOf('！'),
        slice.lastIndexOf('？'),
        slice.lastIndexOf('；'),
        slice.lastIndexOf('、'),
        slice.lastIndexOf(','),
        slice.lastIndexOf('.'),
        slice.lastIndexOf(' '),
      );

      if (lastBreak >= Math.floor(CHARS_PER_PAGE * 0.55)) {
        next = `${slice.slice(lastBreak + 1)}${next}`.trimStart();
        slice = slice.slice(0, lastBreak + 1);
      }
    }

    pages.push(slice.trim());
    remaining = next.trimStart();
  }

  if (remaining.length > 0) {
    pages.push(remaining);
  }

  return pages;
}

async function requestAgentReply(prompt: string, sessionId: string) {
  const response = await fetch(buildApiUrl('/api/v1/chat'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      sessionId,
      context: {
        surface: 'home-dialogue',
      },
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!data?.reply || typeof data.reply !== 'string') {
    throw new Error('智能体暂时没有返回可显示的回复');
  }

  return data as AgentReplyPayload;
}

function prettifyScenario(scenario: string) {
  return scenario
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function requestCommissionGeneration(scenario: string) {
  const response = await fetch(buildApiUrl('/api/v1/chat/commission/generate'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scenario,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!data?.quest) {
    throw new Error('委托已接受，但暂时没有生成可用路线。');
  }

  return data.quest;
}

export default function HomeScreen() {
  const router = useSafeRouter();
  const { setCurrentQuest, worldAttributes } = useAppContext();
  const promptBubbleTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const replyPageTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sessionIdRef = useRef('home-dialogue-session');
  const [replyOpacity] = useState(() => new Animated.Value(0));
  const [replyTranslateY] = useState(() => new Animated.Value(PAGE_RISE_OFFSET));
  const [dialogInput, setDialogInput] = useState('');
  const [lastPrompt, setLastPrompt] = useState(INITIAL_PROMPT);
  const [fullReply, setFullReply] = useState(INITIAL_REPLY);
  const [typedPrompt, setTypedPrompt] = useState(truncatePrompt(INITIAL_PROMPT));
  const [promptBubbleStage, setPromptBubbleStage] = useState<'hidden' | 'dot' | 'bubble'>('hidden');
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingCommission, setIsGeneratingCommission] = useState(false);
  const [dialogHint, setDialogHint] = useState('已连接首页旅伴对话');
  const [activeReplyPage, setActiveReplyPage] = useState(INITIAL_REPLY);
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [pendingCommission, setPendingCommission] = useState<PendingCommission | null>(null);

  useEffect(() => {
    const nextPrompt = truncatePrompt(lastPrompt);
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      setTypedPrompt(nextPrompt.slice(0, index));

      if (index >= nextPrompt.length) {
        clearInterval(timer);
      }
    }, 52);

    return () => clearInterval(timer);
  }, [lastPrompt]);

  useEffect(() => {
    const pages = paginateReply(fullReply);

    replyPageTimersRef.current.forEach(clearTimeout);
    replyPageTimersRef.current = [];
    replyOpacity.stopAnimation();
    replyTranslateY.stopAnimation();

    const showPage = (pageIndex: number) => {
      const nextPage = pages[pageIndex] ?? '';
      setActiveReplyPage(nextPage);
      setIsReplyVisible(true);
      replyOpacity.setValue(0);
      replyTranslateY.setValue(PAGE_RISE_OFFSET);

      const fadeInTimer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(replyOpacity, {
            toValue: 1,
            duration: PAGE_FADE_IN_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(replyTranslateY, {
            toValue: 0,
            duration: PAGE_FADE_IN_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, 40);

      const holdTimer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(replyOpacity, {
            toValue: 0,
            duration: PAGE_FADE_OUT_MS,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(replyTranslateY, {
            toValue: PAGE_RISE_OFFSET,
            duration: PAGE_FADE_OUT_MS,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start(({ finished }) => {
          if (!finished) {
            return;
          }

          if (pageIndex < pages.length - 1) {
            showPage(pageIndex + 1);
            return;
          }

          setIsReplyVisible(false);
        });
      }, PAGE_FADE_IN_MS + PAGE_VISIBLE_MS);

      replyPageTimersRef.current.push(fadeInTimer, holdTimer);
    };

    const startTimer = setTimeout(() => {
      showPage(0);
    }, 60);

    replyPageTimersRef.current.push(startTimer);

    return () => {
      replyPageTimersRef.current.forEach(clearTimeout);
      replyPageTimersRef.current = [];
      replyOpacity.stopAnimation();
      replyTranslateY.stopAnimation();
    };
  }, [fullReply, replyOpacity, replyTranslateY]);

  useEffect(() => {
    return () => {
      promptBubbleTimersRef.current.forEach(clearTimeout);
      replyPageTimersRef.current.forEach(clearTimeout);
      replyOpacity.stopAnimation();
      replyTranslateY.stopAnimation();
    };
  }, [replyOpacity, replyTranslateY]);

  const clearPromptBubbleTimers = () => {
    promptBubbleTimersRef.current.forEach(clearTimeout);
    promptBubbleTimersRef.current = [];
  };

  const sendDialogue = async () => {
    const nextPrompt = dialogInput.trim();
    if (!nextPrompt || isSending) {
      return;
    }

    clearPromptBubbleTimers();
    setTypedPrompt('');
    setLastPrompt(nextPrompt);
    setDialogInput('');
    setPromptBubbleStage('dot');
    setDialogHint('旅伴正在连线智能体...');
    setFullReply(LOADING_REPLY);
    setPendingCommission(null);
    setIsSending(true);

    const showBubbleTimer = setTimeout(() => {
      setPromptBubbleStage('bubble');
    }, 220);

    const hideBubbleTimer = setTimeout(() => {
      setPromptBubbleStage('hidden');
    }, 3000);

    promptBubbleTimersRef.current = [showBubbleTimer, hideBubbleTimer];

    try {
      const result = await requestAgentReply(nextPrompt, sessionIdRef.current);
      setFullReply(result.reply);
      if (result.shouldGenerateCommission && result.askAccept && result.scenario) {
        setPendingCommission({
          scenario: result.scenario,
          title: '发现新的探索委托',
          subtitle: `${prettifyScenario(result.scenario)} 已就绪，要现在展开吗？`,
        });
        setDialogHint('旅伴已经替你翻到一张新委托。');
      } else {
        setDialogHint('已通过本地代理连上 Coze');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '连接智能体时发生未知错误';
      setFullReply(ERROR_REPLY);
      setDialogHint(message);
    } finally {
      setIsSending(false);
    }
  };

  const acceptCommission = async () => {
    if (!pendingCommission || isGeneratingCommission) {
      return;
    }

    setIsGeneratingCommission(true);
    setDialogHint('正在把委托卷轴展开成路线...');

    try {
      const quest = await requestCommissionGeneration(pendingCommission.scenario);
      setCurrentQuest(quest);
      setPendingCommission(null);
      setDialogHint('委托已展开，准备出发。');
      router.push('/route-detail');
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成委托路线时发生未知错误';
      setDialogHint(message);
    } finally {
      setIsGeneratingCommission(false);
    }
  };

  return (
    <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <AtlasBackground>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Pressable onPress={() => router.push('/map')}>
                <AtlasAssetBadge source={atlasAssets.compassRose} size={50} />
              </Pressable>
              <View style={styles.headerCenter}>
                <Text style={styles.coverTitle}>饭旅冒险家</Text>
                <Text style={styles.coverSubBrand}>CityQuest</Text>
                <AtlasDivider title="ATLAS COVER" style={{ width: '100%', marginTop: 10 }} />
                <Text style={styles.coverSubtitle}>城市美食与记忆的探索之旅</Text>
              </View>
              <Pressable onPress={() => router.push('/quests')}>
                <AtlasAssetBadge source={atlasAssets.bell} size={46} />
              </Pressable>
            </View>

            <Pressable onPress={() => router.push('/profile')}>
              <AtlasPanel>
                <View style={styles.levelHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.levelCaption}>旅者等级卡片</Text>
                    <Text style={styles.levelTitle}>Lv.{worldAttributes.journey_level} 探索学者</Text>
                    <Text style={styles.levelNote}>探索协会第 12 号旅者档案</Text>
                  </View>
                  <AtlasAssetBadge source={atlasAssets.homeAtlas} size={56} />
                </View>
                <View style={styles.levelProgressWrap}>
                  <View style={styles.levelProgressRow}>
                    <Text style={styles.levelProgressLabel}>XP 刻度</Text>
                    <Text style={styles.levelProgressValue}>{worldAttributes.xp} / 450</Text>
                  </View>
                  <AtlasProgressBar value={worldAttributes.xp} max={450} tone="bronze" height={12} />
                  <Text style={styles.levelFooter}>星章记录着你距离下一页成长档案，还差 270 XP。</Text>
                </View>
              </AtlasPanel>
            </Pressable>

            <View style={styles.mapWrap}>
              <AtlasMapIllustration source={atlasAssets.homeMap} height={272} />
              {isReplyVisible ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.replyFrameWrap,
                    {
                      opacity: 1,
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.replyFrameAnimatedLayer,
                      {
                        opacity: replyOpacity,
                        transform: [{ translateY: replyTranslateY }],
                      },
                    ]}
                  >
                    <Image source={atlasAssets.dialogFrame} contentFit="contain" style={styles.replyFrameImage} />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.replyFrameTextWrap,
                      {
                        opacity: replyOpacity,
                        transform: [{ translateY: replyTranslateY }],
                      },
                    ]}
                  >
                    <Text style={styles.replyFrameText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
                      {activeReplyPage}
                    </Text>
                  </Animated.View>
                </View>
              ) : null}
              {promptBubbleStage !== 'hidden' ? <View pointerEvents="none" style={styles.promptBubbleDot} /> : null}
              {promptBubbleStage === 'bubble' ? (
                <View pointerEvents="none" style={styles.promptBubble}>
                  <Text style={styles.promptBubbleText} numberOfLines={1} ellipsizeMode="tail">
                    {typedPrompt}
                  </Text>
                </View>
              ) : null}
            </View>

            <AtlasPanel hideHighlight style={styles.dialogPanel}>
              <View pointerEvents="none" style={styles.dialogInnerFrame} />
              <View style={styles.dialogHeader}>
                <Text style={styles.dialogTitle}>旅途对话</Text>
                <Text style={[styles.dialogHint, isSending && styles.dialogHintPending]}>{dialogHint}</Text>
              </View>
              <View style={styles.dialogRow}>
                <TextInput
                  value={dialogInput}
                  onChangeText={setDialogInput}
                  placeholder="比如：桥那边的灯火像什么？"
                  placeholderTextColor={atlasColors.subInk}
                  style={styles.dialogInput}
                  returnKeyType="send"
                  editable={!isSending}
                  onSubmitEditing={() => {
                    void sendDialogue();
                  }}
                />
                <AtlasWoodButton
                  icon="paper-plane"
                  onPress={() => {
                    void sendDialogue();
                  }}
                  style={styles.dialogButton}
                />
              </View>
            </AtlasPanel>

            {pendingCommission ? (
              <AtlasPanel style={styles.acceptPanel}>
                <Text style={styles.acceptTitle}>{pendingCommission.title}</Text>
                <Text style={styles.acceptSubtitle}>{pendingCommission.subtitle}</Text>
                <View style={styles.acceptActions}>
                  <Pressable
                    onPress={() => {
                      if (isGeneratingCommission) {
                        return;
                      }
                      setPendingCommission(null);
                      setDialogHint('先把这张委托夹回册页，等你想出发时再翻开。');
                    }}
                    style={({ pressed }) => [styles.deferButton, pressed && styles.deferButtonPressed]}
                  >
                    <Text style={styles.deferButtonText}>稍后再说</Text>
                  </Pressable>
                  <AtlasWoodButton
                    label={isGeneratingCommission ? '展开中...' : '接受委托'}
                    icon="stamp"
                    onPress={() => {
                      void acceptCommission();
                    }}
                    style={styles.acceptButton}
                  />
                </View>
              </AtlasPanel>
            ) : null}

            <AtlasPanel>
              <Text style={styles.sectionTitle}>今日状态</Text>
              <Text style={styles.sectionNote}>旅者档案中的四项即时记录</Text>
              <View style={styles.statusList}>
                {statusRows.map((item) => (
                  <View key={item.key}>
                    <View style={styles.statusRow}>
                      <AtlasAssetBadge source={item.icon} size={42} scale={0.98} style={styles.statusIconWrap} />
                      <View style={{ flex: 1, gap: 3 }}>
                        <View style={styles.statusHead}>
                          <View>
                            <Text style={styles.statusName}>{item.name}</Text>
                            <Text style={styles.statusText}>{item.text}</Text>
                          </View>
                          <Text style={styles.statusValue}>{item.value}</Text>
                        </View>
                        <Text style={styles.statusDescription}>{item.note}</Text>
                        <AtlasProgressBar value={item.value} tone={item.tone} height={10} style={{ marginTop: 4 }} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </AtlasPanel>

            <Pressable onPress={() => router.push('/quests')}>
              <AtlasPanel variant="ticket">
                <View style={styles.questHeader}>
                  <View style={styles.questHeaderMain}>
                    <AtlasAssetBadge source={atlasAssets.stoneLampBadge} size={44} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.questCaption}>探索委托单</Text>
                      <Text style={styles.questTitle}>珠江夜风寻味</Text>
                      <Text style={styles.questCopy}>
                        今晚的任务会从广州塔附近起笔，沿着江岸、桥影和街区灯火，收集一页属于广州的晚风与风味记忆。
                      </Text>
                    </View>
                  </View>
                  <AtlasPill label="+120 XP" />
                </View>

                <View style={styles.questTags}>
                  <AtlasPill label="广州塔" />
                  <AtlasPill label="海心桥" />
                  <AtlasPill label="夜色烟火" />
                  <AtlasPill label="3 处打卡" />
                </View>

                <AtlasDivider style={{ marginVertical: 16 }} />

                <View style={styles.questFooterRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.questFooterTitle}>委托说明</Text>
                    <Text style={styles.questFooterCopy}>
                      建议按“先塔下漫步、再寻味、最后沿江停留”的节奏展开，适合把今晚写成一张完整的广州票据。
                    </Text>
                  </View>
                  <AtlasAssetBadge source={atlasAssets.discoveryBadge} size={42} />
                </View>
              </AtlasPanel>
            </Pressable>

            <AtlasWoodButton label="翻开委托簿" icon="book-atlas" onPress={() => router.push('/quests')} />
          </View>
        </ScrollView>
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
  coverTitle: {
    color: atlasColors.ink,
    fontSize: 34,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'center',
  },
  coverSubBrand: {
    color: atlasColors.bronzeDeep,
    fontSize: 18,
    fontFamily: 'serif',
    marginTop: 2,
  },
  coverSubtitle: {
    marginTop: 10,
    color: atlasColors.subInk,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  levelCaption: {
    color: atlasColors.subInk,
    fontSize: 12,
    marginBottom: 6,
  },
  levelTitle: {
    color: atlasColors.ink,
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  levelNote: {
    color: atlasColors.subInk,
    fontSize: 13,
    marginTop: 4,
  },
  levelProgressWrap: {
    marginTop: 16,
    gap: 8,
  },
  levelProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelProgressLabel: {
    color: atlasColors.subInk,
    fontSize: 12,
  },
  levelProgressValue: {
    color: atlasColors.bronze,
    fontSize: 13,
    fontWeight: '700',
  },
  levelFooter: {
    color: atlasColors.subInk,
    fontSize: 12,
  },
  mapWrap: {
    position: 'relative',
  },
  replyFrameWrap: {
    position: 'absolute',
    top: 4,
    left: '4%',
    width: '92%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyFrameImage: {
    width: '100%',
    aspectRatio: DIALOG_FRAME_DISPLAY_RATIO,
  },
  replyFrameAnimatedLayer: {
    width: '100%',
  },
  replyFrameTextWrap: {
    position: 'absolute',
    top: '21%',
    left: '17%',
    right: '17%',
    bottom: '23%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyFrameText: {
    color: '#5B432D',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  promptBubble: {
    position: 'absolute',
    left: '37.4%',
    bottom: '41.2%',
    maxWidth: 152,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(239, 230, 215, 0.94)',
    borderWidth: 1,
    borderColor: '#DCC7A8',
  },
  promptBubbleDot: {
    position: 'absolute',
    left: '35.6%',
    bottom: '38.9%',
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(239, 230, 215, 0.94)',
    borderWidth: 1,
    borderColor: '#DCC7A8',
  },
  promptBubbleText: {
    color: atlasColors.ink,
    fontSize: 16,
    lineHeight: 20,
  },
  dialogPanel: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dialogInnerFrame: {
    position: 'absolute',
    left: 7,
    right: 7,
    top: 7,
    bottom: 7,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D7C3A4',
  },
  dialogHeader: {
    marginBottom: 8,
    gap: 4,
  },
  dialogTitle: {
    color: atlasColors.ink,
    fontSize: 17,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  dialogHint: {
    color: atlasColors.subInk,
    fontSize: 12,
    lineHeight: 18,
  },
  dialogHintPending: {
    color: atlasColors.bronze,
  },
  dialogRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  dialogInput: {
    flex: 1,
    minHeight: 56,
    maxHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7C3A4',
    backgroundColor: 'rgba(247, 241, 231, 0.78)',
    color: atlasColors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  dialogButton: {
    width: 62,
    minHeight: 56,
    paddingHorizontal: 0,
  },
  acceptPanel: {
    gap: 12,
    paddingVertical: 14,
  },
  acceptTitle: {
    color: atlasColors.ink,
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  acceptSubtitle: {
    color: atlasColors.subInk,
    fontSize: 13,
    lineHeight: 20,
  },
  acceptActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  acceptButton: {
    flex: 1,
  },
  deferButton: {
    minHeight: 56,
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7C3A4',
    backgroundColor: 'rgba(247, 241, 231, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  deferButtonPressed: {
    opacity: 0.84,
  },
  deferButtonText: {
    color: atlasColors.bronzeDeep,
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  sectionTitle: {
    color: atlasColors.ink,
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  sectionNote: {
    color: atlasColors.subInk,
    fontSize: 13,
    marginTop: 3,
  },
  statusList: {
    gap: 14,
    marginTop: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  statusIconWrap: {
    marginTop: 8,
    marginLeft: 2,
    marginRight: 2,
  },
  statusHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  statusName: {
    color: atlasColors.ink,
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  statusText: {
    color: atlasColors.bronze,
    fontSize: 12,
  },
  statusValue: {
    color: atlasColors.ink,
    fontSize: 30,
    fontFamily: 'serif',
  },
  statusDescription: {
    color: atlasColors.subInk,
    fontSize: 12,
    lineHeight: 18,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  questHeaderMain: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  questCaption: {
    color: atlasColors.subInk,
    fontSize: 12,
    marginBottom: 6,
  },
  questTitle: {
    color: atlasColors.ink,
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  questCopy: {
    color: atlasColors.subInk,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  questTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  questFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  questFooterTitle: {
    color: atlasColors.subInk,
    fontSize: 12,
  },
  questFooterCopy: {
    color: atlasColors.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
});

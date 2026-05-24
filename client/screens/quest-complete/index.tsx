import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import {
  AtlasBackground,
  AtlasCollectionCard,
  AtlasDivider,
  AtlasMapIllustration,
  AtlasMedallion,
  AtlasPanel,
  AtlasProgressBar,
  AtlasWoodButton,
  atlasColors,
} from '@/components/AtlasUI';
import { atlasAssets } from '@/assets/atlasAssets';
import { useAppContext } from '@/contexts/AppContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';

export default function QuestCompleteScreen() {
  const router = useSafeRouter();
  const { currentQuest, completeQuest } = useAppContext();
  const [satisfaction, setSatisfaction] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const displayDate = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date()),
    [],
  );

  if (!currentQuest) {
    return (
      <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
        <AtlasBackground>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', textAlign: 'center' }}>
                当前没有可结算的任务证明
              </Text>
            </AtlasPanel>
          </View>
        </AtlasBackground>
      </Screen>
    );
  }

  const submit = () => {
    if (satisfaction === 0) {
      return;
    }
    completeQuest(satisfaction);
    setSubmitted(true);
  };

  return (
    <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <AtlasBackground>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 132 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 18 }}>
            {!submitted ? (
              <>
                <View style={{ alignItems: 'center', gap: 10 }}>
                  <AtlasMedallion icon="flag-checkered" size={52} />
                  <Text style={{ color: atlasColors.ink, fontSize: 30, fontFamily: 'serif', fontWeight: '700' }}>
                    任务完成
                  </Text>
                  <Text style={{ color: atlasColors.subInk, fontSize: 14 }}>请为这次委托盖上满意度印记</Text>
                </View>

                <AtlasMapIllustration source={atlasAssets.questCompletePhoto01} height={248} />

                <AtlasPanel>
                  <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', fontWeight: '700', textAlign: 'center' }}>
                    旅途完成！
                  </Text>
                  <Text style={{ color: atlasColors.subInk, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 8 }}>
                    你在城市记忆里加深了一道印记。现在，请为这页路线卷轴按下最后一枚铜章。
                  </Text>

                  <AtlasDivider style={{ marginVertical: 16 }} />

                  <Text style={{ color: atlasColors.ink, fontSize: 18, fontFamily: 'serif', fontWeight: '700', textAlign: 'center' }}>
                    这次体验如何？
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable key={star} onPress={() => setSatisfaction(star)}>
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: star <= satisfaction ? '#E9D8BC' : '#F7F0E2',
                            borderWidth: 1,
                            borderColor: star <= satisfaction ? '#B88B53' : '#DFD0B8',
                          }}
                        >
                          <FontAwesome6
                            name="star"
                            size={18}
                            color={star <= satisfaction ? atlasColors.bronze : '#C6B59A'}
                            solid={star <= satisfaction}
                          />
                        </View>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={{ color: atlasColors.subInk, fontSize: 13, textAlign: 'center', marginTop: 14 }}>
                    满意度越高，档案页里留下的故事也会越完整。
                  </Text>
                </AtlasPanel>
              </>
            ) : (
              <>
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <AtlasMedallion icon="trophy" size={54} />
                  <Text style={{ color: atlasColors.ink, fontSize: 32, fontFamily: 'serif', fontWeight: '700' }}>
                    任务完成证明
                  </Text>
                  <Text style={{ color: atlasColors.subInk, fontSize: 14 }}>收藏奖励与旅途成长</Text>
                </View>

                <AtlasMapIllustration source={atlasAssets.questCompletePhoto01} height={260} />

                <AtlasPanel>
                  <Text style={{ color: atlasColors.ink, fontSize: 28, fontFamily: 'serif', fontWeight: '700', textAlign: 'center' }}>
                    旅途完成！
                  </Text>
                  <Text style={{ color: atlasColors.subInk, fontSize: 14, textAlign: 'center', marginTop: 8 }}>
                    {displayDate}
                  </Text>

                  <View style={{ alignItems: 'center', marginTop: 18 }}>
                    <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>获得奖励</Text>
                    <Text style={{ color: atlasColors.bronze, fontSize: 44, fontFamily: 'serif', fontWeight: '700', marginTop: 6 }}>
                      +{currentQuest.expected_rewards.xp} XP
                    </Text>
                    <Text style={{ color: atlasColors.subInk, fontSize: 13, marginTop: 6 }}>
                      旅途等级 Lv.2 {'->'} Lv.3
                    </Text>
                  </View>

                  <View style={{ marginTop: 18, gap: 12 }}>
                    <AttributeGain label="生命力" before={68} gain={currentQuest.expected_rewards.vitality} tone="red" />
                    <AttributeGain label="探索度" before={52} gain={currentQuest.expected_rewards.exploration} tone="blue" />
                    <AttributeGain label="快乐值" before={58} gain={currentQuest.expected_rewards.joy} tone="gold" />
                    <AttributeGain label="风味体验" before={44} gain={currentQuest.expected_rewards.taste} tone="moss" />
                  </View>
                </AtlasPanel>

                <AtlasPanel>
                  <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', fontWeight: '700', textAlign: 'center' }}>
                    新获得的收藏
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, marginTop: 16 }}>
                    <AtlasCollectionCard
                      title="地点发现"
                      progress="太平老街"
                      status="新收录"
                      variant="landmark"
                      imageSource={atlasAssets.landmarkDiscovery}
                      style={{ width: '49.2%' }}
                      onPress={() => router.push('/archive')}
                    />
                    <AtlasCollectionCard
                      title="美食图鉴"
                      progress="口味虾"
                      status="已盖章"
                      variant="food"
                      imageSource={atlasAssets.foodArchive}
                      style={{ width: '49.2%' }}
                      onPress={() => router.push('/archive')}
                    />
                    <AtlasCollectionCard
                      title="氛围收藏"
                      progress="青石巷灯"
                      status="已入库"
                      variant="vibe"
                      imageSource={atlasAssets.vibeCollection}
                      style={{ width: '49.2%' }}
                      onPress={() => router.push('/archive')}
                    />
                    <AtlasCollectionCard
                      title="城市记忆"
                      progress="桥边夜风"
                      status="已写入"
                      variant="memory"
                      imageSource={atlasAssets.cityMemory}
                      style={{ width: '49.2%' }}
                      onPress={() => router.push('/archive')}
                    />
                  </View>
                </AtlasPanel>

                <AtlasPanel>
                  <Text style={{ color: atlasColors.ink, fontSize: 18, fontFamily: 'serif', textAlign: 'center', lineHeight: 30 }}>
                    今晚的重点不是走了多远，而是你在一顿热气腾腾的风味和一段刚好的夜风里，把疲惫轻轻交还给了城市。
                  </Text>
                </AtlasPanel>
              </>
            )}
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12 }}>
          {!submitted ? (
            <AtlasWoodButton label="确认完成" icon="stamp" onPress={submit} />
          ) : (
            <View style={{ gap: 12 }}>
              <AtlasWoodButton label="继续探索" icon="compass" onPress={() => router.push('/quests')} />
              <Pressable onPress={() => router.push('/profile')}>
                <AtlasPanel style={{ alignItems: 'center', paddingVertical: 14 }}>
                  <Text style={{ color: atlasColors.bronzeDeep, fontSize: 17, fontFamily: 'serif', fontWeight: '700' }}>
                    查看成长档案
                  </Text>
                </AtlasPanel>
              </Pressable>
            </View>
          )}
        </View>
      </AtlasBackground>
    </Screen>
  );
}

function AttributeGain({
  label,
  before,
  gain,
  tone,
}: {
  label: string;
  before: number;
  gain: number;
  tone: 'red' | 'blue' | 'gold' | 'moss';
}) {
  const after = before + gain;

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: atlasColors.ink, fontSize: 17, fontFamily: 'serif', fontWeight: '700' }}>{label}</Text>
        <Text style={{ color: atlasColors.bronze, fontSize: 17, fontFamily: 'serif' }}>
          +{gain}   {before} {'->'} {after}
        </Text>
      </View>
      <AtlasProgressBar value={after} max={100} tone={tone} height={10} style={{ marginTop: 6 }} />
    </View>
  );
}

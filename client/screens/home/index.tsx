import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
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
import { useAppContext } from '@/contexts/AppContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';

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
    note: '适合找一顿有记忆点的小吃，让今天的城市冒险真正落下味道。',
    tone: 'moss' as const,
    icon: atlasAssets.taste,
  },
];

export default function HomeScreen() {
  const router = useSafeRouter();
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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <AtlasAssetBadge source={atlasAssets.compassRose} size={50} />
              <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 12 }}>
                <Text
                  style={{
                    color: atlasColors.ink,
                    fontSize: 34,
                    fontFamily: 'serif',
                    fontWeight: '700',
                    textAlign: 'center',
                  }}
                >
                  饭旅冒险家
                </Text>
                <Text
                  style={{
                    color: atlasColors.bronzeDeep,
                    fontSize: 18,
                    fontFamily: 'serif',
                    marginTop: 2,
                  }}
                >
                  CityQuest
                </Text>
                <AtlasDivider title="ATLAS COVER" style={{ width: '100%', marginTop: 10 }} />
                <Text
                  style={{
                    marginTop: 10,
                    color: atlasColors.subInk,
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 20,
                  }}
                >
                  城市美食与记忆的探索之旅
                </Text>
              </View>
              <AtlasAssetBadge source={atlasAssets.bell} size={46} />
            </View>

            <AtlasPanel>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: atlasColors.subInk, fontSize: 12, marginBottom: 6 }}>
                    旅者等级铭牌
                  </Text>
                  <Text
                    style={{ color: atlasColors.ink, fontSize: 28, fontFamily: 'serif', fontWeight: '700' }}
                  >
                    Lv.{worldAttributes.journey_level} 探索学者
                  </Text>
                  <Text style={{ color: atlasColors.subInk, fontSize: 13, marginTop: 4 }}>
                    探索协会第 12 号旅者档案
                  </Text>
                </View>
                <AtlasAssetBadge source={atlasAssets.homeAtlas} size={56} />
              </View>
              <View style={{ marginTop: 16, gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>XP 刻度</Text>
                  <Text style={{ color: atlasColors.bronze, fontSize: 13, fontWeight: '700' }}>
                    {worldAttributes.xp} / 450
                  </Text>
                </View>
                <AtlasProgressBar value={worldAttributes.xp} max={450} tone="bronze" height={12} />
                <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>
                  星章记录着你距离下一页成长档案，还差 270 XP。
                </Text>
              </View>
            </AtlasPanel>

            <AtlasMapIllustration source={atlasAssets.homeMap} height={272} />

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 28, fontFamily: 'serif', fontWeight: '700' }}>
                今日状态
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 13, marginTop: 3 }}>
                旅者档案中的四项即时记录
              </Text>
              <View style={{ gap: 14, marginTop: 16 }}>
                {statusRows.map((item) => (
                  <View key={item.key}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                      <AtlasAssetBadge source={item.icon} size={42} scale={0.98} style={styles.statusIconWrap} />
                      <View style={{ flex: 1, gap: 3 }}>
                        <View
                          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}
                        >
                          <View>
                            <Text
                              style={{
                                color: atlasColors.ink,
                                fontSize: 18,
                                fontFamily: 'serif',
                                fontWeight: '700',
                              }}
                            >
                              {item.name}
                            </Text>
                            <Text style={{ color: atlasColors.bronze, fontSize: 12 }}>{item.text}</Text>
                          </View>
                          <Text style={{ color: atlasColors.ink, fontSize: 30, fontFamily: 'serif' }}>
                            {item.value}
                          </Text>
                        </View>
                        <Text style={{ color: atlasColors.subInk, fontSize: 12, lineHeight: 18 }}>
                          {item.note}
                        </Text>
                        <AtlasProgressBar value={item.value} tone={item.tone} height={10} style={{ marginTop: 4 }} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </AtlasPanel>

            <AtlasPanel variant="ticket">
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}
              >
                <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
                  <AtlasAssetBadge source={atlasAssets.stoneLampBadge} size={44} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: atlasColors.subInk, fontSize: 12, marginBottom: 6 }}>探索委托单</Text>
                    <Text
                      style={{ color: atlasColors.ink, fontSize: 22, fontFamily: 'serif', fontWeight: '700' }}
                    >
                      寻味老城烟火
                    </Text>
                    <Text style={{ color: atlasColors.subInk, fontSize: 13, lineHeight: 19, marginTop: 6 }}>
                      今晚的任务是跟着桥与巷前进，收集一页夜风、灯火和一口热气腾腾的城市记忆。
                    </Text>
                  </View>
                </View>
                <AtlasPill label="+120 XP" />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                <AtlasPill label="太平老街" />
                <AtlasPill label="夜色烟火" />
                <AtlasPill label="3 处打卡" />
              </View>

              <AtlasDivider style={{ marginVertical: 16 }} />

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>委托说明</Text>
                  <Text style={{ color: atlasColors.ink, fontSize: 15, lineHeight: 22, marginTop: 4 }}>
                    建议按“先吃、后走、再停留”的节奏展开，适合把今天写成一张完整票据。
                  </Text>
                </View>
                <AtlasAssetBadge source={atlasAssets.discoveryBadge} size={42} />
              </View>
            </AtlasPanel>

            <AtlasWoodButton label="翻开委托簿" icon="book-atlas" onPress={() => router.push('/quests')} />
          </View>
        </ScrollView>
      </AtlasBackground>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusIconWrap: {
    marginTop: 8,
    marginLeft: 2,
    marginRight: 2,
  },
});

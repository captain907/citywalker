import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { atlasAssets } from '@/assets/atlasAssets';
import {
  AtlasAssetBadge,
  AtlasBackground,
  AtlasDivider,
  AtlasMapIllustration,
  AtlasMedallion,
  AtlasPanel,
  AtlasPill,
  AtlasWoodButton,
  atlasColors,
} from '@/components/AtlasUI';
import { useAppContext } from '@/contexts/AppContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';

export default function RouteDetailScreen() {
  const router = useSafeRouter();
  const { currentQuest } = useAppContext();

  const routeStops = useMemo(() => {
    if (!currentQuest) {
      return [];
    }

    return [
      {
        id: 1,
        title: '广州塔南广场',
        description: '从塔下夜色起笔，先收下一张属于今晚的城市封面。',
        xp: '+30 XP',
        icon: atlasAssets.architecture,
      },
      {
        id: 2,
        title: '猎德风味小馆',
        description: '在热气与灯火里找到这条路线的风味主句。',
        xp: '+60 XP',
        icon: atlasAssets.crayfish,
      },
      {
        id: 3,
        title: '海心桥江面视角',
        description: '从桥面风声里抄一行注释，给路线添上一段会呼吸的故事。',
        xp: '+40 XP',
        icon: atlasAssets.oldStreet,
      },
      {
        id: 4,
        title: '花城广场小憩',
        description: '短暂停靠，让队伍补上一口温热，也留出一段看灯的安静。',
        xp: '+30 XP',
        icon: atlasAssets.stoneLampBadge,
      },
      {
        id: 5,
        title: '珠江岸线收尾',
        description: '以河岸和夜风收束，把整页卷轴压成一枚圆润的广州印章。',
        xp: '+40 XP',
        icon: atlasAssets.ferry,
      },
    ];
  }, [currentQuest]);

  if (!currentQuest) {
    return (
      <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
        <AtlasBackground>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', textAlign: 'center' }}>
                还没有可展开的路线卷轴
              </Text>
            </AtlasPanel>
          </View>
        </AtlasBackground>
      </Screen>
    );
  }

  return (
    <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <AtlasBackground>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 132 }}
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable onPress={() => router.back()}>
                <AtlasMedallion icon="arrow-left" size={42} tone="paper" />
              </Pressable>
              <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 12 }}>
                <Text style={{ color: atlasColors.subInk, fontSize: 13 }}>路线详情</Text>
                <Text style={{ color: atlasColors.ink, fontSize: 30, fontFamily: 'serif', fontWeight: '700' }}>
                  路线卷轴
                </Text>
              </View>
              <AtlasAssetBadge source={atlasAssets.routeSeal} size={44} />
            </View>

            <AtlasDivider title="ROUTE SCROLL" />

            <View style={{ gap: 12 }}>
              <AtlasPanel style={{ paddingVertical: 12 }}>
                <Text
                  style={{ color: atlasColors.ink, fontSize: 26, fontFamily: 'serif', fontWeight: '700', textAlign: 'center' }}
                >
                  {currentQuest.route_title}
                </Text>
                <Text style={{ color: atlasColors.subInk, fontSize: 13, textAlign: 'center', marginTop: 4 }}>
                  一段属于你的城市记忆
                </Text>
              </AtlasPanel>

              <AtlasMapIllustration source={atlasAssets.routeMap} height={322} />

              <AtlasPanel>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 10 }}>
                  <Metric icon="route" label="路程" value="4.2 km" />
                  <Metric icon="clock" label="时长" value={currentQuest.duration} />
                  <Metric icon="location-dot" label="打卡" value="5 处" />
                </View>
              </AtlasPanel>
            </View>

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 28, fontFamily: 'serif', fontWeight: '700' }}>
                路线任务清单
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 13, marginTop: 4 }}>
                每个节点都在地图切片上留有一枚编号徽记。
              </Text>

              <View style={{ marginTop: 16, gap: 14 }}>
                {routeStops.map((stop, index) => (
                  <View key={stop.id} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 12 }}>
                    <View style={{ alignItems: 'center' }}>
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: atlasColors.bronze,
                          borderWidth: 2,
                          borderColor: '#F7EAD6',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: '#FFF6E9', fontSize: 13, fontWeight: '700' }}>{stop.id}</Text>
                      </View>
                      {index < routeStops.length - 1 ? (
                        <View
                          style={{
                            width: 1,
                            flex: 1,
                            minHeight: 42,
                            marginTop: 6,
                            backgroundColor: '#D2BF9D',
                          }}
                        />
                      ) : null}
                    </View>

                    <AtlasPanel variant="paper" style={{ flex: 1, padding: 14 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <AtlasAssetBadge source={stop.icon} size={40} />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{ color: atlasColors.ink, fontSize: 18, fontFamily: 'serif', fontWeight: '700' }}
                          >
                            {stop.title}
                          </Text>
                          <Text style={{ color: atlasColors.subInk, fontSize: 12, lineHeight: 18, marginTop: 4 }}>
                            {stop.description}
                          </Text>
                        </View>
                        <AtlasPill label={stop.xp} />
                      </View>
                    </AtlasPanel>
                  </View>
                ))}
              </View>
            </AtlasPanel>

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 20, fontFamily: 'serif', fontWeight: '700' }}>
                卷轴附注
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {currentQuest.vibe_tags.map((tag) => (
                  <AtlasPill key={tag} label={tag} />
                ))}
              </View>
              <Text style={{ color: atlasColors.subInk, fontSize: 13, lineHeight: 20, marginTop: 14 }}>
                预算 {currentQuest.budget}，同行建议 {currentQuest.people}，强度 {currentQuest.intensity}。
                这页路线卷轴偏向有风味、有停顿、有故事的夜间漫游。
              </Text>
            </AtlasPanel>

            <AtlasWoodButton label="开始出发" icon="play" onPress={() => router.push('/quest-complete')} />
          </View>
        </ScrollView>
      </AtlasBackground>
    </Screen>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: '30%' }}>
      <FontAwesome6 name={icon} size={14} color={atlasColors.bronze} />
      <View>
        <Text style={{ color: atlasColors.subInk, fontSize: 11 }}>{label}</Text>
        <Text style={{ color: atlasColors.ink, fontSize: 16, fontFamily: 'serif' }}>{value}</Text>
      </View>
    </View>
  );
}

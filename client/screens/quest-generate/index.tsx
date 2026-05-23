import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { atlasAssets } from '@/assets/atlasAssets';
import {
  AtlasAssetBadge,
  AtlasBackground,
  AtlasDivider,
  AtlasMapIllustration,
  AtlasMedallion,
  AtlasPanel,
  AtlasTag,
  AtlasWoodButton,
  atlasColors,
} from '@/components/AtlasUI';
import { useAppContext } from '@/contexts/AppContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';

const departureOptions = ['太平老街', '大学城', '珠江新城', '东山口', '校园南区'];
const budgetOptions = ['30 以下', '30 - 60', '60 - 100', '100 以上'];
const durationOptions = ['2 小时', '半日', '一日', '两日'];
const themeOptions = ['美食寻味', '文化漫游', '老城记忆', '夜色烟火'];
const preferenceOptions = ['小吃寻觅', '老字号', '本地风味', '拍照打卡', '文艺空间', '夜景漫步'];

export default function QuestGenerateScreen() {
  const router = useSafeRouter();
  const { mockCurrentQuest, selectedQuest, setQuestPreferences } = useAppContext();
  const [departure, setDeparture] = useState('太平老街');
  const [budget, setBudget] = useState('60 - 100');
  const [duration, setDuration] = useState('一日');
  const [theme, setTheme] = useState('美食寻味');
  const [preferences, setPreferences] = useState<string[]>(['小吃寻觅', '拍照打卡']);

  const subtitle = useMemo(() => {
    return selectedQuest ? `当前委托方向：${selectedQuest}` : '定制你的城市探索委托书';
  }, [selectedQuest]);

  const togglePreference = (item: string) => {
    setPreferences((prev) => (prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]));
  };

  const handleGenerate = () => {
    setQuestPreferences({
      departure,
      budget,
      time: duration,
      mood: theme,
      foodPreference: preferences.join(' / '),
      vibe: theme,
    });
    mockCurrentQuest();
    router.push('/route-detail');
  };

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
                <Text style={{ color: atlasColors.ink, fontSize: 30, fontFamily: 'serif', fontWeight: '700' }}>
                  生成旅途路线
                </Text>
                <Text style={{ color: atlasColors.subInk, fontSize: 14, marginTop: 4 }}>{subtitle}</Text>
              </View>
              <AtlasAssetBadge source={atlasAssets.routeSeal} size={44} />
            </View>

            <AtlasDivider title="QUEST BRIEF" />

            <AtlasMapIllustration source={atlasAssets.questMap} height={220} />

            <AtlasPanel>
              <Text style={{ color: atlasColors.subInk, fontSize: 12 }}>出发地点</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{ color: atlasColors.ink, fontSize: 26, fontFamily: 'serif', fontWeight: '700', flex: 1 }}
                >
                  {departure}
                </Text>
                <AtlasAssetBadge source={atlasAssets.blueCompass} size={42} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                {departureOptions.map((item) => (
                  <AtlasTag key={item} label={item} selected={departure === item} onPress={() => setDeparture(item)} />
                ))}
              </View>
            </AtlasPanel>

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', fontWeight: '700' }}>
                路线主题标签
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 13, marginTop: 4 }}>
                让探索协会知道，今晚该给你怎样的一页图鉴。
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                {themeOptions.map((item) => (
                  <AtlasTag key={item} label={item} selected={theme === item} onPress={() => setTheme(item)} />
                ))}
              </View>

              <AtlasDivider style={{ marginVertical: 16 }} />

              <Text style={{ color: atlasColors.ink, fontSize: 22, fontFamily: 'serif', fontWeight: '700' }}>
                预算与时长
              </Text>
              <View style={{ gap: 12, marginTop: 12 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {budgetOptions.map((item) => (
                    <AtlasTag key={item} label={item} selected={budget === item} onPress={() => setBudget(item)} />
                  ))}
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {durationOptions.map((item) => (
                    <AtlasTag
                      key={item}
                      label={item}
                      selected={duration === item}
                      onPress={() => setDuration(item)}
                    />
                  ))}
                </View>
              </View>
            </AtlasPanel>

            <AtlasPanel>
              <Text style={{ color: atlasColors.ink, fontSize: 24, fontFamily: 'serif', fontWeight: '700' }}>
                偏好图标选项组
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 13, marginTop: 4 }}>
                可多选。系统会据此把地图切片和任务节点排成更适合你的卷轴。
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
                {preferenceOptions.map((item) => (
                  <AtlasTag
                    key={item}
                    label={item}
                    selected={preferences.includes(item)}
                    onPress={() => togglePreference(item)}
                    style={{ minWidth: '30%' }}
                  />
                ))}
              </View>
            </AtlasPanel>

            <AtlasWoodButton label="生成路线" icon="stamp" onPress={handleGenerate} />
            <Text style={{ textAlign: 'center', color: atlasColors.subInk, fontSize: 12 }}>
              今日可生成 2 / 3 条委托路线
            </Text>
          </View>
        </ScrollView>
      </AtlasBackground>
    </Screen>
  );
}

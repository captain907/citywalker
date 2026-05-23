import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { QuestCardData } from '@/types';
import { AtlasDivider, AtlasMedallion, AtlasPanel, AtlasPill, atlasColors } from '@/components/AtlasUI';

export default function QuestTicketCard({
  quest,
  onPress,
}: {
  quest: QuestCardData;
  onPress?: () => void;
}) {
  const difficulty = {
    easy: '轻度委托',
    medium: '标准委托',
    hard: '深度委托',
  }[quest.difficulty ?? 'easy'];

  return (
    <Pressable onPress={onPress} style={{ marginBottom: 16 }}>
      <AtlasPanel variant="ticket">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
            <AtlasMedallion icon={(quest.icon as React.ComponentProps<typeof FontAwesome6>['name']) || 'compass'} size={42} tone="paper" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: atlasColors.subInk, fontSize: 11 }}>探索委托单</Text>
              <Text style={{ color: atlasColors.ink, fontSize: 22, fontFamily: 'serif', fontWeight: '700', marginTop: 6 }}>
                {quest.title}
              </Text>
              <Text style={{ color: atlasColors.bronze, fontSize: 13, marginTop: 4 }}>
                {quest.questType ?? quest.type} · {difficulty}
              </Text>
            </View>
          </View>
          <AtlasPill label={`+${quest.xp} XP`} />
        </View>

        <AtlasDivider style={{ marginVertical: 14 }} />

        <Text style={{ color: atlasColors.subInk, fontSize: 13, lineHeight: 20 }}>{quest.description}</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {(quest.possibleDiscoveries ?? []).map((item) => (
            <AtlasPill key={item} label={item} />
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <FontAwesome6 name="feather-pointed" size={14} color={atlasColors.bronze} />
          <Text style={{ color: atlasColors.subInk, fontSize: 12, flex: 1 }}>{quest.recommended}</Text>
        </View>
      </AtlasPanel>
    </Pressable>
  );
}

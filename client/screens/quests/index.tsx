import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { AtlasBackground, AtlasDivider, AtlasMedallion, atlasColors } from '@/components/AtlasUI';
import QuestTicketCard from '@/components/QuestTicketCard';
import { useAppContext } from '@/contexts/AppContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';

export default function QuestsScreen() {
  const router = useSafeRouter();
  const { questTemplates, selectQuest } = useAppContext();

  return (
    <Screen className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <AtlasBackground>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 18 }}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <AtlasMedallion icon="scroll" size={52} />
              <Text style={{ color: atlasColors.ink, fontSize: 30, fontFamily: 'serif', fontWeight: '700' }}>
                探索委托
              </Text>
              <Text style={{ color: atlasColors.subInk, fontSize: 14 }}>选择一张委托票据，翻开今晚的路线</Text>
            </View>

            <AtlasDivider title="QUEST BOARD" />

            <View>
              {questTemplates.map((quest) => (
                <QuestTicketCard
                  key={quest.id}
                  quest={quest}
                  onPress={() => {
                    selectQuest(quest.title);
                    router.push('/quest-generate');
                  }}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </AtlasBackground>
    </Screen>
  );
}

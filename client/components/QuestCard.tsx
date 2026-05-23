import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { QuestCardData } from '@/types';

interface QuestCardProps {
  quest: QuestCardData;
  onPress: () => void;
}

export default function QuestCard({ quest, onPress }: QuestCardProps) {
  const getIconByName = (name: string) => {
    switch (name) {
      case 'walking': return 'person-walking';
      case 'box-open': return 'box';
      case 'utensils': return 'utensils';
      case 'mountain-sun': return 'mountain-sun';
      default: return 'compass';
    }
  };

  const getDifficultyStars = (xp: number) => {
    if (xp <= 20) return '★☆☆';
    if (xp <= 30) return '★★☆';
    return '★★★';
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="mb-4 active:opacity-90"
      activeOpacity={0.9}
    >
      <View 
        className="rounded-2xl p-5"
        style={{ 
          backgroundColor: '#F7F0DF',
          borderWidth: 1,
          borderColor: '#E6D4B4',
          shadowColor: '#4A3A2A',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* 顶部标签栏 */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <View 
              className="w-8 h-8 rounded-lg items-center justify-center mr-2"
              style={{ backgroundColor: 'rgba(185, 138, 69, 0.15)' }}
            >
              <FontAwesome6 
                name={getIconByName(quest.icon)} 
                size={14} 
                color="#B98A45" 
              />
            </View>
            <Text 
              className="text-xs"
              style={{ color: '#8A5A2B' }}
            >
              【今日委托】
            </Text>
            <Text 
              className="font-bold ml-1"
              style={{ color: '#4A3A2A', fontSize: 15 }}
            >
              {quest.title}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text 
              className="text-sm"
              style={{ color: '#B98A45' }}
            >
              {getDifficultyStars(quest.xp)}
            </Text>
          </View>
        </View>

        {/* 任务类型和奖励 */}
        <View className="flex-row items-center mb-3">
          <View 
            className="px-3 py-1 rounded-lg mr-2"
            style={{ backgroundColor: 'rgba(138, 90, 43, 0.1)' }}
          >
            <Text 
              className="text-xs"
              style={{ color: '#8A5A2B' }}
            >
              {quest.type}
            </Text>
          </View>
          <View 
            className="px-3 py-1 rounded-lg mr-2"
            style={{ backgroundColor: 'rgba(185, 138, 69, 0.15)' }}
          >
            <Text 
              className="text-xs font-bold"
              style={{ color: '#B98A45' }}
            >
              奖励：+{quest.xp} XP
            </Text>
          </View>
        </View>

        {/* 描述 */}
        <Text 
          className="text-sm leading-5 mb-3"
          style={{ color: '#6B563A' }}
        >
          {quest.description}
        </Text>

        {/* 底部推荐人群 */}
        <View className="flex-row items-center">
          <FontAwesome6 name="lightbulb" size={12} color="#8A5A2B" />
          <Text 
            className="text-xs ml-1"
            style={{ color: '#8A5A2B' }}
          >
            推荐：{quest.recommended}
          </Text>
        </View>

        {/* 装饰性印章 */}
        <View 
          className="absolute top-3 right-3">
          <FontAwesome6 name="stamp" size={20} color="rgba(185, 138, 69, 0.3)" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ExpectedRewards } from '@/types';

interface RewardPanelProps {
  rewards: ExpectedRewards;
  levelUp?: boolean;
  oldLevel?: number;
  newLevel?: number;
}

const AttributeRewardItem = ({ 
  label, 
  value, 
  icon, 
  color 
}: { 
  label: string; 
  value: number; 
  icon: string; 
  color: string;
}) => (
  <View className="flex-row justify-between items-center py-3 border-b border-amber-200 last:border-0">
    <View className="flex-row items-center">
      <View 
        className="w-8 h-8 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: `${color}12` }}
      >
        <FontAwesome6 name={icon} size={14} color={color} />
      </View>
      <Text 
        className="font-medium"
        style={{ color: '#4A3A2A' }}
      >
        {label}
      </Text>
    </View>
    <View className="flex-row items-center">
      <Text 
        className="font-bold text-lg"
        style={{ color: '#6F8A63' }}
      >
        +{value}
      </Text>
    </View>
  </View>
);

export default function RewardPanel({ 
  rewards, 
  levelUp = false, 
  oldLevel, 
  newLevel 
}: RewardPanelProps) {
  return (
    <View 
      className="rounded-2xl p-5 mb-4"
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
      {/* 标题 */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View 
            className="w-8 h-8 rounded-lg items-center justify-center mr-2"
            style={{ backgroundColor: 'rgba(111, 138, 99, 0.15)' }}
          >
            <FontAwesome6 name="gift" size={14} color="#6F8A63" />
          </View>
          <Text 
            className="font-bold"
            style={{ color: '#4A3A2A', fontSize: 16 }}
          >
            预计收获
          </Text>
        </View>
        <Text 
          className="text-xs"
          style={{ color: '#8A5A2B' }}
        >
          Expected Rewards
        </Text>
      </View>

      {/* 等级提升 */}
      {levelUp && oldLevel && newLevel && (
        <View 
          className="p-4 rounded-xl mb-4 items-center"
          style={{ 
            backgroundColor: 'rgba(185, 138, 69, 0.12)',
            borderWidth: 1,
            borderColor: 'rgba(185, 138, 69, 0.25)',
          }}
        >
          <FontAwesome6 name="star" size={20} color="#B98A45" />
          <Text 
            className="font-bold mt-2"
            style={{ color: '#B98A45', fontSize: 16 }}
          >
            等级提升！
          </Text>
          <Text 
            className="text-sm mt-1"
            style={{ color: '#8A5A2B' }}
          >
            Lv.{oldLevel} → Lv.{newLevel}
          </Text>
        </View>
      )}

      {/* XP 奖励 */}
      <View 
        className="p-4 rounded-xl mb-4 items-center"
        style={{ 
          backgroundColor: 'rgba(185, 138, 69, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(185, 138, 69, 0.2)',
        }}
      >
        <Text 
          className="text-xs mb-1"
          style={{ color: '#8A5A2B' }}
        >
          获得 XP
        </Text>
        <Text 
          className="font-bold text-3xl"
          style={{ color: '#B98A45' }}
        >
          +{rewards.xp}
        </Text>
      </View>

      {/* 属性提升 */}
      <AttributeRewardItem 
        label="生命力" 
        value={rewards.vitality} 
        icon="heart" 
        color="#B85A3C" 
      />
      <AttributeRewardItem 
        label="探索度" 
        value={rewards.exploration} 
        icon="compass" 
        color="#8FAEB0" 
      />
      <AttributeRewardItem 
        label="快乐值" 
        value={rewards.joy} 
        icon="face-smile" 
        color="#B98A45" 
      />
      <AttributeRewardItem 
        label="风味体验" 
        value={rewards.taste} 
        icon="utensils" 
        color="#6F8A63" 
      />

      {/* 可能解锁 */}
      <View className="mt-4 pt-4 border-t border-amber-200">
        <Text 
          className="text-xs mb-2"
          style={{ color: '#8A5A2B' }}
        >
          可能解锁：
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <View 
            className="px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'rgba(184, 90, 60, 0.08)' }}
          >
            <Text 
              className="text-xs"
              style={{ color: '#B85A3C' }}
            >
              美食图鉴：艇仔粥
            </Text>
          </View>
          <View 
            className="px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'rgba(143, 174, 176, 0.1)' }}
          >
            <Text 
              className="text-xs"
              style={{ color: '#8FAEB0' }}
            >
              地点发现：海心桥机位
            </Text>
          </View>
          <View 
            className="px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'rgba(185, 138, 69, 0.1)' }}
          >
            <Text 
              className="text-xs"
              style={{ color: '#B98A45' }}
            >
              氛围收藏：珠江晚风
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

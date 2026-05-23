import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { CoreAttributes } from '@/types';

interface AttributeBarProps {
  attributes: CoreAttributes;
}

interface AttributeItemData {
  key: keyof CoreAttributes;
  label: string;
  icon: string;
  color: string;
}

const getAttributeStatus = (value: number, key: string): { status: string; description: string } => {
  switch (key) {
    case 'vitality':
      if (value >= 80) return { status: '精力充沛', description: '今晚可以挑战更有挑战性的路线。' };
      if (value >= 60) return { status: '轻度回血', description: '适合一条不赶路的饭旅路线。' };
      if (value >= 40) return { status: '需要休憩', description: '选择低压力的轻松路线。' };
      return { status: '需要回血', description: '请选择回血路线。' };
    case 'exploration':
      if (value >= 80) return { status: '城市探险家', description: '你已经点亮了大片城市的大部分区域。' };
      if (value >= 60) return { status: '地图渐亮', description: '你探索了不少新区域。' };
      if (value >= 40) return { status: '地图初亮', description: '走出校园半径，城市仍有未知。' };
      return { status: '探索伊始', description: '城市等待你去发现。' };
    case 'joy':
      if (value >= 80) return { status: '心情愉悦', description: '最近的体验都很棒。' };
      if (value >= 60) return { status: '情绪回温', description: '适合轻松有烟火气的路线。' };
      if (value >= 40) return { status: '需要点亮', description: '需要一些能带来快乐的体验。' };
      return { status: '需要治愈', description: '需要一条治愈的路线。' };
    case 'taste':
      if (value >= 80) return { status: '味觉大师', description: '你收集了不少城市的味道。' };
      if (value >= 60) return { status: '味觉丰富', description: '品尝了多种风味。' };
      if (value >= 40) return { status: '味觉收集中', description: '新的小吃会让图鉴继续扩展。' };
      return { status: '味觉探索', description: '去发现新的味道。' };
    default:
      return { status: '正常', description: '继续探索吧。' };
  }
};

const AttributeItem = ({ 
  attributeKey, label, value, icon, color 
}: { 
  attributeKey: keyof CoreAttributes;
  label: string;
  value: number;
  icon: string;
  color: string;
}) => {
  const { status, description } = getAttributeStatus(value, attributeKey);
  
  return (
    <View className="mb-5">
      <View className="flex-row items-start mb-2">
        <View 
          className="w-10 h-10 rounded-lg items-center justify-center mr-3"
          style={{ 
            backgroundColor: `${color}15`,
            borderWidth: 1,
            borderColor: `${color}30`,
          }}
        >
          <FontAwesome6 name={icon} size={18} color={color} />
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold" style={{ color: '#4A3A2A', fontSize: 16 }}>
              {label}
            </Text>
            <Text className="font-bold" style={{ color, fontSize: 16 }}>
              {value}/100
            </Text>
          </View>
          <Text 
            className="text-xs mt-1"
            style={{ color: '#8A5A2B' }}
          >
            状态：{status}
          </Text>
        </View>
      </View>
      <Text 
        className="text-sm leading-5 mb-2"
        style={{ color: '#6B563A', paddingLeft: 52 }}
      >
        {description}
      </Text>
      <View 
        className="h-1.5 rounded-full overflow-hidden ml-12"
        style={{ 
          backgroundColor: '#E6D4B4',
          borderWidth: 1,
          borderColor: '#D4C4A8',
        }}
      >
        <View 
          className="h-full rounded-full"
          style={{ 
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export default function AttributeBar({ attributes }: AttributeBarProps) {
  const attributeItems: AttributeItemData[] = [
    { key: 'vitality', label: '生命力', icon: 'heart', color: '#B85A3C' },
    { key: 'exploration', label: '探索度', icon: 'compass', color: '#8FAEB0' },
    { key: 'joy', label: '快乐值', icon: 'face-smile', color: '#B98A45' },
    { key: 'taste', label: '风味体验', icon: 'utensils', color: '#6F8A63' },
  ];

  return (
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
      <View className="flex-row items-center mb-4">
        <View 
          className="w-8 h-8 rounded-lg items-center justify-center mr-2"
          style={{ backgroundColor: 'rgba(185, 138, 69, 0.15)' }}
        >
          <FontAwesome6 name="user-tie" size={14} color="#B98A45" />
        </View>
        <Text 
          className="font-bold"
          style={{ color: '#4A3A2A', fontSize: 16 }}
        >
          旅者状态
        </Text>
        <Text 
          className="text-xs ml-2"
          style={{ color: '#8A5A2B' }}
        >
          Traveler Status
        </Text>
      </View>
      
      {attributeItems.map(item => (
        <AttributeItem
          key={item.key}
          attributeKey={item.key}
          label={item.label}
          value={attributes[item.key]}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </View>
  );
}

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { WorldAttributes } from '@/types';

interface ArchiveGridProps {
  worldAttributes: WorldAttributes;
}

const ArchiveCard = ({ 
  title, 
  items, 
  icon, 
  color 
}: { 
  title: string; 
  items: string[]; 
  icon: string; 
  color: string;
}) => (
  <View 
    className="rounded-2xl p-4 mb-4"
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
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center">
        <View 
          className="w-9 h-9 rounded-xl items-center justify-center mr-2"
          style={{ 
            backgroundColor: `${color}12`,
            borderWidth: 1,
            borderColor: `${color}25`,
          }}
        >
          <FontAwesome6 name={icon} size={16} color={color} />
        </View>
        <View>
          <Text 
            className="font-bold"
            style={{ color: '#4A3A2A' }}
          >
            {title}
          </Text>
          <Text 
            className="text-xs"
            style={{ color: '#8A5A2B' }}
          >
            已收藏 {items.length}
          </Text>
        </View>
      </View>
      <View 
        className="w-8 h-8 rounded-lg items-center justify-center"
        style={{ backgroundColor: 'rgba(185, 138, 69, 0.1)' }}
      >
        <Text 
          className="font-bold"
          style={{ color: '#B98A45', fontSize: 12 }}
        >
          {items.length}
        </Text>
      </View>
    </View>

    {/* 标签网格 */}
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="flex-row"
    >
      {items.map((item, index) => (
        <View 
          key={index}
          className="mr-2 mb-2"
        >
          <View 
            className="px-4 py-3 rounded-xl items-center justify-center"
            style={{ 
              backgroundColor: '#EFE2C8',
              borderWidth: 1,
              borderColor: '#D4C4A8',
              shadowColor: '#4A3A2A',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 1,
              minWidth: 80,
            }}
          >
            <View 
              className="w-8 h-8 rounded-lg items-center justify-center mb-2"
              style={{ backgroundColor: `${color}12` }}
            >
              <FontAwesome6 
                name={
                  title.includes('美食') ? 'utensils' :
                  title.includes('地点') ? 'location-dot' :
                  title.includes('氛围') ? 'cloud-sun' :
                  'map'
                } 
                size={14} 
                color={color} 
              />
            </View>
            <Text 
              className="text-xs font-medium text-center"
              style={{ color: '#4A3A2A' }}
            >
              {item}
            </Text>
          </View>
        </View>
      ))}
      
      {/* 空位提示 */}
      {items.length === 0 && (
        <View 
          className="px-4 py-3 rounded-xl items-center justify-center"
          style={{ 
            backgroundColor: '#EFE2C8',
            borderWidth: 1,
            borderColor: '#D4C4A8',
            borderStyle: 'dashed',
            minWidth: 80,
          }}
        >
          <FontAwesome6 name="lock" size={16} color="#C4B49A" />
          <Text 
            className="text-xs mt-1"
            style={{ color: '#C4B49A' }}
          >
            待解锁
          </Text>
        </View>
      )}
    </ScrollView>
  </View>
);

export default function ArchiveGrid({ worldAttributes }: ArchiveGridProps) {
  return (
    <View>
      <ArchiveCard 
        title="城市记忆" 
        items={worldAttributes.city_memory} 
        icon="map-location-dot" 
        color="#8FAEB0" 
      />
      <ArchiveCard 
        title="美食图鉴" 
        items={worldAttributes.cuisine_archive} 
        icon="bowl-food" 
        color="#B85A3C" 
      />
      <ArchiveCard 
        title="地点发现" 
        items={worldAttributes.landmark_discovery} 
        icon="location-pin" 
        color="#B98A45" 
      />
      <ArchiveCard 
        title="氛围收藏" 
        items={worldAttributes.vibe_collection} 
        icon="cloud-moon" 
        color="#6F8A63" 
      />
    </View>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { CurrentQuest } from '@/types';

interface RouteCardProps {
  route: CurrentQuest;
}

export default function RouteCard({ route }: RouteCardProps) {
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
      {/* 标题区域 */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text 
            className="text-xl font-bold mb-1"
            style={{ color: '#4A3A2A' }}
          >
            {route.route_title}
          </Text>
          <Text 
            className="text-xs"
            style={{ color: '#8A5A2B' }}
          >
            Journey Log
          </Text>
        </View>
        <View 
          className="w-10 h-10 rounded-lg items-center justify-center"
          style={{ backgroundColor: 'rgba(185, 138, 69, 0.15)' }}
        >
          <FontAwesome6 name="scroll" size={18} color="#B98A45" />
        </View>
      </View>
      
      {/* 标签 */}
      <View className="flex-row flex-wrap mb-4">
        {route.vibe_tags.map((tag, index) => (
          <View 
            key={index}
            className="px-3 py-1.5 rounded-lg mr-2 mb-2"
            style={{ 
              backgroundColor: index === 0 ? 'rgba(184, 90, 60, 0.1)' : 
                             index === 1 ? 'rgba(143, 174, 176, 0.15)' : 
                             'rgba(185, 138, 69, 0.12)',
              borderWidth: 1,
              borderColor: index === 0 ? 'rgba(184, 90, 60, 0.25)' : 
                           index === 1 ? 'rgba(143, 174, 176, 0.3)' : 
                           'rgba(185, 138, 69, 0.25)',
            }}
          >
            <Text 
              className="text-xs font-medium"
              style={{ 
                color: index === 0 ? '#B85A3C' : 
                       index === 1 ? '#8FAEB0' : 
                       '#B98A45'
              }}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>

      {/* 基础信息 */}
      <View className="flex-row justify-between mb-4 pb-4 border-b border-amber-200">
        <View className="items-center">
          <Text 
            className="text-xs mb-1"
            style={{ color: '#8A5A2B' }}
          >
            预算
          </Text>
          <Text 
            className="font-bold"
            style={{ color: '#4A3A2A' }}
          >
            {route.budget}
          </Text>
        </View>
        <View className="items-center">
          <Text 
            className="text-xs mb-1"
            style={{ color: '#8A5A2B' }}
          >
            时长
          </Text>
          <Text 
            className="font-bold"
            style={{ color: '#4A3A2A' }}
          >
            {route.duration}
          </Text>
        </View>
        <View className="items-center">
          <Text 
            className="text-xs mb-1"
            style={{ color: '#8A5A2B' }}
          >
            强度
          </Text>
          <Text 
            className="font-bold"
            style={{ color: '#4A3A2A' }}
          >
            {route.intensity}
          </Text>
        </View>
        <View className="items-center">
          <Text 
            className="text-xs mb-1"
            style={{ color: '#8A5A2B' }}
          >
            人数
          </Text>
          <Text 
            className="font-bold"
            style={{ color: '#4A3A2A' }}
          >
            {route.people}
          </Text>
        </View>
      </View>

      {/* 路线时间线 */}
      <View>
        <View className="flex-row items-center mb-3">
          <View 
            className="w-7 h-7 rounded-lg items-center justify-center mr-2"
            style={{ backgroundColor: 'rgba(185, 138, 69, 0.12)' }}
          >
            <FontAwesome6 name="route" size={12} color="#B98A45" />
          </View>
          <Text 
            className="font-bold"
            style={{ color: '#4A3A2A' }}
          >
            路线时间线
          </Text>
        </View>
        
        {route.timeline.map((item, index) => (
          <View key={index} className="flex-row mb-3">
            <View className="items-center mr-3">
              <View 
                className="w-6 h-6 rounded-full items-center justify-center"
                style={{ 
                  backgroundColor: 'rgba(185, 138, 69, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(185, 138, 69, 0.3)',
                }}
              >
                <FontAwesome6 name="circle" size={6} color="#B98A45" />
              </View>
              {index < route.timeline.length - 1 && (
                <View 
                  className="w-0.5 flex-1"
                  style={{ backgroundColor: '#E6D4B4' }}
                />
              )}
            </View>
            <Text 
              className="flex-1 pt-0.5 text-sm leading-5"
              style={{ color: '#6B563A' }}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

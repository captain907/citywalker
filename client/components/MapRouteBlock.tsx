import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface MapRouteBlockProps {
  routeName?: string;
}

export default function MapRouteBlock({ routeName }: MapRouteBlockProps) {
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
            style={{ backgroundColor: 'rgba(143, 174, 176, 0.15)' }}
          >
            <FontAwesome6 name="map-location-dot" size={14} color="#8FAEB0" />
          </View>
          <Text 
            className="font-bold"
            style={{ color: '#4A3A2A' }}
          >
            浮雕地图切片
          </Text>
        </View>
        <Text 
          className="text-xs"
          style={{ color: '#8A5A2B' }}
        >
          Relief Map
        </Text>
      </View>
      
      {/* 地图占位区域 */}
      <View 
        className="h-48 rounded-xl items-center justify-center mb-4"
        style={{ 
          backgroundColor: '#EFE2C8',
          borderWidth: 2,
          borderColor: '#D4C4A8',
          borderStyle: 'dashed',
        }}
      >
        {/* 装饰性河流 */}
        <View className="absolute w-full h-full rounded-xl overflow-hidden">
          <View 
            className="absolute w-32 h-4 rounded-full"
            style={{ 
              backgroundColor: 'rgba(175, 199, 200, 0.4)',
              top: '40%',
              left: '10%',
              transform: [{ rotate: '-15deg' }],
            }}
          />
          {/* 装饰性建筑点 */}
          <View 
            className="absolute w-4 h-4 rounded-full"
            style={{ backgroundColor: 'rgba(185, 138, 69, 0.3)', top: '25%', left: '20%' }}
          />
          <View 
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: 'rgba(185, 138, 69, 0.25)', top: '35%', left: '45%' }}
          />
          <View 
            className="absolute w-4 h-4 rounded-full"
            style={{ backgroundColor: 'rgba(111, 138, 99, 0.3)', top: '55%', left: '65%' }}
          />
        </View>

        <View className="items-center z-10">
          <FontAwesome6 name="map" size={40} color="#8A5A2B" />
          <Text 
            className="mt-3 text-center px-4"
            style={{ color: '#8A5A2B' }}
          >
            后续接入高德地图
          </Text>
        </View>
      </View>

      {/* 图例 */}
      <View className="flex-row justify-around mb-4">
        <View className="flex-row items-center">
          <View 
            className="w-4 h-4 rounded-full mr-1"
            style={{ backgroundColor: '#B98A45' }}
          />
          <Text 
            className="text-xs"
            style={{ color: '#6B563A' }}
          >
            起点
          </Text>
        </View>
        <View className="flex-row items-center">
          <View 
            className="w-4 h-4 rounded-full mr-1"
            style={{ backgroundColor: '#B85A3C' }}
          />
          <Text 
            className="text-xs"
            style={{ color: '#6B563A' }}
          >
            餐厅
          </Text>
        </View>
        <View className="flex-row items-center">
          <View 
            className="w-4 h-4 rounded-full mr-1"
            style={{ backgroundColor: '#6F8A63' }}
          />
          <Text 
            className="text-xs"
            style={{ color: '#6B563A' }}
          >
            散步点
          </Text>
        </View>
        <View className="flex-row items-center">
          <View 
            className="w-4 h-4 rounded-full mr-1"
            style={{ backgroundColor: '#8A5A2B' }}
          />
          <Text 
            className="text-xs"
            style={{ color: '#6B563A' }}
          >
            终点
          </Text>
        </View>
      </View>

      {/* 底部信息 */}
      <View className="flex-row justify-between items-center pt-3 border-t border-amber-200">
        <View className="flex-row items-center">
          <FontAwesome6 name="ruler" size={14} color="#8A5A2B" />
          <Text 
            className="ml-2 text-sm"
            style={{ color: '#6B563A' }}
          >
            预计距离：待计算
          </Text>
        </View>
        <TouchableOpacity 
          className="flex-row items-center px-4 py-2 rounded-lg"
          style={{ 
            backgroundColor: 'rgba(185, 138, 69, 0.15)',
            borderWidth: 1,
            borderColor: 'rgba(185, 138, 69, 0.3)',
          }}
          disabled
        >
          <FontAwesome6 name="location-arrow" size={14} color="#B98A45" />
          <Text 
            className="ml-2 font-medium text-sm"
            style={{ color: '#B98A45' }}
          >
            打开导航
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

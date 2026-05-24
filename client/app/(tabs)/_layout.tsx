import { Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { atlasColors } from '@/components/AtlasUI';

function EngravedTabIcon({
  icon,
  focused,
}: {
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  focused: boolean;
}) {
  return (
    <View
      style={{
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? '#EFE2C8' : 'transparent',
        borderWidth: focused ? 1 : 0,
        borderColor: focused ? '#CFB083' : 'transparent',
      }}
    >
      <FontAwesome6
        name={icon}
        size={focused ? 17 : 15}
        color={focused ? atlasColors.bronzeDeep : atlasColors.subInk}
      />
    </View>
  );
}

function EngravedTabLabel({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontFamily: 'serif',
        lineHeight: 14,
        marginTop: 4,
        paddingBottom: 1,
        color: focused ? atlasColors.bronzeDeep : atlasColors.subInk,
      }}
    >
      {label}
    </Text>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarStyle: BottomTabNavigationOptions['tabBarStyle'] = {
    backgroundColor: '#F3ECDF',
    borderTopWidth: 1,
    borderTopColor: '#E0D0B2',
    paddingTop: 4,
    paddingBottom: Math.max(insets.bottom, 4),
    height: Platform.OS === 'web' ? 62 : 68 + insets.bottom,
    overflow: 'visible',
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: atlasColors.bronzeDeep,
        tabBarInactiveTintColor: atlasColors.subInk,
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: {
          paddingTop: 2,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="house" focused={focused} />,
          tabBarLabel: ({ focused }) => <EngravedTabLabel label="首页" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '探索',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="compass" focused={focused} />,
          tabBarLabel: ({ focused }) => <EngravedTabLabel label="探索" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: '任务',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="scroll" focused={focused} />,
          tabBarLabel: ({ focused }) => <EngravedTabLabel label="任务" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: '图鉴',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="book-atlas" focused={focused} />,
          tabBarLabel: ({ focused }) => <EngravedTabLabel label="图鉴" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="user" focused={focused} />,
          tabBarLabel: ({ focused }) => <EngravedTabLabel label="我的" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

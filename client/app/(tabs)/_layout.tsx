import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
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
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? '#EFE2C8' : 'transparent',
        borderWidth: focused ? 1 : 0,
        borderColor: focused ? '#CFB083' : 'transparent',
      }}
    >
      <FontAwesome6 name={icon} size={focused ? 18 : 16} color={focused ? atlasColors.bronzeDeep : atlasColors.subInk} />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarStyle: BottomTabNavigationOptions['tabBarStyle'] = {
    backgroundColor: '#F3ECDF',
    borderTopWidth: 1,
    borderTopColor: '#E0D0B2',
    paddingTop: 8,
    paddingBottom: Math.max(insets.bottom, 10),
    height: Platform.OS === 'web' ? undefined : 76 + insets.bottom,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: atlasColors.bronzeDeep,
        tabBarInactiveTintColor: atlasColors.subInk,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'serif',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="house" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '探索',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="compass" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: '任务',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="scroll" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: '图鉴',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="book-atlas" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ focused }) => <EngravedTabIcon icon="user" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

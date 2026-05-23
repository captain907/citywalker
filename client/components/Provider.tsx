import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { type ReactNode } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebOnlyColorSchemeUpdater } from './ColorSchemeUpdater';
import { WebOnlyPrettyScrollbar } from './PrettyScrollbar'
import { HeroUINativeProvider } from '@/heroui';

function WebPreviewFrame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width >= 768;

  if (!isDesktopWeb) {
    return <>{children}</>;
  }

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: '#E7DDCC',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 24,
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 430,
          height: '100%',
          maxHeight: 932,
          overflow: 'hidden',
          borderRadius: 32,
          backgroundColor: '#F4EFE4',
          boxShadow: '0 24px 60px rgba(74, 58, 42, 0.18)',
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Provider({ children }: { children: ReactNode }) {
  return <WebOnlyColorSchemeUpdater>
    <WebOnlyPrettyScrollbar>
      <AuthProvider>
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <WebPreviewFrame>
              <HeroUINativeProvider>
                {children}
              </HeroUINativeProvider>
            </WebPreviewFrame>
          </GestureHandlerRootView>
        </AppProvider>
      </AuthProvider>
    </WebOnlyPrettyScrollbar>
  </WebOnlyColorSchemeUpdater>
}

export {
  Provider,
}

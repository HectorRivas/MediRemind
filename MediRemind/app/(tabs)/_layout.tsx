import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#ADD8E6',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // da el efecto de sombra
    marginBottom: 40, // Ajusta para levantarlo un poco
    bottom: 0,
  },
});

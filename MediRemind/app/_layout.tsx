import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "SpaceMono": require('../assets/fonts/SpaceMono-Regular.ttf'),
    "CascadiaMono-Bold": require('../assets/fonts/CascadiaMono-Bold.ttf'),
    "CascadiaMono-BoldItalic": require('../assets/fonts/CascadiaMono-BoldItalic.ttf'),
    "CascadiaMono-ExtraLight": require('../assets/fonts/CascadiaMono-ExtraLight.ttf'),
    "CascadiaMono-ExtraLightItalic": require('../assets/fonts/CascadiaMono-ExtraLightItalic.ttf'),
    "CascadiaMono-Italic": require('../assets/fonts/CascadiaMono-Italic.ttf'),
    "CascadiaMono-Light": require('../assets/fonts/CascadiaMono-Light.ttf'),
    "CascadiaMono-LightItalic": require('../assets/fonts/CascadiaMono-LightItalic.ttf'),
    "CascadiaMono-Medium": require('../assets/fonts/CascadiaMono-Medium.ttf'),
    "CascadiaMono-MediumItalic": require('../assets/fonts/CascadiaMono-MediumItalic.ttf'),
    "CascadiaMono-Regular": require('../assets/fonts/CascadiaMono-Regular.ttf'),
    "CascadiaMono-SemiBold": require('../assets/fonts/CascadiaMono-SemiBold.ttf'),
    "CascadiaMono-SemiBoldItalic": require('../assets/fonts/CascadiaMono-SemiBoldItalic.ttf'),
    "Sansation-Bold": require('../assets/fonts/Sansation-Bold.ttf'),
    "Sansation-BoldItalic": require('../assets/fonts/Sansation-BoldItalic.ttf'),
    "Sansation-Light": require('../assets/fonts/Sansation-Light.ttf'),
    "Sansation-LightItalic": require('../assets/fonts/Sansation-LightItalic.ttf'),
    "Sansation-Regular": require('../assets/fonts/Sansation-Regular.ttf'),
    "Sansation-Italic": require('../assets/fonts/Sansation-Italic.ttf'),
  });

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#ADD8E6');
  }, []);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
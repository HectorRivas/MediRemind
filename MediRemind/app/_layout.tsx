import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  // Detecta el esquema de color actual (claro u oscuro)
  const colorScheme = useColorScheme();

  // Carga las fuentes personalizadas
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

  // Cambia el color de fondo de la barra de navegación
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#ADD8E6'); // Azul claro
  }, []);

  // Si las fuentes no están cargadas, no renderiza nada
  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Proveedor de tema para manejar esquemas de color */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Configuración de navegación con pilas */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" /> {/* Pantalla principal */}
          <Stack.Screen name="dashboard" /> {/* Pantalla del tablero */}
          <Stack.Screen name="(tabs)" /> {/* Pantalla de pestañas */}
          <Stack.Screen name="+not-found" /> {/* Pantalla de error 404 */}
        </Stack>
        {/* Barra de estado con estilo según el esquema de color */}
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
  },
});
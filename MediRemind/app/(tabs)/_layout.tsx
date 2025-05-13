import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  // Obtiene el esquema de color actual (claro u oscuro)
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Color del ícono activo en la barra de pestañas
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Oculta el encabezado en las pantallas
        headerShown: false,
        // Personaliza el botón de la barra de pestañas con retroalimentación háptica
        tabBarButton: HapticTab,
        // Fondo personalizado para la barra de pestañas
        tabBarBackground: TabBarBackground,
        // Estilo de la barra de pestañas según la plataforma
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Hace que la barra de pestañas flote en iOS
          },
          default: {}, // Sin cambios para otras plataformas
        }),
      }}
    >
      {/* Aquí se agregarán las pestañas individuales */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Estilo para un botón flotante (FAB)
  fabContainer: {
    width: 60, // Ancho del botón
    height: 60, // Altura del botón
    backgroundColor: '#ADD8E6', // Color de fondo (azul claro)
    borderRadius: 30, // Hace que el botón sea circular
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    elevation: 10, // Agrega un efecto de sombra
    marginBottom: 40, // Ajusta la posición para levantarlo un poco
    bottom: 0, // Posición inferior
  },
});

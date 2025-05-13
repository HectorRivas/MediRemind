import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function Header({ onSettingsPress }: { onSettingsPress: () => void }) {
  return (
    <View style={styles.headerContainer}>
      {/* Logo de la aplicación */}
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Contenedor del título */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MediRemind</Text> {/* Título de la aplicación */}
      </View>

      {/* Botón para abrir la configuración */}
      <TouchableOpacity onPress={onSettingsPress}>
        <Ionicons name="add-circle-outline" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal del encabezado
  headerContainer: {
    flexDirection: 'row', // Elementos en fila
    alignItems: 'center', // Alinea los elementos verticalmente al centro
    justifyContent: 'space-between', // Espacio entre los elementos
    width: '100%', // Ocupa todo el ancho disponible
    paddingHorizontal: 16, // Espaciado horizontal
    paddingVertical: 12, // Espaciado vertical
  },
  // Estilo del logo
  logo: {
    width: 40, // Ancho del logo
    height: 40, // Altura del logo
    resizeMode: "contain", // Ajusta la imagen sin recortarla
  },
  // Contenedor del título
  titleContainer: {
    flex: 1, // Ocupa el espacio restante
    alignItems: 'center', // Centra el título horizontalmente
  },
  // Estilo del título
  title: {
    fontSize: 24, // Tamaño de fuente grande
    fontFamily: "Sansation-Bold", // Fuente personalizada
    color: "white", // Color blanco
  },
});

// app/index.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  // Animación de opacidad para el logo y el texto
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Animación de entrada (fade-in)
    Animated.timing(fadeAnim, {
      toValue: 1, // Opacidad al 100%
      duration: 1000, // Duración de 1 segundo
      easing: Easing.out(Easing.ease), // Efecto de suavizado
      useNativeDriver: true, // Usa el driver nativo para mejor rendimiento
    }).start();

    // 2. Animación de salida (fade-out) y navegación a la pantalla de inicio de sesión
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Opacidad al 0%
        duration: 500, // Duración de 0.5 segundos
        useNativeDriver: true, // Usa el driver nativo
      }).start(() => {
        // Navega a la pantalla de inicio de sesión
        router.replace("/screens/login-screen");
      });
    }, 2500); // Espera 2.5 segundos antes de iniciar la salida

    // Limpia el timeout si el componente se desmonta
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo animado */}
      <Animated.Image
        source={require("@/assets/images/logo.png")}
        style={[styles.logo, { opacity: fadeAnim }]} // Aplica la animación de opacidad
        resizeMode="contain"
      />
      {/* Texto animado */}
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        MediRemind
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: "rgba(42, 123, 155, 100)", // Fondo azul con opacidad
    justifyContent: "center", // Centra el contenido verticalmente
    alignItems: "center", // Centra el contenido horizontalmente
  },
  logo: {
    width: width * 0.6, // El ancho del logo es el 60% del ancho de la pantalla
    height: width * 0.6, // La altura del logo es proporcional al ancho
  },
  title: {
    fontSize: 32, // Tamaño de fuente grande
    fontWeight: "bold", // Texto en negrita
    color: "white", // Color blanco
    marginTop: 10, // Espaciado superior
  },
});

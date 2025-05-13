import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import Zocial from "@expo/vector-icons/Zocial";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#2A7B9B', '#87CEEB', '#ADD8E6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.linearGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
            </View>

            <Text style={styles.title}>Crear Cuenta</Text>

            <View style={styles.loginBox}>
              <Text style={styles.loginTitle}>Regístrate</Text>

              <Text style={styles.label}>Correo</Text>
              <View style={styles.inputContainer}>
                <Zocial name="email" size={18} color="gray" />
                <TextInput
                  placeholder="email@example.com"
                  placeholderTextColor="#1A4152"
                  style={styles.input}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <Text style={styles.label}>Nombre</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="user" size={18} color="gray" />
                <TextInput
                  style={styles.input}
                  keyboardType="default"
                  placeholder="Nombre"
                  placeholderTextColor="#1A4152"
                />
              </View>

              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={18} color="gray" />
                <TextInput
                  secureTextEntry
                  placeholder="contraseña"
                  placeholderTextColor="#1A4152"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Text style={styles.label}>Confirmar Contraseña</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock-outline" size={18} color="gray" />
                <TextInput
                  secureTextEntry
                  placeholder="confirmar contraseña"
                  placeholderTextColor="#1A4152"
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={() => {/* lógica de registro */ }}>
                <Text style={styles.buttonText}>Crear cuenta</Text>
              </TouchableOpacity>

              <View style={styles.footerCenter}>
                <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.push("/screens/login-screen")}>
                  <Text style={[styles.footerText, { fontWeight: "bold" }]}>Iniciar sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontFamily: "Sansation-Bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  loginBox: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: width * 0.06,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  loginTitle: {
    fontSize: 20,
    fontFamily: "Sansation-Regular",
    color: "#1A4152",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#1A4152",
    marginBottom: 6,
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Sansation-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    height: 50,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: "#1A4152",
    fontSize: 14,
    marginLeft: 12,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  footerCenter: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#1A4152",
  },
});

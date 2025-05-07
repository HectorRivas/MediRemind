import React from "react";
import Zocial from "@expo/vector-icons/Zocial";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <StatusBar style="dark" />
        <View>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>MediRemind</Text>

        <View style={styles.loginBox}>
          <Text style={styles.loginTitle}>Iniciar Sesión</Text>

          <Text style={styles.label}>Correo</Text>
          <View className="flex-row h-[50px] mb-3 rounded-lg border border-gray-300 items-center px-4">
            <Zocial name="email" size={12} color="gray" />
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor="gray"
              className="flex-1 text-white text-sm ml-3"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View className="flex-row h-[50px] mb-3 rounded-lg border border-gray-300 items-center px-4">
            <MaterialIcons name="lock" size={12} color="gray" />
            <TextInput
              secureTextEntry={true}
              placeholder="contraseña"
              placeholderTextColor="gray"
              className="flex-1 text-white font-inter text-sm ml-3"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
          >
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>

          <View className="flex-row justify-between mt-10">
            <TouchableOpacity
              onPress={() => router.push("/screens/forgot-password")}
            >
              <Text className="text-sm text-gray-500">Olvidé mi contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/screens/register-screen")}
            >
              <Text className="text-sm text-gray-500">Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingTop: Platform.OS === "android" ? 30 : 0,
    height: Dimensions.get("window").height,
    width: "100%",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#50B4DE",
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: "contain",
  },
  loginBox: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: width * 0.06,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0E1F26",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Biryani-Bold",
  },
  label: {
    color: "#0E1F26",
    marginBottom: 6,
    marginTop: 12,
    fontFamily: "Biryani-Regular",
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
    fontFamily: "Biryani-Bold",
    height: 20,
  },
});
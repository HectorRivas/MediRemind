import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function Header({ onSettingsPress }: { onSettingsPress: () => void }) {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>MediRemind</Text>
      </View>

      <TouchableOpacity onPress={onSettingsPress}>
        <Ionicons name="add-circle-outline" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: "Sansation-Bold",
    color: "white",
  },
});

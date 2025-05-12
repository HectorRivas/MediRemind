import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Platform,
  Text,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/Header';
import NextMedicationCard from '@/components/NextMedicationCard';
import TodayMedicationStatus from '@/components/TodayMedicationStatus';
import MedicationHistoryCalendar from '@/components/MedicationHistoryCalendar';
import ActiveRemindersList from '@/components/ActiveRemindersList';

export default function DashboardScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#2A7B9B', '#87CEEB', '#ADD8E6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.linearGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="px-5 py-4 w-full flex">
              <Header onSettingsPress={() => setSettingsVisible(true)} />
              <NextMedicationCard />
              <TodayMedicationStatus />
              <MedicationHistoryCalendar />
              <ActiveRemindersList />
            </View>
          </ScrollView>

          {/* Modal de ajustes */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={settingsVisible}
            onRequestClose={() => setSettingsVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Ajustes</Text>
                {/* Aquí puedes agregar opciones reales */}
                <Pressable
                  onPress={() => setSettingsVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
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
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2A7B9B',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

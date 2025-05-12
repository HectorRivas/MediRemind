import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Platform, Text, Modal, TextInput, Button, Pressable } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";
import NextMedicationCard from "@/components/NextMedicationCard";
import TodayMedicationStatus from "@/components/TodayMedicationStatus";
import MedicationHistoryCalendar from "@/components/MedicationHistoryCalendar";
import ActiveRemindersList from "@/components/ActiveRemindersList";

export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [reminderData, setReminderData] = useState<any>(null);

  const openSettingsModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeSettingsModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleTextInput = (text: string) => {
    setInputText(text);
  };

  const handleGenerateReminder = async () => {
    const reminder = await generateReminderFromAI(inputText);
    setReminderData(reminder);
    setModalVisible(false);  // Cerrar modal después de procesar el recordatorio
  };

  const generateReminderFromAI = async (text: string) => {
    try {
      // Llamada al backend o la API de OpenAI para interpretar el texto
      const response = await fetch("TU_BACKEND_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: text }),
      });

      const data = await response.json();
      return data; // Aquí regresas los datos procesados
    } catch (error) {
      console.error("Error generando recordatorio:", error);
      return null;
    }
  };

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
              <Header onSettingsPress={openSettingsModal} />
              <NextMedicationCard />
              <TodayMedicationStatus />
              <MedicationHistoryCalendar />
              <ActiveRemindersList />
            </View>
          </ScrollView>

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeSettingsModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Agregar Recordatorio Asistido por IA</Text>

                {/* Formulario de entrada de texto */}
                <TextInput
                  value={inputText}
                  onChangeText={handleTextInput}
                  style={styles.textInput}
                  placeholder="Escribe tu recordatorio..."
                />

                <Button title="Generar Recordatorio" onPress={handleGenerateReminder} />

                {/* Mostrar el recordatorio generado */}
                {reminderData && (
                  <View style={styles.reminderResult}>
                    <Text>Medicamento: {reminderData.medicamento}</Text>
                    <Text>Dosis: {reminderData.dosis}</Text>
                    <Text>Frecuencia: {reminderData.frecuencia}</Text>
                    <Text>Duración: {reminderData.duracion}</Text>
                  </View>
                )}

                <Pressable onPress={closeSettingsModal} style={styles.closeButton}>
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
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    minHeight: 200,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  reminderResult: {
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: '#ccc',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2A7B9B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

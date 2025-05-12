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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openSettingsModal = useCallback(() => setModalVisible(true), []);
  const closeSettingsModal = useCallback(() => setModalVisible(false), []);

  const handleTextInput = (text: string) => setInputText(text);

  const handleGenerateReminder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://192.168.100.81:3000/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const reminderText = data.reminder || '';

        // Intenta extraer los datos del texto generado (esto depende del formato que tu backend devuelve)
        const medicamento = /Medicamento:\s*(.*)/i.exec(reminderText)?.[1] || '';
        const dosis = /Dosis:\s*(.*)/i.exec(reminderText)?.[1] || '';
        const frecuencia = /Frecuencia:\s*(.*)/i.exec(reminderText)?.[1] || '';
        const duracion = /Duración:\s*(.*)/i.exec(reminderText)?.[1] || '';

        setReminderData({ medicamento, dosis, frecuencia, duracion });
      } else {
        throw new Error(data.message || 'Respuesta no válida del servidor');
      }
    } catch (err) {
      console.error("Error generando recordatorio:", err);
      setError('Hubo un error generando el recordatorio. Intenta nuevamente.');
    }

    setLoading(false);
    setModalVisible(false);
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

                <TextInput
                  value={inputText}
                  onChangeText={handleTextInput}
                  style={styles.textInput}
                  placeholder="Escribe tu recordatorio..."
                />

                <Button
                  title={loading ? 'Generando...' : 'Generar Recordatorio'}
                  onPress={handleGenerateReminder}
                  disabled={loading}
                />

                {reminderData && (
                  <View style={styles.reminderResult}>
                    <Text>Medicamento: {reminderData.medicamento}</Text>
                    <Text>Dosis: {reminderData.dosis}</Text>
                    <Text>Frecuencia: {reminderData.frecuencia}</Text>
                    <Text>Duración: {reminderData.duracion}</Text>
                  </View>
                )}

                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
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
  linearGradient: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === "android" ? 30 : 0 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, minHeight: 200 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  textInput: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
  reminderResult: { marginTop: 20, borderTopWidth: 1, paddingTop: 10, borderColor: '#ccc' },
  errorContainer: { marginTop: 20, backgroundColor: '#f8d7da', padding: 10, borderRadius: 5 },
  errorText: { color: '#721c24', fontWeight: 'bold' },
  closeButton: { marginTop: 20, backgroundColor: '#2A7B9B', padding: 12, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
});

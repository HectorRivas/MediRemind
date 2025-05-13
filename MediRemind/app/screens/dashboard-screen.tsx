import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Platform, Text, Modal, TextInput, Button, Pressable } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";
import NextMedicationCard from "@/components/NextMedicationCard";
import TodayMedicationStatus from "@/components/TodayMedicationStatus";
import MedicationHistoryCalendar from "@/components/MedicationHistoryCalendar";
import ActiveRemindersList from "@/components/ActiveRemindersList";
import MedicationReminderSystem from '@/components/MedicationReminderSystem';

// Interfaz para definir la estructura de un recordatorio de medicación
interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  takenTimes: Date[];
}

export default function DashboardScreen() {
  // Estados para manejar el modal, texto de entrada, recordatorio actual, carga y errores
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [currentSchedule, setCurrentSchedule] = useState<MedicationSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funciones para abrir y cerrar el modal
  const openSettingsModal = useCallback(() => setModalVisible(true), []);
  const closeSettingsModal = useCallback(() => setModalVisible(false), []);

  // Manejar cambios en el texto de entrada
  const handleTextInput = (text: string) => setInputText(text);

  // Función para generar un recordatorio asistido por IA
  const handleGenerateReminder = async () => {
    setLoading(true);
    setError(null);

    try {
      // Llamada a la API para generar el recordatorio
      const response = await fetch('http://192.168.100.81:3000/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const reminderText = data.reminder || '';

        // Extraer datos del recordatorio generado
        const medicamento = /Medicamento:\s*(.*)/i.exec(reminderText)?.[1]?.trim() || 'Sin nombre';
        const dosis = /Dosis:\s*(.*)/i.exec(reminderText)?.[1]?.trim() || 'Sin dosis especificada';
        const frecuencia = /Frecuencia:\s*(.*)/i.exec(reminderText)?.[1]?.trim() || 'Sin frecuencia';
        const duracion = /Duración:\s*(.*)/i.exec(reminderText)?.[1]?.trim() || 'Sin duración';

        // Crear un nuevo recordatorio
        const newSchedule: MedicationSchedule = {
          id: Date.now().toString(),
          name: medicamento,
          dosage: dosis,
          frequency: frecuencia,
          startDate: new Date(),
          takenTimes: []
        };

        setCurrentSchedule(newSchedule);
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

  // Función para marcar una dosis como tomada
  const handleMarkAsTaken = (scheduleId: string, time: Date) => {
    if (!currentSchedule) return;

    setCurrentSchedule({
      ...currentSchedule,
      takenTimes: [...currentSchedule.takenTimes, time]
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#2A7B9B', '#87CEEB', '#ADD8E6']} style={styles.linearGradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.container}>
              {/* Sistema de recordatorios de medicación */}
              <MedicationReminderSystem />
              {/* Encabezado con botón de configuración */}
              <Header onSettingsPress={openSettingsModal} />

              {/* Tarjeta para mostrar el próximo medicamento */}
              <NextMedicationCard schedule={currentSchedule} />

              {/* Estado de medicamentos tomados y pendientes */}
              <TodayMedicationStatus schedule={currentSchedule} />

              {/* Calendario del historial de medicación */}
              <MedicationHistoryCalendar schedule={currentSchedule} />

              {/* Lista de recordatorios activos */}
              <ActiveRemindersList
                schedules={currentSchedule ? [currentSchedule] : []}
                onMarkAsTaken={handleMarkAsTaken}
              />
            </View>
          </ScrollView>

          {/* Modal para agregar un nuevo recordatorio */}
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
                  multiline
                />

                <Button
                  title={loading ? 'Generando...' : 'Generar Recordatorio'}
                  onPress={handleGenerateReminder}
                  disabled={loading || !inputText.trim()}
                />

                {currentSchedule && (
                  <View style={styles.reminderResult}>
                    <Text>Medicamento: {currentSchedule.name}</Text>
                    <Text>Dosis: {currentSchedule.dosage}</Text>
                    <Text>Frecuencia: {currentSchedule.frequency}</Text>
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
  linearGradient: {
    flex: 1
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%'
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    minHeight: 200
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 100,
    textAlignVertical: 'top'
  },
  reminderResult: {
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: '#ccc'
  },
  errorContainer: {
    marginTop: 20,
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5
  },
  errorText: {
    color: '#721c24',
    fontWeight: 'bold'
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2A7B9B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
});
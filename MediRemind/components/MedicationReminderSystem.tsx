import React, { useEffect, useState, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import {
  setupNotificationHandler,
  registerForPushNotifications,
  scheduleLocalNotification,
  cancelAllScheduledNotifications,
} from './NotificationService';

interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // Ejemplo: "8h"
  startDate: Date;
  takenTimes: Date[];
}

export default function MedicationReminderSystem() {
  // Estado para almacenar los horarios de medicación
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  // Estado para la próxima medicación
  const [nextMedication, setNextMedication] = useState<MedicationSchedule | null>(null);
  // Estado para mostrar una alerta
  const [showAlert, setShowAlert] = useState(false);
  // Referencia al estado actual de la aplicación
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    // Configura el manejador de notificaciones
    setupNotificationHandler();
    // Solicita permisos para notificaciones push
    registerForPushNotifications();
    // Configura los listeners de notificaciones
    const removeListeners = setupNotificationListeners();

    return () => {
      // Cancela todas las notificaciones programadas al desmontar
      cancelAllScheduledNotifications();
      removeListeners();
    };
  }, []);

  // Programa recordatorios de medicación
  const scheduleMedicationReminders = async (schedule: MedicationSchedule) => {
    const hoursInterval = parseInt(schedule.frequency.match(/\d+/)?.[0] || '8', 10);
    let nextDose = dayjs(schedule.startDate);

    // Cancela todas las notificaciones existentes
    await cancelAllScheduledNotifications();

    // Programa las próximas 5 dosis
    for (let i = 0; i < 5; i++) {
      const dateObj = nextDose.toDate();

      await scheduleLocalNotification(
        `Hora de tu medicación: ${schedule.name}`, // Título de la notificación
        `Toma ${schedule.dosage} según lo programado`, // Cuerpo de la notificación
        {
          type: 'calendar',
          year: dateObj.getFullYear(),
          month: dateObj.getMonth() + 1,
          day: dateObj.getDate(),
          hour: dateObj.getHours(),
          minute: dateObj.getMinutes(),
          second: dateObj.getSeconds(),
          repeats: false,
        } as Notifications.NotificationTriggerInput,
        { medId: schedule.id } // Datos adicionales para identificar la medicación
      );

      // Calcula la siguiente dosis
      nextDose = nextDose.add(hoursInterval, 'hour');
    }
  };

  // Configura los listeners para las notificaciones
  const setupNotificationListeners = () => {
    // Listener para cuando se recibe una notificación
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const medId = notification.request.content.data.medId;
      const found = schedules.find(s => s.id === medId);
      if (found) {
        setNextMedication(found);
        setShowAlert(true);
      }
    });

    // Listener para cambios en el estado de la aplicación
    const appStateSub = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      appStateSub.remove();
    };
  };

  // Maneja los cambios en el estado de la aplicación
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active' &&
      nextMedication
    ) {
      setShowAlert(true);
    }
    appState.current = nextAppState;
  };

  // Confirma que la medicación ha sido tomada
  const confirmMedicationTaken = () => {
    if (!nextMedication) return;

    // Actualiza el estado de las medicaciones
    const updated = schedules.map(s =>
      s.id === nextMedication.id
        ? { ...s, takenTimes: [...s.takenTimes, new Date()] }
        : s
    );

    setSchedules(updated);
    setShowAlert(false);
    // Reprograma los recordatorios
    scheduleMedicationReminders(nextMedication);
    // Redirige al usuario a la pantalla principal
    router.replace('/');
  };

  useEffect(() => {
    // Muestra una alerta cuando es hora de tomar la medicación
    if (showAlert && nextMedication) {
      Alert.alert(
        '¡Hora de tu medicación!', // Título de la alerta
        `Es hora de tomar ${nextMedication.name} (${nextMedication.dosage})`, // Mensaje de la alerta
        [
          { text: 'Lo tomaré más tarde', style: 'cancel', onPress: () => setShowAlert(false) },
          { text: 'Confirmar', onPress: confirmMedicationTaken }
        ],
        { cancelable: false }
      );
    }
  }, [showAlert, nextMedication]);

  return null; // Este componente no renderiza nada
}

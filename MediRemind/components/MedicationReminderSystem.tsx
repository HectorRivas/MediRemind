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
  frequency: string; // e.g. "8h"
  startDate: Date;
  takenTimes: Date[];
}

export default function MedicationReminderSystem() {
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [nextMedication, setNextMedication] = useState<MedicationSchedule | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    setupNotificationHandler();
    registerForPushNotifications();
    const removeListeners = setupNotificationListeners();

    return () => {
      cancelAllScheduledNotifications();
      removeListeners();
    };
  }, []);

  const scheduleMedicationReminders = async (schedule: MedicationSchedule) => {
    const hoursInterval = parseInt(schedule.frequency.match(/\d+/)?.[0] || '8', 10);
    let nextDose = dayjs(schedule.startDate);

    await cancelAllScheduledNotifications();

    for (let i = 0; i < 5; i++) {
      const dateObj = nextDose.toDate();

      await scheduleLocalNotification(
        `Hora de tu medicación: ${schedule.name}`,
        `Toma ${schedule.dosage} según lo programado`,
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
        { medId: schedule.id }
      );


      nextDose = nextDose.add(hoursInterval, 'hour');
    }
  };

  const setupNotificationListeners = () => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const medId = notification.request.content.data.medId;
      const found = schedules.find(s => s.id === medId);
      if (found) {
        setNextMedication(found);
        setShowAlert(true);
      }
    });

    const appStateSub = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      appStateSub.remove();
    };
  };

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

  const confirmMedicationTaken = () => {
    if (!nextMedication) return;

    const updated = schedules.map(s =>
      s.id === nextMedication.id
        ? { ...s, takenTimes: [...s.takenTimes, new Date()] }
        : s
    );

    setSchedules(updated);
    setShowAlert(false);
    scheduleMedicationReminders(nextMedication);
    router.replace('/');
  };

  useEffect(() => {
    if (showAlert && nextMedication) {
      Alert.alert(
        '¡Hora de tu medicación!',
        `Es hora de tomar ${nextMedication.name} (${nextMedication.dosage})`,
        [
          { text: 'Lo tomaré más tarde', style: 'cancel', onPress: () => setShowAlert(false) },
          { text: 'Confirmar', onPress: confirmMedicationTaken }
        ],
        { cancelable: false }
      );
    }
  }, [showAlert, nextMedication]);

  return null;
}

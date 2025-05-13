import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configura el manejador de notificaciones
export const setupNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true, // Muestra una notificación en la parte superior
      shouldShowList: true, // Agrega la notificación a la lista
      shouldPlaySound: true, // Reproduce un sonido al recibir la notificación
      shouldSetBadge: true, // Actualiza el ícono de la aplicación con un contador
    }),
  });
};

// Solicita permisos para notificaciones push
export const registerForPushNotifications = async (): Promise<string | null> => {
  // Verifica si la aplicación está corriendo en Expo Go
  if (Constants.appOwnership === 'expo') {
    console.warn('No se pueden usar notificaciones push en Expo Go. Usa un development build.');
    return null;
  }

  // Obtiene el estado actual de los permisos
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Si no se han concedido permisos, solicita al usuario
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Si los permisos no son concedidos, muestra un mensaje de advertencia
  if (finalStatus !== 'granted') {
    console.warn('Permiso para notificaciones no concedido');
    return null;
  }

  // Obtiene el token de notificación push
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Token de notificación:', token);

  // Configura el canal de notificaciones para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medication-reminders', {
      name: 'Recordatorios de medicación', // Nombre del canal
      importance: Notifications.AndroidImportance.HIGH, // Alta prioridad
      sound: 'default', // Sonido predeterminado
    });
  }

  return token;
};

// Programa una notificación local
export const scheduleLocalNotification = async (
  title: string, // Título de la notificación
  body: string, // Cuerpo de la notificación
  trigger: Notifications.NotificationTriggerInput, // Configuración del disparador
  data?: Record<string, any> // Datos adicionales opcionales
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title, // Título de la notificación
      body, // Cuerpo de la notificación
      sound: true, // Reproduce un sonido
      priority: 'high', // Alta prioridad
      data: data || {}, // Datos adicionales
    },
    trigger, // Configuración del disparador
  });
};

// Cancela todas las notificaciones programadas
export const cancelAllScheduledNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
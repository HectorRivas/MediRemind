import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

declare global {
  var isDarkMode: boolean;
}

interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // Frecuencia en formato como "8h"
  startDate: Date; // Fecha de inicio del medicamento
  takenTimes: Date[]; // Lista de fechas y horas en las que se tomó el medicamento
}

interface TodayMedicationStatusProps {
  schedule?: MedicationSchedule | null; // Horario del medicamento (opcional)
}

export default function TodayMedicationStatus({ schedule }: TodayMedicationStatusProps) {
  // Función para calcular las dosis tomadas y pendientes para hoy
  const calculateMedicationStatus = () => {
    if (!schedule) return { taken: 0, remaining: 0 }; // Si no hay horario, devuelve 0

    const today = dayjs().startOf('day'); // Inicio del día actual
    const hoursInterval = parseInt(schedule.frequency.match(/\d+/)?.[0] ?? '8') || 8; // Intervalo en horas

    // Lista para almacenar las dosis programadas para hoy
    const todayDoses: dayjs.Dayjs[] = [];
    let currentDose = dayjs(schedule.startDate);

    // Ajusta la dosis inicial al inicio del día actual si es necesario
    if (currentDose.isBefore(today)) {
      currentDose = today;
    }

    // Genera las dosis programadas hasta el final del día
    while (currentDose.isBefore(today.endOf('day'))) {
      todayDoses.push(currentDose);
      currentDose = currentDose.add(hoursInterval, 'hour'); // Incrementa por el intervalo
    }

    // Calcula cuántas dosis se han tomado
    const taken = schedule.takenTimes.filter(t =>
      todayDoses.some(dose => dayjs(t).isSame(dose, 'hour')) // Verifica si la hora coincide
    ).length;

    // Calcula las dosis restantes
    const remaining = todayDoses.length - taken;

    return { taken, remaining }; // Devuelve las dosis tomadas y pendientes
  };

  // Obtiene las dosis tomadas y pendientes
  const { taken, remaining } = calculateMedicationStatus();

  return (
    <View style={styles.container}>
      {/* Tarjeta para mostrar las dosis tomadas */}
      <View style={[styles.card, global.isDarkMode && styles.cardDark]}>
        <Text style={[styles.number, global.isDarkMode && styles.numberDark]}>
          {taken}
        </Text>
        <Text style={[styles.label, global.isDarkMode && styles.labelDark]}>
          tomados
        </Text>
      </View>

      {/* Tarjeta para mostrar las dosis restantes */}
      <View style={[styles.card, global.isDarkMode && styles.cardDark]}>
        <Text style={[styles.number, global.isDarkMode && styles.numberDark]}>
          {remaining}
        </Text>
        <Text style={[styles.label, global.isDarkMode && styles.labelDark]}>
          restantes
        </Text>
      </View>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Coloca las tarjetas en fila
    gap: 12, // Espaciado entre las tarjetas
    marginTop: 16, // Margen superior
    marginHorizontal: 16, // Margen horizontal
  },
  card: {
    flex: 1, // Cada tarjeta ocupa el mismo espacio
    backgroundColor: '#F0FDFA', // Fondo claro
    paddingVertical: 16, // Espaciado vertical interno
    borderRadius: 16, // Bordes redondeados
    alignItems: 'center', // Centra el contenido horizontalmente
    justifyContent: 'center', // Centra el contenido verticalmente
    elevation: 2, // Sombra para Android
  },
  cardDark: {
    backgroundColor: '#1E293B', // Fondo oscuro para modo oscuro
  },
  number: {
    fontSize: 24, // Tamaño de fuente grande
    fontWeight: '700', // Texto en negrita
    color: '#14B8A6', // Color verde azulado
  },
  numberDark: {
    color: '#5EEAD4', // Color verde claro para modo oscuro
  },
  label: {
    fontSize: 14, // Tamaño de fuente pequeño
    color: '#374151', // Color gris oscuro
    marginTop: 4, // Espaciado superior
  },
  labelDark: {
    color: '#CBD5E1', // Color gris claro para modo oscuro
  },
});
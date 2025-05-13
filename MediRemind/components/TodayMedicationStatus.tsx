import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

declare global {
  var isDarkMode: boolean;
}

interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  takenTimes: Date[];
}

interface TodayMedicationStatusProps {
  schedule?: MedicationSchedule | null;
}

export default function TodayMedicationStatus({ schedule }: TodayMedicationStatusProps) {
  // Calcular dosis tomadas y pendientes para hoy
  const calculateMedicationStatus = () => {
    if (!schedule) return { taken: 0, remaining: 0 };

    const today = dayjs().startOf('day');
    const hoursInterval = parseInt(schedule.frequency.match(/\d+/)?.[0] ?? '8') || 8;

    // Calcular todas las dosis de hoy
    const todayDoses: dayjs.Dayjs[] = [];
    let currentDose = dayjs(schedule.startDate);

    // Ajustar al inicio del día actual si es necesario
    if (currentDose.isBefore(today)) {
      currentDose = today;
    }

    // Generar dosis hasta el final del día
    while (currentDose.isBefore(today.endOf('day'))) {
      todayDoses.push(currentDose);
      currentDose = currentDose.add(hoursInterval, 'hour');
    }

    // Verificar cuáles se han tomado
    const taken = schedule.takenTimes.filter(t =>
      todayDoses.some(dose => dayjs(t).isSame(dose, 'hour'))
    ).length;

    const remaining = todayDoses.length - taken;

    return { taken, remaining };
  };

  const { taken, remaining } = calculateMedicationStatus();

  return (
    <View style={styles.container}>
      {/* Tarjeta de medicamentos tomados */}
      <View style={[styles.card, global.isDarkMode && styles.cardDark]}>
        <Text style={[styles.number, global.isDarkMode && styles.numberDark]}>
          {taken}
        </Text>
        <Text style={[styles.label, global.isDarkMode && styles.labelDark]}>
          tomados
        </Text>
      </View>

      {/* Tarjeta de medicamentos restantes */}
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

// Estilos se mantienen igual
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginHorizontal: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1E293B',
  },
  number: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14B8A6',
  },
  numberDark: {
    color: '#5EEAD4',
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
  labelDark: {
    color: '#CBD5E1',
  },
});
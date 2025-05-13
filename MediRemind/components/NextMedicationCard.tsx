import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
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

interface NextMedicationCardProps {
  schedule?: MedicationSchedule | null;
}

export default function NextMedicationCard({ schedule }: NextMedicationCardProps) {
  // Estado para el progreso del círculo
  const [fill, setFill] = useState(0);
  // Estado para la próxima dosis
  const [nextTime, setNextTime] = useState({
    time: '--:--', // Hora de la próxima dosis
    period: '', // AM o PM
    nextDose: null as dayjs.Dayjs | null, // Objeto de la próxima dosis
  });
  // Referencia para el intervalo de actualización
  const intervalRef = useRef<number | null>(null);

  // Calcula la próxima dosis y actualiza el progreso
  const calculateNextDose = useCallback(() => {
    if (!schedule) {
      setNextTime({ time: '--:--', period: '', nextDose: null });
      setFill(0);
      return;
    }

    const now = dayjs(); // Hora actual
    const hoursInterval = parseInt(schedule.frequency.match(/\d+/)?.[0] ?? '8') || 8; // Intervalo en horas
    let nextDose = dayjs(schedule.startDate);

    // Encuentra la próxima dosis no tomada
    while (nextDose.isBefore(now)) {
      const wasTaken = schedule.takenTimes.some(
        t => dayjs(t).isSame(nextDose, 'hour')
      );
      if (!wasTaken) break;
      nextDose = nextDose.add(hoursInterval, 'hour');
    }

    // Calcula la dosis anterior para determinar el progreso
    let prevDose = nextDose.subtract(hoursInterval, 'hour');
    if (prevDose.isBefore(dayjs(schedule.startDate))) {
      prevDose = dayjs(schedule.startDate);
    }

    // Formatea la hora de la próxima dosis
    const displayHour = nextDose.hour() % 12 || 12; // Convierte a formato de 12 horas
    const period = nextDose.hour() >= 12 ? 'PM' : 'AM';

    setNextTime({
      time: `${displayHour}:${nextDose.minute().toString().padStart(2, '0')}`,
      period,
      nextDose,
    });

    // Calcula el porcentaje de progreso
    const totalMillis = nextDose.diff(prevDose); // Tiempo total entre dosis
    const elapsedMillis = now.diff(prevDose); // Tiempo transcurrido desde la dosis anterior
    const percent = (elapsedMillis / totalMillis) * 100;

    setFill(Math.min(Math.max(percent, 0), 100)); // Asegura que el porcentaje esté entre 0 y 100
  }, [schedule]);

  // Configura un intervalo para actualizar el progreso cada minuto
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    calculateNextDose();
    intervalRef.current = setInterval(calculateNextDose, 60000); // Actualiza cada 60 segundos
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [calculateNextDose]);

  return (
    <View style={[styles.card, global.isDarkMode && { backgroundColor: '#1F2937' }]}>
      {/* Encabezado del próximo medicamento */}
      <View style={styles.nextMedicationHeader}>
        <Text style={[styles.nextMedicationText, global.isDarkMode && { color: '#F9FAFB' }]}>
          Próximo Medicamento
        </Text>
      </View>

      {/* Contenedor de información del medicamento */}
      <View style={styles.medicationInfoContainer}>
        {/* Círculo de progreso animado */}
        <AnimatedCircularProgress
          size={70}
          width={6}
          fill={fill}
          tintColor={fill >= 100 ? '#EF4444' : '#22d3ee'} // Rojo si está atrasado
          backgroundColor="#e2e8f0"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.progressContainer}>
              <Text style={[styles.timeText, fill >= 100 && styles.timeTextLate]}>
                {nextTime.time}
              </Text>
              <Text style={[styles.amPmText, global.isDarkMode && { color: '#D1D5DB' }]}>
                {nextTime.period}
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>

        {/* Detalles del medicamento */}
        <View style={styles.detailsContainer}>
          <Text style={[styles.medicationName, global.isDarkMode && { color: '#F9FAFB' }]}>
            {schedule?.name || 'No hay medicación'}
          </Text>
          <Text style={[styles.dosage, global.isDarkMode && { color: '#D1D5DB' }]}>
            {schedule?.dosage || 'Agrega un recordatorio'}
          </Text>

          {/* Barra de progreso */}
          <View style={[styles.progressBarBackground, global.isDarkMode && { backgroundColor: '#374151' }]}>
            <View style={[
              styles.progressBarFill,
              { width: `${fill}%` },
              fill >= 100 && styles.progressBarFillLate,
            ]} />
          </View>

          {/* Frecuencia del medicamento */}
          {schedule && (
            <Text style={styles.frequencyText}>
              Cada {schedule.frequency}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 16,
    marginHorizontal: 16,
    gap: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  nextMedicationHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextMedicationText: {
    color: '#111827',
    fontSize: 20,
    fontStyle: 'italic',
    fontFamily: 'Sansation-BoldItalic',
  },
  medicationInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#06b6d4',
  },
  timeTextLate: {
    color: '#EF4444', // Rojo si está atrasado
  },
  amPmText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 24,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  dosage: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 9999,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: '#22D3EE',
    borderRadius: 9999,
    height: '100%',
  },
  progressBarFillLate: {
    backgroundColor: '#EF4444', // Rojo si está atrasado
  },
  frequencyText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
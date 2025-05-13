import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

interface ActiveRemindersListProps {
  schedules?: MedicationSchedule[];
  onMarkAsTaken?: (scheduleId: string, time: Date) => void;
}

// Función para calcular las próximas dosis de un medicamento
const calculateNextDoses = (schedule: MedicationSchedule) => {
  const now = dayjs();
  const hoursInterval = parseInt(schedule.frequency.match(/\d+/)?.[0] ?? '8');
  let nextDose = dayjs(schedule.startDate);
  const nextDoses: dayjs.Dayjs[] = [];

  // Encuentra las próximas 3 dosis no tomadas
  while (nextDoses.length < 3) {
    const wasTaken = schedule.takenTimes.some(t =>
      dayjs(t).isSame(nextDose, 'hour')
    );

    if (!wasTaken && nextDose.isAfter(now.subtract(1, 'hour'))) {
      nextDoses.push(nextDose);
    }

    nextDose = nextDose.add(hoursInterval, 'hour');
  }

  return nextDoses;
};

export default function ActiveRemindersList({
  schedules = [],
  onMarkAsTaken
}: ActiveRemindersListProps) {
  // Procesa los horarios para calcular las próximas dosis y su estado
  const processedSchedules = useMemo(() => {
    return schedules.map(schedule => {
      const nextDoses = calculateNextDoses(schedule);
      const formattedTimes = nextDoses.map(dose => {
        const displayHour = dose.hour() % 12 || 12;
        const period = dose.hour() >= 12 ? 'PM' : 'AM';
        return `${displayHour}:${dose.minute().toString().padStart(2, '0')} ${period}`;
      });

      return {
        ...schedule,
        nextDoses,
        formattedTimes,
        status: nextDoses[0] && dayjs().isAfter(nextDoses[0]) ? 'vencido' :
          schedule.takenTimes.length > 0 ? 'tomado' : 'pendiente'
      };
    });
  }, [schedules]);

  // Maneja la acción de marcar un medicamento como tomado
  const handleMarkAsTaken = (scheduleId: string, doseTime: Date) => {
    onMarkAsTaken?.(scheduleId, doseTime);
  };

  return (
    <View style={[styles.container]}>
      {/* Título de la lista */}
      <Text style={[styles.title, global.isDarkMode && styles.titleDark]}>
        Medicamentos Activos
      </Text>

      {/* Si no hay medicamentos activos */}
      {processedSchedules.length === 0 ? (
        <View style={[styles.emptyCard, global.isDarkMode && styles.emptyCardDark]}>
          <Text style={[styles.emptyText, global.isDarkMode && styles.emptyTextDark]}>
            No hay medicamentos activos
          </Text>
        </View>
      ) : (
        // Lista de medicamentos activos
        processedSchedules.map((schedule) => (
          <View key={schedule.id} style={[styles.card, global.isDarkMode && styles.cardDark]}>
            {/* Icono de estado del medicamento */}
            <Ionicons
              name={schedule.status === 'tomado' ? 'checkmark-circle' :
                schedule.status === 'vencido' ? 'alert-circle' : 'time'}
              size={24}
              color={schedule.status === 'tomado' ? '#22C55E' :
                schedule.status === 'vencido' ? '#EF4444' : '#FACC15'}
            />

            {/* Información del medicamento */}
            <View style={styles.info}>
              <Text style={[styles.name, global.isDarkMode && styles.nameDark]}>
                {schedule.name} - {schedule.dosage}
              </Text>
              <Text style={[
                styles.time,
                global.isDarkMode && styles.timeDark,
                schedule.status === 'vencido' && styles.timeLate
              ]}>
                Próxima: {schedule.formattedTimes[0] || '--:-- --'}
              </Text>
              <Text style={[styles.time, global.isDarkMode && styles.timeDark]}>
                Siguientes: {schedule.formattedTimes.slice(1).join(', ') || 'Ninguna'}
              </Text>
            </View>

            {/* Botón para marcar como tomado */}
            <TouchableOpacity
              onPress={() => handleMarkAsTaken(schedule.id, schedule.nextDoses[0].toDate())}
              style={[
                styles.statusButton,
                schedule.status === 'tomado' && styles.statusButtonTaken,
                schedule.status === 'vencido' && styles.statusButtonLate
              ]}
              disabled={schedule.status === 'tomado'}
            >
              <Text style={styles.statusButtonText}>
                {schedule.status === 'tomado' ? 'Tomado' :
                  schedule.status === 'vencido' ? '¡Tomar ahora!' : 'Marcar'}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}

// Estilos para la lista de recordatorios activos
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  titleDark: {
    color: '#F9FAFB',
  },
  emptyCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyCardDark: {
    backgroundColor: '#374151',
  },
  emptyText: {
    color: '#6B7280',
    fontStyle: 'italic',
  },
  emptyTextDark: {
    color: '#9CA3AF',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  cardDark: {
    backgroundColor: '#374151',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Sansation-Bold',
  },
  nameDark: {
    color: '#F9FAFB',
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeDark: {
    color: '#D1D5DB',
  },
  timeLate: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#22D3EE',
  },
  statusButtonTaken: {
    backgroundColor: '#22C55E',
  },
  statusButtonLate: {
    backgroundColor: '#EF4444',
  },
  statusButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
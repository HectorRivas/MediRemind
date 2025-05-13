import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

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

interface MedicationHistoryCalendarProps {
  schedule?: MedicationSchedule | null;
}

export default function MedicationHistoryCalendar({ schedule }: MedicationHistoryCalendarProps) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [days, setDays] = useState<{
    date: Date;
    dayNumber: number;
    dayName: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isCompleted: boolean;
    dosesTaken: number;
  }[]>([]);

  // Calcular días completados basados en el schedule
  useEffect(() => {
    if (!schedule) return;

    const startOfWeek = currentDate.startOf('week');
    const daysArray = [];

    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.add(i, 'day');
      const dayDate = day.toDate();
      const dayNumber = day.date();
      const isToday = day.isSame(dayjs(), 'day');
      const isSelected = day.isSame(selectedDate, 'day');

      // Calcular cuántas dosis se tomaron este día
      const dosesTaken = schedule.takenTimes.filter(takenTime =>
        dayjs(takenTime).isSame(day, 'day')
      ).length;

      // Considerar completado si se tomó al menos una dosis
      const isCompleted = dosesTaken > 0;

      daysArray.push({
        date: dayDate,
        dayNumber,
        dayName: day.format('dd')[0],
        isCurrentMonth: day.month() === currentDate.month(),
        isToday,
        isSelected,
        isCompleted,
        dosesTaken
      });
    }

    setDays(daysArray);
  }, [currentDate, selectedDate, schedule]);

  const handleDayPress = (date: Date) => {
    setSelectedDate(dayjs(date));
  };

  const handlePrevWeek = () => {
    setCurrentDate(currentDate.subtract(1, 'week'));
  };

  const handleNextWeek = () => {
    setCurrentDate(currentDate.add(1, 'week'));
  };

  return (
    <View style={[styles.card, global.isDarkMode && styles.cardDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, global.isDarkMode && styles.titleDark]}>
          {currentDate.format('MMMM YYYY')}
        </Text>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={handlePrevWeek}>
            <Text style={styles.navButton}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextWeek}>
            <Text style={styles.navButton}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekContainer}>
        {days.map((day, index) => (
          <Text
            key={`day-${index}`}
            style={[styles.dayLabel, global.isDarkMode && styles.dayLabelDark]}
          >
            {day.dayName}
          </Text>
        ))}
      </View>

      <View style={styles.dayNumbersContainer}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={`date-${index}`}
            onPress={() => handleDayPress(day.date)}
            style={styles.dayItem}
          >
            <View
              style={[
                styles.dayCircle,
                day.isToday && styles.currentDayCircle,
                day.isSelected && styles.selectedDayCircle,
                global.isDarkMode && day.isToday && styles.currentDayCircleDark,
                global.isDarkMode && day.isSelected && styles.selectedDayCircleDark,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  !day.isCurrentMonth && styles.otherMonthDay,
                  global.isDarkMode && styles.dayNumberDark,
                  day.isToday && styles.dayNumberToday,
                  day.isSelected && styles.dayNumberSelected,
                ]}
              >
                {day.dayNumber}
              </Text>
              {day.dosesTaken > 0 && (
                <Text style={styles.dosesTakenText}>{day.dosesTaken}</Text>
              )}
            </View>
            <View
              style={[
                styles.dot,
                day.isCompleted && styles.completedDot,
                global.isDarkMode && styles.dotDark,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Estilos actualizados
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
    color: '#111827',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  navigation: {
    flexDirection: 'row',
    gap: 16,
  },
  navButton: {
    fontSize: 20,
    color: '#22D3EE',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'Sansation-Regular',
    color: '#6B7280',
    flex: 1,
    textAlign: 'center',
  },
  dayLabelDark: {
    color: '#9CA3AF',
  },
  dayNumbersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  currentDayCircle: {
    backgroundColor: '#A5F3FC',
  },
  currentDayCircleDark: {
    backgroundColor: '#164E63',
  },
  selectedDayCircle: {
    backgroundColor: '#22D3EE',
  },
  selectedDayCircleDark: {
    backgroundColor: '#0891B2',
  },
  dayNumber: {
    fontSize: 14,
    fontFamily: 'Sansation-Regular',
    color: '#111827',
  },
  dayNumberDark: {
    color: '#F9FAFB',
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  dayNumberToday: {
    fontFamily: 'Sansation-Bold',
    color: '#06B6D4',
  },
  dayNumberSelected: {
    fontFamily: 'Sansation-Bold',
    color: 'white',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  completedDot: {
    backgroundColor: '#22D3EE',
  },
  dotDark: {
    backgroundColor: '#67E8F9',
  },
  dosesTakenText: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#22D3EE',
    color: 'white',
    fontSize: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
    overflow: 'hidden',
  },
});
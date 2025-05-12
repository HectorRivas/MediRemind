import { View, Text, StyleSheet } from 'react-native';

declare global {
  var isDarkMode: boolean;
}

const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const daysOfMonth = [3, 4, 6, 8, 9, 10, 11]; // Días con actividad
const currentDay = 8;

export default function MedicationHistoryCalendar() {
  return (
    <View style={styles.card}>
      <Text style={[styles.title, global.isDarkMode && styles.titleDark]}>Historial</Text>

      <View style={styles.weekContainer}>
        {daysOfWeek.map((day, index) => (
          <Text
            key={index}
            style={[styles.dayLabel, global.isDarkMode && styles.dayLabelDark]}
          >
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.dayNumbersContainer}>
        {daysOfMonth.map((day, index) => {
          const isToday = day === currentDay;
          return (
            <View key={index} style={styles.dayItem}>
              <View
                style={[
                  styles.dayCircle,
                  isToday && styles.currentDayCircle,
                  global.isDarkMode && isToday && styles.currentDayCircleDark,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    global.isDarkMode && styles.dayNumberDark,
                    isToday && styles.dayNumberToday,
                  ]}
                >
                  {day}
                </Text>
              </View>
              <View
                style={[
                  styles.dot,
                  global.isDarkMode && styles.dotDark,
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

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
  title: {
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  titleDark: {
    color: '#F9FAFB',
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
  },
  currentDayCircle: {
    backgroundColor: '#A5F3FC',
  },
  currentDayCircleDark: {
    backgroundColor: '#164E63',
  },
  dayNumber: {
    fontSize: 14,
    fontFamily: 'Sansation-Regular',
    color: '#111827',
  },
  dayNumberDark: {
    color: '#F9FAFB',
  },
  dayNumberToday: {
    fontFamily: 'Sansation-Bold',
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#22D3EE',
    borderRadius: 3,
    marginTop: 4,
  },
  dotDark: {
    backgroundColor: '#67E8F9',
  },
});
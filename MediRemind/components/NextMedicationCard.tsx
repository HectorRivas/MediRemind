import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import dayjs from 'dayjs';

declare global {
  var isDarkMode: boolean;
}

export default function NextMedicationCard() {
  const [fill, setFill] = useState(0);

  const medicationHour = 22;

  useEffect(() => {
    const updateFill = () => {
      const now = dayjs();
      const totalMinutes = medicationHour * 60;
      const currentMinutes = now.hour() * 60 + now.minute();
      const percent = Math.min((currentMinutes / totalMinutes) * 100, 100);
      setFill(percent);
    };

    updateFill();
    const interval = setInterval(updateFill, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.card, global.isDarkMode && { backgroundColor: '#1F2937' }]}>
      <View style={styles.nextMedicationHeader}>
        <Text style={[styles.nextMedicationText, global.isDarkMode && { color: '#F9FAFB' }]}>
          Próximo Medicamento
        </Text>
      </View>
      <View style={styles.medicationInfoContainer}>
        <AnimatedCircularProgress
          size={70}
          width={6}
          fill={fill}
          tintColor="#22d3ee"
          backgroundColor="#e2e8f0"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>22:00</Text>
              <Text style={[styles.amPmText, global.isDarkMode && { color: '#D1D5DB' }]}>PM</Text>
            </View>
          )}
        </AnimatedCircularProgress>

        <View style={styles.detailsContainer}>
          <Text style={[styles.medicationName, global.isDarkMode && { color: '#F9FAFB' }]}>
            Paracetamol
          </Text>
          <Text style={[styles.dosage, global.isDarkMode && { color: '#D1D5DB' }]}>1 tableta</Text>

          <View style={[styles.progressBarBackground, global.isDarkMode && { backgroundColor: '#374151' }]}>
            <View style={[styles.progressBarFill, { width: `${fill}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

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
});
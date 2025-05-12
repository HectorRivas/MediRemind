import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

declare global {
  var isDarkMode: boolean;
}

const reminders = [
  {
    id: '1',
    name: 'Paracetamol',
    time: '9:00 AM',
    status: 'tomado',
  },
  {
    id: '2',
    name: 'Ibuprofeno',
    time: '2:00 PM',
    status: 'pendiente',
  },
];

export default function ActiveRemindersList() {
  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, global.isDarkMode && styles.titleDark]}>
        Medicamentos de Hoy
      </Text>

      {reminders.map((item) => (
        <View
          key={item.id}
          style={[styles.card, global.isDarkMode && styles.cardDark]}
        >
          <Ionicons
            name={item.status === 'tomado' ? 'checkmark-circle' : 'time'}
            size={24}
            color={item.status === 'tomado' ? '#22C55E' : '#FACC15'}
          />
          <View style={styles.info}>
            <Text
              style={[styles.name, global.isDarkMode && styles.nameDark]}
            >
              {item.name}
            </Text>
            <Text style={[styles.time, global.isDarkMode && styles.timeDark]}>
              {item.time}
            </Text>
          </View>
          <Text
            style={[
              styles.status,
              item.status === 'tomado'
                ? styles.statusTaken
                : styles.statusPending,
            ]}
          >
            {item.status}
          </Text>
        </View>
      ))}
    </View>
  );
}

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
  status: {
    fontSize: 12,
    fontFamily: 'Sansation-Bold',
    textTransform: 'capitalize',
  },
  statusTaken: {
    color: '#22C55E',
  },
  statusPending: {
    color: '#FACC15',
  },
});
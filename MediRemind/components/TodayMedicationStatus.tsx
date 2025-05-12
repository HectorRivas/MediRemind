import { View, Text, StyleSheet } from 'react-native';

declare global {
  var isDarkMode: boolean;
}

export default function TodayMedicationStatus() {
  return (
    <View style={styles.container}>
      <View style={[styles.card, global.isDarkMode && styles.cardDark]}>
        <Text style={[styles.number, global.isDarkMode && styles.numberDark]}>2</Text>
        <Text style={[styles.label, global.isDarkMode && styles.labelDark]}>tomados</Text>
      </View>
      <View style={[styles.card, global.isDarkMode && styles.cardDark]}>
        <Text style={[styles.number, global.isDarkMode && styles.numberDark]}>1</Text>
        <Text style={[styles.label, global.isDarkMode && styles.labelDark]}>restantes</Text>
      </View>
    </View>
  );
}

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
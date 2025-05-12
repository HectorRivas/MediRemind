import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory-native';

export default function TrackProgress() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const data = [
    { x: 7, y: 0 },
    { x: 8, y: 10 },
    { x: 9, y: 20 },
    { x: 10, y: 15 },
    { x: 11, y: 30 },
    { x: 12, y: 25 },
    { x: 13, y: 50 },
  ];

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        Track Progress
      </Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        AI-based on habits
      </Text>

      <VictoryChart
        height={180}
        domainPadding={10}
        padding={{ top: 10, bottom: 40, left: 40, right: 20 }}
      >
        <VictoryAxis
          tickValues={[7, 8, 9, 10, 11, 12, 13]}
          style={{
            tickLabels: {
              fontSize: 10,
              fill: isDark ? '#9CA3AF' : '#6B7280',
            },
            axis: { stroke: isDark ? '#334155' : '#E5E7EB' },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x: any) => `${x}`}
          style={{
            tickLabels: {
              fontSize: 10,
              fill: isDark ? '#9CA3AF' : '#6B7280',
            },
            grid: { stroke: isDark ? '#334155' : '#E5E7EB' },
          }}
        />
        <VictoryLine
          interpolation="natural"
          data={data}
          style={{
            data: { stroke: '#06b6d4', strokeWidth: 3 },
          }}
        />
      </VictoryChart>
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
  cardDark: {
    backgroundColor: '#1F2937',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  titleDark: {
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
    fontFamily: 'Sansation-Regular',
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
});

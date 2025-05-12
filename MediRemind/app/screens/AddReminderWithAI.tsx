import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';

export default function AddReminderWithAI() {
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInterpret = async () => {
    if (!inputText.trim()) {
      return Alert.alert("Campo vacío", "Escribe una indicación médica para interpretar.");
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer TU_API_KEY_AQUI`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Eres un asistente que convierte indicaciones médicas en recordatorios estructurados.",
            },
            {
              role: "user",
              content: `Interpreta esta frase: "${inputText}". Devuélvelo en JSON con los campos: medicamento, dosis, frecuencia, duración.`,
            }
          ],
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      const content = data.choices[0].message.content;

      try {
        const json = JSON.parse(content);
        setParsedData(json);
      } catch (e) {
        Alert.alert("Error", "La IA no devolvió un JSON válido.");
      }
    } catch (error) {
      Alert.alert("Error de red", "No se pudo conectar a la API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recordatorio asistido por IA</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Tomar ibuprofeno 400mg cada 8h por 5 días"
        value={inputText}
        onChangeText={setInputText}
        multiline
      />
      <Button title="Interpretar" onPress={handleInterpret} />

      {loading && <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />}

      {parsedData && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Resultado:</Text>
          <Text>Medicamento: {parsedData.medicamento}</Text>
          <Text>Dosis: {parsedData.dosis}</Text>
          <Text>Frecuencia: {parsedData.frecuencia}</Text>
          <Text>Duración: {parsedData.duracion}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  result: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
});

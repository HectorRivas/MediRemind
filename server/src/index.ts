import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

// Configuración de Gemini (Google AI)
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.use(cors());
app.use(bodyParser.json());

app.post('/generate-reminder', async (req, res) => {
  const { inputText } = req.body;

  try {
    const prompt = `
Eres un asistente médico que genera recordatorios de medicamentos. Basado en esta entrada del usuario:
"${inputText}"

Genera una recomendación con el siguiente formato exacto (sin añadir explicaciones):

Medicamento: <nombre del medicamento>
Dosis: <dosis>
Frecuencia: <frecuencia>
Duración: <duración>
`;

    // Usamos el modelo Gemini Pro (o "gemini-1.5-flash" si prefieres)
    async function main() {
      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
      console.log(response.text);
      return response.text;
    }
    const responseText = await main();
    console.log("Respuesta de Gemini:", responseText);

    res.json({
      success: true,
      reminder: responseText,
    });
  } catch (error) {
    console.error("Error al generar recordatorio con Gemini:", error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el recordatorio.',
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
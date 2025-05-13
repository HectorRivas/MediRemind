import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = 3000;

// Configuración de Gemini (Google AI)
if (!process.env.GEMINI_API_KEY) {
  // Lanza un error si la clave de API no está definida
  throw new Error("GEMINI_API_KEY no está definida en las variables de entorno.");
}

// Inicializa el cliente de Google GenAI con la clave de API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Habilita CORS para permitir solicitudes desde otros dominios
app.use(cors());
// Configura el middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(bodyParser.json());

// Ruta para generar un recordatorio de medicación
app.post('/generate-reminder', async (req, res) => {
  const { inputText } = req.body; // Obtiene el texto de entrada del cuerpo de la solicitud

  try {
    // Prompt que se enviará al modelo de IA para generar el recordatorio
    const prompt = `
Eres un asistente médico que genera recordatorios de medicamentos. Basado en esta entrada del usuario:
"${inputText}"

Genera una recomendación con el siguiente formato exacto (sin añadir explicaciones):

Medicamento: <nombre del medicamento>
Dosis: <dosis>
Frecuencia: <frecuencia>
Duración: <duración>
`;

    // Función principal para interactuar con el modelo de IA
    async function main() {
      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash", // Modelo de IA utilizado
        contents: prompt, // Prompt enviado al modelo
      });
      console.log(response.text); // Muestra la respuesta generada en la consola
      return response.text; // Devuelve el texto generado
    }

    // Llama a la función principal y obtiene la respuesta
    const responseText = await main();
    console.log("Respuesta de Gemini:", responseText);

    // Devuelve la respuesta generada al cliente
    res.json({
      success: true,
      reminder: responseText,
    });
  } catch (error) {
    // Manejo de errores en caso de que falle la generación del recordatorio
    console.error("Error al generar recordatorio con Gemini:", error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el recordatorio.',
    });
  }
});

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const responseText = completion.choices[0].message.content;

    res.json({
      success: true,
      reminder: responseText,
    });
  } catch (error) {
    console.error("Error al generar recordatorio:", error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el recordatorio.',
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});

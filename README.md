# 💊 MediRemind - App de Recordatorios de Medicamentos con IA

MediRemind es una aplicación móvil diseñada para mejorar la adherencia al tratamiento médico a través de recordatorios inteligentes impulsados por IA. El proyecto incluye una app desarrollada con React Native (Expo) y un backend en Node.js + Express.

---

## 🚀 Funcionalidades Principales

- 📆 Recordatorios personalizados generados con lógica de IA basada en hábitos del paciente.
- 🧠 IA básica integrada: recomienda horarios según frecuencia (diaria, cada 8h, etc.).
- 🎮 Gamificación: sistema de puntos y niveles por cumplimiento del tratamiento.
- 📈 Seguimiento de progreso: visualización de avances y estadísticas.
- 🔔 Notificaciones: alertas programadas para tomar los medicamentos.
- 🔐 Autenticación: registro e inicio de sesión con JWT.

---

## 📂 Estructura del Proyecto

### Frontend (React Native + Expo)

MediRemind/
├── app/              # Rutas de navegación con Expo Router  
├── components/       # Componentes reutilizables  
├── services/         # API y lógica de notificaciones  
├── utils/            # Funciones de gamificación, formatos, etc.  

### Backend (Node.js + Express + MongoDB)

mediremind-api/
├── src/
│   ├── routes/       # Rutas: auth, tratamientos, recordatorios  
│   ├── services/     # IA y gamificación  
│   ├── controllers/  # Lógica por ruta (pendiente)  
│   ├── models/       # Esquemas de usuario y tratamientos (pendiente)  
│   └── index.ts

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- React Native  
- Expo Router  
- Axios  
- Expo Notifications

### Backend
- Node.js  
- Express  
- MongoDB + Mongoose  
- dotenv

---

## 🔧 Instalación y Uso

### Clonar el proyecto

git clone https://github.com/HectorRivas/MediRemind.git 
cd MediRemind

### Backend

cd server  
npm install  
cp .env.example .env   # Agrega tu URI de MongoDB  
npm run dev

### Frontend

cd MediRemind 
npm install  
npx expo start

---

## 📜 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado por [Hector Manuel Rivas Tejeda] - [hrivas549@gmail.com]
En colaboración con [Juan Antonio Martínez Alba] - []

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/HectorRivas/MediRemind)

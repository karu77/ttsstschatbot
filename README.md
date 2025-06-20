# Gemini TTS-STT Chatbot

A modern, animated chatbot UI with both Text-to-Speech (TTS) and Speech-to-Text (STT) capabilities, powered by Google Gemini. Supports both voice and text input, voice selection, and beautiful UI/UX.

## Features
- 🎤 Voice input (speech-to-text) and text input
- 🗣️ Text-to-speech with selectable voices
- ✨ Modern, animated, responsive UI (TailwindCSS)
- 🛑 Stop and ▶️ Resume TTS controls
- 🌐 Works in your browser, backend in Python (FastAPI)
- 🔑 Secure API key management with `.env`
- 🚀 One-click start for both backend and frontend

## Setup

### 1. Clone the repository
```bash
https://github.com/karu77/ttsstschatbot.git
cd ttsstschatbot
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```
- Create a `.env` file in the `backend` folder:
  ```env
  GEMINI_API_KEY=your_actual_gemini_api_key_here
  ```

### 3. Frontend Setup
No build step needed! The frontend is pure HTML/JS/CSS (Tailwind via CDN).

### 4. Start Both Servers
From the project root:
```bash
start.bat
```
- Backend: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:8080](http://localhost:8080)

## Usage
- Open the frontend in your browser.
- Click the mic to speak, or type and send a message.
- Select your preferred voice for TTS.
- Use Stop/Resume to control speech output.

## Customization
- Edit `frontend/index.html` and `frontend/app.js` for UI/UX tweaks.
- Change the Gemini model in `backend/main.py` if needed.

## License
MIT 
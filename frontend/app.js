const chatDiv = document.getElementById('chat');
const micBtn = document.getElementById('micBtn');
const statusDiv = document.getElementById('status');
const subtitlesDiv = document.getElementById('subtitles');
const voiceSelect = document.getElementById('voiceSelect');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
const stopBtn = document.getElementById('stopBtn');
const resumeBtn = document.getElementById('resumeBtn');

let recognizing = false;
let recognition;
let voices = [];

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.onstart = () => {
    statusDiv.textContent = "Listening...";
    micBtn.classList.add('animate-pulse-mic');
  };
  recognition.onend = () => {
    statusDiv.textContent = "";
    recognizing = false;
    micBtn.classList.remove('animate-pulse-mic');
  };
  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    addMessage('user', transcript);
    statusDiv.textContent = "Thinking...";
    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text: transcript})
    });
    const data = await res.json();
    const cleaned = cleanTextForTTS(data.reply);
    addMessage('bot', cleaned);
    statusDiv.textContent = "Speaking...";
    speak(cleaned);
  };
}

micBtn.onclick = () => {
  if (!recognizing) {
    recognition.start();
    recognizing = true;
  } else {
    recognition.stop();
    recognizing = false;
  }
};

function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = (sender === 'user' ? 'text-right text-blue-700' : 'text-left text-green-700') + ' animate-fadein transition-all mb-2';
  msg.textContent = text;
  chatDiv.appendChild(msg);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function populateVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach((voice, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' [default]' : ''}`;
    voiceSelect.appendChild(option);
  });
  if (voiceSelect.options.length > 0 && voiceSelect.selectedIndex === -1) {
    voiceSelect.selectedIndex = 0;
  }
}

if ('speechSynthesis' in window) {
  populateVoices();
  speechSynthesis.onvoiceschanged = populateVoices;
}

function speak(text) {
  subtitlesDiv.textContent = text;
  subtitlesDiv.classList.add('transition-all');
  const utter = new SpeechSynthesisUtterance(text);
  const selectedIdx = voiceSelect.value;
  if (voices[selectedIdx]) {
    utter.voice = voices[selectedIdx];
  }
  console.log('Speaking:', text, 'with voice:', utter.voice);
  utter.onend = () => { statusDiv.textContent = ""; };
  speechSynthesis.speak(utter);
}

sendBtn.onclick = sendTextInput;
textInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') sendTextInput();
});

async function sendTextInput() {
  const text = textInput.value.trim();
  if (!text) return;
  addMessage('user', text);
  textInput.value = '';
  statusDiv.textContent = 'Thinking...';
  const res = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({text})
  });
  const data = await res.json();
  const cleaned = cleanTextForTTS(data.reply);
  addMessage('bot', cleaned);
  statusDiv.textContent = 'Speaking...';
  speak(cleaned);
}

stopBtn.onclick = () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    statusDiv.textContent = '';
  }
};

resumeBtn.onclick = () => {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    statusDiv.textContent = 'Speaking...';
  }
};

statusDiv.classList.add('transition-all');

function cleanTextForTTS(text) {
  // Remove all asterisks (single or multiple), and all non-alphanumeric except basic punctuation
  return text
    .replace(/\*+/g, ' ') // Remove all asterisks (single or multiple)
    .replace(/[^a-zA-Z0-9\s.,?!'-]/g, ' ') // Remove other symbols except basic punctuation
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim();
} 
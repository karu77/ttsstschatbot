const chatDiv = document.getElementById('chat');
const micBtn = document.getElementById('micBtn');
const statusDiv = document.getElementById('status');
const subtitlesDiv = document.getElementById('subtitles');
const voiceSelect = document.getElementById('voiceSelect');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');

let recognizing = false;
let recognition;
let voices = [];

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.onstart = () => { statusDiv.textContent = "Listening..."; };
  recognition.onend = () => { statusDiv.textContent = ""; recognizing = false; };
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
    addMessage('bot', data.reply);
    statusDiv.textContent = "Speaking...";
    speak(data.reply);
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
  msg.className = sender === 'user' ? 'text-right text-blue-700' : 'text-left text-green-700';
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
}

if ('speechSynthesis' in window) {
  populateVoices();
  speechSynthesis.onvoiceschanged = populateVoices;
}

function speak(text) {
  subtitlesDiv.textContent = text;
  const utter = new SpeechSynthesisUtterance(text);
  const selectedIdx = voiceSelect.value;
  if (voices[selectedIdx]) {
    utter.voice = voices[selectedIdx];
  }
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
  addMessage('bot', data.reply);
  statusDiv.textContent = 'Speaking...';
  speak(data.reply);
} 
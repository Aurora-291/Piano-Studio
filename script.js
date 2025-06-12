const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const masterGainNode = audioContext.createGain();
const convolver = audioContext.createConvolver();
const keys = document.querySelectorAll('.piano-key');
const volumeControl = document.getElementById('volumeControl');
const volumeValue = document.getElementById('volumeValue');
const reverbControl = document.getElementById('reverbControl');
const reverbValue = document.getElementById('reverbValue');
const instrumentSelect = document.getElementById('instrumentSelect');
const recordToggle = document.getElementById('recordToggle');
const playRecording = document.getElementById('playRecording');
const saveRecording = document.getElementById('saveRecording');
const themeSelect = document.getElementById('themeSelect');
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');

let isRecording = false;
let recording = [];
let startTime;
let isPlaying = {};

masterGainNode.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Float32Array(bufferLength);

const keyMap = {
    'a': 'C4', 'w': 'Db4', 's': 'D4', 'e': 'Eb4', 'd': 'E4',
    'f': 'F4', 't': 'Gb4', 'g': 'G4', 'y': 'Ab4', 'h': 'A4',
    'u': 'Bb4', 'j': 'B4', 'k': 'C5'
};

const noteFrequencies = {
    'C4': 261.63, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13,
    'E4': 329.63, 'F4': 349.23, 'Gb4': 369.99, 'G4': 392.00,
    'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
    'C5': 523.25
};

function createReverbImpulse() {
    const length = audioContext.sampleRate * 2;
    const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 10);
        }
    }
    
    convolver.buffer = impulse;
}

function createOscillator(freq) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const reverbGain = audioContext.createGain();
    
    oscillator.type = instrumentSelect.value;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(masterGainNode);
    
    oscillator.connect(reverbGain);
    reverbGain.connect(convolver);
    convolver.connect(masterGainNode);
    
    const volume = volumeControl.value / 100;
    const reverbLevel = reverbControl.value / 100;
    
    gainNode.gain.setValueAtTime(volume * 0.7, audioContext.currentTime);
    reverbGain.gain.setValueAtTime(reverbLevel * 0.3, audioContext.currentTime);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
    oscillator.stop(audioContext.currentTime + 1);
    
    return oscillator;
}

function playNote(note) {
    if (isPlaying[note]) return;
    
    const key = document.querySelector(`[data-note="${note}"]`);
    if (key) {
        key.classList.add('active');
        const oscillator = createOscillator(noteFrequencies[note]);
        isPlaying[note] = oscillator;
        
        if (isRecording) {
            recording.push({
                note,
                time: Date.now() - startTime,
                instrument: instrumentSelect.value,
                volume: volumeControl.value,
                reverb: reverbControl.value
            });
        }
        
        setTimeout(() => {
            key.classList.remove('active');
            delete isPlaying[note];
        }, 150);
    }
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getFloatTimeDomainData(dataArray);
    
    canvasCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary-bg');
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent-color');
    canvasCtx.beginPath();
    
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] * 100;
        const y = (canvas.height / 2) + (v * canvas.height / 2);
        
        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}

function initializeEventListeners() {
    keys.forEach(key => {
        key.addEventListener('mousedown', () => playNote(key.dataset.note));
        key.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playNote(key.dataset.note);
        });
    });

    document.addEventListener('keydown', e => {
        if (keyMap[e.key.toLowerCase()] && !e.repeat) {
            playNote(keyMap[e.key.toLowerCase()]);
        }
    });

    volumeControl.addEventListener('input', (e) => {
        volumeValue.textContent = `${e.target.value}%`;
        masterGainNode.gain.setValueAtTime(e.target.value / 100, audioContext.currentTime);
    });

    reverbControl.addEventListener('input', (e) => {
        reverbValue.textContent = `${e.target.value}%`;
    });

    recordToggle.addEventListener('click', () => {
        isRecording = !isRecording;
        if (isRecording) {
            recording = [];
            startTime = Date.now();
            recordToggle.innerHTML = '<i class="fas fa-stop"></i><span>Stop</span>';
            recordToggle.classList.add('recording');
            playRecording.disabled = true;
            saveRecording.disabled = true;
        } else {
            recordToggle.innerHTML = '<i class="fas fa-circle"></i><span>Record</span>';
            recordToggle.classList.remove('recording');
            playRecording.disabled = false;
            saveRecording.disabled = false;
        }
    });

    playRecording.addEventListener('click', () => {
        if (recording.length === 0) return;
        
        playRecording.disabled = true;
        recordToggle.disabled = true;
        
        recording.forEach(note => {
            setTimeout(() => {
                instrumentSelect.value = note.instrument;
                volumeControl.value = note.volume;
                reverbControl.value = note.reverb;
                playNote(note.note);
            }, note.time);
        });
        
        setTimeout(() => {
            playRecording.disabled = false;
            recordToggle.disabled = false;
        }, recording[recording.length - 1].time + 1000);
    });

    saveRecording.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(recording)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'piano-recording.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    themeSelect.addEventListener('change', (e) => {
        document.body.className = `theme-${e.target.value}`;
    });

    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

function initializeApp() {
    createReverbImpulse();
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawVisualizer();
    initializeEventListeners();
}

initializeApp();
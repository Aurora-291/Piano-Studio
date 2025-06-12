const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const masterGainNode = audioContext.createGain();
const keys = document.querySelectorAll('.piano-key');
const volumeControl = document.getElementById('volumeControl');
const volumeValue = document.getElementById('volumeValue');
const instrumentSelect = document.getElementById('instrumentSelect');
const themeSelect = document.getElementById('themeSelect');

let isPlaying = {};

masterGainNode.connect(audioContext.destination);

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

function createOscillator(freq) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = instrumentSelect.value;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(masterGainNode);
    
    const volume = volumeControl.value / 100;
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    
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
        
        setTimeout(() => {
            key.classList.remove('active');
            delete isPlaying[note];
        }, 150);
    }
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

    themeSelect.addEventListener('change', (e) => {
        document.body.className = `theme-${e.target.value}`;
    });
}

initializeEventListeners();
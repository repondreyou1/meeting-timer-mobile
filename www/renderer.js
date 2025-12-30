// Mobile version - No Electron dependencies

let countdownInterval;
let remainingSeconds = 0;
let alarmSoundInterval;
let flashInterval;
let isPaused = false;
let meetingAlarmTimeout;

const timerDisplay = document.getElementById('timer');
const btn5Min = document.getElementById('btn-5min');
const btn10Min = document.getElementById('btn-10min');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');

function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.classList.remove('message');
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function togglePause() {
    if (!countdownInterval && !meetingAlarmTimeout) {
        return; // No timer running
    }

    isPaused = !isPaused;
    btnPause.textContent = isPaused ? 'Resume' : 'Pause';
}

function startTimer(minutes) {
    clearInterval(countdownInterval);
    stopAlarmSound();
    stopFlashing();
    isPaused = false;
    btnPause.textContent = 'Pause';
    remainingSeconds = minutes * 60;
    updateDisplay();

    // Visual feedback
    document.body.style.background = '#000000';

    countdownInterval = setInterval(() => {
        if (!isPaused) {
            remainingSeconds--;
            updateDisplay();

            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                triggerAlarm();
            }
        }
    }, 1000);
}

function startCustomTimer() {
    const input = document.getElementById('custom-min');
    const minutes = parseInt(input.value);

    if (isNaN(minutes) || minutes <= 0) {
        input.style.borderColor = '#ff4444';
        setTimeout(() => input.style.borderColor = 'rgba(255, 255, 255, 0.2)', 1000);
        return;
    }

    startTimer(minutes);
}

function setMeetingAlarm() {
    const input = document.getElementById('meeting-time');
    const meetingTimeStr = input.value;

    if (!meetingTimeStr) {
        input.style.borderColor = '#ff4444';
        setTimeout(() => input.style.borderColor = 'rgba(255, 255, 255, 0.2)', 1000);
        return;
    }

    const now = new Date();
    const [hours, minutes] = meetingTimeStr.split(':').map(Number);
    const meetingDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

    if (meetingDate < now) {
        alert('Meeting time must be in the future.');
        return;
    }

    // Calculate 5 minutes before
    const alarmDate = new Date(meetingDate.getTime() - 5 * 60 * 1000);

    if (alarmDate < now) {
        alert('Meeting is starting in less than 5 minutes! Alarm triggered immediately.');
        triggerAlarm();
        return;
    }

    const msUntilAlarm = alarmDate.getTime() - now.getTime();

    // Visual feedback
    timerDisplay.classList.add('message');
    timerDisplay.textContent = `Alarm set for ${alarmDate.getHours().toString().padStart(2, '0')}:${alarmDate.getMinutes().toString().padStart(2, '0')}`;

    // Clear any existing interval
    clearInterval(countdownInterval);
    clearTimeout(meetingAlarmTimeout);
    stopAlarmSound();
    stopFlashing();
    isPaused = false;
    btnPause.textContent = 'Pause';

    meetingAlarmTimeout = setTimeout(() => {
        triggerAlarm();
        // Notification API on mobile might need permission or Capacitor plugin
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification('Meeting Timer', {
                body: '5 minutes until your meeting!',
            });
        } else if ("Notification" in window && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification('Meeting Timer', {
                        body: '5 minutes until your meeting!',
                    });
                }
            });
        }
    }, msUntilAlarm);
}

function startAlarmSound() {
    // Simple beep using Web Audio API
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    const playBeep = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    };

    // Play a pattern: Beep-Beep-Beep ... pause ...
    let count = 0;
    alarmSoundInterval = setInterval(() => {
        if (count % 10 < 3) { // 0, 1, 2 -> Beep
            playBeep();
        }
        count++;
    }, 200); // Check every 200ms
}

function stopAlarmSound() {
    if (alarmSoundInterval) {
        clearInterval(alarmSoundInterval);
        alarmSoundInterval = null;
    }
}

function stopFlashing() {
    if (flashInterval) {
        clearInterval(flashInterval);
        flashInterval = null;
    }
    document.body.style.backgroundColor = '#000000';
    document.body.onclick = null;
}

function stopTimer() {
    clearInterval(countdownInterval);
    clearTimeout(meetingAlarmTimeout);
    stopAlarmSound();
    stopFlashing();
    remainingSeconds = 0;
    isPaused = false;
    btnPause.textContent = 'Pause';
    timerDisplay.classList.remove('message');
    timerDisplay.textContent = '00:00';
    updateDisplay();
}

function triggerAlarm() {
    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification('Meeting Timer', {
            body: 'Time is up! Join your meeting now.',
            silent: true // We play our own sound
        });
    }

    // Play sound
    startAlarmSound();

    // Update text
    timerDisplay.classList.add('message');
    timerDisplay.textContent = "TIME UP";

    // Flash the window or change color
    let flash = true;
    flashInterval = setInterval(() => {
        if (flash) {
            document.body.style.backgroundColor = 'rgba(200, 50, 50, 0.9)';
        } else {
            document.body.style.backgroundColor = 'rgba(200, 50, 50, 0.2)';
        }
        flash = !flash;
    }, 500);

    // Stop flashing/sound on click
    document.body.onclick = () => {
        stopFlashing();
        stopAlarmSound();
        timerDisplay.classList.remove('message');
        timerDisplay.textContent = "00:00";
    };
}

// Initialize meeting time input with current time
window.addEventListener('DOMContentLoaded', () => {
    const meetingTimeInput = document.getElementById('meeting-time');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    meetingTimeInput.value = `${hours}:${minutes}`;
});

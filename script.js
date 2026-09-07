/**
 * Magical Birthday Celebration Experience
 * Dynamic particles, Web Audio synthesis, interactive candle blow-out, 
 * wish launcher, and live theme customization.
 */

// --- State Management ---
const state = {
  isOpened: false,
  isPlayingAudio: false,
  candlesBlown: false,
  recipientName: 'Sophia',
  senderName: 'With all my love',
  theme: 'rosegold',
  currentStage: 1,
  totalStages: 6,
  audioCtx: null,
  melodyTimeout: null
};

// --- DOM Elements ---
const envelopeGate = document.getElementById('envelope-gate');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const mainContainer = document.getElementById('main-container');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');

// Stage Navigation Elements
const journeyNav = document.getElementById('journey-nav');
const prevStageBtn = document.getElementById('prev-stage-btn');
const nextStageBtn = document.getElementById('next-stage-btn');
const stageCounter = document.getElementById('stage-counter');
const stageDots = document.querySelectorAll('.stage-dot');
const finaleConfettiBtn = document.getElementById('finale-confetti-btn');
const balloonSkipRow = document.getElementById('balloon-skip-row');
const cakeNextBtn = document.getElementById('cake-next-btn');

// Cake & Candle elements
const cakeContainer = document.getElementById('cake-container');
const blowCandlesBtn = document.getElementById('blow-candles-btn');
const candles = document.querySelectorAll('.candle');
const wishGrantedBadge = document.getElementById('wish-granted-badge');
const cakeInstructions = document.getElementById('cake-instructions');


// Canvas
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');

// --- Web Audio Synthesizer Engine ---
function initAudio() {
  if (!state.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    state.audioCtx = new AudioContext();
  }
  if (state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
}

// Play a single soft music-box / chime tone
function playChimeTone(freq, time, duration = 1.2, volume = 0.25) {
  if (!state.audioCtx) return;
  const now = state.audioCtx.currentTime + time;
  const osc = state.audioCtx.createOscillator();
  const gain = state.audioCtx.createGain();

  // Bell-like harmonic rich tone
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(state.audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.1);
}

// Gentle birthday melody sequence
const birthdayNotes = [
  { freq: 261.63, dur: 0.35, pause: 0.4 },  // C4
  { freq: 261.63, dur: 0.25, pause: 0.3 },  // C4
  { freq: 293.66, dur: 0.6, pause: 0.65 },  // D4
  { freq: 261.63, dur: 0.6, pause: 0.65 },  // C4
  { freq: 349.23, dur: 0.6, pause: 0.65 },  // F4
  { freq: 329.63, dur: 1.1, pause: 1.2 },   // E4

  { freq: 261.63, dur: 0.35, pause: 0.4 },  // C4
  { freq: 261.63, dur: 0.25, pause: 0.3 },  // C4
  { freq: 293.66, dur: 0.6, pause: 0.65 },  // D4
  { freq: 261.63, dur: 0.6, pause: 0.65 },  // C4
  { freq: 392.00, dur: 0.6, pause: 0.65 },  // G4
  { freq: 349.23, dur: 1.1, pause: 1.2 },   // F4

  { freq: 261.63, dur: 0.35, pause: 0.4 },  // C4
  { freq: 261.63, dur: 0.25, pause: 0.3 },  // C4
  { freq: 523.25, dur: 0.6, pause: 0.65 },  // C5
  { freq: 440.00, dur: 0.6, pause: 0.65 },  // A4
  { freq: 349.23, dur: 0.6, pause: 0.65 },  // F4
  { freq: 329.63, dur: 0.6, pause: 0.65 },  // E4
  { freq: 293.66, dur: 0.9, pause: 1.0 },   // D4

  { freq: 466.16, dur: 0.35, pause: 0.4 },  // Bb4
  { freq: 466.16, dur: 0.25, pause: 0.3 },  // Bb4
  { freq: 440.00, dur: 0.6, pause: 0.65 },  // A4
  { freq: 349.23, dur: 0.6, pause: 0.65 },  // F4
  { freq: 392.00, dur: 0.6, pause: 0.65 },  // G4
  { freq: 349.23, dur: 1.5, pause: 2.0 },   // F4
];

function playMelodyLoop() {
  if (!state.isPlayingAudio) return;
  initAudio();

  let totalTime = 0;
  birthdayNotes.forEach(note => {
    playChimeTone(note.freq, totalTime, note.dur, 0.18);
    // soft ambient fifth harmony
    playChimeTone(note.freq * 1.5, totalTime + 0.05, note.dur * 0.8, 0.06);
    totalTime += note.pause;
  });

  state.melodyTimeout = setTimeout(() => {
    if (state.isPlayingAudio) {
      playMelodyLoop();
    }
  }, (totalTime + 2.5) * 1000);
}

function startMusic() {
  state.isPlayingAudio = true;
  musicToggleBtn.classList.add('playing');
  musicToggleBtn.title = "Pause Melody";
  playMelodyLoop();
}

function stopMusic() {
  state.isPlayingAudio = false;
  musicToggleBtn.classList.remove('playing');
  musicToggleBtn.title = "Play Melody";
  if (state.melodyTimeout) {
    clearTimeout(state.melodyTimeout);
  }
}

// Sound effects
function playCelebrationFanfare() {
  initAudio();
  const fanfare = [349.23, 440, 523.25, 698.46, 880, 1046.50];
  fanfare.forEach((freq, idx) => {
    playChimeTone(freq, idx * 0.12, 1.8, 0.22);
  });
}

function playBalloonPopSound() {
  initAudio();
  if (!state.audioCtx) return;
  const now = state.audioCtx.currentTime;

  // Thump / pop pitch drop
  const osc = state.audioCtx.createOscillator();
  const gain = state.audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.07);

  gain.gain.setValueAtTime(0.45, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(state.audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.09);

  // High sparkle chime
  playChimeTone(880 + Math.random() * 350, 0.015, 0.5, 0.16);
}

// Localized particle burst when balloon pops
function spawnBalloonBurst(x, y, baseColor) {
  const colors = [baseColor || '#ff758c', '#ffffff', '#ffd166', '#ff7eb3'];
  for (let i = 0; i < 35; i++) {
    confettiParticles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.6) * 12,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 14,
      opacity: 1,
      gravity: 0.28,
      shape: Math.random() > 0.3 ? 'circle' : 'rect'
    });
  }
}

// --- Canvas: Stars, Confetti & Shooting Stars ---
let width, height;
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const stars = [];
const STAR_COUNT = 110;
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.6 + 0.4,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005,
    twinkleSpeed: Math.random() * 0.03 + 0.01
  });
}

const confettiParticles = [];
const shootingStars = [];

function spawnConfetti(count = 120) {
  const colors = ['#ff758c', '#ff7eb3', '#ffd166', '#a29bfe', '#70a1ff', '#ffffff', '#ff9ff3'];
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height * 0.35 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 1) * 14 - 3,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      gravity: 0.22,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }
}

function spawnShootingStar(startX, startY, targetAngle) {
  shootingStars.push({
    x: startX || Math.random() * width * 0.8,
    y: startY || Math.random() * height * 0.3,
    len: Math.random() * 80 + 70,
    speed: Math.random() * 8 + 12,
    angle: targetAngle || Math.PI / 4 + (Math.random() - 0.5) * 0.2,
    alpha: 1
  });
}

// Random shooting stars occasionally
setInterval(() => {
  if (state.isOpened && Math.random() > 0.4) {
    spawnShootingStar();
  }
}, 3800);

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  // 1. Draw Twinkling Background Stars
  for (let star of stars) {
    star.alpha += star.twinkleSpeed;
    if (star.alpha > 1 || star.alpha < 0.2) {
      star.twinkleSpeed = -star.twinkleSpeed;
    }
    star.y += star.speed;
    if (star.y > height) star.y = 0;

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Draw Shooting Stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    const tailX = s.x - Math.cos(s.angle) * s.len;
    const tailY = s.y - Math.sin(s.angle) * s.len;

    const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(1, `rgba(255, 230, 180, ${s.alpha})`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(s.x, s.y);
    ctx.stroke();

    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.alpha -= 0.015;

    if (s.alpha <= 0) {
      shootingStars.splice(i, 1);
    }
  }

  // 3. Draw & Update Confetti
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.98;
    p.rotation += p.rotSpeed;
    p.opacity -= 0.0055;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.fillStyle = p.color;

    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }

    ctx.restore();

    if (p.opacity <= 0 || p.y > height + 50) {
      confettiParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(animateCanvas);
}
requestAnimationFrame(animateCanvas);

// --- Envelope Open Interaction ---
function openEnvelope() {
  if (state.isOpened) return;
  initAudio();
  envelopeGate.classList.add('opening');

  // Cascade chime sound
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    playChimeTone(freq, i * 0.12, 1.5, 0.25);
  });

  setTimeout(() => {
    envelopeGate.classList.add('opened');
    mainContainer.classList.add('revealed');
    state.isOpened = true;

    // Welcome sparkle confetti
    spawnConfetti(70);

    // Initialize stage 1 and navigation bar
    updateStageNav();
  }, 700);
}

if (envelopeWrapper) {
  envelopeWrapper.addEventListener('click', openEnvelope);
}

// --- Interactive 4-Balloon Surprise ---
let poppedBalloonsCount = 0;
const balloonItems = document.querySelectorAll('.balloon-item');
const specialBanner = document.getElementById('special-message-banner');
const replayBalloonsBtn = document.getElementById('replay-balloons-btn');

balloonItems.forEach(balloon => {
  balloon.addEventListener('click', () => {
    if (balloon.classList.contains('popped')) return;

    initAudio();
    playBalloonPopSound();

    const rect = balloon.getBoundingClientRect();
    const burstX = rect.left + rect.width / 2;
    const burstY = rect.top + rect.height / 3;
    const index = balloon.getAttribute('data-index');
    const word = balloon.getAttribute('data-word');

    // Customized burst colors per balloon
    let burstColor = '#ff758c';
    if (index === '2') burstColor = '#fdcb6e';
    if (index === '3') burstColor = '#a29bfe';
    if (index === '4') burstColor = '#00cec9';

    spawnBalloonBurst(burstX, burstY, burstColor);
    balloon.classList.add('popped');

    // Reveal corresponding word slot with glowing animation
    const slot = document.getElementById(`slot-${index}`);
    if (slot) {
      slot.textContent = word;
      slot.classList.add('revealed');
    }

    poppedBalloonsCount++;

    // When all 4 balloons are burst, trigger celebration
    if (poppedBalloonsCount === 4) {
      setTimeout(() => {
        playCelebrationFanfare();
        spawnConfetti(160);
        if (specialBanner) {
          specialBanner.style.display = 'block';
        }
        if (balloonSkipRow) {
          balloonSkipRow.style.display = 'none';
        }
      }, 400);
    }
  });
});

if (replayBalloonsBtn) {
  replayBalloonsBtn.addEventListener('click', () => {
    poppedBalloonsCount = 0;
    balloonItems.forEach(b => b.classList.remove('popped'));
    for (let i = 1; i <= 4; i++) {
      const slot = document.getElementById(`slot-${i}`);
      if (slot) {
        slot.textContent = '?';
        slot.classList.remove('revealed');
      }
    }
    if (specialBanner) {
      specialBanner.style.display = 'none';
    }
    if (balloonSkipRow) {
      balloonSkipRow.style.display = 'flex';
    }
    spawnConfetti(40);
  });
}

// --- Interactive Candle Blow Out ---
function blowOutCandles() {
  if (state.candlesBlown) return;
  state.candlesBlown = true;

  candles.forEach(candle => {
    candle.classList.add('blown');
  });

  // Sound effect: Fanfare + Chimes
  playCelebrationFanfare();

  // Massive celebration confetti
  spawnConfetti(180);
  setTimeout(() => spawnConfetti(120), 450);

  // Update UI & badge
  if (cakeInstructions) cakeInstructions.style.display = 'none';
  if (blowCandlesBtn) {
    blowCandlesBtn.innerHTML = '🕯️ Relight Candles';
    blowCandlesBtn.onclick = relightCandles;
  }
  if (wishGrantedBadge) {
    wishGrantedBadge.style.display = 'inline-flex';
  }
  if (cakeNextBtn) {
    cakeNextBtn.classList.add('pulse-glow');
  }
}

function relightCandles() {
  state.candlesBlown = false;
  candles.forEach(candle => {
    candle.classList.remove('blown');
  });
  if (wishGrantedBadge) {
    wishGrantedBadge.style.display = 'none';
  }
  if (cakeInstructions) {
    cakeInstructions.style.display = 'flex';
  }
  if (blowCandlesBtn) {
    blowCandlesBtn.innerHTML = '✨ Blow Out Candles';
    blowCandlesBtn.onclick = blowOutCandles;
  }
}

if (blowCandlesBtn) {
  blowCandlesBtn.addEventListener('click', blowOutCandles);
}
if (cakeContainer) {
  cakeContainer.addEventListener('click', () => {
    if (!state.candlesBlown) {
      blowOutCandles();
    } else {
      relightCandles();
    }
  });
}

// --- Music Toggle Button ---
if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', () => {
    if (state.isPlayingAudio) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

// --- Personalization & Live Customizer ---
function applyTheme(themeName) {
  state.theme = themeName;
  document.body.setAttribute('data-theme', themeName);
  document.querySelectorAll('.theme-opt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === themeName);
  });
}

function updateRecipientName(name) {
  state.recipientName = name || 'Sophia';
  document.querySelectorAll('.recipient-name').forEach(el => {
    el.textContent = state.recipientName;
  });
  document.title = `Happy Birthday ${state.recipientName}! ✨`;
}

function updateLetterContent(body, signature) {
  const letterBodyEl = document.getElementById('letter-body-text');
  const letterSigEl = document.getElementById('letter-signature-text');
  if (letterBodyEl && body) letterBodyEl.textContent = body;
  if (letterSigEl && signature) letterSigEl.textContent = signature;
}

// Load parameters from URL or localStorage
function loadSavedSettings() {
  const params = new URLSearchParams(window.location.search);
  const nameFromParam = params.get('name') || localStorage.getItem('bday_name');
  const themeFromParam = params.get('theme') || localStorage.getItem('bday_theme');
  const letterFromStorage = localStorage.getItem('bday_letter');
  const senderFromParam = params.get('from') || localStorage.getItem('bday_sender');

  if (nameFromParam) {
    updateRecipientName(nameFromParam);
    document.getElementById('input-recipient-name').value = nameFromParam;
  }
  if (themeFromParam) {
    applyTheme(themeFromParam);
  }
  if (letterFromStorage) {
    document.getElementById('letter-body-text').textContent = letterFromStorage;
    document.getElementById('input-letter-body').value = letterFromStorage;
  }
  if (senderFromParam) {
    document.getElementById('letter-signature-text').textContent = senderFromParam;
    document.getElementById('input-sender-name').value = senderFromParam;
  }
}

// Settings modal toggles
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('open');
  });
}
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', () => {
    settingsModal.classList.remove('open');
  });
}
if (settingsModal) {
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove('open');
    }
  });
}

// Theme buttons in modal
document.querySelectorAll('.theme-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    applyTheme(btn.dataset.theme);
    localStorage.setItem('bday_theme', btn.dataset.theme);
  });
});

// Save settings form
if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener('click', () => {
    const nameVal = document.getElementById('input-recipient-name').value.trim();
    const senderVal = document.getElementById('input-sender-name').value.trim();
    const letterVal = document.getElementById('input-letter-body').value.trim();

    if (nameVal) {
      updateRecipientName(nameVal);
      localStorage.setItem('bday_name', nameVal);
    }
    if (senderVal) {
      document.getElementById('letter-signature-text').textContent = senderVal;
      localStorage.setItem('bday_sender', senderVal);
    }
    if (letterVal) {
      document.getElementById('letter-body-text').textContent = letterVal;
      localStorage.setItem('bday_letter', letterVal);
    }

    settingsModal.classList.remove('open');
    spawnConfetti(60);
  });
}

// Copy share link button
if (copyLinkBtn) {
  copyLinkBtn.addEventListener('click', () => {
    const nameVal = encodeURIComponent(state.recipientName);
    const themeVal = encodeURIComponent(state.theme);
    const senderVal = encodeURIComponent(document.getElementById('letter-signature-text').textContent.trim());
    const shareUrl = `${window.location.origin}${window.location.pathname}?name=${nameVal}&theme=${themeVal}&from=${senderVal}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      copyLinkBtn.textContent = '✅ Link Copied!';
      setTimeout(() => {
        copyLinkBtn.textContent = '🔗 Copy Shareable Link';
      }, 2500);
    }).catch(() => {
      alert(`Shareable Link:\n${shareUrl}`);
    });
  });
}

// Initialize on page load
loadSavedSettings();

// ==========================================================================
// Stage Management (Zero-Scroll Activity Controller)
// ==========================================================================
function goToStage(targetStage, direction = 'auto') {
  if (targetStage < 1 || targetStage > state.totalStages) return;
  if (targetStage === state.currentStage) return;

  initAudio();
  playChimeTone(659.25, 0, 0.4, 0.12);

  const prevStageNum = state.currentStage;
  const isForward = direction === 'forward' || (direction === 'auto' && targetStage > prevStageNum);

  const currentStageEl = document.getElementById(`stage-${prevStageNum}`);
  const nextStageEl = document.getElementById(`stage-${targetStage}`);

  if (currentStageEl && nextStageEl) {
    // Clean up previous transition classes
    document.querySelectorAll('.activity-stage').forEach(el => {
      el.classList.remove('slide-enter-right', 'slide-enter-left', 'slide-exit-left', 'slide-exit-right');
    });

    // Animate exit of current stage
    currentStageEl.classList.add(isForward ? 'slide-exit-left' : 'slide-exit-right');

    // Animate entrance of next stage
    nextStageEl.classList.add('active-stage');
    nextStageEl.classList.add(isForward ? 'slide-enter-right' : 'slide-enter-left');

    setTimeout(() => {
      currentStageEl.classList.remove('active-stage', 'slide-exit-left', 'slide-exit-right');
      nextStageEl.classList.remove('slide-enter-right', 'slide-enter-left');
    }, 420);
  } else if (nextStageEl) {
    document.querySelectorAll('.activity-stage').forEach(el => el.classList.remove('active-stage'));
    nextStageEl.classList.add('active-stage');
  }

  state.currentStage = targetStage;
  updateStageNav();

  // Scroll stage card to top if it had internal scroll
  if (nextStageEl) {
    const card = nextStageEl.querySelector('.stage-card');
    if (card) card.scrollTop = 0;
  }
}

function updateStageNav() {
  if (stageCounter) {
    stageCounter.textContent = `Surprise ${state.currentStage} of ${state.totalStages}`;
  }

  // Update dots
  stageDots.forEach(dot => {
    const dotStage = parseInt(dot.getAttribute('data-stage-target'));
    dot.classList.toggle('active', dotStage === state.currentStage);
    dot.classList.toggle('completed', dotStage < state.currentStage);
  });

  // Update previous button
  if (prevStageBtn) {
    prevStageBtn.disabled = (state.currentStage === 1);
  }

  // Update next button
  if (nextStageBtn) {
    const label = nextStageBtn.querySelector('.nav-label');
    if (state.currentStage === state.totalStages) {
      if (label) label.textContent = 'Replay 🔄';
    } else {
      if (label) label.textContent = 'Next';
    }
  }
}

// Stage Navigation Button Handlers
document.querySelectorAll('.next-activity-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const nextTarget = parseInt(btn.getAttribute('data-next'));
    if (!isNaN(nextTarget)) {
      goToStage(nextTarget, 'forward');
    }
  });
});

if (prevStageBtn) {
  prevStageBtn.addEventListener('click', () => {
    goToStage(state.currentStage - 1, 'backward');
  });
}

if (nextStageBtn) {
  nextStageBtn.addEventListener('click', () => {
    if (state.currentStage === state.totalStages) {
      goToStage(1, 'forward');
    } else {
      goToStage(state.currentStage + 1, 'forward');
    }
  });
}

stageDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = parseInt(dot.getAttribute('data-stage-target'));
    if (!isNaN(target)) {
      goToStage(target);
    }
  });
});

// Finale Confetti Button
if (finaleConfettiBtn) {
  finaleConfettiBtn.addEventListener('click', () => {
    initAudio();
    playCelebrationFanfare();
    spawnConfetti(220);
    setTimeout(() => spawnConfetti(140), 450);
  });
}

// Keyboard Navigation (Arrow Keys)
window.addEventListener('keydown', (e) => {
  if (!state.isOpened) return;

  // Don't intercept when user is typing in forms
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
    return;
  }

  if (e.key === 'ArrowRight') {
    if (state.currentStage < state.totalStages) {
      goToStage(state.currentStage + 1, 'forward');
    }
  } else if (e.key === 'ArrowLeft') {
    if (state.currentStage > 1) {
      goToStage(state.currentStage - 1, 'backward');
    }
  }
});

// Initialize first stage navigation state
updateStageNav();


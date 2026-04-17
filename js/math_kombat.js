// =============================================
// MATH KOMBAT - Game Engine
// =============================================

// ---------- CHARACTER DATA ----------
const CHARACTERS = [
    { id: 'ryuken', name: 'Zé Catatau', img: 'img/chars/ryuken.png', bodyColor: '#e8e8e8', accentColor: '#dc2626', hairColor: '#4a2800', skinColor: '#e8c090' },
    { id: 'scorpius', name: 'Tonho Quebra-Cabaça', img: 'img/chars/scorpius.png', bodyColor: '#eab308', accentColor: '#854d0e', hairColor: '#eab308', skinColor: '#eab308' },
    { id: 'subfrost', name: 'Tiringa', img: 'img/chars/subfrost.png', bodyColor: '#3b82f6', accentColor: '#1e40af', hairColor: '#3b82f6', skinColor: '#3b82f6' },
    { id: 'gokhan', name: 'Zé do Grito', img: 'img/chars/gokhan.png', bodyColor: '#f97316', accentColor: '#2563eb', hairColor: '#1a1a1a', skinColor: '#e8c090' },
    { id: 'veggan', name: 'Mané Pé-de-Calango', img: 'img/chars/veggan.png', bodyColor: '#1e3a8a', accentColor: '#f59e0b', hairColor: '#1a1a1a', skinColor: '#e8c090' },
    { id: 'chunlei', name: 'Maria Espoleta', img: 'img/chars/chunlei.png', bodyColor: '#2563eb', accentColor: '#fbbf24', hairColor: '#3b2300', skinColor: '#f0c8a0' },
    { id: 'liufang', name: 'Chico Rói-Rói', img: 'img/chars/liufang.png', bodyColor: '#1a1a1a', accentColor: '#dc2626', hairColor: '#1a1a1a', skinColor: '#c8a070' },
    { id: 'kenfire', name: 'Zé Catinga Braba', img: 'img/chars/kenfire.png', bodyColor: '#dc2626', accentColor: '#1a1a1a', hairColor: '#fbbf24', skinColor: '#e8c090' },
    { id: 'friza', name: 'Das Dores', img: 'img/chars/friza.png', bodyColor: '#e2e8f0', accentColor: '#7c3aed', hairColor: '#e2e8f0', skinColor: '#ddb8e8' },
    { id: 'kitara', name: 'Toinha Pimenta', img: 'img/chars/kitara.png', bodyColor: '#1d4ed8', accentColor: '#60a5fa', hairColor: '#1a1a1a', skinColor: '#f0c8a0' },
    { id: 'sonyab', name: 'Arranca-Toco', img: 'img/chars/sonyab.png', bodyColor: '#4a7c3a', accentColor: '#6b7e3a', hairColor: '#fbbf24', skinColor: '#f0c8a0' },
    { id: 'cammyk', name: 'Zulmira', img: 'img/chars/cammyk.png', bodyColor: '#22c55e', accentColor: '#dc2626', hairColor: '#fbbf24', skinColor: '#f0c8a0' },
    { id: 'androida', name: 'Espanta-Cabra', img: 'img/chars/androida.png', bodyColor: '#60a5fa', accentColor: '#1a1a1a', hairColor: '#fbbf24', skinColor: '#f8e8d0' },
    { id: 'milena', name: 'Maria do Furdunço', img: 'img/chars/milena.png', bodyColor: '#d946ef', accentColor: '#7c2d8e', hairColor: '#1a1a1a', skinColor: '#f0c8a0' },
    // --- New characters ---
    { id: 'zangao', name: 'Zé Bigodão', img: 'img/chars/zangao.png', bodyColor: '#dc2626', accentColor: '#fbbf24', hairColor: '#6b7280', skinColor: '#e8b090' },
    { id: 'blankao', name: 'Bicho Elétrico', img: 'img/chars/blankao.png', bodyColor: '#16a34a', accentColor: '#ea580c', hairColor: '#ea580c', skinColor: '#4ade80' },
    { id: 'sagao', name: 'Zé Olho-Doido', img: 'img/chars/sagao.png', bodyColor: '#78350f', accentColor: '#fbbf24', hairColor: '#1a1a1a', skinColor: '#b87040' },
    { id: 'dhalsimba', name: 'Seu Estique', img: 'img/chars/dhalsimba.png', bodyColor: '#fbbf24', accentColor: '#dc2626', hairColor: '#1a1a1a', skinColor: '#a05828' },
    { id: 'capoeirista', name: 'Nego Capoeira', img: 'img/chars/capoeirista.png', bodyColor: '#ffffff', accentColor: '#fbbf24', hairColor: '#1a1a1a', skinColor: '#5c3018' },
    { id: 'hondalao', name: 'Zé Sumo Véio', img: 'img/chars/hondalao.png', bodyColor: '#1e40af', accentColor: '#fbbf24', hairColor: '#1a1a1a', skinColor: '#f0d090' },
];

// ---------- GAME STATE ----------
const GAME_SETTINGS = {
    answerTime: 60
};
const MAX_HP = 100;
const DMG = { normal: 10, special: 20, super: 40 };
let game = {
    p1: { charIdx: -1, hp: MAX_HP, streak: 0 },
    p2: { charIdx: -1, hp: MAX_HP, streak: 0 },
    selectPhase: 'p1', // p1 or p2
    turn: null,
    currentAnswer: null,
    questionActive: false,
    fightStarted: false,
    roundCount: 0,
    isBonus: false,
    attackAnimating: false,
    mode: 'hvh', // 'hvh', 'hvc', 'tournament'
    turnMode: 'buzzer', // 'buzzer', 'parImparVirtual'
    paused: false,
    tournament: null,
    phase: 'floresta' // Current arena phase
};
let cpuTimerId = null;

// ---------- CANVAS & ANIMATION ----------
let canvas, ctx;
let arenaAnimId = null;
let fighters = { p1: null, p2: null };

// Fighter object structure
function createFighter(charData, side) {
    const baseX = side === 'left' ? 0.25 : 0.75;
    return {
        char: charData,
        side: side,
        x: baseX, y: 0.85, // normalized coords
        baseX: baseX,
        targetX: baseX,
        state: 'idle', // idle, punch, kick, special, hit, win, drink, victory, defeat
        frame: 0,
        stateTimer: 0,
        idleBob: 0,
        flash: 0,
        afterimageTimer: 0,
        dustTimer: 0
    };
}

// ---------- PROJECTILE SYSTEM ----------
let projectiles = [];

// ---------- PARTICLE / VISUAL FX SYSTEM ----------
let particles = [];       // partículas de impacto
let arenaParticles = [];  // partículas ambiente da arena
let floatingTexts = [];   // textos flutuantes (combo, etc.)
let screenFlash = 0;      // intensidade do flash branco (0-1)
let afterimages = [];     // rastro fantasma ao dar dash
let groundCracks = [];    // rachaduras no chão após super
let screenWaves = [];     // ondas de choque circulares nos impactos

// ---------- SCREENS ----------
const _MENU_SCREENS = new Set(['screen-title', 'screen-phases', 'screen-mode', 'screen-select', 'screen-tournament-setup', 'screen-tournament-bracket', 'screen-end']);

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'screen-select') AudioEngine.startSelectMusic();
    else if (_MENU_SCREENS.has(id)) AudioEngine.startMenuMusic();
}

// ========== TITLE SCREEN ==========
document.getElementById('btn-start').onclick = () => {
    showScreen('screen-phases');
};

document.getElementById('btn-settings').onclick = () => {
    document.getElementById('input-answer-time').value = GAME_SETTINGS.answerTime;
    document.getElementById('val-answer-time').textContent = GAME_SETTINGS.answerTime;
    showScreen('screen-settings');
};

document.getElementById('input-answer-time').addEventListener('input', (e) => {
    document.getElementById('val-answer-time').textContent = e.target.value;
});

document.getElementById('btn-save-settings').onclick = () => {
    GAME_SETTINGS.answerTime = parseInt(document.getElementById('input-answer-time').value, 10);
    showScreen('screen-title');
};

// ========== PHASE SELECTION ==========
document.querySelectorAll('.phase-card').forEach(card => {
    card.addEventListener('click', () => {
        AudioEngine.play('select');
        game.phase = card.dataset.phase;
        // Highlight selected
        document.querySelectorAll('.phase-card').forEach(c => c.style.borderColor = '');
        card.style.borderColor = '#fbbf24';
        showScreen('screen-mode');
    });
});
document.getElementById('btn-back-phases').onclick = () => showScreen('screen-title');

function readTurnMode() {
    const sel = document.querySelector('input[name="turnMode"]:checked');
    game.turnMode = sel ? sel.value : 'buzzer';
}

document.getElementById('mode-hvh').onclick = () => {
    game.mode = 'hvh';
    game.tournament = null;
    readTurnMode();
    goToCharSelect();
};
document.getElementById('mode-hvc').onclick = () => {
    game.mode = 'hvc';
    game.tournament = null;
    readTurnMode();
    goToCharSelect();
};
document.getElementById('mode-tournament').onclick = () => {
    game.mode = 'tournament';
    showScreen('screen-tournament-setup');
    document.getElementById('tournament-register').classList.add('hidden');
    document.getElementById('tournament-players-list').innerHTML = '';
    tournamentPlayers = [];
    tournamentRegIdx = 0;
    tournamentSelectedChar = -1;
};
document.getElementById('btn-back-title').onclick = () => showScreen('screen-title');
document.getElementById('btn-back-select').onclick = () => showScreen('screen-mode');

function goToCharSelect() {
    game.selectPhase = 'p1';
    game.p1.charIdx = -1;
    game.p2.charIdx = -1;
    buildCharGrid();
    showScreen('screen-select');
    if (game.mode === 'hvc') {
        document.getElementById('select-instruction').textContent = 'Escolha o seu lutador!';
    }
}

// ========== PAUSE / RESUME / EXIT ==========
document.getElementById('btn-pause').onclick = () => togglePause();
document.getElementById('btn-resume').onclick = () => togglePause();
document.getElementById('btn-go-select').onclick = () => goToSelectFromFight();
document.getElementById('btn-exit-game').onclick = () => exitToTitle();
document.getElementById('btn-pause-select').onclick = () => { resumeIfPaused(); goToSelectFromFight(); };
document.getElementById('btn-pause-exit').onclick = () => { resumeIfPaused(); exitToTitle(); };

function togglePause() {
    game.paused = !game.paused;
    document.getElementById('pause-overlay').classList.toggle('hidden', !game.paused);
    if (game.paused) {
        if (arenaAnimId) cancelAnimationFrame(arenaAnimId);
        arenaAnimId = null;
        clearCpuTimers();
    } else {
        startArenaLoop();
        if (game.mode === 'hvc' && game.questionActive && !game.turn) scheduleCpuBuzzer();
    }
}

function resumeIfPaused() {
    if (game.paused) {
        game.paused = false;
        document.getElementById('pause-overlay').classList.add('hidden');
    }
}

function goToSelectFromFight() {
    cleanupFight();
    goToCharSelect();
}

function exitToTitle() {
    cleanupFight();
    showScreen('screen-title');
}

function cleanupFight() {
    game.fightStarted = false;
    game.paused = false;
    clearCpuTimers();
    clearBuzzerTimer();
    clearAnswerTimer();
    AudioEngine.stopMusic();
    if (arenaAnimId) cancelAnimationFrame(arenaAnimId);
    arenaAnimId = null;
    document.getElementById('pause-overlay').classList.add('hidden');
}

// ========== CHARACTER SELECT ==========
function buildCharGrid() {
    const grid = document.getElementById('char-grid');
    grid.innerHTML = '';
    CHARACTERS.forEach((ch, i) => {
        const cell = document.createElement('div');
        cell.className = 'char-cell';
        cell.dataset.idx = i;
        cell.innerHTML = `<img src="${ch.img}" alt="${ch.name}"><span class="char-label">${ch.name}</span>`;
        cell.addEventListener('click', () => selectChar(i));
        cell.addEventListener('touchend', (e) => { e.preventDefault(); selectChar(i); });
        grid.appendChild(cell);
    });
    updateSelectUI();
}

function selectChar(idx) {
    AudioEngine.play('select');
    if (game.selectPhase === 'p1') {
        game.p1.charIdx = idx;
        if (game.mode === 'hvc') {
            // CPU picks random different char
            let cpuIdx;
            do { cpuIdx = Math.floor(Math.random() * CHARACTERS.length); } while (cpuIdx === idx);
            game.p2.charIdx = cpuIdx;
            updateSelectUI();
        } else {
            game.selectPhase = 'p2';
            updateSelectUI();
        }
    } else if (game.selectPhase === 'p2') {
        if (idx === game.p1.charIdx) return; // can't pick same
        game.p2.charIdx = idx;
        updateSelectUI();
    }
}

function updateSelectUI() {
    const cells = document.querySelectorAll('.char-cell');
    cells.forEach(c => { c.classList.remove('selected-p1', 'selected-p2'); });

    if (game.p1.charIdx >= 0) {
        cells[game.p1.charIdx].classList.add('selected-p1');
        const ch = CHARACTERS[game.p1.charIdx];
        document.getElementById('preview-img-p1').src = ch.img;
        document.getElementById('preview-name-p1').textContent = ch.name;
    } else {
        document.getElementById('preview-img-p1').src = '';
        document.getElementById('preview-name-p1').textContent = '---';
    }

    if (game.p2.charIdx >= 0) {
        cells[game.p2.charIdx].classList.add('selected-p2');
        const ch = CHARACTERS[game.p2.charIdx];
        document.getElementById('preview-img-p2').src = ch.img;
        document.getElementById('preview-name-p2').textContent = ch.name;
    } else {
        document.getElementById('preview-img-p2').src = '';
        document.getElementById('preview-name-p2').textContent = '---';
    }

    const instr = document.getElementById('select-instruction');
    const confirmBtn = document.getElementById('btn-confirm-fight');
    if (game.selectPhase === 'p1') {
        instr.textContent = 'JOGADOR 1: Escolha o seu lutador!';
        confirmBtn.classList.add('hidden');
    } else if (game.selectPhase === 'p2' && game.p2.charIdx < 0) {
        instr.textContent = 'JOGADOR 2: Escolha o seu lutador!';
        confirmBtn.classList.add('hidden');
    }

    // Show confirm button when both are selected
    if (game.p1.charIdx >= 0 && game.p2.charIdx >= 0) {
        instr.textContent = 'Prontos para a luta!';
        confirmBtn.classList.remove('hidden');
    }
}

document.getElementById('btn-confirm-fight').onclick = () => {
    if (game.p1.charIdx >= 0 && game.p2.charIdx >= 0) {
        startFight();
    }
};

// ========== FIGHT SCREEN ==========
function startFight() {
    showScreen('screen-fight');
    game.p1.hp = MAX_HP;
    game.p2.hp = MAX_HP;
    game.p1.streak = 0;
    game.p2.streak = 0;
    game.fightStarted = true;
    game.roundCount = 0;
    game.attackAnimating = false;

    // Set HUD names
    document.getElementById('hud-name-p1').textContent = CHARACTERS[game.p1.charIdx].name;
    document.getElementById('hud-name-p2').textContent = CHARACTERS[game.p2.charIdx].name;

    // Init Canvas
    canvas = document.getElementById('arena-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    fighters.p1 = createFighter(CHARACTERS[game.p1.charIdx], 'left');
    fighters.p2 = createFighter(CHARACTERS[game.p2.charIdx], 'right');
    projectiles = [];
    particles = [];
    arenaParticles = [];
    floatingTexts = [];
    afterimages = [];
    groundCracks = [];
    screenWaves = [];
    screenFlash = 0;

    updateHUD();
    startArenaLoop();
    AudioEngine.startMusic(game.phase);

    // Intro VS + anúncio FIGHT!
    const p1Name = CHARACTERS[game.p1.charIdx].name;
    const p2Name = CHARACTERS[game.p2.charIdx].name;
    showVSIntro(p1Name, p2Name, () => {
        showFightAnnounce('FIGHT!');
        AudioEngine.play('roundStart');
        document.getElementById('question-text').textContent = 'ROUND 1 — FIGHT!';
        setTimeout(nextRound, 2000);
    });
}

function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    // Calculate available height: total screen minus hud, question bar, controls
    const hud = document.querySelector('.hud');
    const qbar = document.querySelector('.question-bar');
    const ctrl = document.querySelector('.controls-split');
    const availH = window.innerHeight - (hud ? hud.offsetHeight : 50) - (qbar ? qbar.offsetHeight : 50) - (ctrl ? ctrl.offsetHeight : 150);
    canvas.width = window.innerWidth;
    canvas.height = Math.max(availH, 120);
}

// ---------- ARENA RENDERING ----------
function startArenaLoop() {
    if (arenaAnimId) cancelAnimationFrame(arenaAnimId);
    function loop(ts) {
        arenaAnimId = requestAnimationFrame(loop);
        drawArena(ts);
    }
    arenaAnimId = requestAnimationFrame(loop);
}

function drawArena(ts) {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const phase = game.phase || 'floresta';
    const floorY = H * 0.88;

    if (phase === 'floresta') {
        // Forest - deep greens
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0a2e0a');
        grad.addColorStop(0.5, '#1a4a1a');
        grad.addColorStop(1, '#0f230f');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        // Trees
        for (let i = 0; i < 6; i++) {
            const tx = W * (0.05 + i * 0.18);
            ctx.fillStyle = '#3a2a1a'; ctx.fillRect(tx - 4, floorY - 60, 8, 60);
            ctx.fillStyle = '#1a6b1a';
            ctx.beginPath(); ctx.moveTo(tx, floorY - 100); ctx.lineTo(tx - 25, floorY - 40); ctx.lineTo(tx + 25, floorY - 40); ctx.fill();
            ctx.beginPath(); ctx.moveTo(tx, floorY - 120); ctx.lineTo(tx - 18, floorY - 70); ctx.lineTo(tx + 18, floorY - 70); ctx.fill();
        }
        ctx.fillStyle = '#2a4a2a'; ctx.fillRect(0, floorY, W, H - floorY);
        ctx.strokeStyle = '#4a7a4a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();
    } else if (phase === 'castelo') {
        // Castle - grey stone
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#2a2a3a');
        grad.addColorStop(0.5, '#3a3a4e');
        grad.addColorStop(1, '#1a1a28');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        // Stone brick pattern
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
        for (let row = 0; row < H / 25; row++) {
            const offset = (row % 2) * 30;
            for (let col = -1; col < W / 60 + 1; col++) {
                ctx.strokeRect(col * 60 + offset, row * 25, 60, 25);
            }
        }
        // Torch flames
        for (let i = 0; i < 3; i++) {
            const fx = W * (0.15 + i * 0.35);
            ctx.fillStyle = '#5a4a3a'; ctx.fillRect(fx - 3, floorY - 50, 6, 50);
            const flicker = Math.sin(ts * 0.01 + i * 2) * 4;
            ctx.fillStyle = '#ff8800'; ctx.beginPath(); ctx.arc(fx, floorY - 55 + flicker, 8, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffcc00'; ctx.beginPath(); ctx.arc(fx, floorY - 57 + flicker, 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#3a3a4a'; ctx.fillRect(0, floorY, W, H - floorY);
        ctx.strokeStyle = '#5a5a6e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();
    } else if (phase === 'montanha') {
        // Mountain - icy blue
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0a1e3e');
        grad.addColorStop(0.4, '#1a3a6e');
        grad.addColorStop(1, '#0a1528');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        // Snow mountains
        ctx.fillStyle = '#4a6a9e';
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W * 0.15, floorY - 80); ctx.lineTo(W * 0.3, floorY); ctx.fill();
        ctx.beginPath(); ctx.moveTo(W * 0.5, floorY); ctx.lineTo(W * 0.7, floorY - 110); ctx.lineTo(W * 0.9, floorY); ctx.fill();
        // Snow caps
        ctx.fillStyle = '#ddeeff';
        ctx.beginPath(); ctx.moveTo(W * 0.12, floorY - 65); ctx.lineTo(W * 0.15, floorY - 80); ctx.lineTo(W * 0.18, floorY - 65); ctx.fill();
        ctx.beginPath(); ctx.moveTo(W * 0.66, floorY - 95); ctx.lineTo(W * 0.7, floorY - 110); ctx.lineTo(W * 0.74, floorY - 95); ctx.fill();
        // Snowflakes
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 20; i++) {
            const sx = (ts * 0.02 * (i + 1) + i * 137) % W;
            const sy = (ts * 0.015 * (i * 0.5 + 1) + i * 89) % (floorY);
            ctx.globalAlpha = 0.5 + Math.sin(ts * 0.005 + i) * 0.3;
            ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#c8d8f0'; ctx.fillRect(0, floorY, W, H - floorY);
        ctx.strokeStyle = '#8aa8d0'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();
    } else if (phase === 'deserto') {
        // Desert - orange/sand
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#4a2800');
        grad.addColorStop(0.3, '#c87020');
        grad.addColorStop(0.6, '#e8a040');
        grad.addColorStop(1, '#8a5020');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        // Sand dunes
        ctx.fillStyle = '#d4a050';
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.quadraticCurveTo(W * 0.25, floorY - 30, W * 0.5, floorY); ctx.quadraticCurveTo(W * 0.75, floorY - 20, W, floorY); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
        // Sun
        ctx.fillStyle = '#ffe080';
        ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 30;
        ctx.beginPath(); ctx.arc(W * 0.8, H * 0.15, 25, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        // Cactus
        ctx.fillStyle = '#2a7a2a';
        ctx.fillRect(W * 0.12 - 4, floorY - 40, 8, 40);
        ctx.fillRect(W * 0.12 + 4, floorY - 30, 15, 6);
        ctx.fillRect(W * 0.12 + 15, floorY - 35, 6, 15);
        ctx.fillRect(W * 0.85 - 4, floorY - 35, 8, 35);
        ctx.strokeStyle = '#b08040'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();
    } else if (phase === 'vulcao') {
        // Volcano - red/lava
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#1a0000');
        grad.addColorStop(0.3, '#3a0a0a');
        grad.addColorStop(0.6, '#5a1a0a');
        grad.addColorStop(1, '#2a0a00');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        // Volcano shape
        ctx.fillStyle = '#4a2a1a';
        ctx.beginPath(); ctx.moveTo(W * 0.3, floorY); ctx.lineTo(W * 0.45, floorY - 90); ctx.lineTo(W * 0.55, floorY - 90); ctx.lineTo(W * 0.7, floorY); ctx.fill();
        // Lava glow at top
        const lavaFlicker = Math.sin(ts * 0.008) * 5;
        ctx.fillStyle = '#ff4400';
        ctx.shadowColor = '#ff2200'; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.ellipse(W * 0.5, floorY - 88 + lavaFlicker, 18, 8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath(); ctx.ellipse(W * 0.5, floorY - 90 + lavaFlicker, 10, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        // Lava flow on floor
        ctx.fillStyle = '#cc3300';
        ctx.fillRect(0, floorY, W, H - floorY);
        // Lava bubbles
        for (let i = 0; i < 5; i++) {
            const bx = (ts * 0.01 + i * 200) % W;
            const by = floorY + 5 + Math.sin(ts * 0.005 + i * 3) * 5;
            ctx.fillStyle = '#ff6600'; ctx.beginPath(); ctx.arc(bx, by, 3 + Math.sin(ts * 0.01 + i) * 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = '#ff4400'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();
    } else if (phase === 'templo') {
        // Templo do Sábio — golden temple with animated pillars and floating math symbols
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#1a0e00');
        grad.addColorStop(0.35, '#3b1f00');
        grad.addColorStop(0.65, '#7c4a00');
        grad.addColorStop(1, '#2a1200');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

        // Sunray beams behind temple
        ctx.save();
        ctx.globalAlpha = 0.07;
        for (let r = 0; r < 12; r++) {
            const angle = (r / 12) * Math.PI * 2 + ts * 0.0003;
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(W * 0.5, floorY - 60);
            ctx.lineTo(W * 0.5 + Math.cos(angle) * W, floorY - 60 + Math.sin(angle) * H);
            ctx.lineTo(W * 0.5 + Math.cos(angle + 0.15) * W, floorY - 60 + Math.sin(angle + 0.15) * H);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        // Temple base / pediment
        const templeW = W * 0.55;
        const templeX = (W - templeW) / 2;
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(templeX, floorY - 90, templeW, 90); // base
        ctx.fillStyle = '#B8860B';
        // Pediment (triangle on top)
        ctx.beginPath();
        ctx.moveTo(templeX - 10, floorY - 90);
        ctx.lineTo(W / 2, floorY - 145);
        ctx.lineTo(templeX + templeW + 10, floorY - 90);
        ctx.closePath();
        ctx.fill();
        // Golden border on pediment
        ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(templeX - 10, floorY - 90);
        ctx.lineTo(W / 2, floorY - 145);
        ctx.lineTo(templeX + templeW + 10, floorY - 90);
        ctx.stroke();

        // Columns
        const numCols = 5;
        for (let c = 0; c < numCols; c++) {
            const colX = templeX + (c + 0.5) * (templeW / numCols);
            const colH = 80;
            // Column glow flicker
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 6 + Math.sin(ts * 0.005 + c * 1.3) * 3;
            ctx.fillStyle = '#D4A017';
            ctx.fillRect(colX - 5, floorY - colH, 10, colH);
            // Capital (column top)
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(colX - 8, floorY - colH, 16, 6);
            ctx.fillRect(colX - 6, floorY - 6, 12, 6);
        }
        ctx.shadowBlur = 0;

        // Floating multiplication symbols
        const mathSymbols = ['×2', '×3', '×5', '×7', '×9', '×4', '×6'];
        for (let i = 0; i < 7; i++) {
            const floatX = (i * W * 0.142 + ts * 0.015 * (i % 2 === 0 ? 1 : -1)) % W;
            const floatY = floorY - 110 - (i * 25 % 80) + Math.sin(ts * 0.004 + i * 0.9) * 10;
            if (floatY < 10 || floatY > floorY - 90) continue;
            ctx.globalAlpha = 0.45 + Math.sin(ts * 0.006 + i) * 0.2;
            ctx.fillStyle = '#FFD700';
            ctx.font = `bold ${Math.floor(W * 0.015 + 8)}px monospace`;
            ctx.textAlign = 'center';
            ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 8;
            ctx.fillText(mathSymbols[i], floatX, floatY);
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';

        // Floor
        ctx.fillStyle = '#6B4B00'; ctx.fillRect(0, floorY, W, H - floorY);
        // Golden floor line
        ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
        ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();
        ctx.shadowBlur = 0;

    } else if (phase === 'cidade') {
        // City - dark blue/neon
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0a0a2e');
        grad.addColorStop(0.5, '#1a1a4e');
        grad.addColorStop(1, '#0a0a1e');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        // Buildings silhouettes
        ctx.fillStyle = '#1a1a3a';
        const buildings = [0.05, 0.15, 0.25, 0.55, 0.65, 0.78, 0.88];
        const heights = [60, 90, 50, 80, 100, 70, 55];
        buildings.forEach((bx, i) => {
            const bw = W * 0.08;
            const bh = heights[i];
            ctx.fillRect(bx * W, floorY - bh, bw, bh);
            // Windows
            ctx.fillStyle = (Math.sin(ts * 0.002 + i * 5) > 0) ? '#ffd700' : '#334';
            for (let wy = floorY - bh + 8; wy < floorY - 5; wy += 15) {
                for (let wx = bx * W + 4; wx < bx * W + bw - 4; wx += 10) {
                    ctx.fillRect(wx, wy, 5, 7);
                }
            }
            ctx.fillStyle = '#1a1a3a';
        });
        // Stars
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 15; i++) {
            const sx = (i * 173 + 50) % W;
            const sy = (i * 97 + 20) % (floorY - 100);
            ctx.globalAlpha = 0.4 + Math.sin(ts * 0.003 + i) * 0.3;
            ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#2a2a4a'; ctx.fillRect(0, floorY, W, H - floorY);
        ctx.strokeStyle = '#4a4a7e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();
    } else {
        // Default fallback
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#1a0a2e'); grad.addColorStop(0.5, '#2d1b4e'); grad.addColorStop(1, '#0f0f23');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#3a2a5e'; ctx.fillRect(0, floorY, W, H - floorY);
        ctx.strokeStyle = '#6b5b9e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();
    }

    // Afterimages (rastro fantasma — atrás dos personagens)
    updateAndDrawAfterimages(W, H, floorY);

    // Draw both fighters
    if (fighters.p1) drawFighter(fighters.p1, ts, W, H, floorY);
    if (fighters.p2) drawFighter(fighters.p2, ts, W, H, floorY);

    // Rachaduras no chão (sobre o piso, abaixo dos projéteis)
    updateAndDrawGroundCracks(W, floorY);

    // Draw projectiles
    drawProjectiles(ctx, ts, W, H, floorY);

    // Partículas ambiente da arena (folhas, neve, brasas...)
    updateAndDrawArenaParticles(phase, W, H, floorY);

    // Ondas de choque nos impactos
    updateAndDrawScreenWaves();

    // Partículas de impacto
    updateAndDrawParticles(W, H);

    // Textos flutuantes (combo counter, etc.)
    updateAndDrawFloatingTexts(W, H);

    // Linhas radiais de fundo no super (efeito Dragon Ball)
    if (screenFlash > 0.28) {
        const radIntensity = Math.min(1, (screenFlash - 0.28) / 0.37);
        ctx.save();
        ctx.globalAlpha = radIntensity * 0.45;
        const radCx = W / 2, radCy = H * 0.42;
        for (let i = 0; i < 22; i++) {
            const ang = (i / 22) * Math.PI * 2;
            ctx.strokeStyle = i % 3 === 0 ? '#ff8800' : '#ffffff';
            ctx.lineWidth = 2 + (i % 3);
            ctx.beginPath();
            ctx.moveTo(radCx + Math.cos(ang) * 45, radCy + Math.sin(ang) * 45);
            ctx.lineTo(radCx + Math.cos(ang) * Math.max(W, H) * 1.3,
                       radCy + Math.sin(ang) * Math.max(W, H) * 1.3);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Flash branco (super golpe — última camada, cobre tudo)
    if (screenFlash > 0) {
        ctx.globalAlpha = screenFlash;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
        screenFlash = Math.max(0, screenFlash - 0.07);
    }
}

// ========== PARTÍCULAS DE IMPACTO ==========
function spawnHitParticles(f, W, H, floorY, color) {
    const cx = f.x * W;
    const scale = Math.min(W, H) * 0.003;
    const cy = floorY - 60 * Math.max(scale, 0.9);
    const c = color || f.char.accentColor || '#ff8800';
    // Colored burst
    for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.6;
        const speed = 1.5 + Math.random() * 4;
        particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            life: 1,
            decay: 0.028 + Math.random() * 0.025,
            size: 2 + Math.random() * 5,
            color: c
        });
    }
    // Yellow/orange sparks
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3,
            life: 1,
            decay: 0.05 + Math.random() * 0.05,
            size: 1.5 + Math.random() * 2.5,
            color: i % 2 === 0 ? '#ffd700' : '#ff8800'
        });
    }
    // Shockwave ring
    spawnShockwave(cx, cy, c, 70);
}

function spawnShockwave(x, y, color, maxR) {
    screenWaves.push({ x, y, r: 5, maxR: maxR || 70, color: color || '#fff', life: 1 });
}

function updateAndDrawScreenWaves() {
    if (!screenWaves.length) return;
    ctx.save();
    for (let i = screenWaves.length - 1; i >= 0; i--) {
        const w = screenWaves[i];
        w.r += (w.maxR - w.r) * 0.14 + 1.5;
        w.life -= 0.06;
        if (w.life <= 0) { screenWaves.splice(i, 1); continue; }
        ctx.globalAlpha = w.life * 0.65;
        ctx.strokeStyle = w.color;
        ctx.lineWidth = Math.max(0.5, w.life * 2.5);
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.stroke();
        // Second inner ring
        if (w.r > 15) {
            ctx.globalAlpha = w.life * 0.3;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.r * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
}

function updateAndDrawParticles(W, H) {
    ctx.save();
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravidade
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
}

// ========== PARTÍCULAS AMBIENTE DA ARENA ==========
function updateAndDrawArenaParticles(phase, W, H, floorY) {
    const MAX_ARENA_PARTICLES = 80;

    // Spawn baseado na fase
    if (arenaParticles.length < MAX_ARENA_PARTICLES) {
        if (phase === 'floresta' && Math.random() < 0.18) {
            arenaParticles.push({
                x: Math.random() * W, y: -8,
                vx: (Math.random() - 0.5) * 0.6 + 0.3,
                vy: 0.7 + Math.random() * 0.6,
                life: 1, decay: 0, offscreen: true,
                color: Math.random() < 0.5 ? '#2d8a2d' : '#4ab04a',
                size: 2.5 + Math.random() * 3.5
            });
        } else if (phase === 'vulcao' && Math.random() < 0.22) {
            arenaParticles.push({
                x: W * 0.5 + (Math.random() - 0.5) * W * 0.15, y: floorY - 88,
                vx: (Math.random() - 0.5) * 1.8,
                vy: -(1.2 + Math.random() * 2.2),
                life: 1, decay: 0.009,
                color: Math.random() < 0.5 ? '#ff4400' : '#ff8800',
                size: 1.5 + Math.random() * 2.5
            });
        } else if (phase === 'montanha' && Math.random() < 0.28) {
            arenaParticles.push({
                x: Math.random() * W, y: -5,
                vx: (Math.random() - 0.5) * 0.4,
                vy: 0.6 + Math.random() * 0.8,
                life: 0.85, decay: 0, offscreen: true,
                color: '#ddeeff',
                size: 1 + Math.random() * 2.5
            });
        } else if (phase === 'deserto' && Math.random() < 0.1) {
            arenaParticles.push({
                x: 0, y: floorY - Math.random() * 15,
                vx: 1.5 + Math.random() * 2,
                vy: -(Math.random() * 0.4),
                life: 0.8, decay: 0.006,
                color: '#d4a050',
                size: 1 + Math.random() * 2
            });
        } else if (phase === 'castelo' && Math.random() < 0.12) {
            const torchX = Math.random() < 0.5 ? W * 0.15 : W * 0.85;
            arenaParticles.push({
                x: torchX + (Math.random() - 0.5) * 8,
                y: floorY * 0.74,
                vx: (Math.random() - 0.5) * 1.2,
                vy: -(1.2 + Math.random() * 2),
                life: 1, decay: 0.04,
                color: Math.random() < 0.6 ? '#ff8800' : '#ffcc44',
                size: 1.5 + Math.random() * 2
            });
        }
    }

    // Atualizar e desenhar
    ctx.save();
    for (let i = arenaParticles.length - 1; i >= 0; i--) {
        const p = arenaParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.decay > 0) {
            p.life -= p.decay;
        } else if (p.offscreen && (p.y > H + 20 || p.x < -20 || p.x > W + 20)) {
            arenaParticles.splice(i, 1);
            continue;
        }
        if (p.life <= 0) { arenaParticles.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(p.life, 0.75);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
}

// ========== TEXTOS FLUTUANTES ==========
function spawnFloatingText(xNorm, yNorm, text, color) {
    floatingTexts.push({
        x: xNorm, y: yNorm,
        vy: -0.0025,
        life: 1, decay: 0.011,
        text, color: color || '#ffd700'
    });
}

function updateAndDrawFloatingTexts(W, H) {
    if (floatingTexts.length === 0) return;
    ctx.save();
    ctx.textAlign = 'center';
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy;
        ft.life -= ft.decay;
        if (ft.life <= 0) { floatingTexts.splice(i, 1); continue; }
        const fontSize = Math.max(10, Math.min(W, H) * 0.055 * ft.life + 8);
        ctx.globalAlpha = ft.life;
        ctx.font = `bold ${Math.round(fontSize)}px "Press Start 2P", monospace`;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 14;
        ctx.fillText(ft.text, ft.x * W, ft.y * H);
        ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
    ctx.restore();
}

// ========== AFTERIMAGE SYSTEM ==========
function updateAndDrawAfterimages(W, H, floorY) {
    for (let i = afterimages.length - 1; i >= 0; i--) {
        const a = afterimages[i];
        a.alpha -= 0.06;
        if (a.alpha <= 0) { afterimages.splice(i, 1); continue; }
        const cx = a.x * W;
        const dir = a.side === 'left' ? 1 : -1;
        const col = a.side === 'left' ? '#38bdf8' : '#f87171';
        ctx.save();
        ctx.globalAlpha = a.alpha;
        ctx.translate(cx, floorY);
        ctx.scale(dir * a.scale, a.scale);
        ctx.fillStyle = col;
        ctx.strokeStyle = col;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        // Silhueta stickman em pose de corrida
        ctx.beginPath(); ctx.arc(0, -94, 13, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(0, -36); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-2, -70); ctx.lineTo(22, -53); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-2, -70); ctx.lineTo(-20, -53); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -36); ctx.lineTo(16, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -36); ctx.lineTo(-13, 0); ctx.stroke();
        ctx.restore();
    }
}

// ========== MANGA IMPACT LINES (screen-space) ==========
function drawScreenImpactLines(cx, cy, intensity, ts) {
    if (intensity <= 0) return;
    ctx.save();
    for (let i = 0; i < 20; i++) {
        const ang = (i / 20) * Math.PI * 2 + ts * 0.003;
        const inner = 12;
        const outer = inner + (38 + (i % 4) * 20) * intensity;
        ctx.strokeStyle = i % 4 === 0 ? '#ff8800' : (i % 4 === 2 ? '#ffd700' : '#ffffff');
        ctx.lineWidth = Math.max(0.4, (3 - (i % 4) * 0.6) * intensity);
        ctx.globalAlpha = intensity * 0.7;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner);
        ctx.lineTo(cx + Math.cos(ang) * outer, cy + Math.sin(ang) * outer);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
}

// ========== GROUND CRACKS ==========
function spawnGroundCrack(xNorm) {
    const lines = [];
    for (let j = 0; j < 7; j++) {
        const baseAng = (j / 7) * Math.PI - Math.PI / 2 + (Math.random() - 0.5) * 0.65;
        const segments = 2 + Math.floor(Math.random() * 3);
        const segLen = (16 + Math.random() * 42) / segments;
        const pts = [{ x: 0, y: 0 }];
        let px = 0, py = 0;
        for (let s = 0; s < segments; s++) {
            const ang = baseAng + (Math.random() - 0.5) * 0.35;
            px += Math.cos(ang) * segLen;
            py += Math.sin(ang) * segLen;
            pts.push({ x: px, y: py });
        }
        lines.push(pts);
    }
    groundCracks.push({ x: xNorm, life: 1, decay: 0.007, lines });
}

function updateAndDrawGroundCracks(W, floorY) {
    for (let i = groundCracks.length - 1; i >= 0; i--) {
        const c = groundCracks[i];
        c.life -= c.decay;
        if (c.life <= 0) { groundCracks.splice(i, 1); continue; }
        const cx = c.x * W;
        ctx.save();
        ctx.globalAlpha = c.life * 0.9;
        ctx.strokeStyle = '#ff5500';
        ctx.shadowColor = '#ff8800';
        ctx.shadowBlur = 10 * c.life;
        ctx.lineWidth = Math.max(0.5, 2.5 * c.life);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        c.lines.forEach(pts => {
            ctx.beginPath();
            ctx.moveTo(cx + pts[0].x, floorY + pts[0].y);
            for (let s = 1; s < pts.length; s++) {
                ctx.lineTo(cx + pts[s].x, floorY + pts[s].y);
            }
            ctx.stroke();
        });
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

function drawFighter(f, ts, W, H, floorY) {
    const ch = f.char;
    // Smooth movement (lerp towards targetX)
    const lerpSpeed = 0.08;
    f.x += (f.targetX - f.x) * lerpSpeed;
    if (Math.abs(f.x - f.targetX) < 0.002) f.x = f.targetX;

    const cx = f.x * W;
    const baseScale = Math.min(W, H) * 0.003;
    const scale = Math.max(baseScale, 0.9);
    const dir = f.side === 'left' ? 1 : -1;

    // Mortal Kombat style rhythmic breathing & bouncing
    f.idleBob = Math.sin(ts * 0.004) * 5;
    const isAnimState = f.state === 'idle' || f.state === 'drink' || f.state === 'victory' || f.state === 'defeat';
    const bobY = isAnimState ? f.idleBob : 0;

    // Respiração sutil no idle: escala vertical ±1.2%
    const breatheScale = (f.state === 'idle')
        ? 1 + Math.sin(ts * 0.0022 + (f.side === 'right' ? 1.1 : 0)) * 0.012
        : 1;

    if (f.state !== 'idle' && f.state !== 'victory' && f.state !== 'defeat') {
        f.stateTimer--;
        if (f.stateTimer <= 0) f.state = 'idle';
    }

    const useFlash = f.flash > 0;
    if (useFlash) f.flash--;

    // Body lean na direção do movimento (estilo luta dinâmica)
    const velX = f.targetX - f.x;
    const leanAngle = Math.max(-0.13, Math.min(0.13, velX * 7));

    // Spawn afterimage ao dar dash
    f.afterimageTimer = Math.max(0, f.afterimageTimer - 1);
    if (Math.abs(velX) > 0.007 && f.afterimageTimer === 0) {
        afterimages.push({ x: f.x, side: f.side, alpha: 0.4, scale });
        f.afterimageTimer = 3;
    }

    // Poeira nos pés ao se mover
    f.dustTimer = Math.max(0, f.dustTimer - 1);
    if (Math.abs(velX) > 0.003 && f.dustTimer === 0 && f.state !== 'punch' && f.state !== 'special') {
        for (let d = 0; d < 2; d++) {
            particles.push({
                x: cx + (Math.random() - 0.5) * 18,
                y: floorY + 2,
                vx: (Math.random() - 0.5) * 1.8 - velX * W * 0.35,
                vy: -(0.3 + Math.random() * 1.0),
                life: 0.65,
                decay: 0.045 + Math.random() * 0.03,
                size: 4 + Math.random() * 5,
                color: '#b8b09a'
            });
        }
        f.dustTimer = 5;
    }

    ctx.save();
    ctx.translate(cx, floorY + bobY);
    if (Math.abs(leanAngle) > 0.005) ctx.rotate(leanAngle);
    ctx.scale(dir * scale, scale * breatheScale);

    if (useFlash && Math.floor(f.flash / 3) % 2 === 0) {
        ctx.globalAlpha = 0.4;
    }

    // Aura dourada quando super está desbloqueado (streak >= 5)
    const pid = f.side === 'left' ? 'p1' : 'p2';
    if (game[pid] && game[pid].streak >= 5 && f.state === 'idle') {
        const auraAlpha = 0.18 + Math.sin(ts * 0.008) * 0.1;
        const auraGrd = ctx.createRadialGradient(0, -55, 5, 0, -55, 52);
        auraGrd.addColorStop(0, 'rgba(255,215,0,0.6)');
        auraGrd.addColorStop(0.5, `rgba(255,180,0,${auraAlpha})`);
        auraGrd.addColorStop(1, 'rgba(255,140,0,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = auraGrd;
        ctx.beginPath(); ctx.arc(0, -55, 52, 0, Math.PI * 2); ctx.fill();
        // Partículas de energia girando
        ctx.globalAlpha = 0.55 + Math.sin(ts * 0.01) * 0.25;
        for (let i = 0; i < 4; i++) {
            const ang = (ts * 0.006) + (i / 4) * Math.PI * 2;
            const pr = 38 + Math.sin(ts * 0.008 + i) * 6;
            ctx.fillStyle = i % 2 === 0 ? '#ffd700' : '#ff8800';
            ctx.beginPath();
            ctx.arc(Math.cos(ang) * pr, -55 + Math.sin(ang) * pr * 0.4, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // --- Sombra projetada no chao (wider to match wider leg stance) ---
    ctx.save();
    ctx.globalAlpha = 0.38;
    const shadowGrd = ctx.createRadialGradient(0, 33, 0, 0, 33, 36);
    shadowGrd.addColorStop(0,   'rgba(0,0,0,0.85)');
    shadowGrd.addColorStop(0.5, 'rgba(0,0,0,0.4)');
    shadowGrd.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGrd;
    ctx.beginPath(); ctx.ellipse(0, 33, 36, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // Dispatch to character-specific drawer
    const drawer = CHAR_DRAWERS[ch.id] || drawGeneric;
    drawer(ctx, f, ch, ts);

    // --- Highlight direcional (luz de cima-esquerda) ---
    _drawHighlight(ctx, 0, -50, 30, 70);

    // Hit burst effect — manga style
    if (f.state === 'hit') {
        const hitP = Math.max(0.1, f.stateTimer / 25);
        // Flash central
        ctx.globalAlpha = hitP * 0.9;
        const burstR = 22 + Math.sin(ts * 0.03) * 4;
        const grd = ctx.createRadialGradient(5, -55, 0, 5, -55, burstR);
        grd.addColorStop(0, '#fff');
        grd.addColorStop(0.3, '#ff0');
        grd.addColorStop(1, 'rgba(255,80,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(5, -55, burstR, 0, Math.PI * 2); ctx.fill();
        // Linhas de velocidade (manga speed lines — em espaço local do personagem)
        for (let i = 0; i < 18; i++) {
            const a = (i / 18) * Math.PI * 2;
            const inner = 14;
            const outer = inner + (22 + (i % 4) * 16) * hitP;
            ctx.strokeStyle = i % 3 === 0 ? '#ffd700' : '#ffffff';
            ctx.lineWidth = Math.max(0.5, (2.8 - (i % 3) * 0.7) * hitP);
            ctx.globalAlpha = hitP * 0.85;
            ctx.beginPath();
            ctx.moveTo(5 + Math.cos(a) * inner, -55 + Math.sin(a) * inner);
            ctx.lineTo(5 + Math.cos(a) * outer, -55 + Math.sin(a) * outer);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    // Victory animation: bouncing + arms raised + stars orbiting + golden aura
    if (f.state === 'victory') {
        const bounce = Math.abs(Math.sin(ts * 0.008)) * 15;
        ctx.translate(0, -bounce);

        // Golden aura glow
        ctx.globalAlpha = 0.25 + Math.sin(ts * 0.005) * 0.15;
        const auraGrd = ctx.createRadialGradient(0, -50, 5, 0, -50, 45);
        auraGrd.addColorStop(0, '#ffd700');
        auraGrd.addColorStop(0.6, 'rgba(255,215,0,0.3)');
        auraGrd.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.fillStyle = auraGrd;
        ctx.beginPath(); ctx.arc(0, -50, 45, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        // Arms raised (override the normal arms)
        ctx.fillStyle = f.char.skinColor || '#e8c090';
        ctx.save();
        ctx.translate(-15, -65);
        ctx.rotate(-0.8 + Math.sin(ts * 0.01) * 0.15);
        ctx.fillRect(0, 0, 6, 22);
        ctx.restore();
        ctx.save();
        ctx.translate(15, -65);
        ctx.rotate(0.8 - Math.sin(ts * 0.01) * 0.15);
        ctx.fillRect(-6, 0, 6, 22);
        ctx.restore();

        // Orbiting stars
        for (let i = 0; i < 5; i++) {
            const angle = (ts * 0.004) + (i / 5) * Math.PI * 2;
            const starR = 35 + Math.sin(ts * 0.006 + i) * 5;
            const sx = Math.cos(angle) * starR;
            const sy = -55 + Math.sin(angle) * starR * 0.4;
            const starSize = 3 + Math.sin(ts * 0.01 + i * 2) * 1.5;

            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 8;
            // 4-point star
            ctx.beginPath();
            ctx.moveTo(sx, sy - starSize);
            ctx.lineTo(sx + starSize * 0.3, sy);
            ctx.lineTo(sx, sy + starSize);
            ctx.lineTo(sx - starSize * 0.3, sy);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(sx - starSize, sy);
            ctx.lineTo(sx, sy - starSize * 0.3);
            ctx.lineTo(sx + starSize, sy);
            ctx.lineTo(sx, sy + starSize * 0.3);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Laughing mouth (wide open grin)
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(0, -63, 5, 0, Math.PI, false);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-3, -63, 6, 2); // teeth
    }

    // Defeat animation: sinking + kneeling + tears falling + dark aura
    if (f.state === 'defeat') {
        // Sink down and tilt (kneeling effect)
        ctx.translate(0, 20);
        ctx.scale(1, 0.75); // squash vertically (kneeling)
        ctx.rotate((f.side === 'left' ? 0.12 : -0.12));

        // Dark sad aura
        ctx.globalAlpha = 0.2 + Math.sin(ts * 0.004) * 0.1;
        const sadGrd = ctx.createRadialGradient(0, -40, 5, 0, -40, 40);
        sadGrd.addColorStop(0, '#4466aa');
        sadGrd.addColorStop(0.6, 'rgba(68,102,170,0.2)');
        sadGrd.addColorStop(1, 'rgba(68,102,170,0)');
        ctx.fillStyle = sadGrd;
        ctx.beginPath(); ctx.arc(0, -40, 40, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        // Animated teardrops
        for (let t = 0; t < 3; t++) {
            const tearPhase = (ts * 0.003 + t * 2.1) % 3;
            const tearY = -65 + tearPhase * 18;
            const tearX = (t === 0 ? -7 : (t === 1 ? 7 : 0));
            const tearAlpha = 1 - (tearPhase / 3);

            ctx.globalAlpha = tearAlpha * 0.8;
            ctx.fillStyle = '#66b3ff';
            // Teardrop shape
            ctx.beginPath();
            ctx.moveTo(tearX, tearY - 3);
            ctx.quadraticCurveTo(tearX + 3, tearY, tearX, tearY + 4);
            ctx.quadraticCurveTo(tearX - 3, tearY, tearX, tearY - 3);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Sad mouth (curved down)
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -60, 4, 0.2, Math.PI - 0.2, true);
        ctx.stroke();

        // Closed/sad eyes (lines)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-8, -68); ctx.lineTo(-3, -66); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(3, -66); ctx.lineTo(8, -68); ctx.stroke();
    }

    ctx.restore();

    // Linhas de impacto em screen-space (maiores, não distorcidas pelo scale/flip)
    if (f.state === 'hit' && f.stateTimer > 4) {
        const impactP = f.stateTimer / 25;
        drawScreenImpactLines(f.x * W, floorY - 55 * scale, impactP, ts);
    }
}

// ========== PROJECTILE SYSTEM ==========
function spawnProjectile(attackerId, type) {
    AudioEngine.play('projectile');
    const atk = fighters[attackerId];
    const def = fighters[attackerId === 'p1' ? 'p2' : 'p1'];
    const dir = attackerId === 'p1' ? 1 : -1;
    projectiles.push({
        x: atk.x,
        y: 0.5,
        targetX: def.x,
        speed: type === 'super' ? 0.012 : 0.018,
        type: type, // 'special' or 'super'
        dir: dir,
        alive: true,
        trail: [],
        charColor: atk.char.accentColor || '#f59e0b',
        born: performance.now()
    });
}

function drawProjectiles(ctx, ts, W, H, floorY) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (!p.alive) { projectiles.splice(i, 1); continue; }

        // Move projectile
        p.x += p.speed * p.dir;

        // Check if reached target
        if ((p.dir > 0 && p.x >= p.targetX) || (p.dir < 0 && p.x <= p.targetX)) {
            p.alive = false;
            continue;
        }

        const px = p.x * W;
        const py = floorY - H * 0.35;

        // Store trail
        p.trail.push({ x: px, y: py, age: 0 });
        if (p.trail.length > 15) p.trail.shift();

        ctx.save();

        if (p.type === 'special') {
            // ⚡ LIGHTNING BOLT
            ctx.strokeStyle = p.charColor;
            ctx.lineWidth = 3;
            ctx.shadowColor = p.charColor;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(px, py);
            for (let s = 1; s <= 4; s++) {
                const sx = px + p.dir * s * 8;
                const sy = py + (Math.random() - 0.5) * 25;
                ctx.lineTo(sx, sy);
            }
            ctx.stroke();

            // Glow core
            const grd = ctx.createRadialGradient(px, py, 2, px, py, 16);
            grd.addColorStop(0, '#fff');
            grd.addColorStop(0.5, p.charColor);
            grd.addColorStop(1, 'transparent');
            ctx.fillStyle = grd;
            ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.fill();

        } else if (p.type === 'super') {
            // 💥 KAMEHAMEHA / ENERGY BEAM
            const beamLen = 60;
            const beamH = 12 + Math.sin(ts * 0.02) * 4;

            // Trail glow
            p.trail.forEach((t, ti) => {
                const alpha = (ti / p.trail.length) * 0.3;
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.beginPath(); ctx.arc(t.x, t.y, 6, 0, Math.PI * 2); ctx.fill();
            });

            // Main beam
            const gradient = ctx.createLinearGradient(px - beamLen * p.dir, py, px, py);
            gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
            gradient.addColorStop(0.3, p.charColor);
            gradient.addColorStop(0.7, '#fff');
            gradient.addColorStop(1, p.charColor);
            ctx.fillStyle = gradient;
            ctx.shadowColor = p.charColor;
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.ellipse(px, py, beamLen / 2, beamH / 2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Inner white core
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.beginPath();
            ctx.ellipse(px, py, beamLen / 4, beamH / 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Spark particles
            for (let s = 0; s < 5; s++) {
                const sx = px + (Math.random() - 0.5) * beamLen;
                const sy = py + (Math.random() - 0.5) * beamH * 2;
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2); ctx.fill();
            }
        }

        ctx.restore();
    }
}

// ========== HELPER DRAWING FUNCTIONS ==========
function _limb(ctx, x, y, w, h) { ctx.fillRect(x - w / 2, y, w, h); }
function _circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
function _eyes(ctx, y, angry) {
    // White
    ctx.fillStyle = '#fff';
    ctx.fillRect(-9, y, 7, angry ? 4 : 6);
    ctx.fillRect(3, y, 7, angry ? 4 : 6);
    // Pupil
    ctx.fillStyle = '#111';
    ctx.fillRect(-7, y + 1, 3, angry ? 3 : 4);
    ctx.fillRect(5, y + 1, 3, angry ? 3 : 4);
    // Angry brow
    if (angry) {
        ctx.fillStyle = '#000';
        ctx.save(); ctx.translate(-5, y - 2); ctx.rotate(-0.2); ctx.fillRect(-4, 0, 8, 2); ctx.restore();
        ctx.save(); ctx.translate(6, y - 2); ctx.rotate(0.2); ctx.fillRect(-4, 0, 8, 2); ctx.restore();
    }
}

// ---------- SHADOW PROJECTION (chao) ----------
function _drawShadow(ctx, x, y, width, height) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x, y + height, width * 0.6, height * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// ---------- HIGHLIGHT (luz direcional cima-esquerda) ----------
function _drawHighlight(ctx, x, y, w, h) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(x - w * 0.2, y + h * 0.3, w * 0.35, h * 0.3, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// ---------- FACE COM EXPRESSOES (redesign: olhos grandes com iris + highlight) ----------
// expression: 'idle' | 'punch' | 'hit' | 'victory' | 'defeat' | 'drink'
function _drawFace(ctx, skinC, expression, ts) {
    const eyeY = -93;
    const isHit  = expression === 'hit';
    const isDef  = expression === 'defeat';
    const isVic  = expression === 'victory';
    const isAng  = expression === 'punch' || isHit;

    // --- Eye whites (oval) ---
    ctx.fillStyle = '#fff';
    const eRX = isDef ? 4 : 6, eRY = isDef ? 2.5 : isHit ? 5.5 : 4.5;
    ctx.beginPath(); ctx.ellipse(-7, eyeY, eRX, eRY, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( 7, eyeY, eRX, eRY, 0, 0, Math.PI * 2); ctx.fill();

    // --- Iris ---
    const irisColor = isDef ? '#4b5563' : isVic ? '#f59e0b' : '#1d4ed8';
    ctx.fillStyle = irisColor;
    if (!isDef) {
        ctx.beginPath(); ctx.ellipse(-7, eyeY + 0.5, 3.5, 3.8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse( 7, eyeY + 0.5, 3.5, 3.8, 0, 0, Math.PI * 2); ctx.fill();
        // Pupils
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.ellipse(-7, eyeY + 0.5, 2, 2.8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse( 7, eyeY + 0.5, 2, 2.8, 0, 0, Math.PI * 2); ctx.fill();
        // Highlight sparkle
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        _circle(ctx, -5.5, eyeY - 1.5, 1.4);
        _circle(ctx,  8.5, eyeY - 1.5, 1.4);
    } else {
        // Defeat: dull lines
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(-10, eyeY - 1, 6, 2); ctx.fillRect(4, eyeY - 1, 6, 2);
    }

    // --- Brows (thicker, more expressive) ---
    ctx.fillStyle = '#1a0f00';
    if (isVic) {
        ctx.save(); ctx.translate(-7, eyeY - 7); ctx.rotate(-0.22); ctx.fillRect(-5, 0, 11, 2.5); ctx.restore();
        ctx.save(); ctx.translate( 7, eyeY - 7); ctx.rotate( 0.22); ctx.fillRect(-6, 0, 11, 2.5); ctx.restore();
    } else if (isAng) {
        ctx.save(); ctx.translate(-7, eyeY - 7); ctx.rotate(-0.42); ctx.fillRect(-5, 0, 11, 3); ctx.restore();
        ctx.save(); ctx.translate( 7, eyeY - 7); ctx.rotate( 0.42); ctx.fillRect(-6, 0, 11, 3); ctx.restore();
    } else if (isDef) {
        ctx.save(); ctx.translate(-7, eyeY - 5); ctx.rotate( 0.25); ctx.fillRect(-4, 0, 9, 2.5); ctx.restore();
        ctx.save(); ctx.translate( 7, eyeY - 5); ctx.rotate(-0.25); ctx.fillRect(-5, 0, 9, 2.5); ctx.restore();
    } else {
        ctx.save(); ctx.translate(-7, eyeY - 7); ctx.rotate(-0.12); ctx.fillRect(-5, 0, 11, 2.5); ctx.restore();
        ctx.save(); ctx.translate( 7, eyeY - 7); ctx.rotate( 0.12); ctx.fillRect(-6, 0, 11, 2.5); ctx.restore();
    }

    // --- Mouth (only shown when not masked — characters can draw their own mask over it) ---
    ctx.fillStyle = '#8b4513';
    if (isVic) {
        ctx.save(); ctx.translate(0, -83);
        ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI); ctx.fill();
        ctx.restore();
    } else if (isHit) {
        ctx.beginPath(); ctx.arc(0, -83, 3.5, 0, Math.PI * 2); ctx.fill();
    } else if (isDef) {
        ctx.save(); ctx.translate(0, -82); ctx.rotate(Math.PI);
        ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI); ctx.fill();
        ctx.restore();
    } else if (expression === 'drink') {
        ctx.fillRect(-3, -84, 6, 2.5);
    } else {
        ctx.fillRect(-4, -84, 8, 2);
    }

    // Hit flash effect
    if (expression === 'hit') {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#f00';
        ctx.beginPath(); ctx.arc(0, -88, 20, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
}
function _drawLegs(ctx, f, pantsC, shoeC, spread, shoeW) {
    const sp = spread || 12;
    const sw = shoeW || 10;
    const KY = 13; // knee Y

    // Thigh: wide trapezoid hip→knee
    function _thigh(x) {
        ctx.beginPath();
        ctx.moveTo(x - 8, -5);   ctx.lineTo(x + 8, -5);
        ctx.lineTo(x + 5.5, KY); ctx.lineTo(x - 5.5, KY);
        ctx.closePath(); ctx.fill();
    }
    // Shin: tapers knee→ankle
    function _shin(x) {
        ctx.beginPath();
        ctx.moveTo(x - 5.5, KY + 1); ctx.lineTo(x + 5.5, KY + 1);
        ctx.lineTo(x + 3.5, 28);     ctx.lineTo(x - 3.5, 28);
        ctx.closePath(); ctx.fill();
    }
    // Boot: flat, wide, rounded
    function _boot(x) {
        _roundRect(ctx, x - sw / 2 - 2, 27, sw + 5, 9, 3); ctx.fill();
    }
    // Hip circle to blend leg into torso
    function _hip(x) { _circle(ctx, x, -4, 7); }

    if (f.state === 'kick') {
        ctx.fillStyle = pantsC;
        _hip(-sp); _thigh(-sp); _circle(ctx, -sp, KY, 7); _shin(-sp);
        ctx.fillStyle = shoeC; _boot(-sp);
        // Kick leg — 45°, shoe inside same transform
        ctx.fillStyle = pantsC;
        ctx.save(); ctx.translate(sp, -14); ctx.rotate(-Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(-8, -2); ctx.lineTo(8, -2);
        ctx.lineTo(5.5, KY + 6); ctx.lineTo(-5.5, KY + 6);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = shoeC;
        _roundRect(ctx, -sw / 2 - 2, -(sw + 5), sw + 5, 9, 3); ctx.fill();
        ctx.restore();
    } else {
        // Wide MK fighting stance
        const bx = -sp - 3; // back leg x
        const fx =  sp + 4; // front leg x
        ctx.fillStyle = pantsC;
        _hip(bx); _thigh(bx); _circle(ctx, bx, KY, 7); _shin(bx);
        _hip(fx); _thigh(fx); _circle(ctx, fx, KY, 7); _shin(fx);
        ctx.fillStyle = shoeC;
        _boot(bx); _boot(fx);
    }
}

function _drawArms(ctx, f, armColor, fistColor, torsoTop) {
    const ty  = torsoTop || -70;
    const lElbY = ty + 14; // left elbow y
    const rElbY = ty + 12; // right elbow y

    // Shoulder bulge — rounds the arm attachment to torso
    function _shoulder(side) {
        _circle(ctx, side * 19, ty + 1, 9);
    }

    // Upper arm: wide trapezoid shoulder→elbow + elbow circle
    function _upperArm(side) {
        const ey = side === -1 ? lElbY : rElbY;
        ctx.beginPath();
        ctx.moveTo(side * 12, ty);  ctx.lineTo(side * 26, ty);
        ctx.lineTo(side * 30, ey);  ctx.lineTo(side * 16, ey);
        ctx.closePath(); ctx.fill();
        _circle(ctx, side * 24, ey, 6.5);
    }

    ctx.fillStyle = armColor;

    if (f.state === 'punch') {
        // Right arm punches forward, left arm guards
        _shoulder(1);
        ctx.fillStyle = armColor;
        ctx.save(); ctx.translate(20, ty + 9); ctx.rotate(0.07);
        ctx.fillRect(0, -6, 60, 12);
        ctx.fillStyle = fistColor;
        ctx.fillRect(58, -8, 14, 14);
        ctx.restore();
        ctx.fillStyle = armColor;
        _shoulder(-1); _upperArm(-1);
        _limb(ctx, -22, lElbY, 9, 12);
        ctx.fillStyle = fistColor;
        _limb(ctx, -22, ty + 24, 10, 10); // left fist

    } else if (f.state === 'special') {
        _shoulder(-1); _shoulder(1);
        ctx.fillStyle = armColor;
        ctx.save(); ctx.translate(10, ty + 12);
        ctx.fillRect(0, -6, 46, 11);
        ctx.fillRect(0,  5, 46, 11);
        ctx.restore();

    } else if (f.state === 'drink') {
        ctx.fillStyle = armColor;
        _shoulder(-1); _upperArm(-1);
        _limb(ctx, -22, lElbY, 9, 12);
        ctx.fillStyle = fistColor;
        _limb(ctx, -22, ty + 24, 10, 10);
        ctx.fillStyle = armColor;
        _shoulder(1);
        ctx.save(); ctx.translate(14, ty + 4); ctx.rotate(-1.2);
        ctx.fillRect(0, -4, 9, 28);
        ctx.fillStyle = '#22c55e';
        _roundRect(ctx, -4, -18, 14, 16, 4); ctx.fill();
        ctx.fillStyle = '#16a34a'; ctx.fillRect(1, -24, 6, 8);
        ctx.fillStyle = 'rgba(74,222,128,0.5)';
        ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 10;
        _roundRect(ctx, -1, -14, 10, 8, 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fbbf24';
        const sparkT = Date.now() * 0.005;
        _circle(ctx, -6 + Math.sin(sparkT) * 4, -20 + Math.cos(sparkT) * 3, 2);
        _circle(ctx, 14 + Math.cos(sparkT * 1.3) * 3, -16 + Math.sin(sparkT * 0.8) * 4, 1.5);
        _circle(ctx, 4 + Math.sin(sparkT * 0.7) * 5, -28 + Math.cos(sparkT * 1.1) * 2, 1.5);
        ctx.restore();
        ctx.fillStyle = '#4ade80'; ctx.font = 'bold 14px sans-serif';
        const riseT = Date.now() * 0.003;
        ctx.globalAlpha = 0.7;
        ctx.fillText('+', 6 + Math.sin(riseT) * 8,  -100 - (riseT % 30) * 2);
        ctx.fillText('+', -8 + Math.cos(riseT * 1.2) * 6, -110 - (riseT % 25) * 2);
        ctx.globalAlpha = 1;

    } else {
        // Guard stance — stable positions so character overlays stay aligned.
        // Body breathing bob is handled by idleBob in drawFighter(), not here.
        ctx.fillStyle = armColor;

        // Left arm (back arm — tucked, forearm angled up)
        _shoulder(-1); _upperArm(-1);
        _limb(ctx, -22, lElbY, 9, 12);       // forearm
        ctx.fillStyle = fistColor;
        _limb(ctx, -22, ty + 24, 10, 10);    // left fist

        // Right arm (front arm — extended guard)
        ctx.fillStyle = armColor;
        _shoulder(1); _upperArm(1);
        _limb(ctx, 20, rElbY, 9, 11);        // forearm
        ctx.fillStyle = fistColor;
        _limb(ctx, 20, ty + 20, 10, 10);     // right fist
    }
}

// ================================================================
// CHARACTER-SPECIFIC DRAWERS
// ================================================================
const CHAR_DRAWERS = {};

// ----- RYUKEN (Ryu - White gi, muscular, red headband with flowing tails) -----
CHAR_DRAWERS['ryuken'] = (ctx, f, ch, ts) => {
    _drawLegs(ctx, f, '#e8e8e8', '#8b4513', 12, 11);
    // Torso - white gi (wider, muscular)
    ctx.fillStyle = '#e8e8e8';
    _roundRect(ctx, -22, -80, 44, 50, 5); ctx.fill();
    // Deep V-neck showing muscular chest
    ctx.fillStyle = '#e8c090';
    ctx.beginPath(); ctx.moveTo(-12, -80); ctx.lineTo(12, -80); ctx.lineTo(0, -55); ctx.closePath(); ctx.fill();
    // Pec definition in V-opening
    ctx.strokeStyle = '#d4a878'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(-3, -68, 5, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.beginPath(); ctx.arc(3, -68, 5, 0.3, Math.PI - 0.3); ctx.stroke();
    // Gi fold shadow
    ctx.fillStyle = '#d4d4d4'; ctx.fillRect(5, -78, 2, 38); ctx.fillRect(-7, -76, 2, 34);
    // Black belt (thick)
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-22, -34, 44, 8);
    // Belt knot with dangling ends
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-4, -26, 3, 10); ctx.fillRect(1, -26, 3, 12);
    // Arms (muscular skin with torn gi)
    _drawArms(ctx, f, '#e8c090', '#e8c090', -74);
    // Torn gi sleeve fragments on shoulders (bigger)
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(-26, -78, 10, 14); ctx.fillRect(16, -78, 10, 14);
    // Torn ragged edges
    ctx.fillStyle = '#ccc';
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(-26 + i * 3, -64, 2, 3 + (i % 2) * 2);
        ctx.fillRect(16 + i * 3, -64, 2, 3 + (i % 2) * 2);
    }
    // Red fingerless gloves (bigger, more visible)
    ctx.fillStyle = '#dc2626';
    if (f.state !== 'punch') {
        ctx.fillRect(-28, -50, 12, 7); ctx.fillRect(17, -54, 12, 7);
        // Glove finger openings
        ctx.fillStyle = '#e8c090';
        ctx.fillRect(-26, -44, 3, 3); ctx.fillRect(-22, -44, 3, 3);
        ctx.fillRect(19, -48, 3, 3); ctx.fillRect(23, -48, 3, 3);
    }
    // Head (slightly larger)
    ctx.fillStyle = '#e8c090'; _circle(ctx, 0, -94, 18);
    // Short dark brown hair (swept back, thicker)
    ctx.fillStyle = '#3a2000';
    ctx.beginPath(); ctx.arc(0, -102, 16, Math.PI + 0.2, -0.2); ctx.fill();
    ctx.fillRect(-14, -108, 28, 8);
    // Hair texture
    ctx.fillStyle = '#4a2800';
    ctx.fillRect(-12, -107, 4, 6); ctx.fillRect(-4, -108, 4, 7); ctx.fillRect(4, -107, 4, 6); ctx.fillRect(10, -106, 4, 5);
    // RED HEADBAND (wider, more prominent)
    ctx.fillStyle = '#dc2626'; ctx.fillRect(-20, -103, 40, 6);
    // LONG flowing headband tails behind (much longer!)
    ctx.fillStyle = '#dc2626';
    ctx.save(); ctx.translate(-20, -100);
    ctx.fillRect(-8, 0, 8, 4);
    ctx.fillRect(-14, 4, 10, 3);
    ctx.fillRect(-18, 7, 8, 3);
    ctx.fillRect(-20, 10, 6, 3);
    ctx.restore();
    // Eyes (intense, angry)
    _drawFace(ctx, '#e8c090', f.state, ts);
    // SPECIAL: Hadouken
    if (f.state === 'special') {
        ctx.fillStyle = '#3b82f6';
        ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = 20;
        _circle(ctx, 56, -60, 15);
        ctx.fillStyle = '#bfdbfe';
        _circle(ctx, 56, -60, 8);
        ctx.shadowBlur = 0;
    }
};

// ----- SCORPIUS (Scorpion - Full yellow ninja, spiked shoulders, kunai) -----
CHAR_DRAWERS['scorpius'] = (ctx, f, ch, ts) => {
    _drawLegs(ctx, f, '#854d0e', '#4a3010');
    // Torso - yellow ninja vest with detail
    ctx.fillStyle = '#eab308';
    _roundRect(ctx, -19, -78, 38, 48, 4); ctx.fill();
    // Textured scale pattern on chest
    ctx.fillStyle = '#d4a106';
    for (let y = -74; y < -38; y += 8) {
        for (let x = -14; x < 14; x += 8) {
            ctx.fillRect(x, y, 6, 6);
        }
    }
    // Cross harness straps (leather)
    ctx.fillStyle = '#4a3010'; ctx.lineWidth = 4;
    ctx.fillRect(-2, -78, 4, 44); // vertical center
    ctx.save(); ctx.translate(0, -78); ctx.rotate(0.3);
    ctx.fillRect(-2, 0, 4, 42); ctx.restore();
    ctx.save(); ctx.translate(0, -78); ctx.rotate(-0.3);
    ctx.fillRect(-2, 0, 4, 42); ctx.restore();
    // Belt buckle (scorpion emblem)
    ctx.fillStyle = '#854d0e'; ctx.fillRect(-19, -34, 38, 7);
    ctx.fillStyle = '#fbbf24'; _circle(ctx, 0, -30, 5);
    ctx.fillStyle = '#854d0e'; _circle(ctx, 0, -30, 3);
    // SPIKED SHOULDER PADS
    ctx.fillStyle = '#854d0e';
    _circle(ctx, -23, -72, 10); _circle(ctx, 23, -72, 10);
    ctx.fillStyle = '#4a3010';
    // Spikes on left shoulder
    ctx.beginPath(); ctx.moveTo(-28, -80); ctx.lineTo(-30, -90); ctx.lineTo(-26, -82); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-20, -80); ctx.lineTo(-18, -88); ctx.lineTo(-16, -80); ctx.closePath(); ctx.fill();
    // Spikes on right shoulder
    ctx.beginPath(); ctx.moveTo(28, -80); ctx.lineTo(30, -90); ctx.lineTo(26, -82); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(20, -80); ctx.lineTo(18, -88); ctx.lineTo(16, -80); ctx.closePath(); ctx.fill();
    // Arms (yellow armored)
    _drawArms(ctx, f, '#eab308', '#eab308', -72);
    // Arm bracers with studs
    ctx.fillStyle = '#854d0e';
    if (f.state !== 'punch') {
        ctx.fillRect(-27, -56, 11, 8); ctx.fillRect(17, -56, 11, 8);
        ctx.fillStyle = '#4a3010';
        _circle(ctx, -24, -53, 2); _circle(ctx, -20, -53, 2);
        _circle(ctx, 20, -53, 2); _circle(ctx, 24, -53, 2);
    }
    // Head - masked ninja
    ctx.fillStyle = '#eab308'; _circle(ctx, 0, -92, 17);
    // Hood covering head
    ctx.fillStyle = '#854d0e';
    ctx.beginPath(); ctx.arc(0, -100, 17, Math.PI, 0); ctx.fill();
    ctx.fillRect(-17, -100, 34, 7);
    // Face mask with texture
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-14, -88, 28, 10);
    // Mask texture lines
    ctx.fillStyle = '#d4a106';
    ctx.fillRect(-12, -86, 24, 1); ctx.fillRect(-12, -83, 24, 1); ctx.fillRect(-12, -80, 24, 1);
    // Glowing eyes via shadowBlur override
    _drawFace(ctx, '#eab308', f.state, ts);
    ctx.shadowColor = '#fef08a'; ctx.shadowBlur = 8;
    // Override eyes to white glowing (Scorpion style)
    ctx.fillStyle = '#fff';
    ctx.fillRect(-9, -95, 7, 5);
    ctx.fillRect(3, -95, 7, 5);
    ctx.shadowBlur = 0;
    // Angry brow ridge above eyes
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(-11, -100, 9, 3); ctx.fillRect(3, -100, 9, 3);
    // Kunai weapon on back
    ctx.fillStyle = '#c0c0c0';
    ctx.save(); ctx.translate(-14, -60); ctx.rotate(-0.4);
    ctx.fillRect(0, -22, 2, 18);
    ctx.fillStyle = '#888';
    ctx.beginPath(); ctx.moveTo(-3, -22); ctx.lineTo(1, -32); ctx.lineTo(5, -22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4a3010'; ctx.fillRect(-1, -2, 4, 8); // handle wrap
    ctx.restore();
    // SPECIAL: Hellfire spear
    if (f.state === 'special') {
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#dc2626'; ctx.shadowBlur = 15;
        _circle(ctx, 56, -58, 12);
        ctx.fillStyle = '#fef08a';
        _circle(ctx, 56, -58, 5);
        ctx.shadowBlur = 0;
    }
};

// ----- SUB-FROST (Sub-Zero - Blue ninja, spiked blue hair, ice armor, snowflake headband) -----
CHAR_DRAWERS['subfrost'] = (ctx, f, ch, ts) => {
    _drawLegs(ctx, f, '#1e40af', '#1a2e6e');
    // Torso - blue ninja armor with swirl patterns
    ctx.fillStyle = '#3b82f6';
    _roundRect(ctx, -19, -78, 38, 48, 4); ctx.fill();
    // Armor chest plate (darker)
    ctx.fillStyle = '#1e40af';
    _roundRect(ctx, -16, -76, 32, 22, 3); ctx.fill();
    // Ice swirl decorations on armor
    ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-5, -68, 6, 0, Math.PI * 1.5); ctx.stroke();
    ctx.beginPath();
    ctx.arc(7, -62, 5, 0.5, Math.PI * 2); ctx.stroke();
    // Snowflake emblem on chest center
    ctx.fillStyle = '#bfdbfe';
    _circle(ctx, 0, -66, 3);
    ctx.strokeStyle = '#bfdbfe'; ctx.lineWidth = 1;
    for (let a = 0; a < 6; a++) {
        const ang = a * Math.PI / 3;
        ctx.beginPath(); ctx.moveTo(0, -66);
        ctx.lineTo(Math.cos(ang) * 6, -66 + Math.sin(ang) * 6); ctx.stroke();
    }
    // Shoulder armor pads
    ctx.fillStyle = '#1e40af';
    _circle(ctx, -22, -72, 8); _circle(ctx, 22, -72, 8);
    ctx.fillStyle = '#60a5fa';
    _circle(ctx, -22, -72, 4); _circle(ctx, 22, -72, 4);
    // Belt with ice crystal buckle
    ctx.fillStyle = '#1e40af'; ctx.fillRect(-19, -34, 38, 7);
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath(); ctx.moveTo(0, -37); ctx.lineTo(6, -30); ctx.lineTo(0, -24); ctx.lineTo(-6, -30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#bfdbfe'; _circle(ctx, 0, -30, 2);
    // Arms
    _drawArms(ctx, f, '#3b82f6', '#93c5fd', -72);
    // Arm bracers with ice details
    ctx.fillStyle = '#1e40af';
    if (f.state !== 'punch') {
        ctx.fillRect(-27, -58, 11, 9); ctx.fillRect(17, -58, 11, 9);
        ctx.fillStyle = '#93c5fd';
        ctx.fillRect(-25, -55, 7, 1); ctx.fillRect(-25, -52, 7, 1);
        ctx.fillRect(19, -55, 7, 1); ctx.fillRect(19, -52, 7, 1);
    }
    // Head (blue-tinted)
    ctx.fillStyle = '#6ba4d1'; _circle(ctx, 0, -92, 17);
    // Hood
    ctx.fillStyle = '#1e40af';
    ctx.beginPath(); ctx.arc(0, -100, 17, Math.PI, 0); ctx.fill();
    ctx.fillRect(-17, -100, 34, 7);
    // SPIKED BLUE HAIR above hood (Sub-Frost's signature from portrait)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-14, -107);
    ctx.lineTo(-10, -122); ctx.lineTo(-6, -110);
    ctx.lineTo(-2, -126); ctx.lineTo(2, -112);
    ctx.lineTo(6, -128); ctx.lineTo(10, -110);
    ctx.lineTo(14, -120); ctx.lineTo(16, -107);
    ctx.closePath(); ctx.fill();
    // Hair highlight
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(-4, -110); ctx.lineTo(-1, -122); ctx.lineTo(2, -110);
    ctx.closePath(); ctx.fill();
    // SNOWFLAKE HEADBAND (metallic strip)
    ctx.fillStyle = '#94a3b8'; ctx.fillRect(-18, -103, 36, 5);
    // Snowflake symbol on headband center
    ctx.fillStyle = '#bfdbfe';
    _circle(ctx, 0, -100, 3);
    ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 1;
    for (let a = 0; a < 6; a++) {
        const ang = a * Math.PI / 3;
        ctx.beginPath(); ctx.moveTo(0, -100);
        ctx.lineTo(Math.cos(ang) * 4, -100 + Math.sin(ang) * 4); ctx.stroke();
    }
    // Face mask (layered)
    ctx.fillStyle = '#2563eb'; ctx.fillRect(-14, -88, 28, 10);
    ctx.fillStyle = '#1e40af'; ctx.fillRect(-12, -86, 24, 1); ctx.fillRect(-12, -83, 24, 1);
    // Ice-blue face with glowing override via _drawFace
    _drawFace(ctx, '#3b82f6', f.state, ts);
    // Override eyes to ice-blue glowing (SubFrost style)
    ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 12;
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(-9, -95, 7, 5);
    ctx.fillRect(3, -95, 7, 5);
    ctx.shadowBlur = 0;
    // Frost particles around (idle) — more particles
    if (f.state === 'idle') {
        ctx.fillStyle = 'rgba(147, 197, 253, 0.7)';
        for (let i = 0; i < 8; i++) {
            const px = Math.sin(ts * 0.003 + i * 0.8) * 30;
            const py = -50 + Math.cos(ts * 0.004 + i * 0.7) * 35;
            _circle(ctx, px, py, 1.5 + Math.sin(ts * 0.005 + i) * 0.8);
        }
        // Frosty mist at feet
        ctx.fillStyle = 'rgba(191, 219, 254, 0.3)';
        ctx.beginPath(); ctx.ellipse(0, 35, 30, 6, 0, 0, Math.PI * 2); ctx.fill();
    }
    // SPECIAL: Ice blast
    if (f.state === 'special') {
        ctx.fillStyle = '#93c5fd';
        ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 20;
        _circle(ctx, 56, -58, 16);
        ctx.fillStyle = '#e0f2fe';
        _circle(ctx, 56, -58, 8);
        // Ice crystals around blast
        ctx.fillStyle = '#bfdbfe';
        for (let i = 0; i < 5; i++) {
            const ang = ts * 0.01 + i * Math.PI * 0.4;
            _circle(ctx, 56 + Math.cos(ang) * 12, -58 + Math.sin(ang) * 12, 3);
        }
        ctx.shadowBlur = 0;
    }
};

// ----- GOKHAN (Goku SSJ - Orange gi, GOLDEN spiky hair, muscular, energy aura) -----
CHAR_DRAWERS['gokhan'] = (ctx, f, ch, ts) => {
    // SUPER SAIYAN ENERGY AURA (behind character)
    if (f.state === 'idle') {
        const auraAlpha = 0.15 + Math.sin(ts * 0.005) * 0.08;
        ctx.fillStyle = `rgba(251, 191, 36, ${auraAlpha})`;
        ctx.beginPath(); ctx.ellipse(0, -50, 35 + Math.sin(ts * 0.006) * 3, 65 + Math.cos(ts * 0.004) * 4, 0, 0, Math.PI * 2); ctx.fill();
        // Sparks around aura
        ctx.fillStyle = 'rgba(254, 240, 138, 0.6)';
        for (let i = 0; i < 4; i++) {
            const ax = Math.sin(ts * 0.007 + i * 1.5) * 28;
            const ay = -50 + Math.cos(ts * 0.009 + i * 1.1) * 45;
            _circle(ctx, ax, ay, 1.5);
        }
    }
    _drawLegs(ctx, f, '#f97316', '#1e3a8a');
    // Torso - orange gi (muscular build)
    ctx.fillStyle = '#f97316';
    _roundRect(ctx, -21, -80, 42, 50, 5); ctx.fill();
    // Blue undershirt at neckline and sleeves
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-12, -80, 24, 10);
    // Gi folds
    ctx.fillStyle = '#ea6c10';
    ctx.fillRect(4, -70, 2, 30); ctx.fillRect(-6, -68, 2, 28);
    // Symbol on chest (turtle school kanji)
    ctx.fillStyle = '#dc2626';
    _circle(ctx, 0, -62, 8);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-4, -67, 8, 2); ctx.fillRect(-1, -68, 2, 10);
    ctx.fillRect(-3, -60, 6, 2);
    // Blue belt (cloth)
    ctx.fillStyle = '#2563eb'; ctx.fillRect(-21, -34, 42, 7);
    ctx.fillStyle = '#1e40af'; ctx.fillRect(-3, -34, 6, 7); // belt knot
    // Arms (muscular skin + wristbands)
    _drawArms(ctx, f, '#e8c090', '#e8c090', -74);
    // Blue wristbands (thicker)
    ctx.fillStyle = '#2563eb';
    if (f.state !== 'punch') {
        ctx.fillRect(-28, -54, 13, 7); ctx.fillRect(16, -54, 13, 7);
        ctx.fillStyle = '#dc2626'; // red trim
        ctx.fillRect(-28, -54, 13, 2); ctx.fillRect(16, -54, 13, 2);
    }
    // Blue boots (with red sole line)
    ctx.fillStyle = '#dc2626'; ctx.fillRect(-16, 36, 10, 2); ctx.fillRect(6, 36, 10, 2);
    // Head
    ctx.fillStyle = '#e8c090'; _circle(ctx, 0, -94, 18);
    // ★★ GOLDEN SUPER SAIYAN HAIR ★★ (matching portrait!)
    ctx.fillStyle = '#fbbf24';
    const ssjSpikes = [
        [-14, -112, -11, -145, -6, -112],
        [-8, -112, -4, -150, 0, -112],
        [-2, -112, 2, -155, 6, -112],
        [4, -112, 8, -148, 12, -112],
        [10, -112, 15, -140, 18, -112],
        [-18, -105, -28, -130, -14, -108],
        [-20, -100, -32, -118, -16, -102],
        [14, -105, 28, -128, 18, -108],
        [16, -100, 30, -116, 20, -102],
    ];
    ssjSpikes.forEach(s => {
        ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.lineTo(s[4], s[5]); ctx.closePath(); ctx.fill();
    });
    // Hair base
    ctx.beginPath(); ctx.arc(0, -105, 17, Math.PI, 0); ctx.fill();
    // Golden highlight streaks
    ctx.fillStyle = '#fde68a';
    ssjSpikes.slice(0, 5).forEach(s => {
        ctx.beginPath(); ctx.moveTo(s[0] + 2, s[1]); ctx.lineTo(s[2], s[3] + 8); ctx.lineTo(s[4] - 2, s[5]); ctx.closePath(); ctx.fill();
    });
    // SSJ golden glow around hair
    ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
    _circle(ctx, 0, -120, 20);
    ctx.shadowBlur = 0;
    // Eyes (teal in SSJ form) - via _drawFace then override
    _drawFace(ctx, '#e8c090', f.state, ts);
    // Override to teal SSJ eyes
    ctx.fillStyle = '#14b8a6';
    _circle(ctx, -6, -94, 2.5); _circle(ctx, 7, -94, 2.5);
    // Angry brows (SSJ intensity)
    ctx.fillStyle = '#000';
    ctx.save(); ctx.translate(-6, -99); ctx.rotate(-0.25); ctx.fillRect(-5, 0, 10, 2); ctx.restore();
    ctx.save(); ctx.translate(7, -99); ctx.rotate(0.25); ctx.fillRect(-5, 0, 10, 2); ctx.restore();
    // Determined grin via mouth override
    ctx.strokeStyle = '#8b5e3c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -84, 5, 0.1, Math.PI - 0.1); ctx.stroke();
    // SPECIAL: Kamehameha
    if (f.state === 'special') {
        ctx.fillStyle = '#3b82f6';
        ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = 25;
        _circle(ctx, 58, -58, 18);
        ctx.fillStyle = '#bfdbfe';
        _circle(ctx, 58, -58, 10);
        ctx.fillStyle = '#e0f2fe';
        _circle(ctx, 58, -58, 4);
        ctx.shadowBlur = 0;
    }
};

// ----- VEGGAN (Vegeta - BLUE-tinted skin, blue/gold Saiyan armor with gem, flame hair) -----
CHAR_DRAWERS['veggan'] = (ctx, f, ch, ts) => {
    _drawLegs(ctx, f, '#1e3a8a', '#312e81');
    // Torso - Saiyan armor (blue with gold accents - matching portrait)
    ctx.fillStyle = '#2563eb';
    _roundRect(ctx, -21, -80, 42, 48, 4); ctx.fill();
    // White chest plate over blue bodysuit
    ctx.fillStyle = '#e2e8f0';
    _roundRect(ctx, -18, -78, 36, 35, 4); ctx.fill();
    // Gold wing emblem on chest
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, -72); ctx.lineTo(-14, -60); ctx.lineTo(-10, -58); ctx.lineTo(0, -65);
    ctx.lineTo(10, -58); ctx.lineTo(14, -60); ctx.closePath(); ctx.fill();
    // PINK GEM in center of chest emblem
    ctx.fillStyle = '#ec4899';
    ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 6;
    _circle(ctx, 0, -63, 4);
    ctx.fillStyle = '#fbcfe8'; _circle(ctx, -1, -64, 1.5); // gem highlight
    ctx.shadowBlur = 0;
    // Armor border lines
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
    ctx.strokeRect(-18, -78, 36, 35);
    // SPIKED SHOULDER PADS (gold with white)
    ctx.fillStyle = '#e2e8f0';
    _circle(ctx, -24, -74, 10); _circle(ctx, 24, -74, 10);
    ctx.fillStyle = '#f59e0b';
    _circle(ctx, -24, -74, 6); _circle(ctx, 24, -74, 6);
    // Spikes on shoulders
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.moveTo(-30, -78); ctx.lineTo(-32, -92); ctx.lineTo(-28, -80); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(30, -78); ctx.lineTo(32, -92); ctx.lineTo(28, -80); ctx.closePath(); ctx.fill();
    // Blue bodysuit below armor
    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(-21, -44, 42, 8);
    // Arms - blue bodysuit with white gloves
    _drawArms(ctx, f, '#1e3a8a', '#e2e8f0', -74);
    // Gold-trimmed white gloves
    ctx.fillStyle = '#e2e8f0';
    if (f.state !== 'punch') {
        ctx.fillRect(-28, -54, 13, 9); ctx.fillRect(16, -54, 13, 9);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-28, -54, 13, 2); ctx.fillRect(16, -54, 13, 2);
    }
    // Head (BLUE-TINTED SKIN - matching portrait)
    ctx.fillStyle = '#8ba4c8'; _circle(ctx, 0, -94, 17);
    // TALL FLAME HAIR (black, much taller - Vegeta's iconic)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(-17, -100);
    ctx.lineTo(-15, -135); ctx.lineTo(-9, -112);
    ctx.lineTo(-7, -142); ctx.lineTo(-2, -115);
    ctx.lineTo(1, -148); ctx.lineTo(4, -115);
    ctx.lineTo(7, -140); ctx.lineTo(11, -112);
    ctx.lineTo(14, -132); ctx.lineTo(17, -100);
    ctx.closePath(); ctx.fill();
    // Hair highlight (dark blue sheen)
    ctx.fillStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.moveTo(-5, -112); ctx.lineTo(-3, -135); ctx.lineTo(-1, -112);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3, -112); ctx.lineTo(5, -132); ctx.lineTo(7, -112);
    ctx.closePath(); ctx.fill();
    // Widow's peak (V-shaped hairline)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.moveTo(-15, -104); ctx.lineTo(0, -92); ctx.lineTo(15, -104);
    ctx.lineTo(15, -110); ctx.lineTo(-15, -110); ctx.closePath(); ctx.fill();
    // Deep-set angry eyes via _drawFace then override
    _drawFace(ctx, '#1e3a8a', f.state, ts);
    // Override: very angry brows (blue skin, dark hair)
    ctx.fillStyle = '#1a1a1a';
    ctx.save(); ctx.translate(-5, -100); ctx.rotate(-0.3); ctx.fillRect(-5, 0, 10, 2.5); ctx.restore();
    ctx.save(); ctx.translate(6, -100); ctx.rotate(0.3); ctx.fillRect(-5, 0, 10, 2.5); ctx.restore();
    // Scowl mouth override
    ctx.fillStyle = '#5a7a9c'; ctx.fillRect(-4, -84, 8, 2);
    // SPECIAL: Galick Gun
    if (f.state === 'special') {
        ctx.fillStyle = '#a855f7';
        ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 22;
        _circle(ctx, 58, -58, 17);
        ctx.fillStyle = '#e9d5ff';
        _circle(ctx, 58, -58, 9);
        ctx.fillStyle = '#f5f3ff';
        _circle(ctx, 58, -58, 4);
        ctx.shadowBlur = 0;
    }
};

// ----- CHUN-LEI (Chun-Li - Blue qipao, THICK muscular legs, ox-horn buns with RED ribbons) -----
CHAR_DRAWERS['chunlei'] = (ctx, f, ch, ts) => {
    // ★ SIGNATURE THICK MUSCULAR LEGS (much wider than normal) ★
    const sp = 11;
    if (f.state === 'kick') {
        // Standing leg (THICK)
        ctx.fillStyle = '#e8c8a0'; _limb(ctx, -sp, -5, 14, 30);
        // Pantyhose shading
        ctx.fillStyle = 'rgba(180, 140, 100, 0.3)'; _limb(ctx, -sp, -5, 14, 30);
        ctx.fillStyle = '#e8e8e8'; _limb(ctx, -sp, 25, 9, 10);
        // Kick leg (THICK and extended)
        ctx.fillStyle = '#e8c8a0';
        ctx.save(); ctx.translate(sp, -10); ctx.rotate(-Math.PI / 4.5);
        ctx.fillRect(-6, -42, 14, 42); ctx.restore();
        ctx.fillStyle = '#e8e8e8';
        ctx.save(); ctx.translate(sp + 24, -48); ctx.fillRect(-5, -3, 11, 7); ctx.restore();
    } else {
        // Both legs (THICK - 14px wide vs normal 9px)
        ctx.fillStyle = '#e8c8a0';
        _limb(ctx, -sp, -5, 14, 34); _limb(ctx, sp, -5, 14, 34);
        // Pantyhose shading lines
        ctx.fillStyle = 'rgba(180, 140, 100, 0.2)';
        ctx.fillRect(-sp - 7, 5, 14, 2); ctx.fillRect(sp - 7, 5, 14, 2);
        ctx.fillRect(-sp - 7, 15, 14, 2); ctx.fillRect(sp - 7, 15, 14, 2);
        ctx.fillStyle = '#e8e8e8';
        _limb(ctx, -sp, 29, 9, 10); _limb(ctx, sp, 29, 9, 10);
    }
    // Torso - blue qipao
    ctx.fillStyle = '#2563eb';
    _roundRect(ctx, -18, -80, 36, 52, 4); ctx.fill();
    // Qipao side slits showing skin
    ctx.fillStyle = '#e8c8a0';
    ctx.fillRect(-18, -35, 4, 8); ctx.fillRect(14, -35, 4, 8);
    // ★ GOLD TRIM on qipao (elaborate) ★
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-18, -80, 2, 52); ctx.fillRect(16, -80, 2, 52);
    ctx.fillRect(-18, -80, 36, 3); ctx.fillRect(-18, -32, 36, 3);
    // Gold collar trim
    ctx.fillRect(-10, -80, 20, 3);
    ctx.fillStyle = '#d4a017'; ctx.fillRect(-8, -80, 16, 2);
    // ★ GOLD CLOUD/DRAGON EMBROIDERY (matching portrait) ★
    ctx.fillStyle = '#fbbf24';
    // Swirl cloud pattern
    ctx.beginPath(); ctx.arc(6, -62, 5, 0, Math.PI * 1.6); ctx.lineWidth = 2; ctx.strokeStyle = '#fbbf24'; ctx.stroke();
    ctx.beginPath(); ctx.arc(-5, -52, 4, 0.5, Math.PI * 2); ctx.stroke();
    _circle(ctx, 8, -55, 2); _circle(ctx, -3, -60, 2); _circle(ctx, 0, -45, 2);
    // Gold waistband
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(-16, -56, 32, 3);
    // Arms
    _drawArms(ctx, f, '#f0c8a0', '#f0c8a0', -74);
    // ★ SPIKED BRACELETS (bigger, gold with studs) ★
    ctx.fillStyle = '#fbbf24';
    if (f.state !== 'punch') {
        ctx.fillRect(-28, -56, 13, 6); ctx.fillRect(16, -56, 13, 6);
        // Studs
        ctx.fillStyle = '#b8860b';
        _circle(ctx, -24, -53, 2); _circle(ctx, -20, -53, 2); _circle(ctx, -16, -53, 2);
        _circle(ctx, 19, -53, 2); _circle(ctx, 23, -53, 2); _circle(ctx, 27, -53, 2);
    }
    // Head
    ctx.fillStyle = '#f0c8a0'; _circle(ctx, 0, -94, 17);
    // ★ OX-HORN HAIR BUNS (larger, with RED ribbons) ★
    ctx.fillStyle = '#3b2300';
    _circle(ctx, -18, -106, 11);
    _circle(ctx, 18, -106, 11);
    // Bun spiral texture
    ctx.strokeStyle = '#2a1800'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(-18, -106, 6, 0, Math.PI * 3); ctx.stroke();
    ctx.beginPath(); ctx.arc(18, -106, 6, 0, Math.PI * 3); ctx.stroke();
    // Bun covers (white silk)
    ctx.fillStyle = '#e8e8e8';
    _circle(ctx, -18, -106, 7);
    _circle(ctx, 18, -106, 7);
    // Cover pattern
    ctx.fillStyle = '#d4d4d4';
    _circle(ctx, -18, -106, 3); _circle(ctx, 18, -106, 3);
    // ★ RED RIBBONS flowing from buns (portrait signature!) ★
    ctx.fillStyle = '#dc2626';
    // Left bun ribbons
    ctx.fillRect(-26, -102, 4, 16);
    ctx.fillRect(-28, -90, 3, 10);
    // Right bun ribbons
    ctx.fillRect(22, -102, 4, 16);
    ctx.fillRect(25, -90, 3, 10);
    // Ribbon tips (lighter)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-29, -82, 4, 5); ctx.fillRect(25, -82, 4, 5);
    // Bangs (brown, framing face)
    ctx.fillStyle = '#3b2300';
    ctx.fillRect(-13, -108, 26, 7);
    // Side bangs
    ctx.fillRect(-15, -104, 4, 8); ctx.fillRect(11, -104, 4, 8);
    // Ox-horn buns - face via _drawFace
    _drawFace(ctx, '#f0c8a0', f.state, ts);
    // Override: feminine round eyes with eyelashes
    ctx.fillStyle = '#4a2800';
    _circle(ctx, -5, -94, 2.5); _circle(ctx, 7, -94, 2.5);
    // Red lipstick override
    ctx.fillStyle = '#ef4444'; ctx.fillRect(-3, -85, 6, 2);
    // SPECIAL: Kikoken
    if (f.state === 'special') {
        ctx.fillStyle = '#60a5fa';
        ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 15;
        _circle(ctx, 55, -60, 14);
        ctx.fillStyle = '#bfdbfe';
        _circle(ctx, 55, -60, 7);
        ctx.shadowBlur = 0;
    }
};

// ----- LIU-FANG (Liu Kang - Shirtless muscular, red headband, arm bandages) -----
CHAR_DRAWERS['liufang'] = (ctx, f, ch, ts) => {
    _drawLegs(ctx, f, '#1a1a1a', '#333');
    // Torso - shirtless, VERY muscular (wider)
    ctx.fillStyle = '#c8a070';
    _roundRect(ctx, -22, -80, 44, 50, 5); ctx.fill();
    // ★ DETAILED MUSCULATURE ★
    ctx.strokeStyle = '#a08050'; ctx.lineWidth = 1.5;
    // Pecs (larger, more defined)
    ctx.beginPath(); ctx.arc(-8, -68, 8, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(8, -68, 8, 0.2, Math.PI - 0.2); ctx.stroke();
    // Center chest line
    ctx.beginPath(); ctx.moveTo(0, -72); ctx.lineTo(0, -35); ctx.stroke();
    // Six-pack abs (3 pairs)
    ctx.beginPath(); ctx.moveTo(-9, -57); ctx.lineTo(9, -57); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8, -49); ctx.lineTo(8, -49); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-7, -41); ctx.lineTo(7, -41); ctx.stroke();
    // Side obliques
    ctx.beginPath(); ctx.moveTo(-18, -60); ctx.lineTo(-12, -55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(18, -60); ctx.lineTo(12, -55); ctx.stroke();
    // Collarbone
    ctx.beginPath(); ctx.moveTo(-16, -76); ctx.lineTo(0, -72); ctx.lineTo(16, -76); ctx.stroke();
    // Black pants with red waistband
    ctx.fillStyle = '#dc2626'; ctx.fillRect(-22, -34, 44, 6);
    ctx.fillStyle = '#fbbf24'; _circle(ctx, 0, -31, 3); // gold buckle
    // Arms (muscular skin)
    _drawArms(ctx, f, '#c8a070', '#c8a070', -74);
    // ★ ARM WRAPS / BANDAGES (matching portrait) ★
    ctx.fillStyle = '#e8e0d0';
    if (f.state !== 'punch') {
        // Left arm wraps
        ctx.fillRect(-28, -58, 12, 3); ctx.fillRect(-28, -53, 12, 3); ctx.fillRect(-28, -48, 12, 3);
        // Right arm wraps
        ctx.fillRect(17, -58, 12, 3); ctx.fillRect(17, -53, 12, 3); ctx.fillRect(17, -48, 12, 3);
    }
    // Head
    ctx.fillStyle = '#c8a070'; _circle(ctx, 0, -94, 18);
    // Black hair (medium length, flowing back, thicker)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(0, -102, 17, Math.PI + 0.15, -0.15); ctx.fill();
    ctx.fillRect(-15, -108, 30, 8);
    // Hair flowing behind (longer)
    ctx.fillRect(-19, -104, 6, 18);
    ctx.fillRect(-21, -92, 4, 10);
    // ★ RED HEADBAND (wider, with LONG flowing tails) ★
    ctx.fillStyle = '#dc2626'; ctx.fillRect(-20, -103, 40, 6);
    // Long flowing tails (very prominent like portrait)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-22, -99, 4, 12);
    ctx.fillRect(-26, -95, 5, 14);
    ctx.fillRect(-30, -88, 4, 10);
    ctx.fillRect(-32, -82, 3, 8);
    // Eyes (intense, focused)
    _drawFace(ctx, '#e8c090', f.state, ts);
    // Strong jawline accent
    ctx.strokeStyle = '#a08050'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, -88, 14, 0.3, Math.PI - 0.3); ctx.stroke();
    // Focused mouth
    ctx.fillStyle = '#8b5e3c'; ctx.fillRect(-4, -84, 8, 2);
    // SPECIAL: Fire kick
    if (f.state === 'special') {
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 18;
        _circle(ctx, 55, -58, 16);
        ctx.fillStyle = '#fbbf24';
        _circle(ctx, 55, -58, 8);
        ctx.fillStyle = '#fef08a';
        _circle(ctx, 55, -58, 3);
        ctx.shadowBlur = 0;
    }
};

// ----- KEN-FIRE (Ken - Red gi, MASSIVE blonde flowing hair, fire aura, confident) -----
CHAR_DRAWERS['kenfire'] = (ctx, f, ch, ts) => {
    // ★ FIRE AURA behind character (idle) ★
    if (f.state === 'idle') {
        const auraAlpha = 0.1 + Math.sin(ts * 0.006) * 0.06;
        ctx.fillStyle = `rgba(220, 38, 38, ${auraAlpha})`;
        ctx.beginPath(); ctx.ellipse(0, -50, 32 + Math.sin(ts * 0.005) * 3, 55, 0, 0, Math.PI * 2); ctx.fill();
    }
    _drawLegs(ctx, f, '#dc2626', '#8b4513');
    // Torso - red gi (wider, muscular)
    ctx.fillStyle = '#dc2626';
    _roundRect(ctx, -22, -80, 44, 50, 5); ctx.fill();
    // Gi fold shadows
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(4, -80, 3, 42); ctx.fillRect(-7, -78, 2, 38);
    // Gi lapel detail
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.moveTo(-10, -80); ctx.lineTo(0, -65); ctx.lineTo(10, -80); ctx.closePath(); ctx.fill();
    // Kanji on chest (gold)
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3, -68, 6, 2); ctx.fillRect(-1, -72, 2, 10);
    ctx.fillRect(-4, -64, 8, 2);
    // Black belt (thick)
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-22, -34, 44, 8);
    // Belt knot
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-4, -26, 3, 10); ctx.fillRect(1, -26, 3, 12);
    // Arms (skin)
    _drawArms(ctx, f, '#e8c090', '#e8c090', -74);
    // Red fingerless gloves (bigger)
    ctx.fillStyle = '#dc2626';
    if (f.state !== 'punch') {
        ctx.fillRect(-28, -50, 12, 8); ctx.fillRect(17, -54, 12, 8);
        // Finger openings
        ctx.fillStyle = '#e8c090';
        ctx.fillRect(-26, -43, 3, 3); ctx.fillRect(-22, -43, 3, 3);
        ctx.fillRect(19, -47, 3, 3); ctx.fillRect(23, -47, 3, 3);
    }
    // Head
    ctx.fillStyle = '#e8c090'; _circle(ctx, 0, -94, 18);
    // ★★ MASSIVE BLONDE FLOWING HAIR (Ken's signature - much bigger!) ★★
    ctx.fillStyle = '#fbbf24';
    // Main flowing mass behind head
    ctx.beginPath(); ctx.arc(0, -102, 18, Math.PI + 0.05, -0.05); ctx.fill();
    ctx.fillRect(-17, -110, 34, 10);
    // Wild spikes going up and outward
    const kenSpikes = [
        [-12, -110, -8, -126, -4, -110],
        [-5, -110, -1, -130, 3, -110],
        [2, -110, 7, -128, 12, -110],
        [8, -110, 14, -122, 18, -110],
    ];
    kenSpikes.forEach(s => {
        ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.lineTo(s[4], s[5]); ctx.closePath(); ctx.fill();
    });
    // ★ Hair FLOWING BEHIND and to the SIDES (much larger, wild) ★
    ctx.beginPath();
    ctx.moveTo(-17, -100); ctx.lineTo(-28, -110); ctx.lineTo(-26, -98);
    ctx.lineTo(-34, -106); ctx.lineTo(-30, -92);
    ctx.lineTo(-36, -96); ctx.lineTo(-32, -84);
    ctx.lineTo(-28, -80); ctx.lineTo(-17, -88);
    ctx.closePath(); ctx.fill();
    // Right side flowing
    ctx.beginPath();
    ctx.moveTo(17, -100); ctx.lineTo(26, -108); ctx.lineTo(24, -96);
    ctx.lineTo(30, -102); ctx.lineTo(26, -88);
    ctx.lineTo(17, -88);
    ctx.closePath(); ctx.fill();
    // Hair highlights
    ctx.fillStyle = '#fde68a';
    kenSpikes.slice(0, 2).forEach(s => {
        ctx.beginPath(); ctx.moveTo(s[0] + 2, s[1]); ctx.lineTo(s[2], s[3] + 6); ctx.lineTo(s[4] - 2, s[5]);
        ctx.closePath(); ctx.fill();
    });
    ctx.fillRect(-28, -102, 6, 3); ctx.fillRect(-32, -92, 4, 3);
    // Thick blonde eyebrows
    ctx.fillStyle = '#d4a017';
    ctx.fillRect(-11, -101, 9, 3); ctx.fillRect(3, -101, 9, 3);
    // Eyes (blue, confident)
    ctx.fillStyle = '#fff';
    ctx.fillRect(-9, -97, 7, 5); ctx.fillRect(3, -97, 7, 5);
    ctx.fillStyle = '#2563eb';
    _circle(ctx, -5, -95, 2); _circle(ctx, 7, -95, 2);
    // Confident smirk with visible teeth
    ctx.strokeStyle = '#8b5e3c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(3, -84, 5, 0, Math.PI * 0.6); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.fillRect(1, -84, 5, 2); // teeth
    // SPECIAL: Shoryuken fire
    if (f.state === 'special') {
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#dc2626'; ctx.shadowBlur = 22;
        _circle(ctx, 56, -60, 16);
        ctx.fillStyle = '#fef08a';
        _circle(ctx, 56, -60, 8);
        ctx.fillStyle = '#fff';
        _circle(ctx, 56, -60, 3);
        ctx.shadowBlur = 0;
    }
};

// ----- FRIZA (Frieza - WHITE/PINK/PURPLE alien, HORNS, long tail, bio-armor) -----
CHAR_DRAWERS['friza'] = (ctx, f, ch, ts) => {
    // Alien legs (pink/white segmented)
    const sp = 10;
    if (f.state === 'kick') {
        ctx.fillStyle = '#f0c8e0'; _limb(ctx, -sp, -5, 8, 30);
        ctx.fillStyle = '#7c3aed'; _limb(ctx, -sp, 25, 8, 8);
        ctx.fillStyle = '#f0c8e0';
        ctx.save(); ctx.translate(sp, -10); ctx.rotate(-Math.PI / 4.5);
        ctx.fillRect(-4, -40, 8, 40); ctx.restore();
    } else {
        ctx.fillStyle = '#f0c8e0';
        _limb(ctx, -sp, -5, 8, 32); _limb(ctx, sp, -5, 8, 32);
        // Leg armor segments
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(-sp - 4, 0, 8, 4); ctx.fillRect(sp - 4, 0, 8, 4);
        ctx.fillRect(-sp - 4, 10, 8, 4); ctx.fillRect(sp - 4, 10, 8, 4);
        ctx.fillStyle = '#7c3aed';
        _limb(ctx, -sp, 27, 8, 8); _limb(ctx, sp, 27, 8, 8);
    }
    // LONG TAIL curving behind (bigger, more visible)
    ctx.fillStyle = '#c084fc';
    ctx.save(); ctx.translate(-8, -15);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-25, 5, -35, -15);
    ctx.quadraticCurveTo(-42, -30, -38, -45);
    ctx.quadraticCurveTo(-35, -50, -30, -45);
    ctx.quadraticCurveTo(-34, -30, -28, -18);
    ctx.quadraticCurveTo(-18, 0, 0, -5);
    ctx.closePath(); ctx.fill();
    // Tail tip (pink)
    ctx.fillStyle = '#f0abfc'; _circle(ctx, -37, -47, 4);
    ctx.restore();
    // Torso - pink/purple bio-armor
    ctx.fillStyle = '#f0c8e0';
    _roundRect(ctx, -19, -80, 38, 50, 6); ctx.fill();
    // Purple bio-armor chest plate
    ctx.fillStyle = '#7c3aed';
    _roundRect(ctx, -15, -76, 30, 20, 4); ctx.fill();
    // Pink bio-segments
    ctx.fillStyle = '#ec4899';
    _roundRect(ctx, -12, -72, 24, 12, 2); ctx.fill();
    // Chest gem (gold)
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 5;
    _circle(ctx, 0, -66, 4);
    ctx.fillStyle = '#fef08a'; _circle(ctx, -1, -67, 1.5);
    ctx.shadowBlur = 0;
    // Waist armor
    ctx.fillStyle = '#c084fc'; ctx.fillRect(-19, -32, 38, 5);
    // Rib-like segments on sides
    ctx.fillStyle = '#ddb8e8';
    ctx.fillRect(-19, -55, 5, 3); ctx.fillRect(14, -55, 5, 3);
    ctx.fillRect(-19, -50, 5, 3); ctx.fillRect(14, -50, 5, 3);
    ctx.fillRect(-19, -45, 5, 3); ctx.fillRect(14, -45, 5, 3);
    // Arms (pink/white)
    _drawArms(ctx, f, '#f0c8e0', '#ddb8e8', -74);
    // Arm armor segments
    ctx.fillStyle = '#c084fc';
    if (f.state !== 'punch') {
        ctx.fillRect(-27, -58, 10, 4); ctx.fillRect(17, -58, 10, 4);
        ctx.fillRect(-27, -52, 10, 4); ctx.fillRect(17, -52, 10, 4);
    }
    // Head (alien, pink/purple)
    ctx.fillStyle = '#ddb8e8'; _circle(ctx, 0, -94, 16);
    // Purple forehead dome
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath(); ctx.arc(0, -102, 14, Math.PI, 0); ctx.fill();
    // ★★ HORNS (matching portrait — two large horns!) ★★
    ctx.fillStyle = '#e2e8f0';
    // Left horn
    ctx.beginPath();
    ctx.moveTo(-13, -108); ctx.lineTo(-22, -130); ctx.lineTo(-10, -112);
    ctx.closePath(); ctx.fill();
    // Right horn
    ctx.beginPath();
    ctx.moveTo(13, -108); ctx.lineTo(22, -130); ctx.lineTo(10, -112);
    ctx.closePath(); ctx.fill();
    // Horn tips (pink)
    ctx.fillStyle = '#f0abfc';
    _circle(ctx, -21, -129, 2); _circle(ctx, 21, -129, 2);
    // Forehead gem (purple)
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 5;
    _circle(ctx, 0, -105, 4);
    ctx.fillStyle = '#e9d5ff'; _circle(ctx, -1, -106, 1.5);
    ctx.shadowBlur = 0;
    // Face via _drawFace then override red menacing eyes
    _drawFace(ctx, '#ddb8e8', f.state, ts);
    ctx.fillStyle = '#fecaca';
    ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 4;
    ctx.fillRect(-9, -97, 7, 4); ctx.fillRect(3, -97, 7, 4);
    ctx.fillStyle = '#dc2626';
    _circle(ctx, -5, -95, 2); _circle(ctx, 6, -95, 2);
    ctx.shadowBlur = 0;
    // Lipless mouth with sinister smile
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, -84, 5, 0.2, Math.PI - 0.2); ctx.stroke();
    // SPECIAL: Death beam
    if (f.state === 'special') {
        ctx.fillStyle = '#a855f7';
        ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 18;
        _circle(ctx, 56, -58, 12);
        ctx.fillStyle = '#f0abfc';
        _circle(ctx, 56, -58, 6);
        // Death beam line
        ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(18, -60); ctx.lineTo(56, -58); ctx.stroke();
        ctx.shadowBlur = 0;
    }
};

// ----- KITARA (Kitana - Blue ninja princess, TIARA, very long hair, fan weapon, earrings) -----
CHAR_DRAWERS['kitara'] = (ctx, f, ch, ts) => {
    _drawLegs(ctx, f, '#1d4ed8', '#1e40af');
    // Torso - blue bodysuit with silver trim
    ctx.fillStyle = '#1d4ed8';
    _roundRect(ctx, -18, -80, 36, 50, 4); ctx.fill();
    // Lighter blue front panel with pattern
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-8, -80, 16, 46);
    // Silver trim lines on bodysuit
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-18, -80, 36, 2); ctx.fillRect(-18, -56, 36, 1);
    ctx.fillRect(-18, -80, 2, 46); ctx.fillRect(16, -80, 2, 46);
    // Gold waist sash (more elaborate)
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(-18, -36, 36, 6);
    // Hanging sash pieces
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-8, -30, 4, 14); ctx.fillRect(4, -30, 4, 12);
    ctx.fillStyle = '#d4a017';
    ctx.fillRect(-7, -18, 2, 4); ctx.fillRect(5, -20, 2, 4);
    // Arms
    _drawArms(ctx, f, '#f0c8a0', '#f0c8a0', -74);
    // Arm guards (silver/blue)
    ctx.fillStyle = '#3b82f6';
    if (f.state !== 'punch') {
        ctx.fillRect(-28, -58, 11, 8); ctx.fillRect(17, -58, 11, 8);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-28, -58, 11, 2); ctx.fillRect(17, -58, 11, 2);
    }
    // ★ FAN WEAPON (larger, more elaborate) ★
    if (f.state === 'idle' || f.state === 'hit') {
        ctx.fillStyle = '#93c5fd';
        ctx.save(); ctx.translate(22, -48);
        // Fan ribs (more of them)
        for (let i = 0; i < 7; i++) {
            ctx.save(); ctx.rotate(-0.35 + i * 0.12);
            ctx.fillRect(0, -2, 22, 2);
            ctx.restore();
        }
        // Fan membrane
        ctx.fillStyle = 'rgba(96, 165, 250, 0.5)';
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.arc(0, 0, 20, -0.4, 0.45); ctx.closePath(); ctx.fill();
        // Fan edge (razor sharp)
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, 22, -0.38, 0.43); ctx.stroke();
        ctx.restore();
    }
    // Head
    ctx.fillStyle = '#f0c8a0'; _circle(ctx, 0, -94, 17);
    // ★ VERY LONG BLACK HAIR (flowing down past waist - portrait signature!) ★
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(0, -102, 16, Math.PI, 0); ctx.fill();
    ctx.fillRect(-16, -102, 32, 7);
    // Hair flowing down both sides (VERY long, past body)
    ctx.fillRect(-18, -98, 5, 40);
    ctx.fillRect(13, -98, 5, 40);
    // Extra long hair strands flowing further
    ctx.fillRect(-20, -80, 4, 35);
    ctx.fillRect(16, -80, 4, 35);
    // Hair behind (visible as silhouette)
    ctx.fillRect(-14, -98, 28, 5);
    // Hair highlights
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(-17, -90, 3, 15); ctx.fillRect(14, -90, 3, 15);
    // ★ SILVER TIARA / CROWN (matching Ninja Princess portrait!) ★
    ctx.fillStyle = '#c0c8d4';
    ctx.fillRect(-14, -110, 28, 5);
    // Tiara peaks
    ctx.beginPath();
    ctx.moveTo(-10, -110); ctx.lineTo(-8, -118); ctx.lineTo(-6, -110);
    ctx.moveTo(-2, -110); ctx.lineTo(0, -120); ctx.lineTo(2, -110);
    ctx.moveTo(6, -110); ctx.lineTo(8, -118); ctx.lineTo(10, -110);
    ctx.closePath(); ctx.fill();
    // Tiara gem (center - blue)
    ctx.fillStyle = '#3b82f6';
    ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = 4;
    _circle(ctx, 0, -115, 2.5);
    ctx.shadowBlur = 0;
    // Small gems on sides
    ctx.fillStyle = '#93c5fd';
    _circle(ctx, -8, -113, 1.5); _circle(ctx, 8, -113, 1.5);
    // ★ DANGLING EARRINGS ★
    ctx.fillStyle = '#c0c8d4';
    ctx.fillRect(-15, -90, 1, 6); ctx.fillRect(14, -90, 1, 6);
    ctx.fillStyle = '#3b82f6';
    _circle(ctx, -15, -83, 2); _circle(ctx, 14, -83, 2);
    // Blue mask covering lower face
    ctx.fillStyle = '#1d4ed8'; ctx.fillRect(-13, -89, 26, 10);
    // Mask layers
    ctx.fillStyle = '#2563eb'; ctx.fillRect(-11, -87, 22, 1); ctx.fillRect(-11, -84, 22, 1);
    // Eyes (large, mysterious, feminine with heavy eyeliner)
    ctx.fillStyle = '#fff';
    ctx.fillRect(-9, -97, 7, 6); ctx.fillRect(3, -97, 7, 6);
    ctx.fillStyle = '#1e40af';
    _circle(ctx, -5, -94, 2.5); _circle(ctx, 7, -94, 2.5);
    // Eyeliner / eyelashes
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(-9, -97, 7, 1); ctx.fillRect(3, -97, 7, 1);
    // Eyeliner wing tips
    ctx.fillRect(-10, -97, 2, 1); ctx.fillRect(10, -97, 2, 1);
    // SPECIAL: Fan projectile (larger)
    if (f.state === 'special') {
        ctx.fillStyle = '#60a5fa';
        ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 15;
        ctx.save(); ctx.translate(55, -58);
        for (let i = 0; i < 8; i++) {
            ctx.save(); ctx.rotate(-0.5 + i * 0.14 + Math.sin(ts * 0.02) * 0.1);
            ctx.fillRect(0, -1, 18, 2); ctx.restore();
        }
        ctx.restore();
        ctx.shadowBlur = 0;
    }
};

// ----- SONYA-B (Sonya Blade - Military, green tank top, dog tags) -----
CHAR_DRAWERS['sonyab'] = (ctx, f, ch, ts) => {
    _drawLegs(ctx, f, '#4b5320', '#3a3a1a'); // camo pants, military boots
    // Torso - green tank top
    ctx.fillStyle = '#4a7c3a';
    _roundRect(ctx, -18, -78, 36, 48, 4); ctx.fill();
    // Tank top straps
    ctx.fillStyle = '#3a6a2a';
    ctx.fillRect(-16, -78, 5, 15); ctx.fillRect(11, -78, 5, 15);
    // Exposed shoulders (skin)
    ctx.fillStyle = '#f0c8a0';
    ctx.fillRect(-22, -76, 6, 8); ctx.fillRect(16, -76, 6, 8);
    // Dog tags
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(-2, -68, 4, 2); // chain
    ctx.fillRect(-1, -66, 2, 8);
    _roundRect(ctx, -4, -58, 8, 5, 1); ctx.fill();
    ctx.fillStyle = '#a0a0a0';
    _roundRect(ctx, -3, -53, 6, 4, 1); ctx.fill();
    // Military belt with pouches
    ctx.fillStyle = '#3a3a1a'; ctx.fillRect(-18, -34, 36, 6);
    ctx.fillStyle = '#5a5a3a';
    ctx.fillRect(-16, -34, 8, 6); ctx.fillRect(8, -34, 8, 6); // pouches
    // Arms
    _drawArms(ctx, f, '#f0c8a0', '#f0c8a0', -72);
    // Arm bands (black tactical)
    ctx.fillStyle = '#1a1a1a';
    if (f.state !== 'punch') {
        ctx.fillRect(-26, -54, 10, 4); ctx.fillRect(17, -54, 10, 4);
    }
    // Head
    ctx.fillStyle = '#f0c8a0'; _circle(ctx, 0, -92, 16);
    // Blonde hair tied back in ponytail
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(0, -100, 14, Math.PI + 0.2, -0.2); ctx.fill();
    ctx.fillRect(-12, -105, 24, 6);
    // Ponytail flowing behind
    ctx.fillStyle = '#e5a820';
    ctx.fillRect(-16, -100, 5, 20);
    ctx.fillRect(-18, -86, 4, 10);
    _drawFace(ctx, '#f0c8a0', f.state, ts);
    // Thin lips
    ctx.fillStyle = '#cc7777'; ctx.fillRect(-3, -83, 6, 2);
    // SPECIAL: Energy rings
    if (f.state === 'special') {
        ctx.strokeStyle = '#22c55e';
        ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 12; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(55, -58, 12, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(55, -58, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;
    }
};

// ----- CAMMY-K (Cammy - Green leotard, red beret, long braids) -----
CHAR_DRAWERS['cammyk'] = (ctx, f, ch, ts) => {
    // Long exposed legs (skin-colored with boots)
    const sp = 10;
    if (f.state === 'kick') {
        ctx.fillStyle = '#f0c8a0'; _limb(ctx, -sp, -5, 10, 30);
        ctx.fillStyle = '#22c55e'; _limb(ctx, -sp, 25, 9, 10);
        ctx.fillStyle = '#f0c8a0';
        ctx.save(); ctx.translate(sp, -10); ctx.rotate(-Math.PI / 4.5);
        ctx.fillRect(-5, -40, 10, 40); ctx.restore();
    } else {
        ctx.fillStyle = '#f0c8a0';
        _limb(ctx, -sp, -5, 10, 32); _limb(ctx, sp, -5, 10, 32);
        ctx.fillStyle = '#22c55e';
        _limb(ctx, -sp, 27, 9, 10); _limb(ctx, sp, 27, 9, 10);
    }
    // Torso - green leotard
    ctx.fillStyle = '#22c55e';
    _roundRect(ctx, -17, -78, 34, 50, 4); ctx.fill();
    // Leotard details
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(-8, -78, 16, 4); // collar trim
    // Exposed back/sides
    ctx.fillStyle = '#f0c8a0';
    ctx.fillRect(-19, -72, 4, 20); ctx.fillRect(15, -72, 4, 20);
    // Arms
    _drawArms(ctx, f, '#f0c8a0', '#f0c8a0', -72);
    // Red gauntlets
    ctx.fillStyle = '#dc2626';
    if (f.state !== 'punch') {
        ctx.fillRect(-27, -56, 12, 8); ctx.fillRect(16, -56, 12, 8);
    }
    // Head
    ctx.fillStyle = '#f0c8a0'; _circle(ctx, 0, -92, 16);
    // RED BERET (signature)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(0, -100, 14, Math.PI, 0); ctx.fill();
    ctx.fillRect(-16, -100, 32, 4);
    // Beret top tab
    ctx.fillRect(-4, -108, 8, 6);
    // Long blonde braids
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-11, -98, 3, 6);
    ctx.fillRect(8, -98, 3, 6);
    // Braids going down both sides
    ctx.fillRect(-18, -94, 4, 35);
    ctx.fillRect(14, -94, 4, 35);
    // Braid tips
    ctx.fillStyle = '#e5a820';
    ctx.fillRect(-19, -60, 5, 4); ctx.fillRect(14, -60, 5, 4);
    // Blue face paint marks on cheeks
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-13, -90, 4, 3);
    ctx.fillRect(9, -90, 4, 3);
    // Eyes (fierce)
    _drawFace(ctx, '#f0c8a0', f.state, ts);
    // Scar on cheek
    ctx.strokeStyle = '#d4a090'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(10, -87); ctx.lineTo(14, -84); ctx.stroke();
    // SPECIAL: Cannon Spike
    if (f.state === 'special') {
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 15;
        _circle(ctx, 55, -58, 13);
        ctx.fillStyle = '#86efac';
        _circle(ctx, 55, -58, 6);
        ctx.shadowBlur = 0;
    }
};

// ----- ANDROIDA (Android 18 - Denim vest, striped shirt, bob cut, cold) -----
CHAR_DRAWERS['androida'] = (ctx, f, ch, ts) => {
    _drawLegs(ctx, f, '#1e3a8a', '#333'); // dark jeans, shoes
    // Torso - striped shirt + denim vest
    // Striped undershirt
    ctx.fillStyle = '#f8f8f8';
    _roundRect(ctx, -17, -78, 34, 48, 4); ctx.fill();
    // Horizontal stripes
    ctx.fillStyle = '#1a1a1a';
    for (let y = -74; y < -32; y += 6) {
        ctx.fillRect(-15, y, 30, 2);
    }
    // Denim vest over shirt
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(-19, -78, 7, 42); ctx.fillRect(12, -78, 7, 42);
    // Vest collar
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-19, -78, 7, 6); ctx.fillRect(12, -78, 7, 6);
    // Jeans waistband
    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(-17, -34, 34, 5);
    // Arms
    _drawArms(ctx, f, '#f8e8d0', '#f8e8d0', -72);
    // Vest on shoulders
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(-24, -76, 7, 10); ctx.fillRect(17, -76, 7, 10);
    // Head
    ctx.fillStyle = '#f8e8d0'; _circle(ctx, 0, -92, 16);
    // Blonde bob haircut (straight, shoulder-length)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(0, -100, 15, Math.PI, 0); ctx.fill();
    ctx.fillRect(-15, -100, 30, 6);
    // Straight hair sides (bob cut - frames face)
    ctx.fillRect(-17, -96, 5, 22);
    ctx.fillRect(12, -96, 5, 22);
    // Hair bang/fringe covering one eye slightly
    ctx.fillStyle = '#e5a820';
    ctx.fillRect(-14, -100, 14, 8);
    // Partially covered left eye by bangs
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-12, -98, 8, 5);
    // Pearl earring
    ctx.fillStyle = '#fff';
    _circle(ctx, -15, -88, 2); _circle(ctx, 15, -88, 2);
    // Visible eye (ice blue, cold expression)
    ctx.fillStyle = '#fff';
    ctx.fillRect(3, -95, 7, 5);
    ctx.fillStyle = '#38bdf8';
    _circle(ctx, 6, -93, 2);
    // Left eye (partially visible behind bangs)
    ctx.fillStyle = '#fff';
    ctx.fillRect(-9, -95, 5, 4);
    ctx.fillStyle = '#38bdf8';
    _circle(ctx, -7, -93, 1.5);
    // Thin emotionless mouth
    ctx.fillStyle = '#c8988a'; ctx.fillRect(-3, -83, 6, 1);
    // Energy aura (idle)
    if (f.state === 'idle') {
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
        ctx.lineWidth = 2;
        const auraR = 35 + Math.sin(ts * 0.004) * 5;
        ctx.beginPath(); ctx.arc(0, -50, auraR, 0, Math.PI * 2); ctx.stroke();
    }
    // SPECIAL: Energy blast (yellow)
    if (f.state === 'special') {
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fde68a'; ctx.shadowBlur = 18;
        _circle(ctx, 56, -58, 14);
        ctx.fillStyle = '#fef3c7';
        _circle(ctx, 56, -58, 6);
        ctx.shadowBlur = 0;
    }
};

// ----- MILENA (Mileena - Magenta ninja, sai weapons, sharp teeth) -----
CHAR_DRAWERS['milena'] = (ctx, f, ch, ts) => {
    _drawLegs(ctx, f, '#d946ef', '#7c2d8e');
    // Torso - magenta ninja outfit
    ctx.fillStyle = '#d946ef';
    _roundRect(ctx, -18, -78, 36, 48, 4); ctx.fill();
    // Wrapping/bandage pattern
    ctx.fillStyle = '#c026d3';
    ctx.fillRect(-18, -72, 36, 3); ctx.fillRect(-18, -62, 36, 3);
    ctx.fillRect(-18, -52, 36, 3);
    // Side cutouts showing skin
    ctx.fillStyle = '#f0c8a0';
    ctx.fillRect(-19, -68, 4, 8); ctx.fillRect(15, -68, 4, 8);
    // Belt
    ctx.fillStyle = '#7c2d8e'; ctx.fillRect(-18, -34, 36, 6);
    ctx.fillStyle = '#fbbf24'; _circle(ctx, 0, -31, 3); // gold buckle
    // Arms
    _drawArms(ctx, f, '#f0c8a0', '#f0c8a0', -72);
    // Arm wraps (magenta)
    ctx.fillStyle = '#d946ef';
    if (f.state !== 'punch') {
        ctx.fillRect(-26, -56, 10, 4); ctx.fillRect(-26, -50, 10, 4);
        ctx.fillRect(17, -56, 10, 4); ctx.fillRect(17, -50, 10, 4);
    }
    // SAI WEAPONS (one on each side)
    if (f.state === 'idle' || f.state === 'hit') {
        ctx.fillStyle = '#d4d4d4';
        // Left sai
        ctx.save(); ctx.translate(-28, -45); ctx.rotate(0.2);
        ctx.fillRect(-1, -18, 2, 22);
        ctx.fillRect(-4, -1, 8, 2); // guard
        ctx.fillStyle = '#7c2d8e'; ctx.fillRect(-2, 2, 4, 6); // handle wrap
        ctx.restore();
        // Right sai
        ctx.fillStyle = '#d4d4d4';
        ctx.save(); ctx.translate(28, -45); ctx.rotate(-0.2);
        ctx.fillRect(-1, -18, 2, 22);
        ctx.fillRect(-4, -1, 8, 2);
        ctx.fillStyle = '#7c2d8e'; ctx.fillRect(-2, 2, 4, 6);
        ctx.restore();
    }
    // Head
    ctx.fillStyle = '#f0c8a0'; _circle(ctx, 0, -92, 16);
    // Long black flowing hair
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(0, -100, 15, Math.PI, 0); ctx.fill();
    ctx.fillRect(-15, -100, 30, 6);
    // Wild flowing hair
    ctx.fillRect(-18, -96, 5, 32);
    ctx.fillRect(13, -96, 5, 32);
    ctx.fillRect(-20, -80, 4, 15); ctx.fillRect(16, -80, 4, 15);
    // Face mask (lower face covered)
    ctx.fillStyle = '#d946ef'; ctx.fillRect(-13, -87, 26, 9);
    _drawFace(ctx, '#f0c8a0', f.state, ts);
    // Tarkatan teeth streaks (keep unique identity)
    ctx.fillStyle = '#d946ef';
    ctx.shadowColor = '#d946ef'; ctx.shadowBlur = 4;
    ctx.fillRect(-12, -78, 2, 6); ctx.fillRect(10, -78, 2, 6);
    ctx.shadowBlur = 0;
    // SPECIAL: Sai throw
    if (f.state === 'special') {
        ctx.fillStyle = '#d4d4d4';
        ctx.shadowColor = '#d946ef'; ctx.shadowBlur = 10;
        ctx.save(); ctx.translate(55, -58); ctx.rotate(-0.3);
        ctx.fillRect(-1, -14, 2, 18);
        ctx.fillRect(-4, 0, 8, 2);
        ctx.restore();
        ctx.shadowBlur = 0;
    }
};

// ----- ZANGAO (Zangief – red wrestling singlet, silver mohawk, huge handlebar mustache) -----
CHAR_DRAWERS['zangao'] = (ctx, f, ch, ts) => {
    const t = ts || 0;
    // Extra wide wrestler legs
    _drawLegs(ctx, f, '#dc2626', '#3a1a00', 15, 14);
    // Wide muscular torso
    ctx.fillStyle = '#dc2626';
    _roundRect(ctx, -29, -82, 58, 54, 5); ctx.fill();
    // Singlet V-straps
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath(); ctx.moveTo(-29, -82); ctx.lineTo(-12, -82); ctx.lineTo(-18, -30); ctx.lineTo(-29, -30); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(29, -82); ctx.lineTo(12, -82); ctx.lineTo(18, -30); ctx.lineTo(29, -30); ctx.closePath(); ctx.fill();
    // Exposed chest skin (pec definition)
    ctx.fillStyle = '#e8b090';
    ctx.beginPath(); ctx.moveTo(-12, -82); ctx.lineTo(12, -82); ctx.lineTo(18, -30); ctx.lineTo(-18, -30); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#d4a070'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(-7, -62, 9, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.beginPath(); ctx.arc(7, -62, 9, 0.3, Math.PI - 0.3); ctx.stroke();
    // Gold championship belt
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(-29, -33, 58, 11);
    _roundRect(ctx, -9, -37, 18, 18, 3); ctx.fill();
    ctx.save(); ctx.fillStyle = '#78350f'; ctx.font = 'bold 10px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('★', 0, -29); ctx.restore();
    // Arms (muscular skin)
    _drawArms(ctx, f, '#e8b090', '#e8b090', -80);
    // Knuckle tape
    if (f.state !== 'punch') {
        ctx.fillStyle = '#e2d0b8';
        ctx.fillRect(-30, -56, 13, 5); ctx.fillRect(18, -60, 13, 5);
    }
    // Large head
    ctx.fillStyle = '#e8b090'; _circle(ctx, 0, -99, 21);
    // Silver mohawk
    ctx.fillStyle = '#6b7280';
    ctx.beginPath(); ctx.moveTo(-10, -110); ctx.lineTo(10, -110); ctx.lineTo(5, -130); ctx.lineTo(0, -134); ctx.lineTo(-5, -130); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath(); ctx.moveTo(-5, -111); ctx.lineTo(5, -111); ctx.lineTo(2, -126); ctx.lineTo(-2, -126); ctx.closePath(); ctx.fill();
    // Side stubble
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(-21, -107, 6, 8); ctx.fillRect(15, -107, 6, 8);
    // Huge handlebar mustache
    ctx.fillStyle = '#374151';
    ctx.save(); ctx.translate(0, -91);
    ctx.beginPath(); ctx.moveTo(-2, 0); ctx.bezierCurveTo(-8, -4, -18, -7, -22, -2); ctx.bezierCurveTo(-18, 4, -8, 3, -2, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(2, 0); ctx.bezierCurveTo(8, -4, 18, -7, 22, -2); ctx.bezierCurveTo(18, 4, 8, 3, 2, 0); ctx.fill();
    ctx.restore();
    _drawFace(ctx, '#e8b090', f.state, ts);
    // SPECIAL: Spinning piledriver — golden spiral rings
    if (f.state === 'special') {
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
        const angle = (t * 0.006) % (Math.PI * 2);
        for (let i = 0; i < 4; i++) {
            ctx.globalAlpha = 0.5 - i * 0.1;
            ctx.beginPath(); ctx.arc(0, -50, 30 + i * 12, angle + i, angle + i + Math.PI); ctx.stroke();
        }
        ctx.globalAlpha = 1; ctx.lineWidth = 1;
    }
};

// ----- BLANKAO (Blanka – green electric beast, orange dreadlocks, hunched) -----
CHAR_DRAWERS['blankao'] = (ctx, f, ch, ts) => {
    const t = ts || 0;
    // Green legs, primitive dark shorts
    _drawLegs(ctx, f, '#4b5563', '#2d1a0a', 12, 11);
    // Primitive brown shorts/loincloth
    ctx.fillStyle = '#4b5563'; ctx.fillRect(-22, -14, 44, 18);
    ctx.fillStyle = '#374151'; ctx.fillRect(-22, -14, 44, 4); // waistband
    // Wide, hunched torso (shifted up slightly)
    ctx.fillStyle = '#16a34a';
    _roundRect(ctx, -24, -78, 48, 48, 8); ctx.fill();
    // Belly stripes (primal markings)
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-22, -65, 44, 3); ctx.fillRect(-22, -55, 44, 3); ctx.fillRect(-22, -45, 44, 3);
    // Arms (green skin, big fists)
    _drawArms(ctx, f, '#16a34a', '#15803d', -76);
    // Electric aura in idle
    if (f.state === 'idle' || f.state === 'special') {
        const spark = Math.sin(t * 0.012) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(251,191,36,${0.4 + spark * 0.5})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 12;
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + t * 0.004;
            const r = 32 + Math.sin(t * 0.01 + i) * 6;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * (r - 8), -55 + Math.sin(a) * 18);
            ctx.lineTo(Math.cos(a) * r, -55 + Math.sin(a) * 24);
            ctx.stroke();
        }
        ctx.shadowBlur = 0; ctx.lineWidth = 1;
    }
    // Large beast head (lower, hunched)
    ctx.fillStyle = '#16a34a'; _circle(ctx, 0, -91, 20);
    // Wild orange dreadlocks — up and back
    ctx.fillStyle = '#ea580c';
    const dreads = [[-18,-101,6,30],[-12,-104,5,28],[-5,-106,5,28],[2,-106,5,28],[9,-104,5,28],[15,-101,6,26]];
    dreads.forEach(([x,y,w,h]) => { ctx.save(); ctx.translate(x,y); ctx.rotate(-0.3 + x*0.02); ctx.fillRect(-w/2,0,w,-h); ctx.restore(); });
    // Wide flat nose
    ctx.fillStyle = '#15803d';
    ctx.beginPath(); ctx.ellipse(0, -88, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f6627';
    _circle(ctx, -5, -88, 3); _circle(ctx, 5, -88, 3);
    _drawFace(ctx, '#16a34a', f.state, ts);
    // SPECIAL: Electric discharge — full bright flash + bolts
    if (f.state === 'special') {
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 2.5;
        ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 20;
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            ctx.beginPath(); ctx.moveTo(0, -55);
            ctx.lineTo(Math.cos(a) * 50, -55 + Math.sin(a) * 40);
            ctx.stroke();
        }
        ctx.shadowBlur = 0; ctx.lineWidth = 1;
    }
};

// ----- SAGAO (Sagat – tall Muay Thai, eyepatch, chest scar, tiger tattoo) -----
CHAR_DRAWERS['sagao'] = (ctx, f, ch, ts) => {
    // Muay Thai shorts (brown/dark)
    _drawLegs(ctx, f, '#78350f', '#1a1a1a', 13, 12);
    // Muay Thai ankle wraps
    ctx.fillStyle = '#fff';
    _limb(ctx, -13, 22, 10, 6); _limb(ctx, 13, 22, 10, 6);
    // Tall, lean torso
    ctx.fillStyle = '#b87040';
    _roundRect(ctx, -20, -84, 40, 54, 4); ctx.fill();
    // Chest scar (diagonal mark)
    ctx.strokeStyle = '#8c5030'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-16, -80); ctx.lineTo(14, -46); ctx.stroke();
    ctx.lineWidth = 1;
    // Rib definition
    ctx.strokeStyle = '#a06838'; ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(-16, -74 + i * 10); ctx.quadraticCurveTo(0, -70 + i * 10, 16, -74 + i * 10); ctx.stroke();
    }
    // Muay Thai shorts band
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(-20, -33, 40, 4);
    ctx.fillStyle = '#78350f'; ctx.fillRect(-20, -29, 40, 4);
    // Tiger tattoo on shoulder
    ctx.fillStyle = '#c07040';
    ctx.strokeStyle = '#8c5030'; ctx.lineWidth = 1.2;
    ctx.save(); ctx.translate(18, -72);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, -4); ctx.lineTo(8, 4); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, -2); ctx.lineTo(14, 2); ctx.stroke();
    ctx.restore(); ctx.lineWidth = 1;
    // Arms (tall torso)
    _drawArms(ctx, f, '#b87040', '#b87040', -82);
    // Muay Thai arm wraps
    if (f.state !== 'punch') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(-32, -58, 14, 5); ctx.fillRect(-32, -52, 14, 4);
        ctx.fillRect(19, -62, 14, 5); ctx.fillRect(19, -56, 14, 4);
    }
    // Large tall head
    ctx.fillStyle = '#b87040'; _circle(ctx, 0, -98, 17);
    // Close-cropped dark hair
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(0, -106, 16, Math.PI + 0.1, -0.1); ctx.fill();
    ctx.fillRect(-16, -109, 32, 10);
    // EYEPATCH (right eye)
    ctx.fillStyle = '#1a1a1a';
    _roundRect(ctx, 2, -102, 16, 10, 2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(2, -97); ctx.lineTo(-4, -97); ctx.stroke();
    ctx.lineWidth = 1;
    _drawFace(ctx, '#b87040', f.state, ts);
    // SPECIAL: Tiger Uppercut — rising flame fist
    if (f.state === 'special') {
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 18;
        ctx.save(); ctx.translate(25, -100); ctx.rotate(-0.3);
        _roundRect(ctx, -8, -30, 16, 40, 4); ctx.fill();
        ctx.fillStyle = '#fbbf24';
        _roundRect(ctx, -6, -40, 12, 18, 3); ctx.fill();
        ctx.restore(); ctx.shadowBlur = 0;
    }
};

// ----- DHALSIMBA (Dhalsim – thin fire-breather, skull beads, floating) -----
CHAR_DRAWERS['dhalsimba'] = (ctx, f, ch, ts) => {
    const t = ts || 0;
    // Thin legs with gold shorts
    _drawLegs(ctx, f, '#fbbf24', '#a05828', 10, 9);
    // Very thin torso (narrow)
    ctx.fillStyle = '#a05828';
    _roundRect(ctx, -13, -78, 26, 48, 4); ctx.fill();
    // Rib cage (visibly thin)
    ctx.strokeStyle = '#7a3e18'; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(-13, -72 + i * 8); ctx.lineTo(13, -72 + i * 8); ctx.stroke();
    }
    ctx.lineWidth = 1;
    // Skull bead necklace
    ctx.fillStyle = '#e5e7eb';
    for (let i = 0; i < 7; i++) {
        const bx = -15 + i * 5;
        _circle(ctx, bx, -81, 3);
        ctx.fillStyle = '#9ca3af'; _circle(ctx, bx, -81, 1.5); ctx.fillStyle = '#e5e7eb';
    }
    // Red dot tilaka on forehead
    ctx.fillStyle = '#dc2626'; _circle(ctx, 0, -103, 4);
    // Gold shorts
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(-13, -33, 26, 8);
    ctx.fillStyle = '#f59e0b'; ctx.fillRect(-13, -34, 26, 4);
    // Arms — thin but long
    _drawArms(ctx, f, '#a05828', '#a05828', -76);
    // Floating effect in idle (subtle bob already from idleBob, add glow)
    if (f.state === 'idle') {
        ctx.fillStyle = `rgba(251,191,36,${0.08 + Math.sin(t*0.005)*0.06})`;
        ctx.beginPath(); ctx.ellipse(0, 28, 20, 8, 0, 0, Math.PI * 2); ctx.fill();
    }
    // Bald head with markings
    ctx.fillStyle = '#a05828'; _circle(ctx, 0, -93, 15);
    // Bald shine
    ctx.fillStyle = 'rgba(255,255,200,0.18)'; _circle(ctx, -5, -99, 6);
    // Red dots on cheeks
    ctx.fillStyle = '#dc2626'; _circle(ctx, -10, -90, 3); _circle(ctx, 10, -90, 3);
    _drawFace(ctx, '#a05828', f.state, ts);
    // SPECIAL: Yoga fire — fireball from mouth
    if (f.state === 'special') {
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 15;
        _circle(ctx, 45, -94, 14);
        ctx.fillStyle = '#fef08a'; _circle(ctx, 45, -94, 7);
        ctx.fillStyle = '#dc2626'; _circle(ctx, 56, -94, 9);
        ctx.shadowBlur = 0;
        // Fire breath line
        ctx.strokeStyle = '#f97316'; ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.moveTo(12, -92); ctx.lineTo(40, -94); ctx.stroke();
        ctx.globalAlpha = 1; ctx.lineWidth = 1;
    }
};

// ----- CAPOEIRISTA (Capoeira fighter – white abadá, dark skin, ginga stance) -----
CHAR_DRAWERS['capoeirista'] = (ctx, f, ch, ts) => {
    const t = ts || 0;
    // White abadá pants
    _drawLegs(ctx, f, '#f1f5f9', '#1a1a1a', 13, 12);
    // Yellow/green cordão stripes on pants
    ctx.fillStyle = '#fbbf24';
    _limb(ctx, -13, -4, 10, 2); _limb(ctx, -13, 4, 10, 2);
    _limb(ctx, 13, -4, 10, 2); _limb(ctx, 13, 4, 10, 2);
    // No-shirt torso (dark skin)
    ctx.fillStyle = '#5c3018';
    _roundRect(ctx, -18, -78, 36, 48, 4); ctx.fill();
    // Muscle tone definition
    ctx.strokeStyle = '#4a2410'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-2, -78); ctx.lineTo(-2, -32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-16, -64); ctx.quadraticCurveTo(-10, -60, -2, -64); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, -64); ctx.quadraticCurveTo(10, -60, 2, -64); ctx.stroke();
    ctx.lineWidth = 1;
    // White pants waistband with yellow stripe
    ctx.fillStyle = '#f1f5f9'; ctx.fillRect(-18, -33, 36, 4);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(-18, -30, 36, 3);
    // Capoeira ginga arm position (guard but offset)
    _drawArms(ctx, f, '#5c3018', '#5c3018', -76);
    // Wrist yellow bands
    if (f.state !== 'punch') {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-30, -50, 11, 4); ctx.fillRect(20, -54, 11, 4);
    }
    // Head
    ctx.fillStyle = '#5c3018'; _circle(ctx, 0, -93, 16);
    // Short tight hair
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(0, -100, 15, Math.PI + 0.15, -0.15); ctx.fill();
    ctx.fillRect(-14, -103, 28, 8);
    // Berimbau tattoo hint on forearm (idle)
    if (f.state === 'idle') {
        ctx.strokeStyle = '#4a2410'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-26, -60); ctx.lineTo(-22, -44); ctx.stroke();
        ctx.lineWidth = 1;
    }
    _drawFace(ctx, '#5c3018', f.state, ts);
    // SPECIAL: Meia-lua de compasso — spinning glow arc
    if (f.state === 'special') {
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4;
        ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14;
        const a = (t * 0.008) % (Math.PI * 2);
        ctx.beginPath();
        ctx.arc(0, -40, 48, a, a + Math.PI * 1.4);
        ctx.stroke();
        ctx.shadowBlur = 0; ctx.lineWidth = 1;
        // Foot trail
        ctx.fillStyle = 'rgba(251,191,36,0.45)';
        _circle(ctx, Math.cos(a + Math.PI * 1.2) * 48, -40 + Math.sin(a + Math.PI * 1.2) * 48, 9);
    }
};

// ----- HONDALAO (E. Honda – sumo wrestler, topknot, war paint, massive) -----
CHAR_DRAWERS['hondalao'] = (ctx, f, ch, ts) => {
    const t = ts || 0;
    // Wide sumo legs
    _drawLegs(ctx, f, '#1e40af', '#4a2800', 16, 15);
    // Mawashi (sumo belt/apron)
    ctx.fillStyle = '#1d4ed8'; ctx.fillRect(-30, -20, 60, 24);
    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(-30, -20, 60, 5);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(-30, -15, 60, 4); // gold trim
    // Front apron folds
    ctx.fillStyle = '#1e40af';
    ctx.beginPath(); ctx.moveTo(-14, -11); ctx.lineTo(14, -11); ctx.lineTo(10, 4); ctx.lineTo(-10, 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1d4ed8'; ctx.fillRect(-3, -11, 6, 15);
    // Massive torso (very wide)
    ctx.fillStyle = '#f0d090';
    _roundRect(ctx, -33, -84, 66, 58, 8); ctx.fill();
    // Belly crease
    ctx.strokeStyle = '#d4b878'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, -38, 22, 0.3, Math.PI - 0.3); ctx.stroke();
    // Pec definition
    ctx.beginPath(); ctx.arc(-10, -65, 12, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(10, -65, 12, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.lineWidth = 1;
    // Arms (very wide, stocky)
    _drawArms(ctx, f, '#f0d090', '#f0d090', -82);
    // Wrist rope bands
    if (f.state !== 'punch') {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(-34, -58, 14, 4); ctx.fillRect(-34, -53, 14, 3);
        ctx.fillRect(20, -62, 14, 4); ctx.fillRect(20, -57, 14, 3);
    }
    // Wide round head
    ctx.fillStyle = '#f0d090'; _circle(ctx, 0, -100, 22);
    // Black topknot
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(0, -108, 20, Math.PI + 0.1, -0.1); ctx.fill();
    ctx.fillRect(-20, -112, 40, 10);
    // Topknot bun
    _circle(ctx, 0, -118, 7);
    ctx.fillStyle = '#333'; _circle(ctx, 0, -118, 4);
    // RED WAR PAINT horizontal stripes on face
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-18, -106, 36, 4);
    ctx.fillRect(-16, -99, 32, 4);
    ctx.fillRect(-14, -92, 28, 4);
    // Blue paint on nose bridge
    ctx.fillStyle = '#1e40af'; ctx.fillRect(-5, -104, 10, 12);
    _drawFace(ctx, '#f0d090', f.state, ts);
    // SPECIAL: Hundred Hand Slap — rapid arm blur
    if (f.state === 'special') {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#f0d090';
        const offsets = [-14, -8, 8, 14];
        offsets.forEach(ox => {
            ctx.fillRect(14 + ox, -82, 35, 10);
            ctx.fillRect(14 + ox, -68, 35, 10);
        });
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.moveTo(14, -76); ctx.lineTo(70, -70); ctx.stroke();
        ctx.globalAlpha = 1; ctx.lineWidth = 1;
    }
};

// ----- GENERIC fallback -----
function drawGeneric(ctx, f, ch, ts) {
    _drawLegs(ctx, f, ch.bodyColor, '#333');
    ctx.fillStyle = ch.bodyColor;
    _roundRect(ctx, -18, -75, 36, 45, 6); ctx.fill();
    ctx.fillStyle = ch.accentColor; ctx.fillRect(-18, -35, 36, 6);
    _drawArms(ctx, f, ch.skinColor, ch.skinColor, -70);
    ctx.fillStyle = ch.skinColor; _circle(ctx, 0, -88, 16);
    ctx.fillStyle = ch.hairColor;
    ctx.beginPath(); ctx.arc(0, -95, 14, Math.PI, 0); ctx.fill();
    _drawFace(ctx, ch.skinColor, f.state, ts);
}

// Keep legacy names for compatibility
function drawLimb(ctx, x, y, w, h) { _limb(ctx, x, y, w, h); }
function roundRect(ctx, x, y, w, h, r) { _roundRect(ctx, x, y, w, h, r); }

// ---------- AUTO-GENERATE PORTRAITS FOR CHARACTERS WITHOUT PNG ----------
// Matches existing 640×640 square PNG card style.
// Character local coords: head ~y=-130, feet y=35, width ~±35.
// At scale 1.0 and translate(100,155): head at px=25, feet at px=190 inside a 200×200 canvas.
(function _buildMissingPortraits() {
    const fakeF = { state: 'idle', frame: 0, stateTimer: 0, idleBob: 0, side: 'left', x: 0, y: 0, flash: 0, dustTimer: 0, afterimageTimer: 0 };
    const SZ = 200; // square — matches 1:1 ratio of existing 640×640 PNGs

    CHARACTERS.forEach(ch => {
        if (ch.img) return;
        const c = document.createElement('canvas');
        c.width = SZ; c.height = SZ;
        const cx = c.getContext('2d');

        // Parse body color for accents
        const r = parseInt(ch.bodyColor.slice(1, 3), 16);
        const g = parseInt(ch.bodyColor.slice(3, 5), 16);
        const b = parseInt(ch.bodyColor.slice(5, 7), 16);

        // --- Background: dark stone gradient ---
        const bg = cx.createLinearGradient(0, 0, 0, SZ);
        bg.addColorStop(0,   '#08080f');
        bg.addColorStop(0.4, '#131320');
        bg.addColorStop(1,   '#04040a');
        cx.fillStyle = bg; cx.fillRect(0, 0, SZ, SZ);

        // Radial glow in character's body color
        const glow = cx.createRadialGradient(SZ / 2, SZ * 0.6, 5, SZ / 2, SZ * 0.6, SZ * 0.65);
        glow.addColorStop(0,   `rgba(${r},${g},${b},0.28)`);
        glow.addColorStop(0.6, `rgba(${r},${g},${b},0.08)`);
        glow.addColorStop(1,   'rgba(0,0,0,0)');
        cx.fillStyle = glow; cx.fillRect(0, 0, SZ, SZ);

        // Scanlines (subtle)
        cx.globalAlpha = 0.04;
        for (let i = 0; i < SZ; i += 4) { cx.fillStyle = '#fff'; cx.fillRect(0, i, SZ, 1); }
        cx.globalAlpha = 1;

        // --- Floor glow under feet ---
        const floor = cx.createRadialGradient(SZ / 2, SZ - 8, 0, SZ / 2, SZ - 8, 55);
        floor.addColorStop(0,   `rgba(${r},${g},${b},0.45)`);
        floor.addColorStop(0.5, `rgba(${r},${g},${b},0.15)`);
        floor.addColorStop(1,   'rgba(0,0,0,0)');
        cx.fillStyle = floor; cx.fillRect(0, SZ - 30, SZ, 30);

        // --- Render character at scale 1.0, centered, feet ~10px above bottom ---
        cx.save();
        cx.translate(SZ / 2, 155); // feet at y=35 → canvas y = 155+35 = 190 (10px above bottom)
        cx.scale(1.0, 1.0);
        try {
            const drawer = CHAR_DRAWERS[ch.id] || drawGeneric;
            drawer(cx, fakeF, ch, 0);
        } catch (e) { /* portrait render failed gracefully */ }
        cx.restore();

        // --- Vignette overlay ---
        const vign = cx.createRadialGradient(SZ/2, SZ/2, SZ*0.35, SZ/2, SZ/2, SZ*0.8);
        vign.addColorStop(0, 'rgba(0,0,0,0)');
        vign.addColorStop(1, 'rgba(0,0,0,0.55)');
        cx.fillStyle = vign; cx.fillRect(0, 0, SZ, SZ);

        // Colored border
        cx.strokeStyle = `rgba(${r},${g},${b},0.7)`;
        cx.lineWidth = 3;
        cx.strokeRect(1.5, 1.5, SZ - 3, SZ - 3);

        ch.img = c.toDataURL('image/png');
    });
})();

// ---------- HUD UPDATE ----------
function updateHUD() {
    const hp1 = document.getElementById('hp-bar-p1');
    const hp2 = document.getElementById('hp-bar-p2');
    hp1.style.width = `${Math.max(0, game.p1.hp)}%`;
    hp2.style.width = `${Math.max(0, game.p2.hp)}%`;

    hp1.className = `hp-bar-inner ${game.p1.hp > 50 ? 'hp-green' : game.p1.hp > 20 ? 'hp-yellow' : 'hp-red'}${game.p1.hp <= 20 ? ' hp-critical' : ''}`;
    hp2.className = `hp-bar-inner ${game.p2.hp > 50 ? 'hp-green' : game.p2.hp > 20 ? 'hp-yellow' : 'hp-red'}${game.p2.hp <= 20 ? ' hp-critical' : ''}`;

    document.getElementById('hud-streak-p1').textContent = `🔥${game.p1.streak}`;
    document.getElementById('hud-streak-p2').textContent = `🔥${game.p2.streak}`;

    // Streak pip meters
    ['p1', 'p2'].forEach(pid => {
        const pipsEl = document.getElementById(`streak-pips-${pid}`);
        const labelEl = document.getElementById(`streak-label-${pid}`);
        if (!pipsEl) return;
        const s = game[pid].streak;
        pipsEl.innerHTML = '';
        // 6 pips: 4 to special, divider, then 2 more to super
        for (let i = 1; i <= 6; i++) {
            if (i === 5) {
                const div = document.createElement('div');
                div.className = 'streak-pip divider';
                pipsEl.appendChild(div);
            }
            const pip = document.createElement('div');
            let cls = 'streak-pip';
            if (s >= 6 && i <= 6) cls += ' super';
            else if (s >= 4 && i <= 4) cls += ' special';
            else if (s >= i) cls += ' filled';
            pip.className = cls;
            pipsEl.appendChild(pip);
        }
        if (s >= 6) labelEl.textContent = '⬆ SUPER!';
        else if (s >= 4) labelEl.textContent = '⚡ ESPECIAL!';
        else if (s > 0) labelEl.textContent = `${s}/4`;
        else labelEl.textContent = '';
    });
}

// ---------- QUESTION SYSTEM ----------
// Roman numeral helpers
const ROMAN_MAP = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];
function toRoman(n) {
    let s = '';
    for (const [val, sym] of ROMAN_MAP) { while (n >= val) { s += sym; n -= val; } }
    return s;
}
function fromRoman(s) {
    const map = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
    let total = 0;
    for (let i = 0; i < s.length; i++) {
        const cur = map[s[i]], next = map[s[i + 1]] || 0;
        total += cur < next ? -cur : cur;
    }
    return total;
}

// TEXT QUESTION DATABASE
const QUESTION_DB = {
    floresta: [
        { text: "João tinha 15 moedas e encontrou a próxima na trilha. Com quantas ficou? (Sucessor de 15)", correct: 16 },
        { text: "A árvore mágica tinha 40 folhas, mas perdeu uma. Quantas sobraram? (Antecessor de 40)", correct: 39 },
        { text: "Qual livro vem depois do volume 99 na biblioteca encantada?", correct: 100 },
        { text: "O viajante deu 500 passos, o passo logo anterior foi o de número...", correct: 499 }
    ],
    castelo: [
        { text: "Os guardas estão nas torres 4, 5, ___ e 7. Qual falta?", correct: 6 },
        { text: "A escada tem degraus numerados: 10, 11, 12... Qual é o próximo?", correct: 13 },
        { text: "A senha do portão é uma sequência: 98, 99, ___. Complete:", correct: 100 }
    ],
    montanha: [
        { text: "O pico de gelo A tem 200m. O pico B tem 300m. Logo, 200 ___ 300.", correct: '<' },
        { text: "Uma tribo tem 50 guerreiros e outra tem só 20. Logo, 50 ___ 20.", correct: '>' },
        { text: "Ambas as cavernas têm 15 morcegos. Logo, 15 ___ 15.", correct: '=' }
    ],
    deserto: [
        { text: "O faraó tinha X cavalos e comprou mais V. Quantos em Romanos?", correct: 'XV' },
        { text: "Como o Rei Escorpião escrevia o número 20 em sua tumba?", correct: 'XX' },
        { text: "O oásis fica a 50 léguas daqui. Qual símbolo romano representa isso?", correct: 'L' }
    ],
    vulcao: [
        { text: "No mapa do tesouro 3.456 passos, o algarismo das dezenas é:", correct: 5 },
        { text: "No núcleo magmático a 8.921 graus, o algarismo das centenas é:", correct: 9 },
        { text: "Na lava de 50.123 anos, o algarismo da unidade de milhar é:", correct: 0 }
    ],
    cidade: [
        { text: "Um bairro tem 3.000 luzes + 400 + 20 + 5. Quantas no total?", correct: 3425 },
        { text: "Como se decompõe o número 520 do prédio 520?", correct: '500 + 20' },
        { text: "Qual número é formado por 8.000 + 9?", correct: 8009 }
    ],
    templo: [
        // Tabuada do 1
        { text: "🔱 Na tabuada mágica: 1 × 7 = ?",         correct: 7 },
        { text: "🔱 Qual o segredo de 1 × 100?",             correct: 100 },
        // Tabuada do 2
        { text: "🔱 O sábio ensina: 2 × 6 = ?",             correct: 12 },
        { text: "🔱 O templo tem 2 × 9 degraus. Quantos?",   correct: 18 },
        { text: "🔱 A tabuada do 2: 2 × 5 = ?",             correct: 10 },
        // Tabuada do 3
        { text: "🔱 Três guerreiros, cada um com 3 escudos: 3 × 3 = ?", correct: 9 },
        { text: "🔱 O dragão tem 3 × 8 escamas. Quantas?",  correct: 24 },
        { text: "🔱 Quanto é 3 × 7 no templo?",             correct: 21 },
        // Tabuada do 4
        { text: "🔱 Quatro altares com 4 tochas cada: 4 × 4 = ?", correct: 16 },
        { text: "🔱 O sábio conta: 4 × 9 = ?",              correct: 36 },
        { text: "🔱 Qual o resultado de 4 × 6?",             correct: 24 },
        // Tabuada do 5
        { text: "🔱 Cinco pergaminhos, 5 selos em cada: 5 × 5 = ?", correct: 25 },
        { text: "🔱 O oráculo revela: 5 × 8 = ?",           correct: 40 },
        { text: "🔱 Quanto valem 5 × 7 moedas de ouro?",    correct: 35 },
        // Tabuada do 6
        { text: "🔱 Seis pilares, 6 runas em cada: 6 × 6 = ?", correct: 36 },
        { text: "🔱 O guardião diz: 6 × 7 = ?",             correct: 42 },
        { text: "🔱 Calcule 6 × 8 nas estrelas:",           correct: 48 },
        // Tabuada do 7
        { text: "🔱 Sete templos com 7 portas cada: 7 × 7 = ?", correct: 49 },
        { text: "🔱 O mago pergunta: 7 × 8 = ?",            correct: 56 },
        { text: "🔱 Quanto é 7 × 9?",                       correct: 63 },
        // Tabuada do 8
        { text: "🔱 Oito cristais com 8 faces: 8 × 8 = ?",  correct: 64 },
        { text: "🔱 O dragão tem 8 garras e 9 escamas por garra: 8 × 9 = ?", correct: 72 },
        { text: "🔱 Oito feitiços de nível 7: 8 × 7 = ?",   correct: 56 },
        // Tabuada do 9
        { text: "🔱 Nove deuses com 9 poderes cada: 9 × 9 = ?", correct: 81 },
        { text: "🔱 O sábio supremo revela: 9 × 8 = ?",     correct: 72 },
        { text: "🔱 Nove esferas e 7 fragmentos: 9 × 7 = ?", correct: 63 },
        // Tabuada do 10
        { text: "🔱 Dez cofres com 10 moedas: 10 × 10 = ?", correct: 100 },
        { text: "🔱 O templo tem 10 × 7 pedras: quantas?",  correct: 70 },
        { text: "🔱 Qual o segredo de 10 × 9?",             correct: 90 }
    ]
};

function generateQuestion() {
    const phase = game.phase || 'floresta';
    const round = game.roundCount || 0;
    // Difficulty: rounds 0-3 easy, 4-7 medium, 8+ hard
    const diff = round < 4 ? 'easy' : (round < 8 ? 'medium' : 'hard');

    switch (phase) {
        case 'floresta': return genFloresta(diff);
        case 'castelo': return genCastelo(diff);
        case 'montanha': return genMontanha(diff);
        case 'deserto': return genDeserto(diff);
        case 'vulcao': return genVulcao(diff);
        case 'cidade': return genCidade(diff);
        case 'templo': return genTabuada(diff);
        default: return genFloresta(diff);
    }
}

// FASE 1: Floresta — Antecessor e Sucessor
function genFloresta(diff) {
    if (Math.random() < 0.3) {
        const item = QUESTION_DB.floresta[Math.floor(Math.random() * QUESTION_DB.floresta.length)];
        return makeOptions(item.text, item.correct);
    }
    const isSuccessor = Math.random() > 0.5;
    const maxN = diff === 'easy' ? 100 : (diff === 'medium' ? 1000 : 5000);
    const number = Math.floor(Math.random() * maxN) + 1;
    const correct = isSuccessor ? number + 1 : number - 1;
    const text = `Qual o ${isSuccessor ? 'SUCESSOR' : 'ANTECESSOR'} de ${number}?`;
    return makeOptions(text, correct);
}

// FASE 2: Castelo — Números Consecutivos
function genCastelo(diff) {
    if (Math.random() < 0.3) {
        const item = QUESTION_DB.castelo[Math.floor(Math.random() * QUESTION_DB.castelo.length)];
        return makeOptions(item.text, item.correct);
    }
    const maxN = diff === 'easy' ? 50 : (diff === 'medium' ? 500 : 2000);
    const start = Math.floor(Math.random() * maxN) + 1;
    const seqLen = diff === 'easy' ? 3 : 4;
    const missing = Math.floor(Math.random() * seqLen);
    const correct = start + missing;
    let seq = [];
    for (let i = 0; i < seqLen; i++) {
        seq.push(i === missing ? '___' : (start + i));
    }
    const text = `Complete: ${seq.join(', ')}`;
    return makeOptions(text, correct);
}

// FASE 3: Montanha — Comparação (<, >, =)
function genMontanha(diff) {
    if (Math.random() < 0.3) {
        const item = QUESTION_DB.montanha[Math.floor(Math.random() * QUESTION_DB.montanha.length)];
        return { text: item.text, correct: item.correct, options: ['<', '>', '='].sort(() => Math.random() - 0.5), bonus: false };
    }
    const maxN = diff === 'easy' ? 100 : (diff === 'medium' ? 1000 : 10000);
    const a = Math.floor(Math.random() * maxN) + 1;
    let b;
    if (Math.random() < 0.15) { b = a; } // sometimes equal
    else { b = Math.floor(Math.random() * maxN) + 1; }
    const correct = a > b ? '>' : (a < b ? '<' : '=');
    const text = `${a} ___ ${b}. Qual o sinal?`;
    const options = ['<', '>', '='].sort(() => Math.random() - 0.5);
    return { text, correct, options, bonus: false };
}

// FASE 4: Deserto — Números Romanos
function genDeserto(diff) {
    if (Math.random() < 0.3) {
        const item = QUESTION_DB.deserto[Math.floor(Math.random() * QUESTION_DB.deserto.length)];
        const correct = item.correct;
        // Text to Arabic (numeric options)
        if (typeof correct === 'number') {
            return makeOptions(item.text, correct);
        }
        // Text to Roman (roman options)
        let opts = new Set([correct]);
        while (opts.size < 4) {
            const fake = Math.floor(Math.random() * 50) + 1;
            opts.add(toRoman(fake));
        }
        return { text: item.text, correct, options: Array.from(opts).sort(() => Math.random() - 0.5), bonus: false };
    }
    const maxN = diff === 'easy' ? 50 : (diff === 'medium' ? 500 : 3000);
    const n = Math.floor(Math.random() * maxN) + 1;
    if (Math.random() > 0.5) {
        // Roman to Arabic
        const roman = toRoman(n);
        const text = `Quanto vale ${roman} em algarismos?`;
        return makeOptions(text, n);
    } else {
        // Arabic to Roman
        const correct = toRoman(n);
        const text = `Como se escreve ${n} em romanos?`;
        let opts = new Set([correct]);
        while (opts.size < 4) {
            const fake = Math.floor(Math.random() * maxN) + 1;
            opts.add(toRoman(fake));
        }
        return { text, correct, options: Array.from(opts).sort(() => Math.random() - 0.5), bonus: false };
    }
}

// FASE 5: Vulcão — Sistema Posicional (ordens e classes)
function genVulcao(diff) {
    if (Math.random() < 0.3) {
        const item = QUESTION_DB.vulcao[Math.floor(Math.random() * QUESTION_DB.vulcao.length)];
        return makeOptions(item.text, item.correct);
    }
    const maxN = diff === 'easy' ? 999 : (diff === 'medium' ? 99999 : 999999);
    const n = Math.floor(Math.random() * maxN) + 10;
    const nStr = n.toString();
    const positions = ['unidade', 'dezena', 'centena', 'unidade de milhar', 'dezena de milhar', 'centena de milhar'];
    const posIdx = Math.floor(Math.random() * Math.min(nStr.length, positions.length));
    const digitFromRight = nStr[nStr.length - 1 - posIdx];
    const correct = parseInt(digitFromRight);
    const text = `No número ${n.toLocaleString('pt-BR')}, qual o algarismo da ${positions[posIdx]}?`;
    return makeOptions(text, correct);
}

// FASE 6: Cidade — Agrupamento e Decomposição
function genCidade(diff) {
    if (Math.random() < 0.3) {
        const item = QUESTION_DB.cidade[Math.floor(Math.random() * QUESTION_DB.cidade.length)];
        const correct = item.correct;
        if (typeof correct === 'number') {
            return makeOptions(item.text, correct);
        }
        // Decomp questions that result in a string like "500 + 20"
        let opts = new Set([correct]);
        while (opts.size < 4) {
            // make a fake decomp
            const parts = correct.split('+').map(x => parseInt(x.trim()));
            const fakeIdx = Math.floor(Math.random() * parts.length);
            const fakeParts = [...parts];
            // alter one part slightly (e.g. 20 -> 30)
            if (fakeParts[fakeIdx] > 0) fakeParts[fakeIdx] += (Math.random() > 0.5 ? 1 : -1) * Math.pow(10, fakeParts[fakeIdx].toString().length - 1);
            opts.add(fakeParts.join(' + '));
        }
        return { text: item.text, correct, options: Array.from(opts).sort(() => Math.random() - 0.5), bonus: false };
    }
    const maxN = diff === 'easy' ? 999 : (diff === 'medium' ? 9999 : 99999);
    const n = Math.floor(Math.random() * maxN) + 10;
    if (Math.random() > 0.5) {
        // Decomposição: dado um número, qual a decomposição correta
        const nStr = n.toString();
        let parts = [];
        for (let i = 0; i < nStr.length; i++) {
            const d = parseInt(nStr[i]);
            if (d > 0) {
                const place = Math.pow(10, nStr.length - 1 - i);
                parts.push(`${d * place}`);
            }
        }
        const correct = parts.join(' + ');
        const text = `Decomponha o número ${n.toLocaleString('pt-BR')}:`;
        let opts = new Set([correct]);
        while (opts.size < 4) {
            // Generate fake decompositions
            let fakeParts = [];
            for (let i = 0; i < nStr.length; i++) {
                const fd = Math.floor(Math.random() * 9) + 1;
                const place = Math.pow(10, nStr.length - 1 - i);
                fakeParts.push(`${fd * place}`);
            }
            opts.add(fakeParts.join(' + '));
        }
        return { text, correct, options: Array.from(opts).sort(() => Math.random() - 0.5), bonus: false };
    } else {
        // Agrupamento: somar as partes
        const nStr = n.toString();
        let parts = [];
        for (let i = 0; i < nStr.length; i++) {
            const d = parseInt(nStr[i]);
            if (d > 0) parts.push(d * Math.pow(10, nStr.length - 1 - i));
        }
        const text = `Qual número é formado por ${parts.join(' + ')}?`;
        return makeOptions(text, n);
    }
}

// Helper: generate 4 numeric options
function makeOptions(text, correct) {
    let opts = new Set([correct]);
    while (opts.size < 4) {
        let f = correct + (Math.floor(Math.random() * 11) - 5);
        if (f !== correct && f >= 0) opts.add(f);
    }
    return { text, correct, options: Array.from(opts).sort(() => Math.random() - 0.5), bonus: false };
}

// FASE 7: Templo do Sábio — Tabuada da Multiplicação
function genTabuada(diff) {
    // 30% chance to pull a static story-question
    if (Math.random() < 0.3) {
        const pool = QUESTION_DB.templo;
        const item = pool[Math.floor(Math.random() * pool.length)];
        return makeOptions(item.text, item.correct);
    }

    // Todas as tabuadas devem ser inclusas de 1 a 10
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const correct = a * b;

    // Vary question formats to keep it engaging
    const formats = [
        `🔱 Qual o resultado de ${a} × ${b}?`,
        `🔱 ${a} × ${b} = ?`,
        `🔱 No Templo: ${b} vezes ${a} é igual a?`,
        `🔱 Complete a tabuada do ${a}: ${a} × ${b} = ?`,
        `🔱 O sábio pergunta: quanto é ${a} multiplicado por ${b}?`
    ];
    const text = formats[Math.floor(Math.random() * formats.length)];

    // Generate distractor options that are plausible (near the correct value)
    let opts = new Set([correct]);
    const distractors = [
        a * (b + 1), a * (b - 1),
        (a + 1) * b, (a - 1) * b,
        correct + a, correct - a,
        correct + b, correct - b
    ].filter(v => v > 0 && v !== correct);

    // Shuffle distractors and pick 3
    distractors.sort(() => Math.random() - 0.5);
    for (const d of distractors) {
        if (opts.size >= 4) break;
        opts.add(d);
    }
    // Fallback: random values if still not enough
    while (opts.size < 4) {
        const fake = correct + (Math.floor(Math.random() * 20) - 10);
        if (fake > 0 && fake !== correct) opts.add(fake);
    }

    return {
        text,
        correct,
        options: Array.from(opts).sort(() => Math.random() - 0.5),
        bonus: false
    };
}

function nextRound() {
    if (game.p1.hp <= 0 || game.p2.hp <= 0) return endGame();

    // Reset controls
    resetControls();
    game.roundCount++;
    game.attackAnimating = false;

    const q = generateQuestion();
    game.currentAnswer = q.correct;

    document.getElementById('question-text').textContent = q.text;
    const qbar = document.querySelector('.question-bar');
    qbar.style.borderColor = '#f59e0b';
    qbar.style.background = '#1e293b';

    // Build answer buttons for both
    ['p1', 'p2'].forEach(pid => {
        const box = document.getElementById(`answers-${pid}`);
        box.innerHTML = '';
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'ans-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleAnswer(pid, opt, btn));
            btn.addEventListener('touchend', (e) => { e.preventDefault(); handleAnswer(pid, opt, btn); });
            box.appendChild(btn);
        });
    });

    // Enable buzzers / par-ímpar based on turnMode
    if (game.phase === 'templo' && game.mode === 'hvc') {
        game.questionActive = false;
        game.turn = 'p1';

        document.getElementById('pi-overlay').classList.add('hidden');
        document.querySelector('.controls-split').style.display = '';

        document.getElementById('buzzer-p1').classList.add('hidden');
        document.getElementById('buzzer-p2').classList.add('hidden');
        document.getElementById('answers-p1').classList.remove('hidden');

        document.getElementById('question-text').textContent += ` ← Você responde!`;

        startAnswerTimer('p1');
    } else if (game.turnMode === 'buzzer') {
        game.questionActive = true;
        game.turn = null;

        document.getElementById('pi-overlay').classList.add('hidden');
        document.querySelector('.controls-split').style.display = '';

        // CPU: auto-buzz after delay
        if (game.mode === 'hvc') {
            document.getElementById('buzzer-p2').style.display = 'none';
        } else {
            document.getElementById('buzzer-p2').style.display = '';
        }

        // Start Passa ou Repassa timer
        startBuzzerTimer();
    } else {
        // Par ou Ímpar mode
        document.querySelector('.controls-split').style.display = 'none';
        startParImpar();
    }
}

function resetControls() {
    ['p1', 'p2'].forEach(pid => {
        const buzzer = document.getElementById(`buzzer-${pid}`);
        const ans = document.getElementById(`answers-${pid}`);
        const atk = document.getElementById(`attack-menu-${pid}`);
        buzzer.classList.remove('hidden');
        ans.classList.add('hidden');
        atk.classList.add('hidden');
    });
}

// ---------- CPU AI ----------
function clearCpuTimers() {
    if (cpuTimerId) { clearTimeout(cpuTimerId); cpuTimerId = null; }
}

let buzzerTimerId = null;
let buzzerTimeLeft = 10;

function clearBuzzerTimer() {
    if (buzzerTimerId) { clearInterval(buzzerTimerId); buzzerTimerId = null; }
    const timerEl = document.getElementById('buzzer-timer');
    if (timerEl) timerEl.classList.add('hidden');
}

let answerTimerId = null;
let answerTimeLeft = 10;

function clearAnswerTimer() {
    if (answerTimerId) { clearInterval(answerTimerId); answerTimerId = null; }
    const timerEl = document.getElementById('buzzer-timer');
    if (timerEl) timerEl.classList.add('hidden');
}

function startAnswerTimer(pid) {
    clearAnswerTimer();
    const timerEl = document.getElementById('buzzer-timer');
    const bar = document.getElementById('buzzer-timer-bar');
    const text = document.getElementById('buzzer-timer-text');

    timerEl.classList.remove('hidden');
    timerEl.classList.remove('urgent');
    answerTimeLeft = GAME_SETTINGS.answerTime;
    bar.style.width = '100%';
    text.textContent = GAME_SETTINGS.answerTime;

    answerTimerId = setInterval(() => {
        if (game.paused) return;
        answerTimeLeft -= 0.1;
        const pct = Math.max(0, (answerTimeLeft / GAME_SETTINGS.answerTime) * 100);
        bar.style.width = pct + '%';
        text.textContent = Math.max(0, Math.ceil(answerTimeLeft));

        if (answerTimeLeft <= 10 && !timerEl.classList.contains('urgent')) {
            timerEl.classList.add('urgent');
        }

        // Tique sonoro nos últimos 5 segundos (uma vez por segundo)
        if (answerTimeLeft <= 5 && answerTimeLeft > 0) {
            const prevSecond = Math.ceil(answerTimeLeft + 0.1);
            const curSecond  = Math.ceil(answerTimeLeft);
            if (curSecond < prevSecond && curSecond > 0) AudioEngine.play('timerTick');
        }

        if (answerTimeLeft <= 0) {
            clearAnswerTimer();
            handleAnswerTimeout(pid);
        }
    }, 100);
}

function handleAnswerTimeout(pid) {
    if (game.turn !== pid) return;
    AudioEngine.play('wrong');

    // Disable all buttons
    document.getElementById(`answers-${pid}`).querySelectorAll('.ans-btn').forEach(b => b.disabled = true);

    game[pid].streak = 0;
    updateHUD();

    const other = pid === 'p1' ? 'p2' : 'p1';

    if (game.currentQuestionBonus) {
        document.getElementById('question-text').textContent = `❌ TEMPO ESGOTADO! Ninguém ganha bônus.`;
        setTimeout(() => {
            document.getElementById(`answers-${pid}`).classList.add('hidden');
            setTimeout(nextRound, 800);
        }, 1200);
        return;
    }

    document.getElementById('question-text').textContent = `❌ TEMPO ESGOTADO! ${CHARACTERS[game[other].charIdx].name} ataca!`;
    setTimeout(() => {
        document.getElementById(`answers-${pid}`).classList.add('hidden');
        document.getElementById(`buzzer-${other}`).classList.add('hidden');
        
        if (game[other].streak < 3) {
            executeAttack(other, 'normal');
        } else {
            document.getElementById(`attack-menu-${other}`).classList.remove('hidden');
            if (game.mode === 'hvc' && other === 'p2') {
                setTimeout(() => {
                    const atkType = cpuChooseAttack('p2');
                    const atkBtn = document.querySelector(`#attack-menu-p2 .atk-${atkType}`);
                    if (atkBtn && !atkBtn.classList.contains('locked')) {
                        atkBtn.click();
                    } else {
                        document.querySelector('#attack-menu-p2 .atk-normal').click();
                    }
                }, 500);
            }
        }
    }, 1200);
}

function startBuzzerTimer() {
    clearBuzzerTimer();
    const timerEl = document.getElementById('buzzer-timer');
    const bar = document.getElementById('buzzer-timer-bar');
    const text = document.getElementById('buzzer-timer-text');

    timerEl.classList.remove('hidden');
    timerEl.classList.remove('urgent');
    buzzerTimeLeft = 5;
    bar.style.width = '100%';
    text.textContent = '5';

    // Disable buzzers during countdown
    document.getElementById('buzzer-p1').disabled = true;
    document.getElementById('buzzer-p2').disabled = true;
    document.getElementById('buzzer-p1').style.opacity = '0.3';
    document.getElementById('buzzer-p2').style.opacity = '0.3';

    buzzerTimerId = setInterval(() => {
        if (game.paused) return;
        buzzerTimeLeft -= 0.1;
        const pct = Math.max(0, (buzzerTimeLeft / 5) * 100);
        bar.style.width = pct + '%';
        text.textContent = Math.max(0, Math.ceil(buzzerTimeLeft));

        // Urgency effect at 3 seconds
        if (buzzerTimeLeft <= 3 && !timerEl.classList.contains('urgent')) {
            timerEl.classList.add('urgent');
        }

        if (buzzerTimeLeft <= 0) {
            clearInterval(buzzerTimerId);
            buzzerTimerId = null;
            timerEl.classList.add('hidden');

            // Enable buzzers!
            document.getElementById('buzzer-p1').disabled = false;
            document.getElementById('buzzer-p2').disabled = false;
            document.getElementById('buzzer-p1').style.opacity = '1';
            document.getElementById('buzzer-p2').style.opacity = '1';

            if (game.mode === 'hvc') {
                scheduleCpuBuzzer();
            }
        }
    }, 100);
}

function scheduleCpuBuzzer() {
    clearCpuTimers();
    const delay = 1500 + Math.random() * 1500; // 1.5s to 3s
    cpuTimerId = setTimeout(() => {
        if (game.paused || !game.questionActive) return;
        // If P1 hasn't buzzed yet, CPU might buzz in
        if (game.questionActive && !game.turn) {
            handleBuzzer('p2');
        }
    }, delay);
}

function cpuAnswer() {
    if (game.turn !== 'p2' || game.paused) return;
    const ansBox = document.getElementById('answers-p2');
    const buttons = ansBox.querySelectorAll('.ans-btn');
    if (buttons.length === 0) return;

    const correct = game.currentAnswer;
    const acertar = Math.random() < 0.7; // 70% accuracy

    let btnToClick;
    if (acertar) {
        btnToClick = Array.from(buttons).find(b => parseInt(b.textContent) === correct);
    }
    if (!btnToClick) {
        // Pick random wrong answer
        const wrongBtns = Array.from(buttons).filter(b => parseInt(b.textContent) !== correct);
        btnToClick = wrongBtns[Math.floor(Math.random() * wrongBtns.length)] || buttons[0];
    }
    handleAnswer('p2', parseInt(btnToClick.textContent), btnToClick);
}

function cpuChooseAttack(pid) {
    // CPU picks attack based on streak
    const streak = game[pid].streak;
    if (streak >= 5 && Math.random() < 0.5) return 'super';
    if (streak >= 3 && Math.random() < 0.6) return 'special';
    return 'normal';
}

// ---------- BUZZER ----------
function handleBuzzer(pid) {
    if (!game.questionActive) return;
    if (document.getElementById(`buzzer-${pid}`).disabled) return;
    AudioEngine.play('buzzerDing');
    game.questionActive = false;
    game.turn = pid;
    clearCpuTimers();
    clearBuzzerTimer();

    const other = pid === 'p1' ? 'p2' : 'p1';
    
    // Disable buzzers
    document.getElementById(`buzzer-${pid}`).classList.add('hidden');
    document.getElementById(`buzzer-${other}`).disabled = true;
    document.getElementById(`buzzer-${other}`).style.opacity = '0.3';

    // Show animation overlay
    const overlay = document.getElementById('turn-reveal-overlay');
    const nameEl = document.getElementById('turn-reveal-name');
    const charName = CHARACTERS[game[pid].charIdx].name;
    nameEl.textContent = `${charName.toUpperCase()} VAI RESPONDER!`;
    nameEl.style.color = pid === 'p1' ? '#38bdf8' : '#f87171';
    nameEl.style.borderColor = nameEl.style.color;
    overlay.classList.remove('hidden');

    setTimeout(() => {
        if (!game.fightStarted || game.paused) {
            overlay.classList.add('hidden');
        }
        if (!game.fightStarted) return;
        
        overlay.classList.add('hidden');
        document.getElementById(`answers-${pid}`).classList.remove('hidden');
        document.getElementById(`buzzer-${other}`).classList.add('hidden');
        
        startAnswerTimer(pid);

        // CPU answers if applicable
        if (game.mode === 'hvc' && pid === 'p2') {
            setTimeout(() => cpuAnswer(), 600 + Math.random() * 800);
        }
    }, 1500);
}

document.getElementById('buzzer-p1').addEventListener('pointerdown', (e) => { e.preventDefault(); handleBuzzer('p1'); if (game.mode === 'hvc') clearCpuTimers(); });
document.getElementById('buzzer-p2').addEventListener('pointerdown', (e) => { e.preventDefault(); handleBuzzer('p2'); });

// ---------- ANSWERS ----------
function handleAnswer(pid, val, btnEl) {
    if (game.turn !== pid) return; // safety
    clearAnswerTimer();

    const correct = val === game.currentAnswer;
    const other = pid === 'p1' ? 'p2' : 'p1';

    // Disable all buttons
    document.getElementById(`answers-${pid}`).querySelectorAll('.ans-btn').forEach(b => b.disabled = true);

    if (correct) {
        btnEl.classList.add('ans-correct');
        game[pid].streak++;

        // Som e texto flutuante de combo
        if (game[pid].streak >= 2) {
            AudioEngine.play('comboUp');
            AudioEngine.playComboLaugh(game[pid].streak);
            if (fighters[pid] && canvas) {
                spawnFloatingText(fighters[pid].x, 0.42, game[pid].streak + 'x COMBO!', '#ffd700');
            }
        } else {
            AudioEngine.play('correct');
        }
        updateHUD();

        // BONUS question: heal instead of attack
        if (game.currentQuestionBonus) {
            const healAmt = 10;
            game[pid].hp = Math.min(MAX_HP, game[pid].hp + healAmt);
            AudioEngine.play('heal');
            updateHUD();
            document.getElementById('question-text').textContent = `🧪 BÔNUS! ${CHARACTERS[game[pid].charIdx].name} recupera +${healAmt} HP!`;
            // Play drink animation
            const drinker = fighters[pid];
            drinker.state = 'drink';
            drinker.stateTimer = 80;
            setTimeout(() => {
                document.getElementById(`answers-${pid}`).classList.add('hidden');
                setTimeout(nextRound, 1500);
            }, 800);
            return;
        }

        const atkType = game[pid].streak >= 6 ? 'super' : game[pid].streak === 4 ? 'special' : 'normal';
        document.getElementById('question-text').textContent = '✅ CORRETO!';
        setTimeout(() => {
            document.getElementById(`answers-${pid}`).classList.add('hidden');
            executeAttack(pid, atkType);
        }, 800);
    } else {
        btnEl.classList.add('ans-wrong');
        game[pid].streak = 0;
        AudioEngine.play('wrong');
        updateHUD();

        // Bonus question wrong: no punishment, just pass
        if (game.currentQuestionBonus) {
            document.getElementById('question-text').textContent = `❌ ERROU o bônus! Ninguém ganha vida.`;
            setTimeout(() => {
                document.getElementById(`answers-${pid}`).classList.add('hidden');
                setTimeout(nextRound, 800);
            }, 1200);
            return;
        }

        const counterType = game[other].streak >= 6 ? 'super' : game[other].streak === 4 ? 'special' : 'normal';
        document.getElementById('question-text').textContent = `❌ ERROU! ${CHARACTERS[game[other].charIdx].name} ataca!`;
        setTimeout(() => {
            document.getElementById(`answers-${pid}`).classList.add('hidden');
            document.getElementById(`buzzer-${other}`).classList.add('hidden');
            executeAttack(other, counterType);
        }, 1200);
    }
}

// ---------- SPECIAL CINEMATIC ----------
const SPECIAL_MOVES = {
    ryuken:     ['HADOUKEN', 1],
    scorpius:   ['LANÇA DE FOGO', 1],
    subfrost:   ['LANÇA DE GELO', 1],
    gokhan:     ['GRITO EXPLOSIVO', 1],
    veggan:     ['GALICK GUN', 1],
    chunlei:    ['RELÂMPAGO', 1],
    liufang:    ['BICICLETA VOADORA', 1],
    kenfire:    ['SHORYUKEN', 1],
    friza:      ['DISCO DA MORTE', 1],
    kitara:     ['FAN THROW', 1],
    sonyab:     ['SOCAR INIMIGO', 1],
    cammyk:     ['KAMEHAMEHA', 1],
    androida:   ['LASER MORTAL', 1],
    milena:     ['GARRAS DA MORTE', 1],
    zangao:     ['ENXAME MORTAL', 1],
    blankao:    ['ELETRICIDADE SELVAGEM', 1],
    sagao:      ['LÂMINAS DA MORTE', 1],
    dhalsimba:  ['ESTIRAMENTO', 1],
    capoeirista:['GINGA LETAL', 1],
    hondalao:   ['HEADBUTT ESPACIAL', 1],
};

function showSpecialCinematic(pid, level, charId, charName, callback) {
    const el = document.getElementById('special-cinematic');
    const nameEl = document.getElementById('sc-char-name');
    const moveEl = document.getElementById('sc-move-name');
    const levelEl = document.getElementById('sc-level');
    const particlesEl = document.getElementById('sc-particles');

    const moveInfo = SPECIAL_MOVES[charId] || ['GOLPE ESPECIAL', 1];
    const moveName = level === 2
        ? moveInfo[0].replace('ESPECIAL', 'SUPER').replace('MORTAL', 'FATAL')
        : moveInfo[0];

    const p1Color = '#60a5fa';
    const p2Color = '#f87171';
    const baseColor = pid === 'p1' ? p1Color : p2Color;
    const accentColor = level === 2 ? '#f97316' : (pid === 'p1' ? '#3b82f6' : '#dc2626');

    levelEl.textContent = level === 2 ? '— SUPER GOLPE —' : '— GOLPE ESPECIAL —';
    nameEl.textContent = charName;
    nameEl.style.color = baseColor;
    nameEl.style.textShadow = `0 0 20px ${baseColor}`;
    moveEl.textContent = moveName;
    moveEl.className = `sc-move-name level-${level}`;

    // Spawn sparks
    particlesEl.innerHTML = '';
    const count = level === 2 ? 28 : 18;
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'sc-spark';
        const size = 4 + Math.random() * 10;
        s.style.cssText = `width:${size}px;height:${size}px;` +
            `left:${20 + Math.random() * 60}%;top:${10 + Math.random() * 80}%;` +
            `background:${Math.random() > 0.5 ? accentColor : '#fff'};` +
            `--dx:${(Math.random() - 0.5) * 160}px;--dy:${(Math.random() - 0.5) * 140}px;` +
            `animation-delay:${Math.random() * 0.3}s;animation-duration:${0.5 + Math.random() * 0.4}s;`;
        particlesEl.appendChild(s);
    }

    // Horizontal light stripes
    for (let i = 0; i < 5; i++) {
        const stripe = document.createElement('div');
        stripe.className = 'sc-stripe';
        stripe.style.cssText = `top:${10 + i * 20}%;animation-delay:${i * 0.04}s;`;
        particlesEl.appendChild(stripe);
    }

    el.classList.remove('hidden', 'special-cinematic--out');
    el.querySelector('.sc-bg').style.animation = 'none';
    void el.querySelector('.sc-bg').offsetWidth;
    el.querySelector('.sc-bg').style.animation = '';

    const holdDuration = level === 2 ? 1800 : 1400;
    setTimeout(() => {
        el.classList.add('special-cinematic--out');
        setTimeout(() => {
            el.classList.add('hidden');
            el.classList.remove('special-cinematic--out');
            if (callback) callback();
        }, 320);
    }, holdDuration);
}

// ---------- ATTACK EXECUTION ----------

function executeAttack(attackerId, type) {
    if (game.attackAnimating) return;

    // For special/super: show cinematic first, then do the attack
    if (type === 'special' || type === 'super') {
        const ch = CHARACTERS[game[attackerId].charIdx];
        const level = type === 'super' ? 2 : 1;
        game.attackAnimating = true; // lock during cinematic too
        showSpecialCinematic(attackerId, level, ch.id, ch.name, () => {
            game.attackAnimating = false;
            _doExecuteAttack(attackerId, type);
        });
        return;
    }

    _doExecuteAttack(attackerId, type);
}

function _doExecuteAttack(attackerId, type) {
    if (game.attackAnimating) return;
    game.attackAnimating = true;

    const defenderId = attackerId === 'p1' ? 'p2' : 'p1';
    const damage = DMG[type];

    // Consume streak for special/super
    if (type === 'special' || type === 'super') game[attackerId].streak = 0;

    const atkFighter = fighters[attackerId];
    const defFighter = fighters[defenderId];
    const atkName = CHARACTERS[game[attackerId].charIdx].name;

    // Hide attack menu immediately
    document.getElementById(`attack-menu-${attackerId}`).classList.add('hidden');

    if (type === 'normal') {
        // ============ CLOSE-RANGE PUNCH ============
        const contactOffset = 0.06;
        const contactX = attackerId === 'p1'
            ? defFighter.x - contactOffset
            : defFighter.x + contactOffset;

        document.getElementById('question-text').textContent = `👊 ${atkName} avança para o SOCO!`;
        atkFighter.targetX = contactX;

        setTimeout(() => {
            atkFighter.state = 'punch';
            atkFighter.stateTimer = 30;
            document.getElementById('question-text').textContent = `👊 ${atkName} dá um SOCO!`;
        }, 500);

        setTimeout(() => {
            AudioEngine.play('punch');
            game[defenderId].hp -= damage;
            defFighter.state = 'hit';
            defFighter.stateTimer = 25;
            defFighter.flash = 30;
            defFighter.targetX = defFighter.baseX + (attackerId === 'p1' ? 0.03 : -0.03);
            if (canvas) spawnHitParticles(defFighter, canvas.width, canvas.height, canvas.height * 0.88, atkFighter.char.accentColor);
            document.getElementById('screen-fight').classList.add('shake-screen');
            setTimeout(() => document.getElementById('screen-fight').classList.remove('shake-screen'), 300);
            updateHUD();
        }, 700);

        setTimeout(() => {
            atkFighter.targetX = atkFighter.baseX;
            defFighter.targetX = defFighter.baseX;
            game.attackAnimating = false;
            setTimeout(nextRound, 500);
        }, 1400);

    } else if (type === 'special') {
        // ============ SPECIAL ATTACK (ranged) ============
        const midX = attackerId === 'p1' ? 0.38 : 0.62;
        atkFighter.targetX = midX;

        document.getElementById('question-text').textContent = `⚡ ${atkName} prepara o GOLPE ESPECIAL!`;

        setTimeout(() => {
            atkFighter.state = 'kick';
            atkFighter.stateTimer = 35;
            spawnProjectile(attackerId, 'special');
            document.getElementById('question-text').textContent = `⚡ ${atkName} usa GOLPE ESPECIAL!`;
        }, 400);

        setTimeout(() => {
            AudioEngine.play('specialHit');
            game[defenderId].hp -= damage;
            defFighter.state = 'hit';
            defFighter.stateTimer = 25;
            defFighter.flash = 35;
            if (canvas) spawnHitParticles(defFighter, canvas.width, canvas.height, canvas.height * 0.88, '#60a5fa');
            document.getElementById('screen-fight').classList.add('shake-screen');
            setTimeout(() => document.getElementById('screen-fight').classList.remove('shake-screen'), 400);
            updateHUD();
        }, 600);

        setTimeout(() => {
            atkFighter.targetX = atkFighter.baseX;
            game.attackAnimating = false;
            setTimeout(nextRound, 500);
        }, 1500);

    } else {
        // ============ SUPER ATTACK (dramatic) ============
        const midX = attackerId === 'p1' ? 0.40 : 0.60;
        atkFighter.targetX = midX;

        document.getElementById('question-text').textContent = `💥 ${atkName} carrega o SUPER GOLPE!`;

        setTimeout(() => {
            atkFighter.state = 'special';
            atkFighter.stateTimer = 50;
            spawnProjectile(attackerId, 'super');
            document.getElementById('question-text').textContent = `💥 ${atkName} usa SUPER GOLPE!`;
        }, 500);

        setTimeout(() => {
            AudioEngine.play('superHit');
            screenFlash = 0.65;
            game[defenderId].hp -= damage;
            defFighter.state = 'hit';
            defFighter.stateTimer = 30;
            defFighter.flash = 45;
            defFighter.targetX = defFighter.baseX + (attackerId === 'p1' ? 0.05 : -0.05);
            spawnGroundCrack(defFighter.x);
            if (canvas) {
                const cw = canvas.width, ch = canvas.height, fl = ch * 0.88;
                spawnHitParticles(defFighter, cw, ch, fl, '#f97316');
                spawnHitParticles(defFighter, cw, ch, fl, '#ffd700');
                // Extra-large shockwave for super
                const sx = defFighter.x * cw;
                const sy = fl - 60 * Math.max(Math.min(cw, ch) * 0.003, 0.9);
                spawnShockwave(sx, sy, '#ff8800', 140);
                spawnShockwave(sx, sy, '#ffffff', 100);
            }
            document.getElementById('screen-fight').classList.add('shake-screen');
            setTimeout(() => document.getElementById('screen-fight').classList.remove('shake-screen'), 500);
            updateHUD();
        }, 800);

        setTimeout(() => {
            atkFighter.targetX = atkFighter.baseX;
            defFighter.targetX = defFighter.baseX;
            game.attackAnimating = false;
            setTimeout(nextRound, 600);
        }, 2000);
    }
    updateHUD();
}

// ---------- END GAME ----------
function endGame() {
    game.fightStarted = false;
    clearCpuTimers();
    clearBuzzerTimer();
    clearAnswerTimer();
    projectiles = [];

    const winner = game.p1.hp > 0 ? 'p1' : 'p2';
    const loser = winner === 'p1' ? 'p2' : 'p1';
    const winnerChar = CHARACTERS[game[winner].charIdx];
    const loserChar = CHARACTERS[game[loser].charIdx];

    // Freeze loser at 0 HP — show FINISH HIM/HER!
    fighters[loser].state = 'hurt';
    AudioEngine.stopMusic();
    AudioEngine.playGong();

    showFinishOverlay(loserChar, () => {
        // Victory / Defeat animations after FINISH overlay
        fighters[winner].state = 'victory';
        fighters[loser].state = 'defeat';
        AudioEngine.play('victory');

        // Flawless victory: loser never dealt damage
        const isFlawless = game[loser].hp === 0 && game[winner].hp === MAX_HP;
        if (isFlawless) {
            setTimeout(() => AudioEngine.playFast(), 800);
            document.getElementById('question-text').textContent = `⚡ FLAWLESS! ${winnerChar.name} VENCE!`;
        } else if (game[winner].hp >= MAX_HP * 0.8) {
            setTimeout(() => AudioEngine.playExcellent(), 600);
            document.getElementById('question-text').textContent = `🏆 ${winnerChar.name} VENCE!`;
        } else {
            setTimeout(() => AudioEngine.playWonderful(), 600);
            document.getElementById('question-text').textContent = `🏆 ${winnerChar.name} VENCE!`;
        }

        // Keep arena loop running for animations, then show end screen after delay
        setTimeout(() => {
            if (arenaAnimId) cancelAnimationFrame(arenaAnimId);
            arenaAnimId = null;
            showEndScreen(winner, winnerChar);
        }, 3000);
    });
}

function showFinishOverlay(loserChar, callback) {
    const isFemale = ['friza', 'chunlei', 'cammyk'].includes(loserChar.id);
    const text = isFemale ? 'FINISH HER!' : 'FINISH HIM!';
    let el = document.getElementById('finish-overlay');
    if (!el) {
        el = document.createElement('div');
        el.id = 'finish-overlay';
        document.getElementById('screen-fight').appendChild(el);
    }
    el.textContent = text;
    el.className = 'finish-overlay finish-overlay--in';
    setTimeout(() => {
        el.classList.remove('finish-overlay--in');
        el.classList.add('finish-overlay--out');
        setTimeout(() => {
            el.className = 'finish-overlay hidden';
            callback();
        }, 500);
    }, 2000);
}

function showEndScreen(winner, winnerChar) {
    // Tournament mode: advance bracket
    if (game.mode === 'tournament' && game.tournament) {
        const t = game.tournament;
        const match = t.bracket[t.currentMatch];
        match.winner = winner === 'p1' ? match.p1 : match.p2;
        match.done = true;

        // Check if tournament is over
        const nextRoundMatches = t.bracket.filter(m => m.round === match.round && !m.done);
        if (nextRoundMatches.length === 0) {
            // Advance winners to next round
            const currentRoundMatches = t.bracket.filter(m => m.round === match.round);
            const winners = currentRoundMatches.map(m => m.winner);
            if (winners.length === 1) {
                // CHAMPION!
                document.getElementById('end-winner').textContent = `🏆 ${winners[0].name} É O CAMPEÃO!`;
                document.getElementById('end-method').textContent = 'Torneio finalizado!';
                document.getElementById('btn-rematch').classList.add('hidden');
                document.getElementById('btn-reselect').classList.add('hidden');
                document.getElementById('btn-end-exit').classList.remove('hidden');
                showScreen('screen-end');
                startConfetti();
                return;
            }
            // Create next round matches
            const nextRound = match.round + 1;
            for (let i = 0; i < winners.length; i += 2) {
                t.bracket.push({
                    p1: winners[i],
                    p2: winners[i + 1],
                    winner: null,
                    done: false,
                    round: nextRound
                });
            }
        }

        // Find next undone match
        const nextMatch = t.bracket.find(m => !m.done);
        if (nextMatch) {
            t.currentMatch = t.bracket.indexOf(nextMatch);
        }

        // Show bracket screen
        document.getElementById('end-winner').textContent = `${winnerChar.name} VENCE!`;
        document.getElementById('end-method').textContent = 'Avançando no torneio...';
        document.getElementById('btn-rematch').textContent = '🏆 VER CHAVE';
        document.getElementById('btn-rematch').classList.remove('hidden');
        document.getElementById('btn-reselect').classList.add('hidden');
        document.getElementById('btn-end-exit').classList.remove('hidden');
        showScreen('screen-end');
        startConfetti();
        return;
    }

    document.getElementById('end-winner').textContent = `${winnerChar.name} VENCE!`;
    if (game.mode === 'hvc') {
        document.getElementById('end-method').textContent = winner === 'p1' ? 'Você venceu a CPU!' : 'A CPU venceu!';
    } else {
        document.getElementById('end-method').textContent = winner === 'p1' ? 'Jogador 1 é o campeão!' : 'Jogador 2 é o campeão!';
    }
    document.getElementById('btn-rematch').textContent = 'JOGAR NOVAMENTE';
    document.getElementById('btn-rematch').classList.remove('hidden');
    document.getElementById('btn-reselect').classList.remove('hidden');
    document.getElementById('btn-end-exit').classList.add('hidden');

    showScreen('screen-end');
    startConfetti();
}

// ---------- END SCREEN BUTTONS ----------
document.getElementById('btn-rematch').onclick = () => {
    stopConfetti();
    if (game.mode === 'tournament' && game.tournament) {
        renderBracket();
        showScreen('screen-tournament-bracket');
        return;
    }
    startFight();
};
document.getElementById('btn-reselect').onclick = () => {
    stopConfetti();
    goToCharSelect();
};
document.getElementById('btn-end-exit').onclick = () => {
    stopConfetti();
    showScreen('screen-title');
};

// ---------- CONFETTI ----------
let confettiAnimId = null;
let confettiParticles = [];

function startConfetti() {
    const cvs = document.getElementById('confetti-canvas');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    const cctx = cvs.getContext('2d');
    confettiParticles = [];
    const colors = ['#f44', '#ff0', '#4f4', '#44f', '#f0f', '#0ff', '#f80'];
    for (let i = 0; i < 120; i++) {
        confettiParticles.push({
            x: Math.random() * cvs.width,
            y: Math.random() * -cvs.height,
            w: 6 + Math.random() * 8,
            h: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: 1 + Math.random() * 3,
            vx: (Math.random() - 0.5) * 2,
            rot: Math.random() * 360,
            rotV: (Math.random() - 0.5) * 10
        });
    }
    function draw() {
        confettiAnimId = requestAnimationFrame(draw);
        cctx.clearRect(0, 0, cvs.width, cvs.height);
        confettiParticles.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            p.rot += p.rotV;
            if (p.y > cvs.height) { p.y = -10; p.x = Math.random() * cvs.width; }
            cctx.save();
            cctx.translate(p.x, p.y);
            cctx.rotate(p.rot * Math.PI / 180);
            cctx.fillStyle = p.color;
            cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            cctx.restore();
        });
    }
    draw();
}

function stopConfetti() {
    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    confettiAnimId = null;
}

// ========== TOURNAMENT SYSTEM ==========
let tournamentPlayers = [];
let tournamentRegIdx = 0;
let tournamentSelectedChar = -1;

// Size selection
document.getElementById('btn-t4').onclick = () => startTournamentReg(4);
document.getElementById('btn-t8').onclick = () => startTournamentReg(8);
document.getElementById('btn-back-mode-t').onclick = () => showScreen('screen-mode');

function startTournamentReg(size) {
    game.tournament = { players: [], bracket: [], currentMatch: 0, size: size };
    tournamentPlayers = [];
    tournamentRegIdx = 0;
    tournamentSelectedChar = -1;
    document.getElementById('tournament-register').classList.remove('hidden');
    document.getElementById('tournament-players-list').innerHTML = '';
    updateTournamentRegUI();
    buildTournamentCharGrid();
}

function buildTournamentCharGrid() {
    const grid = document.getElementById('tournament-char-grid');
    grid.innerHTML = '';
    CHARACTERS.forEach((ch, i) => {
        const cell = document.createElement('div');
        cell.className = 'char-cell char-card';
        cell.innerHTML = `<img src="${ch.img}" alt="${ch.name}">`;
        cell.addEventListener('click', () => {
            const playerName = `Jogador ${tournamentRegIdx + 1}`;
            registerTournamentPlayer(playerName, i);
        });
        grid.appendChild(cell);
    });
}

function updateTournamentRegUI() {
    const idx = tournamentRegIdx + 1;
    const total = game.tournament.size;
    document.getElementById('reg-title').textContent = `Cadastro dos Jogadores (${idx}/${total})`;
    document.getElementById('reg-label').textContent = `Jogador ${idx}: Escolha o lutador`;
    tournamentSelectedChar = -1;
}

function registerTournamentPlayer(name, charIdx) {
    const player = {
        name: name,
        charIdx: charIdx,
        char: CHARACTERS[charIdx]
    };
    tournamentPlayers.push(player);

    // Show tag
    const list = document.getElementById('tournament-players-list');
    const tag = document.createElement('div');
    tag.className = 'tournament-player-tag';
    tag.innerHTML = `<img src="${player.char.img}" alt="">${player.name}`;
    list.appendChild(tag);

    tournamentRegIdx++;

    if (tournamentRegIdx >= game.tournament.size) {
        createBracket();
        return;
    }

    updateTournamentRegUI();
    buildTournamentCharGrid();
}

function createBracket() {
    // Shuffle players randomly
    const shuffled = [...tournamentPlayers].sort(() => Math.random() - 0.5);
    game.tournament.players = shuffled;
    game.tournament.bracket = [];

    // Create first round matches
    for (let i = 0; i < shuffled.length; i += 2) {
        game.tournament.bracket.push({
            p1: shuffled[i],
            p2: shuffled[i + 1],
            winner: null,
            done: false,
            round: 0
        });
    }
    game.tournament.currentMatch = 0;

    renderBracket();
    showScreen('screen-tournament-bracket');
}

function renderBracket() {
    const container = document.getElementById('bracket-container');
    container.innerHTML = '';

    const t = game.tournament;
    const maxRound = Math.max(...t.bracket.map(m => m.round));

    const roundNames4 = ['Semifinal', 'Final'];
    const roundNames8 = ['Quartas', 'Semifinal', 'Final'];
    const roundNames = t.size === 8 ? roundNames8 : roundNames4;

    for (let r = 0; r <= maxRound; r++) {
        const roundMatches = t.bracket.filter(m => m.round === r);
        const roundDiv = document.createElement('div');
        roundDiv.className = 'bracket-round';

        const title = document.createElement('div');
        title.className = 'bracket-round-title';
        title.textContent = roundNames[r] || `Rodada ${r + 1}`;
        roundDiv.appendChild(title);

        roundMatches.forEach(match => {
            const idx = t.bracket.indexOf(match);
            const matchDiv = document.createElement('div');
            matchDiv.className = 'bracket-match' + (idx === t.currentMatch && !match.done ? ' active' : '') + (match.done ? ' done' : '');

            const slot1 = document.createElement('div');
            slot1.className = 'bracket-slot' + (match.done && match.winner === match.p1 ? ' winner' : '') + (match.done && match.winner !== match.p1 ? ' loser' : '');
            slot1.innerHTML = `<img src="${match.p1.char.img}" alt="">${match.p1.name}`;

            const vs = document.createElement('div');
            vs.className = 'bracket-vs';
            vs.textContent = 'VS';

            const slot2 = document.createElement('div');
            slot2.className = 'bracket-slot' + (match.done && match.winner === match.p2 ? ' winner' : '') + (match.done && match.winner !== match.p2 ? ' loser' : '');
            slot2.innerHTML = `<img src="${match.p2.char.img}" alt="">${match.p2.name}`;

            matchDiv.appendChild(slot1);
            matchDiv.appendChild(vs);
            matchDiv.appendChild(slot2);
            roundDiv.appendChild(matchDiv);
        });

        container.appendChild(roundDiv);
    }

    // Update info text
    const nextMatch = t.bracket.find(m => !m.done);
    if (nextMatch) {
        document.getElementById('bracket-info').textContent = `Próxima: ${nextMatch.p1.name} vs ${nextMatch.p2.name}`;
        document.getElementById('btn-next-match').classList.remove('hidden');
    } else {
        document.getElementById('bracket-info').textContent = 'Torneio finalizado!';
        document.getElementById('btn-next-match').classList.add('hidden');
    }
}

document.getElementById('btn-next-match').onclick = () => {
    const t = game.tournament;
    const match = t.bracket[t.currentMatch];
    if (!match || match.done) return;

    // Set up the match
    game.p1.charIdx = CHARACTERS.findIndex(c => c.id === match.p1.char.id);
    game.p2.charIdx = CHARACTERS.findIndex(c => c.id === match.p2.char.id);

    // Set player names in HUD
    startFight();
    // Override HUD names with tournament player names
    document.getElementById('hud-name-p1').textContent = match.p1.name;
    document.getElementById('hud-name-p2').textContent = match.p2.name;
};

document.getElementById('btn-exit-tournament').onclick = () => {
    game.tournament = null;
    showScreen('screen-title');
};

// ========== PAR OU ÍMPAR SYSTEM ==========
let piState = {
    p1Choice: null, // 'par' or 'impar'
    p2Choice: null,
    phase: 'choice' // 'choice', 'reveal'
};

function startParImpar() {
    // Reset state
    piState = { p1Choice: null, p2Choice: null, phase: 'choice' };

    const overlay = document.getElementById('pi-overlay');
    overlay.classList.remove('hidden');

    // Set player names
    document.getElementById('pi-name-p1').textContent = CHARACTERS[game.p1.charIdx].name;
    document.getElementById('pi-name-p2').textContent =
        game.mode === 'hvc' ? '🤖 CPU' : CHARACTERS[game.p2.charIdx].name;

    // Show choice buttons, hide numbers and results
    document.getElementById('pi-choice-p1').classList.remove('hidden');
    document.getElementById('pi-choice-p2').classList.remove('hidden');
    document.getElementById('pi-numbers-p1').classList.add('hidden');
    document.getElementById('pi-numbers-p2').classList.add('hidden');
    document.getElementById('pi-result-p1').classList.add('hidden');
    document.getElementById('pi-result-p2').classList.add('hidden');
    document.getElementById('pi-reveal').classList.add('hidden');
    document.getElementById('pi-title').textContent = 'PAR OU ÍMPAR?';

    // Reset button states
    overlay.querySelectorAll('.pi-btn').forEach(b => {
        b.classList.remove('selected', 'disabled-choice');
    });
    overlay.querySelectorAll('.pi-num').forEach(b => {
        b.classList.remove('selected');
    });

    // HvC mode: hide P2 choice (CPU auto-picks opposite of P1)
    if (game.mode === 'hvc') {
        document.getElementById('pi-choice-p2').classList.add('hidden');
    }
}

// Event delegation for par/ímpar buttons
document.getElementById('pi-overlay').addEventListener('click', (e) => {
    const btn = e.target.closest('.pi-btn');
    if (btn) {
        handlePiChoice(btn.dataset.player, btn.dataset.choice);
    }
});

function handlePiChoice(player, choice) {
    if (piState.phase !== 'choice') return;

    if (player === 'p1') {
        piState.p1Choice = choice;

        // Highlight P1's selection
        document.querySelectorAll('#pi-choice-p1 .pi-btn').forEach(b => {
            b.classList.toggle('selected', b.dataset.choice === choice);
            b.classList.toggle('disabled-choice', b.dataset.choice !== choice);
        });

        // HvC: CPU gets opposite and reveal immediately
        if (game.mode === 'hvc') {
            piState.p2Choice = choice === 'par' ? 'impar' : 'par';
            piState.phase = 'reveal';
            document.getElementById('pi-title').textContent = 'COMPUTADOR ESCOLHENDO...';
            setTimeout(() => piReveal(), 800);
            return;
        }

        // HvH: wait for P2 to choose
        if (!piState.p2Choice) {
            document.getElementById('pi-title').textContent =
                `${CHARACTERS[game.p2.charIdx].name}: ESCOLHA!`;
        } else {
            // Both chose, proceed
            piState.phase = 'reveal';
            document.getElementById('pi-title').textContent = 'COMPUTADOR ESCOLHENDO...';
            setTimeout(() => piReveal(), 800);
        }

    } else if (player === 'p2') {
        piState.p2Choice = choice;

        // Highlight P2's selection
        document.querySelectorAll('#pi-choice-p2 .pi-btn').forEach(b => {
            b.classList.toggle('selected', b.dataset.choice === choice);
            b.classList.toggle('disabled-choice', b.dataset.choice !== choice);
        });

        // HvH: wait for P1 to choose
        if (!piState.p1Choice) {
            document.getElementById('pi-title').textContent =
                `${CHARACTERS[game.p1.charIdx].name}: ESCOLHA!`;
        } else {
            // Both chose, proceed
            piState.phase = 'reveal';
            document.getElementById('pi-title').textContent = 'COMPUTADOR ESCOLHENDO...';
            setTimeout(() => piReveal(), 800);
        }
    }
}

function piReveal() {
    // Computer picks 2 random numbers
    const p1Num = Math.floor(Math.random() * 5) + 1;
    const p2Num = Math.floor(Math.random() * 5) + 1;
    const sum = p1Num + p2Num;
    const isPar = sum % 2 === 0;
    const result = isPar ? 'par' : 'impar';

    // Determine winner
    const p1Wins = piState.p1Choice === result;
    const winner = p1Wins ? 'p1' : 'p2';

    // Show results
    const r1 = document.getElementById('pi-result-p1');
    const r2 = document.getElementById('pi-result-p2');
    r1.textContent = p1Num;
    r2.textContent = p2Num;
    r1.classList.remove('hidden', 'winner-result', 'loser-result');
    r2.classList.remove('hidden', 'winner-result', 'loser-result');
    r1.classList.add(p1Wins ? 'winner-result' : 'loser-result');
    r2.classList.add(p1Wins ? 'loser-result' : 'winner-result');

    // Show reveal info
    const reveal = document.getElementById('pi-reveal');
    reveal.classList.remove('hidden');
    document.getElementById('pi-sum-text').textContent =
        `${p1Num} + ${p2Num} = ${sum} (${isPar ? 'PAR' : 'ÍMPAR'})`;

    const winnerName = winner === 'p1'
        ? CHARACTERS[game.p1.charIdx].name
        : (game.mode === 'hvc' ? 'CPU' : CHARACTERS[game.p2.charIdx].name);
    document.getElementById('pi-winner-text').textContent = `✋ ${winnerName} responde!`;

    document.getElementById('pi-title').textContent = `${sum} é ${isPar ? 'PAR' : 'ÍMPAR'}!`;

    // After reveal delay, give turn to winner
    setTimeout(() => {
        document.getElementById('pi-overlay').classList.add('hidden');
        document.querySelector('.controls-split').style.display = '';

        game.questionActive = true;
        game.turn = null;

        // Auto-buzz the winner
        handleBuzzer(winner);
    }, 2000);
}

// ========== FIGHT ANNOUNCE OVERLAY ==========
function showVSIntro(p1Name, p2Name, callback) {
    const el = document.getElementById('vs-intro');
    if (!el) { callback(); return; }
    document.getElementById('vs-name-p1').textContent = p1Name;
    document.getElementById('vs-name-p2').textContent = p2Name;
    el.classList.remove('hidden', 'vs-intro--out', 'vs-intro--in');
    void el.offsetWidth; // force reflow
    el.classList.add('vs-intro--in');
    setTimeout(() => {
        el.classList.remove('vs-intro--in');
        el.classList.add('vs-intro--out');
        setTimeout(() => {
            el.classList.add('hidden');
            el.classList.remove('vs-intro--out');
            callback();
        }, 350);
    }, 2000);
}

function showFightAnnounce(text) {
    const el = document.getElementById('fight-announce');
    const txt = document.getElementById('fight-announce-text');
    if (!el || !txt) return;
    txt.textContent = text;
    el.classList.remove('hidden', 'fight-announce--out');
    el.classList.add('fight-announce--in');
    AudioEngine.playBell();
    setTimeout(() => AudioEngine.playFightVoice(), 250);
    setTimeout(() => {
        el.classList.remove('fight-announce--in');
        el.classList.add('fight-announce--out');
        setTimeout(() => el.classList.add('hidden'), 400);
    }, 900);
}

// ========== MENU MUSIC INIT ==========
// Title screen is active in HTML from the start — start menu music on first user interaction
document.addEventListener('pointerdown', function startMenuOnce() {
    AudioEngine.startMenuMusic();
    setTimeout(() => AudioEngine.playItHasBegun(), 1200);
    document.removeEventListener('pointerdown', startMenuOnce);
}, { once: true, passive: true });

// ========== MUTE BUTTON ==========
(function initMuteButton() {
    const btn = document.getElementById('btn-mute');
    if (!btn) return;
    function updateIcon() {
        btn.textContent = AudioEngine.isMuted() ? '🔇' : '🔊';
        btn.title = AudioEngine.isMuted() ? 'Ativar som' : 'Silenciar';
    }
    updateIcon();
    btn.addEventListener('click', () => {
        AudioEngine.setMuted(!AudioEngine.isMuted());
        updateIcon();
    });
})();

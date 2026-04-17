// =============================================
// MATH KOMBAT — Audio Engine
// Síntese procedural via Web Audio API.
// Nenhum arquivo externo necessário.
// =============================================
const AudioEngine = (() => {
    let _ctx = null;
    let _muted = localStorage.getItem('mk_muted') === '1';
    let _volume = parseFloat(localStorage.getItem('mk_volume') || '0.65');

    function getCtx() {
        if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (_ctx.state === 'suspended') _ctx.resume();
        return _ctx;
    }

    function masterGain() {
        const ac = getCtx();
        const g = ac.createGain();
        g.gain.value = _muted ? 0 : _volume;
        g.connect(ac.destination);
        return g;
    }

    // Buffer de ruído branco
    function makeNoise(duration) {
        const ac = getCtx();
        const len = Math.ceil(ac.sampleRate * (duration + 0.05));
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        return buf;
    }

    // Aplica envelope attack/decay a um GainNode
    function env(g, peak, attack, duration, t) {
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(peak, t + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    }

    // Oscilador com glide de frequência e envelope
    function osc(freq, type, peak, attack, duration, t, freqEnd) {
        const ac = getCtx();
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, t);
        if (freqEnd !== undefined && freqEnd !== freq) {
            o.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), t + duration);
        }
        env(g, peak, attack, duration, t);
        o.connect(g);
        g.connect(masterGain());
        o.start(t);
        o.stop(t + duration + 0.05);
    }

    // Ruído filtrado (bandpass)
    function noiseBurst(freq, q, peak, duration, t) {
        const ac = getCtx();
        const src = ac.createBufferSource();
        src.buffer = makeNoise(duration);
        const filt = ac.createBiquadFilter();
        filt.type = 'bandpass';
        filt.frequency.value = freq;
        filt.Q.value = q;
        const g = ac.createGain();
        env(g, peak, 0.002, duration, t);
        src.connect(filt);
        filt.connect(g);
        g.connect(masterGain());
        src.start(t);
        src.stop(t + duration + 0.05);
    }

    // ---------- Definição dos sons ----------
    const sounds = {

        // Resposta correta — chime ascendente
        correct() {
            const t = getCtx().currentTime;
            [330, 415, 523].forEach((f, i) => osc(f, 'sine', 0.4, 0.01, 0.22, t + i * 0.1));
        },

        // Combo desbloqueado — dois tons rápidos mais agudos
        comboUp() {
            const t = getCtx().currentTime;
            osc(440, 'sine', 0.35, 0.005, 0.1, t);
            osc(660, 'sine', 0.38, 0.005, 0.12, t + 0.08);
        },

        // Resposta errada — buzzer descendente
        wrong() {
            const t = getCtx().currentTime;
            osc(440, 'square', 0.5, 0.01, 0.38, t, 110);
            osc(220, 'sawtooth', 0.2, 0.01, 0.28, t + 0.06);
        },

        // Vitória — fanfarra de 4 notas
        victory() {
            const t = getCtx().currentTime;
            [261, 329, 392, 523].forEach((f, i) => osc(f, 'sine', 0.5, 0.01, 0.34, t + i * 0.15));
        },

        // Derrota — sequência descendente triste
        defeat() {
            const t = getCtx().currentTime;
            [392, 330, 261, 196].forEach((f, i) => osc(f, 'sine', 0.35, 0.01, 0.38, t + i * 0.22));
        },

        // Buzzer pressionado — ding agudo
        buzzerDing() {
            osc(880, 'sine', 0.45, 0.005, 0.12, getCtx().currentTime);
        },

        // Seleção de personagem — clique curto
        select() {
            const t = getCtx().currentTime;
            osc(600, 'square', 0.25, 0.002, 0.06, t, 800);
        },

        // Projétil disparado — whoosh descendente
        projectile() {
            const t = getCtx().currentTime;
            osc(750, 'sine', 0.3, 0.01, 0.28, t, 280);
            noiseBurst(1100, 3, 0.15, 0.2, t);
        },

        // Tick do timer urgente
        timerTick() {
            osc(1100, 'sine', 0.2, 0.002, 0.055, getCtx().currentTime);
        },

        // Cura / bônus — arpejo ascendente
        heal() {
            const t = getCtx().currentTime;
            [523, 659, 784].forEach((f, i) => osc(f, 'sine', 0.35, 0.01, 0.22, t + i * 0.1));
        },

        // Início de round — substituído por voz MP3; fallback procedural
        roundStart() {
            if (_mp3('announceRound')) return; // MP3 disponível, usa ele
            const t = getCtx().currentTime;
            noiseBurst(2000, 5, 0.45, 0.05, t);
            osc(200, 'square', 0.45, 0.01, 0.22, t + 0.06, 600);
        },

        // Vitória — fanfarra + risada
        victory() {
            const t = getCtx().currentTime;
            [261, 329, 392, 523].forEach((f, i) => osc(f, 'sine', 0.45, 0.01, 0.34, t + i * 0.15));
            setTimeout(() => _mp3('bigLaugh', 0.9), 500);
        },

        // Derrota — sequência triste + grito
        defeat() {
            const t = getCtx().currentTime;
            [392, 330, 261, 196].forEach((f, i) => osc(f, 'sine', 0.3, 0.01, 0.38, t + i * 0.22));
            setTimeout(() => _mp3('scream', 0.7), 200);
        },

        // Super golpe — explosão + grito da vítima
        superHit() {
            const t = getCtx().currentTime;
            osc(380, 'sawtooth', 0.9, 0.003, 0.45, t, 38);
            noiseBurst(250, 0.6, 0.7, 0.38, t);
            osc(50, 'sine', 0.5, 0.01, 0.55, t);
            osc(780, 'square', 0.4, 0.002, 0.08, t + 0.02, 200);
            setTimeout(() => _mp3('scream', 0.55), 150);
        },

        // Soco — efeito procedural + sfx extra
        punch() {
            const t = getCtx().currentTime;
            osc(180, 'square', 0.6, 0.003, 0.14, t, 70);
            noiseBurst(500, 2, 0.4, 0.08, t);
            _mp3('sfx16', 0.5);
        },

        // Golpe especial
        specialHit() {
            const t = getCtx().currentTime;
            osc(280, 'sawtooth', 0.7, 0.003, 0.22, t, 55);
            noiseBurst(700, 1.5, 0.5, 0.14, t);
            osc(80, 'sine', 0.4, 0.01, 0.28, t);
            _mp3('sfx20', 0.55);
        }
    };

    // ===== MP3 System =====
    const _audios = {};
    let _musicEl = null;

    function _initMP3s() {
        const base = 'mp3s/';
        const files = {
            announceRound: base + 'mortal-kombat-9-sound-drop-round-1-fight.mp3',
            fightVoice:    base + 'voicebosch-fight-deep-voice-172194.mp3',
            bigLaugh:      base + 'laugh_christophe_lambert_mk.mp3',
            shortLaugh:    base + 'mortal-kombat-laugh.mp3',
            haHaHa:        base + 'ha-ha-ha.mp3',
            laughter:      base + 'laughter.mp3',
            scream:        base + 'mortal-kombat-scream_dfVWS3N.mp3',
            excellent:     base + 'excellent.mp3',
            wonderful:     base + 'wonderful.mp3',
            fast:          base + 'fast.mp3',
            itHasBegun:    base + 'it-has-begun-it-has-begun-shang-sung-shang-tsung-party-lets-party-weekend-weekend-ready-friday-lets-do-this-get-started-.mp3',
            musicTheme:    base + 'mortal-kombat.mp3',
            musicTheme2:   base + 'mortal-kombat2.mp3',
            menuTheme:     base + 'menu.mp3',
            mk3:           base + 'mk3-09455.mp3',
            sfx16:         base + '16_2.mp3',
            sfx20:         base + '20_2.mp3',
            // Stage-specific BGMs
            bgmFloresta:   base + 'mk2_living_forest.ogg',
            bgmVulcao:     base + 'mk4_fire_well.ogg',
            bgmMontanha:   base + 'mk1_warriors_shrine.ogg',
            bgmDeserto:    base + 'mk2_wasteland.ogg',
            bgmCastelo:    base + 'mk1_throne_room.ogg',
            // Round/KO sounds
            bell:          base + 'bell.ogg',
            gong:          base + 'gong.ogg',
            // Menus
            selectMusic:   base + 'select_music.ogg',
            ending:        base + 'Ending1.ogg',
        };
        for (const [name, src] of Object.entries(files)) {
            const a = new Audio(src);
            a.preload = 'auto';
            _audios[name] = a;
        }
        _audios.musicTheme.loop = true;
        _audios.musicTheme2.loop = true;
        _audios.menuTheme.loop = true;
        _audios.selectMusic.loop = true;
        ['bgmFloresta','bgmVulcao','bgmMontanha','bgmDeserto','bgmCastelo'].forEach(k => {
            _audios[k].loop = true;
        });
    }

    // Toca um MP3; retorna true se conseguiu disparar, false se não carregou
    function _mp3(name, vol) {
        const a = _audios[name];
        if (!a) return false;
        if (_muted) return true; // existe mas silenciado
        try {
            a.volume = Math.min(1, _volume * (vol !== undefined ? vol : 1));
            a.currentTime = 0;
            a.play().catch(() => {});
            return true;
        } catch (e) { return false; }
    }

    // Alterna entre os dois temas de luta a cada partida para variedade
    let _fightThemeIdx = 0;

    const _phaseBgm = {
        floresta: 'bgmFloresta',
        vulcao:   'bgmVulcao',
        montanha: 'bgmMontanha',
        deserto:  'bgmDeserto',
        castelo:  'bgmCastelo',
    };

    function startMusic(phase) {
        stopMusic();
        const bgmKey = phase && _phaseBgm[phase];
        let a;
        if (bgmKey && _audios[bgmKey]) {
            a = _audios[bgmKey];
        } else {
            const themes = [_audios.musicTheme, _audios.musicTheme2];
            a = themes[_fightThemeIdx % themes.length];
            _fightThemeIdx++;
        }
        if (!a || _muted) return;
        a.volume = Math.min(1, _volume * 0.38);
        a.currentTime = 0;
        a.play().catch(() => {});
        _musicEl = a;
    }

    function stopMusic() {
        if (_musicEl) { _musicEl.pause(); _musicEl.currentTime = 0; _musicEl = null; }
    }

    function startMenuMusic() {
        stopMusic();
        const a = _audios.menuTheme;
        if (!a || _muted) return;
        a.volume = Math.min(1, _volume * 0.3);
        a.currentTime = 0;
        a.play().catch(() => {});
        _musicEl = a;
    }

    function startSelectMusic() {
        stopMusic();
        const a = _audios.selectMusic;
        if (!a || _muted) return;
        a.volume = Math.min(1, _volume * 0.32);
        a.currentTime = 0;
        a.play().catch(() => {});
        _musicEl = a;
    }

    function playBell() { _mp3('bell', 0.85); }
    function playGong() { _mp3('gong', 0.9); }
    function playEnding() {
        stopMusic();
        const a = _audios.ending;
        if (!a || _muted) return;
        a.volume = Math.min(1, _volume * 0.5);
        a.currentTime = 0;
        a.play().catch(() => {});
        _musicEl = a;
    }

    function playFightVoice() { _mp3('fightVoice', 0.95); }
    function playItHasBegun() { _mp3('itHasBegun', 0.9); }
    function playComboLaugh(streak) {
        if (streak >= 5) _mp3('haHaHa', 0.8);
        else if (streak >= 3) _mp3('laughter', 0.75);
    }
    function playExcellent() { _mp3('excellent', 0.9); }
    function playWonderful() { _mp3('wonderful', 0.9); }
    function playFast() { _mp3('fast', 0.85); }

    function play(name) {
        if (!sounds[name]) return;
        try { sounds[name](); } catch (e) { /* ignora erros de áudio */ }
    }

    function setMuted(val) {
        _muted = val;
        localStorage.setItem('mk_muted', val ? '1' : '0');
        if (val) stopMusic();
    }

    function setVolume(val) {
        _volume = Math.max(0, Math.min(1, val));
        localStorage.setItem('mk_volume', String(_volume));
        if (_musicEl && !_muted) _musicEl.volume = Math.min(1, _volume * 0.35);
    }

    function isMuted() { return _muted; }
    function getVolume() { return _volume; }

    // Inicializa MP3s logo que o DOM estiver pronto
    _initMP3s();

    // Retoma o contexto na primeira interação do usuário (política autoplay do browser)
    document.addEventListener('pointerdown', () => {
        if (_ctx && _ctx.state === 'suspended') _ctx.resume();
    }, { passive: true });

    return { play, setMuted, setVolume, isMuted, getVolume, startMusic, stopMusic, startMenuMusic, startSelectMusic, playBell, playGong, playEnding, playFightVoice, playItHasBegun, playComboLaugh, playExcellent, playWonderful, playFast };
})();

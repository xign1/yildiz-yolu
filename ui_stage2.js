// =========================================================================
// ui_stage2.js - HATA AYIKLANMIŞ, EKSİKSİZ TAM SÜRÜM
// 1. Ana Menü Sızıntısı Çözüldü (#screen-game:not(.hidden))
// 2. Çark Dönmeme Hatası Çözüldü (filter.Q.setValueAtTime(2.2, now) & try/catch)
// 3. Tüm Sekmeler (Soyunma Odası, Antrenman, Lig, Müze, Maç) Tek Ekrana (No-Scroll) Oturtuldu
// 4. 3D Perspektif Slalom (Akıcı Dripling, 3D Dubalar ve Mankenler)
// 5. Yazısız, Doğrudan Raf Üstüne Oturan 8 Detaylı 3D Kupa Modeli & Spor Gazetesi
// =========================================================================
(function () {

    // =====================================================================
    // 0. STİL, ANİMASYON VE MOBİL TEK EKRAN (NO-SCROLL) KİLİTLERİ
    // =====================================================================
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        @keyframes newspaperSpinDrop {
            0% { transform: scale(0.15) rotate(-520deg); opacity: 0; }
            70% { transform: scale(1.04) rotate(4deg); opacity: 1; }
            85% { transform: scale(0.98) rotate(-2deg); opacity: 1; }
            100% { transform: scale(1) rotate(-1deg); opacity: 1; }
        }
        .newspaper-spin-in {
            animation: newspaperSpinDrop 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .newsprint-paper {
            background-color: #f4efe4;
            background-image: radial-gradient(rgba(20, 51, 33, 0.04) 1px, transparent 0);
            background-size: 12px 12px;
            color: #1c1917;
            border: 3px solid #1c1917;
            box-shadow: 0 18px 40px rgba(0,0,0,0.85), inset 0 0 24px rgba(120, 90, 40, 0.14);
        }
        /* Kupanın doğrudan ahşap rafın perspektif yüzeyine oturması için */
        .trophy-on-shelf {
            margin-bottom: -11px;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s;
            filter: drop-shadow(0 6px 5px rgba(0, 0, 0, 0.8));
        }
        .trophy-on-shelf:hover {
            transform: translateY(-4px) scale(1.06);
        }
        .trophy-selected-glow {
            transform: translateY(-4px) scale(1.08);
            filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 12px rgba(250, 204, 21, 0.65));
        }

        /* MOBİL DİKEY EKRAN KİLİDİ (100dvh): DIŞ SAYFA ASLA KAYMAZ */
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100dvh;
            overflow: hidden !important;
            overscroll-behavior: none;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
        }

        .app-container {
            width: 100% !important;
            max-width: 440px !important;
            height: 100dvh !important;
            min-height: 100dvh !important;
            max-height: 100dvh !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            padding-top: env(safe-area-inset-top, 0px);
            padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        /* GİZLİ EKRANLAR VE SEKMELER KESİNLİKLE GÖRÜNMEZ (.hidden EZİLMEZ!) */
        .hidden {
            display: none !important;
        }

        #screen-menu:not(.hidden),
        #screen-create:not(.hidden),
        #screen-club-draw:not(.hidden) {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow-y: auto !important;
        }

        #screen-game:not(.hidden) {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
        }

        #screen-game > header {
            flex-shrink: 0 !important;
        }

        #screen-game > main {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
            padding: 0.4rem 0.5rem !important;
        }

        /* Tüm sekmeler tek ekrana ferah yayılır, taşma yapmaz */
        #tab-content-hub:not(.hidden),
        #tab-content-training:not(.hidden),
        #tab-content-league:not(.hidden),
        #tab-content-career:not(.hidden),
        #tab-content-match:not(.hidden) {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            gap: 0.35rem !important;
            overflow: hidden !important;
            margin: 0 !important;
        }

        /* Antrenman haritası dikey alana göre esnek büyür/küçülür, asla taşmaz */
        #tab-content-training > div.relative.w-full.h-64 {
            height: auto !important;
            flex: 1 1 auto !important;
            min-height: 155px !important;
            max-height: 250px !important;
        }

        /* Puan tablosu (#tab-content-league) kendi kutusu içinde kayar, ekranı taşırmaz */
        #tab-content-league > .board-panel {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
        }
        #tab-content-league .overflow-x-auto {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
        }

        /* Canlı maç ekranında spiker kutusu esnek olur */
        #tab-content-match > .board-panel.h-44 {
            height: auto !important;
            flex: 1 1 auto !important;
            min-height: 80px !important;
        }

        #game-bottom-nav {
            flex-shrink: 0 !important;
        }

        #training-minigame-modal > .board-panel {
            max-width: 420px !important;
        }
        #trainingMinigameCanvas {
            height: auto !important;
            max-height: 52dvh !important;
            aspect-ratio: 360 / 420 !important;
        }

        /* Tarayıcı adres çubuğu açıkken veya kısa ekranlarda otomatik kompaktlaşma */
        @media (max-height: 780px) {
            #screen-game > header > div:first-child { padding: 0.4rem 0.6rem !important; }
            #screen-game > header > div:last-child { padding: 0.3rem 0.6rem !important; }
            #tab-content-hub .p-3\\.5 { padding: 0.5rem 0.65rem !important; }
            #tab-content-hub .p-3 { padding: 0.45rem 0.6rem !important; }
            #tab-content-hub .py-3 { padding-top: 0.4rem !important; padding-bottom: 0.4rem !important; }
            #tab-content-hub .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.35rem !important; }
            #tab-content-training .p-3\\.5 { padding: 0.5rem 0.65rem !important; }
            #clubWheelCanvas { width: 240px !important; height: 240px !important; }
        }
    `;
    document.head.appendChild(styleEl);

    // Canvas boyutunu Şut/Pas (360px merkezli) ve Slalom ile %100 uyumlu 360x420 yap
    function syncTrainingCanvasDimensions() {
        const cvs = document.getElementById('trainingMinigameCanvas');
        if (cvs) {
            cvs.width = 360;
            cvs.height = 420;
            cvs.className = "w-full rounded-lg border-2 border-[#143321] bg-[#1b5e34] touch-none cursor-pointer shadow-inner select-none";
        }
    }
    syncTrainingCanvasDimensions();

    // =====================================================================
    // 1. EKRAN GEÇİŞ YÖNETİCİSİ (ANA MENÜDE OYUN EKRANINI KESİN GİZLER)
    // =====================================================================
    const ALL_SCREENS = ['screen-menu', 'screen-create', 'screen-club-draw', 'screen-game'];

    window.showScreen = function (screenId) {
        ALL_SCREENS.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === screenId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
        if (screenId === 'screen-menu' && typeof renderSaveSlots === 'function') {
            renderSaveSlots();
        }
    };

    // İlk açılışta sadece ana menünün görünmesini garanti altına al
    if (!gameData) {
        window.showScreen('screen-menu');
    }

    // =====================================================================
    // 2. ÇARKLARI KİLİTLEMEYEN MEKANİK ÇARK MANDAL SESİ (HATASIZ!)
    // =====================================================================
    let lastPegIndexMap = {};

    function playMechanicalWheelPegSound() {
        try {
            if (window.SFX && window.SFX.muted) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!window._gameAudioCtx) window._gameAudioCtx = new AudioCtx();
            const ctx = window._gameAudioCtx;
            if (ctx.state === 'suspended') {
                ctx.resume().catch(() => {});
                return;
            }

            const now = ctx.currentTime;

            // 1. Ahşap/Plastik Mandal Çarpma Gövdesi
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(620, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.028);

            oscGain.gain.setValueAtTime(0.26, now);
            oscGain.gain.exponentialRampToValueAtTime(0.005, now + 0.03);

            osc.connect(oscGain);
            oscGain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.032);

            // 2. İbre Tıkırtı Darbesi (DÜZELTİLDİ: filter.Q.setValueAtTime(2.2, now))
            const bufSize = Math.floor(ctx.sampleRate * 0.012);
            const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.3));
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buf;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1850, now);
            filter.Q.setValueAtTime(2.2, now);

            const nGain = ctx.createGain();
            nGain.gain.setValueAtTime(0.20, now);
            nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.012);

            noise.connect(filter);
            filter.connect(nGain);
            nGain.connect(ctx.destination);
            noise.start(now);
        } catch (err) {
            // Ses hatası olursa çark döngüsünü asla durdurma
        }
    }

    window.bounceWheelPointer = function (pointerId, currentAngle) {
        try {
            const ptr = document.getElementById(pointerId);
            const pegCount = 16;
            const currentPeg = Math.floor((currentAngle / (Math.PI * 2)) * pegCount);

            if (lastPegIndexMap[pointerId] !== currentPeg) {
                lastPegIndexMap[pointerId] = currentPeg;
                playMechanicalWheelPegSound();
                if (ptr) {
                    ptr.style.transform = 'rotate(-22deg)';
                    setTimeout(() => {
                        if (ptr) ptr.style.transform = 'rotate(0deg)';
                    }, 45);
                }
            }
        } catch (err) {}
    };

    function playNewspaperSound() {
        try {
            if (window.SFX && window.SFX.muted) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!window._gameAudioCtx) window._gameAudioCtx = new AudioCtx();
            const ctx = window._gameAudioCtx;
            if (ctx.state === 'suspended') {
                ctx.resume().catch(() => {});
                return;
            }

            const now = ctx.currentTime;
            const dur = 0.22;
            const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
            }
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(950, now);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.35, now);
            src.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            src.start(now);
        } catch (err) {}
    }

    // =====================================================================
    // 3. PARMAĞINLA SÜREKLİ YÖNLENDİRİLEN GERÇEKÇİ DRİPLİNG SLALOM
    // =====================================================================
    let slalomLoopId = null;
    let slalomActive = false;
    let slalomState = 'playing';
    let slalomTimeLeft = 1500;
    let slalomActiveGate = 0;
    let slalomTotalGates = 4;
    let slalomPointer = { down: false, x: 180, y: 360 };
    let dribbleFootPhase = 0;

    const slPlayer = { x: 180, y: 392, vx: 0, vy: 0, angle: -Math.PI / 2, r: 10 };
    const slBall = { x: 180, y: 378, r: 5.8 };
    let slGates = [];
    let slObstacles = [];

    function getPerspectiveBounds(y, W, H) {
        const t = Math.max(0, Math.min(1, (H - y) / (H - 28)));
        const margin = 14 + t * 40;
        const scale = 1.05 - t * 0.26;
        return { left: margin, right: W - margin, scale, t };
    }

    function draw3DTrainingCone(ctx, x, y, scale, stateColor) {
        const s = scale || 1;
        ctx.beginPath();
        ctx.ellipse(x + 2 * s, y + 4 * s, 11 * s, 5 * s, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.42)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x - 11 * s, y + 2 * s);
        ctx.lineTo(x, y - 3 * s);
        ctx.lineTo(x + 11 * s, y + 2 * s);
        ctx.lineTo(x, y + 7 * s);
        ctx.closePath();
        ctx.fillStyle = stateColor === 'passed' ? '#15803d' : (stateColor === 'active' ? '#ca8a04' : '#9a3412');
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const bodyColor = stateColor === 'passed' ? '#22c55e' : (stateColor === 'active' ? '#facc15' : '#f97316');
        ctx.beginPath();
        ctx.moveTo(x - 8 * s, y + 2 * s);
        ctx.lineTo(x - 2.2 * s, y - 18 * s);
        ctx.lineTo(x + 2.2 * s, y - 18 * s);
        ctx.lineTo(x + 8 * s, y + 2 * s);
        ctx.closePath();
        ctx.fillStyle = bodyColor;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 5.2 * s, y - 5 * s);
        ctx.lineTo(x - 3.6 * s, y - 11 * s);
        ctx.lineTo(x + 3.6 * s, y - 11 * s);
        ctx.lineTo(x + 5.2 * s, y - 5 * s);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }

    function draw3DDummyMannequin(ctx, x, y, scale) {
        const s = scale || 1;
        ctx.beginPath();
        ctx.ellipse(x, y + 5 * s, 12 * s, 5 * s, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fill();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 5 * s, y + 4 * s); ctx.lineTo(x - 5 * s, y - 2 * s);
        ctx.moveTo(x + 5 * s, y + 4 * s); ctx.lineTo(x + 5 * s, y - 2 * s);
        ctx.stroke();

        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x - 10 * s, y - 24 * s, 20 * s, 22 * s, 4 * s);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.fillRect(x - 9 * s, y - 15 * s, 18 * s, 4 * s);

        ctx.beginPath();
        ctx.arc(x, y - 29 * s, 5 * s, 0, Math.PI * 2);
        ctx.fillStyle = '#dc2626';
        ctx.fill();
        ctx.stroke();
    }

    function initRandomSlalomCourse() {
        syncTrainingCanvasDimensions();
        slPlayer.x = 180; slPlayer.y = 392; slPlayer.vx = 0; slPlayer.vy = 0; slPlayer.angle = -Math.PI / 2;
        slBall.x = 180; slBall.y = 378;
        slalomActiveGate = 0;
        dribbleFootPhase = 0;

        const gateCounts = [3, 4, 4, 5];
        slalomTotalGates = gateCounts[Math.floor(Math.random() * gateCounts.length)];
        slalomTimeLeft = (16 + slalomTotalGates * 3) * 60;
        slalomState = 'playing';
        slalomPointer.down = false;

        slGates = [];
        slObstacles = [];

        const topY = 72;
        const botY = 332;
        const stepY = (botY - topY) / Math.max(1, slalomTotalGates - 1);

        let preferLeft = Math.random() < 0.5;
        for (let i = 0; i < slalomTotalGates; i++) {
            const gy = Math.round(botY - i * stepY);
            let gcx;
            if (i === slalomTotalGates - 1 && Math.random() < 0.4) {
                gcx = 155 + Math.random() * 50;
            } else {
                gcx = preferLeft ? (96 + Math.random() * 44) : (215 + Math.random() * 44);
                preferLeft = !preferLeft;
            }
            const gw = 66 + Math.random() * 12;
            slGates.push({ id: i + 1, y: gy, cx: gcx, w: gw, passed: false });

            if (i < slalomTotalGates - 1 && Math.random() < 0.7) {
                const midY = gy - stepY * 0.5;
                const obsX = 135 + Math.random() * 90;
                slObstacles.push({ x: obsX, y: midY, r: 10 });
            }
        }
    }

    let pointerEventsAttached = false;
    function ensureSlalomPointerEvents() {
        if (pointerEventsAttached) return;
        const cvs = document.getElementById('trainingMinigameCanvas');
        if (!cvs) return;
        pointerEventsAttached = true;

        function getCoords(e) {
            const rect = cvs.getBoundingClientRect();
            const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
            const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (cvs.width / rect.width),
                y: (clientY - rect.top) * (cvs.height / rect.height)
            };
        }

        cvs.addEventListener('pointerdown', (e) => {
            if (!slalomActive || slalomState !== 'playing') return;
            e.preventDefault();
            e.stopPropagation();
            if (cvs.setPointerCapture) {
                try { cvs.setPointerCapture(e.pointerId); } catch (err) {}
            }
            const pos = getCoords(e);
            slalomPointer.down = true;
            slalomPointer.x = pos.x;
            slalomPointer.y = pos.y;
        }, { capture: true });

        cvs.addEventListener('pointermove', (e) => {
            if (!slalomActive || !slalomPointer.down) return;
            e.preventDefault();
            e.stopPropagation();
            const pos = getCoords(e);
            slalomPointer.x = pos.x;
            slalomPointer.y = pos.y;
        }, { capture: true });

        cvs.addEventListener('pointerup', () => {
            if (!slalomActive) return;
            slalomPointer.down = false;
        }, { capture: true });

        cvs.addEventListener('pointercancel', () => {
            slalomPointer.down = false;
        });
    }

    function renderPerspectiveSlalomLoop() {
        if (!slalomActive) return;
        const cvs = document.getElementById('trainingMinigameCanvas');
        if (!cvs || document.getElementById('training-minigame-modal').classList.contains('hidden')) {
            slalomActive = false;
            return;
        }
        const ctx = cvs.getContext('2d');
        const W = cvs.width, H = cvs.height;

        ctx.fillStyle = '#11381f';
        ctx.fillRect(0, 0, W, H);

        const stripeCount = 10;
        const fieldTop = 30, fieldBot = H - 12;
        const sliceH = (fieldBot - fieldTop) / stripeCount;

        for (let i = 0; i < stripeCount; i++) {
            const y1 = fieldTop + i * sliceH;
            const y2 = y1 + sliceH;
            const b1 = getPerspectiveBounds(y1, W, H);
            const b2 = getPerspectiveBounds(y2, W, H);

            ctx.beginPath();
            ctx.moveTo(b1.left, y1);
            ctx.lineTo(b1.right, y1);
            ctx.lineTo(b2.right, y2);
            ctx.lineTo(b2.left, y2);
            ctx.closePath();
            ctx.fillStyle = i % 2 === 0 ? '#1e6b3a' : '#18582f';
            ctx.fill();
        }

        const topB = getPerspectiveBounds(fieldTop, W, H);
        const botB = getPerspectiveBounds(fieldBot, W, H);
        ctx.beginPath();
        ctx.moveTo(topB.left, fieldTop);
        ctx.lineTo(topB.right, fieldTop);
        ctx.lineTo(botB.right, fieldBot);
        ctx.lineTo(botB.left, fieldBot);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(W / 2 - 40, 10, 80, 20);
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(W / 2 - 40, 10, 80, 20);

        slGates.slice().reverse().forEach((g) => {
            const idx = g.id - 1;
            const p = getPerspectiveBounds(g.y, W, H);
            const leftX = g.cx - (g.w * p.scale) / 2;
            const rightX = g.cx + (g.w * p.scale) / 2;
            const isNext = idx === slalomActiveGate;
            const stateCol = g.passed ? 'passed' : (isNext ? 'active' : 'normal');

            ctx.beginPath();
            ctx.moveTo(leftX, g.y);
            ctx.lineTo(rightX, g.y);
            ctx.strokeStyle = g.passed ? '#4ade80' : (isNext ? '#fde047' : 'rgba(255,255,255,0.28)');
            ctx.lineWidth = isNext ? 3.5 : 2;
            ctx.setLineDash([6, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            draw3DTrainingCone(ctx, leftX, g.y, p.scale, stateCol);
            draw3DTrainingCone(ctx, rightX, g.y, p.scale, stateCol);

            ctx.fillStyle = g.passed ? '#86efac' : (isNext ? '#fde047' : 'rgba(255,255,255,0.65)');
            ctx.font = `900 ${Math.round(11 * p.scale)}px Nunito, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(`KAPI ${g.id}`, g.cx, g.y - 22 * p.scale);
        });

        slObstacles.forEach(m => {
            const p = getPerspectiveBounds(m.y, W, H);
            draw3DDummyMannequin(ctx, m.x, m.y, p.scale);
        });

        if (slalomState === 'playing') {
            slalomTimeLeft--;
            document.getElementById('mg-modal-balls').innerText = `SÜRE: ${Math.ceil(slalomTimeLeft / 60)}sn`;
            document.getElementById('mg-modal-score').innerText = `KAPI: ${slalomActiveGate} / ${slalomTotalGates}`;

            if (slalomTimeLeft <= 0) {
                slalomState = 'done';
                document.getElementById('mg-modal-status').innerText = `Süre bitti (${slalomActiveGate}/${slalomTotalGates} Kapı). Tüm kapıları geçmelisin.`;
                document.getElementById('btn-finish-mg').classList.remove('hidden');
            }

            const prevY = slPlayer.y;
            const dribbleRunSpeed = 1.75 + Math.max(0, (gameData ? gameData.stats.dribble : 60) - 55) * 0.015;

            if (slalomPointer.down) {
                const dx = slalomPointer.x - slPlayer.x;
                const dy = slalomPointer.y - slPlayer.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 6) {
                    const targetAngle = Math.atan2(dy, dx);
                    let diffAngle = targetAngle - slPlayer.angle;
                    while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                    while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                    slPlayer.angle += diffAngle * 0.22;

                    const speed = Math.min(dribbleRunSpeed, Math.max(0.95, dist * 0.08));
                    slPlayer.vx = Math.cos(slPlayer.angle) * speed;
                    slPlayer.vy = Math.sin(slPlayer.angle) * speed;

                    dribbleFootPhase += 0.18;
                } else {
                    slPlayer.vx *= 0.7;
                    slPlayer.vy *= 0.7;
                }
            } else {
                slPlayer.vx *= 0.75;
                slPlayer.vy *= 0.75;
            }

            slPlayer.x += slPlayer.vx;
            slPlayer.y += slPlayer.vy;

            const curBounds = getPerspectiveBounds(slPlayer.y, W, H);
            slPlayer.x = Math.max(curBounds.left + 8, Math.min(curBounds.right - 8, slPlayer.x));
            slPlayer.y = Math.max(32, Math.min(H - 16, slPlayer.y));

            const leadDist = (12.5 + Math.sin(dribbleFootPhase * 2) * 3.2) * curBounds.scale;
            const footSideOffset = Math.cos(dribbleFootPhase) * 3.5 * curBounds.scale;
            const perpAngle = slPlayer.angle + Math.PI / 2;

            const targetBallX = slPlayer.x + Math.cos(slPlayer.angle) * leadDist + Math.cos(perpAngle) * footSideOffset;
            const targetBallY = slPlayer.y + Math.sin(slPlayer.angle) * leadDist + Math.sin(perpAngle) * footSideOffset;

            slBall.x += (targetBallX - slBall.x) * 0.45;
            slBall.y += (targetBallY - slBall.y) * 0.45;

            slObstacles.forEach(m => {
                if (Math.hypot(slPlayer.x - m.x, slPlayer.y - m.y) < 15 || Math.hypot(slBall.x - m.x, slBall.y - m.y) < 13) {
                    if (window.SFX) window.SFX.post();
                    slPlayer.x -= Math.cos(slPlayer.angle) * 10;
                    slPlayer.y -= Math.sin(slPlayer.angle) * 10;
                    document.getElementById('mg-modal-status').innerText = "MANKENE ÇARPTIN! Parmağınla etrafından dolaştır.";
                }
            });

            if (slalomActiveGate < slGates.length) {
                const g = slGates[slalomActiveGate];
                const gp = getPerspectiveBounds(g.y, W, H);
                const leftX = g.cx - (g.w * gp.scale) / 2;
                const rightX = g.cx + (g.w * gp.scale) / 2;

                if (Math.hypot(slPlayer.x - leftX, slPlayer.y - g.y) < 13 || Math.hypot(slPlayer.x - rightX, slPlayer.y - g.y) < 13) {
                    if (window.SFX) window.SFX.post();
                    slPlayer.y += 8;
                    document.getElementById('mg-modal-status').innerText = "DUBAYA ÇARPTIN! İki dubanın ortasından sür.";
                } else if (prevY >= g.y && slPlayer.y <= g.y) {
                    if (slPlayer.x > leftX + 4 && slPlayer.x < rightX - 4) {
                        g.passed = true;
                        slalomActiveGate++;
                        if (window.SFX) window.SFX.kick();

                        if (slalomActiveGate >= slalomTotalGates) {
                            slalomState = 'done';
                            gameData.stats.dribble += 1;
                            saveCurrentGame();
                            window.updateGameHubUI();
                            triggerFloatingBadge("+1 TOP SÜRME (ÇALIM)!", "#7c3aed");
                            document.getElementById('mg-modal-status').innerText = `MÜKEMMEL DRİPLİNG! ${slalomTotalGates} kapıyı da geçtin: Top Sürme +1!`;
                            document.getElementById('btn-finish-mg').classList.remove('hidden');
                        } else {
                            document.getElementById('mg-modal-status').innerText = `KAPI ${slalomActiveGate} GEÇİLDİ! Şimdi Kapı ${slalomActiveGate + 1}'in içinden sür.`;
                        }
                    } else {
                        slPlayer.y = g.y + 14;
                        document.getElementById('mg-modal-status').innerText = `Kapı ${g.id}'in dışından geçtin! Sarı dubaların arasından sürmelisin.`;
                    }
                }
            }
        }

        if (slalomPointer.down && slalomState === 'playing') {
            ctx.beginPath();
            ctx.moveTo(slPlayer.x, slPlayer.y);
            ctx.lineTo(slalomPointer.x, slalomPointer.y);
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.arc(slalomPointer.x, slalomPointer.y, 10, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        const pScale = getPerspectiveBounds(slPlayer.y, W, H).scale;
        ctx.beginPath();
        ctx.ellipse(slPlayer.x, slPlayer.y + 6 * pScale, 10 * pScale, 4.5 * pScale, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fill();

        ctx.save();
        ctx.translate(slPlayer.x, slPlayer.y);
        ctx.rotate(slPlayer.angle + Math.PI / 2);
        ctx.fillStyle = gameData ? gameData.club.c1 : '#eab308';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-11 * pScale, -6 * pScale, 22 * pScale, 12 * pScale, 5 * pScale);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 6.5 * pScale, 0, Math.PI * 2);
        ctx.fillStyle = '#1c1917';
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(slBall.x, slBall.y, slBall.r * pScale, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        slalomLoopId = requestAnimationFrame(renderPerspectiveSlalomLoop);
    }

    const _stage1StartStation = window.startSelectedTrainingStation;
    window.startSelectedTrainingStation = function () {
        syncTrainingCanvasDimensions();
        if (window.selectedStationType === 'dribbling') {
            if (typeof gameData === 'undefined' || !gameData) return;
            if (gameData.trainedThisWeek) {
                window.showGameToast("Bu haftaki antrenman hakkını zaten kullandın!", "warn");
                return;
            }
            if (gameData.energy < 15) {
                window.showGameToast("Antrenman için en az %15 kondisyon gerekli! Revirde dinlen.", "warn");
                return;
            }
            gameData.energy -= 15;
            gameData.trainedThisWeek = true;
            window.updateGameHubUI();

            initRandomSlalomCourse();
            document.getElementById('mg-modal-title').innerText = `3. SLALOM DRİPLİNG (${slalomTotalGates} KAPI)`;
            document.getElementById('mg-modal-status').innerText = "Parmağını basılı tutup gideceğin yöne sürükleyerek dubaların arasından top sür!";
            document.getElementById('mg-modal-hint').innerText = `Basılı tutarak yönlendir ve ${slalomTotalGates} kapıyı geç = +1 Çalım`;
            document.getElementById('btn-finish-mg').classList.add('hidden');
            document.getElementById('btn-physic-boost').classList.add('hidden');
            const curvePanel = document.getElementById('mg-curve-controls');
            if (curvePanel) curvePanel.classList.add('hidden');

            ensureSlalomPointerEvents();
            slalomActive = true;
            document.getElementById('training-minigame-modal').classList.remove('hidden');
            if (slalomLoopId) cancelAnimationFrame(slalomLoopId);
            renderPerspectiveSlalomLoop();
        } else {
            slalomActive = false;
            if (_stage1StartStation) _stage1StartStation();
        }
    };

    const _stage1CloseMg = window.closeTrainingMinigame;
    window.closeTrainingMinigame = function () {
        slalomActive = false;
        if (slalomLoopId) cancelAnimationFrame(slalomLoopId);
        if (_stage1CloseMg) _stage1CloseMg();
    };

    // =====================================================================
    // 4. TAM DETAYLI 8 GERÇEKÇİ 3D KUPA MODELİ & TEK EKRAN MÜZE MİMARİSİ
    // =====================================================================
    const PHYSICAL_TROPHY_MODELS = {
        league_cup: `<svg width="60" height="72" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="24" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M12 68 H56 L58 76 H10 L12 68 Z" fill="#0c0a09" stroke="#57534e" stroke-width="1"/>
            <path d="M15 57 H53 L56 68 H12 L15 57 Z" fill="#1c1917" stroke="#eab308" stroke-width="1.2"/>
            <path d="M15 57 H34 V68 H12 L15 57 Z" fill="#292524"/>
            <rect x="20" y="60" width="28" height="5" rx="1" fill="#facc15" stroke="#713f12" stroke-width="0.8"/>
            <path d="M27 43 H41 L45 57 H23 L27 43 Z" fill="#ca8a04" stroke="#713f12" stroke-width="1.2"/>
            <path d="M27 43 H34 V57 H23 L27 43 Z" fill="#facc15"/>
            <ellipse cx="34" cy="49" rx="9" ry="2.5" fill="#fde047" stroke="#713f12" stroke-width="1"/>
            <path d="M11 16 L5 31 L9 32 L14 18 Z" fill="#dc2626"/>
            <path d="M57 16 L63 31 L59 32 L54 18 Z" fill="#16a34a"/>
            <path d="M18 14 C3 14, 3 34, 22 39" stroke="#fde047" stroke-width="4.5" stroke-linecap="round"/>
            <path d="M50 14 C65 14, 65 34, 46 39" stroke="#ca8a04" stroke-width="4.5" stroke-linecap="round"/>
            <path d="M16 11 H52 C52 35, 44 45, 34 45 C24 45, 16 35, 16 11 Z" fill="#eab308" stroke="#713f12" stroke-width="1.5"/>
            <path d="M16 11 H34 V45 C24 45, 16 35, 16 11 Z" fill="#facc15"/>
            <ellipse cx="34" cy="11" rx="18" ry="4.5" fill="#78350f" stroke="#fef08a" stroke-width="1.5"/>
            <path d="M21 17 C21 29, 25 36, 29 40" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.8"/>
        </svg>`,

        classic_match_ball: `<svg width="60" height="72" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M12 69 H56 L58 76 H10 L12 69 Z" fill="#291507"/>
            <path d="M15 57 H53 L56 69 H12 L15 57 Z" fill="#451a03" stroke="#d97706" stroke-width="1.2"/>
            <path d="M15 57 H34 V69 H12 L15 57 Z" fill="#78350f"/>
            <rect x="21" y="61" width="26" height="5" rx="1" fill="#facc15" stroke="#451a03" stroke-width="0.8"/>
            <path d="M21 57 L17 42 L25 47 L26 57 Z" fill="#facc15" stroke="#713f12" stroke-width="1"/>
            <path d="M47 57 L51 42 L43 47 L42 57 Z" fill="#ca8a04" stroke="#713f12" stroke-width="1"/>
            <path d="M31 57 L34 44 L37 57 Z" fill="#fde047" stroke="#713f12" stroke-width="1"/>
            <circle cx="34" cy="29" r="19.5" fill="#cbd5e1" stroke="#0f172a" stroke-width="2"/>
            <circle cx="31" cy="26" r="16.5" fill="#ffffff"/>
            <path d="M46 15 C53 24, 50 39, 38 46 C28 50, 19 46, 16 39 C26 45, 41 40, 46 28 Z" fill="#64748b" opacity="0.45"/>
            <polygon points="34,19 41,24 38,33 30,33 27,24" fill="#0f172a"/>
            <polygon points="34,9 39,12 37,15 31,15 29,12" fill="#0f172a"/>
            <polygon points="15,23 19,18 23,23 20,29 14,27" fill="#0f172a"/>
            <polygon points="53,23 49,18 45,23 48,29 54,27" fill="#0f172a"/>
            <polygon points="22,42 27,38 31,42 28,47 22,45" fill="#0f172a"/>
            <polygon points="46,42 41,38 37,42 40,47 46,45" fill="#0f172a"/>
            <line x1="34" y1="19" x2="34" y2="14" stroke="#334155" stroke-width="1.6"/>
            <line x1="41" y1="24" x2="46" y2="23" stroke="#334155" stroke-width="1.6"/>
            <line x1="27" y1="24" x2="22" y2="23" stroke="#334155" stroke-width="1.6"/>
            <line x1="38" y1="33" x2="41" y2="39" stroke="#334155" stroke-width="1.6"/>
            <line x1="30" y1="33" x2="27" y2="39" stroke="#334155" stroke-width="1.6"/>
            <ellipse cx="26" cy="17" rx="4.5" ry="2.2" transform="rotate(-25 26 17)" fill="#ffffff"/>
        </svg>`,

        golden_ball: `<svg width="60" height="72" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M13 68 H55 L57 76 H11 L13 68 Z" fill="#0c0a09"/>
            <polygon points="16,68 21,46 34,42 47,46 52,68" fill="#451a03" stroke="#eab308" stroke-width="1.4"/>
            <polygon points="16,68 21,46 34,42 34,68" fill="#78350f"/>
            <rect x="21" y="59" width="26" height="5.5" rx="1" fill="#facc15" stroke="#451a03" stroke-width="0.8"/>
            <circle cx="34" cy="27" r="19" fill="#ca8a04" stroke="#713f12" stroke-width="2"/>
            <circle cx="31" cy="24" r="15.5" fill="#facc15"/>
            <path d="M45 14 C52 23, 49 38, 37 44 C28 47, 19 43, 16 37 C25 42, 40 38, 45 26 Z" fill="#854d0e" opacity="0.75"/>
            <polygon points="34,18 41,23 38,31 30,31 27,23" fill="#78350f" stroke="#fef08a" stroke-width="1.2"/>
            <polygon points="34,8 39,11 37,14 31,14 29,11" fill="#78350f"/>
            <polygon points="16,21 20,17 23,22 20,27 15,25" fill="#78350f"/>
            <polygon points="52,21 48,17 45,22 48,27 53,25" fill="#78350f"/>
            <line x1="34" y1="18" x2="34" y2="13" stroke="#fef08a" stroke-width="1.4"/>
            <line x1="41" y1="23" x2="46" y2="21" stroke="#fef08a" stroke-width="1.4"/>
            <line x1="27" y1="23" x2="22" y2="21" stroke="#fef08a" stroke-width="1.4"/>
            <ellipse cx="25" cy="16" rx="5" ry="2.5" transform="rotate(-25 25 16)" fill="#ffffff"/>
        </svg>`,

        golden_boot: `<svg width="60" height="72" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="24" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M10 68 H58 L60 76 H8 L10 68 Z" fill="#0c0a09"/>
            <path d="M12 56 H56 L58 68 H10 L12 56 Z" fill="#1c1917" stroke="#eab308" stroke-width="1.4"/>
            <path d="M12 56 H34 V68 H10 L12 56 Z" fill="#292524"/>
            <rect x="19" y="60" width="30" height="5" rx="1" fill="#facc15"/>
            <path d="M13 47 L19 17 H34 L40 32 L56 37 C61 39, 60 47, 54 48 H13 Z" fill="#ca8a04" stroke="#713f12" stroke-width="1.8"/>
            <path d="M13 47 L19 17 H30 L34 33 L13 47 Z" fill="#facc15"/>
            <path d="M23 26 L33 38 M28 24 L38 36" stroke="#713f12" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="35" y1="23" x2="39" y2="21" stroke="#ffffff" stroke-width="2"/>
            <line x1="37" y1="27" x2="41" y2="25" stroke="#ffffff" stroke-width="2"/>
            <rect x="13" y="48" width="43" height="4" rx="1" fill="#78350f"/>
            <rect x="17" y="52" width="4" height="4" fill="#fde047"/>
            <rect x="26" y="52" width="4" height="4" fill="#fde047"/>
            <rect x="43" y="52" width="4" height="4" fill="#fde047"/>
            <rect x="51" y="52" width="4" height="4" fill="#fde047"/>
        </svg>`,

        loyalty_shield: `<svg width="60" height="72" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M12 68 H56 L58 76 H10 L12 68 Z" fill="#0c0a09"/>
            <path d="M15 57 H53 L56 68 H12 L15 57 Z" fill="#1c1917" stroke="#eab308" stroke-width="1.4"/>
            <rect x="21" y="60" width="26" height="5" rx="1" fill="#eab308"/>
            <path d="M34 7 L11 15 V34 C11 48, 21 55, 34 60 C47 55, 57 48, 57 34 V15 L34 7 Z" fill="#ca8a04" stroke="#713f12" stroke-width="2"/>
            <path d="M34 7 L11 15 V34 C11 48, 21 55, 34 60 V7 Z" fill="#facc15"/>
            <path d="M34 12 L16 18 V33 C16 44, 24 49, 34 54 C44 49, 52 44, 52 33 V18 L34 12 Z" fill="#0f291a" stroke="#fef08a" stroke-width="1.5"/>
            <path d="M34 12 L16 18 V33 C16 44, 24 49, 34 54 V12 Z" fill="#164e2e"/>
            <polygon points="34 19 37.5 28 47 28 39.5 33.5 42 43 34 37.5 26 43 28.5 33.5 21 28 30.5 28" fill="#facc15" stroke="#713f12" stroke-width="1.2"/>
            <circle cx="34" cy="10" r="1.5" fill="#713f12"/>
            <circle cx="14" cy="17" r="1.5" fill="#713f12"/>
            <circle cx="54" cy="17" r="1.5" fill="#713f12"/>
        </svg>`,

        golden_boy_star: `<svg width="60" height="72" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M13 68 H55 L57 76 H11 L13 68 Z" fill="#0c0a09"/>
            <path d="M16 56 H52 L55 68 H13 L16 56 Z" fill="#1c1917" stroke="#eab308" stroke-width="1.4"/>
            <rect x="21" y="60" width="26" height="5" rx="1" fill="#eab308"/>
            <path d="M24 56 C21 43, 26 36, 34 31 C42 36, 47 43, 44 56 Z" fill="#ca8a04" stroke="#713f12" stroke-width="1.5"/>
            <path d="M24 56 C21 43, 26 36, 34 31 V56 Z" fill="#facc15"/>
            <polygon points="34 5 40 19 56 20 44 30 48 46 34 37 20 46 24 30 12 20 28 19" fill="#ca8a04" stroke="#713f12" stroke-width="1.8"/>
            <polygon points="34 5 28 19 12 20 24 30 20 46 34 37" fill="#fde047"/>
            <polygon points="34 13 37 21 45 22 39 27 41 35 34 30 27 35 29 27 23 22 31 21" fill="#ffffff" opacity="0.45"/>
        </svg>`,

        playmaker: `<svg width="60" height="72" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M12 68 H56 L58 76 H10 L12 68 Z" fill="#0c0a09"/>
            <path d="M15 56 H53 L56 68 H12 L15 56 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.4"/>
            <rect x="20" y="60" width="28" height="5" rx="1" fill="#38bdf8"/>
            <path d="M13 27 C13 12, 26 12, 34 25 C42 12, 55 12, 55 27 C55 42, 41 50, 34 56 C27 50, 13 42, 13 27 Z" fill="#0369a1" stroke="#eab308" stroke-width="2"/>
            <path d="M13 27 C13 12, 26 12, 34 25 V56 C27 50, 13 42, 13 27 Z" fill="#0284c7"/>
            <circle cx="34" cy="29" r="11.5" fill="#facc15" stroke="#ffffff" stroke-width="1.8"/>
            <polygon points="34 22 39 26 37 32 31 32 29 26" fill="#0f172a"/>
        </svg>`,

        dream_jersey_frame: `<svg width="60" height="72" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="24" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M12 68 H56 L58 76 H10 L12 68 Z" fill="#1c1917"/>
            <rect x="11" y="9" width="46" height="59" rx="3" fill="#0f291a" stroke="#eab308" stroke-width="3"/>
            <rect x="14" y="12" width="40" height="53" stroke="#fef08a" stroke-width="0.8"/>
            <path d="M23 22 L28 19 H40 L45 22 L51 31 L44 34 L42 28 V54 H26 V28 L24 34 L17 31 L23 22 Z" fill="#facc15" stroke="#ffffff" stroke-width="1.5"/>
            <text x="34" y="44" text-anchor="middle" fill="#07190e" font-size="13" font-weight="900">10</text>
            <path d="M16 14 L30 62" stroke="#ffffff" stroke-width="4" opacity="0.12"/>
        </svg>`
    };

    let selectedCollectedIndex = 0;
    let museumSubView = 'shelves';

    window.switchMuseumSubView = function (view) {
        museumSubView = view;
        window.renderCareerAndTrophiesPanel();
    };

    function buildEarnedTrophyCollection() {
        if (typeof gameData === 'undefined' || !gameData) return [];
        const earned = [];

        (gameData.trophies || []).forEach((t) => {
            let svg = PHYSICAL_TROPHY_MODELS.league_cup;
            if (t.type === 'boot') svg = PHYSICAL_TROPHY_MODELS.golden_boot;
            else if (t.type === 'playmaker') svg = PHYSICAL_TROPHY_MODELS.playmaker;

            earned.push({
                title: t.title,
                sub: `${t.season} • ${t.club}`,
                desc: `${t.club} formasıyla ${t.season} döneminde kazanılan resmi kupa/ödül.`,
                svg
            });
        });

        if (gameData.allTimeGoals >= 1) {
            earned.push({
                title: "İlk Profesyonel Gol Hatıra Topu",
                sub: `${gameData.club.name} Kariyer Başlangıcı`,
                desc: "Profesyonel futbol kariyerinde ağları havalandırdığın ilk resmi maç topu.",
                svg: PHYSICAL_TROPHY_MODELS.classic_match_ball
            });
        }
        if (gameData.allTimeGoals >= 25) {
            earned.push({
                title: "25 Gol Kulübü Altın Topu",
                sub: `Toplam ${gameData.allTimeGoals} Kariyer Golü`,
                desc: "Kariyerinde 25 gol barajını aşan keskin nişancılara verilen altın top.",
                svg: PHYSICAL_TROPHY_MODELS.golden_ball
            });
        }
        if (gameData.allTimeGoals >= 50) {
            earned.push({
                title: "50 Gol Efsaneler Altın Kramponu",
                sub: `Toplam ${gameData.allTimeGoals} Kariyer Golü`,
                desc: "50 gol barajını deviren elit golcülere takdim edilen altın krampon heykeli.",
                svg: PHYSICAL_TROPHY_MODELS.golden_boot
            });
        }
        if (gameData.allTimeAssists >= 15) {
            earned.push({
                title: "Usta Maestro Ödülü (15+ Asist)",
                sub: `Toplam ${gameData.allTimeAssists} Kariyer Asisti`,
                desc: "Kariyerinde 15 asist barajını geçen oyun kuruculara verilen kristal ödül.",
                svg: PHYSICAL_TROPHY_MODELS.playmaker
            });
        }
        if (gameData.allTimeMatches >= 50) {
            earned.push({
                title: "50 Maç Kulüp Sadakat Kalkanı",
                sub: `${gameData.allTimeMatches} Resmi Maç`,
                desc: "Sahada 50 resmi maçı geride bırakan istikrarlı profesyonellerin şeref kalkanı.",
                svg: PHYSICAL_TROPHY_MODELS.loyalty_shield
            });
        }
        if (gameData.allTimeMatches >= 100) {
            earned.push({
                title: "100 Maç Centurion Şeref Kalkanı",
                sub: `${gameData.allTimeMatches} Resmi Maç`,
                desc: "100 resmi maçta forma giyen kulüp efsanelerine verilen altın kalkan.",
                svg: PHYSICAL_TROPHY_MODELS.loyalty_shield
            });
        }
        if (getPlayerOvr(gameData.stats) >= 68) {
            earned.push({
                title: "Golden Boy (Harika Çocuk) Heykeli",
                sub: `${getPlayerOvr(gameData.stats)} OVR Yetenek Seviyesi`,
                desc: "68+ OVR barajını aşarak ligin en parlak yıldızları arasına girdiğin ödül.",
                svg: PHYSICAL_TROPHY_MODELS.golden_boy_star
            });
        }
        if (getPlayerOvr(gameData.stats) >= 78 && (gameData.allTimeGoals + gameData.allTimeAssists) >= 30) {
            earned.push({
                title: "Ballon d'Or (Yılın Futbolcusu)",
                sub: `${getPlayerOvr(gameData.stats)} OVR • Dünya Yıldızı`,
                desc: "Üstün yetenek ve skora katkı ile kazanılan dünyanın en prestijli bireysel ödülü.",
                svg: PHYSICAL_TROPHY_MODELS.golden_ball
            });
        }
        if (gameData.club.name === gameData.dreamClub) {
            earned.push({
                title: `${gameData.dreamClub} Özel İmzalı Forma Vitrini`,
                sub: "Kariyer Hedefi Tamamlandı",
                desc: `Çocukluk hayalin olan ${gameData.dreamClub} ile sözleşme imzalama başarısı.`,
                svg: PHYSICAL_TROPHY_MODELS.dream_jersey_frame
            });
        }

        return earned;
    }

    window.selectCollectedTrophy = function (idx) {
        selectedCollectedIndex = idx;
        window.renderCareerAndTrophiesPanel();
    };

    window.renderCareerAndTrophiesPanel = function () {
        if (typeof gameData === 'undefined' || !gameData) return;
        ensureCareerFields(gameData);

        const careerTab = document.getElementById('tab-content-career');
        if (!careerTab) return;

        const collection = buildEarnedTrophyCollection();
        if (selectedCollectedIndex >= collection.length) selectedCollectedIndex = 0;
        const activeTrophy = collection[selectedCollectedIndex] || null;

        const shelves = [];
        for (let i = 0; i < Math.max(8, collection.length); i += 4) {
            shelves.push(collection.slice(i, i + 4));
        }

        const shelvesHTML = shelves.slice(0, 2).map((shelfItems, sIdx) => {
            const itemsHTML = shelfItems.map((item, iOffset) => {
                const globalIdx = sIdx * 4 + iOffset;
                const isSelected = globalIdx === selectedCollectedIndex;
                return `
                    <button type="button" onclick="window.selectCollectedTrophy(${globalIdx})" class="trophy-on-shelf relative flex flex-col items-center justify-end px-1 pt-1 focus:outline-none ${isSelected ? 'trophy-selected-glow z-30' : 'z-20'}">
                        <div class="absolute -top-2 w-14 h-18 bg-gradient-to-b ${isSelected ? 'from-amber-300/45' : 'from-amber-200/15'} to-transparent pointer-events-none" style="clip-path: polygon(28% 0%, 72% 0%, 100% 100%, 0% 100%);"></div>
                        ${item.svg}
                    </button>
                `;
            }).join('');

            const emptyHint = shelfItems.length === 0
                ? `<div class="col-span-4 h-14 flex items-center justify-center text-[11px] font-bold text-amber-200/25 italic">Yeni ödüller kazandıkça bu rafa dizilecek...</div>`
                : '';

            return `
                <div class="relative pt-1">
                    <div class="grid grid-cols-4 items-end justify-items-center min-h-[68px] px-3 relative z-20">
                        ${itemsHTML}
                        ${emptyHint}
                    </div>
                    <svg class="w-full h-5 block drop-shadow-[0_8px_10px_rgba(0,0,0,0.85)] relative z-10" viewBox="0 0 360 24" preserveAspectRatio="none">
                        <polygon points="16,0 344,0 360,13 0,13" fill="#92400e"/>
                        <polygon points="16,0 344,0 352,6 8,6" fill="#78350f"/>
                        <rect x="0" y="13" width="360" height="8" fill="#451a03" stroke="#d97706" stroke-width="0.8"/>
                        <line x1="0" y1="15" x2="360" y2="15" stroke="#fde047" stroke-width="0.6" opacity="0.6"/>
                        <rect x="0" y="21" width="360" height="3" fill="#090502"/>
                    </svg>
                </div>
            `;
        }).join('');

        const sorted = [...gameData.standings].sort((a, b) => b.pts - a.pts || (b.ag - b.yg) - (a.ag - a.yg));
        const currentRank = sorted.findIndex(t => t.isPlayerClub) + 1;

        const historyRowsHTML = [
            `<tr class="bg-[#d9f99d] text-[#0f291a] font-black">
                <td class="py-2 pl-3">S${gameData.season} <span class="text-[8px] px-1.5 py-0.5 rounded bg-[#0f291a] text-[#eab308] ml-1">AKTİF</span></td>
                <td class="py-2 flex items-center gap-1.5">${generateClubCrestSVG(gameData.club.c1, gameData.club.c2, 14)} <span>${gameData.club.name}</span></td>
                <td class="py-2 text-center">${gameData.matches}</td>
                <td class="py-2 text-center text-emerald-700">${gameData.goals}</td>
                <td class="py-2 text-center text-blue-700">${gameData.assists}</td>
                <td class="py-2 pr-3 text-right">${currentRank}. Sıra</td>
            </tr>`,
            ...[...gameData.careerHistory].reverse().map(h => `
                <tr class="hover:bg-white/50">
                    <td class="py-2 pl-3">Sezon ${h.season}</td>
                    <td class="py-2 flex items-center gap-1.5">${generateClubCrestSVG(h.c1, h.c2, 14)} <span>${h.clubName}</span></td>
                    <td class="py-2 text-center">${h.matches}</td>
                    <td class="py-2 text-center text-emerald-700">${h.goals}</td>
                    <td class="py-2 text-center text-blue-700">${h.assists}</td>
                    <td class="py-2 pr-3 text-right">${h.rank}. Sıra</td>
                </tr>
            `)
        ].join('');

        careerTab.innerHTML = `
            <div class="board-panel overflow-hidden flex-shrink-0">
                <div class="board-header py-1.5 px-3 flex justify-between items-center">
                    <span class="font-sport text-sm font-black uppercase tracking-wider text-[#eab308]">ŞEREF SALONU • YAŞ ${gameData.age}</span>
                    <div class="flex gap-1">
                        <button type="button" onclick="window.switchMuseumSubView('shelves')" class="px-2 py-0.5 rounded font-sport text-[11px] font-black uppercase ${museumSubView === 'shelves' ? 'bg-[#eab308] text-[#07190e]' : 'bg-white/10 text-white'}">
                            🏆 VİTRİN (${collection.length})
                        </button>
                        <button type="button" onclick="window.switchMuseumSubView('history')" class="px-2 py-0.5 rounded font-sport text-[11px] font-black uppercase ${museumSubView === 'history' ? 'bg-[#eab308] text-[#07190e]' : 'bg-white/10 text-white'}">
                            📋 SEZON GEÇMİŞİ
                        </button>
                    </div>
                </div>
                <div class="p-2 grid grid-cols-4 gap-1.5 text-center bg-[#f5f1e4]">
                    <div class="bg-[#e6e0cc] p-1 rounded border border-[#143321]">
                        <span class="text-[8px] text-slate-600 font-black block uppercase">TOPLAM MAÇ</span>
                        <span class="font-led font-bold text-base text-[#0f291a]">${gameData.allTimeMatches}</span>
                    </div>
                    <div class="bg-[#e6e0cc] p-1 rounded border border-[#143321]">
                        <span class="text-[8px] text-slate-600 font-black block uppercase">TOPLAM GOL</span>
                        <span class="font-led font-bold text-base text-emerald-800">${gameData.allTimeGoals}</span>
                    </div>
                    <div class="bg-[#e6e0cc] p-1 rounded border border-[#143321]">
                        <span class="text-[8px] text-slate-600 font-black block uppercase">TOPLAM ASİST</span>
                        <span class="font-led font-bold text-base text-blue-800">${gameData.allTimeAssists}</span>
                    </div>
                    <div class="bg-[#e6e0cc] p-1 rounded border border-[#143321]">
                        <span class="text-[8px] text-slate-600 font-black block uppercase">KOLEKSİYON</span>
                        <span class="font-led font-bold text-base text-amber-700">${collection.length} ESER</span>
                    </div>
                </div>
            </div>

            ${museumSubView === 'shelves' ? `
            <div class="flex-1 min-h-0 rounded-xl border-4 border-[#3f1d0b] bg-gradient-to-b from-[#1a0f08] via-[#26160c] to-[#120a05] shadow-2xl overflow-hidden flex flex-col justify-between">
                <div class="bg-[#451a03] px-3 py-1 border-b-2 border-[#eab308]/60 flex justify-between items-center text-[10px] font-black text-amber-200 uppercase">
                    <span>MÜZE RAFLARI (DETAYINI GÖRMEK İÇİN KUPAYA DOKUN)</span>
                    <span class="text-[#eab308]">${collection.length} ESER</span>
                </div>

                <div class="px-3 py-1 space-y-2 flex-1 flex flex-col justify-center">
                    ${shelvesHTML}
                </div>

                ${activeTrophy ? `
                <div class="m-2 mt-0 p-2.5 rounded-lg bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fef3c7] border-2 border-[#78350f] text-[#292524] flex items-center gap-3 shadow-inner">
                    <div class="w-14 h-16 rounded-lg bg-[#1c1917] border-2 border-[#78350f] flex items-center justify-center shrink-0 p-1 shadow-md">
                        ${activeTrophy.svg}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-center gap-1">
                            <h4 class="font-sport text-base font-black uppercase text-[#451a03] truncate">${activeTrophy.title}</h4>
                            <span class="text-[9px] font-black px-2 py-0.5 rounded bg-[#16a34a] text-white shrink-0">MÜZEDE</span>
                        </div>
                        <p class="text-[10px] font-black text-amber-900">${activeTrophy.sub}</p>
                        <p class="text-[10px] font-bold text-[#57534e] leading-tight mt-0.5">${activeTrophy.desc}</p>
                    </div>
                </div>
                ` : `
                <div class="m-2 mt-0 p-2.5 rounded-lg bg-[#292524] border border-amber-500/30 text-center text-xs font-bold text-amber-200">
                    Henüz müzende kupa yok! İlk golünü attığında veya sezon sonu ödül kazandığında raflara dizilmeye başlayacak.
                </div>
                `}
            </div>
            ` : `
            <div class="board-panel overflow-hidden flex-1 min-h-0 flex flex-col">
                <div class="board-header py-1.5 px-3 flex justify-between items-center">
                    <span class="font-sport text-sm font-black uppercase tracking-wider text-white">SEZON SEZON KARİYER GEÇMİŞİ</span>
                    <button type="button" onclick="window.switchMuseumSubView('shelves')" class="text-[10px] font-black text-[#eab308] underline">← Raflara Dön</button>
                </div>
                <div class="overflow-y-auto flex-1 bg-[#f5f1e4]">
                    <table class="w-full text-left border-collapse text-[11px] text-slate-800">
                        <thead>
                            <tr class="border-b-2 border-[#0f291a] bg-[#e2dec9] font-black">
                                <th class="py-2 pl-3">SEZON</th>
                                <th class="py-2">KULÜP</th>
                                <th class="py-2 text-center">MAÇ</th>
                                <th class="py-2 text-center">GOL</th>
                                <th class="py-2 text-center">ASİST</th>
                                <th class="py-2 pr-3 text-right">SIRA</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-300 font-bold">
                            ${historyRowsHTML}
                        </tbody>
                    </table>
                </div>
            </div>
            `}
        `;
    };

    // =====================================================================
    // 5. HIZLI SİMÜLASYONDA RASTGELE YEDEK GİRİŞ DAKİKASI & GOL KAYDI
    // =====================================================================
    window.lastQuickSimPlayerGoals = 0;

    const _origResolveQuickSim = window.resolveQuickSimWheel;
    window.resolveQuickSimWheel = function (step) {
        const beforeGoals = gameData ? gameData.goals : 0;
        if (_origResolveQuickSim) _origResolveQuickSim(step);
        if (step === 2 && gameData) {
            window.lastQuickSimPlayerGoals = Math.max(0, gameData.goals - beforeGoals);
        }
    };

    window.setupQuickSimStep2 = function () {
        simWheelRot = 0;
        const starter = isPlayerStarter() && gameData.energy >= 32;
        const shootFactor = Math.max(4, (gameData.stats.shoot - 50) * 1.15);
        const passFactor = Math.max(4, (gameData.stats.pass - 50) * 1.15);
        const oppDefense = (activeOpponent.power - 65) * 0.8;

        const randomSubMin = 48 + Math.floor(Math.random() * 19) * 2;
        const subTimeFactor = starter ? 1.0 : Math.max(0.35, (92 - randomSubMin) / 55);

        const resultMultiplier = simOutcomeResult === 'W' ? 1.25 : (simOutcomeResult === 'D' ? 0.9 : 0.45);
        const promiseBoost = gameData.nextMatchGoalPromise ? 1.25 : 1.0;

        let goalW = Math.max(6, (shootFactor - oppDefense * 0.4) * subTimeFactor * resultMultiplier * promiseBoost);
        let assistW = Math.max(6, (passFactor - oppDefense * 0.3) * subTimeFactor * resultMultiplier);
        let braceW = Math.max(1.5, (gameData.stats.shoot - 58) * 0.38 * (starter ? 1 : subTimeFactor * 0.6) * (simOutcomeResult === 'L' ? 0.25 : 1) * promiseBoost);
        let noneW = Math.max(28, 100 - goalW - assistW - braceW);

        simSlices = [
            { id: 'goal', label: '1 GOL', weight: goalW, color: '#16a34a' },
            { id: 'assist', label: '1 ASİST', weight: assistW, color: '#2563eb' },
            { id: 'brace', label: '2 GOL BİRDEN', weight: braceW, color: '#d97706' },
            { id: 'none', label: 'KATKI YOK', weight: noneW, color: '#64748b' }
        ];

        document.getElementById('sim-step-badge').innerText = "2. ÇARK: OYUNCU SKOR KATKISI";
        document.getElementById('sim-desc-text').innerText = starter
            ? "Maça İlk 11'de başladın! 90 dakikalık skor katkısı çarkını çevir."
            : `Maça ${randomSubMin}. dakikada yedekten dahil oldun! Kalan ${90 - randomSubMin} dakikadaki skor katkısı çarkını çevir.`;
        document.getElementById('btn-Next-sim-2').classList.add('hidden');
        document.getElementById('btn-spin-sim-2').classList.remove('hidden');
        drawSimWheel();
    };

    // =====================================================================
    // 6. SEYREKLEŞTİRİLMİŞ OLAY KARTLARI & EKSİKSİZ SPOR GAZETESİ SİSTEMİ
    // =====================================================================
    let lastEventWeekNumber = -10;
    const _rawTriggerEventCard = window.triggerRandomWeeklyEventCard;

    window.triggerRandomWeeklyEventCard = function () {
        if (typeof gameData === 'undefined' || !gameData) return;
        const currentTotalWeeks = (gameData.season - 1) * 34 + gameData.week;
        if (currentTotalWeeks - lastEventWeekNumber < 4) return;
        if (Math.random() > 0.26) return;

        lastEventWeekNumber = currentTotalWeeks;
        if (_rawTriggerEventCard) _rawTriggerEventCard();
    };

    const NEWSPAPER_SVG_PHOTOS = {
        star_goal: `<svg width="150" height="105" viewBox="0 0 150 105" fill="none"><rect width="150" height="105" fill="#195c31"/><rect x="20" y="15" width="110" height="50" stroke="#ffffff" stroke-width="3" fill="rgba(255,255,255,0.1)"/><circle cx="95" cy="36" r="10" fill="#eab308" stroke="#1c1917" stroke-width="2"/><path d="M35 80 L90 40" stroke="#fde047" stroke-width="3" stroke-dasharray="4 3"/><circle cx="45" cy="70" r="11" fill="#ffffff" stroke="#1c1917" stroke-width="2"/><path d="M28 105 C28 84, 62 84, 62 105" fill="#dc2626" stroke="#1c1917" stroke-width="2"/></svg>`,
        bench_crisis: `<svg width="150" height="105" viewBox="0 0 150 105" fill="none"><rect width="150" height="105" fill="#334155"/><rect x="15" y="65" width="120" height="10" fill="#78350f" stroke="#1c1917" stroke-width="2"/><circle cx="55" cy="45" r="10" fill="#f1c27d" stroke="#1c1917" stroke-width="2"/><path d="M40 65 C40 52, 70 52, 70 65" fill="#1e293b" stroke="#1c1917" stroke-width="2"/><text x="105" y="50" fill="#eab308" font-size="22" font-weight="900">?</text></svg>`,
        league_leader: `<svg width="150" height="105" viewBox="0 0 150 105" fill="none"><rect width="150" height="105" fill="#143321"/><polygon points="75 15 92 48 128 52 100 76 108 102 75 86 42 102 50 76 22 52 58 48" fill="#eab308" stroke="#ffffff" stroke-width="2"/><text x="75" y="68" text-anchor="middle" fill="#07190e" font-size="18" font-weight="900">#1</text></svg>`,
        scandal_paparazzi: `<svg width="150" height="105" viewBox="0 0 150 105" fill="none"><rect width="150" height="105" fill="#1e1b4b"/><polygon points="75 10 90 40 125 35 98 60 115 92 75 74 35 92 52 60 25 35 60 40" fill="#fef08a" opacity="0.85"/><rect x="52" y="42" width="46" height="30" rx="4" fill="#1c1917" stroke="#ffffff" stroke-width="2"/><circle cx="75" cy="57" r="9" fill="#38bdf8" stroke="#ffffff" stroke-width="2"/></svg>`,
        shock_upset: `<svg width="150" height="105" viewBox="0 0 150 105" fill="none"><rect width="150" height="105" fill="#7f1d1d"/><path d="M82 12 L48 56 H76 L66 94 L104 48 H76 L82 12 Z" fill="#eab308" stroke="#ffffff" stroke-width="2"/></svg>`,
        transfer_whisper: `<svg width="150" height="105" viewBox="0 0 150 105" fill="none"><rect width="150" height="105" fill="#0f291a"/><rect x="28" y="22" width="94" height="60" rx="4" fill="#f5f1e4" stroke="#1c1917" stroke-width="2"/><line x1="40" y1="38" x2="90" y2="38" stroke="#1c1917" stroke-width="3"/><line x1="40" y1="50" x2="108" y2="50" stroke="#1c1917" stroke-width="2"/><path d="M85 68 L112 40" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/></svg>`
    };

    function ensureNewspaperModal() {
        if (document.getElementById('newspaper-frontpage-modal')) return;
        const appShell = document.getElementById('main-app-shell') || document.body;
        const wrap = document.createElement('div');
        wrap.id = 'newspaper-frontpage-modal';
        wrap.className = "hidden absolute inset-0 z-[75] bg-black/85 flex items-center justify-center p-3";
        wrap.innerHTML = `
            <div id="newspaper-sheet" class="newsprint-paper w-full max-w-[400px] p-3.5 rounded-sm newspaper-spin-in select-none">
                <div class="border-b-4 border-double border-[#1c1917] pb-1.5 mb-2 text-center">
                    <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-stone-600 border-b border-stone-400 pb-0.5 mb-1">
                        <span id="news-date-label">SEZON 1 • HAFTA 4</span>
                        <span>ULUSAL SPOR BASKISI</span>
                        <span>FİYAT: ₺15</span>
                    </div>
                    <h2 class="font-sport text-4xl font-black tracking-tight uppercase text-[#1c1917] leading-none">SPOR POSTASI</h2>
                    <div id="news-strapline" class="mt-1 bg-[#1c1917] text-[#f4efe4] text-[10px] font-black uppercase tracking-widest py-0.5 px-2 inline-block">
                        FLAŞ MANŞET • GÜNDEM ÖZEL
                    </div>
                </div>
                <h3 id="news-headline" class="font-sport text-2xl font-black uppercase text-center text-[#991b1b] leading-none mb-2 tracking-wide">
                    EMİRHAN KOÇ FIRTINASI!
                </h3>
                <div class="grid grid-cols-12 gap-2.5 items-start border-y-2 border-[#1c1917] py-2.5 my-1.5">
                    <div class="col-span-6 flex flex-col">
                        <div id="news-svg-frame" class="w-full border-2 border-[#1c1917] bg-stone-800 overflow-hidden flex items-center justify-center"></div>
                        <span id="news-photo-caption" class="text-[9px] font-bold italic text-stone-600 mt-1 leading-tight">
                            Foto: Muhabirimiz stadyumdan bildiriyor.
                        </span>
                    </div>
                    <div class="col-span-6 text-left space-y-1.5">
                        <div id="news-subhead" class="font-sport text-sm font-black uppercase text-[#1c1917] leading-tight border-b border-stone-400 pb-1">
                            TRİBÜNLER AYAKTA ALKIŞLADI
                        </div>
                        <p id="news-body-text" class="text-[11px] font-bold text-stone-800 leading-snug">
                            Haftanın en kritik mücadelesinde sahneye çıkan genç yıldız, performansıyla spor basınının gündemine oturdu.
                        </p>
                    </div>
                </div>
                <div class="bg-[#e7dfd1] border border-[#1c1917] p-2 mb-2.5 text-left">
                    <span class="text-[9px] font-black uppercase tracking-wider text-[#991b1b] block">LİG KULİSLERİ & KISA HABERLER</span>
                    <p id="news-side-ticker" class="text-[10px] font-extrabold text-stone-800 leading-tight mt-0.5"></p>
                </div>
                <button type="button" onclick="window.closeNewspaperModal()" class="w-full py-2.5 bg-[#1c1917] hover:bg-stone-800 text-[#f4efe4] font-sport text-base font-black uppercase tracking-widest transition">
                    GAZETEYİ KAPAT VE DEVAM ET →
                </button>
            </div>
        `;
        appShell.appendChild(wrap);
    }

    window.closeNewspaperModal = function () {
        const modal = document.getElementById('newspaper-frontpage-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.showNewspaperEdition = function (article) {
        ensureNewspaperModal();
        const modal = document.getElementById('newspaper-frontpage-modal');
        const sheet = document.getElementById('newspaper-sheet');

        document.getElementById('news-date-label').innerText = `SEZON ${gameData.season} • ${gameData.week}. HAFTA BASKISI`;
        document.getElementById('news-strapline').innerText = article.strapline;
        document.getElementById('news-headline').innerText = article.headline;
        document.getElementById('news-subhead').innerText = article.subhead;
        document.getElementById('news-body-text').innerText = article.body;
        document.getElementById('news-photo-caption').innerText = article.caption;
        document.getElementById('news-svg-frame').innerHTML = article.svg;
        document.getElementById('news-side-ticker').innerText = article.sideTicker;

        sheet.classList.remove('newspaper-spin-in');
        void sheet.offsetWidth;
        sheet.classList.add('newspaper-spin-in');
        playNewspaperSound();
        modal.classList.remove('hidden');
    };

    function evaluateAndTriggerNewspaper(contextType, extraData = {}) {
        if (typeof gameData === 'undefined' || !gameData) return;
        const sorted = [...gameData.standings].sort((a, b) => b.pts - a.pts || (b.ag - b.yg) - (a.ag - a.yg));
        const leader = sorted[0];
        const second = sorted[1];
        const bottom = sorted[sorted.length - 1];
        const sideTicker = `Zirve: ${leader.name} (${leader.pts}P) lider, ${second.name} (${second.pts}P) takipte. Son sıra: ${bottom.name} (${bottom.pts}P).`;

        let article = null;
        if (contextType === 'match' && extraData.goals >= 2) {
            article = {
                strapline: `${gameData.club.name.toUpperCase()} CEPHESİNDE BAYRAM`,
                headline: `${gameData.name.toUpperCase()} ŞOV YAPTI!`,
                subhead: `${extraData.goals} GOLLE RAKİBİ TEK BAŞINA YIKTI`,
                body: `${gameData.club.name} formasıyla devleşen ${gameData.name}, attığı ${extraData.goals} golle haftanın oyuncusu seçildi.`,
                caption: `Foto: ${gameData.name} gol sevincini tribünlerle paylaşırken.`,
                svg: NEWSPAPER_SVG_PHOTOS.star_goal,
                sideTicker
            };
        } else if (contextType === 'match' && extraData.rating <= 5.7 && Math.random() < 0.35) {
            article = {
                strapline: "SPOR YAZARLARI ELEŞTİRDİ",
                headline: `${gameData.name.toUpperCase()} KAYIPLARDA!`,
                subhead: "BEKLENTİLERİN ALTINDA KALDI",
                body: `${gameData.club.name} taraftarlarının çok şey beklediği ${gameData.name}, bu haftaki etkisiz oyunuyla hayal kırıklığı yarattı.`,
                caption: `Foto: ${gameData.name} maç sonunda soyunma odasına giderken.`,
                svg: NEWSPAPER_SVG_PHOTOS.bench_crisis,
                sideTicker
            };
        } else if (contextType === 'match' && Math.random() < 0.18) {
            const worldArticles = [
                {
                    strapline: `${gameData.leagueName.toUpperCase()} ZİRVE RAPORU`,
                    headline: `LİDER ${leader.name.toUpperCase()} DOLUDİZGİN!`,
                    subhead: `${leader.pts} PUANLA ŞAMPİYONLUĞA KOŞUYORLAR`,
                    body: `Ligde ${gameData.week}. hafta geride kalırken ${leader.name} topladığı ${leader.pts} puanla zirvedeki yerini korudu.`,
                    caption: `Foto: ${leader.name} zirve yarışında hata yapmıyor.`,
                    svg: NEWSPAPER_SVG_PHOTOS.league_leader,
                    sideTicker
                },
                {
                    strapline: "DÜŞME HATTINDA DEPREM",
                    headline: `${bottom.name.toUpperCase()} CEPHESİNDE KRİZ!`,
                    subhead: "TARAFTARLAR YÖNETİMİ İSTİFAYA ÇAĞIRDI",
                    body: `Ligde sadece ${bottom.pts} puan toplayabilen ve son sıraya demir atan ${bottom.name}'da teknik direktörün koltuğu sallantıda!`,
                    caption: `Foto: ${bottom.name} kulübesinde gergin anlar.`,
                    svg: NEWSPAPER_SVG_PHOTOS.shock_upset,
                    sideTicker
                }
            ];
            article = worldArticles[Math.floor(Math.random() * worldArticles.length)];
        }

        if (article) {
            setTimeout(() => {
                const evModal = document.getElementById('event-decision-modal');
                if (evModal && !evModal.classList.contains('hidden')) return;
                window.showNewspaperEdition(article);
            }, 450);
        }
    }

    const _baseFinishMatch = window.finishMatchAndSave;
    window.finishMatchAndSave = function (fromQuickSim = false) {
        const lastG = fromQuickSim ? (window.lastQuickSimPlayerGoals || 0) : (typeof mGoals !== 'undefined' ? mGoals : 0);
        window.lastQuickSimPlayerGoals = 0;
        const lastRat = typeof mRating !== 'undefined' ? mRating : (gameData.lastRating || 6.4);
        const lastH = typeof hScore !== 'undefined' ? hScore : 0;
        const lastA = typeof aScore !== 'undefined' ? aScore : 0;

        if (_baseFinishMatch) _baseFinishMatch(fromQuickSim);

        evaluateAndTriggerNewspaper('match', {
            goals: lastG,
            rating: gameData.lastRating || lastRat,
            hScore: lastH,
            aScore: lastA
        });
    };

    if (typeof gameData !== 'undefined' && gameData) {
        window.renderCareerAndTrophiesPanel();
    }
})();
// =========================================================================
// ui_stage2.js - TAM KAPSAMLI GÜNCELLEME
// 1. Yazısız, Doğrudan Raf Üstüne Oturan 8 Tam Gerçekçi 3D Kupa/Ödül Modeli
// 2. Gerçekçi Mekanik Çark Mandal Sesi (Tüm Çarklarda Hıza Duyarlı Tıkırtı)
// 3. Parmağınla Sürekli Yönlendirilen Gerçekçi Dripling Slalom Antrenmanı
// =========================================================================
(function () {

    // =====================================================================
    // 0. STİL VE RAF OTURUM TANIMLARI
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
        #training-minigame-modal > .board-panel {
            max-width: 432px !important;
        }
        #trainingMinigameCanvas {
            height: 450px !important;
        }
    `;
    document.head.appendChild(styleEl);

    function upgradeTrainingCanvasSize() {
        const cvs = document.getElementById('trainingMinigameCanvas');
        if (cvs) {
            cvs.width = 380;
            cvs.height = 460;
            cvs.className = "w-full h-[450px] rounded-lg border-2 border-[#143321] bg-[#1b5e34] touch-none cursor-pointer shadow-inner select-none";
        }
    }
    upgradeTrainingCanvasSize();

    // =====================================================================
    // 1. GERÇEKÇİ MEKANİK ÇARK MANDAL SESİ (TÜM ÇARKLARDA ÇALIŞIR)
    // =====================================================================
    let lastPegIndexMap = {};

    function playMechanicalWheelPegSound() {
        if (window.SFX && window.SFX.muted) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!window._gameAudioCtx) window._gameAudioCtx = new AudioCtx();
        const ctx = window._gameAudioCtx;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;

        // 1. Ahşap/Plastik Mandal Çarpma Gövdesi (Tok rezonans)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.028);

        oscGain.gain.setValueAtTime(0.28, now);
        oscGain.gain.exponentialRampToValueAtTime(0.005, now + 0.03);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.032);

        // 2. İbre Tıkırtı Darbesi (Kısa mekanik transient click)
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
        nGain.gain.setValueAtTime(0.22, now);
        nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.012);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(ctx.destination);
        noise.start(now);
    }

    // Çark ibresi her dilim mandalından geçtiğinde gerçekçi ses ve esneme üretir
    window.bounceWheelPointer = function (pointerId, currentAngle) {
        const ptr = document.getElementById(pointerId);
        // Çark çevresinde 16 mandal (peg) varsayarak açı değişimini takip et
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
    };

    // =====================================================================
    // 2. PARMAĞINLA SÜREKLİ YÖNLENDİRİLEN GERÇEKÇİ DRİPLİNG SLALOM
    // (Fırlatma yok! Basılı tutup yönlendirdiğin yöne futbolcu hızında top sürer)
    // =====================================================================
    let slalomLoopId = null;
    let slalomActive = false;
    let slalomState = 'playing';
    let slalomTimeLeft = 1500;
    let slalomActiveGate = 0;
    let slalomTotalGates = 4;
    let slalomPointer = { down: false, x: 190, y: 400 };
    let dribbleFootPhase = 0;
    let lastTouchSoundTime = 0;

    const slPlayer = { x: 190, y: 425, vx: 0, vy: 0, angle: -Math.PI / 2, r: 10 };
    const slBall = { x: 190, y: 412, r: 5.8 };
    let slGates = [];
    let slObstacles = [];

    function getPerspectiveBounds(y, W, H) {
        const t = Math.max(0, Math.min(1, (H - y) / (H - 30)));
        const margin = 16 + t * 44;
        const scale = 1.05 - t * 0.28;
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
        upgradeTrainingCanvasSize();
        slPlayer.x = 190; slPlayer.y = 426; slPlayer.vx = 0; slPlayer.vy = 0; slPlayer.angle = -Math.PI / 2;
        slBall.x = 190; slBall.y = 413;
        slalomActiveGate = 0;
        dribbleFootPhase = 0;

        const gateCounts = [3, 4, 4, 5, 5];
        slalomTotalGates = gateCounts[Math.floor(Math.random() * gateCounts.length)];
        slalomTimeLeft = (16 + slalomTotalGates * 3) * 60;
        slalomState = 'playing';
        slalomPointer.down = false;

        slGates = [];
        slObstacles = [];

        const topY = 76;
        const botY = 362;
        const stepY = (botY - topY) / Math.max(1, slalomTotalGates - 1);

        let preferLeft = Math.random() < 0.5;
        for (let i = 0; i < slalomTotalGates; i++) {
            const gy = Math.round(botY - i * stepY);
            let gcx;
            if (i === slalomTotalGates - 1 && Math.random() < 0.4) {
                gcx = 165 + Math.random() * 50;
            } else {
                gcx = preferLeft ? (102 + Math.random() * 48) : (225 + Math.random() * 48);
                preferLeft = !preferLeft;
            }
            const gw = 68 + Math.random() * 12;
            slGates.push({ id: i + 1, y: gy, cx: gcx, w: gw, passed: false });

            if (i < slalomTotalGates - 1 && Math.random() < 0.7) {
                const midY = gy - stepY * 0.5;
                const obsX = 145 + Math.random() * 90;
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

        // 1. Perspektif Saha
        ctx.fillStyle = '#11381f';
        ctx.fillRect(0, 0, W, H);

        const stripeCount = 10;
        const fieldTop = 32, fieldBot = H - 14;
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
        ctx.strokeRect(W / 2 - 42, 12, 84, 20);
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(W / 2 - 42, 12, 84, 20);

        // 2. Dubalar ve Mankenler
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

        // 3. DOĞAL FUTBOLCU TOP SÜRME (DRİPLİNG) KONTROLÜ
        // Parmağını basılı tutup nereye götürürsen oyuncu sabit ve kontrollü bir koşu hızıyla (1.35 px/kare) oraya doğru top sürer!
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
            const dribbleRunSpeed = 1.32 + Math.max(0, (gameData ? gameData.stats.dribble : 60) - 55) * 0.012;

            if (slalomPointer.down) {
                const dx = slalomPointer.x - slPlayer.x;
                const dy = slalomPointer.y - slPlayer.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 8) {
                    const targetAngle = Math.atan2(dy, dx);
                    // Yumuşak dönüş açısı
                    let diffAngle = targetAngle - slPlayer.angle;
                    while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                    while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                    slPlayer.angle += diffAngle * 0.18;

                    const speed = Math.min(dribbleRunSpeed, dist * 0.045);
                    slPlayer.vx = Math.cos(slPlayer.angle) * speed;
                    slPlayer.vy = Math.sin(slPlayer.angle) * speed;

                    dribbleFootPhase += 0.14;
                } else {
                    slPlayer.vx *= 0.7;
                    slPlayer.vy *= 0.7;
                }
            } else {
                // Parmağı bıraktığın an karakter hemen yavaşlayıp durur
                slPlayer.vx *= 0.75;
                slPlayer.vy *= 0.75;
            }

            slPlayer.x += slPlayer.vx;
            slPlayer.y += slPlayer.vy;

            const curBounds = getPerspectiveBounds(slPlayer.y, W, H);
            slPlayer.x = Math.max(curBounds.left + 8, Math.min(curBounds.right - 8, slPlayer.x));
            slPlayer.y = Math.max(34, Math.min(H - 18, slPlayer.y));

            // Topun sağ-sol ayakla dürtülerek oyuncunun hemen önünde (11-15px) taşınması
            const leadDist = (12.5 + Math.sin(dribbleFootPhase * 2) * 3.2) * curBounds.scale;
            const footSideOffset = Math.cos(dribbleFootPhase) * 3.5 * curBounds.scale;
            const perpAngle = slPlayer.angle + Math.PI / 2;

            const targetBallX = slPlayer.x + Math.cos(slPlayer.angle) * leadDist + Math.cos(perpAngle) * footSideOffset;
            const targetBallY = slPlayer.y + Math.sin(slPlayer.angle) * leadDist + Math.sin(perpAngle) * footSideOffset;

            slBall.x += (targetBallX - slBall.x) * 0.45;
            slBall.y += (targetBallY - slBall.y) * 0.45;

            // Manken çarpışma kontrolü
            slObstacles.forEach(m => {
                if (Math.hypot(slPlayer.x - m.x, slPlayer.y - m.y) < 15 || Math.hypot(slBall.x - m.x, slBall.y - m.y) < 13) {
                    if (window.SFX) window.SFX.post();
                    slPlayer.x -= Math.cos(slPlayer.angle) * 10;
                    slPlayer.y -= Math.sin(slPlayer.angle) * 10;
                    document.getElementById('mg-modal-status').innerText = "MANKENE ÇARPTIN! Parmağınla etrafından dolaştır.";
                }
            });

            // Sıradaki Duba Kapısından Geçiş Kontrolü
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

        // Parmağın basılı olduğu yönü gösteren hafif kılavuz
        if (slalomPointer.down && slalomState === 'playing') {
            ctx.beginPath();
            ctx.arc(slalomPointer.x, slalomPointer.y, 10, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Oyuncu ve Ayağındaki Top Çizimi
        const pScale = getPerspectiveBounds(slPlayer.y, W, H).scale;
        ctx.beginPath();
        ctx.ellipse(slPlayer.x, slPlayer.y + 6 * pScale, 10 * pScale, 4.5 * pScale, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fill();

        // Oyuncu Omuzları (Yönüne göre döner)
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
        // Oyuncu Kafası
        ctx.beginPath();
        ctx.arc(0, 0, 6.5 * pScale, 0, Math.PI * 2);
        ctx.fillStyle = '#1c1917';
        ctx.fill();
        ctx.restore();

        // Top
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
        upgradeTrainingCanvasSize();
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
    // 3. YAZISIZ, DOĞRUDAN RAF ÜSTÜNDE DURAN 8 GERÇEKÇİ FİZİKSEL KUPA MODELİ
    // =====================================================================
    const PHYSICAL_TROPHY_MODELS = {
        // 1. LİG ŞAMPİYONLUĞU KUPASI (Krom/Altın Dev Kupa, Mermer Kaide, Şampiyonluk Kurdeleleri)
        league_cup: `<svg width="68" height="82" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="24" ry="4" fill="rgba(0,0,0,0.75)"/>
            <!-- 3 Katmanlı Mermer Kaide -->
            <path d="M12 68 H56 L58 76 H10 L12 68 Z" fill="#0c0a09" stroke="#57534e" stroke-width="1"/>
            <path d="M15 57 H53 L56 68 H12 L15 57 Z" fill="#1c1917" stroke="#eab308" stroke-width="1.2"/>
            <path d="M15 57 H34 V68 H12 L15 57 Z" fill="#292524"/>
            <rect x="20" y="60" width="28" height="5" rx="1" fill="#facc15" stroke="#713f12" stroke-width="0.8"/>
            <!-- Boğumlu Altın Boyun -->
            <path d="M27 43 H41 L45 57 H23 L27 43 Z" fill="#ca8a04" stroke="#713f12" stroke-width="1.2"/>
            <path d="M27 43 H34 V57 H23 L27 43 Z" fill="#facc15"/>
            <ellipse cx="34" cy="49" rx="9" ry="2.5" fill="#fde047" stroke="#713f12" stroke-width="1"/>
            <!-- Kırmızı/Yeşil Şampiyonluk Kurdeleleri -->
            <path d="M11 16 L5 31 L9 32 L14 18 Z" fill="#dc2626"/>
            <path d="M57 16 L63 31 L59 32 L54 18 Z" fill="#16a34a"/>
            <!-- Kupa Kulpları -->
            <path d="M18 14 C3 14, 3 34, 22 39" stroke="#fde047" stroke-width="4.5" stroke-linecap="round"/>
            <path d="M50 14 C65 14, 65 34, 46 39" stroke="#ca8a04" stroke-width="4.5" stroke-linecap="round"/>
            <!-- Ana Çanak Gövdesi -->
            <path d="M16 11 H52 C52 35, 44 45, 34 45 C24 45, 16 35, 16 11 Z" fill="#eab308" stroke="#713f12" stroke-width="1.5"/>
            <path d="M16 11 H34 V45 C24 45, 16 35, 16 11 Z" fill="#facc15"/>
            <ellipse cx="34" cy="11" rx="18" ry="4.5" fill="#78350f" stroke="#fef08a" stroke-width="1.5"/>
            <path d="M21 17 C21 29, 25 36, 29 40" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.8"/>
        </svg>`,

        // 2. İLK PROFESYONEL GOL HATIRA TOPU (Ahşap Kaide, Altın Pençe Ayaklar, 3D Dikişli Klasik Maç Topu)
        classic_match_ball: `<svg width="68" height="82" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M12 69 H56 L58 76 H10 L12 69 Z" fill="#291507"/>
            <path d="M15 57 H53 L56 69 H12 L15 57 Z" fill="#451a03" stroke="#d97706" stroke-width="1.2"/>
            <path d="M15 57 H34 V69 H12 L15 57 Z" fill="#78350f"/>
            <rect x="21" y="61" width="26" height="5" rx="1" fill="#facc15" stroke="#451a03" stroke-width="0.8"/>
            <!-- Altın Pençe Tutucular -->
            <path d="M21 57 L17 42 L25 47 L26 57 Z" fill="#facc15" stroke="#713f12" stroke-width="1"/>
            <path d="M47 57 L51 42 L43 47 L42 57 Z" fill="#ca8a04" stroke="#713f12" stroke-width="1"/>
            <path d="M31 57 L34 44 L37 57 Z" fill="#fde047" stroke="#713f12" stroke-width="1"/>
            <!-- 3D Küre Maç Topu -->
            <circle cx="34" cy="29" r="19.5" fill="#cbd5e1" stroke="#0f172a" stroke-width="2"/>
            <circle cx="31" cy="26" r="16.5" fill="#ffffff"/>
            <path d="M46 15 C53 24, 50 39, 38 46 C28 50, 19 46, 16 39 C26 45, 41 40, 46 28 Z" fill="#64748b" opacity="0.45"/>
            <!-- Beşgen Paneller ve Dikişler -->
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

        // 3. ALTIN TOP (BALLON D'OR & 25+ GOL ÖDÜLÜ - Pirit/Kaya Kaide Üzerinde Saf Altın Küre)
        golden_ball: `<svg width="68" height="82" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M13 68 H55 L57 76 H11 L13 68 Z" fill="#0c0a09"/>
            <!-- Kristal Kaya Kaide -->
            <polygon points="16,68 21,46 34,42 47,46 52,68" fill="#451a03" stroke="#eab308" stroke-width="1.4"/>
            <polygon points="16,68 21,46 34,42 34,68" fill="#78350f"/>
            <rect x="21" y="59" width="26" height="5.5" rx="1" fill="#facc15" stroke="#451a03" stroke-width="0.8"/>
            <!-- 3D Altın Küre -->
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

        // 4. ALTIN AYAKKABI (GOL KRALI & 50+ GOL - Siyah Mermer Kaide Üzerinde 3D Altın Krampon)
        golden_boot: `<svg width="68" height="82" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="24" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M10 68 H58 L60 76 H8 L10 68 Z" fill="#0c0a09"/>
            <path d="M12 56 H56 L58 68 H10 L12 56 Z" fill="#1c1917" stroke="#eab308" stroke-width="1.4"/>
            <path d="M12 56 H34 V68 H10 L12 56 Z" fill="#292524"/>
            <rect x="19" y="60" width="30" height="5" rx="1" fill="#facc15"/>
            <!-- Krampon Heykel Gövdesi -->
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

        // 5. KULÜP SADAKAT KALKANI (50+ & 100+ MAÇ - Ağır Zümrüt & Altın Şövalye Kalkanı)
        loyalty_shield: `<svg width="68" height="82" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M12 68 H56 L58 76 H10 L12 68 Z" fill="#0c0a09"/>
            <path d="M15 57 H53 L56 68 H12 L15 57 Z" fill="#1c1917" stroke="#eab308" stroke-width="1.4"/>
            <rect x="21" y="60" width="26" height="5" rx="1" fill="#eab308"/>
            <!-- Dış Altın Kalkan -->
            <path d="M34 7 L11 15 V34 C11 48, 21 55, 34 60 C47 55, 57 48, 57 34 V15 L34 7 Z" fill="#ca8a04" stroke="#713f12" stroke-width="2"/>
            <path d="M34 7 L11 15 V34 C11 48, 21 55, 34 60 V7 Z" fill="#facc15"/>
            <!-- İç Zümrüt Mine -->
            <path d="M34 12 L16 18 V33 C16 44, 24 49, 34 54 C44 49, 52 44, 52 33 V18 L34 12 Z" fill="#0f291a" stroke="#fef08a" stroke-width="1.5"/>
            <path d="M34 12 L16 18 V33 C16 44, 24 49, 34 54 V12 Z" fill="#164e2e"/>
            <!-- Kabartmalı Altın Yıldız & Perçinler -->
            <polygon points="34 19 37.5 28 47 28 39.5 33.5 42 43 34 37.5 26 43 28.5 33.5 21 28 30.5 28" fill="#facc15" stroke="#713f12" stroke-width="1.2"/>
            <circle cx="34" cy="10" r="1.5" fill="#713f12"/>
            <circle cx="14" cy="17" r="1.5" fill="#713f12"/>
            <circle cx="54" cy="17" r="1.5" fill="#713f12"/>
        </svg>`,

        // 6. GOLDEN BOY (HARİKA ÇOCUK - Mermer Kaide Üzerinde Yükselen 3D Kristal/Altın Yıldız Heykeli)
        golden_boy_star: `<svg width="68" height="82" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M13 68 H55 L57 76 H11 L13 68 Z" fill="#0c0a09"/>
            <path d="M16 56 H52 L55 68 H13 L16 56 Z" fill="#1c1917" stroke="#eab308" stroke-width="1.4"/>
            <rect x="21" y="60" width="26" height="5" rx="1" fill="#eab308"/>
            <!-- Yükselen Altın Kavisli Sütunlar -->
            <path d="M24 56 C21 43, 26 36, 34 31 C42 36, 47 43, 44 56 Z" fill="#ca8a04" stroke="#713f12" stroke-width="1.5"/>
            <path d="M24 56 C21 43, 26 36, 34 31 V56 Z" fill="#facc15"/>
            <!-- 3D Fasetli Yıldız -->
            <polygon points="34 5 40 19 56 20 44 30 48 46 34 37 20 46 24 30 12 20 28 19" fill="#ca8a04" stroke="#713f12" stroke-width="1.8"/>
            <polygon points="34 5 28 19 12 20 24 30 20 46 34 37" fill="#fde047"/>
            <polygon points="34 13 37 21 45 22 39 27 41 35 34 30 27 35 29 27 23 22 31 21" fill="#ffffff" opacity="0.45"/>
        </svg>`,

        // 7. MAESTRO (ASİST KRALI & 15+ ASİST - Safir Kanatlar Arasında Altın Oyun Kurucu Küresi)
        playmaker: `<svg width="68" height="82" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="23" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M12 68 H56 L58 76 H10 L12 68 Z" fill="#0c0a09"/>
            <path d="M15 56 H53 L56 68 H12 L15 56 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.4"/>
            <rect x="20" y="60" width="28" height="5" rx="1" fill="#38bdf8"/>
            <!-- Safir Kristal Kanatlar -->
            <path d="M13 27 C13 12, 26 12, 34 25 C42 12, 55 12, 55 27 C55 42, 41 50, 34 56 C27 50, 13 42, 13 27 Z" fill="#0369a1" stroke="#eab308" stroke-width="2"/>
            <path d="M13 27 C13 12, 26 12, 34 25 V56 C27 50, 13 42, 13 27 Z" fill="#0284c7"/>
            <circle cx="34" cy="29" r="11.5" fill="#facc15" stroke="#ffffff" stroke-width="1.8"/>
            <polygon points="34 22 39 26 37 32 31 32 29 26" fill="#0f172a"/>
        </svg>`,

        // 8. HAYALİNDEKİ KULÜP ÖZEL ÇERÇEVELİ İMZALI FORMASI
        dream_jersey_frame: `<svg width="68" height="82" viewBox="0 0 68 82" fill="none">
            <ellipse cx="34" cy="77" rx="24" ry="4" fill="rgba(0,0,0,0.75)"/>
            <path d="M12 68 H56 L58 76 H10 L12 68 Z" fill="#1c1917"/>
            <!-- Altın Çerçeveli Cam Vitrin -->
            <rect x="11" y="9" width="46" height="59" rx="3" fill="#0f291a" stroke="#eab308" stroke-width="3"/>
            <rect x="14" y="12" width="40" height="53" stroke="#fef08a" stroke-width="0.8"/>
            <!-- İçerideki İmzalı Forma -->
            <path d="M23 22 L28 19 H40 L45 22 L51 31 L44 34 L42 28 V54 H26 V28 L24 34 L17 31 L23 22 Z" fill="#facc15" stroke="#ffffff" stroke-width="1.5"/>
            <text x="34" y="44" text-anchor="middle" fill="#07190e" font-size="13" font-weight="900">10</text>
            <path d="M16 14 L30 62" stroke="#ffffff" stroke-width="4" opacity="0.12"/>
        </svg>`
    };

    let selectedCollectedIndex = 0;

    function buildEarnedTrophyCollection() {
        if (typeof gameData === 'undefined' || !gameData) return [];
        const earned = [];

        // 1. Sezon Sonu Kazanılan Tüm Kupalar (Kaç kez kazanıldıysa yan yana eklenir!)
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

        // 2. Kazanılmış Kariyer Ödülleri
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

        // YAZISIZ, DOĞRUDAN AHŞAP RAF ÜSTÜNE OTURAN KUPALAR!
        const shelvesHTML = shelves.map((shelfItems, sIdx) => {
            const itemsHTML = shelfItems.map((item, iOffset) => {
                const globalIdx = sIdx * 4 + iOffset;
                const isSelected = globalIdx === selectedCollectedIndex;
                return `
                    <button type="button" onclick="window.selectCollectedTrophy(${globalIdx})" class="trophy-on-shelf relative flex flex-col items-center justify-end px-1 pt-2 focus:outline-none ${isSelected ? 'trophy-selected-glow z-30' : 'z-20'}">
                        <!-- Tavan Spot Işığı -->
                        <div class="absolute -top-3 w-14 h-20 bg-gradient-to-b ${isSelected ? 'from-amber-300/45' : 'from-amber-200/15'} to-transparent pointer-events-none" style="clip-path: polygon(28% 0%, 72% 0%, 100% 100%, 0% 100%);"></div>
                        ${item.svg}
                    </button>
                `;
            }).join('');

            const emptyHint = shelfItems.length === 0
                ? `<div class="col-span-4 h-16 flex items-center justify-center text-[11px] font-bold text-amber-200/25 italic">Yeni ödüller kazandıkça bu rafa dizilecek...</div>`
                : '';

            return `
                <div class="relative pt-1">
                    <div class="grid grid-cols-4 items-end justify-items-center min-h-[76px] px-3 relative z-20">
                        ${itemsHTML}
                        ${emptyHint}
                    </div>
                    <!-- 3D Perspektif Ahşap Raf Tablası (Kupaların Tabanı Tam Bu Yüzeye Oturur) -->
                    <svg class="w-full h-6 block drop-shadow-[0_8px_10px_rgba(0,0,0,0.85)] relative z-10" viewBox="0 0 360 24" preserveAspectRatio="none">
                        <!-- Raf Üst Perspektif Yüzeyi -->
                        <polygon points="16,0 344,0 360,13 0,13" fill="#92400e"/>
                        <polygon points="16,0 344,0 352,6 8,6" fill="#78350f"/>
                        <!-- Raf Ön Kalın Kenarı & Altın Çıtası -->
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
            <div class="board-panel overflow-hidden">
                <div class="board-header flex justify-between items-center">
                    <span class="font-sport text-sm font-black uppercase tracking-wider text-[#eab308]">ŞEREF SALONU & KUPA KOLEKSİYONU</span>
                    <span class="font-led text-xs text-emerald-200 font-bold">YAŞ: ${gameData.age} • TOPLAM ÖDÜL: ${collection.length}</span>
                </div>
                <div class="p-2.5 grid grid-cols-4 gap-2 text-center bg-[#f5f1e4]">
                    <div class="bg-[#e6e0cc] p-1.5 rounded border border-[#143321]">
                        <span class="text-[9px] text-slate-600 font-black block uppercase">TOPLAM MAÇ</span>
                        <span class="font-led font-bold text-lg text-[#0f291a]">${gameData.allTimeMatches}</span>
                    </div>
                    <div class="bg-[#e6e0cc] p-1.5 rounded border border-[#143321]">
                        <span class="text-[9px] text-slate-600 font-black block uppercase">TOPLAM GOL</span>
                        <span class="font-led font-bold text-lg text-emerald-800">${gameData.allTimeGoals}</span>
                    </div>
                    <div class="bg-[#e6e0cc] p-1.5 rounded border border-[#143321]">
                        <span class="text-[9px] text-slate-600 font-black block uppercase">TOPLAM ASİST</span>
                        <span class="font-led font-bold text-lg text-blue-800">${gameData.allTimeAssists}</span>
                    </div>
                    <div class="bg-[#e6e0cc] p-1.5 rounded border border-[#143321]">
                        <span class="text-[9px] text-slate-600 font-black block uppercase">KOLEKSİYON</span>
                        <span class="font-led font-bold text-lg text-amber-700">${collection.length} ADET</span>
                    </div>
                </div>
            </div>

            <!-- 3D AHŞAP MÜZE VİTRİNİ (YAZISIZ, SAF FİZİKSEL KUPALAR) -->
            <div class="rounded-xl border-4 border-[#3f1d0b] bg-gradient-to-b from-[#1a0f08] via-[#26160c] to-[#120a05] shadow-2xl overflow-hidden relative">
                <div class="bg-[#451a03] px-3 py-1.5 border-b-2 border-[#eab308]/60 flex justify-between items-center text-[10px] font-black text-amber-200 uppercase">
                    <span>MÜZE RAFLARI (DETAYINI GÖRMEK İÇİN KUPAYA DOKUN)</span>
                    <span class="text-[#eab308]">${collection.length} ESER</span>
                </div>

                <div class="p-3 space-y-4">
                    ${shelvesHTML}
                </div>

                <!-- SEÇİLİ KUPA PİRİNÇ PLAKETİ -->
                ${activeTrophy ? `
                <div class="m-2.5 mt-1 p-3 rounded-lg bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fef3c7] border-2 border-[#78350f] text-[#292524] flex items-center gap-3 shadow-inner">
                    <div class="w-16 h-18 rounded-lg bg-[#1c1917] border-2 border-[#78350f] flex items-center justify-center shrink-0 p-1 shadow-md">
                        ${activeTrophy.svg}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-center gap-1">
                            <h4 class="font-sport text-lg font-black uppercase text-[#451a03] truncate">${activeTrophy.title}</h4>
                            <span class="text-[9px] font-black px-2 py-0.5 rounded bg-[#16a34a] text-white shrink-0">MÜZEDE</span>
                        </div>
                        <p class="text-[11px] font-black text-amber-900">${activeTrophy.sub}</p>
                        <p class="text-[11px] font-bold text-[#57534e] leading-tight mt-0.5">${activeTrophy.desc}</p>
                    </div>
                </div>
                ` : `
                <div class="m-2.5 mt-1 p-3 rounded-lg bg-[#292524] border border-amber-500/30 text-center text-xs font-bold text-amber-200">
                    Henüz müzende kupa yok! İlk golünü attığında veya sezon sonu ödül kazandığında raflara dizilmeye başlayacak.
                </div>
                `}
            </div>

            <div class="board-panel overflow-hidden">
                <div class="board-header">
                    <span class="font-sport text-sm font-black uppercase tracking-wider text-white">SEZON SEZON KARİYER GEÇMİŞİ</span>
                </div>
                <div class="overflow-x-auto bg-[#f5f1e4]">
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
        `;
    };

    // =====================================================================
    // 4. HIZLI SİMÜLASYONDA RASTGELE YEDEK GİRİŞ DAKİKASI
    // =====================================================================
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
    // 5. SEYREKLEŞTİRİLMİŞ OLAY KARTLARI
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

    if (typeof gameData !== 'undefined' && gameData) {
        window.renderCareerAndTrophiesPanel();
    }

    // =====================================================================
    // 6. MOBİL BUILD & HER TELEFON EKRANINA UYUM (RESPONSIVE LOCK) YAMASI
    // =====================================================================
    const mobileFixStyle = document.createElement('style');
    mobileFixStyle.innerHTML = `
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100dvh;
            overflow: hidden;
            overscroll-behavior: none;
            -webkit-tap-highlight-color: transparent;
        }
        /* Ana kabuğu tam mobil ekran yüksekliğine (100dvh) sabitle */
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
        /* Sadece orta içerik alanı kayabilsin, üst ve alt barlar sabit kalsın */
        #screen-game {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
        }
        #screen-game > main {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 12px !important;
        }
        #game-bottom-nav {
            flex-shrink: 0 !important;
        }
        /* Küçük ekranlı telefonlarda antrenman sahasının taşmasını önle */
        #trainingMinigameCanvas {
            height: auto !important;
            max-height: 55dvh !important;
            aspect-ratio: 380 / 460 !important;
        }
        /* Çok dar ekranlarda (Örn: 360px altı) yazı ve buton taşmasını engelle */
        @media (max-height: 740px) {
            #tab-content-hub {
                gap: 0.45rem !important;
            }
            #tab-content-hub .board-panel {
                padding: 0.6rem !important;
            }
        }
    `;
    document.head.appendChild(mobileFixStyle);
    
})();
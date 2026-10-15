// =========================================================================
// ui_stage1.js - BÜYÜTÜLMÜŞ ANTRENMAN SAHNESİ (400PX) + FALSO (CURVE) MEKANİĞİ
// + GERÇEK NSS ANLIK SLALOM SÜRÜŞÜ + GERÇEK KAYITLI HAKEM DÜDÜĞÜ
// =========================================================================
(function () {
    window.selectedStationType = 'shooting';

    // =====================================================================
    // 0. OYUN İÇİ ALT UYARI BANDI (TOAST NOTIFICATION)
    // =====================================================================
    let toastTimeout = null;
    window.showGameToast = function (message, type = 'warn') {
        const appShell = document.getElementById('main-app-shell') || document.body;
        let toastEl = document.getElementById('in-game-toast-banner');
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.id = 'in-game-toast-banner';
            toastEl.className = "fixed bottom-16 left-1/2 -translate-x-1/2 w-[90%] max-w-[390px] z-[99] pointer-events-none transition-all duration-300 opacity-0 translate-y-4";
            appShell.appendChild(toastEl);
        }

        const bgClass = type === 'success'
            ? 'bg-[#16a34a] border-[#eab308] text-white'
            : (type === 'info' ? 'bg-[#143321] border-[#eab308] text-[#eab308]' : 'bg-[#991b1b] border-[#fbbf24] text-white');

        toastEl.innerHTML = `
            <div class="${bgClass} border-2 rounded-xl px-4 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.75)] flex items-center justify-between gap-2">
                <span class="font-sport text-sm font-black uppercase tracking-wide leading-tight">${message}</span>
            </div>
        `;

        requestAnimationFrame(() => {
            toastEl.classList.remove('opacity-0', 'translate-y-4');
            toastEl.classList.add('opacity-100', 'translate-y-0');
        });

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('opacity-100', 'translate-y-0');
            toastEl.classList.add('opacity-0', 'translate-y-4');
        }, 2800);
    };

    window.alert = function (msg) {
        window.showGameToast(msg, 'warn');
    };

    // =====================================================================
    // 1. GERÇEK SES MOTORU (SENTETİK TİZ DÜDÜK TAMAMEN KALDIRILDI!)
    // =====================================================================
    const MATCH_GOAL_AUDIO = new Audio('gol.mp3');
    const FALLBACK_GOAL_AUDIO = new Audio('https://www.myinstants.com/media/sounds/goal-sound-effect.mp3');
    const REAL_WHISTLE_AUDIO = new Audio('duduk.mp3');
    const FALLBACK_WHISTLE_AUDIO = new Audio('https://www.myinstants.com/media/sounds/referee-whistle-blow-gymnasium.mp3');

    MATCH_GOAL_AUDIO.volume = 0.85;
    FALLBACK_GOAL_AUDIO.volume = 0.85;
    REAL_WHISTLE_AUDIO.volume = 0.65;
    FALLBACK_WHISTLE_AUDIO.volume = 0.65;

    function getAudioCtx() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!window._gameAudioCtx) window._gameAudioCtx = new AudioCtx();
        if (window._gameAudioCtx.state === 'suspended') window._gameAudioCtx.resume();
        return window._gameAudioCtx;
    }

    const SFX = {
        muted: false,
        kick() {
            if (this.muted) return;
            const ctx = getAudioCtx();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(130, now);
            osc.frequency.exponentialRampToValueAtTime(32, now + 0.11);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.13);
        },
        netSwish() {
            if (this.muted) return;
            const ctx = getAudioCtx();
            if (!ctx) return;
            const now = ctx.currentTime;
            const dur = 0.26;
            const bufferSize = ctx.sampleRate * dur;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
            }
            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1350, now);
            filter.frequency.exponentialRampToValueAtTime(600, now + dur);
            filter.Q.setValueAtTime(1.8, now);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
            whiteNoise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            whiteNoise.start(now);
        },
        post() {
            if (this.muted) return;
            const ctx = getAudioCtx();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(290, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.23);
        },
        // Kulak tırmalayan sentetik düdük kaldırıldı -> Gerçek kayıtlı hakem düdüğü çalar
        whistle() {
            if (this.muted) return;
            REAL_WHISTLE_AUDIO.currentTime = 0;
            REAL_WHISTLE_AUDIO.play().catch(() => {
                FALLBACK_WHISTLE_AUDIO.currentTime = 0;
                FALLBACK_WHISTLE_AUDIO.play().catch(() => {});
            });
        },
        matchGoal(isHomeGoal = true) {
            if (this.muted) return;
            this.netSwish();
            if (isHomeGoal) {
                MATCH_GOAL_AUDIO.currentTime = 0;
                MATCH_GOAL_AUDIO.play().catch(() => {
                    FALLBACK_GOAL_AUDIO.currentTime = 0;
                    FALLBACK_GOAL_AUDIO.play().catch(() => {});
                });
            }
        },
        stopAllMatchSounds() {
            try {
                MATCH_GOAL_AUDIO.pause();
                MATCH_GOAL_AUDIO.currentTime = 0;
                FALLBACK_GOAL_AUDIO.pause();
                FALLBACK_GOAL_AUDIO.currentTime = 0;
                REAL_WHISTLE_AUDIO.pause();
                FALLBACK_WHISTLE_AUDIO.pause();
            } catch (e) {}
        }
    };
    window.SFX = SFX;

    // =====================================================================
    // 2. RASTGELE FİKSTÜR & DÜŞÜK KONDİSYON DURUMU
    // =====================================================================
    function ensureRandomizedFixture() {
        if (typeof gameData === 'undefined' || !gameData) return;
        const others = gameData.standings.filter(t => !t.isPlayerClub).map(t => t.name);
        if (!gameData.fixtureOrder || gameData.fixtureOrder.length !== others.length || gameData.fixtureSeason !== gameData.season) {
            const shuffled = [...others];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            gameData.fixtureOrder = shuffled;
            gameData.fixtureSeason = gameData.season;
            saveCurrentGame();
        }
    }

    window.getCurrentOpponent = function () {
        ensureRandomizedFixture();
        const oppName = gameData.fixtureOrder[(gameData.week - 1) % gameData.fixtureOrder.length];
        return gameData.standings.find(t => t.name === oppName) || gameData.standings.find(t => !t.isPlayerClub);
    };

    window.getPlayerMatchStatus = function () {
        if (typeof gameData === 'undefined' || !gameData) return 'starter';
        if (gameData.energy < 18) return 'rested';
        if (gameData.energy < 32) return 'sub';
        return isPlayerStarter() ? 'starter' : 'sub';
    };

    // =====================================================================
    // 3. ANTRENMAN İSTASYONU KONFİGÜRASYONU
    // =====================================================================
    const STATIONS_CONFIG = {
        shooting: {
            zoneName: "1. İSTASYON • KUZEY KALE (FALSOLU SAPAN ŞUT)",
            title: "Şut & Bitiricilik Minigame",
            desc: "Topun altındaki geniş çekme alanını kullanarak geriye çek ve falso ver! 3 şutta en az 2 gol = +1 Bitiricilik.",
            cost: "-15 Kondisyon",
            reward: "2/3 Golde: +1 Bitiricilik (Şut)",
            statKey: "shoot",
            statLabel: "ŞUT",
            icon: ICONS.target,
            btnText: "ŞUT İDMANINA BAŞLA"
        },
        playmaking: {
            zoneName: "2. İSTASYON • FALSOLU KİLİT PAS",
            title: "Vizyon & Falsolu Pas Minigame",
            desc: "Alttaki Falso (Kavis) kontrolüyle topu baraj mankenlerinin etrafından bükerek hedefe gönder! Vizyon özelliğin falsonu güçlendirir.",
            cost: "-15 Kondisyon",
            reward: "2/3 İsabet: +1 Vizyon & +5% Güven",
            statKey: "pass",
            statLabel: "PAS",
            icon: ICONS.ball,
            btnText: "PAS İDMANINA BAŞLA"
        },
        dribbling: {
            zoneName: "3. İSTASYON • GERÇEK NSS ANLIK SLALOM",
            title: "NSS Slalom & Top Sürme Parkuru",
            desc: "Beyaz oyuncunun üstüne basılı tutup parmağını sağa-sola-ileri nereye sürersen anlık oraya gider! 5 duba kapısından geç.",
            cost: "-15 Kondisyon",
            reward: "5 Kapıyı Geç: +1 Top Sürme (Çalım)",
            statKey: "dribble",
            statLabel: "ÇALIM",
            icon: ICONS.bolt,
            btnText: "SLALOM PARKURUNA BAŞLA"
        },
        heavy_camp: {
            zoneName: "4. İSTASYON • SAĞ PİST (14SN DENGE KAMPI)",
            title: "Fizik & Dayanıklılık Kampı",
            desc: "Yumuşak hareket eden yeşil hedef bölgesinde imleci tutarak 14 saniyelik kondisyon testini tamamla!",
            cost: "-26 Kondisyon",
            reward: "Başarıda: +1 Fizik & +14% Güven",
            statKey: "physic",
            statLabel: "FİZİK",
            icon: ICONS.dumbbell,
            btnText: "FİZİK KAMPINA BAŞLA"
        }
    };

    function getGradeText(val) {
        if (val >= 75) return "ELİT";
        if (val >= 68) return "USTA";
        if (val >= 62) return "ETKİLİ";
        return "HAM";
    }

    function applyStage1And2Overhaul() {
        const appShell = document.getElementById('main-app-shell');

        if (appShell && !document.getElementById('sub-in-anim-overlay')) {
            const extraOverlays = document.createElement('div');
            extraOverlays.innerHTML = `
                <!-- YEDEK KULÜBESİNDEN OYUNA GİRİŞ SVG ANİMASYON EKRANI -->
                <div id="sub-in-anim-overlay" class="hidden absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
                    <div class="board-panel w-full max-w-[380px] overflow-hidden bg-[#0f291a] border-2 border-[#eab308] text-white animate-screen shadow-2xl">
                        <div class="bg-[#183d28] px-4 py-2 border-b-2 border-[#eab308] flex justify-between items-center">
                            <span class="font-sport text-sm font-black uppercase tracking-widest text-[#eab308]">OYUNCU DEĞİŞİKLİĞİ • 4. HAKEM TABELASI</span>
                            <span id="sub-in-min-badge" class="font-led text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">64'</span>
                        </div>
                        <div class="p-4 flex flex-col items-center text-center">
                            <div class="relative w-full h-44 rounded-xl bg-[#195c31] border-2 border-white/40 overflow-hidden flex items-center justify-around px-3 mb-3 shadow-inner">
                                <svg class="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 340 170">
                                    <line x1="0" y1="145" x2="340" y2="145" stroke="white" stroke-width="4"/>
                                    <line x1="170" y1="145" x2="170" y2="170" stroke="white" stroke-width="3"/>
                                </svg>
                                <div class="z-10 flex flex-col items-center">
                                    <div class="bg-[#090d14] border-4 border-slate-400 rounded-lg p-2.5 shadow-xl w-32">
                                        <div class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-700 pb-0.5">DEĞİŞİKLİK</div>
                                        <div class="grid grid-cols-2 gap-2 items-center">
                                            <div class="bg-red-950/80 border border-red-500/40 rounded p-1 text-center">
                                                <span class="text-[9px] font-black text-red-400 block">▼ ÇIKAN</span>
                                                <span id="sub-out-num" class="font-led text-2xl font-black text-red-500 leading-none">19</span>
                                            </div>
                                            <div class="bg-emerald-950/80 border border-emerald-500/40 rounded p-1 text-center">
                                                <span class="text-[9px] font-black text-emerald-400 block">▲ GİREN</span>
                                                <span id="sub-in-num" class="font-led text-2xl font-black text-[#4ade80] leading-none">10</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="text-[10px] font-bold text-emerald-200 mt-1.5">Taç Çizgisindesin</span>
                                </div>
                                <div class="z-10 flex flex-col items-center">
                                    <div id="sub-in-avatar-box" class="transform scale-95 transition-transform duration-500"></div>
                                </div>
                            </div>
                            <h3 class="font-sport text-2xl font-black uppercase text-[#eab308] tracking-wide">HOCA SENİ SAHAYA SÜRDÜ!</h3>
                            <p id="sub-in-desc-text" class="text-xs font-bold text-emerald-100 mt-1">Isınmayı tamamladın ve alkışlar arasında oyuna dahil oluyorsun!</p>
                        </div>
                    </div>
                </div>

                <!-- BÜYÜTÜLMÜŞ İNTERAKTİF 2D ANTRENMAN MİNİGAME MODALI (360x400 YÜKSEK SAHA + FALSO KONTROLÜ) -->
                <div id="training-minigame-modal" class="hidden absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-2">
                    <div class="board-panel w-full max-w-[420px] overflow-hidden bg-[#f5f1e4] animate-screen">
                        <div class="board-header py-2 px-3 flex justify-between items-center">
                            <span id="mg-modal-title" class="font-sport text-sm font-black uppercase tracking-wider text-[#eab308]">ŞUT & BİTİRİCİLİK MİNİGAME</span>
                            <div class="flex items-center gap-2">
                                <span id="mg-modal-balls" class="font-led text-xs font-bold text-white">HAK: ●●●</span>
                                <span id="mg-modal-score" class="font-led text-xs font-bold px-2 py-0.5 rounded bg-[#eab308] text-[#07190e]">BAŞARI: 0 / 3</span>
                            </div>
                        </div>

                        <div class="p-2.5 flex flex-col items-center">
                            <p id="mg-modal-status" class="text-[11px] font-extrabold text-[#143321] text-center mb-1.5 min-h-[28px] flex items-center justify-center leading-tight">
                                Topa basıp geriye doğru çekerek nişan al ve bırak!
                            </p>

                            <!-- BÜYÜTÜLMÜŞ CANVAS: 360x400 (Topun altında geniş çekme alanı var!) -->
                            <canvas id="trainingMinigameCanvas" width="360" height="400" class="w-full h-[370px] rounded-lg border-2 border-[#143321] bg-[#1b5e34] touch-none cursor-pointer shadow-inner"></canvas>

                            <!-- FALSO (KAVİS / CURVE) KONTROL PANELİ (Şut ve Pas İdmanında Görünür) -->
                            <div id="mg-curve-controls" class="w-full mt-2 bg-[#e6e0cc] px-2.5 py-1.5 rounded-lg border border-[#143321]/30 flex items-center justify-between gap-2">
                                <span id="mg-curve-label" class="font-sport text-xs font-black uppercase text-[#143321] shrink-0">FALSO (KAVİS):</span>
                                <div class="flex items-center gap-1 flex-1 justify-end">
                                    <button type="button" onclick="window.setShotCurve(-1)" id="curve-btn-left" class="px-2 py-1 rounded bg-white border border-[#143321] font-sport text-xs font-black text-[#143321]">⟲ SOLA KAVİS</button>
                                    <button type="button" onclick="window.setShotCurve(0)" id="curve-btn-none" class="px-2.5 py-1 rounded bg-[#143321] text-[#eab308] border border-[#143321] font-sport text-xs font-black">DÜZ</button>
                                    <button type="button" onclick="window.setShotCurve(1)" id="curve-btn-right" class="px-2 py-1 rounded bg-white border border-[#143321] font-sport text-xs font-black text-[#143321]">SAĞA KAVİS ⟳</button>
                                </div>
                            </div>

                            <!-- Fizik Minigame Butonu -->
                            <button type="button" id="btn-physic-boost" class="hidden w-full mt-2 py-2.5 sport-btn-gold font-sport text-base font-black uppercase tracking-wider select-none">
                                BASILI TUT: DEPAR VER / BIRAK: NEFES AL
                            </button>

                            <div class="w-full flex justify-between items-center mt-2 text-[11px] font-bold text-slate-600">
                                <span id="mg-modal-hint">Hedefi tamamla ve gelişimi kap</span>
                                <button type="button" id="btn-finish-mg" onclick="window.closeTrainingMinigame()" class="hidden px-5 py-1.5 sport-btn-green font-sport text-sm font-black uppercase tracking-wider">
                                    İDMANI TAMAMLA →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TÜM SEZONU SİMÜLE ET MODALI -->
                <div id="season-sim-modal" class="hidden absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
                    <div class="board-panel w-full overflow-hidden bg-[#f5f1e4] flex flex-col items-center animate-screen">
                        <div class="board-header w-full flex justify-between items-center">
                            <span id="ssim-step-badge" class="font-sport text-sm font-black uppercase text-[#eab308]">TÜM SEZON SİMÜLASYONU • 1/3</span>
                            <button type="button" id="btn-close-ssim" onclick="window.closeSeasonSimModal()" class="text-xs text-red-400 font-black uppercase">✕ İPTAL</button>
                        </div>
                        <div class="p-4 w-full flex flex-col items-center">
                            <h3 id="ssim-title" class="font-sport text-2xl font-black uppercase text-[#143321] leading-none">1. ÇARK: OYNANAN MAÇ SAYISI</h3>
                            <p id="ssim-desc" class="text-xs text-slate-700 font-extrabold text-center my-1.5 min-h-[32px]">
                                Kalan haftalarda kaç maçta forma giydiğini belirlemek için çarkı çevir!
                            </p>
                            <div class="relative flex items-center justify-center my-1.5">
                                <div id="ssim-wheel-pointer" class="absolute -top-3 z-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#0f291a] transition-transform duration-75"></div>
                                <canvas id="seasonSimWheelCanvas" width="245" height="245" class="rounded-full border-4 border-[#0f291a] shadow-md"></canvas>
                                <div class="absolute w-11 h-11 rounded-full bg-[#f3efe2] border-4 border-[#0f291a] flex items-center justify-center text-[#0f291a] font-sport font-black text-sm">SZN</div>
                            </div>
                            <div id="ssim-summary-bar" class="w-full grid grid-cols-3 gap-2 bg-[#e6e0cc] p-2 rounded-lg border border-[#143321]/30 text-center my-2">
                                <div>
                                    <span class="text-[9px] font-black text-slate-600 uppercase block">EKLENEN MAÇ</span>
                                    <span id="ssim-val-matches" class="font-led text-base font-bold text-[#143321]">-</span>
                                </div>
                                <div>
                                    <span class="text-[9px] font-black text-slate-600 uppercase block">EKLENEN GOL</span>
                                    <span id="ssim-val-goals" class="font-led text-base font-bold text-emerald-800">-</span>
                                </div>
                                <div>
                                    <span class="text-[9px] font-black text-slate-600 uppercase block">EKLENEN ASİST</span>
                                    <span id="ssim-val-assists" class="font-led text-base font-bold text-blue-800">-</span>
                                </div>
                            </div>
                            <div class="w-full flex gap-2 mt-1">
                                <button type="button" id="btn-ssim-action" onclick="window.handleSeasonSimStep()" class="flex-1 py-3 sport-btn-green font-sport text-base font-black uppercase tracking-wider">
                                    MAÇ ÇARKINI ÇEVİR!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            appShell.appendChild(extraOverlays);
        }

        // SOYUNMA ODASI
        const hubEl = document.getElementById('tab-content-hub');
        if (hubEl) {
            hubEl.innerHTML = `
                <div id="squad-status-banner" class="board-panel p-3 flex items-center justify-between border-l-4 border-l-[#16a34a]">
                    <div class="pr-2">
                        <div class="flex items-center gap-2">
                            <span id="squad-role-badge" class="font-sport text-xs font-bold uppercase px-2 py-0.5 rounded bg-[#143321] text-[#eab308]">İLK 11</span>
                            <span id="squad-req-ovr" class="text-xs font-extrabold text-[#143321]">Kulüp Barajı: 58 OVR</span>
                            <span id="active-buff-badge" class="hidden text-[10px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white uppercase">SÖZ AKTİF</span>
                        </div>
                        <p id="squad-role-desc" class="text-xs font-bold text-slate-600 mt-1 leading-snug">Hoca sana güveniyor, maça ilk 11'de başlıyorsun.</p>
                    </div>
                </div>

                <div class="board-panel overflow-hidden">
                    <div class="board-header flex justify-between items-center">
                        <span class="font-sport text-sm font-bold tracking-wider text-[#eab308] uppercase">
                            <span id="hub-league-name">Süper Lig</span> • <span id="hub-match-week">1. Hafta</span>
                        </span>
                        <span id="hub-last-ratings" class="text-xs font-bold text-emerald-200">Son Maç: -</span>
                    </div>

                    <div class="p-3.5 space-y-3">
                        <div class="grid grid-cols-7 items-center py-3 bg-[#143321] text-white rounded-lg border border-[#091910] px-3 shadow-inner">
                            <div class="col-span-3 flex flex-col items-center text-center">
                                <div id="hub-home-crest" class="mb-1"></div>
                                <span id="hub-home-name" class="font-sport text-lg font-extrabold text-white leading-none">Gençlerbirliği</span>
                                <span class="text-[10px] text-emerald-300/90 font-semibold mt-1">Ev Sahibi</span>
                            </div>
                            <div class="col-span-1 text-center">
                                <span class="font-sport text-sm font-black px-2 py-0.5 rounded bg-[#eab308] text-[#07190e]">VS</span>
                            </div>
                            <div class="col-span-3 flex flex-col items-center text-center">
                                <div id="hub-away-crest" class="mb-1"></div>
                                <span id="hub-away-name" class="font-sport text-lg font-extrabold text-white leading-none">Fenerbahçe</span>
                                <span class="text-[10px] text-amber-300/90 font-semibold mt-1">Deplasman</span>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between items-center text-xs mb-1">
                                <span class="text-[#143321] font-extrabold">Maç Eforu ve Tempo</span>
                                <span id="hub-mentality-cost" class="text-xs font-extrabold text-amber-900 bg-amber-500/20 px-2 py-0.5 rounded">-20 Kondisyon</span>
                            </div>
                            <div class="grid grid-cols-3 gap-1.5 bg-[#e6e0cc] p-1 rounded-lg border border-[#143321]/30">
                                <button onclick="setMentality('safe')" id="ment-safe" class="py-1.5 rounded-md text-xs font-extrabold text-slate-700 transition">Rölanti (-12)</button>
                                <button onclick="setMentality('balanced')" id="ment-balanced" class="py-1.5 rounded-md bg-[#143321] text-xs font-extrabold text-[#eab308] shadow-sm transition">Dengeli (-20)</button>
                                <button onclick="setMentality('attack')" id="ment-attack" class="py-1.5 rounded-md text-xs font-extrabold text-slate-700 transition">Tam Pres (-28)</button>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 pt-0.5">
                            <button onclick="startMatchSimulation()" class="flex-1 py-3 sport-btn-green font-sport text-lg font-black uppercase tracking-wider flex items-center justify-center gap-2">
                                <span>${ICONS.pitch}</span>
                                <span id="btn-play-match-label">Sahaya Çık</span>
                            </button>
                            <button onclick="openQuickSimModal()" class="px-4 py-3 sport-btn-cream font-sport text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0">
                                <span>${ICONS.bolt}</span>
                                <span>Simüle Et</span>
                            </button>
                        </div>

                        <button onclick="window.openSeasonSimModal()" class="w-full py-2 rounded-lg bg-[#143321] hover:bg-[#1b432c] text-[#eab308] border border-[#091910] font-sport text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition">
                            <span>Tüm Sezonu Simüle Et (Maç • Gol • Asist Çarkı)</span>
                        </button>
                    </div>
                </div>

                <div class="bg-[#e8e2ce] border-2 border-[#143321] rounded-lg p-3 shadow-sm">
                    <div class="flex justify-between items-center pb-2 mb-2 border-b-2 border-dashed border-[#143321]/25">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-[#16a34a]"></span>
                            <span class="font-sport text-sm font-black uppercase tracking-wider text-[#143321]">Oyuncu Teknik Sicil Raporu</span>
                        </div>
                        <button onclick="switchGameTab('training')" class="text-[11px] font-black text-[#143321] underline hover:text-emerald-800">
                            Tesislerde Geliştir →
                        </button>
                    </div>

                    <div class="grid grid-cols-4 divide-x-2 divide-dashed divide-[#143321]/20 text-center">
                        <div class="px-1">
                            <span class="text-[10px] font-black text-slate-600 uppercase block">ŞUT</span>
                            <span id="stat-val-shoot" class="font-sport font-black text-3xl text-[#143321] leading-none my-0.5 block">60</span>
                            <span id="stat-grade-shoot" class="inline-block text-[9px] font-black px-1.5 py-0.2 rounded bg-[#143321]/10 text-[#143321]">HAM</span>
                        </div>
                        <div class="px-1">
                            <span class="text-[10px] font-black text-slate-600 uppercase block">PAS</span>
                            <span id="stat-val-pass" class="font-sport font-black text-3xl text-[#143321] leading-none my-0.5 block">60</span>
                            <span id="stat-grade-pass" class="inline-block text-[9px] font-black px-1.5 py-0.2 rounded bg-[#143321]/10 text-[#143321]">HAM</span>
                        </div>
                        <div class="px-1">
                            <span class="text-[10px] font-black text-slate-600 uppercase block">ÇALIM</span>
                            <span id="stat-val-dribble" class="font-sport font-black text-3xl text-[#143321] leading-none my-0.5 block">60</span>
                            <span id="stat-grade-dribble" class="inline-block text-[9px] font-black px-1.5 py-0.2 rounded bg-[#143321]/10 text-[#143321]">HAM</span>
                        </div>
                        <div class="px-1">
                            <span class="text-[10px] font-black text-slate-600 uppercase block">FİZİK</span>
                            <span id="stat-val-physic" class="font-sport font-black text-3xl text-[#143321] leading-none my-0.5 block">60</span>
                            <span id="stat-grade-physic" class="inline-block text-[9px] font-black px-1.5 py-0.2 rounded bg-[#143321]/10 text-[#143321]">HAM</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // ANTRENMAN TESİSLERİ
        let trainSec = document.getElementById('tab-content-training');
        if (!trainSec && hubEl && hubEl.parentElement) {
            trainSec = document.createElement('div');
            trainSec.id = 'tab-content-training';
            trainSec.className = 'hidden space-y-2.5 animate-screen';
            hubEl.parentElement.appendChild(trainSec);
        }
        if (trainSec) {
            trainSec.innerHTML = `
                <div class="flex items-center justify-between bg-[#143321] text-white px-3.5 py-2 rounded-lg border-2 border-[#091910]">
                    <div>
                        <h2 class="font-sport text-lg font-black tracking-wide text-[#eab308] uppercase leading-none">Kulüp Antrenman Sahası</h2>
                        <p class="text-[11px] text-emerald-100 font-bold">Sahadaki 4 istasyondan birine dokunarak çalışmanı seç</p>
                    </div>
                    <span id="hub-train-badge" class="font-led text-[10px] font-bold px-2 py-0.5 rounded bg-[#eab308] text-[#07190e]">1 HAKKIN VAR</span>
                </div>

                <div class="relative w-full h-64 rounded-xl border-4 border-[#f5f1e4] shadow-[0_5px_0_#091910] overflow-hidden bg-[#1b5e34] select-none">
                    <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 260" preserveAspectRatio="none">
                        <rect x="0" y="0" width="400" height="52" fill="#1e683a"/>
                        <rect x="0" y="104" width="400" height="52" fill="#1e683a"/>
                        <rect x="0" y="208" width="400" height="52" fill="#1e683a"/>
                        <rect x="14" y="12" width="335" height="236" stroke="rgba(255,255,255,0.55)" stroke-width="2" fill="none"/>
                        <rect x="95" y="12" width="170" height="65" stroke="rgba(255,255,255,0.55)" stroke-width="2" fill="none"/>
                        <rect x="140" y="12" width="80" height="24" stroke="rgba(255,255,255,0.55)" stroke-width="2" fill="none"/>
                        <line x1="14" y1="145" x2="349" y2="145" stroke="rgba(255,255,255,0.45)" stroke-width="2"/>
                        <circle cx="180" cy="145" r="36" stroke="rgba(255,255,255,0.55)" stroke-width="2" fill="none"/>
                        <circle cx="45" cy="110" r="4" fill="#f97316"/>
                        <circle cx="45" cy="135" r="4" fill="#f97316"/>
                        <circle cx="45" cy="160" r="4" fill="#f97316"/>
                        <circle cx="45" cy="185" r="4" fill="#f97316"/>
                        <rect x="356" y="12" width="32" height="236" fill="#9a3412" opacity="0.75"/>
                        <line x1="372" y1="12" x2="372" y2="248" stroke="rgba(255,255,255,0.4)" stroke-dasharray="6 6" stroke-width="1.5"/>
                    </svg>

                    <button type="button" onclick="window.selectTrainingStation('shooting')" id="map-pin-shooting" class="cursor-pointer absolute top-3 left-[44%] -translate-x-1/2 px-3 py-1.5 rounded-lg bg-[#143321] text-white border-2 border-[#eab308] shadow-md flex items-center gap-2 transition transform scale-105 z-20">
                        <span class="w-6 h-6 rounded bg-[#eab308] text-[#07190e] flex items-center justify-center font-bold pointer-events-none">${ICONS.target}</span>
                        <div class="text-left leading-none pointer-events-none">
                            <span id="pin-title-shooting" class="font-sport text-xs font-black uppercase text-[#eab308] block">1. Şut & Frikik</span>
                            <span class="font-led text-[10px]">ŞUT: <strong id="station-stat-shoot">60</strong></span>
                        </div>
                    </button>

                    <button type="button" onclick="window.selectTrainingStation('playmaking')" id="map-pin-playmaking" class="cursor-pointer absolute top-[50%] left-[44%] -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#f5f1e4] text-[#143321] border-2 border-[#143321] shadow-md flex items-center gap-2 transition z-10">
                        <span class="w-6 h-6 rounded bg-[#143321] text-white flex items-center justify-center pointer-events-none">${ICONS.ball}</span>
                        <div class="text-left leading-none pointer-events-none">
                            <span id="pin-title-playmaking" class="font-sport text-xs font-black uppercase text-[#143321] block">2. Pas & Vizyon</span>
                            <span class="font-led text-[10px]">PAS: <strong id="station-stat-pass">60</strong></span>
                        </div>
                    </button>

                    <button type="button" onclick="window.selectTrainingStation('dribbling')" id="map-pin-dribbling" class="cursor-pointer absolute bottom-14 left-3 px-2.5 py-1.5 rounded-lg bg-[#f5f1e4] text-[#143321] border-2 border-[#143321] shadow-md flex items-center gap-1.5 transition z-10">
                        <span class="w-6 h-6 rounded bg-[#143321] text-white flex items-center justify-center pointer-events-none">${ICONS.bolt}</span>
                        <div class="text-left leading-none pointer-events-none">
                            <span id="pin-title-dribbling" class="font-sport text-xs font-black uppercase text-[#143321] block">3. Slalom Çalım</span>
                            <span class="font-led text-[10px]">ÇALIM: <strong id="station-stat-drib">60</strong></span>
                        </div>
                    </button>

                    <button type="button" onclick="window.selectTrainingStation('heavy_camp')" id="map-pin-heavy_camp" class="cursor-pointer absolute bottom-14 right-2.5 px-2.5 py-1.5 rounded-lg bg-[#f5f1e4] text-[#143321] border-2 border-[#143321] shadow-md flex items-center gap-1.5 transition z-10">
                        <span class="w-6 h-6 rounded bg-[#143321] text-white flex items-center justify-center pointer-events-none">${ICONS.dumbbell}</span>
                        <div class="text-left leading-none pointer-events-none">
                            <span id="pin-title-heavy_camp" class="font-sport text-xs font-black uppercase text-[#143321] block">4. Fizik Kampı</span>
                            <span class="font-led text-[10px]">FİZİK: <strong id="station-stat-phys">60</strong></span>
                        </div>
                    </button>

                    <div class="absolute bottom-0 inset-x-0 bg-[#0d2417]/95 border-t-2 border-white/30 px-3 py-1.5 flex items-center justify-between z-20">
                        <span class="text-[11px] font-bold text-emerald-200">Kulüp Reviri & Fizyoterapi</span>
                        <button type="button" onclick="restBeforeMatch()" class="train-drill-btn px-3 py-1 rounded bg-[#eab308] text-[#07190e] font-sport text-xs font-black uppercase tracking-wide">
                            İdman Yapma • Dinlen (+35 Kond, +1 Odak)
                        </button>
                    </div>
                </div>

                <div class="board-panel p-3.5 bg-[#f5f1e4]">
                    <div class="flex justify-between items-start gap-2 pb-2 mb-2 border-b border-[#143321]/15">
                        <div>
                            <span id="training-stage-title" class="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">1. İSTASYON • KUZEY KALE (FALSOLU SAPAN ŞUT)</span>
                            <h3 id="minigame-preview-heading" class="font-sport text-xl font-black text-[#143321] uppercase leading-tight">Şut & Bitiricilik Minigame</h3>
                        </div>
                        <div class="text-right shrink-0">
                            <span id="minigame-cost-pill" class="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 font-led text-[11px] font-bold">-15 Kondisyon</span>
                        </div>
                    </div>

                    <p id="minigame-preview-desc" class="text-xs font-bold text-slate-600 leading-snug mb-3">
                        Topun altındaki geniş çekme alanını kullanarak geriye çek ve falso ver! 3 şutta en az 2 gol = +1 Bitiricilik.
                    </p>

                    <div class="flex items-center justify-between gap-3">
                        <div class="text-[11px] font-extrabold text-[#143321]">
                            <span class="text-slate-500 block text-[10px] uppercase">Gelişim Hedefi</span>
                            <span id="minigame-reward-pill" class="text-emerald-800">2/3 Golde: +1 Bitiricilik (Şut)</span>
                        </div>
                        <button type="button" id="btn-launch-selected-drill" onclick="window.startSelectedTrainingStation()" class="px-6 py-2.5 sport-btn-green font-sport text-base font-black uppercase tracking-wider shrink-0">
                            ŞUT İDMANINA BAŞLA
                        </button>
                    </div>
                </div>
            `;
        }
    }

    const _origGoalBanner = window.triggerMatchGoalBanner;
    window.triggerMatchGoalBanner = function (teamObj, isHomeGoal, scorerText, currentH, currentA) {
        SFX.matchGoal(isHomeGoal);
        if (_origGoalBanner) _origGoalBanner(teamObj, isHomeGoal, scorerText, currentH, currentA);
    };

    const _origFinishMatch = window.finishMatchAndSave;
    window.finishMatchAndSave = function (fromQuickSim = false) {
        SFX.stopAllMatchSounds();
        if (_origFinishMatch) _origFinishMatch(fromQuickSim);
    };

    // =====================================================================
    // 4. BÜYÜTÜLMÜŞ ANTRENMAN MİNİGAME MOTORU (360x400 SAHA)
    // - Top Y=285'te durur, altında 115px boş sapan çekme alanı vardır!
    // - Falso (Curve): -1 (Sol Kavis), 0 (Düz), +1 (Sağ Kavis). Vizyon/Şut statı falsonun keskinliğini artırır!
    // - NSS Slalom: Parmağınla beyaz oyuncuyu doğrudan sağa/sola/ileri sürükleyerek anlık kontrol edersin!
    // =====================================================================
    let activeMgLoop = null;
    let currentMgMode = 'shooting';
    let mgAttemptsLeft = 3;
    let mgSuccessCount = 0;
    let mgState = 'ready';
    let mgDragStart = null;
    let mgDragCurrent = null;
    let shotCurveDir = 0; // -1: Sol Falso, 0: Düz, 1: Sağ Falso

    // 1 & 2. Şut ve Pas Topu (Y=285 -> Altında 115px rahat çekme alanı!)
    const mgBall = { x: 180, y: 285, r: 10, vx: 0, vy: 0, spinAx: 0 };
    const mgKeeper = { x: 180, y: 74, w: 40, h: 16, vx: 2.3 };
    const passTarget = { x: 180, y: 65, r: 24 };
    let passMannequins = [];

    // 3. Gerçek NSS Anlık Sürüklemeli Slalom Parkuru
    const nssPlayer = { x: 180, y: 80, r: 12, dragging: false };
    let nssGates = [];
    let nssCurrentGate = 0;
    let nssTimeLeft = 900; // 15 saniye süre

    // 4. Fizik Kampı
    const physBar = {
        markerY: 190, markerVy: 0,
        zoneY: 140, zoneH: 85, phase: 0,
        progress: 35, timeLeft: 840, holding: false
    };

    window.setShotCurve = function (dir) {
        shotCurveDir = dir;
        const bLeft = document.getElementById('curve-btn-left');
        const bNone = document.getElementById('curve-btn-none');
        const bRight = document.getElementById('curve-btn-right');
        if (!bLeft) return;

        const activeCls = "px-2.5 py-1 rounded bg-[#143321] text-[#eab308] border border-[#143321] font-sport text-xs font-black";
        const idleCls = "px-2 py-1 rounded bg-white border border-[#143321] font-sport text-xs font-black text-[#143321]";

        bLeft.className = dir === -1 ? activeCls : idleCls;
        bNone.className = dir === 0 ? activeCls : idleCls;
        bRight.className = dir === 1 ? activeCls : idleCls;
    };

    window.startSelectedTrainingStation = function () {
        if (typeof gameData === 'undefined' || !gameData) return;
        if (gameData.trainedThisWeek) {
            window.showGameToast("Bu haftaki antrenman hakkını zaten kullandın!", "warn");
            return;
        }

        const type = window.selectedStationType || 'shooting';
        const cost = type === 'heavy_camp' ? 26 : 15;
        if (gameData.energy < cost) {
            window.showGameToast(`Antrenman için en az %${cost} kondisyon gerekli! Revirde dinlen.`, "warn");
            return;
        }

        gameData.energy -= cost;
        gameData.trainedThisWeek = true;
        window.updateGameHubUI();

        openTrainingMinigame(type);
    };

    function openTrainingMinigame(type) {
        currentMgMode = type;
        mgAttemptsLeft = 3;
        mgSuccessCount = 0;
        window.setShotCurve(0);

        document.getElementById('btn-finish-mg').classList.add('hidden');
        const boostBtn = document.getElementById('btn-physic-boost');
        const curvePanel = document.getElementById('mg-curve-controls');

        if (type === 'shooting') {
            document.getElementById('mg-modal-title').innerText = "1. ŞUT & BİTİRİCİLİK (FALSOLU SAPAN)";
            document.getElementById('mg-modal-status').innerText = "Topu aşağıdaki geniş alana doğru çek! İstersen alttan Falso (Kavis) seç.";
            document.getElementById('mg-modal-hint').innerText = `Şut Yeteneğin (${gameData.stats.shoot}) falso keskinliğini artırır`;
            boostBtn.classList.add('hidden');
            curvePanel.classList.remove('hidden');
            resetShootingRound();
        } else if (type === 'playmaking') {
            document.getElementById('mg-modal-title').innerText = "2. VİZYON & FALSOLU KİLİT PAS";
            document.getElementById('mg-modal-status').innerText = "Baraj önünü kapatıyorsa SOLA veya SAĞA KAVİS seçip topu barajın etrafından bük!";
            document.getElementById('mg-modal-hint').innerText = `Vizyon Yeteneğin (${gameData.stats.pass}) falso kavisini güçlendirir`;
            boostBtn.classList.add('hidden');
            curvePanel.classList.remove('hidden');
            resetPassingRound();
        } else if (type === 'dribbling') {
            document.getElementById('mg-modal-title').innerText = "3. NSS ANLIK SLALOM PARKURU";
            document.getElementById('mg-modal-status').innerText = "Beyaz oyuncunun üstüne basılı tutup parmağını nereye sürersen anlık oraya gider!";
            document.getElementById('mg-modal-hint').innerText = "Süre bitmeden 5 duba kapısının tamamından geç = +1 Top Sürme";
            boostBtn.classList.add('hidden');
            curvePanel.classList.add('hidden');
            resetDribblingCourse();
        } else {
            document.getElementById('mg-modal-title').innerText = "4. FİZİK & DAYANIKLILIK KAMPI";
            document.getElementById('mg-modal-status').innerText = "Alttaki sarı butona basılı tutarak imleci yumuşak kayan Yeşil Bölgede tut!";
            document.getElementById('mg-modal-hint').innerText = "Barı %85 üstüne çıkar = +1 Fizik & +14 Güven";
            boostBtn.classList.remove('hidden');
            curvePanel.classList.add('hidden');
            resetPhysicRound();
        }

        updateMgModalHeader();
        document.getElementById('training-minigame-modal').classList.remove('hidden');
        bindUnifiedMinigameEvents();

        if (activeMgLoop) cancelAnimationFrame(activeMgLoop);
        runUnifiedMinigameLoop();
    }

    function updateMgModalHeader() {
        if (currentMgMode === 'heavy_camp') {
            document.getElementById('mg-modal-balls').innerText = `SÜRE: ${Math.ceil(physBar.timeLeft / 60)}sn`;
            document.getElementById('mg-modal-score').innerText = `TEMPO: %${Math.round(physBar.progress)}`;
        } else if (currentMgMode === 'dribbling') {
            document.getElementById('mg-modal-balls').innerText = `SÜRE: ${Math.ceil(nssTimeLeft / 60)}sn`;
            document.getElementById('mg-modal-score').innerText = `KAPI: ${nssCurrentGate} / 5`;
        } else {
            const ballsStr = "●".repeat(mgAttemptsLeft) + "○".repeat(3 - mgAttemptsLeft);
            document.getElementById('mg-modal-balls').innerText = `HAK: ${ballsStr}`;
            document.getElementById('mg-modal-score').innerText = `BAŞARI: ${mgSuccessCount} / 3`;
        }
    }

    function resetShootingRound() {
        mgBall.x = 180; mgBall.y = 285; mgBall.r = 10; mgBall.vx = 0; mgBall.vy = 0; mgBall.spinAx = 0;
        mgKeeper.x = 180; mgKeeper.y = 74;
        mgKeeper.vx = (Math.random() < 0.5 ? 1 : -1) * 2.25;
        mgState = 'ready';
        mgDragStart = null; mgDragCurrent = null;
    }

    function resetPassingRound() {
        mgBall.x = 180; mgBall.y = 290; mgBall.r = 9.5; mgBall.vx = 0; mgBall.vy = 0; mgBall.spinAx = 0;
        passTarget.x = 80 + Math.random() * 200;
        passTarget.y = 62 + Math.random() * 25;

        // 2 veya 3 sarı antrenman mankeni (Biri hedefin önünü kapatsa bile falsoyla etrafından rahatça dönülür!)
        passMannequins = [
            { x: passTarget.x + (Math.random() * 30 - 15), y: 155 + Math.random() * 25, w: 24, h: 34 },
            { x: 75 + Math.random() * 90, y: 205 + Math.random() * 20, w: 24, h: 34 },
            { x: 195 + Math.random() * 90, y: 190 + Math.random() * 25, w: 24, h: 34 }
        ];
        mgState = 'ready';
        mgDragStart = null; mgDragCurrent = null;
    }

    function resetDribblingCourse() {
        nssPlayer.x = 180; nssPlayer.y = 70; nssPlayer.dragging = false;
        nssCurrentGate = 0;
        nssTimeLeft = 900; // 15 saniye
        nssGates = [
            { y: 190, centerX: 110, width: 78, passed: false },
            { y: 330, centerX: 250, width: 78, passed: false },
            { y: 470, centerX: 115, width: 76, passed: false },
            { y: 610, centerX: 245, width: 76, passed: false },
            { y: 750, centerX: 180, width: 84, passed: false }
        ];
        mgState = 'moving';
    }

    function resetPhysicRound() {
        physBar.markerY = 195;
        physBar.markerVy = 0;
        physBar.zoneY = 140;
        physBar.phase = 0;
        physBar.progress = 35;
        physBar.timeLeft = 840;
        physBar.holding = false;
        mgState = 'moving';
    }

    // Vizyon veya Şut özelliğine göre falso ivmesi çarpanı
    function getCurveStrength() {
        if (!shotCurveDir || typeof gameData === 'undefined' || !gameData) return 0;
        const statVal = currentMgMode === 'playmaking' ? gameData.stats.pass : gameData.stats.shoot;
        // Stat 60 iken 0.14, Stat 80 iken 0.22 kavis ivmesi verir
        const baseSpin = 0.11 + Math.max(0, statVal - 50) * 0.0028;
        return shotCurveDir * baseSpin;
    }

    let unifiedEventsBound = false;
    function bindUnifiedMinigameEvents() {
        if (unifiedEventsBound) return;
        unifiedEventsBound = true;
        const cvs = document.getElementById('trainingMinigameCanvas');
        const boostBtn = document.getElementById('btn-physic-boost');
        if (!cvs) return;

        function getPos(e) {
            const rect = cvs.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (cvs.width / rect.width),
                y: (clientY - rect.top) * (cvs.height / rect.height)
            };
        }

        function onDown(e) {
            const pos = getPos(e);
            if (currentMgMode === 'heavy_camp') {
                physBar.holding = true;
                return;
            }
            if (currentMgMode === 'dribbling') {
                // NSS Slalom: Parmağı dokunduğu an doğrudan oyuncuyu kontrol etmeye başlar!
                nssPlayer.dragging = true;
                mgDragCurrent = pos;
                return;
            }
            if (mgState !== 'ready') return;
            if (Math.hypot(pos.x - mgBall.x, pos.y - mgBall.y) < 65) {
                mgDragStart = { x: mgBall.x, y: mgBall.y };
                mgDragCurrent = pos;
            }
        }

        function onMove(e) {
            if (currentMgMode === 'dribbling' && nssPlayer.dragging) {
                e.preventDefault();
                mgDragCurrent = getPos(e);
                return;
            }
            if (!mgDragStart) return;
            e.preventDefault();
            mgDragCurrent = getPos(e);
        }

        function onUp() {
            physBar.holding = false;
            nssPlayer.dragging = false;

            if ((currentMgMode === 'shooting' || currentMgMode === 'playmaking') && mgDragStart && mgDragCurrent && mgState === 'ready') {
                const pullDx = mgDragCurrent.x - mgDragStart.x;
                const pullDy = mgDragCurrent.y - mgDragStart.y;
                const pullDist = Math.hypot(pullDx, pullDy);

                // Artık 55 piksel çekmek bile %100 Maksimum Güç verir!
                if (pullDy > 10 && pullDist > 12) {
                    SFX.kick();
                    const powerRatio = Math.min(1.35, Math.max(0.65, pullDist / 52));
                    const baseSpeed = currentMgMode === 'shooting' ? 10.5 : 9.2;
                    const angle = Math.atan2(-pullDy, -pullDx);
                    mgBall.vx = Math.cos(angle) * baseSpeed * powerRatio;
                    mgBall.vy = Math.sin(angle) * baseSpeed * powerRatio;
                    mgBall.spinAx = getCurveStrength();
                    mgState = 'moving';
                } else {
                    document.getElementById('mg-modal-status').innerText = "Topu aşağıdaki çekme alanına doğru biraz daha çekip bırak!";
                }
            }
            mgDragStart = null;
            mgDragCurrent = null;
        }

        cvs.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove); // Parmağın/farenin çerçeve dışına taşmasını da algılar!
        window.addEventListener('mouseup', onUp);

        cvs.addEventListener('touchstart', onDown, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onUp);

        if (boostBtn) {
            boostBtn.addEventListener('mousedown', () => { physBar.holding = true; });
            boostBtn.addEventListener('touchstart', (e) => { e.preventDefault(); physBar.holding = true; }, { passive: false });
        }
    }

    function runUnifiedMinigameLoop() {
        const cvs = document.getElementById('trainingMinigameCanvas');
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        const W = cvs.width, H = cvs.height;

        if (currentMgMode === 'shooting') renderShootingFrame(ctx, W, H);
        else if (currentMgMode === 'playmaking') renderPassingFrame(ctx, W, H);
        else if (currentMgMode === 'dribbling') renderDribblingFrame(ctx, W, H);
        else renderPhysicFrame(ctx, W, H);

        activeMgLoop = requestAnimationFrame(runUnifiedMinigameLoop);
    }

    // Falsolu yörünge önizleme noktalarını çizen yardımcı fonksiyon
    function drawCurvedAimTrajectory(ctx, startX, startY, pullDx, pullDy, color) {
        const pullDist = Math.hypot(pullDx, pullDy);
        const powerRatio = Math.min(1.35, Math.max(0.65, pullDist / 52));
        const baseSpeed = currentMgMode === 'shooting' ? 10.5 : 9.2;
        const angle = Math.atan2(-pullDy, -pullDx);

        let simX = startX;
        let simY = startY;
        let simVx = Math.cos(angle) * baseSpeed * powerRatio;
        let simVy = Math.sin(angle) * baseSpeed * powerRatio;
        const spin = getCurveStrength();

        ctx.fillStyle = color;
        for (let step = 1; step <= 20; step++) {
            simVx += spin;
            simX += simVx;
            simY += simVy;
            if (step % 2 === 0) {
                ctx.beginPath();
                ctx.arc(simX, simY, Math.max(2, 4.5 - step * 0.12), 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // --- 1. ŞUT SAHNESİ (360x400 + FALSOLU SAPAN) ---
    function renderShootingFrame(ctx, W, H) {
        ctx.fillStyle = '#1b5e34'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#144928'; ctx.fillRect(0, 0, W, 66);
        for (let y = 66; y < H; y += 40) {
            ctx.fillStyle = (Math.floor(y / 40) % 2 === 0) ? '#1e683a' : '#195c31';
            ctx.fillRect(0, y, W, 40);
        }

        // Alt Geri Çekme (Sapan) Bölgesi Rehberi
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 305, W, H - 305);
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = '800 10px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▼ TOPU BU ALANA DOĞRU ÇEKİP BIRAK ▼', W / 2, 385);

        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
        ctx.strokeRect(30, 66, W - 60, 160);

        // Kale & Ağlar
        ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(64, 22, 232, 70);
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
        for (let gx = 64; gx <= 296; gx += 14) { ctx.beginPath(); ctx.moveTo(gx, 22); ctx.lineTo(gx, 92); ctx.stroke(); }
        for (let gy = 22; gy <= 92; gy += 12) { ctx.beginPath(); ctx.moveTo(64, gy); ctx.lineTo(296, gy); ctx.stroke(); }

        // Köşe Hedef Halkaları
        [{ x: 90, y: 44, r: 16 }, { x: 270, y: 44, r: 16 }, { x: 94, y: 80, r: 14 }, { x: 266, y: 80, r: 14 }].forEach(t => {
            ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
            ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
        });

        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(64, 92); ctx.lineTo(64, 22); ctx.lineTo(296, 22); ctx.lineTo(296, 92); ctx.stroke();

        // Kaleci
        if (mgState === 'ready') {
            mgKeeper.x += mgKeeper.vx;
            if (mgKeeper.x > 258 || mgKeeper.x < 102) mgKeeper.vx *= -1;
        } else if (mgState === 'moving') {
            const kSpd = Math.max(2.2, 3.7 - (gameData.stats.shoot - 58) * 0.04);
            if (mgKeeper.x < mgBall.x - 6) mgKeeper.x = Math.min(272, mgKeeper.x + kSpd);
            if (mgKeeper.x > mgBall.x + 6) mgKeeper.x = Math.max(88, mgKeeper.x - kSpd);
        }

        ctx.fillStyle = '#ef4444'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(mgKeeper.x - 20, mgKeeper.y - 8, 40, 16, 5); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(mgKeeper.x, mgKeeper.y - 10, 6.5, 0, Math.PI * 2); ctx.fillStyle = '#f1c27d'; ctx.fill(); ctx.stroke();

        // Falsolu Sapan Yörüngesi & Güç Yüzdesi
        if (mgState === 'ready' && mgDragStart && mgDragCurrent) {
            const pullDx = mgDragCurrent.x - mgDragStart.x;
            const pullDy = Math.max(0, mgDragCurrent.y - mgDragStart.y);
            const pullDist = Math.min(55, Math.hypot(pullDx, pullDy));
            const powerPct = Math.round((pullDist / 55) * 100);

            ctx.beginPath();
            ctx.moveTo(mgBall.x, mgBall.y);
            ctx.lineTo(mgBall.x + pullDx, mgBall.y + pullDy);
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.stroke();

            drawCurvedAimTrajectory(ctx, mgBall.x, mgBall.y, pullDx, pullDy, '#eab308');

            ctx.fillStyle = '#eab308';
            ctx.font = '900 12px Nunito, sans-serif';
            ctx.fillText(`GÜÇ: %${powerPct}`, mgBall.x + 42, mgBall.y + 8);
        }

        if (mgState === 'moving') {
            mgBall.vx += mgBall.spinAx; // Falso etkisi!
            mgBall.x += mgBall.vx;
            mgBall.y += mgBall.vy;
            mgBall.r = Math.max(5.8, mgBall.r - 0.09);

            const saved = Math.abs(mgBall.x - mgKeeper.x) < 23 && Math.abs(mgBall.y - mgKeeper.y) < 16;
            const hitPost = (Math.abs(mgBall.x - 64) < 6 || Math.abs(mgBall.x - 296) < 6) && mgBall.y <= 92 && mgBall.y >= 20;

            if (saved) {
                mgState = 'wait'; mgAttemptsLeft--;
                SFX.kick();
                document.getElementById('mg-modal-status').innerText = "KALECİ KURTARDI! Falsolu köşe vuruşu dene.";
                updateMgModalHeader();
                setTimeout(() => checkRoundEnd(resetShootingRound), 850);
            } else if (hitPost) {
                mgState = 'wait'; mgAttemptsLeft--;
                SFX.post();
                document.getElementById('mg-modal-status').innerText = "DİREKTEN DÖNDÜ! Çok yaklaştın.";
                updateMgModalHeader();
                setTimeout(() => checkRoundEnd(resetShootingRound), 850);
            } else if (mgBall.y <= 58 && mgBall.x > 67 && mgBall.x < 293) {
                mgState = 'wait'; mgAttemptsLeft--; mgSuccessCount++;
                SFX.netSwish();
                document.getElementById('mg-modal-status').innerText = "AĞLARDA! Muhteşem falsolu bitiriş!";
                updateMgModalHeader();
                setTimeout(() => checkRoundEnd(resetShootingRound), 850);
            } else if (mgBall.y < 18 || mgBall.x < 10 || mgBall.x > W - 10) {
                mgState = 'wait'; mgAttemptsLeft--;
                document.getElementById('mg-modal-status').innerText = "AUT! Top dışarı gitti.";
                updateMgModalHeader();
                setTimeout(() => checkRoundEnd(resetShootingRound), 850);
            }
        }

        ctx.beginPath(); ctx.arc(mgBall.x, mgBall.y, mgBall.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#0f172a'; ctx.stroke();
    }

    // --- 2. PAS SAHNESİ (360x400 + VİZYON DESTEKLİ FALSOLU KİLİT PAS) ---
    function renderPassingFrame(ctx, W, H) {
        ctx.fillStyle = '#17522c'; ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#1e683a';
        ctx.beginPath();
        ctx.moveTo(50, 20); ctx.lineTo(W - 50, 20);
        ctx.lineTo(W - 12, H - 10); ctx.lineTo(12, H - 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.stroke();

        // Alt Sapan Çekme Alanı
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 310, W, H - 310);
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = '800 10px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▼ GERİYE ÇEK & BARAJIN ETRAFINDAN FALSO VER ▼', W / 2, 385);

        // Sabit Pas Hedef Çemberi
        ctx.beginPath(); ctx.arc(passTarget.x, passTarget.y, passTarget.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.38)'; ctx.fill();
        ctx.strokeStyle = '#eab308'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.arc(passTarget.x, passTarget.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#eab308'; ctx.fill();

        // Sarı Antrenman Baraj Mankenleri
        passMannequins.forEach(m => {
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.fillRect(m.x - m.w / 2, m.y + m.h / 2 - 3, m.w, 6);
            ctx.fillStyle = '#eab308';
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(m.x - m.w / 2, m.y - m.h / 2, m.w, m.h, 4);
            ctx.fill(); ctx.stroke();
            ctx.beginPath();
            ctx.arc(m.x, m.y - m.h / 2 - 5, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = '#eab308'; ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(m.x - m.w / 2 + 2, m.y - 4, m.w - 4, 5);
        });

        // Falsolu Kavisli Pas Yörüngesi Önizlemesi!
        if (mgState === 'ready' && mgDragStart && mgDragCurrent) {
            const pullDx = mgDragCurrent.x - mgDragStart.x;
            const pullDy = Math.max(0, mgDragCurrent.y - mgDragStart.y);
            ctx.beginPath();
            ctx.moveTo(mgBall.x, mgBall.y);
            ctx.lineTo(mgBall.x + pullDx, mgBall.y + pullDy);
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.stroke();

            drawCurvedAimTrajectory(ctx, mgBall.x, mgBall.y, pullDx, pullDy, '#38bdf8');
        }

        if (mgState === 'moving') {
            mgBall.vx += mgBall.spinAx; // Vizyon yeteneğiyle güçlenen falso!
            mgBall.x += mgBall.vx;
            mgBall.y += mgBall.vy;

            const hitMannequin = passMannequins.some(m =>
                Math.abs(mgBall.x - m.x) < (m.w / 2 + mgBall.r - 3) &&
                Math.abs(mgBall.y - m.y) < (m.h / 2 + mgBall.r - 3)
            );
            const hitTarget = Math.hypot(mgBall.x - passTarget.x, mgBall.y - passTarget.y) < (passTarget.r + 5);

            if (hitMannequin) {
                mgState = 'wait'; mgAttemptsLeft--;
                SFX.post();
                document.getElementById('mg-modal-status').innerText = "BARAJA ÇARPTI! Alttan Sola/Sağa Kavis seçerek etrafından dolaştır.";
                updateMgModalHeader();
                setTimeout(() => checkRoundEnd(resetPassingRound), 850);
            } else if (hitTarget) {
                mgState = 'wait'; mgAttemptsLeft--; mgSuccessCount++;
                SFX.netSwish();
                document.getElementById('mg-modal-status').innerText = "HARİKA FALSOLU PAS! Tam hedefe oturdu!";
                updateMgModalHeader();
                setTimeout(() => checkRoundEnd(resetPassingRound), 850);
            } else if (mgBall.y < 12 || mgBall.x < 10 || mgBall.x > W - 10) {
                mgState = 'wait'; mgAttemptsLeft--;
                document.getElementById('mg-modal-status').innerText = "DIŞARI GİTTİ! Kavis açısını biraz daha hedefe yaklaştır.";
                updateMgModalHeader();
                setTimeout(() => checkRoundEnd(resetPassingRound), 850);
            }
        }

        ctx.beginPath(); ctx.arc(mgBall.x, mgBall.y, mgBall.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#0f172a'; ctx.stroke();
    }

    // --- 3. GERÇEK NSS ANLIK SLALOM SİSTEMİ (PARMAĞINLA DOĞRUDAN SÜRÜKLEME!) ---
    function renderDribblingFrame(ctx, W, H) {
        const camY = nssPlayer.y - 85;

        for (let y = -100; y < 950; y += 40) {
            const screenY = H - (y - camY);
            if (screenY < -40 || screenY > H + 40) continue;
            ctx.fillStyle = (Math.floor(y / 40) % 2 === 0) ? '#1e683a' : '#195c31';
            ctx.fillRect(0, screenY - 40, W, 40);
        }

        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3;
        ctx.strokeRect(22, 0, W - 44, H);

        // 5 Duba Kapısını Çiz
        nssGates.forEach((g, idx) => {
            const sy = H - (g.y - camY);
            const leftConeX = g.centerX - g.width / 2;
            const rightConeX = g.centerX + g.width / 2;

            ctx.beginPath();
            ctx.moveTo(leftConeX, sy);
            ctx.lineTo(rightConeX, sy);
            ctx.strokeStyle = g.passed ? '#22c55e' : (idx === nssCurrentGate ? '#eab308' : 'rgba(255,255,255,0.3)');
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            [leftConeX, rightConeX].forEach(cx => {
                ctx.beginPath();
                ctx.arc(cx, sy, 10, 0, Math.PI * 2);
                ctx.fillStyle = g.passed ? '#22c55e' : '#f97316';
                ctx.fill();
                ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
            });

            ctx.fillStyle = '#ffffff';
            ctx.font = '800 11px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`KAPI ${idx + 1}`, g.centerX, sy - 12);
        });

        const playerScreenY = H - (nssPlayer.y - camY);

        if (mgState === 'moving') {
            nssTimeLeft--;
            updateMgModalHeader();

            if (nssTimeLeft <= 0) {
                mgState = 'done';
                document.getElementById('mg-modal-status').innerText = `Süre doldu (${nssCurrentGate}/5 Kapı). Daha hızlı slalom yapmalısın!`;
                document.getElementById('btn-finish-mg').classList.remove('hidden');
            }

            // NSS ANLIK PARMAK TAKİBİ: Parmağını nereye sürersen oyuncu o yöne anında top sürer!
            if (nssPlayer.dragging && mgDragCurrent) {
                const dx = mgDragCurrent.x - nssPlayer.x;
                const dy = playerScreenY - mgDragCurrent.y; // Yukarı sürükledikçe ileri (y+) gider
                const dist = Math.hypot(dx, dy);

                const maxSpd = 3.4 + Math.max(0, gameData.stats.dribble - 55) * 0.05;
                if (dist > 3) {
                    const moveX = (dx / dist) * Math.min(maxSpd, dist * 0.22);
                    const moveY = (dy / dist) * Math.min(maxSpd, dist * 0.22);
                    const prevY = nssPlayer.y;

                    nssPlayer.x = Math.max(34, Math.min(W - 34, nssPlayer.x + moveX));
                    nssPlayer.y = Math.max(40, nssPlayer.y + moveY);

                    // Sıradaki kapı kontrolü
                    if (nssCurrentGate < nssGates.length) {
                        const gate = nssGates[nssCurrentGate];
                        const leftConeX = gate.centerX - gate.width / 2;
                        const rightConeX = gate.centerX + gate.width / 2;

                        // Dubaya çarptıysa hafif geri iter
                        if (Math.hypot(nssPlayer.x - leftConeX, nssPlayer.y - gate.y) < 19 || Math.hypot(nssPlayer.x - rightConeX, nssPlayer.y - gate.y) < 19) {
                            SFX.post();
                            nssPlayer.y -= 14;
                            document.getElementById('mg-modal-status').innerText = "DUBAYA ÇARPTIN! İki dubanın ortasından sür.";
                        } else if (prevY <= gate.y && nssPlayer.y >= gate.y) {
                            if (nssPlayer.x > leftConeX + 6 && nssPlayer.x < rightConeX - 6) {
                                gate.passed = true;
                                nssCurrentGate++;
                                SFX.netSwish();
                                updateMgModalHeader();
                                document.getElementById('mg-modal-status').innerText = nssCurrentGate < 5
                                    ? `HARİKA! Şimdi ${nssCurrentGate + 1}. Kapıya yönel!`
                                    : "5 KAPININ TAMAMINI GEÇTİN!";

                                if (nssCurrentGate >= 5) {
                                    mgState = 'done';
                                    gameData.stats.dribble += 1;
                                    saveCurrentGame();
                                    window.updateGameHubUI();
                                    triggerFloatingBadge("+1 TOP SÜRME (ÇALIM)!", "#7c3aed");
                                    document.getElementById('btn-finish-mg').classList.remove('hidden');
                                }
                            } else {
                                nssPlayer.y = gate.y - 18;
                                document.getElementById('mg-modal-status').innerText = `${nssCurrentGate + 1}. Kapının içinden geçmelisin!`;
                            }
                        }
                    }
                }
            }
        }

        // Beyaz NSS Oyuncu İkonu & Önündeki Top
        ctx.beginPath();
        ctx.arc(nssPlayer.x, playerScreenY, nssPlayer.r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(nssPlayer.x, playerScreenY, nssPlayer.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        // Oyuncunun ayağındaki küçük top
        ctx.beginPath();
        ctx.arc(nssPlayer.x, playerScreenY - 15, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#eab308';
        ctx.fill();
        ctx.stroke();
    }

    // --- 4. FİZİK KAMPI SAHNESİ ---
    function renderPhysicFrame(ctx, W, H) {
        ctx.fillStyle = '#143321'; ctx.fillRect(0, 0, W, H);

        if (mgState === 'moving') {
            physBar.timeLeft--;
            physBar.phase += 0.024;
            physBar.zoneY = 155 + Math.sin(physBar.phase) * 85;

            if (physBar.holding) physBar.markerVy -= 0.16;
            else physBar.markerVy += 0.14;
            physBar.markerVy = Math.max(-2.6, Math.min(2.6, physBar.markerVy * 0.94));
            physBar.markerY = Math.max(30, Math.min(H - 30, physBar.markerY + physBar.markerVy));

            const inZone = physBar.markerY >= physBar.zoneY && physBar.markerY <= (physBar.zoneY + physBar.zoneH);
            if (inZone) physBar.progress = Math.min(100, physBar.progress + 0.16);
            else physBar.progress = Math.max(0, physBar.progress - 0.09);

            updateMgModalHeader();

            if (physBar.progress >= 100 || physBar.timeLeft <= 0) {
                mgState = 'done';
                const won = physBar.progress >= 85;
                const st = document.getElementById('mg-modal-status');
                if (won) {
                    gameData.stats.physic += 1;
                    gameData.coachTrust = Math.min(100, gameData.coachTrust + 14);
                    gameData.lowRatingStreak = 0;
                    saveCurrentGame();
                    window.updateGameHubUI();
                    triggerFloatingBadge("+1 FİZİK & +14% GÜVEN!", "#16a34a");
                    st.innerText = "14 SANİYELİK KAMP TAMAMLANDI! Dayanıklılık +1 ve Hoca Güveni +14% arttı!";
                } else {
                    st.innerText = `Süre bitti (%${Math.round(physBar.progress)}). Gelişim için en az %85 tempo gerekiyordu.`;
                }
                document.getElementById('btn-physic-boost').classList.add('hidden');
                document.getElementById('btn-finish-mg').classList.remove('hidden');
            }
        }

        ctx.fillStyle = '#091910'; ctx.fillRect(75, 25, 56, H - 50);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.strokeRect(75, 25, 56, H - 50);

        ctx.fillStyle = 'rgba(34, 197, 94, 0.55)';
        ctx.fillRect(77, physBar.zoneY, 52, physBar.zoneH);
        ctx.strokeStyle = '#4ade80'; ctx.strokeRect(77, physBar.zoneY, 52, physBar.zoneH);

        ctx.fillStyle = '#eab308';
        ctx.fillRect(71, physBar.markerY - 6, 64, 12);

        ctx.fillStyle = '#091910'; ctx.fillRect(210, 40, 80, H - 80);
        ctx.strokeStyle = '#eab308'; ctx.strokeRect(210, 40, 80, H - 80);
        const fillH = ((H - 84) * physBar.progress) / 100;
        ctx.fillStyle = physBar.progress >= 85 ? '#22c55e' : '#eab308';
        ctx.fillRect(212, (H - 42) - fillH, 76, fillH);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 18px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`%${Math.round(physBar.progress)}`, 250, H / 2);
    }

    function checkRoundEnd(resetFn) {
        if (mgAttemptsLeft > 0) {
            resetFn();
        } else {
            mgState = 'done';
            const st = document.getElementById('mg-modal-status');
            if (mgSuccessCount >= 2) {
                if (currentMgMode === 'shooting') {
                    gameData.stats.shoot += 1;
                    triggerFloatingBadge("+1 BİTİRİCİLİK (ŞUT)!", "#16a34a");
                    st.innerText = `TEBRİKLER! 3 denemede ${mgSuccessCount} Gol: Bitiricilik (Şut) +1 gelişti!`;
                } else if (currentMgMode === 'playmaking') {
                    gameData.stats.pass += 1;
                    gameData.coachTrust = Math.min(100, gameData.coachTrust + 5);
                    triggerFloatingBadge("+1 PAS & +5% GÜVEN!", "#2563eb");
                    st.innerText = `TEBRİKLER! ${mgSuccessCount} İsabetli Pas: Vizyon (Pas) +1 ve Hoca Güveni +5% arttı!`;
                }
                saveCurrentGame();
                window.updateGameHubUI();
            } else {
                st.innerText = `3 denemede ${mgSuccessCount} başarıda kaldın. Gelişim için en az 2 başarı gerekiyordu.`;
            }
            document.getElementById('btn-finish-mg').classList.remove('hidden');
        }
    }

    window.closeTrainingMinigame = function () {
        if (activeMgLoop) cancelAnimationFrame(activeMgLoop);
        document.getElementById('training-minigame-modal').classList.add('hidden');
        window.updateGameHubUI();
    };

    // =====================================================================
    // 5. MAÇ SİMÜLASYONU VE TÜM SEZONU SİMÜLE ET SİSTEMİ
    // =====================================================================
    let dynamicSubInMinute = null;
    let playerRestedInStands = false;

    window.openQuickSimModal = function () {
        const status = window.getPlayerMatchStatus();
        activeOpponent = window.getCurrentOpponent();

        if (status === 'rested') {
            window.showGameToast("Kondisyonun çok düşük (%18 altı)! Hoca seni kadroya almadı, maçı tribünden izledin (+25 Kond).", "info");
            const simRes = simulateRealisticAIMatch(gameData.club, activeOpponent);
            hScore = simRes.gHome;
            aScore = simRes.gAway;
            gameData.energy = Math.min(100, gameData.energy + 25);
            gameData.matches--;
            gameData.allTimeMatches--;
            window.finishMatchAndSave(true);
            return;
        }

        const costs = { safe: 12, balanced: 20, attack: 28 };
        const cost = status === 'sub' ? Math.round(costs[gameData.mentality] * 0.5) : costs[gameData.mentality];
        gameData.energy = Math.max(0, gameData.energy - cost);
        simWheelRot = 0;

        const myPower = gameData.club.power + (status === 'starter' ? (getPlayerOvr(gameData.stats) - 62) * 0.4 : 0);
        const oppPower = activeOpponent.power;
        const diff = myPower - oppPower;

        let winW = Math.max(10, Math.min(75, 42 + diff * 2.2));
        let drawW = 26;
        let lossW = Math.max(10, 100 - winW - drawW);

        simSlices = [
            { id: 'W', label: `${gameData.club.name.toUpperCase()}`, weight: winW, color: '#16a34a' },
            { id: 'D', label: 'BERABERLİK', weight: drawW, color: '#64748b' },
            { id: 'L', label: `${activeOpponent.name.toUpperCase()}`, weight: lossW, color: '#dc2626' }
        ];

        document.getElementById('sim-step-badge').innerText = status === 'sub' ? "1. ÇARK: MAÇ SONUCU (YEDEKSİN)" : "1. ÇARK: MAÇ SONUCU";
        document.getElementById('sim-desc-text').innerText = `Yeşil: ${gameData.club.name} Galibiyeti • Gri: Beraberlik • Kırmızı: ${activeOpponent.name} Galibiyeti`;
        document.getElementById('btn-cancel-sim').classList.remove('hidden');
        document.getElementById('btn-spin-sim-1').classList.remove('hidden');
        document.getElementById('btn-Next-sim-2').classList.add('hidden');
        document.getElementById('btn-spin-sim-2').classList.add('hidden');
        document.getElementById('btn-finish-sim').classList.add('hidden');

        document.getElementById('sim-wheel-modal').classList.remove('hidden');
        drawSimWheel();
        window.updateGameHubUI();
    };

    window.startMatchSimulation = function () {
        const status = window.getPlayerMatchStatus();
        activeOpponent = window.getCurrentOpponent();
        const costs = { safe: 12, balanced: 20, attack: 28 };

        SFX.whistle();
        matchMin = 0; hScore = 0; aScore = 0;
        mGoals = 0; mAssists = 0; mRating = 6.3;
        playerRestedInStands = false;

        if (status === 'rested') {
            playerRestedInStands = true;
            dynamicSubInMinute = null;
            criticalMoments = [];
            gameData.energy = Math.min(100, gameData.energy + 20);
            window.showGameToast("Yorgunluğun nedeniyle hoca seni maç kadrosuna almadı! Tribünden izliyorsun.", "info");
            document.getElementById('live-role-indicator').innerText = "KADRO DIŞI (DİNLENDİRİLİYORSUN)";
        } else if (status === 'starter') {
            gameData.energy = Math.max(0, gameData.energy - costs[gameData.mentality]);
            dynamicSubInMinute = null;
            criticalMoments = [
                Math.floor(Math.random() * 18) + 14,
                Math.floor(Math.random() * 20) + 46,
                Math.floor(Math.random() * 16) + 72
            ];
            document.getElementById('live-role-indicator').innerText = "SAHADASIN (İLK 11)";
        } else {
            const subChance = Math.min(0.82, Math.max(0.45, (gameData.coachTrust / 100) * 0.9));
            if (Math.random() < subChance) {
                gameData.energy = Math.max(0, gameData.energy - Math.round(costs[gameData.mentality] * 0.55));
                dynamicSubInMinute = 52 + Math.floor(Math.random() * 15) * 2;
                criticalMoments = dynamicSubInMinute <= 64
                    ? [dynamicSubInMinute + 4 + Math.floor(Math.random() * 6), Math.min(88, dynamicSubInMinute + 16)]
                    : [Math.min(89, dynamicSubInMinute + 4 + Math.floor(Math.random() * 5))];
            } else {
                playerRestedInStands = true;
                dynamicSubInMinute = null;
                criticalMoments = [];
                gameData.energy = Math.min(100, gameData.energy + 10);
            }
            document.getElementById('live-role-indicator').innerText = "YEDEK KULÜBESİ (FORMA BEKLİYORSUN)";
        }

        penaltyMomentMinute = (!playerRestedInStands && gameData.nextMatchPenaltyDuty)
            ? (status === 'starter' ? (Math.floor(Math.random() * 30) + 32) : (dynamicSubInMinute ? Math.min(88, dynamicSubInMinute + 2) : null))
            : null;

        document.getElementById('tab-content-hub').classList.add('hidden');
        document.getElementById('game-bottom-nav').classList.add('hidden');
        document.getElementById('tab-content-match').classList.remove('hidden');
        document.getElementById('btn-end-match').classList.add('hidden');

        document.getElementById('live-home-name').innerText = gameData.club.name;
        document.getElementById('live-home-crest').innerHTML = generateClubCrestSVG(gameData.club.c1, gameData.club.c2, 20);
        document.getElementById('live-away-name').innerText = activeOpponent.name;
        document.getElementById('live-away-crest').innerHTML = generateClubCrestSVG(activeOpponent.c1, activeOpponent.c2, 20);
        document.getElementById('match-feed-list').innerHTML = '';

        initTacticalPitch();
        stopTacticalPitch();
        renderTacticalPitchFrame();

        const startMsg = status === 'rested'
            ? "Kondisyonun düşük olduğu için hoca seni kadroya almadı. Maçı tribünden takip ediyorsun."
            : (status === 'starter' ? "Hakem düdüğü çaldı, maça İlk 11'de başladın!" : "Maç başladı. Yedek kulübesinde hocadan şans bekliyorsun.");
        pushMatchFeed(1, startMsg, "text-slate-700");
        refreshLiveMatchUI();
        window.updateGameHubUI();
        window.continueMatchClock();
    };

    function showSubstitutionAnimation(min, callback) {
        SFX.whistle();
        const overlay = document.getElementById('sub-in-anim-overlay');
        if (!overlay) { callback(); return; }

        document.getElementById('sub-in-min-badge').innerText = `${min}'`;
        document.getElementById('sub-out-num').innerText = Math.floor(Math.random() * 11) + 14;
        document.getElementById('sub-in-num').innerText = gameData.pos === 'SNT' ? '9' : (gameData.pos === 'OO' ? '10' : '7');
        document.getElementById('sub-in-avatar-box').innerHTML = generatePlayerSVG(gameData.avatar, 0.58, false);
        document.getElementById('sub-in-desc-text').innerText = `${min}. dakikada teknik direktör seni sahaya sürdü! Göster kendini!`;

        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.add('hidden');
            callback();
        }, 2200);
    }

    window.continueMatchClock = function () {
        simInterval = setInterval(() => {
            matchMin += 2;
            document.getElementById('match-live-min').innerText = `${matchMin}'`;

            triggerNewPass(false);

            if (dynamicSubInMinute && matchMin === dynamicSubInMinute) {
                clearInterval(simInterval);
                document.getElementById('live-role-indicator').innerText = `OYUNA GİRDİN (${matchMin}')`;
                pushMatchFeed(matchMin, `OYUNCU DEĞİŞİKLİĞİ: Teknik direktör ${matchMin}. dakikada seni sahaya sürdü!`, "text-amber-700 font-black");
                showSubstitutionAnimation(matchMin, () => {
                    window.continueMatchClock();
                });
                return;
            }

            if (matchMin === 80 && !dynamicSubInMinute && playerRestedInStands && window.getPlayerMatchStatus() === 'sub') {
                pushMatchFeed(80, "Teknik direktör 3 değişiklik hakkını da başka oyunculardan yana kullandı. Bu maç kulübede kaldın.", "text-slate-500");
            }

            if (penaltyMomentMinute && matchMin >= penaltyMomentMinute) {
                penaltyMomentMinute = null;
                clearInterval(simInterval);
                SFX.whistle();
                openPenaltyWheelModal();
                return;
            }

            if (Math.random() < 0.042 && !criticalMoments.includes(matchMin)) {
                clearInterval(simInterval);
                const homeChance = 0.48 + (gameData.club.power - activeOpponent.power) * 0.016;
                if (Math.random() < homeChance) {
                    hScore++;
                    pitchBall.passProgress = 1; pitchBall.carrierIndex = null;
                    pitchBall.x = 368; pitchBall.y = 110;
                    pushMatchFeed(matchMin, `GOOOL! ${gameData.club.name} takım arkadaşının vuruşuyla golü buldu! (${hScore}-${aScore})`, "text-emerald-700 font-black");
                    refreshLiveMatchUI();
                    window.triggerMatchGoalBanner(gameData.club, true, `${matchMin}' Takım Arkadaşın Attı!`, hScore, aScore);
                } else {
                    aScore++;
                    pitchBall.passProgress = 1; pitchBall.carrierIndex = null;
                    pitchBall.x = 12; pitchBall.y = 110;
                    pushMatchFeed(matchMin, `GOL! ${activeOpponent.name} savunmamızı hazırlıksız yakaladı ve golü attı. (${hScore}-${aScore})`, "text-red-700 font-black");
                    refreshLiveMatchUI();
                    window.triggerMatchGoalBanner(activeOpponent, false, `${matchMin}' ${activeOpponent.name} Golü Buldu`, hScore, aScore);
                }
                setTimeout(() => {
                    if (matchMin < 90) window.continueMatchClock();
                }, 1550);
                return;
            }

            if (criticalMoments.length > 0 && matchMin >= criticalMoments[0]) {
                criticalMoments.shift();
                clearInterval(simInterval);
                triggerNewPass(true);
                openMatchPositionWheel();
                return;
            }

            if (matchMin >= 90) {
                clearInterval(simInterval);
                stopTacticalPitch();
                SFX.stopAllMatchSounds();
                SFX.whistle();
                document.getElementById('match-live-min').innerText = "MS";
                pushMatchFeed(90, `90 dakika sona erdi! Skor: ${gameData.club.name} ${hScore} - ${aScore} ${activeOpponent.name}`, "text-[#0f291a] font-black");
                if (playerRestedInStands) {
                    mRating = 6.5;
                    gameData.matches--;
                    gameData.allTimeMatches--;
                }
                document.getElementById('btn-end-match').classList.remove('hidden');
            }
        }, 260);
    };

    // TÜM SEZONU SİMÜLE ET (3 ÇARK)
    let ssimStage = 1;
    let ssimRot = 0;
    let ssimSpinning = false;
    let ssimSlices = [];
    let ssimDrawnMatches = 0;
    let ssimDrawnGoals = 0;
    let ssimDrawnAssists = 0;

    window.openSeasonSimModal = function () {
        if (typeof gameData === 'undefined' || !gameData) return;
        ensureRandomizedFixture();
        const totalSeasonWeeks = (gameData.standings.length - 1) * 2;
        const remainingWeeks = Math.max(1, totalSeasonWeeks - gameData.week + 1);

        ssimStage = 1;
        ssimRot = 0;
        ssimDrawnMatches = 0;
        ssimDrawnGoals = 0;
        ssimDrawnAssists = 0;

        document.getElementById('ssim-val-matches').innerText = "-";
        document.getElementById('ssim-val-goals').innerText = "-";
        document.getElementById('ssim-val-assists').innerText = "-";
        document.getElementById('btn-close-ssim').classList.remove('hidden');

        setupSeasonSimStage1(remainingWeeks);
        document.getElementById('season-sim-modal').classList.remove('hidden');
    };

    window.closeSeasonSimModal = function () {
        if (ssimSpinning) return;
        document.getElementById('season-sim-modal').classList.add('hidden');
    };

    function setupSeasonSimStage1(remWeeks) {
        const starter = isPlayerStarter();
        const mFull = remWeeks;
        const mMost = Math.max(1, Math.round(remWeeks * 0.8));
        const mHalf = Math.max(1, Math.round(remWeeks * 0.55));
        const mFew = Math.max(1, Math.round(remWeeks * 0.3));

        ssimSlices = [
            { val: mFull, label: `${mFull} MAÇ (TAM SEZON)`, weight: starter ? 40 : 12, color: '#16a34a' },
            { val: mMost, label: `${mMost} MAÇ (DÜZENLİ)`, weight: starter ? 35 : 28, color: '#0284c7' },
            { val: mHalf, label: `${mHalf} MAÇ (ROTASYON)`, weight: starter ? 18 : 38, color: '#d97706' },
            { val: mFew, label: `${mFew} MAÇ (SAKATLIK/YEDEK)`, weight: starter ? 7 : 22, color: '#dc2626' }
        ];

        document.getElementById('ssim-step-badge').innerText = `TÜM SEZON SİMÜLASYONU • 1/3 (KALAN: ${remWeeks} HAFTA)`;
        document.getElementById('ssim-title').innerText = "1. ÇARK: OYNANAN MAÇ SAYISI";
        document.getElementById('ssim-desc').innerText = "Kalan haftalarda kaç maçta süre aldığını belirlemek için çarkı çevir!";
        document.getElementById('btn-ssim-action').innerText = "1. ÇARKI ÇEVİR (MAÇ SAYISI)";
        drawSeasonSimWheel();
    }

    function setupSeasonSimStage2() {
        ssimStage = 2;
        const m = ssimDrawnMatches;
        const shootPower = Math.max(0, gameData.stats.shoot - 54);

        const gHigh = Math.max(3, Math.round(m * (0.45 + shootPower * 0.012)));
        const gGood = Math.max(2, Math.round(m * (0.28 + shootPower * 0.008)));
        const gMid = Math.max(1, Math.round(m * 0.16));
        const gLow = Math.max(0, Math.round(m * 0.06));

        ssimSlices = [
            { val: gHigh, label: `${gHigh} GOL (GOL KRALI ADAYI)`, weight: 14 + shootPower * 0.7, color: '#d97706' },
            { val: gGood, label: `${gGood} GOL (ETKİLİ SEZON)`, weight: 32 + shootPower * 0.4, color: '#16a34a' },
            { val: gMid, label: `${gMid} GOL (STANDART)`, weight: 34, color: '#0284c7' },
            { val: gLow, label: `${gLow} GOL (KISIR SEZON)`, weight: Math.max(8, 28 - shootPower * 0.8), color: '#64748b' }
        ];

        document.getElementById('ssim-step-badge').innerText = "TÜM SEZON SİMÜLASYONU • 2/3";
        document.getElementById('ssim-title').innerText = "2. ÇARK: SEZONLUK GOL SAYISI";
        document.getElementById('ssim-desc').innerText = `${m} maçta kaç gol attığını belirlemek için çarkı çevir! (Şut: ${gameData.stats.shoot})`;
        document.getElementById('btn-ssim-action').innerText = "2. ÇARKI ÇEVİR (GOL SAYISI)";
        drawSeasonSimWheel();
    }

    function setupSeasonSimStage3() {
        ssimStage = 3;
        const m = ssimDrawnMatches;
        const passPower = Math.max(0, gameData.stats.pass - 54);

        const aHigh = Math.max(3, Math.round(m * (0.38 + passPower * 0.01)));
        const aGood = Math.max(2, Math.round(m * (0.24 + passPower * 0.007)));
        const aMid = Math.max(1, Math.round(m * 0.12));
        const aLow = 0;

        ssimSlices = [
            { val: aHigh, label: `${aHigh} ASİST (MAESTRO!)`, weight: 15 + passPower * 0.7, color: '#7c3aed' },
            { val: aGood, label: `${aGood} ASİST (OYUN KURUCU)`, weight: 33 + passPower * 0.4, color: '#2563eb' },
            { val: aMid, label: `${aMid} ASİST (STANDART)`, weight: 34, color: '#16a34a' },
            { val: aLow, label: `0 ASİST`, weight: Math.max(8, 25 - passPower * 0.7), color: '#64748b' }
        ];

        document.getElementById('ssim-step-badge').innerText = "TÜM SEZON SİMÜLASYONU • 3/3";
        document.getElementById('ssim-title').innerText = "3. ÇARK: SEZONLUK ASİST SAYISI";
        document.getElementById('ssim-desc').innerText = `${m} maçta kaç asist yaptığını belirlemek için son çarkı çevir! (Pas: ${gameData.stats.pass})`;
        document.getElementById('btn-ssim-action').innerText = "3. ÇARKI ÇEVİR (ASİST SAYISI)";
        drawSeasonSimWheel();
    }

    function drawSeasonSimWheel() {
        const cvs = document.getElementById('seasonSimWheelCanvas');
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        const cx = cvs.width / 2, cy = cvs.height / 2, r = cx - 4;
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        const total = ssimSlices.reduce((s, x) => s + x.weight, 0);
        let angle = ssimRot;

        ssimSlices.forEach(s => {
            const sa = (s.weight / total) * (Math.PI * 2);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, angle, angle + sa);
            ctx.closePath();
            ctx.fillStyle = s.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#0f291a';
            ctx.stroke();

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle + sa / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 9.5px Nunito, sans-serif';
            const pct = Math.round((s.weight / total) * 100);
            ctx.fillText(`${s.label} (%${pct})`, r - 10, 3.5, r - 34);
            ctx.restore();

            angle += sa;
        });
    }

    window.handleSeasonSimStep = function () {
        if (ssimSpinning) return;
        if (ssimStage === 4) {
            finalizeFullSeasonSimulation();
            return;
        }

        ssimSpinning = true;
        document.getElementById('btn-close-ssim').classList.add('hidden');
        const spin = (Math.PI * 2 * 6) + (Math.random() * Math.PI * 2);
        const dur = 2200;
        const start = performance.now();
        const sRot = ssimRot;

        function frame(now) {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            ssimRot = sRot + spin * ease;
            drawSeasonSimWheel();
            bounceWheelPointer('ssim-wheel-pointer', ssimRot);

            if (p < 1) {
                requestAnimationFrame(frame);
            } else {
                resetWheelPointer('ssim-wheel-pointer');
                ssimSpinning = false;
                resolveSeasonSimSlice();
            }
        }
        requestAnimationFrame(frame);
    };

    function resolveSeasonSimSlice() {
        const pointer = Math.PI * 1.5;
        const norm = ((ssimRot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const target = ((pointer - norm) + Math.PI * 2) % (Math.PI * 2);
        const total = ssimSlices.reduce((s, x) => s + x.weight, 0);
        let acc = 0, winner = ssimSlices[0];

        for (const s of ssimSlices) {
            const sa = (s.weight / total) * (Math.PI * 2);
            if (target >= acc && target <= acc + sa) { winner = s; break; }
            acc += sa;
        }

        if (ssimStage === 1) {
            ssimDrawnMatches = winner.val;
            document.getElementById('ssim-val-matches').innerText = `+${ssimDrawnMatches}`;
            setupSeasonSimStage2();
        } else if (ssimStage === 2) {
            ssimDrawnGoals = winner.val;
            document.getElementById('ssim-val-goals').innerText = `+${ssimDrawnGoals}`;
            setupSeasonSimStage3();
        } else if (ssimStage === 3) {
            ssimDrawnAssists = winner.val;
            document.getElementById('ssim-val-assists').innerText = `+${ssimDrawnAssists}`;
            ssimStage = 4;
            document.getElementById('ssim-title').innerText = "SEZON SİMÜLASYONU HAZIR!";
            document.getElementById('ssim-desc').innerText = `Bu sezon +${ssimDrawnMatches} Maç, +${ssimDrawnGoals} Gol ve +${ssimDrawnAssists} Asist ile tamamlandı! Tabloyu ve yeni sezonu görmek için onayla.`;
            document.getElementById('btn-ssim-action').innerText = "SEZONU BİTİR VE YENİ SEZONA GEÇ →";
            document.getElementById('btn-ssim-action').className = "flex-1 py-3 sport-btn-gold font-sport text-base font-black uppercase tracking-wider";
        }
    }

    function finalizeFullSeasonSimulation() {
        const totalSeasonWeeks = (gameData.standings.length - 1) * 2;
        const remainingWeeks = Math.max(1, totalSeasonWeeks - gameData.week + 1);

        gameData.matches += ssimDrawnMatches;
        gameData.allTimeMatches += ssimDrawnMatches;
        gameData.goals += ssimDrawnGoals;
        gameData.allTimeGoals += ssimDrawnGoals;
        gameData.assists += ssimDrawnAssists;
        gameData.allTimeAssists += ssimDrawnAssists;
        gameData.money += (ssimDrawnMatches * 450) + (ssimDrawnGoals * 800) + (ssimDrawnAssists * 500);

        const myTeam = gameData.standings.find(t => t.isPlayerClub);
        for (let w = gameData.week; w <= totalSeasonWeeks; w++) {
            const oppName = gameData.fixtureOrder[(w - 1) % gameData.fixtureOrder.length];
            const oppTeam = gameData.standings.find(t => t.name === oppName) || gameData.standings.find(t => !t.isPlayerClub);
            const playerContribBoost = (ssimDrawnGoals + ssimDrawnAssists) / Math.max(1, remainingWeeks);

            const simRes = simulateRealisticAIMatch(myTeam, oppTeam);
            const myGoals = simRes.gHome + (Math.random() < playerContribBoost * 0.45 ? 1 : 0);
            applyMatchResultToTable(myTeam, oppTeam, myGoals, simRes.gAway);

            const restTeams = [...gameData.standings].filter(t => !t.isPlayerClub && t.name !== oppTeam.name);
            const shift = w % restTeams.length;
            const rotated = restTeams.slice(shift).concat(restTeams.slice(0, shift));
            for (let i = 0; i < rotated.length; i += 2) {
                if (!rotated[i + 1]) break;
                const rSim = simulateRealisticAIMatch(rotated[i], rotated[i + 1]);
                applyMatchResultToTable(rotated[i], rotated[i + 1], rSim.gHome, rSim.gAway);
            }
        }

        const sorted = [...gameData.standings].sort((a, b) => b.pts - a.pts || (b.ag - b.yg) - (a.ag - a.yg));
        const finishRank = sorted.findIndex(t => t.isPlayerClub) + 1;
        const finishedSeasonNum = gameData.season;

        concludeSeason();
        ensureRandomizedFixture();
        gameData.energy = 100;
        saveCurrentGame();

        document.getElementById('btn-ssim-action').className = "flex-1 py-3 sport-btn-green font-sport text-base font-black uppercase tracking-wider";
        document.getElementById('season-sim-modal').classList.add('hidden');
        window.updateGameHubUI();
        window.showGameToast(`Sezon ${finishedSeasonNum} Tamamlandı! Ligi ${finishRank}. sırada bitirdin. Yeni sezon başladı!`, "success");
    }

    window.selectTrainingStation = function (type) {
        window.selectedStationType = type;
        const meta = STATIONS_CONFIG[type];
        if (!meta) return;

        const titleEl = document.getElementById('training-stage-title');
        if (titleEl) titleEl.innerText = meta.zoneName;
        const headEl = document.getElementById('minigame-preview-heading');
        if (headEl) headEl.innerText = meta.title;
        const descEl = document.getElementById('minigame-preview-desc');
        if (descEl) descEl.innerText = meta.desc;
        const costEl = document.getElementById('minigame-cost-pill');
        if (costEl) costEl.innerText = meta.cost;
        const rewEl = document.getElementById('minigame-reward-pill');
        if (rewEl) rewEl.innerText = meta.reward;
        const launchBtn = document.getElementById('btn-launch-selected-drill');
        if (launchBtn && typeof gameData !== 'undefined' && gameData && !gameData.trainedThisWeek) {
            launchBtn.innerText = meta.btnText;
        }

        const pinPositions = {
            shooting: "cursor-pointer absolute top-3 left-[44%] -translate-x-1/2",
            playmaking: "cursor-pointer absolute top-[50%] left-[44%] -translate-x-1/2 -translate-y-1/2",
            dribbling: "cursor-pointer absolute bottom-14 left-3",
            heavy_camp: "cursor-pointer absolute bottom-14 right-2.5"
        };

        ['shooting', 'playmaking', 'dribbling', 'heavy_camp'].forEach(k => {
            const pin = document.getElementById('map-pin-' + k);
            const pinTitle = document.getElementById('pin-title-' + k);
            if (!pin) return;

            if (k === type) {
                pin.className = `${pinPositions[k]} px-3 py-1.5 rounded-lg bg-[#143321] text-white border-2 border-[#eab308] shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-2 transition transform scale-105 z-20`;
                if (pinTitle) pinTitle.className = "font-sport text-xs font-black uppercase text-[#eab308] block";
            } else {
                pin.className = `${pinPositions[k]} px-2.5 py-1.5 rounded-lg bg-[#f5f1e4] text-[#143321] border-2 border-[#143321] shadow-md flex items-center gap-1.5 transition opacity-90 hover:opacity-100 z-10`;
                if (pinTitle) pinTitle.className = "font-sport text-xs font-black uppercase text-[#143321] block";
            }
        });
    };

    window.updateAvatarPreview = function () {
        if (!document.getElementById('inp-hair-style')) return;
        tempCreation.hairStyle = document.getElementById('inp-hair-style').value;
        tempCreation.beardStyle = document.getElementById('inp-beard-style').value;
        const pos = document.getElementById('inp-pos').value;
        document.getElementById('preview-pos-badge').innerText = pos;
        document.getElementById('avatar-preview-box').innerHTML = generatePlayerSVG(tempCreation, 0.72, false);
    };

    const _prevUpdateUI = window.updateGameHubUI;
    window.updateGameHubUI = function () {
        if (_prevUpdateUI) _prevUpdateUI();
        if (typeof gameData === 'undefined' || !gameData) return;

        ensureRandomizedFixture();
        const status = window.getPlayerMatchStatus();
        const roleBadge = document.getElementById('squad-role-badge');
        const roleDesc = document.getElementById('squad-role-desc');
        const playLabel = document.getElementById('btn-play-match-label');

        if (status === 'rested') {
            if (roleBadge) {
                roleBadge.className = "font-sport text-xs font-black uppercase px-2 py-0.5 rounded bg-red-700 text-white";
                roleBadge.innerText = "KADRO DIŞI (YORGUN)";
            }
            if (roleDesc) roleDesc.innerText = "Kondisyonun çok düşük (%18 altı)! Dinlenmezsen hoca seni maç kadrosuna almayacak.";
            if (playLabel) playLabel.innerText = "Maçı Tribünden İzle";
        } else if (status === 'sub') {
            if (roleBadge) {
                roleBadge.className = "font-sport text-xs font-black uppercase px-2 py-0.5 rounded bg-[#eab308] text-[#07190e]";
                roleBadge.innerText = "YEDEK KULÜBESİ";
            }
            if (roleDesc) roleDesc.innerText = "Yedek kulübesindesin. Hoca maçın gidişatına göre seni 2. yarıda oyuna alabilir (Garanti değil).";
            if (playLabel) playLabel.innerText = "Sahaya Çık (Yedek)";
        } else {
            if (playLabel) playLabel.innerText = "Sahaya Çık (İlk 11)";
        }

        if (document.getElementById('stat-grade-shoot')) {
            document.getElementById('stat-grade-shoot').innerText = getGradeText(gameData.stats.shoot);
            document.getElementById('stat-grade-pass').innerText = getGradeText(gameData.stats.pass);
            document.getElementById('stat-grade-dribble').innerText = getGradeText(gameData.stats.dribble);
            document.getElementById('stat-grade-physic').innerText = getGradeText(gameData.stats.physic);
        }

        if (document.getElementById('station-stat-shoot')) {
            document.getElementById('station-stat-shoot').innerText = gameData.stats.shoot;
            document.getElementById('station-stat-pass').innerText = gameData.stats.pass;
            document.getElementById('station-stat-drib').innerText = gameData.stats.dribble;
            document.getElementById('station-stat-phys').innerText = gameData.stats.physic;
            window.selectTrainingStation(window.selectedStationType || 'shooting');
        }

        const launchBtn = document.getElementById('btn-launch-selected-drill');
        if (launchBtn) {
            if (gameData.trainedThisWeek) {
                launchBtn.classList.add('opacity-40', 'pointer-events-none');
                launchBtn.innerText = "BU HAFTA TAMAMLANDI";
            } else {
                launchBtn.classList.remove('opacity-40', 'pointer-events-none');
                const meta = STATIONS_CONFIG[window.selectedStationType || 'shooting'];
                launchBtn.innerText = meta ? meta.btnText : "İDMANA BAŞLA";
            }
        }
    };

    applyStage1And2Overhaul();
    if (typeof gameData !== 'undefined' && gameData) window.updateGameHubUI();
})();
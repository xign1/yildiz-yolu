// =========================================================================
// 1. GÖRSEL EFEKTLER & CANLI GOL SKORBORD PANKARTI (HER İKİ TAKIM İÇİN)
// =========================================================================
function triggerFloatingBadge(text, bgColor = "#16a34a") {
    const overlay = document.getElementById('fx-overlay');
    if (!overlay) return;
    const badge = document.createElement('div');
    badge.className = "floating-badge absolute left-1/2 top-1/3 -translate-x-1/2 px-4 py-1.5 font-sport font-black text-xl text-white border-2 border-[#07190e] shadow-[3px_3px_0_#000]";
    badge.style.backgroundColor = bgColor;
    badge.innerText = text;
    overlay.appendChild(badge);
    setTimeout(() => badge.remove(), 1250);
}

// Maçta kim gol atarsa atsın (Biz, takım arkadaşımız veya Rakip) büyük skorbord anonsu çıkar!
function triggerMatchGoalBanner(teamObj, isHomeGoal, scorerText, currentH, currentA) {
    const overlay = document.getElementById('goal-celebration-overlay');
    const box = document.getElementById('goal-banner-box');
    const stripe = document.getElementById('goal-banner-stripe');
    const crestEl = document.getElementById('goal-banner-crest');
    const teamEl = document.getElementById('goal-banner-team');
    const typeEl = document.getElementById('goal-banner-type');
    const scoreEl = document.getElementById('goal-banner-score');
    const subEl = document.getElementById('goal-scorer-sub');
    const pitchWrap = document.getElementById('pitch-card-wrapper');

    if (crestEl && teamObj) crestEl.innerHTML = generateClubCrestSVG(teamObj.c1, teamObj.c2, 42);
    if (teamEl && teamObj) teamEl.innerText = teamObj.name.toUpperCase();
    if (scoreEl) scoreEl.innerText = `${currentH} - ${currentA}`;
    if (subEl) subEl.innerText = scorerText;

    if (isHomeGoal) {
        box.style.borderColor = "#eab308";
        stripe.style.backgroundColor = "#22c55e";
        typeEl.innerText = "GOOOL! TRİBÜNLER AYAKTA!";
        typeEl.className = "text-xs font-black text-[#4ade80] uppercase tracking-wider";
    } else {
        box.style.borderColor = "#ef4444";
        stripe.style.backgroundColor = "#ef4444";
        typeEl.innerText = "RAKİP GOL ATTI! STADYUM SUSTU...";
        typeEl.className = "text-xs font-black text-red-400 uppercase tracking-wider";
    }

    if (overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('hidden'), 1550);
    }
    if (pitchWrap) {
        pitchWrap.classList.add('shake-anim');
        setTimeout(() => pitchWrap.classList.remove('shake-anim'), 450);
    }
}

function bounceWheelPointer(pointerId, currentAngle) {
    const ptr = document.getElementById(pointerId);
    if (!ptr) return;
    const tick = Math.sin(currentAngle * 8);
    ptr.style.transform = tick > 0.65 ? 'rotate(-16deg)' : 'rotate(0deg)';
}

function resetWheelPointer(pointerId) {
    const ptr = document.getElementById(pointerId);
    if (ptr) ptr.style.transform = 'rotate(0deg)';
}

// =========================================================================
// 2. STATİK İKONLAR VE KAYIT SLOTLARI
// =========================================================================
function initStaticIcons() {
    const map = {
        'nav-icon-training': ICONS.dumbbell,
        'minigame-preview-icon': ICONS.target,
        'menu-ball-icon': ICONS.ball,
        'icon-back-arrow': ICONS.arrowLeft,
        'icon-next-arrow': ICONS.arrowRight,
        'draw-center-icon': ICONS.ball,
        'btn-icon-pitch': ICONS.pitch,
        'btn-icon-sim': ICONS.bolt,
        'drill-icon-shoot': ICONS.target,
        'drill-icon-pass': ICONS.ball,
        'drill-icon-drib': ICONS.bolt,
        'drill-icon-camp': ICONS.dumbbell,
        'nav-icon-hub': ICONS.pitch,
        'nav-icon-league': ICONS.trophy,
        'nav-icon-career': ICONS.medal,
        'action-wheel-center-icon': ICONS.ball,
        'sim-wheel-center-icon': ICONS.bolt
    };
    for (const [id, svg] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = svg;
    }
}

function ensureCareerFields(data) {
    if (!data.season) data.season = 1;
    if (!data.age) data.age = 18;
    if (!data.careerHistory) data.careerHistory = [];
    if (!data.trophies) data.trophies = [];
    if (typeof data.allTimeMatches === 'undefined') {
        data.allTimeMatches = data.matches || 0;
        data.allTimeGoals = data.goals || 0;
        data.allTimeAssists = data.assists || 0;
    }
    if (typeof data.nextMatchGoalPromise === 'undefined') data.nextMatchGoalPromise = false;
    if (typeof data.nextMatchPenaltyDuty === 'undefined') data.nextMatchPenaltyDuty = false;
    return data;
}

function renderSaveSlots() {
    const container = document.getElementById('save-slots-container');
    container.innerHTML = '';

    for (let slot = 1; slot <= 3; slot++) {
        const raw = localStorage.getItem(getSaveKey(slot));
        const card = document.createElement('div');
        card.className = "board-panel p-3 flex items-center justify-between";

        if (raw) {
            const data = ensureCareerFields(JSON.parse(raw));
            const ovr = getPlayerOvr(data.stats);
            card.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 bg-[#0f291a] border-2 border-[#07190e] flex flex-col items-center justify-center text-[#eab308]">
                        <span class="text-[9px] font-black leading-none">OVR</span>
                        <span class="font-led text-lg leading-none font-bold">${ovr}</span>
                    </div>
                    <div>
                        <div class="font-sport text-lg font-black uppercase text-[#0f291a] leading-none">${data.name} <span class="text-xs text-slate-600">(${data.pos})</span></div>
                        <div class="text-xs font-extrabold text-slate-600 mt-0.5">${data.club.name} • S${data.season} Hafta ${data.week}</div>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="loadGameFromSlot(${slot})" class="px-3.5 py-2 sport-btn-green font-sport text-sm font-black uppercase">
                        DEVAM ET
                    </button>
                    <button onclick="deleteSaveSlot(${slot})" class="px-2.5 py-2 bg-red-700 text-white border-2 border-[#07190e] font-sport text-sm font-black uppercase">SİL</button>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 bg-[#e2dec9] border-2 border-[#0f291a] flex items-center justify-center text-[#0f291a] font-led font-bold text-base">#${slot}</div>
                    <div>
                        <div class="font-sport text-lg font-black uppercase text-[#0f291a] leading-none">BOŞ KARİYER SLOTU</div>
                        <div class="text-xs font-bold text-slate-600 mt-0.5">Yeni bir futbolcu yarat</div>
                    </div>
                </div>
                <button onclick="startNewCareerInSlot(${slot})" class="px-3.5 py-2 sport-btn-gold font-sport text-sm font-black uppercase">
                    + YENİ AÇ
                </button>
            `;
        }
        container.appendChild(card);
    }
}

function startNewCareerInSlot(slot) {
    activeSlotId = slot;
    tempCreation.c1 = '#ffffff';
    tempCreation.c2 = '#1e293b';
    showScreen('screen-create');
    updateAvatarPreview();
}

function loadGameFromSlot(slot) {
    const raw = localStorage.getItem(getSaveKey(slot));
    if (!raw) return;
    activeSlotId = slot;
    gameData = ensureCareerFields(JSON.parse(raw));
    showScreen('screen-game');
    switchGameTab('hub');
    updateGameHubUI();
}

function deleteSaveSlot(slot) {
    if (confirm(`Slot ${slot} kaydını silmek istediğine emin misin?`)) {
        localStorage.removeItem(getSaveKey(slot));
        renderSaveSlots();
    }
}

function showScreen(screenId) {
    ['screen-menu', 'screen-create', 'screen-club-draw', 'screen-game'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
    if (screenId === 'screen-menu') renderSaveSlots();
}

function selectHairColor(col, btn) {
    tempCreation.hairColor = col;
    document.querySelectorAll('#hair-color-picker button').forEach(b => b.classList.remove('ring-2', 'ring-emerald-600'));
    btn.classList.add('ring-2', 'ring-emerald-600');
    updateAvatarPreview();
}

function selectSkinColor(col, btn) {
    tempCreation.skinColor = col;
    document.querySelectorAll('#skin-color-picker button').forEach(b => b.classList.remove('ring-2', 'ring-emerald-600'));
    btn.classList.add('ring-2', 'ring-emerald-600');
    updateAvatarPreview();
}

function updateAvatarPreview() {
    tempCreation.hairStyle = document.getElementById('inp-hair-style').value;
    tempCreation.beardStyle = document.getElementById('inp-beard-style').value;
    const pos = document.getElementById('inp-pos').value;
    document.getElementById('preview-pos-badge').innerText = pos;
    document.getElementById('avatar-preview-box').innerHTML = generatePlayerSVG(tempCreation, 1, false);
}

// =========================================================================
// 3. KURA ÇARKI (ÖNCE 56-73 OVR -> SONRA GERÇEKÇİ AĞIRLIKLI KULÜP)
// =========================================================================
let creationWheelStage = 1;
let clubWheelRotation = 0;
let isClubSpinning = false;
let weightedCandidateClubs = [];
let selectedStartingOvr = 60;
let selectedStartingClub = null;

function proceedToOvrWheelFirst() {
    creationWheelStage = 1;
    clubWheelRotation = 0;

    showScreen('screen-club-draw');
    document.getElementById('draw-step-badge').innerText = "AŞAMA 1 / 2 • YETENEK KURASI";
    document.getElementById('draw-title').innerText = "BAŞLANGIÇ OVERALL ÇARKI";
    document.getElementById('draw-subtitle').innerText = "56 ile 73 OVR arasındaki başlangıç seviyeni belirlemek için çarkı çevir.";

    document.getElementById('club-draw-result').classList.add('hidden');
    document.getElementById('btn-spin-club').innerText = "OVR ÇARKINI ÇEVİR!";
    document.getElementById('btn-spin-club').classList.remove('hidden');
    document.getElementById('btn-proceed-club-wheel').classList.add('hidden');
    document.getElementById('btn-start-career-final').classList.add('hidden');

    drawCreationWheel();
}

function setupClubWheelStep() {
    creationWheelStage = 2;
    clubWheelRotation = 0;

    const countryCode = document.getElementById('inp-country').value;
    const allTeams = LEAGUE_DB[countryCode].teams;

    weightedCandidateClubs = allTeams.map(club => {
        let weight = 10;
        const powerGap = club.reqOvr - selectedStartingOvr;

        if (club.power >= 83) {
            weight = selectedStartingOvr >= 71 ? 4.5 : (selectedStartingOvr >= 65 ? 2.0 : 0.7);
        } else if (club.power >= 78) {
            weight = selectedStartingOvr >= 68 ? 7.0 : (selectedStartingOvr >= 63 ? 3.5 : 1.5);
        } else if (club.power >= 73) {
            weight = powerGap <= 2 ? 15 : 8;
        } else {
            weight = powerGap <= 0 ? 24 : 18;
        }
        return { ...club, weight };
    });

    document.getElementById('draw-step-badge').innerText = "AŞAMA 2 / 2 • KULÜP KURASI";
    document.getElementById('draw-title').innerText = `${selectedStartingOvr} OVR İÇİN KULÜP ÇARKI`;
    document.getElementById('draw-subtitle').innerText = "Dev kulüplerin dilimi çok incedir. Çarkı çevir ve ilk sözleşmeni imzala.";

    document.getElementById('club-draw-result').classList.add('hidden');
    document.getElementById('btn-proceed-club-wheel').classList.add('hidden');
    document.getElementById('btn-spin-club').innerText = "KULÜP ÇARKINI ÇEVİR!";
    document.getElementById('btn-spin-club').classList.remove('hidden');

    drawCreationWheel();
}

function drawCreationWheel() {
    const cvs = document.getElementById('clubWheelCanvas');
    const ctx = cvs.getContext('2d');
    const cx = cvs.width / 2, cy = cvs.height / 2, r = cx - 4;
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    let angle = clubWheelRotation;

    if (creationWheelStage === 1) {
        const totalW = STARTING_OVR_SLICES.reduce((s, x) => s + x.weight, 0);
        STARTING_OVR_SLICES.forEach(item => {
            const sliceAngle = (item.weight / totalW) * (Math.PI * 2);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, angle, angle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#0f291a';
            ctx.stroke();

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = item.weight < 3 ? '800 9px Nunito, sans-serif' : '800 11px Nunito, sans-serif';
            ctx.fillText(`${item.label} (%${item.weight})`, r - 12, 3.5);
            ctx.restore();

            angle += sliceAngle;
        });
    } else {
        const totalW = weightedCandidateClubs.reduce((s, x) => s + x.weight, 0);
        weightedCandidateClubs.forEach(club => {
            const sliceAngle = (club.weight / totalW) * (Math.PI * 2);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, angle, angle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = club.c1;
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#0f291a';
            ctx.stroke();

            const pct = (club.weight / totalW) * 100;
            if (pct >= 1.1) {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle + sliceAngle / 2);
                ctx.textAlign = 'right';
                ctx.fillStyle = club.c1 === '#ffffff' ? '#0f172a' : '#ffffff';
                ctx.font = pct < 3 ? '800 8px Nunito, sans-serif' : '800 10px Nunito, sans-serif';
                const pctStr = pct < 2 ? pct.toFixed(1) : Math.round(pct);
                ctx.fillText(`${club.name.toUpperCase()} (%${pctStr})`, r - 10, 3);
                ctx.restore();
            }

            angle += sliceAngle;
        });
    }
}

function spinCreationWheel() {
    if (isClubSpinning) return;
    isClubSpinning = true;
    document.getElementById('btn-spin-club').disabled = true;

    const totalSpin = (Math.PI * 2 * 6) + (Math.random() * Math.PI * 2);
    const duration = 2800;
    const start = performance.now();
    const startRot = clubWheelRotation;

    function animate(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        clubWheelRotation = startRot + totalSpin * ease;
        drawCreationWheel();
        bounceWheelPointer('draw-wheel-pointer', clubWheelRotation);

        if (p < 1) {
            requestAnimationFrame(animate);
        } else {
            resetWheelPointer('draw-wheel-pointer');
            isClubSpinning = false;
            document.getElementById('btn-spin-club').disabled = false;
            resolveCreationWheel();
        }
    }
    requestAnimationFrame(animate);
}

function resolveCreationWheel() {
    const pointer = Math.PI * 1.5;
    const norm = ((clubWheelRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const target = ((pointer - norm) + Math.PI * 2) % (Math.PI * 2);

    if (creationWheelStage === 1) {
        const totalW = STARTING_OVR_SLICES.reduce((s, x) => s + x.weight, 0);
        let acc = 0, picked = STARTING_OVR_SLICES[0];
        for (const item of STARTING_OVR_SLICES) {
            const sa = (item.weight / totalW) * (Math.PI * 2);
            if (target >= acc && target <= acc + sa) { picked = item; break; }
            acc += sa;
        }
        selectedStartingOvr = picked.ovr;
        triggerFloatingBadge(`${selectedStartingOvr} OVR!`, "#16a34a");

        document.getElementById('draw-result-label').innerText = "Başlangıç Gücün Belli Oldu";
        document.getElementById('drawn-club-name').innerText = `${picked.label} • ${picked.desc}`;
        document.getElementById('draw-result-desc').innerText = `Şimdi ${selectedStartingOvr} OVR gücüne göre ağırlıklandırılmış kulüp çarkına geçiyoruz.`;
        document.getElementById('club-draw-result').classList.remove('hidden');
        document.getElementById('btn-spin-club').classList.add('hidden');
        document.getElementById('btn-proceed-club-wheel').classList.remove('hidden');
    } else {
        const totalW = weightedCandidateClubs.reduce((s, x) => s + x.weight, 0);
        let acc = 0, pickedClub = weightedCandidateClubs[0];
        for (const club of weightedCandidateClubs) {
            const sa = (club.weight / totalW) * (Math.PI * 2);
            if (target >= acc && target <= acc + sa) { pickedClub = club; break; }
            acc += sa;
        }
        selectedStartingClub = pickedClub;
        triggerFloatingBadge(selectedStartingClub.name.toUpperCase(), selectedStartingClub.c1 === '#ffffff' ? '#0f291a' : selectedStartingClub.c1);

        const isStarter = selectedStartingOvr >= selectedStartingClub.reqOvr;
        document.getElementById('draw-result-label').innerText = "Sözleşme İmzalayacağın Kulüp";
        document.getElementById('drawn-club-name').innerHTML = `${generateClubCrestSVG(selectedStartingClub.c1, selectedStartingClub.c2, 22)} ${selectedStartingClub.name}`;
        document.getElementById('draw-result-desc').innerText = isStarter
            ? `Gücün (${selectedStartingOvr} OVR), ${selectedStartingClub.name} İlk 11 barajına (${selectedStartingClub.reqOvr} OVR) yetiyor! Sezona İlk 11'de başlıyorsun.`
            : `${selectedStartingClub.name} İlk 11 barajı ${selectedStartingClub.reqOvr} OVR (Sen: ${selectedStartingOvr}). Sezona yedek kulübesinde başlayıp çalışarak formayı kapacaksın.`;

        document.getElementById('club-draw-result').classList.remove('hidden');
        document.getElementById('btn-spin-club').classList.add('hidden');
        document.getElementById('btn-start-career-final').classList.remove('hidden');
    }
}

function finalizeCareerStart() {
    const countryCode = document.getElementById('inp-country').value;
    const leagueInfo = LEAGUE_DB[countryCode];
    const playerName = document.getElementById('inp-name').value.trim() || "Genç Oyuncu";
    const pos = document.getElementById('inp-pos').value;
    const dreamClub = document.getElementById('inp-dream').value;

    const base = selectedStartingOvr;
    const stats = {
        shoot: pos === 'SNT' ? base + 2 : base,
        pass: (pos === 'OO' || pos === 'MO') ? base + 2 : base,
        dribble: (pos === 'SĞK' || pos === 'SLK') ? base + 2 : base,
        physic: base - 2
    };

    const diff = base - selectedStartingClub.reqOvr;
    const initialTrust = Math.max(35, Math.min(85, 62 + diff * 5));

    const initializedStandings = leagueInfo.teams.map(t => ({
        name: t.name,
        c1: t.c1,
        c2: t.c2,
        power: t.power,
        reqOvr: t.reqOvr,
        isPlayerClub: t.name === selectedStartingClub.name,
        om: 0, g: 0, b: 0, m: 0, ag: 0, yg: 0, pts: 0,
        last5: []
    }));

    gameData = {
        name: playerName,
        pos: pos,
        age: 18,
        season: 1,
        country: countryCode,
        leagueName: leagueInfo.name,
        dreamClub: dreamClub,
        week: 1,
        money: 3000,
        energy: 100,
        focus: 3,
        maxFocus: 5,
        coachTrust: initialTrust,
        lowRatingStreak: 0,
        lastRating: null,
        matches: 0,
        goals: 0,
        assists: 0,
        allTimeMatches: 0,
        allTimeGoals: 0,
        allTimeAssists: 0,
        careerHistory: [],
        trophies: [],
        trainedThisWeek: false,
        mentality: 'balanced',
        nextMatchGoalPromise: false,
        nextMatchPenaltyDuty: false,
        avatar: {
            hairStyle: tempCreation.hairStyle,
            beardStyle: tempCreation.beardStyle,
            hairColor: tempCreation.hairColor,
            skinColor: tempCreation.skinColor,
            c1: selectedStartingClub.c1,
            c2: selectedStartingClub.c2
        },
        club: selectedStartingClub,
        stats: stats,
        standings: initializedStandings
    };

    saveCurrentGame();
    showScreen('screen-game');
    switchGameTab('hub');
    updateGameHubUI();
}

// =========================================================================
// 4. SEGMENTLİ GÖSTERGELER VE KARİYER MERKEZİ GÜNCELLEMESİ
// =========================================================================
function isPlayerStarter() {
    if (!gameData) return true;
    const myOvr = getPlayerOvr(gameData.stats);
    if (gameData.lowRatingStreak >= 2 || gameData.coachTrust < 50) return false;
    if (myOvr < gameData.club.reqOvr && gameData.coachTrust < 65) return false;
    return true;
}

function getCurrentOpponent() {
    const others = gameData.standings.filter(t => !t.isPlayerClub);
    return others[(gameData.week - 1) % others.length];
}

function renderSegmentedHeaderBars() {
    // 1. Kondisyon: 10 Segmentli Eğik Pil Blokları
    const energyCont = document.getElementById('ui-energy-segments');
    if (energyCont) {
        energyCont.innerHTML = '';
        const activeBlocks = Math.ceil(gameData.energy / 10);
        const color = gameData.energy >= 60 ? '#22c55e' : (gameData.energy >= 30 ? '#eab308' : '#ef4444');
        for (let i = 1; i <= 10; i++) {
            const cell = document.createElement('div');
            cell.className = "seg-cell";
            cell.style.backgroundColor = i <= activeBlocks ? color : '#09150e';
            energyCont.appendChild(cell);
        }
    }

    // 2. Odak: 5 Fiziksel Elmas/Hedef Soketi
    const focusCont = document.getElementById('ui-focus-sockets');
    if (focusCont) {
        focusCont.innerHTML = '';
        for (let i = 1; i <= gameData.maxFocus; i++) {
            const sock = document.createElement('div');
            sock.className = "w-3 h-2.5 border border-[#07190e]";
            sock.style.transform = "skewX(-12deg)";
            sock.style.backgroundColor = i <= gameData.focus ? '#eab308' : '#09150e';
            focusCont.appendChild(sock);
        }
    }

    // 3. Hoca Güveni: 8 Segmentli Kalkan Barı
    const trustCont = document.getElementById('ui-trust-segments');
    if (trustCont) {
        trustCont.innerHTML = '';
        const activeTrust = Math.ceil((gameData.coachTrust / 100) * 8);
        const tCol = gameData.coachTrust >= 50 ? '#38bdf8' : '#f97316';
        for (let i = 1; i <= 8; i++) {
            const cell = document.createElement('div');
            cell.className = "seg-cell";
            cell.style.backgroundColor = i <= activeTrust ? tCol : '#09150e';
            trustCont.appendChild(cell);
        }
    }
}

function updateGameHubUI() {
    if (!gameData) return;
    const ovr = getPlayerOvr(gameData.stats);
    const starter = isPlayerStarter();

    document.getElementById('ui-ovr-badge').innerText = ovr;
    document.getElementById('ui-player-name').innerText = gameData.name;
    document.getElementById('ui-player-pos').innerText = gameData.pos;
    document.getElementById('ui-club-badge').innerHTML = generateClubCrestSVG(gameData.club.c1, gameData.club.c2, 16);
    document.getElementById('ui-club-name').innerText = gameData.club.name;
    document.getElementById('ui-season-stats').innerText = `${gameData.matches}M ${gameData.goals}G ${gameData.assists}A`;
    document.getElementById('ui-week-label').innerText = `S${gameData.season} • HAFTA ${gameData.week}`;
    document.getElementById('ui-money').innerText = `₺${gameData.money.toLocaleString('tr-TR')}`;
    document.getElementById('ui-dream-target').innerText = `Hedef: ${gameData.dreamClub}`;

    document.getElementById('hub-mini-avatar').innerHTML = generatePlayerSVG(gameData.avatar, 1, true);

    document.getElementById('ui-energy-text').innerText = `%${gameData.energy}`;
    document.getElementById('ui-focus-text').innerText = `${gameData.focus}/${gameData.maxFocus}`;
    document.getElementById('ui-trust-text').innerText = `%${gameData.coachTrust}`;
    renderSegmentedHeaderBars();

    const banner = document.getElementById('squad-status-banner');
    const roleBadge = document.getElementById('squad-role-badge');
    const reqLabel = document.getElementById('squad-req-ovr');
    const roleDesc = document.getElementById('squad-role-desc');
    const buffBadge = document.getElementById('active-buff-badge');

    reqLabel.innerText = `${gameData.club.name} Barajı: ${gameData.club.reqOvr} OVR (Sen: ${ovr})`;

    if (gameData.nextMatchGoalPromise) {
        buffBadge.classList.remove('hidden');
        buffBadge.innerText = "BASIN SÖZÜ: GOL +%12";
    } else if (gameData.nextMatchPenaltyDuty) {
        buffBadge.classList.remove('hidden');
        buffBadge.innerText = "PENALTICI SENSİN!";
    } else {
        buffBadge.classList.add('hidden');
    }

    if (starter) {
        banner.className = "board-panel p-2.5 flex items-center justify-between border-l-8 border-l-[#16a34a]";
        roleBadge.className = "font-sport text-xs font-black uppercase px-2 py-0.5 bg-[#0f291a] text-[#4ade80]";
        roleBadge.innerText = "İLK 11 OYUNCUSU";
        roleDesc.innerText = gameData.lowRatingStreak === 1
            ? "Dikkat: Geçen maç 6.0 altı aldın! Bir kötü maç daha çıkarırsan yedeğe çekilirsin."
            : "Hoca sana güveniyor. Maça İlk 11 başlayıp 3 pozisyon şansı bulacaksın.";
    } else {
        banner.className = "board-panel p-2.5 flex items-center justify-between border-l-8 border-l-[#eab308]";
        roleBadge.className = "font-sport text-xs font-black uppercase px-2 py-0.5 bg-[#eab308] text-[#07190e]";
        roleBadge.innerText = "YEDEK (75'TE GİRER)";
        roleDesc.innerText = "Barajın altındasın veya formun düştü. Maça 75. dakikada girip tek pozisyon şansı bulacaksın.";
    }

    const opp = getCurrentOpponent();
    document.getElementById('hub-league-name').innerText = gameData.leagueName.toUpperCase();
    document.getElementById('hub-match-week').innerText = `${gameData.week}. HAFTA`;
    document.getElementById('hub-last-ratings').innerText = gameData.lastRating ? `SON MAÇ: ${gameData.lastRating.toFixed(1)}` : `SON MAÇ: -`;
    document.getElementById('hub-home-crest').innerHTML = generateClubCrestSVG(gameData.club.c1, gameData.club.c2, 34);
    document.getElementById('hub-home-name').innerText = gameData.club.name;
    document.getElementById('hub-away-crest').innerHTML = generateClubCrestSVG(opp.c1, opp.c2, 34);
    document.getElementById('hub-away-name').innerText = opp.name;

    document.getElementById('stat-val-shoot').innerText = gameData.stats.shoot;
    document.getElementById('stat-val-pass').innerText = gameData.stats.pass;
    document.getElementById('stat-val-dribble').innerText = gameData.stats.dribble;
    document.getElementById('stat-val-physic').innerText = gameData.stats.physic;

    // Soyunma odası yetenek barlarını güncelle
    const barShoot = document.getElementById('stat-bar-shoot');
    if (barShoot) {
        barShoot.style.width = `${Math.min(100, gameData.stats.shoot)}%`;
        document.getElementById('stat-bar-pass').style.width = `${Math.min(100, gameData.stats.pass)}%`;
        document.getElementById('stat-bar-dribble').style.width = `${Math.min(100, gameData.stats.dribble)}%`;
        document.getElementById('stat-bar-physic').style.width = `${Math.min(100, gameData.stats.physic)}%`;
    }

    // Antrenman sekmesindeki istasyon sayılarını ve buton durumunu güncelle
    if (document.getElementById('station-stat-shoot')) {
        document.getElementById('station-stat-shoot').innerText = gameData.stats.shoot;
        document.getElementById('station-stat-pass').innerText = gameData.stats.pass;
        document.getElementById('station-stat-drib').innerText = gameData.stats.dribble;
        document.getElementById('station-stat-phys').innerText = gameData.stats.physic;
        selectTrainingStation(selectedStationType || 'shooting');
    }
    const launchBtn = document.getElementById('btn-launch-selected-drill');
    if (launchBtn) {
        if (gameData.trainedThisWeek) {
            launchBtn.classList.add('opacity-40', 'pointer-events-none');
            launchBtn.innerText = "BU HAFTA TAMAMLANDI";
        } else {
            launchBtn.classList.remove('opacity-40', 'pointer-events-none');
            launchBtn.innerText = "İDMANA BAŞLA";
        }
    }

    const badge = document.getElementById('hub-train-badge');
    const drillBtns = document.querySelectorAll('.train-drill-btn');
    if (gameData.trainedThisWeek) {
        badge.innerText = "TAMAMLANDI";
        badge.className = "font-led text-[10px] font-bold px-2 py-0.5 bg-slate-700 text-slate-300";
        drillBtns.forEach(b => b.classList.add('opacity-40', 'pointer-events-none'));
    } else {
        badge.innerText = "1 HAKKIN VAR";
        badge.className = "font-led text-[10px] font-bold px-2 py-0.5 bg-[#eab308] text-[#07190e]";
        drillBtns.forEach(b => b.classList.remove('opacity-40', 'pointer-events-none'));
    }
}

function applyCoachTrustAfterMatch(rating, goals, assists) {
    gameData.lastRating = rating;

    // Eğer gece kulübü olayında "Sahada konuşurum" sözü verdiyse ve gol atamadıysa sert ceza!
    if (gameData.nextMatchGoalPromise) {
        if (goals > 0) {
            gameData.coachTrust = Math.min(100, gameData.coachTrust + 14);
            triggerFloatingBadge("SÖZÜNÜ TUTTUN! +14 GÜVEN", "#16a34a");
        } else {
            gameData.coachTrust = Math.max(10, gameData.coachTrust - 18);
            triggerFloatingBadge("SÖZÜNÜ TUTAMADIN! -18 GÜVEN", "#dc2626");
        }
        gameData.nextMatchGoalPromise = false;
    }

    gameData.nextMatchPenaltyDuty = false;

    if (rating < 6.0 && goals === 0 && assists === 0) {
        gameData.lowRatingStreak++;
        gameData.coachTrust = Math.max(15, gameData.coachTrust - 14);
    } else {
        gameData.lowRatingStreak = 0;
        const bonus = (goals * 8) + (assists * 5) + (rating >= 7.0 ? 6 : 2);
        gameData.coachTrust = Math.min(100, gameData.coachTrust + bonus);
    }
}

// =========================================================================
// 5. HIZLI SİMÜLASYON ÇARKI
// =========================================================================
let simWheelRot = 0;
let isSimSpinning = false;
let simSlices = [];
let simOutcomeResult = 'D';
let simHomeGoals = 0, simAwayGoals = 0;

function openQuickSimModal() {
    const costs = { safe: 12, balanced: 20, attack: 28 };
    const cost = costs[gameData.mentality];
    if (gameData.energy < cost) {
        alert("Kondisyonun bu maç için yetersiz! Dinlen veya 'Rölanti' seç.");
        return;
    }
    gameData.energy -= cost;
    activeOpponent = getCurrentOpponent();
    simWheelRot = 0;

    const myPower = gameData.club.power + (isPlayerStarter() ? (getPlayerOvr(gameData.stats) - 62) * 0.4 : 0);
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

    document.getElementById('sim-step-badge').innerText = "1. ÇARK: MAÇ SONUCU";
    document.getElementById('sim-desc-text').innerText = `Yeşil: ${gameData.club.name} Galibiyeti • Gri: Beraberlik • Kırmızı: ${activeOpponent.name} Galibiyeti`;
    document.getElementById('btn-cancel-sim').classList.remove('hidden');
    document.getElementById('btn-spin-sim-1').classList.remove('hidden');
    document.getElementById('btn-Next-sim-2').classList.add('hidden');
    document.getElementById('btn-spin-sim-2').classList.add('hidden');
    document.getElementById('btn-finish-sim').classList.add('hidden');

    document.getElementById('sim-wheel-modal').classList.remove('hidden');
    drawSimWheel();
    updateGameHubUI();
}

function closeQuickSimModal() {
    if (isSimSpinning) return;
    document.getElementById('sim-wheel-modal').classList.add('hidden');
}

function drawSimWheel() {
    const cvs = document.getElementById('simWheelCanvas');
    const ctx = cvs.getContext('2d');
    const cx = cvs.width / 2, cy = cvs.height / 2, r = cx - 4;
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    const total = simSlices.reduce((s, x) => s + x.weight, 0);
    let angle = simWheelRot;

    simSlices.forEach(s => {
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
        ctx.font = '800 10px Nunito, sans-serif';
        const pct = Math.round((s.weight / total) * 100);
        ctx.fillText(`${s.label} (%${pct})`, r - 12, 4, r - 38);
        ctx.restore();

        angle += sa;
    });
}

function spinQuickSimWheel(step) {
    if (isSimSpinning) return;
    isSimSpinning = true;
    document.getElementById('btn-cancel-sim').classList.add('hidden');

    const spin = (Math.PI * 2 * 6) + (Math.random() * Math.PI * 2);
    const dur = 2400;
    const start = performance.now();
    const sRot = simWheelRot;

    function frame(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        simWheelRot = sRot + spin * ease;
        drawSimWheel();
        bounceWheelPointer('sim-wheel-pointer', simWheelRot);

        if (p < 1) {
            requestAnimationFrame(frame);
        } else {
            resetWheelPointer('sim-wheel-pointer');
            isSimSpinning = false;
            resolveQuickSimWheel(step);
        }
    }
    requestAnimationFrame(frame);
}

function generateConsistentMatchScore(outcome, playerGoalsContrib, playerAssistsContrib) {
    const minTeamGoals = playerGoalsContrib + playerAssistsContrib;
    let h = 0, a = 0;

    if (outcome === 'D') {
        if (minTeamGoals === 0) {
            const drawOptions = [0, 0, 1, 1, 2];
            h = drawOptions[Math.floor(Math.random() * drawOptions.length)];
        } else if (minTeamGoals === 1) {
            const drawOptions = [1, 1, 2, 2, 3];
            h = drawOptions[Math.floor(Math.random() * drawOptions.length)];
        } else {
            h = minTeamGoals + (Math.random() < 0.25 ? 1 : 0);
        }
        a = h;
    } else if (outcome === 'W') {
        const baseWinGoals = Math.max(1, minTeamGoals);
        h = baseWinGoals + (Math.random() < 0.45 ? 1 : 0);
        a = Math.floor(Math.random() * h);
    } else {
        h = minTeamGoals === 0 ? (Math.random() < 0.4 ? 1 : 0) : minTeamGoals;
        a = h + 1 + (Math.random() < 0.35 ? 1 : 0);
    }

    return { h, a };
}

function resolveQuickSimWheel(step) {
    const pointer = Math.PI * 1.5;
    const norm = ((simWheelRot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const target = ((pointer - norm) + Math.PI * 2) % (Math.PI * 2);
    const total = simSlices.reduce((s, x) => s + x.weight, 0);
    let acc = 0, winner = simSlices[0];

    for (const s of simSlices) {
        const sa = (s.weight / total) * (Math.PI * 2);
        if (target >= acc && target <= acc + sa) { winner = s; break; }
        acc += sa;
    }

    if (step === 1) {
        simOutcomeResult = winner.id;
        const outcomeLabel = simOutcomeResult === 'W'
            ? `${gameData.club.name} GALİBİYETİ`
            : (simOutcomeResult === 'D' ? "BERABERLİK" : `${activeOpponent.name} GALİBİYETİ`);

        document.getElementById('sim-desc-text').innerText = `Maç Sonucu: ${outcomeLabel}! Şimdi maçın tam skorunu ve senin bireysel katkını belirlemek için 2. çarka geç.`;
        document.getElementById('btn-spin-sim-1').classList.add('hidden');
        document.getElementById('btn-Next-sim-2').classList.remove('hidden');
    } else {
        let g = 0, a = 0, rat = 6.3;
        if (winner.id === 'goal') {
            g = 1; rat = 7.6; gameData.goals++; gameData.allTimeGoals++; gameData.money += 800;
        } else if (winner.id === 'assist') {
            a = 1; rat = 7.3; gameData.assists++; gameData.allTimeAssists++; gameData.money += 500;
        } else if (winner.id === 'brace') {
            g = 2; rat = 8.8; gameData.goals += 2; gameData.allTimeGoals += 2; gameData.money += 1500;
        } else {
            rat = simOutcomeResult === 'L' ? 5.7 : 6.2;
        }

        const finalScore = generateConsistentMatchScore(simOutcomeResult, g, a);
        simHomeGoals = finalScore.h;
        simAwayGoals = finalScore.a;

        if (g > 0) {
            triggerMatchGoalBanner(gameData.club, true, `${gameData.name} (${g} GOL)`, simHomeGoals, simAwayGoals);
        }

        const contribStr = g === 2 ? "2 GOL BİRDEN attın!" : (g === 1 ? "1 GOL attın!" : (a === 1 ? "1 ASİST yaptın!" : "Skor katkısı yapamadın."));
        document.getElementById('sim-desc-text').innerText = `Maç Bitti: ${gameData.club.name} ${simHomeGoals} - ${simAwayGoals} ${activeOpponent.name} • ${contribStr} (Reyting: ${rat})`;

        applyCoachTrustAfterMatch(rat, g, a);
        document.getElementById('btn-spin-sim-2').classList.add('hidden');
        document.getElementById('btn-finish-sim').classList.remove('hidden');
    }
}

function setupQuickSimStep2() {
    simWheelRot = 0;
    const starter = isPlayerStarter();
    const shootFactor = Math.max(4, (gameData.stats.shoot - 50) * 1.15);
    const passFactor = Math.max(4, (gameData.stats.pass - 50) * 1.15);
    const oppDefense = (activeOpponent.power - 65) * 0.8;

    const resultMultiplier = simOutcomeResult === 'W' ? 1.25 : (simOutcomeResult === 'D' ? 0.9 : 0.45);
    const promiseBoost = gameData.nextMatchGoalPromise ? 1.25 : 1.0;

    let goalW = Math.max(6, (shootFactor - oppDefense * 0.4) * (starter ? 1 : 0.45) * resultMultiplier * promiseBoost);
    let assistW = Math.max(6, (passFactor - oppDefense * 0.3) * (starter ? 1 : 0.45) * resultMultiplier);
    let braceW = Math.max(1.5, (gameData.stats.shoot - 58) * 0.38 * (starter ? 1 : 0.25) * (simOutcomeResult === 'L' ? 0.25 : 1) * promiseBoost);
    let noneW = Math.max(28, 100 - goalW - assistW - braceW);

    simSlices = [
        { id: 'goal', label: '1 GOL', weight: goalW, color: '#16a34a' },
        { id: 'assist', label: '1 ASİST', weight: assistW, color: '#2563eb' },
        { id: 'brace', label: '2 GOL BİRDEN', weight: braceW, color: '#d97706' },
        { id: 'none', label: 'KATKI YOK', weight: noneW, color: '#64748b' }
    ];

    document.getElementById('sim-step-badge').innerText = "2. ÇARK: OYUNCU SKOR KATKISI";
    document.getElementById('sim-desc-text').innerText = starter
        ? "İlk 11 başladın. Yeteneklerine göre gol/asist katkısı çarkını çevir."
        : "Maça 75. dakikada yedekten girdin. Kısıtlı sürede skor katkısı çarkını çevir.";
    document.getElementById('btn-Next-sim-2').classList.add('hidden');
    document.getElementById('btn-spin-sim-2').classList.remove('hidden');
    drawSimWheel();
}

function finalizeQuickSim() {
    document.getElementById('sim-wheel-modal').classList.add('hidden');
    hScore = simHomeGoals;
    aScore = simAwayGoals;
    finishMatchAndSave(true);
}

// =========================================================================
// 6. BAĞIMSIZ HAREKET EDEN 22 OYUNCULU 2D SAHA SİMÜLASYONU
// =========================================================================
let pitchAnimFrame = null;
let pitchPlayers = [];
let pitchBall = {
    x: 190, y: 110,
    fromX: 190, fromY: 110,
    carrierIndex: 6,
    passTargetIndex: null,
    passProgress: 1
};
let attackingTeam = 'home';

function initTacticalPitch() {
    const homeBase = [
        { x: 22, y: 110, role: 'GK' },
        { x: 75, y: 35, role: 'DEF' }, { x: 68, y: 84, role: 'DEF' }, { x: 68, y: 136, role: 'DEF' }, { x: 75, y: 185, role: 'DEF' },
        { x: 145, y: 55, role: 'MID' }, { x: 135, y: 110, role: 'MID' }, { x: 145, y: 165, role: 'MID' },
        { x: 225, y: 42, role: 'FWD' }, { x: 235, y: 110, role: 'FWD', isUser: true }, { x: 225, y: 178, role: 'FWD' }
    ];
    const awayBase = [
        { x: 358, y: 110, role: 'GK' },
        { x: 305, y: 35, role: 'DEF' }, { x: 312, y: 84, role: 'DEF' }, { x: 312, y: 136, role: 'DEF' }, { x: 305, y: 185, role: 'DEF' },
        { x: 242, y: 72, role: 'MID' }, { x: 242, y: 148, role: 'MID' },
        { x: 185, y: 45, role: 'MID' }, { x: 180, y: 110, role: 'MID' }, { x: 185, y: 175, role: 'MID' },
        { x: 132, y: 110, role: 'FWD' }
    ];

    pitchPlayers = [];
    homeBase.forEach((p, idx) => {
        pitchPlayers.push({
            id: idx, team: 'home', role: p.role,
            baseX: p.x, baseY: p.y, x: p.x, y: p.y,
            destX: p.x, destY: p.y,
            speed: 0.45 + Math.random() * 0.35,
            rethinkTimer: Math.floor(Math.random() * 40),
            isUser: !!p.isUser
        });
    });
    awayBase.forEach((p, idx) => {
        pitchPlayers.push({
            id: 11 + idx, team: 'away', role: p.role,
            baseX: p.x, baseY: p.y, x: p.x, y: p.y,
            destX: p.x, destY: p.y,
            speed: 0.45 + Math.random() * 0.35,
            rethinkTimer: Math.floor(Math.random() * 40),
            isUser: false
        });
    });

    pitchBall.carrierIndex = 6;
    pitchBall.passProgress = 1;
    pitchBall.x = pitchPlayers[6].x;
    pitchBall.y = pitchPlayers[6].y;
}

function updateIndividualPlayerTarget(p, W, H) {
    if (p.role === 'GK') {
        p.destX = p.baseX + (Math.random() * 6 - 3);
        p.destY = 110 + (pitchBall.y - 110) * 0.22;
        p.rethinkTimer = 25;
        return;
    }

    const isMyTeamAttacking = p.team === attackingTeam;
    const attackDir = p.team === 'home' ? 1 : -1;

    const distToBall = Math.hypot(p.x - pitchBall.x, p.y - pitchBall.y);
    if (!isMyTeamAttacking && distToBall < 75 && p.role !== 'FWD') {
        p.destX = pitchBall.x + (Math.random() * 14 - 7);
        p.destY = pitchBall.y + (Math.random() * 14 - 7);
        p.rethinkTimer = 18;
        return;
    }

    let tacticalAdvance = 0;
    if (isMyTeamAttacking) {
        if (p.role === 'FWD') tacticalAdvance = (35 + Math.random() * 48) * attackDir;
        else if (p.role === 'MID') tacticalAdvance = (18 + Math.random() * 38) * attackDir;
        else if (p.role === 'DEF') tacticalAdvance = (8 + Math.random() * 20) * attackDir;
    } else {
        if (p.role === 'FWD') tacticalAdvance = (-15 + Math.random() * 25) * attackDir;
        else if (p.role === 'MID') tacticalAdvance = (-22 + Math.random() * 20) * attackDir;
        else if (p.role === 'DEF') tacticalAdvance = (-15 + Math.random() * 12) * attackDir;
    }

    const individualWanderX = (Math.random() - 0.5) * 44;
    const individualWanderY = (Math.random() - 0.5) * 48;

    p.destX = Math.max(24, Math.min(W - 24, p.baseX + tacticalAdvance + individualWanderX));
    p.destY = Math.max(22, Math.min(H - 22, p.baseY + individualWanderY));
    p.rethinkTimer = 25 + Math.floor(Math.random() * 45);
}

function triggerNewPass(forceToUser = false) {
    if (forceToUser) {
        attackingTeam = 'home';
        const userIdx = pitchPlayers.findIndex(p => p.isUser);
        if (userIdx !== -1) {
            const u = pitchPlayers[userIdx];
            u.destX = 305;
            u.destY = 105 + (Math.random() * 24 - 12);
            pitchBall.fromX = pitchBall.x;
            pitchBall.fromY = pitchBall.y;
            pitchBall.passTargetIndex = userIdx;
            pitchBall.carrierIndex = null;
            pitchBall.passProgress = 0;
            document.getElementById('pitch-attack-status').innerText = `${gameData.club.name} Ceza Sahasına Giriyor!`;
            return;
        }
    }

    if (Math.random() < 0.32) {
        attackingTeam = attackingTeam === 'home' ? 'away' : 'home';
    }

    const candidates = pitchPlayers.filter((p, idx) => p.team === attackingTeam && idx !== pitchBall.carrierIndex && p.role !== 'GK');
    const receiver = candidates[Math.floor(Math.random() * candidates.length)];

    if (receiver) {
        pitchBall.fromX = pitchBall.x;
        pitchBall.fromY = pitchBall.y;
        pitchBall.passTargetIndex = receiver.id;
        pitchBall.carrierIndex = null;
        pitchBall.passProgress = 0;
    }

    const statusEl = document.getElementById('pitch-attack-status');
    if (statusEl) {
        statusEl.innerText = attackingTeam === 'home'
            ? `${gameData.club.name} Hücum Organizasyonu`
            : `${activeOpponent.name} Pas Yapıyor`;
    }
}

function renderTacticalPitchFrame() {
    const cvs = document.getElementById('tacticalPitchCanvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const W = cvs.width, H = cvs.height;

    const stripeCount = 10;
    const stripeW = W / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#1e6b3a' : '#18582f';
        ctx.fillRect(i * stripeW, 0, stripeW, H);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(10, 10, W - 20, H - 20);

    ctx.beginPath();
    ctx.moveTo(W / 2, 10);
    ctx.lineTo(W / 2, H - 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 28, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeRect(10, H / 2 - 48, 48, 96);
    ctx.strokeRect(10, H / 2 - 22, 18, 44);
    ctx.strokeRect(W - 58, H / 2 - 48, 48, 96);
    ctx.strokeRect(W - 28, H / 2 - 22, 18, 44);

    pitchPlayers.forEach(p => {
        p.rethinkTimer--;
        if (p.rethinkTimer <= 0) {
            updateIndividualPlayerTarget(p, W, H);
        }

        const dx = p.destX - p.x;
        const dy = p.destY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 1) {
            p.x += (dx / dist) * p.speed;
            p.y += (dy / dist) * p.speed;
        }

        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 4, 5, 2.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.isUser ? 6.5 : 5.2, 0, Math.PI * 2);
        if (p.team === 'home') {
            ctx.fillStyle = gameData ? gameData.club.c1 : '#22c55e';
            ctx.strokeStyle = gameData ? gameData.club.c2 : '#ffffff';
        } else {
            ctx.fillStyle = activeOpponent ? activeOpponent.c1 : '#ef4444';
            ctx.strokeStyle = activeOpponent ? activeOpponent.c2 : '#ffffff';
        }
        ctx.fill();
        ctx.lineWidth = 1.6;
        ctx.stroke();

        if (p.isUser) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 10.5, 0, Math.PI * 2);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    if (pitchBall.passProgress < 1 && pitchBall.passTargetIndex !== null) {
        const targetPlayer = pitchPlayers[pitchBall.passTargetIndex];
        pitchBall.passProgress = Math.min(1, pitchBall.passProgress + 0.08);
        pitchBall.x = pitchBall.fromX + (targetPlayer.x - pitchBall.fromX) * pitchBall.passProgress;
        pitchBall.y = pitchBall.fromY + (targetPlayer.y - pitchBall.fromY) * pitchBall.passProgress;

        ctx.beginPath();
        ctx.moveTo(pitchBall.fromX, pitchBall.fromY);
        ctx.lineTo(pitchBall.x, pitchBall.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (pitchBall.passProgress >= 1) {
            pitchBall.carrierIndex = pitchBall.passTargetIndex;
            pitchBall.passTargetIndex = null;
        }
    } else if (pitchBall.carrierIndex !== null) {
        const carrier = pitchPlayers[pitchBall.carrierIndex];
        const dir = carrier.team === 'home' ? 5 : -5;
        pitchBall.x = carrier.x + dir;
        pitchBall.y = carrier.y + 2;
    }

    ctx.beginPath();
    ctx.arc(pitchBall.x, pitchBall.y, 4.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    pitchAnimFrame = requestAnimationFrame(renderTacticalPitchFrame);
}

function stopTacticalPitch() {
    if (pitchAnimFrame) {
        cancelAnimationFrame(pitchAnimFrame);
        pitchAnimFrame = null;
    }
}

// =========================================================================
// 7. CANLI MAÇ MOTORU, 5 DRILL ANTRENMANI & HER GOLDE HİSSEDİLEN ANONS
// =========================================================================
let simInterval = null;
let matchMin = 0;
let hScore = 0, aScore = 0;
let mGoals = 0, mAssists = 0, mRating = 6.4;
let activeOpponent = null;
let criticalMoments = [];
let penaltyMomentMinute = null;

let actionWheelRot = 0;
let isActionSpinning = false;
let actionSlices = [];
let modalMode = 'match'; // 'match', 'penalty', 'drill_shooting', 'drill_playmaking', 'drill_dribbling', 'drill_heavy'
let matchActionType = 'shoot';
let focusUsedInModal = false;

function setMentality(m) {
    gameData.mentality = m;
    const costs = { safe: 12, balanced: 20, attack: 28 };
    document.getElementById('hub-mentality-cost').innerText = `-${costs[m]} Kondisyon`;

    ['safe', 'balanced', 'attack'].forEach(k => {
        const btn = document.getElementById('ment-' + k);
        if (!btn) return;
        btn.className = k === m
            ? "py-1.5 rounded-md bg-[#143321] text-xs font-extrabold text-[#eab308] shadow-sm transition"
            : "py-1.5 rounded-md text-xs font-extrabold text-slate-700 transition";
    });
}

function restBeforeMatch() {
    if (gameData.trainedThisWeek) return;
    gameData.trainedThisWeek = true;
    const recovery = 32 + Math.floor((gameData.stats.physic - 55) * 0.5);
    gameData.energy = Math.min(100, gameData.energy + recovery);
    gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 1);
    triggerFloatingBadge(`+${recovery} KONDİSYON`, "#0284c7");
    saveCurrentGame();
    updateGameHubUI();
}

// 4 ÖZEL ANTRENMAN PROGRAMI (DRILL)
function openTrainingModal(drillType) {
    if (gameData.trainedThisWeek) return;
    const cost = drillType === 'heavy_camp' ? 26 : 15;
    if (gameData.energy < cost) {
        alert(`Bu antrenman programı için en az %${cost} kondisyon gerekiyor!`);
        return;
    }
    gameData.energy -= cost;
    gameData.trainedThisWeek = true;
    focusUsedInModal = false;

    if (drillType === 'shooting') {
        modalMode = 'drill_shooting';
        document.getElementById('modal-badge').innerText = "ŞUT & BİTİRİCİLİK İDMANI";
        document.getElementById('modal-desc-text').innerText = "Kaleciyle karşı karşıya ve frikik çalışması! Çarkı çevir.";
    } else if (drillType === 'playmaking') {
        modalMode = 'drill_playmaking';
        gameData.coachTrust = Math.min(100, gameData.coachTrust + 5);
        document.getElementById('modal-badge').innerText = "TAKTİK & VİZYON (+5 GÜVEN)";
        document.getElementById('modal-desc-text').innerText = "Hocanın taktik tahtasında kilit pas organizasyonları çalıştın!";
    } else if (drillType === 'dribbling') {
        modalMode = 'drill_dribbling';
        document.getElementById('modal-badge').innerText = "SLALOM & BİRE BİR ÇALIM";
        document.getElementById('modal-desc-text').innerText = "Dar alanda adam eksiltme ve patlayıcı hız çalışması!";
    } else {
        modalMode = 'drill_heavy';
        gameData.coachTrust = Math.min(100, gameData.coachTrust + 14);
        gameData.lowRatingStreak = 0;
        document.getElementById('modal-badge').innerText = "AĞIR FİZİK KAMPI (+14 GÜVEN)";
        document.getElementById('modal-desc-text').innerText = "Tesislerden en son sen çıktın! Hoca azmine hayran kaldı.";
    }

    document.getElementById('modal-min-text').innerText = `H${gameData.week}`;
    document.getElementById('modal-player-controls').classList.add('hidden');
    document.getElementById('btn-spin-action').classList.remove('hidden');
    document.getElementById('btn-continue-action').classList.add('hidden');
    document.getElementById('action-wheel-modal').classList.remove('hidden');

    buildActionWheelSlices();
    updateGameHubUI();
}

function startMatchSimulation() {
    const costs = { safe: 12, balanced: 20, attack: 28 };
    const cost = costs[gameData.mentality];
    if (gameData.energy < cost) {
        alert("Kondisyonun bu maç temposu için yetersiz! Dinlen veya 'Rölanti' seç.");
        return;
    }

    gameData.energy -= cost;
    activeOpponent = getCurrentOpponent();
    const starter = isPlayerStarter();

    matchMin = 0; hScore = 0; aScore = 0;
    mGoals = 0; mAssists = 0; mRating = 6.3;

    if (starter) {
        criticalMoments = [
            Math.floor(Math.random() * 18) + 14,
            Math.floor(Math.random() * 20) + 46,
            Math.floor(Math.random() * 16) + 72
        ];
        document.getElementById('live-role-indicator').innerText = "SAHADASIN (İLK 11)";
    } else {
        criticalMoments = [Math.floor(Math.random() * 12) + 77];
        document.getElementById('live-role-indicator').innerText = "YEDEK KULÜBESİ (75'TE GİRER)";
    }

    // Eğer haftalık olayda penaltıcılığı aldıysa maç içinde ekstra Penaltı dakikası ekle!
    penaltyMomentMinute = gameData.nextMatchPenaltyDuty ? (Math.floor(Math.random() * 30) + 32) : null;

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

    pushMatchFeed(1, starter ? "Hakem düdüğü çaldı, maça İlk 11'de başladın!" : "Maç başladı. Yedek kulübesinde hocadan forma bekliyorsun.", "text-slate-700");
    refreshLiveMatchUI();
    updateGameHubUI();
    continueMatchClock();
}

function continueMatchClock() {
    const starter = isPlayerStarter();
    simInterval = setInterval(() => {
        matchMin += 2;
        document.getElementById('match-live-min').innerText = `${matchMin}'`;

        triggerNewPass(false);

        if (!starter && matchMin === 74) {
            document.getElementById('live-role-indicator').innerText = "OYUNA GİRDİN (74')";
            pushMatchFeed(74, `Teknik direktör seni sahaya sürdü! Kendini göstermek için son dakikalar.`, "text-amber-700 font-black");
        }

        // Penaltı Görevi Varsa Penaltı Çarkı Tetiklenir!
        if (penaltyMomentMinute && matchMin >= penaltyMomentMinute) {
            penaltyMomentMinute = null;
            clearInterval(simInterval);
            openPenaltyWheelModal();
            return;
        }

        // MAÇ İÇİ DİĞER GOLLER: Artık oyun 1.5 sn duraksar ve kimin attığını dev skorbordla hissettirir!
        if (Math.random() < 0.042 && !criticalMoments.includes(matchMin)) {
            clearInterval(simInterval);
            const homeChance = 0.48 + (gameData.club.power - activeOpponent.power) * 0.016;
            if (Math.random() < homeChance) {
                hScore++;
                pitchBall.passProgress = 1; pitchBall.carrierIndex = null;
                pitchBall.x = 368; pitchBall.y = 110;
                pushMatchFeed(matchMin, `GOOOL! ${gameData.club.name} takım arkadaşının vuruşuyla golü buldu! (${hScore}-${aScore})`, "text-emerald-700 font-black");
                refreshLiveMatchUI();
                triggerMatchGoalBanner(gameData.club, true, `${matchMin}' Takım Arkadaşın Attı!`, hScore, aScore);
            } else {
                aScore++;
                pitchBall.passProgress = 1; pitchBall.carrierIndex = null;
                pitchBall.x = 12; pitchBall.y = 110;
                pushMatchFeed(matchMin, `GOL! ${activeOpponent.name} savunmamızı hazırlıksız yakaladı ve golü attı. (${hScore}-${aScore})`, "text-red-700 font-black");
                refreshLiveMatchUI();
                triggerMatchGoalBanner(activeOpponent, false, `${matchMin}' ${activeOpponent.name} Golü Buldu`, hScore, aScore);
            }
            setTimeout(() => {
                if (matchMin < 90) continueMatchClock();
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
            document.getElementById('match-live-min').innerText = "MS";
            pushMatchFeed(90, `90 dakika sona erdi! Skor: ${gameData.club.name} ${hScore} - ${aScore} ${activeOpponent.name}`, "text-[#0f291a] font-black");
            document.getElementById('btn-end-match').classList.remove('hidden');
        }
    }, 260);
}

function openPenaltyWheelModal() {
    modalMode = 'penalty';
    focusUsedInModal = false;
    document.getElementById('modal-badge').innerText = "PENALTI VURUŞU!";
    document.getElementById('modal-min-text').innerText = `${matchMin}'`;
    document.getElementById('modal-desc-text').innerText = "Hakem beyaz noktayı gösterdi! Topun başında sen varsın, nefesler tutuldu!";
    document.getElementById('modal-player-controls').classList.add('hidden');
    document.getElementById('btn-spin-action').classList.remove('hidden');
    document.getElementById('btn-continue-action').classList.add('hidden');
    buildActionWheelSlices();
    document.getElementById('action-wheel-modal').classList.remove('hidden');
}

function pushMatchFeed(min, text, cls) {
    const list = document.getElementById('match-feed-list');
    const div = document.createElement('div');
    div.className = "flex gap-2 py-1 border-b border-slate-300";
    div.innerHTML = `<span class="font-led font-bold text-[#0f291a] w-7 shrink-0">${min}'</span><span class="${cls}">${text}</span>`;
    list.prepend(div);
}

function refreshLiveMatchUI() {
    document.getElementById('live-home-score').innerText = hScore;
    document.getElementById('live-away-score').innerText = aScore;
    document.getElementById('live-player-rating').innerText = mRating.toFixed(1);
    document.getElementById('live-player-stats').innerText = `${mGoals} GOL • ${mAssists} ASİST`;
}

function openMatchPositionWheel() {
    modalMode = 'match';
    focusUsedInModal = false;

    const texts = [
        "Ceza sahası yayında topla buluştun! Şut açın da var, pas opsiyonun da.",
        "Hızlı hücumda topla ilerliyorsun, rakip savunma yerleşmeye çalışıyor.",
        "Ceza sahası içinde topla buluştun, karar anı!"
    ];
    document.getElementById('modal-badge').innerText = "KRİTİK HÜCUM POZİSYONU";
    document.getElementById('modal-min-text').innerText = `${matchMin}'`;
    document.getElementById('modal-desc-text').innerText = texts[Math.floor(Math.random() * texts.length)];
    document.getElementById('modal-player-controls').classList.remove('hidden');
    document.getElementById('btn-spin-action').classList.remove('hidden');
    document.getElementById('btn-continue-action').classList.add('hidden');

    setMatchActionType('shoot');
    document.getElementById('action-wheel-modal').classList.remove('hidden');
}

function setMatchActionType(type) {
    if (isActionSpinning) return;
    matchActionType = type;
    ['shoot', 'pass', 'dribble'].forEach(t => {
        const btn = document.getElementById('act-btn-' + t);
        btn.className = t === type
            ? "py-1.5 px-1 border-2 border-[#0f291a] bg-[#16a34a] font-sport text-sm font-black uppercase text-white"
            : "py-1.5 px-1 border-2 border-[#0f291a] bg-[#e6e0cc] font-sport text-sm font-black uppercase text-slate-800";
    });
    buildActionWheelSlices();
}

function spendFocusOnWheel() {
    if (isActionSpinning || focusUsedInModal) return;
    if (gameData.focus < 1) {
        alert("Soğukkanlılık (Odak) puanın kalmadı!");
        return;
    }
    gameData.focus--;
    focusUsedInModal = true;
    triggerFloatingBadge("ODAK AKTİF!", "#eab308");
    buildActionWheelSlices();
    updateGameHubUI();
}

function buildActionWheelSlices() {
    if (modalMode === 'penalty') {
        const penGoalW = Math.min(82, 58 + (gameData.stats.shoot - 55) * 0.9);
        actionSlices = [
            { id: 'shoot_goal', label: 'PENALTI GOL!', weight: penGoalW, color: '#16a34a' },
            { id: 'shoot_save', label: 'KALECİ ÇIKARDI', weight: (100 - penGoalW) * 0.65, color: '#2563eb' },
            { id: 'shoot_post', label: 'DİREKTEN DÖNDÜ', weight: (100 - penGoalW) * 0.35, color: '#d97706' }
        ];
    } else if (modalMode === 'match') {
        const oppDefDifficulty = Math.max(0, (activeOpponent.power - 65) * 0.65);
        const focusBonus = focusUsedInModal ? 1.45 : 1.0;
        const promiseBonus = gameData.nextMatchGoalPromise ? 1.28 : 1.0;

        if (matchActionType === 'shoot') {
            const rawShoot = Math.max(5, (gameData.stats.shoot - 50) * 1.35 - oppDefDifficulty);
            let golW = Math.max(4, rawShoot * focusBonus * promiseBonus);
            let postW = 14;
            let saveW = Math.max(20, 48 - (gameData.stats.shoot - 60) * 0.5);
            let outW = Math.max(12, (42 - (gameData.stats.shoot - 60) * 0.7) / focusBonus);

            if (gameData.mentality === 'attack') { golW *= 1.15; outW *= 1.1; }

            actionSlices = [
                { id: 'shoot_goal', label: 'GOL', weight: golW, color: '#16a34a' },
                { id: 'shoot_post', label: 'DİREK', weight: postW, color: '#d97706' },
                { id: 'shoot_save', label: 'KURTARIŞ', weight: saveW, color: '#2563eb' },
                { id: 'shoot_out', label: 'AUT', weight: outW, color: '#dc2626' }
            ];
        } else if (matchActionType === 'pass') {
            const rawPass = Math.max(5, (gameData.stats.pass - 50) * 1.4 - oppDefDifficulty);
            let asistW = Math.max(5, rawPass * focusBonus);
            let keyPassW = Math.max(15, 22 + (gameData.stats.pass - 60) * 0.6);
            let safePassW = 32;
            let missPassW = Math.max(10, (38 - (gameData.stats.pass - 60) * 0.8) / focusBonus);

            actionSlices = [
                { id: 'pass_assist', label: 'ASİST', weight: asistW, color: '#2563eb' },
                { id: 'pass_key', label: 'KİLİT PAS', weight: keyPassW, color: '#16a34a' },
                { id: 'pass_safe', label: 'TEMİZ PAS', weight: safePassW, color: '#64748b' },
                { id: 'pass_lose', label: 'PAS HATASI', weight: missPassW, color: '#dc2626' }
            ];
        } else {
            const rawDrib = Math.max(5, (gameData.stats.dribble - 50) * 1.35 - oppDefDifficulty);
            let soloGoalW = Math.max(4, (rawDrib * 0.75) * focusBonus * promiseBonus);
            let dribSuccessW = Math.max(18, 28 + (gameData.stats.dribble - 60) * 0.8);
            let foulW = 16;
            let tackledW = Math.max(12, (42 - (gameData.stats.dribble - 60) * 0.8) / focusBonus);

            actionSlices = [
                { id: 'drib_goal', label: 'ÇALIM & GOL', weight: soloGoalW, color: '#16a34a' },
                { id: 'drib_win', label: 'ADAM GEÇTİN', weight: dribSuccessW, color: '#7c3aed' },
                { id: 'drib_foul', label: 'FAUL ALDIN', weight: foulW, color: '#d97706' },
                { id: 'drib_lose', label: 'TOP KAYBI', weight: tackledW, color: '#dc2626' }
            ];
        }
    } else if (modalMode === 'drill_shooting') {
        actionSlices = [
            { id: 't_shoot', label: '+1 BİTİRİCİLİK', weight: 52, color: '#16a34a' },
            { id: 't_shoot_focus', label: '+1 ŞUT & +1 ODAK', weight: 28, color: '#d97706' },
            { id: 't_drib', label: '+1 TOP SÜRME', weight: 20, color: '#7c3aed' }
        ];
    } else if (modalMode === 'drill_playmaking') {
        actionSlices = [
            { id: 't_pass', label: '+1 VİZYON (PAS)', weight: 55, color: '#2563eb' },
            { id: 't_super', label: '+1 PAS & +1 ŞUT', weight: 25, color: '#d97706' },
            { id: 't_phys', label: '+1 DAYANIKLILIK', weight: 20, color: '#16a34a' }
        ];
    } else if (modalMode === 'drill_dribbling') {
        actionSlices = [
            { id: 't_drib', label: '+1 TOP SÜRME', weight: 55, color: '#7c3aed' },
            { id: 't_drib_phys', label: '+1 ÇALIM & +1 FİZİK', weight: 28, color: '#d97706' },
            { id: 't_shoot', label: '+1 BİTİRİCİLİK', weight: 17, color: '#16a34a' }
        ];
    } else {
        // Ağır Fizik Kampı
        actionSlices = [
            { id: 't_super', label: '+2 ÇİFT GELİŞİM!', weight: 38, color: '#d97706' },
            { id: 't_phys', label: '+2 DAYANIKLILIK', weight: 32, color: '#16a34a' },
            { id: 't_shoot', label: '+1 BİTİRİCİLİK', weight: 18, color: '#2563eb' },
            { id: 't_strain', label: 'KAS YORGUNLUĞU (-10 KOND)', weight: 12, color: '#dc2626' }
        ];
    }
    drawActionWheel();
}

function drawActionWheel() {
    const cvs = document.getElementById('actionWheelCanvas');
    const ctx = cvs.getContext('2d');
    const cx = cvs.width / 2, cy = cvs.height / 2, r = cx - 4;
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    const total = actionSlices.reduce((s, x) => s + x.weight, 0);
    let angle = actionWheelRot;

    actionSlices.forEach(s => {
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
        ctx.font = '800 10px Nunito, sans-serif';
        const pct = Math.round((s.weight / total) * 100);
        ctx.fillText(`${s.label} (%${pct})`, r - 12, 4, r - 36);
        ctx.restore();

        angle += sa;
    });
}

function spinActionWheel() {
    if (isActionSpinning) return;
    isActionSpinning = true;
    document.getElementById('btn-spin-action').disabled = true;

    const spin = (Math.PI * 2 * 6) + (Math.random() * Math.PI * 2);
    const dur = 2500;
    const start = performance.now();
    const sRot = actionWheelRot;

    function frame(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        actionWheelRot = sRot + spin * ease;
        drawActionWheel();
        bounceWheelPointer('action-wheel-pointer', actionWheelRot);

        if (p < 1) {
            requestAnimationFrame(frame);
        } else {
            resetWheelPointer('action-wheel-pointer');
            isActionSpinning = false;
            document.getElementById('btn-spin-action').disabled = false;
            resolveActionWheel();
        }
    }
    requestAnimationFrame(frame);
}

function resolveActionWheel() {
    const pointer = Math.PI * 1.5;
    const norm = ((actionWheelRot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const target = ((pointer - norm) + Math.PI * 2) % (Math.PI * 2);
    const total = actionSlices.reduce((s, x) => s + x.weight, 0);
    let acc = 0, winner = actionSlices[0];

    for (const s of actionSlices) {
        const sa = (s.weight / total) * (Math.PI * 2);
        if (target >= acc && target <= acc + sa) { winner = s; break; }
        acc += sa;
    }

    if (modalMode === 'match' || modalMode === 'penalty') {
        switch (winner.id) {
            case 'shoot_goal':
            case 'drib_goal':
                hScore++; mGoals++; gameData.goals++; gameData.allTimeGoals++; gameData.money += 850;
                mRating = Math.min(10, mRating + 1.4);
                document.getElementById('modal-desc-text').innerText = "GOOOL! Muhteşem bir bitirişle topu ağlara gönderdin!";
                pushMatchFeed(matchMin, `GOOOL! ${gameData.name} sahneye çıktı ve ağları havalandırdı! (${hScore}-${aScore})`, "text-emerald-700 font-black");
                triggerMatchGoalBanner(gameData.club, true, `${matchMin}' ${gameData.name} (GOL!)`, hScore, aScore);
                break;
            case 'shoot_post':
                mRating = Math.min(10, mRating + 0.2);
                document.getElementById('modal-desc-text').innerText = "DİREKTEN DÖNDÜ! Direk gole izin vermedi.";
                pushMatchFeed(matchMin, `DİREK! ${gameData.name} sert vurdu ama top direkten döndü.`, "text-amber-700 font-black");
                break;
            case 'shoot_save':
                mRating = Math.min(10, mRating + 0.1);
                document.getElementById('modal-desc-text').innerText = "Kaleci parmaklarının ucuyla kornere çeldi.";
                pushMatchFeed(matchMin, `${gameData.name} köşeye vurdu, kaleci güçlükle kurtardı.`, "text-blue-700");
                break;
            case 'shoot_out':
                mRating = Math.max(4.0, mRating - 0.35);
                document.getElementById('modal-desc-text').innerText = "Çerçeveyi bulamadın, top üstten auta gitti.";
                pushMatchFeed(matchMin, `${gameData.name} müsait pozisyonda topu dışarı vurdu.`, "text-red-600");
                break;
            case 'pass_assist':
                hScore++; mAssists++; gameData.assists++; gameData.allTimeAssists++; gameData.money += 550;
                mRating = Math.min(10, mRating + 1.0);
                document.getElementById('modal-desc-text').innerText = "ASİST! Savunmayı ikiye bölen pasın golle sonuçlandı!";
                pushMatchFeed(matchMin, `ASİST! ${gameData.name} kilit pası verdi, takımımız golü buldu! (${hScore}-${aScore})`, "text-blue-700 font-black");
                triggerMatchGoalBanner(gameData.club, true, `${matchMin}' Asist: ${gameData.name}`, hScore, aScore);
                break;
            case 'pass_key':
                mRating = Math.min(10, mRating + 0.4);
                document.getElementById('modal-desc-text').innerText = "Harika bir kilit pas attın, tribünler vizyonunu alkışladı.";
                pushMatchFeed(matchMin, `${gameData.name} tehlikeli bir ara pasıyla pozisyon yarattı.`, "text-emerald-700");
                break;
            case 'pass_safe':
                mRating = Math.min(10, mRating + 0.1);
                document.getElementById('modal-desc-text').innerText = "Topu güvenli şekilde takım arkadaşına aktardın.";
                pushMatchFeed(matchMin, `${gameData.name} oyunu kanada doğru açtı.`, "text-slate-600");
                break;
            case 'drib_win':
                mRating = Math.min(10, mRating + 0.35);
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 1);
                document.getElementById('modal-desc-text').innerText = "Rakibini şık bir çalımla geçtin (+1 Odak Puanı).";
                pushMatchFeed(matchMin, `${gameData.name} bire birde rakibini eksiltti.`, "text-purple-700 font-black");
                triggerFloatingBadge("+1 ODAK!", "#7c3aed");
                break;
            case 'drib_foul':
                mRating = Math.min(10, mRating + 0.2);
                document.getElementById('modal-desc-text').innerText = "Rakip seni ancak faulle durdurabildi. Tehlikeli serbest vuruş.";
                pushMatchFeed(matchMin, `${gameData.name} çalımla geçerken düşürüldü, sarı kart.`, "text-amber-700");
                break;
            default:
                mRating = Math.max(4.0, mRating - 0.45);
                document.getElementById('modal-desc-text').innerText = "Kötü tercih! Topu rakibe kaptırdın.";
                pushMatchFeed(matchMin, `${gameData.name} kritik bölgede top kaybı yaptı.`, "text-red-600");
                break;
        }
        refreshLiveMatchUI();
    } else {
        if (winner.id === 't_shoot') { gameData.stats.shoot++; document.getElementById('modal-desc-text').innerText = "Bitiricilik (Şut) +1 gelişti!"; triggerFloatingBadge("+1 ŞUT!", "#16a34a"); }
        if (winner.id === 't_shoot_focus') { gameData.stats.shoot++; gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 1); document.getElementById('modal-desc-text').innerText = "Şut +1 gelişti ve +1 Odak kazandın!"; triggerFloatingBadge("+1 ŞUT & +1 ODAK!", "#eab308"); }
        if (winner.id === 't_pass') { gameData.stats.pass++; document.getElementById('modal-desc-text').innerText = "Vizyon (Pas) +1 gelişti!"; triggerFloatingBadge("+1 PAS!", "#2563eb"); }
        if (winner.id === 't_drib') { gameData.stats.dribble++; document.getElementById('modal-desc-text').innerText = "Top Sürme +1 gelişti!"; triggerFloatingBadge("+1 ÇALIM!", "#7c3aed"); }
        if (winner.id === 't_drib_phys') { gameData.stats.dribble++; gameData.stats.physic++; document.getElementById('modal-desc-text').innerText = "Top Sürme +1 ve Fizik +1 gelişti!"; triggerFloatingBadge("+1 ÇALIM & +1 FİZİK!", "#7c3aed"); }
        if (winner.id === 't_phys') { gameData.stats.physic += 2; document.getElementById('modal-desc-text').innerText = "Dayanıklılık +2 gelişti!"; triggerFloatingBadge("+2 DAYANIKLILIK!", "#16a34a"); }
        if (winner.id === 't_super') { gameData.stats.shoot++; gameData.stats.pass++; document.getElementById('modal-desc-text').innerText = "ÇİFT GELİŞİM! Şut ve Pas +1 gelişti!"; triggerFloatingBadge("+2 SÜPER GELİŞİM!", "#d97706"); }
        if (winner.id === 't_strain') { gameData.energy = Math.max(0, gameData.energy - 10); document.getElementById('modal-desc-text').innerText = "Ağır kampta kasların zorlandı (-10 Kondisyon)."; triggerFloatingBadge("-10 KONDİSYON", "#dc2626"); }
        saveCurrentGame();
        updateGameHubUI();
    }

    document.getElementById('btn-spin-action').classList.add('hidden');
    document.getElementById('btn-continue-action').classList.remove('hidden');
}

function closeActionModal() {
    document.getElementById('action-wheel-modal').classList.add('hidden');
    if (modalMode === 'match' || modalMode === 'penalty') continueMatchClock();
}

// =========================================================================
// 8. GERÇEKÇİ LİG SİMÜLASYONU (TAKIM GÜÇLERİNE DAYALI POISSON MODELİ)
// & HAFTALIK KAOS / KARAR KARTLARI TETİKLEYİCİSİ
// =========================================================================
let activeWeeklyEvent = null;

// İki takımın gerçek gücüne (power) göre mantıklı futbol skoru üreten algoritma
function simulateRealisticAIMatch(homeTeam, awayTeam) {
    // Ev sahibi avantajı (+2.5 güç) ve iki takım arasındaki net güç farkı
    const diff = (homeTeam.power + 2.5) - awayTeam.power;

    // Beklenen gol ortalaması (Expected Goals - xG)
    const homeExpected = Math.max(0.35, Math.min(3.4, 1.35 + diff * 0.085));
    const awayExpected = Math.max(0.25, Math.min(3.1, 1.10 - diff * 0.075));

    // 90 dakikalık 10 atak dilimi üzerinden olasılıksal gol üretimi
    let gHome = 0, gAway = 0;
    for (let i = 0; i < 6; i++) {
        if (Math.random() < (homeExpected / 6)) gHome++;
        if (Math.random() < (awayExpected / 6)) gAway++;
    }
    return { gHome, gAway };
}

function finishMatchAndSave(fromQuickSim = false) {
    stopTacticalPitch();
    gameData.matches++;
    gameData.allTimeMatches++;
    gameData.money += 450;

    if (!fromQuickSim) {
        applyCoachTrustAfterMatch(mRating, mGoals, mAssists);
    }

    const myTeam = gameData.standings.find(t => t.isPlayerClub);
    const oppTeam = gameData.standings.find(t => t.name === activeOpponent.name);
    applyMatchResultToTable(myTeam, oppTeam, hScore, aScore);

    // DİĞER TAKIMLARIN MAÇLARI: Artık tamamen güçlerine göre gerçekçi oynanır!
    const restTeams = [...gameData.standings].filter(t => !t.isPlayerClub && t.name !== activeOpponent.name);
    // Her hafta farklı eşleşmeler olması için haftaya göre kaydır
    const shift = gameData.week % restTeams.length;
    const rotated = restTeams.slice(shift).concat(restTeams.slice(0, shift));

    for (let i = 0; i < rotated.length; i += 2) {
        if (!rotated[i + 1]) break;
        const tA = rotated[i];
        const tB = rotated[i + 1];
        const simRes = simulateRealisticAIMatch(tA, tB);
        applyMatchResultToTable(tA, tB, simRes.gHome, simRes.gAway);
    }

    const totalWeeksInSeason = (gameData.standings.length - 1) * 2;
    if (gameData.week >= totalWeeksInSeason) {
        concludeSeason();
    } else {
        gameData.week++;
    }

    gameData.trainedThisWeek = false;
    const naturalRec = 14 + Math.floor((gameData.stats.physic - 55) * 0.3);
    gameData.energy = Math.min(100, gameData.energy + naturalRec);

    saveCurrentGame();

    document.getElementById('tab-content-match').classList.add('hidden');
    document.getElementById('game-bottom-nav').classList.remove('hidden');
    switchGameTab('hub');
    updateGameHubUI();

    // Yeni haftaya geçildiğinde %55 ihtimalle Haftalık Kaos & Karar Kartı çıkar!
    if (Math.random() < 0.55) {
        setTimeout(() => triggerRandomWeeklyEventCard(), 300);
    }
}

let lastTriggeredEventId = null;

function triggerRandomWeeklyEventCard() {
    // Üst üste aynı kartın gelmesini engelle
    const availablePool = WEEKLY_EVENTS_POOL.filter(e => e.id !== lastTriggeredEventId);
    activeWeeklyEvent = availablePool[Math.floor(Math.random() * availablePool.length)];
    lastTriggeredEventId = activeWeeklyEvent.id;

    document.getElementById('event-category-tag').innerText = activeWeeklyEvent.category;
    document.getElementById('event-week-tag').innerText = `HAFTA ${gameData.week}`;
    document.getElementById('event-title').innerText = activeWeeklyEvent.title;
    document.getElementById('event-desc').innerText = activeWeeklyEvent.desc;

    document.getElementById('event-svg-a').innerHTML = activeWeeklyEvent.choiceA.svg;
    document.getElementById('event-title-a').innerText = activeWeeklyEvent.choiceA.title;
    document.getElementById('event-sub-a').innerText = activeWeeklyEvent.choiceA.sub;
    document.getElementById('event-effect-a').innerText = activeWeeklyEvent.choiceA.effectText;

    document.getElementById('event-svg-b').innerHTML = activeWeeklyEvent.choiceB.svg;
    document.getElementById('event-title-b').innerText = activeWeeklyEvent.choiceB.title;
    document.getElementById('event-sub-b').innerText = activeWeeklyEvent.choiceB.sub;
    document.getElementById('event-effect-b').innerText = activeWeeklyEvent.choiceB.effectText;

    document.getElementById('event-decision-modal').classList.remove('hidden');
}

function resolveWeeklyEventChoice(choice) {
    if (!activeWeeklyEvent) return;
    const evId = activeWeeklyEvent.id;

    switch (evId) {
        case 'nightclub_scandal':
            if (choice === 'A') {
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 10);
                gameData.focus = Math.max(0, gameData.focus - 1);
                triggerFloatingBadge("+10 HOCA GÜVENİ", "#16a34a");
            } else {
                gameData.coachTrust = Math.max(10, gameData.coachTrust - 10);
                gameData.nextMatchGoalPromise = true;
                triggerFloatingBadge("MEYDAN OKUDUN! GOL +%12", "#eab308");
            }
            break;

        case 'penalty_duty':
            if (choice === 'A') {
                gameData.nextMatchPenaltyDuty = true;
                triggerFloatingBadge("PENALTILAR SENDE!", "#16a34a");
            } else {
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 12);
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 1);
                triggerFloatingBadge("+12 GÜVEN & +1 ODAK", "#2563eb");
            }
            break;

        case 'sponsor_shoot':
            if (choice === 'A') {
                gameData.money += 1800;
                gameData.energy = Math.max(0, gameData.energy - 15);
                triggerFloatingBadge("+₺1.800 NAKİT!", "#16a34a");
            } else {
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 8);
                gameData.energy = Math.min(100, gameData.energy + 10);
                triggerFloatingBadge("+8 GÜVEN & +10 KOND.", "#2563eb");
            }
            break;

        case 'tactical_dispute':
            if (choice === 'A') {
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 12);
                gameData.stats.physic++;
                triggerFloatingBadge("+12 GÜVEN & +1 FİZİK", "#16a34a");
            } else {
                gameData.coachTrust = Math.max(10, gameData.coachTrust - 8);
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 2);
                triggerFloatingBadge("+2 ODAK PUANI!", "#eab308");
            }
            break;

        case 'painkiller_risk':
            if (choice === 'A') {
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 12);
                gameData.energy = Math.max(5, gameData.energy - 20);
                triggerFloatingBadge("FEDAKARLIK! +12 GÜVEN", "#16a34a");
            } else {
                gameData.energy = Math.min(100, gameData.energy + 22);
                gameData.coachTrust = Math.max(10, gameData.coachTrust - 10);
                triggerFloatingBadge("+22 KONDİSYON", "#0284c7");
            }
            break;

        case 'social_media_feud':
            if (choice === 'A') {
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 2);
                gameData.coachTrust = Math.max(10, gameData.coachTrust - 8);
                triggerFloatingBadge("HIRS YAPTIN! +2 ODAK", "#eab308");
            } else {
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 8);
                gameData.stats.pass++;
                triggerFloatingBadge("+1 PAS & +8 GÜVEN", "#16a34a");
            }
            break;

        case 'president_bonus':
            if (choice === 'A') {
                gameData.money += 1000;
                gameData.nextMatchGoalPromise = true;
                triggerFloatingBadge("+₺1.000 & GOL SÖZÜ!", "#eab308");
            } else {
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 10);
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 1);
                triggerFloatingBadge("+10 GÜVEN & +1 ODAK", "#16a34a");
            }
            break;

        case 'training_fight':
            if (choice === 'A') {
                gameData.stats.physic++;
                gameData.coachTrust = Math.max(10, gameData.coachTrust - 10);
                triggerFloatingBadge("+1 DAYANIKLILIK (FİZİK)!", "#dc2626");
            } else {
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 10);
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 1);
                triggerFloatingBadge("PROFESYONEL! +10 GÜVEN", "#16a34a");
            }
            break;

        case 'boot_prototype':
            if (choice === 'A') {
                gameData.stats.shoot++;
                gameData.stats.dribble++;
                gameData.energy = Math.max(5, gameData.energy - 14);
                triggerFloatingBadge("+1 ŞUT & +1 ÇALIM!", "#eab308");
            } else {
                gameData.energy = Math.min(100, gameData.energy + 12);
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 1);
                triggerFloatingBadge("+12 KONDİSYON & +1 ODAK", "#2563eb");
            }
            break;

        case 'luxury_car':
            if (choice === 'A') {
                gameData.money = Math.max(0, gameData.money - 2000);
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 2);
                gameData.nextMatchGoalPromise = true;
                triggerFloatingBadge("SPOR ARABA ALINDI! +2 ODAK", "#ef4444");
            } else {
                gameData.money += 600;
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 8);
                triggerFloatingBadge("+₺600 YATIRIM & +8 GÜVEN", "#16a34a");
            }
            break;

        case 'freekick_master':
            if (choice === 'A') {
                gameData.stats.shoot += 2;
                gameData.energy = Math.max(5, gameData.energy - 18);
                triggerFloatingBadge("+2 BİTİRİCİLİK (ŞUT)!", "#16a34a");
            } else {
                gameData.energy = Math.min(100, gameData.energy + 15);
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 5);
                triggerFloatingBadge("+15 KONDİSYON", "#0284c7");
            }
            break;

        case 'transfer_rumor':
            if (choice === 'A') {
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 2);
                gameData.coachTrust = Math.max(10, gameData.coachTrust - 10);
                triggerFloatingBadge("VİTRİN MAÇI! +2 ODAK", "#eab308");
            } else {
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 14);
                gameData.money += 750;
                triggerFloatingBadge("+14 GÜVEN & +₺750 PRİM", "#16a34a");
            }
            break;

        case 'strict_diet':
            if (choice === 'A') {
                gameData.money = Math.max(0, gameData.money - 1200);
                gameData.stats.physic += 2;
                gameData.energy = Math.min(100, gameData.energy + 15);
                triggerFloatingBadge("+2 FİZİK & +15 KOND.!", "#16a34a");
            } else {
                gameData.energy = Math.min(100, gameData.energy + 15);
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 1);
                triggerFloatingBadge("+15 KONDİSYON & +1 ODAK", "#2563eb");
            }
            break;

        case 'fan_event':
            if (choice === 'A') {
                gameData.money = Math.max(0, gameData.money - 400);
                gameData.focus = Math.min(gameData.maxFocus, gameData.focus + 2);
                gameData.coachTrust = Math.min(100, gameData.coachTrust + 10);
                triggerFloatingBadge("TARAFTAR SEVGİSİ! +2 ODAK", "#16a34a");
            } else {
                gameData.energy = Math.min(100, gameData.energy + 15);
                gameData.coachTrust = Math.max(10, gameData.coachTrust - 6);
                triggerFloatingBadge("+15 KONDİSYON", "#64748b");
            }
            break;
    }

    document.getElementById('event-decision-modal').classList.add('hidden');
    activeWeeklyEvent = null;
    saveCurrentGame();
    updateGameHubUI();
}

function concludeSeason() {
    const sorted = [...gameData.standings].sort((a, b) => b.pts - a.pts || (b.ag - b.yg) - (a.ag - a.yg));
    const finishRank = sorted.findIndex(t => t.isPlayerClub) + 1;

    gameData.careerHistory.push({
        season: gameData.season,
        clubName: gameData.club.name,
        c1: gameData.club.c1,
        c2: gameData.club.c2,
        matches: gameData.matches,
        goals: gameData.goals,
        assists: gameData.assists,
        rank: finishRank
    });

    if (finishRank === 1) {
        gameData.trophies.push({ title: `${gameData.leagueName} Şampiyonluğu`, season: `Sezon ${gameData.season}`, club: gameData.club.name, type: 'league' });
        gameData.money += 15000;
        alert(`TEBRİKLER! ${gameData.club.name} ile ${gameData.leagueName} ŞAMPİYONU OLDUN! Kupa müzene eklendi.`);
    }
    if (gameData.goals >= 18) {
        gameData.trophies.push({ title: `Altın Krampon (Gol Kralı - ${gameData.goals}G)`, season: `Sezon ${gameData.season}`, club: gameData.club.name, type: 'boot' });
    }
    if (gameData.assists >= 12) {
        gameData.trophies.push({ title: `Sezonun Oyun Kurucusu (${gameData.assists}A)`, season: `Sezon ${gameData.season}`, club: gameData.club.name, type: 'playmaker' });
    }

    gameData.season++;
    gameData.age++;
    gameData.week = 1;
    gameData.matches = 0;
    gameData.goals = 0;
    gameData.assists = 0;
    gameData.standings.forEach(t => {
        t.om = 0; t.g = 0; t.b = 0; t.m = 0; t.ag = 0; t.yg = 0; t.pts = 0; t.last5 = [];
    });
}

function applyMatchResultToTable(t1, t2, g1, g2) {
    t1.om++; t2.om++;
    t1.ag += g1; t1.yg += g2;
    t2.ag += g2; t2.yg += g1;
    if (g1 > g2) {
        t1.g++; t1.pts += 3; t1.last5.push('W');
        t2.m++; t2.last5.push('L');
    } else if (g1 < g2) {
        t2.g++; t2.pts += 3; t2.last5.push('W');
        t1.m++; t1.last5.push('L');
    } else {
        t1.b++; t2.b++;
        t1.pts += 1; t2.pts += 1;
        t1.last5.push('D'); t2.last5.push('D');
    }
}

function renderStandingsTable() {
    document.getElementById('league-season-indicator').innerText = `SEZON ${gameData.season}`;
    const sorted = [...gameData.standings].sort((a, b) => b.pts - a.pts || (b.ag - b.yg) - (a.ag - a.yg) || b.ag - a.ag);
    const tbody = document.getElementById('standings-tbody');
    tbody.innerHTML = '';

    sorted.forEach((t, i) => {
        const rank = i + 1;
        const av = t.ag - t.yg;

        let leftBarColor = "border-l-4 border-l-transparent";
        if (rank <= 2) leftBarColor = "border-l-4 border-l-blue-600";
        else if (rank === 3) leftBarColor = "border-l-4 border-l-amber-500";
        else if (rank === 4) leftBarColor = "border-l-4 border-l-emerald-600";
        else if (rank >= sorted.length - 2) leftBarColor = "border-l-4 border-l-red-600";

        const last5HTML = t.last5.slice(-5).map(res => {
            if (res === 'W') return `<span class="inline-flex items-center justify-center w-4 h-4 bg-[#16a34a] text-white font-black text-[9px]">G</span>`;
            if (res === 'D') return `<span class="inline-flex items-center justify-center w-4 h-4 bg-slate-500 text-white font-black text-[9px]">B</span>`;
            return `<span class="inline-flex items-center justify-center w-4 h-4 bg-[#dc2626] text-white font-black text-[9px]">M</span>`;
        }).join(' ');

        const tr = document.createElement('tr');
        tr.className = `${leftBarColor} ${t.isPlayerClub ? 'bg-[#d9f99d] font-black text-[#0f291a]' : 'hover:bg-white/60'}`;
        tr.innerHTML = `
            <td class="py-2 pl-2 pr-1 flex items-center gap-1.5 whitespace-nowrap">
                <span class="w-4 text-[10px] text-slate-500 font-black">${rank}</span>
                ${generateClubCrestSVG(t.c1, t.c2, 16)}
                <span class="truncate max-w-[95px]">${t.name}</span>
            </td>
            <td class="py-2 px-1 text-center">${t.om}</td>
            <td class="py-2 px-1 text-center">${t.g}</td>
            <td class="py-2 px-1 text-center">${t.b}</td>
            <td class="py-2 px-1 text-center">${t.m}</td>
            <td class="py-2 px-1 text-center">${av > 0 ? '+' + av : av}</td>
            <td class="py-2 px-1.5 text-center font-black">${t.pts}</td>
            <td class="py-2 pr-2 pl-1 text-right whitespace-nowrap space-x-0.5">${last5HTML || '<span class="text-slate-400">-</span>'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderCareerAndTrophiesPanel() {
    if (!gameData) return;
    ensureCareerFields(gameData);

    document.getElementById('career-age-label').innerText = `YAŞ: ${gameData.age} • SEZON ${gameData.season}`;
    document.getElementById('alltime-matches').innerText = gameData.allTimeMatches;
    document.getElementById('alltime-goals').innerText = gameData.allTimeGoals;
    document.getElementById('alltime-assists').innerText = gameData.allTimeAssists;
    document.getElementById('alltime-trophies').innerText = gameData.trophies.length;

    const trophiesGrid = document.getElementById('trophies-grid');
    trophiesGrid.innerHTML = '';

    const milestones = [
        {
            title: "Lig Şampiyonluğu",
            sub: gameData.trophies.some(t => t.type === 'league') ? "Kazanıldı!" : "Henüz Yok",
            unlocked: gameData.trophies.some(t => t.type === 'league'),
            icon: ICONS.trophy
        },
        {
            title: "İlk Profesyonel Gol",
            sub: gameData.allTimeGoals >= 1 ? "Tamamlandı!" : `${gameData.allTimeGoals} / 1 Gol`,
            unlocked: gameData.allTimeGoals >= 1,
            icon: ICONS.ball
        },
        {
            title: "25 Gol Kulübü",
            sub: gameData.allTimeGoals >= 25 ? "Tamamlandı!" : `${gameData.allTimeGoals} / 25 Gol`,
            unlocked: gameData.allTimeGoals >= 25,
            icon: ICONS.flame
        },
        {
            title: "Usta Oyun Kurucu",
            sub: gameData.allTimeAssists >= 15 ? "Tamamlandı!" : `${gameData.allTimeAssists} / 15 Asist`,
            unlocked: gameData.allTimeAssists >= 15,
            icon: ICONS.medal
        },
        {
            title: "75+ OVR Yıldız",
            sub: getPlayerOvr(gameData.stats) >= 75 ? "Tamamlandı!" : `Mevcut: ${getPlayerOvr(gameData.stats)} OVR`,
            unlocked: getPlayerOvr(gameData.stats) >= 75,
            icon: ICONS.shield
        },
        {
            title: `Hedef: ${gameData.dreamClub}`,
            sub: gameData.club.name === gameData.dreamClub ? "Ulaşıldı!" : "Devam Ediyor",
            unlocked: gameData.club.name === gameData.dreamClub,
            icon: ICONS.target
        }
    ];

    milestones.forEach(m => {
        const div = document.createElement('div');
        div.className = m.unlocked
            ? "p-2.5 bg-[#d9f99d] border-2 border-[#0f291a] flex items-center gap-2.5"
            : "p-2.5 bg-white/60 border-2 border-slate-300 opacity-70 flex items-center gap-2.5";
        div.innerHTML = `
            <div class="w-8 h-8 flex items-center justify-center shrink-0 ${m.unlocked ? 'bg-[#0f291a] text-[#eab308]' : 'bg-slate-200 text-slate-500'}">
                ${m.icon}
            </div>
            <div class="overflow-hidden">
                <div class="font-black text-[11px] text-[#0f291a] truncate">${m.title}</div>
                <div class="text-[10px] font-bold ${m.unlocked ? 'text-emerald-800' : 'text-slate-500'}">${m.sub}</div>
            </div>
        `;
        trophiesGrid.appendChild(div);
    });

    const sorted = [...gameData.standings].sort((a, b) => b.pts - a.pts || (b.ag - b.yg) - (a.ag - a.yg));
    const currentRank = sorted.findIndex(t => t.isPlayerClub) + 1;

    const historyTbody = document.getElementById('season-history-tbody');
    historyTbody.innerHTML = '';

    const currentTr = document.createElement('tr');
    currentTr.className = "bg-[#d9f99d] text-[#0f291a] font-black";
    currentTr.innerHTML = `
        <td class="py-2.5 pl-3">S${gameData.season} <span class="text-[9px] px-1.5 py-0.5 bg-[#0f291a] text-[#eab308] ml-1">AKTİF</span></td>
        <td class="py-2.5 flex items-center gap-1.5">${generateClubCrestSVG(gameData.club.c1, gameData.club.c2, 14)} <span>${gameData.club.name}</span></td>
        <td class="py-2.5 text-center">${gameData.matches}</td>
        <td class="py-2.5 text-center text-emerald-700">${gameData.goals}</td>
        <td class="py-2.5 text-center text-blue-700">${gameData.assists}</td>
        <td class="py-2.5 pr-3 text-right">${currentRank}. Sıra</td>
    `;
    historyTbody.appendChild(currentTr);

    [...gameData.careerHistory].reverse().forEach(h => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-2 pl-3">Sezon ${h.season}</td>
            <td class="py-2 flex items-center gap-1.5">${generateClubCrestSVG(h.c1, h.c2, 14)} <span>${h.clubName}</span></td>
            <td class="py-2 text-center">${h.matches}</td>
            <td class="py-2 text-center text-emerald-700">${h.goals}</td>
            <td class="py-2 text-center text-blue-700">${h.assists}</td>
            <td class="py-2 pr-3 text-right">${h.rank}. Sıra</td>
        `;
        historyTbody.appendChild(tr);
    });
}

let selectedStationType = 'shooting';

const TRAINING_STATIONS_META = {
    shooting: {
        title: "İSTASYON 1: BİTİRİCİLİK & ŞUT PARKURU",
        heading: "Hedef Vuruşu & Frikik İstasyonu",
        desc: "Bitiricilik (Şut) yeteneğini geliştirir ve ekstra Odak kazanma fırsatı sunar.",
        cost: "Maliyet: -15 Kondisyon",
        reward: "Odak: Şut & Soğukkanlılık",
        hint: "Gelecek güncellemede interaktif Şut Minigame sahnesi burada açılacak.",
        statKey: "shoot",
        statLabel: "MEVCUT ŞUT",
        icon: ICONS.target
    },
    playmaking: {
        title: "İSTASYON 2: VİZYON & KİLİT PAS PARKURU",
        heading: "Taktik Pas & Oyun Kurucu İstasyonu",
        desc: "Vizyon (Pas) yeteneğini geliştirir ve Teknik Direktör Güvenini +5% artırır.",
        cost: "Maliyet: -15 Kondisyon",
        reward: "Odak: Pas & +5% Hoca Güveni",
        hint: "Gelecek güncellemede interaktif Pas Minigame sahnesi burada açılacak.",
        statKey: "pass",
        statLabel: "MEVCUT PAS",
        icon: ICONS.ball
    },
    dribbling: {
        title: "İSTASYON 3: SLALOM & TOP SÜRME PARKURU",
        heading: "Dar Alan Çalım & Hız İstasyonu",
        desc: "Top Sürme yeteneğini geliştirir, maç içinde çalım ve penaltı alma şansını artırır.",
        cost: "Maliyet: -15 Kondisyon",
        reward: "Odak: Top Sürme & Fizik",
        hint: "Gelecek güncellemede interaktif Slalom Minigame sahnesi burada açılacak.",
        statKey: "dribble",
        statLabel: "MEVCUT ÇALIM",
        icon: ICONS.bolt
    },
    heavy_camp: {
        title: "İSTASYON 4: FİZİKSEL DAYANIKLILIK KAMPI",
        heading: "Ağır Kondisyon & Kuvvet İstasyonu",
        desc: "Dayanıklılığı ve Hoca Güvenini (+14%) hızla artırır. İlk 11'i kapmak için idealdir.",
        cost: "Maliyet: -26 Kondisyon",
        reward: "Odak: +14% Güven & Çift Gelişim",
        hint: "Gelecek güncellemede interaktif Dayanıklılık Minigame sahnesi burada açılacak.",
        statKey: "physic",
        statLabel: "MEVCUT FİZİK",
        icon: ICONS.dumbbell
    }
};

function launchSelectedTrainingStation() {
    // Şimdilik mevcut gelişim dengesini ve hesaplamalarını bozmadan ilgili antrenmanı başlatır.
    // İlerleyen aşamada doğrudan minigame'i #minigame-stage-container içinde başlatacağız.
    openTrainingModal(selectedStationType);
}

// Tekrarlanan antrenman istasyonu tanımları temizlendi.

function injectStage1Layout() {
    // 1. Soyunma Odasını (tab-content-hub) yeni ferah yapısıyla güncelle
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

                <div class="p-3.5 space-y-3.5">
                    <div class="grid grid-cols-7 items-center py-3.5 bg-[#143321] text-white rounded-lg border border-[#091910] px-3 shadow-inner">
                        <div class="col-span-3 flex flex-col items-center text-center">
                            <div id="hub-home-crest" class="mb-1.5"></div>
                            <span id="hub-home-name" class="font-sport text-lg font-extrabold text-white leading-none">Gençlerbirliği</span>
                            <span class="text-[10px] text-emerald-300/90 font-semibold mt-1">Ev Sahibi</span>
                        </div>
                        <div class="col-span-1 text-center">
                            <span class="font-sport text-sm font-black px-2 py-0.5 rounded bg-[#eab308] text-[#07190e]">VS</span>
                        </div>
                        <div class="col-span-3 flex flex-col items-center text-center">
                            <div id="hub-away-crest" class="mb-1.5"></div>
                            <span id="hub-away-name" class="font-sport text-lg font-extrabold text-white leading-none">Fenerbahçe</span>
                            <span class="text-[10px] text-amber-300/90 font-semibold mt-1">Deplasman</span>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center text-xs mb-1.5">
                            <span class="text-[#143321] font-extrabold">Maç Eforu ve Tempo</span>
                            <span id="hub-mentality-cost" class="text-xs font-extrabold text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded">-20 Kondisyon</span>
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
                            <span>Sahaya Çık</span>
                        </button>
                        <button onclick="openQuickSimModal()" class="px-4 py-3 sport-btn-cream font-sport text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0">
                            <span>${ICONS.bolt}</span>
                            <span>Simüle Et</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="board-panel p-3.5">
                <div class="flex justify-between items-center pb-2 mb-2.5 border-b border-[#143321]/15">
                    <div>
                        <h3 class="text-xs font-black text-[#143321] uppercase tracking-wide">Teknik Kapasite & Hazırlık</h3>
                        <p class="text-[11px] font-bold text-slate-500">Yeteneklerin maç içi çark dilimlerini doğrudan büyütür</p>
                    </div>
                    <button onclick="switchGameTab('training')" class="px-2.5 py-1 rounded bg-[#143321] text-[#eab308] text-[11px] font-extrabold flex items-center gap-1">
                        <span>Antrenmana Git</span>
                        <span>→</span>
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    <div>
                        <div class="flex justify-between items-baseline mb-1">
                            <span class="font-extrabold text-slate-700">Bitiricilik (Şut)</span>
                            <span id="stat-val-shoot" class="font-led font-bold text-base text-[#143321]">60</span>
                        </div>
                        <div class="w-full h-1.5 bg-[#dfd9c3] rounded-full overflow-hidden">
                            <div id="stat-bar-shoot" class="h-full bg-[#16a34a]" style="width: 60%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between items-baseline mb-1">
                            <span class="font-extrabold text-slate-700">Vizyon (Pas)</span>
                            <span id="stat-val-pass" class="font-led font-bold text-base text-[#143321]">60</span>
                        </div>
                        <div class="w-full h-1.5 bg-[#dfd9c3] rounded-full overflow-hidden">
                            <div id="stat-bar-pass" class="h-full bg-[#16a34a]" style="width: 60%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between items-baseline mb-1">
                            <span class="font-extrabold text-slate-700">Top Sürme</span>
                            <span id="stat-val-dribble" class="font-led font-bold text-base text-[#143321]">60</span>
                        </div>
                        <div class="w-full h-1.5 bg-[#dfd9c3] rounded-full overflow-hidden">
                            <div id="stat-bar-dribble" class="h-full bg-[#16a34a]" style="width: 60%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between items-baseline mb-1">
                            <span class="font-extrabold text-slate-700">Dayanıklılık</span>
                            <span id="stat-val-physic" class="font-led font-bold text-base text-[#143321]">60</span>
                        </div>
                        <div class="w-full h-1.5 bg-[#dfd9c3] rounded-full overflow-hidden">
                            <div id="stat-bar-physic" class="h-full bg-[#16a34a]" style="width: 60%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 2. Ayrı Antrenman Sekmesini (tab-content-training) oluştur ve main içine ekle
    if (!document.getElementById('tab-content-training') && hubEl && hubEl.parentElement) {
        const trainSec = document.createElement('div');
        trainSec.id = 'tab-content-training';
        trainSec.className = 'hidden space-y-3 animate-screen';
        trainSec.innerHTML = `
            <div class="board-panel p-3 flex items-center justify-between bg-[#143321] text-white">
                <div>
                    <h2 class="font-sport text-xl font-black tracking-wide text-[#eab308] uppercase leading-none">Kulüp Antrenman Tesisleri</h2>
                    <p class="text-xs text-emerald-100/90 font-bold mt-0.5">Geliştirmek istediğin istasyonu seç ve sahaya in.</p>
                </div>
                <span id="hub-train-badge" class="font-led text-[11px] font-bold px-2.5 py-1 rounded bg-[#eab308] text-[#07190e] shrink-0">1 HAKKIN VAR</span>
            </div>

            <div class="board-panel overflow-hidden">
                <div class="board-header flex justify-between items-center">
                    <span id="training-stage-title" class="font-sport text-sm font-bold uppercase tracking-wider text-[#eab308]">İSTASYON 1: BİTİRİCİLİK & ŞUT PARKURU</span>
                    <span id="training-stage-stat" class="font-led text-xs font-bold text-emerald-300">MEVCUT ŞUT: 60</span>
                </div>

                <div id="minigame-stage-container" class="relative bg-[#195c31] h-40 flex flex-col items-center justify-center p-4 text-center border-b-2 border-[#143321] overflow-hidden">
                    <svg class="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 360 160" fill="none">
                        <rect x="60" y="0" width="240" height="95" stroke="white" stroke-width="2"/>
                        <rect x="120" y="0" width="120" height="38" stroke="white" stroke-width="2"/>
                        <path d="M 135 95 A 45 45 0 0 0 225 95" stroke="white" stroke-width="2"/>
                    </svg>
                    <div id="minigame-preview-icon" class="w-11 h-11 rounded-full bg-[#143321] border-2 border-[#eab308] text-[#eab308] flex items-center justify-center mb-2 z-10">${ICONS.target}</div>
                    <h4 id="minigame-preview-heading" class="font-sport text-xl font-black text-white uppercase tracking-wide z-10">Hedef Vuruşu & Frikik İstasyonu</h4>
                    <p id="minigame-preview-desc" class="text-xs font-bold text-emerald-100 max-w-[280px] mt-0.5 z-10">Bitiricilik yeteneğini geliştirir ve ekstra Odak kazanma şansı sunar.</p>
                    <div class="mt-2 flex items-center gap-3 text-[11px] font-black z-10">
                        <span id="minigame-cost-pill" class="px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-amber-400/30">Maliyet: -15 Kondisyon</span>
                        <span id="minigame-reward-pill" class="px-2 py-0.5 rounded bg-black/40 text-emerald-300 border border-emerald-400/30">Odak: Şut Gelişimi</span>
                    </div>
                </div>

                <div class="p-3 bg-[#f5f1e4] flex items-center justify-between gap-3">
                    <div class="text-xs">
                        <span class="font-extrabold text-[#143321] block">İdmana Hazır mısın?</span>
                        <span id="training-trust-hint" class="text-[11px] font-bold text-slate-600">Haftalık bireysel gelişim hakkını kullanır.</span>
                    </div>
                    <button id="btn-launch-selected-drill" onclick="openTrainingModal(selectedStationType)" class="px-5 py-2.5 sport-btn-green font-sport text-base font-black uppercase tracking-wider shrink-0">
                        İDMANA BAŞLA
                    </button>
                </div>
            </div>

            <div class="board-panel p-3">
                <div class="text-[11px] font-black uppercase tracking-wider text-slate-600 mb-2">Antrenman İstasyonu Seç (4 Temel Özellik)</div>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="selectTrainingStation('shooting')" id="station-btn-shooting" class="train-drill-btn p-2.5 rounded-lg bg-[#143321] text-white border-2 border-[#eab308] text-left transition flex items-center justify-between">
                        <div>
                            <div class="font-sport text-sm font-black uppercase text-[#eab308]">1. Bitiricilik (Şut)</div>
                            <div class="text-[10px] font-bold text-emerald-100">-15 Kond • Şut & Odak</div>
                        </div>
                        <span id="station-stat-shoot" class="font-led text-sm font-bold text-white">60</span>
                    </button>

                    <button onclick="selectTrainingStation('playmaking')" id="station-btn-playmaking" class="train-drill-btn p-2.5 rounded-lg bg-[#e6e0cc] text-[#143321] border-2 border-[#143321]/30 text-left transition flex items-center justify-between">
                        <div>
                            <div class="font-sport text-sm font-black uppercase text-[#143321]">2. Vizyon (Pas)</div>
                            <div class="text-[10px] font-bold text-slate-600">-15 Kond • Pas & +5 Güven</div>
                        </div>
                        <span id="station-stat-pass" class="font-led text-sm font-bold text-[#143321]">60</span>
                    </button>

                    <button onclick="selectTrainingStation('dribbling')" id="station-btn-dribbling" class="train-drill-btn p-2.5 rounded-lg bg-[#e6e0cc] text-[#143321] border-2 border-[#143321]/30 text-left transition flex items-center justify-between">
                        <div>
                            <div class="font-sport text-sm font-black uppercase text-[#143321]">3. Top Sürme</div>
                            <div class="text-[10px] font-bold text-slate-600">-15 Kond • Çalım & Hız</div>
                        </div>
                        <span id="station-stat-drib" class="font-led text-sm font-bold text-[#143321]">60</span>
                    </button>

                    <button onclick="selectTrainingStation('heavy_camp')" id="station-btn-heavy_camp" class="train-drill-btn p-2.5 rounded-lg bg-[#e6e0cc] text-[#143321] border-2 border-[#143321]/30 text-left transition flex items-center justify-between">
                        <div>
                            <div class="font-sport text-sm font-black uppercase text-[#143321]">4. Fizik & Kamp</div>
                            <div class="text-[10px] font-bold text-slate-600">-26 Kond • +14 Güven & Fizik</div>
                        </div>
                        <span id="station-stat-phys" class="font-led text-sm font-bold text-[#143321]">60</span>
                    </button>
                </div>

                <div class="mt-2.5 pt-2.5 border-t border-[#143321]/15 flex items-center justify-between">
                    <div>
                        <span class="text-xs font-extrabold text-[#143321] block">Yorgun musun?</span>
                        <span class="text-[11px] font-bold text-slate-600">İdman yerine fizyoterapiye girerek enerji topla.</span>
                    </div>
                    <button onclick="restBeforeMatch()" class="train-drill-btn px-3.5 py-2 sport-btn-cream text-xs font-black uppercase shrink-0">
                        Dinlen (+35 Kond, +1 Odak)
                    </button>
                </div>
            </div>
        `;
        hubEl.parentElement.appendChild(trainSec);
    }

    // 3. Alt Navigasyonu 4 sekmeye çıkar
    const navEl = document.getElementById('game-bottom-nav');
    if (navEl) {
        navEl.className = "grid grid-cols-4 bg-[#091910] border-t-4 border-[#0f291a] divide-x divide-[#1e3f2b]";
        navEl.innerHTML = `
            <button onclick="switchGameTab('hub')" id="nav-btn-hub" class="py-2.5 bg-[#183d28] border-t-4 border-t-[#eab308] text-[#eab308] font-sport text-xs font-black uppercase tracking-wider flex flex-col items-center justify-center gap-0.5">
                <span>${ICONS.pitch}</span><span>Soyunma Odası</span>
            </button>
            <button onclick="switchGameTab('training')" id="nav-btn-training" class="py-2.5 bg-[#091910] border-t-4 border-t-transparent text-emerald-100/70 font-sport text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-0.5">
                <span>${ICONS.dumbbell}</span><span>Antrenman</span>
            </button>
            <button onclick="switchGameTab('league')" id="nav-btn-league" class="py-2.5 bg-[#091910] border-t-4 border-t-transparent text-emerald-100/70 font-sport text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-0.5">
                <span>${ICONS.trophy}</span><span>Puan Tablosu</span>
            </button>
            <button onclick="switchGameTab('career')" id="nav-btn-career" class="py-2.5 bg-[#091910] border-t-4 border-t-transparent text-emerald-100/70 font-sport text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-0.5">
                <span>${ICONS.medal}</span><span>Müzem</span>
            </button>
        `;
    }
}

function selectTrainingStation(type) {
    selectedStationType = type;
    const meta = TRAINING_STATIONS_META[type];
    if (!meta || !gameData) return;

    document.getElementById('training-stage-title').innerText = meta.title;
    document.getElementById('training-stage-stat').innerText = `${meta.statLabel}: ${gameData.stats[meta.statKey]}`;
    document.getElementById('minigame-preview-icon').innerHTML = meta.icon;
    document.getElementById('minigame-preview-heading').innerText = meta.heading;
    document.getElementById('minigame-preview-desc').innerText = meta.desc;
    document.getElementById('minigame-cost-pill').innerText = meta.cost;
    document.getElementById('minigame-reward-pill').innerText = meta.reward;
    document.getElementById('training-trust-hint').innerText = meta.hint;

    ['shooting', 'playmaking', 'dribbling', 'heavy_camp'].forEach(k => {
        const btn = document.getElementById('station-btn-' + k);
        if (!btn) return;
        const divs = btn.querySelectorAll('div > div');
        const statEl = btn.querySelector('.font-led');

        if (k === type) {
            btn.className = "train-drill-btn p-2.5 rounded-lg bg-[#143321] text-white border-2 border-[#eab308] text-left transition flex items-center justify-between";
            if (divs[0]) divs[0].className = "font-sport text-sm font-black uppercase text-[#eab308]";
            if (divs[1]) divs[1].className = "text-[10px] font-bold text-emerald-100";
            if (statEl) statEl.className = "font-led text-sm font-bold text-white";
        } else {
            btn.className = "train-drill-btn p-2.5 rounded-lg bg-[#e6e0cc] text-[#143321] border-2 border-[#143321]/30 text-left transition flex items-center justify-between";
            if (divs[0]) divs[0].className = "font-sport text-sm font-black uppercase text-[#143321]";
            if (divs[1]) divs[1].className = "text-[10px] font-bold text-slate-600";
            if (statEl) statEl.className = "font-led text-sm font-bold text-[#143321]";
        }
    });
}

// Mevcut fonksiyonların üzerine yeni ekran güncellemelerini bağla
const _origUpdateGameHubUI = updateGameHubUI;
updateGameHubUI = function() {
    _origUpdateGameHubUI();
    if (!gameData) return;
    if (document.getElementById('stat-bar-shoot')) {
        document.getElementById('stat-bar-shoot').style.width = `${Math.min(100, gameData.stats.shoot)}%`;
        document.getElementById('stat-bar-pass').style.width = `${Math.min(100, gameData.stats.pass)}%`;
        document.getElementById('stat-bar-dribble').style.width = `${Math.min(100, gameData.stats.dribble)}%`;
        document.getElementById('stat-bar-physic').style.width = `${Math.min(100, gameData.stats.physic)}%`;
    }
    if (document.getElementById('station-stat-shoot')) {
        document.getElementById('station-stat-shoot').innerText = gameData.stats.shoot;
        document.getElementById('station-stat-pass').innerText = gameData.stats.pass;
        document.getElementById('station-stat-drib').innerText = gameData.stats.dribble;
        document.getElementById('station-stat-phys').innerText = gameData.stats.physic;
        selectTrainingStation(selectedStationType || 'shooting');
    }
    const launchBtn = document.getElementById('btn-launch-selected-drill');
    if (launchBtn) {
        if (gameData.trainedThisWeek) {
            launchBtn.classList.add('opacity-40', 'pointer-events-none');
            launchBtn.innerText = "TAMAMLANDI";
        } else {
            launchBtn.classList.remove('opacity-40', 'pointer-events-none');
            launchBtn.innerText = "İDMANA BAŞLA";
        }
    }
};

switchGameTab = function(tab) {
    ['hub', 'training', 'league', 'career', 'match'].forEach(t => {
        const el = document.getElementById('tab-content-' + t);
        if (el) el.classList.add('hidden');
    });

    ['hub', 'training', 'league', 'career'].forEach(t => {
        const btn = document.getElementById('nav-btn-' + t);
        if (!btn) return;
        btn.className = t === tab
            ? "py-2.5 bg-[#183d28] border-t-4 border-t-[#eab308] text-[#eab308] font-sport text-xs font-black uppercase tracking-wider flex flex-col items-center justify-center gap-0.5"
            : "py-2.5 bg-[#091910] border-t-4 border-t-transparent text-emerald-100/70 font-sport text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-0.5";
    });

    if (tab === 'hub') document.getElementById('tab-content-hub').classList.remove('hidden');
    if (tab === 'training') {
        selectTrainingStation(selectedStationType || 'shooting');
        document.getElementById('tab-content-training').classList.remove('hidden');
    }
    if (tab === 'league') {
        renderStandingsTable();
        document.getElementById('tab-content-league').classList.remove('hidden');
    }
    if (tab === 'career') {
        renderCareerAndTrophiesPanel();
        document.getElementById('tab-content-career').classList.remove('hidden');
    }
};

injectStage1Layout();

initStaticIcons();
renderSaveSlots();
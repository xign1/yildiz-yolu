// =========================================================================
// 1. ÖZEL EL ÇİZİMİ SVG İKON SETİ VE OLAY KARTI İLLÜSTRASYONLARI
// =========================================================================
const ICONS = {
    ball: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polygon points="12 7 16 10 14.5 15 9.5 15 8 10"/></svg>`,
    bolt: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    target: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/></svg>`,
    shield: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    pitch: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="4" width="20" height="16" rx="1"/><line x1="12" y1="4" x2="12" y2="20"/><circle cx="12" cy="12" r="3"/></svg>`,
    trophy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    medal: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    dumbbell: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`,
    flame: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    rest: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    arrowLeft: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    arrowRight: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`
};

// Haftalık Olay Kartları İçin Özel Çizim Vektör İllüstrasyonlar
// Haftalık Olay Kartları İçin Özel Çizim Vektör İllüstrasyonlar (14 Kart İçin Genişletilmiş Set)
const EVENT_ART = {
    mic_apology: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><rect x="10" y="48" width="60" height="18" fill="#1e293b" stroke="#eab308" stroke-width="2"/><rect x="35" y="20" width="10" height="18" rx="5" fill="#94a3b8" stroke="#fff" stroke-width="2"/><path d="M30 30 C30 40, 50 40, 50 30" stroke="#eab308" stroke-width="2"/><line x1="40" y1="38" x2="40" y2="48" stroke="#eab308" stroke-width="3"/><circle cx="22" cy="24" r="6" fill="#38bdf8" opacity="0.3"/><circle cx="58" cy="24" r="6" fill="#38bdf8" opacity="0.3"/></svg>`,
    fire_challenge: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><path d="M40 10 C55 25, 62 40, 50 58 C45 64, 35 64, 30 58 C18 40, 25 25, 40 10 Z" fill="#dc2626" stroke="#fbbf24" stroke-width="2.5"/><circle cx="40" cy="42" r="11" fill="#ffffff" stroke="#0f172a" stroke-width="2"/><polygon points="40 35 44 38 42 44 38 44 36 38" fill="#0f172a"/></svg>`,
    penalty_spot: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><rect x="12" y="12" width="56" height="32" stroke="#ffffff" stroke-width="3"/><line x1="12" y1="44" x2="68" y2="44" stroke="#4ade80" stroke-width="2"/><circle cx="40" cy="56" r="7" fill="#eab308" stroke="#0f172a" stroke-width="2"/><path d="M40 50 L56 22" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3 3"/><circle cx="56" cy="22" r="4" stroke="#ef4444" stroke-width="2"/></svg>`,
    team_handshake: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><circle cx="28" cy="26" r="8" fill="#38bdf8" stroke="#fff" stroke-width="2"/><circle cx="52" cy="26" r="8" fill="#22c55e" stroke="#fff" stroke-width="2"/><path d="M16 54 C16 40, 38 40, 40 54" fill="#38bdf8"/><path d="M40 54 C42 40, 64 40, 64 54" fill="#22c55e"/><path d="M32 44 L48 44" stroke="#eab308" stroke-width="4" stroke-linecap="round"/></svg>`,
    sponsor_cash: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><rect x="14" y="20" width="52" height="32" rx="3" fill="#16a34a" stroke="#eab308" stroke-width="2.5"/><circle cx="40" cy="36" r="9" fill="#eab308"/><text x="40" y="40" text-anchor="middle" fill="#052e16" font-size="12" font-weight="900">₺</text></svg>`,
    gym_focus: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><rect x="14" y="28" width="8" height="18" fill="#eab308" stroke="#fff" stroke-width="1.5"/><rect x="58" y="28" width="8" height="18" fill="#eab308" stroke="#fff" stroke-width="1.5"/><line x1="22" y1="37" x2="58" y2="37" stroke="#cbd5e1" stroke-width="5"/><circle cx="40" cy="37" r="12" stroke="#4ade80" stroke-width="2" stroke-dasharray="4 2"/></svg>`,
    medical_syringe: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><rect x="26" y="18" width="28" height="36" rx="4" fill="#ffffff" stroke="#ef4444" stroke-width="2.5"/><path d="M40 26 V46 M30 36 H50" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/></svg>`,
    phone_social: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><rect x="25" y="10" width="30" height="52" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/><rect x="29" y="18" width="22" height="12" rx="2" fill="#38bdf8"/><rect x="29" y="34" width="16" height="8" rx="2" fill="#f43f5e"/><circle cx="40" cy="55" r="2.5" fill="#eab308"/></svg>`,
    boot_gold: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><path d="M18 46 L24 24 H38 L42 36 L62 40 C65 42, 65 48, 60 50 H18 Z" fill="#eab308" stroke="#ffffff" stroke-width="2"/><line x1="24" y1="53" x2="24" y2="57" stroke="#4ade80" stroke-width="3"/><line x1="34" y1="53" x2="34" y2="57" stroke="#4ade80" stroke-width="3"/><line x1="52" y1="53" x2="52" y2="57" stroke="#4ade80" stroke-width="3"/></svg>`,
    sports_car: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><path d="M12 44 L22 28 H52 L66 38 L68 48 H12 V44 Z" fill="#ef4444" stroke="#ffffff" stroke-width="2"/><circle cx="24" cy="48" r="7" fill="#0f172a" stroke="#eab308" stroke-width="2.5"/><circle cx="56" cy="48" r="7" fill="#0f172a" stroke="#eab308" stroke-width="2.5"/></svg>`,
    whistle_fight: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><polygon points="40 12 48 28 66 26 52 40 58 58 40 48 22 58 28 40 14 26 32 28" fill="#f97316" stroke="#eab308" stroke-width="2"/></svg>`,
    scout_glass: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><circle cx="26" cy="38" r="11" fill="#1e293b" stroke="#eab308" stroke-width="2.5"/><circle cx="54" cy="38" r="11" fill="#1e293b" stroke="#eab308" stroke-width="2.5"/><path d="M35 34 H45" stroke="#eab308" stroke-width="4"/><circle cx="26" cy="38" r="4" fill="#38bdf8"/><circle cx="54" cy="38" r="4" fill="#38bdf8"/></svg>`,
    jersey_fan: `<svg width="80" height="72" viewBox="0 0 80 72" fill="none"><path d="M26 18 L34 15 H46 L54 18 L62 30 L54 34 L52 26 V56 H28 V26 L26 34 L18 30 L26 18 Z" fill="#22c55e" stroke="#ffffff" stroke-width="2"/><text x="40" y="44" text-anchor="middle" fill="#052e16" font-size="14" font-weight="900">10</text></svg>`
};

// 14 FARKLI HAFTALIK KAOS & KARAR KARTI HAVUZU
const WEEKLY_EVENTS_POOL = [
    {
        id: 'nightclub_scandal',
        category: 'MAGAZİN & BASIN KRİZİ',
        title: 'GECE KULÜBÜ SKANDALI!',
        desc: 'Kritik maç öncesi gece geç saatlerde görüntülendin! Gazeteler manşet yaptı, basına ne cevap vereceksin?',
        choiceA: {
            title: 'ÖZÜR DİLE',
            sub: '"Hata yaptım, tamamen maça odaklandım."',
            effectText: '+10 Hoca Güveni • -1 Odak',
            svg: EVENT_ART.mic_apology
        },
        choiceB: {
            title: 'MEYDAN OKU!',
            sub: '"Sahada konuşurum, herkes izlesin!"',
            effectText: '-10 Güven • Bu Maç GOL Şansı +%12!',
            svg: EVENT_ART.fire_challenge
        }
    },
    {
        id: 'penalty_duty',
        category: 'SOYUNMA ODASI KARARI',
        title: 'PENALTI KRİZİ!',
        desc: 'Takımın birinci penaltıcısı hafif sakatlandı. Hocadan bu haftaki maçta penaltıları kullanmak için izin isteyecek misin?',
        choiceA: {
            title: 'TOPUN BAŞINA GEÇ',
            sub: '"Sorumluluğu alıyorum hocam, ben atarım!"',
            effectText: 'Bu Maç Ekstra PENALTI ÇARKI Gelir!',
            svg: EVENT_ART.penalty_spot
        },
        choiceB: {
            title: 'ARKADAŞINA BIRAK',
            sub: '"Takım içi denge bozulmasın, kaptan atsın."',
            effectText: '+12 Hoca Güveni • +1 Odak Puanı',
            svg: EVENT_ART.team_handshake
        }
    },
    {
        id: 'sponsor_shoot',
        category: 'MENAJER & SPONSORLUK',
        title: 'REKLAM ÇEKİMİ TEKLİFİ!',
        desc: 'Ünlü bir spor markası maçtan bir gün önce 4 saatlik reklam çekimi teklif etti. Yorulacaksın ama nakit ödülü sıcak!',
        choiceA: {
            title: 'ÇEKİME KATIL',
            sub: '"Parayı kaçıramam, kamera karşısına geçelim."',
            effectText: '+₺1.800 Nakit • -15 Kondisyon',
            svg: EVENT_ART.sponsor_cash
        },
        choiceB: {
            title: 'TEKLİFİ REDDET',
            sub: '"Benim işim şov değil, antrenman sahası!"',
            effectText: '+8 Hoca Güveni • +10 Kondisyon',
            svg: EVENT_ART.gym_focus
        }
    },
    {
        id: 'tactical_dispute',
        category: 'TAKTİK TOPLANTISI',
        title: 'HOCA İLE TAKTİK TARTIŞMASI!',
        desc: 'Analiz toplantısında teknik direktör seni yeterince savunmaya yardım etmemekle eleştirdi. Tepkin ne olacak?',
        choiceA: {
            title: 'ELEŞTİRİYİ KABUL ET',
            sub: '"Haklısınız hocam, daha çok koşacağım."',
            effectText: '+12 Hoca Güveni • +1 Dayanıklılık',
            svg: EVENT_ART.team_handshake
        },
        choiceB: {
            title: 'HÜCUM ÖZGÜRLÜĞÜ İSTE',
            sub: '"Enerjimi gol atmaya saklamalıyım!"',
            effectText: '-8 Güven • +2 Odak Puanı',
            svg: EVENT_ART.fire_challenge
        }
    },
    {
        id: 'painkiller_risk',
        category: 'SAĞLIK EKİBİ RAPORU',
        title: 'ARKA ADALEDE SERTLEŞME!',
        desc: 'Maç sabahı arka adalende ağrı hissettin. Doktor "İğneyle oynayabilirsin ama çok yorar" diyor. Ne yapacaksın?',
        choiceA: {
            title: 'İĞNE VURULUP OYNA',
            sub: '"Takımı yalnız bırakamam, sargıyla çıkarım!"',
            effectText: '+12 Hoca Güveni • -20 Kondisyon',
            svg: EVENT_ART.medical_syringe
        },
        choiceB: {
            title: 'KENDİNİ KORU',
            sub: '"Riske girmeyelim, tedavi olacağım."',
            effectText: '+22 Kondisyon • -10 Hoca Güveni',
            svg: EVENT_ART.gym_focus
        }
    },
    {
        id: 'social_media_feud',
        category: 'SOSYAL MEDYA GÜNDEMİ',
        title: 'TV YORUMCUSUNDAN AĞIR ELEŞTİRİ!',
        desc: 'Ünlü bir spor yorumcusu canlı yayında senin için "Abartılmış balon, büyük takım oyuncusu olamaz" dedi!',
        choiceA: {
            title: 'SOSYAL MEDYADAN LAF ÇAK',
            sub: '"Maç sonu televizyonu iyi izle ihtiyar!"',
            effectText: '+2 Odak Puanı • -8 Hoca Güveni',
            svg: EVENT_ART.phone_social
        },
        choiceB: {
            title: 'SESSİZ KAL & İŞİNE BAK',
            sub: '"Polemiğe girmem, pas organizasyonu çalışırım."',
            effectText: '+8 Hoca Güveni • +1 Vizyon (Pas)',
            svg: EVENT_ART.mic_apology
        }
    },
    {
        id: 'president_bonus',
        category: 'SOYUNMA ODASI ZİYARETİ',
        title: 'BAŞKANDAN ÖZEL PRİM SÖZÜ!',
        desc: 'Kulüp başkanı hafta içi tesislere indi ve "Bu hafta patlama bekliyorum, göreyim sizi!" diyerek zarfı masaya koydu.',
        choiceA: {
            title: 'BAŞKANA GOL SÖZÜ VER!',
            sub: '"Bu hafta o golü sizin için atacağım Başkanım!"',
            effectText: '+₺1.000 Avans • GOL Sözü Aktifleşir!',
            svg: EVENT_ART.sponsor_cash
        },
        choiceB: {
            title: 'TAKIM ADINA TEŞEKKÜR ET',
            sub: '"Elimizden geleni yapacağız Başkanım."',
            effectText: '+10 Hoca Güveni • +1 Odak',
            svg: EVENT_ART.team_handshake
        }
    },
    {
        id: 'training_fight',
        category: 'ANTRENMAN GERİLİMİ',
        title: 'İDMANDA SERT MÜDAHALE!',
        desc: 'Çift kale maçta takımın agresif stoperi bileğine çok sert kaydı! Herkes senin vereceğin tepkiye bakıyor.',
        choiceA: {
            title: 'AYAĞA KALKIP DİKLEN!',
            sub: '"Bir daha öyle girersen karşılığını alırsın!"',
            effectText: '+1 Dayanıklılık (Fizik) • -10 Güven',
            svg: EVENT_ART.whistle_fight
        },
        choiceB: {
            title: 'ELİNİ UZATIP BARIŞ',
            sub: '"İdmanda olur böyle şeyler, devam edelim."',
            effectText: '+10 Hoca Güveni • +1 Odak',
            svg: EVENT_ART.team_handshake
        }
    },
    {
        id: 'boot_prototype',
        category: 'EKİPMAN SPONSORU',
        title: 'PROTOTİP KRAMPON TESTİ!',
        desc: 'Bir krampon firması ultra hafif karbon tabanlı yeni modelini bu hafta denemen için gönderdi. Ayağını vurma riski var!',
        choiceA: {
            title: 'YENİ KRAMPONU GİY',
            sub: '"Risk olmadan gelişim olmaz, giyiyorum!"',
            effectText: '+1 Şut & +1 Çalım • -14 Kondisyon',
            svg: EVENT_ART.boot_gold
        },
        choiceB: {
            title: 'ESKİ KRAMPONLA DEVAM',
            sub: '"Alıştığım krampondan şaşmam."',
            effectText: '+12 Kondisyon • +1 Odak',
            svg: EVENT_ART.gym_focus
        }
    },
    {
        id: 'luxury_car',
        category: 'LÜKS YAŞAM & TRANSFER',
        title: 'GALERİDEN SPOR ARABA FIRSATI!',
        desc: 'Menajerin kelepir fiyata spor bir araç buldu. Alırsan şehirde bütün gözler üzerinde olacak ama cüzdan biraz hafifleyecek!',
        choiceA: {
            title: 'ARABAYI SATIN AL (-₺2.000)',
            sub: '"Yıldız oyuncunun yıldız arabası olur!"',
            effectText: '-₺2.000 Nakit • +2 Odak & Gol Şansı!',
            svg: EVENT_ART.sports_car
        },
        choiceB: {
            title: 'PARAYI BANKADA TUT',
            sub: '"Şimdilik gösterişe gerek yok, birikim yapacağım."',
            effectText: '+₺600 Yatırım Geliri • +8 Güven',
            svg: EVENT_ART.sponsor_cash
        }
    },
    {
        id: 'freekick_master',
        category: 'BİREYSEL MESAİ',
        title: 'KALECİYLE FRİKİK İDDİASI!',
        desc: 'Takımın birinci kalecisi idman bitiminde "Bana 5 frikikten 3\'ünü atamazsın" diyerek meydan okudu!',
        choiceA: {
            title: 'İDDİAYA GİR & ÇALIŞ',
            sub: '"Diz barajı, doksana örümcek ağlarını alacağım!"',
            effectText: '+2 Bitiricilik (Şut)! • -18 Kondisyon',
            svg: EVENT_ART.penalty_spot
        },
        choiceB: {
            title: 'DUŞA GİRİP DİNLEN',
            sub: '"Bugünlük bu kadar idman yeter, maç var."',
            effectText: '+15 Kondisyon • +5 Güven',
            svg: EVENT_ART.gym_focus
        }
    },
    {
        id: 'transfer_rumor',
        category: 'TRANSFER KULİSLERİ',
        title: 'AVRUPA SCOUTLARI TRİBÜNDE!',
        desc: 'Menajerin aradı: "Avrupa\'dan 2 gözlemci bu hafta seni izlemeye geliyor, basına bir mesaj verelim mi?"',
        choiceA: {
            title: 'AVRUPA HEDEFİNİ AÇIKLA',
            sub: '"En büyük liglerde oynamak için hazırım!"',
            effectText: '+2 Odak Puanı • -10 Hoca Güveni',
            svg: EVENT_ART.scout_glass
        },
        choiceB: {
            title: 'KULÜBÜNE BAĞLILIK BİLDİR',
            sub: '"Tek düşüncem şu anki formamın hakkını vermek."',
            effectText: '+14 Hoca Güveni • +₺750 Kulüp Primi',
            svg: EVENT_ART.jersey_fan
        }
    },
    {
        id: 'strict_diet',
        category: 'BESLENME & KONDİSYON',
        title: 'ÖZEL İTALYAN FİZYOTERAPİST!',
        desc: 'Ünlü bir kondisyoner sana özel kas güçlendirme ve diyet paketi önerdi. Ücreti tuzlu ama etkisi kalıcı!',
        choiceA: {
            title: 'PAKETİ SATIN AL (-₺1.200)',
            sub: '"Vücudum benim sermayem, yatırıma değer!"',
            effectText: '-₺1.200 • +2 Dayanıklılık & +15 Kond.',
            svg: EVENT_ART.medical_syringe
        },
        choiceB: {
            title: 'TAKIM YEMEĞİYLE DEVAM',
            sub: '"Kulübün yemekhanesi neyimize yetmiyor!"',
            effectText: '+15 Kondisyon • +1 Odak',
            svg: EVENT_ART.team_handshake
        }
    },
    {
        id: 'fan_event',
        category: 'TARAFTAR ETKİLEŞİMİ',
        title: 'TESİS ÖNÜNDE FORMA İSTEĞİ!',
        desc: 'Soğuk havada okuldan çıkıp tesislerin kapısında seni bekleyen genç taraftarlar imzalı forma istiyor.',
        choiceA: {
            title: 'FORMA DAĞIT & FOTOĞRAF ÇEKİL',
            sub: '"Onları kırmak olmaz, mağazadan forma alıp dağıtayım."',
            effectText: '-₺400 • +2 Odak & +10 Hoca Güveni',
            svg: EVENT_ART.jersey_fan
        },
        choiceB: {
            title: 'EL SALLAYIP TESİSE GİR',
            sub: '"Üşütmeyelim, hemen dinlenmeye geçmem lazım."',
            effectText: '+15 Kondisyon • -6 Hoca Güveni',
            svg: EVENT_ART.mic_apology
        }
    }
];

// =========================================================================
// 2. GİZLİ TAKIM GÜÇLERİ VE İLK 11 BARAJI VERİTABANI
// =========================================================================
const LEAGUE_DB = {
    TR: {
        name: "Trendyol Süper Lig",
        teams: [
            { name: "Galatasaray", c1: "#a90432", c2: "#fdb912", power: 85, reqOvr: 73 },
            { name: "Fenerbahçe", c1: "#00205b", c2: "#ffed00", power: 84, reqOvr: 73 },
            { name: "Beşiktaş", c1: "#111111", c2: "#ffffff", power: 81, reqOvr: 70 },
            { name: "Trabzonspor", c1: "#7c1529", c2: "#38b6ff", power: 78, reqOvr: 67 },
            { name: "Başakşehir", c1: "#ea580c", c2: "#1e3a8a", power: 75, reqOvr: 65 },
            { name: "Samsunspor", c1: "#dc2626", c2: "#ffffff", power: 73, reqOvr: 62 },
            { name: "Göztepe", c1: "#facc15", c2: "#dc2626", power: 73, reqOvr: 62 },
            { name: "Eyüpspor", c1: "#7e22ce", c2: "#facc15", power: 72, reqOvr: 61 },
            { name: "Amed", c1: "#00843d", c2: "#e30613", power: 71, reqOvr: 60 },
            { name: "Alanyaspor", c1: "#f97316", c2: "#16a34a", power: 71, reqOvr: 60 },
            { name: "Kasımpaşa", c1: "#1d4ed8", c2: "#ffffff", power: 71, reqOvr: 60 },
            { name: "Rizespor", c1: "#15803d", c2: "#2563eb", power: 71, reqOvr: 60 },
            { name: "Konyaspor", c1: "#15803d", c2: "#ffffff", power: 70, reqOvr: 59 },
            { name: "Kocaelispor", c1: "#16a34a", c2: "#111111", power: 70, reqOvr: 59 },
            { name: "Gaziantep FK", c1: "#dc2626", c2: "#111111", power: 69, reqOvr: 58 },
            { name: "Çorum", c1: "#dc2626", c2: "#111111", power: 69, reqOvr: 58 },
            { name: "Gençlerbirliği", c1: "#dc2626", c2: "#000000", power: 68, reqOvr: 58 },
            { name: "Erzurumspor", c1: "#0284c7", c2: "#ffffff", power: 67, reqOvr: 57 }
        ]
    },
    EN: {
        name: "Premier League",
        teams: [
            { name: "Man City", c1: "#38bdf8", c2: "#ffffff", power: 91, reqOvr: 78 },
            { name: "Arsenal", c1: "#ef4444", c2: "#ffffff", power: 89, reqOvr: 76 },
            { name: "Liverpool", c1: "#dc2626", c2: "#facc15", power: 88, reqOvr: 75 },
            { name: "Chelsea", c1: "#1d4ed8", c2: "#ffffff", power: 83, reqOvr: 71 },
            { name: "Aston Villa", c1: "#7c1529", c2: "#38bdf8", power: 81, reqOvr: 69 },
            { name: "Brighton", c1: "#2563eb", c2: "#ffffff", power: 77, reqOvr: 64 },
            { name: "West Ham", c1: "#7c1529", c2: "#38bdf8", power: 76, reqOvr: 63 },
            { name: "Fulham", c1: "#ffffff", c2: "#111111", power: 75, reqOvr: 62 },
            { name: "Brentford", c1: "#dc2626", c2: "#ffffff", power: 74, reqOvr: 61 },
            { name: "Everton", c1: "#1e40af", c2: "#ffffff", power: 73, reqOvr: 60 }
        ]
    },
    ES: {
        name: "LaLiga",
        teams: [
            { name: "Real Madrid", c1: "#ffffff", c2: "#f59e0b", power: 92, reqOvr: 79 },
            { name: "Barcelona", c1: "#1d4ed8", c2: "#dc2626", power: 89, reqOvr: 76 },
            { name: "Atletico Madrid", c1: "#dc2626", c2: "#ffffff", power: 84, reqOvr: 72 },
            { name: "Real Sociedad", c1: "#2563eb", c2: "#ffffff", power: 78, reqOvr: 65 },
            { name: "Real Betis", c1: "#16a34a", c2: "#ffffff", power: 77, reqOvr: 64 },
            { name: "Girona", c1: "#dc2626", c2: "#ffffff", power: 76, reqOvr: 63 },
            { name: "Sevilla", c1: "#ffffff", c2: "#dc2626", power: 75, reqOvr: 62 },
            { name: "Valencia", c1: "#ffffff", c2: "#111111", power: 73, reqOvr: 60 }
        ]
    }
};

const STARTING_OVR_SLICES = [
    { ovr: 56, label: "56 OVR", desc: "Ham Altyapı Oyuncusu", weight: 17, color: "#334155" },
    { ovr: 58, label: "58 OVR", desc: "Genç Yetenek", weight: 21, color: "#475569" },
    { ovr: 59, label: "59 OVR", desc: "Gelecek Vaat Eden", weight: 17, color: "#1e40af" },
    { ovr: 60, label: "60 OVR", desc: "Standart Profesyonel", weight: 15, color: "#0369a1" },
    { ovr: 61, label: "61 OVR", desc: "Rotasyon Oyuncusu", weight: 11, color: "#0284c7" },
    { ovr: 63, label: "63 OVR", desc: "Hazır İlk 11 Adayı", weight: 8, color: "#0d9488" },
    { ovr: 65, label: "65 OVR", desc: "Parlayan Yıldız", weight: 5, color: "#059669" },
    { ovr: 68, label: "68 OVR", desc: "Üstün Yetenek", weight: 3, color: "#7c3aed" },
    { ovr: 71, label: "71 OVR", desc: "Elit Genç Yıldız", weight: 1.8, color: "#b45309" },
    { ovr: 73, label: "73 OVR", desc: "DÜNYA ÇAPINDA WONDERKID", weight: 1.2, color: "#d97706" }
];

let activeSlotId = 1;
let gameData = null;

let tempCreation = {
    hairStyle: 'curly',
    beardStyle: 'none',
    hairColor: '#4a2e1b',
    skinColor: '#f1c27d',
    c1: '#ffffff',
    c2: '#1e293b'
};

function getSaveKey(slot) { return `pro_futbol_kariyer_v6_slot_${slot}`; }
function saveCurrentGame() { if (gameData) localStorage.setItem(getSaveKey(activeSlotId), JSON.stringify(gameData)); }
function getPlayerOvr(stats) { return Math.round((stats.shoot + stats.pass + stats.dribble + stats.physic) / 4); }

// =========================================================================
// 3. KARAKTER & PORTRE SVG MOTORU
// =========================================================================
function generatePlayerSVG(cfg, scale = 1, portraitOnly = false) {
    const skin = cfg.skinColor || '#f1c27d';
    const hairCol = cfg.hairColor || '#4a2e1b';
    const hairStyle = cfg.hairStyle || 'curly';
    const beardStyle = cfg.beardStyle || 'none';
    const c1 = cfg.c1 || '#ffffff';
    const c2 = cfg.c2 || '#1e293b';

    let backHair = '';
    if (hairStyle === 'long') {
        backHair = `<path d="M29 26 C26 38, 27 54, 31 60 H69 C73 54, 74 38, 71 26 Z" fill="${hairCol}"/>`;
    }

    let topHair = '';
    if (hairStyle === 'short') {
        topHair = `<path d="M32 26 C31 11, 69 11, 68 26 C62 22, 38 22, 32 26 Z" fill="${hairCol}"/>`;
    } else if (hairStyle === 'curly') {
        topHair = `
            <path d="M33 25 C33 12, 67 12, 67 25 Z" fill="${hairCol}"/>
            <circle cx="37" cy="19" r="6.5" fill="${hairCol}"/>
            <circle cx="45" cy="15.5" r="7.5" fill="${hairCol}"/>
            <circle cx="55" cy="15.5" r="7.5" fill="${hairCol}"/>
            <circle cx="63" cy="19" r="6.5" fill="${hairCol}"/>
            <circle cx="33.5" cy="24" r="5" fill="${hairCol}"/>
            <circle cx="66.5" cy="24" r="5" fill="${hairCol}"/>
        `;
    } else if (hairStyle === 'fade') {
        topHair = `
            <path d="M34 24 C34 15, 66 15, 66 24 Z" fill="${hairCol}" opacity="0.35"/>
            <path d="M37 21 C37 10, 63 10, 63 21 L37 21 Z" fill="${hairCol}"/>
        `;
    } else if (hairStyle === 'long') {
        topHair = `
            <path d="M31 28 C31 10, 69 10, 69 28 C66 22, 58 20, 50 20 C42 20, 34 22, 31 28 Z" fill="${hairCol}"/>
            <path d="M31 25 C29 35, 30 48, 34 54 L36 30 Z" fill="${hairCol}"/>
            <path d="M69 25 C71 35, 70 48, 66 54 L64 30 Z" fill="${hairCol}"/>
        `;
    } else if (hairStyle === 'buzz') {
        topHair = `<path d="M33.5 25 C33.5 11.5, 66.5 11.5, 66.5 25 C59 22, 41 22, 33.5 25 Z" fill="${hairCol}" opacity="0.88"/>`;
    }

    let beardSVG = '';
    if (beardStyle === 'stubble') {
        beardSVG = `
            <path d="M35 33 C35 46, 65 46, 65 33 C63 41, 37 41, 35 33 Z" fill="${hairCol}" opacity="0.38"/>
            <path d="M44 35.5 Q50 33.5 56 35.5" stroke="${hairCol}" stroke-width="1.6" opacity="0.45" stroke-linecap="round"/>
        `;
    } else if (beardStyle === 'goatee') {
        beardSVG = `
            <path d="M44 35.5 Q50 33.5 56 35.5" stroke="${hairCol}" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M43 40 C44 46, 56 46, 57 40 C54 43, 46 43, 43 40 Z" fill="${hairCol}"/>
        `;
    } else if (beardStyle === 'full') {
        beardSVG = `
            <path d="M34.5 31.5 C34.5 48, 65.5 48, 65.5 31.5 L63 31.5 C62 39.5, 56 40.5, 50 40.5 C44 40.5, 38 39.5, 37 31.5 Z" fill="${hairCol}"/>
            <path d="M43 35.5 Q50 33.5 57 35.5" stroke="${hairCol}" stroke-width="2.5" stroke-linecap="round"/>
        `;
    }

    if (portraitOnly) {
        return `
        <svg width="46" height="46" viewBox="22 8 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            ${backHair}
            <path d="M22 52 C24 46, 35 45, 50 45 C65 45, 76 46, 78 52 L82 68 H18 L22 52 Z" fill="${c1}" stroke="#0f172a" stroke-width="1.5"/>
            <rect x="38" y="46" width="7" height="22" fill="${c2}"/>
            <rect x="55" y="46" width="7" height="22" fill="${c2}"/>
            <path d="M43 40 H57 V48 L50 53 L43 48 Z" fill="${skin}"/>
            <path d="M41 45 L50 54 L59 45" stroke="${c2}" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="33.5" cy="30" r="3.2" fill="${skin}"/>
            <circle cx="66.5" cy="30" r="3.2" fill="${skin}"/>
            <rect x="34.5" y="15" width="31" height="29" rx="13.5" fill="${skin}" stroke="#0f172a" stroke-width="1.4"/>
            <circle cx="44" cy="28.5" r="1.7" fill="#0f172a"/>
            <circle cx="56" cy="28.5" r="1.7" fill="#0f172a"/>
            <path d="M40.5 24.5 Q44 23 47 24.5" stroke="${hairCol}" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M53 24.5 Q56 23 59.5 24.5" stroke="${hairCol}" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M46.5 36.8 Q50 39 53.5 36.8" stroke="#7c2d12" stroke-width="1.5" stroke-linecap="round"/>
            ${beardSVG}
            ${topHair}
        </svg>`;
    }

    const w = Math.round(140 * scale);
    const h = Math.round(235 * scale);

    return `
    <svg width="${w}" height="${h}" viewBox="0 0 100 185" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="176" rx="26" ry="5" fill="rgba(0,0,0,0.5)"/>
        ${backHair}
        <rect x="36.5" y="116" width="9.5" height="30" fill="${skin}"/>
        <rect x="54" y="116" width="9.5" height="30" fill="${skin}"/>
        <rect x="35.5" y="138" width="11.5" height="26" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        <rect x="53" y="138" width="11.5" height="26" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        <rect x="36" y="142" width="10.5" height="4" fill="${c1}"/>
        <rect x="53.5" y="142" width="10.5" height="4" fill="${c1}"/>
        <path d="M32 163 H47 V171 H30 C30 166 32 163 32 163 Z" fill="#18181b" stroke="#000" stroke-width="1"/>
        <path d="M53 163 H68 C68 163 70 166 70 171 H53 V163 Z" fill="#18181b" stroke="#000" stroke-width="1"/>
        <path d="M21 67 L19 96 C19 99, 27 99, 27 96 L29 69 Z" fill="${skin}" stroke="#0f172a" stroke-width="1.3"/>
        <path d="M79 67 L81 96 C81 99, 73 99, 73 96 L71 69 Z" fill="${skin}" stroke="#0f172a" stroke-width="1.3"/>
        <path d="M32 93 H68 L66 121 H52 L50 109 L48 121 H34 L32 93 Z" fill="${c2}" stroke="#0f172a" stroke-width="1.5"/>
        <path d="M28 50 C32 47, 40 46, 50 46 C60 46, 68 47, 72 50 L81 66 L71 70 L68 59 V94 H32 V59 L29 70 L19 66 L28 50 Z" fill="${c1}" stroke="#0f172a" stroke-width="1.5" stroke-linejoin="round"/>
        <rect x="38.5" y="47" width="6.5" height="46" fill="${c2}" opacity="0.92"/>
        <rect x="55" y="47" width="6.5" height="46" fill="${c2}" opacity="0.92"/>
        <path d="M19.5 65 L28.5 68.5" stroke="${c2}" stroke-width="2.5"/>
        <path d="M80.5 65 L71.5 68.5" stroke="${c2}" stroke-width="2.5"/>
        <path d="M43 40 H57 V48 L50 53 L43 48 Z" fill="${skin}"/>
        <path d="M41.5 46 L50 54.5 L58.5 46" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="33.5" cy="30" r="3.2" fill="${skin}"/>
        <circle cx="66.5" cy="30" r="3.2" fill="${skin}"/>
        <rect x="34.5" y="15" width="31" height="29" rx="13.5" fill="${skin}" stroke="#0f172a" stroke-width="1.4"/>
        <circle cx="44" cy="28.5" r="1.7" fill="#0f172a"/>
        <circle cx="56" cy="28.5" r="1.7" fill="#0f172a"/>
        <path d="M40.5 24.5 Q44 23 47 24.5" stroke="${hairCol}" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M53 24.5 Q56 23 59.5 24.5" stroke="${hairCol}" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M46.5 36.8 Q50 39 53.5 36.8" stroke="#7c2d12" stroke-width="1.5" stroke-linecap="round"/>
        ${beardSVG}
        ${topHair}
    </svg>`;
}

function generateClubCrestSVG(c1, c2, size = 22) {
    return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" class="inline-block shrink-0">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="${c1}" stroke="#0f172a" stroke-width="1.8"/>
        <path d="M12 2v20c4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="${c2}"/>
    </svg>`;
}
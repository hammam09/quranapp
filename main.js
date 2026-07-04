// main.js

const QURAN_API = "https://equran.id/api/v2/surat";
let surahList = [];

// DOM Elements
const themeToggle = document.getElementById("themeToggle");
const surahContainer = document.getElementById("surahList");
const juzContainer = document.getElementById("juzList");
const inputSurat = document.getElementById("inputSurat");

const readingOverlay = document.getElementById("readingOverlay");
const btnCloseReading = document.getElementById("btnCloseReading");
const readingContent = document.getElementById("readingContent");
const readingSurahName = document.getElementById("readingSurahName");
const readingSurahInfo = document.getElementById("readingSurahInfo");

const lastReadCard = document.getElementById("lastReadCard");
const lastReadSurah = document.getElementById("lastReadSurah");
const lastReadAyat = document.getElementById("lastReadAyat");
const btnResumeRead = document.getElementById("btnResumeRead");

// Tabs
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Prayer Time & Location Elements
const locationText = document.getElementById("locationText");
const dateText = document.getElementById("dateText");
const prayerTimesContainer = document.getElementById("prayerTimesContainer");
const nextPrayerNameEl = document.getElementById("nextPrayerName");
const countdownTimerEl = document.getElementById("countdownTimer");

// Location Modal Elements
const locationModal = document.getElementById("locationModal");
const btnOpenLocationModal = document.getElementById("btnOpenLocationModal");
const btnCloseLocationModal = document.getElementById("btnCloseLocationModal");
const btnUseGPS = document.getElementById("btnUseGPS");
const btnSearchCity = document.getElementById("btnSearchCity");
const inputCitySearch = document.getElementById("inputCitySearch");

// State
let countdownInterval;
let currentPrayerData = null;

// Juz Mapping Data (Juz 1 to 30 with their starting Surah and Ayat)
const JUZ_MAPPING = [
  { juz: 1, surah: 1, ayat: 1 }, { juz: 2, surah: 2, ayat: 142 },
  { juz: 3, surah: 2, ayat: 253 }, { juz: 4, surah: 3, ayat: 93 },
  { juz: 5, surah: 4, ayat: 24 }, { juz: 6, surah: 4, ayat: 148 },
  { juz: 7, surah: 5, ayat: 82 }, { juz: 8, surah: 6, ayat: 112 },
  { juz: 9, surah: 7, ayat: 88 }, { juz: 10, surah: 8, ayat: 41 },
  { juz: 11, surah: 9, ayat: 93 }, { juz: 12, surah: 11, ayat: 6 },
  { juz: 13, surah: 12, ayat: 53 }, { juz: 14, surah: 15, ayat: 1 },
  { juz: 15, surah: 17, ayat: 1 }, { juz: 16, surah: 18, ayat: 75 },
  { juz: 17, surah: 21, ayat: 1 }, { juz: 18, surah: 23, ayat: 1 },
  { juz: 19, surah: 25, ayat: 21 }, { juz: 20, surah: 27, ayat: 56 },
  { juz: 21, surah: 29, ayat: 46 }, { juz: 22, surah: 33, ayat: 31 },
  { juz: 23, surah: 36, ayat: 28 }, { juz: 24, surah: 39, ayat: 32 },
  { juz: 25, surah: 41, ayat: 47 }, { juz: 26, surah: 46, ayat: 1 },
  { juz: 27, surah: 51, ayat: 31 }, { juz: 28, surah: 58, ayat: 1 },
  { juz: 29, surah: 67, ayat: 1 }, { juz: 30, surah: 78, ayat: 1 },
];

// ==========================================
// 1. THEME MANAGEMENT
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        document.body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === "light" 
        ? '<i class="ph ph-moon"></i>' 
        : '<i class="ph ph-sun"></i>';
}

// ==========================================
// 1.5 TABS MANAGEMENT
// ==========================================
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        tabContents.forEach(c => c.style.display = "none");

        // Add active class to clicked tab
        btn.classList.add("active");
        const targetId = btn.getAttribute("data-tab") + "Content";
        const targetContent = document.getElementById(targetId);
        targetContent.classList.add("active");
        targetContent.style.display = "block";
    });
});

// ==========================================
// 2. QURAN SURAH & JUZ LIST
// ==========================================
async function fetchSurahList() {
    try {
        const res = await fetch(QURAN_API);
        const data = await res.json();
        surahList = data.data;
        renderSurahList(surahList);
        renderJuzList();
    } catch (error) {
        surahContainer.innerHTML = `
            <div class="loading-state">
                <i class="ph ph-warning"></i>
                <p>Gagal memuat data. Periksa koneksi internet.</p>
            </div>
        `;
    }
}

function renderSurahList(list) {
    if (list.length === 0) {
        surahContainer.innerHTML = `<div class="loading-state"><p>Surah tidak ditemukan.</p></div>`;
        return;
    }

    surahContainer.innerHTML = list.map(surah => `
        <div class="surah-card" onclick="openReadingMode(${surah.nomor})">
            <div class="surah-card-left">
                <div class="surah-number"><span>${surah.nomor}</span></div>
                <div class="surah-info">
                    <h4>${surah.namaLatin}</h4>
                    <p>${surah.arti} • ${surah.jumlahAyat} Ayat</p>
                </div>
            </div>
            <div class="surah-card-right">
                ${surah.nama}
            </div>
        </div>
    `).join('');
}

function renderJuzList() {
    juzContainer.innerHTML = JUZ_MAPPING.map(juzItem => {
        const surah = surahList.find(s => s.nomor === juzItem.surah);
        if(!surah) return '';
        return `
        <div class="surah-card" onclick="openReadingMode(${surah.nomor}, ${juzItem.ayat})">
            <div class="surah-card-left">
                <div class="surah-number"><span>${juzItem.juz}</span></div>
                <div class="surah-info">
                    <h4>Juz ${juzItem.juz}</h4>
                    <p>Mulai dari: ${surah.namaLatin} ayat ${juzItem.ayat}</p>
                </div>
            </div>
            <div class="surah-card-right" style="font-size: 1rem;">
                <i class="ph ph-book-open"></i>
            </div>
        </div>
        `;
    }).join('');
}

inputSurat.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = surahList.filter(s => 
        s.namaLatin.toLowerCase().includes(keyword) || 
        s.nomor.toString() === keyword ||
        s.arti.toLowerCase().includes(keyword)
    );
    renderSurahList(filtered);
});

// ==========================================
// 3. READING MODE & VERSES
// ==========================================
async function openReadingMode(nomor, scrollToAyat = null) {
    readingOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
    
    readingContent.innerHTML = `
        <div class="loading-state">
            <i class="ph ph-spinner ph-spin"></i>
            <p>Memuat ayat...</p>
        </div>
    `;

    try {
        const res = await fetch(`${QURAN_API}/${nomor}`);
        const data = await res.json();
        const surah = data.data;

        readingSurahName.textContent = surah.namaLatin;
        readingSurahInfo.textContent = `${surah.arti} • ${surah.jumlahAyat} Ayat • ${surah.tempatTurun}`;

        let versesHTML = "";

        // Add Bismillah if not Al-Fatihah (1) or At-Taubah (9)
        if (nomor !== 1 && nomor !== 9) {
            versesHTML += `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
        }

        versesHTML += surah.ayat.map(ayat => `
            <div class="verse" id="verse-${ayat.nomorAyat}">
                <div class="verse-header">
                    <div class="verse-number">${ayat.nomorAyat}</div>
                    <div class="verse-actions">
                        <button class="btn-icon" onclick="saveBookmark(${surah.nomor}, '${surah.namaLatin}', ${ayat.nomorAyat})" title="Tandai Terakhir Dibaca">
                            <i class="ph ph-bookmark-simple"></i>
                        </button>
                    </div>
                </div>
                <div class="verse-arabic">${ayat.teksArab}</div>
                <div class="verse-latin">${ayat.teksLatin}</div>
                <div class="verse-translation">${ayat.teksIndonesia}</div>
                <audio class="audio-player" controls preload="none">
                    <source src="${ayat.audio['05']}" type="audio/mpeg">
                </audio>
            </div>
        `).join('');

        readingContent.innerHTML = versesHTML;
        
        // Auto-save opening the surah as last read (Ayat 1) if not jumping to specific ayat
        if (!scrollToAyat) {
            saveBookmark(surah.nomor, surah.namaLatin, 1, false);
        } else {
            // Scroll to specific ayah for Juz click or Resume Bookmark
            setTimeout(() => {
                const verseEl = document.getElementById(`verse-${scrollToAyat}`);
                if (verseEl) {
                    verseEl.scrollIntoView({ behavior: "smooth", block: "center" });
                    verseEl.style.backgroundColor = "var(--accent-light)";
                    setTimeout(() => verseEl.style.backgroundColor = "transparent", 2000);
                }
            }, 500);
        }

    } catch (error) {
        readingContent.innerHTML = `
            <div class="loading-state">
                <i class="ph ph-warning"></i>
                <p>Gagal memuat surah.</p>
            </div>
        `;
    }
}

btnCloseReading.addEventListener("click", () => {
    readingOverlay.classList.remove("active");
    document.body.style.overflow = "";
    // Stop any playing audio
    const audios = readingContent.querySelectorAll('audio');
    audios.forEach(a => a.pause());
});

// ==========================================
// 4. BOOKMARK / LAST READ
// ==========================================
function saveBookmark(nomorSurah, namaSurah, ayat, showAlert = true) {
    const bookmarkData = {
        nomorSurah,
        namaSurah,
        ayat,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem("lastRead", JSON.stringify(bookmarkData));
    loadBookmark();
    
    if (showAlert) {
        alert(`Berhasil ditandai: ${namaSurah} Ayat ${ayat}`);
    }
}

function loadBookmark() {
    const saved = localStorage.getItem("lastRead");
    if (saved) {
        const data = JSON.parse(saved);
        lastReadSurah.textContent = data.namaSurah;
        lastReadAyat.textContent = `Ayat ${data.ayat}`;
        btnResumeRead.style.display = "inline-flex";
        
        btnResumeRead.onclick = () => {
            openReadingMode(data.nomorSurah, data.ayat);
        };
    }
}

// ==========================================
// 5. PRAYER TIMES & LOCATION
// ==========================================

// Handle Location Modal
btnOpenLocationModal.addEventListener("click", () => {
    locationModal.style.display = "flex";
});
btnCloseLocationModal.addEventListener("click", () => {
    locationModal.style.display = "none";
});

// Use GPS
btnUseGPS.addEventListener("click", () => {
    locationModal.style.display = "none";
    locationText.textContent = "Mencari lokasi (GPS)...";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                fetchPrayerAPIByCoords(lat, lng);
                getLocationName(lat, lng);
            },
            (error) => {
                locationText.textContent = "Akses lokasi ditolak";
                alert("Mohon izinkan akses lokasi GPS di browser Anda.");
                fetchPrayerAPIByCity("Jakarta");
            }
        );
    } else {
        alert("Geolokasi tidak didukung di browser ini.");
        fetchPrayerAPIByCity("Jakarta");
    }
});

// Search City
btnSearchCity.addEventListener("click", () => {
    const city = inputCitySearch.value.trim();
    if(city) {
        locationModal.style.display = "none";
        locationText.textContent = city;
        fetchPrayerAPIByCity(city);
    }
});

function initPrayerTimes() {
    // Current Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateText.textContent = new Date().toLocaleDateString('id-ID', options);

    // Initial default: try GPS, fallback to Jakarta
    btnUseGPS.click();
}

async function getLocationName(lat, lng) {
    try {
        // Reverse geocoding using Nominatim (OpenStreetMap)
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
        const data = await res.json();
        const city = data.address.city || data.address.regency || data.address.state || "Lokasi Anda";
        locationText.textContent = city;
    } catch (e) {
        locationText.textContent = "Lokasi GPS (Detail tidak ditemukan)";
    }
}

async function fetchPrayerAPIByCoords(lat, lng) {
    try {
        const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const [year, month, day] = dateStr.split('-');
        
        // Aladhan API using Coordinates
        const res = await fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=20`);
        const data = await res.json();
        
        currentPrayerData = data.data.timings;
        renderPrayerTimes(currentPrayerData);
        startCountdown();
        
    } catch (error) {
        console.error("Gagal memuat jadwal sholat", error);
        prayerTimesContainer.innerHTML = "<p>Gagal memuat jadwal</p>";
    }
}

async function fetchPrayerAPIByCity(city) {
    try {
        // Aladhan API using City
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=20`);
        const data = await res.json();
        
        if(data.code !== 200) {
            alert("Kota tidak ditemukan atau error API.");
            return;
        }

        currentPrayerData = data.data.timings;
        renderPrayerTimes(currentPrayerData);
        startCountdown();
        
    } catch (error) {
        console.error("Gagal memuat jadwal sholat by city", error);
        prayerTimesContainer.innerHTML = "<p>Gagal memuat jadwal. Periksa nama kota.</p>";
    }
}


function renderPrayerTimes(timings) {
    const prayers = [
        { key: "Fajr", name: "Subuh" },
        { key: "Dhuhr", name: "Dzuhur" },
        { key: "Asr", name: "Ashar" },
        { key: "Maghrib", name: "Maghrib" },
        { key: "Isha", name: "Isya" }
    ];

    prayerTimesContainer.innerHTML = prayers.map(p => `
        <div class="prayer-item" id="prayer-${p.key}">
            <span class="prayer-name">${p.name}</span>
            <span class="prayer-time">${timings[p.key]}</span>
        </div>
    `).join('');
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    if (!currentPrayerData) return;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    const currentTimeMinutes = currentHours * 60 + currentMinutes + currentSeconds / 60;

    const prayers = [
        { key: "Fajr", name: "Subuh" },
        { key: "Dhuhr", name: "Dzuhur" },
        { key: "Asr", name: "Ashar" },
        { key: "Maghrib", name: "Maghrib" },
        { key: "Isha", name: "Isya" }
    ];

    let nextPrayer = null;

    // Find next prayer today
    for (let p of prayers) {
        const [pHours, pMins] = currentPrayerData[p.key].split(':').map(Number);
        const pTimeMinutes = pHours * 60 + pMins;
        
        if (currentTimeMinutes < pTimeMinutes) {
            nextPrayer = { ...p, timeMinutes: pTimeMinutes };
            break;
        }
    }

    // If no prayer left today, next is Fajr tomorrow
    if (!nextPrayer) {
        const [fajrHours, fajrMins] = currentPrayerData["Fajr"].split(':').map(Number);
        nextPrayer = { key: "Fajr", name: "Subuh besok", timeMinutes: fajrHours * 60 + fajrMins + 1440 }; // +24 hours
    }

    // Update active highlight in UI
    document.querySelectorAll('.prayer-item').forEach(el => el.classList.remove('active'));
    const activeEl = document.getElementById(`prayer-${nextPrayer.key === "Fajr" ? "Fajr" : nextPrayer.key}`);
    if (activeEl) activeEl.classList.add('active');

    nextPrayerNameEl.textContent = nextPrayer.name;

    // Calculate diff
    const diffMinutes = nextPrayer.timeMinutes - currentTimeMinutes;
    
    const h = Math.floor(diffMinutes / 60);
    const m = Math.floor(diffMinutes % 60);
    const s = Math.floor((diffMinutes * 60) % 60);

    const format = (num) => num.toString().padStart(2, '0');
    countdownTimerEl.textContent = `${format(h)}:${format(m)}:${format(s)}`;
}

// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadBookmark();
    fetchSurahList();
    initPrayerTimes();
});
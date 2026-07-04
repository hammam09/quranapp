# Qur'anQu (Aplikasi Al-Qur'an & Jadwal Sholat)

Qur'anQu adalah aplikasi web responsif dan modern untuk membaca Al-Qur'an secara interaktif. Aplikasi ini dibangun dengan prinsip *Mobile-First Design* serta dilengkapi fitur-fitur Islami lainnya untuk mempermudah ibadah harian.

## ✨ Fitur Utama

- **📖 Baca Al-Qur'an**: Akses 114 Surah lengkap dengan teks Arab, transliterasi Latin, dan terjemahan Bahasa Indonesia.
- **🎧 Murottal Audio**: Dilengkapi pemutar audio untuk setiap ayat.
- **📑 Navigasi Juz & Surah**: Memudahkan mencari bacaan berdasarkan nomor/nama Surah ataupun melompat ke awal Juz 1 hingga 30.
- **🕌 Jadwal Sholat Real-time**: Menampilkan jadwal sholat 5 waktu serta waktu hitung mundur (*countdown*) ke sholat berikutnya. Pengguna bisa mengatur lokasi otomatis via **GPS** maupun mencari berdasarkan **nama kota**.
- **🔖 Penanda "Terakhir Dibaca"**: Progres bacaan Anda dapat ditandai dan akan tersimpan secara otomatis (menggunakan *localStorage* browser) sehingga bisa dilanjutkan kapan saja.
- **🌙 Dark/Light Mode**: Mendukung mode gelap (Dark Mode) untuk kenyamanan membaca di malam hari.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun tanpa menggunakan framework pihak ketiga (*Zero Dependencies* pada framework berat), demi menjaga kecepatan memuat (loading) dan kesederhanaan.

- **HTML5** & **CSS3** (dengan *CSS Variables* & *Glassmorphism*).
- **Vanilla JavaScript** (ES6+).
- **[equran.id API v2](https://equran.id/apiv2/)** — Sumber data ayat dan terjemahan Al-Qur'an.
- **[Aladhan API](https://aladhan.com/prayer-times-api)** — Sumber data jadwal sholat berdasarkan koordinat atau kota.
- **Phosphor Icons** — Library ikon modern.

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini berupa halaman web statis murni sehingga sangat mudah untuk dijalankan.

1. _Clone_ atau _Download_ *repository* ini.
2. Buka file `index.html` menggunakan *web browser* (Google Chrome, Firefox, Safari, Microsoft Edge).
3. **Penting**: Pastikan Anda terhubung ke internet saat membuka aplikasi agar data Al-Qur'an dan jadwal sholat dapat dimuat dari API.
4. Izinkan akses Lokasi (GPS) apabila Anda ingin menggunakan fitur jadwal sholat berbasis koordinat *real-time*.

## 📂 Struktur Direktori

```text
├── index.html   # Struktur utama halaman web & antarmuka UI.
├── style.css    # Gaya, animasi, warna (variabel), & layout responsif.
├── main.js      # Logika aplikasi (fetch API, manajemen state lokasi, bookmark, dsb).
└── README.md    # Dokumentasi proyek.
```

## Demo Website
- URL : https://quranqu.netlify.app

# Physics Sandbox - Platform Belajar Fisika (AS/A Level Cambridge 9702)

Physics Sandbox adalah platform belajar fisika berbasis web untuk silabus **Cambridge International AS & A Level Physics 9702**. Situs ini statis (bisa di-hosting gratis di GitHub Pages atau Vercel) dan memakai Google Gemini (dengan API key gratis milik masing-masing pengguna) untuk fitur AI-nya.

Setiap topik dibagi menjadi empat bagian:

- **Materi Belajar** - rumus, penjelasan, tabel, serta foto/video pendukung.
- **Eksperimen** - praktikum fisika nyata (tujuan, alat & bahan, langkah kerja, analisis data, keselamatan kerja), dengan pilihan alat sederhana, alat laboratorium, atau simulasi virtual untuk sekolah yang belum punya alatnya.
- **Latihan Soal** - soal pilihan ganda/uraian dengan pembahasan yang baru terbuka setelah dicoba.
- **Makerspace** - siswa mengisi generator prompt terstruktur, lalu AI menuliskan kode simulasi fisika HTML interaktif yang langsung tampil, bisa diedit, dan diunduh.

Semua konten mengikuti **25 topik silabus Cambridge 9702** (lihat `CURRICULUM.md` untuk peta lengkap dan status pengisiannya).

---

## Alur Belajar

Tiap topik berjalan sebagai satu proyek belajar mengikuti sintaks **Project-Based Learning (PjBL)**, cocok untuk proyek yang berjalan lintas beberapa pertemuan:

1. **Materi Belajar** - siswa mempelajari konsep, lalu menjawab kuis pemahaman singkat (dinilai otomatis, minimal skor 80% untuk lanjut).
2. **Eksperimen** - siswa mengerjakan praktikum, mengisi tabel data pengamatannya sendiri, lalu menjawab pertanyaan tentang hubungan antar-variabel. Kalau benar, permintaan lanjut dikirim ke guru untuk dikonfirmasi lewat Panel Guru sebelum Latihan Soal dan Makerspace terbuka.
3. **Latihan Soal** - memperkuat konsep lewat soal-soal latihan.
4. **Makerspace** - siswa membangun simulasi fisikanya sendiri dengan bantuan AI, lalu menulis refleksi singkat (validasi apakah simulasinya sesuai konsep fisika) untuk dikonfirmasi guru sebagai penanda topik selesai.

Siswa boleh mulai dari topik mana saja, tetapi di dalam satu topik, keempat tab di atas tetap dibuka berurutan sesuai kemajuan masing-masing. Situs juga mendukung:

- **Belajar mandiri** maupun **belajar dalam sesi kelas** yang dikendalikan real-time oleh guru lewat Panel Guru (`teacher.html`): guru bisa menentukan aktivitas yang wajib dikerjakan bersama, memantau progres/roster siswa, serta menyetujui/menolak permintaan lanjut dari siswa.
- **Pembelajaran berdiferensiasi**: tingkat belajar siswa (Dasar/Menengah/Lanjut) ditentukan otomatis dari hasil kuis Materi, lalu memengaruhi kedalaman materi, gaya Tutor Fisika, dan kompleksitas bawaan di Makerspace.
- **Tutor Fisika** - chatbot diskusi konsep bergaya Socratic di tiap halaman topik.
- **Kuis Topik** - guru bisa membuat/menerbitkan kuis (manual atau digenerate AI) ke sesi kelas yang sedang berjalan.

---

## Struktur Proyek

```
├── index.html              -> halaman utama siswa (satu halaman, semua topik)
├── teacher.html             -> Panel Guru (kontrol sesi kelas + monitoring roster real-time)
├── css/style.css             -> tampilan
├── js/config.js              -> URL backend AI + kode belajar mandiri/eksplorasi bebas
├── js/content.js             -> semua konten topik (materi, eksperimen, latihan soal)
├── js/app.js                 -> logika situs utama (navigasi bertahap, tab, generator prompt, sesi kelas, dsb.)
├── js/teacher.js             -> logika Panel Guru
├── js/chatbot.js / chatbot-data.js -> Tutor Fisika (chat AI + fallback lokal)
├── js/i18n.js                -> sistem dwibahasa Indonesia/English
├── apps-script/Code.gs       -> backend relay ke Gemini API + koordinasi sesi kelas (Google Apps Script)
├── tests/                    -> server uji lokal + tes end-to-end Playwright
└── CURRICULUM.md             -> peta 25 topik + status pengisian konten
```

---

## Menjalankan Sendiri

Situs ini statis, jadi bisa di-deploy gratis lewat **GitHub Pages** atau **Vercel** (import repo ini langsung, tidak perlu build command).

Fitur AI (Makerspace, Tutor Fisika, dsb.) butuh backend relay ke Gemini API, dipasang terpisah lewat **Google Apps Script**:

1. Buka https://script.google.com -> **New project**, lalu salin-tempel seluruh isi `apps-script/Code.gs`.
2. **Deploy -> New deployment** -> tipe **Web app**, *Execute as*: Me, *Who has access*: Anyone.
3. Salin URL yang berakhiran `/exec`, isi ke `DEFAULT_BACKEND_URL` di `js/config.js`, lalu commit & push.

Setiap pengguna (guru maupun siswa) memasukkan API key Gemini **gratis miliknya sendiri** lewat panel yang muncul di halaman Beranda situs (dipandu langkah demi langkah) - key tersimpan hanya di browser masing-masing, tidak pernah melewati atau disimpan di server. Kalau API key belum diisi, tab Makerspace tetap menawarkan **Mode Demo** untuk mencoba alurnya.

Untuk troubleshooting setup lebih lanjut (redeploy Apps Script, error CORS, dsb.), lihat komentar di awal `apps-script/Code.gs`.

### Menambah topik baru

Semua 25 topik sudah terdaftar di `js/content.js` (array `TOPICS`) dengan status `"soon"`. Isi materi/eksperimen/latihan soal mengikuti pola blok `KINEMATICS_...` yang sudah lengkap sebagai contoh, lalu ubah `status` menjadi `"ready"`. Tidak perlu mengubah `app.js` atau `index.html`.

### Tes otomatis

Folder `tests/` berisi server uji lokal yang menjalankan `Code.gs` asli dengan layanan Google/Gemini tiruan (tidak menyentuh Apps Script/spreadsheet/kuota sungguhan), plus tes end-to-end Playwright. Jalankan: `node tests/mock-backend.js 8787 &` lalu `NODE_PATH=$(npm root -g) node tests/e2e.js`.

---

## Sumber referensi silabus

- [Cambridge International AS & A Level Physics 9702 - ringkasan topik 2025-2027 (Gamatrain)](https://gamatrain.com/blog/54/cambridge-international-as-a-level-physics-9702-syllabus-content-assessment-and-routes-for-2025-2026-and-2027)

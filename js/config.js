/* ============================================================
   config.js
   Konfigurasi koneksi ke backend AI (Google Apps Script Web App).
   ------------------------------------------------------------
   CARA MENGAKTIFKAN GENERATE AI SUNGGUHAN UNTUK SEMUA SISWA:
   1. Deploy apps-script/Code.gs sebagai Web App (lihat README.md).
   2. Salin URL Web App yang diberikan (diakhiri "/exec").
   3. Tempel di bawah, di antara tanda kutip.
   4. Commit & push perubahan ini ke GitHub -> semua siswa yang
      membuka situs otomatis terhubung, tanpa perlu setting apa pun.

   Jika dikosongkan (""), situs akan otomatis berjalan di
   "Mode Demo" (memakai simulasi contoh yang sudah disiapkan,
   bukan hasil AI sungguhan) sampai URL ini diisi, ATAU sampai
   pengguna mengisi URL secara manual lewat tombol Pengaturan
   di pojok kanan atas (tersimpan di browser mereka masing-masing,
   berguna untuk testing tanpa perlu commit ke repo).
   ============================================================ */

const DEFAULT_BACKEND_URL = "https://script.google.com/macros/s/AKfycbyR9-69ZKXEOmSHPY_iDFM0MZ2WEb57NyLdHPCYEB5oqOuyAG8q4IosI0cJwm6xTZUXlw/exec";

/* ============================================================
   KODE EKSPLORASI BEBAS (untuk guru)
   ------------------------------------------------------------
   Situs ini membuka topik & tab secara BERTAHAP (sesuai urutan
   sintaks pembelajaran: Materi -> Eksperimen -> Latihan Soal ->
   Lab Simulasi Virtual, lalu topik berikutnya baru terbuka
   setelah topik sekarang selesai dijelajahi).

   Guru dapat membagikan SATU kode di bawah ini kepada siswa yang
   butuh menjelajah bebas tanpa urutan (misalnya untuk eksplorasi
   mandiri di rumah). Siswa memasukkan kode ini sekali lewat
   tombol Pengaturan -> "Kode Eksplorasi Bebas", tersimpan di
   browser mereka, lalu semua topik & tab terbuka bebas.

   Ganti teks di bawah dengan kode pilihanmu, lalu commit & push.
   Tidak sensitif seperti API key - ini hanya kode kelas biasa. */
const TEACHER_UNLOCK_CODE = "fisika-merdeka";

/* ============================================================
   MODE VALIDASI AHLI (sementara)
   ------------------------------------------------------------
   Untuk keperluan validasi platform ke ahli media/ahli materi,
   menu navigasi topik bisa dibatasi supaya HANYA menampilkan
   topik tertentu (topik lain disembunyikan total dari daftar,
   bukan cuma dikunci/di-lock seperti gating biasa).

   Isi array di bawah dengan "id" topik yang ingin TETAP terlihat
   (lihat field id tiap topik di js/content.js, mis.
   "magnetic-fields"). Kosongkan array ini ([]) untuk menampilkan
   SEMUA topik lagi seperti biasa setelah validasi selesai.
   Panel Guru (teacher.html) TIDAK terpengaruh oleh pembatasan
   ini - guru tetap melihat semua 25 topik seperti biasa. */
const VISIBLE_TOPIC_IDS = ["magnetic-fields"];

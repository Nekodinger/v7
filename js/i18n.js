/* ============================================================
   i18n.js - Sistem dwibahasa (Indonesia / English) untuk UI
   ------------------------------------------------------------
   Ditambahkan 2026-09-09 atas permintaan user: "berikan fitur
   pilihan bahasa, mau bahasa inggris atau indonesia" - dipilih
   cakupan "UI + semua konten fisika" (bukan cuma UI).

   Cara kerja:
   1. Bahasa aktif disimpan di localStorage (STORAGE_KEY_LANG),
      default "id". getLang()/setLang() mengelola ini.
   2. String UI STATIS (label tombol, judul, placeholder, dst di
      index.html/teacher.html) ditandai lewat atribut:
        data-i18n="key"             -> textContent = t(key)
        data-i18n-html="key"        -> innerHTML = t(key)  (boleh ada <strong>/<a>/<code>)
        data-i18n-placeholder="key" -> placeholder = t(key)
        data-i18n-title="key"       -> title = t(key)
        data-i18n-aria="key"        -> aria-label = t(key)
     applyStaticI18n() memindai seluruh dokumen mencari atribut
     ini dan menerapkan terjemahan yang sesuai bahasa aktif.
   3. String UI DINAMIS (dibuat lewat JS di app.js/chatbot.js,
      mis. toast, status generate, counter edit) memanggil t(key,
      vars) langsung saat string itu dibuat.
   4. Konten FISIKA per topik (di js/content.js: title, desc,
      materiHTML, eksperimen, latihan, labConcepts, formulaSheet)
      TIDAK disimpan di kamus i18n ini (isinya besar & spesifik per
      topik) - field-field itu sendiri diubah jadi bentuk
      dwibahasa `{ id: "...", en: "..." }` langsung di content.js.
      trContent(field) di bawah membaca objek itu sesuai bahasa
      aktif, dengan fallback otomatis ke Indonesia kalau versi
      Inggrisnya belum ada (supaya topik yang belum diterjemahkan
      tidak pernah rusak/kosong, cuma tetap tampil dalam Indonesia).
   5. Mengganti bahasa (setLang) MEMUAT ULANG HALAMAN (reload) -
      pilihan sengaja dibuat sederhana & aman: banyak state di situs
      ini (topik aktif, tab aktif, sesi kelas, dst) dibentuk dari
      render penuh saat load, jadi reload menghindari kelas bug
      "separuh ganti bahasa" yang jauh lebih berisiko daripada
      re-render parsial. Topik & tab yang sedang dibuka tetap
      dipertahankan lewat sessionStorage sebelum reload.
   ============================================================ */

const STORAGE_KEY_LANG = "physicsSandbox.lang";
const SESSION_KEY_LANG_RESTORE = "physicsSandbox.langRestoreTopic";

const I18N_STRINGS = {
  /* ---------------- Onboarding gate ---------------- */
  "gate.step1.title": { id: "Langkah 1: Siapkan API key Gemini gratismu", en: "Step 1: Set up your free Gemini API key" },
  "gate.step1.desc": { id: "Situs ini memakai AI (Google Gemini) untuk Lab Simulasi Virtual dan Tutor Fisika. Masukkan API key Gemini <strong>milikmu sendiri</strong> dulu, gratis, tersimpan hanya di browser ini, dan tidak pernah dikirim ke siapa pun selain langsung ke Google.", en: "This site uses AI (Google Gemini) for the Virtual Simulation Lab and Physics Tutor. First enter <strong>your own</strong> Gemini API key - it's free, stored only in this browser, and never sent to anyone except directly to Google." },
  "gate.step1.li1": { id: "<strong>Buka Google AI Studio</strong> dan masuk dengan akun Google-mu.", en: "<strong>Open Google AI Studio</strong> and sign in with your Google account." },
  "gate.step1.li1.link": { id: "Buka aistudio.google.com/apikey", en: "Open aistudio.google.com/apikey" },
  "gate.step1.li2": { id: "Klik <strong>Create API key</strong>, lalu salin key yang muncul (diawali huruf <code>AIza...</code>).", en: "Click <strong>Create API key</strong>, then copy the key that appears (it starts with <code>AIza...</code>)." },
  "gate.step1.li3": { id: "Tempel API key itu di kolom ini, lalu simpan.", en: "Paste that API key into the field below, then save." },
  "gate.key.placeholder": { id: "Tempel API key Gemini di sini", en: "Paste your Gemini API key here" },
  "gate.key.toggle": { id: "Tampilkan/sembunyikan", en: "Show/hide" },
  "gate.key.save": { id: "Simpan & Lanjut", en: "Save & Continue" },
  "gate.key.needkey": { id: "Tempel API key Gemini dulu.", en: "Paste your Gemini API key first." },
  "gate.step1.footnote": { id: "Free tier Gemini punya batas kuota harian yang wajar untuk satu kelas, cek angka terbaru di <a href=\"https://ai.google.dev/gemini-api/docs/rate-limits\" target=\"_blank\" rel=\"noopener\">ai.google.dev/gemini-api/docs/rate-limits</a>. Jangan masukkan data pribadi ke dalam prompt simulasi.", en: "The Gemini free tier has a reasonable daily quota for one class - check the latest numbers at <a href=\"https://ai.google.dev/gemini-api/docs/rate-limits\" target=\"_blank\" rel=\"noopener\">ai.google.dev/gemini-api/docs/rate-limits</a>. Don't put personal data into simulation prompts." },

  "gate.step2.title": { id: "Langkah 2: Kamu siapa?", en: "Step 2: Who are you?" },
  "gate.step2.desc": { id: "Pilih salah satu supaya situs menuntunmu lewat alur yang tepat.", en: "Pick one so the site can guide you through the right flow." },
  "gate.role.student.title": { id: "Saya siswa", en: "I'm a student" },
  "gate.role.student.desc": { id: "Isi nama & kelas, lalu masukkan kode dari guru untuk belajar bersama sesuai sesi kelas.", en: "Enter your name & class, then enter the code from your teacher to join the class session." },
  "gate.role.guest.title": { id: "Bukan siswa (guru/pengelola/lainnya)", en: "Not a student (teacher/admin/other)" },
  "gate.role.guest.desc": { id: "Masukkan Kode Eksplorasi Bebas untuk langsung membuka semua topik.", en: "Enter a Free Exploration Code to unlock all topics right away." },

  "gate.step3s.title": { id: "Langkah 3: Data diri singkat", en: "Step 3: A few quick details" },
  "gate.step3s.desc": { id: "Supaya gurumu bisa mengenali progresmu di Panel Guru.", en: "So your teacher can recognize your progress in the Teacher Panel." },
  "field.fullname": { id: "Nama lengkap", en: "Full name" },
  "field.fullname.placeholder": { id: "Nama kamu", en: "Your name" },
  "field.class": { id: "Kelas", en: "Class" },
  "field.class.placeholder": { id: "misal: XI IPA 2", en: "e.g. Grade 11 Science 2" },
  "action.continue": { id: "Lanjut", en: "Continue" },
  "action.back": { id: "Kembali", en: "Back" },
  "gate.student.needinfo": { id: "Isi nama dan kelas dulu.", en: "Fill in your name and class first." },

  "gate.step4s.title": { id: "Langkah 4: Masukkan kode dari guru", en: "Step 4: Enter your teacher's code" },
  "gate.step4s.desc": { id: "Tanyakan ke gurumu kode sesi kelas yang sedang berjalan sekarang.", en: "Ask your teacher for the current class session code." },
  "gate.student.code.placeholder": { id: "Kode dari guru", en: "Code from your teacher" },
  "action.join": { id: "Gabung", en: "Join" },
  "gate.student.code.back": { id: "Ubah nama/kelas", en: "Change name/class" },
  "gate.student.code.needcode": { id: "Masukkan kode dari guru dulu.", en: "Enter the code from your teacher first." },
  "gate.student.code.connecting": { id: "Menghubungkan...", en: "Connecting..." },

  "gate.step3g.title": { id: "Langkah 3: Kode Eksplorasi Bebas", en: "Step 3: Free Exploration Code" },
  "gate.step3g.desc": { id: "Masukkan kode dari guru/pengelola situs untuk membuka akses penuh ke semua topik.", en: "Enter the code from your teacher/site admin to unlock full access to all topics." },
  "gate.guest.code.placeholder": { id: "Kode eksplorasi", en: "Exploration code" },
  "action.unlockaccess": { id: "Buka Akses", en: "Unlock Access" },
  "gate.guest.code.needcode": { id: "Masukkan kode eksplorasi dulu.", en: "Enter the exploration code first." },
  "gate.guest.code.wrong": { id: "Kode salah. Tanyakan Kode Eksplorasi Bebas ke guru/pengelola situs.", en: "Wrong code. Ask your teacher/site admin for the Free Exploration Code." },

  /* ---------------- Header ---------------- */
  "header.home.title": { id: "Kembali ke Beranda", en: "Back to Home" },
  "header.brandsub": { id: "Belajar & Lab Simulasi Fisika · AS & A Level Cambridge 9702", en: "Learn Physics & Virtual Simulation Lab · AS & A Level Cambridge 9702" },
  "header.keystatus.title": { id: "Status API key Gemini", en: "Gemini API key status" },
  "header.keystatus.on": { id: "API key tersambung", en: "API key connected" },
  "header.keystatus.off": { id: "API key belum diatur", en: "API key not set" },
  "header.settings": { id: "Pengaturan", en: "Settings" },
  "header.lang.title": { id: "Ganti bahasa", en: "Change language" },

  "classsession.gobtn": { id: "Ke sana sekarang", en: "Go there now" },
  "nav.toggle.title": { id: "Pin/lepas menu topik", en: "Pin/unpin topic menu" },
  "nav.toggle.aria": { id: "Pin menu topik", en: "Pin topic menu" },
  "nav.aria": { id: "Daftar topik", en: "Topic list" },
  "nav.group.as": { id: "AS Level (Topik 1 - 11)", en: "AS Level (Topics 1 - 11)" },
  "nav.group.a2": { id: "A Level Tambahan (Topik 12 - 25)", en: "A Level Extra (Topics 12 - 25)" },

  /* ---------------- Welcome panel ---------------- */
  "welcome.title": { id: "Selamat datang di Physics Sandbox", en: "Welcome to Physics Sandbox" },
  "welcome.intro": { id: "Pilih topik di sebelah kiri untuk mulai belajar. Setiap topik punya empat bagian: <strong>Materi Belajar</strong>, <strong>Eksperimen</strong>, <strong>Latihan Soal</strong>, dan <strong>Lab Simulasi Virtual</strong> tempat kamu bisa membuat simulasi fisikamu sendiri dengan bantuan AI.", en: "Pick a topic on the left to start learning. Each topic has four sections: <strong>Learning Material</strong>, <strong>Experiments</strong>, <strong>Practice Questions</strong>, and <strong>Virtual Simulation Lab</strong> where you can build your own physics simulation with AI's help." },
  "welcome.legend": { id: "Topik yang sudah lengkap ditandai <span class=\"badge badge-ready\">Siap</span>, topik lain masih <span class=\"badge badge-soon\">Segera</span> - struktur sudah disiapkan, tinggal diisi kontennya.", en: "Completed topics are marked <span class=\"badge badge-ready\">Ready</span>; other topics are still <span class=\"badge badge-soon\">Coming soon</span> - the structure is ready, content is on the way." },
  "badge.ready": { id: "Siap", en: "Ready" },
  "badge.soon": { id: "Segera", en: "Coming soon" },

  /* ---------------- Tabs / progress ---------------- */
  "tab.materi": { id: "Materi Belajar", en: "Learning Material" },
  "tab.eksperimen": { id: "Eksperimen", en: "Experiments" },
  "tab.latihan": { id: "Latihan Soal", en: "Practice Questions" },
  "tab.lab": { id: "Lab Simulasi Virtual", en: "Virtual Simulation Lab" },
  "progress.continueto": { id: "Lanjut ke", en: "Continue to" },
  "progress.finish": { id: "Topik selesai - Lanjut ke Topik Berikutnya", en: "Topic complete - Continue to Next Topic" },
  "toast.tablocked": { id: "Selesaikan tab sebelumnya dulu supaya sesuai urutan belajar, atau masukkan Kode Eksplorasi Bebas dari guru.", en: "Finish the previous tab first to follow the learning order, or enter a Free Exploration Code from your teacher." },
  "toast.classlocked": { id: "Ada sesi kelas aktif - ikuti aktivitas yang sedang ditentukan guru dulu.", en: "A class session is active - follow the activity your teacher set first." },

  /* ---------------- Lab Simulasi Virtual ---------------- */
  "lab.keybanner.text": { id: "Kamu belum memasukkan API key Gemini pribadi, jadi Generate belum bisa jalan.", en: "You haven't entered your personal Gemini API key yet, so Generate won't work." },
  "lab.keybanner.btn": { id: "Atur API Key", en: "Set API Key" },
  "lab.card1.title": { id: "Generator Prompt Terstruktur", en: "Structured Prompt Generator" },
  "lab.card1.desc": { id: "Isi kolom-kolom ini supaya prompt yang dikirim ke AI jelas dan terarah, tidak perlu jago menulis prompt dari nol.", en: "Fill in these fields so the prompt sent to the AI is clear and focused - no prompt-writing skills needed." },
  "lab.field.concept": { id: "Konsep fisika spesifik", en: "Specific physics concept" },
  "lab.field.vistype": { id: "Jenis visualisasi", en: "Visualization type" },
  "lab.vistype.moving": { id: "Animasi objek bergerak", en: "Moving object animation" },
  "lab.vistype.graph": { id: "Grafik interaktif real-time", en: "Real-time interactive graph" },
  "lab.vistype.apparatus": { id: "Alat peraga virtual", en: "Virtual apparatus" },
  "lab.vistype.vector": { id: "Diagram vektor interaktif", en: "Interactive vector diagram" },
  "lab.field.variables": { id: "Variabel yang bisa diubah siswa (pisahkan dengan koma)", en: "Variables the student can change (comma-separated)" },
  "lab.field.variables.placeholder": { id: "misal: kecepatan awal, sudut, massa", en: "e.g. initial velocity, angle, mass" },
  "lab.field.goal": { id: "Tujuan pembelajaran", en: "Learning objective" },
  "lab.field.goal.placeholder": { id: "misal: siswa dapat mengamati hubungan antara sudut elevasi dan jarak jangkauan pada gerak parabola", en: "e.g. students can observe the relationship between launch angle and range in projectile motion" },
  "lab.field.level": { id: "Tingkat kompleksitas tampilan", en: "Display complexity level" },
  "lab.level.simple": { id: "Sederhana", en: "Simple" },
  "lab.level.medium": { id: "Menengah", en: "Medium" },
  "lab.level.complex": { id: "Kompleks", en: "Complex" },
  "lab.field.extra": { id: "Instruksi tambahan (opsional)", en: "Additional instructions (optional)" },
  "lab.field.extra.placeholder": { id: "misal: gunakan tema warna gelap, tampilkan rumus yang dipakai di layar", en: "e.g. use a dark color theme, show the formulas used on screen" },
  "lab.build.btn": { id: "Susun Prompt", en: "Build Prompt" },

  "lab.card2.title": { id: "Prompt Final (bisa kamu edit)", en: "Final Prompt (you can edit it)" },
  "lab.finalprompt.placeholder": { id: "Prompt hasil susunan akan muncul di sini. Kamu boleh mengedit langsung sebelum generate.", en: "The assembled prompt will appear here. You can edit it directly before generating." },
  "lab.generate.btn": { id: "Generate Simulasi", en: "Generate Simulation" },
  "lab.demo.btn": { id: "Coba Mode Demo (tanpa API key)", en: "Try Demo Mode (no API key)" },
  "lab.generate.needprompt": { id: "Susun atau tulis prompt terlebih dahulu.", en: "Build or write a prompt first." },
  "lab.generate.needkey": { id: "Kamu belum memasukkan API key Gemini pribadi. <button type=\"button\" class=\"link-btn\" id=\"mode-banner-key-btn\">Atur API key sekarang</button>, atau tekan \"Coba Mode Demo\" untuk melihat contoh simulasi tanpa AI.", en: "You haven't entered your personal Gemini API key. <button type=\"button\" class=\"link-btn\" id=\"mode-banner-key-btn\">Set your API key now</button>, or press \"Try Demo Mode\" to see a sample simulation without AI." },
  "lab.generate.needbackend": { id: "Backend belum dikonfigurasi (lihat README.md bagian setup). Hubungi pengelola situs.", en: "Backend isn't configured yet (see the setup section of README.md). Contact the site admin." },
  "lab.generate.loading": { id: "Menghubungi AI, mohon tunggu (bisa 10-30 detik)...", en: "Contacting the AI, please wait (can take 10-30 seconds)..." },
  "lab.generate.retryhint": { id: " Coba klik Generate lagi (hasil AI bisa berbeda tiap percobaan), atau sederhanakan promptnya.", en: " Try clicking Generate again (AI results can differ each time), or simplify the prompt." },
  "lab.generate.success": { id: "Simulasi berhasil dibuat.", en: "Simulation created successfully." },
  "lab.generate.failed": { id: "Gagal generate: ", en: "Generate failed: " },
  "lab.generate.failedsuffix": { id: " - coba lagi, atau cek README bagian troubleshooting.", en: " - try again, or check the troubleshooting section of the README." },
  "lab.demo.active": { id: "Mode Demo aktif: menampilkan simulasi contoh yang sudah disiapkan (bukan hasil AI sesungguhnya), sekadar untuk melihat alur Lab Simulasi Virtual.", en: "Demo Mode active: showing a pre-made sample simulation (not real AI output), just to see how the Virtual Simulation Lab flow works." },

  "lab.card3.title": { id: "Preview Simulasi", en: "Simulation Preview" },
  "lab.rerun.btn": { id: "Jalankan Ulang", en: "Run Again" },
  "lab.togglecode.view": { id: "Lihat Kode", en: "View Code" },
  "lab.togglecode.preview": { id: "Lihat Preview", en: "View Preview" },
  "lab.download.btn": { id: "Unduh .html", en: "Download .html" },
  "lab.preview.title": { id: "Preview simulasi", en: "Simulation preview" },

  "lab.editfollowup.title": { id: "Prompt Lanjutan (edit simulasi yang sudah jadi ini)", en: "Follow-up Prompt (edit this finished simulation)" },
  "lab.editfollowup.placeholder": { id: "misal: tambahkan tampilan nilai kecepatan secara real-time, atau ubah warna latar jadi gelap", en: "e.g. add a real-time velocity readout, or change the background to a dark color" },
  "lab.editfollowup.btn": { id: "Edit Simulasi Ini", en: "Edit This Simulation" },
  "lab.editfollowup.remaining": { id: "Sisa edit lanjutan: {{n}}/{{max}}", en: "Follow-up edits left: {{n}}/{{max}}" },
  "lab.editfollowup.limitreached": { id: "Batas {{max}}x edit lanjutan untuk simulasi ini sudah tercapai - tekan Generate untuk membuat versi baru.", en: "You've reached the {{max}}x follow-up edit limit for this simulation - press Generate to create a new version." },
  "lab.editfollowup.needsim": { id: "Belum ada simulasi untuk diedit - tekan Generate atau Coba Mode Demo dulu.", en: "There's no simulation to edit yet - press Generate or Try Demo Mode first." },
  "lab.editfollowup.needinstruction": { id: "Tulis dulu instruksi editnya, misalnya bagian apa yang ingin diubah/ditambah.", en: "Write your edit instruction first, e.g. what part you want to change or add." },
  "lab.editfollowup.needkey": { id: "Edit lanjutan butuh AI sungguhan, jadi perlu API key Gemini pribadi. <button type=\"button\" class=\"link-btn\" id=\"edit-followup-key-btn\">Atur API key sekarang</button>.", en: "Follow-up edits need real AI, so a personal Gemini API key is required. <button type=\"button\" class=\"link-btn\" id=\"edit-followup-key-btn\">Set your API key now</button>." },
  "lab.editfollowup.needbackend": { id: "Backend belum dikonfigurasi (lihat README.md bagian setup). Hubungi pengelola situs.", en: "Backend isn't configured yet (see the setup section of README.md). Contact the site admin." },
  "lab.editfollowup.loading": { id: "Menerapkan edit ke-{{n}} dari {{max}}, mohon tunggu (biasanya 10-30 detik, kadang lebih lama kalau server Gemini sedang sibuk)...", en: "Applying edit {{n}} of {{max}}, please wait (usually 10-30 seconds, sometimes longer if Gemini's servers are busy)..." },
  "lab.editfollowup.success": { id: "Edit berhasil diterapkan pada simulasi.", en: "Edit applied to the simulation successfully." },
  "lab.editfollowup.retryhint": { id: " Coba edit lagi dengan instruksi yang lebih sederhana.", en: " Try editing again with a simpler instruction." },
  "lab.editfollowup.failed": { id: "Gagal menerapkan edit: ", en: "Failed to apply edit: " },
  "lab.editfollowup.failedsuffix": { id: " - coba lagi.", en: " - try again." },

  "check.htmltooshort": { id: "Hasil AI kosong atau terlalu pendek untuk jadi simulasi utuh.", en: "The AI result is empty or too short to be a complete simulation." },
  "check.htmltruncated": { id: "Kode HTML sepertinya terpotong (tidak diakhiri tag </html>).", en: "The HTML code looks truncated (doesn't end with a </html> tag)." },
  "check.noscript": { id: "Kode tidak mengandung <script> sama sekali, jadi animasi/perhitungan tidak akan berjalan.", en: "The code has no <script> tag at all, so animations/calculations won't run." },
  "check.unbalancedbraces": { id: "Kode JavaScript sepertinya tidak lengkap/rusak (kurung kurawal { } tidak seimbang), kemungkinan animasi atau perhitungan tidak akan berjalan.", en: "The JavaScript code looks incomplete/broken (unbalanced { } braces), so animations or calculations may not run." },

  "content.comingsoon": { id: "Konten {{section}} untuk topik ini belum diisi. Strukturnya sudah siap di <code>js/content.js</code>, tinggal ditambahkan mengikuti contoh topik <strong>Kinematics</strong>. Sementara itu, tab <strong>Lab Simulasi Virtual</strong> tetap bisa dicoba untuk topik ini.", en: "The {{section}} content for this topic isn't filled in yet. The structure is ready in <code>js/content.js</code>, just needs adding following the <strong>Kinematics</strong> topic example. Meanwhile, the <strong>Virtual Simulation Lab</strong> tab can still be tried for this topic." },
  "content.section.materi": { id: "materi belajar", en: "learning material" },
  "content.section.eksperimen": { id: "eksperimen", en: "experiment" },
  "content.section.latihan": { id: "latihan soal", en: "practice question" },

  "answer.correct": { id: "(jawaban benar)", en: "(correct answer)" },
  "question.label": { id: "Soal {{n}}", en: "Question {{n}}" },
  "question.solution": { id: "Pembahasan:", en: "Solution:" },
  "question.reveal": { id: "Lihat Pembahasan", en: "Show Solution" },

  /* ---------------- Chatbot / Tutor Fisika ---------------- */
  "chatbot.toggle.label": { id: "Tutor Fisika", en: "Physics Tutor" },
  "chatbot.toggle.title": { id: "Tanya Tutor Fisika", en: "Ask the Physics Tutor" },
  "chatbot.head.title": { id: "Tutor Fisika", en: "Physics Tutor" },
  "chatbot.topiclabel.default": { id: "Pilih topik dulu supaya tutor tahu konteksnya.", en: "Pick a topic first so the tutor knows the context." },
  "chatbot.topiclabel.context": { id: "Konteks: {{title}}", en: "Context: {{title}}" },
  "chatbot.topiclabel.nocontext": { id: "Belum ada bahan khusus untuk topik ini - tutor menjawab secara umum.", en: "No specific material for this topic yet - the tutor will answer generally." },
  "chatbot.close.aria": { id: "Tutup", en: "Close" },
  "chatbot.disclaimer": { id: "Ceritakan pemahamanmu, tutor akan lebih sering balik bertanya dan menanggapi jawabanmu daripada langsung memberi jawaban jadi, supaya kamu yang berpikir duluan.", en: "Describe your understanding - the tutor will often ask follow-up questions and respond to your answers rather than just giving you the answer, so you do the thinking first." },
  "chatbot.input.placeholder": { id: "Tulis pertanyaan atau istilah fisika...", en: "Type a question or physics term..." },
  "chatbot.send": { id: "Kirim", en: "Send" },
  "chatbot.generaltopic": { id: "Fisika Umum", en: "General Physics" },
  "chatbot.nudgeforkey": { id: "Supaya aku bisa menanggapi jawabanmu secara lebih natural dan spesifik, masukkan API key Gemini gratis milikmu lewat tombol Pengaturan di header. Untuk sekarang aku bantu pakai catatan topik ini dulu.", en: "So I can respond to your answers more naturally and specifically, enter your free Gemini API key via the Settings button in the header. For now I'll help using the notes for this topic." },
  "chatbot.typing": { id: "mengetik…", en: "typing…" },
  "chatbot.emptyreply": { id: "Maaf, aku tidak bisa merespons barusan. Coba kirim lagi.", en: "Sorry, I couldn't respond just now. Try sending again." },
  "chatbot.connectionerror": { id: "Gagal terhubung ke tutor barusan ({{err}}). Coba kirim lagi.", en: "Couldn't connect to the tutor just now ({{err}}). Try sending again." },
  "chatbot.fallback.nomatch": { id: "Coba ceritakan lebih spesifik, atau sebutkan istilah fisikanya langsung supaya aku bisa bantu.", en: "Try describing it more specifically, or name the physics term directly so I can help." },

  /* ---------------- Settings modal ---------------- */
  "settings.title": { id: "Pengaturan", en: "Settings" },
  "settings.apikeylabel": { id: "API key Gemini pribadimu", en: "Your personal Gemini API key" },
  "settings.apikeynote": { id: "Tersimpan di browser ini saja, dikirim langsung ke Google setiap kali kamu menekan Generate. Belum punya key? <a href=\"https://aistudio.google.com/apikey\" target=\"_blank\" rel=\"noopener\">Buat gratis di Google AI Studio</a>.", en: "Stored only in this browser, sent directly to Google every time you press Generate. Don't have a key yet? <a href=\"https://aistudio.google.com/apikey\" target=\"_blank\" rel=\"noopener\">Get one free at Google AI Studio</a>." },
  "settings.unlock.summary": { id: "Kode Eksplorasi Bebas (dari guru)", en: "Free Exploration Code (from teacher)" },
  "settings.unlock.desc": { id: "Kamu boleh mulai dari topik mana saja, tapi di dalam tiap topik, tab (Materi -> Eksperimen -> Latihan Soal -> Lab Simulasi) tetap dibuka bertahap mengikuti urutan belajar. Punya kode khusus dari guru untuk menjelajah bebas tanpa urutan (mis. eksplorasi mandiri di rumah)? Masukkan di sini.", en: "You can start from any topic, but within each topic the tabs (Material -> Experiments -> Practice Questions -> Simulation Lab) still unlock in learning order. Have a special code from your teacher to explore freely without that order (e.g. independent study at home)? Enter it here." },
  "settings.unlock.placeholder": { id: "Masukkan kode dari guru", en: "Enter the code from your teacher" },
  "settings.unlock.btn": { id: "Buka Kunci", en: "Unlock" },
  "settings.unlock.on": { id: "Aktif - semua topik & tab sudah terbuka bebas di perangkat ini.", en: "Active - all topics & tabs are freely unlocked on this device." },
  "settings.unlock.off": { id: "Belum aktif - topik & tab masih terbuka bertahap.", en: "Not active - topics & tabs still unlock in order." },
  "settings.unlock.success": { id: "Semua topik dan tab sudah terbuka!", en: "All topics and tabs are now unlocked!" },
  "settings.unlock.wrong": { id: "Kode salah. Tanyakan kode Eksplorasi Bebas ke gurumu.", en: "Wrong code. Ask your teacher for the Free Exploration Code." },

  "settings.classsession.summary": { id: "Sesi Kelas (dari guru)", en: "Class Session (from teacher)" },
  "settings.classsession.desc": { id: "Kalau gurumu sedang menjalankan sesi kelas langsung, semua siswa yang gabung akan mengerjakan aktivitas yang sama secara bersamaan. Masukkan kode yang dibagikan guru untuk gabung.", en: "If your teacher is running a live class session, every student who joins works on the same activity at the same time. Enter the code your teacher shared to join." },
  "settings.classsession.placeholder": { id: "Kode sesi dari guru", en: "Session code from your teacher" },
  "settings.classsession.leave": { id: "Keluar dari Sesi", en: "Leave Session" },
  "settings.classsession.joined": { id: "Tergabung dalam sesi kelas - navigasi mengikuti aktivitas yang ditentukan guru.", en: "Joined a class session - navigation follows the activity your teacher set." },
  "settings.classsession.notjoined": { id: "Belum gabung sesi kelas manapun.", en: "Not joined to any class session yet." },
  "settings.classsession.left": { id: "Sesi kelas sudah berakhir - kamu kembali ke mode belajar mandiri.", en: "The class session has ended - you're back to independent study mode." },

  "settings.studentinfo.summary": { id: "Data Diri (Siswa)", en: "Your Details (Student)" },
  "settings.studentinfo.savebtn": { id: "Simpan Data Diri", en: "Save Details" },
  "settings.studentinfo.saved": { id: "Data diri tersimpan.", en: "Your details have been saved." },

  "settings.resetonboarding": { id: "Ulangi proses awal (ganti peran siswa/bukan siswa)", en: "Restart onboarding (change student/non-student role)" },
  "settings.save": { id: "Simpan", en: "Save" },
  "settings.close": { id: "Tutup", en: "Close" },

  /* ---------------- Teacher panel (teacher.html) ---------------- */
  "teacher.login.title": { id: "Masuk Panel Guru", en: "Teacher Panel Login" },
  "teacher.login.desc": { id: "Masukkan Kode Kontrol Guru (diatur di <code>apps-script/Code.gs</code>, <code>TEACHER_CONTROL_CODE</code>).", en: "Enter the Teacher Control Code (set in <code>apps-script/Code.gs</code>, <code>TEACHER_CONTROL_CODE</code>)." },
  "teacher.backendurl.label": { id: "URL Backend (Apps Script Web App)", en: "Backend URL (Apps Script Web App)" },
  "teacher.controlcode.label": { id: "Kode Kontrol Guru", en: "Teacher Control Code" },
  "teacher.controlcode.placeholder": { id: "Kode kontrol guru", en: "Teacher control code" },
  "teacher.login.btn": { id: "Masuk", en: "Log In" },
  "teacher.session.title": { id: "Sesi Kelas", en: "Class Session" },
  "teacher.session.desc": { id: "Tentukan satu aktivitas yang wajib dikerjakan bareng semua siswa yang gabung. Siswa gabung lewat tombol Pengaturan di situs utama, masukkan kode di bawah.", en: "Set one activity that every joined student must work on together. Students join via the Settings button on the main site, entering the code below." },
  "teacher.topic.label": { id: "Topik", en: "Topic" },
  "teacher.tab.label": { id: "Tab", en: "Tab" },
  "teacher.startsession.btn": { id: "Mulai Sesi Baru", en: "Start New Session" },
  "teacher.sharecode.desc": { id: "Kode untuk dibagikan ke siswa (tulis di papan tulis / sebutkan):", en: "Code to share with students (write on the board / say it aloud):" },
  "teacher.activetopic.label": { id: "Topik aktif sekarang", en: "Currently active topic" },
  "teacher.activetab.label": { id: "Tab aktif sekarang", en: "Currently active tab" },
  "teacher.applychanges.btn": { id: "Terapkan Perubahan", en: "Apply Changes" },
  "teacher.endsession.btn": { id: "Akhiri Sesi", en: "End Session" },
  "teacher.progress.title": { id: "Progres Siswa (real-time)", en: "Student Progress (real-time)" },
  "teacher.progress.desc": { id: "Diperbarui otomatis tiap ~8 detik. ID siswa bersifat anonim (tanpa nama), digenerate otomatis per perangkat.", en: "Automatically refreshed every ~8 seconds. Student IDs are anonymous (no names), auto-generated per device." },
  "teacher.th.studentid": { id: "ID Siswa", en: "Student ID" },
  "teacher.th.activity": { id: "Aktivitas sekarang", en: "Current activity" },
  "teacher.th.lastreport": { id: "Terakhir lapor", en: "Last reported" },
  "teacher.roster.empty": { id: "Belum ada siswa yang gabung.", en: "No students have joined yet." },

  /* ---------------- Sesi kelas & lain-lain (dinamis app.js) ---------------- */
  "nav.sessiondot.title": { id: "Aktivitas kelas sekarang", en: "Current class activity" },
  "classsession.bannertext": { id: "Sesi kelas aktif - guru meminta semua mengerjakan: {{topic}} - {{tab}} sekarang.", en: "Class session active - your teacher wants everyone working on: {{topic}} - {{tab}} now." },
  "backend.notconfigured.short": { id: "Backend belum dikonfigurasi. Hubungi pengelola situs.", en: "Backend isn't configured yet. Contact the site admin." },
  "classsession.wrongcode": { id: "Kode salah, atau sesi belum/sudah tidak aktif. Tanyakan gurumu.", en: "Wrong code, or the session isn't active anymore. Ask your teacher." },
  "classsession.connectfailed": { id: "Gagal terhubung ke server: {{err}}", en: "Couldn't connect to the server: {{err}}" },

  /* ---------------- Generator prompt AI (Lab Simulasi Virtual) ---------------- */
  "promptgen.header": { id: "Buatlah SATU file HTML lengkap dan mandiri (HTML, CSS, dan JavaScript semuanya inline dalam satu file, TANPA dependensi/CDN eksternal) yang berisi simulasi fisika interaktif tentang topik \"{{topic}}\", khususnya konsep: {{concept}}.\n\n", en: "Create ONE complete, self-contained HTML file (HTML, CSS, and JavaScript all inline in a single file, with NO external dependencies/CDNs) containing an interactive physics simulation about the topic \"{{topic}}\", specifically the concept: {{concept}}.\n\n" },
  "promptgen.langdirective": { id: "Tulis SEMUA teks yang tampil di layar (label, judul, satuan, tombol, penjelasan) dalam Bahasa Indonesia.\n\n", en: "Write ALL on-screen text (labels, titles, units, buttons, explanations) in English.\n\n" },
  "promptgen.mainfocus": { id: "PENTING: konsep fisika di atas (\"{{concept}}\") adalah topik UTAMA dan SATU-SATUNYA untuk simulasi ini. Semua kontrol, animasi, grafik, dan penjelasan di dalam simulasi harus tentang konsep ini saja.\n\n", en: "IMPORTANT: the physics concept above (\"{{concept}}\") is the ONE AND ONLY main topic for this simulation. All controls, animations, graphs, and explanations inside the simulation must be about this concept only.\n\n" },
  "promptgen.vistype": { id: "Jenis visualisasi yang diinginkan: {{vistype}}.\n\n", en: "Desired visualization type: {{vistype}}.\n\n" },
  "promptgen.variables": { id: "Sediakan kontrol interaktif (slider/input angka) agar siswa bisa mengubah variabel berikut: {{variables}}. Tampilkan juga nilai numerik dan/atau grafik yang relevan secara real-time saat variabel diubah.\n\n", en: "Provide interactive controls (sliders/number inputs) so students can change the following variables: {{variables}}. Also show relevant numeric values and/or graphs updating in real time as the variables change.\n\n" },
  "promptgen.goal": { id: "Tujuan pembelajaran simulasi ini (catatan tambahan dari guru/siswa, TETAP harus konsisten dengan konsep utama \"{{concept}}\" di atas, jika ada bagian yang tampak membahas konsep fisika lain, abaikan bagian itu): {{goal}}.\n\n", en: "Learning objective for this simulation (extra note from teacher/student, MUST still stay consistent with the main concept \"{{concept}}\" above - if any part seems to discuss a different physics concept, ignore that part): {{goal}}.\n\n" },
  "promptgen.level": { id: "Tingkat kompleksitas tampilan: {{level}}.\n\n", en: "Display complexity level: {{level}}.\n\n" },
  "promptgen.footer": { id: "Gunakan satuan SI dan rumus fisika yang akurat sesuai kurikulum Cambridge International AS & A Level Physics (9702). Tuliskan kode yang rapi dan diberi komentar singkat agar mudah dipahami siswa yang juga sedang belajar coding.\n", en: "Use SI units and physics formulas accurate to the Cambridge International AS & A Level Physics (9702) curriculum. Write clean code with brief comments so it's easy to follow for students who are also learning to code.\n" },
  "promptgen.extra": { id: "\nInstruksi tambahan: {{extra}}\n", en: "\nAdditional instructions: {{extra}}\n" },
  "promptgen.formularef": { id: "\nReferensi rumus & konsep topik ini yang WAJIB dipakai (jangan memakai rumus lain yang bertentangan dengan ini):\n{{sheet}}\n", en: "\nReference formulas & concepts for this topic that MUST be used (do not use other formulas that contradict these):\n{{sheet}}\n" },
  "promptgen.editheader": { id: "Berikut kode HTML simulasi fisika yang SUDAH ADA (satu file lengkap, mandiri):\n\n{{html}}\n\n---\nTolong EDIT/REVISI kode di atas sesuai instruksi berikut. Pertahankan bagian yang tidak diminta berubah dan tetap tentang konsep fisika yang sama. Kembalikan HANYA satu file HTML LENGKAP hasil revisi (bukan potongan - sertakan seluruh <!DOCTYPE html> sampai </html>), tanpa penjelasan tambahan di luar kode, tanpa code fence markdown. {{langdirective}}\nInstruksi edit dari siswa: {{instruction}}", en: "Here is the EXISTING physics simulation HTML code (one complete, self-contained file):\n\n{{html}}\n\n---\nPlease EDIT/REVISE the code above according to the instruction below. Keep any part not asked to change, and keep it about the same physics concept. Return ONLY one COMPLETE revised HTML file (not a fragment - include everything from <!DOCTYPE html> to </html>), with no extra explanation outside the code, no markdown code fence. {{langdirective}}\nStudent's edit instruction: {{instruction}}" },
  "promptgen.editlangdirective": { id: "Jika kamu menambah/mengubah teks yang tampil di layar, tulis dalam Bahasa Indonesia (sesuai bahasa simulasi ini sebelumnya).", en: "If you add/change any on-screen text, write it in English (matching this simulation's existing language)." },

  /* ---------------- Teacher panel dinamis (teacher.js) ---------------- */
  "teacher.backend.missing": { id: "URL Backend belum diisi. Isi dulu di form login di atas (URL Apps Script Web App yang sama dengan situs utama).", en: "Backend URL isn't filled in. Fill it in the login form above first (the same Apps Script Web App URL as the main site)." },
  "teacher.backend.connectfailed": { id: "Gagal terhubung ke backend: {{err}}", en: "Couldn't connect to the backend: {{err}}" },
  "time.justnow": { id: "baru saja", en: "just now" },
  "time.secondsago": { id: "{{n}} detik lalu", en: "{{n}} seconds ago" },
  "time.minutesago": { id: "{{n}} menit lalu", en: "{{n}} minutes ago" },
  "time.hoursago": { id: "{{n}} jam lalu", en: "{{n}} hours ago" },
  "teacher.session.active": { id: "Sesi aktif - aktivitas sekarang: {{topic}} - {{tab}}.", en: "Session active - current activity: {{topic}} - {{tab}}." },
  "teacher.session.none": { id: "Belum ada sesi aktif.", en: "No active session yet." },
  "teacher.roster.count": { id: "{{total}} siswa tercatat - {{online}} online sekarang.", en: "{{total}} students recorded - {{online}} online now." },
  "teacher.login.needcode": { id: "Isi kode kontrol guru dulu.", en: "Enter the teacher control code first." },
  "teacher.login.checking": { id: "Memeriksa...", en: "Checking..." },
  "teacher.session.starting": { id: "Memulai sesi...", en: "Starting session..." },
  "teacher.session.applying": { id: "Menerapkan...", en: "Applying..." },
  "teacher.session.ending": { id: "Mengakhiri sesi...", en: "Ending session..." },

  /* ---------------- Tahap PjBL (subjudul di atas tiap panel tab) ---------------- */
  "pjbl.stage.materi": { id: "Tahap PjBL: Penentuan Pertanyaan Mendasar &amp; Perencanaan Proyek", en: "PjBL Stage: Essential Question &amp; Project Planning" },
  "pjbl.stage.eksperimen": { id: "Tahap PjBL: Mendesain Perencanaan Proyek, Menyusun Jadwal, &amp; Memonitor Kemajuan (perlu konfirmasi guru)", en: "PjBL Stage: Designing the Project Plan, Scheduling, &amp; Monitoring Progress (needs teacher confirmation)" },
  "pjbl.stage.latihan": { id: "Tahap PjBL: Penguatan Konsep (checkpoint formatif mandiri)", en: "PjBL Stage: Concept Reinforcement (self-checked formative checkpoint)" },
  "pjbl.stage.lab": { id: "Tahap PjBL: Menguji Hasil &amp; Mengevaluasi Pengalaman (perlu konfirmasi guru untuk menandai topik selesai)", en: "PjBL Stage: Testing the Outcome &amp; Evaluating the Experience (needs teacher confirmation to mark the topic complete)" },

  /* ---------------- Modal konfirmasi pemahaman (generik) ---------------- */
  "confirm.checkbtn": { id: "Periksa Jawaban", en: "Check Answers" },
  "confirm.pickanswer": { id: "Pilih salah satu jawaban dulu.", en: "Please pick an answer first." },
  "confirm.correct": { id: "Benar!", en: "Correct!" },
  "confirm.wrong": { id: "Kurang tepat, coba lagi.", en: "Not quite, try again." },
  "confirm.tryagain": { id: "Masih ada jawaban yang kurang tepat - lihat penjelasan di tiap soal, lalu coba lagi.", en: "Some answers aren't quite right yet - check the explanation on each question, then try again." },
  "confirm.generic.label": { id: "Saya sudah membaca/mengerjakan bagian ini dan siap melanjutkan.", en: "I have read/completed this section and I'm ready to continue." },
  "confirm.generic.needcheck": { id: "Centang dulu kotak konfirmasi di atas.", en: "Please check the confirmation box above first." },
  "confirm.scorepass": { id: "Lulus! Skor kamu {{score}}%.", en: "Passed! Your score: {{score}}%." },
  "confirm.scorefail": { id: "Skor kamu {{score}}% ({{correct}}/{{total}} benar) - belum mencapai minimum {{min}}%. Tutup jendela ini, pelajari kembali Materi Belajar di atas, lalu klik tombol Next lagi untuk mencoba ulang.", en: "Your score: {{score}}% ({{correct}}/{{total}} correct) - below the {{min}}% minimum needed. Close this window, review the Learning Material above, then click Next again to retry." },

  /* ---------------- Gate Materi (self-check, tanpa guru) ---------------- */
  "gate.materi.title": { id: "Konfirmasi Pemahaman: Materi", en: "Understanding Check: Learning Material" },
  "gate.materi.desc": { id: "Jawab kelima pertanyaan berikut. Kamu perlu skor minimal 80% untuk membuka tab Eksperimen - kalau belum, pelajari kembali Materi Belajar dulu lalu coba lagi.", en: "Answer the five questions below. You need a minimum score of 80% to unlock the Experiment tab - if not, review the Learning Material again first, then retry." },
  "gate.materi.fallback": { id: "Saya sudah membaca dan memahami materi topik ini.", en: "I have read and understood this topic's material." },

  /* ---------------- Gate Eksperimen (self-check + konfirmasi guru) ---------------- */
  "gate.eksperimen.title": { id: "Konfirmasi Pemahaman: Eksperimen", en: "Understanding Check: Experiment" },
  "gate.eksperimen.desc": { id: "Jawab pertanyaan tentang hubungan antar-variabel &amp; pengelolaan data pada eksperimen ini. Kalau semua benar, permintaanmu dikirim ke guru untuk dikonfirmasi sebelum Latihan Soal dan Lab Simulasi Virtual terbuka.", en: "Answer these questions about the relationship between variables and data handling in this experiment. If all correct, your request is sent to your teacher for confirmation before Practice Questions and the Virtual Simulation Lab unlock." },
  "gate.eksperimen.fallback": { id: "Saya sudah menyelesaikan eksperimen ini dan siap dikonfirmasi guru.", en: "I have completed this experiment and I'm ready for teacher confirmation." },
  "gate.eksperimen.submitbtn": { id: "Periksa &amp; Kirim ke Guru", en: "Check &amp; Send to Teacher" },
  "gate.eksperimen.autosummary": { id: "Siswa menjawab benar semua pertanyaan konfirmasi Eksperimen.", en: "Student answered all Experiment confirmation questions correctly." },

  /* ---------------- Gate Lab Simulasi (refleksi + konfirmasi guru) ---------------- */
  "lab.reflection.title": { id: "Refleksi &amp; Validasi Simulasi (untuk konfirmasi guru)", en: "Reflection &amp; Simulation Validation (for teacher confirmation)" },
  "lab.reflection.desc": { id: "Sebelum topik ini ditandai selesai, jelaskan singkat apakah simulasi yang kamu hasilkan sudah sesuai hukum/konsep fisika topik ini dan bagaimana kamu mengeceknya (misalnya coba nilai ekstrem/nol pada variabelnya).", en: "Before this topic is marked complete, briefly explain whether the simulation you produced matches this topic's physics laws/concepts and how you checked it (e.g. trying extreme/zero values for its variables)." },
  "lab.reflection.placeholder": { id: "misal: saya coba set arus = 0, gaya pada simulasi juga otomatis jadi 0, sesuai rumus F = BIL...", en: "e.g. I tried setting current = 0, and the force in the simulation also became 0, matching F = BIL..." },
  "lab.reflection.submitbtn": { id: "Kirim untuk Konfirmasi Guru", en: "Send for Teacher Confirmation" },
  "gate.lab.reflection.tooShort": { id: "Tulis refleksi yang sedikit lebih lengkap dulu (minimal beberapa kalimat).", en: "Please write a slightly more complete reflection first (at least a couple of sentences)." },

  /* ---------------- Notifikasi & banner status gate (siswa) ---------------- */
  "gate.submitted.toast": { id: "Terkirim! Menunggu konfirmasi guru.", en: "Sent! Waiting for teacher confirmation." },
  "gate.eksperimen.approved.toast": { id: "Guru sudah mengonfirmasi Eksperimen-mu! Latihan Soal &amp; Lab Simulasi kini terbuka.", en: "Your teacher confirmed your Experiment! Practice Questions &amp; the Simulation Lab are now unlocked." },
  "gate.lab.approved.toast": { id: "Guru sudah mengonfirmasi simulasimu - topik ini ditandai selesai!", en: "Your teacher confirmed your simulation - this topic is now marked complete!" },
  "gate.eksperimen.rejected.toast": { id: "Guru meminta kamu memperbaiki/mengulang bagian Eksperimen. Lihat catatan guru di bawah.", en: "Your teacher asked you to redo/fix the Experiment part. See the teacher's note below." },
  "gate.lab.rejected.toast": { id: "Guru meminta kamu memperbaiki simulasi/refleksimu. Lihat catatan guru di bawah.", en: "Your teacher asked you to improve your simulation/reflection. See the teacher's note below." },
  "gate.banner.pending.eksperimen": { id: "Menunggu konfirmasi guru untuk bagian Eksperimen...", en: "Waiting for teacher confirmation on the Experiment part..." },
  "gate.banner.pending.lab": { id: "Menunggu konfirmasi guru untuk refleksi &amp; simulasi ini...", en: "Waiting for teacher confirmation on this reflection &amp; simulation..." },
  "gate.banner.approved.eksperimen": { id: "Dikonfirmasi guru - Latihan Soal &amp; Lab Simulasi Virtual terbuka.", en: "Confirmed by teacher - Practice Questions &amp; Virtual Simulation Lab are unlocked." },
  "gate.banner.approved.lab": { id: "Dikonfirmasi guru - topik ini selesai.", en: "Confirmed by teacher - this topic is complete." },
  "gate.banner.rejected.eksperimen": { id: "Guru meminta bagian Eksperimen diperbaiki/diulang.", en: "Teacher asked for the Experiment part to be redone/fixed." },
  "gate.banner.rejected.lab": { id: "Guru meminta simulasi/refleksi ini diperbaiki.", en: "Teacher asked for this simulation/reflection to be improved." },
  "gate.banner.notefromteacher": { id: "Catatan guru", en: "Teacher's note" },
  "gate.banner.retrybtn": { id: "Coba Lagi", en: "Try Again" },

  /* ---------------- Panel Guru: Konfirmasi Menunggu ---------------- */
  "teacher.gate.title": { id: "Konfirmasi Menunggu", en: "Pending Confirmations" },
  "teacher.gate.desc": { id: "Siswa yang sudah menjawab benar pertanyaan konfirmasi Eksperimen, atau mengirim refleksi Lab Simulasi, muncul di sini menunggu keputusanmu. Diperbarui otomatis bersamaan dengan Progres Siswa (~8 detik).", en: "Students who answered the Experiment confirmation questions correctly, or submitted a Simulation Lab reflection, appear here waiting for your decision. Updates automatically together with Student Progress (~8s)." },
  "teacher.gate.empty": { id: "Tidak ada yang menunggu konfirmasi saat ini.", en: "No one is waiting for confirmation right now." },
  "teacher.gate.stage.eksperimen": { id: "Eksperimen", en: "Experiment" },
  "teacher.gate.stage.lab": { id: "Lab Simulasi", en: "Simulation Lab" },
  "teacher.gate.approve.btn": { id: "Setujui", en: "Approve" },
  "teacher.gate.reject.btn": { id: "Tolak", en: "Reject" },
  "teacher.gate.reject.prompt": { id: "Catatan untuk siswa (opsional, kosongkan kalau tidak perlu):", en: "Note for the student (optional, leave blank if not needed):" },
  "teacher.gate.deciding": { id: "Menyimpan keputusan...", en: "Saving decision..." },
  "teacher.gate.th.student": { id: "Siswa", en: "Student" },
  "teacher.gate.th.topic": { id: "Topik", en: "Topic" },
  "teacher.gate.th.stage": { id: "Tahap", en: "Stage" },
  "teacher.gate.th.summary": { id: "Ringkasan/Refleksi Siswa", en: "Student Summary/Reflection" },
  "teacher.gate.th.submitted": { id: "Dikirim", en: "Submitted" },
  "teacher.gate.th.action": { id: "Aksi", en: "Action" },

  /* ---------------- Tabel Data Eksperimen (interaktif) ---------------- */
  "eksdata.title": { id: "Input Data Pengamatanmu", en: "Enter Your Observation Data" },
  "eksdata.desc": { id: "Isi tabel di bawah dengan data hasil percobaanmu sendiri (bukan contoh di atas), lalu klik \"Simpan Data\" - datamu tersimpan otomatis dan diperiksa AI untuk kemungkinan kesalahan pencatatan.", en: "Fill in the table below with your own experiment data (not the example above), then click \"Save Data\" - your data is saved automatically and checked by AI for possible recording errors." },
  "eksdata.savebtn": { id: "Simpan Data", en: "Save Data" },
  "eksdata.empty": { id: "Isi minimal satu baris data dulu sebelum menyimpan.", en: "Fill in at least one row of data before saving." },
  "eksdata.saving": { id: "Menyimpan & memeriksa data...", en: "Saving & checking data..." },
  "eksdata.saved": { id: "Data tersimpan.", en: "Data saved." },
  "eksdata.sheeterror": { id: "AI sudah memeriksa datamu, tapi ada masalah saat menyimpan ke spreadsheet (coba lagi sebentar lagi).", en: "AI has checked your data, but there was a problem saving it to the spreadsheet (try again shortly)." },
  "eksdata.nobackend": { id: "Backend belum dikonfigurasi, data tidak bisa disimpan. Hubungi guru/pengelola situs.", en: "Backend isn't configured yet, data can't be saved. Contact your teacher/site admin." },
  "eksdata.networkerror": { id: "Gagal terhubung ke server, periksa koneksi internetmu dan coba lagi.", en: "Couldn't connect to the server, check your internet connection and try again." },
  "toast.eksdata.required": { id: "Isi & simpan dulu tabel data pengamatan di atas sebelum melanjutkan.", en: "Fill in & save the observation data table above before continuing." },

  /* ---------------- Praktikum Virtual (tab Lab Simulasi Virtual, tanpa alat) ---------------- */
  "vlab.badgelabel": { id: "Eksperimen Tambahan - Tanpa Alat Lab", en: "Additional Experiment - No Lab Equipment Needed" },
  "vlab.apparatus.length": { id: "Panjang magnet virtual (diberikan)", en: "Virtual magnet length (given)" },
  "vlab.current.label": { id: "2b. Atur arus (I)", en: "2b. Set current (I)" },
  "vlab.readbtn": { id: "Baca Neraca", en: "Read Balance" },
  "vlab.reading.result": { id: "Pembacaan neraca: {{grams}} g. Nilai ini otomatis masuk ke tabel.", en: "Balance reading: {{grams}} g. This value was placed into the table automatically." },
  "vlab.rowfull": { id: "Baris untuk arus ini sudah terisi 3 data. Pilih nilai arus lain pada menu di atas.", en: "This current's row already has 3 readings. Pick a different current value above." },
  "vlab.hypothesis.label": { id: "2a. Pertanyaan investigasi & prediksi bentuk grafik F-I (dan alasanmu)", en: "2a. Investigation question & prediction of the F-I graph shape (and your reasoning)" },
  "vlab.hypothesis.placeholder": { id: "misal: saya memprediksi grafik F terhadap I berbentuk garis lurus melalui titik asal, karena F = BIL artinya F sebanding lurus dengan I...", en: "e.g. I predict the graph of F against I is a straight line through the origin, because F = BIL means F is directly proportional to I..." },
  "vlab.gradient.label": { id: "2c. Gradien grafik F-I hasil perhitunganmu (T·m)", en: "2c. F-I graph gradient from your own calculation (T·m)" },
  "vlab.bvalue.label": { id: "2c. Nilai B hasil perhitunganmu (T) = gradien ÷ L", en: "2c. Your calculated value of B (T) = gradient ÷ L" },
  "vlab.checkbtn": { id: "Cek dengan Perhitungan Otomatis", en: "Check with Automatic Calculation" },
  "vlab.checkneeddata": { id: "Isi minimal 3 baris data pada tabel dulu sebelum mengecek.", en: "Fill in at least 3 rows of table data before checking." },
  "vlab.checkresult": { id: "Perhitungan otomatis dari data tabelmu: gradien ≈ {{grad}} T·m, sehingga B ≈ {{b}} T. Bandingkan dengan hasil perhitungan manualmu di atas.", en: "Automatic calculation from your table data: gradient ≈ {{grad}} T·m, so B ≈ {{b}} T. Compare this with your manual calculation above." },
  "vlab.conclusion.label": { id: "2c. Kesimpulan dan sumber kesalahan", en: "2c. Conclusion and sources of error" },
  "vlab.savebtn": { id: "Simpan Data (lokal di browser ini)", en: "Save Data (local to this browser)" },
  "vlab.saved": { id: "Tersimpan di browser ini. Data ini TIDAK dikirim ke server mana pun.", en: "Saved to this browser. This data is NOT sent to any server." },
  "vlab.empty": { id: "Isi prediksi (2a) dan minimal satu baris data tabel dulu sebelum menyimpan.", en: "Fill in your prediction (2a) and at least one row of table data before saving." },
  "vlab.graph.axis.i": { id: "I (A)", en: "I (A)" },
  "vlab.graph.axis.f": { id: "F (N)", en: "F (N)" },

  /* ---------------- Kuis Topik (Panel Guru + siswa) ---------------- */
  "quiz.section.title": { id: "Kuis Topik", en: "Topic Quiz" },
  "quiz.section.desc": { id: "Kelola bank soal per topik (pilihan ganda, jawaban singkat, atau esai), lalu publikasikan ke sesi kelas yang sedang aktif supaya siswa bisa menjawabnya langsung di situs.", en: "Manage a per-topic question bank (multiple choice, short answer, or essay), then publish it to the currently active class session so students can answer it directly on the site." },
  "quiz.topic.label": { id: "Topik Kuis", en: "Quiz Topic" },
  "quiz.apikey.label": { id: "API key Gemini (untuk Generate Otomatis)", en: "Gemini API key (for Auto-Generate)" },
  "quiz.apikey.note": { id: "Hanya dipakai untuk membuat soal otomatis lewat AI, tersimpan di browser ini saja. Kosongkan kalau kamu hanya menulis soal manual.", en: "Only used to auto-generate questions via AI, stored in this browser only. Leave blank if you're only writing questions manually." },
  "quiz.generate.count.label": { id: "Jumlah soal (maks 10)", en: "Number of questions (max 10)" },
  "quiz.generate.type.label": { id: "Tipe soal", en: "Question type" },
  "quiz.type.mcq": { id: "Pilihan Ganda (MCQ)", en: "Multiple Choice (MCQ)" },
  "quiz.type.short": { id: "Jawaban Singkat", en: "Short Answer" },
  "quiz.type.essay": { id: "Esai / Uraian", en: "Essay" },
  "quiz.type.mixed": { id: "Campuran", en: "Mixed" },
  "quiz.generate.btn": { id: "Generate Otomatis (AI)", en: "Auto-Generate (AI)" },
  "quiz.generate.generating": { id: "AI sedang membuat soal...", en: "AI is generating questions..." },
  "quiz.generate.needapikey": { id: "Isi API key Gemini dulu di atas untuk memakai Generate Otomatis.", en: "Fill in a Gemini API key above first to use Auto-Generate." },
  "quiz.generate.success": { id: "{{n}} soal baru ditambahkan ke bank (belum tersimpan permanen - klik \"Simpan Bank Soal\").", en: "{{n}} new questions added to the bank (not saved yet - click \"Save Question Bank\")." },
  "quiz.addmanual.btn": { id: "+ Tambah Soal Manual", en: "+ Add Question Manually" },
  "quiz.bank.empty": { id: "Belum ada soal untuk topik ini. Tambah manual atau pakai Generate Otomatis di atas.", en: "No questions for this topic yet. Add one manually or use Auto-Generate above." },
  "quiz.bank.loading": { id: "Memuat bank soal...", en: "Loading question bank..." },
  "quiz.save.btn": { id: "Simpan Bank Soal", en: "Save Question Bank" },
  "quiz.save.saving": { id: "Menyimpan...", en: "Saving..." },
  "quiz.save.saved": { id: "Tersimpan.", en: "Saved." },
  "quiz.unsaved.note": { id: "Ada perubahan yang belum disimpan.", en: "There are unsaved changes." },
  "quiz.publish.btn": { id: "Publikasikan ke Sesi Aktif", en: "Publish to Active Session" },
  "quiz.publish.publishing": { id: "Mempublikasikan...", en: "Publishing..." },
  "quiz.publish.needselection": { id: "Centang minimal 1 soal dulu untuk dipublikasikan.", en: "Check at least 1 question first to publish." },
  "quiz.active.status": { id: "Kuis aktif: {{topic}} - {{count}} soal, dipublikasikan {{time}}.", en: "Active quiz: {{topic}} - {{count}} questions, published {{time}}." },
  "quiz.ended.status": { id: "Kuis terakhir sudah diakhiri: {{topic}} - {{count}} soal. Hasil masih bisa dilihat sampai kuis baru dipublikasikan.", en: "Last quiz has ended: {{topic}} - {{count}} questions. Results are still viewable until a new quiz is published." },
  "quiz.none.status": { id: "Belum ada kuis yang dipublikasikan.", en: "No quiz has been published yet." },
  "quiz.end.btn": { id: "Akhiri Kuis", en: "End Quiz" },
  "quiz.end.ending": { id: "Mengakhiri kuis...", en: "Ending quiz..." },
  "quiz.viewresults.btn": { id: "Lihat Jawaban Siswa", en: "View Student Answers" },
  "quiz.results.title": { id: "Jawaban Siswa", en: "Student Answers" },
  "quiz.results.empty": { id: "Belum ada siswa yang menjawab kuis ini.", en: "No students have answered this quiz yet." },
  "quiz.results.loading": { id: "Memuat jawaban...", en: "Loading answers..." },
  "quiz.results.correct": { id: "benar", en: "correct" },
  "quiz.results.incorrect": { id: "salah", en: "incorrect" },
  "quiz.results.close.btn": { id: "Tutup", en: "Close" },
  "quiz.editor.title.add": { id: "Tambah Soal", en: "Add Question" },
  "quiz.editor.title.edit": { id: "Edit Soal", en: "Edit Question" },
  "quiz.editor.type.label": { id: "Tipe soal", en: "Question type" },
  "quiz.editor.question.label": { id: "Pertanyaan (boleh pakai LaTeX, mis. $F = BIL\\sin\\theta$)", en: "Question (LaTeX allowed, e.g. $F = BIL\\sin\\theta$)" },
  "quiz.editor.options.label": { id: "Opsi Jawaban", en: "Answer Options" },
  "quiz.editor.correct.label": { id: "Tandai lingkaran di depan opsi yang benar", en: "Mark the circle next to the correct option" },
  "quiz.editor.modelanswer.label": { id: "Jawaban Model / Poin Penilaian (untuk guru saja, TIDAK dilihat siswa)", en: "Model Answer / Marking Points (teacher only, NOT shown to students)" },
  "quiz.editor.save.btn": { id: "Simpan Soal", en: "Save Question" },
  "quiz.editor.cancel.btn": { id: "Batal", en: "Cancel" },
  "quiz.editor.needquestion": { id: "Isi teks pertanyaannya dulu.", en: "Fill in the question text first." },
  "quiz.editor.preview.label": { id: "Pratinjau", en: "Preview" },
  "quiz.question.edit.btn": { id: "Edit", en: "Edit" },
  "quiz.question.delete.btn": { id: "Hapus", en: "Delete" },
  "quiz.confirmdelete": { id: "Hapus soal ini dari bank?", en: "Delete this question from the bank?" },
  "quiz.optionletter": { id: "Opsi {{letter}}", en: "Option {{letter}}" },

  "quiz.toggle.label": { id: "Kuis", en: "Quiz" },
  "quiz.toggle.title": { id: "Kuis dari guru", en: "Quiz from your teacher" },
  "quiz.banner.new": { id: "Ada kuis baru dari gurumu! Klik untuk mengerjakan.", en: "There's a new quiz from your teacher! Click to answer it." },
  "quiz.banner.done": { id: "Kuis sudah kamu kumpulkan.", en: "You've already submitted this quiz." },
  "quiz.modal.title": { id: "Kuis dari Guru", en: "Quiz from Your Teacher" },
  "quiz.modal.question.label": { id: "Soal {{n}}", en: "Question {{n}}" },
  "quiz.modal.submit.btn": { id: "Kirim Jawaban", en: "Submit Answers" },
  "quiz.modal.submitting": { id: "Mengirim...", en: "Submitting..." },
  "quiz.modal.submitted": { id: "Jawaban terkirim, terima kasih!", en: "Answers submitted, thank you!" },
  "quiz.modal.close.btn": { id: "Tutup", en: "Close" },
  "quiz.modal.short.placeholder": { id: "Tulis jawabanmu di sini...", en: "Write your answer here..." },
  "quiz.modal.essay.placeholder": { id: "Tulis jawaban esaimu di sini...", en: "Write your essay answer here..." },
  "quiz.modal.error.generic": { id: "Gagal mengirim jawaban: {{err}}", en: "Failed to submit answers: {{err}}" },
  "quiz.ended.notice": { id: "Kuis ini sudah diakhiri gurumu.", en: "This quiz has been ended by your teacher." }
};

function getLang() {
  const v = localStorage.getItem(STORAGE_KEY_LANG);
  return v === "en" ? "en" : "id";
}

function t(key, vars) {
  const entry = I18N_STRINGS[key];
  if (!entry) return key; // fallback: tampilkan key mentah supaya gampang terlihat kalau ada yang lupa didaftarkan
  const lang = getLang();
  let str = entry[lang] || entry.id || "";
  if (vars) {
    // Replacer dipakai sebagai FUNGSI (bukan string) supaya nilai yang
    // disisipkan (mis. kode HTML hasil AI di editPrompt) tidak pernah
    // ditafsirkan sebagai pola penggantian spesial ($&, $1, $$, dst) oleh
    // String.replace - kalau dipakai sebagai string, "$" apa pun yang
    // kebetulan ada di dalam value (sangat mungkin muncul di kode
    // JS/CSS yang di-generate AI) bisa diam-diam merusak hasilnya.
    Object.keys(vars).forEach(k => {
      str = str.replace(new RegExp("\\{\\{" + k + "\\}\\}", "g"), () => vars[k]);
    });
  }
  return str;
}

// Dipakai untuk field konten fisika dwibahasa dari content.js/chatbot-data.js:
// bentuknya { id: "...", en: "..." } (en boleh belum ada -> fallback ke id),
// ATAU tetap string biasa untuk topik yang belum diterjemahkan sama sekali
// (supaya tidak pernah error/kosong walau proses penerjemahan belum lengkap).
function trContent(field) {
  if (field === null || field === undefined) return "";
  if (typeof field === "string") return field;
  const lang = getLang();
  return field[lang] || field.id || field.en || "";
}

function applyStaticI18n(root) {
  root = root || document;
  root.querySelectorAll("[data-i18n]").forEach(el => {
    const text = t(el.getAttribute("data-i18n"));
    // Beberapa <label> di index.html MEMBUNGKUS langsung elemen form-nya
    // (mis. <label data-i18n="...">Nama lengkap <input ...></label>) supaya
    // asosiasi label<->input otomatis tanpa butuh atribut for/id pasangan.
    // Kalau elemen ini punya anak ELEMEN (bukan cuma teks), JANGAN pernah
    // pakai textContent (itu akan MENGHAPUS anak elemen tsb, mis. <select
    // id="pf-concept"> ikut lenyap sehingga app.js gagal mengisinya lagi
    // dengan "Cannot set properties of null") - cukup ganti teks label di
    // node teks pertama yang tidak kosong, biarkan anak elemen lain utuh.
    const hasElementChild = Array.prototype.some.call(el.childNodes, n => n.nodeType === 1);
    if (!hasElementChild) {
      el.textContent = text;
      return;
    }
    let replaced = false;
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim() !== "") {
        n.textContent = text;
        replaced = true;
        break;
      }
    }
    if (!replaced) el.insertBefore(document.createTextNode(text), el.firstChild);
  });
  root.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
  root.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.getAttribute("data-i18n-placeholder")); });
  root.querySelectorAll("[data-i18n-title]").forEach(el => { el.title = t(el.getAttribute("data-i18n-title")); });
  root.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
  document.documentElement.lang = getLang();
  document.querySelectorAll(".lang-switch-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === getLang());
  });
}

// Ganti bahasa lalu reload halaman (lihat catatan panjang di atas kenapa
// reload dipilih ketimbang re-render parsial). Topik & tab yang sedang
// dibuka (kalau ada, dan halaman ini punya konsep "topik/tab") dipertahankan
// lewat sessionStorage supaya siswa tidak kembali ke Beranda tiap ganti bahasa.
function setLang(lang) {
  lang = lang === "en" ? "en" : "id";
  if (lang === getLang()) return;
  try {
    const activeNavItem = document.querySelector(".nav-item.active");
    const activeTabBtn = document.querySelector(".tab-btn.active");
    if (activeNavItem && activeNavItem.dataset.id) {
      sessionStorage.setItem(SESSION_KEY_LANG_RESTORE, JSON.stringify({
        topicId: activeNavItem.dataset.id,
        tab: activeTabBtn ? activeTabBtn.dataset.tab : null
      }));
    } else {
      sessionStorage.removeItem(SESSION_KEY_LANG_RESTORE);
    }
  } catch (e) { /* sessionStorage tidak wajib berhasil - reload tetap lanjut */ }
  localStorage.setItem(STORAGE_KEY_LANG, lang);
  location.reload();
}

// Dipanggil oleh app.js setelah render awal selesai (topik nav dst sudah
// dibuat) - mengembalikan topik/tab yang sedang dibuka SEBELUM reload akibat
// ganti bahasa, kalau ada catatannya.
function restoreLangSwitchState() {
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(SESSION_KEY_LANG_RESTORE) || "null"); }
  catch (e) { saved = null; }
  if (!saved || !saved.topicId) return;
  sessionStorage.removeItem(SESSION_KEY_LANG_RESTORE);
  if (typeof selectTopic !== "function") return;
  const topic = (typeof TOPICS !== "undefined" ? TOPICS : []).find(tp => tp.id === saved.topicId);
  if (!topic) return;
  selectTopic(saved.topicId);
  if (saved.tab && typeof switchTab === "function") switchTab(saved.tab);
}

function initLangSwitch() {
  document.querySelectorAll(".lang-switch-btn").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

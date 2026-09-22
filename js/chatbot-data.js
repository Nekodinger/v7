/* ============================================================
   chatbot-data.js
   Bahan (knowledge base) untuk Tutor Fisika.
   ------------------------------------------------------------
   Semua teks di bawah ditulis manual (bukan hasil salin-tempel
   dari buku manapun). Dipakai dengan dua cara oleh js/chatbot.js:
   1. Kalau API key Gemini tersedia: dikirim sebagai "kbContext"
      (bahan acuan) ke tutor AI lewat backend, supaya jawaban AI
      tetap konsisten dengan materi yang sudah diajarkan di situs.
   2. Kalau API key belum diisi: dipakai langsung sebagai skrip
      tanya-jawab lokal (fallback) lewat pencocokan kata kunci
      sederhana, supaya tutor tetap bisa dipakai walau tanpa key.

   Cara menambah topik baru: tambahkan entri baru dengan key =
   id topik (harus sama dengan id di TOPICS pada content.js),
   isi greeting, chips (contoh pertanyaan singkat), dan concepts
   (daftar konsep dengan keywords, ask, explain, followUp).

   Pola tiap concept meniru gaya Socratic modul ajar: saat kata
   kuncinya terdeteksi PERTAMA kali, tutor balik bertanya dulu
   (ask) - bukan langsung menjelaskan. Baru saat siswa membalas
   apa pun setelah itu, tutor mengungkap penjelasan singkat
   (explain) dan menutup dengan pertanyaan lanjutan (followUp)
   supaya siswa tetap diajak berpikir, bukan cuma menerima jawaban.
   ============================================================ */

const CHATBOT_KB = {

  kinematics: {
    greeting: { id: "Halo! Aku tutor fisikamu untuk topik Kinematics. Ceritakan dulu apa yang membingungkan, atau ketik istilah fisikanya (mis. \"perpindahan\" atau \"GLBB\").", en: "Hi! I'm your physics tutor for the Kinematics topic. Tell me first what's confusing, or type a physics term (e.g. \"displacement\" or \"uniformly accelerated motion\")." },
    chips: [
      "Apa bedanya jarak dan perpindahan?",
      "Kenapa luas di bawah grafik v-t itu perpindahan?",
      "Apa bedanya GLB dan GLBB?",
      "Kenapa waktu naik sama dengan waktu turun di gerak vertikal?"
    ],
    concepts: [
      {
        id: "jarak-perpindahan",
        keywords: ["jarak", "perpindahan", "distance", "displacement", "skalar", "vektor"],
        ask: "Sebelum aku jelaskan: kalau kamu lari mengelilingi lapangan berbentuk lingkaran penuh dan kembali persis ke titik start, menurutmu berapa PERPINDAHANmu? Coba jelaskan alasanmu dulu.",
        explain: "Jarak adalah besaran skalar: total panjang lintasan yang benar-benar ditempuh, selalu bernilai positif. Perpindahan adalah besaran vektor: perubahan posisi dari titik awal ke titik akhir saja, punya arah, dan BISA nol meskipun jarak yang ditempuh tidak nol (persis seperti contoh lari keliling lapangan tadi).",
        followUp: "Sekarang giliranmu: bisakah besar perpindahan lebih BESAR daripada jarak yang ditempuh? Kenapa atau kenapa tidak?"
      },
      {
        id: "kelajuan-kecepatan",
        keywords: ["kelajuan", "kecepatan", "speed", "velocity", "laju"],
        ask: "Kalau ada mobil yang spidometernya menunjukkan angka konstan 60 km/jam tapi terus berbelok mengikuti tikungan jalan, menurutmu apakah kecepatannya konstan? Kenapa?",
        explain: "Kelajuan (speed) adalah besaran skalar - hanya menyatakan seberapa cepat, tanpa arah. Kecepatan (velocity) adalah besaran vektor - punya besar DAN arah. Mobil di tikungan tadi punya kelajuan konstan, tapi kecepatannya TIDAK konstan karena arahnya terus berubah, artinya mobil itu tetap mengalami percepatan meski angka di spidometer tidak berubah.",
        followUp: "Kalau begitu, menurutmu apakah benda yang bergerak melingkar dengan kelajuan tetap punya percepatan? Ke arah mana kira-kira percepatan itu?"
      },
      {
        id: "percepatan",
        keywords: ["percepatan", "acceleration", "perlambatan"],
        ask: "Kalau sebuah benda sedang bergerak ke kanan tapi kecepatannya makin lama makin kecil, ke arah mana menurutmu arah percepatannya?",
        explain: "Percepatan adalah laju perubahan kecepatan terhadap waktu (a = Δv/Δt), dan arahnya mengikuti arah PERUBAHAN kecepatan, bukan arah gerak itu sendiri. Kalau benda melambat sambil bergerak ke kanan, percepatannya justru mengarah ke KIRI (berlawanan arah gerak) - inilah yang sering disebut perlambatan.",
        followUp: "Jadi, mungkinkah percepatan bernilai nol padahal bendanya sedang bergerak cepat? Berikan contohnya."
      },
      {
        id: "glb-glbb",
        keywords: ["glb", "glbb", "gerak lurus beraturan", "gerak lurus berubah beraturan", "kecepatan konstan", "percepatan konstan"],
        ask: "Menurutmu, kalau grafik kecepatan terhadap waktu (v-t) sebuah benda berupa GARIS LURUS MENDATAR, jenis gerak apa itu? Bagaimana kalau garisnya lurus MIRING?",
        explain: "GLB (Gerak Lurus Beraturan) punya kecepatan konstan (grafik v-t mendatar), jadi tidak ada percepatan, dan persamaannya cukup v = s/t. GLBB (Gerak Lurus Berubah Beraturan) punya percepatan KONSTAN (grafik v-t garis lurus miring, tidak harus nol), sehingga butuh empat persamaan GLBB (v = u+at, s = ut+½at², v²=u²+2as, s=½(u+v)t) untuk menghubungkan kecepatan awal, akhir, percepatan, jarak, dan waktu.",
        followUp: "Kalau grafik v-t berbentuk kurva melengkung (bukan garis lurus), apa yang bisa kamu simpulkan tentang percepatannya?"
      },
      {
        id: "grafik-gerak",
        keywords: ["grafik x-t", "grafik v-t", "grafik a-t", "gradien", "luas grafik", "kemiringan grafik"],
        ask: "Secara matematis, gradien (kemiringan) sebuah grafik itu artinya laju perubahan sumbu-y terhadap sumbu-x. Kalau sumbu-y grafikmu adalah posisi (x) dan sumbu-x adalah waktu (t), besaran fisika apa yang diwakili gradiennya?",
        explain: "Gradien grafik posisi-waktu (x-t) adalah kecepatan, dan gradien grafik kecepatan-waktu (v-t) adalah percepatan. Sebaliknya, LUAS DI BAWAH grafik v-t sama dengan perpindahan, dan luas di bawah grafik a-t sama dengan perubahan kecepatan - ini karena luas di bawah grafik itu artinya mengalikan sumbu-y dengan sumbu-x (mengintegralkan), kebalikan dari mencari gradien.",
        followUp: "Kalau begitu, apa arti fisis dari luas di bawah grafik percepatan-waktu (a-t)?"
      },
      {
        id: "jatuh-bebas",
        keywords: ["jatuh bebas", "free fall", "gravitasi", "percepatan gravitasi", "gerak vertikal"],
        ask: "Saat benda dilempar tegak lurus ke atas, di titik tertinggi lintasannya, berapa kecepatannya? Lalu, apakah percepatannya juga nol di titik itu?",
        explain: "Di titik tertinggi, kecepatan benda memang nol sesaat, TAPI percepatannya TETAP g (≈9.81 m/s², arah selalu ke bawah) - karena gravitasi terus bekerja sepanjang lintasan, tidak peduli benda sedang naik, diam sesaat, atau turun. Inilah sebabnya (tanpa hambatan udara) waktu yang dibutuhkan untuk naik sama persis dengan waktu untuk turun kembali ke titik yang sama.",
        followUp: "Kalau ada dua bola dengan massa berbeda dijatuhkan dari ketinggian sama tanpa hambatan udara, menurutmu siapa yang sampai duluan? Kenapa massa tidak muncul di rumus h = ½gt²?"
      },
      {
        id: "gerak-parabola",
        keywords: ["gerak parabola", "projectile", "peluru", "gerak peluru", "jangkauan", "sudut elevasi"],
        ask: "Gerak parabola sebenarnya adalah gabungan dua gerak yang terjadi BERSAMAAN dan SALING BEBAS. Menurutmu, gerak apa yang terjadi di arah horizontal, dan gerak apa yang terjadi di arah vertikal?",
        explain: "Di arah horizontal, tidak ada gaya (mengabaikan hambatan udara), jadi geraknya adalah GLB dengan kecepatan horizontal tetap. Di arah vertikal, gravitasi bekerja terus, jadi geraknya adalah GLBB seperti gerak jatuh bebas/vertikal. Karena keduanya independen, kamu bisa menganalisis masing-masing sumbu secara terpisah lalu menggabungkannya untuk mendapatkan waktu di udara, tinggi maksimum, dan jangkauan.",
        followUp: "Kalau sudut elevasi diperbesar dari 30° ke 45°, apa yang terjadi pada jangkauan (R)? Petunjuk: lihat rumus R = u² sin(2θ)/g."
      }
    ]
  },

  "magnetic-fields": {
    greeting: { id: "Halo! Aku tutor fisikamu untuk topik Magnetic Fields. Coba ketik istilah fisikanya (mis. \"gaya lorentz\", \"fluks\", \"hukum lenz\") atau ceritakan dulu apa yang bikin bingung.", en: "Hi! I'm your physics tutor for the Magnetic Fields topic. Try typing a physics term (e.g. \"Lorentz force\", \"flux\", \"Lenz's law\") or tell me first what's confusing." },
    chips: [
      "Kenapa pakai kaidah tangan kanan vs tangan kiri, apa bedanya?",
      "Kenapa muatan bergerak dalam medan magnet lintasannya melingkar?",
      "Apa itu fluks magnetik?",
      "Kenapa Hukum Lenz ada tanda negatif?"
    ],
    concepts: [
      {
        id: "kaidah-tangan",
        keywords: ["kaidah tangan kanan", "kaidah tangan kiri", "fleming", "tangan kanan", "tangan kiri", "aturan tangan"],
        ask: "Ada dua kaidah tangan yang sering tertukar siswa: kaidah tangan KANAN dan kaidah tangan KIRI Fleming. Menurutmu, keduanya dipakai untuk MENENTUKAN apa - apakah sama-sama untuk arah gaya, atau untuk hal yang berbeda?",
        explain: "Kaidah tangan kanan dipakai untuk menentukan ARAH MEDAN MAGNET di sekitar penghantar berarus (genggam kawat, ibu jari searah arus, jari lain menunjukkan arah medan melingkarinya) - ini tentang SUMBER medan. Kaidah tangan kiri Fleming dipakai untuk menentukan ARAH GAYA pada penghantar berarus atau muatan bergerak YANG SUDAH BERADA di dalam medan magnet (ibu jari=gaya F, telunjuk=medan B, jari tengah=arus I). Dua kaidah ini menjawab pertanyaan yang berbeda meski sama-sama pakai tangan.",
        followUp: "Kalau arah arus dan arah medan magnet SEJAJAR (tidak membentuk sudut sama sekali), menurutmu berapa besar gaya yang dialami penghantar? Hubungkan dengan rumus F = BIL sin θ."
      },
      {
        id: "gaya-penghantar",
        keywords: ["f=bil", "f = bil", "gaya pada penghantar", "gaya pada kawat", "penghantar berarus", "current balance", "neraca arus"],
        ask: "Rumus gaya pada penghantar berarus adalah F = BIL sin θ. Menurutmu, kenapa perlu ada sin θ di rumus ini - apa yang terjadi kalau kawatnya sejajar sempurna dengan medan magnet (θ=0°)?",
        explain: "sin θ memperhitungkan SUDUT antara arah arus dan arah medan magnet. Saat θ=0° (kawat sejajar medan), sin 0°=0, jadi gaya yang dialami kawat NOL - tidak ada gaya sama sekali, meski arus dan medannya kuat. Gaya maksimum terjadi saat kawat TEGAK LURUS terhadap medan (θ=90°, sin 90°=1), sehingga F=BIL. Inilah prinsip yang dipakai eksperimen current balance untuk menentukan B dari gradien grafik F terhadap I.",
        followUp: "Kalau di eksperimen current balance panjang kawat L digandakan sementara arus I dan medan B dijaga tetap, apa yang terjadi pada gaya F yang terukur di neraca?"
      },
      {
        id: "gaya-muatan-bergerak",
        keywords: ["f=bqv", "f = bqv", "gaya pada muatan", "gaya lorentz", "muatan bergerak", "gerak melingkar partikel"],
        ask: "Sebuah partikel bermuatan bergerak TEGAK LURUS memasuki medan magnet seragam. Gaya magnetik selalu tegak lurus terhadap kecepatannya. Menurutmu, kalau gaya SELALU tegak lurus arah gerak, apa bentuk lintasan partikel itu - lurus, parabola, atau melingkar?",
        explain: "Karena gaya magnetik (F=BQv sin θ) selalu tegak lurus terhadap kecepatan partikel, gaya ini berfungsi sebagai gaya SENTRIPETAL - gaya yang terus mengubah ARAH kecepatan tanpa pernah mengubah BESAR kecepatan (karena tidak pernah punya komponen searah gerak). Inilah yang membuat lintasannya berbentuk LINGKARAN sempurna (untuk gerak tegak lurus medan), dengan jari-jari r = mv/(BQ).",
        followUp: "Karena gaya magnetik selalu tegak lurus kecepatan, apakah gaya ini melakukan USAHA (kerja) pada partikel? Apa artinya ini untuk energi kinetik partikel sepanjang lintasannya?"
      },
      {
        id: "fluks-magnetik",
        keywords: ["fluks", "flux", "phi", "fluks magnetik", "flux linkage", "fluks kaitan"],
        ask: "Fluks magnetik dirumuskan Φ = BA cos θ, mirip seperti 'berapa banyak garis medan yang menembus tegak lurus suatu bidang'. Menurutmu, kapan fluks magnetik akan bernilai MAKSIMUM - saat bidang sejajar medan, atau saat bidang tegak lurus medan?",
        explain: "Fluks magnetik maksimum terjadi saat bidang (misalnya kumparan) TEGAK LURUS terhadap arah medan magnet (θ=0° terhadap garis normal bidang, cos 0°=1) - artinya sebanyak mungkin garis medan menembus bidang itu secara tegak lurus. Saat bidang sejajar medan (θ=90°, cos 90°=0), fluks yang menembusnya NOL karena garis medan hanya 'menggesek' permukaan bidang tanpa menembusnya.",
        followUp: "Kalau sebuah kumparan punya N lilitan, kenapa 'fluks kaitan' (flux linkage) yang dipakai di Hukum Faraday adalah NΦ, bukan Φ saja?"
      },
      {
        id: "hukum-faraday",
        keywords: ["hukum faraday", "faraday", "ggl induksi", "emf induksi", "induksi elektromagnetik"],
        ask: "Hukum Faraday bilang GGL induksi sebanding dengan LAJU PERUBAHAN fluks magnetik (bukan besar fluksnya). Kalau sebuah magnet DIAM di dalam kumparan (fluksnya besar tapi konstan), menurutmu apakah ada GGL induksi yang terukur?",
        explain: "Tidak ada - meskipun fluks magnetiknya besar, GGL induksi hanya muncul saat fluks itu BERUBAH terhadap waktu (ε = -NΔΦ/Δt). Magnet diam berarti fluks konstan, ΔΦ/Δt = 0, jadi GGL = 0. Inilah kenapa di eksperimen 'magnet dijatuhkan dekat kumparan', jarum galvanometer hanya bergerak SAAT magnet sedang bergerak mendekat/menjauh, bukan saat magnet berhenti di tengah kumparan.",
        followUp: "Ada dua cara membuat fluks berubah terhadap waktu tanpa menggerakkan magnet sama sekali - menurutmu apa saja?"
      },
      {
        id: "hukum-lenz",
        keywords: ["hukum lenz", "lenz", "arah arus induksi", "tanda negatif"],
        ask: "Hukum Lenz mengatakan arus induksi selalu mengalir dengan arah yang MELAWAN perubahan fluks yang menyebabkannya. Menurutmu, ini sebenarnya adalah bentuk lain dari hukum kekekalan apa dalam fisika?",
        explain: "Hukum Lenz adalah konsekuensi dari HUKUM KEKEKALAN ENERGI. Kalau arus induksi justru MEMBANTU (bukan melawan) perubahan fluks, sistem akan terus mempercepat dirinya sendiri tanpa masukan energi dari luar - melanggar kekekalan energi. Karena arus induksi harus melawan perubahan (misalnya menciptakan medan yang menahan magnet yang sedang didekatkan), dibutuhkan USAHA untuk terus menggerakkan magnet, dan usaha itulah yang menjadi sumber energi listrik yang dihasilkan - inilah tanda negatif pada rumus ε = -NΔΦ/Δt.",
        followUp: "Kalau kamu mendorong magnet MENJAUH dari kumparan (bukan mendekat), apakah arah arus induksinya sama atau berlawanan dengan saat magnet didekatkan? Kenapa?"
      },
      {
        id: "medan-oleh-arus",
        keywords: ["medan magnet oleh arus", "oersted", "solenoida", "kumparan berarus", "medan kawat lurus"],
        ask: "Percobaan Oersted menunjukkan jarum kompas bergerak saat didekatkan kawat berarus. Menurutmu, apa yang ini buktikan tentang hubungan antara listrik dan kemagnetan - apakah keduanya hal yang benar-benar terpisah?",
        explain: "Percobaan Oersted membuktikan bahwa ARUS LISTRIK YANG BERGERAK MENGHASILKAN MEDAN MAGNET di sekitarnya - listrik dan magnetisme bukan dua hal terpisah, melainkan dua sisi dari fenomena yang sama (elektromagnetisme). Arah medan magnet di sekitar kawat lurus mengikuti kaidah tangan kanan (genggam kawat, ibu jari searah arus, jari lain menunjukkan arah medan melingkar), sementara solenoida (kumparan) menghasilkan medan yang mirip magnet batang karena efek melingkar dari banyak lilitan kawat bertumpuk.",
        followUp: "Kalau arah arus pada kawat lurus dibalik, apa yang terjadi pada arah medan magnet di sekitarnya?"
      }
    ]
  },

  general: {
    greeting: { id: "Halo! Aku tutor fisikamu. Pilih topik dulu di sidebar supaya aku tahu konteksnya, atau langsung ketik istilah fisika yang ingin kamu diskusikan.", en: "Hi! I'm your physics tutor. Pick a topic in the sidebar first so I know the context, or type a physics term you'd like to discuss." },
    chips: ["Apa itu besaran vektor?", "Bagaimana cara belajar fisika yang efektif?"],
    concepts: [
      {
        id: "vektor-skalar-umum",
        keywords: ["vektor", "skalar", "besaran vektor", "besaran skalar"],
        ask: "Coba sebutkan satu besaran fisika yang menurutmu punya ARAH, dan satu lagi yang menurutmu TIDAK punya arah. Kenapa kamu mengelompokkannya begitu?",
        explain: "Besaran skalar hanya punya besar/nilai (mis. massa, waktu, jarak, energi, suhu). Besaran vektor punya besar DAN arah (mis. perpindahan, kecepatan, percepatan, gaya). Membedakan keduanya penting karena cara menjumlahkannya berbeda: skalar dijumlah biasa, vektor harus memperhitungkan arah (bisa saling mengurangi meski besarnya sama).",
        followUp: "Kalau dua gaya dengan besar sama tapi arah berlawanan bekerja pada benda yang sama, berapa resultan gayanya?"
      }
    ]
  }
};

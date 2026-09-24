/* ============================================================
   content.js
   Data & konten untuk semua topik AS/A Level Cambridge Physics (9702).
   ------------------------------------------------------------
   Cara menambah topik baru:
   1. Cari objek topik dengan id yang sesuai di TOPICS (semua 25 topik
      sudah didaftarkan dengan status "soon").
   2. Ganti status: "soon" -> "ready".
   3. Isi materiHTML, eksperimen{}, latihan[], labConcepts[] mengikuti
      contoh lengkap pada topik "kinematics" di bawah.
   Tidak perlu menyentuh app.js atau index.html untuk menambah topik.
   ============================================================ */

const TOPICS = [
  // ---------------- AS LEVEL (1-11) ----------------
  { id: "quantities", number: 1, level: "AS", title: "Physical Quantities and Units", status: "soon",
    desc: "Besaran pokok & turunan, satuan SI, angka penting, analisis dimensi." },

  { id: "kinematics", number: 2, level: "AS", title: "Kinematics", status: "ready",
    desc: "Mendeskripsikan gerak: jarak, perpindahan, kecepatan, percepatan, GLB, GLBB, gerak jatuh bebas, dan gerak parabola." },

  { id: "dynamics", number: 3, level: "AS", title: "Dynamics", status: "soon",
    desc: "Hukum Newton, momentum, dan konservasi momentum." },

  { id: "forces", number: 4, level: "AS", title: "Forces, Density and Pressure", status: "soon",
    desc: "Gaya, momen gaya, kesetimbangan, densitas, dan tekanan." },

  { id: "work-energy-power", number: 5, level: "AS", title: "Work, Energy and Power", status: "soon",
    desc: "Usaha, energi kinetik & potensial, hukum kekekalan energi, daya." },

  { id: "deformation", number: 6, level: "AS", title: "Deformation of Solids", status: "soon",
    desc: "Hukum Hooke, tegangan, regangan, modulus Young." },

  { id: "waves", number: 7, level: "AS", title: "Waves", status: "soon",
    desc: "Gelombang transversal & longitudinal, besaran gelombang, gelombang elektromagnetik." },

  { id: "superposition", number: 8, level: "AS", title: "Superposition", status: "soon",
    desc: "Interferensi, difraksi, gelombang berdiri, kisi difraksi." },

  { id: "electricity", number: 9, level: "AS", title: "Electricity", status: "soon",
    desc: "Arus listrik, GGL, resistivitas, hukum Ohm." },

  { id: "dc-circuits", number: 10, level: "AS", title: "D.C. Circuits", status: "soon",
    desc: "Rangkaian seri-paralel, hukum Kirchhoff, potensiometer." },

  { id: "particle-physics", number: 11, level: "AS", title: "Particle Physics", status: "soon",
    desc: "Struktur atom, radioaktivitas, model quark, partikel fundamental." },

  // ---------------- A LEVEL TAMBAHAN (12-25) ----------------
  { id: "circular-motion", number: 12, level: "A2", title: "Motion in a Circle", status: "soon",
    desc: "Kecepatan sudut, percepatan sentripetal, gaya sentripetal." },
  { id: "gravitational-fields", number: 13, level: "A2", title: "Gravitational Fields", status: "soon",
    desc: "Hukum gravitasi Newton, medan gravitasi, orbit satelit." },
  { id: "temperature", number: 14, level: "A2", title: "Temperature", status: "ready",
    desc: "Skala suhu, kesetimbangan termal, kapasitas panas." },
  { id: "ideal-gases", number: 15, level: "A2", title: "Ideal Gases", status: "ready",
    desc: "Hukum gas ideal, teori kinetik gas." },
  { id: "thermodynamics", number: 16, level: "A2", title: "Thermodynamics", status: "ready",
    desc: "Energi dalam, hukum pertama termodinamika." },
  { id: "oscillations", number: 17, level: "A2", title: "Oscillations", status: "soon",
    desc: "Gerak harmonik sederhana, resonansi, redaman." },
  { id: "electric-fields", number: 18, level: "A2", title: "Electric Fields", status: "soon",
    desc: "Medan listrik, hukum Coulomb, potensial listrik." },
  { id: "capacitance", number: 19, level: "A2", title: "Capacitance", status: "soon",
    desc: "Kapasitor, energi tersimpan, rangkaian RC." },
  { id: "magnetic-fields", number: 20, level: "A2", title: "Magnetic Fields", status: "ready",
    desc: "Gaya magnetik, medan magnet oleh arus, induksi elektromagnetik." },
  { id: "alternating-currents", number: 21, level: "A2", title: "Alternating Currents", status: "soon",
    desc: "Arus & tegangan AC, nilai rms, transformator." },
  { id: "quantum-physics", number: 22, level: "A2", title: "Quantum Physics", status: "soon",
    desc: "Efek fotolistrik, dualitas gelombang-partikel, tingkat energi." },
  { id: "nuclear-physics", number: 23, level: "A2", title: "Nuclear Physics", status: "soon",
    desc: "Struktur inti, peluruhan radioaktif, energi ikat inti." },
  { id: "medical-physics", number: 24, level: "A2", title: "Medical Physics", status: "soon",
    desc: "Pencitraan medis: ultrasound, X-ray, MRI." },
  { id: "astronomy", number: 25, level: "A2", title: "Astronomy and Cosmology", status: "soon",
    desc: "Jarak astronomis, pergeseran merah, hukum Hubble." },
];

/* ------------------------------------------------------------
   Media kontekstual (foto Wikimedia Commons berlisensi bebas +
   video YouTube dari kanal pendidikan yang sudah dikenal), dipakai
   sebagai ilustrasi kontekstual di Materi Belajar Kinematics.
   Helper mediaRow() merender pasangan foto+video jadi kartu.
   ------------------------------------------------------------ */
function mediaRow(image, video) {
  const imgPart = image ? `
    <div class="media-card">
      <img src="${image.src}" alt="${image.alt}" loading="lazy">
      <p class="media-caption">${image.caption}<br><em>Sumber: Wikimedia Commons, ${image.author} (${image.license})</em></p>
    </div>` : "";
  const vidPart = video ? `
    <div class="media-card">
      <div class="media-video-wrap">
        <iframe src="https://www.youtube.com/embed/${video.id}" title="${video.title}" allowfullscreen loading="lazy"></iframe>
      </div>
      <p class="media-caption"><strong>${video.title}</strong> &middot; ${video.channel}<br>${video.desc}</p>
    </div>` : "";
  return `<div class="media-row">${imgPart}${vidPart}</div>`;
}

/* ------------------------------------------------------------
   Pertanyaan Konfirmasi Pemahaman (navigasi bertahap PjBL)
   ------------------------------------------------------------
   Dipakai gate progresi tab per topik (lihat app.js, fungsi
   openConfirmModal/dsb.):
   - topic.materiCheck   : 5 SOAL MCQ (pemahaman umum materi), dinilai
                           otomatis di klien SEBAGAI SKOR (bukan harus
                           benar semua) - siswa perlu skor minimal 80%
                           (PASS_THRESHOLD_MATERI di app.js) untuk
                           lulus. Kalau skor < 80%, modal TIDAK
                           menutup/lanjut - siswa diminta mempelajari
                           kembali Materi Belajar di atas lalu klik
                           Next untuk mencoba ulang (lihat
                           startMateriGate() & openConfirmModal() di
                           app.js). Lulus di sini TANPA konfirmasi
                           guru - langsung membuka tab Eksperimen.
   - topic.eksperimenCheck : 2 SOAL MCQ tentang hubungan antar-variabel
                           & pengelolaan data pada eksperimen topik ini,
                           dinilai otomatis di klien. Kalau BENAR SEMUA,
                           status dikirim ke guru ("menunggu konfirmasi")
                           - siswa baru boleh lanjut ke Latihan Soal DAN
                           Lab Simulasi Virtual setelah guru menyetujui
                           dari Panel Guru (checkpoint "Memonitor Peserta
                           Didik dan Kemajuan Proyek" pada sintaks PjBL).
   Format tiap soal (array id sejajar dengan array en, index sama):
     { question: "...", options: ["...", "...", "...", "..."],
       correct: <index 0-based>, explanation: "..." }
   mapCheckQuestions() di bawah menggabungkan versi ID+EN jadi bentuk
   bilingual {id,en} yang dibaca trContent(), sama seperti pola
   topic.latihan.
   Topik yang BELUM diisi materiCheck/eksperimenCheck (mis. topik baru
   yang baru dibuat "ready" tapi belum sempat diisi soal konfirmasi)
   otomatis jatuh ke konfirmasi generik (lihat FALLBACK di app.js) -
   tidak menyebabkan error atau siswa terjebak.
   ------------------------------------------------------------ */
function mapCheckQuestions(idArr, enArr) {
  if (!idArr || !idArr.length) return null;
  return idArr.map((q, i) => {
    const qEN = (enArr && enArr[i]) || {};
    return {
      question: { id: q.question, en: qEN.question },
      options: q.options.map((opt, j) => ({ id: opt, en: (qEN.options || [])[j] })),
      correct: q.correct,
      explanation: { id: q.explanation, en: qEN.explanation }
    };
  });
}
function mapSingleCheck(idArr, enArr) {
  const mapped = mapCheckQuestions(idArr, enArr);
  return mapped ? mapped[0] : null;
}

/* ------------------------------------------------------------
   Konten lengkap: KINEMATICS (topik pilot)
   ------------------------------------------------------------ */

const KINEMATICS_MATERI = `
<h3>1. Besaran Dasar Kinematika</h3>
<table>
  <tr><th>Besaran</th><th>Jenis</th><th>Definisi singkat</th><th>Satuan SI</th></tr>
  <tr><td>Jarak (distance)</td><td>Skalar</td><td>Total lintasan yang ditempuh</td><td>m</td></tr>
  <tr><td>Perpindahan (displacement)</td><td>Vektor</td><td>Perubahan posisi dari titik awal ke akhir</td><td>m</td></tr>
  <tr><td>Kelajuan (speed)</td><td>Skalar</td><td>Jarak / waktu</td><td>m s⁻¹</td></tr>
  <tr><td>Kecepatan (velocity)</td><td>Vektor</td><td>Perpindahan / waktu</td><td>m s⁻¹</td></tr>
  <tr><td>Percepatan (acceleration)</td><td>Vektor</td><td>Laju perubahan kecepatan</td><td>m s⁻²</td></tr>
</table>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/40/Distancedisplacement.svg",
    alt: "Diagram jarak vs perpindahan",
    caption: "Perbandingan jarak (panjang lintasan total, garis putus-putus) dengan perpindahan (garis lurus posisi awal ke akhir).",
    author: "Stannered", license: "CC BY-SA 3.0" },
  { id: "vQCkYm3v3aA", title: "Distance and displacement introduction",
    channel: "Khan Academy", desc: "Penjelasan dasar perbedaan jarak (skalar) dan perpindahan (vektor) dengan contoh sederhana." }
)}

<h3>2. Gerak Lurus Beraturan (GLB)</h3>
<p>Kecepatan konstan, percepatan nol. Grafik $x$-$t$ berupa garis lurus (kemiringan = kecepatan).</p>
<div class="formula-box">$$v = \\dfrac{s}{t}$$</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/00/Uniform-motion.svg",
    alt: "Grafik x-t, v-t, a-t untuk gerak lurus beraturan",
    caption: "Tiga grafik gerak (posisi-waktu, kecepatan-waktu, percepatan-waktu) untuk benda dengan kecepatan konstan (GLB).",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "pfTTHx9kCHk", title: "Instantaneous speed and velocity",
    channel: "Khan Academy", desc: "Membedakan kelajuan/kecepatan sesaat dengan rata-rata, dasar untuk memahami gerak dengan kecepatan tetap." }
)}

<h3>3. Gerak Lurus Berubah Beraturan (GLBB)</h3>
<p>Percepatan konstan. Empat persamaan GLBB (sesuai <em>List of Formulae</em> Cambridge 9702):</p>
<div class="formula-box">
$$v = u + at$$
$$s = ut + \\tfrac{1}{2}at^2$$
$$v^2 = u^2 + 2as$$
$$s = \\tfrac{1}{2}(u+v)t$$
</div>
<p>dengan $u$ = kecepatan awal, $v$ = kecepatan akhir, $a$ = percepatan, $s$ = perpindahan, $t$ = waktu.</p>
<p class="muted">Tip mengerjakan soal: tulis dulu variabel yang diketahui (u, v, a, s, t), lalu pilih persamaan yang tidak melibatkan variabel yang tidak diketahui/ditanya.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/Uniform-acceleration.svg",
    alt: "Grafik x-t, v-t, a-t untuk gerak dengan percepatan konstan",
    caption: "Tiga grafik gerak untuk benda dengan percepatan konstan (GLBB): perhatikan grafik x-t berbentuk parabola dan grafik v-t berupa garis lurus miring.",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "MAS6mBRZZXA", title: "Average velocity for constant acceleration",
    channel: "Khan Academy", desc: "Menurunkan hubungan kecepatan rata-rata pada gerak dengan percepatan konstan, dasar dari persamaan-persamaan GLBB." }
)}

<h3>4. Gerak Jatuh Bebas</h3>
<p>Kasus khusus GLBB dengan $a = g = 9.81~\\text{m s}^{-2}$ (nilai standar pada data sheet Cambridge), kecepatan awal $u = 0$, arah ke bawah positif.</p>
<div class="formula-box">
$$h = \\tfrac{1}{2}gt^2 \\qquad v = gt \\qquad v^2 = 2gh$$
</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/02/Falling_ball.jpg",
    alt: "Foto stroboskopik bola jatuh bebas",
    caption: "Foto stroboskopik bola yang dijatuhkan bebas (20 kilatan/detik). Jarak antar posisi bola makin besar seiring waktu, sesuai $h \\propto t^2$.",
    author: "Michael N Maggs", license: "CC BY-SA 3.0" },
  { id: "tKIT68tYKnQ", title: "Free fall 1 body - solved example",
    channel: "Khan Academy", desc: "Contoh soal terpandu menghitung waktu dan kecepatan pada gerak jatuh bebas." }
)}

<h3>5. Gerak Vertikal ke Atas</h3>
<p>Percepatan tetap $g$ tetapi berlawanan arah dengan kecepatan awal (perlambatan). Di titik tertinggi, $v = 0$. Karena gerak simetris (tanpa hambatan udara), waktu naik sama dengan waktu turun.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/28/Vertical-projectile-motion-graphs.jpg",
    alt: "Grafik posisi dan kecepatan untuk gerak vertikal ke atas",
    caption: "Grafik posisi-waktu dan kecepatan-waktu untuk benda yang dilempar lurus ke atas lalu jatuh kembali karena gravitasi.",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "2zj4mjBRuL4", title: "Vertical motion under gravity - ball thrown upwards from a balcony",
    channel: "ExamSolutions", desc: "Contoh soal gerak vertikal di bawah gravitasi untuk bola yang dilempar ke atas dari sebuah balkon." }
)}

<h3>6. Gerak Parabola (Projectile Motion)</h3>
<p>Gerak 2 dimensi: komponen horizontal (kecepatan konstan, GLB) dan vertikal (percepatan $g$, GLBB) bersifat <strong>independen</strong>.</p>
<div class="formula-box">
$$\\text{Waktu di udara: } T = \\dfrac{2u\\sin\\theta}{g} \\qquad
\\text{Tinggi maksimum: } H = \\dfrac{(u\\sin\\theta)^2}{2g} \\qquad
\\text{Jangkauan: } R = \\dfrac{u^2\\sin 2\\theta}{g}$$
</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Parabolic_trajectory.svg",
    alt: "Diagram lintasan parabola proyektil",
    caption: "Diagram lintasan parabola sebuah proyektil lengkap dengan vektor kecepatan pada salah satu titik lintasannya.",
    author: "Oleg Alexandrov", license: "Domain Publik" },
  { id: "ZZ39o1rAZWY", title: "Projectile at an angle",
    channel: "Khan Academy", desc: "Menguraikan gerak proyektil yang ditembakkan dengan sudut elevasi menjadi komponen horizontal dan vertikal." }
)}
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Bouncing_ball_strobe_edit.jpg",
    alt: "Foto stroboskopik bola memantul membentuk lintasan parabola",
    caption: "Foto stroboskopik bola yang memantul-mantul (25 frame/detik) - setiap lintasan antar pantulan membentuk kurva parabola akibat gravitasi.",
    author: "MichaelMaggs (edit: Richard Bartz)", license: "CC BY-SA 3.0" },
  { id: "jmSWImPs6fQ", title: "Horizontally launched projectile",
    channel: "Khan Academy", desc: "Kasus khusus gerak parabola: benda ditembakkan mendatar (kecepatan awal vertikal nol) dari suatu ketinggian." }
)}

<h3>7. Grafik Gerak</h3>
<ul>
  <li>Grafik $x$-$t$: gradien = kecepatan sesaat.</li>
  <li>Grafik $v$-$t$: gradien = percepatan; luas di bawah kurva = perpindahan.</li>
  <li>Grafik $a$-$t$: luas di bawah kurva = perubahan kecepatan.</li>
</ul>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Velocity_vs_time_graph.svg",
    alt: "Contoh grafik kecepatan terhadap waktu",
    caption: "Contoh grafik kecepatan terhadap waktu: gradien garis menunjukkan percepatan, dan luas di bawah kurva menunjukkan perpindahan.",
    author: "Titoxd / Stannered", license: "CC BY-SA 3.0" },
  { id: "GtoamALPOP0", title: "Position vs. time graphs",
    channel: "Khan Academy", desc: "Cara membaca dan menginterpretasikan grafik posisi terhadap waktu, termasuk arti kemiringan garisnya." }
)}
`;

const KINEMATICS_EKSPERIMEN = {
  title: "Eksperimen Nyata: GLBB Troli pada Bidang Miring (Pewaktu Ketik)",
  intro: `
    <p class="muted">Ini eksperimen fisik sungguhan yang dilakukan langsung di lab/kelas dengan alat nyata,
    bukan simulasi komputer. Kalau sekolahmu belum punya alatnya, lihat bagian
    <strong>Alternatif tanpa Pewaktu Ketik</strong> di bawah yang hanya butuh stopwatch dan meteran.</p>

    <h4>Tujuan</h4>
    <p>Menyelidiki gerak troli yang meluncur menuruni bidang miring (Gerak Lurus Berubah Beraturan/GLBB),
    mengukur percepatannya dari data eksperimen, dan membandingkannya dengan nilai teoritis.</p>

    <h4>Konsep Dasar</h4>
    <p>Ketika troli meluncur menuruni bidang miring dengan sudut $\\theta$ terhadap horizontal, komponen
    gravitasi sepanjang bidang ($mg\\sin\\theta$) dilawan oleh gaya gesek kinetik ($\\mu mg\\cos\\theta$),
    sehingga percepatan teoritisnya:</p>
    <div class="formula-box">$$a = g(\\sin\\theta - \\mu\\cos\\theta)$$</div>
    <p>dengan $\\theta$ = sudut kemiringan bidang, $\\mu$ = koefisien gesekan kinetik troli-bidang, dan
    $g = 9{,}81$ m s⁻². Karena troli bergerak dari keadaan diam ($u=0$) dengan percepatan tetap, berlaku
    persamaan GLBB: $s = \\frac{1}{2}at^2$ dan $v = at$, inilah yang akan kita verifikasi lewat data pita ketik.</p>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Papan luncur/rel (runway) sepanjang kurang lebih 1 sampai 1,5 m, dan balok/buku untuk mengganjal salah satu ujungnya membentuk kemiringan (rasio landai sekitar 1:10 untuk permulaan)</li>
      <li>Troli dinamika (dynamics trolley)</li>
      <li>Pewaktu ketik (ticker-timer) beserta catu daya (power supply) AC-nya, dipasang di ujung atas bidang</li>
      <li>Pita ketik (ticker-tape) secukupnya, dan karbon/pita tinta pewaktu ketik</li>
      <li>Selotip, gunting, penggaris (ketelitian mm), busur derajat untuk mengukur sudut $\\theta$</li>
      <li>Kertas grafik/milimeter blok untuk menempel dan menganalisis potongan pita</li>
      <li>Tali/benang untuk direntangkan di ujung bawah papan (pengaman, lihat bagian Keselamatan)</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Susun papan luncur miring dengan sudut $\\theta$ kecil (sekitar 5 sampai 10 derajat), ukur sudutnya dengan busur derajat dan catat.</li>
      <li>Pasang pewaktu ketik di ujung atas papan, sambungkan ke catu daya AC. Untai/pasang pita ketik melalui pewaktu ketik dan tempelkan ujungnya ke troli.</li>
      <li>Rentangkan tali pengaman melintang di ujung bawah papan untuk menahan troli (lihat Keselamatan Kerja).</li>
      <li>Tahan troli diam tepat di ujung atas papan (dekat pewaktu ketik). Nyalakan pewaktu ketik, tunggu sampai berdetak stabil, lalu lepaskan troli bersamaan (satu siswa menyalakan alat, satu lagi menahan tali penarik pita agar tidak kusut).</li>
      <li>Biarkan troli meluncur bebas hingga hampir mencapai ujung bawah papan, lalu matikan pewaktu ketik sebelum troli ditahan tali pengaman.</li>
      <li>Lepaskan pita dari troli. Beri tanda titik awal yang jelas (titik-titik pertama biasanya berdekatan/berhimpit, pilih titik pertama yang jaraknya sudah mulai teratur bertambah sebagai titik awal analisis).</li>
      <li>Ulangi percobaan ini 2 sampai 3 kali untuk sudut yang sama (ambil rata-rata), lalu ulangi seluruh langkah untuk minimal 2 sudut $\\theta$ lain yang berbeda.</li>
    </ol>

    <h4>Cara Menganalisis Pita Ketik</h4>
    <p>Pewaktu ketik listrik AC di Indonesia membuat 50 titik per detik (frekuensi jala-jala PLN 50 Hz), jadi
    selang waktu antar-titik adalah:</p>
    <div class="formula-box">$$\\Delta t_{titik} = \\frac{1}{50\\text{ Hz}} = 0{,}02\\text{ s}$$</div>
    <p>Supaya lebih mudah dibaca dan galat pengukuran panjang per-segmen lebih kecil, potong pita menjadi
    kelompok <strong>10 selang titik (ten-tick tape)</strong>, tiap potongan mewakili $10 \\times 0{,}02 = 0{,}2$ s:</p>
    <ol>
      <li>Dari titik awal yang sudah ditandai, hitung dan gunting tiap 10 selang (11 titik jadi 1 potongan pita, potongan berikutnya mulai dari titik ke-11, dst).</li>
      <li>Tempelkan potongan-potongan pita itu berjajar tegak (vertikal) berdampingan di kertas grafik, urut dari kiri ke kanan sesuai urutan waktu, ini disebut <em>grafik batang kecepatan</em> (tape chart), karena panjang tiap potongan pita sebanding dengan kecepatan rata-rata troli selama 0,2 s itu.</li>
      <li>Ukur panjang tiap potongan pita ($\\Delta s$) dengan penggaris. Kecepatan rata-rata tiap potongan: $v = \\Delta s / 0{,}2\\text{ s}$.</li>
      <li>Plot $v$ (sumbu-y) terhadap waktu di tengah tiap interval (sumbu-x, kelipatan 0,2 s) untuk mendapatkan grafik $v$-$t$.</li>
      <li>Karena GLBB, titik-titik itu harus membentuk garis lurus. <strong>Gradien garis inilah percepatan hasil eksperimen</strong> ($a_{eksperimen} = \\Delta v / \\Delta t$).</li>
    </ol>

    <h4>Tabel Data (contoh, isi dengan data hasil percobaanmu)</h4>
    <table>
      <tr><th>Potongan ke-</th><th>Δs (cm)</th><th>t tengah interval (s)</th><th>v = Δs/0,2s (cm/s)</th></tr>
      <tr><td>1</td><td></td><td>0,1</td><td></td></tr>
      <tr><td>2</td><td></td><td>0,3</td><td></td></tr>
      <tr><td>3</td><td></td><td>0,5</td><td></td></tr>
      <tr><td>4</td><td></td><td>0,7</td><td></td></tr>
      <tr><td>5</td><td></td><td>0,9</td><td></td></tr>
    </table>
    <table>
      <tr><th>θ (°)</th><th>a teori $=g(\\sin\\theta-\\mu\\cos\\theta)$ (m s⁻²)</th><th>a eksperimen (gradien grafik v-t) (m s⁻²)</th><th>Selisih (%)</th></tr>
      <tr><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td></tr>
    </table>

    <h4>Analisis &amp; Perhitungan</h4>
    <ul>
      <li>Hitung $a_{eksperimen}$ dari gradien grafik $v$-$t$ (bukan dari dua titik saja, tarik garis lurus terbaik/<em>line of best fit</em> lewat semua titik, lalu ambil gradiennya).</li>
      <li>Untuk membandingkan dengan teori, kamu perlu memperkirakan $\\mu$ (koefisien gesekan troli-papan), bisa diperkirakan lewat percobaan terpisah "kompensasi gesekan" (miringkan papan sedikit sampai troli yang diberi dorongan pelan bergerak dengan kecepatan konstan; pada kondisi ini $mg\\sin\\theta = \\mu mg\\cos\\theta$, sehingga $\\mu = \\tan\\theta$).</li>
      <li>Hitung persentase selisih antara $a_{eksperimen}$ dan $a_{teori}$: $\\left|\\dfrac{a_{eksperimen}-a_{teori}}{a_{teori}}\\right|\\times 100\\%$.</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li>Papan luncur cukup berat, angkat/pindahkan berdua, jangan sendirian.</li>
      <li>WAJIB pasang tali/benang melintang di ujung bawah papan supaya troli tidak meluncur jatuh mengenai kaki orang lain.</li>
      <li>Pewaktu ketik memakai listrik AC (jala-jala PLN), pastikan kabel dan steker dalam kondisi baik, jangan menyentuh bagian logam pewaktu ketik saat menyala, dan matikan segera setelah selesai satu percobaan.</li>
      <li>Perhatikan jarak antar kelompok di lab supaya papan luncur dan penarik pita tidak saling bertabrakan.</li>
    </ul>

    <h4>Sumber Kesalahan (untuk didiskusikan di laporan)</h4>
    <ul>
      <li>Gesekan troli tidak benar-benar konstan di sepanjang papan (permukaan roda/rel tidak sempurna rata).</li>
      <li>Kesalahan paralaks saat mengukur panjang potongan pita atau sudut kemiringan dengan busur derajat.</li>
      <li>Titik-titik pertama pada pita seringkali terlalu rapat/tidak stabil (troli belum bergerak stabil saat pewaktu ketik baru dinyalakan), sebaiknya diabaikan dari analisis.</li>
      <li>Variasi frekuensi jala-jala PLN pada praktiknya sangat kecil dari 50 Hz nominal, sehingga biasanya diabaikan.</li>
    </ul>

    <h4>Alternatif tanpa Pewaktu Ketik (kalau alat tidak tersedia)</h4>
    <p>Kalau sekolah belum punya pewaktu ketik, percobaan serupa tetap bisa dilakukan hanya dengan
    <strong>stopwatch, papan luncur, troli/bola, dan meteran</strong>:</p>
    <ol>
      <li>Miringkan papan landai (sekitar 1:10), beri tanda jarak setiap 25 cm dari titik pelepasan (misalnya 25 cm, 50 cm, 75 cm, 100 cm, dst).</li>
      <li>Lepaskan troli/bola dari keadaan diam di titik awal, ukur waktu tempuh ke setiap tanda jarak dengan stopwatch. Ulangi tiap jarak 3 kali, ambil rata-rata waktunya untuk mengurangi galat reaksi tangan.</li>
      <li>Hitung kecepatan rata-rata tiap segmen 25 cm ($v = \\Delta s/\\Delta t$), lalu buat grafik $v$ terhadap $t$ (waktu di tengah tiap segmen), gradiennya adalah percepatan, sama seperti metode pita ketik.</li>
      <li>Cara ini lebih sederhana tapi kurang presisi (galat reaksi stopwatch cukup besar untuk gerak cepat), cocok sebagai alternatif, bukan pengganti yang setara.</li>
    </ol>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Pada sudut berapa troli tepat akan mulai bergerak dengan kecepatan konstan (percepatan = 0)? Apa artinya kondisi $\\tan\\theta = \\mu$ secara fisis?</li>
      <li>Mengapa titik-titik pertama pada pita ketik biasanya tidak dipakai dalam analisis?</li>
      <li>Jika grafik $v$-$t$ hasil eksperimenmu tidak melewati titik asal (0,0), apa kemungkinan penyebabnya?</li>
      <li>Bagaimana pengaruh memperbesar sudut $\\theta$ terhadap persentase kontribusi gesekan pada percepatan total?</li>
    </ul>

    <h4>Simulasi Prediksi (opsional)</h4>
    <p class="muted">Sebelum atau sesudah praktikum, kamu bisa coba simulasi interaktif di bawah ini untuk
    memprediksi/mengecek percepatan teoritis pada berbagai $\\theta$ dan $\\mu$, tapi ingat, ini hanya model
    komputer untuk membantu prediksi, <strong>bukan pengganti data eksperimen nyata di atas</strong>.</p>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://spark.iop.org/finding-average-acceleration-ticker-timer" target="_blank" rel="noopener">Finding average acceleration with a ticker-timer, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/timing-trolley-slope" target="_blank" rel="noopener">Timing a trolley on a slope, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/ticker-timers-investigating-speed" target="_blank" rel="noopener">Ticker-timers for investigating speed, IOPSpark</a></li>
    </ul>
  `
};

/* type: "mcq" atau "structured".
   Untuk mcq: options[] dan correct = index jawaban benar. */
const KINEMATICS_LATIHAN = [
  {
    type: "mcq",
    question: "Sebuah mobil bergerak dari keadaan diam dan mengalami percepatan tetap hingga mencapai kecepatan 20 m s⁻¹ dalam waktu 8 s. Berapakah percepatan mobil tersebut?",
    options: ["0.4 m s⁻²", "2.0 m s⁻²", "2.5 m s⁻²", "160 m s⁻²"],
    correct: 2,
    solution: `Gunakan $v = u + at$ dengan $u = 0$, $v = 20~\\text{m s}^{-1}$, $t = 8~\\text{s}$.
    <br>$a = \\dfrac{v-u}{t} = \\dfrac{20-0}{8} = 2.5~\\text{m s}^{-2}$.`
  },
  {
    type: "mcq",
    question: "Menggunakan data soal sebelumnya (dipercepat dari diam menjadi 20 m s⁻¹ dalam 8 s), berapa jarak yang ditempuh mobil selama 8 s tersebut?",
    options: ["40 m", "80 m", "160 m", "200 m"],
    correct: 1,
    solution: `Gunakan $s = \\tfrac{1}{2}(u+v)t = \\tfrac{1}{2}(0+20)(8) = 80~\\text{m}$.
    <br>Bisa juga dicek dengan $s = ut + \\tfrac12 at^2 = 0 + \\tfrac12(2.5)(8^2) = 80~\\text{m}$, hasil konsisten.`
  },
  {
    type: "structured",
    question: "Sebuah batu dijatuhkan (tanpa kecepatan awal) dari puncak tebing setinggi 45 m. Ambil $g = 9.81~\\text{m s}^{-2}$ dan abaikan hambatan udara. Tentukan (a) waktu batu sampai ke dasar tebing, (b) kecepatan batu saat menyentuh tanah.",
    solution: `<strong>(a)</strong> $h = \\tfrac12 gt^2 \\Rightarrow t = \\sqrt{\\dfrac{2h}{g}} = \\sqrt{\\dfrac{2(45)}{9.81}} = \\sqrt{9.17} \\approx 3.03~\\text{s}$.
    <br><strong>(b)</strong> $v = gt = 9.81 \\times 3.03 \\approx 29.7~\\text{m s}^{-1}$
    <br>atau langsung: $v = \\sqrt{2gh} = \\sqrt{2(9.81)(45)} = \\sqrt{882.9} \\approx 29.7~\\text{m s}^{-1}$, konsisten.`
  },
  {
    type: "structured",
    question: "Sebuah bola ditendang secara horizontal dari atas tebing setinggi 20 m dengan kecepatan 15 m s⁻¹. Ambil $g = 9.81~\\text{m s}^{-2}$. Tentukan (a) waktu bola berada di udara, (b) jarak horizontal (jangkauan) bola saat mendarat.",
    solution: `<strong>(a)</strong> Gerak vertikal tidak bergantung pada gerak horizontal. $h = \\tfrac12 gt^2 \\Rightarrow t = \\sqrt{\\dfrac{2(20)}{9.81}} = \\sqrt{4.077} \\approx 2.02~\\text{s}$.
    <br><strong>(b)</strong> Gerak horizontal adalah GLB: $x = v_x \\, t = 15 \\times 2.02 \\approx 30.3~\\text{m}$.`
  },
  {
    type: "structured",
    question: "Data kecepatan-waktu sebuah benda: $t$ (s) = 0, 1, 2, 3, 4 dan $v$ (m s⁻¹) = 0, 5, 10, 15, 20. Tentukan (a) percepatan benda, (b) jarak total yang ditempuh dalam 4 s.",
    solution: `<strong>(a)</strong> Kecepatan bertambah 5 m s⁻¹ setiap 1 s (uniform), jadi $a = \\dfrac{\\Delta v}{\\Delta t} = \\dfrac{5}{1} = 5~\\text{m s}^{-2}$.
    <br><strong>(b)</strong> Jarak = luas di bawah grafik $v$-$t$ (bentuk segitiga) $= \\tfrac12 \\times 4 \\times 20 = 40~\\text{m}$.
    <br>Cek dengan $s = ut + \\tfrac12 at^2 = 0 + \\tfrac12(5)(4^2) = 40~\\text{m}$, konsisten.`
  },
  {
    type: "structured",
    question: "Sebuah bola dilempar vertikal ke atas dengan kecepatan awal 24.5 m s⁻¹ dari permukaan tanah. Ambil $g = 9.81~\\text{m s}^{-2}$ dan abaikan hambatan udara. Tentukan (a) waktu untuk mencapai titik tertinggi, (b) tinggi maksimum yang dicapai, (c) total waktu bola berada di udara sebelum kembali ke titik lempar.",
    solution: `<strong>(a)</strong> Di titik tertinggi $v = 0$: $v = u - gt \\Rightarrow t = \\dfrac{u}{g} = \\dfrac{24.5}{9.81} \\approx 2.50~\\text{s}$.
    <br><strong>(b)</strong> $H = \\dfrac{u^2}{2g} = \\dfrac{24.5^2}{2(9.81)} = \\dfrac{600.25}{19.62} \\approx 30.6~\\text{m}$.
    <br><strong>(c)</strong> Karena gerak simetris (naik = turun): $T = 2t = 2(2.50) \\approx 5.00~\\text{s}$.`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & nilai yang sudah divalidasi guru, bukan menebak dari pengetahuan umum. */
const KINEMATICS_FORMULA_SHEET = `
- Besaran: jarak & kelajuan (skalar); perpindahan, kecepatan, percepatan (vektor).
- GLB (kecepatan konstan): v = s / t
- GLBB (percepatan konstan), 4 persamaan: v = u + a t ; s = u t + 1/2 a t^2 ; v^2 = u^2 + 2 a s ; s = 1/2 (u+v) t
  (u = kecepatan awal, v = kecepatan akhir, a = percepatan, s = perpindahan, t = waktu)
- Gerak jatuh bebas (kasus khusus GLBB, u=0, a=g): h = 1/2 g t^2 ; v = g t ; v^2 = 2 g h
- Gerak vertikal ke atas: perlambatan g melawan arah gerak; di titik tertinggi v=0; waktu naik = waktu turun (tanpa hambatan udara)
- Gerak parabola (horizontal GLB + vertikal GLBB independen), dengan sudut elevasi θ dan kecepatan awal u:
  waktu di udara T = 2 u sin(θ) / g ; tinggi maksimum H = (u sin θ)^2 / (2g) ; jangkauan R = u^2 sin(2θ) / g
- Nilai standar g = 9.81 m/s^2 (data sheet Cambridge), kecuali diminta lain oleh pengguna.
- Grafik: gradien x-t = kecepatan; gradien v-t = percepatan; luas di bawah v-t = perpindahan.
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const KINEMATICS_LAB_CONCEPTS = [
  "Gerak Lurus Beraturan (GLB)",
  "Gerak Lurus Berubah Beraturan (GLBB)",
  "Gerak Jatuh Bebas",
  "Gerak Vertikal ke Atas",
  "Gerak Parabola (Projectile Motion)",
  "Hubungan grafik x-t, v-t, dan a-t",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

// Default konsep generik untuk topik yang belum "ready" (masih bisa dicoba di Lab)
const DEFAULT_LAB_CONCEPTS = ["Konsep umum topik ini (jelaskan di instruksi tambahan)"];

/* Tempelkan konten lengkap ke objek topik "kinematics" */

/* ---- English (_EN) translations for KINEMATICS (auto-merged by merge_i18n.py) ---- */
/* ------------------------------------------------------------
   English translation of KINEMATICS topic content
   (Cambridge International AS & A Level Physics 9702)
   ------------------------------------------------------------ */

const KINEMATICS_DESC_EN = "Describing motion: distance, displacement, velocity, acceleration, uniform velocity motion, uniformly accelerated motion, free fall, and projectile motion.";

const KINEMATICS_MATERI_EN = `
<h3>1. Basic Quantities of Kinematics</h3>
<table>
  <tr><th>Quantity</th><th>Type</th><th>Brief definition</th><th>SI unit</th></tr>
  <tr><td>Distance</td><td>Scalar</td><td>Total path length travelled</td><td>m</td></tr>
  <tr><td>Displacement</td><td>Vector</td><td>Change of position from the initial to the final point</td><td>m</td></tr>
  <tr><td>Speed</td><td>Scalar</td><td>Distance / time</td><td>m s⁻¹</td></tr>
  <tr><td>Velocity</td><td>Vector</td><td>Displacement / time</td><td>m s⁻¹</td></tr>
  <tr><td>Acceleration</td><td>Vector</td><td>Rate of change of velocity</td><td>m s⁻²</td></tr>
</table>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/40/Distancedisplacement.svg",
    alt: "Diagram of distance vs displacement",
    caption: "Comparison of distance (total path length, dashed line) with displacement (straight line from initial to final position).",
    author: "Stannered", license: "CC BY-SA 3.0" },
  { id: "vQCkYm3v3aA", title: "Distance and displacement introduction",
    channel: "Khan Academy", desc: "A basic explanation of the difference between distance (scalar) and displacement (vector) with simple examples." }
)}

<h3>2. Uniform Velocity Motion</h3>
<p>Constant velocity, zero acceleration. The $x$-$t$ graph is a straight line (gradient = velocity).</p>
<div class="formula-box">$$v = \\dfrac{s}{t}$$</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/00/Uniform-motion.svg",
    alt: "x-t, v-t, a-t graphs for uniform velocity motion",
    caption: "Three motion graphs (position-time, velocity-time, acceleration-time) for an object moving with constant velocity (uniform velocity motion).",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "pfTTHx9kCHk", title: "Instantaneous speed and velocity",
    channel: "Khan Academy", desc: "Distinguishing instantaneous speed/velocity from average speed/velocity, the foundation for understanding motion at constant velocity." }
)}

<h3>3. Uniformly Accelerated Motion</h3>
<p>Constant acceleration. The four equations of uniformly accelerated motion (as given in the Cambridge 9702 <em>List of Formulae</em>):</p>
<div class="formula-box">
$$v = u + at$$
$$s = ut + \\tfrac{1}{2}at^2$$
$$v^2 = u^2 + 2as$$
$$s = \\tfrac{1}{2}(u+v)t$$
</div>
<p>where $u$ = initial velocity, $v$ = final velocity, $a$ = acceleration, $s$ = displacement, $t$ = time.</p>
<p class="muted">Problem-solving tip: first write down the known variables (u, v, a, s, t), then choose the equation that does not involve the variable that is unknown/not asked for.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/Uniform-acceleration.svg",
    alt: "x-t, v-t, a-t graphs for motion with constant acceleration",
    caption: "Three motion graphs for an object with constant acceleration (uniformly accelerated motion): note the parabolic x-t graph and the straight, sloped v-t graph.",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "MAS6mBRZZXA", title: "Average velocity for constant acceleration",
    channel: "Khan Academy", desc: "Deriving the average velocity relationship for motion with constant acceleration, the basis of the equations of uniformly accelerated motion." }
)}

<h3>4. Free Fall</h3>
<p>A special case of uniformly accelerated motion with $a = g = 9.81~\\text{m s}^{-2}$ (the standard value on the Cambridge data sheet), initial velocity $u = 0$, with the downward direction taken as positive.</p>
<div class="formula-box">
$$h = \\tfrac{1}{2}gt^2 \\qquad v = gt \\qquad v^2 = 2gh$$
</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/02/Falling_ball.jpg",
    alt: "Stroboscopic photo of a ball in free fall",
    caption: "Stroboscopic photo of a ball released in free fall (20 flashes/second). The gap between successive ball positions grows with time, consistent with $h \\propto t^2$.",
    author: "Michael N Maggs", license: "CC BY-SA 3.0" },
  { id: "tKIT68tYKnQ", title: "Free fall 1 body - solved example",
    channel: "Khan Academy", desc: "A guided worked example calculating time and velocity in free fall." }
)}

<h3>5. Vertical Motion Upwards</h3>
<p>The acceleration $g$ is constant but acts opposite to the initial velocity (a deceleration). At the highest point, $v = 0$. Because the motion is symmetric (no air resistance), the time to rise equals the time to fall.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/28/Vertical-projectile-motion-graphs.jpg",
    alt: "Position and velocity graphs for vertical motion upwards",
    caption: "Position-time and velocity-time graphs for an object thrown straight up, which then falls back down under gravity.",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "2zj4mjBRuL4", title: "Vertical motion under gravity - ball thrown upwards from a balcony",
    channel: "ExamSolutions", desc: "A worked example of vertical motion under gravity for a ball thrown upwards from a balcony." }
)}

<h3>6. Projectile Motion</h3>
<p>Two-dimensional motion: the horizontal component (constant velocity, uniform velocity motion) and the vertical component (acceleration $g$, uniformly accelerated motion) are <strong>independent</strong> of each other.</p>
<div class="formula-box">
$$\\text{Time of flight: } T = \\dfrac{2u\\sin\\theta}{g} \\qquad
\\text{Maximum height: } H = \\dfrac{(u\\sin\\theta)^2}{2g} \\qquad
\\text{Range: } R = \\dfrac{u^2\\sin 2\\theta}{g}$$
</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Parabolic_trajectory.svg",
    alt: "Diagram of a projectile's parabolic trajectory",
    caption: "Diagram of a projectile's parabolic trajectory, complete with the velocity vector at one point along the path.",
    author: "Oleg Alexandrov", license: "Public Domain" },
  { id: "ZZ39o1rAZWY", title: "Projectile at an angle",
    channel: "Khan Academy", desc: "Resolving the motion of a projectile launched at an angle of elevation into horizontal and vertical components." }
)}
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Bouncing_ball_strobe_edit.jpg",
    alt: "Stroboscopic photo of a bouncing ball tracing parabolic paths",
    caption: "Stroboscopic photo of a bouncing ball (25 frames/second) - each arc between bounces forms a parabolic curve due to gravity.",
    author: "MichaelMaggs (edit: Richard Bartz)", license: "CC BY-SA 3.0" },
  { id: "jmSWImPs6fQ", title: "Horizontally launched projectile",
    channel: "Khan Academy", desc: "A special case of projectile motion: an object launched horizontally (zero initial vertical velocity) from some height." }
)}

<h3>7. Motion Graphs</h3>
<ul>
  <li>$x$-$t$ graph: gradient = instantaneous velocity.</li>
  <li>$v$-$t$ graph: gradient = acceleration; area under the curve = displacement.</li>
  <li>$a$-$t$ graph: area under the curve = change in velocity.</li>
</ul>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Velocity_vs_time_graph.svg",
    alt: "Example velocity-time graph",
    caption: "An example velocity-time graph: the gradient of the line shows the acceleration, and the area under the curve shows the displacement.",
    author: "Titoxd / Stannered", license: "CC BY-SA 3.0" },
  { id: "GtoamALPOP0", title: "Position vs. time graphs",
    channel: "Khan Academy", desc: "How to read and interpret position-time graphs, including the meaning of the gradient of the line." }
)}
`;

const KINEMATICS_EKSPERIMEN_EN = {
  title: "Real Experiment: Uniformly Accelerated Motion of a Trolley on an Inclined Plane (Ticker-Timer)",
  intro: `
    <p class="muted">This is a genuine physical experiment carried out in a lab/classroom with real apparatus,
    not a computer simulation. If your school does not yet have the equipment, see the
    <strong>Alternative without a Ticker-Timer</strong> section below, which needs only a stopwatch and a tape measure.</p>

    <h4>Aim</h4>
    <p>To investigate the motion of a trolley sliding down an inclined plane (uniformly accelerated motion),
    to measure its acceleration from experimental data, and to compare it with the theoretical value.</p>

    <h4>Underlying Concept</h4>
    <p>When a trolley slides down an inclined plane at angle $\\theta$ to the horizontal, the component of
    gravity along the plane ($mg\\sin\\theta$) is opposed by the kinetic friction force ($\\mu mg\\cos\\theta$),
    so the theoretical acceleration is:</p>
    <div class="formula-box">$$a = g(\\sin\\theta - \\mu\\cos\\theta)$$</div>
    <p>where $\\theta$ = angle of inclination of the plane, $\\mu$ = coefficient of kinetic friction between the trolley and the plane, and
    $g = 9.81$ m s⁻². Since the trolley starts from rest ($u=0$) with constant acceleration, the
    equations of uniformly accelerated motion apply: $s = \\frac{1}{2}at^2$ and $v = at$, and these are what we will verify using the ticker-tape data.</p>

    <h4>Apparatus &amp; Materials</h4>
    <ul>
      <li>A runway/track about 1 to 1.5 m long, and a block/book to raise one end to form an incline (a slope ratio of about 1:10 to begin with)</li>
      <li>A dynamics trolley</li>
      <li>A ticker-timer with its AC power supply, mounted at the top end of the plane</li>
      <li>Enough ticker-tape, and carbon disc/inked tape for the ticker-timer</li>
      <li>Tape, scissors, a ruler (mm precision), a protractor for measuring the angle $\\theta$</li>
      <li>Graph paper/grid paper for sticking down and analysing the tape sections</li>
      <li>String/thread to stretch across the lower end of the board (a safety catch, see the Safety section)</li>
    </ul>

    <h4>Procedure</h4>
    <ol>
      <li>Set up the runway inclined at a small angle $\\theta$ (about 5 to 10 degrees), measure the angle with a protractor and record it.</li>
      <li>Mount the ticker-timer at the top end of the board and connect it to the AC power supply. Thread the ticker-tape through the ticker-timer and attach its end to the trolley.</li>
      <li>Stretch the safety string across the lower end of the board to catch the trolley (see Safety Precautions).</li>
      <li>Hold the trolley stationary right at the top of the board (near the ticker-timer). Switch on the ticker-timer, wait until it is ticking steadily, then release the trolley at the same moment (one student switches on the apparatus while another holds the tape so it does not tangle).</li>
      <li>Let the trolley slide freely until it almost reaches the bottom of the board, then switch off the ticker-timer before the trolley is caught by the safety string.</li>
      <li>Remove the tape from the trolley. Mark a clear starting point (the first few dots are usually close together/overlapping, so choose the first dot where the spacing has begun to increase regularly as the starting point for analysis).</li>
      <li>Repeat this experiment 2 to 3 times for the same angle (take the average), then repeat the whole procedure for at least 2 other different angles $\\theta$.</li>
    </ol>

    <h4>How to Analyse the Ticker-Tape</h4>
    <p>An AC-powered ticker-timer makes 50 dots per second (mains supply frequency of 50 Hz), so
    the time interval between dots is:</p>
    <div class="formula-box">$$\\Delta t_{dot} = \\frac{1}{50\\text{ Hz}} = 0.02\\text{ s}$$</div>
    <p>To make the tape easier to read and to reduce the measurement error in the length of each segment, cut the tape into
    groups of <strong>10 tick intervals (ten-tick tape)</strong>, with each section representing $10 \\times 0.02 = 0.2$ s:</p>
    <ol>
      <li>Starting from the marked starting point, count off and cut every 10 intervals (11 dots make up 1 tape section, the next section starts from the 11th dot, and so on).</li>
      <li>Stick these tape sections side by side, upright (vertically), on graph paper in time order from left to right; this is called a <em>velocity bar chart</em> (tape chart), because the length of each tape section is proportional to the trolley's average velocity during that 0.2 s interval.</li>
      <li>Measure the length of each tape section ($\\Delta s$) with a ruler. The average velocity for each section is $v = \\Delta s / 0.2\\text{ s}$.</li>
      <li>Plot $v$ (y-axis) against the time at the midpoint of each interval (x-axis, multiples of 0.2 s) to obtain a $v$-$t$ graph.</li>
      <li>Because this is uniformly accelerated motion, the points should form a straight line. <strong>The gradient of this line is the experimental acceleration</strong> ($a_{experiment} = \\Delta v / \\Delta t$).</li>
    </ol>

    <h4>Data Table (example, fill in with your own experimental data)</h4>
    <table>
      <tr><th>Section no.</th><th>Δs (cm)</th><th>t at midpoint of interval (s)</th><th>v = Δs/0.2s (cm/s)</th></tr>
      <tr><td>1</td><td></td><td>0.1</td><td></td></tr>
      <tr><td>2</td><td></td><td>0.3</td><td></td></tr>
      <tr><td>3</td><td></td><td>0.5</td><td></td></tr>
      <tr><td>4</td><td></td><td>0.7</td><td></td></tr>
      <tr><td>5</td><td></td><td>0.9</td><td></td></tr>
    </table>
    <table>
      <tr><th>θ (°)</th><th>a theory $=g(\\sin\\theta-\\mu\\cos\\theta)$ (m s⁻²)</th><th>a experiment (gradient of v-t graph) (m s⁻²)</th><th>Difference (%)</th></tr>
      <tr><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td></tr>
    </table>

    <h4>Analysis &amp; Calculation</h4>
    <ul>
      <li>Calculate $a_{experiment}$ from the gradient of the $v$-$t$ graph (not from just two points; draw the best straight line/<em>line of best fit</em> through all the points, then take its gradient).</li>
      <li>To compare with theory, you need to estimate $\\mu$ (the coefficient of friction between the trolley and the board), which can be estimated with a separate "friction compensation" trial (tilt the board slightly until a gently-pushed trolley moves at constant velocity; under this condition $mg\\sin\\theta = \\mu mg\\cos\\theta$, so $\\mu = \\tan\\theta$).</li>
      <li>Calculate the percentage difference between $a_{experiment}$ and $a_{theory}$: $\\left|\\dfrac{a_{experiment}-a_{theory}}{a_{theory}}\\right|\\times 100\\%$.</li>
    </ul>

    <h4>Safety Precautions</h4>
    <ul>
      <li>The runway is fairly heavy; carry/move it with two people, not alone.</li>
      <li>You MUST stretch a string/thread across the lower end of the board so the trolley cannot slide off and strike someone's foot.</li>
      <li>The ticker-timer uses AC mains electricity; make sure the cable and plug are in good condition, do not touch the metal parts of the ticker-timer while it is switched on, and switch it off immediately after each trial.</li>
      <li>Keep enough distance between groups in the lab so that runways and tape-pullers do not collide with each other.</li>
    </ul>

    <h4>Sources of Error (for discussion in your report)</h4>
    <ul>
      <li>Friction on the trolley is not perfectly constant along the board (the wheel/rail surface is not perfectly smooth).</li>
      <li>Parallax error when measuring the length of tape sections or the angle of inclination with a protractor.</li>
      <li>The first few dots on the tape are often too close together/unstable (the trolley has not yet reached steady motion when the ticker-timer is first switched on), so they should be excluded from the analysis.</li>
      <li>In practice the mains supply frequency varies only very slightly from the nominal 50 Hz, so this is usually neglected.</li>
    </ul>

    <h4>Alternative without a Ticker-Timer (if the apparatus is unavailable)</h4>
    <p>If your school does not yet have a ticker-timer, a similar experiment can still be carried out using only a
    <strong>stopwatch, a runway, a trolley/ball, and a tape measure</strong>:</p>
    <ol>
      <li>Incline the board gently (about 1:10), and mark distances every 25 cm from the release point (e.g. 25 cm, 50 cm, 75 cm, 100 cm, and so on).</li>
      <li>Release the trolley/ball from rest at the starting point, and time how long it takes to reach each distance mark with a stopwatch. Repeat each distance 3 times and take the average time to reduce reaction-time error.</li>
      <li>Calculate the average velocity for each 25 cm segment ($v = \\Delta s/\\Delta t$), then plot a graph of $v$ against $t$ (time at the midpoint of each segment); the gradient is the acceleration, just as with the ticker-tape method.</li>
      <li>This method is simpler but less precise (stopwatch reaction-time error is quite significant for fast motion), so it is suitable as an alternative, not an equivalent replacement.</li>
    </ol>

    <h4>Discussion Questions</h4>
    <ul>
      <li>At what angle would the trolley just begin to move at constant velocity (acceleration = 0)? What does the condition $\\tan\\theta = \\mu$ mean physically?</li>
      <li>Why are the first few dots on the ticker-tape usually not used in the analysis?</li>
      <li>If your experimental $v$-$t$ graph does not pass through the origin (0,0), what could be the possible cause?</li>
      <li>How does increasing the angle $\\theta$ affect the percentage contribution of friction to the total acceleration?</li>
    </ul>

    <h4>Prediction Simulation (optional)</h4>
    <p class="muted">Before or after the practical, you can try the interactive simulation below to
    predict/check the theoretical acceleration for various values of $\\theta$ and $\\mu$, but remember, this is only a
    computer model to help with predictions, <strong>not a substitute for the real experimental data above</strong>.</p>

    <h4>References</h4>
    <ul>
      <li><a href="https://spark.iop.org/finding-average-acceleration-ticker-timer" target="_blank" rel="noopener">Finding average acceleration with a ticker-timer, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/timing-trolley-slope" target="_blank" rel="noopener">Timing a trolley on a slope, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/ticker-timers-investigating-speed" target="_blank" rel="noopener">Ticker-timers for investigating speed, IOPSpark</a></li>
    </ul>
  `
};
// Note: in the original file, topic.eksperimen.simHTML is set separately to the
// INCLINE_TROLLEY_SIM variable after attaching KINEMATICS_EKSPERIMEN_EN to the topic
// object; that reference is left unchanged and is NOT redefined here.

/* type: "mcq" or "structured".
   For mcq: options[] and correct = index of the correct answer. */
const KINEMATICS_LATIHAN_EN = [
  {
    type: "mcq",
    question: "A car starts from rest and undergoes constant acceleration until it reaches a velocity of 20 m s⁻¹ in a time of 8 s. What is the acceleration of the car?",
    options: ["0.4 m s⁻²", "2.0 m s⁻²", "2.5 m s⁻²", "160 m s⁻²"],
    correct: 2,
    solution: `Use $v = u + at$ with $u = 0$, $v = 20~\\text{m s}^{-1}$, $t = 8~\\text{s}$.
    <br>$a = \\dfrac{v-u}{t} = \\dfrac{20-0}{8} = 2.5~\\text{m s}^{-2}$.`
  },
  {
    type: "mcq",
    question: "Using the data from the previous question (accelerating from rest to 20 m s⁻¹ in 8 s), what distance does the car travel during those 8 s?",
    options: ["40 m", "80 m", "160 m", "200 m"],
    correct: 1,
    solution: `Use $s = \\tfrac{1}{2}(u+v)t = \\tfrac{1}{2}(0+20)(8) = 80~\\text{m}$.
    <br>This can also be checked with $s = ut + \\tfrac12 at^2 = 0 + \\tfrac12(2.5)(8^2) = 80~\\text{m}$, a consistent result.`
  },
  {
    type: "structured",
    question: "A stone is dropped (with no initial velocity) from the top of a cliff 45 m high. Take $g = 9.81~\\text{m s}^{-2}$ and neglect air resistance. Find (a) the time for the stone to reach the base of the cliff, (b) the velocity of the stone as it hits the ground.",
    solution: `<strong>(a)</strong> $h = \\tfrac12 gt^2 \\Rightarrow t = \\sqrt{\\dfrac{2h}{g}} = \\sqrt{\\dfrac{2(45)}{9.81}} = \\sqrt{9.17} \\approx 3.03~\\text{s}$.
    <br><strong>(b)</strong> $v = gt = 9.81 \\times 3.03 \\approx 29.7~\\text{m s}^{-1}$
    <br>or directly: $v = \\sqrt{2gh} = \\sqrt{2(9.81)(45)} = \\sqrt{882.9} \\approx 29.7~\\text{m s}^{-1}$, which is consistent.`
  },
  {
    type: "structured",
    question: "A ball is kicked horizontally from the top of a cliff 20 m high with a velocity of 15 m s⁻¹. Take $g = 9.81~\\text{m s}^{-2}$. Find (a) the time the ball is in the air, (b) the horizontal distance (range) travelled by the ball when it lands.",
    solution: `<strong>(a)</strong> The vertical motion does not depend on the horizontal motion. $h = \\tfrac12 gt^2 \\Rightarrow t = \\sqrt{\\dfrac{2(20)}{9.81}} = \\sqrt{4.077} \\approx 2.02~\\text{s}$.
    <br><strong>(b)</strong> The horizontal motion is uniform velocity motion: $x = v_x \\, t = 15 \\times 2.02 \\approx 30.3~\\text{m}$.`
  },
  {
    type: "structured",
    question: "The velocity-time data of an object are: $t$ (s) = 0, 1, 2, 3, 4 and $v$ (m s⁻¹) = 0, 5, 10, 15, 20. Find (a) the acceleration of the object, (b) the total distance travelled in 4 s.",
    solution: `<strong>(a)</strong> The velocity increases by 5 m s⁻¹ every 1 s (uniformly), so $a = \\dfrac{\\Delta v}{\\Delta t} = \\dfrac{5}{1} = 5~\\text{m s}^{-2}$.
    <br><strong>(b)</strong> Distance = area under the $v$-$t$ graph (a triangle) $= \\tfrac12 \\times 4 \\times 20 = 40~\\text{m}$.
    <br>Check with $s = ut + \\tfrac12 at^2 = 0 + \\tfrac12(5)(4^2) = 40~\\text{m}$, which is consistent.`
  },
  {
    type: "structured",
    question: "A ball is thrown vertically upwards with an initial velocity of 24.5 m s⁻¹ from ground level. Take $g = 9.81~\\text{m s}^{-2}$ and neglect air resistance. Find (a) the time taken to reach the highest point, (b) the maximum height reached, (c) the total time the ball is in the air before returning to the point of projection.",
    solution: `<strong>(a)</strong> At the highest point $v = 0$: $v = u - gt \\Rightarrow t = \\dfrac{u}{g} = \\dfrac{24.5}{9.81} \\approx 2.50~\\text{s}$.
    <br><strong>(b)</strong> $H = \\dfrac{u^2}{2g} = \\dfrac{24.5^2}{2(9.81)} = \\dfrac{600.25}{19.62} \\approx 30.6~\\text{m}$.
    <br><strong>(c)</strong> Because the motion is symmetric (time up = time down): $T = 2t = 2(2.50) \\approx 5.00~\\text{s}$.`
  }
];

/* Concise formula sheet (plain text), used as automatic "grounding":
   appended to the prompt sent to the AI so that it uses exactly the
   formulas & values already validated by the teacher, instead of guessing
   from general knowledge. */
const KINEMATICS_FORMULA_SHEET_EN = `
- Quantities: distance & speed (scalar); displacement, velocity, acceleration (vector).
- Uniform velocity motion (constant velocity): v = s / t
- Uniformly accelerated motion (constant acceleration), 4 equations: v = u + a t ; s = u t + 1/2 a t^2 ; v^2 = u^2 + 2 a s ; s = 1/2 (u+v) t
  (u = initial velocity, v = final velocity, a = acceleration, s = displacement, t = time)
- Free fall (special case of uniformly accelerated motion, u=0, a=g): h = 1/2 g t^2 ; v = g t ; v^2 = 2 g h
- Vertical motion upwards: deceleration g acts opposite to the direction of motion; at the highest point v=0; time up = time down (with no air resistance)
- Projectile motion (independent horizontal uniform velocity motion + vertical uniformly accelerated motion), with angle of elevation θ and initial velocity u:
  time of flight T = 2 u sin(θ) / g ; maximum height H = (u sin θ)^2 / (2g) ; range R = u^2 sin(2θ) / g
- Standard value g = 9.81 m/s^2 (Cambridge data sheet), unless otherwise requested by the user.
- Graphs: gradient of x-t = velocity; gradient of v-t = acceleration; area under v-t = displacement.
`;

/* Topic-specific concepts for the Prompt Generator dropdown in the Virtual Simulation Lab */
const KINEMATICS_LAB_CONCEPTS_EN = [
  "Uniform Velocity Motion",
  "Uniformly Accelerated Motion",
  "Free Fall",
  "Vertical Motion Upwards",
  "Projectile Motion",
  "Relationship between x-t, v-t, and a-t graphs",
  "Other (write your own in the additional instructions)"
];

const KINEMATICS_MATERI_CHECK = [
  { question: "Sebuah benda bergerak lurus berubah beraturan (GLBB) dari keadaan diam. Besaran apa yang ditunjukkan oleh GRADIEN grafik kecepatan (v) terhadap waktu (t)?",
    options: ["Jarak tempuh", "Percepatan", "Kecepatan rata-rata", "Perpindahan"], correct: 1,
    explanation: "Gradien grafik v-t adalah Δv/Δt, yaitu definisi percepatan." },
  { question: "Seorang pelari mengelilingi lintasan berbentuk lingkaran sampai kembali persis ke titik start. Bagaimana perbandingan jarak dan perpindahannya?",
    options: ["Perpindahan = keliling lingkaran, sama dengan jarak", "Perpindahan = nol, sedangkan jarak = keliling lingkaran", "Perpindahan dan jarak keduanya nol", "Perpindahan negatif, jarak positif"], correct: 1,
    explanation: "Karena pelari kembali tepat ke titik awal, perubahan posisinya (perpindahan) = nol, meskipun jarak total yang ditempuh sama dengan keliling lintasan." },
  { question: "Sebuah bola dijatuhkan bebas dari keadaan diam. Berapa kelajuannya setelah jatuh selama 2 sekon (g = 9,81 m s⁻²)?",
    options: ["9,81 m s⁻¹", "19,6 m s⁻¹", "29,4 m s⁻¹", "39,2 m s⁻¹"], correct: 1,
    explanation: "v = u + gt = 0 + (9,81 × 2) = 19,62 ≈ 19,6 m s⁻¹ (u = 0 karena jatuh bebas dari diam)." },
  { question: "Bola A dijatuhkan bebas (kecepatan awal nol) dan bola B ditembakkan mendatar (horizontal) pada saat bersamaan dari ketinggian yang sama. Manakah pernyataan yang benar tentang saat keduanya menyentuh tanah?",
    options: ["Bola A lebih dulu, karena tidak punya kecepatan horizontal", "Bola B lebih dulu, karena bergerak lebih cepat secara keseluruhan", "Keduanya bersamaan, karena gerak vertikal dan horizontal saling independen dan komponen vertikal keduanya identik", "Tidak bisa ditentukan tanpa tahu kelajuan horizontal bola B"], correct: 2,
    explanation: "Gerak horizontal dan vertikal bersifat independen. Kedua bola punya kecepatan vertikal awal nol dan percepatan vertikal yang sama (g), sehingga waktu jatuhnya sama meski jarak horizontalnya berbeda." },
  { question: "Pada grafik kecepatan (v) terhadap waktu (t), luas daerah di bawah kurva menunjukkan besaran...",
    options: ["Percepatan", "Perpindahan", "Kelajuan rata-rata", "Massa benda"], correct: 1,
    explanation: "Luas di bawah grafik v-t sama dengan perpindahan benda pada selang waktu tersebut." }
];
const KINEMATICS_MATERI_CHECK_EN = [
  { question: "An object moves with uniform acceleration (constant a) starting from rest. What quantity is shown by the GRADIENT of a velocity (v) vs time (t) graph?",
    options: ["Distance travelled", "Acceleration", "Average velocity", "Displacement"],
    explanation: "The gradient of a v-t graph is Δv/Δt, which is the definition of acceleration." },
  { question: "A runner goes all the way around a circular track and returns exactly to the starting point. How do their distance and displacement compare?",
    options: ["Displacement equals the circle's circumference, same as distance", "Displacement is zero, while distance equals the circle's circumference", "Both displacement and distance are zero", "Displacement is negative, distance is positive"],
    explanation: "Since the runner returns exactly to the start, the change in position (displacement) is zero, even though the total distance travelled equals the track's circumference." },
  { question: "A ball is dropped from rest in free fall. What is its speed after falling for 2 seconds (g = 9.81 m s⁻²)?",
    options: ["9.81 m s⁻¹", "19.6 m s⁻¹", "29.4 m s⁻¹", "39.2 m s⁻¹"],
    explanation: "v = u + gt = 0 + (9.81 × 2) = 19.62 ≈ 19.6 m s⁻¹ (u = 0 since it's dropped from rest)." },
  { question: "Ball A is dropped from rest and ball B is fired horizontally at the same instant from the same height. Which statement about when they hit the ground is correct?",
    options: ["A hits first, since it has no horizontal velocity", "B hits first, since it moves faster overall", "They hit at the same time, since the horizontal and vertical motions are independent and their vertical components are identical", "It can't be determined without knowing B's horizontal speed"],
    explanation: "Horizontal and vertical motion are independent. Both balls start with zero vertical velocity and experience the same vertical acceleration (g), so they fall for the same time even though they travel different horizontal distances." },
  { question: "On a velocity (v) vs time (t) graph, the area under the curve represents...",
    options: ["Acceleration", "Displacement", "Average speed", "Mass of the object"],
    explanation: "The area under a v-t graph equals the object's displacement over that time interval." }
];
const KINEMATICS_EKSPERIMEN_CHECK = [
  { question: "Pada eksperimen troli di bidang miring ini, GRADIEN grafik v-t (dari analisis pita ketik) mewakili besaran...",
    options: ["Percepatan troli", "Sudut kemiringan bidang", "Gaya gesek troli", "Massa troli"], correct: 0,
    explanation: "Karena troli mengalami GLBB, gradien grafik v-t = percepatan (a = Δv/Δt)." },
  { question: "Mengapa titik-titik pertama pada pita ketik biasanya TIDAK dipakai dalam analisis data?",
    options: ["Karena titik tersebut salah dicetak", "Karena troli belum bergerak dengan kecepatan yang stabil di titik-titik awal itu", "Karena pewaktu ketik belum menyala", "Karena jaraknya terlalu jauh untuk diukur"], correct: 1,
    explanation: "Di awal pelepasan, gerak troli belum teratur/stabil, sehingga interval jarak antar titik pertama belum konsisten dan sebaiknya diabaikan." }
];
const KINEMATICS_EKSPERIMEN_CHECK_EN = [
  { question: "In this trolley-on-a-ramp experiment, the GRADIENT of the v-t graph (from ticker-tape analysis) represents...",
    options: ["The trolley's acceleration", "The ramp's angle of incline", "The trolley's friction force", "The trolley's mass"],
    explanation: "Since the trolley undergoes uniform acceleration, the gradient of the v-t graph = acceleration (a = Δv/Δt)." },
  { question: "Why are the first few dots on the ticker-tape usually NOT used in the data analysis?",
    options: ["Because those dots were printed incorrectly", "Because the trolley's motion is not yet steady at those first dots", "Because the ticker-timer had not switched on yet", "Because the spacing is too far to measure"],
    explanation: "Right after release, the trolley's motion is not yet regular/steady, so the spacing between the first dots is not yet consistent and should be ignored." }
];

(function attachKinematicsContent() {
  const topic = TOPICS.find(t => t.id === "kinematics");
  topic.desc = { id: topic.desc, en: KINEMATICS_DESC_EN };
  topic.materiHTML = { id: KINEMATICS_MATERI, en: KINEMATICS_MATERI_EN };
  topic.eksperimen = {
    title: { id: KINEMATICS_EKSPERIMEN.title, en: KINEMATICS_EKSPERIMEN_EN.title },
    intro: { id: KINEMATICS_EKSPERIMEN.intro, en: KINEMATICS_EKSPERIMEN_EN.intro }
  };
  topic.eksperimen.simHTML = INCLINE_TROLLEY_SIM;
  topic.latihan = KINEMATICS_LATIHAN.map((q, i) => {
    const qEN = KINEMATICS_LATIHAN_EN[i] || {};
    return {
      ...q,
      question: { id: q.question, en: qEN.question },
      options: q.options ? q.options.map((opt, j) => ({ id: opt, en: (qEN.options || [])[j] })) : q.options,
      solution: { id: q.solution, en: qEN.solution }
    };
  });
  topic.labConcepts = KINEMATICS_LAB_CONCEPTS.map((c, i) => ({ id: c, en: KINEMATICS_LAB_CONCEPTS_EN[i] }));
  topic.formulaSheet = { id: KINEMATICS_FORMULA_SHEET, en: KINEMATICS_FORMULA_SHEET_EN };
  topic.materiCheck = mapCheckQuestions(KINEMATICS_MATERI_CHECK, KINEMATICS_MATERI_CHECK_EN);
  topic.eksperimenCheck = mapCheckQuestions(KINEMATICS_EKSPERIMEN_CHECK, KINEMATICS_EKSPERIMEN_CHECK_EN);
})();

/* ------------------------------------------------------------
   Konten lengkap: MAGNETIC FIELDS (topik 20)
   ------------------------------------------------------------ */

const MAGNETIC_MATERI = `
<h3>1. Medan Magnet dan Fluks Magnetik</h3>
<p>Medan magnet adalah daerah di sekitar magnet atau penghantar berarus di mana benda magnetik atau muatan
bergerak lain akan mengalami gaya. Kekuatan medan magnet dinyatakan sebagai <strong>rapat fluks magnetik
(magnetic flux density)</strong> $B$, dengan satuan SI tesla (T).</p>
<p>Arah medan magnet digambarkan dengan garis medan (field lines): keluar dari kutub utara, masuk ke kutub
selatan, dan tidak pernah berpotongan. Kerapatan garis menunjukkan kekuatan medan di titik tersebut.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/25/Iron-filings-around-magnet.jpg",
    alt: "Pola serbuk besi di sekitar magnet batang menunjukkan garis medan magnet",
    caption: "Serbuk besi yang ditaburkan di sekitar magnet batang menyusun diri mengikuti garis medan magnet, dari kutub utara menuju kutub selatan.",
    author: "Benjamin Crowell (Bcrowell)", license: "CC BY-SA 2.0" },
  null
)}

<h3>2. Medan Magnet oleh Arus Listrik</h3>
<p>Arus listrik yang mengalir dalam penghantar selalu menghasilkan medan magnet di sekitarnya (percobaan
Oersted). Arahnya ditentukan dengan <strong>kaidah genggaman tangan kanan (right-hand grip rule)</strong>:
genggam penghantar dengan ibu jari menunjuk arah arus konvensional, arah lengkungan jari-jari menunjukkan
arah medan magnet.</p>
<table>
  <tr><th>Bentuk penghantar</th><th>Pola medan magnet</th><th>Rapat fluks (di titik acuan)</th></tr>
  <tr><td>Kawat lurus panjang</td><td>Lingkaran konsentris mengelilingi kawat</td><td>Sebanding $I$, berbanding terbalik dengan jarak $d$ dari kawat</td></tr>
  <tr><td>Loop melingkar (satu lilitan)</td><td>Mirip medan magnet batang, terkuat di pusat loop</td><td>Sebanding $I$, berbanding terbalik dengan jari-jari loop</td></tr>
  <tr><td>Solenoida (kumparan panjang)</td><td>Hampir seragam dan sejajar di dalam kumparan, mirip magnet batang</td><td>Sebanding $I$ dan jumlah lilitan per satuan panjang $n$</td></tr>
</table>
<p class="muted">Cambridge 9702 tidak menuntut penurunan rumus $B$ dari hukum Biot-Savart, tetapi menuntut kemampuan
menggambar dan mengenali pola garis medan di atas serta menentukan arahnya dengan kaidah tangan kanan.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/34/Right-hand_grip_rule.svg",
    alt: "Kaidah genggaman tangan kanan untuk kawat lurus berarus",
    caption: "Kaidah genggaman tangan kanan: ibu jari menunjuk arah arus konvensional $I$, lengkungan jari menunjukkan arah medan magnet $B$ di sekitar kawat lurus.",
    author: "Schorschi2 (asli), versi SVG oleh Wizard191", license: "Domain Publik" },
  { id: "I809vLGN1B8", title: "Field due to straight wire carrying current",
    channel: "Khan Academy", desc: "Penjelasan pola medan magnet di sekitar kawat lurus berarus dan cara menentukan arahnya." }
)}
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/9/91/Solenoid_field_lines_rough_vector.svg",
    alt: "Pola garis medan magnet di dalam dan luar solenoida",
    caption: "Garis medan magnet pada solenoida: hampir seragam dan sejajar sumbu di bagian dalam kumparan, menyerupai pola medan magnet batang di bagian luar.",
    author: "Ле Лой (Le Loy)", license: "CC0 (Domain Publik)" },
  null
)}

<h3>3. Gaya Magnetik pada Penghantar Berarus</h3>
<p>Penghantar berarus yang berada dalam medan magnet luar akan mengalami gaya (disebut juga efek motor).
Besarnya gaya:</p>
<div class="formula-box">$$F = BIL\\sin\\theta$$</div>
<p>dengan $B$ = rapat fluks magnetik (T), $I$ = arus (A), $L$ = panjang penghantar dalam medan (m), dan
$\\theta$ = sudut antara arah arus dan arah medan magnet. Gaya maksimum ($F=BIL$) terjadi saat penghantar
tegak lurus terhadap medan ($\\theta = 90°$); gaya nol saat penghantar sejajar medan ($\\theta = 0°$).</p>
<p>Arah gaya ditentukan dengan <strong>Kaidah Tangan Kiri Fleming</strong>: telunjuk menunjuk arah medan
magnet (Field), jari tengah menunjuk arah arus (Current), dan ibu jari menunjukkan arah gaya/gerak
(Thrust) - ketiganya saling tegak lurus.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Right_hand_rule_cross_product_F%3DJ%C3%97B.svg",
    alt: "Diagram vektor gaya F, arus I, dan medan magnet B saling tegak lurus",
    caption: "Diagram vektor: gaya $F$ pada penghantar berarus selalu tegak lurus terhadap arah arus $I$ dan medan magnet $B$. Untuk menentukan arahnya dengan tangan, gunakan Kaidah Tangan Kiri Fleming (telunjuk = medan, jari tengah = arus, ibu jari = gaya).",
    author: "Tokamac", license: "CC BY-SA 4.0" },
  { id: "ckllSgcdS7g", title: "Force on a current-carrying conductor in a magnetic field",
    channel: "Khan Academy", desc: "Menjelaskan asal gaya pada penghantar berarus dalam medan magnet dan cara menghitungnya dengan F = BIL sin theta." }
)}

<h3>4. Gaya Magnetik pada Muatan Bergerak</h3>
<p>Sebuah muatan $Q$ yang bergerak dengan kelajuan $v$ di dalam medan magnet $B$ juga mengalami gaya
magnetik (sering disebut gaya Lorentz jika digabung dengan gaya listrik):</p>
<div class="formula-box">$$F = BQv\\sin\\theta$$</div>
<p>dengan $\\theta$ = sudut antara arah kecepatan $v$ dan arah medan $B$. Arah gaya tetap ditentukan dengan
Kaidah Tangan Kiri Fleming (telunjuk = medan, jari tengah = arah gerak muatan positif, ibu jari = gaya).</p>
<p>Karena gaya magnetik selalu tegak lurus terhadap kecepatan, gaya ini <strong>tidak pernah melakukan usaha</strong>
pada muatan (tidak mengubah besar kelajuan, hanya arah geraknya). Jika muatan bergerak tegak lurus terhadap
medan magnet seragam, gaya magnetik berperan sebagai gaya sentripetal sehingga lintasannya berbentuk
<strong>lingkaran</strong> dengan jari-jari:</p>
<div class="formula-box">$$BQv = \\dfrac{mv^2}{r} \\quad\\Rightarrow\\quad r = \\dfrac{mv}{BQ}$$</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Lorentz_force.svg",
    alt: "Diagram gaya Lorentz pada muatan bergerak dalam medan magnet",
    caption: "Gaya magnetik pada muatan yang bergerak dalam medan magnet selalu tegak lurus terhadap kecepatannya, menyebabkan lintasan melengkung (melingkar jika medan seragam dan tegak lurus kecepatan).",
    author: "Jaro.p", license: "CC BY-SA 3.0" },
  { id: "NnlAI4ZiUrQ", title: "Magnetic force on a charge",
    channel: "Khan Academy", desc: "Menjelaskan gaya magnetik pada muatan bergerak (F = BQv sin theta) dan mengapa lintasannya bisa berbentuk lingkaran." }
)}

<h3>5. Fluks Magnetik dan Induksi Elektromagnetik</h3>
<p><strong>Fluks magnetik</strong> $\\Phi$ melalui suatu bidang seluas $A$ didefinisikan sebagai:</p>
<div class="formula-box">$$\\Phi = BA\\cos\\theta$$</div>
<p>dengan $\\theta$ = sudut antara arah medan magnet $B$ dan garis normal (tegak lurus) bidang tersebut,
satuan fluks adalah weber (Wb), dengan $1~\\text{Wb} = 1~\\text{T m}^2$.</p>
<p><strong>Hukum Faraday</strong> menyatakan bahwa GGL (gaya gerak listrik) induksi yang timbul pada suatu
rangkaian sebanding dengan laju perubahan fluks magnetik (fluks-linkage $N\\Phi$ untuk kumparan $N$ lilitan)
yang melaluinya:</p>
<div class="formula-box">$$\\varepsilon = -N\\dfrac{\\Delta\\Phi}{\\Delta t}$$</div>
<p>GGL induksi dapat timbul karena magnet/medan bergerak relatif terhadap kumparan, kumparan bergerak dalam
medan magnet, atau medan magnet yang berubah terhadap waktu (misalnya arus bolak-balik pada kumparan lain
di dekatnya).</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Faraday%27s_law_of_induction.svg",
    alt: "Tiga cara menghasilkan GGL induksi sesuai Hukum Faraday",
    caption: "Tiga situasi yang menghasilkan GGL induksi sesuai Hukum Faraday: (a) rangkaian bergerak dalam medan magnet tetap, (b) rangkaian diam dengan magnet/medan yang bergerak, (c) medan magnet yang berubah terhadap waktu.",
    author: "Jähmefyysikko", license: "CC0 (Domain Publik)" },
  { id: "vcStzn55MG0", title: "Faraday's Law Introduction",
    channel: "Khan Academy", desc: "Pengantar Hukum Faraday tentang induksi elektromagnetik dan hubungan GGL induksi dengan laju perubahan fluks magnetik." }
)}

<h3>6. Hukum Lenz</h3>
<p>Tanda negatif pada persamaan Hukum Faraday merepresentasikan <strong>Hukum Lenz</strong>: arah arus
induksi selalu sedemikian rupa sehingga medan magnet yang dihasilkannya <strong>melawan (menentang)
perubahan fluks</strong> yang menyebabkannya. Hukum Lenz sebenarnya adalah konsekuensi dari hukum kekekalan
energi, karena jika arah arus induksi justru memperkuat perubahan fluks, energi akan tercipta tanpa usaha
dari luar (melanggar hukum kekekalan energi).</p>
<p class="muted">Contoh penerapan: saat kutub utara magnet didekatkan ke kumparan, arus induksi mengalir
sedemikian sehingga ujung kumparan yang menghadap magnet menjadi kutub utara juga (menolak magnet yang
mendekat); saat magnet dijauhkan, ujung kumparan itu menjadi kutub selatan (menarik magnet yang menjauh,
melawan gerakannya).</p>
${mediaRow(
  null,
  { id: "xxZenoBs2Pg", title: "Lenz's Law",
    channel: "Khan Academy", desc: "Penjelasan Hukum Lenz: mengapa arah arus induksi selalu melawan perubahan fluks magnetik yang menghasilkannya, dan kaitannya dengan hukum kekekalan energi." }
)}
`;

const MAGNETIC_EKSPERIMEN = {
  title: "Eksperimen Nyata: Menentukan Rapat Fluks Magnetik dengan Neraca Arus (Current Balance)",
  intro: `
    <p class="muted">Ini eksperimen fisik sungguhan dengan alat lab nyata (neraca timbang elektronik,
    magnet, dan catu daya), bukan simulasi komputer. Eksperimen ini adalah versi Cambridge/A-Level dari
    praktikum standar untuk memverifikasi $F = BIL$ dan menentukan rapat fluks magnetik $B$ sebuah pasangan
    magnet secara kuantitatif.</p>

    <h4>Tujuan</h4>
    <p>Menyelidiki hubungan antara gaya magnetik $F$ pada penghantar berarus dengan besar arus $I$ yang
    mengalir, serta menentukan rapat fluks magnetik $B$ di antara sepasang magnet dari data eksperimen.</p>

    <h4>Konsep Dasar</h4>
    <p>Ketika kawat berarus diletakkan tegak lurus di antara kutub-kutub magnet, kawat mengalami gaya
    magnetik $F = BIL$ (Hukum III Newton: gaya yang sama besar namun berlawanan arah juga bekerja pada
    magnet). Jika magnet diletakkan di atas neraca timbang elektronik dan kawat dipasang tetap (tidak
    bergerak) tepat di celah magnet, maka gaya reaksi pada magnet ini akan terbaca sebagai <strong>perubahan
    massa terukur</strong> $\\Delta m$ pada neraca:</p>
    <div class="formula-box">$$F = \\Delta m \\times g$$</div>
    <p>dengan $g = 9{,}81$ m s⁻². Karena $F = BIL$ (dengan $\\theta = 90°$ karena kawat tegak lurus medan),
    plot grafik $F$ terhadap $I$ akan berupa garis lurus melalui titik asal dengan gradien $BL$. Karena
    panjang $L$ (lebar magnet yang dilalui kawat) bisa diukur langsung, rapat fluks magnetik dapat dihitung:</p>
    <div class="formula-box">$$B = \\dfrac{\\text{gradien grafik } F\\text{-}I}{L}$$</div>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Sepasang magnet Magnadur (atau magnet U/ladam) yang dipasang pada yoke besi lunak sehingga membentuk celah dengan medan magnet homogen</li>
      <li>Neraca timbang elektronik (top-pan balance) dengan ketelitian minimal 0,01 g</li>
      <li>Dua batang statif dan penjepit untuk menggantung/menahan kawat tetap horizontal, melewati celah magnet tanpa menyentuhnya</li>
      <li>Kawat tembaga tebal (kaku, tidak mudah melengkung), panjang secukupnya untuk direntangkan di antara dua statif</li>
      <li>Catu daya arus searah (DC) yang dapat diatur (variable power supply), 0 - 6 A</li>
      <li>Amperemeter (atau gunakan pembacaan arus dari catu daya jika sudah terkalibrasi), kabel penghubung, dan rheostat/resistor variabel untuk mengatur arus secara bertahap</li>
      <li>Penggaris atau jangka sorong untuk mengukur panjang $L$ (lebar magnet yang dilalui kawat, dalam arah kawat)</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Letakkan magnet (di atas yoke) tepat di tengah piringan neraca timbang elektronik, lalu <strong>nolkan (tare)</strong> neraca sehingga pembacaannya 0,00 g dengan magnet di atasnya tetapi belum ada arus mengalir.</li>
      <li>Pasang kawat tembaga horizontal di antara dua statif sedemikian rupa sehingga bagian tengah kawat berada tepat di celah antara kutub-kutub magnet, tegak lurus terhadap arah medan, dan tidak menyentuh magnet maupun neraca.</li>
      <li>Hubungkan kawat ke catu daya DC melalui amperemeter dan rheostat, jangan nyalakan dulu.</li>
      <li>Ukur dan catat panjang $L$ (lebar magnet dalam arah sepanjang kawat, yaitu panjang kawat yang benar-benar berada dalam medan magnet).</li>
      <li>Nyalakan arus sebesar 0,50 A, catat pembacaan massa pada neraca setelah stabil. Jika pembacaan berkurang (negatif) alih-alih bertambah, balik arah arus atau posisi kutub magnet supaya pembacaan bertambah (memudahkan pembacaan positif).</li>
      <li>Naikkan arus secara bertahap sebesar 0,50 A setiap kali (0,50 A; 1,00 A; 1,50 A; ... hingga sekitar 4,00-5,00 A, jangan berlebihan agar kawat tidak terlalu panas), catat pembacaan massa pada tiap nilai arus.</li>
      <li>Matikan arus, pastikan neraca kembali ke 0,00 g (jika tidak, ulangi tare dan seluruh pengukuran). Ulangi seluruh rangkaian pengukuran ini 2 kali lagi untuk mendapatkan rata-rata di setiap nilai arus.</li>
    </ol>

    <h4>Tabel Data (contoh, isi dengan data hasil percobaanmu)</h4>
    <table>
      <tr><th>I (A)</th><th>Δm₁ (g)</th><th>Δm₂ (g)</th><th>Δm₃ (g)</th><th>Δm rata-rata (g)</th><th>F = Δm × g (N)</th></tr>
      <tr><td>0,50</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>1,00</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>1,50</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2,00</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2,50</td><td></td><td></td><td></td><td></td><td></td></tr>
    </table>
    <p class="muted">Ingat: massa pada neraca dalam gram (g) harus diubah ke kilogram (bagi 1000) sebelum
    dikalikan $g = 9{,}81$ m s⁻² untuk mendapatkan gaya $F$ dalam newton.</p>

    <h4>Analisis &amp; Perhitungan</h4>
    <ul>
      <li>Plot grafik $F$ (sumbu-y, satuan N) terhadap $I$ (sumbu-x, satuan A). Data yang benar akan membentuk garis lurus melalui (atau sangat dekat) titik asal (0,0).</li>
      <li>Tarik garis lurus terbaik (line of best fit), hitung gradiennya: gradien $= \\dfrac{\\Delta F}{\\Delta I}$ (satuan T m, karena gradien $= BL$).</li>
      <li>Hitung rapat fluks magnetik: $B = \\dfrac{\\text{gradien}}{L}$, dengan $L$ dalam meter.</li>
      <li>Magnadur sekolah pada umumnya memiliki $B$ di kisaran $0{,}1$ sampai $0{,}5$ T; bandingkan hasilmu dengan rentang ini sebagai pengecekan kewajaran (bukan nilai "benar" mutlak, karena tiap set magnet berbeda).</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li>Arus beberapa ampere membuat kawat menjadi panas, jangan menyentuh kawat saat arus mengalir, terutama setelah beberapa menit pengukuran berturut-turut.</li>
      <li>Matikan catu daya di antara pengukuran jika kawat terasa mulai memanas, biarkan dingin sebelum melanjutkan.</li>
      <li>Pastikan sambungan kabel rapi dan tidak ada bagian logam terbuka yang bisa tersentuh tangan basah.</li>
      <li>Magnet Magnadur bersifat rapuh (mudah retak jika terjatuh), tangani dan letakkan dengan hati-hati.</li>
    </ul>

    <h4>Sumber Kesalahan (untuk didiskusikan di laporan)</h4>
    <ul>
      <li>Arus bolak-balik dari jala-jala yang tidak stabil pada catu daya murah dapat membuat pembacaan amperemeter sedikit berfluktuasi.</li>
      <li>Kawat yang sedikit menyentuh magnet atau statif dapat memberi pembacaan gaya tambahan yang salah (gesekan/beban mekanis, bukan gaya magnetik murni).</li>
      <li>Panjang $L$ yang diukur mungkin tidak persis sama dengan panjang efektif kawat dalam medan homogen (medan magnet melemah secara bertahap di tepi celah magnet, bukan berhenti tiba-tiba).</li>
      <li>Getaran meja atau hembusan angin (draught) dapat mengganggu kestabilan pembacaan neraca elektronik.</li>
    </ul>

    <h4>Sekolah Belum Punya Neraca Timbang Elektronik?</h4>
    <p>Kalau sekolahmu belum punya alat ini, kamu tidak harus melewatkan eksperimen ini - pilih tab
    <strong>"Alat Sederhana"</strong> di atas untuk versi neraca arus lengan-ayun buatan sendiri (memakai
    prinsip momen, bukan neraca digital), atau tab <strong>"Simulasi Virtual"</strong> kalau sekolahmu juga
    belum punya alat/bahan sama sekali. Ketiga pilihan menguji konsep fisika yang persis sama ($F = BIL$ dan
    penentuan $B$), hanya berbeda di alat yang dipakai untuk "mengukur" gaya $F$.</p>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Mengapa grafik $F$ terhadap $I$ seharusnya berupa garis lurus melalui titik asal, bukan kurva?</li>
      <li>Apa yang terjadi pada pembacaan neraca jika arah arus dibalik? Jelaskan dengan Hukum III Newton dan Kaidah Tangan Kiri Fleming.</li>
      <li>Jika jarak antar kutub magnet diperbesar (medan menjadi kurang homogen/lebih lemah), bagaimana pengaruhnya terhadap gradien grafik $F$-$I$ yang kamu peroleh?</li>
      <li>Mengapa penting menolkan (tare) neraca dengan magnet sudah berada di atasnya, sebelum arus dinyalakan?</li>
    </ul>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://pmt.physicsandmathstutor.com/download/Physics/A-level/Notes/AQA/Practical-Skills/RP%2010%20-%20Magnetic%20Force%20on%20a%20Wire.pdf" target="_blank" rel="noopener">Required Practical 10: Magnetic Force on a Wire, Physics & Maths Tutor (AQA A-level)</a></li>
      <li><a href="https://spark.iop.org/current-balance" target="_blank" rel="noopener">The current balance, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/force-wire-carrying-current-magnetic-field" target="_blank" rel="noopener">Force on a wire carrying a current in a magnetic field, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/episode-412-force-conductor-magnetic-field" target="_blank" rel="noopener">Episode 412: The force on a conductor in a magnetic field, IOPSpark</a></li>
    </ul>
  `,
  /* Tabel data INTERAKTIF (bukan lagi tabel kosong statis di atas untuk
     diisi manual di kertas) - dirender terpisah oleh renderEksperimenDataTable()
     di app.js, disimpan otomatis ke spreadsheet backend lewat mode
     "eksperimen_data_save" saat siswa klik "Simpan Data". Nilai I (A) diambil
     persis dari baris tabel contoh di atas supaya konsisten. */
  dataTable: {
    independentLabel: "I (A)",
    independentValues: [0.50, 1.00, 1.50, 2.00, 2.50],
    replicateCount: 3,
    replicateLabel: "Δm (g)",
    derivedLabel: "F = Δm×g (N)",
    context: "Eksperimen Current Balance: kawat berarus I diletakkan tegak lurus medan sepasang magnet di atas neraca timbang elektronik. Gaya magnetik F = BIL terbaca sebagai perubahan massa Δm pada neraca (F = Δm/1000 × 9,81). Data yang valid: F harus naik kira-kira LINEAR terhadap I dan melalui/dekat titik asal (I=0 -> F=0); tiga pembacaan ulangan (Δm₁/Δm₂/Δm₃) pada arus yang sama seharusnya saling berdekatan (bukan tersebar jauh); rapat fluks magnet sekolah (gradien grafik F-I dibagi panjang L) tipikal ada di kisaran 0,1-0,5 T."
  }
};

const MAGNETIC_LATIHAN = [
  {
    type: "mcq",
    question: "Sebuah kawat lurus sepanjang 0,40 m dialiri arus 3,0 A tegak lurus terhadap medan magnet homogen dengan rapat fluks 0,25 T. Berapakah besar gaya magnetik pada kawat tersebut?",
    options: ["0,030 N", "0,30 N", "3,0 N", "30 N"],
    correct: 1,
    solution: `Karena kawat tegak lurus medan, $\\theta = 90°$ sehingga $\\sin\\theta = 1$.
    <br>$F = BIL\\sin\\theta = 0{,}25 \\times 3{,}0 \\times 0{,}40 \\times 1 = 0{,}30~\\text{N}$.`
  },
  {
    type: "mcq",
    question: "Sebuah kawat horizontal membawa arus mengarah ke timur, berada dalam medan magnet horizontal seragam yang mengarah ke utara. Menurut Kaidah Tangan Kiri Fleming, ke arah manakah gaya magnetik pada kawat tersebut?",
    options: ["Vertikal ke atas (menjauhi tanah)", "Vertikal ke bawah (menuju tanah)", "Ke arah barat", "Ke arah selatan"],
    correct: 0,
    solution: `Kaidah Tangan Kiri Fleming: telunjuk = arah medan (Utara), jari tengah = arah arus (Timur), ibu jari = arah gaya.
    <br>Karena arah arus dan medan saling tegak lurus di bidang horizontal, gaya yang tegak lurus terhadap keduanya haruslah vertikal.
    <br>Dengan telunjuk ke Utara dan jari tengah ke Timur, ibu jari (arah gaya) mengarah <strong>vertikal ke atas</strong>.`
  },
  {
    type: "structured",
    question: "Sebuah kawat sepanjang 25 cm membawa arus 4,0 A tegak lurus terhadap medan magnet homogen. Gaya yang terukur bekerja pada kawat adalah 0,60 N. Tentukan rapat fluks magnetik B.",
    solution: `Karena tegak lurus, $\\sin\\theta = 1$, dan $L = 25~\\text{cm} = 0{,}25~\\text{m}$.
    <br>$F = BIL \\Rightarrow B = \\dfrac{F}{IL} = \\dfrac{0{,}60}{4{,}0 \\times 0{,}25} = \\dfrac{0{,}60}{1{,}0} = 0{,}60~\\text{T}$.`
  },
  {
    type: "structured",
    question: "Sebuah kawat sepanjang 0,50 m membawa arus 2,0 A membentuk sudut 40 derajat terhadap arah medan magnet homogen dengan rapat fluks 0,80 T. Hitunglah gaya magnetik yang bekerja pada kawat.",
    solution: `$F = BIL\\sin\\theta = 0{,}80 \\times 2{,}0 \\times 0{,}50 \\times \\sin 40°$.
    <br>$\\sin 40° \\approx 0{,}643$, sehingga $F \\approx 0{,}80 \\times 2{,}0 \\times 0{,}50 \\times 0{,}643 \\approx 0{,}51~\\text{N}$.`
  },
  {
    type: "structured",
    question: "Sebuah elektron (massa $9{,}11\\times10^{-31}$ kg, muatan $1{,}60\\times10^{-19}$ C) bergerak dengan kelajuan $2{,}0\\times10^{6}$ m s⁻¹ tegak lurus terhadap medan magnet homogen sebesar 0,50 mT. Tentukan (a) besar gaya magnetik pada elektron, (b) jari-jari lintasan melingkarnya.",
    solution: `<strong>(a)</strong> $B = 0{,}50~\\text{mT} = 5{,}0\\times10^{-4}~\\text{T}$, dan karena tegak lurus, $\\sin\\theta=1$.
    <br>$F = BQv = (5{,}0\\times10^{-4})(1{,}60\\times10^{-19})(2{,}0\\times10^{6}) = 1{,}6\\times10^{-16}~\\text{N}$.
    <br><strong>(b)</strong> Gaya magnetik berperan sebagai gaya sentripetal: $r = \\dfrac{mv}{BQ} = \\dfrac{(9{,}11\\times10^{-31})(2{,}0\\times10^{6})}{(5{,}0\\times10^{-4})(1{,}60\\times10^{-19})} = \\dfrac{1{,}822\\times10^{-24}}{8{,}0\\times10^{-23}} \\approx 2{,}3\\times10^{-2}~\\text{m} = 2{,}3~\\text{cm}$.`
  },
  {
    type: "structured",
    question: "Sebuah kumparan datar dengan 200 lilitan dan luas penampang $5{,}0\\times10^{-3}$ m² diletakkan tegak lurus terhadap suatu medan magnet (garis normal kumparan sejajar medan). Medan magnet berubah secara linear dari 0,10 T menjadi 0,50 T dalam waktu 0,20 s. Tentukan (a) besar perubahan fluks magnetik yang melalui satu lilitan, (b) GGL induksi rata-rata pada kumparan.",
    solution: `<strong>(a)</strong> Karena garis normal sejajar medan, $\\theta = 0°$ sehingga $\\Phi = BA$.
    <br>$\\Phi_{awal} = 0{,}10 \\times 5{,}0\\times10^{-3} = 5{,}0\\times10^{-4}~\\text{Wb}$.
    <br>$\\Phi_{akhir} = 0{,}50 \\times 5{,}0\\times10^{-3} = 2{,}5\\times10^{-3}~\\text{Wb}$.
    <br>$\\Delta\\Phi = 2{,}5\\times10^{-3} - 5{,}0\\times10^{-4} = 2{,}0\\times10^{-3}~\\text{Wb}$.
    <br><strong>(b)</strong> $\\varepsilon = N\\dfrac{\\Delta\\Phi}{\\Delta t} = 200 \\times \\dfrac{2{,}0\\times10^{-3}}{0{,}20} = 200 \\times 0{,}010 = 2{,}0~\\text{V}$.`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & konvensi yang sudah divalidasi guru, bukan menebak dari pengetahuan umum. */
const MAGNETIC_FORMULA_SHEET = `
- Rapat fluks magnetik B, satuan tesla (T). Arah medan: keluar dari kutub utara, masuk ke kutub selatan.
- Medan magnet oleh arus: arah ditentukan kaidah genggaman tangan kanan (ibu jari = arah arus, lengkungan jari = arah medan).
  Pola: kawat lurus -> lingkaran konsentris; loop melingkar -> mirip magnet batang, terkuat di pusat; solenoida -> hampir seragam & sejajar sumbu di dalam kumparan.
- Gaya pada penghantar berarus (efek motor): F = B I L sin(theta), theta = sudut antara arus dan medan. Maksimum saat tegak lurus (theta=90), nol saat sejajar (theta=0).
  Arah gaya: Kaidah Tangan Kiri Fleming (telunjuk = medan/Field, jari tengah = arus/Current, ibu jari = gaya/Thrust).
- Gaya pada muatan bergerak: F = B Q v sin(theta). Gaya magnetik selalu tegak lurus kecepatan sehingga tidak melakukan usaha (kelajuan tetap).
  Jika v tegak lurus B (medan seragam), lintasan berbentuk lingkaran dengan jari-jari r = m v / (B Q) (gaya magnetik = gaya sentripetal).
- Fluks magnetik: Phi = B A cos(theta), theta = sudut antara medan B dan garis normal bidang. Satuan weber (Wb), 1 Wb = 1 T m^2.
- Hukum Faraday: GGL induksi (EMF) = -N (perubahan Phi)/(perubahan waktu) = -N dPhi/dt. GGL timbul dari perubahan fluks (gerak relatif magnet-kumparan, atau medan yang berubah waktu).
- Hukum Lenz (tanda negatif pada Hukum Faraday): arah arus induksi selalu melawan/menentang perubahan fluks yang menyebabkannya, konsekuensi hukum kekekalan energi.
- Nilai standar g = 9.81 m/s^2 dipakai untuk mengubah bacaan massa neraca (gram) menjadi gaya (newton) pada eksperimen current balance, kecuali diminta lain oleh pengguna.
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const MAGNETIC_LAB_CONCEPTS = [
  "Medan Magnet oleh Kawat Lurus Berarus (Kaidah Tangan Kanan)",
  "Medan Magnet oleh Solenoida/Kumparan",
  "Gaya Magnetik pada Penghantar Berarus (F = BIL, Kaidah Tangan Kiri Fleming)",
  "Gaya Magnetik pada Muatan Bergerak dan Lintasan Melingkar (F = BQv)",
  "Induksi Elektromagnetik (Hukum Faraday)",
  "Hukum Lenz (arah arus induksi)",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

/* Tempelkan konten lengkap ke objek topik "magnetic-fields" */

/* ---- English (_EN) translations for MAGNETIC (auto-merged by merge_i18n.py) ---- */
/* ------------------------------------------------------------
   English translation: MAGNETIC FIELDS (topic 20)
   Mirrors js/content.js constants MAGNETIC_MATERI, MAGNETIC_EKSPERIMEN,
   MAGNETIC_LATIHAN, MAGNETIC_FORMULA_SHEET, MAGNETIC_LAB_CONCEPTS,
   plus the TOPICS "magnetic-fields" entry's desc field.
   Depends on the same mediaRow(...) helper used in js/content.js.
   ------------------------------------------------------------ */

/* TOPICS entry desc field (Indonesian source: "Gaya magnetik, medan magnet
   oleh arus, induksi elektromagnetik.") */
const MAGNETIC_DESC_EN = "Magnetic force, magnetic field due to current, electromagnetic induction.";

const MAGNETIC_MATERI_EN = `
<h3>1. Magnetic Fields and Magnetic Flux</h3>
<p>A magnetic field is the region around a magnet or a current-carrying conductor in which a magnetic
material or another moving charge experiences a force. The strength of a magnetic field is expressed as
the <strong>magnetic flux density</strong> $B$, with SI unit the tesla (T).</p>
<p>The direction of a magnetic field is represented by field lines: they emerge from the north pole, enter
the south pole, and never cross each other. The density of the lines indicates the strength of the field
at that point.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/25/Iron-filings-around-magnet.jpg",
    alt: "Iron filing pattern around a bar magnet showing magnetic field lines",
    caption: "Iron filings sprinkled around a bar magnet arrange themselves along the magnetic field lines, running from the north pole to the south pole.",
    author: "Benjamin Crowell (Bcrowell)", license: "CC BY-SA 2.0" },
  null
)}

<h3>2. Magnetic Field Due to Electric Current</h3>
<p>An electric current flowing in a conductor always produces a magnetic field around it (Oersted's
experiment). Its direction is found using the <strong>right-hand grip rule</strong>: grip the conductor
with the thumb pointing in the direction of conventional current, and the direction in which the fingers
curl shows the direction of the magnetic field.</p>
<table>
  <tr><th>Shape of conductor</th><th>Magnetic field pattern</th><th>Flux density (at reference point)</th></tr>
  <tr><td>Long straight wire</td><td>Concentric circles around the wire</td><td>Proportional to $I$, inversely proportional to the distance $d$ from the wire</td></tr>
  <tr><td>Circular loop (single turn)</td><td>Similar to a bar magnet's field, strongest at the centre of the loop</td><td>Proportional to $I$, inversely proportional to the radius of the loop</td></tr>
  <tr><td>Solenoid (long coil)</td><td>Nearly uniform and parallel inside the coil, similar to a bar magnet</td><td>Proportional to $I$ and the number of turns per unit length $n$</td></tr>
</table>
<p class="muted">Cambridge 9702 does not require deriving the formula for $B$ from the Biot-Savart law, but
it does require being able to sketch and recognise the field line patterns above and to determine their
direction using the right-hand grip rule.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/34/Right-hand_grip_rule.svg",
    alt: "Right-hand grip rule for a straight current-carrying wire",
    caption: "Right-hand grip rule: the thumb points in the direction of conventional current $I$, and the curl of the fingers shows the direction of the magnetic field $B$ around the straight wire.",
    author: "Schorschi2 (original), SVG version by Wizard191", license: "Public Domain" },
  { id: "I809vLGN1B8", title: "Field due to straight wire carrying current",
    channel: "Khan Academy", desc: "Explanation of the magnetic field pattern around a straight current-carrying wire and how to determine its direction." }
)}
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/9/91/Solenoid_field_lines_rough_vector.svg",
    alt: "Magnetic field line pattern inside and outside a solenoid",
    caption: "Magnetic field lines in a solenoid: nearly uniform and parallel to the axis inside the coil, resembling the field pattern of a bar magnet outside it.",
    author: "Ле Лой (Le Loy)", license: "CC0 (Public Domain)" },
  null
)}

<h3>3. Magnetic Force on a Current-Carrying Conductor</h3>
<p>A current-carrying conductor placed in an external magnetic field experiences a force (also called the
motor effect). The magnitude of the force is:</p>
<div class="formula-box">$$F = BIL\\sin\\theta$$</div>
<p>where $B$ = magnetic flux density (T), $I$ = current (A), $L$ = length of conductor within the field
(m), and $\\theta$ = the angle between the direction of the current and the direction of the magnetic
field. The maximum force ($F=BIL$) occurs when the conductor is perpendicular to the field ($\\theta =
90°$); the force is zero when the conductor is parallel to the field ($\\theta = 0°$).</p>
<p>The direction of the force is determined using <strong>Fleming's Left-Hand Rule</strong>: the first
finger points in the direction of the magnetic Field, the second finger points in the direction of the
Current, and the thumb indicates the direction of the force/motion (Thrust) - the three are mutually
perpendicular.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Right_hand_rule_cross_product_F%3DJ%C3%97B.svg",
    alt: "Vector diagram of force F, current I, and magnetic field B mutually perpendicular",
    caption: "Vector diagram: the force $F$ on a current-carrying conductor is always perpendicular to both the direction of the current $I$ and the magnetic field $B$. To find its direction by hand, use Fleming's Left-Hand Rule (first finger = field, second finger = current, thumb = force).",
    author: "Tokamac", license: "CC BY-SA 4.0" },
  { id: "ckllSgcdS7g", title: "Force on a current-carrying conductor in a magnetic field",
    channel: "Khan Academy", desc: "Explains the origin of the force on a current-carrying conductor in a magnetic field and how to calculate it using F = BIL sin theta." }
)}

<h3>4. Magnetic Force on a Moving Charge</h3>
<p>A charge $Q$ moving with speed $v$ in a magnetic field $B$ also experiences a magnetic force (often
called the Lorentz force when combined with the electric force):</p>
<div class="formula-box">$$F = BQv\\sin\\theta$$</div>
<p>where $\\theta$ = the angle between the direction of the velocity $v$ and the direction of the field
$B$. The direction of the force is still found using Fleming's Left-Hand Rule (first finger = field,
second finger = direction of motion of a positive charge, thumb = force).</p>
<p>Because the magnetic force is always perpendicular to the velocity, this force <strong>never does work</strong>
on the charge (it does not change the magnitude of the speed, only the direction of motion). If the charge
moves perpendicular to a uniform magnetic field, the magnetic force acts as the centripetal force, so the
path is a <strong>circle</strong> with radius:</p>
<div class="formula-box">$$BQv = \\dfrac{mv^2}{r} \\quad\\Rightarrow\\quad r = \\dfrac{mv}{BQ}$$</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Lorentz_force.svg",
    alt: "Diagram of the Lorentz force on a moving charge in a magnetic field",
    caption: "The magnetic force on a charge moving in a magnetic field is always perpendicular to its velocity, causing a curved path (circular if the field is uniform and perpendicular to the velocity).",
    author: "Jaro.p", license: "CC BY-SA 3.0" },
  { id: "NnlAI4ZiUrQ", title: "Magnetic force on a charge",
    channel: "Khan Academy", desc: "Explains the magnetic force on a moving charge (F = BQv sin theta) and why its path can be circular." }
)}

<h3>5. Magnetic Flux and Electromagnetic Induction</h3>
<p><strong>Magnetic flux</strong> $\\Phi$ through a plane area $A$ is defined as:</p>
<div class="formula-box">$$\\Phi = BA\\cos\\theta$$</div>
<p>where $\\theta$ = the angle between the direction of the magnetic field $B$ and the normal
(perpendicular) to that plane, the unit of flux is the weber (Wb), where $1~\\text{Wb} = 1~\\text{T
m}^2$.</p>
<p><strong>Faraday's law</strong> states that the induced e.m.f. (electromotive force) generated in a
circuit is proportional to the rate of change of the magnetic flux (flux linkage $N\\Phi$ for a coil of
$N$ turns) through it:</p>
<div class="formula-box">$$\\varepsilon = -N\\dfrac{\\Delta\\Phi}{\\Delta t}$$</div>
<p>An induced e.m.f. can arise because the magnet/field moves relative to the coil, the coil moves within
the magnetic field, or the magnetic field changes with time (for example, an alternating current in
another nearby coil).</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Faraday%27s_law_of_induction.svg",
    alt: "Three ways of producing an induced e.m.f. according to Faraday's Law",
    caption: "Three situations that produce an induced e.m.f. according to Faraday's Law: (a) a circuit moving in a fixed magnetic field, (b) a stationary circuit with a moving magnet/field, (c) a magnetic field that changes with time.",
    author: "Jähmefyysikko", license: "CC0 (Public Domain)" },
  { id: "vcStzn55MG0", title: "Faraday's Law Introduction",
    channel: "Khan Academy", desc: "An introduction to Faraday's Law of electromagnetic induction and the relationship between induced e.m.f. and the rate of change of magnetic flux." }
)}

<h3>6. Lenz's Law</h3>
<p>The negative sign in Faraday's law equation represents <strong>Lenz's Law</strong>: the direction of
the induced current is always such that the magnetic field it produces <strong>opposes the change in
flux</strong> that caused it. Lenz's Law is actually a consequence of the law of conservation of energy,
because if the induced current instead reinforced the change in flux, energy would be created without any
external work being done (violating the law of conservation of energy).</p>
<p class="muted">Example application: when a magnet's north pole is brought closer to a coil, the induced
current flows such that the end of the coil facing the magnet also becomes a north pole (repelling the
approaching magnet); when the magnet is moved away, that end of the coil becomes a south pole (attracting
the receding magnet, opposing its motion).</p>
${mediaRow(
  null,
  { id: "xxZenoBs2Pg", title: "Lenz's Law",
    channel: "Khan Academy", desc: "Explanation of Lenz's Law: why the direction of induced current always opposes the change in magnetic flux that produces it, and its connection to the law of conservation of energy." }
)}
`;

const MAGNETIC_EKSPERIMEN_EN = {
  title: "Real Experiment: Determining Magnetic Flux Density Using a Current Balance",
  intro: `
    <p class="muted">This is a genuine physical experiment using real laboratory equipment (an electronic
    balance, magnets, and a power supply), not a computer simulation. This experiment is the Cambridge/A-Level
    version of the standard practical used to verify $F = BIL$ and to determine the magnetic flux density
    $B$ of a pair of magnets quantitatively.</p>

    <h4>Aim</h4>
    <p>To investigate the relationship between the magnetic force $F$ on a current-carrying conductor and
    the magnitude of the current $I$ flowing through it, and to determine the magnetic flux density $B$
    between a pair of magnets from experimental data.</p>

    <h4>Underlying Concept</h4>
    <p>When a current-carrying wire is placed perpendicular between the poles of a magnet, the wire
    experiences a magnetic force $F = BIL$ (Newton's third law: an equal and opposite force also acts on
    the magnet). If the magnet is placed on an electronic balance and the wire is held fixed (stationary)
    exactly in the magnet's gap, this reaction force on the magnet is read as a <strong>measurable change in
    mass</strong> $\\Delta m$ on the balance:</p>
    <div class="formula-box">$$F = \\Delta m \\times g$$</div>
    <p>where $g = 9.81$ m s⁻². Since $F = BIL$ (with $\\theta = 90°$ because the wire is perpendicular to
    the field), a graph of $F$ against $I$ will be a straight line through the origin with gradient $BL$.
    Since the length $L$ (the width of the magnet through which the wire passes) can be measured directly,
    the magnetic flux density can be calculated:</p>
    <div class="formula-box">$$B = \\dfrac{\\text{gradient of the } F\\text{-}I \\text{ graph}}{L}$$</div>

    <h4>Apparatus &amp; Materials</h4>
    <ul>
      <li>A pair of Magnadur magnets (or U-shaped/horseshoe magnets) mounted on a soft-iron yoke so as to form a gap with a uniform magnetic field</li>
      <li>An electronic top-pan balance with a precision of at least 0.01 g</li>
      <li>Two retort stands with clamps to suspend/hold the wire fixed horizontally, passing through the magnet gap without touching it</li>
      <li>Thick copper wire (rigid, not easily bent), of sufficient length to be stretched between the two stands</li>
      <li>A variable DC (direct current) power supply, 0 - 6 A</li>
      <li>An ammeter (or use the current reading from the power supply if it is calibrated), connecting wires, and a rheostat/variable resistor to adjust the current in steps</li>
      <li>A ruler or vernier calipers to measure the length $L$ (the width of the magnet through which the wire passes, along the direction of the wire)</li>
    </ul>

    <h4>Procedure</h4>
    <ol>
      <li>Place the magnet (on its yoke) exactly at the centre of the electronic balance pan, then <strong>zero (tare)</strong> the balance so its reading is 0.00 g with the magnet on it but with no current yet flowing.</li>
      <li>Set up the copper wire horizontally between the two stands so that the middle section of the wire lies exactly in the gap between the magnet's poles, perpendicular to the field direction, and does not touch either the magnet or the balance.</li>
      <li>Connect the wire to the DC power supply through the ammeter and rheostat, but do not switch it on yet.</li>
      <li>Measure and record the length $L$ (the width of the magnet along the direction of the wire, i.e. the length of wire that actually lies within the magnetic field).</li>
      <li>Switch on a current of 0.50 A, and record the mass reading on the balance once it has stabilised. If the reading decreases (becomes negative) instead of increasing, reverse the direction of the current or the orientation of the magnet's poles so that the reading increases (making it easier to read positive values).</li>
      <li>Increase the current in steps of 0.50 A each time (0.50 A; 1.00 A; 1.50 A; ... up to about 4.00-5.00 A - do not go beyond this so the wire does not overheat), recording the mass reading at each current value.</li>
      <li>Switch off the current and check that the balance returns to 0.00 g (if not, repeat the taring and all the measurements). Repeat this whole set of measurements two more times to obtain an average at each current value.</li>
    </ol>

    <h4>Data Table (example - fill in with your own experimental data)</h4>
    <table>
      <tr><th>I (A)</th><th>Δm₁ (g)</th><th>Δm₂ (g)</th><th>Δm₃ (g)</th><th>Average Δm (g)</th><th>F = Δm × g (N)</th></tr>
      <tr><td>0.50</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>1.00</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>1.50</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2.00</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2.50</td><td></td><td></td><td></td><td></td><td></td></tr>
    </table>
    <p class="muted">Remember: the mass reading on the balance, in grams (g), must be converted to
    kilograms (divide by 1000) before multiplying by $g = 9.81$ m s⁻² to obtain the force $F$ in
    newtons.</p>

    <h4>Analysis &amp; Calculations</h4>
    <ul>
      <li>Plot a graph of $F$ (y-axis, unit N) against $I$ (x-axis, unit A). Correct data will form a straight line passing through (or very close to) the origin (0,0).</li>
      <li>Draw a line of best fit and calculate its gradient: gradient $= \\dfrac{\\Delta F}{\\Delta I}$ (unit T m, since gradient $= BL$).</li>
      <li>Calculate the magnetic flux density: $B = \\dfrac{\\text{gradient}}{L}$, with $L$ in metres.</li>
      <li>School Magnadur magnets typically have a $B$ in the range $0.1$ to $0.5$ T; compare your result with this range as a sanity check (not as an absolute "correct" value, since every set of magnets differs).</li>
    </ul>

    <h4>Safety Precautions</h4>
    <ul>
      <li>A current of several amperes makes the wire hot - do not touch the wire while current is flowing, especially after several minutes of continuous measurement.</li>
      <li>Switch off the power supply between measurements if the wire starts to feel warm, and let it cool before continuing.</li>
      <li>Make sure the wiring connections are neat and there are no exposed metal parts that could be touched by wet hands.</li>
      <li>Magnadur magnets are brittle (they crack easily if dropped) - handle and place them with care.</li>
    </ul>

    <h4>Sources of Error (to discuss in your report)</h4>
    <ul>
      <li>Unstable mains supply feeding a cheap power supply can cause the ammeter reading to fluctuate slightly.</li>
      <li>If the wire slightly touches the magnet or the stand, it can give a spurious extra force reading (friction/mechanical loading rather than a pure magnetic force).</li>
      <li>The measured length $L$ may not be exactly equal to the effective length of wire within the uniform field (the magnetic field weakens gradually at the edges of the gap rather than stopping abruptly).</li>
      <li>Vibrations of the bench or draughts of air can disturb the stability of the electronic balance reading.</li>
    </ul>

    <h4>School Doesn't Have an Electronic Balance?</h4>
    <p>If your school doesn't have this apparatus, you don't have to skip this experiment - choose the
    <strong>"Simple Apparatus"</strong> tab above for a home-made swinging-arm current balance version
    (using the principle of moments instead of a digital balance), or the <strong>"Virtual Simulation"</strong>
    tab if your school also has no equipment/materials at all. All three options test exactly the same
    physics concept ($F = BIL$ and determining $B$), differing only in the apparatus used to "measure" the
    force $F$.</p>

    <h4>Discussion Questions</h4>
    <ul>
      <li>Why should a graph of $F$ against $I$ be a straight line through the origin rather than a curve?</li>
      <li>What happens to the balance reading if the direction of the current is reversed? Explain using Newton's third law and Fleming's Left-Hand Rule.</li>
      <li>If the distance between the magnet's poles is increased (making the field less uniform/weaker), how would this affect the gradient of the $F$-$I$ graph you obtain?</li>
      <li>Why is it important to zero (tare) the balance with the magnet already on it, before the current is switched on?</li>
    </ul>

    <h4>References</h4>
    <ul>
      <li><a href="https://pmt.physicsandmathstutor.com/download/Physics/A-level/Notes/AQA/Practical-Skills/RP%2010%20-%20Magnetic%20Force%20on%20a%20Wire.pdf" target="_blank" rel="noopener">Required Practical 10: Magnetic Force on a Wire, Physics & Maths Tutor (AQA A-level)</a></li>
      <li><a href="https://spark.iop.org/current-balance" target="_blank" rel="noopener">The current balance, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/force-wire-carrying-current-magnetic-field" target="_blank" rel="noopener">Force on a wire carrying a current in a magnetic field, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/episode-412-force-conductor-magnetic-field" target="_blank" rel="noopener">Episode 412: The force on a conductor in a magnetic field, IOPSpark</a></li>
    </ul>
  `
};

const MAGNETIC_LATIHAN_EN = [
  {
    type: "mcq",
    question: "A straight wire of length 0.40 m carries a current of 3.0 A perpendicular to a uniform magnetic field of flux density 0.25 T. What is the magnitude of the magnetic force on the wire?",
    options: ["0.030 N", "0.30 N", "3.0 N", "30 N"],
    correct: 1,
    solution: `Since the wire is perpendicular to the field, $\\theta = 90°$, so $\\sin\\theta = 1$.
    <br>$F = BIL\\sin\\theta = 0.25 \\times 3.0 \\times 0.40 \\times 1 = 0.30~\\text{N}$.`
  },
  {
    type: "mcq",
    question: "A horizontal wire carries a current directed towards the east, in a uniform horizontal magnetic field directed towards the north. According to Fleming's Left-Hand Rule, in which direction is the magnetic force on the wire?",
    options: ["Vertically upward (away from the ground)", "Vertically downward (towards the ground)", "Towards the west", "Towards the south"],
    correct: 0,
    solution: `Fleming's Left-Hand Rule: first finger = direction of the field (North), second finger = direction of the current (East), thumb = direction of the force.
    <br>Since the current and field directions are perpendicular to each other in the horizontal plane, the force, being perpendicular to both, must be vertical.
    <br>With the first finger pointing North and the second finger pointing East, the thumb (direction of the force) points <strong>vertically upward</strong>.`
  },
  {
    type: "structured",
    question: "A wire of length 25 cm carries a current of 4.0 A perpendicular to a uniform magnetic field. The measured force acting on the wire is 0.60 N. Determine the magnetic flux density B.",
    solution: `Since the wire is perpendicular to the field, $\\sin\\theta = 1$, and $L = 25~\\text{cm} = 0.25~\\text{m}$.
    <br>$F = BIL \\Rightarrow B = \\dfrac{F}{IL} = \\dfrac{0.60}{4.0 \\times 0.25} = \\dfrac{0.60}{1.0} = 0.60~\\text{T}$.`
  },
  {
    type: "structured",
    question: "A wire of length 0.50 m carries a current of 2.0 A at an angle of 40 degrees to the direction of a uniform magnetic field of flux density 0.80 T. Calculate the magnetic force acting on the wire.",
    solution: `$F = BIL\\sin\\theta = 0.80 \\times 2.0 \\times 0.50 \\times \\sin 40°$.
    <br>$\\sin 40° \\approx 0.643$, so $F \\approx 0.80 \\times 2.0 \\times 0.50 \\times 0.643 \\approx 0.51~\\text{N}$.`
  },
  {
    type: "structured",
    question: "An electron (mass $9.11\\times10^{-31}$ kg, charge $1.60\\times10^{-19}$ C) moves with a speed of $2.0\\times10^{6}$ m s⁻¹ perpendicular to a uniform magnetic field of 0.50 mT. Determine (a) the magnitude of the magnetic force on the electron, (b) the radius of its circular path.",
    solution: `<strong>(a)</strong> $B = 0.50~\\text{mT} = 5.0\\times10^{-4}~\\text{T}$, and since the motion is perpendicular to the field, $\\sin\\theta=1$.
    <br>$F = BQv = (5.0\\times10^{-4})(1.60\\times10^{-19})(2.0\\times10^{6}) = 1.6\\times10^{-16}~\\text{N}$.
    <br><strong>(b)</strong> The magnetic force acts as the centripetal force: $r = \\dfrac{mv}{BQ} = \\dfrac{(9.11\\times10^{-31})(2.0\\times10^{6})}{(5.0\\times10^{-4})(1.60\\times10^{-19})} = \\dfrac{1.822\\times10^{-24}}{8.0\\times10^{-23}} \\approx 2.3\\times10^{-2}~\\text{m} = 2.3~\\text{cm}$.`
  },
  {
    type: "structured",
    question: "A flat coil with 200 turns and a cross-sectional area of $5.0\\times10^{-3}$ m² is placed perpendicular to a magnetic field (the coil's normal is parallel to the field). The magnetic field changes linearly from 0.10 T to 0.50 T over a time of 0.20 s. Determine (a) the magnitude of the change in magnetic flux through one turn, (b) the average induced e.m.f. in the coil.",
    solution: `<strong>(a)</strong> Since the normal is parallel to the field, $\\theta = 0°$, so $\\Phi = BA$.
    <br>$\\Phi_{initial} = 0.10 \\times 5.0\\times10^{-3} = 5.0\\times10^{-4}~\\text{Wb}$.
    <br>$\\Phi_{final} = 0.50 \\times 5.0\\times10^{-3} = 2.5\\times10^{-3}~\\text{Wb}$.
    <br>$\\Delta\\Phi = 2.5\\times10^{-3} - 5.0\\times10^{-4} = 2.0\\times10^{-3}~\\text{Wb}$.
    <br><strong>(b)</strong> $\\varepsilon = N\\dfrac{\\Delta\\Phi}{\\Delta t} = 200 \\times \\dfrac{2.0\\times10^{-3}}{0.20} = 200 \\times 0.010 = 2.0~\\text{V}$.`
  }
];

/* Concise formula sheet (plain text), used as automatic "grounding":
   appended to the prompt sent to the AI so it uses exactly the formulas
   & conventions already validated by the teacher, rather than guessing
   from general knowledge. */
const MAGNETIC_FORMULA_SHEET_EN = `
- Magnetic flux density B, unit tesla (T). Field direction: out of the north pole, into the south pole.
- Magnetic field due to current: direction found using the right-hand grip rule (thumb = direction of current, curl of fingers = direction of field).
  Patterns: straight wire -> concentric circles; circular loop -> similar to a bar magnet, strongest at the centre; solenoid -> nearly uniform & parallel to the axis inside the coil.
- Force on a current-carrying conductor (motor effect): F = B I L sin(theta), theta = angle between the current and the field. Maximum when perpendicular (theta=90), zero when parallel (theta=0).
  Direction of force: Fleming's Left-Hand Rule (first finger = Field, second finger = Current, thumb = Thrust/force).
- Force on a moving charge: F = B Q v sin(theta). The magnetic force is always perpendicular to the velocity, so it does no work (speed stays constant).
  If v is perpendicular to B (uniform field), the path is a circle with radius r = m v / (B Q) (magnetic force = centripetal force).
- Magnetic flux: Phi = B A cos(theta), theta = angle between the field B and the normal to the plane. Unit weber (Wb), 1 Wb = 1 T m^2.
- Faraday's law: induced e.m.f. (EMF) = -N (change in Phi)/(change in time) = -N dPhi/dt. The e.m.f. arises from a changing flux (relative motion of magnet-coil, or a field changing with time).
- Lenz's law (the negative sign in Faraday's law): the direction of the induced current always opposes the change in flux that causes it, a consequence of the law of conservation of energy.
- The standard value g = 9.81 m/s^2 is used to convert the balance's mass reading (grams) into a force (newtons) in the current balance experiment, unless the user requests otherwise.
`;

/* Concepts for the Prompt Generator dropdown in the Virtual Simulation Lab */
const MAGNETIC_LAB_CONCEPTS_EN = [
  "Magnetic Field Due to a Straight Current-Carrying Wire (Right-Hand Rule)",
  "Magnetic Field Due to a Solenoid/Coil",
  "Magnetic Force on a Current-Carrying Conductor (F = BIL, Fleming's Left-Hand Rule)",
  "Magnetic Force on a Moving Charge and Circular Motion (F = BQv)",
  "Electromagnetic Induction (Faraday's Law)",
  "Lenz's Law (direction of induced current)",
  "Other (write your own in the additional instructions)"
];

const MAGNETIC_MATERI_CHECK = [
  { question: "Kaidah tangan kanan (right-hand grip rule) pada kawat berarus digunakan untuk menentukan...",
    options: ["Besar gaya magnetik", "Arah medan magnet di sekitar kawat", "Massa jenis kawat", "Hambatan kawat"], correct: 1,
    explanation: "Kaidah tangan kanan hanya menentukan ARAH medan magnet; besarnya dihitung dari rumus terpisah." },
  { question: "Sebuah kawat berarus berada dalam medan magnet luar, dengan arus dan medan saling tegak lurus. Kaidah apa yang dipakai untuk menentukan ARAH gaya magnetik pada kawat tersebut?",
    options: ["Kaidah genggaman tangan kanan", "Kaidah Tangan Kiri Fleming", "Hukum Lenz", "Hukum Faraday"], correct: 1,
    explanation: "Kaidah Tangan Kiri Fleming dipakai untuk arah gaya F: telunjuk = medan (Field), jari tengah = arus (Current), ibu jari = gaya (Thrust)." },
  { question: "Sebuah kawat berarus diletakkan SEJAJAR dengan arah medan magnet luar (θ = 0°). Berapa besar gaya magnetik pada kawat tersebut?",
    options: ["Maksimum, F = BIL", "Nol", "Setengah dari nilai maksimum", "Tidak dapat ditentukan tanpa nilai B"], correct: 1,
    explanation: "F = BIL sin θ. Saat θ = 0° (sejajar medan), sin θ = 0 sehingga F = 0." },
  { question: "Sebuah partikel bermuatan bergerak tegak lurus terhadap medan magnet seragam sehingga lintasannya melingkar. Jika kelajuan partikel dinaikkan (massa, muatan, dan B tetap), apa yang terjadi pada jari-jari lintasannya?",
    options: ["Jari-jari mengecil", "Jari-jari membesar", "Jari-jari tetap sama", "Partikel berhenti berbelok"], correct: 1,
    explanation: "r = mv/(BQ); jari-jari sebanding lurus dengan kelajuan v, jadi menaikkan kelajuan memperbesar jari-jari lintasan." },
  { question: "Mengapa arah arus induksi (menurut Hukum Lenz) selalu melawan perubahan fluks magnetik yang menyebabkannya?",
    options: ["Karena arus induksi selalu searah dengan medan magnet asal", "Sebagai konsekuensi dari hukum kekekalan energi", "Karena kumparan selalu memiliki hambatan listrik yang besar", "Karena medan magnet selalu berkurang seiring waktu"], correct: 1,
    explanation: "Jika arus induksi memperkuat (bukan melawan) perubahan fluks, energi akan tercipta tanpa usaha dari luar - melanggar hukum kekekalan energi." }
];
const MAGNETIC_MATERI_CHECK_EN = [
  { question: "The right-hand grip rule for a current-carrying wire is used to determine...",
    options: ["The magnitude of the magnetic force", "The direction of the magnetic field around the wire", "The wire's density", "The wire's resistance"],
    explanation: "The right-hand grip rule only gives the DIRECTION of the magnetic field; its magnitude comes from a separate formula." },
  { question: "A current-carrying wire sits in an external magnetic field, with the current and field perpendicular to each other. Which rule is used to find the DIRECTION of the magnetic force on the wire?",
    options: ["The right-hand grip rule", "Fleming's Left-Hand Rule", "Lenz's Law", "Faraday's Law"],
    explanation: "Fleming's Left-Hand Rule gives the direction of force F: first finger = Field, second finger = Current, thumb = Thrust (force)." },
  { question: "A current-carrying wire is placed PARALLEL to an external magnetic field (θ = 0°). What is the magnitude of the magnetic force on the wire?",
    options: ["Maximum, F = BIL", "Zero", "Half of the maximum value", "Cannot be determined without the value of B"],
    explanation: "F = BIL sin θ. When θ = 0° (parallel to the field), sin θ = 0, so F = 0." },
  { question: "A charged particle moves perpendicular to a uniform magnetic field, giving it a circular path. If the particle's speed is increased (mass, charge, and B unchanged), what happens to the radius of its path?",
    options: ["The radius decreases", "The radius increases", "The radius stays the same", "The particle stops curving"],
    explanation: "r = mv/(BQ); the radius is directly proportional to speed v, so increasing speed increases the radius of the circular path." },
  { question: "Why does the induced current's direction (by Lenz's Law) always oppose the change in magnetic flux that caused it?",
    options: ["Because induced current always flows in the same direction as the original field", "As a consequence of the law of conservation of energy", "Because coils always have large electrical resistance", "Because the magnetic field always decreases over time"],
    explanation: "If the induced current reinforced (instead of opposing) the flux change, energy would be created with no external work done - violating conservation of energy." }
];
const MAGNETIC_EKSPERIMEN_CHECK = [
  { question: "Pada eksperimen Neraca Arus ini, grafik gaya F terhadap arus I berbentuk garis lurus melalui titik asal. Apa makna GRADIEN grafik tersebut?",
    options: ["BL (rapat fluks magnetik dikali panjang kawat dalam medan)", "Hanya B (rapat fluks magnetik) saja", "Hanya L (panjang kawat) saja", "Massa neraca timbang"], correct: 0,
    explanation: "Karena F = BIL, grafik F terhadap I punya gradien BL; B baru didapat setelah gradien dibagi L." },
  { question: "Perubahan massa terbaca (Δm) pada neraca timbang elektronik digunakan untuk menghitung besaran apa pada eksperimen ini?",
    options: ["Arus listrik I", "Gaya magnetik F (lewat F = Δm × g)", "Panjang kawat L", "Hambatan kawat"], correct: 1,
    explanation: "Gaya reaksi pada magnet terbaca sebagai perubahan massa di neraca, dihitung F = Δm × g." }
];
const MAGNETIC_EKSPERIMEN_CHECK_EN = [
  { question: "In this Current Balance experiment, the graph of force F against current I is a straight line through the origin. What does the GRADIENT of that graph represent?",
    options: ["BL (magnetic flux density times the wire length in the field)", "B (magnetic flux density) alone", "L (wire length) alone", "The balance's mass reading"],
    explanation: "Since F = BIL, the F-I graph has gradient BL; B is only obtained after dividing the gradient by L." },
  { question: "The change in reading (Δm) on the electronic balance is used to calculate which quantity in this experiment?",
    options: ["The current I", "The magnetic force F (via F = Δm × g)", "The wire length L", "The wire's resistance"],
    explanation: "The reaction force on the magnet is read as a change in balance reading, calculated as F = Δm × g." }
];

/* ============================================================
   Alat Sederhana: Neraca Arus Lengan-Ayun (tanpa neraca timbang
   elektronik) - salah satu dari 3 pilihan (varian) eksperimen pada
   tab Eksperimen untuk topik Magnetic Fields, di samping varian
   "laboratorium" (MAGNETIC_EKSPERIMEN di atas) dan varian "virtual"
   (MAGNETIC_VIRTUAL_LAB di bawah). Lihat attachMagneticFieldsContent()
   untuk bagaimana ketiganya digabung jadi topic.eksperimen.variants.
   ------------------------------------------------------------
   Prinsip: neraca lengan-ayun (mirip prinsip momen/tuas) dengan dua
   lengan sama panjang (d1 = d2) dari poros - satu ujung membawa loop
   kawat berarus di celah magnet, ujung lain diberi beban kecil (klip
   kertas/washer) sampai lengan kembali horizontal (metode nol). Karena
   F x d1 = (Σm x g) x d2 dan d1 = d2, maka F = Σm x g - PERSIS rumus
   yang sama dengan varian laboratorium (neraca timbang digital), jadi
   struktur dataTable & formula backend (lihat Code.gs) tetap sama
   persis, TIDAK perlu perubahan apa pun di Code.gs.
   ============================================================ */
const MAGNETIC_EKSPERIMEN_SEDERHANA = {
  title: "Alat Sederhana: Neraca Arus Lengan-Ayun (Tanpa Neraca Timbang Elektronik)",
  intro: `
    <p class="muted">Versi ini untuk sekolah yang <strong>belum punya neraca timbang elektronik</strong>
    tapi tetap punya alat/bahan dasar (magnet, kawat, catu daya, ammeter). Prinsip fisikanya persis sama
    dengan versi Laboratorium ($F = BIL$), hanya saja gaya $F$ "diukur" pakai neraca lengan-ayun buatan
    sendiri (prinsip momen/tuas), bukan neraca timbang digital.</p>

    <h4>Tujuan</h4>
    <p>Menyelidiki hubungan antara gaya magnetik $F$ pada kawat berarus dan kuat arus $I$ ($F = BIL$), serta
    menentukan rapat fluks magnetik $B$ sepasang magnet, menggunakan neraca lengan-ayun buatan sendiri
    sebagai pengganti neraca timbang elektronik.</p>

    <h4>Konsep Dasar: Neraca Lengan-Ayun (Prinsip Momen)</h4>
    <p>Sebuah lengan kaku ringan (sedotan atau bilah kayu tipis) ditumpu tepat di titik tengahnya sehingga
    bisa berayun bebas naik-turun seperti jungkat-jungkit. Salah satu ujung lengan membawa loop kawat kecil
    yang diletakkan di celah medan magnet; ujung lainnya diberi wadah kecil untuk menampung beban penyeimbang
    (klip kertas atau washer kecil yang sudah ditimbang beratnya). Saat arus $I$ dialirkan melalui loop kawat,
    gaya magnetik $F = BIL$ mendorong ujung lengan tersebut naik atau turun. Beban penyeimbang ditambahkan
    sedikit demi sedikit di ujung yang lain sampai lengan kembali tepat horizontal (disebut <strong>metode
    nol/null method</strong> - titik kesetimbangan paling presisi karena tidak bergantung pada kalibrasi
    skala apa pun).</p>
    <p>Dengan prinsip momen (syarat kesetimbangan): jumlah momen di kedua sisi poros harus sama besar,
    $$F \\times d_1 = (\\Sigma m \\times g) \\times d_2$$
    dengan $d_1$ = jarak dari poros ke loop kawat, $d_2$ = jarak dari poros ke wadah beban, dan $\\Sigma m$ =
    total massa beban penyeimbang. <strong>Jika kedua lengan dibuat sama panjang ($d_1 = d_2$)</strong>, kedua
    jarak saling meniadakan sehingga persamaan sederhana menjadi:
    $$F = \\Sigma m \\times g$$
    - persis rumus yang sama seperti pembacaan neraca timbang elektronik pada versi Laboratorium, hanya saja
    $\\Sigma m$ di sini didapat dari menjumlahkan beban-beban kecil yang kamu tambahkan satu per satu, bukan
    dibaca langsung dari layar digital.</p>

    <h4>Alat & Bahan</h4>
    <ul>
      <li>Sedotan plastik kaku atau bilah kayu/bambu tipis dan ringan (untuk lengan neraca), + penggaris</li>
      <li>Jarum pentul atau tusuk gigi tajam (sebagai poros/tumpuan) + dudukan/statif kecil</li>
      <li>Sepasang magnet (magnet batang atau magnet U biasa - tidak perlu Magnadur presisi)</li>
      <li>Kawat tembaga tipis berenamel (dibentuk jadi loop kecil di salah satu ujung lengan)</li>
      <li>Klip kertas atau washer kecil yang sudah ditimbang beratnya masing-masing (sebagai beban
      penyeimbang), ditaruh di wadah kecil (mis. tutup botol ringan) di ujung lengan yang lain</li>
      <li>Catu daya DC, ammeter, dan rheostat (sama seperti versi Laboratorium)</li>
      <li>Plastisin sedikit (untuk menyetimbangkan/tare lengan sebelum arus dialirkan)</li>
      <li>Kabel penghubung secukupnya</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Rakit lengan neraca: tusukkan jarum pentul tepat di titik tengah sedotan/bilah kayu sebagai poros,
      lalu ukur dengan penggaris untuk memastikan jarak dari poros ke kedua ujung lengan ($d_1$ dan $d_2$)
      SAMA PANJANG.</li>
      <li>Pasang loop kawat kecil di salah satu ujung lengan, posisikan tepat di celah antara sepasang
      magnet sehingga loop berada dalam medan magnet yang cukup seragam.</li>
      <li>Pasang wadah kecil kosong di ujung lengan yang lain (untuk menampung beban penyeimbang nanti).</li>
      <li>Sebelum arus dialirkan, tambahkan sedikit plastisin di salah satu ujung untuk menyetimbangkan
      (tare) lengan sampai benar-benar horizontal tanpa beban apa pun.</li>
      <li>Ukur dan catat panjang efektif kawat $L$ yang berada di dalam medan magnet.</li>
      <li>Alirkan arus $I = 0{,}50$ A melalui loop kawat. Lengan akan bergerak naik/turun karena gaya
      magnetik. Tambahkan beban penyeimbang (klip kertas) sedikit demi sedikit ke wadah di ujung lain sampai
      lengan kembali tepat horizontal (metode nol). Catat total massa beban yang ditambahkan sebagai
      $\\Delta m_1$.</li>
      <li>Ambil semua beban, ulangi langkah yang sama pada arus $I$ yang SAMA sebanyak 2 kali lagi untuk
      mendapatkan $\\Delta m_2$ dan $\\Delta m_3$.</li>
      <li>Ulangi seluruh proses (langkah 6-7) untuk $I = 1{,}00$; $1{,}50$; $2{,}00$; dan $2{,}50$ A.</li>
    </ol>

    <h4>Tabel Data</h4>
    <p>Isi tabel di bawah ini dengan data hasil percobaanmu (nilai $\\Delta m$ dalam gram; $F$ akan dihitung
    otomatis memakai $F = \\Sigma m \\times g$ dengan $g = 9{,}81$ m/s², sama seperti versi Laboratorium).</p>

    <h4>Analisis & Perhitungan</h4>
    <ol>
      <li>Hitung rata-rata $\\Delta m$ untuk tiap nilai $I$, lalu hitung $F$ memakai $F = \\Delta m \\times g$
      (dengan $\\Delta m$ dalam kg).</li>
      <li>Buat grafik $F$ (sumbu-y) terhadap $I$ (sumbu-x). Grafik seharusnya berupa garis lurus melalui
      (atau dekat) titik asal.</li>
      <li>Hitung gradien grafik. Karena $F = BIL$, gradien $= BL$, sehingga $B = \\text{gradien} / L$.</li>
      <li>Bandingkan nilai $B$ yang kamu dapat dengan rentang tipikal magnet U/batang rumahan (sekitar
      0,05-0,5 T - agak lebih lebar dari magnet Magnadur presisi karena variasi kekuatan magnet yang lebih
      besar).</li>
    </ol>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li>Gunakan arus secukupnya (maksimal 2,5 A) - jangan biarkan kawat teraliri arus dalam waktu lama
      tanpa perlu, karena kawat tipis bisa memanas.</li>
      <li>Matikan catu daya di antara pengukuran untuk mencegah kawat terlalu panas.</li>
      <li>Hati-hati dengan jarum pentul/tusuk gigi yang tajam saat merakit poros.</li>
    </ul>

    <h4>Sumber Kesalahan</h4>
    <ul>
      <li>Jika $d_1 \\neq d_2$ (kedua lengan tidak benar-benar sama panjang), rumus $F = \\Sigma m \\times g$
      tidak lagi berlaku persis dan hasil $B$ akan bergeser secara sistematis - ukur ulang $d_1$ dan $d_2$
      dengan teliti sebelum memulai.</li>
      <li>Gesekan pada poros (jarum pentul) dapat membuat lengan "macet" sedikit sebelum benar-benar
      horizontal, membuat pembacaan $\\Delta m$ kurang presisi dibanding neraca digital.</li>
      <li>Lengan yang terlalu lentur (melengkung) di bawah beban dapat mengubah $d_1$/$d_2$ secara efektif.</li>
      <li>Magnet U/batang rumahan biasanya kurang homogen dibanding Magnadur presisi, sehingga rapat fluks
      $B$ bisa sedikit bervariasi di sepanjang celah.</li>
    </ul>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Mengapa syarat $d_1 = d_2$ penting supaya $F = \\Sigma m \\times g$ berlaku? Apa yang terjadi pada
      persamaan jika $d_1 = 2d_2$?</li>
      <li>Mengapa metode nol (menyeimbangkan lengan sampai horizontal) lebih presisi dibanding mengukur
      sudut simpangan lengan secara langsung?</li>
    </ul>

    <h4>Referensi</h4>
    <ul>
      <li>IOP Spark - "Current balance": <a href="https://spark.iop.org/current-balance" target="_blank"
      rel="noopener">https://spark.iop.org/current-balance</a></li>
      <li>Physics & Maths Tutor (PMT), AQA A-Level Physics Required Practical 10 - Investigating force on
      a current-carrying conductor.</li>
    </ul>
  `,
  dataTable: {
    independentLabel: "I (A)",
    independentValues: [0.50, 1.00, 1.50, 2.00, 2.50],
    replicateCount: 3,
    replicateLabel: "Δm (g)",
    derivedLabel: "F = Δm×g (N)",
    context: "Eksperimen Current Balance dengan neraca lengan-ayun buatan sendiri (bukan neraca digital): kawat berarus di salah satu ujung lengan diberi gaya magnetik F=BIL, diimbangi menambah klip kertas/beban kecil di ujung lain (metode nol, prinsip momen) sampai lengan horizontal; jika jarak kedua ujung ke poros sama, F = Δm×g. Data valid: F naik kira-kira LINEAR terhadap I dan melalui/dekat titik asal; 3 ulangan pada arus yang sama harus berdekatan; rapat fluks magnet U/batang rumahan biasanya lebih bervariasi dari Magnadur presisi, kisaran umum tetap 0,05-0,5 T (agak lebih lebar dari versi laboratorium karena magnet kurang presisi)."
  }
};

const MAGNETIC_EKSPERIMEN_SEDERHANA_EN = {
  title: "Simple Apparatus: Swinging-Arm Current Balance (Without an Electronic Balance)",
  intro: `
    <p class="muted">This version is for schools that <strong>don't yet have an electronic top-pan
    balance</strong> but do have basic apparatus/materials (magnets, wire, power supply, ammeter). The
    underlying physics is exactly the same as the Laboratory version ($F = BIL$); only the force $F$ is
    "measured" using a home-made swinging-arm balance (the principle of moments) instead of a digital
    balance.</p>

    <h4>Objective</h4>
    <p>To investigate the relationship between the magnetic force $F$ on a current-carrying wire and the
    current $I$ ($F = BIL$), and to determine the magnetic flux density $B$ of a pair of magnets, using a
    home-made swinging-arm balance in place of an electronic balance.</p>

    <h4>Underlying Concept: The Swinging-Arm Balance (Principle of Moments)</h4>
    <p>A light rigid arm (a straw or a thin wooden strip) is pivoted exactly at its midpoint so that it can
    swing freely up and down like a see-saw. One end of the arm carries a small wire loop positioned in the
    gap of a magnetic field; the other end carries a small container to hold counterweights (paperclips or
    small washers of known, pre-measured mass). When a current $I$ flows through the wire loop, the magnetic
    force $F = BIL$ pushes that end of the arm up or down. Counterweights are added a little at a time to
    the other end until the arm returns to exactly horizontal (the <strong>null method</strong> - the most
    precise balance point, since it does not depend on any scale calibration).</p>
    <p>By the principle of moments (equilibrium condition): the moments on both sides of the pivot must be
    equal,
    $$F \\times d_1 = (\\Sigma m \\times g) \\times d_2$$
    where $d_1$ = distance from the pivot to the wire loop, $d_2$ = distance from the pivot to the weight
    container, and $\\Sigma m$ = total mass of the counterweights added. <strong>If both arm-lengths are
    made equal ($d_1 = d_2$)</strong>, the two distances cancel out, simplifying the equation to:
    $$F = \\Sigma m \\times g$$
    - exactly the same formula as the electronic balance reading in the Laboratory version, except that
    $\\Sigma m$ here comes from summing the small weights you add one at a time, rather than being read
    directly off a digital display.</p>

    <h4>Apparatus & Materials</h4>
    <ul>
      <li>A rigid plastic straw or a thin, light wooden/bamboo strip (for the balance arm), plus a ruler</li>
      <li>A pin or a sharp toothpick (as the pivot) plus a small stand/support</li>
      <li>A pair of magnets (ordinary bar or U-shaped magnets - precision Magnadur is not required)</li>
      <li>Thin enamelled copper wire (formed into a small loop at one end of the arm)</li>
      <li>Paperclips or small washers of individually pre-weighed mass (as counterweights), held in a small
      container (e.g. a light bottle cap) at the other end of the arm</li>
      <li>DC power supply, ammeter, and rheostat (same as the Laboratory version)</li>
      <li>A small amount of plasticine (to balance/tare the arm before current is applied)</li>
      <li>Connecting wires as needed</li>
    </ul>

    <h4>Procedure</h4>
    <ol>
      <li>Assemble the balance arm: push the pin through the exact midpoint of the straw/wooden strip as
      the pivot, then use a ruler to check that the distances from the pivot to both ends of the arm
      ($d_1$ and $d_2$) are EQUAL.</li>
      <li>Attach the small wire loop to one end of the arm, positioning it exactly in the gap between the
      pair of magnets so the loop sits within a reasonably uniform field.</li>
      <li>Attach the small empty container to the other end of the arm (to later hold the counterweights).</li>
      <li>Before applying any current, add a little plasticine to one end to balance (tare) the arm until
      it is exactly horizontal with no load at all.</li>
      <li>Measure and record the effective length $L$ of wire lying within the magnetic field.</li>
      <li>Pass a current $I = 0.50$ A through the wire loop. The arm will move up or down due to the
      magnetic force. Add counterweights (paperclips) a little at a time to the container at the other end
      until the arm returns to exactly horizontal (null method). Record the total mass of weights added as
      $\\Delta m_1$.</li>
      <li>Remove all the weights, and repeat the same procedure at the SAME current $I$ two more times to
      obtain $\\Delta m_2$ and $\\Delta m_3$.</li>
      <li>Repeat the whole process (steps 6-7) for $I = 1.00$, $1.50$, $2.00$, and $2.50$ A.</li>
    </ol>

    <h4>Data Table</h4>
    <p>Fill in the table below with your experimental data (values of $\\Delta m$ in grams; $F$ will be
    calculated automatically using $F = \\Sigma m \\times g$ with $g = 9.81$ m/s², just as in the Laboratory
    version).</p>

    <h4>Analysis & Calculation</h4>
    <ol>
      <li>Calculate the average $\\Delta m$ for each value of $I$, then calculate $F$ using
      $F = \\Delta m \\times g$ (with $\\Delta m$ in kg).</li>
      <li>Plot a graph of $F$ (y-axis) against $I$ (x-axis). The graph should be a straight line through
      (or close to) the origin.</li>
      <li>Calculate the gradient of the graph. Since $F = BIL$, the gradient $= BL$, so $B = \\text{gradient}
      / L$.</li>
      <li>Compare the value of $B$ you obtain with the typical range for ordinary home-made bar/U magnets
      (roughly 0.05-0.5 T - slightly wider than precision Magnadur magnets, due to greater variation in
      magnet strength).</li>
    </ol>

    <h4>Safety</h4>
    <ul>
      <li>Use a reasonable current (maximum 2.5 A) - do not leave current flowing through the wire for
      longer than necessary, since a thin wire can heat up.</li>
      <li>Switch off the power supply between measurements to avoid overheating the wire.</li>
      <li>Take care with the sharp pin/toothpick when assembling the pivot.</li>
    </ul>

    <h4>Sources of Error</h4>
    <ul>
      <li>If $d_1 \\neq d_2$ (the two arm-lengths are not truly equal), the formula $F = \\Sigma m \\times g$
      no longer holds exactly and the resulting $B$ will be systematically shifted - measure $d_1$ and
      $d_2$ carefully before starting.</li>
      <li>Friction at the pivot (the pin) can make the arm "stick" slightly before reaching true horizontal,
      making the $\\Delta m$ reading less precise than with a digital balance.</li>
      <li>An arm that flexes (bends) under load can effectively change $d_1$/$d_2$.</li>
      <li>Ordinary bar/U magnets are usually less homogeneous than precision Magnadur magnets, so the flux
      density $B$ may vary somewhat along the gap.</li>
    </ul>

    <h4>Discussion Questions</h4>
    <ul>
      <li>Why is the condition $d_1 = d_2$ important for $F = \\Sigma m \\times g$ to hold? What happens to
      the equation if $d_1 = 2d_2$?</li>
      <li>Why is the null method (balancing the arm to horizontal) more precise than directly measuring the
      angle of deflection of the arm?</li>
    </ul>

    <h4>References</h4>
    <ul>
      <li>IOP Spark - "Current balance": <a href="https://spark.iop.org/current-balance" target="_blank"
      rel="noopener">https://spark.iop.org/current-balance</a></li>
      <li>Physics & Maths Tutor (PMT), AQA A-Level Physics Required Practical 10 - Investigating force on
      a current-carrying conductor.</li>
    </ul>
  `
};

/* ============================================================
   Praktikum Virtual: Neraca Arus (Current Balance) - salah satu dari
   3 pilihan (varian) eksperimen pada tab Eksperimen untuk topik
   Magnetic Fields (BUKAN lagi di tab Lab Simulasi Virtual/Makerspace).
   ------------------------------------------------------------
   Eksperimen TAMBAHAN, khusus untuk sekolah yang TIDAK punya alat
   sederhana MAUPUN alat lab (neraca timbang elektronik) untuk praktikum
   Current Balance. Langkah kerja, variabel, dan struktur tabel data di
   sini dibuat PERSIS mengikuti LKPD 2 (Modul Ajar, Bagian 11, "Praktikum
   Current Balance - Pertemuan 2": 2a prediksi bentuk grafik F-I, 2b
   panjang L + tabel I/Δm (3 ulangan)/F, 2c gradien & B serta kesimpulan)
   dan prosedur eksperimen nyata di atas - satu-satunya beda adalah arus
   & pembacaan neraca disimulasikan di browser (bukan generatif AI, jadi
   TIDAK butuh API key ataupun koneksi ke backend khusus untuk simulasi
   itu sendiri; sejak restrukturisasi 3-varian, data hasil percobaan
   TETAP dikirim ke backend lewat mode eksperimen_data_save yang sama
   seperti varian sederhana/laboratorium, supaya guru bisa memantau
   semua varian secara konsisten).
   Dirender oleh renderVirtualLabHTML()/wireVirtualLab() di js/app.js.
   ============================================================ */
const MAGNETIC_VIRTUAL_LAB = {
  title: "Praktikum Virtual: Neraca Arus (Current Balance)",
  intro: `
    <p class="muted">Pilihan ini untuk sekolah yang <strong>belum punya alat/bahan sama sekali</strong>
    untuk praktikum Current Balance - baik neraca timbang elektronik (lihat tab <strong>"Alat
    Laboratorium"</strong>) maupun alat lengan-ayun buatan sendiri (lihat tab <strong>"Alat
    Sederhana"</strong>) di atas. Simulasi ini meniru alat, langkah kerja, dan tabel data eksperimen nyata
    tersebut - kamu tetap "mengukur", mencatat, membuat grafik, dan menghitung $B$ sendiri, hanya saja
    arus dan neraca yang dipakai berupa alat virtual di layar, bukan alat fisik sungguhan.</p>

    <h4>Tujuan</h4>
    <p>Sama seperti eksperimen nyata: memverifikasi $F = BIL$ dan menentukan rapat fluks magnetik $B$
    sepasang magnet virtual dari data hasil "pengukuran"mu sendiri.</p>

    <h4>Cara Menggunakan Alat Virtual</h4>
    <ol>
      <li>Panjang magnet $L$ pada kit virtual ini <strong>sudah ditentukan</strong> (lihat angka di
      bawah) - catat nilai ini di bagian 2b, persis seperti kamu mencatat hasil ukur $L$ dengan
      penggaris pada eksperimen nyata.</li>
      <li>Pilih nilai arus $I$ pada menu di bawah, lalu klik <strong>"Baca Neraca"</strong> untuk
      mensimulasikan pembacaan neraca elektronik (nilainya sedikit berbeda-beda tiap kali dibaca, meniru
      fluktuasi kecil pada alat sungguhan) - hasilnya otomatis masuk ke tabel pada kolom arus yang
      sesuai.</li>
      <li>Ulangi pembacaan sebanyak 3 kali untuk tiap nilai arus (mengisi $\\Delta m_1$, $\\Delta m_2$,
      $\\Delta m_3$), lalu pindah ke nilai arus berikutnya, sampai seluruh baris tabel terisi. Grafik
      $F$-$I$ di bawah tabel akan otomatis tergambar dari datamu.</li>
      <li>Hitung sendiri gradien grafik dan nilai $B$ (persis seperti eksperimen nyata: $B$ = gradien
      $\\div L$), lalu bandingkan dengan hasil perhitungan otomatis untuk mengecek pekerjaanmu.</li>
    </ol>
  `,
  dataTable: {
    independentLabel: "I (A)",
    independentValues: [0.50, 1.00, 1.50, 2.00, 2.50],
    replicateCount: 3,
    replicateLabel: "Δm (g)",
    derivedLabel: "F = Δm×g (N)",
    context: "Eksperimen Current Balance VIRTUAL (simulasi di layar, bukan alat fisik sungguhan): kawat berarus I diletakkan tegak lurus medan sepasang magnet virtual di atas neraca timbang virtual. Gaya magnetik F = BIL terbaca sebagai perubahan massa Δm pada neraca (F = Δm/1000 × 9,81). Data yang valid: F harus naik kira-kira LINEAR terhadap I dan melalui/dekat titik asal (I=0 -> F=0); tiga pembacaan ulangan (Δm₁/Δm₂/Δm₃) pada arus yang sama seharusnya saling berdekatan (bukan tersebar jauh, karena noise simulasi sengaja dibuat kecil); rapat fluks magnet virtual (gradien grafik F-I dibagi panjang L) tipikal ada di kisaran 0,15-0,35 T."
  },
  // Alat virtual: L tetap/diberikan (bukan diukur siswa, karena tidak ada
  // alat fisik); B "sungguhan" dirandom sekali per siswa per topik (lihat
  // getVirtualLabTrueB() di app.js) supaya tiap siswa/kelompok mendapat
  // data unik, sama seperti tiap set magnet Magnadur sungguhan berbeda-beda.
  apparatus: {
    lengthM: 0.045,
    bTrueMin: 0.15,
    bTrueMax: 0.35,
    noiseFrac: 0.05,
    noiseAbsG: 0.02
  }
};

const MAGNETIC_VIRTUAL_LAB_EN = {
  title: "Virtual Practical: Current Balance",
  intro: `
    <p class="muted">This option is for schools that <strong>don't have any apparatus/materials at
    all</strong> for the Current Balance practical - neither an electronic top-pan balance (see the
    <strong>"Laboratory Apparatus"</strong> tab) nor a home-made swinging-arm balance (see the
    <strong>"Simple Apparatus"</strong> tab) above. This simulation mirrors the apparatus, procedure, and
    data table of that real experiment - you still "measure", record, graph, and calculate $B$ yourself;
    only the current and balance you use are virtual on-screen instruments, not real physical ones.</p>

    <h4>Objective</h4>
    <p>Same as the real experiment: verify $F = BIL$ and determine the magnetic flux density $B$ of a
    virtual pair of magnets from your own "measurement" data.</p>

    <h4>How to Use the Virtual Apparatus</h4>
    <ol>
      <li>The magnet length $L$ of this virtual kit is <strong>already fixed</strong> (see the number
      below) - record this value in field 2b, just like you would record a measured $L$ with a ruler in
      the real experiment.</li>
      <li>Pick a current $I$ value from the menu below, then click <strong>"Read Balance"</strong> to
      simulate an electronic balance reading (the value varies slightly each time, mirroring small
      fluctuations on a real instrument) - the result is automatically placed in the matching current row
      of the table.</li>
      <li>Repeat the reading 3 times for each current value (filling in $\\Delta m_1$, $\\Delta m_2$,
      $\\Delta m_3$), then move to the next current value, until the whole table is filled in. The F-I
      graph below the table is plotted automatically from your data.</li>
      <li>Calculate the graph's gradient and the value of $B$ yourself (just like the real experiment:
      $B$ = gradient $\\div L$), then compare with the automatic calculation to check your work.</li>
    </ol>
  `
};

(function attachMagneticFieldsContent() {
  const topic = TOPICS.find(t => t.id === "magnetic-fields");
  topic.desc = { id: topic.desc, en: MAGNETIC_DESC_EN };
  topic.materiHTML = { id: MAGNETIC_MATERI, en: MAGNETIC_MATERI_EN };
  // Topik Magnetic Fields punya 3 PILIHAN (varian) eksperimen sekaligus
  // di tab Eksperimen - Virtual, Sederhana, Laboratorium - supaya sekolah
  // bisa memilih sesuai alat yang tersedia. Dirender lewat sub-tab pilihan
  // (pill switcher) oleh renderEksperimen() di js/app.js, yang mengecek
  // keberadaan topic.eksperimen.variants untuk membedakan topik dengan
  // banyak varian (seperti ini) dari topik lain yang masih memakai jalur
  // lama satu-eksperimen (topic.eksperimen.dataTable langsung, TIDAK
  // diubah - lihat Kinematics/Temperature/Ideal Gases/Thermodynamics).
  topic.eksperimen = {
    variantOrder: ["virtual", "sederhana", "laboratorium"],
    defaultVariant: "laboratorium",
    variants: {
      laboratorium: {
        title: { id: MAGNETIC_EKSPERIMEN.title, en: MAGNETIC_EKSPERIMEN_EN.title },
        intro: { id: MAGNETIC_EKSPERIMEN.intro, en: MAGNETIC_EKSPERIMEN_EN.intro },
        dataTable: MAGNETIC_EKSPERIMEN.dataTable
      },
      sederhana: {
        title: { id: MAGNETIC_EKSPERIMEN_SEDERHANA.title, en: MAGNETIC_EKSPERIMEN_SEDERHANA_EN.title },
        intro: { id: MAGNETIC_EKSPERIMEN_SEDERHANA.intro, en: MAGNETIC_EKSPERIMEN_SEDERHANA_EN.intro },
        dataTable: MAGNETIC_EKSPERIMEN_SEDERHANA.dataTable
      },
      virtual: {
        title: { id: MAGNETIC_VIRTUAL_LAB.title, en: MAGNETIC_VIRTUAL_LAB_EN.title },
        intro: { id: MAGNETIC_VIRTUAL_LAB.intro, en: MAGNETIC_VIRTUAL_LAB_EN.intro },
        dataTable: MAGNETIC_VIRTUAL_LAB.dataTable,
        apparatus: MAGNETIC_VIRTUAL_LAB.apparatus,
        interactive: true
      }
    }
  };
  topic.latihan = MAGNETIC_LATIHAN.map((q, i) => {
    const qEN = MAGNETIC_LATIHAN_EN[i] || {};
    return {
      ...q,
      question: { id: q.question, en: qEN.question },
      options: q.options ? q.options.map((opt, j) => ({ id: opt, en: (qEN.options || [])[j] })) : q.options,
      solution: { id: q.solution, en: qEN.solution }
    };
  });
  topic.labConcepts = MAGNETIC_LAB_CONCEPTS.map((c, i) => ({ id: c, en: MAGNETIC_LAB_CONCEPTS_EN[i] }));
  topic.formulaSheet = { id: MAGNETIC_FORMULA_SHEET, en: MAGNETIC_FORMULA_SHEET_EN };
  topic.materiCheck = mapCheckQuestions(MAGNETIC_MATERI_CHECK, MAGNETIC_MATERI_CHECK_EN);
  topic.eksperimenCheck = mapCheckQuestions(MAGNETIC_EKSPERIMEN_CHECK, MAGNETIC_EKSPERIMEN_CHECK_EN);
})();

/* ------------------------------------------------------------
   Konten lengkap: TEMPERATURE (topik 14, A2)
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   Konten lengkap: TEMPERATURE (topik 14, A2)
   File draft berdiri sendiri - akan digabungkan manual ke content.js
   Tidak mendefinisikan ulang mediaRow() atau TOPICS (sudah ada di content.js).
   ------------------------------------------------------------ */

const TEMPERATURE_MATERI = `
<h3>1. Kesetimbangan Termal dan Konsep Suhu</h3>
<p>Ketika dua benda dengan suhu berbeda disentuhkan (atau dihubungkan sehingga kalor bisa mengalir di
antara keduanya), kalor akan mengalir secara neto dari benda yang <strong>bersuhu lebih tinggi</strong> ke
benda yang <strong>bersuhu lebih rendah</strong>. Aliran neto ini terus berlangsung sampai suhu keduanya
sama - pada kondisi ini dikatakan kedua benda berada dalam <strong>kesetimbangan termal (thermal
equilibrium)</strong>, dan tidak ada lagi aliran kalor neto di antara keduanya (meskipun secara mikroskopis,
molekul-molekul tetap saling bertukar energi ke dua arah, hanya saja jumlahnya sama besar).</p>
<p>Inilah ide dasar mengapa <strong>suhu</strong> didefinisikan sebagai besaran yang menentukan apakah dua
benda berada dalam kesetimbangan termal atau tidak: dua benda dengan suhu yang sama tidak akan saling
memberi/menyerap kalor neto satu sama lain. Gagasan ini kadang disebut sebagai <em>Hukum ke-Nol
Termodinamika</em> dalam pembahasan yang lebih formal (jika benda A setimbang termal dengan benda C, dan
benda B juga setimbang termal dengan benda C, maka A pasti setimbang termal dengan B juga) - konsep inilah
yang membuat termometer bisa dipakai untuk mengukur suhu benda lain secara konsisten.</p>
<p class="muted">Termometer sendiri bekerja dengan prinsip ini: cairan/sensor di dalam termometer dibiarkan
mencapai kesetimbangan termal dengan benda yang diukur, lalu sifat fisis termometer yang berubah terhadap
suhu (misalnya panjang kolom raksa) dibaca sebagai suhu benda tersebut.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Mercury-thermometer.jpg",
    alt: "Foto close-up kolom raksa di dalam termometer medis",
    caption: "Kolom raksa dalam termometer medis mengembang/menyusut mengikuti suhunya sendiri, yang menyesuaikan diri lewat kesetimbangan termal dengan benda yang diukur, sehingga panjang kolom raksa bisa dipakai untuk membaca suhu.",
    author: "Jurii", license: "CC BY 3.0" },
  { id: "-7Gl-yKF6Y4", title: "Thermal energy, temperature, and heat",
    channel: "Khan Academy", desc: "Pengantar hubungan antara energi termal, suhu, dan kalor, serta arah aliran kalor neto antara dua benda yang bersentuhan." }
)}

<h3>2. Skala Suhu: Termodinamika (Kelvin) dan Celsius</h3>
<p>Skala suhu <strong>termodinamika (thermodynamic scale)</strong>, dengan satuan <strong>kelvin (K)</strong>,
adalah skala suhu mutlak yang tidak bergantung pada sifat fisis zat tertentu (misalnya tidak bergantung pada
titik beku/titik didih air seperti skala Celsius). Titik nol skala ini, <strong>0 K (nol mutlak/absolute
zero)</strong>, adalah suhu terendah yang mungkin dicapai secara teoritis, yaitu saat energi kinetik
molekul/partikel zat berada pada nilai minimumnya.</p>
<p>Sesuai <em>syllabus</em> Cambridge 9702 (2025-2027), konversi resmi antara skala Celsius dan Kelvin
adalah:</p>
<div class="formula-box">$$\\dfrac{T}{\\text{K}} = \\dfrac{\\theta}{{}^\\circ\\text{C}} + 273{,}15$$</div>
<p>dengan $T$ = suhu dalam kelvin dan $\\theta$ = suhu dalam derajat Celsius. Artinya $0~{}^\\circ\\text{C} =
273{,}15~\\text{K}$ dan nol mutlak $0~\\text{K} = -273{,}15~{}^\\circ\\text{C}$.</p>
<p class="muted">Catatan praktis: karena selisih $273{,}15$ vs $273$ hanya $0{,}15$ K, banyak soal (terutama
yang menyangkut perbedaan suhu $\\Delta T$, bukan nilai mutlak $T$) memakai pembulatan cepat $T/\\text{K}
\\approx \\theta/{}^\\circ\\text{C} + 273$. Ingat: karena ukuran satu kelvin persis sama dengan satu derajat
Celsius, <strong>perubahan suhu</strong> $\\Delta T$ (K) selalu sama nilainya dengan $\\Delta\\theta$
($^\\circ$C) - konstanta $273{,}15$ hilang saat dikurangkan.</p>
${mediaRow(
  null,
  { id: "eEJqaNaq9v8", title: "Absolute temperature and the kelvin scale",
    channel: "Khan Academy", desc: "Penjelasan konsep suhu mutlak, skala Kelvin, dan mengapa nol mutlak menjadi batas bawah suhu yang mungkin secara teori." }
)}

<h3>3. Skala Suhu Praktis: Termometer Hambatan dan Termokopel</h3>
<p>Skala termodinamika (Kelvin) bersifat teoritis dan sulit diukur langsung di laboratorium sehari-hari,
sehingga dipakai <strong>skala suhu empirik/praktis</strong> yang memanfaatkan sifat fisis suatu bahan yang
berubah secara (kurang lebih) linear terhadap suhu. Dua contoh yang umum dibahas pada Cambridge 9702:</p>
<table>
  <tr><th>Jenis termometer</th><th>Sifat fisis yang diukur</th><th>Rentang &amp; kegunaan</th></tr>
  <tr><td>Termometer hambatan (resistance thermometer, mis. kawat platina)</td><td>Hambatan listrik $R$, yang bertambah hampir linear terhadap suhu</td><td>Rentang lebar, presisi tinggi, respons agak lambat; cocok untuk suhu tetap/berubah perlahan di industri &amp; laboratorium</td></tr>
  <tr><td>Termokopel (thermocouple)</td><td>GGL (tegangan) kecil yang timbul akibat sambungan dua logam berbeda pada suhu berbeda (efek Seebeck)</td><td>Ukurannya kecil, respons cepat, cocok untuk suhu yang berubah cepat atau titik pengukuran yang sulit dijangkau</td></tr>
</table>
<p>Karena sifat fisis $X$ (hambatan atau GGL) yang diukur umumnya <strong>tidak benar-benar linear
sempurna</strong> terhadap suhu di seluruh rentang, termometer praktis perlu <strong>dikalibrasi</strong>
memakai dua titik tetap yang diketahui (misalnya titik lebur es $0~{}^\\circ\\text{C}$ dan titik didih air
$100~{}^\\circ\\text{C}$ pada tekanan atmosfer standar), lalu suhu di antara keduanya diperkirakan dengan
interpolasi linear:</p>
<div class="formula-box">$$\\theta = \\dfrac{X_\\theta - X_0}{X_{100}-X_0}\\times 100~{}^\\circ\\text{C}$$</div>
<p>dengan $X_0$ = nilai sifat fisis pada $0~{}^\\circ\\text{C}$, $X_{100}$ = nilai sifat fisis pada
$100~{}^\\circ\\text{C}$, dan $X_\\theta$ = nilai sifat fisis pada suhu $\\theta$ yang ingin diketahui.
Karena bahan berbeda tidak persis linear dengan cara yang sama, dua jenis termometer praktis yang berbeda
bisa memberi pembacaan suhu yang sedikit berbeda untuk benda yang sama (kecuali tepat di titik-titik
kalibrasinya) - inilah alasan skala termodinamika (Kelvin) tetap dibutuhkan sebagai acuan mutlak yang
tidak bergantung pada bahan.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Thermocouple.png",
    alt: "Diagram prinsip kerja termokopel",
    caption: "Diagram prinsip kerja termokopel: sambungan dua logam berbeda menghasilkan GGL kecil yang bergantung pada perbedaan suhu antara sambungan pengukuran dan sambungan acuan (efek Seebeck).",
    author: "Vivikowski", license: "CC BY-SA 3.0" },
  null
)}

<h3>4. Kapasitas Kalor Jenis (Specific Heat Capacity)</h3>
<p><strong>Kapasitas kalor jenis</strong> $c$ suatu zat didefinisikan sebagai energi kalor yang diperlukan
untuk menaikkan suhu $1~\\text{kg}$ zat tersebut sebesar $1~\\text{K}$ (atau $1~{}^\\circ\\text{C}$, karena
ukuran keduanya sama). Satuan SI-nya adalah $\\text{J kg}^{-1}\\text{K}^{-1}$.</p>
<div class="formula-box">$$Q = mc\\Delta\\theta$$</div>
<p>dengan $Q$ = energi kalor (J), $m$ = massa (kg), $c$ = kapasitas kalor jenis ($\\text{J kg}^{-1}
\\text{K}^{-1}$), dan $\\Delta\\theta$ = perubahan suhu (K atau $^\\circ$C). Nilai $c$ berbeda-beda untuk
setiap zat - air memiliki $c$ yang sangat besar dibanding kebanyakan logam, sehingga air lebih "lambat"
berubah suhunya untuk jumlah kalor yang sama (inilah mengapa air laut/danau menstabilkan suhu di
sekitarnya).</p>
<p class="muted">Nilai-nilai kapasitas kalor jenis (misalnya air, es, atau logam tertentu) <strong>bukan
bagian dari Data and Formulae List</strong> universal Cambridge 9702 (yang hanya memuat konstanta fisika
fundamental seperti $g$, $e$, $h$, $N_A$), sehingga nilai-nilai ini akan selalu <strong>diberikan langsung
di dalam soal</strong> ujian. Nilai yang umum dipakai: $c_{air} \\approx 4200~\\text{J kg}^{-1}\\text{K}^{-1}$,
$c_{es} \\approx 2100~\\text{J kg}^{-1}\\text{K}^{-1}$, $c_{aluminium} \\approx 900~\\text{J kg}^{-1}
\\text{K}^{-1}$.</p>
<p><strong>Metode listrik</strong> adalah cara standar mengukur $c$ suatu zat (padat maupun cair) di
laboratorium: benda dipanaskan dengan pemanas listrik (mis. pemanas celup) yang energi listriknya diketahui
persis lewat $E = VIt$ (tegangan $\\times$ arus $\\times$ waktu), lalu kenaikan suhu $\\Delta\\theta$ diukur.
Dengan mengasumsikan (atau mengoreksi) kehilangan kalor ke lingkungan, berlaku $E \\approx Q = mc\\Delta\\theta$
sehingga:</p>
<div class="formula-box">$$c = \\dfrac{VIt}{m\\Delta\\theta}$$</div>
<p class="muted">Prosedur lengkap metode listrik ini (termasuk cara meminimalkan galat akibat kehilangan
kalor) dibahas tuntas di tab <strong>Eksperimen</strong> topik ini.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Immersion_heater_(zoom).jpg",
    alt: "Foto close-up elemen pemanas celup (immersion heater) listrik",
    caption: "Pemanas celup (immersion heater) listrik: energi listrik yang mengalir melaluinya ($E=VIt$) diubah menjadi kalor, dipakai untuk mengukur kapasitas kalor jenis suatu zat dengan metode listrik.",
    author: "Simon A. Eugster (LivingShadow)", license: "CC BY-SA 3.0" },
  { id: "GNelfJ6IAJw", title: "Specific heat capacity",
    channel: "Khan Academy", desc: "Penjelasan konsep kapasitas kalor jenis dan cara memakai persamaan Q = mcΔθ pada soal-soal dasar." }
)}

<h3>5. Kalor Laten Jenis (Specific Latent Heat)</h3>
<p>Saat suatu zat murni berubah wujud (misalnya es melebur menjadi air, atau air menguap menjadi uap) pada
suhu tetap (misalnya tepat $0~{}^\\circ\\text{C}$ untuk peleburan es, atau $100~{}^\\circ\\text{C}$ untuk
penguapan air pada tekanan atmosfer standar), <strong>suhu zat tidak berubah</strong> meskipun kalor terus
diserap/dilepaskan. Energi ini dipakai untuk memutus/membentuk ikatan antarmolekul (mengubah susunan wujud
zat), bukan untuk menaikkan energi kinetik rata-rata molekul (yang berkaitan dengan suhu).</p>
<p><strong>Kalor laten jenis</strong> $L$ suatu zat didefinisikan sebagai energi kalor yang diperlukan untuk
mengubah wujud $1~\\text{kg}$ zat tersebut, tanpa disertai perubahan suhu:</p>
<div class="formula-box">$$Q = mL$$</div>
<p>dengan $Q$ = energi kalor (J), $m$ = massa zat yang berubah wujud (kg), dan $L$ = kalor laten jenis
($\\text{J kg}^{-1}$). Ada dua jenis kalor laten jenis untuk zat yang sama, dengan nilai yang <strong>tidak
sama besar</strong>:</p>
<ul>
  <li><strong>Kalor lebur jenis (specific latent heat of fusion), $L_f$</strong>: untuk perubahan wujud
  padat $\\leftrightarrow$ cair. Contoh: $L_f$ es $\\approx 3{,}34\\times10^{5}~\\text{J kg}^{-1}$.</li>
  <li><strong>Kalor uap jenis (specific latent heat of vaporization), $L_v$</strong>: untuk perubahan wujud
  cair $\\leftrightarrow$ gas. Contoh: $L_v$ air $\\approx 2{,}26\\times10^{6}~\\text{J kg}^{-1}$.</li>
</ul>
<p class="muted">$L_v$ jauh lebih besar daripada $L_f$ untuk zat yang sama (air), karena menguap berarti
memutuskan hampir seluruh ikatan antarmolekul sehingga molekul-molekul benar-benar terpisah jauh menjadi
gas, sedangkan melebur "hanya" mengubah susunan padat yang kaku menjadi cair yang molekulnya masih saling
berdekatan.</p>
<p>Sama seperti kapasitas kalor jenis, $L$ juga bisa diukur dengan <strong>metode listrik</strong>: pemanas
listrik dengan daya diketahui melelehkan/menguapkan sejumlah massa zat dalam waktu tertentu, dan massa yang
berubah wujud ($m$) ditimbang, sehingga $L = VIt/m$ (dengan koreksi kehilangan kalor bila diperlukan).</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Cooling_curve_pure_metal.svg",
    alt: "Grafik kurva pendinginan logam murni menunjukkan dataran suhu tetap saat membeku",
    caption: "Kurva pendinginan sebuah logam murni: suhu turun landai selagi berwujud cair maupun padat, tetapi mendatar (suhu tetap konstan) selama proses pembekuan berlangsung - kalor terus dilepaskan, namun seluruhnya dipakai untuk perubahan wujud (kalor laten), bukan menurunkan suhu.",
    author: "Wizard191", license: "CC BY-SA 3.0" },
  { id: "7bvqJUszxhs", title: "Specific latent heat / Cambridge International AS & A Level Physics",
    channel: "College Physics", desc: "Penjelasan definisi dan penggunaan kalor laten jenis (Q = mL) dalam konteks kurikulum Cambridge International AS & A Level Physics." }
)}

<h3>6. Menggabungkan Konsep: Grafik Suhu-Waktu Saat Pemanasan</h3>
<p>Bayangkan sebongkah es dipanaskan dengan laju kalor tetap (misalnya dengan pemanas listrik berdaya
konstan) mulai dari suhu di bawah $0~{}^\\circ\\text{C}$ sampai seluruhnya menjadi uap air panas. Grafik
suhu terhadap waktu (atau terhadap energi kalor yang sudah diserap, karena kalor $\\propto$ waktu pada daya
tetap) akan menunjukkan pola naik-turun-naik-datar yang khas, dengan <strong>lima tahap</strong>:</p>
<ol>
  <li>Suhu es naik landai dari $<0~{}^\\circ\\text{C}$ menuju $0~{}^\\circ\\text{C}$ (memakai $c_{es}$).</li>
  <li>Suhu <strong>mendatar tepat di $0~{}^\\circ\\text{C}$</strong> selagi es melebur seluruhnya menjadi air
  (memakai $L_f$ es) - selama fase ini ada campuran es dan air pada suhu yang sama.</li>
  <li>Suhu air (cair) naik landai dari $0~{}^\\circ\\text{C}$ menuju $100~{}^\\circ\\text{C}$ (memakai
  $c_{air}$).</li>
  <li>Suhu <strong>mendatar tepat di $100~{}^\\circ\\text{C}$</strong> selagi air menguap seluruhnya menjadi
  uap (memakai $L_v$ air).</li>
  <li>Suhu uap air naik lagi di atas $100~{}^\\circ\\text{C}$ (memakai kapasitas kalor jenis uap).</li>
</ol>
<p>Karena laju kalor (daya pemanas) tetap, <strong>lebar mendatar</strong> pada grafik (lama waktu suhu
tidak berubah) berbanding lurus dengan besar $L$ pada tahap itu, sedangkan <strong>kemiringan</strong> pada
bagian yang landai berbanding terbalik dengan $c$ pada fase itu (makin besar $c$, makin landai/lambat
kenaikan suhunya untuk laju kalor yang sama). Untuk menghitung total energi yang diperlukan dari satu ujung
proses ke ujung lainnya, kalor pada <strong>setiap tahap dihitung terpisah lalu dijumlahkan</strong> - inilah
jenis soal gabungan yang sering muncul pada ujian (lihat Latihan Soal nomor 5 di bawah untuk contoh
lengkap).</p>
${mediaRow(
  null,
  { id: "hxe7Ce7vUwU", title: "A Level Physics: Specific Heat Capacity Question examples from past papers",
    channel: "ZPhysics", desc: "Latihan mengerjakan beberapa contoh soal kapasitas kalor jenis bergaya soal ujian A Level, sebagai tambahan latihan setelah memahami konsep dasar." }
)}
`;

const TEMPERATURE_EKSPERIMEN = {
  title: "Eksperimen Nyata: Menentukan Kapasitas Kalor Jenis Aluminium dengan Metode Listrik",
  intro: `
    <p class="muted">Ini eksperimen fisik sungguhan dengan alat lab nyata (pemanas celup, ammeter, voltmeter,
    balok logam), bukan simulasi komputer. Ini adalah praktikum klasik dan standar di banyak silabus
    (termasuk sebagai <em>required practical</em> di berbagai kurikulum A-Level) untuk menentukan kapasitas
    kalor jenis $c$ sebuah logam (di sini aluminium) memakai metode listrik.</p>

    <h4>Tujuan</h4>
    <p>Menentukan kapasitas kalor jenis $c$ aluminium dari data eksperimen (energi listrik, massa, dan
    kenaikan suhu), lalu membandingkannya dengan nilai referensi $c_{aluminium} \\approx 900~\\text{J
    kg}^{-1}\\text{K}^{-1}$.</p>

    <h4>Konsep Dasar</h4>
    <p>Sebuah pemanas celup (immersion heater) yang dialiri arus $I$ pada tegangan $V$ selama waktu $t$
    memberikan energi listrik:</p>
    <div class="formula-box">$$E = VIt$$</div>
    <p>Dengan mengasumsikan seluruh energi listrik ini diserap oleh balok logam (tanpa ada yang hilang ke
    udara sekitar, ke termometer, atau ke lubang tempat pemanas), energi ini menaikkan suhu balok sesuai:</p>
    <div class="formula-box">$$E = mc\\Delta\\theta \\quad\\Rightarrow\\quad c = \\dfrac{VIt}{m\\Delta\\theta}$$</div>
    <p>dengan $m$ = massa balok (kg) dan $\\Delta\\theta$ = kenaikan suhu balok (K). Karena pada praktiknya
    selalu ada sedikit kalor yang hilang ke lingkungan (balok tidak sempurna terisolasi), nilai $c$ yang
    dihitung dari data eksperimen biasanya sedikit <strong>lebih besar</strong> daripada nilai referensi
    (karena sebagian energi listrik "terbuang", padahal seluruhnya dianggap masuk ke balok pada rumus di
    atas, seolah-olah tiap kg-K butuh energi lebih banyak).</p>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Balok aluminium berlubang (silinder aluminium dengan dua lubang: satu untuk pemanas celup, satu
      untuk termometer/sensor suhu), massa sekitar $0{,}20$ - $1{,}0$ kg</li>
      <li>Pemanas celup (immersion heater) listrik yang pas masuk ke lubang balok, dihubungkan ke catu daya
      tegangan rendah (low-voltage power supply) 12 V AC/DC</li>
      <li>Voltmeter (atau pembacaan tegangan pada catu daya jika sudah terkalibrasi) dan ammeter, atau
      alternatifnya sebuah joulemeter yang langsung membaca energi listrik dalam joule</li>
      <li>Termometer (atau termokopel/sensor suhu digital), rentang minimal $-10$ sampai $110~{}^\\circ\\text{C}$</li>
      <li>Neraca timbang (ketelitian minimal 1 g) untuk menimbang massa balok</li>
      <li>Stopwatch (jika daya pemanas tidak konstan sempurna, atau untuk mengontrol lama pemanasan)</li>
      <li>Sedikit oli/minyak pelumas (untuk mengisi celah lubang termometer dan pemanas agar kontak termal
      lebih baik), dan bahan isolasi (kapas/wol/gulungan kertas) untuk membungkus balok mengurangi kehilangan
      kalor ke udara</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Timbang massa balok aluminium ($m$), catat hasilnya.</li>
      <li>Masukkan pemanas celup ke salah satu lubang balok, dan termometer/sensor suhu ke lubang lainnya,
      beri sedikit oli di celah kedua lubang agar kontak termal baik.</li>
      <li>Bungkus balok dengan bahan isolasi (kapas/wol) untuk mengurangi kehilangan kalor ke udara sekitar
      selama pemanasan (tetap sisakan celah kecil untuk membaca termometer).</li>
      <li>Catat suhu awal balok $\\theta_1$ sebelum pemanas dinyalakan.</li>
      <li>Hubungkan pemanas ke catu daya melalui ammeter dan voltmeter. Nyalakan pemanas bersamaan dengan
      menekan start stopwatch. Catat pembacaan $V$ dan $I$ (jika keduanya relatif stabil selama pemanasan).</li>
      <li>Panaskan selama waktu $t$ tertentu (misalnya 5 sampai 10 menit, cukup untuk menaikkan suhu balok
      sekitar 20-30°C), lalu matikan pemanas dan stopwatch bersamaan.</li>
      <li>Aduk/tunggu sebentar agar suhu di seluruh balok merata, lalu catat suhu tertinggi yang tercapai
      $\\theta_2$ (suhu masih bisa naik sedikit setelah pemanas dimatikan karena kalor dari pemanas yang
      belum sempat merata, catat suhu puncaknya).</li>
      <li>Ulangi seluruh langkah ini 2-3 kali (bisa dengan balok logam yang sama setelah didinginkan kembali
      ke suhu ruang, atau logam berbeda seperti tembaga untuk perbandingan) untuk mengecek keterulangan
      hasil.</li>
    </ol>

    <h4>Tabel Data (contoh, isi dengan data hasil percobaanmu)</h4>
    <table>
      <tr><th>Percobaan</th><th>m (kg)</th><th>V (V)</th><th>I (A)</th><th>t (s)</th><th>θ₁ (°C)</th><th>θ₂ (°C)</th><th>Δθ (K)</th><th>c = VIt/(mΔθ) (J kg⁻¹ K⁻¹)</th></tr>
      <tr><td>1</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>3</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    </table>

    <h4>Analisis &amp; Perhitungan</h4>
    <ul>
      <li>Hitung energi listrik $E = VIt$ untuk tiap percobaan, lalu hitung $c = E/(m\\Delta\\theta)$.</li>
      <li>Hitung rata-rata $c$ dari beberapa percobaan/pengulangan, lalu bandingkan dengan nilai referensi
      $900~\\text{J kg}^{-1}\\text{K}^{-1}$ dengan menghitung persentase selisih:
      $\\left|\\dfrac{c_{eksperimen}-c_{referensi}}{c_{referensi}}\\right|\\times100\\%$.</li>
      <li>Jika alat tersedia untuk memvariasikan lama pemanasan $t$ (dengan $V$, $I$ tetap), buat juga grafik
      $\\Delta\\theta$ (sumbu-y) terhadap $t$ (sumbu-x): grafik ini seharusnya berupa garis lurus melalui
      titik asal dengan gradien $VI/(mc)$, sehingga $c$ bisa dihitung dari gradien tanpa bergantung pada satu
      titik data saja (lebih akurat karena memakai <em>line of best fit</em>).</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li>Pemanas celup memakai listrik tegangan rendah tetapi tetap bisa menjadi sangat panas - jangan
      menyentuh elemen pemanas langsung dengan tangan, gunakan penjepit/tang jika perlu memindahkannya.</li>
      <li>Jangan menyalakan pemanas celup di udara terbuka (di luar lubang balok/tanpa media penyerap panas) -
      elemen pemanas bisa rusak dan menjadi sangat panas tanpa media pendingin.</li>
      <li>Balok aluminium akan menjadi panas (bisa mencapai 40-60°C atau lebih), tunggu sampai cukup dingin
      sebelum dipegang langsung tanpa sarung tangan/lap.</li>
      <li>Matikan catu daya sebelum melepas/memasang sambungan kabel apa pun.</li>
      <li>Jika dipakai varian dengan air (lihat Alternatif di bawah), berhati-hati dengan air panas dan
      pastikan tidak ada tumpahan air mengenai catu daya listrik.</li>
    </ul>

    <h4>Sumber Kesalahan (untuk didiskusikan di laporan)</h4>
    <ul>
      <li>Kehilangan kalor ke udara sekitar dan ke bahan isolasi selama pemanasan (paling signifikan),
      membuat $c$ hasil eksperimen cenderung lebih besar dari nilai sebenarnya.</li>
      <li>Kapasitas kalor jenis termometer/sensor dan pemanas itu sendiri ikut menyerap sedikit kalor
      (diabaikan dalam perhitungan sederhana di atas).</li>
      <li>Keterlambatan respons termometer (tidak langsung menunjukkan suhu balok yang sesungguhnya),
      terutama saat suhu masih terus naik sesaat setelah pemanas dimatikan.</li>
      <li>Fluktuasi kecil pada pembacaan $V$ dan $I$ selama pemanasan jika catu daya kurang stabil.</li>
    </ul>

    <h4>Alternatif Sederhana: Metode Campuran (kalau tidak ada pemanas celup/ammeter/voltmeter)</h4>
    <p>Kalau alat listrik (pemanas celup, ammeter, voltmeter) tidak tersedia, kapasitas kalor jenis logam
    tetap bisa diperkirakan dengan <strong>metode campuran (method of mixtures)</strong> memakai asas Black,
    hanya butuh air, kalorimeter/gelas berisolasi, neraca, dan termometer:</p>
    <ol>
      <li>Timbang sebuah blok/kepingan logam ($m_{logam}$), panaskan dalam air mendidih (di panci terpisah)
      sampai suhunya mendekati $100~{}^\\circ\\text{C}$.</li>
      <li>Timbang sejumlah air ($m_{air}$) di dalam wadah berisolasi (kalorimeter sederhana), catat suhu awal
      air $\\theta_{air}$.</li>
      <li>Pindahkan logam panas secepat mungkin ke dalam air, aduk perlahan, dan catat suhu akhir campuran
      $\\theta_c$ setelah stabil (kesetimbangan termal tercapai).</li>
      <li>Karena kalor yang dilepas logam = kalor yang diserap air (asas Black, dengan asumsi tidak ada kalor
      yang hilang ke wadah/lingkungan): $m_{logam}\\,c_{logam}(100-\\theta_c) = m_{air}\\,c_{air}(\\theta_c -
      \\theta_{air})$, sehingga $c_{logam}$ bisa dihitung.</li>
      <li>Metode ini lebih sederhana dan murah, tetapi galatnya cenderung lebih besar (perpindahan logam dari
      panci ke kalorimeter memakan waktu, sehingga logam sudah sedikit mendingin sebelum tercelup penuh).</li>
    </ol>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Mengapa nilai $c$ hasil eksperimen metode listrik biasanya sedikit lebih besar daripada nilai
      referensi, bukan lebih kecil? Jelaskan arah kesalahannya.</li>
      <li>Bagaimana membungkus balok dengan bahan isolasi (kapas/wol) membantu mengurangi galat pada
      eksperimen ini?</li>
      <li>Mengapa pada metode campuran, logam harus dipindahkan "secepat mungkin" dari air mendidih ke
      kalorimeter?</li>
      <li>Jika ternyata terdapat dua logam berbeda dengan massa sama dipanaskan dengan energi listrik yang
      sama persis, logam manakah yang akan mengalami kenaikan suhu lebih besar - logam dengan $c$ besar atau
      $c$ kecil? Jelaskan.</li>
    </ul>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://spark.iop.org/specific-thermal-capacity-aluminium" target="_blank" rel="noopener">Specific thermal capacity of aluminium, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/specific-thermal-capacity-aluminium-more-accurately" target="_blank" rel="noopener">Specific thermal capacity of aluminium, more accurately, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/episode-607-specific-heat-capacity" target="_blank" rel="noopener">Episode 607: Specific heat capacity, IOPSpark</a></li>
      <li><a href="https://pmt.physicsandmathstutor.com/download/Physics/A-level/Notes/OCR-A/1-Practical-Skills-in-Physics/PAG%2011.2%20-%20Determining%20specific%20heat%20capacity.pdf" target="_blank" rel="noopener">PAG 11.2 - Determining specific heat capacity, Physics & Maths Tutor (OCR A-level)</a></li>
    </ul>
  `
};

/* type: "mcq" atau "structured".
   Untuk mcq: options[] dan correct = index jawaban benar. */
const TEMPERATURE_LATIHAN = [
  {
    type: "mcq",
    question: "Suhu ruangan laboratorium terbaca 23°C pada termometer Celsius. Berapakah suhu ini jika dinyatakan dalam kelvin? (gunakan T/K = θ/°C + 273,15)",
    options: ["250,15 K", "273,15 K", "296,15 K", "296,00 K"],
    correct: 2,
    solution: `$\\dfrac{T}{\\text{K}} = \\dfrac{\\theta}{{}^\\circ\\text{C}} + 273{,}15 = 23 + 273{,}15 = 296{,}15$.
    <br>Jadi $T = 296{,}15~\\text{K}$. (Opsi "296,00 K" adalah jebakan umum karena melupakan angka desimal $0{,}15$.)`
  },
  {
    type: "mcq",
    question: "Berapa energi kalor yang diperlukan untuk menaikkan suhu 2,0 kg air dari 20°C menjadi 80°C? (kalor jenis air c = 4200 J kg⁻¹ K⁻¹)",
    options: ["5,04 × 10⁴ J", "5,04 × 10⁵ J", "1,01 × 10⁶ J", "2,52 × 10⁵ J"],
    correct: 1,
    solution: `$\\Delta\\theta = 80-20 = 60~\\text{K}$.
    <br>$Q = mc\\Delta\\theta = 2{,}0 \\times 4200 \\times 60 = 504\\,000~\\text{J} = 5{,}04\\times10^{5}~\\text{J}$.`
  },
  {
    type: "structured",
    question: "Sebuah balok aluminium bermassa 0,20 kg dipanaskan menggunakan pemanas celup listrik yang dihubungkan ke catu daya 12 V dengan arus 4,0 A, selama 5,0 menit. Suhu balok naik dari 18,0°C menjadi 90,0°C. (a) Hitung energi listrik total yang diberikan oleh pemanas. (b) Dari data ini, hitung kapasitas kalor jenis aluminium yang terukur pada eksperimen ini. (c) Nilai referensi kapasitas kalor jenis aluminium adalah 900 J kg⁻¹ K⁻¹. Jelaskan mengapa nilai hasil eksperimen ini sedikit lebih tinggi daripada nilai referensi tersebut.",
    solution: `<strong>(a)</strong> $t = 5{,}0$ menit $= 300~\\text{s}$.
    <br>$E = VIt = 12 \\times 4{,}0 \\times 300 = 14\\,400~\\text{J} = 1{,}44\\times10^{4}~\\text{J}$.
    <br><strong>(b)</strong> $\\Delta\\theta = 90{,}0 - 18{,}0 = 72{,}0~\\text{K}$.
    <br>$c = \\dfrac{E}{m\\Delta\\theta} = \\dfrac{14\\,400}{0{,}20 \\times 72{,}0} = \\dfrac{14\\,400}{14{,}4} = 1000~\\text{J kg}^{-1}\\text{K}^{-1}$.
    <br><strong>(c)</strong> Nilai eksperimen ($1000~\\text{J kg}^{-1}\\text{K}^{-1}$) lebih tinggi daripada nilai referensi ($900~\\text{J kg}^{-1}\\text{K}^{-1}$) karena sebagian energi listrik yang diberikan pemanas hilang ke lingkungan sekitar (udara, termometer, dudukan balok) alih-alih seluruhnya menaikkan suhu balok. Karena perhitungan pada bagian (b) mengasumsikan <em>semua</em> energi listrik masuk ke balok, kenaikan suhu yang "seharusnya" terjadi untuk energi sebesar itu jadi tampak lebih kecil dari kenyataan tanpa kehilangan kalor, sehingga $c$ yang dihitung menjadi lebih besar dari nilai sebenarnya.`
  },
  {
    type: "structured",
    question: "Sebanyak 0,50 kg es yang sudah berada tepat pada suhu 0°C dilebur seluruhnya menjadi air pada suhu 0°C menggunakan pemanas listrik. Kalor lebur jenis es adalah 3,34 × 10⁵ J kg⁻¹. (a) Hitung energi kalor yang diperlukan untuk melebur seluruh es tersebut. (b) Jika pemanas tersebut memiliki daya keluaran 60 W dan semua energinya dianggap dipakai untuk peleburan (tanpa kehilangan kalor), berapa lama waktu yang dibutuhkan (dalam menit) untuk melebur seluruh es itu?",
    solution: `<strong>(a)</strong> $Q = mL_f = 0{,}50 \\times 3{,}34\\times10^{5} = 1{,}67\\times10^{5}~\\text{J}$ (167 000 J).
    <br><strong>(b)</strong> $P = \\dfrac{Q}{t} \\Rightarrow t = \\dfrac{Q}{P} = \\dfrac{1{,}67\\times10^{5}}{60} \\approx 2783~\\text{s}$.
    <br>Dalam menit: $t \\approx \\dfrac{2783}{60} \\approx 46{,}4~\\text{menit}$.`
  },
  {
    type: "structured",
    question: "Sebanyak 0,30 kg es pada suhu −10°C dipanaskan hingga seluruhnya menjadi uap air pada suhu 100°C, pada tekanan atmosfer normal. Diberikan: kalor jenis es c_es = 2100 J kg⁻¹ K⁻¹, kalor jenis air c_air = 4200 J kg⁻¹ K⁻¹, kalor lebur jenis es L_f = 3,34 × 10⁵ J kg⁻¹, kalor uap jenis air L_v = 2,26 × 10⁶ J kg⁻¹. Hitung energi kalor pada tiap tahap berikut, lalu hitung total energi keseluruhan: (a) memanaskan es dari −10°C ke 0°C, (b) melebur es pada 0°C, (c) memanaskan air (cair) dari 0°C ke 100°C, (d) menguapkan air pada 100°C, (e) total energi untuk keseluruhan proses.",
    solution: `<strong>(a)</strong> $Q_1 = mc_{es}\\Delta\\theta = 0{,}30 \\times 2100 \\times 10 = 6300~\\text{J}$.
    <br><strong>(b)</strong> $Q_2 = mL_f = 0{,}30 \\times 3{,}34\\times10^{5} = 1{,}002\\times10^{5}~\\text{J}$ (100 200 J).
    <br><strong>(c)</strong> $Q_3 = mc_{air}\\Delta\\theta = 0{,}30 \\times 4200 \\times 100 = 126\\,000~\\text{J}$.
    <br><strong>(d)</strong> $Q_4 = mL_v = 0{,}30 \\times 2{,}26\\times10^{6} = 6{,}78\\times10^{5}~\\text{J}$ (678 000 J).
    <br><strong>(e)</strong> $Q_{total} = Q_1+Q_2+Q_3+Q_4 = 6300 + 100\\,200 + 126\\,000 + 678\\,000 = 910\\,500~\\text{J} \\approx 9{,}11\\times10^{5}~\\text{J}$.
    <br>Perhatikan bahwa tahap penguapan (d) menyerap energi paling besar dari semua tahap, jauh lebih besar daripada tahap peleburan (b), sesuai dengan $L_v \\gg L_f$ untuk air.`
  },
  {
    type: "structured",
    question: "Sebuah blok logam bermassa 0,15 kg dipanaskan hingga 100°C lalu dengan cepat dimasukkan ke dalam 0,20 kg air yang mula-mula bersuhu 20,0°C, di dalam bejana kalorimeter yang terisolasi baik (kapasitas kalor bejana diabaikan). Suhu akhir campuran setelah kesetimbangan termal tercapai adalah 27,3°C. Kalor jenis air adalah 4200 J kg⁻¹ K⁻¹. (a) Jelaskan, menggunakan konsep aliran kalor neto, mengapa pada kesetimbangan termal suhu logam dan air menjadi sama. (b) Dengan asumsi tidak ada kalor yang hilang ke lingkungan, gunakan asas Black (kalor yang dilepas logam = kalor yang diserap air) untuk menghitung kalor jenis logam tersebut.",
    solution: `<strong>(a)</strong> Selama suhu logam masih lebih tinggi daripada suhu air, kalor akan terus mengalir neto dari logam (bersuhu lebih tinggi) ke air (bersuhu lebih rendah). Aliran neto ini baru berhenti ketika suhu keduanya sama persis, karena pada saat itu tidak ada lagi perbedaan suhu yang mendorong aliran kalor neto ke salah satu arah - inilah keadaan kesetimbangan termal.
    <br><strong>(b)</strong> Kalor yang diserap air: $Q_{air} = m_{air}c_{air}\\Delta\\theta_{air} = 0{,}20 \\times 4200 \\times (27{,}3-20{,}0) = 0{,}20 \\times 4200 \\times 7{,}3 = 6132~\\text{J}$.
    <br>Kalor yang dilepas logam sama besar (asas Black): $Q_{logam} = m_{logam}c_{logam}\\Delta\\theta_{logam} = 0{,}15 \\times c_{logam} \\times (100-27{,}3) = 0{,}15 \\times c_{logam} \\times 72{,}7$.
    <br>$0{,}15 \\times 72{,}7 \\times c_{logam} = 6132 \\Rightarrow c_{logam} = \\dfrac{6132}{10{,}905} \\approx 562~\\text{J kg}^{-1}\\text{K}^{-1}$.`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & nilai yang sudah divalidasi guru, bukan menebak dari pengetahuan umum. */
const TEMPERATURE_FORMULA_SHEET = `
- Kesetimbangan termal: kalor mengalir neto dari benda bersuhu lebih tinggi ke benda bersuhu lebih rendah; ketika keduanya mencapai suhu yang sama, tidak ada lagi aliran kalor neto (kesetimbangan termal). Ide ini mendasari definisi suhu (mirip Hukum ke-Nol Termodinamika secara informal).
- Konversi suhu resmi Cambridge 9702 (syllabus 2025-2027): T/K = theta/degC + 273,15. Pembulatan T/K = theta/degC + 273 kadang dipakai untuk estimasi cepat.
- Nol mutlak (absolute zero): 0 K = -273,15 degC, suhu terendah yang mungkin secara teori.
- Karena ukuran 1 K sama dengan ukuran 1 degC, perubahan suhu delta-T (K) selalu sama nilainya dengan delta-theta (degC); konstanta 273,15 hilang saat dikurangkan.
- Skala termodinamika (Kelvin): mutlak, tidak bergantung sifat bahan tertentu. Skala praktis/empirik (termometer hambatan platina, termokopel): memakai sifat fisis bahan (hambatan R, GGL) yang berubah kurang-lebih linear terhadap suhu, dikalibrasi dengan 2 titik tetap (mis. 0 degC dan 100 degC), lalu theta = (X_theta - X_0)/(X_100 - X_0) x 100 degC.
- Kapasitas kalor jenis c (specific heat capacity): kalor per satuan massa per satuan kenaikan suhu, satuan J/(kg K). Q = m c deltaTheta.
- Metode listrik mengukur c: E = V I t (energi listrik) dikonversi jadi kalor, c = V I t / (m deltaTheta), dengan asumsi/koreksi tanpa kehilangan kalor ke lingkungan.
- Kalor laten jenis L (specific latent heat): kalor per satuan massa untuk mengubah wujud zat TANPA perubahan suhu. Q = m L. Ada L_lebur/fusion (padat<->cair) dan L_uap/vaporization (cair<->gas), nilainya berbeda untuk zat yang sama (L_uap jauh lebih besar dari L_lebur).
- Nilai-nilai umum dipakai pada soal Cambridge 9702 (BUKAN bagian Data and Formulae List universal, biasanya diberikan langsung di soal): c_air = 4200 J/(kg K); c_es kira-kira 2100 J/(kg K); c_aluminium kira-kira 900 J/(kg K); L_lebur es = 3,34 x 10^5 J/kg; L_uap air = 2,26 x 10^6 J/kg.
- Grafik suhu-waktu saat pemanasan laju-kalor-konstan: suhu naik landai selama satu fase (kemiringan berbanding terbalik dengan c fase itu), lalu mendatar selama perubahan wujud (lebar mendatar berbanding lurus dengan L).
- Soal gabungan multi-tahap (mis. es dingin -> lebur -> air -> uap): hitung kalor tiap tahap terpisah (pemanasan pakai Q=mcDeltaTheta, perubahan wujud pakai Q=mL), lalu jumlahkan semua tahap untuk total energi.
- Asas Black (metode campuran/kalorimetri): pada sistem terisolasi, kalor yang dilepas benda bersuhu tinggi = kalor yang diserap benda bersuhu rendah, dipakai untuk menentukan c benda yang tidak diketahui.
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const TEMPERATURE_LAB_CONCEPTS = [
  "Kesetimbangan Termal dan Arah Aliran Kalor Neto",
  "Skala Suhu Termodinamika (Kelvin) vs Skala Celsius",
  "Kalibrasi Termometer Praktis (Termometer Hambatan / Termokopel)",
  "Kapasitas Kalor Jenis dan Metode Listrik (Q = mcΔθ)",
  "Kalor Laten Jenis Peleburan dan Penguapan (Q = mL)",
  "Grafik Suhu-Waktu Saat Pemanasan Melalui Perubahan Wujud",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

/* Tempelkan konten lengkap ke objek topik "temperature" */

/* ---- English (_EN) translations for TEMPERATURE (auto-merged by merge_i18n.py) ---- */
/* ------------------------------------------------------------
   English translation: TEMPERATURE (topic 14, A2)
   Cambridge International AS & A Level Physics (9702) study app.
   Standalone i18n resource file - mirrors the constant names used
   in js/content.js (TEMPERATURE_MATERI, TEMPERATURE_EKSPERIMEN,
   TEMPERATURE_LATIHAN, TEMPERATURE_FORMULA_SHEET,
   TEMPERATURE_LAB_CONCEPTS), each suffixed with _EN.
   Does not redefine mediaRow() or TOPICS (already provided by
   content.js) - this file assumes mediaRow() is available in
   scope wherever TEMPERATURE_MATERI_EN is used.
   ------------------------------------------------------------ */

/* English translation of the "temperature" topic's short desc field
   from the TOPICS array in content.js. */
const TEMPERATURE_DESC_EN = "Temperature scales, thermal equilibrium, heat capacity.";

const TEMPERATURE_MATERI_EN = `
<h3>1. Thermal Equilibrium and the Concept of Temperature</h3>
<p>When two bodies at different temperatures are brought into contact (or connected so that heat can flow
between them), heat flows with a net transfer from the body at the <strong>higher temperature</strong> to the
body at the <strong>lower temperature</strong>. This net flow continues until the temperatures of both bodies
become equal - at this point the two bodies are said to be in <strong>thermal equilibrium</strong>, and there
is no longer any net flow of heat between them (although, microscopically, molecules still exchange energy in
both directions - it is just that the amounts exchanged each way are equal).</p>
<p>This is the basic idea behind why <strong>temperature</strong> is defined as the physical quantity that
determines whether two bodies are in thermal equilibrium or not: two bodies at the same temperature will not
transfer any net heat to or from each other. This idea is sometimes referred to, in more formal treatments, as
the <em>Zeroth Law of Thermodynamics</em> (if body A is in thermal equilibrium with body C, and body B is also
in thermal equilibrium with body C, then A must also be in thermal equilibrium with B) - it is this concept
that allows a thermometer to be used to measure the temperature of other bodies consistently.</p>
<p class="muted">A thermometer itself works on this principle: the liquid/sensor inside the thermometer is
allowed to reach thermal equilibrium with the body being measured, and the physical property of the
thermometer that varies with temperature (for example, the length of a mercury column) is then read off as the
temperature of that body.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Mercury-thermometer.jpg",
    alt: "Close-up photo of the mercury column inside a medical thermometer",
    caption: "The mercury column in a medical thermometer expands or contracts following its own temperature, which adjusts to match the body being measured through thermal equilibrium, so the length of the mercury column can be used to read the temperature.",
    author: "Jurii", license: "CC BY 3.0" },
  { id: "-7Gl-yKF6Y4", title: "Thermal energy, temperature, and heat",
    channel: "Khan Academy", desc: "An introduction to the relationship between thermal energy, temperature, and heat, and the direction of net heat flow between two bodies in contact." }
)}

<h3>2. Temperature Scales: Thermodynamic (Kelvin) and Celsius</h3>
<p>The <strong>thermodynamic scale</strong> of temperature, with the unit <strong>kelvin (K)</strong>, is an
absolute temperature scale that does not depend on the physical properties of any particular substance (for
example, it does not depend on the freezing point/boiling point of water, unlike the Celsius scale). The zero
point of this scale, <strong>0 K (absolute zero)</strong>, is the lowest temperature that can theoretically be
reached, corresponding to the point at which the kinetic energy of the molecules/particles of a substance is
at its minimum value.</p>
<p>According to the Cambridge 9702 <em>syllabus</em> (2025-2027), the official conversion between the Celsius
and Kelvin scales is:</p>
<div class="formula-box">$$\\dfrac{T}{\\text{K}} = \\dfrac{\\theta}{{}^\\circ\\text{C}} + 273{,}15$$</div>
<p>where $T$ = temperature in kelvin and $\\theta$ = temperature in degrees Celsius. This means $0~{}^\\circ\\text{C} =
273{,}15~\\text{K}$ and absolute zero is $0~\\text{K} = -273{,}15~{}^\\circ\\text{C}$.</p>
<p class="muted">Practical note: since the difference between $273{,}15$ and $273$ is only $0{,}15$ K, many
questions (especially those involving a temperature <em>difference</em> $\\Delta T$, rather than an absolute
value $T$) use the quick rounding $T/\\text{K}
\\approx \\theta/{}^\\circ\\text{C} + 273$. Remember: because the size of one kelvin is exactly equal to the
size of one degree Celsius, a <strong>change in temperature</strong> $\\Delta T$ (K) always has the same
numerical value as $\\Delta\\theta$
($^\\circ$C) - the constant $273{,}15$ cancels out when subtracting.</p>
${mediaRow(
  null,
  { id: "eEJqaNaq9v8", title: "Absolute temperature and the kelvin scale",
    channel: "Khan Academy", desc: "An explanation of the concept of absolute temperature, the Kelvin scale, and why absolute zero forms the theoretical lower limit of temperature." }
)}

<h3>3. Practical Temperature Scales: Resistance Thermometers and Thermocouples</h3>
<p>The thermodynamic (Kelvin) scale is theoretical and difficult to measure directly in an everyday
laboratory, so an <strong>empirical/practical temperature scale</strong> is used instead, based on a physical
property of a material that varies (more or less) linearly with temperature. Two examples commonly discussed
in Cambridge 9702 are:</p>
<table>
  <tr><th>Type of thermometer</th><th>Physical property measured</th><th>Range &amp; typical use</th></tr>
  <tr><td>Resistance thermometer (e.g. platinum wire)</td><td>Electrical resistance $R$, which increases almost linearly with temperature</td><td>Wide range, high precision, somewhat slow response; suitable for steady or slowly-changing temperatures in industry &amp; the laboratory</td></tr>
  <tr><td>Thermocouple</td><td>The small e.m.f. (voltage) produced by a junction of two different metals at different temperatures (the Seebeck effect)</td><td>Small in size, fast response, suitable for rapidly-changing temperatures or measurement points that are hard to reach</td></tr>
</table>
<p>Because the physical property $X$ (resistance or e.m.f.) being measured is generally <strong>not perfectly
linear</strong> with temperature over the whole range, a practical thermometer needs to be
<strong>calibrated</strong> using two known fixed points (for example, the ice point $0~{}^\\circ\\text{C}$ and
the steam point $100~{}^\\circ\\text{C}$ at standard atmospheric pressure), after which temperatures between
the two are estimated by linear interpolation:</p>
<div class="formula-box">$$\\theta = \\dfrac{X_\\theta - X_0}{X_{100}-X_0}\\times 100~{}^\\circ\\text{C}$$</div>
<p>where $X_0$ = value of the physical property at $0~{}^\\circ\\text{C}$, $X_{100}$ = value of the physical
property at $100~{}^\\circ\\text{C}$, and $X_\\theta$ = value of the physical property at the unknown
temperature $\\theta$. Because different materials are not linear in exactly the same way, two different types
of practical thermometer may give slightly different temperature readings for the same object (except exactly
at the calibration points) - this is why the thermodynamic (Kelvin) scale is still needed as an absolute
reference that does not depend on any particular material.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Thermocouple.png",
    alt: "Diagram of the working principle of a thermocouple",
    caption: "Diagram of how a thermocouple works: the junction of two different metals produces a small e.m.f. that depends on the temperature difference between the measuring junction and the reference junction (the Seebeck effect).",
    author: "Vivikowski", license: "CC BY-SA 3.0" },
  null
)}

<h3>4. Specific Heat Capacity</h3>
<p>The <strong>specific heat capacity</strong> $c$ of a substance is defined as the amount of heat energy
required to raise the temperature of $1~\\text{kg}$ of that substance by $1~\\text{K}$ (or $1~{}^\\circ\\text{C}$,
since the two are the same size). Its SI unit is $\\text{J kg}^{-1}\\text{K}^{-1}$.</p>
<div class="formula-box">$$Q = mc\\Delta\\theta$$</div>
<p>where $Q$ = heat energy (J), $m$ = mass (kg), $c$ = specific heat capacity ($\\text{J kg}^{-1}
\\text{K}^{-1}$), and $\\Delta\\theta$ = temperature change (K or $^\\circ$C). The value of $c$ differs from one
substance to another - water has a very large $c$ compared with most metals, so water is "slower" to change
temperature for the same amount of heat (this is why the sea or a lake helps to stabilise the temperature
around it).</p>
<p class="muted">Values of specific heat capacity (for example, of water, ice, or a particular metal) are
<strong>not part of</strong> the universal Cambridge 9702 <em>Data and Formulae List</em> (which contains only
fundamental physical constants such as $g$, $e$, $h$, $N_A$), so these values will always be <strong>given
directly in the exam question</strong>. Commonly used values: $c_{air} \\approx 4200~\\text{J kg}^{-1}\\text{K}^{-1}$,
$c_{es} \\approx 2100~\\text{J kg}^{-1}\\text{K}^{-1}$, $c_{aluminium} \\approx 900~\\text{J kg}^{-1}
\\text{K}^{-1}$.</p>
<p><strong>The electrical method</strong> is the standard way of measuring $c$ for a substance (solid or
liquid) in the laboratory: the substance is heated using an electrical heater (e.g. an immersion heater) whose
electrical energy is known precisely from $E = VIt$ (voltage $\\times$ current $\\times$ time), and the
resulting temperature rise $\\Delta\\theta$ is measured. Assuming (or correcting for) heat losses to the
surroundings, $E \\approx Q = mc\\Delta\\theta$, so:</p>
<div class="formula-box">$$c = \\dfrac{VIt}{m\\Delta\\theta}$$</div>
<p class="muted">The complete procedure for this electrical method (including how to minimise errors from heat
loss) is discussed in full in the <strong>Experiment</strong> tab of this topic.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Immersion_heater_(zoom).jpg",
    alt: "Close-up photo of an electrical immersion heater element",
    caption: "An electrical immersion heater: the electrical energy flowing through it ($E=VIt$) is converted into heat, and is used to measure the specific heat capacity of a substance using the electrical method.",
    author: "Simon A. Eugster (LivingShadow)", license: "CC BY-SA 3.0" },
  { id: "GNelfJ6IAJw", title: "Specific heat capacity",
    channel: "Khan Academy", desc: "An explanation of the concept of specific heat capacity and how to use the equation Q = mcΔθ in basic problems." }
)}

<h3>5. Specific Latent Heat</h3>
<p>When a pure substance changes state (for example, ice melting into water, or water evaporating into steam)
at a constant temperature (for example, exactly $0~{}^\\circ\\text{C}$ for the melting of ice, or
$100~{}^\\circ\\text{C}$ for the vaporisation of water at standard atmospheric pressure), <strong>the
temperature of the substance does not change</strong> even though heat continues to be absorbed/released. This
energy is used to break/form intermolecular bonds (changing the arrangement of the substance's particles),
rather than to increase the average kinetic energy of the molecules (which is what temperature is related
to).</p>
<p><strong>Specific latent heat</strong> $L$ of a substance is defined as the amount of heat energy required to
change the state of $1~\\text{kg}$ of that substance, without any accompanying change in temperature:</p>
<div class="formula-box">$$Q = mL$$</div>
<p>where $Q$ = heat energy (J), $m$ = mass of substance that changes state (kg), and $L$ = specific latent heat
($\\text{J kg}^{-1}$). There are two types of specific latent heat for the same substance, and they do
<strong>not</strong> have the same value:</p>
<ul>
  <li><strong>Specific latent heat of fusion, $L_f$</strong>: for a solid $\\leftrightarrow$ liquid change of
  state. Example: $L_f$ of ice $\\approx 3{,}34\\times10^{5}~\\text{J kg}^{-1}$.</li>
  <li><strong>Specific latent heat of vaporisation, $L_v$</strong>: for a liquid $\\leftrightarrow$ gas change
  of state. Example: $L_v$ of water $\\approx 2{,}26\\times10^{6}~\\text{J kg}^{-1}$.</li>
</ul>
<p class="muted">$L_v$ is much greater than $L_f$ for the same substance (water), because vaporising means
breaking almost all of the intermolecular bonds so that the molecules become completely separated far apart as
a gas, whereas melting "only" changes the rigid arrangement of a solid into a liquid in which the molecules
are still close together.</p>
<p>Just as with specific heat capacity, $L$ can also be measured using the <strong>electrical method</strong>:
an electrical heater of known power melts/vaporises a certain mass of the substance over a given time, and the
mass that changes state ($m$) is weighed, so that $L = VIt/m$ (with a correction for heat loss where
necessary).</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Cooling_curve_pure_metal.svg",
    alt: "Graph of the cooling curve of a pure metal showing a constant-temperature plateau during freezing",
    caption: "Cooling curve of a pure metal: the temperature falls steadily while the metal is liquid and while it is solid, but is flat (the temperature stays constant) while freezing is taking place - heat continues to be released, but all of it is used for the change of state (latent heat), not for lowering the temperature.",
    author: "Wizard191", license: "CC BY-SA 3.0" },
  { id: "7bvqJUszxhs", title: "Specific latent heat / Cambridge International AS & A Level Physics",
    channel: "College Physics", desc: "An explanation of the definition and use of specific latent heat (Q = mL) in the context of the Cambridge International AS & A Level Physics syllabus." }
)}

<h3>6. Bringing It Together: Temperature-Time Graphs During Heating</h3>
<p>Imagine a block of ice being heated at a constant rate of heat supply (for example, using an electrical
heater of constant power), starting below $0~{}^\\circ\\text{C}$ until it has all become hot steam. A graph of
temperature against time (or against the heat energy absorbed so far, since heat $\\propto$ time at constant
power) shows a characteristic rising-flat-rising-flat pattern, with <strong>five stages</strong>:</p>
<ol>
  <li>The temperature of the ice rises steadily from $<0~{}^\\circ\\text{C}$ towards $0~{}^\\circ\\text{C}$
  (using $c_{es}$).</li>
  <li>The temperature is <strong>flat at exactly $0~{}^\\circ\\text{C}$</strong> while all of the ice melts
  into water (using $L_f$ of ice) - during this stage there is a mixture of ice and water at the same
  temperature.</li>
  <li>The temperature of the (liquid) water rises steadily from $0~{}^\\circ\\text{C}$ towards
  $100~{}^\\circ\\text{C}$ (using $c_{air}$).</li>
  <li>The temperature is <strong>flat at exactly $100~{}^\\circ\\text{C}$</strong> while all of the water
  vaporises into steam (using $L_v$ of water).</li>
  <li>The temperature of the steam rises again above $100~{}^\\circ\\text{C}$ (using the specific heat capacity
  of steam).</li>
</ol>
<p>Because the rate of heat supply (heater power) is constant, the <strong>width of a flat section</strong> on
the graph (the length of time the temperature stays unchanged) is directly proportional to the value of $L$
for that stage, while the <strong>gradient</strong> of a rising section is inversely proportional to $c$ for
that phase (the larger $c$ is, the shallower/slower the temperature rise for the same rate of heat supply). To
calculate the total energy required from one end of the process to the other, the heat for <strong>each stage
is calculated separately and then added together</strong> - this is the type of combined multi-stage question
that often appears in exams (see Practice Question 5 below for a full example).</p>
${mediaRow(
  null,
  { id: "hxe7Ce7vUwU", title: "A Level Physics: Specific Heat Capacity Question examples from past papers",
    channel: "ZPhysics", desc: "Practice working through several exam-style A Level specific heat capacity questions, as extra practice after understanding the basic concepts." }
)}
`;

const TEMPERATURE_EKSPERIMEN_EN = {
  title: "Real Experiment: Determining the Specific Heat Capacity of Aluminium Using the Electrical Method",
  intro: `
    <p class="muted">This is a genuine physical experiment using real laboratory apparatus (immersion heater,
    ammeter, voltmeter, metal block), not a computer simulation. It is a classic, standard practical found in
    many syllabuses (including as a <em>required practical</em> in various A-Level curricula) for determining
    the specific heat capacity $c$ of a metal (aluminium, in this case) using the electrical method.</p>

    <h4>Aim</h4>
    <p>To determine the specific heat capacity $c$ of aluminium from experimental data (electrical energy,
    mass, and temperature rise), and then compare it with the reference value $c_{aluminium} \\approx 900~\\text{J
    kg}^{-1}\\text{K}^{-1}$.</p>

    <h4>Underlying Concept</h4>
    <p>An immersion heater carrying current $I$ at voltage $V$ for a time $t$ supplies electrical energy:</p>
    <div class="formula-box">$$E = VIt$$</div>
    <p>Assuming that all of this electrical energy is absorbed by the metal block (with none lost to the
    surrounding air, to the thermometer, or to the heater hole), this energy raises the temperature of the
    block according to:</p>
    <div class="formula-box">$$E = mc\\Delta\\theta \\quad\\Rightarrow\\quad c = \\dfrac{VIt}{m\\Delta\\theta}$$</div>
    <p>where $m$ = mass of the block (kg) and $\\Delta\\theta$ = temperature rise of the block (K). Because in
    practice there is always some heat lost to the surroundings (the block is never perfectly insulated), the
    value of $c$ calculated from experimental data is usually slightly <strong>larger</strong> than the
    reference value (because some of the electrical energy is "wasted", yet the formula above assumes it all
    goes into the block, making it appear as if more energy is needed per kg-K than is really the case).</p>

    <h4>Apparatus &amp; Materials</h4>
    <ul>
      <li>A drilled aluminium block (an aluminium cylinder with two holes: one for the immersion heater, one
      for the thermometer/temperature sensor), mass approximately $0{,}20$ - $1{,}0$ kg</li>
      <li>An electrical immersion heater that fits snugly into the hole in the block, connected to a
      low-voltage power supply of 12 V AC/DC</li>
      <li>A voltmeter (or the voltage reading on the power supply if it is calibrated) and an ammeter, or
      alternatively a joulemeter that reads electrical energy directly in joules</li>
      <li>A thermometer (or a thermocouple/digital temperature sensor), with a range of at least $-10$ to
      $110~{}^\\circ\\text{C}$</li>
      <li>A balance (precision of at least 1 g) for weighing the mass of the block</li>
      <li>A stopwatch (in case the heater power is not perfectly constant, or to control the heating time)</li>
      <li>A little lubricating oil (to fill the gaps in the thermometer and heater holes for better thermal
      contact), and insulating material (cotton wool/wool/rolled paper) to wrap the block and reduce heat loss
      to the air</li>
    </ul>

    <h4>Procedure</h4>
    <ol>
      <li>Weigh the mass of the aluminium block ($m$) and record the result.</li>
      <li>Insert the immersion heater into one hole of the block, and the thermometer/temperature sensor into
      the other hole, adding a little oil into the gaps of both holes for good thermal contact.</li>
      <li>Wrap the block with insulating material (cotton wool/wool) to reduce heat loss to the surrounding
      air during heating (leaving a small gap for reading the thermometer).</li>
      <li>Record the initial temperature of the block $\\theta_1$ before switching on the heater.</li>
      <li>Connect the heater to the power supply through the ammeter and voltmeter. Switch on the heater at
      the same time as starting the stopwatch. Record the readings of $V$ and $I$ (if both remain relatively
      stable during heating).</li>
      <li>Heat for a set time $t$ (for example, 5 to 10 minutes, enough to raise the temperature of the block
      by about 20-30°C), then switch off the heater and stop the stopwatch at the same time.</li>
      <li>Stir/wait briefly to allow the temperature throughout the block to become uniform, then record the
      highest temperature reached, $\\theta_2$ (the temperature may still rise slightly after the heater is
      switched off, because heat from the heater has not yet fully spread through the block - record the peak
      temperature).</li>
      <li>Repeat this whole procedure 2-3 times (either with the same metal block after it has cooled back to
      room temperature, or with a different metal such as copper for comparison) to check the repeatability of
      the results.</li>
    </ol>

    <h4>Data Table (example - fill in with your own experimental data)</h4>
    <table>
      <tr><th>Trial</th><th>m (kg)</th><th>V (V)</th><th>I (A)</th><th>t (s)</th><th>θ₁ (°C)</th><th>θ₂ (°C)</th><th>Δθ (K)</th><th>c = VIt/(mΔθ) (J kg⁻¹ K⁻¹)</th></tr>
      <tr><td>1</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>3</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    </table>

    <h4>Analysis &amp; Calculations</h4>
    <ul>
      <li>Calculate the electrical energy $E = VIt$ for each trial, then calculate $c = E/(m\\Delta\\theta)$.</li>
      <li>Calculate the average $c$ from several trials/repeats, then compare it with the reference value
      $900~\\text{J kg}^{-1}\\text{K}^{-1}$ by calculating the percentage difference:
      $\\left|\\dfrac{c_{eksperimen}-c_{referensi}}{c_{referensi}}\\right|\\times100\\%$.</li>
      <li>If apparatus is available to vary the heating time $t$ (with $V$, $I$ fixed), also plot a graph of
      $\\Delta\\theta$ (y-axis) against $t$ (x-axis): this graph should be a straight line through the origin
      with gradient $VI/(mc)$, so that $c$ can be calculated from the gradient without relying on a single data
      point alone (more accurate, since it uses a <em>line of best fit</em>).</li>
    </ul>

    <h4>Safety Precautions</h4>
    <ul>
      <li>The immersion heater uses low-voltage electricity but can still become very hot - do not touch the
      heating element directly with your hands; use tongs/pliers if it needs to be moved.</li>
      <li>Do not switch on the immersion heater in open air (outside the block's hole / without a
      heat-absorbing medium) - the heating element can be damaged and become extremely hot without a cooling
      medium.</li>
      <li>The aluminium block will become hot (it can reach 40-60°C or more) - wait until it has cooled
      sufficiently before handling it directly without gloves/a cloth.</li>
      <li>Switch off the power supply before disconnecting or connecting any wiring.</li>
      <li>If a variant using water is used (see the Alternative below), take care with hot water and make sure
      no spilled water reaches the electrical power supply.</li>
    </ul>

    <h4>Sources of Error (for discussion in your report)</h4>
    <ul>
      <li>Heat loss to the surrounding air and to the insulating material during heating (the most significant
      source), which makes the experimental value of $c$ tend to be larger than the true value.</li>
      <li>The heat capacity of the thermometer/sensor and of the heater itself also absorbs a small amount of
      heat (neglected in the simple calculation above).</li>
      <li>A delay in the thermometer's response (it does not instantly show the true temperature of the
      block), especially while the temperature is still rising shortly after the heater is switched off.</li>
      <li>Small fluctuations in the readings of $V$ and $I$ during heating if the power supply is not
      perfectly stable.</li>
    </ul>

    <h4>Simple Alternative: Method of Mixtures (if no immersion heater/ammeter/voltmeter is available)</h4>
    <p>If electrical apparatus (immersion heater, ammeter, voltmeter) is not available, the specific heat
    capacity of a metal can still be estimated using the <strong>method of mixtures</strong>, applying Black's
    principle - all that is needed is water, an insulated calorimeter/cup, a balance, and a thermometer:</p>
    <ol>
      <li>Weigh a block/piece of metal ($m_{logam}$), and heat it in boiling water (in a separate pan) until
      its temperature is close to $100~{}^\\circ\\text{C}$.</li>
      <li>Weigh a quantity of water ($m_{air}$) in an insulated container (a simple calorimeter), and record
      the initial temperature of the water, $\\theta_{air}$.</li>
      <li>Transfer the hot metal into the water as quickly as possible, stir gently, and record the final
      temperature of the mixture, $\\theta_c$, once it has stabilised (thermal equilibrium reached).</li>
      <li>Because the heat released by the metal equals the heat absorbed by the water (Black's principle,
      assuming no heat is lost to the container/surroundings): $m_{logam}\\,c_{logam}(100-\\theta_c) =
      m_{air}\\,c_{air}(\\theta_c - \\theta_{air})$, so that $c_{logam}$ can be calculated.</li>
      <li>This method is simpler and cheaper, but its error tends to be larger (transferring the metal from
      the pan to the calorimeter takes time, so the metal has already cooled slightly before it is fully
      immersed).</li>
    </ol>

    <h4>Discussion Questions</h4>
    <ul>
      <li>Why is the experimental value of $c$ from the electrical method usually slightly larger than the
      reference value, rather than smaller? Explain the direction of the error.</li>
      <li>How does wrapping the block with insulating material (cotton wool/wool) help to reduce error in this
      experiment?</li>
      <li>Why, in the method of mixtures, must the metal be transferred "as quickly as possible" from the
      boiling water to the calorimeter?</li>
      <li>If two different metals of equal mass are heated with exactly the same amount of electrical energy,
      which metal will undergo the greater temperature rise - the one with a larger $c$ or a smaller $c$?
      Explain.</li>
    </ul>

    <h4>References</h4>
    <ul>
      <li><a href="https://spark.iop.org/specific-thermal-capacity-aluminium" target="_blank" rel="noopener">Specific thermal capacity of aluminium, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/specific-thermal-capacity-aluminium-more-accurately" target="_blank" rel="noopener">Specific thermal capacity of aluminium, more accurately, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/episode-607-specific-heat-capacity" target="_blank" rel="noopener">Episode 607: Specific heat capacity, IOPSpark</a></li>
      <li><a href="https://pmt.physicsandmathstutor.com/download/Physics/A-level/Notes/OCR-A/1-Practical-Skills-in-Physics/PAG%2011.2%20-%20Determining%20specific%20heat%20capacity.pdf" target="_blank" rel="noopener">PAG 11.2 - Determining specific heat capacity, Physics & Maths Tutor (OCR A-level)</a></li>
    </ul>
  `
};

/* type: "mcq" or "structured".
   For mcq: options[] and correct = index of the correct answer. */
const TEMPERATURE_LATIHAN_EN = [
  {
    type: "mcq",
    question: "The temperature of a laboratory room reads 23°C on a Celsius thermometer. What is this temperature expressed in kelvin? (use T/K = θ/°C + 273.15)",
    options: ["250.15 K", "273.15 K", "296.15 K", "296.00 K"],
    correct: 2,
    solution: `$\\dfrac{T}{\\text{K}} = \\dfrac{\\theta}{{}^\\circ\\text{C}} + 273{,}15 = 23 + 273{,}15 = 296{,}15$.
    <br>So $T = 296{,}15~\\text{K}$. (The option "296.00 K" is a common trap, since it forgets the decimal digit $0{,}15$.)`
  },
  {
    type: "mcq",
    question: "How much heat energy is required to raise the temperature of 2.0 kg of water from 20°C to 80°C? (specific heat capacity of water c = 4200 J kg⁻¹ K⁻¹)",
    options: ["5.04 × 10⁴ J", "5.04 × 10⁵ J", "1.01 × 10⁶ J", "2.52 × 10⁵ J"],
    correct: 1,
    solution: `$\\Delta\\theta = 80-20 = 60~\\text{K}$.
    <br>$Q = mc\\Delta\\theta = 2{,}0 \\times 4200 \\times 60 = 504\\,000~\\text{J} = 5{,}04\\times10^{5}~\\text{J}$.`
  },
  {
    type: "structured",
    question: "An aluminium block of mass 0.20 kg is heated using an electrical immersion heater connected to a 12 V power supply carrying a current of 4.0 A, for 5.0 minutes. The temperature of the block rises from 18.0°C to 90.0°C. (a) Calculate the total electrical energy supplied by the heater. (b) From this data, calculate the specific heat capacity of aluminium measured in this experiment. (c) The reference value for the specific heat capacity of aluminium is 900 J kg⁻¹ K⁻¹. Explain why the value obtained from this experiment is slightly higher than this reference value.",
    solution: `<strong>(a)</strong> $t = 5{,}0$ minutes $= 300~\\text{s}$.
    <br>$E = VIt = 12 \\times 4{,}0 \\times 300 = 14\\,400~\\text{J} = 1{,}44\\times10^{4}~\\text{J}$.
    <br><strong>(b)</strong> $\\Delta\\theta = 90{,}0 - 18{,}0 = 72{,}0~\\text{K}$.
    <br>$c = \\dfrac{E}{m\\Delta\\theta} = \\dfrac{14\\,400}{0{,}20 \\times 72{,}0} = \\dfrac{14\\,400}{14{,}4} = 1000~\\text{J kg}^{-1}\\text{K}^{-1}$.
    <br><strong>(c)</strong> The experimental value ($1000~\\text{J kg}^{-1}\\text{K}^{-1}$) is higher than the reference value ($900~\\text{J kg}^{-1}\\text{K}^{-1}$) because some of the electrical energy supplied by the heater is lost to the surroundings (the air, the thermometer, the mounting of the block) instead of entirely raising the temperature of the block. Because the calculation in part (b) assumes that all of the electrical energy goes into the block, the temperature rise that "should" occur for that amount of energy appears smaller than it would without any heat loss, so the calculated value of $c$ comes out larger than the true value.`
  },
  {
    type: "structured",
    question: "A mass of 0.50 kg of ice, already at exactly 0°C, is completely melted into water at 0°C using an electrical heater. The specific latent heat of fusion of ice is 3.34 × 10⁵ J kg⁻¹. (a) Calculate the heat energy required to melt all of the ice. (b) If the heater has an output power of 60 W and all of its energy is assumed to be used for melting (with no heat loss), how long (in minutes) is needed to melt all of the ice?",
    solution: `<strong>(a)</strong> $Q = mL_f = 0{,}50 \\times 3{,}34\\times10^{5} = 1{,}67\\times10^{5}~\\text{J}$ (167,000 J).
    <br><strong>(b)</strong> $P = \\dfrac{Q}{t} \\Rightarrow t = \\dfrac{Q}{P} = \\dfrac{1{,}67\\times10^{5}}{60} \\approx 2783~\\text{s}$.
    <br>In minutes: $t \\approx \\dfrac{2783}{60} \\approx 46{,}4~\\text{minutes}$.`
  },
  {
    type: "structured",
    question: "A mass of 0.30 kg of ice at −10°C is heated until it has all become steam at 100°C, at normal atmospheric pressure. Given: specific heat capacity of ice c_es = 2100 J kg⁻¹ K⁻¹, specific heat capacity of water c_air = 4200 J kg⁻¹ K⁻¹, specific latent heat of fusion of ice L_f = 3.34 × 10⁵ J kg⁻¹, specific latent heat of vaporisation of water L_v = 2.26 × 10⁶ J kg⁻¹. Calculate the heat energy for each of the following stages, then calculate the overall total energy: (a) heating the ice from −10°C to 0°C, (b) melting the ice at 0°C, (c) heating the (liquid) water from 0°C to 100°C, (d) vaporising the water at 100°C, (e) the total energy for the whole process.",
    solution: `<strong>(a)</strong> $Q_1 = mc_{es}\\Delta\\theta = 0{,}30 \\times 2100 \\times 10 = 6300~\\text{J}$.
    <br><strong>(b)</strong> $Q_2 = mL_f = 0{,}30 \\times 3{,}34\\times10^{5} = 1{,}002\\times10^{5}~\\text{J}$ (100,200 J).
    <br><strong>(c)</strong> $Q_3 = mc_{air}\\Delta\\theta = 0{,}30 \\times 4200 \\times 100 = 126\\,000~\\text{J}$.
    <br><strong>(d)</strong> $Q_4 = mL_v = 0{,}30 \\times 2{,}26\\times10^{6} = 6{,}78\\times10^{5}~\\text{J}$ (678,000 J).
    <br><strong>(e)</strong> $Q_{total} = Q_1+Q_2+Q_3+Q_4 = 6300 + 100\\,200 + 126\\,000 + 678\\,000 = 910\\,500~\\text{J} \\approx 9{,}11\\times10^{5}~\\text{J}$.
    <br>Note that the vaporisation stage (d) absorbs the greatest amount of energy of all the stages, far more than the melting stage (b), consistent with $L_v \\gg L_f$ for water.`
  },
  {
    type: "structured",
    question: "A metal block of mass 0.15 kg is heated to 100°C and then quickly placed into 0.20 kg of water initially at 20.0°C, inside a well-insulated calorimeter vessel (the heat capacity of the vessel is neglected). The final temperature of the mixture, once thermal equilibrium has been reached, is 27.3°C. The specific heat capacity of water is 4200 J kg⁻¹ K⁻¹. (a) Using the concept of net heat flow, explain why the temperatures of the metal and the water become equal at thermal equilibrium. (b) Assuming no heat is lost to the surroundings, use Black's principle (heat released by the metal = heat absorbed by the water) to calculate the specific heat capacity of the metal.",
    solution: `<strong>(a)</strong> As long as the temperature of the metal is still higher than the temperature of the water, heat continues to flow with a net transfer from the metal (higher temperature) to the water (lower temperature). This net flow only stops once the two temperatures become exactly equal, because at that point there is no longer any temperature difference to drive a net flow of heat in either direction - this is the state of thermal equilibrium.
    <br><strong>(b)</strong> Heat absorbed by the water: $Q_{air} = m_{air}c_{air}\\Delta\\theta_{air} = 0{,}20 \\times 4200 \\times (27{,}3-20{,}0) = 0{,}20 \\times 4200 \\times 7{,}3 = 6132~\\text{J}$.
    <br>The heat released by the metal is equal to this (Black's principle): $Q_{logam} = m_{logam}c_{logam}\\Delta\\theta_{logam} = 0{,}15 \\times c_{logam} \\times (100-27{,}3) = 0{,}15 \\times c_{logam} \\times 72{,}7$.
    <br>$0{,}15 \\times 72{,}7 \\times c_{logam} = 6132 \\Rightarrow c_{logam} = \\dfrac{6132}{10{,}905} \\approx 562~\\text{J kg}^{-1}\\text{K}^{-1}$.`
  }
];

/* Concise formula sheet (plain text), used as automatic "grounding":
   attached to prompts sent to the AI so that the AI uses exactly the
   formulas & values already validated by the teacher, rather than
   guessing from general knowledge. */
const TEMPERATURE_FORMULA_SHEET_EN = `
- Thermal equilibrium: heat flows with a net transfer from a body at a higher temperature to a body at a lower temperature; once both reach the same temperature, there is no longer any net flow of heat (thermal equilibrium). This idea underlies the definition of temperature (similar, informally, to the Zeroth Law of Thermodynamics).
- Official Cambridge 9702 temperature conversion (2025-2027 syllabus): T/K = theta/degC + 273.15. The rounded form T/K = theta/degC + 273 is sometimes used for a quick estimate.
- Absolute zero: 0 K = -273.15 degC, the lowest temperature theoretically possible.
- Because the size of 1 K is the same as the size of 1 degC, a temperature change delta-T (K) always has the same numerical value as delta-theta (degC); the constant 273.15 cancels out when subtracting.
- Thermodynamic (Kelvin) scale: absolute, independent of the properties of any particular material. Practical/empirical scale (platinum resistance thermometer, thermocouple): uses a physical property of a material (resistance R, e.m.f.) that varies roughly linearly with temperature, calibrated using 2 fixed points (e.g. 0 degC and 100 degC), then theta = (X_theta - X_0)/(X_100 - X_0) x 100 degC.
- Specific heat capacity c: heat per unit mass per unit rise in temperature, unit J/(kg K). Q = m c deltaTheta.
- Electrical method for measuring c: E = V I t (electrical energy) is converted into heat, c = V I t / (m deltaTheta), assuming/correcting for no heat loss to the surroundings.
- Specific latent heat L: heat per unit mass to change the state of a substance WITHOUT a change in temperature. Q = m L. There is L_fusion (solid<->liquid) and L_vaporization (liquid<->gas); their values differ for the same substance (L_vaporization is much greater than L_fusion).
- Values commonly used in Cambridge 9702 questions (NOT part of the universal Data and Formulae List, usually given directly in the question): c_water = 4200 J/(kg K); c_ice is approximately 2100 J/(kg K); c_aluminium is approximately 900 J/(kg K); L_fusion of ice = 3.34 x 10^5 J/kg; L_vaporization of water = 2.26 x 10^6 J/kg.
- Temperature-time graph during constant-rate heating: the temperature rises steadily during one phase (the gradient is inversely proportional to c for that phase), then stays flat during a change of state (the width of the flat section is directly proportional to L).
- Combined multi-stage questions (e.g. cold ice -> melting -> water -> steam): calculate the heat for each stage separately (heating uses Q=mcDeltaTheta, a change of state uses Q=mL), then add up all the stages to find the total energy.
- Black's principle (method of mixtures/calorimetry): in an isolated system, the heat released by the body at higher temperature = the heat absorbed by the body at lower temperature; used to determine the c of an unknown body.
`;

/* Specific concepts for the Prompt Generator dropdown in the Virtual Simulation Lab */
const TEMPERATURE_LAB_CONCEPTS_EN = [
  "Thermal Equilibrium and the Direction of Net Heat Flow",
  "Thermodynamic (Kelvin) Temperature Scale vs the Celsius Scale",
  "Calibration of Practical Thermometers (Resistance Thermometer / Thermocouple)",
  "Specific Heat Capacity and the Electrical Method (Q = mcΔθ)",
  "Specific Latent Heat of Fusion and Vaporisation (Q = mL)",
  "Temperature-Time Graphs During Heating Through a Change of State",
  "Other (write your own in additional instructions)"
];

const TEMPERATURE_MATERI_CHECK = [
  { question: "Satuan SI untuk kapasitas kalor jenis (specific heat capacity) adalah...",
    options: ["J kg⁻¹", "J kg⁻¹ K⁻¹", "J K⁻¹", "Watt"], correct: 1,
    explanation: "Kapasitas kalor jenis c didefinisikan dari E = mcΔθ, sehingga satuannya J kg⁻¹ K⁻¹." },
  { question: "Dua benda A dan B disentuhkan hingga tidak ada lagi aliran kalor NETO di antara keduanya. Kondisi ini disebut...",
    options: ["Kesetimbangan termal", "Kalor laten", "Kapasitas kalor jenis", "Konduksi kalor"], correct: 0,
    explanation: "Saat tidak ada lagi aliran kalor neto antara dua benda (suhu keduanya sama), keduanya dikatakan berada dalam kesetimbangan termal." },
  { question: "Suhu 27°C jika dikonversi ke skala Kelvin (gunakan T/K = θ/°C + 273) adalah...",
    options: ["27 K", "273 K", "300 K", "327 K"], correct: 2,
    explanation: "T(K) = θ(°C) + 273 = 27 + 273 = 300 K." },
  { question: "Saat es sedang melebur menjadi air pada 0°C, kalor terus diserap tetapi suhu campuran es-air tidak berubah. Ke mana energi kalor tersebut digunakan?",
    options: ["Menaikkan energi kinetik rata-rata molekul", "Mengubah susunan/ikatan antarmolekul (mengubah wujud zat)", "Menaikkan tekanan sistem", "Energi tersebut hilang, tidak dipakai untuk apa pun"], correct: 1,
    explanation: "Selama perubahan wujud, kalor (kalor laten) dipakai untuk mengubah susunan/ikatan antarmolekul, bukan menaikkan energi kinetik rata-rata molekul - itulah sebabnya suhu tetap konstan." },
  { question: "Mengapa kalor uap jenis (Lv) suatu zat cair umumnya jauh LEBIH BESAR daripada kalor lebur jenisnya (Lf)?",
    options: ["Karena menguap membutuhkan waktu lebih lama", "Karena menguap memutuskan hampir seluruh ikatan antarmolekul hingga molekul benar-benar terpisah menjadi gas, sedangkan melebur hanya mengubah susunan padat menjadi cair yang molekulnya masih berdekatan", "Karena tekanan atmosfer memengaruhi Lv tetapi tidak memengaruhi Lf", "Karena Lv selalu diukur pada suhu yang lebih tinggi daripada Lf"], correct: 1,
    explanation: "Menguap berarti memutuskan hampir seluruh ikatan antarmolekul sehingga molekul terpisah jauh menjadi gas, sedangkan melebur hanya mengubah susunan padat yang kaku menjadi cair yang molekulnya masih berdekatan." }
];
const TEMPERATURE_MATERI_CHECK_EN = [
  { question: "The SI unit for specific heat capacity is...",
    options: ["J kg⁻¹", "J kg⁻¹ K⁻¹", "J K⁻¹", "Watt"],
    explanation: "Specific heat capacity c is defined from E = mcΔθ, so its unit is J kg⁻¹ K⁻¹." },
  { question: "Two objects A and B are put in contact until there is no more NET flow of heat between them. This condition is called...",
    options: ["Thermal equilibrium", "Latent heat", "Specific heat capacity", "Heat conduction"],
    explanation: "When there is no more net heat flow between two objects (their temperatures are equal), they are said to be in thermal equilibrium." },
  { question: "27°C converted to the Kelvin scale (using T/K = θ/°C + 273) is...",
    options: ["27 K", "273 K", "300 K", "327 K"],
    explanation: "T(K) = θ(°C) + 273 = 27 + 273 = 300 K." },
  { question: "While ice is melting into water at 0°C, heat keeps being absorbed but the temperature of the ice-water mixture doesn't change. Where does that heat energy go?",
    options: ["Into raising the average kinetic energy of the molecules", "Into changing the bonds/arrangement between molecules (changing state)", "Into raising the system's pressure", "It's lost - not used for anything"],
    explanation: "During a change of state, the heat (latent heat) is used to change the bonds/arrangement between molecules, not to raise the average molecular kinetic energy - which is why the temperature stays constant." },
  { question: "Why is the specific latent heat of vaporisation (Lv) of a liquid usually much LARGER than its specific latent heat of fusion (Lf)?",
    options: ["Because vaporising takes longer", "Because vaporising breaks nearly all the intermolecular bonds so molecules separate completely into a gas, while melting only turns a rigid solid arrangement into a liquid where molecules are still close together", "Because atmospheric pressure affects Lv but not Lf", "Because Lv is always measured at a higher temperature than Lf"],
    explanation: "Vaporising breaks nearly all the intermolecular bonds so the molecules become widely separated as a gas, while melting only changes a rigid solid arrangement into a liquid where molecules remain close together." }
];
const TEMPERATURE_EKSPERIMEN_CHECK = [
  { question: "Pada eksperimen ini, energi listrik dihitung dengan E = VIt. Untuk menentukan kapasitas kalor jenis c aluminium, energi ini dibagi dengan...",
    options: ["Massa balok saja (m)", "Hasil kali massa balok dan kenaikan suhu (mΔθ)", "Waktu pemanasan saja (t)", "Tegangan V saja"], correct: 1,
    explanation: "Dari E = mcΔθ, maka c = E/(mΔθ) - energi dibagi hasil kali massa dan kenaikan suhu." },
  { question: "Nilai kapasitas kalor jenis c hasil eksperimen biasanya sedikit LEBIH BESAR daripada nilai referensi. Apa penyebab utamanya?",
    options: ["Alat ukur tegangan selalu salah", "Sebagian kalor hilang ke lingkungan, padahal rumus menganggap semua energi masuk ke balok", "Aluminium menyusut saat dipanaskan", "Arus listrik selalu lebih kecil dari yang terbaca"], correct: 1,
    explanation: "Balok tidak sempurna terisolasi, sehingga sebagian energi listrik hilang ke sekitar, membuat c hitung tampak lebih besar." }
];
const TEMPERATURE_EKSPERIMEN_CHECK_EN = [
  { question: "In this experiment, electrical energy is calculated as E = VIt. To find aluminium's specific heat capacity c, this energy is divided by...",
    options: ["The block's mass alone (m)", "The product of the block's mass and temperature rise (mΔθ)", "The heating time alone (t)", "The voltage V alone"],
    explanation: "From E = mcΔθ, c = E/(mΔθ) - energy divided by the product of mass and temperature rise." },
  { question: "The experimentally calculated specific heat capacity c is usually slightly HIGHER than the reference value. What is the main reason?",
    options: ["The voltmeter is always wrong", "Some heat is lost to the surroundings, but the formula assumes all energy enters the block", "Aluminium shrinks when heated", "The current is always smaller than what is read"],
    explanation: "The block is not perfectly insulated, so some electrical energy is lost to the surroundings, making the calculated c appear larger." }
];

(function attachTemperatureContent() {
  const topic = TOPICS.find(t => t.id === "temperature");
  topic.desc = { id: topic.desc, en: TEMPERATURE_DESC_EN };
  topic.materiHTML = { id: TEMPERATURE_MATERI, en: TEMPERATURE_MATERI_EN };
  topic.eksperimen = {
    title: { id: TEMPERATURE_EKSPERIMEN.title, en: TEMPERATURE_EKSPERIMEN_EN.title },
    intro: { id: TEMPERATURE_EKSPERIMEN.intro, en: TEMPERATURE_EKSPERIMEN_EN.intro }
  };
  topic.latihan = TEMPERATURE_LATIHAN.map((q, i) => {
    const qEN = TEMPERATURE_LATIHAN_EN[i] || {};
    return {
      ...q,
      question: { id: q.question, en: qEN.question },
      options: q.options ? q.options.map((opt, j) => ({ id: opt, en: (qEN.options || [])[j] })) : q.options,
      solution: { id: q.solution, en: qEN.solution }
    };
  });
  topic.labConcepts = TEMPERATURE_LAB_CONCEPTS.map((c, i) => ({ id: c, en: TEMPERATURE_LAB_CONCEPTS_EN[i] }));
  topic.formulaSheet = { id: TEMPERATURE_FORMULA_SHEET, en: TEMPERATURE_FORMULA_SHEET_EN };
  topic.materiCheck = mapCheckQuestions(TEMPERATURE_MATERI_CHECK, TEMPERATURE_MATERI_CHECK_EN);
  topic.eksperimenCheck = mapCheckQuestions(TEMPERATURE_EKSPERIMEN_CHECK, TEMPERATURE_EKSPERIMEN_CHECK_EN);
})();

/* ------------------------------------------------------------
   Konten lengkap: IDEAL GASES (topik 15, A2)
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   Konten lengkap: IDEAL GASES (topik 15, A2)
   File draft berdiri sendiri - akan digabung manual ke content.js.
   Tidak mendefinisikan ulang mediaRow() atau TOPICS (sudah ada
   di content.js utama).
   ------------------------------------------------------------ */

const IDEALGASES_MATERI = `
<h3>1. Jumlah Zat: Mol dan Konstanta Avogadro</h3>
<p><strong>Mol (mole)</strong> adalah satuan SI untuk <em>jumlah zat</em> (amount of substance). Satu mol
zat apa pun mengandung jumlah partikel (atom, molekul, ion, dsb.) yang persis sama, yaitu sebesar
<strong>konstanta Avogadro</strong> $N_A$. Sesuai data sheet Cambridge 9702:</p>
<div class="formula-box">$$N_A = 6{,}02 \\times 10^{23}~\\text{mol}^{-1}$$</div>
<p>Jika suatu sampel zat terdiri dari $n$ mol, maka jumlah molekul (atau partikel) di dalamnya adalah:</p>
<div class="formula-box">$$N = nN_A$$</div>
<p>dengan $N$ = jumlah molekul (tanpa satuan, bilangan murni) dan $n$ = jumlah mol (mol). Jumlah mol suatu
sampel juga bisa dihitung dari massanya jika massa molar $M$ zat tersebut diketahui:</p>
<div class="formula-box">$$n = \\dfrac{\\text{massa sampel}}{\\text{massa molar}} = \\dfrac{m}{M}$$</div>
<p class="muted">Hati-hati satuan: massa molar $M$ biasanya diberikan dalam g mol⁻¹ (misalnya oksigen
$M=32~\\text{g mol}^{-1}$), sedangkan rumus gas ideal $pV=nRT$ butuh besaran dalam satuan SI murni. Karena
$n$ (mol) sudah tak berdimensi terhadap kg/g, kamu boleh memakai $M$ dalam g mol⁻¹ maupun kg mol⁻¹ asalkan
satuan massa sampel yang dipakai konsisten (gram dengan gram, atau kilogram dengan kilogram).</p>
${mediaRow(
  null,
  { id: "_Su9Fij7TMQ", title: "The mole and Avogadro's number | Moles and molar mass | High school chemistry | Khan Academy",
    channel: "Khan Academy", desc: "Pengantar konsep mol dan konstanta Avogadro, serta cara mengonversi massa sampel menjadi jumlah mol dan jumlah partikel." }
)}

<h3>2. Persamaan Keadaan Gas Ideal</h3>
<p>Gas ideal adalah model gas yang mematuhi hubungan sederhana antara tekanan $p$, volume $V$, jumlah mol
$n$, dan suhu mutlak $T$ (dalam kelvin) secara persis di semua kondisi. Hubungan ini disebut
<strong>persamaan keadaan gas ideal</strong> (equation of state):</p>
<div class="formula-box">$$pV = nRT$$</div>
<p>dengan $R$ = <strong>konstanta gas molar</strong> (molar gas constant), nilai standar pada data sheet
Cambridge 9702:</p>
<div class="formula-box">$$R = 8{,}31~\\text{J K}^{-1}\\text{mol}^{-1}$$</div>
<p>Karena $n = N/N_A$ (jumlah mol = jumlah molekul dibagi konstanta Avogadro), persamaan keadaan gas ideal
bisa ditulis ulang dalam bentuk per-molekul:</p>
<div class="formula-box">$$pV = nRT = \\dfrac{N}{N_A}RT = NkT$$</div>
<p>dengan $k$ = <strong>konstanta Boltzmann</strong> (Boltzmann constant), yaitu konstanta gas per molekul
(bukan per mol):</p>
<div class="formula-box">$$k = \\dfrac{R}{N_A} = 1{,}38 \\times 10^{-23}~\\text{J K}^{-1}$$</div>
<table>
  <tr><th>Simbol</th><th>Besaran</th><th>Satuan SI</th></tr>
  <tr><td>$p$</td><td>Tekanan gas</td><td>Pa (N m⁻²)</td></tr>
  <tr><td>$V$</td><td>Volume gas</td><td>m³</td></tr>
  <tr><td>$n$</td><td>Jumlah mol</td><td>mol</td></tr>
  <tr><td>$N$</td><td>Jumlah molekul</td><td>tanpa satuan</td></tr>
  <tr><td>$T$</td><td>Suhu mutlak</td><td>K (bukan °C!)</td></tr>
  <tr><td>$R$</td><td>Konstanta gas molar</td><td>J K⁻¹ mol⁻¹</td></tr>
  <tr><td>$k$</td><td>Konstanta Boltzmann</td><td>J K⁻¹</td></tr>
</table>
<p class="muted">Ingat selalu mengubah suhu ke kelvin sebelum menghitung. Sesuai syllabus Cambridge 9702 (2025-2027,
lihat juga topik Suhu): $T(\\text{K}) = T(°\\text{C}) + 273{,}15$. Karena selisihnya cuma $0{,}15$ K, banyak
soal (termasuk latihan di bawah) memakai pembulatan cepat $T(\\text{K}) \\approx T(°\\text{C}) + 273$ untuk
estimasi praktis - keduanya menghasilkan jawaban akhir yang sama pada ketelitian 2-3 angka penting yang
biasa dipakai di soal gas ideal.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/1/12/Isotherms-in-p-V-diagram.svg",
    alt: "Grafik isoterm tekanan terhadap volume gas ideal pada tiga suhu berbeda",
    caption: "Kurva isoterm (garis suhu tetap) pada grafik $p$-$V$ untuk gas ideal, pada tiga suhu berbeda $T_1 < T_2 < T_3$. Setiap kurva adalah hiperbola $pV=\\text{konstan}$ (Hukum Boyle) untuk satu nilai T tertentu; kurva pindah ke kanan-atas jika suhu dinaikkan.",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "erjMiErRgSQ", title: "Ideal gas equation example 1 | Chemistry | Khan Academy",
    channel: "Khan Academy", desc: "Contoh soal terpandu menghitung salah satu besaran (p, V, n, atau T) yang belum diketahui menggunakan persamaan gas ideal pV=nRT." }
)}

<h3>3. Hukum-Hukum Gas sebagai Kasus Khusus pV = nRT</h3>
<p>Jika jumlah mol gas ($n$) tetap (massa gas tidak berubah), tiga hukum gas klasik berikut adalah kasus
khusus dari $pV=nRT$ ketika salah satu dari $p$, $V$, atau $T$ dijaga konstan:</p>
<table>
  <tr><th>Hukum</th><th>Besaran yang dijaga tetap</th><th>Hubungan</th><th>Bentuk grafik</th></tr>
  <tr><td>Hukum Boyle</td><td>Suhu $T$ (isotermal)</td><td>$p_1V_1 = p_2V_2$</td><td>Grafik $p$-$V$: hiperbola (isoterm). Grafik $p$ terhadap $1/V$: garis lurus lewat titik asal.</td></tr>
  <tr><td>Hukum Tekanan (Gay-Lussac)</td><td>Volume $V$ (isokhorik)</td><td>$\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}$</td><td>Grafik $p$ terhadap $T$: garis lurus lewat titik asal (T dalam kelvin).</td></tr>
  <tr><td>Hukum Charles</td><td>Tekanan $p$ (isobarik)</td><td>$\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}$</td><td>Grafik $V$ terhadap $T$: garis lurus lewat titik asal (T dalam kelvin).</td></tr>
</table>
<p>Ketiga hukum ini bisa digabung menjadi satu <strong>hukum gas gabungan</strong> untuk massa gas tetap
yang mengalami perubahan dari keadaan 1 ke keadaan 2:</p>
<div class="formula-box">$$\\dfrac{p_1V_1}{T_1} = \\dfrac{p_2V_2}{T_2}$$</div>
<p class="muted">Perhatikan bahwa "garis lurus lewat titik asal" pada grafik $p$-$T$ dan $V$-$T$ hanya berlaku
jika suhu diplot dalam <strong>kelvin</strong>; jika suhu diplot dalam °C, garisnya tetap lurus tetapi tidak
melewati titik asal (memotong sumbu suhu di $-273°\\text{C}$, yaitu nol mutlak/absolute zero).</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/36/Boyles_law_experiment.png",
    alt: "Diagram set alat percobaan Hukum Boyle menggunakan suntikan (syringe) dan pengukur tekanan",
    caption: "Diagram set percobaan untuk menyelidiki Hukum Boyle: beban ditambahkan di atas piston suntikan (syringe) untuk menaikkan tekanan gas yang terperangkap, sementara pengukur tekanan (pressure meter) mencatat pembacaan tekanannya.",
    author: "Ppritchett", license: "CC BY-SA 3.0" },
  { id: "GZORmhded2I", title: "A Level Physics: The Ideal Gas Equation, pV=nRT",
    channel: "ZPhysics", desc: "Penjelasan bertingkat A-level tentang persamaan gas ideal dan bagaimana hukum Boyle, hukum tekanan, dan hukum Charles muncul sebagai kasus khususnya." }
)}

<h3>4. Model Kinetik Gas Ideal: Asumsi Dasar</h3>
<p>Persamaan $pV=nRT$ adalah hasil pengamatan eksperimen (hukum empiris). <strong>Teori kinetik gas</strong>
(kinetic theory of gases) menjelaskan <em>mengapa</em> gas berperilaku demikian, dengan memodelkan gas
sebagai kumpulan molekul yang bergerak. Model ini dibangun di atas beberapa asumsi dasar (sesuai silabus
Cambridge 9702, learning outcome 15.3.1):</p>
<ol>
  <li>Gas terdiri dari <strong>sejumlah besar molekul</strong> yang bergerak secara <strong>acak (random
  motion)</strong> dengan berbagai kelajuan dan arah.</li>
  <li><strong>Volume molekul-molekul itu sendiri dapat diabaikan</strong> dibandingkan dengan volume total
  gas (molekul diperlakukan seperti titik-titik yang sangat kecil).</li>
  <li><strong>Gaya antarmolekul (tarik-menarik atau tolak-menolak) dapat diabaikan</strong>, kecuali pada
  saat molekul-molekul itu bertumbukan.</li>
  <li>Tumbukan antar molekul, maupun antara molekul dengan dinding wadah, bersifat <strong>lenting sempurna
  (perfectly elastic)</strong> — tidak ada energi kinetik total yang hilang — dan <strong>berlangsung dalam
  waktu yang sangat singkat</strong> dibandingkan waktu selang antar tumbukan.</li>
  <li>Di antara tumbukan, molekul bergerak dalam <strong>lintasan lurus dengan kelajuan tetap</strong>,
  mematuhi hukum-hukum gerak Newton.</li>
</ol>
<p class="muted">Karena tumbukan bersifat lenting sempurna dan berlangsung sangat singkat, energi kinetik
total sistem tetap konstan (tidak berubah menjadi bentuk energi lain), dan gaya antarmolekul yang diabaikan
membuat energi potensial antarmolekul dianggap nol — semua energi dalam gas ideal berupa energi kinetik
translasi molekul-molekulnya.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Kinetic_theory_of_gases.svg",
    alt: "Diagram molekul gas bergerak acak di dalam wadah dan bertumbukan dengan dindingnya",
    caption: "Ide utama teori kinetik gas: molekul-molekul bergerak acak di dalam wadah, dan tumbukan molekul-molekul itu yang terus-menerus dengan dinding wadah dirasakan sebagai tekanan gas.",
    author: "Sharayanan", license: "CC BY-SA 3.0" },
  { id: "UMXSNjjUVt4", title: "Kinetic molecular theory of gases | Physics | Khan Academy",
    channel: "Khan Academy Physics", desc: "Penjelasan asumsi-asumsi dasar model kinetik gas ideal dan bagaimana model mikroskopis ini menjelaskan besaran gas yang teramati secara makroskopis." }
)}

<h3>5. Tekanan Gas dari Teori Kinetik: pV = (1/3) N m &lt;c²&gt;</h3>
<p>Tekanan gas pada dinding wadah berasal dari tumbukan-tumbukan molekul yang terus-menerus dengan dinding
tersebut. Setiap kali sebuah molekul memantul dari dinding, momentumnya berubah arah, artinya dinding
memberi gaya pada molekul (dan menurut Hukum III Newton, molekul memberi gaya balik yang sama besar pada
dinding). Gaya total dari sangat banyak tumbukan per detik inilah yang teramati sebagai tekanan gas.</p>
<p>Logika penurunannya secara garis besar (tanpa perlu dihafalkan langkah matematisnya secara rinci untuk
Cambridge 9702, tetapi penting memahami alurnya):</p>
<ol>
  <li>Tinjau satu molekul bermassa $m$ bergerak dengan komponen kecepatan $c_x$ tegak lurus salah satu
  dinding kotak. Karena tumbukan lenting sempurna, molekul memantul dengan kelajuan sama tapi arah
  terbalik, sehingga perubahan momentumnya adalah $2mc_x$ setiap tumbukan dengan dinding itu.</li>
  <li>Molekul ini menumbuk dinding yang sama berulang kali; makin cepat molekul bergerak dan makin pendek
  jarak bolak-baliknya (makin kecil kotak), makin sering tumbukan terjadi per detik.</li>
  <li>Gaya rata-rata pada dinding dari satu molekul = laju perubahan momentum = (perubahan momentum per
  tumbukan) × (jumlah tumbukan per detik).</li>
  <li>Menjumlahkan kontribusi gaya dari <strong>semua $N$ molekul</strong> dalam kotak (dengan rata-rata
  statistik atas seluruh arah gerak molekul, bukan hanya satu arah $x$), dan membagi gaya total itu dengan
  luas dinding untuk mendapatkan tekanan, diperoleh persamaan tekanan gas ideal dari teori kinetik:</li>
</ol>
<div class="formula-box">$$pV = \\tfrac{1}{3}Nm\\overline{c^2}$$</div>
<p>dengan $N$ = jumlah molekul gas, $m$ = massa satu molekul, dan $\\overline{c^2}$ = <strong>kelajuan
kuadrat rata-rata</strong> (mean square speed) seluruh molekul — yaitu rata-rata dari $c^2$ tiap molekul,
<strong>bukan</strong> kuadrat dari kelajuan rata-rata (karena arah gerak molekul acak ke segala arah,
rata-rata inilah yang benar dipakai, bukan sekadar kelajuan rata-rata biasa).</p>
${mediaRow(
  null,
  { id: "tQcB9BLUoVI", title: "Thermodynamics part 1: Molecular theory of gases | Physics | Khan Academy",
    channel: "Khan Academy", desc: "Penurunan lengkap hubungan pV = (1/3) N m <c²> dari tumbukan molekul dengan dinding wadah, dan bagaimana hasil ini dihubungkan dengan suhu gas." }
)}

<h3>6. Energi Kinetik Molekul dan Suhu</h3>
<p>Inilah bagian yang menghubungkan dunia mikroskopis (gerak & energi kinetik molekul individual) dengan
dunia makroskopis (suhu gas yang bisa diukur dengan termometer) — sering keluar di ujian Cambridge 9702.
Bandingkan dua bentuk persamaan gas ideal yang sudah kita punya:</p>
<div class="formula-box">
$$pV = \\tfrac{1}{3}Nm\\overline{c^2} \\qquad \\text{(dari teori kinetik)}$$
$$pV = NkT \\qquad \\text{(dari persamaan keadaan gas ideal)}$$
</div>
<p>Karena ruas kiri kedua persamaan itu sama-sama $pV$, ruas kanannya juga harus sama:</p>
<div class="formula-box">$$\\tfrac{1}{3}Nm\\overline{c^2} = NkT \\quad\\Rightarrow\\quad \\tfrac{1}{3}m\\overline{c^2} = kT$$</div>
<p>Kalikan kedua ruas dengan $\\tfrac{3}{2}$:</p>
<div class="formula-box">$$\\tfrac{1}{2}m\\overline{c^2} = \\tfrac{3}{2}kT$$</div>
<p>Ruas kiri, $\\tfrac{1}{2}m\\overline{c^2}$, tidak lain adalah <strong>energi kinetik translasi
rata-rata satu molekul gas</strong> (rata-rata dari $\\tfrac12 mc^2$ tiap molekul). Jadi:</p>
<div class="formula-box">$$E_k = \\tfrac{1}{2}m\\overline{c^2} = \\tfrac{3}{2}kT$$</div>
<p><strong>Kesimpulan penting:</strong> energi kinetik translasi rata-rata sebuah molekul gas ideal
<strong>sebanding langsung dengan suhu mutlak $T$</strong> (dalam kelvin) — tidak bergantung pada jenis
gasnya (gas ringan seperti hidrogen dan gas berat seperti karbon dioksida pada suhu $T$ yang sama memiliki
energi kinetik rata-rata per molekul yang <em>sama persis</em>, meskipun kelajuannya berbeda karena
massanya berbeda). Inilah alasan fisis mengapa suhu adalah ukuran dari energi kinetik rata-rata partikel
penyusun suatu zat.</p>
<p class="muted">Jika suhu mutlak suatu gas dinaikkan dua kali lipat (misalnya dari 300 K menjadi 600 K),
energi kinetik translasi rata-rata tiap molekulnya juga menjadi dua kali lipat — tetapi kelajuannya
<strong>tidak</strong> menjadi dua kali lipat, karena $E_k \\propto v^2$, sehingga kelajuan (rms) hanya naik
sebesar faktor $\\sqrt{2}$.</p>

<h3>7. Kelajuan Root-Mean-Square (rms)</h3>
<p>Karena $\\overline{c^2}$ adalah kelajuan kuadrat rata-rata, akar kuadratnya disebut <strong>kelajuan
root-mean-square</strong> (akar dari rata-rata kuadrat), disingkat $c_{rms}$:</p>
<div class="formula-box">$$c_{rms} = \\sqrt{\\overline{c^2}}$$</div>
<p>Dari hasil bagian 5 dan 6 di atas ($\\tfrac13 m\\overline{c^2} = kT$, dan $k=R/N_A$ sementara $M=mN_A$
adalah massa molar), $c_{rms}$ dapat dihitung langsung dari suhu dan massa molar gas:</p>
<div class="formula-box">$$c_{rms} = \\sqrt{\\dfrac{3kT}{m}} = \\sqrt{\\dfrac{3RT}{M}}$$</div>
<p>dengan $M$ = massa molar gas dalam <strong>kg mol⁻¹</strong> (bukan g mol⁻¹ — ingat konversi
$1~\\text{g mol}^{-1} = 1\\times10^{-3}~\\text{kg mol}^{-1}$).</p>
<p><strong>Contoh perhitungan:</strong> Berapa kelajuan rms molekul gas nitrogen (N₂, komponen utama udara,
$M = 28~\\text{g mol}^{-1} = 2{,}8\\times10^{-2}~\\text{kg mol}^{-1}$) pada suhu ruangan $20°\\text{C}$
($T=293$ K)?</p>
<div class="formula-box">$$c_{rms} = \\sqrt{\\dfrac{3RT}{M}} = \\sqrt{\\dfrac{3 \\times 8{,}31 \\times 293}{2{,}8\\times10^{-2}}} \\approx \\sqrt{2{,}61\\times10^{5}} \\approx 511~\\text{m s}^{-1}$$</div>
<p class="muted">Kelajuan ini (sekitar 511 m/s, lebih dari 1800 km/jam!) jauh lebih besar daripada kelajuan
angin biasa, tetapi molekul udara terus-menerus bertumbukan dengan molekul lain (lintasan bebas rata-ratanya
sangat pendek), sehingga perpindahan neto molekul dari satu tempat ke tempat lain (difusi) jauh lebih lambat
daripada kelajuan rms-nya sendiri.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/61/Maxwell-Boltzmann-Distribution.svg",
    alt: "Grafik distribusi Maxwell-Boltzmann kelajuan molekul gas pada tiga suhu berbeda",
    caption: "Distribusi Maxwell-Boltzmann: sebaran kelajuan molekul-molekul gas pada tiga suhu berbeda ($T=100$ K, $1200$ K, $5000$ K). Tidak semua molekul punya kelajuan sama; grafik ini bergeser ke kelajuan lebih tinggi dan melebar saat suhu naik. Kelajuan rms terletak sedikit di kanan puncak kurva (kelajuan paling mungkin).",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  null
)}
`;

const IDEALGASES_EKSPERIMEN = {
  title: "Eksperimen Nyata: Menyelidiki Hukum Boyle dengan Kolom Udara Terjebak",
  intro: `
    <p class="muted">Ini eksperimen fisik sungguhan dengan alat lab nyata (tabung Hukum Boyle berskala,
    pengukur tekanan, dan pompa), bukan simulasi komputer. Ini adalah praktikum standar untuk memverifikasi
    Hukum Boyle ($pV=\\text{konstan}$ pada suhu tetap) yang umum dipakai di banyak silabus A-Level
    (termasuk sebagai <em>Required/Core Practical</em> pada AQA dan Edexcel, dan didokumentasikan di
    IOPSpark dan CLEAPSS).</p>

    <h4>Tujuan</h4>
    <p>Menyelidiki hubungan antara tekanan $p$ dan volume $V$ sejumlah tetap gas (udara) pada suhu konstan,
    dan memverifikasi Hukum Boyle ($pV = \\text{konstan}$).</p>

    <h4>Konsep Dasar</h4>
    <p>Selama suhu $T$ dan jumlah mol gas $n$ dijaga tetap, persamaan keadaan gas ideal $pV=nRT$ meramalkan
    bahwa hasil kali $pV$ haruslah konstan:</p>
    <div class="formula-box">$$p_1V_1 = p_2V_2 \\quad (\\text{Hukum Boyle, } T \\text{ dan } n \\text{ tetap})$$</div>
    <p>Karena volume kolom udara yang terjebak dalam tabung berpenampang seragam (luas penampang $A$
    konstan) berbanding lurus dengan panjang kolomnya ($V = A \\times L$), mengukur panjang kolom udara $L$
    saja sudah cukup untuk mewakili volume $V$ — kita tidak perlu tahu nilai $A$ untuk memverifikasi bentuk
    hubungannya, karena $A$ tetap konstan sepanjang percobaan (akan tereliminasi saat membandingkan data).</p>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Alat Hukum Boyle (Boyle's law apparatus): tabung kaca tebal berskala panjang, berisi kolom udara
      kering yang terjebak di atas kolom minyak (oli), dilengkapi pengukur tekanan Bourdon (Bourdon gauge)
      yang membaca tekanan mutlak gas secara langsung</li>
      <li>Pompa tangan/pompa kaki (foot pump atau pompa ban sepeda/mobil) yang tersambung ke reservoir
      minyak alat, untuk menaikkan tekanan</li>
      <li>Keran pelepas tekanan (release valve) pada reservoir, untuk menurunkan tekanan secara terkendali</li>
      <li>Penyangga/klem atau pemberat di dasar alat supaya tabung tegak dan tidak mudah terguling</li>
      <li>Sekat pengaman (safety screen) transparan untuk dipasang di depan alat</li>
      <li>Kacamata pengaman (safety goggles) untuk setiap siswa yang terlibat</li>
      <li>Stopwatch (untuk memberi jeda waktu penyetimbangan suhu setelah tiap perubahan tekanan)</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Sebelum menyalakan apa pun, pasang sekat pengaman di depan alat dan pastikan semua siswa memakai
      kacamata pengaman. Pastikan alat berdiri tegak dan stabil (diklem atau diberi pemberat).</li>
      <li>Catat pembacaan awal: tekanan pada pengukur Bourdon (biasanya sudah menunjukkan tekanan atmosfer
      sebelum pompa dipakai) dan panjang kolom udara $L_0$ yang terjebak di tabung.</li>
      <li>Pompa perlahan (secara vertikal, tekan pompa dengan hati-hati terutama saat tekanan sudah tinggi)
      untuk menaikkan tekanan sedikit demi sedikit. Pada setiap kenaikan tekanan, <strong>tunggu beberapa
      saat</strong> (gunakan stopwatch, biasanya 30-60 detik) supaya suhu gas yang sempat naik akibat
      kompresi kembali stabil ke suhu ruangan sebelum membaca panjang kolom (mata harus sejajar horizontal
      dengan skala/meniskus saat membaca, untuk menghindari kesalahan paralaks).</li>
      <li>Catat pasangan data (tekanan $p$, panjang kolom $L$) di setiap langkah kenaikan tekanan, sampai
      mendekati batas maksimum alat (jangan berlebihan).</li>
      <li>Setelah mencapai tekanan maksimum yang aman, lepaskan pompa dan gunakan keran pelepas untuk
      menurunkan tekanan secara bertahap (buka keran sedikit demi sedikit), catat kembali pasangan data
      (p, L) pada arah menurun sebagai pengulangan/pengecekan.</li>
      <li>Ulangi seluruh rangkaian pengukuran (naik dan turun) sekali lagi untuk memastikan data konsisten
      dan mendapati rata-rata jika ada sedikit perbedaan.</li>
    </ol>

    <h4>Tabel Data (contoh, isi dengan data hasil percobaanmu)</h4>
    <table>
      <tr><th>p (× 10⁵ Pa)</th><th>L (cm)</th><th>V &prop; L (cm, sebagai wakil volume)</th><th>1/L (cm⁻¹)</th><th>p × L (× 10⁵ Pa cm)</th></tr>
      <tr><td>1,0</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>1,5</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2,0</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2,5</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>3,0</td><td></td><td></td><td></td><td></td></tr>
    </table>

    <h4>Analisis &amp; Perhitungan</h4>
    <ul>
      <li>Cara 1 (uji konstanta): hitung kolom terakhir tabel, $p \\times L$, untuk setiap baris data. Jika
      Hukum Boyle berlaku, semua nilai $p \\times L$ seharusnya kurang lebih sama (konstan dalam batas
      ketidakpastian pengukuran).</li>
      <li>Cara 2 (grafik, lebih meyakinkan secara statistik): plot grafik $p$ (sumbu-y) terhadap $1/L$
      (sumbu-x). Karena $pV=p(AL)=\\text{konstan}$, maka $p = \\dfrac{\\text{konstan}}{A}\\times\\dfrac{1}{L}$,
      sehingga grafik $p$ vs $1/L$ seharusnya berupa <strong>garis lurus melalui titik asal (0,0)</strong>.
      Tarik garis lurus terbaik (line of best fit) dan periksa apakah memang melewati titik asal.</li>
      <li>Sebagai pembanding, plot juga grafik $p$ terhadap $L$ secara langsung — bentuknya seharusnya kurva
      melengkung (hiperbola), <strong>bukan</strong> garis lurus, ini menegaskan bahwa hubungan $p$-$V$
      memang tidak linear secara langsung.</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li>WAJIB memakai kacamata pengaman dan memasang sekat pengaman transparan di depan alat sepanjang
      percobaan — tabung kaca bertekanan tinggi berisiko retak/pecah.</li>
      <li>Jangan pernah melampaui batas tekanan maksimum yang tertera pada alat (biasanya ditandai warna
      merah pada pengukur Bourdon).</li>
      <li>Pompa secara perlahan dan hati-hati, terutama saat tekanan sudah tinggi, karena dorongan pompa
      makin berat melawan tekanan balik gas.</li>
      <li>Pastikan alat diklem/diberi pemberat di dasar sehingga tidak mudah terguling atau tergeser dari
      tepi meja saat dipompa.</li>
      <li>Amati alat dari jarak aman di belakang sekat pengaman; jangan meletakkan wajah terlalu dekat
      dengan tabung kaca.</li>
    </ul>

    <h4>Sumber Kesalahan (untuk didiskusikan di laporan)</h4>
    <ul>
      <li>Kompresi gas yang terlalu cepat menaikkan suhu gas sesaat (proses mendekati adiabatik, bukan
      isotermal sepenuhnya) sebelum sempat kembali setimbang dengan suhu ruangan — inilah alasan pentingnya
      jeda waktu sebelum membaca panjang kolom.</li>
      <li>Kesalahan paralaks saat membaca posisi meniskus minyak terhadap skala panjang tabung.</li>
      <li>Sedikit gas/udara mungkin bocor perlahan melalui sambungan pompa/keran selama percobaan
      berlangsung, menyebabkan jumlah mol gas $n$ tidak benar-benar tetap sempurna.</li>
      <li>Ketelitian pembacaan pengukur Bourdon terbatas pada skala terkecilnya (biasanya dalam kelipatan
      puluhan kPa).</li>
    </ul>

    <h4>Alternatif Sederhana dengan Suntikan (Syringe) — jika alat Boyle's law tidak tersedia</h4>
    <p>Kalau sekolah tidak memiliki alat Hukum Boyle standar, hubungan $p$-$V$ tetap bisa diselidiki secara
    kuantitatif dengan <strong>suntikan (gas syringe) berskala</strong> dan beban tambahan:</p>
    <ol>
      <li>Tutup rapat ujung suntikan (misalnya dengan lem karet/sumbat) sehingga sejumlah tetap udara
      terjebak di dalamnya, catat volume awal $V_0$ langsung dari skala suntikan pada saat piston bebas
      (tanpa beban tambahan, hanya ditahan mendatar).</li>
      <li>Pasang suntikan tegak (piston menghadap ke atas) dan tambahkan beban dengan massa diketahui secara
      bertahap di atas piston; catat volume gas (dari skala suntikan) pada setiap penambahan beban.</li>
      <li>Hitung tekanan gas pada tiap keadaan: $p = p_{atm} + \\dfrac{mg}{A_{piston}}$, dengan $p_{atm}
      \\approx 1{,}0\\times10^5$ Pa (tekanan atmosfer), $m$ = massa beban total di atas piston, $g=9{,}81$
      m s⁻², dan $A_{piston}$ = luas penampang piston suntikan (dihitung dari diameter suntikan yang
      tertera, $A = \\pi r^2$).</li>
      <li>Analisis datanya sama seperti metode utama: plot $p$ terhadap $1/V$, harus berupa garis lurus
      lewat titik asal.</li>
      <li>Metode ini lebih murah dan aman (tanpa tabung kaca bertekanan tinggi), tetapi jangkauan tekanan
      yang bisa dicapai jauh lebih kecil dibanding alat Hukum Boyle standar, sehingga perubahan volumenya
      relatif kecil dan galat pengukurannya secara proporsional lebih besar.</li>
    </ol>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Mengapa penting menunggu beberapa saat setelah menaikkan/menurunkan tekanan sebelum mencatat
      panjang kolom udara?</li>
      <li>Jika grafik $p$ terhadap $1/L$ hasil percobaanmu tidak tepat melewati titik asal (ada nilai
      intersep kecil), apa kemungkinan penyebabnya?</li>
      <li>Bagaimana cara memastikan bahwa suhu gas selama percobaan benar-benar tetap (bukan hanya
      diasumsikan tetap)?</li>
      <li>Pada metode alternatif suntikan, mengapa suntikan perlu dipasang tegak (vertikal) saat beban
      ditambahkan, bukan mendatar?</li>
    </ul>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://spark.iop.org/boyles-law" target="_blank" rel="noopener">Boyle's law, IOPSpark (Institute of Physics)</a></li>
      <li><a href="https://science.cleapss.org.uk/resource-info/pp028-investigating-gas-laws-1-pressure-volume-boyle-s-law.aspx" target="_blank" rel="noopener">PP028 — Investigating gas laws 1: pressure/volume (Boyle's law), CLEAPSS</a></li>
      <li><a href="https://qualifications.pearson.com/content/dam/pdf/A%20Level/Physics/2015/teaching-and-learning-materials/AS-and-A-level-Physics-Core-Practical-14-Pressure-and-Volume-(Student,-Teacher,-Technician-Worksheets).pdf" target="_blank" rel="noopener">Core Practical 14: Pressure and Volume of a Gas, Pearson Edexcel AS/A Level Physics</a></li>
      <li><a href="https://www.3bscientific.com/product-manual/U30046_EN.pdf" target="_blank" rel="noopener">Boyle's Law Apparatus U30046, Instruction Sheet, 3B Scientific</a></li>
    </ul>
  `
};

/* type: "mcq" atau "structured".
   Untuk mcq: options[] dan correct = index jawaban benar. */
const IDEALGASES_LATIHAN = [
  {
    type: "mcq",
    question: "Sebuah tabung berisi 16 g gas oksigen (O₂, massa molar 32 g mol⁻¹). Konstanta Avogadro N_A = 6,02 × 10²³ mol⁻¹. Berapakah jumlah molekul oksigen dalam tabung tersebut?",
    options: ["1,5 × 10²³", "3,0 × 10²³", "6,0 × 10²³", "9,6 × 10²⁴"],
    correct: 1,
    solution: `Jumlah mol: $n = \\dfrac{\\text{massa}}{\\text{massa molar}} = \\dfrac{16}{32} = 0{,}50~\\text{mol}$.
    <br>Jumlah molekul: $N = nN_A = 0{,}50 \\times 6{,}02\\times10^{23} = 3{,}01\\times10^{23} \\approx 3{,}0\\times10^{23}$ molekul.`
  },
  {
    type: "mcq",
    question: "Sejumlah tetap gas ideal pada suhu tetap memiliki volume 480 cm³ pada tekanan 1,0 × 10⁵ Pa. Gas itu kemudian dimampatkan (dikompresi) pada suhu yang sama hingga volumenya menjadi 320 cm³. Berapakah tekanan gas setelah dimampatkan?",
    options: ["0,67 × 10⁵ Pa", "1,0 × 10⁵ Pa", "1,5 × 10⁵ Pa", "2,25 × 10⁵ Pa"],
    correct: 2,
    solution: `Suhu tetap sehingga berlaku Hukum Boyle: $p_1V_1 = p_2V_2$.
    <br>$p_2 = \\dfrac{p_1V_1}{V_2} = \\dfrac{(1{,}0\\times10^5)(480)}{320} = 1{,}5\\times10^{5}~\\text{Pa}$.
    <br>Masuk akal: volume mengecil (dimampatkan), jadi tekanan harus membesar, sesuai jawaban di atas.`
  },
  {
    type: "structured",
    question: "Sebuah silinder bervolume 0,025 m³ berisi gas ideal pada tekanan 2,4 × 10⁵ Pa dan suhu 22 °C. Konstanta gas molar R = 8,31 J K⁻¹ mol⁻¹. Tentukan (a) suhu gas dalam kelvin, (b) jumlah mol gas dalam silinder.",
    solution: `<strong>(a)</strong> $T = 22 + 273 = 295~\\text{K}$.
    <br><strong>(b)</strong> Dari $pV=nRT$: $n = \\dfrac{pV}{RT} = \\dfrac{(2{,}4\\times10^5)(0{,}025)}{(8{,}31)(295)} = \\dfrac{6000}{2451{,}45} \\approx 2{,}4~\\text{mol}$.`
  },
  {
    type: "structured",
    question: "Sejumlah tetap gas ideal (massa gas tidak berubah) mula-mula memiliki volume 300 cm³, tekanan 1,0 × 10⁵ Pa, dan suhu 27 °C. Gas kemudian mengembang hingga volumenya menjadi 500 cm³ sementara tekanannya turun menjadi 8,0 × 10⁴ Pa. Tentukan (a) suhu awal gas dalam kelvin, (b) suhu akhir gas setelah perubahan keadaan ini.",
    solution: `<strong>(a)</strong> $T_1 = 27 + 273 = 300~\\text{K}$.
    <br><strong>(b)</strong> Karena jumlah mol gas tetap, berlaku hukum gas gabungan: $\\dfrac{p_1V_1}{T_1} = \\dfrac{p_2V_2}{T_2}$.
    <br>$T_2 = T_1 \\times \\dfrac{p_2V_2}{p_1V_1} = 300 \\times \\dfrac{(8{,}0\\times10^4)(500)}{(1{,}0\\times10^5)(300)} = 300 \\times \\dfrac{4{,}0\\times10^7}{3{,}0\\times10^7} = 300 \\times 1{,}333 \\approx 400~\\text{K}$
    <br>(setara dengan $400 - 273 = 127°\\text{C}$). Catatan: karena $V$ dalam cm³ muncul di pembilang dan penyebut yang sama, satuan volumenya boleh tidak diubah ke m³ karena akan saling menghilangkan (tereliminasi) dalam perbandingan ini.`
  },
  {
    type: "structured",
    question: "Konstanta Boltzmann k = 1,38 × 10⁻²³ J K⁻¹. Tentukan (a) energi kinetik translasi rata-rata sebuah molekul gas ideal pada suhu 300 K, (b) suhu (dalam kelvin) yang diperlukan agar energi kinetik translasi rata-rata molekul tersebut menjadi dua kali lipat dari nilai pada bagian (a).",
    solution: `<strong>(a)</strong> $E_k = \\tfrac{3}{2}kT = \\tfrac{3}{2}(1{,}38\\times10^{-23})(300) = 6{,}21\\times10^{-21}~\\text{J}$.
    <br><strong>(b)</strong> Karena $E_k = \\tfrac32 kT$, energi kinetik rata-rata berbanding lurus langsung dengan suhu mutlak $T$. Agar $E_k$ menjadi dua kali lipat, $T$ juga harus menjadi dua kali lipat:
    <br>$T_{baru} = 2 \\times 300 = 600~\\text{K}$.
    <br>(Cek: $E_k = \\tfrac32(1{,}38\\times10^{-23})(600) = 1{,}242\\times10^{-20}~\\text{J}$, tepat dua kali $6{,}21\\times10^{-21}$ J, konsisten.)`
  },
  {
    type: "structured",
    question: "Molar gas constant R = 8,31 J K⁻¹ mol⁻¹. Molekul nitrogen (N₂) memiliki massa molar 28 g mol⁻¹. Tentukan (a) massa molar nitrogen dalam kg mol⁻¹, (b) kelajuan root-mean-square (rms) molekul nitrogen pada suhu 20 °C.",
    solution: `<strong>(a)</strong> $M = 28~\\text{g mol}^{-1} = 28\\times10^{-3}~\\text{kg mol}^{-1} = 2{,}8\\times10^{-2}~\\text{kg mol}^{-1}$.
    <br><strong>(b)</strong> $T = 20 + 273 = 293~\\text{K}$.
    <br>$c_{rms} = \\sqrt{\\dfrac{3RT}{M}} = \\sqrt{\\dfrac{3(8{,}31)(293)}{2{,}8\\times10^{-2}}} = \\sqrt{\\dfrac{7304{,}3}{2{,}8\\times10^{-2}}} = \\sqrt{2{,}609\\times10^{5}} \\approx 5{,}1\\times10^{2}~\\text{m s}^{-1}$ (sekitar 511 m s⁻¹).`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & nilai yang sudah divalidasi guru, bukan menebak dari pengetahuan umum. */
const IDEALGASES_FORMULA_SHEET = `
- Mol dan konstanta Avogadro: N = n * NA, dengan NA = konstanta Avogadro = 6.02 x 10^23 mol^-1 (data sheet Cambridge)
- Jumlah mol dari massa: n = massa sampel / massa molar (M). Hati-hati satuan massa molar (g/mol vs kg/mol) harus konsisten dengan satuan massa sampel yang dipakai.
- Persamaan keadaan gas ideal: pV = nRT, dengan R = konstanta gas molar = 8.31 J K^-1 mol^-1 (data sheet Cambridge)
- Bentuk per-molekul: pV = NkT, dengan k = konstanta Boltzmann = 1.38 x 10^-23 J K^-1 (data sheet Cambridge), dan k = R / NA
- T harus dalam kelvin di semua rumus gas ideal: T(K) = T(derajat C) + 273,15 (syllabus 9702 2025-2027); pembulatan cepat +273 sering dipakai untuk estimasi praktis pada soal (bedanya cuma 0,15 K, tidak mengubah jawaban akhir pada 2-3 angka penting).
- Hukum Boyle (T dan n tetap): p1 V1 = p2 V2. Grafik p-V berupa hiperbola/isoterm; grafik p vs 1/V garis lurus lewat titik asal.
- Hukum Tekanan / Gay-Lussac (V dan n tetap): p1/T1 = p2/T2. Grafik p vs T (kelvin) garis lurus lewat titik asal.
- Hukum Charles (p dan n tetap): V1/T1 = V2/T2. Grafik V vs T (kelvin) garis lurus lewat titik asal.
- Hukum gas gabungan (n tetap): p1 V1 / T1 = p2 V2 / T2
- Asumsi dasar teori kinetik gas ideal (silabus 9702 15.3.1): (1) sejumlah besar molekul bergerak acak (random motion); (2) volume molekul diabaikan terhadap volume gas; (3) gaya antarmolekul diabaikan kecuali saat tumbukan; (4) tumbukan antar molekul & dengan dinding bersifat lenting sempurna (elastis) dan berlangsung sangat singkat dibanding waktu antar tumbukan; (5) molekul bergerak lurus dengan kelajuan tetap di antara tumbukan, mematuhi hukum gerak Newton.
- Tekanan gas dari teori kinetik: pV = 1/3 N m <c^2>, dengan N = jumlah molekul, m = massa satu molekul, <c^2> = kelajuan kuadrat rata-rata (mean square speed, BUKAN kuadrat dari kelajuan rata-rata)
- Menghubungkan ke suhu (bandingkan pV=1/3 N m<c^2> dengan pV=NkT): (1/2) m <c^2> = (3/2) k T -> energi kinetik translasi rata-rata satu molekul E_k = (3/2) k T, sebanding langsung dengan suhu mutlak T, tidak bergantung jenis gas.
- Kelajuan root-mean-square: c_rms = sqrt(<c^2>) = sqrt(3 k T / m) = sqrt(3 R T / M), dengan M = massa molar gas dalam kg/mol.
- Nilai standar data sheet Cambridge 9702: R = 8.31 J K^-1 mol^-1 ; NA = 6.02 x 10^23 mol^-1 ; k = 1.38 x 10^-23 J K^-1 ; g = 9.81 m/s^2 (untuk eksperimen terkait, jika diperlukan).
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const IDEALGASES_LAB_CONCEPTS = [
  "Konsep Mol dan Konstanta Avogadro (N = n x NA)",
  "Persamaan Keadaan Gas Ideal (pV = nRT dan pV = NkT)",
  "Hukum Boyle, Hukum Tekanan, dan Hukum Charles (grafik p-V, p-T, V-T)",
  "Asumsi Dasar Teori Kinetik Gas Ideal",
  "Tekanan Gas dari Teori Kinetik (pV = 1/3 N m <c^2>)",
  "Hubungan Energi Kinetik Molekul dengan Suhu ((1/2) m <c^2> = (3/2) k T) dan Kelajuan rms",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

/* Tempelkan konten lengkap ke objek topik "ideal-gases" */

/* ---- English (_EN) translations for IDEALGASES (auto-merged by merge_i18n.py) ---- */
/* ------------------------------------------------------------
   English translation of topic content: IDEAL GASES (topic 15, A2)
   Source: js/content.js (IDEALGASES_* constants), translated from
   Indonesian to English for the Cambridge International AS & A Level
   Physics (9702) study app. HTML structure, LaTeX math, class names,
   ids, and media URLs are preserved exactly; only prose is translated.
   ------------------------------------------------------------ */

/* TOPICS array entry "ideal-gases" — translated desc field */
const IDEALGASES_DESC_EN = "Ideal gas laws, kinetic theory of gases.";

const IDEALGASES_MATERI_EN = `
<h3>1. Amount of Substance: The Mole and the Avogadro Constant</h3>
<p>The <strong>mole</strong> is the SI unit for <em>amount of substance</em>. One mole of any
substance contains exactly the same number of particles (atoms, molecules, ions, etc.), namely
the <strong>Avogadro constant</strong> $N_A$. As given in the Cambridge 9702 data sheet:</p>
<div class="formula-box">$$N_A = 6.02 \\times 10^{23}~\\text{mol}^{-1}$$</div>
<p>If a sample of a substance consists of $n$ moles, then the number of molecules (or particles) it contains is:</p>
<div class="formula-box">$$N = nN_A$$</div>
<p>where $N$ = number of molecules (no unit, a pure number) and $n$ = amount of substance in moles (mol). The
number of moles in a sample can also be calculated from its mass if the molar mass $M$ of the substance is known:</p>
<div class="formula-box">$$n = \\dfrac{\\text{sample mass}}{\\text{molar mass}} = \\dfrac{m}{M}$$</div>
<p class="muted">Watch the units carefully: molar mass $M$ is usually given in g mol⁻¹ (for example, oxygen
has $M=32~\\text{g mol}^{-1}$), whereas the ideal gas equation $pV=nRT$ requires quantities in pure SI units.
Since $n$ (in moles) is already independent of whether mass is expressed in kg or g, you may use $M$ in either
g mol⁻¹ or kg mol⁻¹, provided the unit of sample mass you use is consistent (grams with grams, or kilograms
with kilograms).</p>
${mediaRow(
  null,
  { id: "_Su9Fij7TMQ", title: "The mole and Avogadro's number | Moles and molar mass | High school chemistry | Khan Academy",
    channel: "Khan Academy", desc: "An introduction to the concept of the mole and the Avogadro constant, and how to convert a sample's mass into the amount of substance and number of particles." }
)}

<h3>2. The Ideal Gas Equation of State</h3>
<p>An ideal gas is a model of a gas that obeys a simple relationship between pressure $p$, volume $V$, amount
of substance $n$, and absolute temperature $T$ (in kelvin) exactly, under all conditions. This relationship is
called the <strong>ideal gas equation of state</strong>:</p>
<div class="formula-box">$$pV = nRT$$</div>
<p>where $R$ = the <strong>molar gas constant</strong>, with the standard value given in the data sheet for
Cambridge 9702:</p>
<div class="formula-box">$$R = 8.31~\\text{J K}^{-1}\\text{mol}^{-1}$$</div>
<p>Since $n = N/N_A$ (amount of substance = number of molecules divided by the Avogadro constant), the ideal
gas equation of state can be rewritten in a per-molecule form:</p>
<div class="formula-box">$$pV = nRT = \\dfrac{N}{N_A}RT = NkT$$</div>
<p>where $k$ = the <strong>Boltzmann constant</strong>, the gas constant per molecule (not per mole):</p>
<div class="formula-box">$$k = \\dfrac{R}{N_A} = 1.38 \\times 10^{-23}~\\text{J K}^{-1}$$</div>
<table>
  <tr><th>Symbol</th><th>Quantity</th><th>SI unit</th></tr>
  <tr><td>$p$</td><td>Gas pressure</td><td>Pa (N m⁻²)</td></tr>
  <tr><td>$V$</td><td>Gas volume</td><td>m³</td></tr>
  <tr><td>$n$</td><td>Amount of substance</td><td>mol</td></tr>
  <tr><td>$N$</td><td>Number of molecules</td><td>no unit</td></tr>
  <tr><td>$T$</td><td>Absolute temperature</td><td>K (not °C!)</td></tr>
  <tr><td>$R$</td><td>Molar gas constant</td><td>J K⁻¹ mol⁻¹</td></tr>
  <tr><td>$k$</td><td>Boltzmann constant</td><td>J K⁻¹</td></tr>
</table>
<p class="muted">Always remember to convert temperature to kelvin before calculating. As in the Cambridge 9702
syllabus (2025-2027, see also the Temperature topic): $T(\\text{K}) = T(°\\text{C}) + 273.15$. Since the
difference is only $0.15$ K, many questions (including the practice questions below) use the quick rounding
$T(\\text{K}) \\approx T(°\\text{C}) + 273$ for practical estimation - both give the same final answer to the
2-3 significant figures typically used in ideal gas questions.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/1/12/Isotherms-in-p-V-diagram.svg",
    alt: "Graph of pressure against volume isotherms for an ideal gas at three different temperatures",
    caption: "Isotherms (constant-temperature curves) on a $p$-$V$ graph for an ideal gas, at three different temperatures $T_1 < T_2 < T_3$. Each curve is a hyperbola $pV=\\text{constant}$ (Boyle's law) for one particular value of T; the curve shifts up and to the right as the temperature increases.",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "erjMiErRgSQ", title: "Ideal gas equation example 1 | Chemistry | Khan Academy",
    channel: "Khan Academy", desc: "A worked example calculating one unknown quantity (p, V, n, or T) using the ideal gas equation pV=nRT." }
)}

<h3>3. The Gas Laws as Special Cases of pV = nRT</h3>
<p>If the amount of gas ($n$) is fixed (the mass of gas does not change), the three classical gas laws below
are special cases of $pV=nRT$ when one of $p$, $V$, or $T$ is held constant:</p>
<table>
  <tr><th>Law</th><th>Quantity held constant</th><th>Relationship</th><th>Graph shape</th></tr>
  <tr><td>Boyle's law</td><td>Temperature $T$ (isothermal)</td><td>$p_1V_1 = p_2V_2$</td><td>$p$-$V$ graph: hyperbola (isotherm). Graph of $p$ against $1/V$: straight line through the origin.</td></tr>
  <tr><td>Pressure law (Gay-Lussac's law)</td><td>Volume $V$ (isochoric)</td><td>$\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}$</td><td>Graph of $p$ against $T$: straight line through the origin (T in kelvin).</td></tr>
  <tr><td>Charles's law</td><td>Pressure $p$ (isobaric)</td><td>$\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}$</td><td>Graph of $V$ against $T$: straight line through the origin (T in kelvin).</td></tr>
</table>
<p>These three laws can be combined into a single <strong>combined gas law</strong> for a fixed mass of gas
that changes from state 1 to state 2:</p>
<div class="formula-box">$$\\dfrac{p_1V_1}{T_1} = \\dfrac{p_2V_2}{T_2}$$</div>
<p class="muted">Note that a "straight line through the origin" on the $p$-$T$ and $V$-$T$ graphs only holds if
temperature is plotted in <strong>kelvin</strong>; if temperature is plotted in °C, the line remains straight
but does not pass through the origin (it crosses the temperature axis at $-273°\\text{C}$, i.e. absolute
zero).</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/36/Boyles_law_experiment.png",
    alt: "Diagram of a Boyle's law apparatus set-up using a syringe and pressure gauge",
    caption: "Diagram of an experimental set-up for investigating Boyle's law: weights are added on top of the syringe piston to increase the pressure of the trapped gas, while a pressure meter records the pressure reading.",
    author: "Ppritchett", license: "CC BY-SA 3.0" },
  { id: "GZORmhded2I", title: "A Level Physics: The Ideal Gas Equation, pV=nRT",
    channel: "ZPhysics", desc: "An A-level-paced explanation of the ideal gas equation and how Boyle's law, the pressure law, and Charles's law arise as special cases of it." }
)}

<h3>4. The Kinetic Model of an Ideal Gas: Basic Assumptions</h3>
<p>The equation $pV=nRT$ is the result of experimental observation (an empirical law). The <strong>kinetic
theory of gases</strong> explains <em>why</em> gases behave this way, by modelling a gas as a collection of
moving molecules. This model is built on several basic assumptions (as in the Cambridge 9702 syllabus,
learning outcome 15.3.1):</p>
<ol>
  <li>A gas consists of a <strong>very large number of molecules</strong> moving in <strong>random
  motion</strong>, with a range of speeds and directions.</li>
  <li><strong>The volume of the molecules themselves is negligible</strong> compared with the total volume of
  the gas (the molecules are treated as extremely small points).</li>
  <li><strong>Forces between molecules (attractive or repulsive) are negligible</strong>, except during the
  instant a collision occurs.</li>
  <li>Collisions between molecules, and between molecules and the walls of the container, are <strong>perfectly
  elastic</strong> — no total kinetic energy is lost — and <strong>last for a time that is very short</strong>
  compared with the time between collisions.</li>
  <li>Between collisions, molecules move in <strong>straight lines at constant speed</strong>, obeying Newton's
  laws of motion.</li>
</ol>
<p class="muted">Because collisions are perfectly elastic and very brief, the total kinetic energy of the
system stays constant (it is not converted into other forms of energy), and because intermolecular forces are
neglected, the intermolecular potential energy is taken to be zero — all the energy in an ideal gas is in the
form of the translational kinetic energy of its molecules.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Kinetic_theory_of_gases.svg",
    alt: "Diagram of gas molecules moving randomly inside a container and colliding with its walls",
    caption: "The central idea of the kinetic theory of gases: molecules move randomly inside a container, and the constant collisions of these molecules with the container walls are experienced as the pressure of the gas.",
    author: "Sharayanan", license: "CC BY-SA 3.0" },
  { id: "UMXSNjjUVt4", title: "Kinetic molecular theory of gases | Physics | Khan Academy",
    channel: "Khan Academy Physics", desc: "An explanation of the basic assumptions of the kinetic model of an ideal gas and how this microscopic model accounts for the macroscopically observed properties of a gas." }
)}

<h3>5. Gas Pressure from the Kinetic Theory: pV = (1/3) N m &lt;c²&gt;</h3>
<p>The pressure a gas exerts on the walls of its container arises from the continual collisions of its
molecules with those walls. Each time a molecule rebounds from a wall, its momentum changes direction, which
means the wall exerts a force on the molecule (and, by Newton's third law, the molecule exerts an equal and
opposite force back on the wall). It is the total force from the very large number of collisions per second
that is observed as the pressure of the gas.</p>
<p>The outline of the derivation (you do not need to memorise the detailed mathematical steps for Cambridge
9702, but it is important to understand the reasoning):</p>
<ol>
  <li>Consider a single molecule of mass $m$ moving with a velocity component $c_x$ perpendicular to one wall
  of the box. Because the collision is perfectly elastic, the molecule rebounds with the same speed but in the
  opposite direction, so its change in momentum is $2mc_x$ for each collision with that wall.</li>
  <li>This molecule strikes the same wall repeatedly; the faster the molecule moves and the shorter its
  back-and-forth distance (the smaller the box), the more often collisions occur per second.</li>
  <li>The average force on the wall from a single molecule = rate of change of momentum = (change in momentum
  per collision) × (number of collisions per second).</li>
  <li>Summing the force contributions from <strong>all $N$ molecules</strong> in the box (taking a statistical
  average over all directions of molecular motion, not just the single $x$-direction), and dividing the total
  force by the wall area to obtain pressure, gives the kinetic theory equation for the pressure of an ideal
  gas:</li>
</ol>
<div class="formula-box">$$pV = \\tfrac{1}{3}Nm\\overline{c^2}$$</div>
<p>where $N$ = number of gas molecules, $m$ = mass of one molecule, and $\\overline{c^2}$ = the <strong>mean
square speed</strong> of all the molecules — that is, the average of $c^2$ for each molecule, <strong>not</strong>
the square of the average speed (because molecules move randomly in all directions, this is the correct
average to use, rather than simply the ordinary average speed).</p>
${mediaRow(
  null,
  { id: "tQcB9BLUoVI", title: "Thermodynamics part 1: Molecular theory of gases | Physics | Khan Academy",
    channel: "Khan Academy", desc: "A full derivation of the relationship pV = (1/3) N m <c²> from molecular collisions with the container walls, and how this result is connected to the temperature of a gas." }
)}

<h3>6. Molecular Kinetic Energy and Temperature</h3>
<p>This is the section that links the microscopic world (the motion and kinetic energy of individual
molecules) with the macroscopic world (the temperature of a gas, which can be measured with a thermometer) —
a topic that appears frequently in Cambridge 9702 exams. Compare the two forms of the ideal gas equation we
already have:</p>
<div class="formula-box">
$$pV = \\tfrac{1}{3}Nm\\overline{c^2} \\qquad \\text{(from the kinetic theory)}$$
$$pV = NkT \\qquad \\text{(from the ideal gas equation of state)}$$
</div>
<p>Since the left-hand side of both equations is $pV$, the right-hand sides must also be equal:</p>
<div class="formula-box">$$\\tfrac{1}{3}Nm\\overline{c^2} = NkT \\quad\\Rightarrow\\quad \\tfrac{1}{3}m\\overline{c^2} = kT$$</div>
<p>Multiply both sides by $\\tfrac{3}{2}$:</p>
<div class="formula-box">$$\\tfrac{1}{2}m\\overline{c^2} = \\tfrac{3}{2}kT$$</div>
<p>The left-hand side, $\\tfrac{1}{2}m\\overline{c^2}$, is simply the <strong>average translational kinetic
energy of a single gas molecule</strong> (the average of $\\tfrac12 mc^2$ for each molecule). So:</p>
<div class="formula-box">$$E_k = \\tfrac{1}{2}m\\overline{c^2} = \\tfrac{3}{2}kT$$</div>
<p><strong>Important conclusion:</strong> the average translational kinetic energy of a molecule of an ideal
gas <strong>is directly proportional to the absolute temperature $T$</strong> (in kelvin) — and does not
depend on the type of gas (a light gas such as hydrogen and a heavy gas such as carbon dioxide at the same
temperature $T$ have exactly the <em>same</em> average kinetic energy per molecule, even though their speeds
differ because their masses differ). This is the physical reason why temperature is a measure of the average
kinetic energy of the particles making up a substance.</p>
<p class="muted">If the absolute temperature of a gas is doubled (for example, from 300 K to 600 K), the
average translational kinetic energy of each molecule also doubles — but the speed does <strong>not</strong>
double, because $E_k \\propto v^2$, so the (rms) speed increases only by a factor of $\\sqrt{2}$.</p>

<h3>7. Root-Mean-Square (rms) Speed</h3>
<p>Since $\\overline{c^2}$ is the mean square speed, its square root is called the <strong>root-mean-square
speed</strong> (the square root of the mean of the squares), abbreviated $c_{rms}$:</p>
<div class="formula-box">$$c_{rms} = \\sqrt{\\overline{c^2}}$$</div>
<p>From the results of sections 5 and 6 above ($\\tfrac13 m\\overline{c^2} = kT$, and $k=R/N_A$ while $M=mN_A$
is the molar mass), $c_{rms}$ can be calculated directly from the temperature and molar mass of the gas:</p>
<div class="formula-box">$$c_{rms} = \\sqrt{\\dfrac{3kT}{m}} = \\sqrt{\\dfrac{3RT}{M}}$$</div>
<p>where $M$ = the molar mass of the gas in <strong>kg mol⁻¹</strong> (not g mol⁻¹ — remember the conversion
$1~\\text{g mol}^{-1} = 1\\times10^{-3}~\\text{kg mol}^{-1}$).</p>
<p><strong>Worked example:</strong> What is the rms speed of nitrogen gas molecules (N₂, the main component of
air, $M = 28~\\text{g mol}^{-1} = 2.8\\times10^{-2}~\\text{kg mol}^{-1}$) at room temperature $20°\\text{C}$
($T=293$ K)?</p>
<div class="formula-box">$$c_{rms} = \\sqrt{\\dfrac{3RT}{M}} = \\sqrt{\\dfrac{3 \\times 8.31 \\times 293}{2.8\\times10^{-2}}} \\approx \\sqrt{2.61\\times10^{5}} \\approx 511~\\text{m s}^{-1}$$</div>
<p class="muted">This speed (about 511 m/s, more than 1800 km/h!) is far greater than typical wind speeds, but
air molecules are constantly colliding with other molecules (their mean free path is very short), so the net
movement of a molecule from one place to another (diffusion) is much slower than its rms speed itself.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/61/Maxwell-Boltzmann-Distribution.svg",
    alt: "Graph of the Maxwell-Boltzmann distribution of gas molecule speeds at three different temperatures",
    caption: "The Maxwell-Boltzmann distribution: the spread of speeds of gas molecules at three different temperatures ($T=100$ K, $1200$ K, $5000$ K). Not all molecules have the same speed; the graph shifts towards higher speeds and broadens as temperature increases. The rms speed lies slightly to the right of the peak of the curve (the most probable speed).",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  null
)}
`;

const IDEALGASES_EKSPERIMEN_EN = {
  title: "Real Experiment: Investigating Boyle's Law with a Trapped Column of Air",
  intro: `
    <p class="muted">This is a genuine physical experiment using real laboratory apparatus (a graduated
    Boyle's law tube, a pressure gauge, and a pump), not a computer simulation. It is a standard practical
    used to verify Boyle's law ($pV=\\text{constant}$ at constant temperature) that is common across many
    A-Level syllabuses (including as a <em>Required/Core Practical</em> on AQA and Edexcel, and documented on
    IOPSpark and CLEAPSS).</p>

    <h4>Aim</h4>
    <p>To investigate the relationship between the pressure $p$ and volume $V$ of a fixed amount of gas (air)
    at constant temperature, and to verify Boyle's law ($pV = \\text{constant}$).</p>

    <h4>Underlying Concept</h4>
    <p>As long as the temperature $T$ and the amount of gas $n$ are kept constant, the ideal gas equation of
    state $pV=nRT$ predicts that the product $pV$ must be constant:</p>
    <div class="formula-box">$$p_1V_1 = p_2V_2 \\quad (\\text{Boyle's law, } T \\text{ and } n \\text{ constant})$$</div>
    <p>Because the volume of the air column trapped in the uniform-bore tube (constant cross-sectional area
    $A$) is directly proportional to the length of the column ($V = A \\times L$), measuring the length of the
    air column $L$ alone is enough to represent the volume $V$ — we do not need to know the value of $A$ to
    verify the form of the relationship, because $A$ remains constant throughout the experiment (it cancels
    out when comparing the data).</p>

    <h4>Apparatus &amp; Materials</h4>
    <ul>
      <li>Boyle's law apparatus: a thick-walled glass tube with a length scale, containing a column of dry air
      trapped above a column of oil, fitted with a Bourdon gauge that reads the absolute gas pressure directly</li>
      <li>A hand pump or foot pump (or a bicycle/car tyre pump) connected to the apparatus's oil reservoir,
      used to increase the pressure</li>
      <li>A pressure release valve on the reservoir, for lowering the pressure in a controlled way</li>
      <li>A stand/clamp or weights at the base of the apparatus to keep the tube upright and prevent it
      tipping over</li>
      <li>A transparent safety screen to be placed in front of the apparatus</li>
      <li>Safety goggles for every student involved</li>
      <li>A stopwatch (to allow time for the temperature to re-equilibrate after each pressure change)</li>
    </ul>

    <h4>Procedure</h4>
    <ol>
      <li>Before doing anything else, place the safety screen in front of the apparatus and make sure all
      students are wearing safety goggles. Make sure the apparatus stands upright and stable (clamped or
      weighted down).</li>
      <li>Record the initial readings: the pressure on the Bourdon gauge (usually already showing atmospheric
      pressure before the pump is used) and the length $L_0$ of the air column trapped in the tube.</li>
      <li>Pump slowly and carefully (vertically, pressing the pump gently, especially once the pressure is
      already high) to raise the pressure in small steps. After each pressure increase, <strong>wait for a
      short time</strong> (use a stopwatch, typically 30-60 seconds) so that the gas temperature, which rises
      slightly due to compression, settles back to room temperature before reading the column length (your
      eye must be level horizontally with the scale/meniscus when reading, to avoid parallax error).</li>
      <li>Record the data pair (pressure $p$, column length $L$) at each pressure step, up to close to the
      maximum limit of the apparatus (do not exceed it).</li>
      <li>After reaching a safe maximum pressure, release the pump and use the release valve to lower the
      pressure in stages (opening the valve gradually), recording the data pairs (p, L) again on the way down
      as a repeat/check.</li>
      <li>Repeat the entire set of measurements (increasing and decreasing) once more to check that the data
      is consistent, and take an average if there is a small discrepancy.</li>
    </ol>

    <h4>Data Table (example — fill in with your own experimental data)</h4>
    <table>
      <tr><th>p (× 10⁵ Pa)</th><th>L (cm)</th><th>V &prop; L (cm, representing volume)</th><th>1/L (cm⁻¹)</th><th>p × L (× 10⁵ Pa cm)</th></tr>
      <tr><td>1.0</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>1.5</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2.0</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2.5</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>3.0</td><td></td><td></td><td></td><td></td></tr>
    </table>

    <h4>Analysis &amp; Calculations</h4>
    <ul>
      <li>Method 1 (constant check): calculate the last column of the table, $p \\times L$, for every row of
      data. If Boyle's law holds, all the $p \\times L$ values should be roughly the same (constant within the
      uncertainty of the measurements).</li>
      <li>Method 2 (graphical, statistically more convincing): plot a graph of $p$ (y-axis) against $1/L$
      (x-axis). Since $pV=p(AL)=\\text{constant}$, we have $p = \\dfrac{\\text{constant}}{A}\\times\\dfrac{1}{L}$,
      so a graph of $p$ against $1/L$ should be a <strong>straight line through the origin (0,0)</strong>.
      Draw a line of best fit and check whether it does indeed pass through the origin.</li>
      <li>For comparison, also plot a graph of $p$ directly against $L$ — its shape should be a curve
      (a hyperbola), <strong>not</strong> a straight line, confirming that the $p$-$V$ relationship is indeed
      not directly linear.</li>
    </ul>

    <h4>Safety</h4>
    <ul>
      <li>Safety goggles MUST be worn and a transparent safety screen MUST be placed in front of the apparatus
      throughout the experiment — a glass tube under high pressure carries a risk of cracking or shattering.</li>
      <li>Never exceed the maximum pressure limit marked on the apparatus (usually shown in red on the Bourdon
      gauge).</li>
      <li>Pump slowly and carefully, especially once the pressure is already high, because the pumping action
      becomes harder against the gas's back-pressure.</li>
      <li>Make sure the apparatus is clamped or weighted at its base so it cannot easily tip over or slide off
      the edge of the bench while being pumped.</li>
      <li>Observe the apparatus from a safe distance behind the safety screen; do not place your face too
      close to the glass tube.</li>
    </ul>

    <h4>Sources of Error (for discussion in your report)</h4>
    <ul>
      <li>Compressing the gas too quickly momentarily raises its temperature (the process approaches adiabatic
      rather than fully isothermal) before it has time to re-equilibrate with room temperature — this is why
      the waiting time before reading the column length is important.</li>
      <li>Parallax error when reading the position of the oil meniscus against the length scale on the tube.</li>
      <li>A small amount of gas/air may leak slowly through the pump/valve connections during the experiment,
      meaning the amount of gas $n$ may not remain perfectly constant.</li>
      <li>The precision of the Bourdon gauge reading is limited by its smallest scale division (usually in
      tens of kPa).</li>
    </ul>

    <h4>Simple Alternative Using a Syringe — if Boyle's law apparatus is not available</h4>
    <p>If a school does not have standard Boyle's law apparatus, the $p$-$V$ relationship can still be
    investigated quantitatively using a graduated <strong>gas syringe</strong> and added weights:</p>
    <ol>
      <li>Seal the tip of the syringe tightly (for example with rubber cement/a bung) so that a fixed amount
      of air is trapped inside it, and record the initial volume $V_0$ directly from the syringe's scale with
      the piston free (no added weights, just held horizontally).</li>
      <li>Mount the syringe vertically (piston facing upward) and add weights of known mass on top of the
      piston in stages; record the gas volume (from the syringe's scale) after each addition of weight.</li>
      <li>Calculate the gas pressure in each state: $p = p_{atm} + \\dfrac{mg}{A_{piston}}$, where $p_{atm}
      \\approx 1.0\\times10^5$ Pa (atmospheric pressure), $m$ = the total mass of the weights on the piston,
      $g=9.81$ m s⁻², and $A_{piston}$ = the cross-sectional area of the syringe piston (calculated from the
      syringe's stated diameter, $A = \\pi r^2$).</li>
      <li>Analyse the data in the same way as the main method: plot $p$ against $1/V$, which should be a
      straight line through the origin.</li>
      <li>This method is cheaper and safer (no high-pressure glass tube), but the range of pressures it can
      reach is much smaller than with standard Boyle's law apparatus, so the change in volume is relatively
      small and the proportional measurement error is larger.</li>
    </ol>

    <h4>Discussion Questions</h4>
    <ul>
      <li>Why is it important to wait for a short time after increasing/decreasing the pressure before
      recording the length of the air column?</li>
      <li>If your graph of $p$ against $1/L$ does not pass exactly through the origin (there is a small
      intercept), what could be the possible causes?</li>
      <li>How can you make sure the temperature of the gas during the experiment is genuinely constant (rather
      than simply assumed to be constant)?</li>
      <li>In the syringe alternative method, why does the syringe need to be mounted vertically when weights
      are added, rather than horizontally?</li>
    </ul>

    <h4>References</h4>
    <ul>
      <li><a href="https://spark.iop.org/boyles-law" target="_blank" rel="noopener">Boyle's law, IOPSpark (Institute of Physics)</a></li>
      <li><a href="https://science.cleapss.org.uk/resource-info/pp028-investigating-gas-laws-1-pressure-volume-boyle-s-law.aspx" target="_blank" rel="noopener">PP028 — Investigating gas laws 1: pressure/volume (Boyle's law), CLEAPSS</a></li>
      <li><a href="https://qualifications.pearson.com/content/dam/pdf/A%20Level/Physics/2015/teaching-and-learning-materials/AS-and-A-level-Physics-Core-Practical-14-Pressure-and-Volume-(Student,-Teacher,-Technician-Worksheets).pdf" target="_blank" rel="noopener">Core Practical 14: Pressure and Volume of a Gas, Pearson Edexcel AS/A Level Physics</a></li>
      <li><a href="https://www.3bscientific.com/product-manual/U30046_EN.pdf" target="_blank" rel="noopener">Boyle's Law Apparatus U30046, Instruction Sheet, 3B Scientific</a></li>
    </ul>
  `
};

/* type: "mcq" or "structured".
   For mcq: options[] and correct = index of the correct answer. */
const IDEALGASES_LATIHAN_EN = [
  {
    type: "mcq",
    question: "A container holds 16 g of oxygen gas (O₂, molar mass 32 g mol⁻¹). The Avogadro constant N_A = 6.02 × 10²³ mol⁻¹. What is the number of oxygen molecules in the container?",
    options: ["1.5 × 10²³", "3.0 × 10²³", "6.0 × 10²³", "9.6 × 10²⁴"],
    correct: 1,
    solution: `Amount of substance: $n = \\dfrac{\\text{mass}}{\\text{molar mass}} = \\dfrac{16}{32} = 0.50~\\text{mol}$.
    <br>Number of molecules: $N = nN_A = 0.50 \\times 6.02\\times10^{23} = 3.01\\times10^{23} \\approx 3.0\\times10^{23}$ molecules.`
  },
  {
    type: "mcq",
    question: "A fixed amount of ideal gas at constant temperature has a volume of 480 cm³ at a pressure of 1.0 × 10⁵ Pa. The gas is then compressed at the same temperature until its volume becomes 320 cm³. What is the pressure of the gas after compression?",
    options: ["0.67 × 10⁵ Pa", "1.0 × 10⁵ Pa", "1.5 × 10⁵ Pa", "2.25 × 10⁵ Pa"],
    correct: 2,
    solution: `The temperature is constant, so Boyle's law applies: $p_1V_1 = p_2V_2$.
    <br>$p_2 = \\dfrac{p_1V_1}{V_2} = \\dfrac{(1.0\\times10^5)(480)}{320} = 1.5\\times10^{5}~\\text{Pa}$.
    <br>This makes sense: the volume decreases (compression), so the pressure must increase, consistent with the answer above.`
  },
  {
    type: "structured",
    question: "A cylinder of volume 0.025 m³ contains an ideal gas at a pressure of 2.4 × 10⁵ Pa and a temperature of 22 °C. The molar gas constant R = 8.31 J K⁻¹ mol⁻¹. Determine (a) the temperature of the gas in kelvin, (b) the amount of gas (in moles) in the cylinder.",
    solution: `<strong>(a)</strong> $T = 22 + 273 = 295~\\text{K}$.
    <br><strong>(b)</strong> From $pV=nRT$: $n = \\dfrac{pV}{RT} = \\dfrac{(2.4\\times10^5)(0.025)}{(8.31)(295)} = \\dfrac{6000}{2451.45} \\approx 2.4~\\text{mol}$.`
  },
  {
    type: "structured",
    question: "A fixed amount of ideal gas (the mass of gas does not change) initially has a volume of 300 cm³, a pressure of 1.0 × 10⁵ Pa, and a temperature of 27 °C. The gas then expands until its volume becomes 500 cm³ while its pressure falls to 8.0 × 10⁴ Pa. Determine (a) the initial temperature of the gas in kelvin, (b) the final temperature of the gas after this change of state.",
    solution: `<strong>(a)</strong> $T_1 = 27 + 273 = 300~\\text{K}$.
    <br><strong>(b)</strong> Since the amount of gas is constant, the combined gas law applies: $\\dfrac{p_1V_1}{T_1} = \\dfrac{p_2V_2}{T_2}$.
    <br>$T_2 = T_1 \\times \\dfrac{p_2V_2}{p_1V_1} = 300 \\times \\dfrac{(8.0\\times10^4)(500)}{(1.0\\times10^5)(300)} = 300 \\times \\dfrac{4.0\\times10^7}{3.0\\times10^7} = 300 \\times 1.333 \\approx 400~\\text{K}$
    <br>(equivalent to $400 - 273 = 127°\\text{C}$). Note: since $V$ in cm³ appears in both the numerator and the denominator, the volume does not need to be converted to m³, because it cancels out in this ratio.`
  },
  {
    type: "structured",
    question: "The Boltzmann constant k = 1.38 × 10⁻²³ J K⁻¹. Determine (a) the average translational kinetic energy of a molecule of an ideal gas at a temperature of 300 K, (b) the temperature (in kelvin) required for the average translational kinetic energy of that molecule to become twice the value found in part (a).",
    solution: `<strong>(a)</strong> $E_k = \\tfrac{3}{2}kT = \\tfrac{3}{2}(1.38\\times10^{-23})(300) = 6.21\\times10^{-21}~\\text{J}$.
    <br><strong>(b)</strong> Since $E_k = \\tfrac32 kT$, the average kinetic energy is directly proportional to the absolute temperature $T$. For $E_k$ to double, $T$ must also double:
    <br>$T_{new} = 2 \\times 300 = 600~\\text{K}$.
    <br>(Check: $E_k = \\tfrac32(1.38\\times10^{-23})(600) = 1.242\\times10^{-20}~\\text{J}$, exactly twice $6.21\\times10^{-21}$ J, consistent.)`
  },
  {
    type: "structured",
    question: "The molar gas constant R = 8.31 J K⁻¹ mol⁻¹. Nitrogen molecules (N₂) have a molar mass of 28 g mol⁻¹. Determine (a) the molar mass of nitrogen in kg mol⁻¹, (b) the root-mean-square (rms) speed of nitrogen molecules at a temperature of 20 °C.",
    solution: `<strong>(a)</strong> $M = 28~\\text{g mol}^{-1} = 28\\times10^{-3}~\\text{kg mol}^{-1} = 2.8\\times10^{-2}~\\text{kg mol}^{-1}$.
    <br><strong>(b)</strong> $T = 20 + 273 = 293~\\text{K}$.
    <br>$c_{rms} = \\sqrt{\\dfrac{3RT}{M}} = \\sqrt{\\dfrac{3(8.31)(293)}{2.8\\times10^{-2}}} = \\sqrt{\\dfrac{7304.3}{2.8\\times10^{-2}}} = \\sqrt{2.609\\times10^{5}} \\approx 5.1\\times10^{2}~\\text{m s}^{-1}$ (approximately 511 m s⁻¹).`
  }
];

/* Concise formula sheet (plain text), used as automatic "grounding":
   appended to the prompt sent to the AI so it uses exactly the formulas
   & values already validated by the teacher, rather than guessing from
   general knowledge. */
const IDEALGASES_FORMULA_SHEET_EN = `
- Mole and the Avogadro constant: N = n * NA, where NA = Avogadro constant = 6.02 x 10^23 mol^-1 (Cambridge data sheet)
- Amount of substance from mass: n = sample mass / molar mass (M). Watch units carefully: the unit of molar mass (g/mol vs kg/mol) must be consistent with the unit of sample mass used.
- Ideal gas equation of state: pV = nRT, where R = molar gas constant = 8.31 J K^-1 mol^-1 (Cambridge data sheet)
- Per-molecule form: pV = NkT, where k = Boltzmann constant = 1.38 x 10^-23 J K^-1 (Cambridge data sheet), and k = R / NA
- T must be in kelvin in all ideal gas formulas: T(K) = T(degrees C) + 273.15 (9702 syllabus 2025-2027); the quick rounding +273 is often used for practical estimation in questions (the difference is only 0.15 K, which does not change the final answer to 2-3 significant figures).
- Boyle's law (T and n constant): p1 V1 = p2 V2. p-V graph is a hyperbola/isotherm; graph of p vs 1/V is a straight line through the origin.
- Pressure law / Gay-Lussac's law (V and n constant): p1/T1 = p2/T2. Graph of p vs T (kelvin) is a straight line through the origin.
- Charles's law (p and n constant): V1/T1 = V2/T2. Graph of V vs T (kelvin) is a straight line through the origin.
- Combined gas law (n constant): p1 V1 / T1 = p2 V2 / T2
- Basic assumptions of the kinetic theory of an ideal gas (9702 syllabus 15.3.1): (1) a very large number of molecules move in random motion; (2) the volume of the molecules is negligible compared with the volume of the gas; (3) intermolecular forces are negligible except during collisions; (4) collisions between molecules, and with the walls, are perfectly elastic and last for a very short time compared with the time between collisions; (5) molecules move in straight lines at constant speed between collisions, obeying Newton's laws of motion.
- Gas pressure from the kinetic theory: pV = 1/3 N m <c^2>, where N = number of molecules, m = mass of one molecule, <c^2> = mean square speed (NOT the square of the average speed)
- Linking to temperature (compare pV=1/3 N m<c^2> with pV=NkT): (1/2) m <c^2> = (3/2) k T -> average translational kinetic energy of one molecule E_k = (3/2) k T, directly proportional to absolute temperature T, independent of the type of gas.
- Root-mean-square speed: c_rms = sqrt(<c^2>) = sqrt(3 k T / m) = sqrt(3 R T / M), where M = molar mass of the gas in kg/mol.
- Standard values from the Cambridge 9702 data sheet: R = 8.31 J K^-1 mol^-1 ; NA = 6.02 x 10^23 mol^-1 ; k = 1.38 x 10^-23 J K^-1 ; g = 9.81 m/s^2 (for related experiments, if needed).
`;

/* Specific concepts for the Virtual Simulation Lab's Prompt Generator dropdown */
const IDEALGASES_LAB_CONCEPTS_EN = [
  "The Concept of the Mole and the Avogadro Constant (N = n x NA)",
  "The Ideal Gas Equation of State (pV = nRT and pV = NkT)",
  "Boyle's Law, the Pressure Law, and Charles's Law (p-V, p-T, V-T graphs)",
  "Basic Assumptions of the Kinetic Theory of an Ideal Gas",
  "Gas Pressure from the Kinetic Theory (pV = 1/3 N m <c^2>)",
  "Relationship Between Molecular Kinetic Energy and Temperature ((1/2) m <c^2> = (3/2) k T) and rms Speed",
  "Other (write your own in additional instructions)"
];

const IDEALGASES_MATERI_CHECK = [
  { question: "Hukum Boyle menyatakan bahwa pada suhu tetap, hasil kali tekanan (p) dan volume (V) suatu gas bersifat...",
    options: ["Berbanding lurus dengan suhu", "Konstan", "Selalu bertambah", "Berbanding lurus dengan p saja"], correct: 1,
    explanation: "Hukum Boyle: pV = konstan, selama suhu T dan jumlah mol gas n tetap." },
  { question: "Sebanyak 2 mol suatu gas mengandung berapa banyak molekul (NA = 6,02×10²³ mol⁻¹)?",
    options: ["6,02×10²³", "1,204×10²⁴", "3,01×10²³", "1,204×10²³"], correct: 1,
    explanation: "N = nNA = 2 × 6,02×10²³ = 1,204×10²⁴ molekul." },
  { question: "Mengapa suhu T pada persamaan gas ideal pV = nRT harus selalu dalam satuan kelvin, bukan derajat Celsius?",
    options: ["Karena kelvin lebih mudah diukur alat", "Karena hubungan pV = nRT hanya berlaku untuk skala suhu MUTLAK, dengan T = 0 berarti energi kinetik molekul minimum", "Karena semua besaran SI harus memakai kelvin", "Karena angka dalam kelvin selalu lebih besar sehingga perhitungan lebih akurat"], correct: 1,
    explanation: "pV = nRT hanya berlaku untuk suhu mutlak (skala termodinamika/Kelvin), karena T = 0 K berkaitan langsung dengan energi kinetik molekul minimum - bukan sekadar titik referensi sembarang seperti 0°C." },
  { question: "Manakah yang BUKAN termasuk asumsi dasar model kinetik gas ideal?",
    options: ["Molekul bergerak acak dengan berbagai kelajuan dan arah", "Volume molekul itu sendiri dapat diabaikan dibanding volume total gas", "Gaya tarik-menarik antarmolekul sangat kuat dan harus diperhitungkan", "Tumbukan antarmolekul bersifat lenting sempurna"], correct: 2,
    explanation: "Salah satu asumsi dasar model kinetik gas ideal justru MENGABAIKAN gaya antarmolekul (kecuali saat tumbukan) - pilihan ini bertentangan dengan asumsi tersebut." },
  { question: "Jika suhu mutlak suatu gas ideal dinaikkan dari 300 K menjadi 600 K, apa yang terjadi pada energi kinetik translasi rata-rata tiap molekulnya?",
    options: ["Tetap sama", "Menjadi dua kali lipat", "Menjadi empat kali lipat", "Menjadi setengah kali"], correct: 1,
    explanation: "Ek = (3/2)kT sebanding lurus dengan suhu mutlak T, jadi menggandakan T juga menggandakan Ek rata-rata tiap molekul." }
];
const IDEALGASES_MATERI_CHECK_EN = [
  { question: "Boyle's Law states that, at constant temperature, the product of pressure (p) and volume (V) of a gas is...",
    options: ["Directly proportional to temperature", "Constant", "Always increasing", "Directly proportional to p alone"],
    explanation: "Boyle's Law: pV = constant, as long as temperature T and amount of gas n stay fixed." },
  { question: "How many molecules are in 2 moles of a gas (NA = 6.02×10²³ mol⁻¹)?",
    options: ["6.02×10²³", "1.204×10²⁴", "3.01×10²³", "1.204×10²³"],
    explanation: "N = nNA = 2 × 6.02×10²³ = 1.204×10²⁴ molecules." },
  { question: "Why must the temperature T in the ideal gas equation pV = nRT always be in kelvin, not degrees Celsius?",
    options: ["Because kelvin is easier to measure with instruments", "Because pV = nRT only holds for the ABSOLUTE temperature scale, where T = 0 means minimum molecular kinetic energy", "Because all SI quantities must use kelvin", "Because numbers in kelvin are always larger, giving more accurate calculations"],
    explanation: "pV = nRT only holds for absolute (thermodynamic/Kelvin) temperature, since T = 0 K corresponds directly to minimum molecular kinetic energy - not just an arbitrary reference point like 0°C." },
  { question: "Which of these is NOT a basic assumption of the kinetic model of an ideal gas?",
    options: ["Molecules move randomly with a range of speeds and directions", "The volume of the molecules themselves is negligible compared to the gas's total volume", "Attractive forces between molecules are strong and must be accounted for", "Collisions between molecules are perfectly elastic"],
    explanation: "One basic assumption of the kinetic model is that intermolecular forces are actually NEGLIGIBLE (except during collisions) - this option contradicts that assumption." },
  { question: "If the absolute temperature of an ideal gas is raised from 300 K to 600 K, what happens to the average translational kinetic energy of each molecule?",
    options: ["Stays the same", "Doubles", "Quadruples", "Halves"],
    explanation: "Ek = (3/2)kT is directly proportional to absolute temperature T, so doubling T also doubles the average kinetic energy per molecule." }
];
const IDEALGASES_EKSPERIMEN_CHECK = [
  { question: "Pada eksperimen ini, panjang kolom udara L dipakai untuk mewakili volume V gas. Mengapa ini valid tanpa perlu mengukur luas penampang tabung A?",
    options: ["Karena A selalu bernilai 1", "Karena A konstan sepanjang percobaan sehingga tereliminasi saat membandingkan data", "Karena udara tidak memiliki volume", "Karena tekanan tidak bergantung pada volume"], correct: 1,
    explanation: "V = A×L dengan A konstan (tabung seragam), sehingga perbandingan V cukup diwakili oleh perbandingan L." },
  { question: "Jika data p dan L (mewakili V) dari eksperimen ini konsisten dengan Hukum Boyle, maka grafik p terhadap 1/L seharusnya berbentuk...",
    options: ["Garis lurus melalui titik asal", "Parabola", "Garis lurus horizontal", "Kurva menurun eksponensial"], correct: 0,
    explanation: "pV = konstan ⇒ p = konstan/V ⇒ p sebanding 1/V (dan karena itu juga 1/L), jadi p vs 1/L adalah garis lurus melalui titik asal." }
];
const IDEALGASES_EKSPERIMEN_CHECK_EN = [
  { question: "In this experiment, the trapped air column length L is used to represent the gas volume V. Why is this valid without measuring the tube's cross-sectional area A?",
    options: ["Because A is always equal to 1", "Because A stays constant throughout the experiment, so it cancels out when comparing data", "Because air has no volume", "Because pressure does not depend on volume"],
    explanation: "V = A×L with A constant (uniform tube), so comparing volumes is equivalent to comparing lengths L." },
  { question: "If the p and L (representing V) data from this experiment agree with Boyle's Law, a graph of p against 1/L should be...",
    options: ["A straight line through the origin", "A parabola", "A horizontal straight line", "A decreasing exponential curve"],
    explanation: "pV = constant ⇒ p = constant/V ⇒ p is proportional to 1/V (and hence 1/L), so p vs 1/L is a straight line through the origin." }
];

(function attachIdealGasesContent() {
  const topic = TOPICS.find(t => t.id === "ideal-gases");
  topic.desc = { id: topic.desc, en: IDEALGASES_DESC_EN };
  topic.materiHTML = { id: IDEALGASES_MATERI, en: IDEALGASES_MATERI_EN };
  topic.eksperimen = {
    title: { id: IDEALGASES_EKSPERIMEN.title, en: IDEALGASES_EKSPERIMEN_EN.title },
    intro: { id: IDEALGASES_EKSPERIMEN.intro, en: IDEALGASES_EKSPERIMEN_EN.intro }
  };
  topic.latihan = IDEALGASES_LATIHAN.map((q, i) => {
    const qEN = IDEALGASES_LATIHAN_EN[i] || {};
    return {
      ...q,
      question: { id: q.question, en: qEN.question },
      options: q.options ? q.options.map((opt, j) => ({ id: opt, en: (qEN.options || [])[j] })) : q.options,
      solution: { id: q.solution, en: qEN.solution }
    };
  });
  topic.labConcepts = IDEALGASES_LAB_CONCEPTS.map((c, i) => ({ id: c, en: IDEALGASES_LAB_CONCEPTS_EN[i] }));
  topic.formulaSheet = { id: IDEALGASES_FORMULA_SHEET, en: IDEALGASES_FORMULA_SHEET_EN };
  topic.materiCheck = mapCheckQuestions(IDEALGASES_MATERI_CHECK, IDEALGASES_MATERI_CHECK_EN);
  topic.eksperimenCheck = mapCheckQuestions(IDEALGASES_EKSPERIMEN_CHECK, IDEALGASES_EKSPERIMEN_CHECK_EN);
})();

/* ------------------------------------------------------------
   Konten lengkap: THERMODYNAMICS (topik 16, A2)
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   Konten lengkap: THERMODYNAMICS (topik 16, A2)
   ------------------------------------------------------------ */

const THERMODYNAMICS_MATERI = `
<h3>1. Energi Dalam (Internal Energy)</h3>
<p><strong>Energi dalam</strong> $U$ suatu sistem (misalnya sejumlah gas) didefinisikan sebagai
<strong>jumlah dari energi kinetik acak dan energi potensial acak seluruh molekul</strong> dalam sistem
tersebut, akibat gerak dan susunan molekul yang tidak beraturan.</p>
<div class="formula-box">$$U = \\sum(\\text{EK molekul}) + \\sum(\\text{EP molekul})$$</div>
<ul>
  <li><strong>Energi kinetik molekul</strong> berasal dari gerak translasi (dan pada molekul poliatomik, juga
  rotasi/getaran) molekul-molekul yang bergerak acak. Komponen ini berkaitan langsung dengan suhu mutlak gas.</li>
  <li><strong>Energi potensial molekul</strong> berasal dari gaya tarik/tolak antar molekul (gaya
  antarmolekul). Untuk gas ideal, gaya antarmolekul diasumsikan diabaikan sehingga energi potensial ini
  dianggap nol.</li>
</ul>
<p class="muted"><strong>Energi dalam BUKAN sama dengan suhu.</strong> Suhu hanya berkaitan dengan energi
kinetik rata-rata molekul (lihat topik Ideal Gases: $\\tfrac12 m\\overline{c^2} \\propto T$). Energi dalam
mencakup energi kinetik <em>dan</em> energi potensial total seluruh molekul. Contoh: saat es mencair menjadi
air pada suhu tetap 0°C, suhu (dan karenanya energi kinetik rata-rata molekul) tidak berubah, tetapi energi
dalam tetap bertambah karena kalor laten yang diserap digunakan untuk mengubah susunan/jarak antarmolekul,
sehingga energi potensial molekulnya meningkat. Untuk <strong>gas ideal</strong> saja (karena energi potensial
antarmolekulnya nol), energi dalam sepenuhnya berupa energi kinetik, sehingga perubahan energi dalam gas ideal
berbanding lurus dengan perubahan suhu mutlaknya.</p>

<h3>2. Kerja yang Dilakukan pada/oleh Gas</h3>
<p>Ketika gas memuai atau dimampatkan oleh sebuah piston, terjadi perpindahan energi dalam bentuk kerja
mekanik. Untuk gas pada <strong>tekanan tetap</strong> $p$ yang volumenya berubah sebesar $\\Delta V$, besar
kerja yang terlibat adalah:</p>
<div class="formula-box">$$W = p\\,\\Delta V$$</div>
<p>Secara lebih umum (tekanan tidak harus tetap), besar kerja pada suatu proses sama dengan
<strong>luas daerah di bawah kurva pada grafik $p$-$V$</strong> antara volume awal dan volume akhir; rumus
$W = p\\Delta V$ hanyalah kasus khusus ketika kurva itu berupa garis mendatar (tekanan konstan), sehingga
luasnya berbentuk persegi panjang.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/29/P-V_diagram_work_closed_system.svg",
    alt: "Grafik tekanan terhadap volume menunjukkan luas daerah sebagai kerja yang dilakukan gas",
    caption: "Grafik $p$-$V$ untuk gas yang memuai dalam sistem tertutup: luas daerah di bawah kurva (diarsir) sama dengan besar kerja yang terlibat pada proses tersebut.",
    author: "Olivier Cleynen", license: "CC0 (Domain Publik)" },
  { id: "Xcrco59p40o", title: "PV diagrams - part 1: Work and isobaric processes",
    channel: "Khan Academy", desc: "Menjelaskan cara menghitung kerja dari grafik p-V, termasuk kasus khusus proses isobarik (tekanan tetap) W = p ΔV." }
)}
<p>Penting membedakan <strong>arah</strong> perpindahan energi ini:</p>
<ul>
  <li>Saat gas <strong>memuai</strong> ($\\Delta V > 0$) mendorong piston keluar, gas <strong>melakukan kerja
  pada lingkungan</strong> (energi meninggalkan gas melalui kerja).</li>
  <li>Saat gas <strong>dimampatkan</strong> ($\\Delta V < 0$) oleh piston yang didorong dari luar, lingkungan
  <strong>melakukan kerja pada gas</strong> (energi masuk ke gas melalui kerja).</li>
</ul>
<p class="muted">Perbedaan ini akan sangat menentukan tanda (+/-) suku kerja $w$ pada hukum pertama
termodinamika di bagian berikutnya — lihat baik-baik konvensi tanda yang dipakai Cambridge 9702.</p>

<h3>3. Hukum Pertama Termodinamika</h3>
<p>Hukum pertama termodinamika adalah pernyataan <strong>hukum kekekalan energi</strong> yang diterapkan pada
sistem termodinamika (misalnya sejumlah gas tertutup). Sesuai <em>syllabus</em> resmi Cambridge International
AS &amp; A Level Physics 9702, hukum ini dituliskan sebagai:</p>
<div class="formula-box">$$\\Delta U = q + w$$</div>
<p><strong>Definisi istilah menurut konvensi Cambridge 9702 (penting, hafalkan persis):</strong></p>
<table>
  <tr><th>Simbol</th><th>Arti</th><th>Bertanda POSITIF jika&hellip;</th><th>Bertanda NEGATIF jika&hellip;</th></tr>
  <tr><td>$\\Delta U$</td><td>Perubahan energi dalam sistem</td><td>Energi dalam sistem <strong>bertambah</strong></td><td>Energi dalam sistem <strong>berkurang</strong></td></tr>
  <tr><td>$q$</td><td>Kalor yang <strong>diterima</strong> sistem (energi yang berpindah ke sistem melalui pemanasan)</td><td>Kalor <strong>masuk</strong> ke sistem (sistem dipanaskan)</td><td>Kalor <strong>keluar</strong> dari sistem (sistem melepas kalor ke lingkungan)</td></tr>
  <tr><td>$w$</td><td>Kerja yang dilakukan <strong>pada</strong> sistem/gas</td><td>Gas <strong>dimampatkan</strong> (lingkungan melakukan kerja pada gas)</td><td>Gas <strong>memuai</strong> (gas melakukan kerja pada lingkungan)</td></tr>
</table>
<p class="muted"><strong>Peringatan penting:</strong> beberapa buku teks (terutama buku kimia/teknik lama)
memakai konvensi fisika klasik $\\Delta U = Q - W$ dengan $W$ = kerja yang dilakukan <em>oleh</em> sistem.
Cambridge 9702 <strong>TIDAK</strong> memakai konvensi itu. Selalu gunakan $\\Delta U = q + w$ dengan $w$ =
kerja <em>pada</em> sistem seperti pada data sheet dan <em>syllabus</em> Cambridge, supaya tanda kerja tidak
tertukar saat mengerjakan soal maupun menjawab pertanyaan ujian.</p>

<p><strong>Contoh kualitatif penerapan tanda:</strong></p>
<ul>
  <li>Gas dimampatkan (menerima kerja, $w > 0$) <em>sekaligus</em> dipanaskan (menerima kalor, $q > 0$)
  &rarr; kedua suku positif &rarr; $\\Delta U$ jelas bertambah (bertanda positif besar).</li>
  <li>Gas memuai melakukan kerja pada lingkungan tanpa menerima kalor sama sekali ($q = 0$, proses
  <strong>adiabatik</strong>) &rarr; $w < 0$ dan $q = 0$ &rarr; $\\Delta U = w < 0$, energi dalam
  <strong>berkurang</strong>, sehingga suhu gas turun. Inilah prinsip di balik <strong>pendinginan adiabatik</strong>
  (contoh: udara yang naik dan memuai di atmosfer menjadi lebih dingin).</li>
</ul>
${mediaRow(
  null,
  { id: "Xb05CaG7TsQ", title: "First law of thermodynamics / internal energy",
    channel: "Khan Academy", desc: "Pengantar hukum pertama termodinamika ΔU = Q + W dan penjelasan konsep energi dalam sebagai jumlah energi kinetik dan potensial molekul." }
)}

<h3>4. Kasus Khusus: Volume Tetap dan Proses Adiabatik</h3>
<table>
  <tr><th>Kasus</th><th>Syarat</th><th>Akibat pada hukum pertama</th></tr>
  <tr><td><strong>Volume tetap (isokhorik)</strong></td><td>Gas dalam wadah kaku/tertutup rapat, tidak ada perubahan volume ($\\Delta V = 0$)</td><td>$w = 0$ (tidak ada kerja karena tidak ada piston yang bergerak), sehingga $\\Delta U = q$: seluruh kalor yang diterima langsung menjadi pertambahan energi dalam.</td></tr>
  <tr><td><strong>Adiabatik</strong></td><td>Sistem terisolasi secara termal (tidak ada kalor yang masuk/keluar), atau perubahan terjadi sangat cepat sehingga kalor tidak sempat berpindah</td><td>$q = 0$, sehingga $\\Delta U = w$: seluruh perubahan energi dalam berasal murni dari kerja yang dilakukan pada/oleh gas.</td></tr>
</table>
<p>Kasus volume tetap ($\\Delta U = q$) inilah yang menjadi dasar teoretis mengapa pengukuran kalor pada
proses dengan volume tetap (misalnya memanaskan padatan/zat cair dalam wadah kaku) dapat langsung dipakai
untuk menentukan <strong>kapasitas kalor jenis</strong> (specific heat capacity, lihat topik Temperature):
$q = mc\\Delta\\theta$, dan karena $w \\approx 0$ untuk padatan/zat cair (pemuaiannya dapat diabaikan),
$\\Delta U = q = mc\\Delta\\theta$ secara langsung.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/58/Fire_piston.jpg",
    alt: "Fire piston, tabung kaca dengan piston yang memampatkan udara secara adiabatik hingga menyalakan kapas",
    caption: "Fire piston: sepotong kecil kapas/serat dalam tabung transparan terbakar akibat panas yang dihasilkan dari pemampatan udara yang sangat cepat (mendekati adiabatik, $q \\approx 0$), sehingga $\\Delta U = w$ cukup besar untuk menaikkan suhu udara hingga titik nyala.",
    author: "Chocolateoak", license: "CC BY-SA 3.0 / GFDL" },
  { id: "6sP3kV-zgZk", title: "First law of thermodynamics problem solving",
    channel: "Khan Academy", desc: "Latihan menerapkan hukum pertama termodinamika ΔU = q + w pada berbagai kasus soal, termasuk proses volume tetap dan adiabatik." }
)}

<h3>5. Contoh Numerik: Menerapkan $\\Delta U = q + w$</h3>
<p><strong>Soal:</strong> Suatu gas ideal di dalam silinder berpiston berada pada tekanan tetap
$2{,}0\\times10^{5}$ Pa. Gas dipanaskan sehingga volumenya bertambah dari $3{,}0\\times10^{-4}$ m³ menjadi
$5{,}0\\times10^{-4}$ m³, sementara total kalor sebesar 90 J diberikan pada gas. Tentukan perubahan energi
dalam gas.</p>
<p><strong>Penyelesaian:</strong></p>
<p>Langkah 1 - hitung besar kerja yang dilakukan <em>oleh</em> gas terhadap lingkungan saat memuai pada
tekanan tetap:</p>
<div class="formula-box">$$\\Delta V = (5{,}0-3{,}0)\\times10^{-4} = 2{,}0\\times10^{-4}~\\text{m}^3$$
$$W_{\\text{oleh gas}} = p\\,\\Delta V = (2{,}0\\times10^{5})(2{,}0\\times10^{-4}) = 40~\\text{J}$$</div>
<p>Langkah 2 - karena gas <em>memuai</em> (melakukan kerja pada lingkungan), kerja yang dilakukan
<strong>pada</strong> gas ($w$, sesuai konvensi Cambridge) bertanda <strong>negatif</strong>:</p>
<div class="formula-box">$$w = -40~\\text{J}$$</div>
<p>Langkah 3 - kalor diberikan <em>pada</em> gas sehingga $q$ bertanda positif: $q = +90$ J. Terapkan hukum
pertama termodinamika:</p>
<div class="formula-box">$$\\Delta U = q + w = (+90) + (-40) = +50~\\text{J}$$</div>
<p>Jadi energi dalam gas <strong>bertambah 50 J</strong>. Masuk akal: dari 90 J kalor yang diberikan, 40 J
"dipakai" gas untuk melakukan kerja mendorong piston keluar, sisanya (50 J) tetap tersimpan sebagai
pertambahan energi dalam (dan menaikkan suhu gas).</p>
`;

const THERMODYNAMICS_EKSPERIMEN = {
  title: "Eksperimen Nyata: Fire Piston (Pemantik Api Kompresi) - Peragaan Hukum Pertama Termodinamika",
  intro: `
    <p class="muted">Ini eksperimen fisik/peragaan sungguhan dengan alat nyata (fire piston/fire syringe),
    bukan simulasi komputer. Peragaan ini adalah demonstrasi klasik yang banyak dipakai laboratorium fisika
    universitas dan koleksi peraga fisika sekolah untuk menunjukkan proses adiabatik secara nyata dan
    dramatis. Kalau alat fire piston tidak tersedia di sekolahmu, lihat bagian <strong>Alternatif</strong> di
    bawah yang memberi versi kuantitatif memakai alat pemanas listrik biasa.</p>

    <h4>Tujuan</h4>
    <p>Mengamati dan menjelaskan secara kualitatif bagaimana kompresi (pemampatan) udara yang sangat cepat
    dapat menaikkan suhunya secara signifikan (proses mendekati adiabatik), sebagai penerapan langsung hukum
    pertama termodinamika $\\Delta U = q + w$ pada kasus $q \\approx 0$.</p>

    <h4>Konsep Dasar</h4>
    <p>Fire piston adalah tabung silinder kaca/logam tertutup di salah satu ujungnya, dengan piston yang pas
    (rapat) di ujung lainnya. Jika piston didorong ke dalam tabung <strong>dengan sangat cepat</strong> (satu
    hentakan tangan yang kuat), udara di dalam tabung dimampatkan dalam waktu yang sangat singkat, sehingga
    <strong>tidak ada cukup waktu bagi kalor untuk berpindah keluar</strong> melalui dinding tabung. Proses ini
    mendekati proses <strong>adiabatik</strong> ($q \\approx 0$), sehingga hukum pertama termodinamika menjadi:</p>
    <div class="formula-box">$$\\Delta U = q + w \\approx 0 + w = w$$</div>
    <p>Karena piston melakukan kerja <em>pada</em> udara (memampatkannya, $\\Delta V < 0$), $w$ bertanda
    <strong>positif</strong> dan cukup besar (hentakan tangan manusia dapat memampatkan udara hingga rasio
    kompresi 20:1 atau lebih dalam waktu kurang dari 0,1 detik). Akibatnya $\\Delta U$ juga besar dan positif,
    menaikkan suhu udara di dalam tabung secara drastis (bisa melebihi 250-300°C) dalam sekejap, cukup panas
    untuk membakar sepotong kecil kapas/serat kering (tinder) yang diletakkan di dasar tabung, hingga terlihat
    percikan api singkat. Prinsip fisis yang sama inilah yang dipakai pada mesin diesel untuk menyalakan bahan
    bakar tanpa busi.</p>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Fire piston / fire syringe (silinder kaca atau logam transparan dengan piston berperapat karet/kulit di ujungnya) - alat peraga fisika yang cukup umum tersedia sebagai alat edukasi</li>
      <li>Sepotong kecil kapas kering, serat char-cloth, atau tinder/sumbu kering sebagai bahan yang akan dibakar</li>
      <li>Kacamata pelindung (safety goggles) untuk pengamat dan operator</li>
      <li>Ruangan dengan pencahayaan agak redup (memudahkan melihat percikan api singkat yang dihasilkan)</li>
      <li>Alas tahan panas/non-mudah terbakar di bawah alat (jaga-jaga)</li>
      <li>(Opsional) termometer inframerah untuk memperkirakan kenaikan suhu jika tersedia</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Guru/instruktur yang berpengalaman memeriksa kondisi fire piston (perapat piston harus dalam kondisi baik agar udara benar-benar tidak bocor saat dimampatkan).</li>
      <li>Letakkan sepotong kecil kapas/tinder kering di dasar tabung (ujung tertutup).</li>
      <li>Tarik piston keluar hingga posisi awal (udara di dalam tabung pada tekanan dan volume awal, mendekati tekanan atmosfer).</li>
      <li>Redupkan lampu ruangan agar percikan api lebih mudah teramati.</li>
      <li>Dengan sekali hentakan cepat dan kuat (bukan dorongan pelan-pelan), tekan piston masuk sepenuhnya ke dalam tabung, lalu segera amati dasar tabung melalui dinding transparan.</li>
      <li>Amati adanya percikan/kilatan cahaya singkat dan/atau asap tipis di dasar tabung, tanda kapas mulai terbakar akibat panas kompresi.</li>
      <li>Tarik kembali piston perlahan, amati kondisi kapas (biasanya sedikit gosong/berasap).</li>
      <li>Ulangi 2-3 kali dengan kapas baru untuk memastikan hasil konsisten, dan bandingkan hasil hentakan cepat dengan dorongan lambat (lihat Pertanyaan Diskusi).</li>
    </ol>

    <h4>Tabel Pengamatan (kualitatif, isi dengan hasil percobaanmu)</h4>
    <table>
      <tr><th>Percobaan ke-</th><th>Kecepatan dorongan piston</th><th>Ada percikan api/asap?</th><th>Kondisi kapas setelahnya</th></tr>
      <tr><td>1</td><td>Cepat (hentakan)</td><td></td><td></td></tr>
      <tr><td>2</td><td>Cepat (hentakan)</td><td></td><td></td></tr>
      <tr><td>3</td><td>Lambat (didorong pelan)</td><td></td><td></td></tr>
    </table>

    <h4>Analisis</h4>
    <ul>
      <li>Pada hentakan cepat, proses mendekati adiabatik ($q \\approx 0$) karena waktu terlalu singkat bagi kalor untuk merambat keluar melalui dinding tabung, sehingga seluruh kerja $w$ (yang bertanda positif karena udara dimampatkan) langsung menjadi kenaikan energi dalam: $\\Delta U = w$.</li>
      <li>Pada dorongan lambat, sebagian besar kalor yang dihasilkan sempat merambat keluar ($q$ bertanda negatif, mengurangi kenaikan $\\Delta U$ meskipun $w$ tetap positif), sehingga suhu akhir udara jauh lebih rendah dan biasanya tidak cukup untuk membakar kapas. Ini menunjukkan pentingnya syarat "cepat" agar proses mendekati adiabatik sungguhan.</li>
      <li>Estimasi kasar: dengan rasio kompresi tinggi ($V_1/V_2 \\approx 20$-$25$), model gas ideal adiabatik memprediksi kenaikan suhu dari sekitar 20°C menjadi lebih dari 250°C, jauh melebihi titik nyala kapas kering (sekitar 200°C), sehingga penyalaan dapat terjadi meski hanya berlangsung sepersekian detik.</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li><strong>Wajib memakai kacamata pelindung</strong> - meskipun nyala api sangat kecil dan singkat, percikan atau pecahan alat (jika perapat/tabung rusak) berisiko mengenai mata.</li>
      <li>Demonstrasi ini sebaiknya <strong>dilakukan oleh guru/instruktur atau di bawah pengawasan langsung</strong>, bukan dicoba bebas oleh siswa tanpa supervisi, karena membutuhkan teknik hentakan yang benar agar aman dan alat tidak rusak.</li>
      <li>Jauhkan segala bahan mudah terbakar (kertas, alkohol, gas, rambut/pakaian longgar) dari area demonstrasi.</li>
      <li>Lakukan di ruangan dengan ventilasi cukup; meskipun asap yang dihasilkan sangat sedikit, hindari menghirupnya dari jarak dekat berulang kali.</li>
      <li>Periksa kondisi fisik tabung kaca sebelum digunakan (retak/gores dapat pecah akibat tekanan mendadak); jangan gunakan alat yang tampak rusak.</li>
      <li>Setelah demonstrasi, pastikan kapas yang terbakar benar-benar padam sebelum dibuang.</li>
    </ul>

    <h4>Sumber Kesalahan/Keterbatasan</h4>
    <ul>
      <li>Proses ini tidak benar-benar 100% adiabatik ($q$ tidak persis nol) - selalu ada sedikit kalor yang merambat keluar lewat dinding tabung, terutama jika hentakan kurang cepat atau tabung sudah hangat dari percobaan sebelumnya.</li>
      <li>Kekuatan dan kecepatan hentakan berbeda-beda antar orang, sehingga hasil (berhasil menyala atau tidak) tidak selalu konsisten - ini adalah demonstrasi kualitatif, bukan pengukuran presisi.</li>
      <li>Kelembapan kapas/tinder yang dipakai sangat memengaruhi keberhasilan penyalaan (kapas lembap sulit terbakar meski suhu sudah cukup tinggi).</li>
      <li>Kebocoran kecil di sekitar perapat piston (jika sudah aus) mengurangi rasio kompresi efektif, menurunkan kenaikan suhu yang dicapai.</li>
    </ul>

    <h4>Alternatif: Metode Pemanasan Listrik untuk Kapasitas Kalor Jenis (Kuantitatif, Volume Tetap)</h4>
    <p>Fire piston hanya memberi bukti <strong>kualitatif</strong> bahwa kerja dapat menaikkan energi dalam
    tanpa kalor (kasus $q=0$). Untuk melengkapi dengan bukti <strong>kuantitatif</strong> hukum pertama pada
    kasus sebaliknya ($w=0$, volume tetap, sehingga $\\Delta U = q$ langsung), lakukan praktikum standar
    menentukan <strong>kapasitas kalor jenis padatan dengan metode pemanasan listrik</strong>:</p>
    <ol>
      <li>Timbang massa $m$ sebuah blok logam (misalnya aluminium atau tembaga) yang punya dua lubang: satu untuk elemen pemanas listrik, satu untuk termometer (diberi sedikit oli agar kontak termal baik).</li>
      <li>Pasang elemen pemanas dan termometer pada lubangnya masing-masing. Karena blok padatan praktis tidak memuai secara berarti, <strong>tidak ada kerja mekanik yang dilakukan gas terhadap lingkungan</strong> ($w \\approx 0$).</li>
      <li>Catat suhu awal $\\theta_1$. Alirkan arus listrik $I$ pada tegangan $V$ yang diketahui selama waktu $t$ (diukur stopwatch), sehingga energi listrik yang diberikan adalah $q = VIt$.</li>
      <li>Catat suhu akhir $\\theta_2$ segera setelah pemanas dimatikan (agar kalor yang sempat hilang ke lingkungan minimal).</li>
      <li>Karena $w=0$, hukum pertama memberi $\\Delta U = q = VIt$. Karena $\\Delta U = mc\\Delta\\theta$ untuk padatan, kapasitas kalor jenis dapat dihitung: $c = \\dfrac{VIt}{m(\\theta_2-\\theta_1)}$.</li>
      <li>Untuk hasil yang lebih akurat, ulangi dengan blok terisolasi (dibungkus wol/gabus) untuk meminimalkan kalor yang hilang ke udara sekitar, dan bandingkan nilai $c$ yang diperoleh dengan nilai referensi (misalnya aluminium $\\approx 900$ J kg⁻¹ K⁻¹, tembaga $\\approx 385$ J kg⁻¹ K⁻¹).</li>
    </ol>
    <p class="muted">Perhatikan bagaimana kedua eksperimen ini saling melengkapi: fire piston menunjukkan kasus
    $q=0 \\Rightarrow \\Delta U = w$ (adiabatik), sedangkan metode pemanasan listrik pada padatan menunjukkan
    kasus $w=0 \\Rightarrow \\Delta U = q$ (volume tetap) - dua kasus khusus dari hukum pertama termodinamika
    yang sama.</p>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Mengapa fire piston hanya berhasil menyalakan kapas jika piston ditekan <strong>dengan cepat</strong>, bukan perlahan-lahan? Kaitkan jawabanmu dengan nilai $q$ pada kedua kasus.</li>
      <li>Pada fire piston, apakah $\\Delta U$ yang dihasilkan berasal dari kalor atau dari kerja? Jelaskan dengan hukum pertama termodinamika, lengkap dengan tanda tiap suku.</li>
      <li>Jika fire piston ditekan lalu dibiarkan diam (piston tidak dilepas) selama beberapa menit sebelum ditarik keluar, apa yang akan terjadi pada suhu udara di dalamnya, dan mengapa?</li>
      <li>Pada eksperimen alternatif (pemanasan listrik blok logam), mengapa penting mencatat suhu akhir <em>segera</em> setelah pemanas dimatikan, bukan menunggu beberapa menit?</li>
    </ul>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://en.wikipedia.org/wiki/Fire_piston" target="_blank" rel="noopener">Fire piston, Wikipedia (latar belakang sejarah dan prinsip kerja)</a></li>
      <li><a href="https://www.physics.purdue.edu/demos/display_page.php?item=3E-03" target="_blank" rel="noopener">Fire Syringe Demo (3E-03), Purdue University Physics Lecture Demonstrations</a></li>
      <li><a href="https://www.isu.edu/physics/outreach/physics-class-demos/thermodynamics/fire-syringe/" target="_blank" rel="noopener">Fire Syringe, Idaho State University Physics Outreach</a></li>
      <li><a href="https://web.physics.ucsb.edu/~lecturedemonstrations/Composer/Pages/52.24.html" target="_blank" rel="noopener">52.24 - Fire syringe, UC Santa Barbara Lecture Demonstrations</a></li>
      <li><a href="https://spark.iop.org/episode-607-specific-heat-capacity" target="_blank" rel="noopener">Episode 607: Specific heat capacity (metode elektrik), IOPSpark</a></li>
    </ul>
  `
};

/* type: "mcq" atau "structured".
   Untuk mcq: options[] dan correct = index jawaban benar.
   Konvensi Cambridge 9702: delta U = q + w, q = kalor DITERIMA sistem, w = kerja DILAKUKAN PADA sistem. */
const THERMODYNAMICS_LATIHAN = [
  {
    type: "mcq",
    question: "Suatu gas dimampatkan oleh sebuah piston sehingga menerima kerja sebesar 180 J dari lingkungan. Pada saat yang sama, gas tersebut juga menerima kalor sebesar 60 J. Berapakah perubahan energi dalam gas $\\Delta U$?",
    options: ["120 J", "180 J", "240 J", "300 J"],
    correct: 2,
    solution: `Gas menerima kerja (dimampatkan) sehingga menurut konvensi Cambridge $w$ bertanda positif: $w = +180~\\text{J}$.
    <br>Gas juga menerima kalor sehingga $q$ bertanda positif: $q = +60~\\text{J}$.
    <br>Dengan hukum pertama termodinamika: $\\Delta U = q + w = 60 + 180 = 240~\\text{J}$.
    <br>Kedua suku positif (gas menerima kalor DAN menerima kerja) sehingga energi dalam gas jelas bertambah, sesuai jawaban <strong>240 J</strong>.`
  },
  {
    type: "mcq",
    question: "Suatu gas mengalami proses adiabatik (tidak ada kalor yang masuk atau keluar sistem). Selama proses ini gas memuai dan melakukan kerja sebesar 95 J terhadap lingkungan. Berapakah perubahan energi dalam gas $\\Delta U$?",
    options: ["-95 J", "+95 J", "0 J", "-190 J"],
    correct: 0,
    solution: `Proses adiabatik berarti $q = 0$ (tidak ada perpindahan kalor sama sekali).
    <br>Gas <em>memuai</em> dan melakukan kerja PADA lingkungan (bukan menerima kerja), sehingga menurut konvensi Cambridge, kerja yang dilakukan PADA gas bertanda negatif: $w = -95~\\text{J}$.
    <br>$\\Delta U = q + w = 0 + (-95) = -95~\\text{J}$.
    <br>Energi dalam gas berkurang 95 J - gas menggunakan energi dalamnya sendiri untuk melakukan kerja mendorong lingkungan, karena tidak ada kalor yang masuk untuk menggantikannya. Ini adalah prinsip pendinginan adiabatik.`
  },
  {
    type: "structured",
    question: "Sejumlah gas dimampatkan secara adiabatik oleh sebuah piston. Piston melakukan kerja sebesar $3{,}4\\times10^{2}$ J pada gas selama proses ini. (a) Nyatakan nilai q untuk proses ini, disertai alasan. (b) Hitung perubahan energi dalam gas $\\Delta U$. (c) Apa yang terjadi pada suhu gas? Jelaskan menggunakan konsep energi dalam gas ideal.",
    solution: `<strong>(a)</strong> Proses adiabatik berarti sistem tidak bertukar kalor dengan lingkungan sama sekali, sehingga $q = 0$.
    <br><strong>(b)</strong> Gas dimampatkan (menerima kerja dari piston), sehingga $w = +3{,}4\\times10^{2}~\\text{J}$ (positif, sesuai konvensi Cambridge: kerja pada gas saat kompresi bertanda positif).
    <br>$\\Delta U = q + w = 0 + 3{,}4\\times10^{2} = 3{,}4\\times10^{2}~\\text{J}$ (energi dalam bertambah 340 J).
    <br><strong>(c)</strong> Untuk gas ideal, energi dalam sepenuhnya berupa energi kinetik molekul (energi potensial antarmolekul diabaikan), dan energi kinetik rata-rata molekul berbanding lurus dengan suhu mutlak. Karena $\\Delta U$ positif (energi dalam bertambah), maka <strong>suhu gas naik</strong>.`
  },
  {
    type: "structured",
    question: "Sebuah blok tembaga bermassa 0,20 kg (kapasitas kalor jenis tembaga $c = 385~\\text{J kg}^{-1}\\text{K}^{-1}$) dipanaskan secara elektrik di dalam wadah kaku yang tertutup rapat, sehingga volumenya tidak berubah selama pemanasan. Pemanas listrik memberikan energi sebesar 770 J kepada blok tersebut. (a) Jelaskan mengapa $w = 0$ untuk proses ini. (b) Gunakan hukum pertama termodinamika untuk menentukan $\\Delta U$ blok tembaga. (c) Hitung kenaikan suhu blok tembaga tersebut.",
    solution: `<strong>(a)</strong> Karena wadah kaku dan tertutup rapat, volume blok (dan udara di sekitarnya di dalam wadah) tidak berubah ($\\Delta V = 0$). Tidak ada piston/permukaan yang berpindah sehingga tidak ada kerja mekanik yang dilakukan pada atau oleh sistem: $w = 0$.
    <br><strong>(b)</strong> Energi listrik yang diberikan pemanas adalah kalor yang diterima sistem, sehingga $q = +770~\\text{J}$.
    <br>Dengan $w = 0$: $\\Delta U = q + w = 770 + 0 = 770~\\text{J}$.
    <br><strong>(c)</strong> Karena volume tetap (tidak ada kerja), seluruh energi ini menaikkan suhu blok padat sesuai $\\Delta U = mc\\Delta\\theta$:
    <br>$\\Delta\\theta = \\dfrac{\\Delta U}{mc} = \\dfrac{770}{0{,}20 \\times 385} = \\dfrac{770}{77{,}0} = 10{,}0~\\text{K}$.
    <br>Jadi suhu blok tembaga naik sebesar <strong>10,0 K (atau 10,0°C)</strong>.`
  },
  {
    type: "structured",
    question: "Gas di dalam sebuah silinder dimampatkan oleh piston sehingga volumenya berkurang. Selama proses kompresi ini, gas melepaskan kalor sebesar 25 J ke lingkungan sekitarnya, sementara piston melakukan kerja sebesar 60 J pada gas. (a) Tentukan tanda (positif/negatif) dari q dan w untuk proses ini, disertai alasannya. (b) Hitung perubahan energi dalam gas $\\Delta U$. (c) Apakah energi dalam gas bertambah atau berkurang?",
    solution: `<strong>(a)</strong> Gas <em>melepaskan</em> kalor (kalor meninggalkan sistem menuju lingkungan), sehingga menurut konvensi Cambridge $q$ bertanda <strong>negatif</strong>: $q = -25~\\text{J}$.
    <br>Piston melakukan kerja PADA gas (gas dimampatkan, menerima kerja dari luar), sehingga $w$ bertanda <strong>positif</strong>: $w = +60~\\text{J}$.
    <br><strong>(b)</strong> $\\Delta U = q + w = (-25) + (+60) = +35~\\text{J}$.
    <br><strong>(c)</strong> Karena $\\Delta U$ bertanda positif, energi dalam gas <strong>bertambah</strong> sebesar 35 J - meskipun gas kehilangan sebagian energi lewat pelepasan kalor, kerja yang diterimanya dari piston jauh lebih besar sehingga secara total energi dalamnya tetap naik.`
  },
  {
    type: "structured",
    question: "Gas ideal berada dalam silinder berpiston pada tekanan tetap $2{,}0\\times10^{5}$ Pa. Gas tersebut dipanaskan sehingga volumenya bertambah dari $3{,}0\\times10^{-4}$ m³ menjadi $5{,}0\\times10^{-4}$ m³, sementara total kalor sebesar 90 J diberikan pada gas selama proses ini. (a) Hitung besar kerja yang dilakukan OLEH gas terhadap lingkungan selama pemuaian ini. (b) Nyatakan nilai w (kerja pada gas, sesuai konvensi hukum pertama termodinamika) untuk proses ini, disertai alasan tandanya. (c) Hitung perubahan energi dalam gas $\\Delta U$.",
    solution: `<strong>(a)</strong> Karena tekanan tetap, kerja yang dilakukan gas terhadap lingkungan dihitung dari luas di bawah grafik $p$-$V$ (persegi panjang):
    <br>$\\Delta V = (5{,}0-3{,}0)\\times10^{-4} = 2{,}0\\times10^{-4}~\\text{m}^3$.
    <br>$W_{\\text{oleh gas}} = p\\,\\Delta V = (2{,}0\\times10^{5})(2{,}0\\times10^{-4}) = 40~\\text{J}$.
    <br><strong>(b)</strong> Karena gas <em>memuai</em> (melakukan kerja PADA lingkungan, bukan menerima kerja), kerja yang dilakukan PADA gas bertanda negatif: $w = -40~\\text{J}$.
    <br><strong>(c)</strong> Kalor diberikan pada gas sehingga $q = +90~\\text{J}$.
    <br>$\\Delta U = q + w = 90 + (-40) = +50~\\text{J}$.
    <br>Energi dalam gas bertambah 50 J: dari 90 J kalor yang diberikan, 40 J dipakai gas untuk melakukan kerja mendorong piston keluar, sisanya (50 J) menjadi pertambahan energi dalam gas.`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & konvensi tanda yang sudah diverifikasi dari syllabus resmi Cambridge 9702,
   bukan menebak dari pengetahuan umum (banyak buku teks memakai konvensi tanda
   yang BERBEDA/terbalik, jadi ini WAJIB dipatuhi persis). */
const THERMODYNAMICS_FORMULA_SHEET = `
- Energi dalam U = jumlah energi kinetik acak + energi potensial acak seluruh molekul dalam sistem.
  U BUKAN sama dengan suhu: suhu hanya terkait energi kinetik rata-rata molekul; U juga mencakup energi potensial antarmolekul (mis. berubah saat perubahan wujud pada suhu tetap).
  Untuk gas ideal, energi potensial antarmolekul diabaikan, sehingga U gas ideal sepenuhnya berupa energi kinetik dan sebanding dengan suhu mutlak.
- Kerja pada tekanan tetap: W = p * delta_V. Secara umum, kerja = luas daerah di bawah kurva pada grafik p-V.
  Gas memuai (delta_V > 0) -> gas melakukan kerja PADA lingkungan. Gas dimampatkan (delta_V < 0) -> lingkungan melakukan kerja PADA gas.
- KONVENSI TANDA RESMI CAMBRIDGE 9702 (WAJIB, jangan dibalik): Hukum pertama termodinamika: delta U = q + w
  * delta U = perubahan energi dalam sistem. Positif jika energi dalam BERTAMBAH.
  * q = kalor yang DITERIMA sistem (energi berpindah ke sistem melalui pemanasan). Positif jika kalor MASUK ke sistem (dipanaskan). Negatif jika sistem MELEPASKAN kalor ke lingkungan.
  * w = kerja yang DILAKUKAN PADA sistem/gas. Positif jika gas DIMAMPATKAN (menerima kerja dari luar). Negatif jika gas MEMUAI (melakukan kerja pada lingkungan, bukan menerima kerja).
  * PERINGATAN: ini BERBEDA dari konvensi fisika klasik/kimia delta U = Q - W (W = kerja OLEH sistem). Cambridge 9702 SELALU pakai delta U = q + w dengan w = kerja PADA sistem. Jangan pernah membalik tanda w.
- Kasus khusus volume tetap (isokhorik): delta_V = 0 sehingga w = 0, maka delta U = q secara langsung.
  Untuk padatan/zat cair yang dipanaskan (pemuaian diabaikan, w kira-kira 0): delta U = q = m c delta_theta (c = kapasitas kalor jenis, lihat topik Temperature).
- Kasus khusus adiabatik: tidak ada kalor berpindah (isolasi termal sempurna, atau proses sangat cepat) sehingga q = 0, maka delta U = w secara langsung.
  Contoh: fire piston/fire syringe - kompresi udara sangat cepat (mendekati adiabatik, q kira-kira 0) menaikkan suhu udara drastis (delta U = w > 0 besar) hingga bisa menyalakan kapas kering.
  Contoh lain: ekspansi adiabatik (gas memuai tanpa menerima kalor, w negatif, q=0) menyebabkan delta U negatif, gas menjadi dingin (pendinginan adiabatik).
- Nilai standar g = 9.81 m/s^2 dan konstanta gas R = 8.31 J/(mol K) dipakai jika relevan pada soal gas ideal terkait, kecuali diminta lain oleh pengguna.
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const THERMODYNAMICS_LAB_CONCEPTS = [
  "Energi Dalam (Internal Energy) sebagai Jumlah EK dan EP Molekul",
  "Kerja pada Gas: W = p delta V dan Luas di Bawah Grafik p-V",
  "Hukum Pertama Termodinamika: delta U = q + w (Konvensi Tanda Cambridge)",
  "Proses Volume Tetap (Isokhorik): w = 0, delta U = q",
  "Proses Adiabatik: q = 0, delta U = w (Pendinginan/Pemanasan Adiabatik)",
  "Identifikasi Tanda q dan w dari Deskripsi Proses Termodinamika",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

/* Tempelkan konten lengkap ke objek topik "thermodynamics" */

/* ---- English (_EN) translations for THERMODYNAMICS (auto-merged by merge_i18n.py) ---- */
/* ------------------------------------------------------------
   English translation of THERMODYNAMICS topic content
   (Cambridge International AS & A Level Physics 9702)
   ------------------------------------------------------------ */

const THERMODYNAMICS_DESC_EN = "Internal energy, the first law of thermodynamics.";

const THERMODYNAMICS_MATERI_EN = `
<h3>1. Internal Energy</h3>
<p>The <strong>internal energy</strong> $U$ of a system (for example, a quantity of gas) is defined as
<strong>the sum of the random kinetic energy and random potential energy of all the molecules</strong> in the
system, arising from the disordered motion and arrangement of the molecules.</p>
<div class="formula-box">$$U = \\sum(\\text{KE of molecules}) + \\sum(\\text{PE of molecules})$$</div>
<ul>
  <li><strong>Molecular kinetic energy</strong> arises from the translational motion (and, for polyatomic
  molecules, also rotational/vibrational motion) of randomly moving molecules. This component is directly
  related to the absolute temperature of the gas.</li>
  <li><strong>Molecular potential energy</strong> arises from the attractive/repulsive forces between
  molecules (intermolecular forces). For an ideal gas, intermolecular forces are assumed to be negligible, so
  this potential energy is taken to be zero.</li>
</ul>
<p class="muted"><strong>Internal energy is NOT the same as temperature.</strong> Temperature is related only
to the average kinetic energy of the molecules (see the Ideal Gases topic: $\\tfrac12 m\\overline{c^2} \\propto T$).
Internal energy includes kinetic energy <em>and</em> the total potential energy of all the molecules. For
example: when ice melts into water at a constant temperature of 0°C, the temperature (and hence the average
kinetic energy of the molecules) does not change, but the internal energy still increases because the latent
heat absorbed is used to change the arrangement/spacing between molecules, so their molecular potential energy
increases. For an <strong>ideal gas</strong> alone (since its intermolecular potential energy is zero), the
internal energy is entirely kinetic energy, so the change in internal energy of an ideal gas is directly
proportional to the change in its absolute temperature.</p>

<h3>2. Work Done on/by a Gas</h3>
<p>When a gas expands or is compressed by a piston, energy is transferred in the form of mechanical work. For
a gas at <strong>constant pressure</strong> $p$ whose volume changes by $\\Delta V$, the magnitude of the work
involved is:</p>
<div class="formula-box">$$W = p\\,\\Delta V$$</div>
<p>More generally (the pressure need not be constant), the magnitude of the work done in a process is equal to
<strong>the area under the curve on a $p$-$V$ graph</strong> between the initial and final volumes; the
formula $W = p\\Delta V$ is simply the special case where the curve is a horizontal line (constant pressure),
so the area forms a rectangle.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/29/P-V_diagram_work_closed_system.svg",
    alt: "Pressure against volume graph showing the shaded area as the work done by a gas",
    caption: "$p$-$V$ graph for a gas expanding in a closed system: the area under the curve (shaded) equals the magnitude of the work involved in the process.",
    author: "Olivier Cleynen", license: "CC0 (Public Domain)" },
  { id: "Xcrco59p40o", title: "PV diagrams - part 1: Work and isobaric processes",
    channel: "Khan Academy", desc: "Explains how to calculate work from a p-V graph, including the special case of an isobaric (constant-pressure) process, W = p ΔV." }
)}
<p>It is important to distinguish the <strong>direction</strong> of this energy transfer:</p>
<ul>
  <li>When a gas <strong>expands</strong> ($\\Delta V > 0$), pushing the piston outward, the gas <strong>does
  work on the surroundings</strong> (energy leaves the gas as work).</li>
  <li>When a gas <strong>is compressed</strong> ($\\Delta V < 0$) by a piston pushed in from outside, the
  surroundings <strong>do work on the gas</strong> (energy enters the gas as work).</li>
</ul>
<p class="muted">This distinction is crucial in determining the sign (+/-) of the work term $w$ in the first
law of thermodynamics in the next section — pay close attention to the sign convention used by Cambridge
9702.</p>

<h3>3. The First Law of Thermodynamics</h3>
<p>The first law of thermodynamics is a statement of <strong>the law of conservation of energy</strong>
applied to a thermodynamic system (for example, a quantity of enclosed gas). In accordance with the official
Cambridge International AS &amp; A Level Physics 9702 <em>syllabus</em>, this law is written as:</p>
<div class="formula-box">$$\\Delta U = q + w$$</div>
<p><strong>Definitions of the terms according to the Cambridge 9702 convention (important, memorise
exactly):</strong></p>
<table>
  <tr><th>Symbol</th><th>Meaning</th><th>POSITIVE when&hellip;</th><th>NEGATIVE when&hellip;</th></tr>
  <tr><td>$\\Delta U$</td><td>Change in the internal energy of the system</td><td>The internal energy of the system <strong>increases</strong></td><td>The internal energy of the system <strong>decreases</strong></td></tr>
  <tr><td>$q$</td><td>Heat <strong>received</strong> by the system (energy transferred to the system by heating)</td><td>Heat <strong>enters</strong> the system (the system is heated)</td><td>Heat <strong>leaves</strong> the system (the system releases heat to the surroundings)</td></tr>
  <tr><td>$w$</td><td>Work done <strong>on</strong> the system/gas</td><td>The gas <strong>is compressed</strong> (the surroundings do work on the gas)</td><td>The gas <strong>expands</strong> (the gas does work on the surroundings)</td></tr>
</table>
<p class="muted"><strong>Important warning:</strong> some textbooks (especially older chemistry/engineering
texts) use the classical physics convention $\\Delta U = Q - W$, where $W$ = work done <em>by</em> the system.
Cambridge 9702 does <strong>NOT</strong> use that convention. Always use $\\Delta U = q + w$ with $w$ = work
done <em>on</em> the system, as given in the Cambridge data sheet and <em>syllabus</em>, so that the sign of
the work term is never mixed up when working through problems or answering exam questions.</p>

<p><strong>Qualitative examples of applying the signs:</strong></p>
<ul>
  <li>A gas is compressed (receiving work, $w > 0$) <em>while also</em> being heated (receiving heat,
  $q > 0$) &rarr; both terms are positive &rarr; $\\Delta U$ clearly increases (a large positive value).</li>
  <li>A gas expands, doing work on the surroundings, without receiving any heat at all ($q = 0$, an
  <strong>adiabatic</strong> process) &rarr; $w < 0$ and $q = 0$ &rarr; $\\Delta U = w < 0$, the internal
  energy <strong>decreases</strong>, so the temperature of the gas falls. This is the principle behind
  <strong>adiabatic cooling</strong> (for example: air that rises and expands in the atmosphere becomes
  cooler).</li>
</ul>
${mediaRow(
  null,
  { id: "Xb05CaG7TsQ", title: "First law of thermodynamics / internal energy",
    channel: "Khan Academy", desc: "An introduction to the first law of thermodynamics ΔU = Q + W and an explanation of internal energy as the sum of the kinetic and potential energy of molecules." }
)}

<h3>4. Special Cases: Constant Volume and Adiabatic Processes</h3>
<table>
  <tr><th>Case</th><th>Condition</th><th>Consequence for the first law</th></tr>
  <tr><td><strong>Constant volume (isochoric)</strong></td><td>The gas is in a rigid/tightly sealed container, with no change in volume ($\\Delta V = 0$)</td><td>$w = 0$ (no work is done because no piston moves), so $\\Delta U = q$: all the heat received directly becomes an increase in internal energy.</td></tr>
  <tr><td><strong>Adiabatic</strong></td><td>The system is thermally isolated (no heat enters or leaves), or the change happens so rapidly that there is no time for heat to be transferred</td><td>$q = 0$, so $\\Delta U = w$: the entire change in internal energy comes purely from the work done on/by the gas.</td></tr>
</table>
<p>This constant-volume case ($\\Delta U = q$) is the theoretical basis for why heat measurements made in a
constant-volume process (for example, heating a solid/liquid in a rigid container) can be used directly to
determine the <strong>specific heat capacity</strong> (see the Temperature topic): $q = mc\\Delta\\theta$, and
since $w \\approx 0$ for solids/liquids (their expansion is negligible), $\\Delta U = q = mc\\Delta\\theta$
directly.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/58/Fire_piston.jpg",
    alt: "A fire piston, a glass tube with a piston that compresses air adiabatically until it ignites tinder",
    caption: "Fire piston: a small piece of cotton/tinder inside a transparent tube ignites from the heat generated by very rapid compression of air (close to adiabatic, $q \\approx 0$), so $\\Delta U = w$ is large enough to raise the air temperature to its ignition point.",
    author: "Chocolateoak", license: "CC BY-SA 3.0 / GFDL" },
  { id: "6sP3kV-zgZk", title: "First law of thermodynamics problem solving",
    channel: "Khan Academy", desc: "Practice applying the first law of thermodynamics ΔU = q + w to various problem cases, including constant-volume and adiabatic processes." }
)}

<h3>5. Numerical Example: Applying $\\Delta U = q + w$</h3>
<p><strong>Question:</strong> An ideal gas in a piston-cylinder arrangement is at a constant pressure of
$2{,}0\\times10^{5}$ Pa. The gas is heated so that its volume increases from $3{,}0\\times10^{-4}$ m³ to
$5{,}0\\times10^{-4}$ m³, while a total of 90 J of heat is supplied to the gas. Determine the change in
internal energy of the gas.</p>
<p><strong>Solution:</strong></p>
<p>Step 1 - calculate the magnitude of the work done <em>by</em> the gas on the surroundings as it expands at
constant pressure:</p>
<div class="formula-box">$$\\Delta V = (5{,}0-3{,}0)\\times10^{-4} = 2{,}0\\times10^{-4}~\\text{m}^3$$
$$W_{\\text{by gas}} = p\\,\\Delta V = (2{,}0\\times10^{5})(2{,}0\\times10^{-4}) = 40~\\text{J}$$</div>
<p>Step 2 - because the gas <em>expands</em> (doing work on the surroundings), the work done <strong>on</strong>
the gas ($w$, following the Cambridge convention) is <strong>negative</strong>:</p>
<div class="formula-box">$$w = -40~\\text{J}$$</div>
<p>Step 3 - heat is supplied <em>to</em> the gas, so $q$ is positive: $q = +90$ J. Apply the first law of
thermodynamics:</p>
<div class="formula-box">$$\\Delta U = q + w = (+90) + (-40) = +50~\\text{J}$$</div>
<p>So the internal energy of the gas <strong>increases by 50 J</strong>. This makes sense: of the 90 J of heat
supplied, 40 J is "used" by the gas to do work pushing the piston outward, while the remainder (50 J) is
retained as an increase in internal energy (raising the temperature of the gas).</p>
`;

const THERMODYNAMICS_EKSPERIMEN_EN = {
  title: "Real Experiment: Fire Piston (Compression Fire Starter) - Demonstrating the First Law of Thermodynamics",
  intro: `
    <p class="muted">This is a genuine physical experiment/demonstration using real apparatus (a fire
    piston/fire syringe), not a computer simulation. This demonstration is a classic one widely used in
    university physics laboratories and school physics equipment collections to show an adiabatic process in
    a real and dramatic way. If a fire piston is not available at your school, see the
    <strong>Alternative</strong> section below, which gives a quantitative version using ordinary electrical
    heating apparatus.</p>

    <h4>Objective</h4>
    <p>To observe and qualitatively explain how the very rapid compression of air can significantly raise its
    temperature (a process close to adiabatic), as a direct application of the first law of thermodynamics
    $\\Delta U = q + w$ in the case $q \\approx 0$.</p>

    <h4>Basic Concept</h4>
    <p>A fire piston is a glass/metal cylindrical tube closed at one end, with a tightly fitting piston at the
    other end. If the piston is pushed into the tube <strong>very rapidly</strong> (a single strong hand
    thrust), the air inside the tube is compressed in a very short time, so <strong>there is not enough time
    for heat to transfer out</strong> through the walls of the tube. This process is close to an
    <strong>adiabatic</strong> process ($q \\approx 0$), so the first law of thermodynamics becomes:</p>
    <div class="formula-box">$$\\Delta U = q + w \\approx 0 + w = w$$</div>
    <p>Because the piston does work <em>on</em> the air (compressing it, $\\Delta V < 0$), $w$ is
    <strong>positive</strong> and fairly large (a human hand thrust can compress air to a compression ratio of
    20:1 or more in less than 0.1 seconds). As a result $\\Delta U$ is also large and positive, drastically
    raising the temperature of the air inside the tube (which can exceed 250-300°C) almost instantly - hot
    enough to ignite a small piece of dry cotton/fibre (tinder) placed at the bottom of the tube, producing a
    brief flash of flame. This is the same physical principle used in diesel engines to ignite fuel without a
    spark plug.</p>

    <h4>Apparatus &amp; Materials</h4>
    <ul>
      <li>Fire piston / fire syringe (a transparent glass or metal cylinder with a rubber/leather-sealed piston at one end) - a fairly common piece of physics demonstration equipment available as an educational tool</li>
      <li>A small piece of dry cotton wool, char-cloth fibre, or dry tinder/wick as the material to be ignited</li>
      <li>Safety goggles for both observers and the operator</li>
      <li>A room with somewhat dim lighting (to make the brief flash of flame easier to see)</li>
      <li>A heat-resistant/non-flammable mat under the apparatus (as a precaution)</li>
      <li>(Optional) an infrared thermometer to estimate the temperature rise, if available</li>
    </ul>

    <h4>Procedure</h4>
    <ol>
      <li>An experienced teacher/instructor checks the condition of the fire piston (the piston seal must be in good condition so that air does not leak out during compression).</li>
      <li>Place a small piece of dry cotton wool/tinder at the bottom of the tube (the closed end).</li>
      <li>Pull the piston out to its starting position (the air inside the tube is at its initial pressure and volume, close to atmospheric pressure).</li>
      <li>Dim the room lights so the flash of flame is easier to observe.</li>
      <li>With a single fast, strong thrust (not a slow, gradual push), push the piston fully into the tube, then immediately observe the bottom of the tube through the transparent wall.</li>
      <li>Observe for a brief flash/spark of light and/or a thin wisp of smoke at the bottom of the tube, a sign that the cotton has begun to burn from the heat of compression.</li>
      <li>Slowly pull the piston back out and examine the condition of the cotton (usually slightly charred/smoking).</li>
      <li>Repeat 2-3 times with fresh cotton to check that the result is consistent, and compare the result of a fast thrust with a slow push (see Discussion Questions).</li>
    </ol>

    <h4>Observation Table (qualitative, fill in with your own experimental results)</h4>
    <table>
      <tr><th>Trial no.</th><th>Speed of piston thrust</th><th>Flame/smoke observed?</th><th>Condition of cotton afterward</th></tr>
      <tr><td>1</td><td>Fast (thrust)</td><td></td><td></td></tr>
      <tr><td>2</td><td>Fast (thrust)</td><td></td><td></td></tr>
      <tr><td>3</td><td>Slow (gradual push)</td><td></td><td></td></tr>
    </table>

    <h4>Analysis</h4>
    <ul>
      <li>With a fast thrust, the process is close to adiabatic ($q \\approx 0$) because there is too little time for heat to conduct out through the walls of the tube, so all the work $w$ (which is positive because the air is compressed) directly becomes an increase in internal energy: $\\Delta U = w$.</li>
      <li>With a slow push, most of the heat generated has time to conduct out ($q$ is negative, reducing the increase in $\\Delta U$ even though $w$ remains positive), so the final air temperature is much lower and is usually not enough to ignite the cotton. This shows the importance of the "fast" condition for the process to be genuinely close to adiabatic.</li>
      <li>Rough estimate: with a high compression ratio ($V_1/V_2 \\approx 20$-$25$), the adiabatic ideal-gas model predicts a temperature rise from around 20°C to over 250°C, well above the ignition point of dry cotton (around 200°C), so ignition can occur even though it lasts only a fraction of a second.</li>
    </ul>

    <h4>Safety Precautions</h4>
    <ul>
      <li><strong>Safety goggles must be worn</strong> - even though the flame is very small and brief, sparks or fragments from the apparatus (if the seal/tube is damaged) could risk hitting the eyes.</li>
      <li>This demonstration should be <strong>carried out by a teacher/instructor or under direct supervision</strong>, not attempted freely by students without supervision, since it requires the correct thrusting technique to remain safe and to avoid damaging the apparatus.</li>
      <li>Keep all flammable materials (paper, alcohol, gas, loose hair/clothing) away from the demonstration area.</li>
      <li>Carry out the demonstration in a well-ventilated room; although very little smoke is produced, avoid repeatedly inhaling it at close range.</li>
      <li>Check the physical condition of the glass tube before use (cracks/scratches can cause it to shatter under sudden pressure); do not use apparatus that appears damaged.</li>
      <li>After the demonstration, make sure the burnt cotton is completely extinguished before disposal.</li>
    </ul>

    <h4>Sources of Error/Limitations</h4>
    <ul>
      <li>This process is not truly 100% adiabatic ($q$ is not exactly zero) - there is always a small amount of heat that conducts out through the walls of the tube, especially if the thrust is not fast enough or the tube is already warm from a previous trial.</li>
      <li>The strength and speed of the thrust varies from person to person, so the outcome (successful ignition or not) is not always consistent - this is a qualitative demonstration, not a precision measurement.</li>
      <li>The moisture content of the cotton/tinder used greatly affects the success of ignition (damp cotton is hard to ignite even if the temperature is high enough).</li>
      <li>A small leak around the piston seal (if worn) reduces the effective compression ratio, lowering the temperature rise achieved.</li>
    </ul>

    <h4>Alternative: Electrical Heating Method for Specific Heat Capacity (Quantitative, Constant Volume)</h4>
    <p>The fire piston provides only <strong>qualitative</strong> evidence that work can raise internal energy
    without heat (the case $q=0$). To complement it with <strong>quantitative</strong> evidence for the first
    law in the opposite case ($w=0$, constant volume, so $\\Delta U = q$ directly), carry out the standard
    practical for determining the <strong>specific heat capacity of a solid using the electrical heating
    method</strong>:</p>
    <ol>
      <li>Measure the mass $m$ of a metal block (for example, aluminium or copper) that has two holes: one for an electrical heating element and one for a thermometer (with a little oil added for good thermal contact).</li>
      <li>Insert the heating element and thermometer into their respective holes. Since a solid block practically does not expand significantly, <strong>no mechanical work is done by the block on the surroundings</strong> ($w \\approx 0$).</li>
      <li>Record the initial temperature $\\theta_1$. Pass a current $I$ at a known voltage $V$ through the heater for a time $t$ (measured with a stopwatch), so the electrical energy supplied is $q = VIt$.</li>
      <li>Record the final temperature $\\theta_2$ immediately after the heater is switched off (to minimise heat lost to the surroundings).</li>
      <li>Since $w=0$, the first law gives $\\Delta U = q = VIt$. Since $\\Delta U = mc\\Delta\\theta$ for a solid, the specific heat capacity can be calculated: $c = \\dfrac{VIt}{m(\\theta_2-\\theta_1)}$.</li>
      <li>For a more accurate result, repeat with the block insulated (wrapped in wool/cork) to minimise heat lost to the surrounding air, and compare the value of $c$ obtained with reference values (for example, aluminium $\\approx 900$ J kg⁻¹ K⁻¹, copper $\\approx 385$ J kg⁻¹ K⁻¹).</li>
    </ol>
    <p class="muted">Notice how these two experiments complement each other: the fire piston demonstrates the
    case $q=0 \\Rightarrow \\Delta U = w$ (adiabatic), while the electrical heating method on a solid
    demonstrates the case $w=0 \\Rightarrow \\Delta U = q$ (constant volume) - two special cases of the same
    first law of thermodynamics.</p>

    <h4>Discussion Questions</h4>
    <ul>
      <li>Why does the fire piston only succeed in igniting the cotton when the piston is pushed in <strong>quickly</strong>, not slowly? Relate your answer to the value of $q$ in each case.</li>
      <li>In the fire piston, does the resulting $\\Delta U$ come from heat or from work? Explain using the first law of thermodynamics, including the sign of each term.</li>
      <li>If the fire piston is pushed in and then left held in place (the piston not released) for several minutes before being pulled out, what would happen to the temperature of the air inside, and why?</li>
      <li>In the alternative experiment (electrical heating of a metal block), why is it important to record the final temperature <em>immediately</em> after the heater is switched off, rather than waiting several minutes?</li>
    </ul>

    <h4>References</h4>
    <ul>
      <li><a href="https://en.wikipedia.org/wiki/Fire_piston" target="_blank" rel="noopener">Fire piston, Wikipedia (historical background and working principle)</a></li>
      <li><a href="https://www.physics.purdue.edu/demos/display_page.php?item=3E-03" target="_blank" rel="noopener">Fire Syringe Demo (3E-03), Purdue University Physics Lecture Demonstrations</a></li>
      <li><a href="https://www.isu.edu/physics/outreach/physics-class-demos/thermodynamics/fire-syringe/" target="_blank" rel="noopener">Fire Syringe, Idaho State University Physics Outreach</a></li>
      <li><a href="https://web.physics.ucsb.edu/~lecturedemonstrations/Composer/Pages/52.24.html" target="_blank" rel="noopener">52.24 - Fire syringe, UC Santa Barbara Lecture Demonstrations</a></li>
      <li><a href="https://spark.iop.org/episode-607-specific-heat-capacity" target="_blank" rel="noopener">Episode 607: Specific heat capacity (electrical method), IOPSpark</a></li>
    </ul>
  `
};

/* type: "mcq" or "structured".
   For mcq: options[] and correct = index of the correct answer.
   Cambridge 9702 convention: delta U = q + w, q = heat RECEIVED by the system, w = work DONE ON the system. */
const THERMODYNAMICS_LATIHAN_EN = [
  {
    type: "mcq",
    question: "A gas is compressed by a piston, receiving 180 J of work from the surroundings. At the same time, the gas also receives 60 J of heat. What is the change in internal energy of the gas, $\\Delta U$?",
    options: ["120 J", "180 J", "240 J", "300 J"],
    correct: 2,
    solution: `The gas receives work (it is compressed), so according to the Cambridge convention $w$ is positive: $w = +180~\\text{J}$.
    <br>The gas also receives heat, so $q$ is positive: $q = +60~\\text{J}$.
    <br>Using the first law of thermodynamics: $\\Delta U = q + w = 60 + 180 = 240~\\text{J}$.
    <br>Both terms are positive (the gas receives heat AND receives work), so the internal energy of the gas clearly increases, matching the answer <strong>240 J</strong>.`
  },
  {
    type: "mcq",
    question: "A gas undergoes an adiabatic process (no heat enters or leaves the system). During this process the gas expands and does 95 J of work on the surroundings. What is the change in internal energy of the gas, $\\Delta U$?",
    options: ["-95 J", "+95 J", "0 J", "-190 J"],
    correct: 0,
    solution: `An adiabatic process means $q = 0$ (no heat transfer occurs at all).
    <br>The gas <em>expands</em> and does work ON the surroundings (rather than receiving work), so according to the Cambridge convention, the work done ON the gas is negative: $w = -95~\\text{J}$.
    <br>$\\Delta U = q + w = 0 + (-95) = -95~\\text{J}$.
    <br>The internal energy of the gas decreases by 95 J - the gas uses its own internal energy to do work pushing against the surroundings, since no heat enters to replace it. This is the principle of adiabatic cooling.`
  },
  {
    type: "structured",
    question: "A quantity of gas is compressed adiabatically by a piston. The piston does $3{,}4\\times10^{2}$ J of work on the gas during this process. (a) State the value of q for this process, giving a reason. (b) Calculate the change in internal energy of the gas, $\\Delta U$. (c) What happens to the temperature of the gas? Explain using the concept of internal energy of an ideal gas.",
    solution: `<strong>(a)</strong> An adiabatic process means the system exchanges no heat with the surroundings at all, so $q = 0$.
    <br><strong>(b)</strong> The gas is compressed (receiving work from the piston), so $w = +3{,}4\\times10^{2}~\\text{J}$ (positive, following the Cambridge convention: work done on the gas during compression is positive).
    <br>$\\Delta U = q + w = 0 + 3{,}4\\times10^{2} = 3{,}4\\times10^{2}~\\text{J}$ (the internal energy increases by 340 J).
    <br><strong>(c)</strong> For an ideal gas, the internal energy is entirely molecular kinetic energy (intermolecular potential energy is negligible), and the average kinetic energy of the molecules is directly proportional to the absolute temperature. Since $\\Delta U$ is positive (the internal energy increases), <strong>the temperature of the gas rises</strong>.`
  },
  {
    type: "structured",
    question: "A copper block of mass 0.20 kg (specific heat capacity of copper $c = 385~\\text{J kg}^{-1}\\text{K}^{-1}$) is heated electrically inside a rigid, tightly sealed container, so that its volume does not change during heating. The electrical heater supplies 770 J of energy to the block. (a) Explain why $w = 0$ for this process. (b) Use the first law of thermodynamics to determine $\\Delta U$ for the copper block. (c) Calculate the temperature rise of the copper block.",
    solution: `<strong>(a)</strong> Since the container is rigid and tightly sealed, the volume of the block (and the air around it inside the container) does not change ($\\Delta V = 0$). No piston/surface moves, so no mechanical work is done on or by the system: $w = 0$.
    <br><strong>(b)</strong> The electrical energy supplied by the heater is heat received by the system, so $q = +770~\\text{J}$.
    <br>With $w = 0$: $\\Delta U = q + w = 770 + 0 = 770~\\text{J}$.
    <br><strong>(c)</strong> Since the volume is constant (no work is done), all of this energy raises the temperature of the solid block according to $\\Delta U = mc\\Delta\\theta$:
    <br>$\\Delta\\theta = \\dfrac{\\Delta U}{mc} = \\dfrac{770}{0{,}20 \\times 385} = \\dfrac{770}{77{,}0} = 10{,}0~\\text{K}$.
    <br>So the temperature of the copper block rises by <strong>10.0 K (or 10.0°C)</strong>.`
  },
  {
    type: "structured",
    question: "The gas inside a cylinder is compressed by a piston so that its volume decreases. During this compression process, the gas releases 25 J of heat to its surroundings, while the piston does 60 J of work on the gas. (a) State the sign (positive/negative) of q and w for this process, giving reasons. (b) Calculate the change in internal energy of the gas, $\\Delta U$. (c) Does the internal energy of the gas increase or decrease?",
    solution: `<strong>(a)</strong> The gas <em>releases</em> heat (heat leaves the system for the surroundings), so according to the Cambridge convention $q$ is <strong>negative</strong>: $q = -25~\\text{J}$.
    <br>The piston does work ON the gas (the gas is compressed, receiving work from outside), so $w$ is <strong>positive</strong>: $w = +60~\\text{J}$.
    <br><strong>(b)</strong> $\\Delta U = q + w = (-25) + (+60) = +35~\\text{J}$.
    <br><strong>(c)</strong> Since $\\Delta U$ is positive, the internal energy of the gas <strong>increases</strong> by 35 J - although the gas loses some energy by releasing heat, the work it receives from the piston is much larger, so overall its internal energy still rises.`
  },
  {
    type: "structured",
    question: "An ideal gas is in a piston-cylinder arrangement at a constant pressure of $2{,}0\\times10^{5}$ Pa. The gas is heated so that its volume increases from $3{,}0\\times10^{-4}$ m³ to $5{,}0\\times10^{-4}$ m³, while a total of 90 J of heat is supplied to the gas during this process. (a) Calculate the magnitude of the work done BY the gas on the surroundings during this expansion. (b) State the value of w (work done on the gas, following the first law of thermodynamics convention) for this process, giving a reason for its sign. (c) Calculate the change in internal energy of the gas, $\\Delta U$.",
    solution: `<strong>(a)</strong> Since the pressure is constant, the work done by the gas on the surroundings is calculated from the area under the $p$-$V$ graph (a rectangle):
    <br>$\\Delta V = (5{,}0-3{,}0)\\times10^{-4} = 2{,}0\\times10^{-4}~\\text{m}^3$.
    <br>$W_{\\text{by gas}} = p\\,\\Delta V = (2{,}0\\times10^{5})(2{,}0\\times10^{-4}) = 40~\\text{J}$.
    <br><strong>(b)</strong> Because the gas <em>expands</em> (doing work ON the surroundings, rather than receiving work), the work done ON the gas is negative: $w = -40~\\text{J}$.
    <br><strong>(c)</strong> Heat is supplied to the gas, so $q = +90~\\text{J}$.
    <br>$\\Delta U = q + w = 90 + (-40) = +50~\\text{J}$.
    <br>The internal energy of the gas increases by 50 J: of the 90 J of heat supplied, 40 J is used by the gas to do work pushing the piston outward, while the remainder (50 J) becomes an increase in the internal energy of the gas.`
  }
];

/* Concise formula sheet (plain text), used as automatic "grounding":
   appended to the prompt sent to the AI so that it uses exactly the
   formulas & sign convention already verified from the official Cambridge
   9702 syllabus, rather than guessing from general knowledge (many
   textbooks use a DIFFERENT/reversed sign convention, so this MUST be
   followed exactly). */
const THERMODYNAMICS_FORMULA_SHEET_EN = `
- Internal energy U = sum of the random kinetic energy + random potential energy of all molecules in the system.
  U is NOT the same as temperature: temperature is related only to the average kinetic energy of the molecules; U also includes the intermolecular potential energy (e.g. it changes during a change of state at constant temperature).
  For an ideal gas, intermolecular potential energy is neglected, so U for an ideal gas is entirely kinetic energy and is proportional to the absolute temperature.
- Work at constant pressure: W = p * delta_V. In general, work = the area under the curve on a p-V graph.
  Gas expands (delta_V > 0) -> the gas does work ON the surroundings. Gas is compressed (delta_V < 0) -> the surroundings do work ON the gas.
- OFFICIAL CAMBRIDGE 9702 SIGN CONVENTION (MANDATORY, do not reverse it): First law of thermodynamics: delta U = q + w
  * delta U = change in internal energy of the system. Positive if the internal energy INCREASES.
  * q = heat RECEIVED by the system (energy transferred to the system by heating). Positive if heat ENTERS the system (it is heated). Negative if the system RELEASES heat to the surroundings.
  * w = work DONE ON the system/gas. Positive if the gas IS COMPRESSED (receiving work from outside). Negative if the gas EXPANDS (doing work on the surroundings, rather than receiving work).
  * WARNING: this is DIFFERENT from the classical physics/chemistry convention delta U = Q - W (W = work done BY the system). Cambridge 9702 ALWAYS uses delta U = q + w with w = work done ON the system. Never reverse the sign of w.
- Special case, constant volume (isochoric): delta_V = 0 so w = 0, hence delta U = q directly.
  For a solid/liquid being heated (expansion negligible, w approximately 0): delta U = q = m c delta_theta (c = specific heat capacity, see the Temperature topic).
- Special case, adiabatic: no heat transfer occurs (perfect thermal isolation, or the process is very rapid) so q = 0, hence delta U = w directly.
  Example: fire piston/fire syringe - very rapid compression of air (close to adiabatic, q approximately 0) drastically raises the air temperature (delta U = w, a large positive value), enough to ignite dry cotton.
  Another example: adiabatic expansion (the gas expands without receiving heat, w negative, q=0) causes delta U to be negative, and the gas cools (adiabatic cooling).
- Standard values g = 9.81 m/s^2 and gas constant R = 8.31 J/(mol K) are used where relevant in related ideal gas problems, unless the user requests otherwise.
`;

/* Specific concepts for the Prompt Generator dropdown in the Virtual Simulation Lab */
const THERMODYNAMICS_LAB_CONCEPTS_EN = [
  "Internal Energy as the Sum of Molecular KE and PE",
  "Work Done on a Gas: W = p delta V and the Area Under a p-V Graph",
  "The First Law of Thermodynamics: delta U = q + w (Cambridge Sign Convention)",
  "Constant-Volume (Isochoric) Process: w = 0, delta U = q",
  "Adiabatic Process: q = 0, delta U = w (Adiabatic Cooling/Heating)",
  "Identifying the Signs of q and w from a Description of a Thermodynamic Process",
  "Other (write your own in the additional instructions)"
];

const THERMODYNAMICS_MATERI_CHECK = [
  { question: "Pada proses adiabatik, nilai kalor (q) yang berpindah ke/dari sistem adalah...",
    options: ["Selalu maksimum", "Nol (tidak ada perpindahan kalor)", "Sama dengan kerja w", "Tak terhingga"], correct: 1,
    explanation: "Proses adiabatik didefinisikan sebagai proses tanpa perpindahan kalor, q = 0." },
  { question: "Manakah pernyataan yang paling tepat tentang energi dalam (internal energy) suatu gas ideal?",
    options: ["Energi dalam sama persis dengan suhu gas", "Energi dalam adalah jumlah energi kinetik dan energi potensial acak seluruh molekul; untuk gas ideal seluruhnya berupa energi kinetik karena energi potensial antarmolekul diabaikan", "Energi dalam hanya bergantung pada tekanan gas", "Energi dalam gas ideal selalu bernilai nol"], correct: 1,
    explanation: "Energi dalam U = jumlah EK + EP acak seluruh molekul. Untuk gas ideal, gaya antarmolekul diabaikan sehingga EP = 0 dan U seluruhnya berupa energi kinetik." },
  { question: "Sesuai konvensi Cambridge 9702 (ΔU = q + w), jika gas MEMUAI dan melakukan kerja pada lingkungan, maka nilai w bertanda...",
    options: ["Positif", "Negatif", "Nol", "Tidak dapat ditentukan"], correct: 1,
    explanation: "w adalah kerja yang dilakukan PADA gas. Saat gas memuai (melakukan kerja pada lingkungan, bukan menerimanya), w bertanda negatif." },
  { question: "Sejumlah gas dipanaskan di dalam wadah kaku tertutup rapat (volume tetap). Berdasarkan hukum pertama termodinamika, apa yang terjadi?",
    options: ["w = 0, sehingga ΔU = q (seluruh kalor menjadi pertambahan energi dalam)", "q = 0, sehingga ΔU = w", "ΔU selalu nol karena volume tetap", "Kalor tidak bisa masuk ke sistem bervolume tetap"], correct: 0,
    explanation: "Karena volume tidak berubah, tidak ada kerja (w = 0), sehingga ΔU = q: seluruh kalor yang diterima langsung menjadi pertambahan energi dalam." },
  { question: "Pada grafik tekanan (p) terhadap volume (V), besar kerja yang terlibat pada suatu proses ditunjukkan oleh...",
    options: ["Gradien kurva", "Luas daerah di bawah kurva antara volume awal dan akhir", "Titik potong kurva dengan sumbu p", "Panjang kurva itu sendiri"], correct: 1,
    explanation: "Besar kerja pada suatu proses sama dengan luas daerah di bawah kurva pada grafik p-V; W = pΔV hanyalah kasus khusus saat tekanan konstan." }
];
const THERMODYNAMICS_MATERI_CHECK_EN = [
  { question: "In an adiabatic process, the amount of heat (q) transferred to/from the system is...",
    options: ["Always maximum", "Zero (no heat transfer)", "Equal to the work w", "Infinite"],
    explanation: "An adiabatic process is defined as one with no heat transfer, q = 0." },
  { question: "Which statement most accurately describes the internal energy of an ideal gas?",
    options: ["Internal energy is exactly the same thing as the gas's temperature", "Internal energy is the sum of the random kinetic and potential energies of all molecules; for an ideal gas it is entirely kinetic since intermolecular potential energy is neglected", "Internal energy depends only on the gas's pressure", "The internal energy of an ideal gas is always zero"],
    explanation: "Internal energy U = sum of random KE + PE of all molecules. For an ideal gas, intermolecular forces are neglected so PE = 0 and U is entirely kinetic energy." },
  { question: "Using the Cambridge 9702 convention (ΔU = q + w), if a gas EXPANDS and does work on its surroundings, what is the sign of w?",
    options: ["Positive", "Negative", "Zero", "Cannot be determined"],
    explanation: "w is the work done ON the gas. When the gas expands (doing work on its surroundings rather than receiving it), w is negative." },
  { question: "A gas is heated inside a rigid, sealed container (constant volume). According to the first law of thermodynamics, what happens?",
    options: ["w = 0, so ΔU = q (all the heat becomes an increase in internal energy)", "q = 0, so ΔU = w", "ΔU is always zero because the volume is fixed", "Heat cannot enter a constant-volume system"],
    explanation: "Since the volume doesn't change, no work is done (w = 0), so ΔU = q: all the heat supplied directly becomes an increase in internal energy." },
  { question: "On a pressure (p) vs volume (V) graph, the amount of work involved in a process is shown by...",
    options: ["The gradient of the curve", "The area under the curve between the initial and final volumes", "Where the curve crosses the p-axis", "The length of the curve itself"],
    explanation: "The work done in a process equals the area under the curve on a p-V graph; W = pΔV is just the special case when pressure is constant." }
];
const THERMODYNAMICS_EKSPERIMEN_CHECK = [
  { question: "Pada peragaan fire piston, piston didorong SANGAT CEPAT ke dalam tabung. Mengapa kecepatan ini penting agar prosesnya mendekati adiabatik?",
    options: ["Supaya piston tidak macet", "Supaya tidak ada cukup waktu bagi kalor untuk berpindah keluar melalui dinding tabung", "Supaya tekanan gas menjadi nol", "Supaya volume gas bertambah"], correct: 1,
    explanation: "Proses yang sangat cepat tidak memberi cukup waktu bagi kalor untuk keluar, sehingga q ≈ 0 (mendekati adiabatik)." },
  { question: "Karena piston melakukan kerja PADA udara (memampatkannya), nilai w pada persamaan ΔU = q + w bertanda...",
    options: ["Negatif", "Nol", "Positif", "Tidak dapat ditentukan"], correct: 2,
    explanation: "Kerja yang dilakukan PADA sistem (gas dimampatkan) bernilai positif dalam konvensi ΔU = q + w, sehingga ΔU juga positif (suhu naik)." }
];
const THERMODYNAMICS_EKSPERIMEN_CHECK_EN = [
  { question: "In the fire piston demonstration, the piston is pushed in VERY QUICKLY. Why does this speed matter for the process to approximate an adiabatic process?",
    options: ["So the piston does not get stuck", "So there isn't enough time for heat to escape through the tube walls", "So the gas pressure becomes zero", "So the gas volume increases"],
    explanation: "A very fast process leaves no time for heat to escape, so q ≈ 0 (approximately adiabatic)." },
  { question: "Since the piston does work ON the air (compressing it), the sign of w in ΔU = q + w is...",
    options: ["Negative", "Zero", "Positive", "Cannot be determined"],
    explanation: "Work done ON the system (gas being compressed) is positive under the ΔU = q + w convention, so ΔU is also positive (temperature rises)." }
];

(function attachThermodynamicsContent() {
  const topic = TOPICS.find(t => t.id === "thermodynamics");
  topic.desc = { id: topic.desc, en: THERMODYNAMICS_DESC_EN };
  topic.materiHTML = { id: THERMODYNAMICS_MATERI, en: THERMODYNAMICS_MATERI_EN };
  topic.eksperimen = {
    title: { id: THERMODYNAMICS_EKSPERIMEN.title, en: THERMODYNAMICS_EKSPERIMEN_EN.title },
    intro: { id: THERMODYNAMICS_EKSPERIMEN.intro, en: THERMODYNAMICS_EKSPERIMEN_EN.intro }
  };
  topic.latihan = THERMODYNAMICS_LATIHAN.map((q, i) => {
    const qEN = THERMODYNAMICS_LATIHAN_EN[i] || {};
    return {
      ...q,
      question: { id: q.question, en: qEN.question },
      options: q.options ? q.options.map((opt, j) => ({ id: opt, en: (qEN.options || [])[j] })) : q.options,
      solution: { id: q.solution, en: qEN.solution }
    };
  });
  topic.labConcepts = THERMODYNAMICS_LAB_CONCEPTS.map((c, i) => ({ id: c, en: THERMODYNAMICS_LAB_CONCEPTS_EN[i] }));
  topic.formulaSheet = { id: THERMODYNAMICS_FORMULA_SHEET, en: THERMODYNAMICS_FORMULA_SHEET_EN };
  topic.materiCheck = mapCheckQuestions(THERMODYNAMICS_MATERI_CHECK, THERMODYNAMICS_MATERI_CHECK_EN);
  topic.eksperimenCheck = mapCheckQuestions(THERMODYNAMICS_EKSPERIMEN_CHECK, THERMODYNAMICS_EKSPERIMEN_CHECK_EN);
})();

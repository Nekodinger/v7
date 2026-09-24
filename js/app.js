/* ============================================================
   app.js - logika utama Physics Sandbox
   ============================================================ */

const STORAGE_KEY_BACKEND = "physicsSandbox.backendUrl";
const STORAGE_KEY_GEMINI = "physicsSandbox.geminiApiKey";
const STORAGE_KEY_PROGRESS = "physicsSandbox.progress";
const STORAGE_KEY_UNLOCK_ALL = "physicsSandbox.unlockAll";
const STORAGE_KEY_ROLE = "physicsSandbox.userRole"; // "student" | "guest"
const STORAGE_KEY_STUDENT_NAME = "physicsSandbox.studentName";
const STORAGE_KEY_STUDENT_CLASS = "physicsSandbox.studentClass";
// Menandai topik mana yang tabel data Eksperimen-nya SUDAH pernah disimpan
// ke spreadsheet minimal sekali (lihat wireEksperimenDataTable) - dipakai
// untuk mewajibkan siswa mengisi & menyimpan tabel dulu sebelum tombol
// "Lanjut ke Latihan Soal" boleh membuka pertanyaan konfirmasi Eksperimen.
const STORAGE_KEY_EKSDATA_SAVED = "physicsSandbox.eksperimenDataSaved";
// Praktikum Virtual (tab Lab, tanpa alat) - lihat renderVirtualLabHTML() dkk
// di bawah. Sengaja HANYA localStorage (tidak pernah di-POST ke backend
// mana pun) supaya fitur ini tidak butuh perubahan apa pun pada
// apps-script/Code.gs ataupun DEFAULT_BACKEND_URL.
const STORAGE_KEY_VLAB_TRUEB = "physicsSandbox.virtualLabTrueB";
const STORAGE_KEY_VLAB_DATA = "physicsSandbox.virtualLabData";
let currentTopic = null;
let lastGeneratedHTML = "";
let editCount = 0;
const MAX_FOLLOWUP_EDITS = 5;

/* ============================================================
   Navigasi bertahap (sesuai sintaks PjBL - Project based Learning)
   ------------------------------------------------------------
   Diganti dari sintaks Inquiry Learning ke sintaks PjBL (2026-09-19)
   karena tiap topik sekarang berjalan sebagai SATU PROYEK
   berkelanjutan yang bisa memakan 2-3 pertemuan, bukan lagi harus
   selesai dalam satu sesi duduk:
     1) Penentuan Pertanyaan Mendasar & Perencanaan  -> tab Materi
     2) Mendesain Perencanaan Proyek & Menyusun Jadwal (data)
                                                       -> tab Eksperimen
     3) Memonitor Peserta Didik & Kemajuan Proyek     -> KONFIRMASI GURU
        (checkpoint di Eksperimen & di Lab Simulasi, lihat GATE_STAGES
        di bawah)
     4) Menguji Hasil                                 -> tab Latihan Soal
        & hasil simulasi di tab Lab
     5) Mengevaluasi Pengalaman                       -> refleksi di
        tab Lab Simulasi sebelum konfirmasi akhir guru

   Kuncinya PER TOPIK, bukan antar-topik: siswa boleh mulai dari
   topik mana saja (mis. langsung ke Magnetic Fields tanpa perlu
   menyelesaikan Kinematics dulu), tapi begitu masuk ke sebuah topik
   "ready", tab di dalamnya (Materi -> Eksperimen -> Latihan Soal ->
   Lab Simulasi Virtual) tetap harus dibuka BERURUTAN. Guru bisa
   membagikan TEACHER_UNLOCK_CODE (di js/config.js) untuk siswa yang
   perlu menjelajah bebas tanpa urutan sama sekali.

   YANG BARU (2026-09-19): pindah ke tab berikutnya sekarang perlu
   menjawab pertanyaan konfirmasi pemahaman di SETIAP tab/aktivitas,
   TAPI hanya dua checkpoint yang juga butuh persetujuan eksplisit
   dari guru (lihat GATE_STAGES): Eksperimen (sebelum Latihan Soal
   & Lab Simulasi terbuka) dan Lab Simulasi (sebelum topik ditandai
   selesai). Materi dan Latihan Soal dinilai otomatis di klien saja,
   TANPA menunggu guru. Lihat blok "Konfirmasi Pemahaman & Gate Guru"
   di bawah untuk detail implementasinya.
   ============================================================ */
const TAB_ORDER = ["materi", "eksperimen", "latihan", "lab"];
const TAB_LABELS = { materi: t("tab.materi"), eksperimen: t("tab.eksperimen"), latihan: t("tab.latihan"), lab: t("tab.lab") };
// Tahap PjBL yang ditampilkan sebagai subjudul kecil di atas tiap panel tab
// (murni label/framing, tidak memengaruhi logika gate).
const PJBL_STAGE_LABELS = {
  materi: "pjbl.stage.materi",
  eksperimen: "pjbl.stage.eksperimen",
  latihan: "pjbl.stage.latihan",
  lab: "pjbl.stage.lab"
};

function isUnlockAll() {
  return localStorage.getItem(STORAGE_KEY_UNLOCK_ALL) === "true";
}
function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS) || "{}"); }
  catch (e) { return {}; }
}
function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(p));
}
function getReadyTopicsOrder() {
  return TOPICS.filter(tp => tp.status === "ready").sort((a, b) => a.number - b.number).map(tp => tp.id);
}
// Mengembalikan index tab tertinggi (di TAB_ORDER) yang boleh dibuka untuk
// sebuah topik. Setiap topik "ready" SELALU boleh dimulai (index 0 = tab
// Materi), tidak bergantung pada progres topik lain sama sekali.
function getUnlockedTabIndex(topicId) {
  if (isUnlockAll()) return TAB_ORDER.length - 1;
  const progress = getProgress();
  return progress[topicId] !== undefined ? progress[topicId] : 0;
}
function isTabLocked(topicId, tabName) {
  const topic = TOPICS.find(tp => tp.id === topicId);
  if (!topic || topic.status !== "ready") return false;
  // Sesi kelas aktif (dari guru) mengalahkan semua gembok lain (termasuk
  // Kode Eksplorasi Bebas) - selama tergabung, HANYA tab yang sedang
  // ditentukan guru untuk topik ini yang boleh dibuka.
  if (isInClassSession()) {
    if (topicId !== classSession.topicId) return true;
    return TAB_ORDER.indexOf(tabName) !== classSession.tabIndex;
  }
  const unlocked = getUnlockedTabIndex(topicId);
  return TAB_ORDER.indexOf(tabName) > unlocked;
}
function advanceProgress(topicId, tabIndexReached) {
  const progress = getProgress();
  const current = progress[topicId] !== undefined ? progress[topicId] : -1;
  progress[topicId] = Math.max(current, Math.min(tabIndexReached, TAB_ORDER.length - 1));
  saveProgress(progress);
}
function nextReadyTopicId(topicId) {
  const order = getReadyTopicsOrder();
  const idx = order.indexOf(topicId);
  if (idx < 0 || idx >= order.length - 1) return null;
  return order[idx + 1];
}

/* ============================================================
   Konfirmasi Pemahaman & Gate Guru (checkpoint PjBL)
   ------------------------------------------------------------
   Ditambahkan 2026-09-19 atas permintaan user: siswa cuma boleh
   pindah tab kalau bisa menjawab pertanyaan konfirmasi pemahaman
   untuk aktivitas itu. Materi & Latihan Soal dinilai OTOMATIS di
   klien saja (langsung lanjut kalau benar). Eksperimen & Lab
   Simulasi Virtual TAMBAHAN butuh persetujuan eksplisit guru lewat
   Panel Guru sebelum siswa dianggap boleh lanjut/selesai - dikirim
   ke backend (mode "gate_submit"/"gate_status") sebagai permintaan
   "pending" yang disetujui/ditolak lewat mode "teacher_gate_decide".
   Status terakhir di-cache di localStorage supaya UI tidak kosong
   sebelum polling pertama selesai / saat offline.
   ============================================================ */
const GATE_POLL_MS = 10000;
const STORAGE_KEY_GATE_CACHE = "physicsSandbox.gateCache";

let gatePollTimer = null;
let gatePollStage = null;
let gatePollTopicId = null;

function getGateCache() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_GATE_CACHE) || "{}"); }
  catch (e) { return {}; }
}
function setGateCacheEntry(topicId, stage, data) {
  const cache = getGateCache();
  cache[topicId] = cache[topicId] || {};
  cache[topicId][stage] = data;
  localStorage.setItem(STORAGE_KEY_GATE_CACHE, JSON.stringify(cache));
}
function getGateCacheEntry(topicId, stage) {
  const cache = getGateCache();
  return (cache[topicId] && cache[topicId][stage]) || null;
}

/* ---- Modal generik pertanyaan konfirmasi (dibuat sekali, dipakai ulang) ---- */
let confirmModalEl = null;
function ensureConfirmModal() {
  if (confirmModalEl) return confirmModalEl;
  const el = document.createElement("div");
  el.className = "modal";
  el.id = "confirm-modal";
  el.hidden = true;
  el.innerHTML = `
    <div class="modal-box">
      <div class="modal-head">
        <h3 id="confirm-modal-title"></h3>
        <button type="button" id="confirm-modal-close-btn" class="icon-btn" aria-label="Tutup">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <p class="muted small" id="confirm-modal-desc"></p>
      <div id="confirm-modal-body"></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" id="confirm-modal-submit-btn"></button>
      </div>
      <p class="teacher-note" id="confirm-modal-status"></p>
    </div>`;
  document.body.appendChild(el);
  el.querySelector("#confirm-modal-close-btn").addEventListener("click", () => { el.hidden = true; });
  confirmModalEl = el;
  return el;
}
function renderConfirmQuestions(questions) {
  return questions.map((q, qi) => `
    <div class="question-card" data-qidx="${qi}">
      <div class="q-title">${t("question.label", { n: qi + 1 })}</div>
      <div>${trContent(q.question)}</div>
      <div class="options-input">
        ${q.options.map((opt, oi) => `
          <label class="option-radio">
            <input type="radio" name="cq-${qi}" value="${oi}">
            ${String.fromCharCode(65 + oi)}. ${trContent(opt)}
          </label>`).join("")}
      </div>
      <p class="confirm-feedback muted small" hidden></p>
    </div>`).join("");
}
// Ambang skor minimum (dalam %) supaya siswa dianggap "lulus" konfirmasi
// pemahaman Materi - TIDAK harus benar 100% seperti gate lain (Eksperimen/
// fallback generik tetap butuh benar semua, threshold default 100 di bawah).
// Kalau skor < ambang ini, modal TIDAK menutup/lanjut - siswa diminta
// mempelajari kembali Materi Belajar dulu baru mencoba lagi (lihat
// openConfirmModal() & startMateriGate()).
const PASS_THRESHOLD_MATERI = 80;

// opts: { title, desc, questions (array|null), fallbackLabel, submitLabel,
//         passThreshold (0-100, default 100 = harus benar semua), onPass }
// questions null -> tampil sebagai satu checkbox konfirmasi generik (fallback
// untuk topik yang belum diisi soal konfirmasi terstruktur).
function openConfirmModal(opts) {
  const el = ensureConfirmModal();
  document.getElementById("confirm-modal-title").textContent = opts.title;
  document.getElementById("confirm-modal-desc").textContent = opts.desc || "";
  const body = document.getElementById("confirm-modal-body");
  const statusEl = document.getElementById("confirm-modal-status");
  statusEl.textContent = "";
  statusEl.className = "teacher-note";
  let submitBtn = document.getElementById("confirm-modal-submit-btn");
  submitBtn.textContent = opts.submitLabel || t("confirm.checkbtn");
  // Ganti tombol dengan clone supaya listener lama (dari pemanggilan
  // sebelumnya) tidak menumpuk.
  const newBtn = submitBtn.cloneNode(true);
  submitBtn.parentNode.replaceChild(newBtn, submitBtn);
  submitBtn = newBtn;

  if (opts.questions && opts.questions.length) {
    body.innerHTML = renderConfirmQuestions(opts.questions);
    const threshold = opts.passThreshold != null ? opts.passThreshold : 100;
    submitBtn.addEventListener("click", () => {
      const cards = body.querySelectorAll(".question-card");
      let answeredAll = true;
      let correctCount = 0;
      cards.forEach((card, qi) => {
        const checked = card.querySelector(`input[name="cq-${qi}"]:checked`);
        const feedback = card.querySelector(".confirm-feedback");
        const q = opts.questions[qi];
        if (!checked) {
          answeredAll = false;
          feedback.hidden = false;
          feedback.textContent = t("confirm.pickanswer");
          feedback.className = "confirm-feedback small warn";
          return;
        }
        const isRight = parseInt(checked.value, 10) === q.correct;
        if (isRight) correctCount++;
        feedback.hidden = false;
        feedback.textContent = isRight ? t("confirm.correct") : (trContent(q.explanation) || t("confirm.wrong"));
        feedback.className = "confirm-feedback small " + (isRight ? "ok" : "warn");
      });
      if (!answeredAll) {
        statusEl.className = "teacher-note";
        statusEl.textContent = t("confirm.tryagain");
        return;
      }
      const total = opts.questions.length;
      const scorePct = Math.round((correctCount / total) * 100);
      if (scorePct >= threshold) {
        if (opts.showScoreOnPass) showToast(t("confirm.scorepass", { score: scorePct }));
        el.hidden = true;
        opts.onPass();
      } else {
        // Skor belum cukup - modal TETAP TERBUKA (tidak lanjut), siswa harus
        // menutup, mempelajari ulang materi di atas, lalu klik Next lagi
        // untuk membuka modal ini dari awal (state soal ke-reset otomatis
        // karena body.innerHTML dirender ulang tiap openConfirmModal()).
        statusEl.className = "teacher-note gate-score-fail";
        statusEl.textContent = t("confirm.scorefail", { score: scorePct, correct: correctCount, total, min: threshold });
      }
    });
  } else {
    body.innerHTML = `<label class="option-radio"><input type="checkbox" id="confirm-generic-check"> ${opts.fallbackLabel || t("confirm.generic.label")}</label>`;
    submitBtn.addEventListener("click", () => {
      if (!document.getElementById("confirm-generic-check").checked) {
        statusEl.textContent = t("confirm.generic.needcheck");
        return;
      }
      el.hidden = true;
      opts.onPass();
    });
  }
  el.hidden = false;
}

function startMateriGate(onPass) {
  openConfirmModal({
    title: t("gate.materi.title"),
    desc: t("gate.materi.desc"),
    questions: (currentTopic.materiCheck && currentTopic.materiCheck.length) ? currentTopic.materiCheck : null,
    fallbackLabel: t("gate.materi.fallback"),
    passThreshold: PASS_THRESHOLD_MATERI,
    showScoreOnPass: true,
    onPass
  });
}
function startEksperimenGate() {
  openConfirmModal({
    title: t("gate.eksperimen.title"),
    desc: t("gate.eksperimen.desc"),
    questions: currentTopic.eksperimenCheck || null,
    fallbackLabel: t("gate.eksperimen.fallback"),
    submitLabel: t("gate.eksperimen.submitbtn"),
    onPass: () => submitGateForApproval("eksperimen", t("gate.eksperimen.autosummary"))
  });
}
function startLabReflectionGate() {
  const input = document.getElementById("lab-reflection-input");
  const text = (input ? input.value : "").trim();
  const statusEl = document.getElementById("lab-reflection-status");
  if (text.length < 15) {
    if (statusEl) statusEl.textContent = t("gate.lab.reflection.tooShort");
    return;
  }
  submitGateForApproval("lab", text);
}

async function submitGateForApproval(stage, summary) {
  if (!currentTopic) return;
  const topicId = currentTopic.id;
  const studentId = getStudentId();
  setGateCacheEntry(topicId, stage, { status: "pending", submittedAt: Date.now() });
  renderGateBanner(stage);
  showToast(t("gate.submitted.toast"));
  const backendUrl = getBackendUrl();
  if (backendUrl) {
    try {
      await fetch(backendUrl, {
        method: "POST", headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ mode: "gate_submit", topicId, studentId, stage, summary: summary || "" })
      });
    } catch (e) { /* akan tersinkron lagi lewat polling di bawah */ }
  }
  startGatePolling(topicId, stage);
}
function startGatePolling(topicId, stage) {
  stopGatePolling();
  gatePollTopicId = topicId;
  gatePollStage = stage;
  pollGateStatus();
  gatePollTimer = setInterval(pollGateStatus, GATE_POLL_MS);
}
function stopGatePolling() {
  if (gatePollTimer) { clearInterval(gatePollTimer); gatePollTimer = null; }
  gatePollStage = null;
  gatePollTopicId = null;
}
async function pollGateStatus() {
  const backendUrl = getBackendUrl();
  if (!backendUrl || !gatePollTopicId) return;
  const topicId = gatePollTopicId, stage = gatePollStage;
  try {
    const resp = await fetch(backendUrl, {
      method: "POST", headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ mode: "gate_status", topicId, studentId: getStudentId() })
    });
    const data = await resp.json();
    const st = data[stage];
    if (!st || !st.status) return;
    setGateCacheEntry(topicId, stage, st);
    if (st.status !== "pending") {
      stopGatePolling();
      handleGateDecision(topicId, stage, st);
    } else if (currentTopic && currentTopic.id === topicId) {
      renderGateBanner(stage);
    }
  } catch (e) { /* jaringan sesekali gagal - coba lagi di polling berikutnya */ }
}
function handleGateDecision(topicId, stage, st) {
  if (st.status === "approved") {
    if (stage === "eksperimen") {
      // Menyetujui Eksperimen membuka Latihan Soal DAN Lab Simulasi
      // sekaligus (index 3 = tab terakhir), sesuai permintaan: guru cukup
      // konfirmasi sekali di sini, dua tab berikutnya langsung terbuka.
      advanceProgress(topicId, TAB_ORDER.length - 1);
      showToast(t("gate.eksperimen.approved.toast"));
    } else {
      showToast(t("gate.lab.approved.toast"));
    }
  } else {
    showToast(stage === "eksperimen" ? t("gate.eksperimen.rejected.toast") : t("gate.lab.rejected.toast"));
  }
  if (currentTopic && currentTopic.id === topicId) {
    renderNav();
    const activeTab = document.querySelector(".tab-btn.active")?.dataset.tab;
    if (activeTab) updateTopicProgressUI(activeTab);
    renderGateBanner(stage);
  }
}
function gateBannerContainerId(stage) {
  return stage === "eksperimen" ? "eksperimen-gate-banner" : "lab-gate-banner";
}
function renderGateBanner(stage) {
  if (!currentTopic) return;
  const el = document.getElementById(gateBannerContainerId(stage));
  if (!el) return;
  const cached = getGateCacheEntry(currentTopic.id, stage);
  if (!cached || !cached.status) { el.innerHTML = ""; el.hidden = true; return; }
  el.hidden = false;
  if (cached.status === "pending") {
    el.className = "gate-banner gate-pending";
    el.innerHTML = `<span class="gate-banner-icon">&#9203;</span> ${t("gate.banner.pending." + stage)}`;
  } else if (cached.status === "approved") {
    el.className = "gate-banner gate-approved";
    el.innerHTML = `<span class="gate-banner-icon">&#10003;</span> ${t("gate.banner.approved." + stage)}`;
  } else if (cached.status === "rejected") {
    el.className = "gate-banner gate-rejected";
    const note = cached.note ? `<br><em>${t("gate.banner.notefromteacher")}: ${escapeAttr(cached.note)}</em>` : "";
    const retryId = stage + "-gate-retry-btn";
    el.innerHTML = `<span class="gate-banner-icon">&#10007;</span> ${t("gate.banner.rejected." + stage)}${note}` +
      `<br><button type="button" class="btn btn-secondary btn-small gate-retry-btn" id="${retryId}">${t("gate.banner.retrybtn")}</button>`;
    const retryBtn = document.getElementById(retryId);
    if (retryBtn) retryBtn.addEventListener("click", () => {
      if (stage === "eksperimen") startEksperimenGate();
      else startLabReflectionGate();
    });
  }
  // Form refleksi Lab dinonaktifkan selagi menunggu/​sudah disetujui guru -
  // ditolak tetap bisa diedit & dikirim ulang lewat tombol retry di atas.
  if (stage === "lab") {
    const input = document.getElementById("lab-reflection-input");
    const submitBtn = document.getElementById("lab-reflection-submit-btn");
    const locked = cached.status === "pending" || cached.status === "approved";
    if (input) input.disabled = locked;
    if (submitBtn) submitBtn.hidden = locked;
  }
}
// Dipanggil sekali setiap topik dibuka (selectTopic) supaya keputusan guru
// yang terjadi SAAT siswa offline/pindah perangkat tetap tersinkron, dan
// supaya polling yang terputus (mis. reload halaman saat masih pending)
// otomatis dilanjutkan lagi.
async function checkGateOnTopicOpen(topicId) {
  const backendUrl = getBackendUrl();
  if (!backendUrl) { renderGateBanner("eksperimen"); renderGateBanner("lab"); return; }
  try {
    const resp = await fetch(backendUrl, {
      method: "POST", headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ mode: "gate_status", topicId, studentId: getStudentId() })
    });
    const data = await resp.json();
    ["eksperimen", "lab"].forEach(stage => {
      if (!data[stage]) return;
      const prev = getGateCacheEntry(topicId, stage);
      setGateCacheEntry(topicId, stage, data[stage]);
      if (data[stage].status === "approved" && stage === "eksperimen" && (!prev || prev.status !== "approved")) {
        advanceProgress(topicId, TAB_ORDER.length - 1);
      }
      if (data[stage].status === "pending" && gatePollTopicId !== topicId) {
        startGatePolling(topicId, stage);
      }
    });
  } catch (e) { /* offline - tetap tampilkan cache lokal terakhir di bawah */ }
  if (currentTopic && currentTopic.id === topicId) {
    renderNav();
    const activeTab = document.querySelector(".tab-btn.active")?.dataset.tab;
    if (activeTab) updateTopicProgressUI(activeTab);
    renderGateBanner("eksperimen");
    renderGateBanner("lab");
  }
}
// Section PjBL kecil yang ditampilkan di atas tiap panel tab (framing saja,
// tidak memengaruhi logika).
function pjblStageHTML(tabName) {
  const key = PJBL_STAGE_LABELS[tabName];
  return key ? `<p class="pjbl-stage-label">${t(key)}</p>` : "";
}

/* ============================================================
   Sesi Kelas (real-time, dari Panel Guru)
   ------------------------------------------------------------
   Kalau guru sedang menjalankan sesi kelas dan siswa sudah gabung
   (memasukkan kode lewat Pengaturan), browser siswa polling
   backend tiap ~12 detik: melaporkan aktivitas mereka saat ini
   (buat panel guru) DAN mengambil aktivitas yang sedang WAJIB
   dikerjakan bareng. Selama tergabung & sesi aktif, ini
   MENGALAHKAN semua gembok lain (isTabLocked di atas sudah
   menangani ini) - topik lain juga disembunyikan/dikunci di
   renderNav supaya siswa benar-benar fokus ke satu aktivitas.
   ============================================================ */
const STORAGE_KEY_STUDENT_ID = "physicsSandbox.studentId";
const STORAGE_KEY_CLASS_CODE = "physicsSandbox.classSessionCode";
const CLASS_SYNC_INTERVAL_MS = 12000;

let classSession = null; // {active, code, topicId, tabIndex, updatedAt} dari server terakhir
let classSyncTimer = null;
let lastClassActivityKey = null; // untuk deteksi kapan guru GANTI aktivitas

function getUserRole() {
  return localStorage.getItem(STORAGE_KEY_ROLE) || "";
}
function getStudentName() {
  return (localStorage.getItem(STORAGE_KEY_STUDENT_NAME) || "").trim();
}
function getStudentClass() {
  return (localStorage.getItem(STORAGE_KEY_STUDENT_CLASS) || "").trim();
}
// Kalau siswa sudah isi nama+kelas manual (langkah wajib di gate), pakai itu
// sebagai identitas di roster Panel Guru (bukan ID anonim lagi) - supaya guru
// benar-benar tahu itu progres siapa. Fallback ID anonim tetap ada untuk
// kasus lain (mis. peran "bukan siswa" yang kebetulan ikut sebuah sesi kelas).
function getStudentId() {
  const name = getStudentName();
  if (name) {
    const cls = getStudentClass();
    return cls ? `${name} (${cls})` : name;
  }
  let id = localStorage.getItem(STORAGE_KEY_STUDENT_ID);
  if (!id) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let suffix = "";
    for (let i = 0; i < 4; i++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    id = "Siswa-" + suffix;
    localStorage.setItem(STORAGE_KEY_STUDENT_ID, id);
  }
  return id;
}
function getJoinedSessionCode() {
  return (localStorage.getItem(STORAGE_KEY_CLASS_CODE) || "").trim();
}
function isInClassSession() {
  return !!(classSession && classSession.active && getJoinedSessionCode() &&
    classSession.code && classSession.code.toUpperCase() === getJoinedSessionCode().toUpperCase());
}
function leaveClassSession(message) {
  localStorage.removeItem(STORAGE_KEY_CLASS_CODE);
  classSession = null;
  lastClassActivityKey = null;
  stopClassSync();
  renderNav();
  if (currentTopic) {
    const activeTab = document.querySelector(".tab-btn.active")?.dataset.tab;
    if (activeTab) updateTopicProgressUI(activeTab);
  }
  refreshClassSessionUI();
  updateClassSessionBanner();
  updateQuizUI(null);
  if (message) showToast(message);
  // Kalau perannya siswa, situs WAJIB kembali terkunci di gate (minta kode
  // baru) begitu sesi berakhir/tidak valid lagi - bukan cuma kembali ke mode
  // belajar mandiri seperti sebelumnya. Peran "bukan siswa" tidak terpengaruh
  // (aksesnya tetap lewat Kode Eksplorasi Bebas, tidak terkait sesi kelas).
  if (typeof applyGate === "function") applyGate();
}
// Mencoba gabung/menyambung ulang ke sebuah kode sesi kelas lewat backend.
// Dipakai baik oleh langkah wajib di gate maupun tombol "Gabung" di
// Pengaturan. Mengembalikan {ok:true} atau {ok:false, error}.
async function attemptJoinClassSession(code) {
  const trimmed = (code || "").trim();
  if (!trimmed) return { ok: false, error: t("gate.student.code.needcode") };
  const backendUrl = getBackendUrl();
  if (!backendUrl) return { ok: false, error: t("backend.notconfigured.short") };
  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ mode: "session_sync", code: trimmed, studentId: getStudentId(), topicId: null, tabIndex: null })
    });
    const data = await resp.json();
    if (data.error) return { ok: false, error: data.error };
    if (!data.active || !data.code || data.code.toUpperCase() !== trimmed.toUpperCase()) {
      localStorage.removeItem(STORAGE_KEY_CLASS_CODE);
      return { ok: false, error: t("classsession.wrongcode") };
    }
    localStorage.setItem(STORAGE_KEY_CLASS_CODE, trimmed);
    classSession = data;
    lastClassActivityKey = data.topicId + "|" + data.tabIndex;
    startClassSync();
    updateQuizUI(data.activeQuiz);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: t("classsession.connectfailed", { err: err.message }) };
  }
}
function stopClassSync() {
  if (classSyncTimer) { clearInterval(classSyncTimer); classSyncTimer = null; }
}
function startClassSync() {
  stopClassSync();
  syncClassSession();
  classSyncTimer = setInterval(syncClassSession, CLASS_SYNC_INTERVAL_MS);
}
async function syncClassSession() {
  const backendUrl = getBackendUrl();
  const code = getJoinedSessionCode();
  if (!backendUrl || !code) return;
  try {
    const activeTabName = document.querySelector(".tab-btn.active")?.dataset.tab;
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        mode: "session_sync",
        code: code,
        studentId: getStudentId(),
        topicId: currentTopic ? currentTopic.id : null,
        tabIndex: activeTabName ? TAB_ORDER.indexOf(activeTabName) : null
      })
    });
    const data = await resp.json();
    if (!data.active || !data.code || data.code.toUpperCase() !== code.toUpperCase()) {
      leaveClassSession(t("settings.classsession.left"));
      return;
    }
    classSession = data;
    const activityKey = data.topicId + "|" + data.tabIndex;
    const changed = activityKey !== lastClassActivityKey;
    lastClassActivityKey = activityKey;
    renderNav();
    updateClassSessionBanner();
    updateQuizUI(data.activeQuiz);
    if (currentTopic) {
      const tabName = document.querySelector(".tab-btn.active")?.dataset.tab;
      if (tabName) updateTopicProgressUI(tabName);
    }
    // Baru gabung, atau guru baru saja ganti aktivitas -> langsung antar
    // siswa ke sana supaya semua benar-benar mulai bersamaan.
    if (changed) goToClassSessionActivity();
  } catch (err) {
    // Gagal konek sesekali (jaringan) bukan hal fatal - coba lagi di
    // polling berikutnya, jangan spam toast tiap 12 detik.
  }
}
function goToClassSessionActivity() {
  if (!isInClassSession() || !classSession.topicId) return;
  const tabName = TAB_ORDER[classSession.tabIndex] || "materi";
  if (!currentTopic || currentTopic.id !== classSession.topicId) {
    selectTopic(classSession.topicId); // aman: id di sini SAMA dengan tujuan yang diizinkan sesi
  }
  if (document.querySelector(".tab-btn.active")?.dataset.tab !== tabName) {
    switchTab(tabName);
  }
  updateClassSessionBanner();
}
function updateClassSessionBanner() {
  const banner = document.getElementById("class-session-banner");
  const textEl = document.getElementById("class-session-text");
  if (!isInClassSession() || !classSession.topicId) { banner.hidden = true; return; }
  const topic = TOPICS.find(tp => tp.id === classSession.topicId);
  const tabLabel = TAB_LABELS[TAB_ORDER[classSession.tabIndex]] || "";
  const onTarget = currentTopic && currentTopic.id === classSession.topicId &&
    document.querySelector(".tab-btn.active")?.dataset.tab === TAB_ORDER[classSession.tabIndex];
  if (onTarget) { banner.hidden = true; return; }
  textEl.textContent = t("classsession.bannertext", { topic: topic ? trContent(topic.title) : "", tab: tabLabel });
  banner.hidden = false;
}
document.getElementById("class-session-go-btn").addEventListener("click", goToClassSessionActivity);

function refreshClassSessionUI() {
  const statusText = document.getElementById("class-session-status-text");
  const joinRow = document.getElementById("class-session-join-row");
  const leaveBtn = document.getElementById("class-session-leave-btn");
  if (!statusText) return;
  if (isInClassSession()) {
    statusText.textContent = t("settings.classsession.joined");
    statusText.classList.add("ok");
    joinRow.hidden = true;
    leaveBtn.hidden = false;
  } else {
    statusText.textContent = t("settings.classsession.notjoined");
    statusText.classList.remove("ok");
    joinRow.hidden = false;
    leaveBtn.hidden = true;
  }
}
document.getElementById("class-session-join-btn").addEventListener("click", async () => {
  const input = document.getElementById("class-session-code-input");
  const statusText = document.getElementById("class-session-status-text");
  const val = input.value.trim();
  if (!val) return;
  statusText.textContent = t("gate.student.code.connecting");
  statusText.classList.remove("ok");
  const result = await attemptJoinClassSession(val);
  if (result.ok) {
    input.value = "";
  } else {
    showToast(result.error);
  }
  refreshClassSessionUI();
});
document.getElementById("class-session-leave-btn").addEventListener("click", () => {
  leaveClassSession(null);
});

/* ============================================================
   Kuis dari Guru (Kuis Topik, Panel Guru) - muncul sebagai tombol
   mengambang begitu guru mempublikasikan kuis ke sesi kelas yang
   sedang diikuti siswa. Lihat format data & alur lengkap di
   apps-script/Code.gs (bagian "Kuis Topik") dan js/teacher.js.
   ============================================================ */
let activeQuizData = null; // versi publik (tanpa jawaban benar) dari server

function updateQuizUI(quiz) {
  const newId = (quiz && quiz.id) ? quiz.id : null;
  const modal = document.getElementById("quiz-modal");
  const modalWasShowingThis = !modal.hidden && activeQuizData && activeQuizData.id === newId;
  const quizDisappearedOrChanged = !modal.hidden && activeQuizData && activeQuizData.id !== newId;
  activeQuizData = newId ? quiz : null;

  const btn = document.getElementById("quiz-toggle-btn");
  if (!isInClassSession() || !activeQuizData) {
    btn.hidden = true;
  } else {
    btn.hidden = false;
    btn.classList.toggle("done", !!activeQuizData.submitted);
    document.getElementById("quiz-toggle-label").textContent = activeQuizData.submitted ? t("quiz.banner.done") : t("quiz.toggle.label");
  }
  if (quizDisappearedOrChanged) {
    closeQuizModal();
    showToast(t("quiz.ended.notice"));
  } else if (modalWasShowingThis) {
    // Kuis yang sama masih aktif - render ulang cuma kalau status "sudah
    // dijawab" berubah (mis. submit baru saja berhasil dari tab lain),
    // supaya siswa yang sedang mengetik jawaban tidak terganggu.
  }
}

function escapeHtmlQ(str) {
  return String(str == null ? "" : str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.getElementById("quiz-toggle-btn").addEventListener("click", () => {
  if (activeQuizData) openQuizModal();
});
function openQuizModal() {
  if (!activeQuizData) return;
  renderQuizModal();
  document.getElementById("quiz-modal").hidden = false;
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([document.getElementById("quiz-modal-body")]).catch(() => {});
  }
}
function closeQuizModal() {
  document.getElementById("quiz-modal").hidden = true;
}
document.getElementById("quiz-modal-close-btn").addEventListener("click", closeQuizModal);
document.getElementById("quiz-modal-close-x").addEventListener("click", closeQuizModal);

function renderQuizModal() {
  const body = document.getElementById("quiz-modal-body");
  const submitBtn = document.getElementById("quiz-modal-submit-btn");
  const statusEl = document.getElementById("quiz-modal-status");
  statusEl.textContent = "";
  const questions = activeQuizData.questions || [];
  body.innerHTML = questions.map((q, i) => {
    let inputHtml = "";
    if (q.type === "mcq") {
      inputHtml = `<ul class="options">${(q.options || []).map((opt, oi) => `
        <li><label><input type="radio" name="quiz-answer-${escapeHtmlQ(q.id)}" value="${oi}"> ${String.fromCharCode(65 + oi)}. ${escapeHtmlQ(opt)}</label></li>
      `).join("")}</ul>`;
    } else {
      const placeholder = q.type === "essay" ? t("quiz.modal.essay.placeholder") : t("quiz.modal.short.placeholder");
      inputHtml = `<textarea data-qid="${escapeHtmlQ(q.id)}" placeholder="${escapeHtmlQ(placeholder)}"></textarea>`;
    }
    return `
      <div class="quiz-modal-question">
        <div class="q-title">${t("quiz.modal.question.label", { n: i + 1 })}</div>
        <div>${escapeHtmlQ(q.question)}</div>
        ${inputHtml}
      </div>`;
  }).join("");
  submitBtn.disabled = !!activeQuizData.submitted;
  if (activeQuizData.submitted) statusEl.textContent = t("quiz.modal.submitted");
}

document.getElementById("quiz-modal-submit-btn").addEventListener("click", async () => {
  if (!activeQuizData) return;
  const statusEl = document.getElementById("quiz-modal-status");
  const submitBtn = document.getElementById("quiz-modal-submit-btn");
  const answers = {};
  (activeQuizData.questions || []).forEach(q => {
    if (q.type === "mcq") {
      const checked = document.querySelector(`input[name="quiz-answer-${CSS.escape(q.id)}"]:checked`);
      if (checked) answers[q.id] = parseInt(checked.value, 10);
    } else {
      const ta = document.querySelector(`textarea[data-qid="${CSS.escape(q.id)}"]`);
      if (ta && ta.value.trim()) answers[q.id] = ta.value.trim();
    }
  });
  const backendUrl = getBackendUrl();
  if (!backendUrl) { statusEl.textContent = t("backend.notconfigured.short"); return; }
  submitBtn.disabled = true;
  statusEl.textContent = t("quiz.modal.submitting");
  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        mode: "quiz_submit",
        code: getJoinedSessionCode(),
        studentId: getStudentId(),
        quizId: activeQuizData.id,
        answers: answers
      })
    });
    const data = await resp.json();
    if (data.error) {
      statusEl.textContent = t("quiz.modal.error.generic", { err: data.error });
      submitBtn.disabled = false;
      return;
    }
    activeQuizData.submitted = true;
    statusEl.textContent = t("quiz.modal.submitted");
    const btn = document.getElementById("quiz-toggle-btn");
    btn.classList.add("done");
    document.getElementById("quiz-toggle-label").textContent = t("quiz.banner.done");
  } catch (err) {
    statusEl.textContent = t("quiz.modal.error.generic", { err: err.message });
    submitBtn.disabled = false;
  }
});

let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function getBackendUrl() {
  return localStorage.getItem(STORAGE_KEY_BACKEND) || DEFAULT_BACKEND_URL || "";
}
function getGeminiApiKey() {
  return (localStorage.getItem(STORAGE_KEY_GEMINI) || "").trim();
}
function saveGeminiApiKey(key) {
  const trimmed = (key || "").trim();
  if (trimmed) localStorage.setItem(STORAGE_KEY_GEMINI, trimmed);
  else localStorage.removeItem(STORAGE_KEY_GEMINI);
  refreshKeyStatusUI();
}

/* ---------------- Header height (untuk offset sticky) ---------------- */
function syncHeaderHeight() {
  const header = document.querySelector(".site-header");
  if (header) {
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }
}
window.addEventListener("resize", syncHeaderHeight);

/* ---------------- Status API key (pill di header + banner lab) ---------------- */
function refreshKeyStatusUI() {
  const hasKey = !!getGeminiApiKey();
  const dot = document.getElementById("key-status-dot");
  const text = document.getElementById("key-status-text");
  const banner = document.getElementById("lab-key-banner");
  const settingsInput = document.getElementById("settings-key-input");

  if (dot) dot.classList.toggle("key-status-on", hasKey);
  if (text) text.textContent = hasKey ? t("header.keystatus.on") : t("header.keystatus.off");
  if (banner) banner.hidden = hasKey;
  if (settingsInput) settingsInput.value = getGeminiApiKey();
}

/* ---------------- Navigasi Topik ---------------- */
function isTopicVisibleInNav(topic) {
  // Mode validasi ahli (lihat js/config.js, VISIBLE_TOPIC_IDS): array
  // kosong berarti tidak ada pembatasan, semua topik tampil seperti biasa.
  if (typeof VISIBLE_TOPIC_IDS === "undefined" || !VISIBLE_TOPIC_IDS.length) return true;
  return VISIBLE_TOPIC_IDS.includes(topic.id);
}

function renderNav() {
  const nav = document.getElementById("topic-nav");
  nav.innerHTML = "";
  ["AS", "A2"].forEach(level => {
    const levelTopics = TOPICS.filter(tp => tp.level === level && isTopicVisibleInNav(tp));
    if (!levelTopics.length) return; // sembunyikan header grup kalau tidak ada topik yang ditampilkan

    const groupTitle = document.createElement("div");
    groupTitle.className = "nav-group-title";
    groupTitle.textContent = level === "AS" ? t("nav.group.as") : t("nav.group.a2");
    nav.appendChild(groupTitle);

    levelTopics.forEach(topic => {
      const btn = document.createElement("button");
      const blocked = isInClassSession() && topic.id !== classSession.topicId;
      const isSessionFocus = isInClassSession() && topic.id === classSession.topicId;
      btn.className = "nav-item" + (blocked ? " session-locked" : "") + (isSessionFocus ? " session-active" : "");
      btn.dataset.id = topic.id;
      btn.innerHTML =
        `<span class="dot ${topic.status === 'ready' ? 'dot-ready' : 'dot-soon'}"></span>` +
        `<span class="num">${topic.number}.</span>` +
        `<span class="label">${trContent(topic.title)}</span>` +
        (isSessionFocus ? `<span class="session-dot" title="${t("nav.sessiondot.title")}"></span>` : "");
      btn.addEventListener("click", () => {
        selectTopic(topic.id);
        btn.blur();
      });
      nav.appendChild(btn);
    });
  });
}

function selectTopic(id) {
  if (isInClassSession() && id !== classSession.topicId) {
    showToast(t("toast.classlocked"));
    return;
  }
  currentTopic = TOPICS.find(tp => tp.id === id);
  if (!currentTopic) return;

  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.id === id);
  });
  document.getElementById("welcome-panel").hidden = true;
  document.getElementById("topic-view").hidden = false;

  // Sidebar otomatis menyempit begitu sebuah topik aktif, supaya konten
  // punya lebih banyak ruang - tetap bisa dibuka lagi lewat hover/tombol pin.
  collapseSidebar();

  document.getElementById("topic-badge").innerHTML =
    `<span class="badge ${currentTopic.level === 'AS' ? 'badge-as' : 'badge-a2'}">${currentTopic.level}</span> ` +
    `<span class="badge ${currentTopic.status === 'ready' ? 'badge-ready' : 'badge-soon'}">${currentTopic.status === 'ready' ? t("badge.ready") : t("badge.soon")}</span>`;
  document.getElementById("topic-title").textContent = `${currentTopic.number}. ${trContent(currentTopic.title)}`;
  document.getElementById("topic-desc").textContent = trContent(currentTopic.desc);

  renderMateri();
  renderEksperimen();
  renderLatihan();
  setupLabForTopic();
  if (currentTopic.status === "ready") checkGateOnTopicOpen(currentTopic.id);

  if (window.Chatbot) Chatbot.setTopic(currentTopic.id);

  // selalu kembali ke tab pertama saat pindah topik
  switchTab("materi");
  document.getElementById("content-area").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("brand-home").addEventListener("click", () => {
  document.getElementById("topic-view").hidden = true;
  document.getElementById("welcome-panel").hidden = false;
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  expandSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------------- Sidebar auto-hide ---------------- */
const topicNavEl = document.getElementById("topic-nav");
const navToggleBtn = document.getElementById("nav-toggle");
let navPeekTimer = null;

function collapseSidebar() {
  document.body.classList.add("nav-collapsed");
  document.body.classList.remove("nav-pinned", "nav-peek");
}
function expandSidebar() {
  document.body.classList.remove("nav-collapsed", "nav-peek", "nav-pinned");
}
navToggleBtn.addEventListener("click", () => {
  const pinned = document.body.classList.toggle("nav-pinned");
  if (pinned) document.body.classList.remove("nav-peek");
});

// Menu topik sepenuhnya tersembunyi begitu sebuah topik aktif (hanya tombol
// bulat #nav-toggle yang terlihat). Meng-hover tombol ATAU panel nav itu
// sendiri memunculkannya sementara sebagai overlay ("nav-peek"); menjauhkan
// mouse dari keduanya (dengan jeda singkat supaya tidak berkedip saat
// berpindah dari tombol ke panel) menyembunyikannya lagi.
function peekSidebar() {
  clearTimeout(navPeekTimer);
  document.body.classList.add("nav-peek");
}
function scheduleHideSidebarPeek() {
  clearTimeout(navPeekTimer);
  navPeekTimer = setTimeout(() => document.body.classList.remove("nav-peek"), 180);
}
[navToggleBtn, topicNavEl].forEach(el => {
  el.addEventListener("mouseenter", peekSidebar);
  el.addEventListener("mouseleave", scheduleHideSidebarPeek);
  el.addEventListener("focusin", peekSidebar);
  el.addEventListener("focusout", scheduleHideSidebarPeek);
});

/* ---------------- Tabs ---------------- */
function switchTab(tabName) {
  if (currentTopic && isTabLocked(currentTopic.id, tabName)) {
    showToast(t("toast.tablocked"));
    return;
  }
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tabName));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + tabName));
  if (currentTopic) {
    updateTopicProgressUI(tabName);
    renderNav(); // status gembok topik lain di sidebar bisa berubah (mis. topik ini baru selesai)
    document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", currentTopic && el.dataset.id === currentTopic.id));
  }
}
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentTopic && isTabLocked(currentTopic.id, btn.dataset.tab)) {
      showToast(t("toast.tablocked"));
      return;
    }
    switchTab(btn.dataset.tab);
  });
});

/* ---------------- Progress bar bertahap ---------------- */
function updateTopicProgressUI(activeTab) {
  const bar = document.getElementById("topic-progress");
  const stepsEl = document.getElementById("progress-steps");
  const nextBtn = document.getElementById("progress-next-btn");
  const finishBtn = document.getElementById("progress-finish-btn");
  if (!currentTopic || currentTopic.status !== "ready") {
    bar.hidden = true;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("locked"));
    return;
  }

  const unlocked = isUnlockAll() ? TAB_ORDER.length - 1 : getUnlockedTabIndex(currentTopic.id);
  const activeIdx = TAB_ORDER.indexOf(activeTab);
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("locked", isTabLocked(currentTopic.id, b.dataset.tab));
  });
  bar.hidden = false;
  stepsEl.innerHTML = TAB_ORDER.map((tab, i) => {
    let state;
    if (i === activeIdx) state = "current";
    else if (i < activeIdx) state = "done";
    else state = (i <= unlocked) ? "unlocked" : "locked";
    return `<span class="progress-step ${state}"><span class="progress-step-dot"></span>${TAB_LABELS[tab]}</span>`;
  }).join(`<span class="progress-step-line"></span>`);

  const isLastTab = activeIdx === TAB_ORDER.length - 1;
  const nextTopicId = nextReadyTopicId(currentTopic.id);
  if (isLastTab) {
    nextBtn.hidden = true;
    finishBtn.hidden = !nextTopicId || isUnlockAll();
  } else if (activeIdx <= unlocked) {
    // "<=" (bukan cuma "===") supaya Next tetap ada di tab yang sudah pernah
    // dilewati juga - perlu karena persetujuan guru di Eksperimen membuka
    // Latihan+Lab SEKALIGUS (unlocked "melompat" 2 tab), jadi begitu siswa
    // ada di tab Latihan, tab itu sendiri sudah "di belakang" unlocked tapi
    // tetap harus punya tombol Next ke Lab.
    finishBtn.hidden = true;
    // Selama permintaan konfirmasi Eksperimen masih "pending" di guru,
    // sembunyikan tombol Next - siswa tinggal menunggu (lihat gate-banner)
    // sampai disetujui/ditolak, tidak perlu (dan tidak boleh) submit ulang.
    const eksGate = activeTab === "eksperimen" ? getGateCacheEntry(currentTopic.id, "eksperimen") : null;
    if (eksGate && eksGate.status === "pending") {
      nextBtn.hidden = true;
    } else {
      nextBtn.hidden = false;
      document.getElementById("progress-next-label").textContent = TAB_LABELS[TAB_ORDER[activeIdx + 1]];
    }
  } else {
    nextBtn.hidden = true;
    finishBtn.hidden = true;
  }
}
document.getElementById("progress-next-btn").addEventListener("click", () => {
  if (!currentTopic) return;
  const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
  const activeIdx = TAB_ORDER.indexOf(activeTab);
  const unlocked = isUnlockAll() ? TAB_ORDER.length - 1 : getUnlockedTabIndex(currentTopic.id);
  // Kalau tab ini sudah PERNAH dilewati sebelumnya (mis. Eksperimen yang
  // sudah disetujui guru - yang otomatis membuka Latihan+Lab sekaligus
  // sehingga unlocked "melompat" duluan - atau Materi yang dibuka ulang),
  // tidak perlu tanya ulang pertanyaan konfirmasinya, langsung next saja.
  const alreadyPassed = activeIdx < unlocked;

  // Materi: siswa harus jawab benar pertanyaan konfirmasi dulu (dinilai
  // otomatis di klien) baru boleh lanjut ke Eksperimen - tanpa guru.
  if (activeTab === "materi" && !alreadyPassed) {
    startMateriGate(() => {
      advanceProgress(currentTopic.id, activeIdx + 1);
      switchTab(TAB_ORDER[activeIdx + 1]);
    });
    return;
  }
  // Eksperimen: jawab pertanyaan hubungan antar variabel & pengelolaan data
  // dulu (dinilai otomatis), lalu dikirim ke guru untuk konfirmasi. Progress
  // BELUM maju di sini - baru maju lewat handleGateDecision() begitu guru
  // menyetujui (yang otomatis membuka Latihan Soal + Lab sekaligus).
  if (activeTab === "eksperimen" && !alreadyPassed) {
    // Kalau topik ini punya tabel data interaktif, siswa WAJIB mengisi &
    // menyimpannya minimal sekali dulu sebelum pertanyaan konfirmasi
    // Eksperimen boleh dibuka - lihat wireEksperimenDataTable().
    const needsData = currentTopic.eksperimen && currentTopic.eksperimen.dataTable;
    if (needsData && !getEksperimenDataSavedFlag(currentTopic.id)) {
      showToast(t("toast.eksdata.required"));
      return;
    }
    startEksperimenGate();
    return;
  }
  // Latihan Soal -> Lab Simulasi (langsung next tanpa pertanyaan konfirmasi
  // maupun persetujuan guru, sesuai permintaan user), atau tab manapun yang
  // sudah pernah dilewati sebelumnya: next langsung.
  advanceProgress(currentTopic.id, activeIdx + 1);
  switchTab(TAB_ORDER[activeIdx + 1]);
});
document.getElementById("progress-finish-btn").addEventListener("click", () => {
  const nextId = currentTopic ? nextReadyTopicId(currentTopic.id) : null;
  if (nextId) selectTopic(nextId);
});

/* ---------------- Panel: Materi ---------------- */
function renderMateri() {
  const panel = document.getElementById("panel-materi");
  if (currentTopic.status === "ready" && currentTopic.materiHTML) {
    panel.innerHTML = pjblStageHTML("materi") + trContent(currentTopic.materiHTML);
  } else {
    panel.innerHTML = comingSoonHTML("materi");
  }
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([panel]);
  }
}

/* ---------------- Panel: Eksperimen ---------------- */
function renderEksperimen() {
  const panel = document.getElementById("panel-eksperimen");
  if (currentTopic.status === "ready" && currentTopic.eksperimen) {
    const ex = currentTopic.eksperimen;
    panel.innerHTML = pjblStageHTML("eksperimen") +
      `<div id="eksperimen-gate-banner" class="gate-banner" hidden></div>` +
      `<h3>${trContent(ex.title)}</h3>${trContent(ex.intro)}` +
      (ex.simHTML ? `<div class="sim-embed"><iframe sandbox="allow-scripts" srcdoc="${escapeAttr(ex.simHTML)}"></iframe></div>` : "") +
      (ex.dataTable ? renderEksperimenDataTableHTML(ex.dataTable) : "");
    renderGateBanner("eksperimen");
    if (ex.dataTable) wireEksperimenDataTable(ex.dataTable);
  } else {
    panel.innerHTML = comingSoonHTML("eksperimen");
  }
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([panel]);
  }
}

/* ---------------- Tabel Data Eksperimen (interaktif) ---------------- */
// Ditambahkan supaya siswa mengisi data pengamatan LANGSUNG di browser
// (bukan lagi di kertas terpisah seperti tabel contoh statis di atas).
// Klik "Simpan Data" mem-POST ke backend (mode "eksperimen_data_save"):
// data ditulis ke spreadsheet bersama (satu sheet per siswa) DAN, kalau
// API key Gemini sudah diisi, AI memeriksa kewajaran datanya dan memberi
// umpan balik singkat - baik status simpan maupun umpan balik ditampilkan
// lokal tepat di bawah tombol (bukan ke #generate-status yang jauh),
// mengikuti pola status-lokal yang sudah dipakai "Edit Simulasi Ini" di
// tab Lab supaya pesannya tidak pernah terlewat siswa.
function renderEksperimenDataTableHTML(dt) {
  const rowsHTML = dt.independentValues.map((iVal, ri) => {
    const repCells = Array.from({ length: dt.replicateCount }, (_, ci) =>
      `<td><input type="number" step="any" class="eks-dt-input" data-row="${ri}" data-col="${ci}" aria-label="${dt.replicateLabel} #${ci + 1}"></td>`
    ).join("");
    return `<tr data-row="${ri}" data-i="${iVal}">` +
      `<td class="eks-dt-i">${String(iVal).replace(".", ",")}</td>` +
      repCells +
      `<td class="eks-dt-avg" data-row="${ri}">-</td>` +
      `<td class="eks-dt-f" data-row="${ri}">-</td>` +
      `</tr>`;
  }).join("");
  const repHeaders = Array.from({ length: dt.replicateCount }, (_, ci) =>
    `<th>${dt.replicateLabel}<sub>${ci + 1}</sub></th>`
  ).join("");
  return `
    <div class="eks-datatable-section">
      <h4>${t("eksdata.title")}</h4>
      <p class="muted">${t("eksdata.desc")}</p>
      <table class="eks-datatable">
        <thead><tr><th>${dt.independentLabel}</th>${repHeaders}<th>${dt.replicateLabel} rata-rata</th><th>${dt.derivedLabel}</th></tr></thead>
        <tbody>${rowsHTML}</tbody>
      </table>
      <button type="button" id="eks-dt-save-btn" class="btn btn-primary btn-small">${t("eksdata.savebtn")}</button>
      <p id="eks-dt-status" class="eks-dt-status"></p>
    </div>`;
}
function recalcEksperimenRow(tr, replicateCount) {
  const row = tr.dataset.row;
  const inputs = tr.querySelectorAll(".eks-dt-input");
  const nums = Array.from(inputs).map(i => parseFloat(i.value)).filter(n => !isNaN(n));
  const avgCell = tr.querySelector(".eks-dt-avg");
  const fCell = tr.querySelector(".eks-dt-f");
  if (nums.length) {
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    const F = (avg / 1000) * 9.81;
    avgCell.textContent = avg.toFixed(3);
    fCell.textContent = F.toFixed(4);
  } else {
    avgCell.textContent = "-";
    fCell.textContent = "-";
  }
}
function wireEksperimenDataTable(dt) {
  const panel = document.getElementById("panel-eksperimen");
  const table = panel.querySelector(".eks-datatable");
  const saveBtn = document.getElementById("eks-dt-save-btn");
  const statusEl = document.getElementById("eks-dt-status");
  if (!table || !saveBtn) return;

  table.addEventListener("input", (e) => {
    if (!e.target.classList.contains("eks-dt-input")) return;
    recalcEksperimenRow(e.target.closest("tr"), dt.replicateCount);
  });

  saveBtn.addEventListener("click", async () => {
    const rows = Array.from(table.querySelectorAll("tbody tr")).map(tr => {
      const values = Array.from(tr.querySelectorAll(".eks-dt-input")).map(i => i.value.trim());
      return { I: parseFloat(tr.dataset.i), values };
    });
    const filledRows = rows.filter(r => r.values.some(v => v !== ""));
    if (!filledRows.length) {
      statusEl.className = "eks-dt-status eks-dt-status-warn";
      statusEl.textContent = t("eksdata.empty");
      return;
    }
    saveBtn.disabled = true;
    statusEl.className = "eks-dt-status";
    statusEl.textContent = t("eksdata.saving");
    const backendUrl = getBackendUrl();
    if (!backendUrl) {
      statusEl.className = "eks-dt-status eks-dt-status-warn";
      statusEl.textContent = t("eksdata.nobackend");
      saveBtn.disabled = false;
      return;
    }
    try {
      const resp = await fetch(backendUrl, {
        method: "POST", headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          mode: "eksperimen_data_save",
          topicId: currentTopic.id,
          studentId: getStudentId(),
          apiKey: getGeminiApiKey(),
          context: dt.context,
          rows: rows.map(r => ({ I: r.I, values: r.values.map(v => v === "" ? null : parseFloat(v)) }))
        })
      });
      const data = await resp.json();
      if (data.error) {
        statusEl.className = "eks-dt-status eks-dt-status-warn";
        statusEl.textContent = data.error;
      } else {
        setEksperimenDataSavedFlag(currentTopic.id, true);
        statusEl.className = "eks-dt-status " + (data.flagged ? "eks-dt-status-warn" : "eks-dt-status-ok");
        statusEl.textContent = (data.sheetError ? (t("eksdata.sheeterror") + " ") : t("eksdata.saved") + " ") + (data.feedback || "");
      }
    } catch (e) {
      statusEl.className = "eks-dt-status eks-dt-status-warn";
      statusEl.textContent = t("eksdata.networkerror");
    }
    saveBtn.disabled = false;
  });
}
function getEksperimenDataSavedFlag(topicId) {
  try {
    const map = JSON.parse(localStorage.getItem(STORAGE_KEY_EKSDATA_SAVED) || "{}");
    return !!map[topicId];
  } catch (e) { return false; }
}
function setEksperimenDataSavedFlag(topicId, val) {
  let map = {};
  try { map = JSON.parse(localStorage.getItem(STORAGE_KEY_EKSDATA_SAVED) || "{}"); } catch (e) { /* abaikan */ }
  map[topicId] = val;
  localStorage.setItem(STORAGE_KEY_EKSDATA_SAVED, JSON.stringify(map));
}

/* ---------------- Panel: Latihan Soal ---------------- */
function renderLatihan() {
  const panel = document.getElementById("panel-latihan");
  if (currentTopic.status === "ready" && currentTopic.latihan && currentTopic.latihan.length) {
    panel.innerHTML = pjblStageHTML("latihan") + currentTopic.latihan.map((q, i) => {
      let optionsHTML = "";
      if (q.type === "mcq") {
        optionsHTML = `<ul class="options">${q.options.map((opt, oi) =>
          `<li>${String.fromCharCode(65 + oi)}. ${trContent(opt)}${oi === q.correct ? ` <span class="muted">${t("answer.correct")}</span>` : ''}</li>`
        ).join("")}</ul>`;
      }
      return `
        <div class="question-card">
          <div class="q-title">${t("question.label", { n: i + 1 })}</div>
          <div>${trContent(q.question)}</div>
          ${optionsHTML}
          <button class="reveal-btn" onclick="this.nextElementSibling.classList.toggle('show')">${t("question.reveal")}</button>
          <div class="solution"><strong>${t("question.solution")}</strong><br>${trContent(q.solution)}</div>
        </div>`;
    }).join("");
  } else {
    panel.innerHTML = comingSoonHTML("latihan");
  }
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([panel]);
  }
}

function comingSoonHTML(section) {
  return `<p class="muted">${t("content.comingsoon", { section: t("content.section." + section) })}</p>`;
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/* ---------------- Panel: Lab Simulasi Virtual ---------------- */
function setupLabForTopic() {
  const select = document.getElementById("pf-concept");
  const concepts = (currentTopic.labConcepts && currentTopic.labConcepts.length)
    ? currentTopic.labConcepts : DEFAULT_LAB_CONCEPTS;
  select.innerHTML = concepts.map(c => {
    const label = trContent(c);
    return `<option value="${escapeAttr(label)}">${label}</option>`;
  }).join("");

  // Reset SELURUH form generator prompt setiap ganti topik - termasuk
  // variabel/tujuan/instruksi tambahan yang diketik manual - supaya teks
  // dari topik/konsep sebelumnya tidak pernah tercampur/ketinggalan dan
  // secara diam-diam mengubah hasil generate topik yang baru dipilih.
  document.getElementById("pf-variables").value = "";
  document.getElementById("pf-goal").value = "";
  document.getElementById("pf-extra").value = "";
  document.getElementById("pf-vistype").selectedIndex = 0;
  document.getElementById("pf-level").selectedIndex = 1;
  document.getElementById("final-prompt").value = "";
  document.getElementById("preview-frame").removeAttribute("srcdoc");
  document.getElementById("preview-frame").hidden = false;
  document.getElementById("code-editor").value = "";
  document.getElementById("code-editor").hidden = true;
  document.getElementById("toggle-code-label").textContent = t("lab.togglecode.view");
  document.getElementById("generate-status").textContent = "";
  document.getElementById("mode-banner").hidden = true;
  ["rerun-btn", "toggle-code-btn", "download-btn"].forEach(id => document.getElementById(id).disabled = true);
  document.getElementById("lab-edit-followup").hidden = true;
  document.getElementById("edit-followup-input").value = "";
  document.getElementById("edit-followup-status").textContent = "";
  resetEditCount();
  refreshKeyStatusUI();

  // Refleksi/validasi Lab (checkpoint kedua guru) - hanya relevan untuk
  // topik "ready" yang memang punya alur progres bertahap; topik "segera
  // hadir" belum punya penilaian bertahap jadi bagian ini disembunyikan.
  const isReady = currentTopic.status === "ready";
  const reflectionSection = document.getElementById("lab-reflection-section");
  const reflectionInput = document.getElementById("lab-reflection-input");
  const reflectionStatus = document.getElementById("lab-reflection-status");
  if (reflectionSection) reflectionSection.hidden = !isReady;
  if (reflectionInput) { reflectionInput.value = ""; reflectionInput.disabled = false; }
  if (reflectionStatus) reflectionStatus.textContent = "";
  const reflectionSubmitBtn = document.getElementById("lab-reflection-submit-btn");
  if (reflectionSubmitBtn) reflectionSubmitBtn.hidden = false;
  if (isReady) {
    renderGateBanner("lab");
  } else {
    const banner = document.getElementById("lab-gate-banner");
    if (banner) { banner.hidden = true; banner.innerHTML = ""; }
  }

  setupVirtualLabForTopic();
}

/* ---------------- Praktikum Virtual (tab Lab, tanpa alat) ----------------
   Eksperimen TAMBAHAN untuk topik yang punya currentTopic.virtualLab (lihat
   MAGNETIC_VIRTUAL_LAB di js/content.js) - opsi bagi sekolah yang belum
   punya alat sederhana maupun alat lab untuk praktikum terkait. Berbeda dari
   "Generator Prompt Terstruktur" di bawahnya (yang generatif/AI dan butuh
   API key + backend), kartu ini MURNI klien: arus & pembacaan neraca
   disimulasikan dengan JS biasa, data disimpan hanya di localStorage
   browser siswa - TIDAK PERNAH memanggil backend, jadi tidak menambah
   ketergantungan apa pun pada apps-script/Code.gs yang sudah ada. */
function setupVirtualLabForTopic() {
  const card = document.getElementById("lab-vlab-card");
  if (!card) return;
  if (currentTopic.status === "ready" && currentTopic.virtualLab) {
    card.hidden = false;
    card.innerHTML = renderVirtualLabHTML(currentTopic.virtualLab);
    wireVirtualLab(currentTopic);
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([card]);
    }
  } else {
    card.hidden = true;
    card.innerHTML = "";
  }
}

// B "sungguhan" alat virtual dirandom SEKALI per siswa per topik, lalu
// disimpan supaya tidak berubah-ubah tiap kali siswa buka ulang topiknya
// (persis seperti satu set magnet Magnadur sungguhan yang nilainya tetap).
function getVirtualLabTrueB(topic) {
  let map = {};
  try { map = JSON.parse(localStorage.getItem(STORAGE_KEY_VLAB_TRUEB) || "{}"); } catch (e) { /* abaikan */ }
  if (typeof map[topic.id] === "number" && !isNaN(map[topic.id])) return map[topic.id];
  const { bTrueMin, bTrueMax } = topic.virtualLab.apparatus;
  const b = bTrueMin + Math.random() * (bTrueMax - bTrueMin);
  map[topic.id] = b;
  localStorage.setItem(STORAGE_KEY_VLAB_TRUEB, JSON.stringify(map));
  return b;
}

function getVirtualLabSavedData(topicId) {
  try {
    const map = JSON.parse(localStorage.getItem(STORAGE_KEY_VLAB_DATA) || "{}");
    return map[topicId] || null;
  } catch (e) { return null; }
}
function setVirtualLabSavedData(topicId, data) {
  let map = {};
  try { map = JSON.parse(localStorage.getItem(STORAGE_KEY_VLAB_DATA) || "{}"); } catch (e) { /* abaikan */ }
  map[topicId] = data;
  localStorage.setItem(STORAGE_KEY_VLAB_DATA, JSON.stringify(map));
}

// Simulasi pembacaan neraca (gram): F = B x I x L sungguhan, ditambah noise
// multiplikatif+aditif kecil supaya tiap pembacaan sedikit berbeda-beda
// (meniru fluktuasi neraca elektronik sungguhan), lalu dibulatkan ke 0,01 g
// mengikuti ketelitian neraca timbang elektronik pada eksperimen nyata.
function computeVirtualReadingGrams(topic, I) {
  const { lengthM, noiseFrac, noiseAbsG } = topic.virtualLab.apparatus;
  const B = getVirtualLabTrueB(topic);
  const trueF = B * I * lengthM;
  const trueGrams = (trueF / 9.81) * 1000;
  const noisy = trueGrams * (1 + (Math.random() - 0.5) * 2 * noiseFrac) + (Math.random() - 0.5) * 2 * noiseAbsG;
  return Math.max(0, noisy);
}

function renderVirtualLabHTML(vl) {
  const dt = vl.dataTable;
  const rowsHTML = dt.independentValues.map((iVal, ri) => {
    const repCells = Array.from({ length: dt.replicateCount }, (_, ci) =>
      `<td><input type="number" step="any" class="eks-dt-input vlab-dt-input" data-row="${ri}" data-col="${ci}" readonly aria-label="${dt.replicateLabel} #${ci + 1}"></td>`
    ).join("");
    return `<tr data-row="${ri}" data-i="${iVal}">` +
      `<td class="eks-dt-i">${String(iVal).replace(".", ",")}</td>` +
      repCells +
      `<td class="eks-dt-avg" data-row="${ri}">-</td>` +
      `<td class="eks-dt-f" data-row="${ri}">-</td>` +
      `</tr>`;
  }).join("");
  const repHeaders = Array.from({ length: dt.replicateCount }, (_, ci) =>
    `<th>${dt.replicateLabel}<sub>${ci + 1}</sub></th>`
  ).join("");
  const currentOptionsHTML = dt.independentValues.map(v =>
    `<option value="${v}">${String(v).replace(".", ",")} A</option>`
  ).join("");

  return `
    <span class="badge badge-soon">${t("vlab.badgelabel")}</span>
    <h3 style="margin-top:10px;">${trContent(vl.title)}</h3>
    ${trContent(vl.intro)}

    <div class="vlab-apparatus">
      <p><strong>${t("vlab.apparatus.length")}:</strong> $L$ = ${vl.apparatus.lengthM.toFixed(4)} m
        (${(vl.apparatus.lengthM * 100).toFixed(2)} cm)</p>
      <label>${t("vlab.current.label")}
        <select id="vlab-current-select">${currentOptionsHTML}</select>
      </label>
      <button type="button" id="vlab-read-btn" class="btn btn-secondary btn-small">${t("vlab.readbtn")}</button>
      <p id="vlab-reading-status"></p>
    </div>

    <div class="eks-datatable-section">
      <h4>${t("eksdata.title")}</h4>
      <table class="eks-datatable" id="vlab-datatable">
        <thead><tr><th>${dt.independentLabel}</th>${repHeaders}<th>${dt.replicateLabel} rata-rata</th><th>${dt.derivedLabel}</th></tr></thead>
        <tbody>${rowsHTML}</tbody>
      </table>
      <svg id="vlab-graph" class="vlab-graph" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet"></svg>
    </div>

    <div class="prompt-form">
      <label>${t("vlab.hypothesis.label")}
        <textarea id="vlab-hypothesis" rows="2" placeholder="${escapeAttr(t("vlab.hypothesis.placeholder"))}"></textarea>
      </label>

      <div class="vlab-calc-row">
        <label>${t("vlab.gradient.label")}
          <input type="text" id="vlab-gradient-input" inputmode="decimal">
        </label>
        <label>${t("vlab.bvalue.label")}
          <input type="text" id="vlab-b-input" inputmode="decimal">
        </label>
      </div>
      <button type="button" id="vlab-check-btn" class="btn btn-secondary btn-small">${t("vlab.checkbtn")}</button>
      <p id="vlab-check-status" class="muted small"></p>

      <label>${t("vlab.conclusion.label")}
        <textarea id="vlab-conclusion" rows="2"></textarea>
      </label>
    </div>

    <button type="button" id="vlab-save-btn" class="btn btn-primary btn-small">${t("vlab.savebtn")}</button>
    <p id="vlab-save-status" class="eks-dt-status"></p>
  `;
}

function recalcVlabRow(tr) {
  const inputs = tr.querySelectorAll(".vlab-dt-input");
  const nums = Array.from(inputs).map(i => parseFloat(i.value)).filter(n => !isNaN(n));
  const avgCell = tr.querySelector(".eks-dt-avg");
  const fCell = tr.querySelector(".eks-dt-f");
  if (nums.length) {
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    const F = (avg / 1000) * 9.81;
    avgCell.textContent = avg.toFixed(3);
    fCell.textContent = F.toFixed(4);
  } else {
    avgCell.textContent = "-";
    fCell.textContent = "-";
  }
  drawVlabGraph();
}

function drawVlabGraph() {
  const svg = document.getElementById("vlab-graph");
  const table = document.getElementById("vlab-datatable");
  if (!svg || !table) return;
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const points = rows.map(tr => {
    const I = parseFloat(tr.dataset.i);
    const F = parseFloat(tr.querySelector(".eks-dt-f").textContent);
    return isNaN(F) ? null : { I, F };
  }).filter(Boolean);

  const W = 320, H = 220, padL = 38, padB = 30, padT = 12, padR = 14;
  let html = `<line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="var(--border)" stroke-width="1.5"/>` +
    `<line x1="${padL}" y1="${H - padB}" x2="${padL}" y2="${padT}" stroke="var(--border)" stroke-width="1.5"/>` +
    `<text x="${(W + padL - padR) / 2}" y="${H - 8}" font-size="10" fill="var(--muted)" text-anchor="middle">${t("vlab.graph.axis.i")}</text>` +
    `<text x="6" y="${padT + 4}" font-size="10" fill="var(--muted)">${t("vlab.graph.axis.f")}</text>`;
  if (points.length) {
    const maxI = Math.max(...points.map(p => p.I)) * 1.15 || 1;
    const maxF = Math.max(...points.map(p => p.F)) * 1.25 || 0.01;
    const xScale = (I) => padL + (I / maxI) * (W - padL - padR);
    const yScale = (F) => (H - padB) - (F / maxF) * (H - padB - padT);
    html += points.map(p =>
      `<circle cx="${xScale(p.I).toFixed(1)}" cy="${yScale(p.F).toFixed(1)}" r="4" fill="var(--accent)"/>`
    ).join("");
  }
  svg.innerHTML = html;
}

function wireVirtualLab(topic) {
  const vl = topic.virtualLab;
  const card = document.getElementById("lab-vlab-card");
  if (!card) return;
  const table = card.querySelector("#vlab-datatable");
  const select = card.querySelector("#vlab-current-select");
  const readBtn = card.querySelector("#vlab-read-btn");
  const readingStatus = card.querySelector("#vlab-reading-status");
  const checkBtn = card.querySelector("#vlab-check-btn");
  const checkStatus = card.querySelector("#vlab-check-status");
  const saveBtn = card.querySelector("#vlab-save-btn");
  const saveStatus = card.querySelector("#vlab-save-status");
  const hypInput = card.querySelector("#vlab-hypothesis");
  const gradInput = card.querySelector("#vlab-gradient-input");
  const bInput = card.querySelector("#vlab-b-input");
  const conclInput = card.querySelector("#vlab-conclusion");

  readBtn.addEventListener("click", () => {
    const I = parseFloat(select.value);
    const tr = Array.from(table.querySelectorAll("tbody tr"))
      .find(row => Math.abs(parseFloat(row.dataset.i) - I) < 1e-9);
    if (!tr) return;
    const inputs = Array.from(tr.querySelectorAll(".vlab-dt-input"));
    const emptyInput = inputs.find(i => i.value.trim() === "");
    if (!emptyInput) {
      readingStatus.textContent = t("vlab.rowfull");
      return;
    }
    const grams = computeVirtualReadingGrams(topic, I);
    emptyInput.value = grams.toFixed(2);
    readingStatus.textContent = t("vlab.reading.result", { grams: grams.toFixed(2) });
    recalcVlabRow(tr);
  });

  table.addEventListener("input", (e) => {
    if (!e.target.classList.contains("vlab-dt-input")) return;
    recalcVlabRow(e.target.closest("tr"));
  });

  checkBtn.addEventListener("click", () => {
    const rows = Array.from(table.querySelectorAll("tbody tr")).map(tr => {
      const I = parseFloat(tr.dataset.i);
      const F = parseFloat(tr.querySelector(".eks-dt-f").textContent);
      return isNaN(F) ? null : { I, F };
    }).filter(Boolean);
    if (rows.length < 3) {
      checkStatus.textContent = t("vlab.checkneeddata");
      return;
    }
    const n = rows.length;
    const sumX = rows.reduce((a, r) => a + r.I, 0);
    const sumY = rows.reduce((a, r) => a + r.F, 0);
    const sumXY = rows.reduce((a, r) => a + r.I * r.F, 0);
    const sumX2 = rows.reduce((a, r) => a + r.I * r.I, 0);
    const denom = (n * sumX2 - sumX * sumX);
    const gradient = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
    const B = gradient / vl.apparatus.lengthM;
    checkStatus.textContent = t("vlab.checkresult", { grad: gradient.toFixed(4), b: B.toFixed(3) });
  });

  saveBtn.addEventListener("click", () => {
    const rows = Array.from(table.querySelectorAll("tbody tr")).map(tr => ({
      I: parseFloat(tr.dataset.i),
      values: Array.from(tr.querySelectorAll(".vlab-dt-input")).map(i => i.value.trim())
    }));
    const filledRows = rows.filter(r => r.values.some(v => v !== ""));
    if (!filledRows.length || !hypInput.value.trim()) {
      saveStatus.className = "eks-dt-status eks-dt-status-warn";
      saveStatus.textContent = t("vlab.empty");
      return;
    }
    setVirtualLabSavedData(topic.id, {
      hypothesis: hypInput.value.trim(),
      rows,
      gradient: gradInput.value.trim(),
      bValue: bInput.value.trim(),
      conclusion: conclInput.value.trim(),
      savedAt: new Date().toISOString()
    });
    saveStatus.className = "eks-dt-status eks-dt-status-ok";
    saveStatus.textContent = t("vlab.saved");
  });

  // Pulihkan data tersimpan sebelumnya (kalau ada) supaya siswa tidak
  // kehilangan progres saat pindah tab/topik lalu kembali lagi ke sini.
  const saved = getVirtualLabSavedData(topic.id);
  if (saved) {
    hypInput.value = saved.hypothesis || "";
    gradInput.value = saved.gradient || "";
    bInput.value = saved.bValue || "";
    conclInput.value = saved.conclusion || "";
    (saved.rows || []).forEach(r => {
      const tr = Array.from(table.querySelectorAll("tbody tr"))
        .find(row => Math.abs(parseFloat(row.dataset.i) - r.I) < 1e-9);
      if (!tr) return;
      const inputs = tr.querySelectorAll(".vlab-dt-input");
      (r.values || []).forEach((v, ci) => { if (inputs[ci]) inputs[ci].value = v; });
      recalcVlabRow(tr);
    });
  } else {
    drawVlabGraph();
  }
}

function resetEditCount() {
  editCount = 0;
  updateEditCounterUI();
}
function updateEditCounterUI() {
  const counter = document.getElementById("edit-followup-counter");
  const btn = document.getElementById("edit-followup-btn");
  const input = document.getElementById("edit-followup-input");
  const remaining = MAX_FOLLOWUP_EDITS - editCount;
  if (remaining > 0) {
    counter.textContent = t("lab.editfollowup.remaining", { n: remaining, max: MAX_FOLLOWUP_EDITS });
  } else {
    counter.textContent = t("lab.editfollowup.limitreached", { max: MAX_FOLLOWUP_EDITS });
  }
  btn.disabled = remaining <= 0;
  input.disabled = remaining <= 0;
}

// Ganti konsep fisika spesifik juga membersihkan variabel/tujuan/instruksi
// tambahan - field-field itu biasanya ditulis khusus untuk satu konsep, jadi
// membiarkannya menempel ke konsep lain gampang bikin prompt akhir jadi
// campur aduk (mis. tujuan pembelajaran tentang gerak melingkar tertinggal
// padahal konsep yang dipilih sekarang GLBB atau jatuh bebas).
document.getElementById("pf-concept").addEventListener("change", () => {
  document.getElementById("pf-variables").value = "";
  document.getElementById("pf-goal").value = "";
  document.getElementById("pf-extra").value = "";
});

document.getElementById("pf-build-btn").addEventListener("click", () => {
  const concept = document.getElementById("pf-concept").value;
  const vistype = document.getElementById("pf-vistype").value;
  const variables = document.getElementById("pf-variables").value.trim();
  const goal = document.getElementById("pf-goal").value.trim();
  const level = document.getElementById("pf-level").value;
  const extra = document.getElementById("pf-extra").value.trim();

  const topicTitle = trContent(currentTopic.title);
  let prompt = t("promptgen.header", { topic: topicTitle, concept: concept });
  prompt += t("promptgen.langdirective");
  prompt += t("promptgen.mainfocus", { concept: concept });
  prompt += t("promptgen.vistype", { vistype: vistype });
  if (variables) {
    prompt += t("promptgen.variables", { variables: variables });
  }
  if (goal) {
    prompt += t("promptgen.goal", { concept: concept, goal: goal });
  }
  prompt += t("promptgen.level", { level: level });
  prompt += t("promptgen.footer");
  if (extra) {
    prompt += t("promptgen.extra", { extra: extra });
  }

  // "Grounding": tempelkan rumus/konsep topik yang sudah divalidasi guru
  // supaya AI memakai nilai & rumus yang tepat, bukan menebak dari memori umum.
  if (currentTopic.formulaSheet) {
    prompt += t("promptgen.formularef", { sheet: trContent(currentTopic.formulaSheet) });
  }

  document.getElementById("final-prompt").value = prompt;
});

document.getElementById("generate-btn").addEventListener("click", async () => {
  const promptText = document.getElementById("final-prompt").value.trim();
  const status = document.getElementById("generate-status");
  const banner = document.getElementById("mode-banner");
  const backendUrl = getBackendUrl();
  const apiKey = getGeminiApiKey();

  if (!promptText) {
    status.textContent = t("lab.generate.needprompt");
    return;
  }

  if (!apiKey) {
    status.textContent = "";
    banner.hidden = false;
    banner.innerHTML = t("lab.generate.needkey");
    document.getElementById("mode-banner-key-btn").addEventListener("click", openSettingsModal);
    return;
  }

  if (!backendUrl) {
    status.textContent = "";
    banner.hidden = false;
    banner.textContent = t("lab.generate.needbackend");
    return;
  }

  status.textContent = t("lab.generate.loading");
  banner.hidden = true;
  document.getElementById("generate-btn").disabled = true;

  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      // Content-Type text/plain sengaja dipakai agar tidak memicu CORS preflight
      // ke Google Apps Script (lihat catatan di apps-script/Code.gs & README.md)
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ prompt: promptText, apiKey: apiKey })
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error);
    let html = (data.html || "").trim();
    html = stripCodeFence(html);

    // Pengecekan dasar supaya HTML yang jelas-jelas rusak/terpotong tidak
    // langsung ditampilkan seolah berhasil (dulu ini bikin bingung: preview
    // kosong, animasi/kalkulasi tidak jalan, dan kode yang muncul saat
    // "Lihat Kode" cuma potongan tidak lengkap tanpa penjelasan kenapa).
    const problem = checkGeneratedHtml(html);
    setPreview(html);
    resetEditCount();
    if (problem) {
      status.textContent = problem + t("lab.generate.retryhint");
    } else {
      status.textContent = data.warning ? data.warning : t("lab.generate.success");
    }
  } catch (err) {
    status.textContent = t("lab.generate.failed") + err.message + t("lab.generate.failedsuffix");
  } finally {
    document.getElementById("generate-btn").disabled = false;
  }
});

document.getElementById("demo-btn").addEventListener("click", () => {
  const promptText = document.getElementById("final-prompt").value.trim();
  const status = document.getElementById("generate-status");
  const banner = document.getElementById("mode-banner");
  status.textContent = "";
  banner.hidden = false;
  banner.textContent = t("lab.demo.active");
  const html = getDemoSimHTML(promptText);
  setPreview(html);
  resetEditCount();
});

// PENTING: pesan status untuk aksi ini SENGAJA ditampilkan di elemen lokal
// #edit-followup-status (tepat di bawah tombol ini), BUKAN di #generate-status
// / #mode-banner yang letaknya jauh di atas (dekat tombol Generate Simulasi).
// Panel "Prompt Lanjutan" ini muncul di BAWAH preview simulasi yang bisa
// cukup tinggi, jadi kalau pesan hasil klik ditulis ke elemen yang jauh di
// atas, siswa yang sedang melihat tombol ini di layar tidak akan pernah
// melihat pesannya tanpa scroll manual ke atas - dari sudut pandang siswa
// ini terlihat PERSIS seperti "tombol tidak melakukan apa-apa" walau
// sebenarnya requestnya berjalan (berhasil ATAU gagal) di baliknya. Dulu
// pernah dilaporkan bug "klik Edit Simulasi Ini, tidak terjadi apa-apa,
// sisa edit tetap 5/5" - root cause-nya persis ini (dikombinasikan dengan
// kemungkinan request yang gagal di background karena Gemini overload,
// yang pesan error-nya juga tidak pernah terlihat karena masalah yang sama).
document.getElementById("edit-followup-btn").addEventListener("click", async () => {
  const instruction = document.getElementById("edit-followup-input").value.trim();
  const status = document.getElementById("edit-followup-status");
  const backendUrl = getBackendUrl();
  const apiKey = getGeminiApiKey();

  if (editCount >= MAX_FOLLOWUP_EDITS) {
    status.textContent = t("lab.editfollowup.limitreached", { max: MAX_FOLLOWUP_EDITS });
    return;
  }
  if (!lastGeneratedHTML) {
    status.textContent = t("lab.editfollowup.needsim");
    return;
  }
  if (!instruction) {
    status.textContent = t("lab.editfollowup.needinstruction");
    return;
  }
  if (!apiKey) {
    status.innerHTML = t("lab.editfollowup.needkey");
    document.getElementById("edit-followup-key-btn").addEventListener("click", openSettingsModal);
    return;
  }
  if (!backendUrl) {
    status.textContent = t("lab.editfollowup.needbackend");
    return;
  }

  const editPrompt = t("promptgen.editheader", {
    html: lastGeneratedHTML,
    langdirective: t("promptgen.editlangdirective"),
    instruction: instruction
  });

  status.textContent = t("lab.editfollowup.loading", { n: editCount + 1, max: MAX_FOLLOWUP_EDITS });
  document.getElementById("edit-followup-btn").disabled = true;

  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ mode: "edit", prompt: editPrompt, apiKey: apiKey })
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error);
    let html = (data.html || "").trim();
    html = stripCodeFence(html);
    const problem = checkGeneratedHtml(html);
    setPreview(html);
    editCount += 1;
    updateEditCounterUI();
    document.getElementById("edit-followup-input").value = "";
    status.textContent = problem
      ? problem + t("lab.editfollowup.retryhint")
      : t("lab.editfollowup.success");
  } catch (err) {
    status.textContent = t("lab.editfollowup.failed") + err.message + t("lab.editfollowup.failedsuffix");
  } finally {
    updateEditCounterUI();
  }
});

function stripCodeFence(html) {
  return html.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/i, "");
}

// Pengecekan ringan (bukan parser lengkap) untuk menangkap kasus paling umum
// HTML hasil AI yang rusak/terpotong, supaya siswa dapat pesan yang jelas
// alih-alih preview kosong atau kode setengah jadi tanpa keterangan.
// Mengembalikan string pesan masalah, atau null kalau terlihat aman.
function checkGeneratedHtml(html) {
  if (!html || html.length < 200) {
    return t("check.htmltooshort");
  }
  if (!/<\/html>\s*$/i.test(html)) {
    return t("check.htmltruncated");
  }
  if (!/<script[\s>]/i.test(html)) {
    return t("check.noscript");
  }
  // Cek kasar keseimbangan kurung kurawal di dalam <script>: kalau sangat
  // tidak seimbang, hampir pasti ada JavaScript yang terpotong/rusak.
  const scriptContents = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join("\n");
  const openBraces = (scriptContents.match(/\{/g) || []).length;
  const closeBraces = (scriptContents.match(/\}/g) || []).length;
  if (Math.abs(openBraces - closeBraces) > 1) {
    return t("check.unbalancedbraces");
  }
  return null;
}

function setPreview(html) {
  lastGeneratedHTML = html;
  document.getElementById("preview-frame").srcdoc = html;
  document.getElementById("code-editor").value = html;
  // Setiap kali ada hasil generate/rerun baru, selalu mulai dari tampilan
  // preview (bukan kode) supaya konsisten, dan reset label tombolnya.
  document.getElementById("preview-frame").hidden = false;
  document.getElementById("code-editor").hidden = true;
  document.getElementById("toggle-code-label").textContent = t("lab.togglecode.view");
  ["rerun-btn", "toggle-code-btn", "download-btn"].forEach(id => document.getElementById(id).disabled = false);
  document.getElementById("lab-edit-followup").hidden = false;
  // Bersihkan pesan status edit-lanjutan lama (kalau ada dari simulasi
  // sebelumnya) supaya tidak nyangkut/membingungkan di simulasi baru ini.
  document.getElementById("edit-followup-status").textContent = "";
}

document.getElementById("rerun-btn").addEventListener("click", () => {
  const edited = document.getElementById("code-editor").value;
  document.getElementById("preview-frame").srcdoc = edited;
  lastGeneratedHTML = edited;
});

document.getElementById("toggle-code-btn").addEventListener("click", () => {
  // Tombol ini harus SALING MENUKAR tampilan preview <-> kode (bukan cuma
  // menampilkan textarea kode di bawah iframe yang tetap terlihat), supaya
  // benar-benar terasa seperti "Lihat Kode" mengganti area sandbox.
  const editor = document.getElementById("code-editor");
  const frame = document.getElementById("preview-frame");
  const label = document.getElementById("toggle-code-label");
  const showingCodeNext = editor.hidden; // true jika saat ini kode masih disembunyikan
  editor.hidden = !showingCodeNext;
  frame.hidden = showingCodeNext;
  label.textContent = showingCodeNext ? t("lab.togglecode.preview") : t("lab.togglecode.view");
});

document.getElementById("download-btn").addEventListener("click", () => {
  const blob = new Blob([lastGeneratedHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `simulasi-${(currentTopic ? currentTopic.id : "fisika")}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

document.getElementById("lab-reflection-submit-btn").addEventListener("click", startLabReflectionGate);

/* ---------------- Pengaturan (modal) ---------------- */
const settingsModal = document.getElementById("settings-modal");
function refreshUnlockStatusUI() {
  const text = document.getElementById("unlock-status-text");
  if (!text) return;
  text.textContent = isUnlockAll()
    ? t("settings.unlock.on")
    : t("settings.unlock.off");
  text.classList.toggle("ok", isUnlockAll());
}
document.getElementById("unlock-code-btn").addEventListener("click", () => {
  const input = document.getElementById("unlock-code-input");
  const val = input.value.trim();
  if (!val) return;
  if (TEACHER_UNLOCK_CODE && val.toLowerCase() === TEACHER_UNLOCK_CODE.toLowerCase()) {
    localStorage.setItem(STORAGE_KEY_UNLOCK_ALL, "true");
    input.value = "";
    refreshUnlockStatusUI();
    renderNav();
    if (currentTopic) updateTopicProgressUI(document.querySelector(".tab-btn.active").dataset.tab);
    showToast(t("settings.unlock.success"));
  } else {
    showToast(t("settings.unlock.wrong"));
  }
});
function openSettingsModal() {
  document.getElementById("settings-key-input").value = getGeminiApiKey();
  refreshUnlockStatusUI();
  refreshClassSessionUI();
  const studentDetails = document.getElementById("settings-student-info-details");
  if (studentDetails) {
    const isStudent = getUserRole() === "student";
    studentDetails.hidden = !isStudent;
    if (isStudent) {
      document.getElementById("settings-student-name-input").value = getStudentName();
      document.getElementById("settings-student-class-input").value = getStudentClass();
    }
  }
  settingsModal.hidden = false;
}
document.getElementById("settings-btn").addEventListener("click", openSettingsModal);
document.getElementById("key-status-pill").addEventListener("click", openSettingsModal);
document.getElementById("lab-key-banner-btn").addEventListener("click", openSettingsModal);
document.getElementById("settings-close-btn").addEventListener("click", () => settingsModal.hidden = true);
document.getElementById("settings-close-x").addEventListener("click", () => settingsModal.hidden = true);
document.getElementById("settings-save-btn").addEventListener("click", () => {
  saveGeminiApiKey(document.getElementById("settings-key-input").value);
  settingsModal.hidden = true;
  // Kalau API key sengaja dikosongkan lagi lewat Pengaturan, gate wajib
  // tampil lagi (situs terkunci sampai diisi ulang) - konsisten dengan
  // aturan "wajib setup API key dulu" di awal.
  applyGate();
});
document.getElementById("settings-student-info-save-btn").addEventListener("click", () => {
  const name = document.getElementById("settings-student-name-input").value.trim();
  const cls = document.getElementById("settings-student-class-input").value.trim();
  if (!name || !cls) { showToast(t("gate.student.needinfo")); return; }
  localStorage.setItem(STORAGE_KEY_STUDENT_NAME, name);
  localStorage.setItem(STORAGE_KEY_STUDENT_CLASS, cls);
  showToast(t("settings.studentinfo.saved"));
});
document.getElementById("settings-reset-onboarding-btn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY_ROLE);
  localStorage.removeItem(STORAGE_KEY_STUDENT_NAME);
  localStorage.removeItem(STORAGE_KEY_STUDENT_CLASS);
  localStorage.removeItem(STORAGE_KEY_UNLOCK_ALL);
  leaveClassSession(null);
  settingsModal.hidden = true;
  applyGate();
});

/* ============================================================
   Onboarding gate (wajib, layar penuh, sebelum situs bisa diakses)
   ------------------------------------------------------------
   Urutan: API key -> pilih peran -> (siswa) nama+kelas -> kode dari
   guru, ATAU (bukan siswa) Kode Eksplorasi Bebas. #site-shell baru
   ditampilkan setelah computeGateStep() mengembalikan null.
   ============================================================ */
const GATE_STEPS = ["apikey", "role", "student-info", "student-code", "guest-code"];

function computeGateStep() {
  if (!getGeminiApiKey()) return "apikey";
  const role = getUserRole();
  if (role === "student") {
    if (!getStudentName() || !getStudentClass()) return "student-info";
    if (!isInClassSession()) return "student-code";
    return null;
  }
  if (role === "guest") {
    if (!isUnlockAll()) return "guest-code";
    return null;
  }
  return "role";
}
function showGateStep(step) {
  GATE_STEPS.forEach(s => {
    const el = document.getElementById("gate-step-" + s);
    if (el) el.hidden = (s !== step);
  });
  if (step === "student-info") {
    document.getElementById("gate-student-name-input").value = getStudentName();
    document.getElementById("gate-student-class-input").value = getStudentClass();
  }
}
function applyGate() {
  const step = computeGateStep();
  const gate = document.getElementById("onboarding-gate");
  const shell = document.getElementById("site-shell");
  if (step) {
    gate.hidden = false;
    shell.hidden = true;
    showGateStep(step);
  } else {
    gate.hidden = true;
    shell.hidden = false;
    // Begitu gate baru saja terlewati (atau memang sudah lengkap sejak
    // awal) dan siswa ternyata sedang dalam sesi kelas aktif, langsung
    // antarkan ke aktivitas yang ditentukan guru alih-alih diam di Beranda.
    if (isInClassSession()) goToClassSessionActivity();
  }
}
async function initGate() {
  // Kalau perangkat ini sebelumnya sudah pernah gabung sebuah kode sesi,
  // coba sambungkan ulang dulu secara diam-diam sebelum memutuskan langkah
  // gate mana yang ditampilkan - supaya me-reload halaman di tengah sesi
  // yang masih berjalan tidak tiba-tiba meminta kode dari awal lagi.
  if (getJoinedSessionCode() && !classSession) {
    await attemptJoinClassSession(getJoinedSessionCode());
  }
  applyGate();
}

document.getElementById("gate-key-toggle-visibility").addEventListener("click", () => {
  const input = document.getElementById("gate-key-input");
  input.type = input.type === "password" ? "text" : "password";
});
document.getElementById("gate-key-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("gate-key-save-btn").click();
});
document.getElementById("gate-key-save-btn").addEventListener("click", () => {
  const val = document.getElementById("gate-key-input").value.trim();
  const status = document.getElementById("gate-key-status");
  if (!val) { status.textContent = t("gate.key.needkey"); status.classList.remove("ok"); return; }
  saveGeminiApiKey(val);
  status.textContent = "";
  applyGate();
});

document.getElementById("gate-role-student-btn").addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY_ROLE, "student");
  applyGate();
});
document.getElementById("gate-role-guest-btn").addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY_ROLE, "guest");
  applyGate();
});

document.getElementById("gate-student-info-btn").addEventListener("click", () => {
  const name = document.getElementById("gate-student-name-input").value.trim();
  const cls = document.getElementById("gate-student-class-input").value.trim();
  const status = document.getElementById("gate-student-info-status");
  if (!name || !cls) { status.textContent = t("gate.student.needinfo"); return; }
  localStorage.setItem(STORAGE_KEY_STUDENT_NAME, name);
  localStorage.setItem(STORAGE_KEY_STUDENT_CLASS, cls);
  status.textContent = "";
  applyGate();
});
document.getElementById("gate-student-info-back-btn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY_ROLE);
  applyGate();
});

document.getElementById("gate-student-code-btn").addEventListener("click", async () => {
  const input = document.getElementById("gate-student-code-input");
  const status = document.getElementById("gate-student-code-status");
  const btn = document.getElementById("gate-student-code-btn");
  const code = input.value.trim();
  if (!code) { status.textContent = t("gate.student.code.needcode"); status.classList.remove("ok"); return; }
  status.textContent = t("gate.student.code.connecting");
  status.classList.remove("ok");
  btn.disabled = true;
  const result = await attemptJoinClassSession(code);
  btn.disabled = false;
  if (result.ok) {
    input.value = "";
    status.textContent = "";
    applyGate();
  } else {
    status.textContent = result.error;
    status.classList.remove("ok");
  }
});
document.getElementById("gate-student-code-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("gate-student-code-btn").click();
});
document.getElementById("gate-student-code-back-btn").addEventListener("click", () => {
  showGateStep("student-info");
});

document.getElementById("gate-guest-code-btn").addEventListener("click", () => {
  const input = document.getElementById("gate-guest-code-input");
  const status = document.getElementById("gate-guest-code-status");
  const code = input.value.trim();
  if (!code) { status.textContent = t("gate.guest.code.needcode"); status.classList.remove("ok"); return; }
  if (TEACHER_UNLOCK_CODE && code.toLowerCase() === TEACHER_UNLOCK_CODE.toLowerCase()) {
    localStorage.setItem(STORAGE_KEY_UNLOCK_ALL, "true");
    input.value = "";
    status.textContent = "";
    applyGate();
  } else {
    status.textContent = t("gate.guest.code.wrong");
    status.classList.remove("ok");
  }
});
document.getElementById("gate-guest-code-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("gate-guest-code-btn").click();
});
document.getElementById("gate-guest-code-back-btn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY_ROLE);
  applyGate();
});

/* ---------------- Chatbot toggle ---------------- */
const chatbotPanel = document.getElementById("chatbot-panel");
document.getElementById("chatbot-toggle-btn").addEventListener("click", () => {
  chatbotPanel.hidden = !chatbotPanel.hidden;
  if (!chatbotPanel.hidden && window.Chatbot) Chatbot.onOpen();
});
document.getElementById("chatbot-close-btn").addEventListener("click", () => { chatbotPanel.hidden = true; });

/* ---------------- Init ---------------- */
applyStaticI18n();
initLangSwitch();
renderNav();
refreshKeyStatusUI();
refreshUnlockStatusUI();
syncHeaderHeight();
if (window.Chatbot) Chatbot.init();
// Kalau reload ini dipicu oleh ganti bahasa (lihat setLang() di i18n.js),
// kembalikan siswa ke topik/tab yang sedang dibuka sebelumnya alih-alih
// diam di Beranda - ditunggu (.then) sampai SETELAH initGate() selesai
// memutuskan step gate mana yang tampil (initGate itu sendiri async karena
// bisa menyambung ulang sesi kelas lebih dulu ke backend).
initGate().then(restoreLangSwitchState);

/* ============================================================
   tests/e2e.js - tes uji end-to-end (Playwright + backend tiruan)
   ------------------------------------------------------------
   Jalankan (dari root repo):
     node tests/mock-backend.js 8787 &
     NODE_PATH=$(npm root -g) node tests/e2e.js [filter]

   ATURAN SETIAP TES (sesuai permintaan): sebelum tes dimulai state
   server direset (sesi kelas aktif, gate, kuis, sheet semua bersih)
   dan browser dibuka BARU (localStorage kosong), lalu masuk lewat
   layar gerbang sebagai SISWA - persis seperti siswa sungguhan.
   Semua request ke luar localhost diblokir, jadi Apps Script/
   Spreadsheet/Gemini asli TIDAK PERNAH tersentuh.
   ============================================================ */
const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:8787";
const CONTROL_CODE = "koderahasia"; // TEACHER_CONTROL_CODE default di Code.gs
const FAKE_KEY = "AIzaSyFAKE_KEY_FOR_LOCAL_TESTS_0123456789";
const TOPIC = "magnetic-fields";

const results = [];
let browser;

/* ---------------- util ---------------- */
async function api(body) {
  const r = await fetch(BASE + "/exec", { method: "POST", body: JSON.stringify(body) });
  return r.json();
}
async function mock(cfg) { await fetch(BASE + "/__mock", { method: "POST", body: JSON.stringify(cfg) }); }
async function serverState() { return (await fetch(BASE + "/__state")).json(); }
async function resetServer() { await fetch(BASE + "/__reset", { method: "POST" }); }
async function startTeacherSession(topicId = TOPIC, tabIndex = 0) {
  const r = await api({ mode: "teacher_session", controlCode: CONTROL_CODE, action: "start", topicId, tabIndex });
  return r.state.code;
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

async function newContext() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route("**/*", route => {
    const u = new URL(route.request().url());
    if (u.hostname === "localhost" || u.protocol === "data:") return route.continue();
    return route.abort();
  });
  await ctx.addInitScript(base => {
    try { if (!localStorage.getItem("physicsSandbox.backendUrl")) localStorage.setItem("physicsSandbox.backendUrl", base + "/exec"); } catch (e) {}
  }, BASE);
  return ctx;
}

/* Masuk lewat gerbang onboarding. KEDUA cara belajar wajib memakai kode:
   mode "independent" = Belajar mandiri (kode belajar mandiri "fisika-merdeka"),
   mode "session"     = Belajar di kelas (kode sesi dari guru).
   Mengembalikan { page, errors, code }. */
const SELF_CODE = "fisika-merdeka"; // SELF_STUDY_CODE di js/config.js
async function loginAsStudent(ctx, { name = "Budi Uji", cls = "XI IPA 2", mode = "independent", sessionCode = null, topicId = TOPIC, tabIndex = 0 } = {}) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errors.push("console: " + m.text()); });
  await page.goto(BASE + "/index.html");
  await page.fill("#gate-key-input", FAKE_KEY);
  await page.click("#gate-key-save-btn");
  await page.click(mode === "session" ? "#gate-role-class-btn" : "#gate-role-self-btn");
  await page.fill("#gate-student-name-input", name);
  await page.fill("#gate-student-class-input", cls);
  await page.click("#gate-student-info-btn");
  let code = sessionCode;
  if (mode === "session") {
    code = code || await startTeacherSession(topicId, tabIndex);
    await page.fill("#gate-student-code-input", code);
    await page.click("#gate-student-code-btn");
  } else {
    await page.fill("#gate-self-code-input", SELF_CODE);
    await page.click("#gate-self-code-btn");
  }
  await page.waitForSelector("#site-shell:not([hidden])", { timeout: 5000 });
  return { page, errors, code };
}

async function openTopic(page, id = TOPIC) {
  await page.evaluate(i => selectTopic(i), id);
  await page.waitForSelector("#topic-view:not([hidden])");
}
async function materiCorrectIdx(page, id = TOPIC) {
  return page.evaluate(i => TOPICS.find(t => t.id === i).materiCheck.map(q => q.correct), id);
}
// Kerjakan gate Materi dengan `nCorrect` jawaban benar dari 5. Mengembalikan teks status modal.
async function answerMateriGate(page, nCorrect, id = TOPIC) {
  const corr = await materiCorrectIdx(page, id);
  if (!(await page.locator("#confirm-modal").isVisible())) await page.click("#progress-next-btn");
  await page.waitForSelector("#confirm-modal:not([hidden])");
  for (let i = 0; i < corr.length; i++) {
    const pick = i < nCorrect ? corr[i] : (corr[i] + 1) % 4;
    await page.check(`input[name="cq-${i}"][value="${pick}"]`);
  }
  await page.click("#confirm-modal-submit-btn");
  await page.waitForTimeout(150);
  return (await page.locator("#confirm-modal-status").textContent()) || "";
}
async function activeTab(page) { return page.locator(".tab-btn.active").getAttribute("data-tab"); }
function trackPosts(page) {
  const modes = [];
  page.on("request", r => {
    if (r.method() === "POST" && r.url().endsWith("/exec")) { try { modes.push(JSON.parse(r.postData()).mode || "simulate"); } catch (e) {} }
  });
  return modes;
}

/* ---------------- tes ---------------- */
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

test("T1 login siswa mandiri (tanpa kode sesi guru)", async ctx => {
  const { page, errors } = await loginAsStudent(ctx, { mode: "independent" });
  assert(await page.locator("#topic-nav .nav-item").count() > 0, "menu topik kosong");
  assert(errors.length === 0, "error konsol: " + errors.join(" | "));
});

test("T2 Materi -> Eksperimen lulus di 80% (4/5) tanpa guru", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  const posts = trackPosts(page);
  await openTopic(page);
  const st = await answerMateriGate(page, 4);
  assert(await activeTab(page) === "eksperimen", "tidak pindah ke Eksperimen setelah 4/5 benar; status='" + st + "'");
  assert(!posts.includes("gate_submit"), "Materi->Eksperimen tidak boleh minta konfirmasi guru (gate_submit terkirim)");
});

test("T3 Materi -> Eksperimen ditolak di 60% (3/5), modal tetap terbuka", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page);
  const st = await answerMateriGate(page, 3);
  assert(await activeTab(page) === "materi", "harusnya tetap di Materi");
  assert(await page.locator("#confirm-modal").isVisible(), "modal harus tetap terbuka");
  assert(/60/.test(st) && /80/.test(st), "pesan skor harus menyebut 60% dan minimum 80%: '" + st + "'");
});

test("T4 siswa DI DALAM sesi guru tetap bisa Materi -> Eksperimen (80%)", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "session", tabIndex: 0 });
  await openTopic(page);
  await answerMateriGate(page, 5);
  assert(await activeTab(page) === "eksperimen", "sesi guru (tab Materi) memblokir siswa yang sudah lulus 80%; tab aktif=" + await activeTab(page));
});

test("T5 chatbot: kirim pesan, riwayat terkirim, error tertangani", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page);
  await page.click("#chatbot-toggle-btn");
  await page.fill("#chatbot-input", "Apa itu gaya Lorentz?");
  await page.press("#chatbot-input", "Enter");
  await page.waitForSelector(".chatbot-msg.bot:has-text('Balasan tutor uji')");
  await page.fill("#chatbot-input", "Kenapa tegak lurus?");
  await page.press("#chatbot-input", "Enter");
  await page.waitForFunction(() => document.querySelectorAll(".chatbot-msg.bot").length >= 3);
  const chats = (await serverState()).geminiLog.filter(g => /tutor fisika/i.test(g.system));
  assert(chats.length === 2, "harus 2 panggilan chat, dapat " + chats.length);
  assert(chats[1].payload.contents.length === 3, "panggilan ke-2 harus membawa riwayat (3 konten), dapat " + chats[1].payload.contents.length);
  await mock({ geminiStatus: 503 });
  await page.fill("#chatbot-input", "tes error");
  await page.press("#chatbot-input", "Enter");
  await page.waitForSelector(".chatbot-msg.bot:has-text('sibuk')", { timeout: 8000 });
  assert(!(await page.locator("#chatbot-input").isDisabled()), "input chat tetap terkunci setelah error");
});

test("T6 chatbot: ganti topik saat panel tertutup tidak menyisakan obrolan topik lama", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page, "kinematics");
  await page.click("#chatbot-toggle-btn");
  await page.fill("#chatbot-input", "jarak dan perpindahan");
  await page.press("#chatbot-input", "Enter");
  await page.waitForSelector(".chatbot-msg.bot:has-text('Balasan tutor uji')");
  await page.click("#chatbot-close-btn");
  await openTopic(page, "magnetic-fields");
  await page.click("#chatbot-toggle-btn");
  const texts = await page.locator("#chatbot-messages .chatbot-msg").allTextContents();
  assert(!texts.some(x => /jarak dan perpindahan/.test(x)), "obrolan Kinematics masih tampil di topik Magnetic Fields");
});

async function useMode(page, mode) {
  await page.click(`[data-eks-mode="${mode}"]`);
  await page.waitForSelector(`.lkpd[data-mode="${mode}"] .eks-datatable`);
}
// mode "lab" = kolom arus tetap (0,50-2,50 A); mode "simple" = kolom arus diisi siswa.
async function reachEksperimen(page, mode = "lab") {
  await openTopic(page);
  await answerMateriGate(page, 5);
  await page.waitForSelector(".eks-datatable");
  if (mode) await useMode(page, mode);
}

test("T7 simpan tabel: rata-rata mengabaikan sel kosong", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await reachEksperimen(page);
  await page.fill('.eks-dt-input[data-row="0"][data-col="0"]', "10");
  await page.fill('.eks-dt-input[data-row="0"][data-col="1"]', "12");
  await page.click("#eks-dt-save-btn");
  await page.waitForFunction(() => /tersimpan|saved/i.test(document.getElementById("eks-dt-status").textContent), null, { timeout: 5000 });
  const { sheets } = await serverState();
  const sheet = Object.values(sheets)[0];
  assert(sheet && sheet.rows.length >= 1, "sheet tidak tertulis");
  const avg = sheet.rows[0][6];
  assert(Math.abs(avg - 11) < 1e-9, "rata-rata harusnya 11 (10 & 12), tersimpan " + avg);
});

test("T8 simpan tabel gagal (spreadsheet error) tidak boleh dianggap tersimpan", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await reachEksperimen(page);
  await mock({ sheetFail: true });
  await page.fill('.eks-dt-input[data-row="0"][data-col="0"]', "10");
  await page.click("#eks-dt-save-btn");
  await page.waitForFunction(() => document.getElementById("eks-dt-status").textContent.length > 0 && !document.getElementById("eks-dt-save-btn").disabled);
  const flagged = await page.evaluate(() => getEksperimenDataSavedFlag("magnetic-fields"));
  assert(!flagged, "tabel ditandai tersimpan padahal spreadsheet gagal ditulis");
  const local = await page.evaluate(() => getEksperimenDataLocalFlag("magnetic-fields"));
  assert(local, "data lokal seharusnya tetap dianggap siap agar siswa tidak terkunci");
});

test("T9 generator: susun prompt -> generate -> preview -> edit lanjutan (semua topik ready)", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  const ids = await page.evaluate(() => TOPICS.filter(t => t.status === "ready").map(t => t.id));
  for (const id of ids) {
    await openTopic(page, id);
    await page.evaluate(() => { advanceProgress(currentTopic.id, 3); switchTab("lab"); });
    await page.click("#pf-build-btn");
    const prompt = await page.inputValue("#final-prompt");
    assert(prompt.length > 100 && prompt.length <= 6000, `${id}: panjang prompt ${prompt.length} di luar batas backend (6000)`);
    await page.click("#generate-btn");
    await page.waitForFunction(() => document.getElementById("preview-frame").srcdoc.length > 200, null, { timeout: 8000 });
    const status = await page.textContent("#generate-status");
    assert(/berhasil|success|succe/i.test(status), `${id}: status generate '${status}'`);
    assert(!(await page.locator("#download-btn").isDisabled()), `${id}: tombol unduh masih nonaktif`);
  }
  await page.fill("#edit-followup-input", "tambahkan grafik");
  await page.click("#edit-followup-btn");
  await page.waitForFunction(() => /4\/5|4 \/ 5|4 of 5|4/.test(document.getElementById("edit-followup-counter").textContent));
  const log = (await serverState()).geminiLog;
  assert(log.some(g => /tambahkan grafik/.test(g.user)), "instruksi edit tidak sampai ke backend");
});

test("T10 generator: error Gemini ditampilkan jelas, tombol aktif lagi", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page);
  await page.evaluate(() => { advanceProgress(currentTopic.id, 3); switchTab("lab"); });
  await page.click("#pf-build-btn");
  await mock({ geminiStatus: 403 });
  await page.click("#generate-btn");
  await page.waitForFunction(() => /ditolak|rejected|gagal|failed/i.test(document.getElementById("generate-status").textContent), null, { timeout: 8000 });
  assert(!(await page.locator("#generate-btn").isDisabled()), "tombol generate tetap nonaktif setelah error");
});

test("T11 keamanan: nama siswa berisi HTML tidak dieksekusi di Panel Guru", async ctx => {
  const evil = '<img src=x onerror="window.__xss=1">';
  const { page } = await loginAsStudent(ctx, { name: evil, cls: "X", mode: "session", tabIndex: 1 });
  // kirim juga permintaan gate supaya tabel konfirmasi ikut terisi
  await api({ mode: "gate_submit", topicId: TOPIC, studentId: evil + " (X)", stage: "eksperimen", summary: evil });
  const t = await ctx.newPage();
  await t.goto(BASE + "/teacher.html");
  await t.fill("#teacher-control-input", CONTROL_CODE);
  await t.click("#teacher-login-btn");
  await t.waitForSelector("#teacher-panel:not([hidden])");
  await t.waitForTimeout(800);
  const fired = await t.evaluate(() => window.__xss === 1);
  assert(!fired, "XSS tereksekusi di Panel Guru lewat nama siswa");
});

test("T12 sesi kelas: gabung, guru ganti aktivitas, guru akhiri sesi -> siswa tetap bisa belajar", async ctx => {
  const { page, code } = await loginAsStudent(ctx, { mode: "session", tabIndex: 0 });
  await page.waitForFunction(() => isInClassSession());
  await api({ mode: "teacher_session", controlCode: CONTROL_CODE, action: "end" });
  await page.evaluate(() => syncClassSession());
  await page.waitForFunction(() => !isInClassSession());
  // sesi berakhir: siswa TIDAK boleh terlempar kembali ke gerbang (belajar mandiri tetap jalan)
  assert(await page.locator("#site-shell").isVisible(), "siswa terlempar ke gerbang setelah sesi guru berakhir");
});


/* ---------------- differentiated learning & perbaikan tambahan ---------------- */
async function chipText(page) { return ((await page.locator("#ability-chip").textContent()) || "").trim(); }

test("T13 tingkat belajar otomatis dari percobaan pertama kuis Materi", async ctx => {
  // 5/5 di percobaan pertama -> Lanjut
  let { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page);
  await answerMateriGate(page, 5);
  assert(await chipText(page) === "Lanjut", "5/5 seharusnya Lanjut, dapat " + await chipText(page));
  assert(await page.locator("#latihan-diff .diff-lanjut").count() === 1, "panel tantangan Lanjut tidak tampil di Latihan");
  await page.close();
  // 4/5 -> Menengah
  ({ page } = await loginAsStudent(await newContext(), { mode: "independent" }));
  await openTopic(page);
  await answerMateriGate(page, 4);
  assert(await chipText(page) === "Menengah", "4/5 seharusnya Menengah, dapat " + await chipText(page));
  await page.close();
  // 2/5 lalu 5/5 -> Dasar (percobaan pertama <= 40%)
  ({ page } = await loginAsStudent(await newContext(), { mode: "independent" }));
  await openTopic(page);
  const st = await answerMateriGate(page, 2);
  assert(/40/.test(st), "pesan skor 40% tidak muncul: " + st);
  await answerMateriGate(page, 5);
  assert(await activeTab(page) === "eksperimen", "lulus di percobaan ke-2 harus lanjut ke Eksperimen");
  assert(await chipText(page) === "Dasar", "2/5 di percobaan pertama seharusnya Dasar, dapat " + await chipText(page));
  assert(await page.locator("#latihan-diff .diff-dasar").count() === 1, "panduan langkah Dasar tidak tampil di Latihan");
  assert(await page.locator("#latihan-diff .diff-formula[open]").count() === 1, "lembar rumus harus terbuka untuk tingkat Dasar");
});

test("T14 tutor menerima tingkat belajar (dasar & lanjut) dan menyesuaikan gaya", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page);
  await page.selectOption("#ability-select", "dasar");
  await page.click("#chatbot-toggle-btn");
  await page.fill("#chatbot-input", "apa itu fluks?");
  await page.press("#chatbot-input", "Enter");
  await page.waitForSelector(".chatbot-msg.bot:has-text('[dasar]')");
  await page.selectOption("#ability-select", "lanjut");
  await page.fill("#chatbot-input", "turunkan F = BIL");
  await page.press("#chatbot-input", "Enter");
  await page.waitForSelector(".chatbot-msg.bot:has-text('[lanjut]')");
  const chats = (await serverState()).geminiLog.filter(g => /tutor fisika/i.test(g.system));
  assert(/TINGKAT SISWA: DASAR/.test(chats[0].system), "system prompt tutor tidak memuat tingkat DASAR");
  assert(/TINGKAT SISWA: LANJUT/.test(chats[1].system), "system prompt tutor tidak memuat tingkat LANJUT");
});

test("T15 latihan tambahan AI sesuai tingkat (soal, cek jawaban, pembahasan)", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page);
  await page.selectOption("#ability-select", "lanjut");
  await page.evaluate(() => { advanceProgress(currentTopic.id, 3); switchTab("latihan"); });
  await page.click("#extra-gen-btn");
  await page.waitForSelector("#extra-list .extra-q");
  const log = (await serverState()).geminiLog;
  const g = log[log.length - 1];
  assert(/TINGKAT KESULITAN: lanjut/.test(g.user), "prompt soal tidak memuat tingkat kesulitan lanjut");
  assert(await page.locator("#extra-list .extra-q").count() === 2, "harus ada 2 soal tampil");
  await page.check('#extra-list .extra-q[data-i="0"] input[value="0"]'); // jawaban salah (kunci = 1)
  await page.click("#extra-list .extra-check-btn");
  const fb = await page.locator("#extra-list .extra-q[data-i='0'] .extra-feedback").textContent();
  assert(/B/.test(fb), "umpan balik harus menyebut jawaban benar B: " + fb);
  assert(await page.locator("#extra-list .extra-q[data-i='0'] .solution.show").count() === 1, "pembahasan tidak terbuka setelah cek");
  await page.click("#extra-list .extra-reveal-btn");
  assert(await page.locator("#extra-list .extra-q[data-i='1'] .solution.show").count() === 1, "jawaban model soal isian tidak terbuka");
  // tingkat dasar -> 3 soal pilihan ganda dengan scaffold
  await page.selectOption("#ability-select", "dasar");
  await page.click("#extra-gen-btn");
  await page.waitForSelector("#extra-list .extra-q");
  const g2 = (await serverState()).geminiLog.pop();
  assert(/TINGKAT KESULITAN: dasar/.test(g2.user), "prompt dasar tidak memuat tingkat kesulitan dasar");
});

test("T16 generator simulasi: bawaan kompleksitas & arahan mengikuti tingkat", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page);
  await page.evaluate(() => { advanceProgress(currentTopic.id, 3); switchTab("lab"); });
  await page.selectOption("#ability-select", "dasar");
  assert(await page.evaluate(() => document.getElementById("pf-level").selectedIndex) === 0, "dasar -> kompleksitas Sederhana");
  await page.click("#pf-build-btn");
  assert(/Apa yang harus diamati/.test(await page.inputValue("#final-prompt")), "arahan Dasar tidak masuk prompt");
  await page.selectOption("#ability-select", "lanjut");
  assert(await page.evaluate(() => document.getElementById("pf-level").selectedIndex) === 2, "lanjut -> kompleksitas Kompleks");
  await page.click("#pf-build-btn");
  assert(/Prediksi dulu/.test(await page.inputValue("#final-prompt")), "arahan Lanjut tidak masuk prompt");
  await page.selectOption("#ability-select", "menengah");
  await page.click("#pf-build-btn");
  const pr = await page.inputValue("#final-prompt");
  assert(!/Prediksi dulu|Apa yang harus diamati/.test(pr), "menengah tidak boleh membawa arahan khusus");
});

test("T17 guru melihat tingkat belajar siswa di roster & ringkasan konfirmasi", async ctx => {
  const { page } = await loginAsStudent(ctx, { name: "Sari", cls: "XI A", mode: "session", tabIndex: 0 });
  await openTopic(page);
  await page.selectOption("#ability-select", "lanjut");
  await page.evaluate(() => syncClassSession());
  await page.waitForTimeout(300);
  const roster = (await api({ mode: "teacher_roster", controlCode: CONTROL_CODE })).roster;
  const entry = roster["Sari (XI A)"];
  assert(entry && entry.level === "lanjut", "roster tidak memuat level lanjut: " + JSON.stringify(entry));
  // konfirmasi Eksperimen: ringkasan diawali tingkat
  await answerMateriGate(page, 5);
  await page.waitForSelector(".eks-datatable");
  await useMode(page, "lab");
  await page.fill('.eks-dt-input[data-row="0"][data-col="0"]', "10");
  await page.click("#eks-dt-save-btn");
  await page.waitForFunction(() => /tersimpan/i.test(document.getElementById("eks-dt-status").textContent));
  await page.click("#progress-next-btn");
  const corr = await page.evaluate(() => currentTopic.eksperimenCheck.map(q => q.correct));
  for (let i = 0; i < corr.length; i++) await page.check(`input[name="cq-${i}"][value="${corr[i]}"]`);
  await page.click("#confirm-modal-submit-btn");
  await page.waitForTimeout(400);
  const pend = (await api({ mode: "teacher_roster", controlCode: CONTROL_CODE })).gatePending;
  assert(pend.length === 1 && /^\[Lanjut\]/.test(pend[0].summary), "ringkasan gate tidak diawali [Lanjut]: " + JSON.stringify(pend));
});

test("T18 sesi guru mengarahkan, tidak mengunci (pindah topik bebas, tab yang dibukakan guru terbuka)", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "session", topicId: TOPIC, tabIndex: 2 });
  await page.waitForFunction(() => isInClassSession());
  await openTopic(page, TOPIC);
  await page.evaluate(() => switchTab("latihan")); // tab yang dibukakan guru untuk seluruh kelas
  assert(await activeTab(page) === "latihan", "tab Latihan yang dibukakan guru tidak terbuka");
  await page.evaluate(() => switchTab("lab"));
  assert(await activeTab(page) === "latihan", "tab Lab (belum dibuka guru/kemajuan siswa) seharusnya tetap terkunci");
  // topik LAIN dari topik sesi harus tetap bisa dipelajari mandiri (mulai dari tab Materi)
  await openTopic(page, "kinematics");
  assert(await page.evaluate(() => currentTopic.id) === "kinematics", "siswa tidak bisa membuka topik lain saat ada sesi");
  assert(await activeTab(page) === "materi", "topik lain di luar sesi harus terbuka di tab Materi, tab aktif=" + await activeTab(page));
  await openTopic(page, TOPIC);
  // guru pindah aktivitas -> siswa TIDAK diseret, hanya diberi tahu
  await api({ mode: "teacher_session", controlCode: CONTROL_CODE, action: "update", topicId: "kinematics", tabIndex: 0 });
  await page.evaluate(() => syncClassSession());
  await page.waitForTimeout(400);
  assert(await page.evaluate(() => currentTopic.id) === TOPIC, "siswa diseret paksa ke aktivitas baru guru");
  assert(await page.locator("#class-session-banner").isVisible(), "banner arahan guru tidak tampil");
});

test("T19 tabel: judul kolom & kolom turunan mengikuti definisi topik", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await reachEksperimen(page);
  await page.fill('.eks-dt-input[data-row="1"][data-col="0"]', "20");
  await page.fill('.eks-dt-input[data-row="1"][data-col="1"]', "22");
  await page.fill('.eks-dt-input[data-row="1"][data-col="2"]', "21");
  await page.click("#eks-dt-save-btn");
  await page.waitForFunction(() => /tersimpan/i.test(document.getElementById("eks-dt-status").textContent));
  const sheet = Object.values((await serverState()).sheets)[0];
  assert(sheet.header.includes("Δm (g) #3") && sheet.header.includes("F = Δm×g (N)"), "header sheet: " + sheet.header);
  const row = sheet.rows[1];
  assert(Math.abs(row[row.length - 2] - 21) < 1e-9, "rata-rata baris 2 harus 21: " + row);
  assert(Math.abs(row[row.length - 1] - 21 * 0.00981) < 1e-9, "F harus 21 x 0,00981: " + row);
  assert(await page.evaluate(() => getEksperimenDataSavedFlag("magnetic-fields")), "flag tersimpan tidak diset setelah sukses");
});

test("T20 tutor untuk topik tanpa bahan khusus tetap membawa lembar rumus topik", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page, "temperature");
  await page.click("#chatbot-toggle-btn");
  await page.fill("#chatbot-input", "apa itu kapasitas panas?");
  await page.press("#chatbot-input", "Enter");
  await page.waitForSelector(".chatbot-msg.bot:has-text('Balasan tutor uji')");
  const sheet = await page.evaluate(() => trContent(TOPICS.find(t => t.id === "temperature").formulaSheet).trim().slice(0, 40));
  const sys = (await serverState()).geminiLog.filter(g => /tutor fisika/i.test(g.system))[0].system;
  assert(sys.includes(sheet), "lembar rumus Temperature tidak ikut ke tutor");
});

test("T21 mode English: tidak ada kunci i18n mentah di UI baru", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await page.evaluate(() => localStorage.setItem("physicsSandbox.lang", "en"));
  await page.reload();
  await page.waitForSelector("#site-shell:not([hidden])");
  await openTopic(page);
  await page.evaluate(() => { advanceProgress(currentTopic.id, 3); });
  for (const lvl of ["dasar", "menengah", "lanjut"]) {
    await page.selectOption("#ability-select", lvl);
    await page.evaluate(() => switchTab("latihan"));
    await page.click("#extra-gen-btn");
    await page.waitForSelector("#extra-list .extra-q");
    await page.evaluate(() => switchTab("materi"));
    const txt = await page.evaluate(() => document.body.innerText);
    const raw = txt.match(/\b(diff|ability|extra|level|gate|promptgen|classsession|teacher)\.[a-z0-9]+(\.[a-z0-9]+)*/g);
    assert(!raw, `kunci i18n mentah (${lvl}): ${raw}`);
  }
  assert(/Foundation|Core|Extension/.test(await chipText(page)), "chip tingkat tidak berbahasa Inggris");
});


/* ---------------- LKPD interaktif, mode praktikum, latihan ---------------- */
async function goTab(page, tab) {
  await page.evaluate(t => { advanceProgress(currentTopic.id, 3); switchTab(t); }, tab);
}

test("T22 latihan: kunci jawaban tidak terlihat sebelum Cek Jawaban", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page);
  await goTab(page, "latihan");
  const before = await page.evaluate(() => document.getElementById("panel-latihan").innerText);
  assert(!/jawaban benar|correct answer/i.test(before), "label jawaban benar sudah terlihat sebelum dicek");
  assert(await page.locator("#panel-latihan .latihan-q .opt-correct-tag").count() === 0, "tag jawaban benar ada di DOM sebelum dicek");
  assert(await page.locator("#panel-latihan .latihan-q .solution.show").count() === 0, "pembahasan terbuka sebelum dicek");
  // klik Cek Jawaban tanpa memilih -> hanya peringatan, kunci tetap tersembunyi
  const first = page.locator("#panel-latihan .latihan-q").first();
  const isMcq = await first.locator("input[type=radio]").count() > 0;
  assert(isMcq, "soal pertama seharusnya pilihan ganda");
  await first.locator(".latihan-check-btn").click();
  assert(await first.locator(".opt-correct-tag").count() === 0, "kunci muncul padahal belum memilih jawaban");
  // pilih jawaban SALAH lalu cek -> kunci + pembahasan muncul
  const correct = await page.evaluate(() => currentTopic.latihan[0].correct);
  const wrong = (correct + 1) % 4;
  await first.locator(`input[type=radio][value="${wrong}"]`).check();
  await first.locator(".latihan-check-btn").click();
  assert(await first.locator(`li.opt-correct .opt-correct-tag`).count() === 1, "kunci tidak muncul setelah Cek Jawaban");
  assert(await first.locator(`li.opt-wrong`).count() === 1, "pilihan salah tidak ditandai");
  assert(await first.locator(".solution.show").count() === 1, "pembahasan tidak muncul setelah cek");
  // kunci hanya pada soal yang dicek, soal lain tetap tersembunyi
  assert(await page.locator("#panel-latihan .opt-correct-tag").count() === 1, "kunci soal lain ikut terbuka");
});

test("T23 eksperimen: tanpa tabel kosong statis; dua mode praktikum dengan alat berbeda", async ctx => {
  const { page, errors } = await loginAsStudent(ctx, { mode: "independent" });
  await reachEksperimen(page, null);
  // default: praktikum sederhana
  assert(await page.locator('.lkpd[data-mode="simple"]').count() === 1, "mode bawaan bukan Praktikum Sederhana");
  assert(await page.locator("[data-eks-mode]").count() === 2, "harus ada 2 pilihan mode");
  // teks isi LKPD saja (kartu pemilih mode menampilkan ringkasan KEDUA mode)
  const bodyTxt = () => page.evaluate(() => Array.from(document.querySelectorAll(".lkpd > section")).map(x => x.innerText).join("\n"));
  const simpleTxt = await bodyTxt();
  assert(/timbangan digital dapur/i.test(simpleTxt) && /multimeter/i.test(simpleTxt), "alat sehari-hari tidak tercantum");
  assert(!/EM-8607|PEI 300/.test(simpleTxt), "kit lab muncul di mode sederhana");
  // tidak ada sel tabel kosong yang tidak bisa diisi
  const dead = await page.evaluate(() => Array.from(document.querySelectorAll("#panel-eksperimen td")).filter(td => !td.children.length && !td.textContent.trim() && !td.classList.contains("eks-dt-avg")).length);
  assert(dead === 0, dead + " sel tabel kosong tanpa input");
  await useMode(page, "lab");
  const labTxt = await bodyTxt();
  assert(/EM-8607/.test(labTxt) && /P2410601/.test(labTxt) && /FU-04/.test(labTxt) && /PEK 500/.test(labTxt) && /PEI 300/.test(labTxt), "kit lab (PASCO/PHYWE/Pudak) tidak lengkap");
  assert(/neraca elektronik/i.test(labTxt), "neraca elektronik lab tidak tercantum");
  assert(!/hard disk/i.test(labTxt), "bahan sederhana muncul di mode lab");
  const hrefs = await page.$$eval(".lkpd-kit a", as => as.map(a => a.href + "|" + a.rel));
  assert(hrefs.length >= 5 && hrefs.every(h => /^https:/.test(h) && /noopener/.test(h)), "tautan kit tidak aman/lengkap: " + hrefs);
  // pilihan mode diingat setelah muat ulang
  await page.reload();
  await page.waitForSelector("#site-shell:not([hidden])");
  await openTopic(page);
  await page.evaluate(() => { advanceProgress(currentTopic.id, 3); switchTab("eksperimen"); });
  assert(await page.locator('.lkpd[data-mode="lab"]').count() === 1, "mode lab tidak diingat");
  assert(errors.length === 0, "error konsol: " + errors.join(" | "));
});

test("T24 LKPD sederhana: tabel bisa diisi, grafik & B otomatis, cek jawaban, simpan, dan tersimpan setelah reload", async ctx => {
  const { page, errors } = await loginAsStudent(ctx, { mode: "independent" });
  await reachEksperimen(page, "simple");
  // data sintetis: N=10, L=2 cm, B=0,2 T -> gradien NBL = 0,04 N/A -> dm (g) = 0,04*I/9,81*1000
  const Is = [0.2, 0.4, 0.6, 0.8];
  for (let r = 0; r < Is.length; r++) {
    await page.fill(`.eks-dt-ind[data-row="${r}"]`, String(Is[r]));
    const dm = (0.04 * Is[r] / 9.81 * 1000).toFixed(4);
    for (let c = 0; c < 3; c++) await page.fill(`.eks-dt-input[data-row="${r}"][data-col="${c}"]`, dm);
  }
  await page.fill('[data-var="L"]', "2");
  await page.fill('[data-var="N"]', "10");
  const res = await page.textContent("#lkpd-graph");
  assert(/B = 0,20\d? T/.test(res) || /B = 0,2 T/.test(res), "B otomatis salah: " + res.replace(/\s+/g, " ").slice(0, 300));
  assert(await page.locator("#lkpd-graph svg circle.pt").count() === 4, "titik grafik tidak 4");
  assert(await page.locator("#lkpd-graph svg line.fit").count() === 1, "garis terbaik tidak ada");
  // soal hitungan: jawaban benar & salah
  const calc = page.locator('.lkpd-q[data-q="calcB"]');
  await calc.locator("input[data-calc]").fill("0.5");
  await calc.locator("[data-check]").click();
  assert(/Belum tepat/.test(await calc.locator(".lkpd-fb").textContent()), "jawaban B salah tidak ditolak");
  await calc.locator("input[data-calc]").fill("0.21");
  await calc.locator("[data-check]").click();
  assert(/Benar/.test(await calc.locator(".lkpd-fb").textContent()), "jawaban B dalam toleransi 15% tidak diterima");
  // pilihan ganda: tidak ada kunci sebelum dicek
  const q = page.locator('.lkpd-q[data-q="reverse"]');
  assert(await q.locator(".opt-correct-tag").count() === 0, "kunci soal LKPD terlihat sebelum dicek");
  await q.locator('input[value="0"]').check();
  await q.locator("[data-check]").click();
  assert(await q.locator(".opt-correct-tag").count() === 1 && await q.locator(".opt-wrong").count() === 1, "penanda benar/salah tidak muncul");
  // isian bebas + ceklis
  await page.fill('[data-open="errors"]', "Kawat menyentuh magnet dan arus turun karena baterai melemah.");
  await page.locator('[data-tick]').first().check();
  // simpan tabel: butuh kolom I; mode sederhana kirim label mode ke kolom Topik
  await page.click("#eks-dt-save-btn");
  await page.waitForFunction(() => /tersimpan|saved/i.test(document.getElementById("eks-dt-status").textContent), null, { timeout: 5000 });
  const sheet = Object.values((await serverState()).sheets)[0];
  assert(sheet.rows.length === 5 || sheet.rows.length === 4 || sheet.rows.length >= 4, "baris sheet tidak sesuai: " + sheet.rows.length);
  assert(String(sheet.rows[0][1]).includes("(simple)"), "kolom Topik tidak memuat mode: " + sheet.rows[0][1]);
  assert(Math.abs(sheet.rows[0][2] - 0.2) < 1e-9, "kolom I harus 0,2: " + sheet.rows[0]);
  // muat ulang: semua pekerjaan pulih
  await page.reload();
  await page.waitForSelector("#site-shell:not([hidden])");
  await openTopic(page);
  await page.evaluate(() => { advanceProgress(currentTopic.id, 3); switchTab("eksperimen"); });
  await page.waitForSelector(".lkpd .eks-datatable");
  assert(await page.inputValue('.eks-dt-ind[data-row="1"]') === "0.4", "isian I tidak pulih");
  assert(await page.inputValue('[data-var="L"]') === "2", "ukuran L tidak pulih");
  assert((await page.inputValue('[data-open="errors"]')).includes("menyentuh magnet"), "isian bebas tidak pulih");
  assert(await page.locator('.lkpd-q[data-q="calcB"] .lkpd-fb').textContent().then(x => /Benar/.test(x)), "status cek jawaban tidak pulih");
  assert(await page.locator("#lkpd-graph svg circle.pt").count() === 4, "grafik tidak pulih");
  assert(/kelengkapan/i.test(await page.textContent("#lkpd-progress")), "progres LKPD tidak tampil");
  assert(errors.length === 0, "error konsol: " + errors.join(" | "));
});

test("T25 LKPD: simpan tabel mode sederhana ditolak bila kolom I kosong", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await reachEksperimen(page, "simple");
  await page.fill('.eks-dt-input[data-row="0"][data-col="0"]', "1.5");
  await page.click("#eks-dt-save-btn");
  await page.waitForFunction(() => document.getElementById("eks-dt-status").textContent.length > 0);
  assert(/I \(A\)/.test(await page.textContent("#eks-dt-status")), "pesan wajib isi kolom I tidak tampil");
  assert(Object.keys((await serverState()).sheets).length === 0, "data tanpa I tetap terkirim ke spreadsheet");
  assert(!(await page.evaluate(() => getEksperimenDataSavedFlag("magnetic-fields"))), "ditandai tersimpan padahal ditolak");
});

test("T26 LKPD lab: B dihitung dengan N=1; petunjuk & pengayaan mengikuti tingkat belajar", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await reachEksperimen(page, "lab");
  // B = 0,3 T, L = 4 cm -> gradien 0,012 N/A
  const Is = [0.5, 1.0, 1.5, 2.0, 2.5];
  for (let r = 0; r < Is.length; r++) {
    const dm = (0.012 * Is[r] / 9.81 * 1000).toFixed(5);
    for (let c = 0; c < 3; c++) await page.fill(`.eks-dt-input[data-row="${r}"][data-col="${c}"]`, dm);
  }
  await page.fill('[data-var="L"]', "4");
  assert(/B = 0,3\d* T/.test(await page.textContent("#lkpd-graph")), "B mode lab salah: " + (await page.textContent("#lkpd-graph")).replace(/\s+/g, " ").slice(0, 200));
  // tingkat dasar: petunjuk terbuka, tanpa soal pengayaan
  await page.selectOption("#ability-select", "dasar");
  await page.waitForSelector('.lkpd[data-mode="lab"]');
  assert(await page.locator('.lkpd details.lkpd-hint[open]').count() > 0, "petunjuk tidak terbuka untuk tingkat dasar");
  assert(await page.locator('.lkpd-q[data-q="extra-length"]').count() === 0, "soal pengayaan tampil untuk tingkat dasar");
  await page.selectOption("#ability-select", "lanjut");
  assert(await page.locator('.lkpd-q[data-q="extra-length"]').count() === 1, "soal pengayaan tidak tampil untuk tingkat lanjut");
  assert(await page.locator('.lkpd details.lkpd-hint[open]').count() === 0, "petunjuk terbuka otomatis untuk tingkat lanjut");
  // data tidak hilang saat tingkat berubah (gambar ulang)
  assert(await page.inputValue('[data-var="L"]') === "4", "data hilang setelah ganti tingkat");
  // ringkasan LKPD ikut ke guru
  await page.evaluate(() => { const c = lkpdSummaryText(); window.__sum = c; });
  assert(/LKPD/.test(await page.evaluate(() => window.__sum)), "ringkasan LKPD kosong");
});

test("T27 topik tanpa LKPD: tabel statis di teks eksperimen bisa diisi (tidak ada sel mati)", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await openTopic(page, "kinematics");
  await page.evaluate(() => { advanceProgress(currentTopic.id, 3); switchTab("eksperimen"); });
  const info = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll("#panel-eksperimen table td"));
    return { empty: cells.filter(td => !td.children.length && !td.textContent.trim()).length, inputs: document.querySelectorAll("#panel-eksperimen input.lkpd-cell").length };
  });
  assert(info.inputs > 0, "sel kosong tidak diubah menjadi input");
  assert(info.empty === 0, info.empty + " sel kosong tanpa input tersisa");
  await page.locator("#panel-eksperimen input.lkpd-cell").first().fill("12,5");
  assert(await page.locator("#panel-eksperimen input.lkpd-cell").first().inputValue() === "12,5", "sel tidak bisa diisi");
});

test("T28 mode English: LKPD tanpa kunci i18n mentah", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await page.evaluate(() => localStorage.setItem("physicsSandbox.lang", "en"));
  await page.reload();
  await page.waitForSelector("#site-shell:not([hidden])");
  await openTopic(page);
  await page.evaluate(() => { advanceProgress(currentTopic.id, 3); switchTab("eksperimen"); });
  await page.waitForSelector(".lkpd .eks-datatable");
  for (const mode of ["simple", "lab"]) {
    await page.click(`[data-eks-mode="${mode}"]`);
    await page.waitForSelector(`.lkpd[data-mode="${mode}"]`);
    await page.selectOption("#ability-select", "lanjut");
    const txt = await page.evaluate(() => document.getElementById("panel-eksperimen").innerText);
    const raw = txt.match(/\b(lkpd|eksdata|diff|ability|extra|level|gate|question)\.[a-z0-9]+(\.[a-z0-9]+)*/g);
    assert(!raw, `kunci i18n mentah (${mode}): ${raw}`);
    assert(/Check Answer/.test(txt) && /Data Table/.test(txt), `teks Inggris tidak lengkap (${mode})`);
    assert(!/Hitung rapat fluks|Langkah Kerja/.test(txt), `teks Indonesia bocor di mode English (${mode})`);
  }
});


/* ---------------- Gerbang: belajar di kelas / mandiri, keduanya wajib kode ---------------- */
async function gateToInfo(ctx, roleBtn) {
  const page = await ctx.newPage();
  await page.goto(BASE + "/index.html");
  await page.fill("#gate-key-input", FAKE_KEY);
  await page.click("#gate-key-save-btn");
  await page.click(roleBtn);
  await page.fill("#gate-student-name-input", "Tes Gerbang");
  await page.fill("#gate-student-class-input", "X A");
  await page.click("#gate-student-info-btn");
  return page;
}

test("T29 gerbang: pilihan 'Belajar di kelas' / 'Belajar mandiri' (tanpa siswa/bukan siswa), tanpa tombol lewati", async ctx => {
  const page = await ctx.newPage();
  await page.goto(BASE + "/index.html");
  await page.fill("#gate-key-input", FAKE_KEY);
  await page.click("#gate-key-save-btn");
  const txt = await page.textContent("#gate-step-role");
  assert(/Belajar di kelas/.test(txt) && /Belajar mandiri/.test(txt), "pilihan cara belajar tidak tampil: " + txt.replace(/\s+/g, " "));
  assert(!/Saya siswa|Bukan siswa/i.test(txt), "pilihan lama siswa/bukan siswa masih ada");
  assert(await page.locator("#gate-role-student-btn, #gate-role-guest-btn, #gate-student-code-skip-btn").count() === 0, "tombol lama (siswa/bukan siswa/lewati) masih ada");
  assert(await page.locator("#gate-role-class-btn").count() === 1 && await page.locator("#gate-role-self-btn").count() === 1, "tombol cara belajar tidak lengkap");
});

test("T30 gerbang belajar mandiri: wajib kode fisika-merdeka (salah ditolak, kapital diterima), tanpa unlock-all", async ctx => {
  const page = await gateToInfo(ctx, "#gate-role-self-btn");
  assert(await page.locator("#gate-step-self-code").isVisible(), "langkah kode belajar mandiri tidak tampil");
  assert(await page.locator("#site-shell").isHidden(), "situs terbuka sebelum kode diisi");
  await page.click("#gate-self-code-btn");
  assert(/dulu/.test(await page.textContent("#gate-self-code-status")), "kode kosong tidak ditolak");
  await page.fill("#gate-self-code-input", "koderahasia"); // kode guru BUKAN kode mandiri
  await page.click("#gate-self-code-btn");
  assert(/salah/i.test(await page.textContent("#gate-self-code-status")), "kode salah tidak ditolak");
  assert(await page.locator("#site-shell").isHidden(), "situs terbuka dengan kode salah");
  await page.fill("#gate-self-code-input", "Fisika-Merdeka");
  await page.click("#gate-self-code-btn");
  await page.waitForSelector("#site-shell:not([hidden])", { timeout: 5000 });
  // belajar mandiri tetap bertahap (80%), bukan membuka semua tab
  assert(!(await page.evaluate(() => isUnlockAll())), "kode belajar mandiri membuka semua topik/tab (unlock-all)");
  await openTopic(page);
  await page.evaluate(() => switchTab("lab"));
  assert(await activeTab(page) === "materi", "tab Lab terbuka tanpa melewati Materi");
  // reload: tidak meminta kode lagi
  await page.reload();
  await page.waitForSelector("#site-shell:not([hidden])", { timeout: 5000 });
});

test("T31 gerbang belajar di kelas: wajib kode sesi guru (salah/tanpa sesi ditolak), tanpa opsi lewati", async ctx => {
  const page = await gateToInfo(ctx, "#gate-role-class-btn");
  assert(await page.locator("#gate-step-student-code").isVisible(), "langkah kode sesi tidak tampil");
  assert(await page.locator("#gate-student-code-skip-btn").count() === 0, "masih ada tombol lewati");
  await page.click("#gate-student-code-btn");
  assert(await page.locator("#site-shell").isHidden(), "situs terbuka tanpa kode");
  await page.fill("#gate-student-code-input", "SALAH1");
  await page.click("#gate-student-code-btn");
  await page.waitForFunction(() => document.getElementById("gate-student-code-status").textContent.length > 0 && !document.getElementById("gate-student-code-btn").disabled);
  assert(await page.locator("#site-shell").isHidden(), "situs terbuka dengan kode sesi salah");
  // kode mandiri BUKAN kode kelas
  await page.fill("#gate-student-code-input", SELF_CODE);
  await page.click("#gate-student-code-btn");
  await page.waitForFunction(() => !document.getElementById("gate-student-code-btn").disabled);
  assert(await page.locator("#site-shell").isHidden(), "kode belajar mandiri meloloskan siswa kelas");
  const code = await startTeacherSession();
  await page.fill("#gate-student-code-input", code);
  await page.click("#gate-student-code-btn");
  await page.waitForSelector("#site-shell:not([hidden])", { timeout: 5000 });
  // guru mengakhiri sesi: siswa tetap belajar, tidak diseret ke gerbang
  await api({ mode: "teacher_session", controlCode: CONTROL_CODE, action: "end" });
  await page.evaluate(() => syncClassSession());
  await page.waitForTimeout(500);
  assert(await page.locator("#site-shell").isVisible(), "siswa kelas dilempar ke gerbang setelah sesi berakhir");
});

test("T32 gerbang: penanda 'lewati' versi lama tidak meloloskan; ulangi proses awal kembali ke pilihan cara belajar", async ctx => {
  const page = await ctx.newPage();
  await page.addInitScript(() => { try { localStorage.setItem("physicsSandbox.sessionStepDone", "1"); localStorage.setItem("physicsSandbox.userRole", "student"); } catch (e) {} });
  await page.goto(BASE + "/index.html");
  await page.fill("#gate-key-input", FAKE_KEY);
  await page.click("#gate-key-save-btn");
  // peran lama "student" dinormalkan menjadi kelas, tetapi tetap butuh nama & kode sesi
  await page.fill("#gate-student-name-input", "Lama");
  await page.fill("#gate-student-class-input", "X");
  await page.click("#gate-student-info-btn");
  assert(await page.locator("#gate-step-student-code").isVisible(), "penanda lewati lama meloloskan siswa tanpa kode");
  // Ulangi proses awal (Pengaturan) kembali ke pilihan cara belajar, dan kode mandiri diminta lagi
  await page.click("#gate-student-code-back-btn");
  await page.evaluate(() => { localStorage.setItem("physicsSandbox.userRole", "self"); localStorage.setItem("physicsSandbox.selfCodeOk", "1"); applyGate(); });
  await page.waitForSelector("#site-shell:not([hidden])", { timeout: 5000 });
  await page.click("#settings-btn");
  await page.click("#settings-reset-onboarding-btn");
  assert(await page.locator("#gate-step-role").isVisible(), "reset tidak kembali ke pilihan cara belajar");
  assert(await page.evaluate(() => localStorage.getItem("physicsSandbox.selfCodeOk")) === null, "penanda kode mandiri tidak dihapus saat reset");
});

test("T33 backend lama ('Prompt kosong.') tidak mengunci: pesan jelas + Next tetap membuka konfirmasi guru", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await reachEksperimen(page, "lab");
  await mock({ staleEks: true });
  await page.fill('.eks-dt-input[data-row="0"][data-col="0"]', "10");
  await page.click("#eks-dt-save-btn");
  await page.waitForFunction(() => /Prompt kosong/i.test(document.getElementById("eks-dt-status").textContent), null, { timeout: 5000 });
  const st = await page.textContent("#eks-dt-status");
  assert(/deploy|perangkat/i.test(st), "pesan tidak menjelaskan penyebab & langkah lanjut: " + st);
  assert(!(await page.evaluate(() => getEksperimenDataSavedFlag("magnetic-fields"))), "flag server tidak boleh menyala");
  await page.click("#progress-next-btn");
  await page.waitForSelector("#confirm-modal:not([hidden])", { timeout: 3000 });
  const corr = await page.evaluate(() => currentTopic.eksperimenCheck.map(q => q.correct));
  for (let i = 0; i < corr.length; i++) await page.check(`input[name="cq-${i}"][value="${corr[i]}"]`);
  await page.click("#confirm-modal-submit-btn");
  await page.waitForTimeout(400);
  const pend = (await api({ mode: "teacher_roster", controlCode: CONTROL_CODE })).gatePending;
  assert(pend.length === 1, "permintaan persetujuan tidak sampai ke guru: " + JSON.stringify(pend));
});

test("T34 Next tetap terkunci bila tabel belum pernah disimpan; gate_submit gagal dibatalkan agar bisa kirim ulang", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  await reachEksperimen(page, "lab");
  await page.click("#progress-next-btn");
  await page.waitForTimeout(300);
  assert(!(await page.locator("#confirm-modal").isVisible()), "modal terbuka padahal tabel belum diisi/disimpan");
  await page.fill('.eks-dt-input[data-row="0"][data-col="0"]', "10");
  await page.click("#eks-dt-save-btn");
  await page.waitForFunction(() => /tersimpan|saved/i.test(document.getElementById("eks-dt-status").textContent));
  await mock({ gateSubmitError: true });
  await page.click("#progress-next-btn");
  const corr = await page.evaluate(() => currentTopic.eksperimenCheck.map(q => q.correct));
  for (let i = 0; i < corr.length; i++) await page.check(`input[name="cq-${i}"][value="${corr[i]}"]`);
  await page.click("#confirm-modal-submit-btn");
  await page.waitForTimeout(600);
  const cached = await page.evaluate(() => getGateCacheEntry("magnetic-fields", "eksperimen"));
  assert(!cached, "status 'menunggu' palsu masih tersimpan setelah server menolak: " + JSON.stringify(cached));
});

test("T35 URL backend LAMA tersimpan di Pengaturan ('Prompt kosong.') otomatis diganti URL bawaan situs", async ctx => {
  const { page } = await loginAsStudent(ctx, { mode: "independent" });
  // URL bawaan situs (config.js, host script.google.com) diarahkan ke server uji;
  // semua host luar lain tetap diblokir oleh newContext().
  await ctx.route("https://script.google.com/**", async route => {
    const r = await fetch(BASE + "/exec", { method: "POST", body: route.request().postData() });
    await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: await r.text() });
  });
  await reachEksperimen(page, "lab");
  // Simulasi browser yang masih menyimpan URL deployment lama: server palsu kedua
  // (path /exec-lama) selalu menjawab "Prompt kosong." seperti backend lama.
  await page.evaluate(() => localStorage.setItem("physicsSandbox.backendUrl", location.origin + "/exec-lama"));
  await page.fill('.eks-dt-input[data-row="0"][data-col="0"]', "10");
  await page.click("#eks-dt-save-btn");
  await page.waitForFunction(() => /tersimpan|saved/i.test(document.getElementById("eks-dt-status").textContent) && !/BELUM|NOT/.test(document.getElementById("eks-dt-status").textContent), null, { timeout: 6000 });
  assert(await page.evaluate(() => getEksperimenDataSavedFlag("magnetic-fields")), "flag server harus menyala setelah retry ke URL bawaan");
  assert(await page.evaluate(() => localStorage.getItem("physicsSandbox.backendUrl")) === null, "URL lama tidak dibuang");
});


/* ---------------- runner ---------------- */
(async () => {
  const filter = process.argv[2] || "";
  browser = await chromium.launch();
  for (const tc of tests.filter(t => t.name.includes(filter))) {
    await resetServer(); // reset sesi aktif & seluruh state server
    const ctx = await newContext();
    try {
      await tc.fn(ctx);
      results.push({ name: tc.name, ok: true });
      console.log("PASS  " + tc.name);
    } catch (e) {
      results.push({ name: tc.name, ok: false, msg: e.message.split("\n")[0] });
      console.log("FAIL  " + tc.name + "\n        -> " + e.message.split("\n")[0]);
    }
    await ctx.close();
  }
  await browser.close();
  const failed = results.filter(r => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} lulus`);
  process.exit(failed ? 1 : 0);
})();

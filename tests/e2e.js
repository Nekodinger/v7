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

/* Masuk sebagai siswa lewat gerbang onboarding.
   mode: "independent" (belajar mandiri, tanpa kode sesi) atau "session" (gabung sesi guru).
   Mengembalikan { page, errors, code }. */
async function loginAsStudent(ctx, { name = "Budi Uji", cls = "XI IPA 2", mode = "independent", sessionCode = null, topicId = TOPIC, tabIndex = 0 } = {}) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errors.push("console: " + m.text()); });
  await page.goto(BASE + "/index.html");
  await page.fill("#gate-key-input", FAKE_KEY);
  await page.click("#gate-key-save-btn");
  await page.click("#gate-role-student-btn");
  await page.fill("#gate-student-name-input", name);
  await page.fill("#gate-student-class-input", cls);
  await page.click("#gate-student-info-btn");
  let code = sessionCode;
  const codeStepVisible = await page.locator("#gate-step-student-code").isVisible();
  if (codeStepVisible) {
    if (mode === "session" || process.env.LEGACY === "1") {
      code = code || await startTeacherSession(topicId, tabIndex);
      await page.fill("#gate-student-code-input", code);
      await page.click("#gate-student-code-btn");
    } else {
      const skip = page.locator("#gate-student-code-skip-btn");
      if (await skip.count() === 0) throw new Error("Siswa TIDAK bisa masuk tanpa kode sesi guru (tidak ada tombol belajar mandiri)");
      await skip.click();
    }
  } else if (mode === "session") {
    // gerbang sudah terlewati tanpa langkah kode: gabung lewat Pengaturan
    code = code || await startTeacherSession(topicId, tabIndex);
    await page.click("#settings-btn");
    await page.locator("#settings-modal details:has(#class-session-code-input) summary").click();
    await page.fill("#class-session-code-input", code);
    await page.click("#class-session-join-btn");
    await page.click("#settings-close-x");
  }
  await page.waitForSelector("#site-shell:not([hidden])", { timeout: 5000 });
  if (process.env.LEGACY === "1" && mode === "independent") {
    // Hanya untuk membandingkan dengan kode LAMA (yang memaksa kode sesi): keluar dari sesi diam-diam.
    await page.evaluate(() => { localStorage.removeItem(STORAGE_KEY_CLASS_CODE); classSession = null; stopClassSync(); renderNav(); });
  }
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

async function reachEksperimen(page) {
  await openTopic(page);
  await answerMateriGate(page, 5);
  await page.waitForSelector(".eks-datatable");
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

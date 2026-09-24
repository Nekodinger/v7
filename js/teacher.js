/* ============================================================
   teacher.js - Panel Guru (kontrol sesi kelas + monitoring)
   ------------------------------------------------------------
   Halaman terpisah dari index.html, dipakai GURU saja. Butuh
   TEACHER_CONTROL_CODE (didefinisikan server-side di
   apps-script/Code.gs) untuk masuk - kode ini TIDAK ada di kode
   klien mana pun, jadi tidak terlihat siswa lewat "View Source".
   ============================================================ */

const STORAGE_KEY_BACKEND_T = "physicsSandbox.backendUrl"; // sama dengan app.js, satu origin
const STORAGE_KEY_GEMINI_T = "physicsSandbox.geminiApiKey"; // sama dengan app.js, dipakai quiz_generate
const SESSION_KEY_CONTROL_CODE = "physicsSandbox.teacherControlCode"; // sessionStorage saja
const ROSTER_POLL_MS = 8000;

let rosterTimer = null;

// ---- Kuis Topik: state di memori (baru benar-benar tersimpan di server
// setelah tombol "Simpan Bank Soal"/"Publikasikan" ditekan) ----
let quizBank = [];             // daftar soal topik yang sedang dibuka
let quizBankDirty = false;     // ada perubahan belum disimpan?
let quizEditingIndex = null;   // index quizBank yang sedang diedit, null = tambah baru
let quizSelectedIds = new Set(); // id soal yang dicentang untuk dipublikasikan
let quizLastActive = null;     // active_quiz terakhir yang diketahui (dari login/poll)

function getBackendUrlT() {
  return (localStorage.getItem(STORAGE_KEY_BACKEND_T) || DEFAULT_BACKEND_URL || "").trim();
}
function getControlCode() {
  return (sessionStorage.getItem(SESSION_KEY_CONTROL_CODE) || "").trim();
}

function readyTopics() {
  return TOPICS.filter(tp => tp.status === "ready").sort((a, b) => a.number - b.number);
}
// Kuis Topik boleh disiapkan untuk topik APA PUN (tidak harus yang materi-nya
// sudah "ready") - guru mungkin ingin menyiapkan kuis lebih dulu sebelum
// materi lengkap ditulis, jadi daftar topiknya semua 25, bukan cuma yang siap.
function allTopicsSorted() {
  return TOPICS.slice().sort((a, b) => a.number - b.number);
}
function topicTitle(id) {
  const tp = TOPICS.find(x => x.id === id);
  return tp ? `${tp.number}. ${trContent(tp.title)}` : (id || "-");
}
function tabLabelsT() {
  return [t("tab.materi"), t("tab.eksperimen"), t("tab.latihan"), t("tab.lab")];
}

function populateTopicSelects() {
  const opts = readyTopics().map(tp => `<option value="${tp.id}">${tp.number}. ${trContent(tp.title)}</option>`).join("");
  document.getElementById("teacher-topic-select").innerHTML = opts;
  document.getElementById("teacher-topic-select-2").innerHTML = opts;
}

async function callBackend(body) {
  const backendUrl = getBackendUrlT();
  if (!backendUrl) {
    return { error: t("teacher.backend.missing") };
  }
  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body)
    });
    return await resp.json();
  } catch (err) {
    return { error: t("teacher.backend.connectfailed", { err: err.message }) };
  }
}

function relativeTime(ms) {
  if (!ms) return "-";
  const diff = Math.max(0, Date.now() - ms);
  const s = Math.round(diff / 1000);
  if (s < 5) return t("time.justnow");
  if (s < 60) return t("time.secondsago", { n: s });
  const m = Math.round(s / 60);
  if (m < 60) return t("time.minutesago", { n: m });
  const h = Math.round(m / 60);
  return t("time.hoursago", { n: h });
}
function statusClass(ms) {
  if (!ms) return "stale";
  const diff = Date.now() - ms;
  if (diff < 20000) return "online";
  if (diff < 60000) return "away";
  return "stale";
}

function renderSessionUI(state) {
  const noSession = document.getElementById("teacher-no-session");
  const hasSession = document.getElementById("teacher-has-session");
  const codeDisplay = document.getElementById("teacher-code-display");
  const statusEl = document.getElementById("teacher-session-status");

  if (state && state.active) {
    noSession.hidden = true;
    hasSession.hidden = false;
    codeDisplay.textContent = state.code || "------";
    if (state.topicId) document.getElementById("teacher-topic-select-2").value = state.topicId;
    if (typeof state.tabIndex === "number") document.getElementById("teacher-tab-select-2").value = String(state.tabIndex);
    statusEl.textContent = t("teacher.session.active", { topic: topicTitle(state.topicId), tab: tabLabelsT()[state.tabIndex] || "" });
  } else {
    noSession.hidden = false;
    hasSession.hidden = true;
    statusEl.textContent = t("teacher.session.none");
  }
}

function renderRoster(roster, serverNow) {
  const body = document.getElementById("roster-body");
  const countEl = document.getElementById("roster-count");
  const ids = Object.keys(roster || {});
  if (ids.length === 0) {
    body.innerHTML = `<tr><td colspan="4" class="muted small">${t("teacher.roster.empty")}</td></tr>`;
    countEl.textContent = "";
    return;
  }
  ids.sort((a, b) => (roster[b].lastSeen || 0) - (roster[a].lastSeen || 0));
  const tabLabels = tabLabelsT();
  body.innerHTML = ids.map(id => {
    const r = roster[id];
    const cls = statusClass(r.lastSeen);
    const activity = r.topicId ? `${topicTitle(r.topicId)} - ${tabLabels[r.tabIndex] || "?"}` : "-";
    // id = nama+kelas yang DIKETIK SISWA sendiri (teks bebas) -> WAJIB di-escape,
    // kalau tidak nama seperti <img onerror=...> akan dieksekusi di browser guru
    // (stored XSS yang bisa mencuri kode kontrol guru dari sessionStorage).
    const lvl = r.level ? t("level." + r.level) : "-";
    return `<tr><td>${escapeHtml(id)}</td><td>${escapeHtml(activity)}</td><td>${escapeHtml(lvl)}</td><td><span class="status-dot ${cls}"></span>${relativeTime(r.lastSeen)}</td></tr>`;
  }).join("");
  const onlineCount = ids.filter(id => statusClass(roster[id].lastSeen) === "online").length;
  countEl.textContent = t("teacher.roster.count", { total: ids.length, online: onlineCount });
}

function stageLabel(stage) {
  return stage === "eksperimen" ? t("teacher.gate.stage.eksperimen") : t("teacher.gate.stage.lab");
}
function renderGatePending(gatePending) {
  const body = document.getElementById("gate-pending-body");
  const list = gatePending || [];
  if (list.length === 0) {
    body.innerHTML = `<tr><td colspan="6" class="muted small">${t("teacher.gate.empty")}</td></tr>`;
    return;
  }
  body.innerHTML = list.map((req, i) => {
    const rowId = `gate-row-${i}`;
    return `<tr id="${rowId}">
      <td>${escapeHtml(req.studentId)}</td>
      <td>${escapeHtml(topicTitle(req.topicId))}</td>
      <td>${escapeHtml(stageLabel(req.stage))}</td>
      <td class="small" style="max-width:260px; white-space:pre-wrap;">${escapeHtml(req.summary)}</td>
      <td><span class="status-dot ${statusClass(req.submittedAt)}"></span>${relativeTime(req.submittedAt)}</td>
      <td>
        <div class="teacher-actions">
          <button type="button" class="btn btn-primary btn-small gate-approve-btn" data-idx="${i}" data-i18n="teacher.gate.approve.btn">Setujui</button>
          <button type="button" class="btn btn-secondary btn-small gate-reject-btn" data-idx="${i}" data-i18n="teacher.gate.reject.btn">Tolak</button>
        </div>
      </td>
    </tr>`;
  }).join("");
  applyStaticI18n(body);

  body.querySelectorAll(".gate-approve-btn").forEach(btn => {
    btn.addEventListener("click", () => decideGate(list[parseInt(btn.dataset.idx, 10)], "approved", ""));
  });
  body.querySelectorAll(".gate-reject-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const note = window.prompt(t("teacher.gate.reject.prompt"), "") || "";
      decideGate(list[parseInt(btn.dataset.idx, 10)], "rejected", note);
    });
  });
}
async function decideGate(req, decision, note) {
  if (!req) return;
  const statusEl = document.getElementById("gate-decide-status");
  statusEl.textContent = t("teacher.gate.deciding");
  const data = await callBackend({
    mode: "teacher_gate_decide", controlCode: getControlCode(),
    topicId: req.topicId, studentId: req.studentId, stage: req.stage, decision, note
  });
  if (data.error) { statusEl.textContent = data.error; return; }
  statusEl.textContent = "";
  pollRoster();
}

async function pollRoster() {
  const data = await callBackend({ mode: "teacher_roster", controlCode: getControlCode() });
  if (data.error) {
    document.getElementById("teacher-session-status").textContent = data.error;
    return;
  }
  renderSessionUI(data.state);
  renderRoster(data.roster, data.serverNow);
  renderGatePending(data.gatePending);
  // Jangan timpa kartu status kuis kalau guru sedang membuka form edit soal
  // (re-render tiap 8 detik akan mengganggu kalau isi form ikut ter-reset) -
  // ini cuma memperbarui KARTU STATUS, bukan form editor, jadi aman.
  renderQuizActiveCard(data.activeQuiz);
}
function startRosterPolling() {
  stopRosterPolling();
  pollRoster();
  rosterTimer = setInterval(pollRoster, ROSTER_POLL_MS);
}
function stopRosterPolling() {
  if (rosterTimer) { clearInterval(rosterTimer); rosterTimer = null; }
}

document.getElementById("teacher-login-btn").addEventListener("click", async () => {
  const backendVal = document.getElementById("teacher-backend-input").value.trim();
  const codeVal = document.getElementById("teacher-control-input").value.trim();
  const statusEl = document.getElementById("teacher-login-status");
  if (!codeVal) { statusEl.textContent = t("teacher.login.needcode"); return; }
  if (backendVal) localStorage.setItem(STORAGE_KEY_BACKEND_T, backendVal);
  sessionStorage.setItem(SESSION_KEY_CONTROL_CODE, codeVal);

  statusEl.textContent = t("teacher.login.checking");
  const data = await callBackend({ mode: "teacher_roster", controlCode: codeVal });
  if (data.error) {
    statusEl.textContent = data.error;
    sessionStorage.removeItem(SESSION_KEY_CONTROL_CODE);
    return;
  }
  document.getElementById("teacher-login-card").hidden = true;
  document.getElementById("teacher-panel").hidden = false;
  populateTopicSelects();
  renderSessionUI(data.state);
  renderRoster(data.roster, data.serverNow);
  renderQuizActiveCard(data.activeQuiz);
  populateQuizTopicSelect();
  loadQuizBank();
  startRosterPolling();
});

document.getElementById("teacher-start-btn").addEventListener("click", async () => {
  const topicId = document.getElementById("teacher-topic-select").value;
  const tabIndex = parseInt(document.getElementById("teacher-tab-select").value, 10);
  const statusEl = document.getElementById("teacher-session-status");
  statusEl.textContent = t("teacher.session.starting");
  const data = await callBackend({ mode: "teacher_session", controlCode: getControlCode(), action: "start", topicId, tabIndex });
  if (data.error) { statusEl.textContent = data.error; return; }
  renderSessionUI(data.state);
});

document.getElementById("teacher-update-btn").addEventListener("click", async () => {
  const topicId = document.getElementById("teacher-topic-select-2").value;
  const tabIndex = parseInt(document.getElementById("teacher-tab-select-2").value, 10);
  const statusEl = document.getElementById("teacher-session-status");
  statusEl.textContent = t("teacher.session.applying");
  const data = await callBackend({ mode: "teacher_session", controlCode: getControlCode(), action: "update", topicId, tabIndex });
  if (data.error) { statusEl.textContent = data.error; return; }
  renderSessionUI(data.state);
});

document.getElementById("teacher-end-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("teacher-session-status");
  statusEl.textContent = t("teacher.session.ending");
  const data = await callBackend({ mode: "teacher_session", controlCode: getControlCode(), action: "end" });
  if (data.error) { statusEl.textContent = data.error; return; }
  renderSessionUI(data.state);
});

// Kalau backend URL sudah tersimpan dari situs utama (satu origin), isikan
// otomatis di form login supaya guru tidak perlu ketik ulang.
document.getElementById("teacher-backend-input").value = getBackendUrlT();

/* ============================================================
   Kuis Topik - bank soal per topik, generate AI, publish ke sesi
   aktif, dan lihat jawaban siswa. Lihat catatan lengkap format data
   di apps-script/Code.gs (bagian "Kuis Topik").
   ============================================================ */

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttrT(str) {
  return String(str == null ? "" : str).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
function newQuestionId() {
  return "q_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function populateQuizTopicSelect() {
  const select = document.getElementById("quiz-topic-select");
  select.innerHTML = allTopicsSorted().map(tp => `<option value="${tp.id}">${tp.number}. ${trContent(tp.title)}</option>`).join("");
}

async function loadQuizBank() {
  const topicId = document.getElementById("quiz-topic-select").value;
  if (!topicId) return;
  closeQuizEditor();
  quizSelectedIds = new Set();
  const loadingNote = document.getElementById("quiz-bank-loading-note");
  const emptyNote = document.getElementById("quiz-bank-empty-note");
  loadingNote.hidden = false;
  emptyNote.hidden = true;
  document.getElementById("quiz-question-list").innerHTML = "";
  const saveStatus = document.getElementById("quiz-save-status");
  saveStatus.textContent = "";
  saveStatus.classList.remove("unsaved");
  const data = await callBackend({ mode: "quiz_bank_get", controlCode: getControlCode(), topicId });
  loadingNote.hidden = true;
  if (data.error) {
    document.getElementById("quiz-generate-status").textContent = data.error;
    quizBank = [];
  } else {
    quizBank = data.questions || [];
    quizBankDirty = false;
  }
  renderQuizList();
}
document.getElementById("quiz-topic-select").addEventListener("change", loadQuizBank);

function updateQuizDirtyStatus() {
  const statusEl = document.getElementById("quiz-save-status");
  if (quizBankDirty) {
    statusEl.textContent = t("quiz.unsaved.note");
    statusEl.classList.add("unsaved");
  }
}

function renderQuizList() {
  const listEl = document.getElementById("quiz-question-list");
  const emptyNote = document.getElementById("quiz-bank-empty-note");
  if (!quizBank.length) {
    listEl.innerHTML = "";
    emptyNote.hidden = false;
    return;
  }
  emptyNote.hidden = true;
  listEl.innerHTML = quizBank.map((q, i) => {
    const badgeClass = q.type === "short" ? "type-short" : (q.type === "essay" ? "type-essay" : "");
    let optionsHtml = "";
    if (q.type === "mcq" && Array.isArray(q.options)) {
      optionsHtml = `<ul class="quiz-options-preview">${q.options.map((opt, oi) =>
        `<li class="${oi === q.correct ? "is-correct" : ""}">${String.fromCharCode(65 + oi)}. ${escapeHtml(opt)}</li>`
      ).join("")}</ul>`;
    }
    return `
      <div class="quiz-question-item">
        <input type="checkbox" class="quiz-select-checkbox" data-index="${i}" ${quizSelectedIds.has(q.id) ? "checked" : ""}>
        <div class="quiz-question-body">
          <span class="quiz-type-badge ${badgeClass}">${t("quiz.type." + q.type)}</span>
          <div class="quiz-question-text">${escapeHtml(q.question)}</div>
          ${optionsHtml}
        </div>
        <div class="quiz-question-actions">
          <button type="button" class="btn btn-secondary btn-small quiz-edit-btn" data-index="${i}">${t("quiz.question.edit.btn")}</button>
          <button type="button" class="btn btn-secondary btn-small quiz-delete-btn" data-index="${i}">${t("quiz.question.delete.btn")}</button>
        </div>
      </div>`;
  }).join("");
  if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([listEl]).catch(() => {});
}

document.getElementById("quiz-question-list").addEventListener("click", (e) => {
  const editBtn = e.target.closest(".quiz-edit-btn");
  if (editBtn) { openQuizEditor(parseInt(editBtn.dataset.index, 10)); return; }
  const delBtn = e.target.closest(".quiz-delete-btn");
  if (delBtn) {
    const idx = parseInt(delBtn.dataset.index, 10);
    if (confirm(t("quiz.confirmdelete"))) {
      const removed = quizBank.splice(idx, 1)[0];
      if (removed) quizSelectedIds.delete(removed.id);
      quizBankDirty = true;
      renderQuizList();
      updateQuizDirtyStatus();
    }
  }
});
document.getElementById("quiz-question-list").addEventListener("change", (e) => {
  if (!e.target.classList.contains("quiz-select-checkbox")) return;
  const idx = parseInt(e.target.dataset.index, 10);
  const q = quizBank[idx];
  if (!q) return;
  if (e.target.checked) quizSelectedIds.add(q.id); else quizSelectedIds.delete(q.id);
});

/* ---- Editor soal (tambah/edit) dengan bantuan LaTeX ---- */

function latexToolbarHtml(targetId) {
  const syms = ["Δ", "θ", "ω", "μ", "π", "λ", "√", "±", "×", "→"];
  const symBtns = syms.map(s => `<button type="button" class="quiz-latex-btn" data-target="${targetId}" data-kind="${escapeAttrT(s)}">${s}</button>`).join("");
  const special = [
    { kind: "math", label: "$x$" },
    { kind: "sup", label: "x²" },
    { kind: "sub", label: "xₙ" },
    { kind: "frac", label: "a/b" }
  ].map(b => `<button type="button" class="quiz-latex-btn" data-target="${targetId}" data-kind="${b.kind}">${b.label}</button>`).join("");
  return `<div class="quiz-latex-toolbar">${symBtns}${special}</div>`;
}

function quizLatexInsert(targetId, kind) {
  const ta = document.getElementById(targetId);
  if (!ta) return;
  const start = ta.selectionStart, end = ta.selectionEnd;
  const val = ta.value;
  const sel = val.slice(start, end);
  let insertText, selStart, selEnd;
  if (kind === "math") { insertText = "$" + (sel || "x") + "$"; selStart = start + 1; selEnd = selStart + (sel || "x").length; }
  else if (kind === "sup") { insertText = "^{" + (sel || "2") + "}"; selStart = start + 2; selEnd = selStart + (sel || "2").length; }
  else if (kind === "sub") { insertText = "_{" + (sel || "0") + "}"; selStart = start + 2; selEnd = selStart + (sel || "0").length; }
  else if (kind === "frac") { insertText = "\\frac{" + (sel || "a") + "}{b}"; selStart = start + 6; selEnd = selStart + (sel || "a").length; }
  else { insertText = kind; selStart = start + kind.length; selEnd = selStart; }
  ta.value = val.slice(0, start) + insertText + val.slice(end);
  ta.focus();
  ta.setSelectionRange(selStart, selEnd);
  ta.dispatchEvent(new Event("input", { bubbles: true }));
}
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".quiz-latex-btn");
  if (btn) quizLatexInsert(btn.dataset.target, btn.dataset.kind);
});
document.addEventListener("input", (e) => {
  if (e.target && e.target.id === "qz-ed-question") updateQuizPreview();
});
document.addEventListener("change", (e) => {
  if (e.target && e.target.id === "qz-ed-type") {
    const wrap = document.getElementById("qz-ed-options-wrap");
    if (wrap) wrap.hidden = (e.target.value !== "mcq");
  }
});
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "qz-ed-save") saveQuizEditor();
  if (e.target && e.target.id === "qz-ed-cancel") closeQuizEditor();
});

// MathJax dimuat async lewat <script async> - kalau editor dibuka/diketik
// SEBELUM script itu selesai load, window.MathJax.typesetPromise belum ada
// sama sekali, jadi preview akan diam-diam gagal ter-render (tetap teks
// mentah "$...$") dan TIDAK PERNAH dicoba ulang otomatis. mathJaxReady()
// menunggu (poll ringan, maks ~10 detik) sampai typesetPromise tersedia,
// supaya preview LaTeX selalu akhirnya jadi gambar rapi begitu MathJax siap.
let _mathJaxReadyPromise = null;
function mathJaxReady() {
  if (_mathJaxReadyPromise) return _mathJaxReadyPromise;
  _mathJaxReadyPromise = new Promise((resolve) => {
    let tries = 0;
    (function check() {
      if (window.MathJax && window.MathJax.typesetPromise) { resolve(); return; }
      if (++tries > 100) { resolve(); return; } // ~10 detik, lalu menyerah diam-diam
      setTimeout(check, 100);
    })();
  });
  return _mathJaxReadyPromise;
}

let quizPreviewTimer = null;
function updateQuizPreview() {
  clearTimeout(quizPreviewTimer);
  quizPreviewTimer = setTimeout(() => {
    const ta = document.getElementById("qz-ed-question");
    const preview = document.getElementById("qz-ed-question-preview");
    if (!ta || !preview) return;
    const text = ta.value;
    preview.textContent = text;
    mathJaxReady().then(() => {
      // Cek ulang elemen+isi masih sama (editor bisa saja sudah ditutup/ganti
      // soal lain selagi menunggu MathJax siap) sebelum benar-benar typeset.
      const p = document.getElementById("qz-ed-question-preview");
      if (p && p.textContent === text && window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([p]).catch(() => {});
      }
    });
  }, 250);
}

function openQuizEditor(index) {
  quizEditingIndex = (typeof index === "number") ? index : null;
  const existing = (quizEditingIndex !== null) ? quizBank[quizEditingIndex] : null;
  const draft = existing ? JSON.parse(JSON.stringify(existing)) : { type: "mcq", question: "", options: ["", "", "", ""], correct: 0, modelAnswer: "" };
  const container = document.getElementById("quiz-editor-container");
  const isMcq = draft.type === "mcq";
  container.innerHTML = `
    <div class="quiz-editor-box">
      <h4>${quizEditingIndex !== null ? t("quiz.editor.title.edit") : t("quiz.editor.title.add")}</h4>
      <label>${t("quiz.editor.type.label")}</label>
      <select id="qz-ed-type">
        <option value="mcq" ${draft.type === "mcq" ? "selected" : ""}>${t("quiz.type.mcq")}</option>
        <option value="short" ${draft.type === "short" ? "selected" : ""}>${t("quiz.type.short")}</option>
        <option value="essay" ${draft.type === "essay" ? "selected" : ""}>${t("quiz.type.essay")}</option>
      </select>

      <label>${t("quiz.editor.question.label")}</label>
      ${latexToolbarHtml("qz-ed-question")}
      <textarea id="qz-ed-question" rows="3">${escapeHtml(draft.question)}</textarea>
      <label>${t("quiz.editor.preview.label")}</label>
      <div class="quiz-editor-preview" id="qz-ed-question-preview"></div>

      <div id="qz-ed-options-wrap" ${isMcq ? "" : "hidden"}>
        <label>${t("quiz.editor.options.label")}</label>
        <p class="muted small">${t("quiz.editor.correct.label")}</p>
        ${[0, 1, 2, 3].map(i => `
          <div class="quiz-option-row">
            <input type="radio" name="qz-ed-correct" value="${i}" ${draft.correct === i ? "checked" : ""}>
            <input type="text" class="qz-ed-option" data-i="${i}" value="${escapeAttrT((draft.options || [])[i] || "")}" placeholder="${t("quiz.optionletter", { letter: String.fromCharCode(65 + i) })}">
          </div>`).join("")}
      </div>

      <label>${t("quiz.editor.modelanswer.label")}</label>
      <textarea id="qz-ed-modelanswer" rows="2">${escapeHtml(draft.modelAnswer || "")}</textarea>

      <div class="quiz-editor-actions">
        <button type="button" id="qz-ed-save" class="btn btn-primary btn-small">${t("quiz.editor.save.btn")}</button>
        <button type="button" id="qz-ed-cancel" class="btn btn-secondary btn-small">${t("quiz.editor.cancel.btn")}</button>
      </div>
    </div>`;
  updateQuizPreview();
  container.scrollIntoView({ behavior: "smooth", block: "center" });
}

function closeQuizEditor() {
  const container = document.getElementById("quiz-editor-container");
  if (container) container.innerHTML = "";
  quizEditingIndex = null;
}

function saveQuizEditor() {
  const type = document.getElementById("qz-ed-type").value;
  const question = document.getElementById("qz-ed-question").value.trim();
  const modelAnswer = document.getElementById("qz-ed-modelanswer").value.trim();
  if (!question) {
    document.getElementById("quiz-generate-status").textContent = t("quiz.editor.needquestion");
    return;
  }
  const entry = {
    id: (quizEditingIndex !== null && quizBank[quizEditingIndex]) ? quizBank[quizEditingIndex].id : newQuestionId(),
    type, question, modelAnswer
  };
  if (type === "mcq") {
    entry.options = Array.from(document.querySelectorAll(".qz-ed-option")).map(inp => inp.value.trim());
    const checkedRadio = document.querySelector('input[name="qz-ed-correct"]:checked');
    entry.correct = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;
  }
  if (quizEditingIndex !== null) quizBank[quizEditingIndex] = entry;
  else quizBank.push(entry);
  quizBankDirty = true;
  document.getElementById("quiz-generate-status").textContent = "";
  closeQuizEditor();
  renderQuizList();
  updateQuizDirtyStatus();
}

document.getElementById("quiz-addmanual-btn").addEventListener("click", () => openQuizEditor(null));

/* ---- Generate Otomatis (AI) ---- */
document.getElementById("quiz-generate-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("quiz-generate-status");
  const apiKey = document.getElementById("quiz-apikey-input").value.trim();
  if (!apiKey) { statusEl.textContent = t("quiz.generate.needapikey"); return; }
  localStorage.setItem(STORAGE_KEY_GEMINI_T, apiKey);
  const topicId = document.getElementById("quiz-topic-select").value;
  const topic = TOPICS.find(tp => tp.id === topicId);
  if (!topic) return;
  let count = parseInt(document.getElementById("quiz-gen-count").value, 10);
  if (isNaN(count) || count < 1) count = 5;
  if (count > 10) count = 10;
  const questionType = document.getElementById("quiz-gen-type").value;
  statusEl.textContent = t("quiz.generate.generating");
  const formulaRef = topic.formulaSheet ? trContent(topic.formulaSheet) : "";
  const existingQuestions = quizBank.map(q => q.question);
  const data = await callBackend({
    mode: "quiz_generate",
    apiKey: apiKey,
    topicId: topicId,
    topicTitle: trContent(topic.title),
    formulaRef: formulaRef,
    existingQuestions: existingQuestions,
    questionType: questionType,
    count: count,
    lang: getLang()
  });
  if (data.error) { statusEl.textContent = data.error; return; }
  const newQuestions = (data.questions || []).map(q => ({ ...q, id: q.id || newQuestionId() }));
  quizBank = quizBank.concat(newQuestions);
  quizBankDirty = true;
  renderQuizList();
  updateQuizDirtyStatus();
  statusEl.textContent = t("quiz.generate.success", { n: newQuestions.length }) + (data.warning ? " " + data.warning : "");
});

/* ---- Simpan bank soal ke server ---- */
document.getElementById("quiz-save-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("quiz-save-status");
  const topicId = document.getElementById("quiz-topic-select").value;
  statusEl.textContent = t("quiz.save.saving");
  statusEl.classList.remove("unsaved");
  const data = await callBackend({ mode: "quiz_bank_save", controlCode: getControlCode(), topicId: topicId, questions: quizBank });
  if (data.error) { statusEl.textContent = data.error; statusEl.classList.add("unsaved"); return; }
  quizBank = data.questions || quizBank;
  quizBankDirty = false;
  renderQuizList();
  statusEl.textContent = t("quiz.save.saved");
});

/* ---- Publikasikan ke sesi kelas aktif ---- */
document.getElementById("quiz-publish-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("quiz-save-status");
  const topicId = document.getElementById("quiz-topic-select").value;
  const selected = quizBank.filter(q => quizSelectedIds.has(q.id));
  if (!selected.length) { statusEl.textContent = t("quiz.publish.needselection"); statusEl.classList.add("unsaved"); return; }
  statusEl.textContent = t("quiz.publish.publishing");
  statusEl.classList.remove("unsaved");
  const data = await callBackend({ mode: "quiz_publish", controlCode: getControlCode(), topicId: topicId, questions: selected });
  if (data.error) { statusEl.textContent = data.error; statusEl.classList.add("unsaved"); return; }
  statusEl.textContent = "";
  renderQuizActiveCard(data.quiz);
});

function renderQuizActiveCard(quiz) {
  quizLastActive = quiz || null;
  const card = document.getElementById("quiz-active-card");
  const endBtn = document.getElementById("quiz-end-btn");
  if (!quiz || !quiz.id) {
    card.hidden = true;
    endBtn.hidden = true;
    return;
  }
  card.hidden = false;
  card.classList.toggle("ended", !quiz.active);
  const timeStr = quiz.publishedAt ? new Date(quiz.publishedAt).toLocaleTimeString() : "-";
  card.textContent = quiz.active
    ? t("quiz.active.status", { topic: topicTitle(quiz.topicId), count: (quiz.questions || []).length, time: timeStr })
    : t("quiz.ended.status", { topic: topicTitle(quiz.topicId), count: (quiz.questions || []).length });
  endBtn.hidden = !quiz.active;
}

document.getElementById("quiz-end-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("quiz-save-status");
  statusEl.textContent = t("quiz.end.ending");
  const data = await callBackend({ mode: "quiz_unpublish", controlCode: getControlCode() });
  if (data.error) { statusEl.textContent = data.error; return; }
  statusEl.textContent = "";
  if (quizLastActive) { quizLastActive.active = false; renderQuizActiveCard(quizLastActive); }
});

/* ---- Lihat Jawaban Siswa ---- */
document.getElementById("quiz-viewresults-btn").addEventListener("click", async () => {
  const body = document.getElementById("quiz-results-body");
  body.innerHTML = `<p class="teacher-note">${t("quiz.results.loading")}</p>`;
  document.getElementById("quiz-results-modal").hidden = false;
  const data = await callBackend({ mode: "quiz_results", controlCode: getControlCode() });
  if (data.error) { body.innerHTML = `<p class="teacher-note">${data.error}</p>`; return; }
  renderQuizResults(data.quiz, data.answers || []);
});
function closeQuizResultsModal() { document.getElementById("quiz-results-modal").hidden = true; }
document.getElementById("quiz-results-close-btn").addEventListener("click", closeQuizResultsModal);
document.getElementById("quiz-results-close-x").addEventListener("click", closeQuizResultsModal);

function renderQuizResults(quiz, answers) {
  const body = document.getElementById("quiz-results-body");
  if (!quiz || !quiz.id) {
    body.innerHTML = `<p class="teacher-note">${t("quiz.none.status")}</p>`;
    return;
  }
  if (!answers.length) {
    body.innerHTML = `<p class="teacher-note">${t("quiz.results.empty")}</p>`;
    return;
  }
  const questions = quiz.questions || [];
  let html = `<div style="overflow-x:auto;"><table class="quiz-results-table"><thead><tr><th>${t("teacher.th.studentid")}</th>`;
  questions.forEach((q, i) => { html += `<th>${t("quiz.modal.question.label", { n: i + 1 })}</th>`; });
  html += `</tr></thead><tbody>`;
  answers.forEach(a => {
    html += `<tr><td>${escapeHtml(a.studentId)}</td>`;
    questions.forEach(q => {
      const val = (a.answers || {})[q.id];
      let cell = "-";
      if (val !== undefined && val !== null && val !== "") {
        if (q.type === "mcq") {
          const letter = (typeof val === "number") ? String.fromCharCode(65 + val) : "-";
          const isCorrect = val === q.correct;
          cell = `<span class="${isCorrect ? "quiz-answer-correct" : "quiz-answer-incorrect"}">${letter} (${isCorrect ? t("quiz.results.correct") : t("quiz.results.incorrect")})</span>`;
        } else {
          cell = escapeHtml(String(val));
        }
      }
      html += `<td>${cell}</td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody></table></div>`;
  body.innerHTML = html;
  if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([body]).catch(() => {});
}

// Kalau API key Gemini sudah tersimpan (dari situs utama atau sesi
// sebelumnya di panel ini), isikan otomatis di form Generate Otomatis.
document.getElementById("quiz-apikey-input").value = localStorage.getItem(STORAGE_KEY_GEMINI_T) || "";

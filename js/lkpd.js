/* ============================================================
   LKPD INTERAKTIF (Lembar Kerja Peserta Didik) - renderer
   ------------------------------------------------------------
   Dimuat SEBELUM js/app.js (hanya mendefinisikan fungsi; semua fungsi
   app.js/i18n.js yang dipanggil di sini baru dipakai saat render).
   Konten ada di js/lkpd-content.js. Fitur, mirip LiveWorksheet:
     - pilihan mode praktikum (Sederhana / Lab)
     - ceklis alat & langkah kerja, ukuran alat, tabel data yang bisa diisi
     - grafik F-I otomatis (regresi linear) + gradien + B
     - soal pilihan ganda / hitungan dengan tombol "Cek Jawaban",
       isian bebas dengan contoh jawaban, petunjuk, dan skor
     - semua jawaban tersimpan di perangkat (per siswa, topik, mode)
   ============================================================ */

const STORAGE_KEY_LKPD = "physicsSandbox.lkpd";
const STORAGE_KEY_EKS_MODE = "physicsSandbox.eksMode";
let lkpdCtx = null; // konteks render aktif { topic, ex, mode, def, st, items }

/* ---------------- Penyimpanan ---------------- */
function lkpdLoadAll() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_LKPD) || "{}") || {}; }
  catch (e) { return {}; }
}
function lkpdState(topicId, mode) {
  const all = lkpdLoadAll();
  const sid = getStudentId();
  const st = (((all[sid] || {})[topicId] || {})[mode]) || {};
  return {
    tick: st.tick || {}, vars: st.vars || {}, a: st.a || {}, ck: st.ck || {},
    open: st.open || {}, table: st.table || null
  };
}
function lkpdSave() {
  if (!lkpdCtx) return;
  try {
    const all = lkpdLoadAll();
    const sid = getStudentId();
    all[sid] = all[sid] || {};
    all[sid][lkpdCtx.topic.id] = all[sid][lkpdCtx.topic.id] || {};
    all[sid][lkpdCtx.topic.id][lkpdCtx.mode] = lkpdCtx.st;
    localStorage.setItem(STORAGE_KEY_LKPD, JSON.stringify(all));
  } catch (e) { /* penyimpanan penuh/diblokir: LKPD tetap jalan tanpa simpan */ }
}
function getEksMode(topic) {
  const lk = topic.eksperimen && topic.eksperimen.lkpd;
  if (!lk) return null;
  let map = {};
  try { map = JSON.parse(localStorage.getItem(STORAGE_KEY_EKS_MODE) || "{}") || {}; } catch (e) { /* abaikan */ }
  const m = map[topic.id];
  return (m && lk.modes[m]) ? m : lk.defaultMode;
}
function setEksMode(topicId, mode) {
  let map = {};
  try { map = JSON.parse(localStorage.getItem(STORAGE_KEY_EKS_MODE) || "{}") || {}; } catch (e) { /* abaikan */ }
  map[topicId] = mode;
  try { localStorage.setItem(STORAGE_KEY_EKS_MODE, JSON.stringify(map)); } catch (e) { /* abaikan */ }
}

/* ---------------- Util ---------------- */
function lkpdEsc(s) {
  return String(s === null || s === undefined ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function lkpdNum(s) {
  const n = parseFloat(String(s === null || s === undefined ? "" : s).replace(",", "."));
  return isNaN(n) ? null : n;
}
function lkpdFmt(x, digits) {
  if (x === null || x === undefined || !isFinite(x)) return "-";
  let s = Number(x.toPrecision(digits || 3)).toString();
  if (/e/.test(s)) s = Number(x.toPrecision(digits || 3)).toExponential(2);
  return getLang() === "id" ? s.replace(".", ",") : s;
}
function lkpdVisible(sec) {
  return !sec.onlyFor || sec.onlyFor === currentLevel();
}
function lkpdCheckable(sec) { return sec.type === "choice" || sec.type === "calc"; }

/* ---------------- Regresi & perhitungan B ---------------- */
function lkpdFit(pts) {
  const n = pts.length;
  if (n < 2) return null;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  pts.forEach(p => { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; });
  const den = n * sxx - sx * sx;
  if (Math.abs(den) < 1e-12) return null;
  const m = (n * sxy - sx * sy) / den;
  const c = (sy - m * sx) / n;
  const ybar = sy / n;
  let ssTot = 0, ssRes = 0;
  pts.forEach(p => { ssTot += (p.y - ybar) * (p.y - ybar); const e = p.y - (m * p.x + c); ssRes += e * e; });
  return { m, c, r2: ssTot > 0 ? 1 - ssRes / ssTot : 1 };
}
// Titik data (I, F) dibaca langsung dari tabel yang sedang tampil di layar.
function lkpdTablePoints() {
  const panel = document.getElementById("panel-eksperimen");
  const table = panel && panel.querySelector(".eks-datatable");
  if (!table || !lkpdCtx) return [];
  const dt = lkpdCtx.def.dataTable;
  const factor = (typeof dt.derivedFactor === "number") ? dt.derivedFactor : 1;
  const pts = [];
  readEksperimenTable(table, dt).forEach(r => {
    const nums = r.values.map(v => lkpdNum(v)).filter(v => v !== null);
    if (r.I !== null && nums.length) {
      pts.push({ x: r.I, y: (nums.reduce((a, b) => a + b, 0) / nums.length) * factor });
    }
  });
  return pts;
}
function lkpdVarSI(key) {
  const sec = lkpdCtx.def.sections.find(s => s.type === "vars");
  const f = sec && sec.fields.find(x => x.key === key);
  if (!f) return null;
  const raw = (f.fixed !== undefined) ? f.fixed : lkpdNum(lkpdCtx.st.vars[key]);
  if (raw === null || raw <= 0) return null;
  return raw * (f.toSI || 1);
}
function lkpdComputeB() {
  const pts = lkpdTablePoints();
  const fit = lkpdFit(pts);
  const L = lkpdVarSI("L"), N = lkpdVarSI("N");
  const B = (fit && fit.m > 0 && L && N) ? fit.m / (N * L) : null;
  return { pts, fit, L, N, B };
}

/* ---------------- Render ---------------- */
function lkpdModePickerHTML(lk, mode) {
  const cards = Object.keys(lk.modes).map(key => {
    const md = lk.modes[key];
    const on = key === mode;
    return `<button type="button" class="lkpd-mode-card${on ? " on" : ""}" data-eks-mode="${key}" aria-pressed="${on}">
      <span class="lkpd-mode-badge">${lkpdEsc(trContent(md.badge))}</span>
      <strong>${lkpdEsc(trContent(md.name))}</strong>
      <span class="lkpd-mode-tag">${trContent(md.tagline)}</span>
    </button>`;
  }).join("");
  return `<div class="lkpd-mode"><h4>${t("lkpd.mode.title")}</h4><div class="lkpd-mode-cards">${cards}</div>` +
    `<p class="muted small">${t("lkpd.mode.note")}</p></div>`;
}
function lkpdHintHTML(sec) {
  if (!sec.hint) return "";
  const open = currentLevel() === "dasar" ? " open" : "";
  return `<details class="lkpd-hint"${open}><summary>${t("lkpd.hint")}</summary><div>${trContent(sec.hint)}</div></details>`;
}
function lkpdSectionHTML(sec, idx, st) {
  const title = sec.title ? `<h4>${trContent(sec.title)}</h4>` : "";
  const enrich = sec.onlyFor ? `<span class="level-tag level-lanjut">${t("lkpd.enrich")}</span> ` : "";
  switch (sec.type) {
    case "info":
      return `<section class="lkpd-sec">${title}${trContent(sec.html)}</section>`;
    case "materials": {
      const items = sec.items.map((it, i) => {
        const key = `m${idx}-${i}`;
        return `<li><label class="lkpd-tick"><input type="checkbox" data-tick="${key}"${st.tick[key] ? " checked" : ""}> <span>${trContent(it.n)}${it.note ? ` <span class="muted">- ${trContent(it.note)}</span>` : ""}</span></label></li>`;
      }).join("");
      const kits = (sec.kits && sec.kits.length) ? `<div class="lkpd-kits"><h5>${t("lkpd.kits.title")}</h5>` +
        sec.kits.map(k => `<div class="lkpd-kit"><div class="lkpd-kit-head"><strong>${trContent(k.name)}</strong> <span class="lkpd-kit-code">${lkpdEsc(k.code)}</span></div>` +
          `<p class="small">${trContent(k.note)}</p>` +
          (k.url ? `<a class="small" href="${lkpdEsc(k.url)}" target="_blank" rel="noopener noreferrer">${trContent(k.urlLabel || k.url)}</a>` : "") + `</div>`).join("") + `</div>` : "";
      const foot = sec.footnote ? `<p class="muted small">${trContent(sec.footnote)}</p>` : "";
      return `<section class="lkpd-sec">${title}<ul class="lkpd-checklist">${items}</ul>${kits}${foot}</section>`;
    }
    case "steps": {
      const items = sec.items.map((it, i) => {
        const key = `s${idx}-${i}`;
        return `<li><label class="lkpd-tick"><input type="checkbox" data-tick="${key}"${st.tick[key] ? " checked" : ""}> <span>${trContent(it.h)}</span></label></li>`;
      }).join("");
      return `<section class="lkpd-sec">${title}<ol class="lkpd-checklist lkpd-steps">${items}</ol></section>`;
    }
    case "safety":
      return `<section class="lkpd-sec lkpd-safety">${title}<ul>${sec.items.map(it => `<li>${trContent(it.h)}</li>`).join("")}</ul></section>`;
    case "vars": {
      const fields = sec.fields.map(f => {
        if (f.fixed !== undefined) {
          return `<div class="lkpd-var"><span>${trContent(f.label)}</span> <strong>= ${f.fixed}</strong></div>`;
        }
        return `<label class="lkpd-var"><span>${trContent(f.label)}</span> <input type="number" step="${f.step || "any"}" min="0" data-var="${f.key}" value="${lkpdEsc(st.vars[f.key] === undefined ? "" : st.vars[f.key])}" placeholder="${lkpdEsc(trContent(f.hint))}"> <span class="muted">${lkpdEsc(trContent(f.unit))}</span></label>`;
      }).join("");
      return `<section class="lkpd-sec">${title}<p class="muted small">${trContent(sec.desc)}</p><div class="lkpd-vars">${fields}</div></section>`;
    }
    case "table":
      return `<section class="lkpd-sec">${title}<p class="muted small">${trContent(sec.desc)}</p>` +
        renderEksperimenDataTableHTML(lkpdCtx.def.dataTable, st.table, { bare: true }) + `</section>`;
    case "graph":
      return `<section class="lkpd-sec">${title}<p class="muted small">${trContent(sec.desc)}</p><div id="lkpd-graph" class="lkpd-graph" aria-live="polite"></div></section>`;
    case "choice": {
      const opts = sec.options.map((o, oi) =>
        `<li data-o="${oi}"><label><input type="radio" name="lk-${sec.id}" value="${oi}"${st.a[sec.id] === oi ? " checked" : ""}> ${String.fromCharCode(65 + oi)}. ${trContent(o)}</label></li>`).join("");
      return `<section class="lkpd-sec lkpd-q" data-q="${sec.id}"><div class="q-title">${enrich}${trContent(sec.q)}</div>` +
        `<ul class="options lkpd-options">${opts}</ul>${lkpdHintHTML(sec)}` +
        `<button type="button" class="reveal-btn" data-check="${sec.id}">${t("lkpd.check")}</button>` +
        `<p class="confirm-feedback small lkpd-fb" hidden></p><div class="lkpd-explain" hidden><strong>${t("question.solution")}</strong> ${trContent(sec.explain)}</div></section>`;
    }
    case "calc":
      return `<section class="lkpd-sec lkpd-q" data-q="${sec.id}"><div class="q-title">${enrich}${trContent(sec.q)}</div>` +
        `<label class="lkpd-calc-in"><input type="number" step="any" data-calc="${sec.id}" value="${lkpdEsc(st.a[sec.id] === undefined ? "" : st.a[sec.id])}" placeholder="${t("lkpd.calc.placeholder")}"> <span class="muted">${lkpdEsc(sec.unit)}</span></label>${lkpdHintHTML(sec)}` +
        `<button type="button" class="reveal-btn" data-check="${sec.id}">${t("lkpd.check")}</button>` +
        `<p class="confirm-feedback small lkpd-fb" hidden></p><div class="lkpd-explain" hidden><strong>${t("question.solution")}</strong> ${trContent(sec.explain)}</div></section>`;
    case "open":
      return `<section class="lkpd-sec lkpd-q" data-q="${sec.id}"><div class="q-title">${enrich}${trContent(sec.q)}</div>` +
        `<textarea class="latihan-answer" rows="4" data-open="${sec.id}" placeholder="${lkpdEsc(t("lkpd.open.placeholder"))}">${lkpdEsc(st.open[sec.id] || "")}</textarea>${lkpdHintHTML(sec)}` +
        `<button type="button" class="reveal-btn" data-reveal="${sec.id}">${t("lkpd.model.show")}</button>` +
        `<div class="lkpd-explain lkpd-model" hidden><strong>${t("lkpd.model.title")}</strong> ${trContent(sec.model)}</div></section>`;
    default:
      return "";
  }
}
function renderLkpdHTML(topic, ex) {
  const lk = ex.lkpd;
  const mode = getEksMode(topic);
  const def = lk.modes[mode];
  lkpdCtx = { topic, ex, mode, def, st: lkpdState(topic.id, mode) };
  const body = def.sections.map((sec, idx) => lkpdVisible(sec) ? lkpdSectionHTML(sec, idx, lkpdCtx.st) : "").join("");
  return `<div class="lkpd" data-mode="${mode}">${lkpdModePickerHTML(lk, mode)}` +
    `<div id="lkpd-progress" class="lkpd-progress" aria-live="polite"></div>${body}</div>`;
}

/* ---------------- Grafik F-I ---------------- */
function lkpdNiceStep(range, ticks) {
  const raw = range / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const f = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return f * mag;
}
function lkpdGraphSVG(pts, fit) {
  const W = 560, H = 320, ml = 66, mr = 16, mt = 14, mb = 44;
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  const xmax = Math.max(...xs, 0) * 1.1 || 1;
  const xmin = Math.min(0, ...xs);
  let ymax = Math.max(...ys, 0), ymin = Math.min(0, ...ys);
  if (fit) { ymax = Math.max(ymax, fit.m * xmax + fit.c); ymin = Math.min(ymin, fit.c); }
  ymax = ymax * 1.1 || 1;
  if (ymin < 0) ymin = ymin * 1.1;
  const X = v => ml + (v - xmin) / (xmax - xmin) * (W - ml - mr);
  const Y = v => H - mb - (v - ymin) / (ymax - ymin) * (H - mt - mb);
  const xs_ = lkpdNiceStep(xmax - xmin, 6), ys_ = lkpdNiceStep(ymax - ymin, 5);
  let grid = "";
  for (let v = Math.ceil(xmin / xs_) * xs_; v <= xmax + 1e-9; v += xs_) {
    grid += `<line class="g" x1="${X(v)}" y1="${mt}" x2="${X(v)}" y2="${H - mb}"/><text x="${X(v)}" y="${H - mb + 16}" text-anchor="middle">${lkpdFmt(v, 2)}</text>`;
  }
  for (let v = Math.ceil(ymin / ys_) * ys_; v <= ymax + 1e-9; v += ys_) {
    grid += `<line class="g" x1="${ml}" y1="${Y(v)}" x2="${W - mr}" y2="${Y(v)}"/><text x="${ml - 6}" y="${Y(v) + 4}" text-anchor="end">${lkpdFmt(v, 2)}</text>`;
  }
  const dt = lkpdCtx.def.dataTable;
  const line = fit ? `<line class="fit" x1="${X(xmin)}" y1="${Y(fit.m * xmin + fit.c)}" x2="${X(xmax)}" y2="${Y(fit.m * xmax + fit.c)}"/>` : "";
  const dots = pts.map(p => `<circle class="pt" cx="${X(p.x)}" cy="${Y(p.y)}" r="4.5"/>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${lkpdEsc(t("lkpd.graph.aria"))}" class="lkpd-svg">` +
    `<rect class="bg" x="${ml}" y="${mt}" width="${W - ml - mr}" height="${H - mt - mb}"/>${grid}` +
    `<line class="ax" x1="${ml}" y1="${mt}" x2="${ml}" y2="${H - mb}"/><line class="ax" x1="${ml}" y1="${H - mb}" x2="${W - mr}" y2="${H - mb}"/>` +
    `${line}${dots}` +
    `<text class="lab" x="${(ml + W - mr) / 2}" y="${H - 6}" text-anchor="middle">${lkpdEsc(dt.independentLabel)}</text>` +
    `<text class="lab" transform="translate(14 ${(mt + H - mb) / 2}) rotate(-90)" text-anchor="middle">F (N)</text></svg>`;
}
function renderLkpdGraph() {
  const box = document.getElementById("lkpd-graph");
  if (!box || !lkpdCtx) return;
  const r = lkpdComputeB();
  if (r.pts.length < 2 || !r.fit) {
    box.innerHTML = `<p class="muted small">${t("lkpd.graph.empty")}</p>`;
    return;
  }
  const lk = lkpdCtx.ex.lkpd, lo = lk.plausibleB[0], hi = lk.plausibleB[1];
  let res = `<p class="lkpd-result">${t("lkpd.graph.gradient", { m: lkpdFmt(r.fit.m), sign: r.fit.c < 0 ? "\u2212" : "+", c: lkpdFmt(Math.abs(r.fit.c)), r2: lkpdFmt(r.fit.r2, 3) })}</p>`;
  if (r.B !== null) {
    const ok = r.B >= lo && r.B <= hi;
    res += `<p class="lkpd-result strong">${t("lkpd.graph.b", { b: lkpdFmt(r.B) })}</p>` +
      `<p class="small ${ok ? "lkpd-ok" : "lkpd-warn"}">${t(ok ? "lkpd.graph.plausible" : "lkpd.graph.implausible", { lo: lkpdFmt(lo, 2), hi: lkpdFmt(hi, 2) })}</p>`;
  } else if (r.fit.m <= 0) {
    res += `<p class="small lkpd-warn">${t("lkpd.graph.negslope")}</p>`;
  } else {
    res += `<p class="small muted">${t("lkpd.graph.needvars")}</p>`;
  }
  box.innerHTML = lkpdGraphSVG(r.pts, r.fit) + res;
}

/* ---------------- Cek jawaban ---------------- */
function lkpdApplyCheck(id, notify) {
  const sec = lkpdCtx.def.sections.find(s => s.id === id);
  const card = document.querySelector(`.lkpd-q[data-q="${id}"]`);
  if (!sec || !card) return;
  const fb = card.querySelector(".lkpd-fb");
  const ex = card.querySelector(".lkpd-explain");
  let ok = false;
  fb.hidden = false;
  if (sec.type === "choice") {
    const picked = card.querySelector("input[type=radio]:checked");
    if (!picked) { fb.className = "confirm-feedback small warn lkpd-fb"; fb.textContent = t("lkpd.pick"); return; }
    const pv = parseInt(picked.value, 10);
    ok = pv === sec.correct;
    card.querySelectorAll(".lkpd-options li").forEach((li, oi) => {
      li.classList.remove("opt-correct", "opt-wrong");
      const old = li.querySelector(".opt-correct-tag"); if (old) old.remove();
      if (oi === sec.correct) { li.classList.add("opt-correct"); (li.querySelector("label") || li).insertAdjacentHTML("beforeend", ` <span class="muted opt-correct-tag">${t("answer.correct")}</span>`); }
      else if (oi === pv) li.classList.add("opt-wrong");
    });
    fb.className = "confirm-feedback small " + (ok ? "ok" : "warn") + " lkpd-fb";
    fb.textContent = ok ? t("lkpd.correct") : t("lkpd.wrong.letter", { letter: String.fromCharCode(65 + sec.correct) });
    lkpdCtx.st.a[id] = pv;
  } else {
    const input = card.querySelector("input[data-calc]");
    const v = lkpdNum(input.value);
    if (v === null) { fb.className = "confirm-feedback small warn lkpd-fb"; fb.textContent = t("lkpd.calc.needvalue"); return; }
    const r = lkpdComputeB();
    if (r.B === null) { fb.className = "confirm-feedback small warn lkpd-fb"; fb.textContent = t("lkpd.needdata"); lkpdCtx.st.a[id] = input.value; lkpdSave(); return; }
    ok = Math.abs(v - r.B) / r.B * 100 <= sec.tolPct;
    fb.className = "confirm-feedback small " + (ok ? "ok" : "warn") + " lkpd-fb";
    fb.textContent = ok ? t("lkpd.calc.right", { val: lkpdFmt(r.B) }) : t("lkpd.calc.wrong", { val: lkpdFmt(r.B) });
    lkpdCtx.st.a[id] = input.value;
  }
  ex.hidden = false;
  lkpdCtx.st.ck[id] = ok ? 1 : 2; // 1 = benar, 2 = sudah dicek tetapi salah
  lkpdSave();
  lkpdUpdateProgress();
  if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([card]).catch(() => {});
}

/* ---------------- Kemajuan & skor ---------------- */
function lkpdStats() {
  const secs = lkpdCtx.def.sections.filter(lkpdVisible);
  const st = lkpdCtx.st;
  const checkable = secs.filter(lkpdCheckable);
  const okCount = checkable.filter(s => st.ck[s.id] === 1).length;
  let done = 0, total = 0;
  secs.forEach((sec, _i) => {
    const idx = lkpdCtx.def.sections.indexOf(sec);
    if (sec.type === "materials" || sec.type === "steps") {
      sec.items.forEach((_, i) => { total++; if (st.tick[`${sec.type === "steps" ? "s" : "m"}${idx}-${i}`]) done++; });
    } else if (sec.type === "vars") {
      sec.fields.filter(f => f.fixed === undefined).forEach(f => { total++; if (lkpdNum(st.vars[f.key]) !== null) done++; });
    } else if (sec.type === "table") {
      total++; if (lkpdTablePoints().length >= 3 || getEksperimenDataSavedFlag(lkpdCtx.topic.id)) done++;
    } else if (lkpdCheckable(sec)) {
      total++; if (st.ck[sec.id]) done++;
    } else if (sec.type === "open") {
      total++; if ((st.open[sec.id] || "").trim().length >= 15) done++;
    }
  });
  return { okCount, checkTotal: checkable.length, pct: total ? Math.round(done / total * 100) : 0 };
}
function lkpdUpdateProgress() {
  const box = document.getElementById("lkpd-progress");
  if (!box || !lkpdCtx) return;
  const s = lkpdStats();
  box.innerHTML = `<div class="lkpd-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.pct}"><span style="width:${s.pct}%"></span></div>` +
    `<div class="lkpd-progress-text"><span>${t("lkpd.progress.done", { pct: s.pct })}</span><span>${t("lkpd.progress.score", { ok: s.okCount, total: s.checkTotal })}</span></div>`;
}
// Ringkasan singkat untuk guru; ditempelkan ke ringkasan gerbang Eksperimen.
function lkpdSummaryText() {
  const topic = (typeof currentTopic !== "undefined") ? currentTopic : null;
  if (!topic || !topic.eksperimen || !topic.eksperimen.lkpd) return "";
  if (!lkpdCtx || lkpdCtx.topic.id !== topic.id) lkpdCtx = { topic, ex: topic.eksperimen, mode: getEksMode(topic), def: topic.eksperimen.lkpd.modes[getEksMode(topic)], st: null };
  if (!lkpdCtx.st) lkpdCtx.st = lkpdState(topic.id, lkpdCtx.mode);
  const s = lkpdStats();
  return " " + t("lkpd.summary", { mode: trContent(lkpdCtx.def.name), ok: s.okCount, total: s.checkTotal, pct: s.pct });
}

/* ---------------- Interaksi ---------------- */
function wireLkpd(panel, topic, ex) {
  const root = panel.querySelector(".lkpd");
  if (!root || !lkpdCtx) return;
  const dt = lkpdCtx.def.dataTable;

  root.addEventListener("click", (e) => {
    const modeBtn = e.target.closest("[data-eks-mode]");
    if (modeBtn) {
      const key = modeBtn.dataset.eksMode;
      if (key !== lkpdCtx.mode) { setEksMode(topic.id, key); renderEksperimen(); }
      return;
    }
    const chk = e.target.closest("[data-check]");
    if (chk) { lkpdApplyCheck(chk.dataset.check, true); return; }
    const rev = e.target.closest("[data-reveal]");
    if (rev) {
      const card = rev.closest(".lkpd-q");
      const model = card.querySelector(".lkpd-model");
      model.hidden = !model.hidden;
      if (!model.hidden && window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([model]).catch(() => {});
    }
  });
  root.addEventListener("change", (e) => {
    const tick = e.target.closest("[data-tick]");
    if (tick) {
      lkpdCtx.st.tick[tick.dataset.tick] = tick.checked;
      lkpdSave(); lkpdUpdateProgress();
    }
  });
  root.addEventListener("input", (e) => {
    const v = e.target.closest("[data-var]");
    if (v) {
      lkpdCtx.st.vars[v.dataset.var] = v.value;
      lkpdSave(); renderLkpdGraph(); lkpdUpdateProgress();
      return;
    }
    const o = e.target.closest("[data-open]");
    if (o) { lkpdCtx.st.open[o.dataset.open] = o.value; lkpdSave(); lkpdUpdateProgress(); return; }
    const c = e.target.closest("[data-calc]");
    if (c) { lkpdCtx.st.a[c.dataset.calc] = c.value; lkpdSave(); }
  });

  wireEksperimenDataTable(dt, {
    modeKey: lkpdCtx.mode,
    onChange: (tableState) => {
      lkpdCtx.st.table = tableState;
      lkpdSave(); renderLkpdGraph(); lkpdUpdateProgress();
    },
    onSaved: () => lkpdUpdateProgress()
  });

  // Pulihkan jawaban yang sudah pernah dicek (tanda benar/salah + pembahasan).
  lkpdCtx.def.sections.forEach(sec => {
    if (lkpdCheckable(sec) && lkpdVisible(sec) && lkpdCtx.st.ck[sec.id]) lkpdApplyCheck(sec.id, false);
  });
  renderLkpdGraph();
  lkpdUpdateProgress();
}

/* Topik tanpa LKPD: sel kosong pada tabel statis di teks eksperimen dibuat
   bisa diisi (tidak ada lagi tabel kosong yang tidak bisa diklik). */
function makeStaticTablesFillable(panel) {
  panel.querySelectorAll("table:not(.eks-datatable)").forEach(tbl => {
    tbl.querySelectorAll("td").forEach(td => {
      if (!td.children.length && td.textContent.trim() === "") {
        td.innerHTML = `<input type="text" class="lkpd-cell" aria-label="${lkpdEsc(t("lkpd.cell.aria"))}">`;
      }
    });
    tbl.classList.add("lkpd-fillable");
  });
}

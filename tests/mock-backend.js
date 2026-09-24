/* ============================================================
   tests/mock-backend.js
   Server uji lokal: menyajikan situs statis DAN menjalankan
   apps-script/Code.gs asli di dalam sandbox Node dengan layanan
   Google (PropertiesService, SpreadsheetApp, UrlFetchApp, dst)
   ditiru di memori. Dengan begitu logika backend yang sebenarnya
   ikut teruji, tanpa menyentuh Apps Script/Spreadsheet/kuota Gemini
   milik siapa pun.

   Jalankan:  node tests/mock-backend.js [port]
   Endpoint bantu (hanya untuk tes):
     POST /__reset       -> reset SEMUA state server (sesi kelas, gate, kuis, sheet)
     GET  /__state       -> isi sheet tersimpan + log panggilan Gemini palsu
     POST /__mock        -> ubah perilaku Gemini palsu {geminiStatus, sheetFail, simHtml}
   ============================================================ */
const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const PORT = parseInt(process.argv[2] || process.env.PORT || "8787", 10);

let backend = null;
let mockCfg = null;
let geminiLog = [];
let sheets = {};

function resetMockCfg() {
  mockCfg = { geminiStatus: 200, sheetFail: false, simHtml: null, chatReply: null };
}

function fakeSimHtml() {
  return "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Sim</title><style>body{font-family:sans-serif}</style></head><body>" +
    "<h1 id=\"t\">Simulasi Uji</h1><button id=\"go\">Mulai Simulasi</button><canvas id=\"c\" width=\"300\" height=\"120\"></canvas>" +
    "<script>const c=document.getElementById('c').getContext('2d');function draw(x){c.clearRect(0,0,300,120);c.fillRect(x,50,20,20);}" +
    "let x=0;document.getElementById('go').addEventListener('click',function(){function f(){x=(x+2)%280;draw(x);requestAnimationFrame(f);}f();});draw(0);</script>" +
    "</body></html>";
}

function fakeGemini(url, options) {
  const payload = JSON.parse(options.payload);
  const sys = (payload.system_instruction && payload.system_instruction.parts[0].text) || "";
  const userText = payload.contents[payload.contents.length - 1].parts[0].text || "";
  geminiLog.push({ url: url.replace(/key=[^&]+/, "key=REDACTED"), system: sys, user: userText, payload: payload });
  if (mockCfg.geminiStatus !== 200) {
    const st = mockCfg.geminiStatus;
    return { getResponseCode: () => st, getContentText: () => JSON.stringify({ error: { message: st === 503 ? "The model is overloaded (high demand)" : "API key not valid" } }) };
  }
  let text;
  const gen = payload.generationConfig || {};
  if (gen.responseMimeType === "application/json" && /soal|questions|question/i.test(userText)) {
    text = JSON.stringify([
      { type: "mcq", question: "Soal uji $F=BIL$?", options: ["a", "b", "c", "d"], correct: 1, modelAnswer: "b benar" },
      { type: "short", question: "Sebutkan satuan B", modelAnswer: "tesla" }
    ]);
  } else if (gen.responseMimeType === "application/json") {
    text = JSON.stringify({ flagged: false, feedback: "Data terlihat wajar (uji)." });
  } else if (/asisten pembuat simulasi/.test(sys)) {
    text = mockCfg.simHtml || fakeSimHtml();
  } else {
    // chat: balasan menyertakan tingkat siswa yang terbaca di system prompt supaya
    // tes bisa memastikan diferensiasi benar-benar sampai ke tutor.
    const m = sys.match(/(?:TINGKAT SISWA|STUDENT LEVEL):\s*(\w+)/);
    text = mockCfg.chatReply || ("Balasan tutor uji" + (m ? " [" + m[1].toLowerCase() + "]" : "") + " untuk: " + userText.slice(0, 40));
  }
  return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ candidates: [{ content: { parts: [{ text }] }, finishReason: "STOP" }] }) };
}

function buildBackend() {
  const store = {};
  const ctx = {
    console,
    Date, Math, JSON, parseInt, parseFloat, isNaN, String, Number, Array, Object, RegExp, encodeURIComponent, Buffer,
    PropertiesService: { getScriptProperties: () => ({
      getProperty: k => (k in store ? store[k] : null),
      setProperty: (k, v) => { store[k] = String(v); },
      deleteProperty: k => { delete store[k]; },
      getProperties: () => Object.assign({}, store)
    }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: {
      sleep() {},
      getUuid: () => "xxxxxxxx-" + Math.random().toString(16).slice(2, 10),
      newBlob: s => ({ getBytes: () => Buffer.from(String(s)) }),
      base64EncodeWebSafe: bytes => Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_")
    },
    ContentService: {
      MimeType: { JSON: "json", TEXT: "text" },
      createTextOutput: text => ({ text, setMimeType() { return this; } })
    },
    UrlFetchApp: { fetch: fakeGemini },
    SpreadsheetApp: { openById: () => {
      if (mockCfg.sheetFail) throw new Error("Tidak ada izin ke spreadsheet (uji)");
      return {
        getSheetByName: n => sheets[n] || null,
        insertSheet: n => (sheets[n] = makeSheet(n))
      };
    } }
  };
  function makeSheet(name) {
    const s = { name, cells: {}, header: null, rows: [] };
    s.clearContents = () => { s.header = null; s.rows = []; };
    s.getRange = (r, c, nr, nc) => ({ setValues: v => { if (r === 1) s.header = v[0]; else s.rows = v; } });
    s.autoResizeColumns = () => {};
    return s;
  }
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "apps-script/Code.gs"), "utf8"), ctx, { filename: "Code.gs" });
  return ctx;
}

function resetAll() {
  resetMockCfg();
  geminiLog = [];
  sheets = {};
  backend = buildBackend();
}
resetAll();

const MIME = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".md": "text/plain" };

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const readBody = cb => { let b = ""; req.on("data", d => (b += d)); req.on("end", () => cb(b)); };

  if (req.method === "POST" && url.pathname === "/exec") {
    return readBody(body => {
      const out = backend.doPost({ postData: { contents: body } });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(out.text);
    });
  }
  if (req.method === "POST" && url.pathname === "/__reset") { resetAll(); res.end("ok"); return; }
  if (req.method === "POST" && url.pathname === "/__mock") {
    return readBody(b => { Object.assign(mockCfg, JSON.parse(b || "{}")); res.end("ok"); });
  }
  if (req.method === "GET" && url.pathname === "/__state") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ sheets, geminiLog }));
    return;
  }
  let p = decodeURIComponent(url.pathname);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log("mock backend + static site on http://localhost:" + PORT));

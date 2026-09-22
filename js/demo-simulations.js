/* ============================================================
   demo-simulations.js
   Simulasi HTML yang sudah jadi (hand-built, bukan hasil AI):
   1. INCLINE_TROLLEY_SIM  -> dipakai di tab "Eksperimen" topik Kinematics
   2. DEMO_SIMS            -> fallback "Mode Demo" pada tab Lab Simulasi
                              Virtual, dipakai ketika backend AI belum
                              dikonfigurasi (lihat js/config.js).
   Semua string di sini adalah dokumen HTML LENGKAP dan mandiri
   (self-contained), dirender lewat iframe.srcdoc / sandbox iframe.
   ============================================================ */

const INCLINE_TROLLEY_SIM = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Simulasi Troli pada Bidang Miring</title>
<style>
  body { margin:0; font-family: system-ui, sans-serif; background:#0b1120; color:#e2e8f0; padding:14px; }
  h2 { margin:0 0 10px; font-size:1.05rem; }
  .row { display:flex; gap:18px; flex-wrap:wrap; }
  .controls { flex:1; min-width:220px; }
  .controls label { display:block; font-size:0.82rem; margin:10px 0 2px; color:#94a3b8; }
  .controls input[type=range] { width:100%; }
  .readout { font-size:0.85rem; margin-top:10px; line-height:1.7; background:#1e293b; padding:10px 12px; border-radius:8px; }
  .readout b { color:#38bdf8; }
  canvas { background:#111827; border-radius:8px; }
  .btns { margin-top:10px; }
  button { background:#38bdf8; border:none; color:#041322; font-weight:600; padding:8px 14px; border-radius:6px; cursor:pointer; margin-right:8px; }
  button.secondary { background:#334155; color:#e2e8f0; }
</style>
</head>
<body>
  <h2>Troli pada Bidang Miring</h2>
  <div class="row">
    <div class="controls">
      <label>Sudut kemiringan θ = <span id="thetaVal"></span>°</label>
      <input type="range" id="theta" min="0" max="40" value="20" step="1">

      <label>Koefisien gesekan μ = <span id="muVal"></span></label>
      <input type="range" id="mu" min="0" max="0.5" value="0.1" step="0.01">

      <label>Massa troli m = <span id="massVal"></span> kg</label>
      <input type="range" id="mass" min="0.1" max="2" value="1" step="0.1">

      <div class="btns">
        <button id="startBtn">▶ Mulai</button>
        <button class="secondary" id="resetBtn">⟲ Reset</button>
      </div>

      <div class="readout" id="readout"></div>
    </div>
    <div>
      <canvas id="scene" width="360" height="220"></canvas><br><br>
      <canvas id="graph" width="360" height="160"></canvas>
    </div>
  </div>

<script>
const g = 9.81; // m s^-2, sesuai data sheet Cambridge
const thetaSlider = document.getElementById('theta');
const muSlider = document.getElementById('mu');
const massSlider = document.getElementById('mass');
const scene = document.getElementById('scene').getContext('2d');
const graph = document.getElementById('graph').getContext('2d');
let running = false, startTime = null, animId = null;
let vtData = []; // {t, v}

function computeAccel() {
  const theta = thetaSlider.value * Math.PI / 180;
  const mu = parseFloat(muSlider.value);
  const a = g * (Math.sin(theta) - mu * Math.cos(theta));
  return Math.max(a, 0); // jika negatif, troli tidak bergerak (gesekan > komponen gravitasi)
}

function updateReadout() {
  const theta = parseFloat(thetaSlider.value);
  const mu = parseFloat(muSlider.value);
  const m = parseFloat(massSlider.value);
  document.getElementById('thetaVal').textContent = theta.toFixed(0);
  document.getElementById('muVal').textContent = mu.toFixed(2);
  document.getElementById('massVal').textContent = m.toFixed(1);

  const a = computeAccel();
  const thetaRad = theta * Math.PI / 180;
  const Fgrav = m * g * Math.sin(thetaRad);
  const Ffric = m * g * mu * Math.cos(thetaRad);
  const Fnet = Fgrav - Ffric;

  document.getElementById('readout').innerHTML =
    'a = g(sinθ − μcosθ) = <b>' + a.toFixed(2) + ' m/s²</b><br>' +
    'Gaya komponen gravitasi (mg·sinθ) = ' + Fgrav.toFixed(2) + ' N<br>' +
    'Gaya gesek (μ·mg·cosθ) = ' + Ffric.toFixed(2) + ' N<br>' +
    'Gaya neto sepanjang bidang = ' + Fnet.toFixed(2) + ' N' +
    (a === 0 ? '<br><span style="color:#f59e0b">Troli tidak bergerak: gaya gesek lebih besar dari komponen gravitasi.</span>' : '');
}

function drawScene(progress) {
  scene.clearRect(0,0,360,220);
  const theta = thetaSlider.value * Math.PI/180;
  // gambar bidang miring
  const baseX = 30, baseY = 190, len = 300;
  const topX = baseX + len*Math.cos(theta), topY = baseY - len*Math.sin(theta);
  scene.strokeStyle = '#475569'; scene.lineWidth = 4;
  scene.beginPath(); scene.moveTo(baseX, baseY); scene.lineTo(topX, topY); scene.lineTo(baseX, topY); scene.closePath(); scene.stroke();
  // troli (kotak kecil) posisi sepanjang bidang, progress 0 (atas) -> 1 (bawah)
  const tx = topX + (baseX - topX) * progress;
  const ty = topY + (baseY - topY) * progress;
  scene.fillStyle = '#38bdf8';
  scene.save();
  scene.translate(tx, ty);
  scene.rotate(-theta);
  scene.fillRect(-10, -20, 20, 14);
  scene.restore();
}

function drawGraph() {
  graph.clearRect(0,0,360,160);
  graph.strokeStyle = '#334155'; graph.strokeRect(30,10,320,120);
  graph.fillStyle = '#94a3b8'; graph.font = '10px sans-serif';
  graph.fillText('v (m/s)', 2, 15);
  graph.fillText('t (s)', 340, 145);
  if (vtData.length < 2) return;
  const maxT = Math.max(...vtData.map(p=>p.t), 1);
  const maxV = Math.max(...vtData.map(p=>p.v), 1);
  graph.strokeStyle = '#38bdf8'; graph.lineWidth = 2; graph.beginPath();
  vtData.forEach((p,i) => {
    const x = 30 + (p.t/maxT)*320;
    const y = 130 - (p.v/maxV)*120;
    if (i===0) graph.moveTo(x,y); else graph.lineTo(x,y);
  });
  graph.stroke();
}

function tick(ts) {
  if (!startTime) startTime = ts;
  const t = (ts - startTime) / 1000;
  const a = computeAccel();
  const v = a * t;
  const inclineLen = 300 / Math.max(0.001, Math.cos(0)); // panjang lintasan efektif (arbitrary units, untuk visual)
  const distTravelled = 0.5 * a * t * t;
  const progress = Math.min(distTravelled / 3, 1); // skala visual: 3 "meter" = panjang bidang

  drawScene(progress);
  vtData.push({t, v});
  drawGraph();

  if (progress < 1 && a > 0) {
    animId = requestAnimationFrame(tick);
  } else {
    running = false;
  }
}

document.getElementById('startBtn').addEventListener('click', () => {
  if (running) return;
  running = true; startTime = null; vtData = [];
  animId = requestAnimationFrame(tick);
});
document.getElementById('resetBtn').addEventListener('click', () => {
  running = false; if (animId) cancelAnimationFrame(animId);
  startTime = null; vtData = [];
  drawScene(0); drawGraph();
});
[thetaSlider, muSlider, massSlider].forEach(s => s.addEventListener('input', () => {
  updateReadout();
  if (!running) drawScene(0);
}));

updateReadout();
drawScene(0);
drawGraph();
</script>
</body>
</html>`;

/* --- Fallback demo untuk tab Lab Simulasi Virtual (Mode Demo, tanpa backend) --- */
const DEMO_SIMS = {
  freeFall: {
    label: "Demo: Gerak Jatuh Bebas",
    match: ["jatuh bebas", "free fall"],
    html: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Demo Jatuh Bebas</title>
    <style>body{margin:0;font-family:system-ui,sans-serif;background:#0b1120;color:#e2e8f0;padding:14px}
    input[type=range]{width:100%} .box{background:#1e293b;padding:10px;border-radius:8px;margin-top:10px;font-size:0.85rem}
    canvas{background:#111827;border-radius:8px}</style></head><body>
    <h3>Demo: Gerak Jatuh Bebas (Mode Demo)</h3>
    <label>Ketinggian h = <span id="hv">20</span> m</label>
    <input type="range" id="h" min="5" max="80" value="20">
    <canvas id="c" width="300" height="260"></canvas>
    <div class="box" id="out"></div>
    <script>
      const g=9.81; const h=document.getElementById('h'); const hv=document.getElementById('hv');
      const ctx=document.getElementById('c').getContext('2d'); let t0=null, raf;
      function T(){ return Math.sqrt(2*parseFloat(h.value)/g); }
      function draw(prog){
        ctx.clearRect(0,0,300,260);
        ctx.strokeStyle='#475569'; ctx.strokeRect(20,20,10,220);
        const y = 20 + prog*200;
        ctx.fillStyle='#38bdf8'; ctx.beginPath(); ctx.arc(25,y,10,0,7); ctx.fill();
        const v = g * T() * prog;
        document.getElementById('out').innerHTML = 't = '+(T()*prog).toFixed(2)+' s &nbsp; v = '+v.toFixed(2)+' m/s &nbsp; (waktu total jatuh = '+T().toFixed(2)+' s)';
      }
      function tick(ts){ if(!t0) t0=ts; const t=(ts-t0)/1000; const prog=Math.min(t/T(),1); draw(prog); if(prog<1) raf=requestAnimationFrame(tick); }
      h.addEventListener('input', ()=>{ hv.textContent=h.value; cancelAnimationFrame(raf); t0=null; draw(0); });
      document.body.insertAdjacentHTML('beforeend','<button id="go" style="margin-top:8px;padding:6px 14px;">Jatuhkan</button>');
      document.getElementById('go').addEventListener('click', ()=>{ t0=null; cancelAnimationFrame(raf); raf=requestAnimationFrame(tick); });
      draw(0);
    </script></body></html>`
  },
  projectile: {
    label: "Demo: Gerak Parabola",
    match: ["parabola", "projectile", "peluru"],
    html: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Demo Parabola</title>
    <style>body{margin:0;font-family:system-ui,sans-serif;background:#0b1120;color:#e2e8f0;padding:14px}
    input[type=range]{width:100%} .box{background:#1e293b;padding:10px;border-radius:8px;margin-top:10px;font-size:0.85rem}
    canvas{background:#111827;border-radius:8px}</style></head><body>
    <h3>Demo: Gerak Parabola (Mode Demo)</h3>
    <label>Kecepatan awal u = <span id="uv">20</span> m/s</label>
    <input type="range" id="u" min="5" max="40" value="20">
    <label>Sudut elevasi θ = <span id="tv">45</span>°</label>
    <input type="range" id="theta" min="10" max="80" value="45">
    <canvas id="c" width="360" height="220"></canvas>
    <div class="box" id="out"></div>
    <script>
      const g=9.81; const u=document.getElementById('u'), th=document.getElementById('theta');
      const ctx=document.getElementById('c').getContext('2d'); let t0,raf;
      function params(){ const U=parseFloat(u.value), T=parseFloat(th.value)*Math.PI/180;
        const range=(U*U*Math.sin(2*T))/g, tmax=(2*U*Math.sin(T))/g, hmax=(U*Math.sin(T))**2/(2*g);
        return {U,T,range,tmax,hmax}; }
      function draw(t){
        const p=params(); ctx.clearRect(0,0,360,220);
        ctx.strokeStyle='#334155'; ctx.beginPath(); ctx.moveTo(20,200); ctx.lineTo(350,200); ctx.stroke();
        const scale = 300/Math.max(p.range,1);
        ctx.strokeStyle='#38bdf8'; ctx.beginPath();
        for(let tt=0; tt<=p.tmax; tt+=p.tmax/60){
          const x=20+p.U*Math.cos(p.T)*tt*scale;
          const y=200-(p.U*Math.sin(p.T)*tt - 0.5*g*tt*tt)*scale;
          if(tt===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
        const ct = Math.min(t, p.tmax);
        const cx=20+p.U*Math.cos(p.T)*ct*scale, cy=200-(p.U*Math.sin(p.T)*ct-0.5*g*ct*ct)*scale;
        ctx.fillStyle='#f59e0b'; ctx.beginPath(); ctx.arc(cx,cy,6,0,7); ctx.fill();
        document.getElementById('out').innerHTML = 'Jangkauan R = '+p.range.toFixed(1)+' m &nbsp; Tinggi maks = '+p.hmax.toFixed(1)+' m &nbsp; Waktu di udara = '+p.tmax.toFixed(2)+' s';
      }
      function tick(ts){ if(!t0) t0=ts; const t=(ts-t0)/1000; draw(t); const p=params(); if(t<p.tmax) raf=requestAnimationFrame(tick); }
      [u,th].forEach(s=>s.addEventListener('input', ()=>{ document.getElementById('uv').textContent=u.value; document.getElementById('tv').textContent=th.value; cancelAnimationFrame(raf); t0=null; draw(0); }));
      document.body.insertAdjacentHTML('beforeend','<button id="go" style="margin-top:8px;padding:6px 14px;">Tembakkan</button>');
      document.getElementById('go').addEventListener('click', ()=>{ t0=null; cancelAnimationFrame(raf); raf=requestAnimationFrame(tick); });
      draw(0);
    </script></body></html>`
  }
};

function getDemoSimHTML(promptText) {
  const lower = (promptText || "").toLowerCase();
  for (const key in DEMO_SIMS) {
    const sim = DEMO_SIMS[key];
    if (sim.match.some(kw => lower.includes(kw))) return sim.html;
  }
  // default fallback
  return DEMO_SIMS.freeFall.html;
}

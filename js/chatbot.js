/* ============================================================
   chatbot.js
   Tutor Fisika: diskusi konsep gaya Socratic.
   ------------------------------------------------------------
   Kalau siswa sudah memasukkan API key Gemini pribadinya (sama
   seperti yang dipakai tab Lab Simulasi Virtual) DAN backend
   sudah dikonfigurasi: setiap pesan dikirim ke tutor AI lewat
   backend yang sama (mode "chat"), lengkap dengan riwayat obrolan
   supaya tutor benar-benar menanggapi & mengevaluasi jawaban
   siswa, bukan cuma melanjutkan skrip tetap. Bahan dari
   js/chatbot-data.js dikirim sebagai acuan supaya jawaban AI
   tetap konsisten dengan materi yang sudah ada di situs.

   Kalau API key/backend belum ada: dipakai skrip tanya-jawab
   lokal berbasis pencocokan kata kunci sederhana (dari
   js/chatbot-data.js) sebagai cadangan, supaya tutor tetap bisa
   dipakai.
   ============================================================ */

window.Chatbot = (function () {
  let topicId = null;
  let pendingConcept = null; // dipakai skrip lokal (fallback)
  let history = []; // riwayat obrolan giliran-AI: [{role:"user"|"model", text}]
  let initialized = false;
  let nudgedForKey = false; // supaya ajakan isi API key cuma muncul sekali
  let sending = false;

  function currentKB() {
    return (topicId && CHATBOT_KB[topicId]) ? CHATBOT_KB[topicId] : CHATBOT_KB.general;
  }

  function currentTopicTitle() {
    const topic = (typeof TOPICS !== "undefined" ? TOPICS : []).find(tp => tp.id === topicId);
    return topic ? trContent(topic.title) : t("chatbot.generaltopic");
  }

  function buildKbContext(kb) {
    if (!kb || !Array.isArray(kb.concepts)) return "";
    return kb.concepts.map(c => "- " + c.explain).join("\n");
  }

  function normalize(text) {
    return (text || "").toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, " ");
  }

  // Cocokkan pesan siswa ke concept dengan skor keyword terbanyak yang cocok
  // (substring sederhana, bukan NLP). Mengembalikan concept terbaik atau null.
  // Dipakai HANYA di jalur fallback lokal (tanpa API key).
  function matchConcept(message) {
    const text = normalize(message);
    const kb = currentKB();
    let best = null;
    let bestScore = 0;
    kb.concepts.forEach(c => {
      let score = 0;
      c.keywords.forEach(kw => {
        if (text.includes(normalize(kw))) score += normalize(kw).split(" ").length; // frasa lebih panjang -> skor lebih tinggi
      });
      if (score > bestScore) { bestScore = score; best = c; }
    });
    return bestScore > 0 ? best : null;
  }

  function appendMessage(role, html) {
    const wrap = document.getElementById("chatbot-messages");
    const msg = document.createElement("div");
    msg.className = "chatbot-msg " + (role === "bot" ? "bot" : "user");
    msg.innerHTML = html;
    wrap.appendChild(msg);
    wrap.scrollTop = wrap.scrollHeight;
    if (role === "bot" && window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([msg]);
    }
    return msg;
  }

  function setSending(state) {
    sending = state;
    const input = document.getElementById("chatbot-input");
    const btn = document.querySelector("#chatbot-form button[type=submit]");
    if (input) input.disabled = state;
    if (btn) btn.disabled = state;
  }

  async function handleUserMessage(text) {
    text = (text || "").trim();
    if (!text || sending) return;
    appendMessage("user", escapeHTML(text));

    const apiKey = (typeof getGeminiApiKey === "function") ? getGeminiApiKey() : "";
    const backendUrl = (typeof getBackendUrl === "function") ? getBackendUrl() : "";

    if (apiKey && backendUrl) {
      await askTutor(text, backendUrl, apiKey);
    } else {
      if (!nudgedForKey) {
        nudgedForKey = true;
        appendMessage("bot", t("chatbot.nudgeforkey"));
      }
      handleLocalFallback(text);
    }
  }

  async function askTutor(message, backendUrl, apiKey) {
    setSending(true);
    const typingEl = appendMessage("bot", "<em>" + t("chatbot.typing") + "</em>");
    try {
      const resp = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          mode: "chat",
          apiKey: apiKey,
          lang: (typeof getLang === "function") ? getLang() : "id",
          topic: currentTopicTitle(),
          kbContext: buildKbContext(currentKB()),
          history: history,
          message: message
        })
      });
      const data = await resp.json();
      typingEl.remove();
      if (data.error) {
        appendMessage("bot", escapeHTML(data.error));
        return;
      }
      const reply = (data.reply || "").trim();
      if (!reply) {
        appendMessage("bot", t("chatbot.emptyreply"));
        return;
      }
      appendMessage("bot", escapeHTML(reply).replace(/\n/g, "<br>"));
      history.push({ role: "user", text: message });
      history.push({ role: "model", text: reply });
      if (history.length > 24) history = history.slice(-24);
    } catch (err) {
      typingEl.remove();
      appendMessage("bot", t("chatbot.connectionerror", { err: escapeHTML(err.message) }));
    } finally {
      setSending(false);
    }
  }

  // ---- Jalur cadangan (tanpa API key): skrip Socratic 2-giliran lokal ----
  function handleLocalFallback(text) {
    const matched = matchConcept(text);

    if (matched && (!pendingConcept || pendingConcept.id !== matched.id)) {
      // Konsep baru terdeteksi -> tanya balik dulu (gaya Socratic).
      pendingConcept = matched;
      appendMessage("bot", escapeHTML(matched.ask));
      return;
    }

    if (pendingConcept) {
      // Siswa sudah membalas pertanyaan balik -> ungkap penjelasan + lanjutan.
      appendMessage("bot", escapeHTML(pendingConcept.explain) + "<br><br><em>" + escapeHTML(pendingConcept.followUp) + "</em>");
      pendingConcept = null;
      return;
    }

    // Tidak ada konsep yang cocok sama sekali.
    appendMessage("bot", t("chatbot.fallback.nomatch"));
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    init() {
      if (initialized) return;
      initialized = true;
      document.getElementById("chatbot-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("chatbot-input");
        const text = input.value;
        input.value = "";
        handleUserMessage(text);
      });
    },

    setTopic(id) {
      topicId = id;
      pendingConcept = null;
      history = [];
      const label = document.getElementById("chatbot-topic-label");
      const kb = currentKB();
      const topic = (typeof TOPICS !== "undefined" ? TOPICS : []).find(tp => tp.id === id);
      label.textContent = (topic && CHATBOT_KB[id])
        ? t("chatbot.topiclabel.context", { title: trContent(topic.title) })
        : t("chatbot.topiclabel.nocontext");
      // Kalau panel sedang terbuka, mulai percakapan baru untuk topik ini.
      if (!document.getElementById("chatbot-panel").hidden) {
        document.getElementById("chatbot-messages").innerHTML = "";
        appendMessage("bot", escapeHTML(trContent(kb.greeting)));
      }
    },

    onOpen() {
      const wrap = document.getElementById("chatbot-messages");
      if (wrap.children.length === 0) {
        appendMessage("bot", escapeHTML(trContent(currentKB().greeting)));
      }
    }
  };
})();

// ==============================
// ESTADO GLOBAL
// ==============================
let db = [];
let dias = [];
let dIndex = 0;
let fIndex = 0;

// ==============================
// CARREGAR BASE
// ==============================
async function loadDB() {
  try {
    const res = await fetch("data.json");
    db = await res.json();

    dias = [...new Set(db.map(item => item.d))].sort((a, b) => a - b);

    loadState();
    render();
  } catch (err) {
    console.error("Erro ao carregar base:", err);
  }
}

// ==============================
// UTIL
// ==============================
function getFrasesDoDia() {
  const diaAtual = dias[dIndex];
  return db.filter(item => item.d === diaAtual);
}

function clearFeedback() {
  document.getElementById("feedback").innerText = "";
}

// ==============================
// SAVE / LOAD
// ==============================
function saveState() {
  localStorage.setItem("echo_state", JSON.stringify({
    dIndex,
    fIndex
  }));
}

function loadState() {
  const s = localStorage.getItem("echo_state");
  if (s) {
    const parsed = JSON.parse(s);
    dIndex = parsed.dIndex ?? 0;
    fIndex = parsed.fIndex ?? 0;
  }
}

// ==============================
// RENDER
// ==============================
function render() {
  const frases = getFrasesDoDia();
  if (!frases.length) return;

  if (fIndex >= frases.length) fIndex = 0;

  const frase = frases[fIndex];

  document.getElementById("dayTitle").innerText = "Dia " + frase.d;
  document.getElementById("trad").innerText = frase.t;
  document.getElementById("simp").innerText = frase.p;
  document.getElementById("br").innerText = frase.br;
  document.getElementById("pt").innerText = frase.pt;

  clearFeedback(); // 🔥 limpa sempre ao renderizar
  saveState();
}

// ==============================
// NAVEGAÇÃO DIA
// ==============================
document.getElementById("prevDay").onclick = () => {
  if (dIndex > 0) {
    dIndex--;
    fIndex = 0;
    clearFeedback();
    render();
  }
};

document.getElementById("nextDay").onclick = () => {
  if (dIndex < dias.length - 1) {
    dIndex++;
    fIndex = 0;
    clearFeedback();
    render();
  }
};

// ==============================
// NAVEGAÇÃO FRASE
// ==============================
document.getElementById("prevPhrase").onclick = () => {
  if (fIndex > 0) {
    fIndex--;
    clearFeedback();
    render();
  }
};

document.getElementById("nextPhrase").onclick = () => {
  const frases = getFrasesDoDia();
  if (fIndex < frases.length - 1) {
    fIndex++;
    clearFeedback();
    render();
  }
};

// ==============================
// SPEAK (Mandarim Taiwan)
// ==============================
function speak(text) {
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-TW";
  utter.rate = 0.9;
  speechSynthesis.speak(utter);
}

document.getElementById("playBtn").onclick = () => {
  clearFeedback(); // 🔥 limpa antes de ouvir novamente
  const frases = getFrasesDoDia();
  speak(frases[fIndex].t);
};

// ==============================
// RECONHECIMENTO
// ==============================
let rec;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  rec = new SpeechRecognition();
  rec.lang = "zh-TW";
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  rec.onstart = () => {
    clearFeedback();
    document.getElementById("feedback").innerText = "🎤 Ouvindo...";
  };

  rec.onresult = (e) => {
    const spoken = e.results[0][0].transcript.trim();
    evaluate(spoken);
  };

  rec.onerror = () => {
    document.getElementById("feedback").innerText =
      "Erro no reconhecimento. Tente novamente.";
  };
}

document.getElementById("recBtn").onclick = () => {
  if (!rec) {
    alert("Reconhecimento de voz não suportado.");
    return;
  }

  clearFeedback(); // 🔥 limpa imediatamente ao apertar
  rec.start();
};

// ==============================
// SIMILARIDADE
// ==============================
function similarity(a, b) {
  a = a.replace(/\s/g, "");
  b = b.replace(/\s/g, "");

  let matches = 0;
  const len = Math.max(a.length, b.length);

  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) matches++;
  }

  return Math.round((matches / len) * 100);
}

// ==============================
// AVALIAÇÃO
// ==============================
function evaluate(spoken) {
  const frases = getFrasesDoDia();
  const expected = frases[fIndex].t;
  const score = similarity(spoken, expected);

  let msg = "";

  if (score === 100) msg = "🎉 Perfeito! 100% correto!";
  else if (score >= 80) msg = "👏 Muito bom! " + score + "%";
  else if (score >= 60) msg = "🙂 Quase lá! " + score + "%";
  else msg = "🔁 Tente novamente! " + score + "%";

  document.getElementById("feedback").innerText = msg;
}

// ==============================
loadDB();

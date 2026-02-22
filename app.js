// ==============================
// ESTADO GLOBAL
// ==============================
let db = [];
let dias = [];
let dIndex = 0;
let fIndex = 0;
let isFreeMode = true; // Inicia em modo livre (Dia 0)
let synthesisSupported = true;
let compatBannerDismissed = false;

// ==============================
// CARREGAR BASE
// ==============================
async function loadDB() {
  try {
    const res = await fetch("data.json");
    db = await res.json();

    dias = [...new Set(db.map(item => item.d))].sort((a, b) => a - b);

    loadState();
    renderPhrasesToSidebar();
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

function closeSidebar() {
  // Só fecha a sidebar em telas pequenas
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.remove("open");
  }
}

// ==============================
// RENDERIZAR FRASES DO DIA
// ==============================
function renderPhrasesToSidebar() {
  const phraseList = document.getElementById("phraseList");
  phraseList.innerHTML = "";

  if (isFreeMode) {
    document.getElementById("sidebarDay").innerText = "Modo Livre";
    return;
  }

  const diaAtual = dias[dIndex];
  document.getElementById("sidebarDay").innerText = "Dia " + diaAtual;

  const frases = db.filter(item => item.d === diaAtual);

  frases.forEach((frase, idx) => {
    const li = document.createElement("li");
    li.className = "sidebar-item";
    if (idx === fIndex) li.classList.add("active");
    li.innerText = frase.pt;

    li.onclick = () => {
      fIndex = idx;
      render();
      closeSidebar();
    };

    phraseList.appendChild(li);
  });
}

// ==============================
// RENDERIZAR TODAS AS FRASES COM FILTRO
// ==============================
function renderAllPhrasesInSidebar(searchTerm = "") {
  const allPhrasesList = document.getElementById("allPhrasesList");
  allPhrasesList.innerHTML = "";

  let filteredDB = db;
  
  // Filtrar por termo de pesquisa (case-insensitive)
  if (searchTerm.trim()) {
    const lowerSearch = searchTerm.toLowerCase();
    filteredDB = db.filter(item => 
      item.pt.toLowerCase().includes(lowerSearch) ||
      item.t.toLowerCase().includes(lowerSearch) ||
      item.p.toLowerCase().includes(lowerSearch)
    );
  }

  // Agrupar por dia para melhor visualização
  let currentDay = null;
  let dayLabel = null;

  filteredDB.forEach((frase) => {
    // Se mudou de dia, criar label
    if (frase.d !== currentDay) {
      currentDay = frase.d;
      dayLabel = document.createElement("li");
      dayLabel.className = "sidebar-day-separator";
      dayLabel.innerText = "Dia " + currentDay;
      allPhrasesList.appendChild(dayLabel);
    }

    const li = document.createElement("li");
    li.className = "sidebar-item";
    
    // Verifica se é a frase atual
    if (frase.d === dias[dIndex]) {
      const frasesDoDay = db.filter(item => item.d === frase.d);
      const fraseAtual = frasesDoDay[fIndex];
      if (fraseAtual && fraseAtual.t === frase.t) {
        li.classList.add("active");
      }
    }
    
    li.innerText = frase.pt;

    li.onclick = () => {
      // Sair do modo livre se estiver nele
      isFreeMode = false;
      
      // Encontrar o índice do dia
      const dayIndex = dias.indexOf(frase.d);
      if (dayIndex !== -1) {
        dIndex = dayIndex;
        // Encontrar a frase dentro do dia
        const frasesDoDay = db.filter(item => item.d === frase.d);
        fIndex = frasesDoDay.findIndex(f => f.t === frase.t);
        render();
        closeSidebar();
      }
    };

    allPhrasesList.appendChild(li);
  });
}

// ==============================
// SAVE / LOAD
// ==============================
function saveState() {
  localStorage.setItem("echo_state", JSON.stringify({
    dIndex,
    fIndex,
    isFreeMode
  }));
}

function loadState() {
  const s = localStorage.getItem("echo_state");
  if (s) {
    const parsed = JSON.parse(s);
    dIndex = parsed.dIndex ?? 0;
    fIndex = parsed.fIndex ?? 0;
    isFreeMode = parsed.isFreeMode ?? true;
  }
}

// ==============================
// RENDER
// ==============================
function render() {
  const freeModeInput = document.getElementById("free-mode-input");
  const card = document.getElementById("card");
  const prevDayBtn = document.getElementById("prevDay");
  const prevPhraseBtn = document.getElementById("prevPhrase");

  if (isFreeMode) {
    // Modo livre: mostrar caixa de texto, esconder card
    freeModeInput.style.display = "block";
    card.style.display = "none";
    document.getElementById("dayTitle").innerText = "Modo Livre";
    
    // Esconder botões de navegação para trás
    prevDayBtn.style.display = "none";
    prevPhraseBtn.style.display = "none";
    
    // Esconder botão Modo Livre no sidebar
    document.getElementById("free-mode-btn").style.display = "none";
    
    renderPhrasesToSidebar();
    renderAllPhrasesInSidebar(document.getElementById("searchBox").value);
    clearFeedback();
    saveState();
    return;
  }

  // Modo normal: esconder caixa de texto, mostrar card
  freeModeInput.style.display = "none";
  card.style.display = "block";
  
  // Mostrar botões de navegação para trás
  prevDayBtn.style.display = "inline-flex";
  prevPhraseBtn.style.display = "inline-flex";
  
  // Mostrar botão Modo Livre no sidebar
  document.getElementById("free-mode-btn").style.display = "block";

  const frases = getFrasesDoDia();
  if (!frases.length) return;

  if (fIndex >= frases.length) fIndex = 0;

  const frase = frases[fIndex];

  document.getElementById("dayTitle").innerText = "Dia " + frase.d;
  document.getElementById("trad").innerText = frase.t;
  document.getElementById("simp").innerText = frase.p;
  document.getElementById("br").innerText = frase.br;
  document.getElementById("pt").innerText = frase.pt;

  renderPhrasesToSidebar();
  renderAllPhrasesInSidebar(document.getElementById("searchBox").value);
  clearFeedback(); // 🔥 limpa sempre ao renderizar
  saveState();
}

// ==============================
// SEARCH BOX
// ==============================
document.getElementById("searchBox").addEventListener("input", (e) => {
  renderAllPhrasesInSidebar(e.target.value);
});

// ==============================
// MENU TOGGLE
// ==============================
document.getElementById("menuToggle").onclick = () => {
  document.getElementById("sidebar").classList.toggle("open");
};

// Fechar sidebar ao clicar fora (apenas em telas pequenas)
document.addEventListener("click", (e) => {
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");

  if (window.innerWidth <= 768) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains("open")) {
      closeSidebar();
    }
  }
});

// ==============================
// NAVEGAÇÃO DIA
// ==============================
document.getElementById("prevDay").onclick = () => {
  if (isFreeMode) return; // Não faz nada em modo livre
  
  if (dIndex > 0) {
    dIndex--;
    fIndex = 0;
    clearFeedback();
    render();
  } else if (dIndex === 0) {
    // Se está no dia 1, voltar para modo livre
    isFreeMode = true;
    fIndex = 0;
    clearFeedback();
    render();
  }
};

document.getElementById("nextDay").onclick = () => {
  if (isFreeMode) {
    // Sair do modo livre e ir para dia 1
    isFreeMode = false;
    dIndex = 0;
    fIndex = 0;
    clearFeedback();
    render();
    return;
  }
  
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
  if (isFreeMode) return; // Não faz nada em modo livre
  
  if (fIndex > 0) {
    fIndex--;
    clearFeedback();
    render();
  } else if (fIndex === 0) {
    // Se está na primeira frase
    if (dIndex === 0) {
      // Se está no dia 1, voltar para modo livre
      isFreeMode = true;
      clearFeedback();
      render();
    } else {
      // Se não está no dia 1, ir para o dia anterior na última frase
      dIndex--;
      const frases = db.filter(item => item.d === dias[dIndex]);
      fIndex = frases.length - 1;
      clearFeedback();
      render();
    }
  }
};

document.getElementById("nextPhrase").onclick = () => {
  if (isFreeMode) {
    // Sair do modo livre e ir para dia 1
    isFreeMode = false;
    dIndex = 0;
    fIndex = 0;
    clearFeedback();
    render();
    return;
  }
  
  const frases = getFrasesDoDia();
  if (fIndex < frases.length - 1) {
    fIndex++;
    clearFeedback();
    render();
  } else if (fIndex === frases.length - 1) {
    // Se está na última frase, ir para o próximo dia na primeira frase
    if (dIndex < dias.length - 1) {
      dIndex++;
      fIndex = 0;
      clearFeedback();
      render();
    }
  }
};

// ==============================
// SPEAK (Mandarim Taiwan)
// ==============================
function speak(text) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    synthesisSupported = false;
    document.getElementById("playBtn").disabled = true;
    console.warn("SpeechSynthesis API não suportada neste navegador.");
    document.getElementById("feedback").innerText = "🔊 API de síntese de voz (speechSynthesis) não disponível neste navegador. Use um navegador compatível.";
    updateCompatBanner();
    return;
  } else {
    synthesisSupported = true;
    document.getElementById("playBtn").disabled = false;
  }

  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-TW";
  const rateValue = parseFloat(document.getElementById("rate").value);
  utter.rate = rateValue;
  speechSynthesis.speak(utter);
}

document.getElementById("playBtn").onclick = () => {
  clearFeedback(); // 🔥 limpa antes de ouvir novamente
  
  if (isFreeMode) {
    const freeText = document.getElementById("free-mode-input").value.trim();
    if (!freeText) {
      document.getElementById("feedback").innerText = "✍️ Escreva algo em chinês!";
      return;
    }
    speak(freeText);
  } else {
    const frases = getFrasesDoDia();
    speak(frases[fIndex].t);
  }
};

// ==============================
// MODO LIVRE SIDEBAR BUTTON
// ==============================
document.getElementById("free-mode-btn").onclick = () => {
  isFreeMode = true;
  clearFeedback();
  render();
  closeSidebar();
};

// ==============================
// RECONHECIMENTO
// ==============================
let rec;
let recognitionSupported = true;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  rec = new SpeechRecognition();
  rec.lang = "zh-TW";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  document.getElementById("recBtn").disabled = false;

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

else {
  recognitionSupported = false;
  document.getElementById("recBtn").disabled = true;
  console.warn("SpeechRecognition API não suportada neste navegador.");
  document.getElementById("feedback").innerText = "Reconhecimento de voz não suportado neste navegador. Seu navegador não é compatível com a API SpeechRecognition.";
}

// Atualiza e controla o banner discreto de compatibilidade
function updateCompatBanner() {
  if (compatBannerDismissed) return;

  const banner = document.getElementById("compat-banner");
  const text = document.getElementById("compat-text");
  if (!banner || !text) return;

  const missing = [];
  if (!synthesisSupported && !("speechSynthesis" in window)) missing.push("síntese de voz");
  if (!recognitionSupported && !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) missing.push("reconhecimento de voz");

  if (missing.length === 0) {
    banner.style.display = "none";
    return;
  }

  const msg = "APIs ausentes: " + missing.join(" e ") + ". Use um navegador compatível (Chrome recomendado).";
  text.innerText = msg;
  banner.style.display = "flex";
}

// Fechar banner
const compatCloseBtn = document.getElementById("compat-close");
if (compatCloseBtn) {
  compatCloseBtn.addEventListener("click", () => {
    const banner = document.getElementById("compat-banner");
    if (banner) banner.style.display = "none";
    compatBannerDismissed = true;
  });
}

// Inicializar flags e banner ao carregar
window.addEventListener("load", () => {
  // Inicializa synthesisSupported com checagem imediata
  synthesisSupported = !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
  // recognitionSupported já definido mais acima, atualizar caso necessário
  recognitionSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  updateCompatBanner();
});

document.getElementById("recBtn").onclick = () => {
  if (isFreeMode) {
    document.getElementById("feedback").innerText = "🎓 Você esta em Modo livre. Escolha um Dia para iniciar!";
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

// ==============================
// RATE CONTROL
// ==============================
const rateInput = document.getElementById("rate");
const rateValue = document.getElementById("rate-value");

// Restaurar valor salvo ou usar padrão 1.0
const savedRate = localStorage.getItem("speechRate");
if (savedRate) {
  rateInput.value = savedRate;
  rateValue.innerText = parseFloat(savedRate).toFixed(1) + "x";
} else {
  rateValue.innerText = "1.0x";
}

rateInput.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value).toFixed(1);
  rateValue.innerText = value + "x";
  localStorage.setItem("speechRate", e.target.value);
});

// ==============================
// TRANSLATION API (Chrome Experimental)
// ==============================
const ptInput = document.getElementById("pt-mode-input");
const translateBtn = document.getElementById("translate-btn");
const translationContainer = document.getElementById("translation-container");
const freeInput = document.getElementById("free-mode-input");

// Verificar se a Translation API está disponível
async function checkTranslationAPI() {
  try {
    // Verificar a nova Translation API (chrome 135+)
    if (globalThis.ai && globalThis.ai.translator) {
      return true;
    }
    // Verificar a API anterior (Translation API)
    if (window.translation && typeof window.translation.canTranslate === "function") {
      return await window.translation.canTranslate({
        sourceLanguage: "pt",
        targetLanguage: "zh"
      });
    }
    console.warn("No available Translation API:");
    return false;
  } catch (e) {
    console.warn("Erro ao verificar Translation API:", e);
    return false;
  }
}

// Inicializar a Translation API
async function initTranslationAPI() {
  try {
    if (globalThis.ai && globalThis.ai.translator) {
      const translator = await globalThis.ai.translator.create({
        sourceLanguage: "pt",
        targetLanguage: "zh"
      });
      return translator;
    }
    // Fallback para a API anterior
    if (window.translation) {
      return window.translation;
    }
    return null;
  } catch (e) {
    console.warn("Erro ao inicializar Translation API:", e);
    return null;
  }
}

let translationAPI = null;

// Verificar e inicializar a API
checkTranslationAPI().then(hasAPI => {
  if (hasAPI) {
    translationContainer.style.display = "flex";
    initTranslationAPI().then(api => {
      translationAPI = api;
    }).catch(e => console.warn("Erro ao inicializar API:", e));
  }
});

// Handler do botão Traduzir
translateBtn.addEventListener("click", async () => {
  const ptText = ptInput.value.trim();
  if (!ptText) {
    alert("Por favor, escreva algo em português.");
    return;
  }

  if (!translationAPI) {
    alert("API de tradução não disponível no momento.");
    return;
  }

  translateBtn.disabled = true;
  translateBtn.innerText = "Traduzindo...";

  try {
    let translatedText;
    
    // Tentar com a nova API
    if (globalThis.ai && globalThis.ai.translator) {
      translatedText = await translationAPI.translate(ptText);
    } else if (translationAPI.translate) {
      // Fallback para a API anterior
      translatedText = await translationAPI.translate(ptText, {
        sourceLanguage: "pt",
        targetLanguage: "zh"
      });
    }

    if (translatedText) {
      freeInput.value = translatedText;
      ptInput.value = "";
    }
  } catch (e) {
    console.error("Erro ao traduzir:", e);
    alert("Erro ao traduzir. Tente novamente.");
  } finally {
    translateBtn.disabled = false;
    translateBtn.innerText = "Traduzir";
  }
});

// Permitir traduzir ao pressionar Enter na caixa de português
ptInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    translateBtn.click();
  }
});

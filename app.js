let data = [];
let index = 0;

// Carregar base de dados externa
fetch("data.json")
.then(res => res.json())
.then(json => {
    data = json;
    load();
})
.catch(err => {
    console.error("Erro ao carregar data.json:", err);
});

// Carregar palavra atual
function load() {
    if (!data.length) return;

    let item = data[index];

    document.getElementById("dayTitle").innerText = "Dia " + item.d;
    document.getElementById("chinese").innerText = item.t;
    document.getElementById("br").innerText = item.br;
    document.getElementById("pt").innerText = item.pt;
    document.getElementById("result").innerHTML = "";
}

// 🔊 Falar palavra (Mandarim Taiwan)
function speak() {
    if (!data.length) return;

    let utter = new SpeechSynthesisUtterance(data[index].t);
    utter.lang = "zh-TW";
    utter.rate = 0.9; // ligeiramente mais lento para treino
    speechSynthesis.speak(utter);
}

// 🎤 Reconhecimento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "zh-TW";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
        let spoken = event.results[0][0].transcript;
        let confidence = event.results[0][0].confidence || 0;

        evaluate(spoken, confidence);
    };

    recognition.onerror = function(event) {
        document.getElementById("result").innerHTML =
            "Erro no reconhecimento: " + event.error;
    };

} else {
    console.warn("SpeechRecognition não suportado neste navegador.");
}

// Iniciar escuta
function listen() {
    if (!recognition) {
        alert("Reconhecimento de voz não suportado neste navegador.");
        return;
    }

    recognition.start();
}

// 📊 Avaliar pronúncia
function evaluate(spokenText, confidence) {

    let spoken = normalize(spokenText);
    let expected = normalize(data[index].p);

    let scoreSimilarity = similarity(spoken, expected);
    let scoreConfidence = confidence * 100;

    // Combinação ponderada (70% similaridade + 30% confiança)
    let finalScore = Math.round(
        (scoreSimilarity * 0.7) + (scoreConfidence * 0.3)
    );

    let feedback = "";

    if (finalScore >= 95) feedback = "🟢 Excelente";
    else if (finalScore >= 85) feedback = "🟢 Muito boa";
    else if (finalScore >= 70) feedback = "🟡 Compreensível";
    else if (finalScore >= 50) feedback = "🟠 Ajuste a pronúncia";
    else feedback = "🔴 Tente novamente";

    document.getElementById("result").innerHTML =
        feedback + "<br>" +
        finalScore + "% de precisão";
}

// 🔤 Normalizar texto (remove espaços e acentos simples)
function normalize(text) {
    return text
        .toLowerCase()
        .replace(/\s/g, '')
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');
}

// 📐 Similaridade (Levenshtein)
function similarity(a, b) {
    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 100;
    return Math.round((1 - distance / maxLen) * 100);
}

function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// ⏭ Próxima palavra
function next() {
    if (!data.length) return;

    index = (index + 1) % data.length;
    load();
}

// 🔧 Registrar Service Worker (PWA)
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js")
        .catch(err => console.log("Erro SW:", err));
    });
}
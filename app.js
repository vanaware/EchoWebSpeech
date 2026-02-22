

let data = [];
let index = 0;

fetch("data.json")
.then(res => res.json())
.then(json => {
data = json;
load();
});

function load() {
let item = data[index];

document.getElementById("dayTitle").innerText = "Dia " + item.d;
document.getElementById("chinese").innerText = item.t;
document.getElementById("br").innerText = item.br;
document.getElementById("pt").innerText = item.pt;

if(document.getElementById("audioOnly").checked){
document.getElementById("chinese").style.display="none";
document.getElementById("br").style.display="none";
document.getElementById("pt").style.display="none";
}else{
document.getElementById("chinese").style.display="block";
document.getElementById("br").style.display="block";
document.getElementById("pt").style.display="block";
}
}

function speak(){
let utter = new SpeechSynthesisUtterance(data[index].t);
utter.lang = "zh-TW";
speechSynthesis.speak(utter);
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "zh-TW";

recognition.onresult = function(event){
let spoken = event.results[0][0].transcript.toLowerCase().replace(/\s/g,'');
let expected = data[index].p.replace(/\s/g,'').toLowerCase();

let score = similarity(spoken, expected);

let msg = "";
if(score >= 95) msg="🟢 Excelente";
else if(score >=85) msg="🟢 Muito boa";
else if(score >=70) msg="🟡 Compreensível";
else if(score >=50) msg="🟠 Ajuste a pronúncia";
else msg="🔴 Tente novamente";

document.getElementById("result").innerHTML =
msg + " - " + score + "%";
};

function listen(){
recognition.start();
}

function next(){
index = (index + 1) % data.length;
load();
}

function similarity(a,b){
const distance = levenshtein(a,b);
const maxLen = Math.max(a.length,b.length);
return ((1 - distance/maxLen)*100).toFixed(0);
}

function levenshtein(a,b){
const matrix=[];
for(let i=0;i<=b.length;i++) matrix[i]=[i];
for(let j=0;j<=a.length;j++) matrix[0][j]=j;

for(let i=1;i<=b.length;i++){
for(let j=1;j<=a.length;j++){
if(b[i-1]==a[j-1]) matrix[i][j]=matrix[i-1][j-1];
else matrix[i][j]=Math.min(
matrix[i-1][j-1]+1,
matrix[i][j-1]+1,
matrix[i-1][j]+1
);
}
}
return matrix[b.length][a.length];
}

if("serviceWorker" in navigator){
navigator.serviceWorker.register("sw.js");
}